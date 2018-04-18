# coding: UTF-8
import json
import time
import urllib2
from urllib import quote
import sys
reload(sys)
sys.setdefaultencoding('utf8')


up = [
    {"username": "13105874587", "password": "199264uio"},
    {"username": "15543492004", "password": "199264uio"},
    {"username": "17098020847", "password": "199264uio"},
    {"username": "17185136485", "password": "199264uio"},
    {"username": "18714543824", "password": "199264uio"},
    {"username": "13095819435", "password": "199264uio"},
    {"username": "17082300465", "password": "199264uio"},
    {"username": "17081741448", "password": "199264uio"},
    {"username": "17174616708", "password": "199264uio"},
    {"username": "15578454758", "password": "199264uio"},
    {"username": "15578276847", "password": "199264uio"},
    {"username": "15578421604", "password": "199264uio"},
    {"username": "15578427549", "password": "199264uio"},
    {"username": "15643736734", "password": "199264uio"},
    {"username": "18245497019", "password": "199264uio"},
    {"username": "18245484592", "password": "199264uio"},
    {"username": "18245495053", "password": "199264uio"},
    {"username": "18245468102", "password": "199264uio"},
    {"username": "18273416264", "password": "199264uio"},
    {"username": "15197465355", "password": "199264uio"}
]

index = 0
for ups in up:
    print "start: ", ups['username'], ups['password']
    html = urllib2.urlopen('http://authcrawler.yixin.com/submit?tmpl=lagou_login&username=' + ups['username'] + '&password=' + ups['password'] + '&index=' + str(index)).read()
    index = index + 1
    time.sleep(2)
