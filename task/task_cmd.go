package task

import (
	"bytes"
	"crypto/rsa"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/url"
	"os"
	"os/exec"
	"runtime/debug"
	"strconv"
	"strings"
	"time"

	"github.com/cugbliwei/authspider/browserhub"
	"github.com/cugbliwei/authspider/casperjs"
	"github.com/cugbliwei/authspider/cmd"
	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/authspider/extractor"
	"github.com/cugbliwei/authspider/flume"
	ahttp "github.com/cugbliwei/authspider/http"
	hproxy "github.com/cugbliwei/authspider/proxy"
	hrecord "github.com/cugbliwei/authspider/record"
	"github.com/cugbliwei/authspider/sql"
	"github.com/cugbliwei/authspider/util"
	"github.com/cugbliwei/dlog"
)

const (
	STATUS_START  = "started"
	STATUS_FINISH = "finished"
	STATUS_FAIL   = "failed"
)

type TaskCmd struct {
	id                string
	tmpl              string
	userName          string
	userId            string
	passWord          string
	path              string
	message           chan *cmd.Output
	msgTime           time.Time
	needParam         bool
	input             chan map[string]string
	args              map[string]string
	privateKey        *rsa.PrivateKey
	downloader        *Downloader
	browserDownloader *browserhub.BrowserHub
	task              *Task
	casperJS          *casperjs.CasperJS
	finished          bool
	proxy             *hproxy.Proxy
	proxyManager      *hproxy.ProxyManager
	record            *hrecord.Record
	writeResult       bool
}

type TaskCmdFactory struct {
	taskManager  *TaskManager
	proxyManager *hproxy.ProxyManager
}

func NewTaskCmdFactory(tm *TaskManager, pm *hproxy.ProxyManager) *TaskCmdFactory {
	return &TaskCmdFactory{
		taskManager:  tm,
		proxyManager: pm,
	}
}

func (s *TaskCmdFactory) CreateCommand(params url.Values) cmd.Command {
	tmpl := params.Get("tmpl")
	if len(tmpl) == 0 {
		dlog.Error("find empty tmpl")
		return nil
	}

	id := s.genId(tmpl)
	params.Set("id", id)

	task := s.taskManager.Get(tmpl)
	if task == nil {
		dlog.Error("%s fail to get task for tmpl: %s", id, tmpl)
		return nil
	}
	if !task.DisableOutPubKey {
		pk, err := util.GenerateRSAKey()
		if err != nil {
			dlog.Fatalln("%s fail to generate rsa key", id, err)
		}
		return s.createCommandWithPrivateKey(params, task, pk)
	}
	return s.createCommandWithPrivateKey(params, task, nil)
}

func (s *TaskCmdFactory) CreateCommandWithPrivateKey(params url.Values, pk *rsa.PrivateKey) cmd.Command {
	tmpl := params.Get("tmpl")
	if len(tmpl) == 0 {
		return nil
	}
	task := NewTask(tmpl + ".json")
	if task == nil {
		return nil
	}
	return s.createCommandWithPrivateKey(params, task, pk)
}

func (s *TaskCmdFactory) genId(tmpl string) string {
	tm := time.Now().Format("2006_01_02")
	return fmt.Sprintf("%s_%s_%d", tmpl, tm, time.Now().UnixNano())
}

func (s *TaskCmdFactory) genFolder(tmpl, id string) string {
	return config.Instance.OutputRoot + tmpl + "/" + id
}

