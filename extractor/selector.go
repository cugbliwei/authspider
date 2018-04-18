package extractor

import (
	"errors"
	"net/url"
	"regexp"
	"runtime/debug"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/cugbliwei/dlog"
)

// xpath&attr=&regex&replace=&default=
type HtmlSelector struct {
	Xpath   string
	Attr    string
	Regex   string
	Replace string
	Convert string
	Default string
	Prefix  string
	Suffix  string
	Array   string
	BaseUrl string
	Map     string
}

func NewHtmlSelector(buf string) *HtmlSelector {
	tks := strings.Split(buf, "&")
	ret := HtmlSelector{}
	ret.Xpath = tks[0]
	for _, tk := range tks[1:] {
		kv := strings.Split(tk, "=")
		if len(kv) < 2 {
			continue
		} else if len(kv) > 2 {
			index := strings.Index(tk, "=")
			kv[0] = tk[:index]
			kv[1] = tk[index+1:]
		}
		if kv[0] == "attr" {
			ret.Attr = kv[1]
		} else if kv[0] == "regex" {
			ret.Regex = kv[1]
		} else if kv[0] == "replace" {
			ret.Replace = kv[1]
		} else if kv[0] == "convert" {
			ret.Convert = kv[1]
		} else if kv[0] == "default" {
			ret.Default = kv[1]
		} else if kv[0] == "prefix" {
			ret.Prefix = kv[1]
		} else if kv[0] == "suffix" {
			ret.Suffix = kv[1]
		} else if kv[0] == "array" {
			ret.Array = kv[1]
		} else if kv[0] == "base_url" {
			ret.BaseUrl = kv[1]
		} else if kv[0] == "map" {
			ret.Map = kv[1]
		}
	}
	return &ret
}

func (p *HtmlSelector) PostProcess(s *goquery.Selection) interface{} {
	var ret string
	var err error
	var ok bool

	if len(p.Attr) == 0 || p.Attr == "text" {
		ret = s.Text()
	} else if p.Attr == "html" {
		ret, err = s.Html()
		if err != nil {
			return ""
		}
	} else {
		ret, ok = s.Attr(p.Attr)
		if !ok {
			return ""
		}
	}
	ret = strings.TrimSpace(ret)
	if len(p.Regex) > 0 {
		tmp := regexExtract(ret, p.Regex)
		if t, ok := tmp.([]string); ok {
			return t
		} else if tt, ok := tmp.(string); ok {
			ret = tt
		}
	}

	if len(p.Replace) > 0 {
		ret = replaceByCondition(ret, p.Replace)
	}

	if len(p.Convert) > 0 {
		ret = convertByCondition(ret, p.Convert)
	}

	if len(ret) == 0 && len(p.Default) > 0 {
		ret = p.Default
	}

	if len(p.Prefix) > 0 {
		prefix, _ := url.QueryUnescape(p.Prefix)
		ret = prefix + ret
	}

	if len(p.Suffix) > 0 {
		suffix, _ := url.QueryUnescape(p.Suffix)
		ret += suffix
	}

	if len(p.BaseUrl) > 0 {
		if !strings.HasPrefix(ret, "http") {
			base_url, _ := url.QueryUnescape(p.BaseUrl)
			ret = base_url + ret
		}
	}

	if len(p.Map) > 0 {
		ret = mapByCondition(ret, p.Map)
	}

	ret = strings.Replace(ret, "\u0000", "", -1)
	ret = strings.TrimSpace(ret)
	return ret
}

func getFirstXpath(xpath string, index int) (string, string) {
	si := strconv.Itoa(index)
	sir := "@index=" + si
	firstIndex := strings.Index(xpath, sir)
	xpath1 := strings.TrimSpace(xpath[:firstIndex-1])
	if firstIndex+len(sir) >= len(xpath) {
		return xpath1, ""
	}

	xpath2 := xpath[firstIndex+len(sir):]
	xpath2 = strings.TrimSpace(xpath2)
	return xpath1, xpath2
}

func QueryXpath(xpath string, s *goquery.Selection) *goquery.Selection {
	defer func() {
		if err := recover(); err != nil {
			dlog.Error("queryXpath Error: %v", err)
		}
	}()

	var b *goquery.Selection
	index, ok := FindIntAttribute("index", xpath)
	parent, ok2 := FindIntAttribute("parent", xpath)
	if ok {
		xpath1, xpath2 := getFirstXpath(xpath, index)
		b = s.Find(xpath1)
		b = b.Eq(index)
		if len(xpath2) > 0 {
			return QueryXpath(xpath2, b)
		}
	} else if ok2 {
		xpath = CleanAttribute("parent", xpath)
		b = s.Find(xpath)
		if b.Size() > 1 {
			b = b.First()
		}
		for x := 0; x < parent; x++ {
			b = b.Parent()
		}
	} else if strings.Contains(xpath, "@last") {
		xpath = strings.Replace(xpath, "@last", "", 1)
		b = s.Find(xpath)
		b = b.Last()
	} else if strings.Contains(xpath, "@slice") {
		sliceinfo, ok := FindAttribute("slice", xpath)
		startidx, endidx := 0, -1
		if ok {
			xpath = CleanAttribute("slice", xpath)
			startidx, endidx = parseSliceRange(sliceinfo)
		}
		b = s.Find(xpath)
		if ok {
			if startidx < 0 {
				startidx += b.Length()
			}
			if endidx < 0 {
				endidx += b.Length()
			} else if endidx == 0 && startidx > 0 {
				endidx += b.Length()
			}
			if startidx > -1 && endidx >= startidx && endidx < b.Length()+1 {
				//dlog.Info("real slice call:[%d:%d]", startidx, endidx)
				b = b.Slice(startidx, endidx)
			} else {
				//dlog.Warn("bad slice call:[%d:%d]", startidx, endidx)
			}
		}
	} else {
		b = s.Find(xpath)
	}
	return b
}

