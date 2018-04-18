package browserhub

import (
	"bytes"
	"errors"
	"fmt"
	"image"
	"image/png"
	"strings"
	"time"

	"github.com/cugbliwei/authspider/cookie"
	"github.com/cugbliwei/dlog"
	"github.com/cugbliwei/selenium"
)

type Condition struct {
	ExistElement    string `json:"exist_element"`
	NotExistElement string `json:"not_exist_element"`
	ContextKey      string `json:"context_key"`
}

type ShotRandcode struct {
	Image       string `json:"image"`
	UploadImage string `json:"upload_image"`
}

type Step struct {
	Condition      *Condition `json:"condition"`
	ConditionJudge bool
	AheadEnd       bool              `json:"ahead_end"`
	GetUrl         string            `json:"get"`
	SendKeys       map[string]string `json:"send_keys"`
	SwitchFrame    int               `json:"switch_frame"`
	Click          string            `json:"click"`
	MouseMove      string            `json:"mouse_move"`
	MouseDownMove  int               `json:"mouse_down_move"`
	Screenshot     string            `json:"screen_shot"`
	ShotRandcode   *ShotRandcode     `json:"shot_randcode"`
	SelectOutput   map[string]string `json:"select_output"`
	ExecuteScript  map[string]string `json:"execute_script"`
	AddTitile      string            `json:"add_title"`
	Sleep          int               `json:"sleep"`
	PageSource     string            `json:"page_source"`
	ResizeWindow   string            `json:"resize_window"`
}

type BrowserHubConfig struct {
	Service             string
	Browser             map[string]string
	Capabilities        map[string]interface{}
	PageLoadTimeout     int64
	ImplicitWaitTimeout int64
	AsyncScriptTimeout  int64
}

type BrowserHub struct {
	webDriver        selenium.WebDriver
	isClose          bool
	GetValue         func(key string) string
	SetValue         func(key, value string)
	ScreenListener   func(filename string, image []byte)
	RandcodeListener func(uploadKey string, randcode []byte)
	WritePageSource  func(filename string, source string)
}

func NewBrowserHub(hubConfig *BrowserHubConfig, tmpl string) (*BrowserHub, error) {
	ret := &BrowserHub{}
	caps := selenium.Capabilities{}
	for k, v := range hubConfig.Capabilities {
		caps[k] = v
	}

	if browser, ok := hubConfig.Browser[tmpl]; ok {
		caps["browserName"] = browser
	}

	wd, err := selenium.NewRemote(caps, hubConfig.Service)
	if err != nil {
		dlog.Error("selenium new remote error: %v", err)
		return nil, err
	}
	if hubConfig.AsyncScriptTimeout > 0 {
		err = wd.SetAsyncScriptTimeout(time.Duration(hubConfig.AsyncScriptTimeout))
		if err != nil {
			wd.Quit()
			return nil, err
		}
	}
	if hubConfig.ImplicitWaitTimeout > 0 {
		err = wd.SetImplicitWaitTimeout(time.Duration(hubConfig.ImplicitWaitTimeout))
		if err != nil {
			wd.Quit()
			return nil, err
		}
	}
	if hubConfig.PageLoadTimeout > 0 {
		err = wd.SetPageLoadTimeout(time.Duration(hubConfig.PageLoadTimeout))
		if err != nil {
			wd.Quit()
			return nil, err
		}
	}
	ret.webDriver = wd
	return ret, nil
}

func (self *BrowserHub) skip(condition *Condition) bool {
	if condition == nil || (len(condition.ExistElement) == 0 && len(condition.NotExistElement) == 0) {
		return false
	}

	if len(condition.ExistElement) > 0 {
		element, err := self.webDriver.FindElement(selenium.ByCSSSelector, condition.ExistElement)
		if err == nil {
			if len(condition.ContextKey) > 0 {
				text, err := element.Text()
				text = strings.TrimSpace(text)
				if err == nil && len(text) > 0 {
					self.SetValue(condition.ContextKey, text)
				}
			}
			return false
		} else {
			return true
		}
	}

	if len(condition.NotExistElement) > 0 {
		_, err := self.webDriver.FindElements(selenium.ByCSSSelector, condition.NotExistElement)
		if err == nil {
			return true
		} else {
			return false
		}
	}
	return false
}

func (self *BrowserHub) DoSteps(id string, steps []*Step) error {
	if self == nil {
		return errors.New("unexpected nil browserHub")
	}

	var err error
	for _, step := range steps {
		err = self.doStep(id, step)
		if err != nil {
			return err
		}

		if step.ConditionJudge && step.AheadEnd {
			break
		}
	}
	return nil
}

