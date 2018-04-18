# coding: UTF-8
import time
import json
from urllib import quote
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import kfk
import sql


select = "select * from object"
result = sql.selectFromFundTable(select)
buf = []

def send(key, tp):
	key = key.encode('utf-8')
	tp = tp.encode('utf-8')
	baiduURl = "http://news.baidu.com/ns?word=" + quote(key)
	link = "http://authcrawler.yixin.com/submit?tmpl=baidu_news_search&link=" + baiduURl + "&key=" + quote(key) + "&type=" + quote(tp) + "&priority=10"
	data = {'timestamp': str(int(time.time())), 'tmpl': 'baidu_news_search', 'link': link, 'target': key, 'times': '0', 'ban': 'false', 'priority': 'true'}
	ret = {'topic': 'baidu_news_search', 'value': json.dumps(data), 'partition': 1}
	buf.append(ret)

for res in result:
	types = res[1]
	key = res[4]
	tp = ""
	if "person" in types:
		tp = "机构名_人名"
		send(key, tp)
	else:
		keys = key.split("%%")
		if len(keys) < 2:
			continue
		send(keys[0], "机构名")
		send(keys[1], "机构名_投资")

print "baidu_news_search from fund table produce total " + str(len(buf)) + " data to kafka"
kfk.produce(buf)