func (s *TaskCmdFactory) createCommandWithPrivateKey(params url.Values, task *Task, pk *rsa.PrivateKey) cmd.Command {
	tmpl := params.Get("tmpl")
	id := params.Get("id")
	ret := &TaskCmd{
		id:          id,
		tmpl:        tmpl,
		userName:    "",
		userId:      params.Get("userid"),
		passWord:    "",
		message:     make(chan *cmd.Output, 30),
		msgTime:     time.Now(),
		needParam:   false,
		input:       make(chan map[string]string, 30),
		args:        make(map[string]string, 30),
		task:        task,
		finished:    false,
		record:      hrecord.NewRecord(id, tmpl, time.Now().UnixNano()/1000000),
		writeResult: false,
	}
	startTime := time.Now()

	ret.privateKey = pk
	ret.path = s.genFolder(tmpl, id)
	var p *hproxy.Proxy
	if s.proxyManager != nil {
		if v, ok := config.Instance.UseDailyProxy[tmpl]; ok && v && config.Instance.OnLine {
			p = s.proxyManager.GetLocalServiceProxy(tmpl)
		} else {
			p = s.proxyManager.GetTmplProxy(tmpl)
		}
	}
	ret.proxy = p
	ret.proxyManager = s.proxyManager
	if len(task.CasperjsScript) > 0 {
		if ret.task.DisableCasperjsProxy {
			ret.casperJS, _ = casperjs.NewCasperJS(ret.path, "./etc/casperjs/"+task.CasperjsScript, "", "")
		} else {
			ret.casperJS, _ = casperjs.NewCasperJS(ret.path, "./etc/casperjs/"+task.CasperjsScript, "http://localhost:8090", "http")
		}
		go ret.casperJS.Run(id)
	}

	ret.downloader = NewDownloader(ret.id, ret.casperJS, p, task.DisableOutputFolder, ret.path, s.proxyManager)

	client := params.Get("client")
	ret.downloader.Context.Set("client", client)
	ret.downloader.Context.Set("_id", id)
	ret.downloader.Context.Set("_tmpl", tmpl)
	ret.downloader.Context.Set("_path", ret.path)
	ret.downloader.Context.Set("StdPublicKey", util.GetPublicKey(config.Instance.Honeycomb.StdPublicKey))
	ret.downloader.Context.Set("JhjjPublicKey", util.GetPublicKey(config.Instance.Honeycomb.JhjjPublicKey))

	for key, value := range config.Instance.Error {
		if strings.Contains(key, "common") {
			continue
		}

		for k, v := range value {
			ret.downloader.Context.Set(k, v)
		}
	}

	if task.WriteExtractorResults {
		go func() {
			tc := time.NewTicker(time.Duration(7) * time.Minute)
			for _ = range tc.C {
				if ret.writeResult {
					break
				}
				ret.downloader.WriteExtractorResults()
			}
		}()
	}

	ret.getClient(params.Get("client"))
	ret.record.InitTime = ParseTimestamp(time.Now().Sub(startTime))
	go ret.run()
	return ret
}

func (p *TaskCmd) getClient(client string) {
	if len(client) > 0 {
		p.record.Client = client
		return
	}

	if strings.HasPrefix(p.tmpl, "cookie") {
		p.record.Client = "phone"
	} else {
		p.record.Client = "pc"
	}
}

func (p *TaskCmd) NewBrowserHub(enableBrowser bool, outFolder string) {
	if enableBrowser {
		var err error
		p.browserDownloader, err = browserhub.NewBrowserHub(&config.Instance.BrowserHub, p.tmpl)
		if err != nil {
			dlog.Error("%s create selenium browser error, please restart selenium: %s", p.id, err)
			return
		}

		p.browserDownloader.WritePageSource = func(filename string, source string) {
			path := outFolder + "/" + filename
			dlog.Info("%s write file %s to %s", p.id, filename, path)
			if err := ioutil.WriteFile(path, []byte(source), 0655); err != nil {
				dlog.Error("%s write file failed: %v", p.id, err)
			}
		}

		p.browserDownloader.ScreenListener = func(filename string, image []byte) {
			path := outFolder + "/" + filename
			dlog.Info("%s write file %s to %s", p.id, filename, path)
			if err := ioutil.WriteFile(path, image, 0655); err != nil {
				dlog.Error("%s write file failed: %v", p.id, err)
			}
		}

		p.browserDownloader.RandcodeListener = func(uploadImage string, randcode []byte) {
			if len(string(randcode)) == 0 {
				return
			}

			url, err := sql.UploadImageToRedis(randcode)
			if err != nil {
				dlog.Warn("%s upload browser image err: %s", p.id, err.Error())
				return
			}

			p.downloader.Context.Set(uploadImage, url)
			dlog.Info("%s %s", p.id, url)
		}

		p.browserDownloader.GetValue = func(key string) string {
			return p.downloader.Context.Parse(key)
		}

		p.browserDownloader.SetValue = func(key, value string) {
			p.downloader.Context.Set(key, value)
			dlog.Info("%s context set %s: %v", p.id, key, value)
		}
	}
}

