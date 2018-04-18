package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"net/url"
	"runtime"
	"runtime/debug"
	"strings"

	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/authspider/hbase"
	"github.com/cugbliwei/authspider/sql"
	"github.com/cugbliwei/authspider/util"
	"github.com/cugbliwei/dlog"
)

func HandleHealth(w http.ResponseWriter, req *http.Request) {
	fmt.Fprint(w, "yes")
}

func WriteData(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if r := recover(); r != nil {
			dlog.Error("http write data error: %v", r)
			debug.PrintStack()
		}
	}()

	r.ParseForm()
	tmpl := r.FormValue("tmpl")
	user := r.FormValue("username")
	data := r.FormValue("data")

	resp := &sql.WriteDataResponse{}
	resp.Username = user
	resp.Tmpl = tmpl

	if len(tmpl) == 0 || len(user) == 0 || len(data) == 0 {
		resp.Message = "one of the params is empty, tmpl: " + tmpl + ", username: " + user
		respStr, _ := json.Marshal(&resp)
		dlog.Error("one of the params is empty, tmpl: %s, username: %s, data len: %d", tmpl, user, len(data))
		w.Header().Set("Content-Type", "application/json")
		w.Write(respStr)
		return
	}

	if err := sql.WriteToMixRedisGetError(tmpl+"_"+user, data, config.Instance.Redis.ClusterStoreTimeout); err != nil {
		dlog.Error("write key: %s to redis error: %v", tmpl+"_"+user, err)
		resp.Message = err.Error()
	} else {
		dlog.Info("write key: %s to redis success", tmpl+"_"+user)
		resp.Status = true
	}

	userMd5 := util.Md5Encode(user)
	flag := hbase.SyncSend("base", tmpl+"_"+userMd5, data)
	if !flag {
		dlog.Error("fail to send data to hbase, tmpl: %s, username: %s, data len: %d", tmpl, user, len(data))
		resp.Message = "fail to send data to hbase"
	} else {
		dlog.Info("write key: %s, md5: %s to hbase success", tmpl+"_"+user, tmpl+"_"+userMd5)
		resp.Status = true
	}

	respStr, _ := json.Marshal(&resp)
	w.Header().Set("Content-Type", "application/json")
	w.Write(respStr)
}

func GetData(w http.ResponseWriter, req *http.Request) {
	defer func() {
		if r := recover(); r != nil {
			dlog.Error("http get data error: %v", r)
			debug.PrintStack()
		}
	}()

	req.ParseForm()
	un := req.FormValue("username")
	username, _ := url.QueryUnescape(un)
	tmpl := req.FormValue("tmpl")
	resp := &sql.ReadDataResponse{}
	flag := false

	if len(username) == 0 || len(tmpl) == 0 {
		if strings.HasPrefix(tmpl, "hc_") || strings.Contains(tmpl, "mail") {
			fmt.Fprint(w, "")
			return
		}

		resp.Message = "参数错误"
		respStr, _ := json.Marshal(resp)
		w.Header().Set("Content-Type", "application/json")
		w.Write(respStr)
		return
	}

	val, err := sql.GetFromRedisSql(tmpl, username)
	if err != nil {
		dlog.Warn("tmpl: %s, username: %s get from redis error: %v", tmpl, username, err)
	} else {
		flag = getFromData(val, tmpl, username, "redis", w, resp)
		resp.Status = true
	}

	if !resp.Status && !flag {
		userMd5 := util.Md5Encode(username)
		searchKey := "tmpl_userMd5"
		val, ok := hbase.SyncGet(tmpl + "_" + userMd5)
		if !ok || len(val) == 0 {
			tu := util.Md5Encode(tmpl + "_" + username)
			searchKey = "tmpl_username md5"
			val, ok = hbase.SyncGet(tu)
		}

		if !ok || len(val) == 0 {
			dlog.Warn("tmpl: %s, username: %s fail to get from hbase", tmpl, username)
		} else {
			flag = getFromData(val, tmpl, username, searchKey+" hbase", w, resp)
			resp.Status = true
		}
	}

	if !resp.Status && !flag {
		val, err := sql.GetFromFileSql(tmpl, username)
		if err != nil {
			dlog.Warn("tmpl: %s, username: %s get from file sql error: %v", tmpl, username, err)
			resp.Message = "fail to get from file sql"
			if strings.HasPrefix(tmpl, "hc_") {
				fmt.Fprint(w, "")
				return
			}
		} else {
			flag = getFromData(val, tmpl, username, "file sql", w, resp)
		}
	}

	if !flag {
		respStr, _ := json.Marshal(resp)
		fmt.Fprint(w, string(respStr))
	}
}

