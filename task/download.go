package task

import (
	"bytes"
	"compress/gzip"
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"math/rand"
	"mime/multipart"
	"net"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/axgle/mahonia"
	"github.com/cugbliwei/authspider/casperjs"
	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/authspider/context"
	"github.com/cugbliwei/persistent-cookiejar"

	hproxy "github.com/cugbliwei/authspider/proxy"
	"github.com/cugbliwei/dlog"
	"golang.org/x/net/proxy"
	"golang.org/x/net/publicsuffix"
	"golang.org/x/text/encoding"
	"golang.org/x/text/encoding/simplifiedchinese"
)

var USERAGENT = []string{
	"Mozilla/5.0 (Macintosh; Intel Mac OS X %s) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X %s) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X %s) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X %s) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X %s) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X %s) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.134 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X %s) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X %s) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X %s) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.104 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X %s) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X %s) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.140 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X %s) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X %s) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36",
}

var OSVERSION = []string{
	"10_12_1",
	"10_12_2",
	"10_12_3",
	"10_12_4",
	"10_12_5",
	"10_12_6",
	"10_13_1",
	"10_13_2",
	"10.11.1",
	"10.11.2",
	"10.11.3",
	"10.11.4",
	"10.11.5",
	"10.11.6",
}

type Downloader struct {
	Jar                 *cookiejar.Jar
	LastPage            []byte
	LastPageUrl         string
	LastPageStatus      int
	LastPageContentType string
	UserAgent           string
	Client              *http.Client
	TmpClient           *http.Client
	proxy               *hproxy.Proxy
	proxyManager        *hproxy.ProxyManager
	Context             *context.Context
	ExtractorResults    map[string]interface{}
	OutputFolder        string
	OutputFolders       map[string]string
}

func NewHttpClientWithPersistentCookieJar(id string) (*http.Client, *cookiejar.Jar) {
	options := cookiejar.Options{
		PublicSuffixList: publicsuffix.List,
	}
	jar, err := cookiejar.New(&options)
	if err != nil {
		dlog.Warn("%s cookie jar error: %v", id, err)
		return nil, nil
	}

	return &http.Client{
		Jar: jar,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			dlog.Warn("%s CheckRedirect URL:%s", id, req.URL.String())
			return nil
		},
		Timeout: time.Second * time.Duration(6),
	}, jar
}

func NewDownloader(id string, cjs *casperjs.CasperJS, p *hproxy.Proxy, DisableOutputFolder bool, outFolder string, pm *hproxy.ProxyManager) *Downloader {
	ret := &Downloader{
		Context:          context.NewContext(cjs, p, pm),
		OutputFolder:     outFolder,
		OutputFolders:    make(map[string]string, 1),
		proxy:            p,
		proxyManager:     pm,
		LastPage:         nil,
		ExtractorResults: make(map[string]interface{}, 41),
	}
	if !DisableOutputFolder {
		err := os.MkdirAll(outFolder, 0766)
		if err != nil {
			dlog.Error("%s fail to mkdir %s: %v", id, outFolder, err)
			return nil
		}
	}
	ret.Client, ret.Jar = NewHttpClientWithPersistentCookieJar(id)
	ret.TmpClient = ret.Client
	ret.SetProxy(id, p)
	return ret
}

func (p *Downloader) WriteExtractorResults() {
	extractorResult := p.ExtractorResultString()
	path := p.OutputFolder + "/ExtractorInfo.json"
	os.Remove(path)
	saveFile, err := os.Create(path)
	if err == nil {
		defer saveFile.Close()
		var out bytes.Buffer
		if err := json.Indent(&out, []byte(extractorResult), "", "\t"); err == nil {
			out.WriteTo(saveFile)
		}
	}
}

func (p *Downloader) SetCookie(b string) {
	err := p.Jar.ReadFrom(strings.NewReader(b))
	if err != nil {
		dlog.Warn("set cookie err: %v", err)
	}
}

func (p *Downloader) SaveCookie(fname string) error {
	body := &bytes.Buffer{}
	err := p.Jar.WriteTo(body)
	if err != nil {
		return err
	}
	return ioutil.WriteFile(fname, body.Bytes(), 0655)
}

func (p *Downloader) ExtractorResultString() string {
	b, _ := json.Marshal(p.ExtractorResults)
	dlog.Info("%s crawl result len: %d", p.Context.Data["_id"], len(string(b)))
	if !config.Instance.OnLine {
		dlog.Info("%s crawl result: %s", p.Context.Data["_id"], string(b))
	}
	return string(b)
}