func (p *TaskCmd) GetId() string {
	return p.id
}

func (p *TaskCmd) GetTmpl() string {
	return p.tmpl
}

func (p *TaskCmd) GetIP() string {
	if p.proxy == nil {
		return ""
	}
	return p.proxy.IP
}

func (p *TaskCmd) Finished() bool {
	return p.finished
}

func (p *TaskCmd) SetInputArgs(input map[string]string) {
	if p.Finished() {
		return
	}
	p.input <- input
}

func (p *TaskCmd) GetMessage() *cmd.Output {
	return <-p.message
}

func (p *TaskCmd) getUserName() string {
	if v, ok := p.downloader.Context.Get("username"); ok {
		p.userName = fmt.Sprintf("%v", v)
	}
	return p.userName
}

func (p *TaskCmd) readInputArgs(key string) string {
	dlog.Info("%s blocking........................", p.id)
	args, ok := <-p.input
	if !ok {
		dlog.Warn("%s input channel had closed!", p.id)
		p.finished = true
		return ""
	}
	for k, v := range args {
		if k == "password" {
			p.passWord = v
		}

		p.args[k] = v
	}
	if val, ok := p.args[key]; ok {
		return val
	}

	dlog.Warn("%s need param:%s", p.id, key)
	return ""
}

func (p *TaskCmd) GetArgsValue(key string, flag bool) string {
	if val, ok := p.args[key]; ok && len(val) > 0 {
		dlog.Info("%s successfully get args value: %s for key: %s", p.id, val, key)
		return val
	}
	if flag {
		dlog.Info("%s get args value: null for key: %s", p.id, key)
		return "null"
	}

	p.needParam = true
	for {
		val := p.readInputArgs(key)
		if len(val) != 0 || p.Finished() {
			dlog.Info("%s successfully get args value: %s for key: %s", p.id, val, key)
			p.needParam = false
			p.msgTime = time.Now()
			return val
		}
	}
}

func (p *TaskCmd) Successed() bool {
	return true
}

func (p *TaskCmd) Close() bool {
	defer func() {
		if err := recover(); err != nil {
			dlog.Error("%s Close Error:%v", p.id, err)
		}
	}()
	p.finished = true
	close(p.message)
	p.message = nil
	close(p.input)
	return true
}

func (p *TaskCmd) OutputPublicKey() {
	if p.task.DisableOutPubKey == false {
		message := &cmd.Output{
			Id:     p.id,
			Status: cmd.OUTPUT_PUBLICKEY,
			Data:   string(util.PublicKeyString(&p.privateKey.PublicKey)),
		}
		p.message <- message
		p.msgTime = time.Now()

		if c, ok := p.downloader.Context.Get("client"); ok {
			if client, ok := c.(string); ok && client == "jhjj" {
				p.callbackJhjj(`{"status":"output_publickey","id": "` + p.id + `","data":"` + string(util.PublicKeyString(&p.privateKey.PublicKey)) + `","tmpl": "` + p.tmpl + `"}`)
			}
		}

		dlog.Info("%s output public key", p.id)
	}
}

func (p *TaskCmd) Goto() (map[string]int, map[string]int) {
	gotoMap := make(map[string]int, 10)
	retry := make(map[string]int, 10)

	for k, step := range p.task.Steps {
		if len(step.Tag) > 0 {
			gotoMap[step.Tag] = k - 1
			retry[step.Tag] = 0
		}
	}
	return gotoMap, retry
}

