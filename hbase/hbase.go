package hbase

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"sync"
	"time"

	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/authspider/http"
	"github.com/cugbliwei/dlog"
)

type HbaseEvents struct {
	events []map[string]string
	lock   *sync.Mutex
	timer  *time.Ticker
}

var Hbase *HbaseEvents

func init() {
	Hbase = NewHbase()
}

func NewHbase() *HbaseEvents {
	ret := &HbaseEvents{
		lock:  &sync.Mutex{},
		timer: time.NewTicker(time.Second * time.Duration(10)),
	}

	if !config.Instance.OnLine {
		return ret
	}

	go func() {
		for _ = range ret.timer.C {
			ret.SendAll()
		}
	}()

	return ret
}

func (self *HbaseEvents) Send(target, rowkey, value string) {
	self.lock.Lock()
	defer self.lock.Unlock()

	if len(target) == 0 || len(rowkey) == 0 || len(value) == 0 {
		dlog.Warn("send to hbase param is empty")
		return
	}

	event := make(map[string]string, 5)
	if target == "base" {
		event["table"] = config.Instance.Hbase.Base.Table
		event["family"] = config.Instance.Hbase.Base.Family
		event["column"] = config.Instance.Hbase.Base.Column
	} else if target == "cache" {
		event["table"] = config.Instance.Hbase.Cache.Table
		event["family"] = config.Instance.Hbase.Cache.Family
		event["column"] = config.Instance.Hbase.Cache.Column
	} else {
		return
	}

	event["rowkey"] = rowkey
	event["value"] = value
	self.events = append(self.events, event)
}

func (self *HbaseEvents) SendAll() {
	if len(self.events) == 0 {
		return
	}

	events := self.copyEvents()
	buf, err := json.Marshal(events)
	if err != nil {
		dlog.Error("hbase events json marshal error: %v", err)
		return
	}

	params := make(map[string]string, 1)
	params["batch"] = string(buf)

	client := http.HttpClient(60)
	for i := 0; i < 5; i++ {
		body := http.HttpPost(client, config.Instance.HbaseAddr+"/hbase/puts", params)
		if string(body) == "true" {
			dlog.Warn("Send to hbase success.")
			break
		} else {
			time.Sleep(time.Duration(10) * time.Second)
			continue
		}
	}
}

func (self *HbaseEvents) copyEvents() []map[string]string {
	self.lock.Lock()
	defer self.lock.Unlock()

	tmp := self.events
	self.events = []map[string]string{}
	return tmp
}

func SyncSend(target, rowkey, value string) bool {
	params := make(map[string]string, 5)
	if target == "base" {
		params["table"] = config.Instance.Hbase.Base.Table
		params["family"] = config.Instance.Hbase.Base.Family
		params["column"] = config.Instance.Hbase.Base.Column
	} else if target == "cache" {
		params["table"] = config.Instance.Hbase.Cache.Table
		params["family"] = config.Instance.Hbase.Cache.Family
		params["column"] = config.Instance.Hbase.Cache.Column
	} else {
		dlog.Warn("SyncSend with wrong target: %v", target)
		return false
	}
	params["rowkey"] = rowkey
	params["value"] = value

	flag := false
	client := http.HttpClient(60)
	for i := 0; i < 5; i++ {
		body := http.HttpPost(client, config.Instance.HbaseAddr+"/hbase/put", params)
		if string(body) == "true" {
			flag = true
			break
		} else {
			time.Sleep(time.Duration(2) * time.Second)
			continue
		}
	}
	return flag
}

func SyncSendFile(rowkey, value string) bool {
	params := make(map[string]string, 5)
	params["table"] = config.Instance.Hbase.Base.Table
	params["rowkey"] = rowkey
	params["family"] = config.Instance.Hbase.Base.Family
	params["column"] = config.Instance.Hbase.Base.Column
	params["value"] = value
	f, err := ioutil.TempFile("./", rowkey)
	if err == nil {
		defer f.Close()
		data, err := json.Marshal(params)
		if err != nil {
			dlog.Error("hbase events json marshal error: %v", err)
		}
		f.Write(data)

		flag := false
		client := http.HttpClient(300)
		for i := 0; i < 5; i++ {
			body := http.HttpPostFile(client, config.Instance.HbaseAddr+"/hbase/putfile", f.Name())
			if string(body) == "true" {
				flag = true
				break
			} else {
				time.Sleep(time.Duration(2) * time.Second)
				continue
			}
		}
		os.Remove(f.Name())
		return flag
	} else {
		dlog.Error("hbase make tmp file error: %v", err)
		return false
	}
}

func SyncGet(rowkey string) (string, bool) {
	params := make(map[string]string, 4)
	params["table"] = config.Instance.Hbase.Base.Table
	params["rowkey"] = rowkey
	params["family"] = config.Instance.Hbase.Base.Family
	params["column"] = config.Instance.Hbase.Base.Column

	client := http.HttpClient(60)
	body := http.HttpPost(client, config.Instance.HbaseAddr+"/hbase/get", params)
	res := make(map[string]string, 3)
	if err := json.Unmarshal(body, &res); err != nil {
		return "", false
	}

	if status, ok := res["status"]; ok && status == "true" {
		data, ok := res["data"]
		if ok {
			return data, true
		}
	}
	return "", false
}
