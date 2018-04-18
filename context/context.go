package context

import (
	"bytes"
	"crypto/md5"
	crand "crypto/rand"
	"crypto/rsa"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"html"
	"io/ioutil"
	"log"
	"math"
	"math/rand"
	"net/smtp"
	"net/url"
	"reflect"
	"regexp"
	"strconv"
	"strings"
	"text/template"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/cugbliwei/authspider/casperjs"
	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/authspider/extractor"
	"github.com/cugbliwei/authspider/flume"
	"github.com/cugbliwei/authspider/hbase"
	ahttp "github.com/cugbliwei/authspider/http"
	"github.com/cugbliwei/authspider/jsonpath"
	hproxy "github.com/cugbliwei/authspider/proxy"
	"github.com/cugbliwei/authspider/sql"
	"github.com/cugbliwei/authspider/util"
	"github.com/cugbliwei/dlog"
	"github.com/cugbliwei/html2article"
)

func DaysAgo(n int, f string) string {
	return time.Now().AddDate(0, 0, -1*n).Format(f)
}

func NowTimestamp() string {
	return strconv.FormatInt(time.Now().Unix(), 10) //example 1467560377
}

func NowTime(f string) string {
	return time.Now().Format(f)
}

func ChangeTimeFormat(tm, src, dst string) string {
	t, err := time.Parse(src, tm)
	if err != nil {
		return tm
	}
	return t.Format(dst)
}

func TimestampToString(dst, tm string) string {
	i, err := strconv.ParseInt(tm, 10, 64)
	if err != nil {
		return tm
	}
	t := time.Unix(i, 0)
	return t.Format(dst)
}

func AddDate(y, m, d int, f string) string {
	return time.Now().AddDate(y, m, d).Format(f)
}

func TimeBefore(src, sf, target, tf string) bool {
	ts, _ := time.Parse(sf, src)
	tt, _ := time.Parse(tf, target)
	return ts.Before(tt)
}

func GetMonthDate(sub int, f string) string {
	year, month, _ := time.Now().Date()
	return time.Date(year, month, 1, 0, 0, 0, 0, time.Local).AddDate(0, sub, 0).Format(f)
}

func GetMonthDateFromUnkown(src, sf string, sub int, f string) string {
	ts, _ := time.Parse(sf, src)
	year, month, _ := ts.Date()
	return time.Date(year, month, 1, 0, 0, 0, 0, time.Local).AddDate(0, sub, 0).Format(f)
}

func FirstDayOfMonthAgo(n int, f string) string {
	year, month, _ := time.Now().Date()
	tm := time.Date(year, month, 1, 0, 0, 0, 0, time.Local).AddDate(0, -1*n, 0)
	return time.Date(tm.Year(), tm.Month(), 1, 0, 0, 0, 0, time.Local).Format(f)
}

func LastDayOfMonthAgo(n int, f string, afterCurr bool) string {
	year, month, _ := time.Now().Date()
	tm := time.Date(year, month, 1, 0, 0, 0, 0, time.Local).AddDate(0, 1-n, 0).AddDate(0, 0, -1)
	if !afterCurr && time.Now().Sub(tm).Seconds() < 0 {
		return time.Now().Format(f)
	}
	return tm.Format(f)
}

func NowMillTimestamp() string {
	return strconv.FormatInt(time.Now().UnixNano()/1000000, 10) //example 1467560377511
}

func AESEncodePassword(pwd, key, iv string) string {
	ret, err := util.AESEncodePassword(pwd, key, iv)
	if err != nil {
		dlog.Warn("fail to encode pwd by aes: %v", err)
		return ""
	}
	return ret
}

func MD5(pwd string) string {
	h := md5.New()
	h.Write([]byte(pwd))
	return hex.EncodeToString(h.Sum(nil))
}

func cutString(start, end int, s string) string {
	if len(s) <= start || len(s) < end {
		return s
	}
	return s[start:end]
}

func uploadVerifyCode(code string) string {
	if len(code) == 0 {
		return ""
	}

	nano := time.Now().UnixNano()
	key := "randcode_" + fmt.Sprintf("%d", nano)
	if err := sql.WriteToRedisGetError(key, code, config.Instance.Redis.SingleStoreTimeout); err != nil {
		dlog.Warn("set randcode: %v", err)
		return ""
	}
	return config.Instance.ServiceHost + "/randcode/" + key + ".png"
}

func writeToRedis(key, val string, timeout int) int {
	if err := sql.WriteToMixRedisGetError(key, val, timeout); err != nil {
		return -1
	}
	return 0
}

func getFromRedis(key string) string {
	ret, err := sql.GetFromRedis(key)
	if err != nil {
		return ""
	}
	return ret
}

