#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re
import time
import json
import redis
import random
import logging
import requests
import traceback
import base64

from string import letters
from rediscluster import StrictRedisCluster

logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
        datefmt='%a, %d %b %Y %H:%M:%S',
        )

user_agent_list = [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.134 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.104 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.140 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36',
        ]

up = [
    {"username": "13140647184", "password": "1234567890"},
    {"username": "13140649742", "password": "1234567891"},
    {"username": "15565844072", "password": "1234567892"},
    {"username": "15514428723", "password": "1234567893"}
    ]


class XiniuCookie(object):
    def __init__(self, online):
        self.online = online
        if self.online:
            self.redis = StrictRedisCluster(
                    startup_nodes=[
                        {'host': '10.131.0.106', 'port': 6379},
                        {'host': '10.131.0.108', 'port': 6379},
                        {'host': '10.131.0.109', 'port': 6379},
                        ])
        else:
            self.redis = redis.Redis()

    def run(self):
        url = 'http://www.xiniudata.com/api/user/login/verify'
        i = 0
        for ups in up:
            username = ups["username"]
            password = ups["password"]
            try:
                data = {"payload": {"account": username, "password": password, "autoLogin": True}}
                proxies = self.local_proxies() if self.online else None
                session = requests.Session()
                r = session.post(
                        url=url,
                        headers=self.rand_headers(),
                        json=data,
                        proxies=proxies,
                        timeout=10
                        )
            except:
                logging.warning(traceback.format_exc())
                continue

            cookie = self.process_cookie(session.cookies.get_dict())
            if cookie:
                logging.info('get current cookie: %s', cookie)
                cookie = base64.b64encode(json.dumps(cookie))
                print cookie
                self.redis.set('xiniudata_cookie_{}'.format(i), cookie)
                i += 1
            time.sleep(2)

    def process_cookie(self, cookie):
        if not cookie:
            return None
        cookie['location'] = 'http%3A%2F%2Fwww.xiniudata.com%2F%23%2F'
        cookies = {'xiniudata.com': {}}
        for k, v in cookie.items():
            name = 'xiniudata.com;/;{}'.format(k)
            cookies['xiniudata.com'][name] = {
                    'Domain': 'xiniudata.com',
                    'Name': k,
                    'Path': '/',
                    'Value': v
                    }
        return cookies

    def rand_headers(self):
        user_agent = random.choice(user_agent_list)
        user_agent = user_agent.format(random.randint(2, 6))
        headers = dict((
            ('User-Agent', user_agent),
            ('Accept', '*/*'),
            ('Accept-Encoding', 'gzip, deflate'),
            ('Accept-Language', 'zh-CN,zh;q=0.9,en;q=0.8'),
            ('Host', 'www.xiniudata.com'),
            ('Referer', 'http://www.xiniudata.com/account/')
            ))
        return headers

    def local_proxies(self):
        addr = random.randint(0, 3)
        proxies = {
                'http': 'http://10.131.0.10{}:8090'.format(addr),
                'https': 'http://10.131.0.10{}:8090'.format(addr)
                }
        return proxies

    def crawled_proxies(self):
        url = 'http://authcrawler.yixin.com/proxy/get?tmpl=baidu_news_search'
        r = requests.get(url, timeout=10)
        proxy = r.content
        proxies = {
                "http": proxy,
                "https": proxy
                }
        return proxies


if __name__ == "__main__":
    online = True
    sc = XiniuCookie(online=online)
    sc.run()
