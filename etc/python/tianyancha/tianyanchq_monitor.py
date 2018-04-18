# coding: UTF-8
import json
import time
import urllib2
import requests
from urllib import quote
import sys
reload(sys)
sys.setdefaultencoding('utf8')
sys.path.append('../util')
import kfk
import sql

def getNext(s, body, crawl_times):
    try:
        if "status" in body and body["status"] == "fail":
            print "crawl fail: " + body["data"]
            insertStr = "insert into src_monitor(tyc_times) values(%d)" % (crawl_times + 1)
            sql.executeFromMonitorTable(insertStr)
            return
        elif "status" in body and body["status"] == "in_crawling":
            print "crawling..."
            nextLink = "http://authcrawler.yixin.com/submit?id=" + body["id"]
            resp = s.get(nextLink)
            body = json.loads(resp.text)
            getNext(s, body, crawl_times)
        elif "status" in body and body["status"] == "finish_fetch_data":
            print "crawl finish!"
            insertStr = "insert into src_monitor(tyc) values(%d)" % (1)
            sql.executeFromMonitorTable(insertStr)
            return
    except Exception, e:
        print e
        return

select = "select * from src_monitor where tyc = 0 and type = 'org' and tyc_times < 3 limit 5"
result = sql.selectFromMonitorTable(select)
for res in result:
    link = 'http://authcrawler.yixin.com/submit?tmpl=tianyancha&key=' + quote(res[0])
    try:
    	s = requests.Session()
    	resp = s.get(link)
    	body = json.loads(resp.text)
    	getNext(s, body, res[7])
    except Exception, e:
        print e

    time.sleep(30)
