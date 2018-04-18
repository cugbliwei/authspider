package record

import (
	"encoding/json"
	"io/ioutil"
	"testing"
)

func TestJudge(t *testing.T) {
	buf, _ := ioutil.ReadFile("test.json")
	var test interface{}
	_ = json.Unmarshal(buf, &test)
	JudgeExtractResult("qr_taobao_shop", test)
}
