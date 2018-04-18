package casperjs

import (
	"bufio"
	"encoding/json"
	"os/exec"
	"strings"
	"time"

	"github.com/cugbliwei/authspider/cookie"
	"github.com/cugbliwei/dlog"
)

type CasperJS struct {
	Path       string
	Cmd        *exec.Cmd
	output     *bufio.Reader
	input      *bufio.Writer
	inputChan  chan []byte
	outputChan chan []byte
}

func NewCasperJS(path, script, proxyServer, proxyType string) (*CasperJS, error) {
	ret := &CasperJS{
		Path:       path,
		inputChan:  make(chan []byte, 10),
		outputChan: make(chan []byte, 10),
	}
	if len(proxyServer) == 0 {
		ret.Cmd = exec.Command("casperjs", script,
			"--ignore-ssl-errors=true",
			"--web-security=no")
	} else {
		authHost := strings.Split(proxyServer, "@")
		if len(authHost) == 1 {
			ret.Cmd = exec.Command("casperjs", script,
				"--ignore-ssl-errors=true",
				"--web-security=no",
				"--proxy="+proxyServer, "--proxy-type="+proxyType)
		} else {
			ret.Cmd = exec.Command("casperjs", script,
				"--ignore-ssl-errors=true",
				"--web-security=no",
				"--proxy="+authHost[1], "--proxy-type="+proxyType,
				"--proxy-auth="+authHost[0])
		}
	}
	stdin, err := ret.Cmd.StdinPipe()
	if err != nil {
		return nil, err
	}
	stdout, err := ret.Cmd.StdoutPipe()
	if err != nil {
		return nil, err
	}
	ret.input = bufio.NewWriter(stdin)
	ret.output = bufio.NewReader(stdout)
	return ret, nil
}

func (self *CasperJS) Start() error {
	return self.Cmd.Start()
}

func (self *CasperJS) ReadChan() []byte {
	ret := <-self.outputChan
	return ret
}

func (self *CasperJS) WriteChan(b []byte) {
	dlog.Warn("WriteChan: %s", string(b))
	self.inputChan <- b
}

func (self *CasperJS) Read() (string, error) {
	return self.output.ReadString('\n')
}

func (self *CasperJS) Write(line string) error {
	_, err := self.input.WriteString(line)
	if err != nil {
		return err
	}
	_, err = self.input.WriteRune('\n')
	if err != nil {
		return err
	}
	return self.input.Flush()
}

func (self *CasperJS) Run(id string) error {
	err := self.Start()
	if err != nil {
		return err
	}
	dlog.Info("%s casper start now...", id)
	for {
		line, err := self.Read()
		if err != nil {
			dlog.Warn("%s casper read line failed: %v, content: %s", id, err, line)
			self.outputChan <- []byte("fail###未知错误")
			self.Cmd.Process.Kill()
			dlog.Warn("%s casper cmd has kill", id)
			return nil
		}
		line = strings.TrimSpace(line)

		if strings.HasPrefix(line, "finish") || strings.HasPrefix(line, "fail") || strings.HasPrefix(line, "skip") {
			self.outputChan <- []byte(line)
			if len(line) < 1000 {
				dlog.Warn("%s casper process is: %s", id, line)
			} else {
				dlog.Warn("%s casper process length is: %d", id, len(line))
			}
			break
		}

		if line == "randcode" {
			self.outputChan <- []byte(line)

			randcode := <-self.inputChan
			self.Write(string(randcode))
			continue
		}

		if strings.HasPrefix(line, "set_params") || strings.HasPrefix(line, "html") {
			self.outputChan <- []byte(line)
			continue
		}

		if strings.HasPrefix(line, "need") || strings.HasPrefix(line, "wrong") {
			self.outputChan <- []byte(line)

			ta := time.Minute * time.Duration(5)
			if strings.Contains(line, "need_path") {
				ta = time.Second * time.Duration(8)
			}

			need := make([]byte, 0)
			select {
			case need = <-self.inputChan:
				dlog.Warn("%s writeCasper: %s", id, string(need))
			case <-time.After(ta):
				params := strings.Split(line, ";")
				param := params[0]
				dlog.Warn("%s %s time out", id, param)
				need = []byte("finish")
				break
			}

			self.Write(string(need))
			if string(need) == "finish" {
				break
			}

			continue
		}

		if strings.HasPrefix(line, "cookie###") {
			line = strings.TrimPrefix(line, "cookie###")
			cookies := []*cookie.Cookie{}
			json.Unmarshal([]byte(line), &cookies)
			cs := cookie.ConvertCookie(cookies)
			casperCookies := "cookie###" + string(cs)
			self.outputChan <- []byte(casperCookies)
			break
		}

		if strings.HasPrefix(line, "version###") {
			self.outputChan <- []byte(line)
			continue
		}

		dlog.Warn("%s casper process break in %s", id, line)
		self.outputChan <- []byte("fail###网络超时")
		break
	}
	dlog.Warn("%s casper cmd has kill", id)
	self.Cmd.Process.Wait()
	self.Cmd.Process.Kill()
	return nil
}