func hGetFromRedis(key, field string) string {
	ret, err := sql.HGetFromMixRedis(key, field)
	if err != nil {
		return ""
	}
	return ret
}

func deleteFromRedis(key string) int64 {
	return sql.DeleteFromRedis(key)
}

func (self *Context) WhichOne(trueString, falseString string, flag bool) string {
	if flag {
		return self.Parse(trueString)
	}
	return self.Parse(falseString)
}

func bytesToString(b []byte) string {
	//dlog.Warn("bytesToString: %s", string(b))
	return string(b)
}

func contains(sub, mother string) bool {
	return strings.Contains(mother, sub)
}

func containAny(sub ...string) bool {
	last := len(sub) - 1
	var mother string
	if last >= 0 {
		mother = sub[last]
	}
	for i := 0; i < last; i++ {
		if strings.Contains(mother, sub[i]) {
			return true
		}
	}
	return false
}

func joinString(sub ...string) string {
	var join string
	for i := 0; i < len(sub); i++ {
		join = join + sub[i]
	}
	return join
}

func convertStringToJson(s string) map[string]interface{} {
	var j map[string]interface{}
	if err := json.Unmarshal([]byte(s), &j); err == nil {
		return j
	}
	return nil
}

func convertJsonToString(j map[string]interface{}) string {
	bs, err := json.Marshal(j)
	if err != nil {
		dlog.Warn("marshal error: %v", j)
		return err.Error()
	}
	return string(bs)
}

func stringToInt(s string) int {
	t, _ := strconv.Atoi(s)
	return t
}

func toLower(s string) string {
	return strings.ToLower(s)
}

func toUpper(s string) string {
	return strings.ToUpper(s)
}

func intToString(i int) string {
	return strconv.Itoa(i)
}

func mapToString(kv ...string) string {
	m := make(map[string]string)
	for i := 1; i < len(kv); i = i + 2 {
		m[kv[i-1]] = kv[i]
	}

	sm, err := json.Marshal(m)
	if err != nil {
		dlog.Warn("json marshal error: %v", err)
		return ""
	}
	return string(sm)
}

func marshalInterface(t interface{}) string {
	b, err := json.Marshal(t)
	if err != nil {
		return ""
	}
	return string(b)
}

func hexEncodeToString(param string) string {
	return hex.EncodeToString([]byte(param))
}

func interfaceLength(s interface{}) int {
	if st, ok := s.(string); ok {
		return len(st)
	}
	if sl, ok := s.([]string); ok {
		return len(sl)
	}
	if sin, ok := s.([]map[string]interface{}); ok {
		return len(sin)
	}
	if sm, ok := s.([]interface{}); ok {
		return len(sm)
	}
	if si, ok := s.([]int); ok {
		return len(si)
	}
	return 0
}

func getValueFromArray(i int, s interface{}) interface{} {
	if sl, ok := s.([]string); ok {
		return sl[i]
	} else if si, ok := s.([]int); ok {
		return si[i]
	} else if sin, ok := s.([]interface{}); ok {
		return sin[i]
	}
	return nil
}

func getValueFromArrayMap(i int, k string, s interface{}) interface{} {
	if sa, ok := s.([]interface{}); ok {
		si := sa[i]
		if sm, ok := si.(map[string]interface{}); ok {
			return sm[k]
		}
	}
	return nil
}

func equalInArray(k string, s interface{}) int {
	if sar, ok := s.([]interface{}); ok {
		for i, v := range sar {
			val, ok := v.(string)
			if ok && k == val {
				return i
			}
		}
	}
	return -1
}

func getTianyanchaPages(total, page int) int {
	t := float64(total)
	p := float64(page)

	target := int(math.Ceil(t / p))
	if target <= 5 {
		target = 5
	} else if target > 5 && target <= 10 {
		target = 10
	} else if target > 10 && target <= 15 {
		target = 15
	} else if target > 15 {
		target = int((target + 10) / 10)
		target = target * 10
	}
	return target
}

func getCasperMsg(s, sp string) string {
	ss := strings.Split(s, sp)
	if len(ss) > 1 {
		return ss[1]
	}
	return ""
}

func getCasperFirstMsg(s, sp string) string {
	ss := strings.Split(s, sp)
	return ss[0]
}

func randIntn(ri int) int {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	return r.Intn(ri)
}

func randFloat() float64 {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	return r.Float64()
}

