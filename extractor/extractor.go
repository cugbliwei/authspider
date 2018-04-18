package extractor

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	ahttp "github.com/cugbliwei/authspider/http"
	"github.com/cugbliwei/authspider/jsonpath"
	"github.com/cugbliwei/dlog"
)

type Context interface {
	Parse(string) string
	Set(string, interface{})
	Del(string)
}

func guessDocType(body []byte) string {
	buf := strings.TrimSpace(string(body))
	if len(buf) == 0 {
		return ""
	}
	if buf[0] == '{' && buf[len(buf)-1] == '}' {
		return "json"
	}

	if buf[0] == '[' && buf[len(buf)-1] == ']' {
		return "json"
	}

	if strings.Contains(buf, "<html") && strings.Contains(buf, "</html>") {
		return "html"
	}

	if strings.Contains(buf, "<body") && strings.Contains(buf, "</body>") {
		return "html"
	}

	return ""
}

func deepCopy(i interface{}) interface{} {
	b, _ := json.Marshal(i)
	var ret interface{}
	json.Unmarshal(b, &ret)
	return ret
}

func Extract(body []byte, config0 interface{}, docType string, c Context) (interface{}, error) {
	config := deepCopy(config0)
	if len(docType) == 0 {
		docType = guessDocType(body)
	}
	if docType == "html" {
		doc, err := goquery.NewDocumentFromReader(bytes.NewReader(body))
		if err != nil {
			return nil, err
		}
		return htmlExtract(doc.First(), config, c), nil
	} else if docType == "json" {
		b := strings.Replace(string(body), "\t", "", -1)
		body = []byte(b)
		j, err := jsonpath.NewJson(body)
		if err != nil {
			//dlog.Warn("new json error: %v", err)
			return nil, err
		}
		return jsonExtract(j, config, c), nil
	} else if docType == "jsonp" {
		jsonp := jsonpath.FilterJSONP(string(body))
		return Extract([]byte(jsonp), config, "json", c)
	} else if docType == "regex" {
		return textExtract(string(body), config, c), nil
	} else {
		return nil, errors.New("does not support doc type: " + docType)
	}
}

func parse(v string, c Context) string {
	if c == nil {
		return v
	}
	return c.Parse(v)
}

func jsonUnmarshal(buf string) interface{} {
	var v interface{}
	err := json.Unmarshal([]byte(buf), &v)
	if err != nil {
		return nil
	}
	return v
}

func formatValue(v interface{}) interface{} {
	if val, ok := v.(string); ok {
		return strings.TrimSpace(val)
	} else if val, ok := v.(float64); ok {
		if int64(val*10000) == int64(val)*10000 {
			return fmt.Sprintf("%d", int64(val))
		}
		return fmt.Sprintf("%f", val)
	} else if val, ok := v.(int64); ok {
		return strconv.FormatInt(val, 10)
	} else if val, ok := v.(bool); ok {
		return strconv.FormatBool(val)
	} else if val, ok := v.([]interface{}); ok {
		return val
	} else if val, ok := v.(map[string]interface{}); ok {
		return val
	}
	return v
}

func jsonQuery(j *jsonpath.Json, qp string, c Context) interface{} {
	if qp == "*" {
		return j.Data()
	}
	js := NewJsonSelector(qp)
	val := js.Query(j, c)
	return val
}

func jsonExtract(j *jsonpath.Json, config interface{}, c Context) interface{} {
	if v, ok := config.(string); ok {
		ret := jsonQuery(j, v, c)
		return ret
	}

	if m, ok := config.(map[string]interface{}); ok {
		root := jsonpath.GetString(m, "_root")
		rj := j.Data()
		if len(root) > 0 {
			if root == "json" {
				if rr, ok := rj.(string); ok {
					jp, _ := jsonpath.NewJson([]byte(rr))
					rj = jp.Data()
				} else {
					return nil
				}
			} else {
				if c != nil && strings.Contains(root, "{{") {
					root = c.Parse(root)
				}
				rj, _ = j.Query(root)
				if rj == nil {
					return nil
				}
			}
		}

		sleep := jsonpath.GetString(m, "_sleep")
		if len(sleep) > 0 {
			if sp, err := strconv.Atoi(sleep); err == nil {
				time.Sleep(time.Duration(sp) * time.Millisecond)
			}
		}

		tmpKeys := make([]string, 0)
		ct := jsonpath.GetArrayMap(m, "_context")
		for _, mkv := range ct {
			key := jsonpath.GetString(mkv, "_key")
			value := jsonpath.GetString(mkv, "_value")
			if len(key) > 0 && len(value) > 0 {
				ej, _ := jsonpath.NewJsonByInterface(rj)
				v := jsonQuery(ej, value, c)
				if v != nil {
					tmpKeys = append(tmpKeys, key)
					c.Set(key, v)
				}
			}
		}

		link := jsonpath.GetString(m, "_url")
		nextUrl := jsonpath.GetString(m, "_next")
		if len(link) > 0 && len(nextUrl) > 0 {
			link = c.Parse(link)
			client := ahttp.HttpJarClient(20)
			for _, tmpKey := range tmpKeys {
				c.Del(tmpKey)
			}

			return getNextUrl(client, link, nextUrl)
		}

		isArray := jsonpath.GetBool(m, "_array")
		delete(m, "_root")
		delete(m, "_array")
		if isArray {
			ret := []interface{}{}
			if arj, ok2 := rj.([]interface{}); ok2 {
				for _, e := range arj {
					ej, _ := jsonpath.NewJsonByInterface(e)
					ret = append(ret, jsonExtract(ej, config, c))
				}
			} else {
				ej, _ := jsonpath.NewJsonByInterface(rj)
				mc := deepCopy(m)
				ret = append(ret, jsonExtract(ej, mc, c))
			}
			return ret
		} else {
			ret := make(map[string]interface{}, 10)
			ej, _ := jsonpath.NewJsonByInterface(rj)
			for k, v := range m {
				key := k
				if c != nil && strings.Contains(key, "{{") {
					key = c.Parse(key)
				}
				ret[key] = jsonExtract(ej, v, c)
			}
			return ret
		}
	}
	return nil
}