func (p *Downloader) AddExtractorResult(data interface{}) {
	if m, ok := data.(map[string]interface{}); ok {
		for k, v := range m {
			existResults, ok2 := p.ExtractorResults[k]
			if !ok2 {
				p.ExtractorResults[k] = v
			} else {
				if existArray, ok3 := existResults.([]interface{}); ok3 {
					if mergeArray, ok4 := v.([]interface{}); ok4 {
						p.ExtractorResults[k] = append(existArray, mergeArray...)
					} else if singleMerge, ok5 := v.(map[string]interface{}); ok5 {
						p.ExtractorResults[k] = append(existArray, singleMerge)
					}
				} else {
					last := []interface{}{existResults}
					if mergeArray, ok7 := v.([]interface{}); ok7 {
						p.ExtractorResults[k] = append(last, mergeArray...)
					} else {
						p.ExtractorResults[k] = append(last, v)
					}
				}
			}
		}
	}
	b, _ := json.Marshal(p.ExtractorResults)
	p.Context.Set("_extractor", string(b))
}

func (p *Downloader) AddNewExtractorResult(results map[string]interface{}, data interface{}) {
	if m, ok := data.(map[string]interface{}); ok {
		for k, v := range m {
			existResults, ok2 := results[k]
			if !ok2 {
				results[k] = v
			} else {
				if existArray, ok3 := existResults.([]interface{}); ok3 {
					if mergeArray, ok4 := v.([]interface{}); ok4 {
						results[k] = append(existArray, mergeArray...)
					} else if singleMerge, ok5 := v.(map[string]interface{}); ok5 {
						results[k] = append(existArray, singleMerge)
					}
				} else {
					if er, ok3 := existResults.(map[string]interface{}); ok3 {
						p.AddNewExtractorResult(er, v)
					}
				}
			}
		}
	}
	b, _ := json.Marshal(results)
	p.Context.Set("_extractor", string(b))
}

func (self *Downloader) SetProxy(id string, p *hproxy.Proxy) {
	transport := self.NewTransport(id, 6, p)
	self.Client.Transport = transport
	if p != nil {
		dlog.Warn("%s use proxy: %s", id, p.String())
	} else {
		dlog.Warn("%s not use proxy", id)
	}
}

func (self *Downloader) NewTransport(id string, timeout int, p *hproxy.Proxy) *http.Transport {
	transport := &http.Transport{
		DisableKeepAlives:     true,
		ResponseHeaderTimeout: time.Second * time.Duration(timeout),
		TLSClientConfig: &tls.Config{
			InsecureSkipVerify: true,
			MaxVersion:         tls.VersionTLS12,
			MinVersion:         tls.VersionTLS10,
			CipherSuites: []uint16{
				tls.TLS_RSA_WITH_RC4_128_SHA,
				tls.TLS_RSA_WITH_3DES_EDE_CBC_SHA,
				tls.TLS_RSA_WITH_AES_128_CBC_SHA,
				tls.TLS_RSA_WITH_AES_256_CBC_SHA,
				tls.TLS_ECDHE_ECDSA_WITH_RC4_128_SHA,
				tls.TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,
				tls.TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,
				tls.TLS_ECDHE_RSA_WITH_RC4_128_SHA,
				tls.TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,
				tls.TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,
				tls.TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,
				tls.TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,
				tls.TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,
			},
		},
	}

	if p == nil || len(p.IP) == 0 {
		return transport
	}

	if p.Type == "socks5" {
		var auth *proxy.Auth
		if len(p.Username) > 0 && len(p.Password) > 0 {
			auth = &proxy.Auth{
				User:     p.Username,
				Password: p.Password,
			}
		} else {
			auth = &proxy.Auth{}
		}
		forward := proxy.FromEnvironment()
		dialSocks5Proxy, err := proxy.SOCKS5("tcp", p.IP, auth, forward)
		if err != nil {
			dlog.Warn("%s SetSocks5 Error:%s", id, err.Error())
			return transport
		}
		transport.Dial = dialSocks5Proxy.Dial
	} else if p.Type == "http" {
		transport.Dial = func(netw, addr string) (net.Conn, error) {
			htimeout := time.Second * time.Duration(timeout)
			deadline := time.Now().Add(htimeout)
			c, err := net.DialTimeout(netw, addr, htimeout)
			if err != nil {
				return nil, err
			}
			c.SetDeadline(deadline)
			return c, nil
		}
		proxyUrl, err := url.Parse(p.String())
		if err == nil {
			transport.Proxy = http.ProxyURL(proxyUrl)
		}
	} else {
		transport.Dial = func(netw, addr string) (net.Conn, error) {
			lAddr, err := net.ResolveTCPAddr(netw, p.IP+":0")
			if err != nil {
				return nil, err
			}
			rAddr, err := net.ResolveTCPAddr(netw, addr)
			if err != nil {
				return nil, err
			}
			conn, err := net.DialTCP(netw, lAddr, rAddr)
			if err != nil {
				return nil, err
			}
			deadline := time.Now().Add(time.Duration(timeout) * time.Second)
			conn.SetDeadline(deadline)
			return conn, nil
		}
	}
	return transport
}

