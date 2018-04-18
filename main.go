package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	_ "net/http/pprof"
	"net/url"
	"os"
	"os/exec"
	"runtime"
	"runtime/debug"
	"strconv"
	"strings"

	"github.com/cugbliwei/authspider/cmd"
	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/authspider/cookie"
	"github.com/cugbliwei/authspider/extractor"
	httputil "github.com/cugbliwei/authspider/http"
	hproxy "github.com/cugbliwei/authspider/proxy"
	hrecord "github.com/cugbliwei/authspider/record"
	"github.com/cugbliwei/authspider/sql"
	"github.com/cugbliwei/authspider/taobao"
	"github.com/cugbliwei/authspider/task"
	"github.com/cugbliwei/dlog"
)

var health bool

func init() {
	health = true
}

func HandleHealth(w http.ResponseWriter, req *http.Request) {
	if health {
		fmt.Fprint(w, "yes")
	} else {
		http.Error(w, "no", http.StatusNotFound)
	}
}

func HandleStart(w http.ResponseWriter, req *http.Request) {
	health = true
	fmt.Fprint(w, "ok")
}

func HandleShutdown(w http.ResponseWriter, req *http.Request) {
	health = false
	fmt.Fprint(w, "ok")
}

func GetConfig(w http.ResponseWriter, req *http.Request) {
	ret := map[string]interface{}{}
	req.ParseForm()
	tmpl := req.FormValue("tmpl")
	new := req.FormValue("new")
	var ts *task.Task
	var ts1 *task.Task1
	if len(tmpl) > 0 {
		if len(new) == 0 {
			tmpl = tmpl + "2"
			dlog.Warn("get from old config tmpl: %v", tmpl)
			ts1 = task.TaskInstance1.Get1(tmpl)
		} else {
			ts = task.TaskInstance.Get(tmpl)
		}
	}

	if len(new) == 0 {
		ret["task"] = ts1
		ret["stat"] = (ts1 != nil)
	} else {
		ret["task"] = ts
		ret["stat"] = (ts != nil)
	}

	result, _ := json.Marshal(ret)
	fmt.Fprint(w, string(result))
}

func GetResult(w http.ResponseWriter, req *http.Request) {
	req.ParseForm()
	key := req.FormValue("key")
	result, err := sql.GetFromMixRedis(key)
	if err != nil {
		dlog.Warn("get result from cluster redis error: %s", err.Error())
		fmt.Fprint(w, "error")
		return
	}
	fmt.Fprint(w, result)
}

func GetFromRedis(w http.ResponseWriter, req *http.Request) {
	req.ParseForm()
	key := req.FormValue("key")
	result, err := sql.GetFromRedis(key)
	if err != nil {
		dlog.Warn("get key: %s from redis error: %s", key, err.Error())
		fmt.Fprint(w, "")
		return
	}
	fmt.Fprint(w, result)
}

func PostResult(w http.ResponseWriter, req *http.Request) {
	req.ParseForm()
	key := req.FormValue("key")
	result := req.FormValue("result")
	timeout := req.FormValue("timeout")
	to, _ := strconv.Atoi(timeout)
	if err := sql.WriteToMixRedisGetError(key, result, to); err != nil {
		dlog.Warn("set result to cluste redis error: %v", err)
		fmt.Fprint(w, "error")
		return
	}
	fmt.Fprint(w, "ok")
}

func GetRandcode(w http.ResponseWriter, req *http.Request) {
	req.ParseForm()
	key := extractor.FindGroupByIndex("/randcode/([^\\.]+)", req.RequestURI, 1)
	base64val, err := sql.GetFromRedis(key)
	if err != nil {
		dlog.Warn("get randcode %s", err.Error())
		fmt.Fprint(w, "error")
		return
	}
	body, _ := base64.StdEncoding.DecodeString(base64val)
	w.Header().Set("Content-Type", "image/*")
	w.Write(body)
}

func SaveCaptcha(w http.ResponseWriter, req *http.Request) {
	req.ParseForm()
	tmpl := req.FormValue("tmpl")
	randcode := req.FormValue("randcode")
	randcode_base64 := req.FormValue("randcode_base64")
	body, _ := base64.StdEncoding.DecodeString(randcode_base64)
	filepath := "./captcha/" + tmpl + "/" + randcode + ".png"
	f, err := os.Create(filepath)
	if err != nil {
		dlog.Warn("os create filepath: %s, error: %v", filepath, err)
		fmt.Fprint(w, "no")
		return
	}

	f.Write(body)
	f.Close()

	fmt.Fprint(w, "ok")
}

