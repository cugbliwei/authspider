#!/usr/bin/env python
# -*- coding: utf-8 -*-


import json
import base64
import random
import logging
import requests

import redis
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


class DpCookie(object):

    burl = 'http://www.dianping.com'
    curl = 'http://hls.dianping.com/hippo.gif?__hlt=www.dianping.com&__ppp=&__had=%7B%22p_render%22%3A0%7D&force=1516095532000&__hsr=1440x900&__hsc=24bit&__hlh=http%3A%2F%2Fwww.dianping.com%2F&__pv=341%7C0'

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
        proxies = self.local_proxies() if self.online else None
        headers = self.headers()

        with requests.Session() as s:
            s.get(self.burl, headers=headers, proxies=proxies)
            s.get(self.curl, headers=headers, proxies=proxies)

        cookies = s.cookies.get_dict()
        cookies.pop('_hc.s')
        cookies = {k: v.replace('"', '') for k, v in cookies.items()}
        jarcookie = {'dianping.com': {}}
        for k, v in cookies.items():
            name = 'dianping.com;/;{}'.format(k)
            jarcookie['dianping.com'][name] = {
                    'Domain': 'dianping.com',
                    'Name': k,
                    'Path': '/',
                    'Value': v
                    }
        self.redis.set("dianping_cookie", base64.b64encode(json.dumps(jarcookie)))
        logging.info("get current cookie: %s", json.dumps(jarcookie))

    def local_proxies(self):
        addr = random.randint(0, 5)
        proxies = {
                'http': 'http://10.131.0.10{}:8090'.format(addr),
                'https': 'http://10.131.0.10{}:8090'.format(addr)
                }
        return proxies

    def headers(self):
        user_agent = random.choice(user_agent_list)
        return {'User-Agent': user_agent.format(random.randint(2, 6))}


if __name__ == "__main__":
    online = True
    dc = DpCookie(online=online)
    dc.run()
