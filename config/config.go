package config

import (
	"encoding/json"
	"io/ioutil"

	"github.com/cugbliwei/authspider/browserhub"
	"github.com/cugbliwei/dlog"
)

type Local struct {
	RedisHost   string //本地redis服务地址
	ServiceHost string //本地服务地址
	ProxyHost   string //本地获取代理ip的地址
	FileSqlPath string //本地文件服务地址
	FileSqlUrl  string
}

type Redis struct {
	Single              string   //线上redis单机地址
	Cluster             []string //线上redis集群地址
	WriteTimeout        int      //写超时
	SingleStoreTimeout  int      //单台存储超时设置
	ClusterStoreTimeout int      //集群存储超时设置
	HcStoreTimeout      int      //蜂巢数据存储超时设置
}

type Mysql struct {
	Username string
	Password string
	Host     string
	Database string
}

type Captcha struct {
	Key      string
	AppId    string
	Username string
	Password string
}

type Tesseract struct {
	Host string
}

type Honeycomb struct {
	StdPublicKey  string //蜂巢的商通贷key
	JhjjPublicKey string //蜂巢的江湖救急key
}

type JudgeExtract struct {
	JudgeKey   string
	Require    []string
	IgnoreTmpl map[string]bool
	IgnoreText []string
}

type Flume struct {
	Host string
	Port int
}

type KafkaTask struct {
	Topic     string //kafka主题
	Partition int    //kafka存储的区
	Interval  int    //两个任务之前的时间间隔
	Async     bool
	Times     int //失败的尝试次数
}

type RedisTask struct {
	Key      string //redis keys
	Interval int    //两个任务之前的时间间隔
	Times    int    //失败的尝试次数
	Circle   bool   //是否使用循环链表
	Async    bool   //是否并行
}

type HbaseInfo struct {
	Table  string
	Family string
	Column string
}

type Hbase struct {
	Base  HbaseInfo
	Cache HbaseInfo
}

type Config struct {
	OnLine          bool                         //设置线上线下，用到redis集群，为false本地才能运行起来
	Local           Local                        //本地的一些url地址
	ServiceHost     string                       //服务器地址
	ServiceNextUrl  string                       //服务器继续调用地址
	ProxyHost       string                       //获取代理ip的地址
	FileSqlPath     string                       //文件服务地址
	FileSqlUrl      string                       //写数据的服务地址
	FileUploadUrl   string                       //上传文件的服务地址
	OutputRoot      string                       //已失效，不用了
	Kafka           string                       //kafka服务器地址
	LocalProxyAddr  string                       //本地代理服务
	HbaseAddr       string                       //hbase服务地址
	JhjjAddr        string                       //江湖救急回调服务地址
	RedisBaseKey    string                       //redis key prefix
	KafkaTask       []KafkaTask                  //kafka任务
	RedisTask       []RedisTask                  //Redis任务
	Redis           Redis                        //redis服务器地址
	Mysql           Mysql                        //mysql服务器地址
	Hbase           Hbase                        //hbase表信息
	Captcha         Captcha                      //打码平台账号
	Tesseract       Tesseract                    //Tesseract ocr服务器地址
	Templates       map[string]string            //模板设置，map[tmpl]filename
	LiveTime        map[string]int               //任务的存活时间
	UseProxy        map[string]bool              //哪些模板使用代理ip
	UseDailyProxy   map[string]bool              //哪些模版按天轮询goproxy代理服务
	UseUploadFile   map[string]bool              //是否需要上传文件
	DisableDatabase map[string]bool              //哪些模板禁止使用数据库
	DisableRecord   map[string]bool              //哪些模板禁止记录
	Honeycomb       Honeycomb                    //蜂巢服务
	Flume           []Flume                      //flume服务器地址
	Error           map[string]map[string]string //错误码
	JudgeExtract    JudgeExtract                 //判断哪些字段改版
	Buckets         map[string]string            //已失效，不用了
	UploadApi       string                       //已失效，不用了
	SlackApi        string                       //已失效，不用了
	BrowserHub      browserhub.BrowserHubConfig  //selenium服务器地址
	QrDecodeHost    string                       //二维码解析服务地址
}

