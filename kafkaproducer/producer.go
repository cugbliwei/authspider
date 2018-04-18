package kafkaproducer

import (
	"strings"

	"github.com/Shopify/sarama"
	"github.com/cugbliwei/dlog"
)

func Producer(topic, key, value, host string, partition int) {
	config := sarama.NewConfig()
	config.Producer.RequiredAcks = sarama.WaitForAll
	config.Producer.Partitioner = sarama.NewRandomPartitioner

	msg := &sarama.ProducerMessage{}
	msg.Topic = topic
	msg.Partition = int32(partition)
	msg.Key = sarama.StringEncoder(key)
	msg.Value = sarama.StringEncoder(value)

	producer, err := sarama.NewSyncProducer(strings.Split(host, ","), config)
	if err != nil {
		dlog.Error("failed to new producer: %v", err)
		return
	}
	defer producer.Close()

	if _, _, err = producer.SendMessage(msg); err != nil {
		dlog.Error("failed to produce message: %v", err)
		return
	}
	dlog.Info("success produce messge topic: %s, value: %s", topic, value)
}