func (self *Downloader) ChangeToLocalHttpClient(id string) {
	self.Client = &http.Client{
		Jar: self.Jar,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			dlog.Warn("%s CheckRedirect URL:%s", id, req.URL.String())
			return nil
		},
		Timeout:   time.Minute,
		Transport: self.NewTransport(id, 60, self.proxyManager.GetLocalIP()),
	}
}

func (self *Downloader) ChangeToNewHttpClient(id string, timeout int) {
	if timeout == 0 {
		return
	}
	self.Client = &http.Client{
		Jar: self.Jar,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			dlog.Warn("%s CheckRedirect URL:%s", id, req.URL.String())
			self.Context.Set("new_domain", req.URL.String())
			return nil
		},
		Timeout:   time.Duration(timeout) * time.Second,
		Transport: self.NewTransport(id, timeout, self.proxy),
	}
}

func (self *Downloader) ChangeToNewProxyClient(id string, timeout int) {
	if timeout == 0 {
		timeout = 30
	}

	tmpl, ok := self.Context.Data["_tmpl"].(string)
	if !ok {
		dlog.Warn("%s get tmpl fail")
		return
	}

	self.Client = &http.Client{
		Jar: self.Jar,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			dlog.Warn("%s CheckRedirect URL:%s", id, req.URL.String())
			self.Context.Set("new_domain", req.URL.String())
			return nil
		},
		Timeout:   time.Duration(timeout) * time.Second,
		Transport: self.NewTransport(id, timeout, self.proxyManager.GetTmplProxy(tmpl)),
	}

	self.TmpClient = self.Client
}

func (self *Downloader) ChangeToDailyProxyClient(id string, timeout int) {
	if timeout == 0 {
		timeout = 30
	}

	tmpl, ok := self.Context.Data["_tmpl"].(string)
	if !ok {
		dlog.Warn("%s get tmpl fail")
		return
	}

	self.Client = &http.Client{
		Jar: self.Jar,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			dlog.Warn("%s CheckRedirect URL:%s", id, req.URL.String())
			self.Context.Set("new_domain", req.URL.String())
			return nil
		},
		Timeout:   time.Duration(timeout) * time.Second,
		Transport: self.NewTransport(id, timeout, self.proxyManager.GetLocalServiceProxy(tmpl)),
	}

	self.TmpClient = self.Client
}

func (self *Downloader) ChangeToOriginHttpClient(timeout int) {
	if timeout > 0 {
		self.Client = self.TmpClient
	}
}

func (s *Downloader) constructPage(id string, resp *http.Response) error {
	defer resp.Body.Close()
	body := make([]byte, 0)
	switch resp.Header.Get("Content-Encoding") {
	case "gzip":
		reader, err := gzip.NewReader(resp.Body)
		if err != nil {
			dlog.Warn("%s read gzip resp body error: %v", id, err)
		}

		defer reader.Close()
		for {
			buf := make([]byte, 1024)
			n, err := reader.Read(buf)
			if err != nil && err != io.EOF {
				dlog.Warn("%s read gzip body n: %d, error: %v", id, n, err)
				if err != io.ErrUnexpectedEOF {
					return err
				}
			}
			if n == 0 || n == -1 {
				break
			}
			body = append(body, buf[:n]...)
		}
	default:
		var err error
		body, err = ioutil.ReadAll(resp.Body)
		if err != nil {
			dlog.Warn("%s read resp error: %v", id, err)
			if len(body) < 1 {
				return err
			}
		}
	}

	s.LastPageUrl = resp.Request.URL.String()
	s.LastPage = body
	var charset string
	s.LastPageContentType, charset = decodeCharset(string(s.LastPage), resp.Header.Get("Content-Type"))

	if !strings.Contains(s.LastPageContentType, "image") && (strings.HasPrefix(charset, "gb") || strings.HasPrefix(charset, "GB")) {
		enc := mahonia.NewDecoder("gbk")
		cbody := []byte(enc.ConvertString(string(body)))
		s.LastPage = cbody
	}
	return nil
}

