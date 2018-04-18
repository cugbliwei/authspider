#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import time
import yaml
import json
import redis
import logging
import requests

from urllib import quote
from rediscluster import StrictRedisCluster
from apscheduler.schedulers.blocking import BlockingScheduler

import sql

logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S',
        )


class RedisProducer(object):

    select_yuqing = 'select companyName from %s where isEnable=1 limit %d, %d'
    select_object = 'select * from %s limit %d, %d'

    def __init__(self, config):
        self.config = config
        self.online = config['settings']['online']
        if self.online:
            self.redis = StrictRedisCluster(
                    startup_nodes=config['redis_cluster'])
        else:
            self.redis = redis.Redis()

    def update_queue(self):
        yuqing = self.config['yuqing']
        for spider in yuqing:
            logging.info('start updating %s', spider['tmpl'])
            self.update_spider(spider)

    def update_spider(self, spider):
        tables = self.config['tables']
        if spider.get("tables", []):
            tables = spider.get("tables")
        for table in tables:
            redis_list = 'authcrawler_{}_{}'.format(spider['tmpl'], table)
            self.redis.delete(redis_list)
            offset = 0
            limit = 1000
            while True:
                companys, finished = self.get_companys(table, offset*limit, limit)
                if finished:
                    break
                logging.info("query company from %s times %d", table, offset+1)

                values = []
                for company in companys:
                    if table == "crawlname":
                        hashid = company[0]
                        company = company[1].encode('utf8')
                        if company == "":
                            continue
                        link = eval(spider['link']) + '&hashid={}'.format(hashid)
                        data = {
                            'timestamp': str(int(time.time())),
                            'tmpl': spider['tmpl'],
                            'link': link,
                            'target': company,
                            'times': '0',
                            'ban': 'false',
                            'priority': 'true'
                        }
                    else:
                        company = company.encode('utf8')
                        data = {
                                'timestamp': str(int(time.time())),
                                'tmpl': spider['tmpl'],
                                'link': eval(spider['link']),
                                'target': company,
                                'times': '0',
                                'ban': 'false',
                                'priority': 'true'
                                }
                    values.append(json.dumps(data))
                if values:
                    self.redis.lpush(redis_list, *values)
                    logging.info("push %d values to %s", len(values), redis_list)

                offset += 1

    def get_companys(self, table, offset, limit):
        if table == 'yuqing_company':
            query = self.select_yuqing % (table, offset, limit)
            data = sql.selectFromMonitorTable(query)
            if not data:
                return [], True
            result = []
            result.extend((x[0] for x in data))
            return result, False
        elif table == 'object':
            query = self.select_object % (table, offset, limit)
            data = sql.selectFromFundTable(query)
            if not data:
                return [], True
            result = []
            for x in data:
                if "person" in x[1]:
                    result.append(x[4])
                else:
                    keys = x[4].split("%%")
                    if len(keys) < 2:
                        continue
                    result.append(keys[0])
                    result.append(keys[1])
            return result, False
        elif table == 'crawlname':
            query = self.select_object % (table, offset, limit)
            data = sql.selectFromMonitorTable(query)
            if not data:
                return [], True
            result = []
            result.extend(([x[0], x[1]] for x in data))
            result.extend(([x[0], x[3]] for x in data))
            return result, False
        else:
            logging.warning("Unexpected Table `%s`", table)
            return [], True

    def task(self):
        sched = BlockingScheduler()
        for task in self.config['tasks']:
            tmpl, count = task['tmpl'], task['count']
            priority = int(task.get("priority", 0))
            cron = task['cron'].split(' ')
            sched.add_job(self.sched_job, 'cron', minute=cron[0], hour=cron[1], day=cron[2], month=cron[3], day_of_week=cron[4], args=[tmpl, count, priority])
        sched.start()

    def sched_job(self, tmpl, count, priority):
        select = 'select * from crawling where tmpl="%s" and ban="false" limit %s' % (tmpl, count)
        if priority:
            select = 'select * from crawling where tmpl = "%s" and ban = "false" and priority = %d limit %s' % (tmpl, priority, count)
            priorityVal = "true"
        else:
            priorityVal = ""
        result = sql.selectFromTable(select)
        values = []
        for k, res in enumerate(result):
            if tmpl == "tianyancha_human":
                link = res[3] + '&index=' + str(k)
            else:
                link = res[3] + '&priority=0' if (tmpl == "baidu_news_search" and 'properity' not in res[3]) else res[3]
            data = {
                'timestamp': str(int(time.time())),
                'tmpl': tmpl,
                'link': link,
                'target': res[4],
                'times': str(res[5]),
                'ban': res[6],
                'priority': priorityVal
                }
            values.append(json.dumps(data))
        redis_key = 'authcrawler_{}'.format(tmpl)
        if values:
            self.redis.lpush(redis_key, *values)
        logging.info("push %d values to %s", len(values), redis_key)

    def schedule(self):
        sched = BlockingScheduler()
        for task in self.config['schdule']:
            link = task['link']
            cron = task['cron'].split(' ')
            sched.add_job(self.requests_job, 'cron', minute=cron[0], hour=cron[1], day=cron[2], month=cron[3], day_of_week=cron[4], args=[link])
        sched.start()

    def requests_job(self, link):
        with requests.Session() as s:
            s.get(link)


if __name__ == "__main__":
    file_dir = os.path.dirname(os.path.realpath(__file__))
    conf_path = os.path.join(file_dir, 'conf.yaml')
    with open(conf_path, 'r') as f:
        config = yaml.load(f)
    producer = RedisProducer(config)
    method = sys.argv[1]
    if method == "yuqing":
        producer.update_queue()
    elif method == "task":
        producer.task()
    elif method == "schdule":
        producer.schedule()
    else:
        print "wrong method"