func (self *BrowserHub) doStep(id string, step *Step) error {
	dlog.Info("%s -------------------------------", id)
	if self.skip(step.Condition) {
		dlog.Info("%s skip selenium step with condition: %s", id, step.Condition)
		return nil
	}
	step.ConditionJudge = true

	if len(step.GetUrl) > 0 {
		dlog.Info("%s get url %s", id, step.GetUrl)
		self.webDriver.Get(step.GetUrl)
	}

	if len(step.SendKeys) > 0 {
		for cssSelector, keys := range step.SendKeys {
			element, err := self.webDriver.FindElement(selenium.ByCSSSelector, cssSelector)
			if err != nil {
				dlog.Warn("%s %v", id, err)
				return err
			}
			element.Clear()
			keys = self.GetValue(keys)
			dlog.Info("%s send keys %s to %s", id, keys, cssSelector)
			element.SendKeys(keys)
		}
	}

	if len(step.Click) > 0 {
		element, err := self.webDriver.FindElement(selenium.ByCSSSelector, step.Click)
		if err != nil {
			dlog.Warn("%s %v", id, err)
			return err
		}
		dlog.Info("%s click %s", id, step.Click)
		element.Click()
	}

	if len(step.ExecuteScript) > 0 {
		for script, value := range step.ExecuteScript {
			val := self.GetValue(value)
			var vv []interface{}
			if len(val) > 0 {
				vv = []interface{}{val}
			} else {
				vv = nil
			}
			resp, err := self.webDriver.ExecuteScript(script, vv)
			if err != nil {
				dlog.Error("selenium execute script error: %v", err)
			}
			dlog.Info("selenium execute script success, and result: %v", resp)
		}
	}

	if len(step.AddTitile) > 0 {
		title, err := self.webDriver.Title()
		if err != nil {
			dlog.Error("error when get title:%v", err)
		} else {
			if self.GetValue != nil {
				title = title + self.GetValue(step.AddTitile)
			} else {
				title = title + step.AddTitile
			}
			scripts := "document.title=arguments[0]"
			res, err := self.webDriver.ExecuteScript(scripts, []interface{}{title})
			if err != nil {
				dlog.Error("error when setting title:%s", title)
			} else {
				dlog.Info("setTitle:%s, result:%v", title, res)
			}
		}
	}

	if len(step.ResizeWindow) > 0 {
		var width, height int
		_, err := fmt.Fscanf(strings.NewReader(step.ResizeWindow), "%d,%d", &width, &height)
		if err != nil {
			dlog.Error("when parse resize parameter:", err)
		} else {
			dlog.Info("resize window to(%d, %d)", width, height)
			self.webDriver.ResizeWindow("", width, height)
		}
	}

	if step.MouseDownMove > 0 {
		element, err := self.webDriver.FindElement(selenium.ByCSSSelector, step.MouseMove)
		if err != nil {
			return err
		}
		point, _ := element.Location()
		dlog.Info("%s %v", id, point)
		err = element.MoveTo(1, 1)
		if err != nil {
			dlog.Warn("%s %v", id, err)
			return err
		}
		err = self.webDriver.ButtonDown()
		if err != nil {
			dlog.Warn("%s %v", id, err)
			return err
		}
	}

	if len(step.Screenshot) > 0 {
		body, err := self.webDriver.Screenshot()
		if err != nil {
			dlog.Error("%s screenshot error: %v", id, err)
		}
		self.ScreenListener(step.Screenshot, body)
	}

	if step.ShotRandcode != nil && len(step.ShotRandcode.Image) > 0 {
		dlog.Info("%s shot randcode %s", id, step.ShotRandcode.Image)
		body, err := self.webDriver.Screenshot()
		if err != nil {
			return err
		}
		element, err := self.webDriver.FindElement(selenium.ByCSSSelector, step.ShotRandcode.Image)
		if err != nil {
			dlog.Warn("%s find element error: %v", id, err)
			return err
		}
		point, err := element.Location()
		if err != nil {
			dlog.Warn("%s get image location error: %v", id, err)
			return err
		}
		size, _ := element.Size()
		img, err := png.Decode(bytes.NewBuffer(body))
		if err != nil {
			dlog.Warn("%s png decode error: %v", id, err)
			return err
		}
		rgbImg := img.(*image.NRGBA)
		subImg := rgbImg.SubImage(image.Rect(point.X+size.Width, point.Y+size.Height, point.X, point.Y)).(*image.NRGBA)
		buf := bytes.NewBuffer([]byte{})
		png.Encode(buf, subImg)
		self.RandcodeListener(step.ShotRandcode.UploadImage, buf.Bytes())
	}

	if step.SwitchFrame > 0 {
		if err := self.webDriver.SwitchFrame(step.SwitchFrame - 1); err != nil {
			dlog.Warn("%s switch frame error: %v", id, err)
		}
	}

	if len(step.SelectOutput) > 0 {
		for key, cssSelector := range step.SelectOutput {
			if strings.HasPrefix(cssSelector, "c:") {
				self.SetValue(key, cssSelector[2:])
				continue
			}

			element, err := self.webDriver.FindElement(selenium.ByCSSSelector, cssSelector)
			if err != nil {
				continue
			}

			text, err := element.Text()
			text = strings.TrimSpace(text)
			if err == nil && len(text) > 0 {
				self.SetValue(key, text)
			}
		}
	}

	if step.Sleep > 0 {
		time.Sleep(time.Duration(step.Sleep * 1000000))
	}

	if len(step.PageSource) > 0 {
		html, err := self.webDriver.PageSource()
		if err != nil {
			dlog.Error("%s get page source error: %v", id, err)
		}
		self.WritePageSource(step.PageSource, html)
	}

	return nil
}

func (self *BrowserHub) GetCookies() string {
	cookies, _ := self.webDriver.GetCookies()
	cs := make([]*cookie.Cookie, 0)
	for _, cookieEntry := range cookies {
		co := &cookie.Cookie{}
		co.Name = cookieEntry.Name
		co.Value = cookieEntry.Value
		co.Domain = cookieEntry.Domain
		co.Path = cookieEntry.Path
		co.Secure = cookieEntry.Secure
		co.Expiry = int64(cookieEntry.Expiry)
		cs = append(cs, co)
	}

	self.Close()
	return string(cookie.ConvertCookie(cs))
}

func (self *BrowserHub) Close() {
	if self.webDriver != nil && self.isClose == false {
		err := self.webDriver.Quit()
		if err == nil {
			dlog.Info("selenium browser has close")
			self.isClose = true
		} else {
			dlog.Warn("close the browser error:%v", err)
		}
	}
}