func sendToMail(host, user, password, to, mailType, subject, body string) bool {
	hp := strings.Split(host, ":")
	auth := smtp.PlainAuth("", user, password, hp[0])
	content_type := "Content-Type: text/" + mailType + "; charset=UTF-8"
	msg := []byte("To: " + to + "\r\nFrom: " + user + "\r\nSubject: " + subject + "\r\n" + content_type + "\r\n\r\n" + body)
	send_to := strings.Split(to, ";")
	err := smtp.SendMail(host, auth, user, send_to, msg)
	if err != nil {
		log.Println("SendMail error: ", err)
		return false
	}
	return true
}

func sendToFlume(tmpl, body string) bool {
	flume.Flume.Send(tmpl, []byte(body))
	return true
}

func sendToHbase(target, rowkey, value string) bool {
	hbase.Hbase.Send(target, rowkey, value)
	return true
}

func syncSendToHbase(target, rowkey, value string) bool {
	return hbase.SyncSend(target, rowkey, value)
}

type Context struct {
	Data         map[string]interface{}
	CJS          *casperjs.CasperJS
	Proxy        *hproxy.Proxy
	ProxyManager *hproxy.ProxyManager
}

func NewContext(cjs *casperjs.CasperJS, p *hproxy.Proxy, pm *hproxy.ProxyManager) *Context {
	return &Context{
		Data:         make(map[string]interface{}, 100),
		CJS:          cjs,
		Proxy:        p,
		ProxyManager: pm,
	}
}

func (p *Context) newEmptyTemplate() *template.Template {
	return template.New("").Funcs(template.FuncMap{
		"daysAgo":                DaysAgo,
		"nowTime":                NowTime,
		"addDate":                AddDate,
		"getMonthDate":           GetMonthDate,
		"getMonthDateFromUnkown": GetMonthDateFromUnkown,
		"timeBefore":             TimeBefore,
		"changeTimeFormat":       ChangeTimeFormat,
		"timestampToString":      TimestampToString,
		"firstDayOfMonthAgo":     FirstDayOfMonthAgo,
		"lastDayOfMonthAgo":      LastDayOfMonthAgo,
		"nowTimestamp":           NowTimestamp,
		"nowMillTimestamp":       NowMillTimestamp,
		"randIntn":               randIntn,
		"randFloat":              randFloat,
		"AESEncodePassword":      AESEncodePassword,
		"md5":                    MD5,
		"sendToMail":             sendToMail,
		"sendToFlume":            sendToFlume,
		"sendToHbase":            sendToHbase,
		"syncSendToHbase":        syncSendToHbase,
		"cutString":              cutString,
		"uploadVerifyCode":       uploadVerifyCode,
		"writeToRedis":           writeToRedis,
		"getFromRedis":           getFromRedis,
		"HGetFromRedis":          hGetFromRedis,
		"deleteFromRedis":        deleteFromRedis,
		"whichOne":               p.WhichOne,
		"bytesToString":          bytesToString,
		"contains":               contains,
		"containAny":             containAny,
		"joinString":             joinString,
		"addString":              p.addString,
		"convertStringToJson":    convertStringToJson,
		"convertJsonToString":    convertJsonToString,
		"toLower":                toLower,
		"toUpper":                toUpper,
		"stringToInt":            stringToInt,
		"intToString":            intToString,
		"mapToString":            mapToString,
		"writeToFile":            writeToFile,
		"readFromFile":           readFromFile,
		"marshalInterface":       marshalInterface,
		"hexEncodeToString":      hexEncodeToString,
		"len":                    interfaceLength,
		"getValueFromArray":      getValueFromArray,
		"getValueFromArrayMap":   getValueFromArrayMap,
		"equalInArray":           equalInArray,
		"getTianyanchaPages":     getTianyanchaPages,
		"trimPrefix":             strings.TrimPrefix,
		"hasPrefix":              strings.HasPrefix,
		"hasSuffix":              strings.HasSuffix,
		"split":                  strings.Split,
		"getCasperMsg":           getCasperMsg,
		"getCasperFirstMsg":      getCasperFirstMsg,
		"parse":                  p.Parse,
		"writeToParser":          p.writeToParser,
		"htmlEscape":             p.htmlEscape,
		"htmlUnscape":            p.htmlUnescape,
		"urlEncode":              p.urlEncode,
		"urlQueryEscape":         p.urlQueryEscape,
		"urlQueryUnescape":       p.urlQueryUnescape,
		"encryptString":          p.encryptString,
		"base64Decode":           p.base64Decode,
		"base64Encode":           p.base64Encode,
		"extractHtml":            p.extractHtml,
		"extractJson":            p.extractJson,
		"extractJsonp":           p.extractJsonp,
		"extractRegex":           p.extractRegex,
		"extractRegexReplace":    p.extractRegexReplace,
		"set":               p.setValue,
		"setParams":         p.setParams,
		"get":               p.getValue,
		"del":               p.del,
		"add":               p.addValue,
		"notEmpty":          p.notEmpty,
		"empty":             p.empty,
		"mul":               multiply,
		"divide":            divide,
		"divideR":           divideR,
		"plus":              plus,
		"minus":             minus,
		"readCasper":        p.readCasper,
		"writeCasper":       p.writeCasper,
		"regexMatch":        p.RegexMatch,
		"getTimestamp":      GetTimestamp,
		"decodeQr":          p.decodeQr,
		"addKeyValueToJson": AddKeyValueToJson,
		"getNewsTitle":      getNewsTitle,
		"parseTitle":        parseTitle,
		"getNewsTime":       getNewsTime,
		"getNewsContent":    getNewsContent,
		"getLinksContent":   getLinksContent,
		"trimSpace":         trimSpace,
		"addParagraph":      addParagraph,
		"removeTag":         p.removeTag,
		"addTag":            p.addTag,
		"editTag":           p.editTag,
		"trimContent":       p.trimContent,
		"extractWxid":       p.extractWxid,
		"getUrlParam":       getUrlParam,
		"replace":           p.replace,
	})
}

