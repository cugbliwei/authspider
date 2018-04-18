#!/usr/bin/env python
# -*- coding: utf-8 -*-

import time
import json
import sys
sys.path.append('../util')
import sql
import kfk
import datetime

from urllib import quote

select = 'select * from yuqing_company'
result = sql.selectFromFundTable(select)
buf = []

days = int(sys.argv[1])


def send(name):
    name = name.encode('utf-8', 'ignore')
    for i in range(days):
        now = datetime.datetime.now()
        ft = (now - datetime.timedelta(days=i)).strftime('%Y-%m-%d')
        et = ft
        link = 'http://authcrawler.yixin.com/submit?tmpl=sogou_backtrack&query=%s&tsn=5&ft=%s&et=%s' % (
                quote(name), ft, et
                )
        data = {
                'timestamp': str(int(time.time())),
                'tmpl': 'sogou_backtrack',
                'link': link,
                'target': name,
                'times': '0',
                'ban': 'false',
                'priority': 'true'
                }
        ret = {'topic': 'sogou', 'value': json.dumps(data), 'partition': 2}
        buf.append(ret)


for res in result:
    send(res[1])
    send(res[2])

print "sogou from yuqing table produce total " + str(len(buf)) + " data to kafka"
kfk.produce(buf)
