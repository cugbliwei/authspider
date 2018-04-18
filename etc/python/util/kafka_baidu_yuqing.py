# coding: UTF-8
import time
import json
from urllib import quote
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import kfk
import sql


select = "select * from yuqing_company"
result = sql.selectFromFundTable(select)
buf = []

def send(company):
	company = company.encode('utf-8')
	baiduURl = "http://news.baidu.com/ns?word=" + quote(company)
	link = "http://authcrawler.yixin.com/submit?tmpl=baidu_news_search&link=" + baiduURl + "&key=" + quote(company) + "&type=" + quote("机构名") + "&priority=10"
	data = {'timestamp': str(int(time.time())), 'tmpl': 'baidu_news_search', 'link': link, 'target': company, 'times': '0', 'ban': 'false', 'priority': 'true'}
	ret = {'topic': 'baidu_news_search', 'value': json.dumps(data), 'partition': 1}
	buf.append(ret)

for res in result:
    company = res[1]
    shortname = res[2]
    send(company)
    send(shortname)

print "baidu_news_search from yuqing table produce total " + str(len(buf)) + " data to kafka"
kfk.produce(buf)