func (p *TaskCmd) setUsername() {
	if user, ok := p.downloader.Context.Get("username"); ok {
		if username, ok := user.(string); ok {
			p.record.Username = username
		}
	}
}

func ParseTimestamp(t time.Duration) float64 {
	second := float64(t) / 1000000000
	return GetTwoPoint(second)
}

func GetTwoPoint(second float64) float64 {
	secondStr := fmt.Sprintf("%.2f", second)
	s, err := strconv.ParseFloat(secondStr, 64)
	if err != nil {
		return 0.0
	}
	return s
}

func (p *TaskCmd) callbackJhjj(result string) {
	params := make(map[string]string, 2)
	params["result"] = result
	params["timestamp"] = p.downloader.Context.Parse("{{nowMillTimestamp}}")
	dlog.Info("params: %v", params)
	c := ahttp.HttpClient(10)
	for i := 0; i < 5; i++ {
		body := ahttp.HttpPost(c, config.Instance.JhjjAddr, params)
		ret := make(map[string]string, 3)
		if err := json.Unmarshal(body, &ret); err != nil {
			dlog.Warn("post in_crawling to jhjj callback interface error: %v", err)
		}

		if status, ok := ret["status"]; ok && status == "ok" {
			break
		}
	}
}

func (p *TaskCmd) returnMessage() {
	defer func() {
		if err := recover(); err != nil {
			dlog.Error("%s return message error: %v", p.id, err)
			debug.PrintStack()
		}
	}()

	tc := time.NewTicker(time.Second * time.Duration(5))
	count := 1
	for _ = range tc.C {
		if p.finished || count > 120 {
			break
		}
		count++

		if !p.needParam && int64(time.Now().Sub(p.msgTime))/1000000000 >= 20 {
			msg := &cmd.Output{
				Status: "in_crawling",
				Id:     p.id,
				Data:   "正在处理中，请耐心等待",
				Tmpl:   p.tmpl,
			}
			p.message <- msg
			p.msgTime = time.Now()
			dlog.Warn("%s message: %v", p.id, msg)
		}
	}
}

