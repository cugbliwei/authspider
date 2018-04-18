package task

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/SKatiyar/qr"
	"github.com/cugbliwei/authspider/browserhub"
	"github.com/cugbliwei/authspider/casperjs"
	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/authspider/context"
	"github.com/cugbliwei/authspider/extractor"
	hrecord "github.com/cugbliwei/authspider/record"
	"github.com/cugbliwei/authspider/sql"
	"github.com/cugbliwei/authspider/util"
	"github.com/cugbliwei/dlog"
)

type Require struct {
	File    string `json:"file"`     //引用的文件名
	From    string `json:"from"`     //从哪个page开始引用
	FromTag string `json:"from_tag"` //从哪个tag开始引用
	To      string `json:"to"`       //到哪结束
}

type Retry struct {
	MaxTimes     int  `json:"max_times"` //step重复次数
	ContinueThen bool `json:"continue_then"`
}

type QRCodeImage struct {
	Src        string `json:"src"`         //二维码地址
	ContextKey string `json:"context_key"` //context上下文的变量名
}

type Captcha struct {
	ImgBody    string `json:"img_body"`    //图片内容
	ImgFormat  string `json:"img_format"`  //图片格式
	CodeType   string `json:"code_type"`   //打码类型
	ContextKey string `json:"context_key"` //context上下文的变量名
}

type Tesseract struct {
	Path       string `json:"path"`        //文件地址
	Language   string `json:"language"`    //ocr的语言
	ContextKey string `json:"context_key"` //context上下文的变量名
}

type UploadImage struct {
	ContextKey string `json:"context_key"` //context上下文的变量名
	Format     string `json:"format"`      //图片格式
	Base64Src  string `json:"base64_src"`  //图片base64之后
}

func (p *UploadImage) Filename() string {
	return p.ContextKey + "." + p.Format
}

type Step struct {
	Require           *Require                  `json:"require"`             //类似include，把别的文件的模板加进来
	Tag               string                    `json:"tag"`                 //step标记，goto的目标是tag
	CookieJar         string                    `json:"cookiejar"`           //已失效，不用了
	Condition         string                    `json:"condition"`           //进入条件判断，为true才执行些step
	NeedParam         string                    `json:"need_param"`          //需要什么参数，英文逗号隔开
	Page              string                    `json:"page"`                //访问的url地址
	PageFile          string                    `json:"page_file"`           //访问的文件地址
	Method            string                    `json:"method"`              //请求方法，GET、POST、POSTJSON
	Header            map[string]string         `json:"header"`              //请求的头部信息
	HeaderUnknown     string                    `json:"header_unknown"`      //请求的头部信息，从context上下文来
	Params            map[string]string         `json:"params"`              //Post参数设置
	ParamsUnknown     string                    `json:"params_unknown"`      //Post参数设置，从context上下文来
	Actions           []*Action                 `json:"actions"`             //终止或者跳转条件判断
	JsonPostBody      interface{}               `json:"json_post_body"`      //当Method为POSTJSON时，请求参数在这设置
	UploadImage       *UploadImage              `json:"upload_image"`        //上传图片到redis中
	Captcha           *Captcha                  `json:"captcha"`             //验证码操作
	QRcodeImage       *QRCodeImage              `json:"qrcode_image"`        //二维码上传
	VisitTimes        int                       `json:"visit_times"`         //失败的请求次数
	ProxySwitch       bool                      `json:"proxy_switch"`        //是否切换代理ip
	ProxyDailySwitch  bool                      `json:"proxy_daily_switch"`  //是否切换按天轮询的 goproxy 代理服务
	QrcodeSuccess     bool                      `json:"qrcode_success"`      //标记扫码成功
	LoginSuccess      bool                      `json:"login_success"`       //标记登录成功
	UseCookie         string                    `json:"use_cookie"`          //使用cookie
	DocType           string                    `json:"doc_type"`            //目标网页的格式类型
	ResponseTimeout   int                       `json:"response_timeout"`    //设置超时时间
	OutputFilename    string                    `json:"output_filename"`     //输出文件名
	DisableUpload     bool                      `json:"disable_upload"`      //已失效，不用了
	ContextOpers      []string                  `json:"context_opers"`       //context上下文操作
	ExtractorNew      bool                      `json:"extractor_new"`       //解析版本设置，此设置为用最新版本的解析合并
	ExtractorSource   string                    `json:"extractor_source"`    //解析的源内容
	Extractor         map[string]interface{}    `json:"extractor"`           //解析内容
	Sleep             int                       `json:"sleep"`               //此步骤结束之后暂时多少时间
	Message           map[string]string         `json:"message"`             //给http.Response返回的消息
	PutCookie         map[string][]*http.Cookie `json:"put_cookie"`          //cookie put操作
	BrowserSteps      []*browserhub.Step        `json:"browser_steps"`       //selenium操作步骤
	BrowserCookieSync bool                      `json:"browser_cookie_sync"` //selenium cookie操作
	Tesseract         *Tesseract                `json:"tesseract"`           //tesseract ocr图片识别
	GetFromRedis      string                    `json:"get_from_redis"`      //从redis中拿数据
	PushToRedis       string                    `json:"push_to_redis"`       //存数据入redis
	UsePython         string                    `json:"use_python"`          //执行python脚本
	GotoTimes         int                       `json:"goto_times"`          // 最大goto次数，默认30
	Next              *Next                     `json:"next"`                //加入请求到redis队列
}

