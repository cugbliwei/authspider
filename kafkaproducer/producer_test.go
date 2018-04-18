package kafkaproducer

import (
	"testing"
	"time"
)

func TestProducer(t *testing.T) {
	for i := 0; i < 100; i++ {
		time.Sleep(time.Second)
	}
}