func (p *TaskCmd) run() {
	defer func() {
		if err := recover(); err != nil {
			dlog.Error("%s run error: %v", p.id, err)
			debug.PrintStack()
		}
	}()
	if !p.task.DisableInCrawling {
		go p.returnMessage()
	}
	p.downloader.Context.Set(p.tmpl, p.tmpl)
	p.finished = false
	p.OutputPublicKey()
	gotoMap, retry := p.Goto()
	startTime := time.Now()
	p.record.StartFetch = true
	finishMsgData := ""

	c := 0
	for {
		if c >= len(p.task.Steps) {
			break
		}

		step := p.task.Steps[c]
		dlog.Info("%s begin step %d/%d: %s", p.id, c, len(p.task.Steps)-1, step.Page)
		time.Sleep(time.Duration(rand.Int63n(300)) * time.Millisecond)

		if !step.PassCondition(p.downloader.Context) {
			dlog.Warn("%s skip step %d: %s", p.id, c, step.Page)
			c++
			continue
		}

		if len(step.NeedParam) > 0 {
			tks := strings.Split(step.NeedParam, ",")
			for _, tk := range tks {
				flag := false
				if strings.HasSuffix(tk, "#") {
					flag = true
					tk = strings.TrimSuffix(tk, "#")
				}

				_, ok := p.downloader.Context.Get(tk)
				dlog.Warn("%s try to get %s %v", p.id, tk, ok)
				if !ok {
					p.msgTime = time.Now()
					val := p.GetArgsValue(tk, flag)
					val = strings.TrimSpace(val)
					delete(p.args, tk)
					if tk == "password" && !p.task.DisableOutPubKey {
						val = util.DecodePassword(p.id, val, p.privateKey)
					}

					if len(val) > 0 {
						p.downloader.Context.Set(tk, val)
					}
				}

				if p.Finished() {
					dlog.Warn("%s get param: %s fail", p.id, tk)
					if v, ok := config.Instance.DisableRecord[p.tmpl]; !ok || !v {
						p.record.FetchTime = ParseTimestamp(time.Now().Sub(startTime))
						p.record.TotalTime = GetTwoPoint(p.record.InitTime + p.record.LoginTime + p.record.FetchTime)
						p.record.Fail = true
						p.record.FailMessage = "get param: " + tk + " fail"
						p.record.SendRecord(true)
					}
					p.writeResult = true
					p.closeBrowser()
					return
				}
			}
		}

		if step.BrowserCookieSync && p.browserDownloader != nil {
			step.browserCookieSync(p.id, p.downloader, p.browserDownloader)
		}

		if len(step.BrowserSteps) > 0 {
			if p.browserDownloader == nil {
				p.NewBrowserHub(p.task.EnableBrowser, p.path)
			}

			for idx, bs := range step.BrowserSteps {
				if len(bs.GetUrl) > 0 {
					newurl := p.downloader.Context.Parse(bs.GetUrl)
					dlog.Info("%s parse browser url to real: %s -> %s/%d", p.id, bs.GetUrl, newurl, idx)
					bs.GetUrl = newurl
				}
			}
			err := step.DoViaBrowser(p.id, p.browserDownloader)
			if err != nil {
				dlog.Warn("%s error occurred when do browser steps: %v", p.id, err)
			}
		}

		err := step.Do(p.id, p.downloader, p.record, p.casperJS)
		if nil != err {
			dlog.Warn("%s downloader dostep fail: %v", p.id, err)
		}
		p.setUsername()

		if action := step.GetAction(p.downloader.Context); action != nil {
			for _, ex := range action.DeleteExtract {
				if strings.Contains(ex, "{{") && strings.Contains(ex, "}}") {
					ex = p.downloader.Context.Parse(ex)
				}
				exs := strings.Split(ex, "##")
				er := p.downloader.ExtractorResults
				for i, es := range exs {
					if i == len(exs)-1 {
						delete(er, es)
						break
					}

					if results, ok := er[es]; ok {
						if rs, ok := results.(map[string]interface{}); ok {
							er = rs
						}
					}
				}
			}
			if step.QrcodeSuccess {
				p.record.QrcodeSuccess = true
			}

			if action.LoginSuccess {
				p.record.LoginSuccess = true
				p.record.LoginTime = ParseTimestamp(time.Now().Sub(startTime))
				startTime = time.Now()
			}

			for _, d := range action.DeleteContext {
				delete(p.args, d)
				p.downloader.Context.Del(d)
			}

			action.DoOpers(p.downloader.Context)
			p.setUsername()
			dlog.Warn("%s fire action %v", p.id, action.Condition)
			if action.Message != nil {
				mdata := p.downloader.Context.Parse(action.Message["data"])
				msg := &cmd.Output{
					Status:    action.Message["status"],
					Id:        p.id,
					NeedParam: p.downloader.Context.Parse(action.Message["need_param"]),
					Data:      mdata,
					Tmpl:      p.tmpl,
					Extra:     p.downloader.Context.Parse(action.Message["extra"]),
				}
				dlog.Warn("%s action message: %v", p.id, msg)

				p.message <- msg
				p.msgTime = time.Now()

				if msg.Status == cmd.FAIL || msg.Status == cmd.FINISH_FETCH_DATA {
					p.finished = true
					p.closeBrowser()
					dlog.Warn("%s push es log: %s", p.id, mdata)
					if msg.Status == cmd.FAIL {
						if v, ok := config.Instance.DisableRecord[p.tmpl]; !ok || !v {
							p.record.FetchTime = ParseTimestamp(time.Now().Sub(startTime))
							p.record.TotalTime = GetTwoPoint(p.record.InitTime + p.record.LoginTime + p.record.FetchTime)
							p.record.Fail = true
							p.record.FailMessage = mdata
							p.record.SendRecord(true)
						}
					}
					p.writeResult = true
					return
				}
			}

			if len(action.Goto) > 0 {
				action.Goto = p.downloader.Context.Parse(action.Goto)
				_, ok := retry[action.Goto]
				goto_times := 30
				if step.GotoTimes != 0 {
					goto_times = step.GotoTimes
				}
				if ok {
					if retry[action.Goto] > goto_times {
						msg := &cmd.Output{
							Status: "fail",
							Id:     p.id,
							Data:   fmt.Sprintf("retry tag [%s] too many times", action.Goto),
							Tmpl:   p.tmpl,
						}
						dlog.Warn("%s retry tag [%s] too many times ! %v", p.id, action.Goto, err)
						dlog.Error("%s message: %v", p.id, msg)

						p.message <- msg
						p.msgTime = time.Now()

						p.finished = true
						p.closeBrowser()
						return
					}
					retry[action.Goto] += 1
					c, ok = gotoMap[action.Goto]
					if !ok {
						dlog.Error(p.id, " can not find goto tag ", action.Goto)
					}

					c++
					dlog.Info("%s goto step %d with tag %s", p.id, c, action.Goto)
					continue
				} else {
					dlog.Warn("%s don't have tag: %s", p.id, action.Goto)
				}
			}
		}

		if step.QrcodeSuccess {
			p.record.QrcodeSuccess = true
		}

		if step.LoginSuccess {
			p.record.LoginSuccess = true
			p.record.LoginTime = ParseTimestamp(time.Now().Sub(startTime))
			startTime = time.Now()
		}

		if step.Message != nil && len(step.Message) > 0 {
			data := p.downloader.Context.Parse(step.Message["data"])
			if step.Message["status"] == cmd.FINISH_FETCH_DATA {
				finishMsgData = data
				break
			}

			msg := &cmd.Output{
				Status:    step.Message["status"],
				Id:        p.id,
				Data:      data,
				Tmpl:      p.tmpl,
				NeedParam: p.downloader.Context.Parse(step.Message["need_param"]),
				Extra:     p.downloader.Context.Parse(step.Message["extra"]),
			}
			dlog.Warn("%s message: %v", p.id, msg)

			if p.message != nil {
				p.message <- msg
				p.msgTime = time.Now()
			}

			if msg.Status == cmd.FAIL {
				p.closeBrowser()
				p.finished = true
				if v, ok := config.Instance.DisableRecord[p.tmpl]; !ok || !v {
					p.record.Fail = true
					p.record.FailMessage = data
					p.record.FetchTime = ParseTimestamp(time.Now().Sub(startTime))
					p.record.TotalTime = GetTwoPoint(p.record.InitTime + p.record.LoginTime + p.record.FetchTime)
					p.record.SendRecord(true)
				}
				p.writeResult = true
				return
			}
		}

		if len(step.UsePython) > 0 {
			extractorResult := p.downloader.ExtractorResultString()

			pyScript := step.UsePython
			scriptPath := "etc/python/" + pyScript

			f, err := ioutil.TempFile(p.downloader.OutputFolder, "temp")
			if err == nil {
				defer f.Close()
				var out bytes.Buffer
				if err := json.Indent(&out, []byte(extractorResult), "", "\t"); err == nil {
					out.WriteTo(f)
					script := exec.Command("python", scriptPath, f.Name())
					stdout, err := script.StdoutPipe()
					if err != nil {
						dlog.Info("%s get python script stdout error: %s", p.id, err)
					}
					defer stdout.Close()
					if err := script.Start(); err != nil {
						dlog.Info("%s run python script error! \n%s", p.id, err)
					} else {
						opBytes, err := ioutil.ReadAll(stdout)
						script.Wait()
						if err == nil {
							extractorResult = string(opBytes)
							dlog.Warn("%s run python script success, result: %d", p.id, len(extractorResult))

							os.Remove(f.Name())

							var exresult map[string]interface{}
							err := json.Unmarshal(opBytes, &exresult)
							status, exist := exresult["status"]
							if err != nil || (exist && status == "fail") {
								msg := &cmd.Output{
									Status: "fail",
									Id:     p.id,
									Data:   "crawled fail",
									Tmpl:   p.tmpl,
								}
								dlog.Warn("%s Unmarshal python script result error! %v", p.id, err)
								dlog.Warn("%s message: %v", p.id, msg)

								p.message <- msg
								p.msgTime = time.Now()

								p.finished = true
								return
							}
							p.downloader.ExtractorResults = exresult
						}
					}
				}
			}
		}

		if step.Next != nil {
			extractorResult := p.downloader.ExtractorResultString()
			p.nextToRedis(step.Next, extractorResult)
		}

		c++
	}

	p.writeResult = true
	extractorResult := p.downloader.ExtractorResultString()
	if !p.task.DisableOutputFolder {
		path := p.downloader.OutputFolder + "/ExtractorInfo.json"
		p.downloader.OutputFolders["ExtractorInfo.json"] = extractorResult

		os.Remove(path)
		saveFile, err := os.Create(path)
		if err == nil {
			defer saveFile.Close()
			var out bytes.Buffer
			if err := json.Indent(&out, []byte(extractorResult), "", "\t"); err == nil {
				out.WriteTo(saveFile)
			}
		}

		p.sendToFlume()
	}

	if len(extractorResult) > 10 {
		if v, ok := config.Instance.DisableRecord[p.tmpl]; !ok || !v {
			hrecord.JudgeExtractResult(p.tmpl, p.downloader.ExtractorResults)
		}
	}

	if v, ok := config.Instance.DisableDatabase[p.tmpl]; (!ok || !v) && config.Instance.OnLine {
		p.writeFiles(p.getUserName(), extractorResult)
	}

	finishData := extractorResult
	if len(finishMsgData) > 0 {
		finishData = finishMsgData
	}

	message := &cmd.Output{
		Status: cmd.FINISH_FETCH_DATA,
		Id:     p.id,
		Data:   finishData,
		Tmpl:   p.tmpl,
	}
	dlog.Warn("%s finish_fetch_data and you can see extractor result in ExtractorInfo.json", p.id)

	p.closeBrowser()
	p.message <- message
	p.finished = true
	if v, ok := config.Instance.DisableRecord[p.tmpl]; !ok || !v {
		p.record.FetchTime = ParseTimestamp(time.Now().Sub(startTime))
		p.record.TotalTime = GetTwoPoint(p.record.InitTime + p.record.LoginTime + p.record.FetchTime)
		p.record.FinishFetchData = true
		p.record.SendRecord(true)
	}
}

