package cookie

import (
	"encoding/json"
	"io/ioutil"
	"strings"

	"github.com/cugbliwei/dlog"
)

type Cookie struct {
	Domain   string `json:"domain"`
	Expiry   int64  `json:"expiry"`
	Httponly bool   `json:"httponly"`
	Name     string `json:"name"`
	Path     string `json:"path"`
	Secure   bool   `json:"secure"`
	Value    string `json:"value"`
}

func (c *Cookie) getDomain() string {
	return strings.Trim(c.Domain, ".")
}

func (c *Cookie) key() string {
	return c.getDomain() + ";/;" + c.Name
}

func (c *Cookie) HiggsCookie() map[string]interface{} {
	return map[string]interface{}{
		"Domain":   c.getDomain(),
		"Name":     c.Name,
		"Value":    c.Value,
		"Path":     c.Path,
		"Secure":   c.Secure,
		"HttpOnly": c.Httponly,
	}
}

func ConvertCookie(cookies []*Cookie) []byte {
	ret := make(map[string]map[string]interface{}, 20)
	for _, c := range cookies {
		_, ok := ret[c.getDomain()]
		if !ok {
			ret[c.getDomain()] = make(map[string]interface{}, 1)
		}
		_, ok2 := ret[c.getDomain()][c.key()]
		if !ok2 {
			ret[c.getDomain()][c.key()] = c.HiggsCookie()
		}
	}
	b, _ := json.Marshal(ret)
	return b
}

type CookieTemplate struct {
	Site       string
	Path       string
	Domain     string
	Secure     bool
	HttpOnly   bool
	Persistent bool
	HostOnly   bool
	Tmpl       string
}

type CookieEntry struct {
	Entry    Cookie
	Template map[string]map[string]*CookieTemplate
}

var Instance CookieEntry

func init() {
	b, err := ioutil.ReadFile("./etc/cookie_tmpl.json")
	if err != nil {
		dlog.Error("fail to load cookie file: %v", err)
		b = []byte(cookieConfig)
	}

	if err = json.Unmarshal(b, &Instance.Template); err != nil {
		dlog.Error("fail to parse cookie file: %v", err)
	}
}

func (self CookieEntry) GetCookieTemplate(tmpl string) map[string]*CookieTemplate {
	cookieTemplate := self.Template[tmpl]
	if resource, ok := cookieTemplate["_RESOURCE"]; ok {
		cookieTemplate = self.Template[resource.Tmpl]
	}
	return cookieTemplate
}

func (self CookieEntry) HandleCookie(cookieJson, tmpl string) []byte {
	cookies := make([]Cookie, 60)
	err := json.Unmarshal([]byte(cookieJson), &cookies)
	if err != nil {
		dlog.Error("cookie Unmarshal err: %v", err)
		return []byte{}
	}
	cookieTmplates := self.GetCookieTemplate(tmpl)
	if cookieTmplates == nil {
		dlog.Warn("get cookie template err: %v", err)
		return []byte{}
	}
	ret := make(map[string]map[string]Cookie, 60)
	for _, v := range cookies {
		cookieTmplate := cookieTmplates[v.Name]
		if cookieTmplate == nil {
			//dlog.Warn("tmpl:%s cookie:%s Not Found", tmpl, v.Name)
			cookieTmplate = cookieTmplates["_DEFAULT"]
		}
		if len(v.Path) > 0 && len(v.Domain) > 0 {
			self.addToSite(ret, v.getDomain(), v)
			continue
		}
		if len(v.Path) == 0 {
			v.Path = cookieTmplate.Path
		}
		if len(v.Domain) == 0 {
			v.Domain = cookieTmplate.Domain
		}
		if !v.Secure {
			v.Secure = cookieTmplate.Secure
		}
		if !v.Httponly {
			v.Httponly = cookieTmplate.HttpOnly
		}
		self.addToSite(ret, v.getDomain(), v)
	}
	result, _ := json.Marshal(ret)
	return result
}

