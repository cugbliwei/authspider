package cmd

import (
	"encoding/json"
	"net/http"
	"net/url"
	"runtime/debug"

	"github.com/cugbliwei/dlog"
)

const (
	kInternalErrorResut = "server get internal result"
)

type CasperServer struct {
	cmdCache   *CommandCache
	cmdFactory CommandFactory
}

func NewCasperServer(cf CommandFactory) *CasperServer {
	ret := &CasperServer{
		cmdCache:   NewCommandCache(),
		cmdFactory: cf,
	}

	return ret
}

func (self *CasperServer) setArgs(id string, cmd Command, params url.Values) *Output {
	args := self.getArgs(params)
	cmd.SetInputArgs(args)

	if message := cmd.GetMessage(); message != nil {
		return message
	}

	msg := &Output{
		Status: "fail",
		Id:     id,
		Data:   "未知错误",
	}
	return msg
}

func (self *CasperServer) getArgs(params url.Values) map[string]string {
	args := make(map[string]string, 30)
	for k, v := range params {
		args[k] = v[0]
	}
	return args
}

func (self *CasperServer) Process(params url.Values) *Output {
	id := params.Get("id")
	if len(id) == 0 {
		c := self.cmdFactory.CreateCommand(params)
		if c == nil {
			dlog.Warn("has no id forwardFor: %v, url: %v", params.Get("forwardedFor"), params.Get("remoteUrl"))
			return &Output{Status: FAIL, Data: "no create command"}
		}
		self.cmdCache.SetCommand(c)
		params.Set("id", c.GetId())
		dlog.Warn("%s forwardFor: %v, url: %v", c.GetId(), params.Get("forwardedFor"), params.Get("remoteUrl"))
		return self.setArgs(c.GetId(), c, params)
	}

	dlog.Warn("%s forwardFor: %v, url: %v", id, params.Get("forwardedFor"), params.Get("remoteUrl"))
	c := self.cmdCache.GetCommand(id)
	if c == nil {
		dlog.Warn("get nil command id:%s", id)
		return &Output{Status: FAIL, Data: "not get command"}
	}

	ret := self.setArgs(id, c, params)

	if ret != nil && (ret.Status == FAIL || ret.Status == FINISH_FETCH_DATA || ret.Status == FINISH_ALL) {
		c.Successed()
		self.cmdCache.Delete(id)
	}

	return ret
}

func (self *CasperServer) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	defer func() {
		if r := recover(); r != nil {
			dlog.Error("http submit error: %v", r)
			debug.PrintStack()
		}
	}()
	req.ParseForm()
	params := req.Form
	params.Set("forwardedFor", req.Header.Get("X-Forwarded-For"))
	params.Set("remoteUrl", req.Host+req.Header.Get("X-Original-Uri"))
	ret := self.Process(params)
	output, _ := json.Marshal(ret)
	dlog.Warn("%s response status: %s", ret.Id, ret.Status)
	//w.Header().Add("Set-Cookie", "route=sdf5452437284233rey2rye2")  //给江湖救急的测试机器测试时需要加上route的cookie，保持和线上一样的
	w.Header().Set("Content-Type", "application/json")
	w.Write(output)
	return
}
