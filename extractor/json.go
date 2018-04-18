package extractor

import (
	"runtime/debug"
	"strings"

	"github.com/cugbliwei/authspider/jsonpath"
	"github.com/cugbliwei/dlog"
)

type JsonSelector struct {
	Path  string
	Parse string
}

func NewJsonSelector(buf string) *JsonSelector {
	tks := strings.Split(buf, "&")
	ret := JsonSelector{}
	ret.Path = tks[0]
	for _, tk := range tks[1:] {
		kv := strings.Split(tk, "=")
		if len(kv) < 2 {
			continue
		} else if len(kv) > 2 {
			index := strings.Index(tk, "=")
			kv[0] = tk[:index]
			kv[1] = tk[index+1:]
		}

		if kv[0] == "parse" {
			ret.Parse = kv[1]
		}
	}
	return &ret
}

func (self *JsonSelector) Query(j *jsonpath.Json, c Context) interface{} {
	defer func() {
		if err := recover(); err != nil {
			dlog.Error("json path: %s  error: %v", self.Path, err)
			debug.PrintStack()
		}
	}()

	var val interface{}
	if strings.HasPrefix(self.Path, "c:") {
		val = parse(self.Path[2:], c)
	} else {
		self.Path = parse(self.Path, c)
		tmp, err := j.Query(self.Path)
		if err != nil {
			return nil
		}

		val = formatValue(tmp)
		if val == nil {
			return nil
		}
	}

	if len(self.Parse) > 0 {
		c.Set("_json_body", val)
		val = parse(self.Parse, c)
	}

	return val
}
