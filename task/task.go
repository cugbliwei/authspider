package task

import (
	"encoding/json"
	"io/ioutil"

	"github.com/cugbliwei/dlog"
)

const (
	CAPTCHA_BUCKET  = "crawlercaptchas"
	USERDATA_BUCKET = "crawleruserdata"
)

type Task struct {
	Steps                 []*Step `json:"steps"`
	Next                  *Next   `json:"next"`
	DisableOutPubKey      bool    `json:"disable_outpubkey"`
	DisableCasperjsProxy  bool    `json:"disable_casperjs_proxy"`
	DisableOutputFolder   bool    `json:"disable_output_folder"`
	DisableInCrawling     bool    `json:"disable_in_crawling"`
	WriteExtractorResults bool    `json:"write_extractor_results"`
	CasperjsScript        string  `json:"casperjs_script"`
	TmplBlockTime         string  `json:"tmpl_block_time"`
	EnableBrowser         bool    `json:"enable_browser"`
}

type Task1 struct {
	Steps               []*Step1 `json:"steps"`
	DisableOutPubKey    bool     `json:"disable_outpubkey"`
	DisableOutputFolder bool     `json:"disable_output_folder"`
	CasperjsScript      string   `json:"casperjs_script"`
	TmplBlockTime       string   `json:"tmpl_block_time"`
	EnableBrowser       bool     `json:"enable_browser"`
}

func NewTask(f string) *Task {
	c, err := ioutil.ReadFile(f)
	if err != nil {
		dlog.Error("fail to read file %s", f)
		return nil
	}
	var task Task
	err = json.Unmarshal(c, &task)
	if err != nil {
		dlog.Error("fail to get task %s: %s", err.Error(), f)
		return nil
	}
	return &task
}

func (p *Task) DeepCopy() *Task {
	b, _ := json.Marshal(p)
	var ret Task
	json.Unmarshal(b, &ret)
	return &ret
}

func NewTask1(f string) *Task1 {
	c, err := ioutil.ReadFile(f)
	if err != nil {
		dlog.Error("fail to read file %s", f)
		return nil
	}
	var task Task1
	err = json.Unmarshal(c, &task)
	if err != nil {
		dlog.Error("fail to get task %s: %s", err.Error(), f)
		return nil
	}
	return &task
}

func (p *Task1) DeepCopy1() *Task1 {
	b, _ := json.Marshal(p)
	var ret Task1
	json.Unmarshal(b, &ret)
	return &ret
}