func decodeCharset(body, contentTypeHeader string) (string, string) {
	tks := strings.Split(contentTypeHeader, ";")
	var content_type, charset string

	if len(tks) == 1 {
		content_type = strings.ToLower(tks[0])
	}
	if len(tks) == 2 {
		kv := strings.Split(tks[1], "=")
		if len(kv) == 2 && strings.Contains(kv[0], "charset") {
			return strings.ToLower(tks[0]), strings.ToLower(kv[1])
		}
	}

	charset = getCharset(body, "meta[^<>]*[ ]{1}charset=\"([^\"]+)\"")
	if len(charset) == 0 {
		charset = getCharset(body, "<meta.*charset=(.*)\"")
	}
	return content_type, charset
}

func getCharset(body, regex string) string {
	reg := regexp.MustCompile(regex)
	result := reg.FindAllStringSubmatch(body, 1)
	if len(result) > 0 {
		group := result[0]
		if len(group) > 1 {
			return group[1]
		}
	}
	return ""
}

func (s *Downloader) getUserAgent() string {
	if len(s.UserAgent) == 0 {
		r := rand.New(rand.NewSource(time.Now().UnixNano()))
		ua := USERAGENT[r.Intn(len(USERAGENT))]
		return fmt.Sprintf(ua, OSVERSION[r.Intn(len(OSVERSION))])
	}
	return s.UserAgent
}

func (s *Downloader) Get(id, link string, header map[string]string) ([]byte, error) {
	req, err := http.NewRequest("GET", link, nil)
	if err != nil {
		dlog.Warn("%s new req error: %v", id, err)
		return nil, err
	}
	req.Header.Set("User-Agent", s.getUserAgent())
	if header != nil {
		for name, value := range header {
			req.Header.Set(name, value)
		}
	}

	resp, err := s.Client.Do(req)
	if err != nil {
		dlog.Warn("%s do req error: %v", id, err)
		return nil, err
	}
	if resp == nil {
		dlog.Warn("%s resp is nil", id)
		return nil, errors.New("nil resp")
	}

	s.LastPageStatus = resp.StatusCode
	err = s.constructPage(id, resp)
	if err != nil {
		return nil, err
	}
	return s.LastPage, nil
}

