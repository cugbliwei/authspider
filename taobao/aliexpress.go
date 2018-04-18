package taobao

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	_ "net/http/pprof"
	"net/url"
	"regexp"
	"strings"

	hproxy "github.com/cugbliwei/authspider/proxy"
	"github.com/cugbliwei/dlog"
)

func AliexpressLoginPage(w http.ResponseWriter, r *http.Request) {
	dlog.Info("call aliexpress login page")
	loginUrl := "https://passport.aliexpress.com/mini_login.htm?lang=en_us&appName=aebuyer&appEntrance=default&styleType=auto&bizParams=&notLoadSsoView=false&notKeepLogin=true&isMobile=false&rnd=0.9326077098800893"

	req, _ := http.NewRequest("GET", loginUrl, nil)
	req.Header.Set("Refer", "https://login.aliexpress.com/buyer.htm?spm=2114.11010108.1000002.7.m0Weqr&return=https%3A%2F%2Fwww.aliexpress.com%2F&random=F94E63B6D6AA294169B7065C166F4EF2")
	req.Header.Set("Origin", "https://login.taobao.com/member/login.jhtml")

	copyHeaders := []string{"Accept-Language", "Accept", "User-Agent", "Pragma", "Cache-Control", "Content-Type"}
	for idx, header := range copyHeaders {
		val := r.Header.Get(header)
		if len(val) > 0 {
			dlog.Info("set header: %d: %v -> %v\n", idx, header, val)
			req.Header.Set(header, val)
		}
	}

	c := hproxy.HttpClient(60)
	resp, err := c.Do(req)
	if err != nil {
		dlog.Error("error fetching aliexpress login page: %v", err)
		w.WriteHeader(200)
		w.Write([]byte("请刷新重试"))
		return
	}
	defer resp.Body.Close()

	for hname, _ := range resp.Header {
		w.Header().Set(hname, resp.Header.Get(hname))
	}
	w.Header().Del("X-Frame-Options")

	var buff bytes.Buffer
	cnt, err := io.Copy(&buff, resp.Body)
	if err != nil {
		dlog.Error("error reading aliexpress login page body: %v", err)
		w.WriteHeader(200)
		w.Write([]byte("请刷新重试"))
		return
	}
	dlog.Info("read login page size: %d", cnt)
	result := replaceJs(buff.String())
	dlog.Info("page size after replacing js: %d", len(result))
	io.Copy(w, bytes.NewBufferString(result))
}

func replaceJs(body string) string {
	re1 := regexp.MustCompile("(https://aeis\\.alicdn\\.com.*)mini\\-login\\-min\\.js")
	re2 := regexp.MustCompile("(//aeis\\.alicdn\\.com.*)nc\\_ae\\.js")
	re3 := regexp.MustCompile("(<.*Forgot Password.*>)")
	original, temp := body, ""
	temp = re1.ReplaceAllString(original, "aliexpress/mini-login-min.js")
	if len(temp) == len(original) {
		dlog.Println("replace with my own js failed: mini-login-min.js")
	}
	original = temp
	temp = re2.ReplaceAllString(original, "aliexpress/nc_ae.js")
	if len(temp) == len(original) {
		dlog.Println("replace with my own js failed: nc-ae.js")
	}
	original = temp
	temp = re3.ReplaceAllString(original, "")
	//insert css rule to hide qr login button
	temp = strings.Replace(temp, "J_Static2Quick", "J_Static2Quick\" style=\"display: none", 1)
	return temp
}

