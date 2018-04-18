package record

import (
	"encoding/json"
	"strings"

	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/authspider/sql"
	"github.com/cugbliwei/dlog"
)

func JudgeExtractResult(tmpl string, val interface{}) {
	if is, ok := config.Instance.JudgeExtract.IgnoreTmpl[tmpl]; ok && is {
		return
	}

	tmplJudge := make(map[string]map[string]int, 5)
	judge := make(map[string]int, 5)
	newJudge := make(map[string]int, 5)

	result, err := sql.GetFromRedis(config.Instance.JudgeExtract.JudgeKey)
	if err != nil {
		dlog.Error("get judge extract result error: %v", err)
	} else {
		if err := json.Unmarshal([]byte(result), &tmplJudge); err != nil {
			dlog.Error("json unmarshal judge extract result error: %v", err)
		}
	}

	if tj, ok := tmplJudge[tmpl]; ok {
		judge = tj
	}

	count(judge, newJudge, "", val)
	tmplJudge[tmpl] = newJudge

	buf, err := json.Marshal(tmplJudge)
	if err != nil {
		dlog.Error("json marshal judge extract result error: %v", err)
		return
	}

	sql.WriteToRedis(config.Instance.JudgeExtract.JudgeKey, string(buf), 50000)
}

func count(judge map[string]int, newJudge map[string]int, key string, val interface{}) {
	if val == nil {
		writeJudge(judge, newJudge, key)
		return
	}

	if res, ok := val.(string); ok {
		if len(res) == 0 {
			writeJudge(judge, newJudge, key)
		}

		for _, require := range config.Instance.JudgeExtract.Require {
			if strings.Contains(res, require) {
				writeJudge(judge, newJudge, key)
			}
		}
		return
	}

	_, oki := val.(int)
	_, okf := val.(float64)
	_, okb := val.(bool)
	if oki || okf || okb {
		return
	}

	if res, ok := val.(map[string]interface{}); ok {
		if len(res) == 0 {
			writeJudge(judge, newJudge, key)
		}

		for k, v := range res {
			if len(key) > 0 {
				k = key + " -> " + k
			}

			count(judge, newJudge, k, v)
		}
	} else if res, ok := val.([]interface{}); ok {
		if len(res) == 0 {
			writeJudge(judge, newJudge, key)
		}

		for _, v := range res {
			count(judge, newJudge, key, v)
		}
	} else if res, ok := val.([]string); ok {
		if len(res) == 0 {
			writeJudge(judge, newJudge, key)
		}

		for _, v := range res {
			count(judge, newJudge, key, v)
		}
	} else if res, ok := val.([]int); ok {
		if len(res) == 0 {
			writeJudge(judge, newJudge, key)
		}

		for _, v := range res {
			count(judge, newJudge, key, v)
		}
	} else if res, ok := val.([]float64); ok {
		if len(res) == 0 {
			writeJudge(judge, newJudge, key)
		}

		for _, v := range res {
			count(judge, newJudge, key, v)
		}
	} else {
		dlog.Error("unknown type key: %s, val: %s", key, val)
	}
}

func writeJudge(judge map[string]int, newJudge map[string]int, key string) {
	for _, text := range config.Instance.JudgeExtract.IgnoreText {
		if strings.Contains(key, text) {
			return
		}
	}

	if val, ok := judge[key]; ok {
		newJudge[key] = val + 1
	} else {
		newJudge[key] = 1
	}
}