func AddKeyValueToJson(jsonBody string, path string, fieldName string, fieldValue interface{}) string {
	m := make(map[string]interface{})
	err := json.Unmarshal([]byte(jsonBody), &m)
	if err != nil {
		dlog.Warn("error parsing json value: %v", err)
		return ""
	}

	subPaths := strings.Split(path, ",")
	var lastValue interface{} = m
	idx, numOfFields := 0, len(subPaths)
	if len(path) < 1 {
		numOfFields = 0
	}
	for {
		if idx > numOfFields {
			break
		}
		t := reflect.TypeOf(lastValue)
		if t.Kind() == reflect.Map {
			val := reflect.ValueOf(lastValue)
			if idx < numOfFields {
				currentField := subPaths[idx]
				x := val.MapIndex(reflect.ValueOf(currentField))
				if x.IsValid() == true {
					lastValue = x.Interface()
				} else {
					dlog.Warn("unexpected condition, should be json object")
				}
			} else if idx == numOfFields {
				val.SetMapIndex(reflect.ValueOf(fieldName), reflect.ValueOf(fieldValue))
			}
		} else {
			dlog.Warn("unexpected condition, should be json object")
		}
		idx++
	}
	result, err := json.Marshal(m)
	if err != nil {
		dlog.Warn("error: %v", err)
		return ""
	}
	return string(result)
}

func writeToFile(fname string, fbody string) string {
	err := ioutil.WriteFile(fname, []byte(fbody), 0755)
	if err != nil {
		return err.Error()
	}
	return fname
}

func readFromFile(fname string) string {
	result, err := ioutil.ReadFile(fname)
	if err != nil {
		return ""
	}
	return string(result)
}

func (p *Context) base64Encode(code string) string {
	body := base64.StdEncoding.EncodeToString([]byte(code))
	return body
}

func RandRange(min, max int64) int64 {
	if min >= max || min == 0 || max == 0 {
		return max
	}
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	return r.Int63n(max-min) + min
}

func multiply(a, b int) int {
	return a * b
}

func divide(a, b int) int {
	return a / b
}

func divideR(a, b int) int {
	return b / a
}

func plus(a, b int) int {
	return a + b
}

func minus(a, b int) int {
	return a - b
}

func GetTimestamp(types, infos string) interface{} {
	dlog.Println(types)
	if types == "spare_time" {
		tomorrowYear, tomorrowMonth, tomorrowDate := time.Now().Add(24 * time.Hour).Date()
		tomorrowTimestamp := time.Date(tomorrowYear, tomorrowMonth, tomorrowDate, 0, 0, 0, 0, time.Local).Unix()
		nowTimestamp := time.Now().Unix()
		timeDiff := tomorrowTimestamp - nowTimestamp
		hours, error := strconv.ParseInt(infos, 10, 64)
		if error != nil {
			return timeDiff
		}
		return RandRange(timeDiff, timeDiff+hours*3600)
	} else if types == "ranges" {
		nums := strings.Split(infos, "-")
		if len(nums) == 2 {
			minStr := nums[0]
			maxStr := nums[1]
			min, error := strconv.ParseInt(minStr, 10, 64)
			if error != nil {
				return nil
			}
			max, error := strconv.ParseInt(maxStr, 10, 64)
			if error != nil {
				return nil
			}
			return RandRange(min, max)
		}
	}
	return nil
}