const (
	configFilename = "./etc/config.json"
	errorFilename  = "./etc/error.json"
	judgeFilename  = "./etc/judge.json"
)

var Instance *Config

func init() {
	b, err := ioutil.ReadFile(configFilename)
	if err != nil {
		dlog.Error("load file: %s, error: %v", configFilename, err)
		b = []byte(originConfig)
	}

	if err = json.Unmarshal(b, &Instance); err != nil {
		dlog.Error("json unmarshal file: %s, error: %v", configFilename, err)
	}

	if !Instance.OnLine {
		Instance.ServiceHost = Instance.Local.ServiceHost
		Instance.ProxyHost = Instance.Local.ProxyHost
		Instance.FileSqlPath = Instance.Local.FileSqlPath
	}

	b, err = ioutil.ReadFile(errorFilename)
	if err != nil {
		dlog.Error("load file: %s, error: %v", errorFilename, err)
		b = []byte(originError)
	}

	if err = json.Unmarshal(b, &Instance.Error); err != nil {
		dlog.Error("json unmarshal file: %s, error: %v", errorFilename, err)
	}

	b, err = ioutil.ReadFile(judgeFilename)
	if err != nil {
		dlog.Error("load file: %s, error: %v", judgeFilename, err)
		b = []byte(originJudge)
	}

	if err = json.Unmarshal(b, &Instance.JudgeExtract); err != nil {
		dlog.Error("json unmarshal file: %s, error: %v", judgeFilename, err)
	}
}

