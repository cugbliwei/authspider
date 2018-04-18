#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import redis
import time
import base64
import traceback
import smtplib

from email.mime.text import MIMEText
from email.header import Header

from rediscluster import StrictRedisCluster
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

accounts = [
    {"username": "1192120201@qq.com", "password": "199264uio&"},
    {"username": "fyhao17@126.com", "password": "creditease"},
    {"username": "ixy56841@gicua.com", "password": "weige666"},
    {"username": "ibpsxw70165@chacuo.net", "password": "ibpsxw70165"},
    {"username": "wriqxm78561@chacuo.net", "password": "wriqxm78561"},
    {"username": "zlwkcp82541@chacuo.net", "password": "zlwkcp82541"},
    {"username": "ndjkmx19624@chacuo.net", "password": "ndjkmx19624"},
    {"username": "zyfjop83254@chacuo.net", "password": "zyfjop83254"},
    {"username": "ngqosw36958@chacuo.net", "password": "ngqosw36958"},
    {"username": "xojdgq03482@chacuo.net", "password": "xojdgq03482"},
    {"username": "ledgqf63804@chacuo.net", "password": "ledgqf63804"},
    {"username": "jvlhag70614@chacuo.net", "password": "jvlhag70614"},
    {"username": "hyrdsu59720@chacuo.net", "password": "hyrdsu59720"},
    {"username": "lxrjtp59720@chacuo.net", "password": "lxrjtp59720"},
    {"username": "vqkgdp80765@chacuo.net", "password": "vqkgdp80765"}
]


def sendmail(body):
    sender = 'std-exception@bdp.yixin.com'
    revs = [
        'kangwang22@creditease.cn',
        'weili105@creditease.cn',
        'yuhaofu@creditease.cn'
    ]

    message = MIMEText(body, 'plain', 'utf-8')
    message['From'] = Header('std-exception@bdp.yixin.com', 'utf-8')
    message['to'] = Header(','.join(revs), 'utf-8')

    message['Subject'] = Header('IT桔子帐号登录失败', 'utf-8')

    smtpobj = smtplib.SMTP('mail.bdp.idc', port=25)
    smtpobj.sendmail(sender, revs, message.as_string())


def login(account):
    username, passwd = account['username'], account['password']
    print "start: ", account['username'], account['password']
    driver = webdriver.Remote(
        command_executor='http://10.131.0.59:8888/wd/hub',
        desired_capabilities=DesiredCapabilities.CHROME
    )
    try:
        driver.get('http://www.itjuzi.com')
        driver.implicitly_wait(5)
        driver.find_element_by_link_text('请登录').click()
        driver.find_element_by_id('create_account_email').send_keys(username)
        driver.find_element_by_id('create_account_password').send_keys(passwd)
        driver.find_element_by_id('login_btn').click()
        driver.find_element_by_link_text('雷达').click()
        driver.get('http://radar.itjuzi.com/investevent')
        # 为了等待桔子雷达页面完全加载, 获取到正确到Cookie.
        time.sleep(2)
        cookies = handle_cookies(driver.get_cookies())
        driver.quit()
        return cookies
    except:
        print traceback.format_exc()
        body = '帐号：{} 登录失败: {}'.format(
            account['username'], traceback.format_exc())
        sendmail(body)
        driver.close()
        return {}


def handle_cookies(cookies):
    rcookies = {'itjuzi.com': {}}
    # 因为context.AddKeyValueToJson方法的bug,在这里给acw_sc__设定一个初始值
    print cookies
    keys = [cookie['name'] for cookie in cookies]
    if 'acw_sc__' not in keys:
        cookies.append({
            'name': 'acw_sc__',
            'value': '0D37A6D0A4024C6680ABFB00286BD5C940A63569'
        })
    for cookie in cookies:
        key = 'itjuzi.com;/;{}'.format(cookie['name'])
        rcookies['itjuzi.com'][key] = {
            'Domain': 'itjuzi.com',
            'Name': cookie['name'],
            'Path': '/',
            'Value': cookie['value']
        }
    print 'get new cookie: ', rcookies
    return base64.b64encode(json.dumps(rcookies))


def main(online):
    if online:
        r = StrictRedisCluster(
                startup_nodes=[
                    {'host': '10.131.0.106', 'port': 6379},
                    {'host': '10.131.0.108', 'port': 6379},
                    {'host': '10.131.0.109', 'port': 6379},
                    ])
    else:
        r = redis.Redis()

    for i, account in enumerate(accounts):
        cookies = login(account)
        if not cookies:
            continue
        r.set('itjuzi_account_{}'.format(i), cookies)
        time.sleep(1)


if __name__ == "__main__":
    online = True
    main(online)