func FormatCookie(w http.ResponseWriter, req *http.Request) {
	req.ParseForm()
	cookieJson := req.FormValue("cookie")
	tmpl := req.FormValue("tmpl")
	result := cookie.Instance.HandleCookie(cookieJson, tmpl)
	fmt.Fprint(w, string(result))
}

func ServerFormatCookie(w http.ResponseWriter, req *http.Request) {
	req.ParseForm()
	cookieJson := req.FormValue("cookie")
	tmpl := req.FormValue("tmpl")
	cookie := cookie.Instance.HandleCookie(cookieJson, tmpl)
	fmt.Fprint(w, base64.StdEncoding.EncodeToString(cookie))
}

func CookieCrawler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	cookieJson := r.FormValue("cookie")
	tmpl := r.FormValue("tmpl")
	result := cookie.Instance.HandleCookie(cookieJson, tmpl)
	resultCookie := base64.StdEncoding.EncodeToString(result)
	uparams := url.Values{}
	uparams.Set("cookie", string(resultCookie))
	req, err := http.NewRequest("POST", "http://authcrawler-test.yixin.com/submit?tmpl="+tmpl, strings.NewReader(uparams.Encode()))
	if err != nil {
		dlog.Warn("new request error: %v", err)
		return
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	c := hproxy.HttpClient(60)
	resp, err := c.Do(req)
	if err != nil {
		dlog.Warn("do request: %v", err)
		return
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		dlog.Warn("read response %s", err.Error())
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}

func HandleFile(w http.ResponseWriter, req *http.Request) {
	response := sql.WriteDataResponse{}
	req.ParseForm()
	file, _, err := req.FormFile("file")
	if err != nil {
		dlog.Error("receive file: %s, length: %d, url: %s", err.Error(), req.ContentLength, req.RequestURI)
		response.Message = err.Error()
		respStr, _ := json.Marshal(&response)
		fmt.Fprint(w, string(respStr))
		return
	}
	defer file.Close()

	zipBody, err := ioutil.ReadAll(file)
	if err != nil {
		dlog.Error("read file: %s, length: %d, url: %s", err.Error(), req.ContentLength, req.RequestURI)
		response.Message = err.Error()
		respStr, _ := json.Marshal(&response)
		fmt.Fprint(w, string(respStr))
		return
	}

	response.Tmpl = req.FormValue("tmpl")
	response.Username = req.FormValue("username")
	if len(response.Tmpl) == 0 || len(response.Username) == 0 {
		response.Message = "invalid params"
		respStr, _ := json.Marshal(&response)
		fmt.Fprint(w, string(respStr))
		return
	}

	err = sql.WriteZip(response.Tmpl, response.Username, zipBody)
	if err != nil {
		response.Message = err.Error()
	} else {
		response.Status = true
	}

	respStr, _ := json.Marshal(&response)
	fmt.Fprint(w, string(respStr))
}

func writeData(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	tmpl := r.FormValue("tmpl")
	username := r.FormValue("username")
	data := r.FormValue("data")

	params := make(map[string]string, 1)
	params["tmpl"] = tmpl
	params["username"] = username
	params["data"] = data

	ci := httputil.HttpClient(60)
	ret := httputil.HttpPost(ci, config.Instance.FileSqlUrl, params)
	w.Header().Set("Content-Type", "application/json")
	w.Write(ret)
}

func mobileLog(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	logId := r.FormValue("id")
	logType := r.FormValue("type")
	logStr := r.FormValue("log")

	if logType == "Error" {
		dlog.Error("%s sdk crawler log: %s", logId, logStr)
	} else if logType == "Warn" {
		dlog.Warn("%s sdk crawler log: %s", logId, logStr)
	}

	fmt.Fprint(w, "ok")
}

func sendRecord(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	re := r.FormValue("record")
	record := &hrecord.Record{}
	if err := json.Unmarshal([]byte(re), &record); err != nil {
		dlog.Error("Unmarshal record error: %v", err)
		return
	}

	record.SendRecord(false)
	fmt.Fprint(w, "ok")
}

func restart(w http.ResponseWriter, r *http.Request) {
	cmd := exec.Command("/bin/sh", "-c", "cd /data/crawler/authcrawler-deploy && sh authcrawler_deploy.sh")
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		fmt.Fprint(w, "authcrawler restart error: "+err.Error())
		return
	}
	fmt.Fprint(w, "authcrawler restart success: "+out.String())
}

