#!/usr/bin/env python
# -*- coding: utf-8 -*-

import time
import json
import sys
sys.path.append('../util')
import sql
import kfk

from urllib import quote

select = 'select * from yuqing_company'
result = sql.selectFromFundTable(select)
buf = []


def send(name):
    tsn = 1  # tsn: 1(1天内), 2(一周内), 3(一月内), 4(一年内), 5(指定日期)
    name = name.encode('utf-8', 'ignore')
    link = 'http://authcrawler.yixin.com/submit?tmpl=sogou&query=%s&tsn=%s' % (
            quote(name), tsn
            )
    data = {
            'timestamp': str(int(time.time())),
            'tmpl': 'sogou',
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
