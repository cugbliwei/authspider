# coding: UTF-8
import time
import json
from urllib import quote
import sys

reload(sys)
sys.setdefaultencoding('utf8')
import kfk
import sql


def get_params(companys):
    params = []
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

if __name__ == "__main__":
    while True:
        buf = []
        select = "select * from all_funds where flag=0 limit 1000"
        result = sql.selectFromFundTable(select)
        if len(result) == 0:
            execute = "update all_funds set flag=0"
            sql.executeFromFundTable(execute)
            continue
        for res in result:
            fund = res[1]
            send(get_params(fund))
        print "yuqing_spiders from all_funds table produce " + str(len(buf)) + " data to kafka"
        kfk.produce(buf)
        execute = "update all_funds set flag=1 where flag=0 limit 1000"
        sql.executeFromFundTable(execute)

