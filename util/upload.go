package util

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"

	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/dlog"
)

func UploadFile(path string, bucket string) string {
	params := map[string]string{
		"token": config.Instance.Buckets[bucket],
	}
	b, err := Upload(config.Instance.UploadApi, params, bucket, path)
	if err != nil {
		dlog.Println(err)
		return ""
	}
	var out map[string]string
	err = json.Unmarshal(b, &out)
	if err != nil {
		dlog.Println(err)
		return ""
	}
	ret, ok := out["url"]
	if !ok {
		return ""
	}
	return ret
}

func Upload(link string, params map[string]string, paramName, path string) ([]byte, error) {
	file, err := os.Open(path)
	if err != nil {
		dlog.Warn("open path: %s, error: %v", path, err)
		return nil, err
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile(paramName, filepath.Base(path))
	if err != nil {
		dlog.Warn("create form file error: %v", err)
		return nil, err
	}
	_, err = io.Copy(part, file)
	if err != nil {
		dlog.Warn("copy file to part error: %v", err)
		return nil, err
	}

	for key, val := range params {
		writer.WriteField(key, val)
	}
	writer.Close()

	req, err := http.NewRequest("POST", link, body)
	if err != nil {
		dlog.Warn("new post request error: %v", err)
		return nil, err
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	c := &http.Client{}
	resp, err := c.Do(req)
	if err != nil {
		dlog.Warn("do request error: %v", err)
		return nil, err
	}
	defer resp.Body.Close()
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		dlog.Warn("read all from resp body error: %v", err)
		return nil, err
	}
	return b, nil
}

func UploadBody(ubody []byte, path, bucket string) (string, error) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile(bucket, filepath.Base(path))
	if err != nil {
		return "", err
	}
	_, err = io.Copy(part, bytes.NewReader(ubody))
	if err != nil {
		return "", err
	}

	writer.WriteField("token", config.Instance.Buckets[bucket])
	err = writer.Close()
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", config.Instance.UploadApi, body)
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())
	c := &http.Client{}
	resp, err := c.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var out map[string]string
	err = json.Unmarshal(b, &out)
	if err != nil {
		return "", err
	}
	ret, ok := out["url"]
	if !ok {
		return "", errors.New("no file_url")
	}
	return ret, nil
}
