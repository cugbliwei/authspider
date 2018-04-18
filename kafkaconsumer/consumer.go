package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/Shopify/sarama"
	"github.com/cugbliwei/authspider/config"
	ahttp "github.com/cugbliwei/authspider/http"
	"github.com/cugbliwei/authspider/sql"
	"github.com/cugbliwei/dlog"
)

func main() {
	var wg sync.WaitGroup
	for _, task := range config.Instance.KafkaTask {
		wg.Add(1)
		go Consumer(task.Topic, task.Partition, task.Interval, task.Times, task.Async, wg)
	}
	wg.Wait()
}

func Consumer(topic string, partition, interval, times int, async bool, wg sync.WaitGroup) {
	defer wg.Done()
	consumer, err := sarama.NewConsumer(strings.Split(config.Instance.Kafka, ","), nil)
	if err != nil {
		dlog.Error("failed to start consumer: %v", err)
		return
	}
	defer consumer.Close()

	pc, err := consumer.ConsumePartition(topic, int32(partition), sarama.OffsetNewest)
	if err != nil {
		dlog.Error("failed to start consumer for partition %d: %s", partition, err)
		return
	}
	defer pc.AsyncClose()

	for msg := range pc.Messages() {
		if !async {
			status := handleConsumer(string(msg.Value), topic, partition, times)
			if interval > 0 && status {
				time.Sleep(time.Millisecond * time.Duration(interval))
			}
		} else {
			go handleConsumer(string(msg.Value), topic, partition, times)
			if interval > 0 {
				time.Sleep(time.Millisecond * time.Duration(interval))
			}
		}
	}
}

func handleConsumer(value, topic string, partition, originTimes int) bool {
	var val map[string]string
	if err := json.Unmarshal([]byte(value), &val); err != nil {
		dlog.Error("json unmarshal error: %v", err)
		return false
	}

	timestamp, ok := val["timestamp"]
	tmpl, ok1 := val["tmpl"]
	link, ok2 := val["link"]
	target, ok3 := val["target"]
	times, ok4 := val["times"]
	ban, ok5 := val["ban"]
	priority, _ := val["priority"]
	if !ok || !ok1 || !ok2 || !ok3 || !ok4 || !ok5 {
		dlog.Error("task params error tmpl: %s, link: %s, target: %s, timestamp: %s, times: %s, ban: %s", tmpl, link, target, timestamp, times, ban)
		return false
	}

	ts, err := strconv.Atoi(timestamp)
	if err != nil {
		dlog.Error("convert timestamp to int error: %v", err)
		return false
	}

	tsi := time.Unix(int64(ts), 0)
	if priority != "true" && time.Now().Sub(tsi).Hours() > 1.0 {
		dlog.Warn("return because task time.Now().Sub(tsi).Hours() > 1.0")
		return false
	}

	result := false
	nowTimes, err := strconv.Atoi(times)
	if err != nil || nowTimes > originTimes {
		dlog.Warn("convert times to int error: %v", err)
	} else {
		client := ahttp.HttpJarClient(60)
		result = getNextUrl(client, link, config.Instance.ServiceNextUrl)
	}

	if !result {
		dlog.Info("task fail: %s", value)
		if nowTimes > originTimes {
			updateBanToCrawlingTable(tmpl, target)
		} else {
			updateTimesToCrawlingTable(nowTimes+1, tmpl, target)
		}
		//kafkaproducer.Producer(topic, "params", value, config.Instance.Kafka, partition)
	} else {
		dlog.Info("task success: %s", value)
		insertToCrawledTable(timestamp, tmpl, link, target, ban, nowTimes)
		deleteFromCrawlingTable(tmpl, target)
	}
	return true
}

func getNextUrl(client *http.Client, link, nextUrl string) bool {
	b := ahttp.HttpGet(client, link)
	var buf map[string]string
	if err := json.Unmarshal([]byte(b), &buf); err != nil {
		dlog.Error("json Unmarshal error: %v", err)
		return false
	}

	status, ok := buf["status"]
	if !ok || status == "fail" {
		return false
	}

	if status == "in_crawling" {
		return getNextUrl(client, nextUrl+buf["id"], nextUrl)
	} else if status == "finish_fetch_data" {
		return true
	}
	return false
}

func insertToCrawledTable(timestamp, tmpl, link, target, ban string, times int) int64 {
	ts, err := strconv.Atoi(timestamp)
	if err != nil {
		ts = int(time.Now().Unix())
	}

	insertAuth := "insert ignore into crawled(timestamp, tmpl, link, target, times, ban) values(?,?,?,?,?,?)"
	params := []interface{}{}
	params = append(params, ts, tmpl, link, target, times, ban)
	return sql.HandleMysqlTable(insertAuth, params)
}

func deleteFromCrawlingTable(tmpl, target string) int64 {
	deleteTarget := "delete from crawling where tmpl = ? and target = ?"
	params := []interface{}{}
	params = append(params, tmpl, target)
	return sql.HandleMysqlTable(deleteTarget, params)
}

func updateBanToCrawlingTable(tmpl, target string) int64 {
	deleteTarget := "update crawling set ban = ? where tmpl = ? and target = ?"
	params := []interface{}{}
	params = append(params, "true", tmpl, target)
	return sql.HandleMysqlTable(deleteTarget, params)
}

func updateTimesToCrawlingTable(times int, tmpl, target string) int64 {
	deleteTarget := "update crawling set times = ? where tmpl = ? and target = ?"
	params := []interface{}{}
	params = append(params, times, tmpl, target)
	return sql.HandleMysqlTable(deleteTarget, params)
}
