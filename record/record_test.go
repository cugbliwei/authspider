package record

import (
	"testing"
	"time"

	"github.com/cugbliwei/dlog"
)

func TestStep(t *testing.T) {
	record := NewRecord("123", "test", time.Now().UnixNano()/1000000)
	dlog.Info("%v", record)
	st := &Step{
		Index:   0,
		UseTime: 1.5,
	}
	record.Steps = append(record.Steps, st)
	dlog.Info("%v %v", record, record.Steps[0])

	st = &Step{
		Index:   1,
		UseTime: 2.5,
	}
	record.Steps = append(record.Steps, st)
	dlog.Info("%v %v", record, record.Steps[1])
}