func (p *TaskCmd) nextToRedis(next *Next, extractorResult string) {
	var values []interface{}
	var target string
	var paramList []url.Values
	var targetList [][]interface{}
	tmpl := next.Tmpl
	targetArgs := next.Target
	args := next.Args
	priority := next.Priority
	if tmpl == "" || len(targetArgs) == 0 || len(args) == 0 {
		dlog.Error("task params error tmpl: %s, targetArgs: %s, args: %s", tmpl, targetArgs, args)
		return
	}
	redisList := config.Instance.RedisBaseKey + tmpl
	link := config.Instance.ServiceHost + "/submit?"
	params := url.Values{}
	params.Set("tmpl", tmpl)
	first := true
	for k, v := range args {
		arg1, _ := extractor.Extract([]byte(extractorResult), v, "json", p.downloader.Context)
		if arg1 == nil {
			dlog.Warn("task args is nil")
			return
		}
		if argList, ok := arg1.([]interface{}); ok {
			for i, arg2 := range argList {
				if arg, ok1 := arg2.(string); ok1 {
					if first {
						param := url.Values{}
						param.Set(k, arg)
						paramList = append(paramList, param)
					} else {
						paramList[i].Set(k, arg)
					}
				}
			}
			first = false
		} else if arg, ok2 := arg1.(string); ok2 {
			params.Set(k, arg)
		}
	}
	link = link + params.Encode()
	for _, v := range targetArgs {
		target1, _ := extractor.Extract([]byte(extractorResult), v, "json", p.downloader.Context)
		target2, ok := target1.([]interface{})
		if ok {
			targetList = append(targetList, target2)
		} else {
			target, _ = target1.(string)
		}

	}
	if paramList != nil {
		for i, param1 := range paramList {
			var target3 string
			targetUrl := link + "&" + param1.Encode()
			dlog.Info("targetUrl: %s", targetUrl)
			for _, target1 := range targetList {
				target2, _ := target1[i].(string)
				target3 += target2 + "&"
			}
			jsonData, ok := getRedisData(tmpl, targetUrl, target3)
			if ok {
				values = append(values, jsonData)
				dlog.Info("push to redis list: target %s", target3)
			}
		}
	} else {
		jsonData, ok := getRedisData(tmpl, link, target)
		if ok {
			values = append(values, jsonData)
			dlog.Info("push to redis list target %s", target)
		}

	}
	if values != nil {
		if priority {
			_, err := sql.RpushToRedis(redisList, values...)
			if err != nil {
				dlog.Warn("Fail to push into Redis list %s:%v", redisList, err)
			}
		} else {
			_, err := sql.LpushToRedis(redisList, values...)
			if err != nil {
				dlog.Warn("Fail to push into Redis list %s:%v", redisList, err)
			}
		}
	}
}