func (self CookieEntry) addToSite(ret map[string]map[string]Cookie, site string, entry Cookie) {
	siteMap := ret[site]
	if siteMap == nil {
		siteMap = make(map[string]Cookie, 1)
	}
	siteMap[site+";"+entry.Path+";"+entry.Name] = entry
	ret[site] = siteMap
}

const cookieConfig = `
{
	"sdk_jd_shop":{
		"cart-main":{
			"Site":"jd.com",
			"Domain": "cart.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
		},
        "cm_cache":{
            "Site":"jd.com",
            "Domain": "cm.e.qq.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "HostOnly": false
        },
		"cn":{
			"Site":"jd.com",
			"Domain": "jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
		},
		"ol":{
			"Site":"jd.com",
			"Domain": "passport.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "HostOnly": false
		},
		"ipLoc-djd":{
			"Site":"jd.com",
			"Domain": "jd.hk",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
        },
        "__jdc":{
        	"Site":"jd.com",
			"Domain": "jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
        },
        "__jd*":{
            "Site":"jd.com",
            "Domain": "jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
        },
        "pin":{
        	"Site":"jd.com",
			"Domain": "jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
        },
        "_pst":{
        	"Site":"jd.com",
			"Domain": "jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "HostOnly": false
        },
        "sec":{
        	"Site":"jd.com",
			"Domain": "passport.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "HostOnly": false
        },
        "alpin":{
        	"Site":"jd.com",
			"Domain": "passport.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
        },
        "mp":{
        	"Site":"jd.com",
			"Domain": "passport.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "HostOnly": false
        },
        "TrackID":{
        	"Site":"jd.com",
			"Domain": "jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
        },
        "thor":{
        	"Site":"jd.com",
			"Domain": "jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "HostOnly": false
        },
        "aview":{
        	"Site":"jd.com",
			"Domain": "diviner.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "atw":{
            "Site":"jd.com",
            "Domain": "diviner.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "jr_ceshi":{
            "Site":"jd.com",
            "Domain": "jdpay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "HostOnly": false
         },
         "jcm_pv":{
            "Site":"jd.com",
            "Domain": "jcm.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "__jdu":{
            "Site":"jd.com",
            "Domain": "jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "_nt*":{
            "Site":"jd.com",
            "Domain": "passport.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "user-key":{
            "Site":"jd.com",
            "Domain": "jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "_tp":{
            "Site":"jd.com",
            "Domain": "jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "pinId":{
            "Site":"jd.com",
            "Domain": "jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "alc":{
            "Site":"jd.com",
            "Domain": "passport.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "HostOnly": false
         },
         "_lvtc_":{
            "Site":"jd.com",
            "Domain": "shop.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "_vender_":{
            "Site":"jd.com",
            "Domain": "shop.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "HostOnly": false
         },
         "ipLocation":{
            "Site":"jd.com",
            "Domain": "jd.hk",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "unick":{
            "Site":"jd.com",
            "Domain": "jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "HostOnly": false
         },
         "abtest":{
            "Site":"jd.com",
            "Domain": "m.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "__utmmobile":{
            "Site":"jd.com",
            "Domain": "m.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "USER_FLAG_CHECK":{
            "Site":"jd.com",
            "Domain": "m.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "JAMCookie":{
            "Site":"jd.com",
            "Domain": "m.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "JSESSIONID":{
            "Site":"jd.com",
            "Domain": "m.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "__mjdv":{
            "Site":"jd.com",
            "Domain": "m.jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
         },
         "_DEFAULT": {
            "Site":"jd.com",
			"Domain": "jd.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "HostOnly": false
        }
	},
    "cookie_taobao_shop": {
        "_RESOURCE": {
            "Tmpl": "sdk_taobao_shop"
        }
    },
    "cookie_tmall_shop": {
        "_RESOURCE": {
            "Tmpl": "sdk_taobao_shop"
        }
    },
    "sdk_tmall_shop": {
        "_RESOURCE": {
            "Tmpl": "sdk_taobao_shop"
        }
    },
    "sdk_taobao_shop": {
        "lc": {
            "Site": "taobao.com",
            "Path": "/",
            "Domain": "login.taobao.com",
            "Secure": false,
            "HttpOnly": true,
            "Persistent": true,
            "HostOnly": false
        },
        "lid": {
            "Site": "taobao.com",
            "Domain": "login.taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": true,
            "HostOnly": false
        },
        "_cc_": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": true,
            "HostOnly": false
        },
        "_l_g_": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "_nk_": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "_tb_token_": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "cookie1": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "Persistent": false,
            "HostOnly": false
        },
        "cookie17": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "Persistent": false,
            "HostOnly": false
        },
        "cookie2": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "Persistent": false,
            "HostOnly": false
        },
        "existShop": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "lgc": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": true,
            "HostOnly": false
        },
        "mt": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": true,
            "HostOnly": false
        },
        "sg": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "skt": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": true,
            "HttpOnly": true,
            "Persistent": false,
            "HostOnly": false
        },
        "t": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": true,
            "HostOnly": false
        },
        "tg": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": true,
            "HostOnly": false
        },
        "tracknick": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": true,
            "HostOnly": false
        },
        "uc1": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "uc3": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "Persistent": true,
            "HostOnly": false
        },
        "unb": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": true,
            "Persistent": false,
            "HostOnly": false
        },
        "v": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "munb": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "supportWebp": {
            "Site": "taobao.com",
            "Domain": "m.taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "isg": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "_m_user_unitinfo_": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "ockeqeudmj": {
            "Site": "m.taobao.com",
            "Domain": "m.taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "_m_h5_tk": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "thw": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "_m_h5_tk_enc": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "_w_al_f": {
            "Site": "taobao.com",
            "Domain": "m.taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "l": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "_w_tb_nick": {
            "Site": "m.taobao.com",
            "Domain": "m.taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "imewweoriw": {
            "Site": "taobao.com",
            "Domain": "m.taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "ntm": {
            "Site": "m.taobao.com",
            "Domain": "m.taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "cna": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "wud": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "new_wud": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "JSESSIONID": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "_w_app_lg": {
            "Site": "m.taobao.com",
            "Domain": "m.taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "yryetgfhth": {
            "Site": "login.m.taobao.com",
            "Domain": "login.m.taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "WAPFDFDTGFG": {
            "Site": "m.taobao.com",
            "Domain": "m.taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        },
        "_DEFAULT": {
            "Site": "taobao.com",
            "Domain": "taobao.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false
        }
    },
    "alipay": {
        "ALIPAYJSESSIONID": {
            "Site": "alipay.com",
            "Path": "/",
            "Domain": "alipay.com",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "CLUB_ALIPAY_COM": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "JSESSIONID": {
            "Site": "auth.alipay.com",
            "Domain": "auth.alipay.com",
            "Path": "/login",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "LoginForm": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "_umdata": {
            "Site": "auth.alipay.com",
            "Domain": "auth.alipay.com",
            "Path": "/login",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "ali_apache_tracktmp": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "alipay": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "apay_aid": {
            "Site": "kcart.alipay.com",
            "Domain": "kcart.alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "apay_id": {
            "Site": "kcart.alipay.com",
            "Domain": "kcart.alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "apay_sid": {
            "Site": "kcart.alipay.com",
            "Domain": "kcart.alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "cna": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "credibleMobileSendTime": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "ctoken": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "ctuMobileSendTime": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "havana_tgc": {
            "Site": "passport.alipay.com",
            "Domain": "passport.alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "hl_sk": {
            "Site": "passport.alipay.com",
            "Domain": "passport.alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "iw.userid": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "mobileSendTime": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "riskCredibleMobileSendTime": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "riskMobileAccoutSendTime": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "riskMobileBankSendTime": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "riskMobileCreditSendTime": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "riskOriginalAccountMobileSendTime": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "session.cookieNameId": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "spanner": {
            "Site": "auth.alipay.com",
            "Domain": "auth.alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "umdata_": {
            "Site": "ynuf.alipay.com",
            "Domain": "ynuf.alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "unicard1.vm": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        },
        "zone": {
            "Site": "alipay.com",
            "Domain": "alipay.com",
            "Path": "/",
            "Secure": false,
            "HttpOnly": false,
            "Persistent": false,
            "HostOnly": false
        }
    }
}
`
