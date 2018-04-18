package sql

import (
	"archive/zip"
	"bytes"
	"encoding/json"
	"io/ioutil"
	"os"
	"strings"

	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/authspider/util"
	"github.com/cugbliwei/dlog"
)

const filename string = "ExtractorInfo_json"

type WriteDataResponse struct {
	Status   bool   `json:"status"`
	Message  string `json:"msg"`
	Data     string `json:"data"`
	Username string `json:"username"`
	Tmpl     string `json:"tmpl"`
	Id       string `json:"id"`
}

func WriteToFileSql(tmpl, user, data string) error {
	username := util.Md5Encode(user)
	filepath := config.Instance.FileSqlPath + tmpl + "/" + username + "/"
	err := os.MkdirAll(filepath, 0766)
	if err != nil {
		return err
	}

	saveFile, err := os.Create(filepath + filename)
	if err != nil {
		return err
	}

	saveFile.WriteString(data)
	saveFile.Close()
	return nil
}

type ReadDataResponse struct {
	Status  bool        `json:"status"`
	Message string      `json:"msg"`
	Data    interface{} `json:"data"`
}

func GetFromFileSql(tmpl, user string) (string, error) {
	username := util.Md5Encode(user)
	dlog.Info("username: %s, md5: %s", user, username)
	filepath := config.Instance.FileSqlPath + tmpl + "/" + username + "/" + filename
	data, err := ioutil.ReadFile(filepath)
	if err != nil {
		return "", err
	}

	return handleData(tmpl, string(data))
}

func GetFromRedisSql(tmpl, user string) (string, error) {
	ret, err := GetFromMixRedis(tmpl + "_" + user)
	if err != nil {
		return "", err
	}

	return handleData(tmpl, ret)
}

func handleData(tmpl, data string) (string, error) {
	if strings.Contains(tmpl, "mail") {
		return getBillData(data)
	}
	if strings.Contains(tmpl, "hc_taobao") {
		return addErrorToHcTaobao(data)
	}
	return data, nil
}

func addErrorToHcTaobao(data string) (string, error) {
	tb := make(map[string]interface{}, 5)
	if err := json.Unmarshal([]byte(data), &tb); err != nil {
		dlog.Error("json Unmarshal hc taobao data error: %v", err)
		return data, err
	}

	tb["error"] = "0"
	buf, err := json.Marshal(tb)
	if err != nil {
		dlog.Error("json marshal hc taobao data error: %v", err)
		return data, err
	}
	return string(buf), nil
}

func WriteZip(tmpl, username string, body []byte) error {
	zipReader, err := zip.NewReader(bytes.NewReader(body), int64(len(body)))
	if err != nil {
		dlog.Error("unzip open error: %v", err)
		return err
	}
	ret := make(map[string]string, 1)
	for _, f := range zipReader.File {
		filename := util.GetPathLastPart(f.Name)
		if filename != "ExtractorInfo_json" {
			continue
		}

		rc, err := f.Open()
		if err != nil {
			dlog.Warn("open file get error: %v", err)
			return err
		}
		defer rc.Close()

		data, err := ioutil.ReadAll(rc)
		if err != nil {
			dlog.Warn("read zip file get error: %v", err)
			return err
		}

		sdata := string(data)
		ret[filename] = sdata
	}

	val, err := json.Marshal(ret)
	if err != nil {
		dlog.Error("json marshal result err: %v", err)
		return err
	}
	dlog.Info("write to cluster redis key: %s", tmpl+"_"+username)
	go WriteToMixRedis(tmpl+"_"+username, string(val), config.Instance.Redis.ClusterStoreTimeout)
	return nil
}