type Step1 struct {
	Require           *Require                  `json:"require"`
	Tag               string                    `json:"tag"`
	Retry             *Retry                    `json:"retry"`
	CookieJar         string                    `json:"cookiejar"`
	Condition         string                    `json:"condition"`
	NeedParam         string                    `json:"need_param"`
	Page              string                    `json:"page"`
	Method            string                    `json:"method"`
	Header            map[string]string         `json:"header"`
	HeaderUnknown     string                    `json:"header_unknown"`
	Params            map[string]string         `json:"params"`
	ParamsUnknown     string                    `json:"params_unknown"`
	Actions           []*Action1                `json:"actions"`
	JsonPostBody      interface{}               `json:"json_post_body"`
	UploadImage       *UploadImage              `json:"upload_image"`
	Captcha           *Captcha                  `json:"captcha"`
	QRcodeImage       *QRCodeImage              `json:"qrcode_image"`
	VisitTimes        int                       `json:"visit_times"`
	QrcodeSuccess     bool                      `json:"qrcode_success"`
	LoginSuccess      bool                      `json:"login_success"`
	UseCookie         string                    `json:"use_cookie"`
	DocType           string                    `json:"doc_type"`
	ResponseTimeout   int                       `json:"response_timeout"`
	OutputFilename    string                    `json:"output_filename"`
	DisableUpload     bool                      `json:"disable_upload"`
	ContextOpers      []string                  `json:"context_opers"`
	ExtractorNew      bool                      `json:"extractor_new"`
	ExtractorSource   string                    `json:"extractor_source"`
	Extractor         map[string]interface{}    `json:"extractor"`
	Sleep             int                       `json:"sleep"`
	Message           map[string]string         `json:"message"`
	PutCookie         map[string][]*http.Cookie `json:"put_cookie"`
	BrowserSteps      []*browserhub.Step        `json:"browser_steps"`
	BrowserCookieSync string                    `json:"browser_cookie_sync"`
	Tesseract         *Tesseract                `json:"tesseract"`
	GetFromRedis      string                    `json:"get_from_redis"`
	PushToRedis       string                    `json:"push_to_redis"`
}

type Next struct {
	Tmpl     string            `json:"tmpl"`
	Target   []string          `json:"target"`
	Args     map[string]string `json:"args"`
	Priority bool              `json:"priority"`
}

func (s *Step) getPageUrls(c *context.Context) string {
	return c.Parse(s.Page)
}

func (s *Step) getParams(c *context.Context) map[string]string {
	ret := make(map[string]string, 5)
	tmp := s.Params
	if len(s.ParamsUnknown) > 0 {
		params := c.Parse(s.ParamsUnknown)
		p := make(map[string]string, 5)
		if err := json.Unmarshal([]byte(params), &p); err != nil {
			dlog.Warn("Unmarshal header unknown error: %v", err)
			return ret
		}
		tmp = p
	}

	for k, v := range tmp {
		ret[c.Parse(k)] = c.Parse(v)
	}
	return ret
}

func (s *Step) browserCookieSync(id string, downloader *Downloader, browser *browserhub.BrowserHub) {
	defer browser.Close()
	val := browser.GetCookies()
	dlog.Info("%s selenium browser cookie: %s", id, val)
	err := downloader.Jar.ReadFrom(strings.NewReader(val))
	if err != nil {
		dlog.Error("%s read cookie from browser failed: %s", id, err)
	}
}

func (s *Step) addContextOutputs(c *context.Context) {
	for _, co := range s.ContextOpers {
		c.Parse(co)
	}
}

func (s *Step) extract(body []byte, d *Downloader) {
	if s.Extractor == nil || len(s.Extractor) == 0 {
		return
	}
	if len(s.ExtractorSource) > 0 {
		body = []byte(d.Context.Parse(s.ExtractorSource))
	}
	ret, err := extractor.Extract(body, s.Extractor, s.DocType, d.Context)
	if err != nil {
		dlog.Warn("extract error of %v: %v", s.Extractor, err)
		return
	}
	if s.ExtractorNew {
		d.AddNewExtractorResult(d.ExtractorResults, ret)
	} else {
		d.AddExtractorResult(ret)
	}
}

