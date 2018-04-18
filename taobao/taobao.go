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
	"github.com/cugbliwei/authspider/util"
	"github.com/cugbliwei/dlog"
)

func getSingleFormValue(form url.Values) map[string]string {
	res := make(map[string]string)
	for k, _ := range form {
		res[k] = form.Get(k)
	}
	return res
}

func getSingleHeaderValue(headers http.Header) map[string]string {
	res := make(map[string]string)
	for k, _ := range headers {
		res[k] = headers.Get(k)
	}
	return res
}

func TaobaoLoginPage(w http.ResponseWriter, r *http.Request) {
	dlog.Info("call aliexpress login page")
	loginUrl := "https://login.taobao.com/member/login.jhtml?tpl_redirect_url=https%3A%2F%2Fwww.taobao.com%2F&style=miniall&enup=true&newMini2=true&full_redirect=true&sub=true&from=taobao&allp=assets_css%3D3.0.5/login_pc.css&pms=1489128076423"

	req, _ := http.NewRequest("GET", loginUrl, nil)
	req.Header.Set("Refer", "https://login.taobao.com")
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
		dlog.Error("error fetching taobao login page: %v", err)
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
		dlog.Error("error reading taobao login page body: %v", err)
		w.WriteHeader(200)
		w.Write([]byte("请刷新重试"))
		return
	}
	dlog.Info("read login page size: %d", cnt)
	result := replacePath(buff.String())
	dlog.Info("page size after replacing js: %d", len(result))
	io.Copy(w, bytes.NewBufferString(result))
}

func replacePath(body string) string {
	body = strings.Replace(body, "/member/request_nick_check.do", "./member/request_nick_check.do", 1)
	//update form.action
	body = strings.Replace(body, "\"/member/login.jhtml", "\"./member/login.jhtml", 1)
	body = strings.Replace(body, "disableQuickLogin:false", "disableQuickLogin:true", 1)
	body = strings.Replace(body, "shownQRCode: true", "shownQRCode: false", 1)
	body = strings.Replace(body, "shownQRCode:true", "shownQRCode: false", 1)

	newhidden := "sub_jump\" value=\"\"/><input type='hidden' name='plt' id=\"plt"
	body = strings.Replace(body, "sub_jump", newhidden, 1)

	newjs := "<script>document.addEventListener('DOMContentLoaded', function () {"
	newjs += "document.getElementById('TPL_password_1').addEventListener('change', function(){"
	newjs += "document.getElementById('plt').value=this.value;"
	newjs += "});});</script></body>"
	body = strings.Replace(body, "</body>", newjs, 1)
	return body
}

func TaobaoLoginCheck(w http.ResponseWriter, r *http.Request) {
	dlog.Println("call TaobaoLoginCheck:", r.Host, "|", r.RemoteAddr, r.RequestURI)
	tmpl := "taobao_false"
	if strings.Contains(r.RequestURI, "tmall.com") {
		tmpl = "tmall_false"
	}

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
	username := r.FormValue("TPL_username")
	r.Form.Set("TPL_username", util.GbkToUtf8(username))
	username = r.FormValue("TPL_username")
	dlog.Warn("username.len=%d, %s", len(username), username)

	// encode ua field once again
	oldUa := r.FormValue("ua")
	r.Form.Set("ua", url.QueryEscape(oldUa))

	r.Header.Set("Refer", "https://login.taobao.com/member/login.jhtml?redirectURL=https%3A%2F%2Fwww.taobao.com%2F")
	r.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:51.0) Gecko/20100101 Firefox/51.0")
	r.Header.Set("Origin", "https://login.taobao.com/member/login.jhtml")
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
		w.Header().Set("Content-Type", "text/html;charset=GBK")
		w.WriteHeader(200)
		//body := strings.Replace(result["data"], "checkUserNameURL:\"/member/request_nick_check.do", "checkUserNameURL:\"request_nick_check.do", 1)
		//body = strings.Replace(body, "<form action=\"/member/login.jhtml", "<form action=\"login.jhtml", 1)
		//below two lines should be together
		body := replacePath(result["data"])
		body = strings.Replace(body, "./member/login.jhtml", "login.jhtml", 1)
		gbkstr := util.Utf8ToGbk(body)
		w.Write([]byte(gbkstr))
	} else if result["status"] == "fail" {
		w.Header().Set("Content-Type", "text/html;charset=UTF-8")
		w.WriteHeader(200)
		w.Write([]byte(result["data"]))
	} else {
		crawlUrl := baseUrl + "site/blank.html?id=" + result["id"]
		dlog.Warn("will redirect to:%v", crawlUrl)
		http.Redirect(w, r, crawlUrl, 302)
	}
}

func TaobaoNickCheck(w http.ResponseWriter, r *http.Request) {
	dlog.Warn("call TaobaoNickCheck")
	link := "https://login.taobao.com/member/request_nick_check.do?_input_charset=utf-8"
	req, _ := http.NewRequest("POST", link, r.Body)
	req.Header.Set("Refer", "https://login.taobao.com/member/login.jhtml")
	req.Header.Set("X-Requested-With", "XMLHttpRequest")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:51.0) Gecko/20100101 Firefox/51.0")
	req.Header.Set("Origin", "https://login.taobao.com")
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
	cnt, err := w.Write(body)
	dlog.Warn("write res:%d, %v", cnt, err)
}
