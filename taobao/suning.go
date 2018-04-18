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
	"strings"

	hproxy "github.com/cugbliwei/authspider/proxy"
	"github.com/cugbliwei/dlog"
)

func SuningLoginPage(w http.ResponseWriter, r *http.Request) {
	loginUrl := "https://mpassport.suning.com/ids/login"
	req, _ := http.NewRequest("GET", loginUrl, nil)
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
		dlog.Error("error fetching suning login page: %v", err)
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
		dlog.Error("error reading suning login page body: %v", err)
		w.WriteHeader(200)
		w.Write([]byte("请返回重试"))
		return
	}
	dlog.Info("read login page size: %d", cnt)
	result := replaceSessionInfo(buff.String())
	if strings.Index(r.RequestURI, "mobile") > -1 {
		// comes from mobile page
		result = strings.Replace(result, "{{from_placeholder}}", "mobile", 1)
	} else {
		result = strings.Replace(result, "{{from_placeholder}}", "0", 1)
	}
	dlog.Info("page size after replacing js: %d", len(result))
	io.Copy(w, bytes.NewBufferString(result))
}

func replaceSessionInfo(body string) string {
	tmplLoginPageBody, err := ioutil.ReadFile("site/suning/login.html")
	if err != nil {
		dlog.Error("can not read file: site/suning/login.html, %v", err)
		return ""
	}
	// extract fresh uuid from body
	i := strings.Index(body, "uuid=")
	uuid := ""
	if i > -1 {
		j := strings.Index(body[i:], "\"")
		if j > -1 {
			uuid = body[i+5 : i+j]
		}
	}
	if len(uuid) < 1 {
		i = strings.Index(body, "uuid:'")
		if i > -1 {
			j := strings.Index(body[i:], "'")
			if j > -1 {
				uuid = body[i+6 : i+j]
			}
		}
	}
	if len(uuid) < 1 {
		dlog.Error("can not find uuid in login page!!!")
		return ""
	}
	dlog.Info("suning login page uuid=%v", uuid)
	result := strings.Replace(string(tmplLoginPageBody), "{{uuid_placeholder}}", uuid, -1)
	return result
}

func SuningLoginCheck(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		http.Redirect(w, r, "login.html", 302)
		return
	}

	r.ParseForm()
	from := r.FormValue("cefrom")
	referer := r.Header.Get("Referer")
	dlog.Info("SuningLoginCheck: host=%v, remoteAddr=%v, requestUri=%v, referer=%v, from=%v", r.Host, r.RemoteAddr, r.RequestURI, referer, from)
	r.Form.Del("cefrom")

	tmplName := "sdk_suning_shop"
	if strings.Contains(from, "mobile") {
		tmplName = "suning_shop"
	}

	oldPassword2 := r.FormValue("password2")
	r.Form.Set("password2", url.QueryEscape(oldPassword2))

	r.Header.Set("Referer", "https://mpassport.suning.com/ids/login")
	r.Header.Set("Origin", "null")
	r.Header.Set("Content-Type", "application/x-www-form-urlencoded")

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
	link := fmt.Sprintf("http://127.0.0.1:%s/submit?tmpl=%s", port, tmplName)
	dlog.Warn("will post: link=%s, body=%v", link, params.Encode())
	req, _ := http.NewRequest("POST", link, bytes.NewReader([]byte(params.Encode())))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	c := hproxy.HttpClient(60)
	resp, err := c.Do(req)
	if err != nil {
		dlog.Warn("do login http post error: %s", err.Error())
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	dlog.Warn("suning response from login submit: %v", string(body))
	if err != nil {
		dlog.Warn("read response error: %s", err.Error())
		return
	}

	result, data := make(map[string]string), make(map[string]string)
	err = json.Unmarshal(body, &result)
	if err != nil {
		dlog.Error("suning unmarshal error: cnt=%v, err=%v", body, err)
		return
	}

	if result["status"] == "fail" {
		w.Header().Set("Content-Type", "text/html;charset=UTF-8")
		w.WriteHeader(200)
		//below two lines should be together
		err = json.Unmarshal([]byte(result["data"]), &data)
		if err != nil {
			dlog.Error("unmarshal data field failed: cont=%v, err=%v", result["data"], err)
			return
		}
		tmplLoginPageBody, err := ioutil.ReadFile("site/suning/login.html")
		if err != nil {
			dlog.Error("can not read file: site/suning/login.html, %v", err)
			return
		}
		result := strings.Replace(string(tmplLoginPageBody), "{{uuid_placeholder}}", data["uuid"], -1)
		result = strings.Replace(result, "snMemberErrorCode:''", "snMemberErrorCode:'"+data["snMemberErrorCode"]+"'", -1)
		result = strings.Replace(result, "errorCode:''", "errorCode:'"+data["errorCode"]+"'", -1)
		result = strings.Replace(result, "needVerify:true", "needVerify:"+data["needVerify"], -1)
		if strings.Contains(from, "mobile") {
			result = strings.Replace(result, "{{from_placeholder}}", from, 1)
		} else {
			result = strings.Replace(result, "{{from_placeholder}}", "0", 1)
		}
		w.Write([]byte(result))
	} else if result["status"] == "will_password2" {
		requestUrl := r.RequestURI
		if len(referer) > 10 {
			requestUrl = referer
		}
		crawlUrl := getRedirectUrl(requestUrl, from) + "?id=" + result["id"]
		dlog.Warn("will redirect to: %v", crawlUrl)
		http.Redirect(w, r, crawlUrl, 302)
	}
}

// 计算跳转url，如果来自手机html5跳到blank.html
func getRedirectUrl(rurl string, from string) string {
	baseurl, err := url.Parse(rurl)
	if err != nil {
		fmt.Println(err)
		return "../site/crawl.html"
	}
	var desturl *url.URL
	if strings.Contains(from, "mobile") {
		desturl, err = url.Parse("../site/blank.html")
	} else {
		desturl, err = url.Parse("../site/crawl.html")
	}
	newurl := baseurl.ResolveReference(desturl)
	return newurl.Path
}

// check if verify code is needed
func SuningNickCheck(w http.ResponseWriter, r *http.Request) {
	dlog.Warn("call SuningNickCheck")
	link := "https://mpassport.suning.com/ids/needVerifyCode"
	req, _ := http.NewRequest("POST", link, r.Body)

	req.Header.Set("Cookie", r.Header.Get("Cookie"))
	req.Header.Set("Refer", "https://mpassport.suning.com/ids/login")
	req.Header.Set("X-Requested-With", "XMLHttpRequest")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:51.0) Gecko/20100101 Firefox/51.0")
	c := hproxy.HttpClient(60)
	resp, err := c.Do(req)
	if err != nil {
		dlog.Warn("error when http get %s", err.Error())
		w.Write([]byte("{\"needVerifyCode\":false}"))
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		dlog.Warn("read response %s", err.Error())
		return
	}
	cnt, err := w.Write(body)
	dlog.Warn("write res=%s, length=%d, error=%v", body, cnt, err)
}
