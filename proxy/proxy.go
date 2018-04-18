package proxy

import (
	"fmt"
	"io/ioutil"
	"math/rand"
	"net"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/dlog"
)

var client *http.Client

func init() {
	client = HttpClient(10)
}

func HttpClient(timeout int) *http.Client {
	to := time.Duration(timeout) * time.Second
	return &http.Client{
		Transport: &http.Transport{
			Dial: func(network, addr string) (net.Conn, error) {
				deadline := time.Now().Add(to)
				c, err := net.DialTimeout(network, addr, to)
				if err != nil {
					return nil, err
				}
				c.SetDeadline(deadline)
				return c, nil
			},
			DisableKeepAlives:     true,
			ResponseHeaderTimeout: to,
		},
		Timeout: to,
	}
}

func GetLink(link string) string {
	if strings.Contains(link, "?") {
		urls := strings.SplitN(link, "?", 2)
		if query, err := url.ParseQuery(urls[1]); err == nil {
			params := query.Encode()
			link = urls[0] + "?" + params
		}
	}

	resp, err := client.Get(link)
	if err != nil {
		dlog.Warn("get link error: %v", err)
		return ""
	}

	if resp.StatusCode != http.StatusOK {
		dlog.Warn("visit link Bad Gateway: %s", link)
		return ""
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		dlog.Warn("read proxy body error: %v", err)
		return ""
	}
	defer resp.Body.Close()

	b := strings.TrimSpace(string(body))
	return b
}

type Proxy struct {
	IP       string
	Type     string
	Username string
	Password string
}

func NewProxy(buf string) *Proxy {
	typeOthers := strings.SplitN(buf, "://", 2)
	if len(typeOthers) != 2 {
		return nil
	}
	authOthers := strings.SplitN(typeOthers[1], "@", 2)
	if len(authOthers) == 1 {
		return &Proxy{
			IP:       authOthers[0],
			Type:     typeOthers[0],
			Username: "",
			Password: "",
		}
	} else if len(authOthers) == 2 {
		userPwd := strings.SplitN(authOthers[0], ":", 2)
		return &Proxy{
			IP:       authOthers[1],
			Type:     typeOthers[0],
			Username: userPwd[0],
			Password: userPwd[1],
		}
	}
	return nil
}

func (p *Proxy) String() string {
	ret := p.Type + "://"
	if len(p.Username) > 0 {
		ret += p.Username + ":" + p.Password + "@"
	}
	ret += p.IP
	return ret
}

const (
	DEFAULT_TMPL = "default"
)

type ProxyManager struct {
	localIPs []*Proxy
	lock     *sync.RWMutex
}

func NewProxyManager() *ProxyManager {
	ret := ProxyManager{
		localIPs: getLocalIP(),
		lock:     &sync.RWMutex{},
	}
	return &ret
}

func getLocalIP() []*Proxy {
	ret := []*Proxy{}
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		dlog.Error("GetLocalIP error: %s", err.Error())
		return ret
	}
	for _, ad := range addrs {
		if ipnet, ok := ad.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				proxy := &Proxy{strings.TrimSpace(ipnet.IP.String()), "local", "", ""}
				ret = append(ret, proxy)
			}
		}
	}
	dlog.Warn("all local ip: %v", ret)
	return ret
}

func (p *ProxyManager) GetLocalIP() *Proxy {
	p.lock.RLock()
	p.lock.RUnlock()

	if len(p.localIPs) == 0 {
		return nil
	}
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	return p.localIPs[r.Intn(len(p.localIPs))]
}

func (p *ProxyManager) GetTmplProxy(tmpl string) *Proxy {
	if v, ok := config.Instance.UseProxy[tmpl]; !ok || !v {
		local := p.GetLocalIP()
		dlog.Warn("use local proxy: %v", local)
		return local
	}

	proxy := GetLink(config.Instance.ProxyHost + "/get?tmpl=" + tmpl)
	if len(proxy) < 10 || !strings.Contains(proxy, "http://") {
		local := p.GetLocalIP()
		dlog.Warn("tmpl: %s get external proxy fail, and success to get local ip: %s", tmpl, local.IP)
		return local
	}
	dlog.Warn("tmpl: %s success get proxy: %s", tmpl, proxy)
	return NewProxy(proxy)
}

func (p *ProxyManager) GetLocalServiceProxy(tmpl string) *Proxy {
	now := time.Now()
	tagDate, _ := time.Parse("2006-01-02 03:04:05", "2017-09-01 00:00:00")
	subd := now.Sub(tagDate)
	idx := int(subd.Hours()/24) % 6
	proxy := fmt.Sprintf(config.Instance.LocalProxyAddr, idx)
	dlog.Warn("tmpl: %s success get local service proxy: %s", tmpl, proxy)
	return NewProxy(proxy)
}
