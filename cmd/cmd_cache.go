package cmd

import (
	"sync"
	"time"

	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/dlog"
)

type CommandCache struct {
	data map[string]Command
	lock *sync.RWMutex
}

func NewCommandCache() *CommandCache {
	return &CommandCache{
		data: make(map[string]Command, 1000),
		lock: &sync.RWMutex{},
	}
}

func (self *CommandCache) SetCommand(c Command) {
	self.lock.Lock()
	defer self.lock.Unlock()

	liveTime := 15
	if lt, ok := config.Instance.LiveTime[c.GetTmpl()]; ok {
		liveTime = lt
	}

	self.data[c.GetId()] = c
	dlog.Warn("%s command len: %d", c.GetId(), len(self.data))
	go func() {
		timer := time.NewTimer(time.Duration(liveTime) * time.Minute)
		<-timer.C
		c.Close()
		self.Delete(c.GetId())
	}()
}

func (self *CommandCache) Delete(id string) {
	self.lock.Lock()
	defer self.lock.Unlock()
	if _, ok := self.data[id]; ok {
		delete(self.data, id)
	}
}

func (self *CommandCache) GetCommand(id string) Command {
	self.lock.RLock()
	defer self.lock.RUnlock()

	val, ok := self.data[id]
	if !ok {
		return nil
	}
	return val
}
