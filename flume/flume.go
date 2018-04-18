package flume

import (
	"math/rand"
	"strconv"
	"sync"
	"time"

	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/dlog"
)

type FlumeEvents struct {
	events []*ThriftFlumeEvent
	lock   *sync.Mutex
	timer  *time.Ticker
}

var Flume *FlumeEvents

func init() {
	Flume = NewFlume()
}

func NewFlume() *FlumeEvents {
	ret := &FlumeEvents{
		events: []*ThriftFlumeEvent{},
		lock:   &sync.Mutex{},
		timer:  time.NewTicker(time.Second * time.Duration(5)),
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

func (self *FlumeEvents) Send(tmpl string, body []byte) {
	self.lock.Lock()
	defer self.lock.Unlock()

	event := &ThriftFlumeEvent{
		Headers: map[string]string{
			"timestamp": strconv.FormatInt(time.Now().Unix(), 10),
			"tmpl":      tmpl,
		},
		Body: body,
	}
	self.events = append(self.events, event)
}

func (self *FlumeEvents) SendAll() {
	if len(self.events) == 0 {
		return
	}

	events := self.copyEvents()
	flag := false
	var err error
	for i := 0; i < 5; i++ {
		r := rand.New(rand.NewSource(time.Now().UnixNano()))
		index := r.Intn(len(config.Instance.Flume))
		c := NewFlumeClient(config.Instance.Flume[index].Host, config.Instance.Flume[index].Port)
		if err = c.Connect(); err != nil {
			time.Sleep(time.Duration(10) * time.Second)
			continue
		}
		defer c.Destroy()
		if err = c.AppendBatch(events); err != nil {
			time.Sleep(time.Duration(10) * time.Second)
			continue
		} else {
			flag = true
			break
		}
	}

	if !flag {
		dlog.Error("append batch to flume error: %v", err)
	}
}

func (self *FlumeEvents) copyEvents() []*ThriftFlumeEvent {
	self.lock.Lock()
	defer self.lock.Unlock()

	tmp := make([]*ThriftFlumeEvent, len(self.events), len(self.events))
	copy(tmp, self.events)
	self.events = []*ThriftFlumeEvent{}
	return tmp
}
