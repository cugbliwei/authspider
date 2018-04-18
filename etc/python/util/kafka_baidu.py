# coding: UTF-8
import time
import json
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import kfk
import sql

tmpl = sys.argv[1]
number = sys.argv[2]
partition = sys.argv[3]

select = "select * from crawling where tmpl = '%s' and ban = 'false' limit %s" % (tmpl, number)
result = sql.selectFromTable(select)
buf = []
for res in result:
    link = res[3]
    if '&priority=' not in link:
        link = link + '&priority=0'
    data = {'timestamp': str(int(time.time())), 'tmpl': res[2], 'link': link, 'target': res[4], 'times': str(res[5]), 'ban': res[6]}
    ret = {'topic': tmpl, 'value': json.dumps(data), 'partition': int(partition)}
    buf.append(ret)

print tmpl + " produce total " + str(len(buf)) + " data to kafka"
kfk.produce(buf)
