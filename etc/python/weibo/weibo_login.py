#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import json
import base64
import logging
import re
import redis
import traceback
import rsa
import binascii
import random
import time

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
    {"username": "14781015773", "password": "hn12021"},
    {"username": "17725892386", "password": "hn12021"},
    {"username": "14781015717", "password": "hn12021"},
    {"username": "17038530742", "password": "hn12021"}
    ]


class WeiboCookie(object):
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

    def login(self):
        url = 'http://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.18)'
        i = 0
        for ups in up:
            username = ups["username"]
            password = ups["password"]
            su = base64.b64encode(username)
            try:
                for visit_time in range(0, 50):
                    proxies = self.local_proxies() if self.online else None
                    user_agent = random.choice(user_agent_list)
                    user_agent = user_agent.format(random.randint(2, 6))
                    headers = {
                        "User-Agent": user_agent
                    }
                    data = self.get_prelogin_args(su)
                    post_data = self.get_post_data(data, su, password)
                    login_cookies = {"ULOGIN_IMG":data["pcid"]}
                    captcha_url = "https://login.sina.com.cn/cgi/pin.php?r=41477454&s=0&p={}".format(data["pcid"])
                    captcha = requests.get(captcha_url)
                    captcha_base64 = base64.b64encode(captcha.content)
                    captcha_data = {
                        "website": "5words",
                        "img": captcha_base64
                    }
                    secret_code = requests.post("http://yisou.bdp.creditease.corp/captcha", data=captcha_data, timeout=30)
                    post_data["door"] = secret_code.content
                    session = requests.Session()
                    res = session.post(
                            url=url,
                            headers=headers,
                            data=post_data,
                            cookies=login_cookies,
                            proxies=proxies
                            )
                    cookie_dict = session.cookies.get_dict()
                    if len(cookie_dict) < 5:
                        continue
                    cookie = self.process_cookie(cookie_dict)
                    if not cookie:
                        logging.info('get current cookie err')
                    else:
                        logging.info('get current cookie: %s', cookie)
                        cookie = base64.b64encode(json.dumps(cookie))
                        self.redis.set('weibo_cookie_{}'.format(i), cookie)
                        i += 1
                        break
                time.sleep(2)
            except:
                logging.warning(traceback.format_exc())
                return None

    def process_cookie(self, cookie):
        if not cookie:
            return None
        cookies = {'weibo.com': {}}
        for k, v in cookie.items():
            name = 'weibo;/;{}'.format(k)
            cookies['weibo.com'][name] = {
                    'Domain': 'weibo.com',
                    'Name': k,
                    'Path': '/',
                    'Value': v
                    }
        return cookies

    def get_post_data(self, data, su, password):
        encrypted_pw = self.get_encrypted_pw(data, password)
        post_data = {
            "entry": "weibo",
            "gateway": "1",
            "from": "",
            "savestate": "7",
            "useticket": "1",
            "pagerefer": "",
            "vsnf": "1",
            "su": su,
            "service": "miniblog",
            "servertime": data["servertime"],
            "nonce": data['nonce'],
            "pwencode": "rsa2",
            "rsakv": data['rsakv'],
            "sp": encrypted_pw,
            "sr": "1280*800",
            "encoding": "UTF-8",
            "prelt": "58",
            "url": "http://weibo.com/ajaxlogin.php?framelogin=1&callback=parent.sinaSSOController.feedBackUrlCallBack",
            "returntype": "META"
        }
        return post_data

    def get_prelogin_args(self, su):
        pre_loginurl = "https://login.sina.com.cn/sso/prelogin.php?entry=sso&callback=sinaSSOController.preloginCallBack&su={}&rsakt=mod&client=ssologin.js(v1.4.15)".format(su)
        try:
            res = requests.get(pre_loginurl)
            res_content = res.content
            json_pattern = re.compile('\((.*)\)')
            json_data = json_pattern.search(res_content).group(1)
            data = json.loads(json_data)
            return data
        except:
            logging.warning(traceback.format_exc())
            return None

    def get_encrypted_pw(self, data, password):
        rsa_e = 65537  # 0x10001
        pw_string = str(data['servertime']) + '\t' + str(data['nonce']) + '\n' + str(password)
        key = rsa.PublicKey(int(data['pubkey'], 16), rsa_e)
        pw_encypted = rsa.encrypt(pw_string.encode('utf-8'), key)
        passwd = binascii.b2a_hex(pw_encypted)
        return passwd

    def local_proxies(self):
        addr = random.randint(0, 3)
        proxies = {
                'http': 'http://10.131.0.10{}:8090'.format(addr),
                'https': 'http://10.131.0.10{}:8090'.format(addr)
                }
        return proxies


if __name__ == "__main__":
    online = True
    wc = WeiboCookie(online=online)
    wc.login()