func parseSliceRange(s string) (i int, j int) {
	re := regexp.MustCompile("(-?\\d+):(-?\\d+)")
	res := re.FindSubmatch([]byte(s))
	err := errors.New("")
	if len(res) > 2 {
		i, err = strconv.Atoi(string(res[1]))
		if err != nil {
			i = 0
		}
		j, err = strconv.Atoi(string(res[2]))
		if err != nil {
			j = 0
		}
	}
	return
}

func (p *HtmlSelector) Query(doc *goquery.Selection) interface{} {
	defer func() {
		if err := recover(); err != nil {
			dlog.Error("selector xpath: %s  error: %v", p.Xpath, err)
			debug.PrintStack()
		}
	}()

	var s *goquery.Selection
	if p.Xpath == ":this" {
		s = doc
	} else {
		s = QueryXpath(p.Xpath, doc)
	}

	if s.Size() == 1 {
		if p.Array == "true" {
			ret := make([]interface{}, 0, 1)
			s.Each(func(i int, sx *goquery.Selection) {
				ret = append(ret, p.PostProcess(sx))
			})
			return ret
		} else {
			return p.PostProcess(s)
		}
	}

	if s.Size() > 1 {
		if p.Array == "false" {
			return p.PostProcess(s)
		} else {
			ret := make([]interface{}, 0, s.Size())
			s.Each(func(i int, sx *goquery.Selection) {
				ret = append(ret, p.PostProcess(sx))
			})
			return ret
		}
	}
	return nil
}

func regexExtract(buf, regex string) interface{} {
	if strings.Contains(regex, "@multi ") {
		reg := strings.Replace(regex, "@multi ", "", 1)
		return FindGroupsByIndex(reg, buf, 1)
	}
	reg := regexp.MustCompile(regex)
	result := reg.FindAllStringSubmatch(buf, 1)
	if result != nil && len(result) > 0 {
		group := result[0]
		if len(group) > 1 {
			return group[1]
		} else {
			return group[0]
		}
	}
	return ""
}

func FindResult(reg, body string) [][]string {
	matcher := regexp.MustCompile(reg)
	result := matcher.FindAllStringSubmatch(body, -1)
	return result
}

func FindGroupsByIndex(reg, body string, index int) []string {
	groups := make([]string, 0)
	results := FindResult(reg, body)
	for _, mat := range results {
		if mat != nil && len(mat) > index {
			groups = append(groups, mat[index])
		}
	}
	return groups
}

func FindGroup(reg, body string) []string {
	matcher := regexp.MustCompile(reg)
	result := matcher.FindAllStringSubmatch(body, 1)
	if len(result) > 0 {
		group := result[0]
		return group
	}
	return nil
}

func FindGroupByIndex(reg, body string, index int) string {
	group := FindGroup(reg, body)
	if group != nil && len(group) > index {
		return group[index]
	}
	return ""
}

func FindAttribute(attributeName, expression string) (string, bool) {
	attributeExpression := "@" + attributeName
	if !strings.Contains(expression, attributeExpression) {
		return "", false
	}
	reg := attributeExpression + "\\s*=\\s*([^\\s]+)\\s*"
	val := FindGroupByIndex(reg, expression, 1)
	return val, true
}

func FindIntAttribute(attributeName, expression string) (int, bool) {
	val, ok := FindAttribute(attributeName, expression)
	if ok {
		ret, err := strconv.Atoi(val)
		if err != nil {
			//dlog.Warn("convert to int err :%s", err.Error())
			return 0, false
		}
		return ret, true
	}
	return 0, false
}

func CleanAttribute(attributeName, expression string) string {
	reg := "(@" + attributeName + "\\s*=\\s*[^\\s]+)\\s*"
	val := FindGroupByIndex(reg, expression, 1)
	if len(val) > 0 {
		return strings.Replace(expression, val, "", 1)
	}
	return expression
}

func convertByCondition(buf, replace string) string {
	tks := strings.Split(replace, ",")
	for _, tk := range tks {
		kv := strings.Split(tk, ":")
		if len(kv) != 2 {
			continue
		}
		if strings.Contains(buf, kv[0]) {
			return kv[1]
		}
	}
	return buf
}

func replaceByCondition(buf, replace string) string {
	tks := strings.Split(replace, ",")
	for _, tk := range tks {
		kv := strings.Split(tk, ":")
		if len(kv) == 1 {
			buf = strings.Replace(buf, kv[0], "", -1)
		}
		buf = strings.Replace(buf, kv[0], kv[1], -1)
	}
	return buf
}

func mapByCondition(buf, replace string) string {
	var newBuf string
	tks := strings.Split(replace, ",")
	replaceMap := make(map[string]string)
	for _, tk := range tks {
		kv := strings.Split(tk, ":")
		replaceMap[kv[0]] = kv[1]
	}

	for _, v := range buf {
		replaceBuf := replaceMap[string(v)]
		if replaceBuf == "" {
			newBuf += string(v)
		} else {
			newBuf += replaceBuf
		}
	}
	return newBuf
}