func getRedisData(tmpl, link, target interface{}) (interface{}, bool) {
	var jsonData interface{}
	params := []interface{}{tmpl, target}
	isExist := sql.SelectFromCrawledTable("select count(*) from crawled where tmpl = ? and target = ?", params)[0]["count(*)"] != "0"
	if !isExist {
		data := make(map[string]interface{}, 7)
		t := time.Now().Unix()
		timeString := strconv.FormatInt(t, 10)
		data["timestamp"] = timeString
		data["tmpl"] = tmpl
		data["link"] = link
		data["target"] = target
		data["times"] = "0"
		data["ban"] = "false"
		data["priority"] = "true"
		jsonData, _ = json.Marshal(data)
		return jsonData, true
	} else {
		return jsonData, false
	}

}

func (p *TaskCmd) closeBrowser() {
	if p.browserDownloader != nil {
		p.browserDownloader.Close()
	}
}

func (p *TaskCmd) sendToFlume() {
	timestamp := strconv.FormatInt(time.Now().Unix(), 10)
	buf := timestamp + "\t" + p.tmpl + "\t" + p.id + "\t"
	for filename, filebody := range p.downloader.OutputFolders {
		body := buf + filename + "\t" + filebody
		flume.Flume.Send(p.tmpl, []byte(body))
	}
}

