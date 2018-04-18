#!/usr/bin/env python
# -*- coding: utf-8 -*-

import time
import json
import sys
sys.path.append('../util')
import sql
import kfk

from urllib import quote

select = 'select * from object'
result = sql.selectFromFundTable(select)
buf = []


def send(name):
    name = name.encode('utf-8', 'ignore')
    link = 'http://authcrawler.yixin.com/submit?tmpl=weibo&query=%s' % (quote(name))
    data = {
            'timestamp': str(int(time.time())),
            'tmpl': 'weibo',
            'link': link,
            'target': name,
            'times': '0',
            'ban': 'false',
            'priority': 'true'
            }
    ret = {'topic': 'weibo', 'value': json.dumps(data), 'partition': 2}
    buf.append(ret)


for res in result:
    types = res[1]
    key = res[4]
    if "person" in types:
        send(key)
    else:
        keys = key.split("%%")
        if len(keys) < 2:
            continue
        send(keys[0])
        send(keys[1])


print "weibo from fund table produce total " + str(len(buf)) + " data to kafka"
kfk.produce(buf)
