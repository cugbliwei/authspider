#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
sys.path.append('../util')
import json
import time
import urllib
import commands
import hashlib
import datetime
import traceback
import logging

import sql

logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
        datefmt='%a, %d %b %Y %H:%M:%S',
        )

cmd = 'hdfs dfs -text /user/yisou/crawler/%s/%s/dn1* | grep ExtractorInfo.json'
insert_sql = "insert ignore into crawling (timestamp, tmpl, link, target, times, ban) values (%d, '%s', '%s', '%s', %d, '%s')"


class WeixinTask(object):

    task_url = 'http://authcrawler.yixin.com/submit?tmpl=weixin&url=%s&query=%s'
    sources = ('sogou', 'sogou_backtrack')

    def run(self):
        for source in self.sources:
            now = datetime.datetime.now()
            lasthour = (now - datetime.timedelta(hours=1)).strftime('%Y%m%d%H')
            _cmd = cmd % (source, lasthour)
            logging.info("starting get data from cmd: %s", _cmd)
            status, result = commands.getstatusoutput(_cmd)
            for res in result.split('\n'):
                try:
                    info = json.loads(res.split('\t')[4])
                    self.save(info)
                except:
                    logging.warning(traceback.format_exc())
                    continue

    def save(self, info):
        query = info['query']
        if isinstance(query, (list, tuple)):
            query = query[0]
        tasks = info['tasks']
        insert_sqls = []
        for task in tasks:
            insert = self.get_insert(task, query)
            insert_sqls.append(insert)
        if insert_sqls:
            logging.info(
                    'insert into %s data to crawling table',
                    len(insert_sqls))
        sql.insert(insert_sqls)

    def get_insert(self, task, query):
        link = task['link']
        title = task['title']
        author = task['author']
        target = md5(title + author)
        link = self.task_url % (urllib.quote(link), query)
        insert = insert_sql % (
                int(time.time()), 'weixin', link, target, 0, 'false'
                )
        return insert


def md5(data):
    m = hashlib.md5()
    m.update(data)
    return m.hexdigest()


if __name__ == "__main__":
    task = WeixinTask()
    task.run()