func regexQuery(text string, qp string, c Context) interface{} {
	qv := parse(qp, c)
	var val interface{}
	if strings.HasPrefix(qv, "c:") {
		val = qv[2:]
	} else {
		val = regexExtract(text, qv)
	}
	return val
}

func textExtract(text string, config interface{}, c Context) interface{} {
	if v, ok := config.(string); ok {
		return regexQuery(text, v, c)
	}
	if m, ok := config.(map[string]interface{}); ok {
		ret := make(map[string]interface{}, 10)
		for k, v := range m {
			key := k
			if c != nil && strings.Contains(key, "{{") {
				key = c.Parse(key)
			}
			ret[key] = textExtract(text, v, c)
		}
		return ret
	}
	return nil
}

func htmlQuery(s *goquery.Selection, qp string, c Context) interface{} {
	qv := parse(qp, c)
	var val interface{}
	if strings.HasPrefix(qv, "c:") {
		val = qv[2:]
	} else {
		hs := NewHtmlSelector(qv)
		val = hs.Query(s)
	}
	return val
}

func htmlExtract(s *goquery.Selection, config interface{}, c Context) interface{} {
	if v, ok := config.(string); ok {
		return htmlQuery(s, v, c)
	}

	if m, ok := config.(map[string]interface{}); ok {
		er := jsonpath.GetString(m, "_error")
		if len(er) > 0 {
			edoc := QueryXpath(er, s)
			if edoc == nil || edoc.Size() == 0 {
				return map[string]interface{}{
					"error": "页面错误",
				}
			}
		}

		root := jsonpath.GetString(m, "_root")
		rs := s
		if len(root) > 0 {
			rs = QueryXpath(root, s)
		}

		sleep := jsonpath.GetString(m, "_sleep")
		if len(sleep) > 0 {
			if sp, err := strconv.Atoi(sleep); err == nil {
				time.Sleep(time.Duration(sp) * time.Millisecond)
			}
		}

		tmpKeys := make([]string, 0)
		ct := jsonpath.GetArrayMap(m, "_context")
		for _, mkv := range ct {
			key := jsonpath.GetString(mkv, "_key")
			value := jsonpath.GetString(mkv, "_value")
			if len(key) > 0 && len(value) > 0 {
				v := htmlExtract(rs, value, c)
				if v != nil {
					tmpKeys = append(tmpKeys, key)
					c.Set(key, v)
				}
			}
		}

		link := jsonpath.GetString(m, "_url")
		nextUrl := jsonpath.GetString(m, "_next")
		if len(link) > 0 && len(nextUrl) > 0 {
			link = c.Parse(link)
			client := ahttp.HttpJarClient(20)
			for _, tmpKey := range tmpKeys {
				c.Del(tmpKey)
			}

			return getNextUrl(client, link, nextUrl)
		}

		isArray := jsonpath.GetBool(m, "_array")
		delete(m, "_root")
		delete(m, "_array")

		if isArray || rs.Size() > 1 {
			ret := []interface{}{}
			rs.Each(func(i int, subSel *goquery.Selection) {
				mc := deepCopy(m)
				sub := htmlExtract(subSel, mc, c)
				ret = append(ret, sub)
			})
			return ret
		} else {
			ret := make(map[string]interface{}, 10)
			for k, v := range m {
				key := k
				if c != nil && strings.Contains(key, "{{") {
					key = c.Parse(key)
				}
				val := htmlExtract(rs, v, c)
				if strings.HasPrefix(k, "@key ") {
					khs := NewHtmlSelector(k[5:])
					keyInter := khs.Query(rs)
					if keyInter == nil {
						continue
					}
					if key, ok = keyInter.(string); ok && len(key) > 0 {
						ret[key] = val
					}
					continue
				}

				if rs.Size() > 0 && strings.HasPrefix(k, "@dup") {
					key = k[6:]
					if tmp, ok := ret[key]; !ok || tmp == nil || isEmptyMap(tmp) {
						ret[key] = val
					}
					continue
				}

				ret[key] = val
			}
			return ret
		}
	}

	return nil
}

func getNextUrl(client *http.Client, link, nextUrl string) interface{} {
	b := ahttp.HttpGet(client, link)
	var buf map[string]string
	if err := json.Unmarshal([]byte(b), &buf); err != nil {
		dlog.Error("json Unmarshal error: %v", err)
		return nil
	}

	status, ok := buf["status"]
	if !ok || status == "fail" {
		return nil
	}

	if status == "in_crawling" {
		return getNextUrl(client, nextUrl+buf["id"], nextUrl)
	} else if status == "finish_fetch_data" {
		var data interface{}
		if err := json.Unmarshal([]byte(buf["data"]), &data); err != nil {
			dlog.Error("json Unmarshal error: %v", err)
			return nil
		}
		return data
	}
	return nil
}

func isEmptyMap(obj interface{}) bool {
	t := reflect.TypeOf(obj)
	if t.Kind() == reflect.Map {
		val := reflect.ValueOf(obj)
		return val.Len() == 0
	}
	return false
}
