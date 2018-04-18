package task

import (
	"github.com/cugbliwei/authspider/context"
)

type Action struct {
	Condition       string            `json:"condition"`
	Goto            string            `json:"goto"`
	Opers           []string          `json:"opers"`
	DeleteContext   []string          `json:"delete_context"`
	DeleteExtract   []string          `json:"delete_extract"`
	Message         map[string]string `json:"message"`
	LoginSuccess    bool              `json:login_success`
	QrcodeSuccess   bool              `json:qrcode_success`
	FinishFetchData bool              `json:finish_fetch_data`
}

type Action1 struct {
	Condition       string            `json:"condition"`
	Goto            string            `json:"goto"`
	Opers           []string          `json:"opers"`
	DeleteContext   []string          `json:"delete_context"`
	DeleteExtract   string            `json:"delete_extract"`
	Message         map[string]string `json:"message"`
	Info            string            `json:"info"`
	LoginSuccess    bool              `json:login_success`
	QrcodeSuccess   bool              `json:qrcode_success`
	FinishFetchData bool              `json:finish_fetch_data`
}

func (p *Action) IsFire(c *context.Context) bool {
	return c.Parse(p.Condition) == "true"
}

func (p *Action) DoOpers(c *context.Context) {
	for _, op := range p.Opers {
		c.Parse(op)
	}
}