func (p *TaskCmd) writeFiles(username, extractorResult string) {
	if len(username) == 0 {
		dlog.Error("%s username is empty, so push file to sql fail", p.id)
		return
	}

	exdata := make(map[string]string, 1)
	exdata["ExtractorInfo_json"] = extractorResult
	ex, _ := json.Marshal(&exdata)
	data := make(map[string]string, 1)
	data["tmpl"] = p.tmpl
	data["username"] = username
	data["data"] = string(ex)
	if v, ok := config.Instance.UseUploadFile[p.tmpl]; ok && v && config.Instance.OnLine {
		f, err := ioutil.TempFile(p.downloader.OutputFolder, "tempsqlfile")
		if err == nil {
			defer f.Close()
			tmpdata, err := json.Marshal(data)
			if err != nil {
				dlog.Warn("%s marshal data error when upload file to sql! %v", p.id, err)
			}
			f.Write(tmpdata)

			client := ahttp.HttpClient(300)
			status := ahttp.HttpPostFile(client, config.Instance.FileUploadUrl, f.Name())
			dlog.Info("%s upload file to file sql and redis key: %s, status: %s", p.id, p.tmpl+"_"+username, string(status))

			os.Remove(f.Name())
		}
	} else {
		client := ahttp.HttpClient(60)
		status := ahttp.HttpPost(client, config.Instance.FileSqlUrl, data)
		dlog.Info("%s write data to file sql and redis key: %s, status: %s", p.id, p.tmpl+"_"+username, string(status))
	}
}
