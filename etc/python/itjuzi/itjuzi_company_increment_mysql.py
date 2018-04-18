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

exists = {}
for line in fileinput.input('data.txt'):
    try:
        lines = line.strip().split('\t')
        if len(lines) < 5:
            continue
    
        insert = []
        data = json.loads(lines[4])

        if u"公司链接" in data:
            for qiye in data[u"公司链接"]:
                if u"链接" in qiye and qiye[u"链接"] is not None:
                    link = qiye[u"链接"].encode("utf-8")
                    insertStr = handle("itjuzi_company", link)
                    if len(insertStr) > 0:
                        insert.append(insertStr)

        if len(insert) > 0:
            print "insert total " + str(len(insert)) + " data to crawling table"
            sql.insert(insert)

    except Exception, e:
        print e