func (p *Context) decodeQr(strUrl string) string {
	dlog.Info("%s decodeQr with url: %s", p.Data["_id"], strUrl)
	res := hproxy.GetLink(config.Instance.QrDecodeHost + "?url=" + strUrl)
	dlog.Info("%s decoded result: %s", p.Data["_id"], res)
	return res
}

func (p *Context) writeToParser(tmpl, username, data string) bool {
	if len(tmpl) != 0 && len(username) != 0 && len(data) != 0 {
		edata := make(map[string]string, 1)
		edata["tmpl"] = tmpl
		edata["username"] = username
		edata["data"] = data

		client := ahttp.HttpClient(60)
		_ = ahttp.HttpPost(client, config.Instance.FileSqlUrl, edata)
		dlog.Info("%s write honeycomb data to file sql success, key: %s", p.Data["_id"], tmpl+"_"+username)
	}

	return true
}

func (p *Context) base64Decode(code string) string {
	body, err := base64.StdEncoding.DecodeString(code)
	if err != nil {
		dlog.Warn("base64 decode code: %s, error: %v", code, err)
		return ""
	}
	return string(body)
}

func (p *Context) encryptString(publicKey *rsa.PublicKey, src string) string {
	dlog.Info("%s before rsa encode: %s", p.Data["_id"], src)
	data := []byte{}
	bs := []byte(src)
	for {
		if nil == bs {
			break
		}
		var seg []byte
		if len(bs) > 117 {
			seg = make([]byte, 117)
			copy(seg, bs[0:117])
			bs = bs[117:len(bs)]
		} else {
			seg = make([]byte, len(bs))
			copy(seg, bs)
			bs = nil
		}
		d, err := rsa.EncryptPKCS1v15(crand.Reader, publicKey, seg)
		if err != nil {
			dlog.Warn("%s EncryptPKCS1v15 get error: %s", p.Data["_id"], err.Error())
			return ""
		}
		data = append(data, d...)
	}
	bs64 := base64.URLEncoding.EncodeToString(data)
	query, err := url.ParseQuery(bs64)
	if err != nil {
		dlog.Warn("%s url encode error: %s", p.Data["_id"], err.Error())
		return bs64
	}
	return query.Encode()
}

func (p *Context) urlQueryEscape(word string) string {
	return url.QueryEscape(word)
}

func (p *Context) urlQueryUnescape(word string) string {
	w, err := url.QueryUnescape(word)
	if err != nil {
		return word
	}
	return w
}

func (p *Context) htmlEscape(src string) string {
	return html.EscapeString(src)
}

func (p *Context) htmlUnescape(src string) string {
	return html.UnescapeString(src)
}

func (p *Context) urlEncode(link string) string {
	link = p.Parse(link)
	if !strings.Contains(link, "?") {
		return link
	}
	urls := strings.SplitN(link, "?", 2)
	query, err := url.ParseQuery(urls[1])
	if err != nil {
		dlog.Warn("url encode:%s", err.Error())
		return link
	}
	params := query.Encode()

	encodeLinek := urls[0] + "?" + params
	return encodeLinek
}

func (p *Context) RegexMatch(regex, s string) bool {
	re := regexp.MustCompile(regex)
	result := re.FindAllString(s, -1)
	if len(result) == 0 {
		return false
	} else {
		return true
	}
}

func (p *Context) readCasper() string {
	if p.CJS == nil {
		return ""
	}
	b := p.CJS.ReadChan()
	if len(string(b)) < 500 {
		dlog.Warn("read from casperjs: %s", string(b))
	} else {
		dlog.Warn("read from casperjs len: %d", len(string(b)))
	}
	return string(b)
}

func (p *Context) writeCasper(line string) bool {
	if p.CJS == nil {
		return false
	}
	p.CJS.WriteChan([]byte(line))
	dlog.Warn("write to casperjs: %s", line)
	return true
}

func (p *Context) addString(key string, other string) string {
	oldString := ""
	if v, ok := p.Data[key]; ok {
		if val, ok2 := v.(string); ok2 {
			oldString = val
		}
	}
	var newString = oldString + other
	p.Data[key] = newString
	return newString
}

func (p *Context) notEmpty(key string) bool {
	if v, ok := p.Data[key]; ok {
		if v == nil {
			return false
		}
		if val, ok2 := v.(string); ok2 {
			if len(val) == 0 {
				return false
			}
		}
		return true
	}
	return false
}

func (p *Context) empty(key string) bool {
	if v, ok := p.Data[key]; ok {
		if v == nil {
			return true
		}
		if val, ok2 := v.(string); ok2 {
			if len(val) == 0 {
				return true
			}
		}
		return false
	}
	return true
}

