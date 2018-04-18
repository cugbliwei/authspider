package http

import (
	"bytes"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/cugbliwei/dlog"
	"github.com/cugbliwei/persistent-cookiejar"
	"golang.org/x/net/publicsuffix"
)

func HttpClient(to int) *http.Client {
	timeout := time.Duration(to) * time.Second
	return &http.Client{
		Transport: &http.Transport{
			Dial: func(network, addr string) (net.Conn, error) {
				deadline := time.Now().Add(timeout)
				c, err := net.DialTimeout(network, addr, timeout)
				if err != nil {
					return nil, err
				}
				c.SetDeadline(deadline)
				return c, nil
			},
			DisableKeepAlives:     true,
			ResponseHeaderTimeout: timeout,
			DisableCompression:    false,
		},
	}
}

func HttpJarClient(to int) *http.Client {
	timeout := time.Duration(to) * time.Second
	options := cookiejar.Options{PublicSuffixList: publicsuffix.List}
	jar, _ := cookiejar.New(&options)

	return &http.Client{
		Jar: jar,
		Transport: &http.Transport{
			Dial: func(network, addr string) (net.Conn, error) {
				deadline := time.Now().Add(timeout)
				c, err := net.DialTimeout(network, addr, timeout)
				if err != nil {
					return nil, err
				}
				c.SetDeadline(deadline)
				return c, nil
			},
			DisableKeepAlives:     true,
			ResponseHeaderTimeout: timeout,
			DisableCompression:    false,
		},
	}
}

func HttpGet(c *http.Client, link string) []byte {
	dlog.Info("http get %s", link)
	req, _ := http.NewRequest("GET", link, nil)
	resp, err := c.Do(req)
	if err != nil {
		dlog.Warn("http get %s", err.Error())
		return nil
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		dlog.Warn("read response %s", err.Error())
		return nil
	}
	return body
}

func HttpPost(c *http.Client, link string, params map[string]string) []byte {
	dlog.Info("http post link: %s", link)
	uparams := url.Values{}
	for k, v := range params {
		uparams.Set(k, v)
	}

	req, err := http.NewRequest("POST", link, strings.NewReader(uparams.Encode()))
	if err != nil {
		dlog.Warn("new request: %v", err)
		return nil
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
	resp, err := c.Do(req)
	if err != nil {
		dlog.Warn("do request: %v", err)
		return nil
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		dlog.Warn("read response %s", err.Error())
		return nil
	}
	return body
}

func HttpPostFile(c *http.Client, link string, filename string) []byte {
	dlog.Info("http post file link: %s", link)

	bodyBuf := &bytes.Buffer{}
	writer := multipart.NewWriter(bodyBuf)
	fileWriter, err := writer.CreateFormFile("uploadfile", filename)

	fh, _ := os.Open(filename)
	defer fh.Close()
	_, _ = io.Copy(fileWriter, fh)
	contentType := writer.FormDataContentType()
	writer.Close()
	req, err := http.NewRequest("POST", link, bodyBuf)
	if err != nil {
		dlog.Warn("new request: %v", err)
		return nil
	}

	req.Header.Set("Content-Type", contentType)
	resp, err := c.Do(req)
	if err != nil {
		dlog.Warn("do request: %v", err)
		return nil
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		dlog.Warn("read response %s", err.Error())
		return nil
	}
	return body
}

func CustomCharsetHandler(charset string, h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html;charset="+charset)
		h.ServeHTTP(w, r)
	})
}