func (s *Downloader) Post(id, link string, params map[string]string, header map[string]string) ([]byte, error) {
	uparams := url.Values{}
	for k, v := range params {
		uparams.Set(s.Context.Parse(k), s.Context.Parse(v))
	}
	dlog.Info("%s post paramter:%v", id, uparams)
	req, err := http.NewRequest("POST", link, strings.NewReader(uparams.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
	req.Header.Set("User-Agent", s.getUserAgent())
	if header != nil {
		for name, value := range header {
			req.Header.Set(name, value)
		}
	}

	resp, err := s.Client.Do(req)
	if err != nil {
		dlog.Warn("%s do req error: %v", id, err)
		return nil, err
	}
	if resp == nil {
		dlog.Warn("%s resp is nil", id)
		return nil, errors.New("nil resp")
	}

	err = s.constructPage(id, resp)
	if err != nil {
		return nil, err
	}

	return s.LastPage, nil
}

func (s *Downloader) PostFile(id, link string, params map[string]string, header map[string]string) ([]byte, error) {
	ps := make(map[string]string, 1)
	for k, v := range params {
		ps[s.Context.Parse(k)] = s.Context.Parse(v)
	}

	content, ok := ps["file_content"]
	if !ok {
		dlog.Warn("%s get file_content field fail", id)
		return nil, nil
	}
	delete(ps, "file_content")

	base64Decode := ps["base64_decode"]
	delete(ps, "base64_decode")
	if base64Decode == "true" {
		body, err := base64.StdEncoding.DecodeString(content)
		if err != nil {
			dlog.Warn("%s decode error: %v", id, err)
			return nil, err
		}
		content = string(body)
	}

	formFile, ok := ps["form_file"]
	if !ok {
		dlog.Warn("%s get form_file field fail", id)
		return nil, nil
	}
	delete(ps, "form_file")

	filename, ok := ps["filename"]
	if !ok {
		dlog.Warn("%s get filename field fail", id)
		return nil, nil
	}
	delete(ps, "filename")

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	for key, val := range ps {
		writer.WriteField(key, val)
	}

	part, err := writer.CreateFormFile(formFile, filename)
	if err != nil {
		dlog.Warn("%s create form file error: %v", id, err)
		return nil, err
	}

	if _, err := part.Write([]byte(content)); err != nil {
		dlog.Warn("%s part write content error: %v", id, err)
		return nil, err
	}

	writer.Close()

	req, err := http.NewRequest("POST", link, body)
	if err != nil {
		return nil, err
	}

	for name, value := range header {
		req.Header.Set(name, value)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := s.Client.Do(req)
	if err != nil {
		dlog.Warn("%s do req error: %v", id, err)
		return nil, err
	}
	if resp == nil {
		dlog.Warn("%s resp is nil", id)
		return nil, errors.New("nil resp")
	}

	err = s.constructPage(id, resp)
	if err != nil {
		return nil, err
	}

	return s.LastPage, nil
}

func (s *Downloader) PostWithCharset(id, link string, params map[string]string, charset string, header map[string]string) ([]byte, error) {

	var encoder *encoding.Encoder
	if charset == "gbk" {
		encoder = simplifiedchinese.GBK.NewEncoder()
	}

	uparams := url.Values{}
	for k, v := range params {
		value := s.Context.Parse(v)
		if encoder != nil {
			nv, err := encoder.String(value)
			if err == nil {
				value = nv
			} else {
				dlog.Warn("encode param value(%s): %s = %s -> %s, err = %v", charset, k, value, nv, err)
			}
		}
		uparams.Set(s.Context.Parse(k), value)
	}

	dlog.Info("%s post paramter:%v", id, uparams)
	req, err := http.NewRequest("POST", link, strings.NewReader(uparams.Encode()))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
	req.Header.Set("User-Agent", s.getUserAgent())
	if header != nil {
		for name, value := range header {
			req.Header.Set(name, value)
		}
	}

	resp, err := s.Client.Do(req)
	if err != nil {
		dlog.Warn("%s do req error: %v", id, err)
		return nil, err
	}
	if resp == nil {
		dlog.Warn("%s resp is nil", id)
		return nil, errors.New("nil resp")
	}

	err = s.constructPage(id, resp)
	if err != nil {
		return nil, err
	}

	return s.LastPage, nil
}

func (s *Downloader) PostRaw(id, link string, data []byte, header map[string]string) ([]byte, error) {
	cdata := s.Context.Parse(string(data))
	dlog.Info("%s post json body: %s", id, cdata)
	req, err := http.NewRequest("POST", link, bytes.NewReader([]byte(cdata)))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "text/plain; charset=UTF-8")
	req.Header.Set("User-Agent", s.getUserAgent())
	if header != nil {
		for name, value := range header {
			req.Header.Set(name, value)
		}
	}

	resp, err := s.Client.Do(req)
	if err != nil {
		dlog.Warn("%s do req error: %v", id, err)
		return nil, err
	}
	if resp == nil {
		dlog.Warn("%s resp is nil", id)
		return nil, errors.New("nil resp")
	}

	err = s.constructPage(id, resp)
	if err != nil {
		return nil, err
	}
	return s.LastPage, nil
}

func (s *Downloader) UpdateCookieToContext(link string) {
	ulink, err := url.Parse(link)
	if err != nil {
		dlog.Warn("url parse error: %v", err)
		return
	}

	cs := s.Jar.Cookies(ulink)
	for _, c := range cs {
		s.Context.Set("cookie_"+c.Name, c.Value)
		s.Context.Set("cookie_escape_"+c.Name, url.QueryEscape(c.Value))
	}

	f, err := ioutil.TempFile("./", "xxxx")
	if err != nil {
		dlog.Warn("new temp file error: %v", err)
		return
	}

	_ = s.Jar.WriteTo(f)
	filename := f.Name()
	f.Close()
	b, _ := ioutil.ReadFile(filename)
	os.Remove(filename)

	s.Context.Set("all_cookies", string(b))
}