const originConfig = `
{
    "OnLine": false,
    "Local": {
        "RedisHost": "127.0.0.1:6379",
        "ServiceHost": "http://127.0.0.1:8001",
        "ProxyHost": "http://authcrawler.yixin.com/proxy",
        "FileSqlPath": "./"
    },
    "ServiceHost": "http://authcrawler.yixin.com",
    "ProxyHost": "http://10.131.0.108:8030",
    "FileSqlPath": "/mfs/crawler-sql/sql/",
    "FileSqlUrl": "http://std-termite-cms.bdp.cc/authcrawler/write/data",
    "Kafka": "10.130.64.46:9092,10.130.64.47:9092,10.130.64.48:9092",
    "Templates": {
        "taobao_shop": "ali.json",
        "tmall_shop": "ali.json",
        "aliexpress": "aliexpress_false.json",
        "shop_rate_aliexpress":"shop_rate_aliexpress.json",
        "sdk_taobao_shop": "sdk_ali.json",
        "cookie_taobao_shop": "sdk_ali.json",
        "sdk_tmall_shop": "sdk_ali.json",
        "cookie_tmall_shop": "sdk_ali.json",
        "qr_taobao_shop": "qrcode_ali.json",
        "qr_tmall_shop": "qrcode_ali.json",
        "jd_shop": "jd.json",
        "qr_jd_shop": "qrcode_jd.json",
        "sdk_jd_shop": "sdk_jd.json",
        "cookie_jd_shop": "sdk_jd.json",
        "jd_buyer": "jd_buyer.json",
        "shop_rate": "shop_rate_ali.json",
        "shop_rate_jd": "shop_rate_jd.json",
        "suning_shop": "suning.json",
        "qr_suning_shop": "qrcode_suning.json",
        "suning_product": "suning_product.json",
        "zhixing": "zhixing.json",
        "shixin": "shixin.json",
        "amac": "amac.json",
        "tianyancha": "tianyancha.json",
        "tianyancha_long": "tianyancha_long.json",
        "tianyancha_longtime": "tianyancha_longtime.json",
        "tianyancha_account": "tianyancha_account.json",
        "tianyancha_human": "tianyancha_human.json",
        "wish": "wish.json",
        "hc_phone": "hc_phone.json",
        "hc_phone_old": "hc_phone_old.json",
        "hc_ccrc": "hc_ccrc.json",
        "hc_taobao": "hc_taobao.json",
        "hc_mail": "hc_mail.json",
        "euu": "euu.json",
        "euu_agent": "euu_agent.json",
        "alipay": "alipay.json",
        "taobao_false": "ali_false.json",
        "tmall_false": "ali_false.json",
        "yirendai": "yirendai.json",
        "url_taobao_shop": "url_ali.json",
        "url_tmall_shop": "url_ali.json",
        "test": "test.json",
        "sdk_taobao_shop2": "sdk_ali2.json",
        "cookie_taobao_shop2": "sdk_ali2.json",
        "sdk_tmall_shop2": "sdk_ali2.json",
        "cookie_tmall_shop2": "sdk_ali2.json",
        "sdk_jd_shop2": "sdk_jd2.json",
        "cookie_jd_shop2": "sdk_jd2.json",
        "taobao_ua": "taobao_ua.json"
    },
    "Redis": {
        "Single": "10.131.0.107:6379",
        "Cluster": [
            "10.131.0.106:6379",
            "10.131.0.108:6379",
            "10.131.0.109:6379"
        ],
        "WriteTimeout": 20,
        "SingleStoreTimeout": 30,
        "ClusterStoreTimeout": 72,
        "HcStoreTimeout": 5
    },
    "Mysql": {
        "Username": "platform",
        "Password": "platformMojiti",
        "Host": "10.130.0.144:3329",
        "Database": "platform"
    },
    "Flume": [
        {
            "Host": "c1-hd-dn1",
            "Port": 4411
        },
        {
            "Host": "c1-hd-dn2",
            "Port": 4411
        },
        {
            "Host": "c1-hd-dn3",
            "Port": 4411
        },
        {
            "Host": "c1-hd-dn4",
            "Port": 4411
        },
        {
            "Host": "c1-hd-dn5",
            "Port": 4411
        }
    ],
    "UseProxy": {
        "zhixing": true,
        "shixin": true,
        "yirendai": true
	},
	"UseDailyProxy": {
		"sogou": true,
		"weixin": true
    },
    "DisableDatabase": {
        "zhixing": true,
        "shixin": true,
        "amac": true,
        "tianyancha": true,
        "tianyancha_long": true,
        "tianyancha_longtime": true,
        "tianyancha_account": true,
        "tianyancha_human": true,
        "yirendai": true,
        "hc_taobao": true,
        "hc_phone": true,
        "hc_mail": true,
        "hc_ccrc": true,
        "shop_rate": true,
        "shop_rate_jd": true,
        "euu_agent": true,
        "taobao_ua": true,
        "suning_product": true,
        "test": true
    },
    "DisableRecord": {
        "amac": true,
        "tianyancha": true,
        "tianyancha_long": true,
        "tianyancha_longtime": true,
        "tianyancha_account": true,
        "tianyancha_human": true,
        "taobao_ua": true,
        "test": true
    },
    "Honeycomb": {
        "StdPublicKey": "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCaWm99KW2/bOScian/Xw/+jMkfpK7kWJ4aVNTxPDoDIcO9u/QirOwI+QsnHy90bnB+NgosFiKFgUPfm4+XQCHOS8pcJBWvf2aVFCAt5uGHAixRSKDIEmORfj9NV8z7PiNiKxP1OVr388JAttZTWszf1DPwSf4VAY4x4ZZ43EywcQIDAQAB",
        "JhjjPublicKey": "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDtYusmd/cXNZKD5L0sotGeq+9TeyDjP8s2KTUnz+Dppz0cx4Cr7S6wD8iGoFyd+ot08eXqKhFW/ARLkceatf9qYHygkRQ6L4YL0YZkMGXWOBluSQ1tFMvOM7S7KwPGVEIgwL4aZLEKvnYb+KumZmuJgHVwnXnxYODNki5Sp9L2fwIDAQAB"
    },
    "Captcha": {
        "Key": "198d109989fa1167a704ac4fd41c7e2d",
        "AppId": "41624",
        "Username": "cugbliwe",
        "Password": "199264uio"
    },
    "Tesseract": {
        "Host": "http://authcrawler.yixin.com/captcha/file"
    },
	"BrowserHub": {
        "Service": "http://10.131.0.59:8888/wd/hub",
        "Capabilities":{
            "browserName": "chrome", "ignoreProtectedModeSettings": true
        },
        "PageLoadTimeout":30000000000,
        "ImplicitWaitTimeout":5000000000,
        "AsyncScriptTimeout":30000000000
    },
    "QrDecodeHost": "http://c1-crw7:8080/decode_url",
    "KafkaTask": [
        {
            "Topic": "tianyancha",
            "Partition": 0
        },
        {
            "Topic": "tianyancha_human",
            "Partition": 1
        }
    ]
}
`

