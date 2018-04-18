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
	link = "http://authcrawler.yixin.com/submit?tmpl=tianyancha&key=" + quote(company)
	data = {'timestamp': str(int(time.time())), 'tmpl': 'tianyancha', 'link': link, 'target': company, 'times': '0', 'ban': 'false', 'priority': 'true'}
	ret = {'topic': 'tianyancha', 'value': json.dumps(data), 'partition': 0}
	buf.append(ret)

for res in result:
    company = res[1]
    shortname = res[2]
    send(company)
    send(shortname)

print "tianyancha from yuqing table produce total " + str(len(buf)) + " data to kafka"
kfk.produce(buf)
