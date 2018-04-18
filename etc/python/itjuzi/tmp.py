# coding: UTF-8
import json
import time
import sys
import fileinput
from urllib import quote
reload(sys)
sys.setdefaultencoding('utf8')
sys.path.append('../util')
import sql


def handle(tmpl, link):
    crawlingSql = "select * from crawling where tmpl = '%s' and target = '%s'" % (tmpl, link)
    crawledSql = "select * from crawled where tmpl = '%s' and target = '%s'" % (tmpl, link)
    if not sql.existFromTable(crawlingSql) and not sql.existFromTable(crawledSql):
        insertStr = "insert into crawling(timestamp, tmpl, link, target, times, ban, priority) values(%d, '%s', '%s', '%s', %d, '%s', %d)" % (int(time.time()), tmpl, "http://authcrawler.yixin.com/submit?tmpl=" + tmpl + "&link=" + quote(link), link, 0, "false", 0)
        return insertStr
    return ""

link = "https://www.itjuzi.com/company/"
count = 0
insert = []
for i in range(1, 84139):
    count += 1
    insertStr = handle("itjuzi_company", link + str(i))
    if len(insertStr) > 0:
        insert.append(insertStr)
            
	if count % 1000 == 0:
	    if len(insert) > 0:
                print "insert total " + str(len(insert)) + " data to crawling table"
                sql.insert(insert)
	        insert = []


if len(insert) > 0:
    print "insert total " + str(len(insert)) + " data to crawling table"
    sql.insert(insert)
