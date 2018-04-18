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


def handle(sousuo, tmpl, link):
    crawlingSql = "select * from crawling where tmpl = '%s' and target = '%s'" % (tmpl, link)
    crawledSql = "select * from crawled where tmpl = '%s' and target = '%s'" % (tmpl, link)
    if not sql.existFromTable(crawlingSql) and not sql.existFromTable(crawledSql):
        insertStr = "insert into crawling(timestamp, tmpl, link, target, times, ban, priority) values(%d, '%s', '%s', '%s', %d, '%s', %d)" % (int(time.time()), tmpl, "http://authcrawler.yixin.com/submit?tmpl=" + tmpl + "&link=" + quote(link) + "&key=" + quote(sousuo), link, 0, "false", 0)
        return insertStr
    return ""

def getId(link):
    links = link.split('/')
    if len(links) == 4:
        links = links[3].split('.')
        if len(links) == 2:
            return links[0]
    return ""

exists = {}
for line in fileinput.input('data.txt'):
    try:
        lines = line.strip().split('\t')
        if len(lines) < 5:
            continue
    
        insert = []
        data = json.loads(lines[4])
        sousuo = ""
        if u"搜索词" in data:
            sousuo = data[u"搜索词"].encode("utf-8")

        if u"企业" in data and len(data[u"企业"]) > 0:
            for qiye in data[u"企业"]:
                if u"机构链接" in qiye:
                    link = qiye[u"机构链接"].encode("utf-8")
                    Id = getId(link)
                    if len(link) > 0:
                        link = "http://m.pedata.cn/ep/detail_" + Id + ".html"
                    else:
                        continue
                    insertStr = handle(sousuo, "pedata_ep", link)
                    if len(insertStr) > 0:
                        insert.append(insertStr)

        if u"基金" in data and len(data[u"基金"]) > 0:
            for qiye in data[u"基金"]:
                if u"基金链接" in qiye:
                    link = qiye[u"基金链接"].encode("utf-8")
                    Id = getId(link)
                    if len(link) > 0:
                        link = "http://m.pedata.cn/fund/detail_" + Id + ".html"
                    else:
                        continue
                    insertStr = handle(sousuo, "pedata_fund", link)
                    if len(insertStr) > 0:
                        insert.append(insertStr)

        if u"投资事件" in data and len(data[u"投资事件"]) > 0:
            for qiye in data[u"投资事件"]:
                if u"事件链接" in qiye:
                    link = qiye[u"事件链接"].encode("utf-8")
                    Id = getId(link)
                    if len(link) > 0:
                        link = "http://m.pedata.cn/invest/detail_" + Id + ".html"
                    else:
                        continue
                    insertStr = handle(sousuo, "pedata_invest", link)
                    if len(insertStr) > 0:
                        insert.append(insertStr)

        if u"投资人" in data and len(data[u"投资人"]) > 0:
            for qiye in data[u"投资人"]:
                if u"投资人链接" in qiye:
                    link = qiye[u"投资人链接"].encode("utf-8")
                    Id = getId(link)
                    if len(link) > 0:
                        link = "http://m.pedata.cn/person/detail_" + Id + ".html"
                    else:
                        continue
                    insertStr = handle(sousuo, "pedata_person", link)
                    if len(insertStr) > 0:
                        insert.append(insertStr)

        if u"机构" in data and len(data[u"机构"]) > 0:
            for qiye in data[u"机构"]:
                if u"机构链接" in qiye:
                    link = qiye[u"机构链接"].encode("utf-8")
                    Id = getId(link)
                    if len(link) > 0:
                        link = "http://m.pedata.cn/org/detail_" + Id + ".html"
                    else:
                        continue
                    insertStr = handle(sousuo, "pedata_org", link)
                    if len(insertStr) > 0:
                        insert.append(insertStr)

        if u"退出事件" in data and len(data[u"退出事件"]) > 0:
            for qiye in data[u"退出事件"]:
                if u"事件链接" in qiye:
                    link = qiye[u"事件链接"].encode("utf-8")
                    Id = getId(link)
                    if len(link) > 0:
                        link = "http://m.pedata.cn/exit/detail_" + Id + ".html"
                    else:
                        continue
                    insertStr = handle(sousuo, "pedata_exit", link)
                    if len(insertStr) > 0:
                        insert.append(insertStr)

        if len(insert) > 0:
            print "insert total " + str(len(insert)) + " data to crawling table"
            sql.insert(insert)

    except Exception, e:
        print e