func (p *Context) addValue(key string, val int) bool {
	if v, ok := p.Data[key]; ok {
		if vint, ok2 := v.(int); ok2 {
			p.Data[key] = vint + val
		} else {
			return false
		}
	} else {
		p.Data[key] = val
	}
	dlog.Warn("%s context add value %s: %d", p.Data["_id"], key, p.Data[key])
	return true
}

func (p *Context) extractHtml(query, body string) interface{} {
	ret, err := extractor.Extract([]byte(body), query, "html", p)
	if err != nil {
		dlog.Warn("%s extract query: %v, error: %v", p.Data["_id"], query, err)
		ret = ""
	}
	if ret == nil {
		p.Data["_tmp"] = ""
		return ""
	}
	p.Data["_tmp"] = ret
	return ret
}

func (p *Context) extractJson(query, body string) interface{} {
	ret, err := extractor.Extract([]byte(body), query, "json", p)
	if err != nil {
		dlog.Warn("%s extract query: %v, error: %v", p.Data["_id"], query, err)
		ret = ""
	}
	if ret == nil {
		p.Data["_tmp"] = ""
		return ""
	}
	p.Data["_tmp"] = ret
	return ret
}

func (p *Context) extractJsonp(query, body string) interface{} {
	jsonp := jsonpath.FilterJSONP(body)
	ret, err := extractor.Extract([]byte(jsonp), query, "json", p)
	if err != nil {
		dlog.Warn("%s extract error of query [%s] body (%s)(%s): %v", p.Data["_id"], query, body, jsonp, err)
		ret = ""
	}
	if ret == nil {
		p.Data["_tmp"] = ""
		return ""
	}
	p.Data["_tmp"] = ret
	return ret
}

func (p *Context) extractRegex(query, body string) interface{} {
	ret, err := extractor.Extract([]byte(body), query, "regex", p)
	if err != nil {
		dlog.Warn("%s extract query: %v, error: %v", p.Data["_id"], query, err)
		ret = ""
	}
	if ret == nil {
		p.Data["_tmp"] = ""
		return ""
	}
	p.Data["_tmp"] = ret
	return ret
}

func (p *Context) extractRegexReplace(query, replace, body string) interface{} {
	re := regexp.MustCompile(query)
	result := re.ReplaceAllString(body, replace)
	return result
}

func (p *Context) Parse(text string) string {
	t, err := p.newEmptyTemplate().Parse(text)
	if err != nil {
		dlog.Warn("%s parse %s error: %v", p.Data["_id"], text, err)
		return ""
	}
	buf := bytes.NewBufferString("")
	t.Execute(buf, p.Data)
	return buf.String()
}

func (p *Context) setParams(k string) bool {
	tks := strings.Split(k[11:], "|")
	dlog.Warn("setParams: %v", tks)
	for _, tk := range tks {
		kv := strings.Split(tk, ":")
		if len(kv) == 2 {
			p.Set(kv[0], kv[1])
		}
	}
	return true
}

func (p *Context) Set(k string, v interface{}) {
	if sv, ok := v.([]string); ok {
		if kv, ok1 := p.Get(k); ok1 {
			if av, ok2 := kv.([]string); ok2 {
				av = append(av, sv[:len(sv)]...)
				p.Data[k] = av
				return
			}
		}
	}

	if si, ok := v.([]interface{}); ok {
		if kv, ok1 := p.Get(k); ok1 {
			if sit, ok2 := kv.([]interface{}); ok2 {
				sit = append(sit, si[:len(si)]...)
				p.Data[k] = sit
				return
			}
		}
	}

	p.Data[k] = v
}

func (p *Context) setValue(k string, v interface{}) interface{} {
	p.Set(k, v)
	vv, is := v.(string)
	if k != "_body" && is && len(vv) != 0 && len(vv) < 300 {
		dlog.Info("%s context set %s: %v", p.Data["_id"], k, v)
	} else if is && len(vv) >= 700 {
		dlog.Warn("%s context set %s and len(%s): %d", p.Data["_id"], k, k, len(vv))
	}

	if iv, ok := v.(int); ok {
		dlog.Info("%s context set %s: %d", p.Data["_id"], k, iv)
	}
	return v
}

func (p *Context) Get(k string) (interface{}, bool) {
	ret, ok := p.Data[k]
	return ret, ok
}

func (p *Context) getValue(k string) interface{} {
	if v, ok := p.Data[k]; ok {
		return v
	}
	return ""
}

func (p *Context) Del(k string) {
	delete(p.Data, k)
}

func (p *Context) del(k string) bool {
	if _, ok := p.Data[k]; ok {
		delete(p.Data, k)
		return true
	}
	return false
}

