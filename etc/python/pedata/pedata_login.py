# coding: UTF-8
import json
import time
import urllib2
from urllib import quote
import sys
reload(sys)
sys.setdefaultencoding('utf8')


up = [
    {"username": "18612276212", "password": "shenglin"},
    {"username": "1053257283@qq.com", "password": "liwei"},
    {"username": "1192120201@qq.com", "password": "199264uio"},
    {"username": "446297930@qq.com", "password": "66666666"},
    {"username": "1602236850@qq.com", "password": "1991abcd"},
    {"username": "my446297930@163.com", "password": "66666666"},
    {"username": "752646172@qq.com", "password": "123456"},
    {"username": "qweqwejc@qq.com", "password": "1991abcd"}
]

index = 0
for ups in up:
    print "start: ", ups['username'], ups['password']
    html = urllib2.urlopen('http://authcrawler.yixin.com/submit?tmpl=pedata_login&username=' + ups['username'] + '&password=' + ups['password'] + '&index=' + str(index)).read()
    index = index + 1
    time.sleep(2)