func getFromCacheHbase(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	rowkey := r.FormValue("rowkey")

	params := make(map[string]string, 4)
	result := make(map[string]string, 3)
	client := httputil.HttpClient(60)
	params["table"] = config.Instance.Hbase.Cache.Table
	params["family"] = config.Instance.Hbase.Cache.Family
	params["column"] = config.Instance.Hbase.Cache.Column
	params["rowkey"] = rowkey
	body := httputil.HttpPost(client, config.Instance.HbaseAddr+"/hbase/get", params)
	if err := json.Unmarshal(body, &result); err != nil {
		dlog.Error("get data from hbase json Unmarshal error: %v", err)
		fmt.Fprint(w, "")
	}

	status, ok := result["status"]
	data, ok1 := result["data"]
	if ok && status == "true" && ok1 {
		fmt.Fprint(w, data)
	}

	fmt.Fprint(w, "")
}

func main() {
	runtime.GOMAXPROCS(4)
	debug.SetGCPercent(70)
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	port := flag.String("port", "8001", "port number")
	flag.Parse()

	pm := hproxy.NewProxyManager()
	service := cmd.NewCasperServer(task.NewTaskCmdFactory(task.TaskInstance, pm))

	http.Handle("/submit", service)
	http.HandleFunc("/start", HandleStart)
	http.HandleFunc("/restart", restart)
	http.HandleFunc("/shutdown", HandleShutdown)
	http.HandleFunc("/health", HandleHealth)
	http.HandleFunc("/get/config", GetConfig)
	http.HandleFunc("/get/result", GetResult)
	http.HandleFunc("/post/result", PostResult)
	http.HandleFunc("/get/redis", GetFromRedis)
	http.HandleFunc("/randcode/", GetRandcode)
	http.HandleFunc("/save/captcha", SaveCaptcha)
	http.HandleFunc("/handle/file", HandleFile)
	http.HandleFunc("/write/data", writeData)
	http.HandleFunc("/format_cookie", FormatCookie)
	http.HandleFunc("/crawler/cookie", CookieCrawler)
	http.HandleFunc("/sdk/cookie", ServerFormatCookie)
	http.HandleFunc("/sdk/log", mobileLog)
	http.HandleFunc("/sdk/record", sendRecord)
	http.HandleFunc("/hbase/get", getFromCacheHbase)

	//about taobao login
	http.HandleFunc("/member/request_nick_check.do", taobao.TaobaoNickCheck)
	http.HandleFunc("/member/login.jhtml", taobao.TaobaoLoginCheck)
	http.Handle("/login.html", httputil.CustomCharsetHandler("GBK", http.FileServer(http.Dir("./site"))))
	//http.HandleFunc("/login.html", taobao.TaobaoLoginPage)
	http.Handle("/logintmall.html", httputil.CustomCharsetHandler("GBK", http.FileServer(http.Dir("./site"))))
	//about aliexpress login
	http.HandleFunc("/alogin.html", taobao.AliexpressLoginPage)
	http.HandleFunc("/account/check.do", taobao.AliexpressNickCheck)
	http.HandleFunc("/login.do", taobao.AliexpressLoginCheck)
	//about suning login
	http.HandleFunc("/suning/login.html", taobao.SuningLoginPage)
	http.HandleFunc("/suning/needVerifyCode", taobao.SuningNickCheck)
	http.HandleFunc("/suning/login", taobao.SuningLoginCheck)
	http.Handle("/site/",
		http.StripPrefix("/site/",
			http.FileServer(http.Dir("./site"))))
	http.Handle("/aliexpress/",
		http.StripPrefix("/aliexpress/",
			http.FileServer(http.Dir("./site"))))

	l, e := net.Listen("tcp", ":"+*port)
	if e != nil {
		dlog.Fatal("listen error: %v", e)
	}
	http.Serve(l, nil)
}