// send real login request to aliexpress steps
func AliexpressLoginCheck(w http.ResponseWriter, r *http.Request) {
	dlog.Println("call AliexpressLoginCheck:", r.Host, "|", r.RemoteAddr, r.RequestURI)
	tmpl := "aliexpress"

	refer, baseUrl := r.Header.Get("Referer"), "http://localhost:8001/"
	dlog.Info("refer=%s", refer)
	i := strings.Index(refer, "member/login.jhtml")
	if i < 0 {
		i = strings.Index(refer, "login.html")
	}
	if i < 0 {
		i = strings.Index(refer, "logintmall.html")
	}
	if i > -1 {
		baseUrl = refer[0:i]
	}

	r.ParseForm()

	r.Header.Set("Referer", "https://passport.aliexpress.com/mini_login.htm?lang=en_us&appName=aebuyer&appEntrance=default&styleType=auto&bizParams=&notLoadSsoView=false&notKeepLogin=true&isMobile=false&rnd=0.437913531491571")
	r.Header.Set("Origin", "https://passport.aliexpress.com")
	r.Header.Set("x-requested-with", "XMLHttpRequest")

	// encode ua field once again
	oldUa := r.FormValue("ua")
	r.Form.Set("ua", url.QueryEscape(oldUa))

	params := url.Values{}
	bs, _ := json.Marshal(getSingleFormValue(r.Form))
	params.Set("body", string(bs))
	bs, _ = json.Marshal(getSingleHeaderValue(r.Header))
	params.Set("headers", string(bs))

	port := "8001"
	portflag := flag.Lookup("port")
	if portflag != nil {
		port = portflag.Value.String()
	}
	link := fmt.Sprintf("http://127.0.0.1:%s/submit?tmpl=%s", port, tmpl)
	dlog.Warn("will post:link:%s, %v", link, params.Encode())
	req, _ := http.NewRequest("POST", link, bytes.NewReader([]byte(params.Encode())))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	dlog.Warn("will do request, and tmpl=%s", tmpl)
	c := hproxy.HttpClient(60)
	resp, err := c.Do(req)
	if err != nil {
		dlog.Warn("do login http post error: %s", err.Error())
		return
	}
	dlog.Warn("do post ok")
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	dlog.Warn("response from submit: %v", string(body))
	if err != nil {
		dlog.Warn("read response %s", err.Error())
		return
	}

	result := make(map[string]string)
	json.Unmarshal(body, &result)

	if result["status"] == "raw_response" {
		w.Header().Set("Content-Type", "text/javascript;charset=UTF-8")
		w.WriteHeader(200)
		w.Write([]byte(result["data"]))
	} else if result["status"] == "success" {
		crawlUrl := baseUrl + "site/blank.html?id=" + result["id"]
		dlog.Warn("will redirect to:%v", crawlUrl)
		http.Redirect(w, r, crawlUrl, 302)
	} else {
		dlog.Error("unexpected response: %#v", result)
	}
}

func AliexpressNickCheck(w http.ResponseWriter, r *http.Request) {
	dlog.Warn("call AliexpressNickCheck")
	link := "https://passport.aliexpress.com/newlogin/account/check.do?fromSite=4"
	//link := "http://localhost:9000/newlogin/account/check.do?fromSite=4"
	req, _ := http.NewRequest("POST", link, r.Body)
	req.Header.Set("Refer", "https://passport.aliexpress.com/mini_login.htm?lang=en_us&appName=aebuyer&appEntrance=default&styleType=auto&bizParams=&notLoadSsoView=false&notKeepLogin=true&isMobile=false&rnd=0.437913531491571")
	req.Header.Set("Origin", "https://passport.aliexpress.com")

	copyHeaders := []string{"Accept-Language", "Accept", "User-Agent", "Accept-Encoding", "Cookie", "Connection", "Pragma", "X-Requested-With", "Cache-Control", "Content-Type"}
	for idx, header := range copyHeaders {
		val := r.Header.Get(header)
		if len(val) > 0 {
			dlog.Info("set header: %d: %v -> %v\n", idx, header, val)
			req.Header.Set(header, val)
		}
	}

	c := hproxy.HttpClient(60)
	resp, err := c.Do(req)
	if err != nil {
		dlog.Warn("http get %s", err.Error())
		w.Write([]byte("{\"needcode\":false}"))
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		dlog.Warn("read response %s", err.Error())
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	cnt, err := w.Write(body)
	dlog.Warn("write res:[%s]/%d, %v", string(body), cnt, err)
}