const originError = `
{
	"common": {
        "password2": "用户未输入短信验证码",
        "randcode": "用户未输入图片验证码",
        "username": "用户未输入用户名",
        "password": "用户未输入密码"
	},
	"hc_phone": {
	    "hc_phone_1000": "网络错误",
	    "hc_phone_1001": "用户名或密码错误",
	    "hc_phone_1004": "op参数错误",
	    "hc_phone_1005": "用户不存在",
	    "hc_phone_1006": "参数错误",
	    "hc_phone_1007": "不支持的省份",
	    "hc_phone_1008": "用户发送短信验证码受限（原短信验证码在一段时间内有效）",
	    "hc_phone_4000": "其他错误",
	    "hc_phone_4001": "用户当天输入错误密码次数达到上限，账号锁定24小时",
	    "hc_phone_4002": "用户短信密码发送当天已达到上限，请24小时后再试",
	    "hc_phone_4003": "用户正在抓取中",
	    "hc_phone_4004": "登录前需要进行验证手机密令",
	    "hc_phone_4005": "用户未实名制(目前主要是福建电信详单中显示未实名制异常信息)",
	    "hc_phone_4006": "联通运营商-系统忙，请稍后再试",
	    "hc_phone_4007": "联通运营商-您的号码所属省份系统正在升级，请稍后再试",
	    "hc_phone_4008": "福建移动用户定制免打详单功能",
	    "hc_phone_4009": "联通运营商-由于本月您将升级成4G，请您在账期后（4日8:00）再使用系统",
	    "hc_phone_4010": "身份信息错误"
	},
	"hc_ccrc": {
	    "hc_ccrc_2": "业务逻辑错误",
	    "hc_ccrc_3": "系统异常",
	    "hc_ccrc_104": "登录失败，人民银行征信系统繁忙",
	    "hc_ccrc_105": "抓取流程超时",
	    "hc_ccrc_106": "第4次密码连续输入错误。密码输入错误次数超过5次，系统将对登录名进行锁定10分钟。",
	    "hc_ccrc_107": "登录名已因密码连续输入错误次数超过5次被锁定，锁定时间10分钟",
	    "hc_ccrc_108": "已注册过其他用户，请使用做过身份认证的用户重新登录。",
	    "hc_ccrc_109": "该账户已经销户，请重新提交注册申请",
	    "hc_ccrc_110": "已登录成功，无法重复登录",
	    "hc_ccrc_111": "您的账号已在其他地方登录。请注意账号安全。如果不是您的操作，您的密码很可能泄露，请及时修改！",
	    "hc_ccrc_112": "您的账号离线，请登录",
	    "hc_ccrc_113": "一分钟获取验证码不得超过5次",
	    "hc_ccrc_203": "抓取信用报告失败，未知原因",
	    "hc_ccrc_204": "人民银行征信系统没有生成信用信息",
	    "hc_ccrc_205": "3分钟之内不允许重复抓取",
	    "hc_ccrc_206": "7天之内不允许重复抓取",
	    "hc_ccrc_311": "未找到个人信用报告-基本信息",
	    "hc_ccrc_313": "未知的贷款类型",
	    "hc_ccrc_314": "未知的信贷概要类型",
	    "hc_ccrc_402": "信用报告注册数据库失败",
	    "hc_ccrc_901": "登录时发生系统运行时错误",
	    "hc_ccrc_902": "抓取信用报告时发生系统运行时错误",
	    "hc_ccrc_903": "解析信用报告时发生系统运行时错误",
	    "hc_ccrc_999": "系统运行时错误"
	},
	"hc_mail": {
	    "hc_mail_0": "没有执行",
	    "hc_mail_1": "失败",
	    "hc_mail_2": "解析出的参数不够",
	    "hc_mail_14": "请解绑QQ安全中心后再尝试登录",
	    "hc_mail_15": "账号被锁定，请去qq安全中心解锁",
	    "hc_mail_16": "POP3认证失败",
	    "hc_mail_17": "QQ邮箱未开通",
	    "hc_mail_100": "登录失败",
	    "hc_mail_101": "不支持的邮箱地址",
	    "hc_mail_302": "收取邮件失败",
	    "hc_mail_1001": "参数解密错误",
	    "hc_mail_1003": "参数错误",
	    "hc_mail_1004": "操作出现异常",
	    "hc_mail_1005": "业务系统未被授权",
	    "hc_mail_1011": "验证码已提交失败"
	},
	"hc_taobao": {
	    "hc_taobao_1000": "网络错误",
	    "hc_taobao_1001": "密码错误",
	    "hc_taobao_1004": "op参数错误",
	    "hc_taobao_1005": "用户不存在",
	    "hc_taobao_1006": "参数错误",
	    "hc_taobao_2000": "账户安全问题",
	    "hc_taobao_4000": "其他错误",
	    "hc_taobao_4001": "登陆需要绑定手机",
	    "hc_taobao_4002": "新注册账号无法登陆",
	    "hc_taobao_4004": "很抱歉，您的账户可能被盗，已被监管，请电话申诉开通",
	    "hc_taobao_4005": "非常抱歉！您的账户存在严重违规情况已作“冻结”账户处理",
	    "hc_taobao_4006": "改账户已被冻结，暂时无法登陆",
	    "hc_taobao_4007": "账户已申请挂失，暂时无法登陆",
	    "hc_taobao_4008": "该账户存在安全风险，重置登陆密码和支付密码",
	    "hc_taobao_4009": "没有绑定支付宝账号",
	    "hc_taobao_4010": "密码错误次数超过限制",
	    "hc_taobao_4012": "登录超时",
	    "hc_taobao_4023": "淘宝账号被锁定需登录激活",
	    "hc_taobao_4030": "登录太频繁，请稍后再试",
	    "hc_taobao_5000": "淘宝抓取失败，返回提示使用芝麻分",
	    "hc_taobao_5010": "短信发送频繁",
	    "hc_taobao_5011": "短信提交超时",
	    "hc_taobao_6012": "支付宝二维码已失效"
	}
}
`

const originJudge = `
{
	"JudgeKey": "judge_extract_result",
	"Require": [
		"ILLEGAL_ARGUMENT",
		"页面错误"
	],
	"IgnoreTmpl": {
		"yirendai": true
	},
	"IgnoreText": [
		"O_RATE_SHOPSERVICE_AJAX -> data -> complaints",
		"O_SELL_RPT_TARGETDATA_AJAX -> data ->",
		"O_MY_CREDIT_QUERYACCESS_AJAX -> data ->",
		"_HTML -> params",
		"_AJAX -> params"
	]
}
`