func (s *Step) getHeader(c *context.Context) map[string]string {
	ret := make(map[string]string)
	tmp := s.Header
	if len(s.HeaderUnknown) > 0 {
		headers := c.Parse(s.HeaderUnknown)
		h := make(map[string]string, 5)
		if err := json.Unmarshal([]byte(headers), &h); err != nil {
			dlog.Warn("Unmarshal header unknown error: %v", err)
			return ret
		}
		tmp = h
	}

	for k, v := range tmp {
		ret[c.Parse(k)] = c.Parse(v)
	}
	return ret
}

func (s *Step) getRawPostData() []byte {
	if v, ok := s.JsonPostBody.(string); ok {
		return []byte(v)
	}
	b, _ := json.Marshal(s.JsonPostBody)
	return b
}

func (s *Step) download(id string, d *Downloader) ([]byte, error) {
	page := s.getPageUrls(d.Context)
	if strings.Contains(page, "<no value>") {
		return nil, errors.New("unsupported url: " + page)
	}
	dlog.Warn("%s download %s", id, page)
	d.UpdateCookieToContext(page)
	if len(s.Method) == 0 || s.Method == "GET" {
		return d.Get(id, page, s.getHeader(d.Context))
	} else if s.Method == "POST" {
		return d.Post(id, page, s.getParams(d.Context), s.getHeader(d.Context))
	} else if s.Method == "POSTJSON" {
		return d.PostRaw(id, page, s.getRawPostData(), s.getHeader(d.Context))
	} else if s.Method == "POSTFILE" {
		return d.PostFile(id, page, s.getParams(d.Context), s.getHeader(d.Context))
	} else if s.Method == "POST_CUSTOM" {
		return d.PostWithCharset(id, page, s.getParams(d.Context), "gbk", s.getHeader(d.Context))
	}
	return nil, errors.New("unsupported method: " + s.Method)
}

func (s *Step) PassCondition(c *context.Context) bool {
	if len(s.Condition) == 0 {
		return true
	}
	return c.Parse(s.Condition) == "true"
}

func (s *Step) GetAction(c *context.Context) *Action {
	for _, f := range s.Actions {
		if f.IsFire(c) {
			return f
		}
	}
	return nil
}

func (s *Step) GetOutputFilename(c *context.Context) string {
	if len(s.OutputFilename) == 0 {
		return ""
	}
	return c.Parse(s.OutputFilename)
}

func (s *Step) procUploadImage(id string, body []byte, d *Downloader) error {
	b := body
	if len(s.UploadImage.Base64Src) > 0 {
		bsrc := d.Context.Parse(s.UploadImage.Base64Src)
		b, _ = base64.StdEncoding.DecodeString(bsrc)
	}
	imgLink, err := sql.UploadImageToRedis(b)
	if err != nil {
		dlog.Warn("%s upload image fail: %v", id, err)
		return err
	}
	dlog.Info("%s upload image to %s", id, imgLink)
	d.Context.Set(s.UploadImage.ContextKey, imgLink)
	return nil
}

