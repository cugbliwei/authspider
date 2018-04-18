# coding: UTF-8
import json
import time
import urllib2
from urllib import quote
import sys
reload(sys)
sys.setdefaultencoding('utf8')
sys.path.append('../util')
import kfk
import sql

select = "select * from crawling where tmpl = 'tianyancha_human' and ban = 'false' limit 2000"
result = sql.selectFromTable(select)
buf = []
i = 0
for res in result:
    link = 'http://authcrawler.yixin.com/submit?tmpl=tianyancha_human&link=' + quote(res[4]) + '&index=' + str(i)
    data = {'timestamp': str(int(time.time())), 'tmpl': res[2], 'link': link, 'target': res[4], 'times': str(res[5]), 'ban': res[6]}
    ret = {'topic': 'tianyancha_human', 'value': json.dumps(data), 'partition': 0}
    buf.append(ret)
    i = i + 1
    if i >= 325:
        break

print "produce total " + str(len(buf)) + " data to kafka"
kfk.produce(buf)