func (p *Context) BatchDel(ks []string) {
	for _, k := range ks {
		p.Del(k)
	}
}

func getNewsTitle(body string) string {
	if len(body) == 0 {
		return ""
	}

	re := regexp.MustCompile("<title>(.*)</title>")
	result := re.FindAllStringSubmatch(body, -1)
	if result != nil && len(result) > 0 {
		title := result[0][0]
		if len(result[0]) > 1 {
			title = result[0][1]
		}

		title = parseTitle(result[0][1], "_")
		title = parseTitle(title, "|")
		return title
	}
	return ""
}

func parseTitle(title, convert string) string {
	index := strings.Index(title, convert)
	if index > 0 {
		title = title[0:index]
	}
	return title
}

func getNewsTime(body string) string {
	if len(body) == 0 {
		return ""
	}

	regex := [9]string{
		"([0-9]{2,4}-[0-9]{1,2}-[0-9]{1,2} [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2})",
		"([0-9]{2,4}-[0-9]{1,2}-[0-9]{1,2} [0-9]{1,2}:[0-9]{1,2})",
		"([0-9]{2,4}-[0-9]{1,2}-[0-9]{1,2})",
		"([0-9]{2,4}年[0-9]{1,2}月[0-9]{1,2}日 [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2})",
		"([0-9]{2,4}年[0-9]{1,2}月[0-9]{1,2}日 [0-9]{1,2}:[0-9]{1,2})",
		"([0-9]{2,4}年[0-9]{1,2}月[0-9]{1,2}日)",
		"([0-9]{2,4}.[0-9]{1,2}.[0-9]{1,2} [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2})",
		"([0-9]{2,4}.[0-9]{1,2}.[0-9]{1,2} [0-9]{1,2}:[0-9]{1,2})",
		"([0-9]{2,4}.[0-9]{1,2}.[0-9]{1,2})",
	}
	for _, rg := range regex {
		re := regexp.MustCompile(rg)
		result := re.FindAllStringSubmatch(body, -1)
		if result != nil && len(result) > 0 {
			uptime := result[0][0]
			if len(result[0]) > 0 {
				uptime = result[0][1]
			}
			return uptime
		}
	}
	return ""
}

func getNewsContent(body string) string {
	ext, err := html2article.NewFromHtml(body)
	if err != nil {
		dlog.Warn("new html to article error: %v", err)
		return ""
	}

	article, err := ext.ToArticle()
	if err != nil {
		dlog.Warn("get article error: %v", err)
		return ""
	}

	content := article.Content
	content = strings.Replace(content, "\t", "", -1)
	content = strings.Replace(content, "\n", "", -1)
	content = strings.TrimSpace(content)
	return content
}

func getLinksContent(body string) string {
	reg := regexp.MustCompile("(?is)<script.*?>.*?</script>")
	buf := reg.ReplaceAllString(body, "")
	reg = regexp.MustCompile("(?is)<style.*?>.*?</style>")
	buf = reg.ReplaceAllString(buf, "")
	reg = regexp.MustCompile("(?is)<noscript.*?>.*?</noscript>")
	buf = reg.ReplaceAllString(buf, "")
	reg = regexp.MustCompile("(?is)<!--.*?-->")
	buf = reg.ReplaceAllString(buf, "")
	doc, err := goquery.NewDocumentFromReader(bytes.NewReader([]byte(buf)))
	if err != nil {
		dlog.Warn("goquery new document from reader error: %v", err)
		return ""
	}

	selector := doc.First().Find("body").First()
	content := parseContent(selector).Text()
	content = strings.Replace(content, "\t", "", -1)
	content = strings.Replace(content, "\n", "", -1)
	content = strings.TrimSpace(content)
	return content
}

func parseContent(selection *goquery.Selection) *goquery.Selection {
	size := selection.Find("*").Size()
	if size > 0 {
		limit := 0
		selection.Find("*").EachWithBreak(func(i int, s *goquery.Selection) bool {
			if len(s.Text()) == 0 {
				s.Remove()
			} else {
				links := s.Find("a[href]").Size()
				text := s.Text()
				words := len(text)
				signs := 0
				sign := [17]string{",", "，", ";", "；", ".", "。", "'", "‘", "’", "?", "？", ":", "：", "、", "\"", "“", "”"}
				for _, sg := range sign {
					sp := strings.Split(text, sg)
					signs += len(sp) - 1
				}

				if signs < 1 {
					s.Remove()
				} else if float64(links)/float64(words) > 0.2 {
					s.Remove()
				}
			}

			limit += 1
			if limit > 30000 {
				return false
			}
			return true
		})
	}
	return selection
}