func getFromData(val, tmpl, username, sqlType string, w http.ResponseWriter, resp *sql.ReadDataResponse) bool {
	dlog.Info("read result from %s, tmpl: %s, username: %s", sqlType, tmpl, username)
	if strings.HasPrefix(tmpl, "hc_") {
		fmt.Fprint(w, val)
		return true
	}

	tmp := make(map[string]string, 1)
	if err := json.Unmarshal([]byte(val), &tmp); err != nil {
		dlog.Warn("json Unmarshal error: %v", err)
	}
	resp.Status = true
	resp.Data = tmp

	return false
}

func UploadFile(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if r := recover(); r != nil {
			dlog.Error("HTTP UPLOAD file error: %v", r)
			debug.PrintStack()
		}
	}()
	r.ParseMultipartForm(30 << 20)
	file, _, _ := r.FormFile("uploadfile")
	defer file.Close()
	filedata, _ := ioutil.ReadAll(file)
	var exdata map[string]string
	_ = json.Unmarshal(filedata, &exdata)
	tmpl := exdata["tmpl"]
	user := exdata["username"]
	data := exdata["data"]

	resp := &sql.WriteDataResponse{}
	resp.Username = user
	resp.Tmpl = tmpl

	if len(tmpl) == 0 || len(user) == 0 || len(data) == 0 {
		resp.Message = "one of the params is empty, tmpl: " + tmpl + ", username: " + user
		respStr, _ := json.Marshal(&resp)
		dlog.Error("one of the params is empty, tmpl: %s, username: %s, data len: %d", tmpl, user, len(data))
		w.Header().Set("Content-Type", "application/json")
		w.Write(respStr)
		return
	}

	if err := sql.WriteToMixRedisGetError(tmpl+"_"+user, data, config.Instance.Redis.ClusterStoreTimeout); err != nil {
		dlog.Error("write key: %s to redis error: %v", tmpl+"_"+user, err)
		resp.Message = err.Error()
	} else {
		dlog.Info("write key: %s to redis success", tmpl+"_"+user)
		resp.Status = true
	}

	userMd5 := util.Md5Encode(user)
	flag := hbase.SyncSendFile(tmpl+"_"+userMd5, data)
	if !flag {
		dlog.Error("fail to send data to hbase, tmpl: %s, username: %s, data len: %d", tmpl, user, len(data))
		resp.Message = "fail to send data to hbase"
	} else {
		dlog.Info("write key: %s, md5: %s to hbase success", tmpl+"_"+user, tmpl+"_"+userMd5)
		resp.Status = true
	}

	respStr, _ := json.Marshal(&resp)
	w.Header().Set("Content-Type", "application/json")
	w.Write(respStr)
}

func main() {
	runtime.GOMAXPROCS(4)
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	port := flag.String("port", "8060", "port number")
	flag.Parse()

	http.HandleFunc("/health", HandleHealth)
	http.HandleFunc("/get/data", GetData)
	http.HandleFunc("/write/data", WriteData)
	http.HandleFunc("/upload/file", UploadFile)
	l, e := net.Listen("tcp", ":"+*port)
	if e != nil {
		dlog.Fatal("listen error:", e)
	}
	http.Serve(l, nil)
}
