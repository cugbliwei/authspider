# coding: UTF-8
import time
import json
from urllib import quote
import sys

reload(sys)
sys.setdefaultencoding('utf8')
import kfk
import sql

select_yuqing = "select * from yuqing_company"
result_yuqing = sql.selectFromFundTable(select_yuqing)
select_object = "select * from object"
result_object = sql.selectFromFundTable(select_object)

buf = []
params = []
companys = []


def get_params(companys):
    for company in companys:
        company = company.encode('utf-8')
        baidu_url = "http://news.baidu.com/ns?word=" + quote(company)
        baidu_link = "http://authcrawler.yixin.com/submit?tmpl=baidu_news_search&link=" + baidu_url + "&key=" + quote(
            company) + "&type=" + quote("机构名") + "&priority=10"
        params.append({"company": company, "tmpl": "baidu_news_search", "link": baidu_link, "partition": 1})
        tsn = 1  # tsn: 1(1天内), 2(一周内), 3(一月内), 4(一年内), 5(指定日期)
        sougou_link = "http://authcrawler.yixin.com/submit?tmpl=sogou&query=%s&tsn=%s" % (quote(company), tsn)
        params.append({"company": company, "tmpl": "sogou", "link": sougou_link, "partition": 2})
        weibo_link = "http://authcrawler.yixin.com/submit?tmpl=weibo&query=%s" % (quote(company))
        params.append({"company": company, "tmpl": "weibo", "link": weibo_link, "partition": 2})
        jutousu_link = "http://authcrawler.yixin.com/submit?tmpl=jutousu&query=%s&total=true" % (quote(company))
        params.append({"company": company, "tmpl": "jutousu", "link": jutousu_link, "partition": 2})
    return params


def send(params):
    for param in params:
        data = {
            'timestamp': str(int(time.time())),
            'tmpl': param["tmpl"],
            'link': param["link"],
            'target': param["company"],
            'times': '0',
            'ban': 'false',
            'priority': 'true'
        }
        ret = {'topic': param["tmpl"], 'value': json.dumps(data), 'partition': param["partition"]}
        buf.append(ret)


for res in result_yuqing:
    company = res[1]
    shortname = res[2]
    companys.append(company)
    companys.append(shortname)
for res in result_object:
    types = res[1]
    key = res[4]
    if "person" in types:
        companys.append(key)
    else:
        keys = key.split("%%")
        if len(keys) < 2:
            continue
        companys.append(keys[0])
        companys.append(keys[1])

send(get_params(companys))

print "yuqing_spiders from yuqing table and fund table produce total " + str(len(buf)) + " data to kafka"
kfk.produce(buf)