func (s *Step) Do(id string, d *Downloader, record *hrecord.Record, cas *casperjs.CasperJS) error {
	if len(s.CookieJar) > 0 {
		d.SetCookie(d.Context.Parse(s.CookieJar))
	}

	body := []byte{}
	if len(s.Page) > 0 {
		record.TotalPages += 1
		if strings.Contains(s.Page, "127.0.0.1") || strings.Contains(s.Page, "10.") || strings.Contains(s.Page, "192.168") {
			d.ChangeToLocalHttpClient(id)
		} else {
			d.ChangeToNewHttpClient(id, s.ResponseTimeout)
		}

		var err error
		visitTimes := 1
		if s.VisitTimes > 0 {
			visitTimes = s.VisitTimes
		}

		startTime := time.Now()
		for i := 0; i < visitTimes; i++ {
			body, err = s.download(id, d)
			if err == nil {
				record.TotalPageSize += len(body)
				break
			}

			if s.ProxySwitch {
				d.ChangeToNewProxyClient(id, s.ResponseTimeout)
			} else if s.ProxyDailySwitch {
				d.ChangeToDailyProxyClient(id, s.ResponseTimeout)
			}
		}
		record.TotalPageTime = GetTwoPoint(record.TotalPageTime + ParseTimestamp(time.Now().Sub(startTime)))

		d.ChangeToOriginHttpClient(s.ResponseTimeout)
		if err != nil {
			dlog.Warn("%s err is not nil: %s", id, err)
			return err
		}
	}

	if len(s.GetFromRedis) > 0 {
		key := d.Context.Parse(s.GetFromRedis)
		result, err := sql.GetFromMixRedis(key)
		if err != nil {
			dlog.Warn("%s get key: %s result from mix redis error: %v", id, key, err)
			body = []byte("error")
		} else {
			dlog.Warn("%s get key: %s result from mix redis success, len: %d", id, key, len(result))
			body = []byte(result)
		}
	}

	if len(s.PageFile) > 0 {
		filename := d.Context.Parse(s.PageFile)
		buf, err := ioutil.ReadFile(filename)
		if err != nil {
			dlog.Warn("%s page read file error: %v", id, err)
		}
		body = buf
	}

	out := s.GetOutputFilename(d.Context)
	d.Context.Set("_body", string(body))
	d.Context.Set("_url", d.LastPageUrl)
	s.addContextOutputs(d.Context)
	s.extract(body, d)

	if len(out) > 0 {
		path := d.OutputFolder + "/" + out
		ob := strings.Replace(string(body), "\t", "", -1)
		ob = strings.Replace(ob, "\n", "", -1)
		d.OutputFolders[out] = ob
		dlog.Info("%s write file %s to %s", id, out, path)
		if err := ioutil.WriteFile(path, body, 0655); err != nil {
			dlog.Error("%s write file failed: %v", id, err)
		}
	}

	if s.UploadImage != nil && len(string(body)) > 0 {
		s.procUploadImage(id, body, d)
	}

	if s.QRcodeImage != nil {
		qc, qerr := qr.Encode(d.Context.Parse(s.QRcodeImage.Src), qr.M)
		if qerr != nil {
			dlog.Warn("%s Encode Qrcode Err:%s", id, qerr.Error())
		} else {
			png := qc.PNG()
			uploadUrl, err := sql.UploadImageToRedis(png)
			if err != nil {
				dlog.Warn("%s upload image err:%s", id, err.Error())
			}
			d.Context.Set(s.QRcodeImage.ContextKey, uploadUrl)
		}
	}

	if s.Tesseract != nil {
		params := map[string]string{
			"language": s.Tesseract.Language,
			"id":       id,
		}
		result, err := util.Upload(config.Instance.Tesseract.Host, params, "file", d.OutputFolder+"/"+d.Context.Parse(s.Tesseract.Path))
		if err == nil {
			dlog.Info("%s context set %s: %s", id, s.Tesseract.ContextKey, string(result))
			d.Context.Set(s.Tesseract.ContextKey, string(result))
		}
	}

	if s.Captcha != nil {
	}

	if len(s.PushToRedis) > 0 {
		rs := strings.Split(s.PushToRedis, ",")
		if len(rs) != 3 {
			return errors.New("push to redis error: params is not 3")
		}
		key := d.Context.Parse(rs[0])
		value := d.Context.Parse(rs[1])
		timeout, _ := strconv.Atoi(d.Context.Parse(rs[2]))
		if err := sql.WriteToMixRedisGetError(key, value, timeout); err != nil {
			dlog.Warn("set result to redis error: %v, key", err, key)
			return errors.New("set result to redis error")
		}
		if len(value) < 100 {
			dlog.Warn("set result to redis success, key: %s, result: %s", key, value)
		} else {
			dlog.Warn("set result to redis success, key: %s, result len: %d", key, len(value))
		}
		return nil
	}

	if len(s.UseCookie) > 0 {
		s.useCookie(d, s.UseCookie)
	}

	if s.Sleep > 0 {
		time.Sleep(time.Duration(s.Sleep) * time.Second)
	}
	return nil
}

func (s *Step) DoViaBrowser(id string, browser *browserhub.BrowserHub) error {
	err := browser.DoSteps(id, s.BrowserSteps)
	return err
}

func (s *Step) useCookie(d *Downloader, cookieName string) {
	cname := d.Context.Parse(cookieName)
	if len(cname) == 0 {
		dlog.Warn("%s cookie is empty", d.Context.Data["_id"])
		return
	}

	cookieBytes, _ := base64.StdEncoding.DecodeString(cname)
	cname = string(cookieBytes)
	dlog.Warn("%s parse cookie: %v", d.Context.Data["_id"], cname)
	if err := d.Jar.ReadFrom(strings.NewReader(cname)); err != nil {
		dlog.Warn("%s read cookie field %s", d.Context.Data["_id"], err.Error())
	}
	dlog.Info("%s use cookie success :%s", d.Context.Data["_id"], cookieName)
}