func trimSpace(content string) string {
	content = strings.Replace(content, "\t", "", -1)
	content = strings.Replace(content, "\n", "", -1)
	content = strings.TrimSpace(content)
	return content
}

func addParagraph(content, body string) string {
	doc, err := goquery.NewDocumentFromReader(bytes.NewReader([]byte(body)))
	if err != nil {
		return content
	}

	selector := doc.First()
	selector.Find("body p").Each(func(i int, s *goquery.Selection) {
		text := strings.TrimSpace(s.Text())
		if len(text) > 0 {
			if len(text) > 10 {
				text = text[len(text)-10:]
			}

			index := findIndex(text, content)
			if index >= 0 {
				content = content[0:index+len(text)] + "<br>" + content[index+len(text):]
			}
		}
	})
	return content
}

func findIndex(text, content string) int {
	for i := len(text); i <= len(content); i++ {
		ret := content[i-len(text) : i]
		if i+4 < len(content) && content[i:i+4] != "<br>" && text == ret {
			return i - len(text)
		}
	}
	return -1
}

func (p *Context) removeTag(selector, body string) string {
	doc, err := goquery.NewDocumentFromReader(bytes.NewReader([]byte(body)))
	if err != nil {
		dlog.Warn("%s create doc err when remove tag %s: %v", p.Data["_id"], selector, err)
		return body
	}
	doc.Find(selector).Each(func(_ int, tag *goquery.Selection) {
		tag.Remove()
	})
	html, err := doc.Html()
	if err != nil {
		dlog.Warn("%s remove tag %s err: %v", p.Data["_id"], selector, err)
		return body
	}
	return html
}

func (p *Context) addTag(selector, v, body string) string {
	doc, err := goquery.NewDocumentFromReader(bytes.NewReader([]byte(body)))
	if err != nil {
		dlog.Warn("%s create doc err when add tag %s: %v", p.Data["_id"], selector, err)
		return body
	}
	doc.Find(selector).AppendHtml(v)
	html, err := doc.Html()
	if err != nil {
		dlog.Warn("%s add tag %s err: %v", p.Data["_id"], selector, err)
		return body
	}
	return html
}

func (p *Context) editTag(selector, attr, attr1, body string) string {
	doc, err := goquery.NewDocumentFromReader(bytes.NewReader([]byte(body)))
	if err != nil {
		dlog.Warn("%s create doc err when edit tag %s: %v", p.Data["_id"], selector, err)
		return body
	}
	doc.Find(selector).Each(func(_ int, tag *goquery.Selection) {
		if string(attr1[0]) == "@" {
			v, exists := tag.Attr(attr1[1:])
			if exists {
				tag.SetAttr(attr, v)
			}
		} else {
			tag.SetAttr(attr, attr1)
		}
	})
	html, err := doc.Html()
	if err != nil {
		dlog.Warn("%s edit tag %s err: %v", p.Data["_id"], selector, err)
		return body
	}
	return html
}

func (p *Context) trimContent(filter, content string) string {
	if len([]rune(content)) <= 500 {
		return ""
	}

	prefixes := strings.Split(filter, ";")
	flag := false
	if len(prefixes) > 0 {
		outerPrefixes := strings.Split(prefixes[0], ",")
		for _, outPrefix := range outerPrefixes {
			if match, _ := regexp.MatchString(outPrefix, content); match {
				flag = true
				break
			}
		}
	}

	if flag { //需要裁剪掉第一句
		idx := strings.IndexAny(content, "？。！")
		if idx > 0 {
			//注意unicode占三个字节
			content = content[idx+3:]
		}
		flag = false
		if len(prefixes) == 2 {
			innerPrefixes := strings.Split(prefixes[1], ",")
			for _, innerPrefix := range innerPrefixes {
				if match, _ := regexp.MatchString(innerPrefix, content); match {
					flag = true
					break
				}
			}
		}
		if flag {
			idx := strings.IndexAny(content, "？。！")
			if idx > 0 {
				//注意unicode占三个字节
				content = content[idx+3:]
			}
		}
	}
	index := strings.IndexAny(content, "？。！")
	if -1 == index {
		return ""
	}
	if 600 < index {
		return content[:600] + "..."
	}
	return content[:index]
}

func (p *Context) extractWxid(content string) string {
	return content[strings.LastIndex(content, "/")+1:]
}

func getUrlParam(k, link string) string {
	u, err := url.Parse(link)
	if err != nil {
		dlog.Warn("parse url: %s err!\n%v", link, err)
		return ""
	}
	m, err := url.ParseQuery(u.RawQuery)
	return m[k][0]
}

func (p *Context) replace(content, old, new string) string {
	newString := strings.Replace(content, old, new, 1)
	return newString
}
