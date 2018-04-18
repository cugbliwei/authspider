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


def handle(sousuo, types, link, date, origin, imageLink, table, priority, hashid):
    crawlingSql = "select * from crawling where tmpl = 'baidu_news' and target = '%s'" % link
    crawledSql = "select * from crawled where tmpl = 'baidu_news' and target = '%s'" % link
    if not sql.existFromTable(crawlingSql) and not sql.existFromTable(crawledSql):
        insertStr = "insert into crawling(timestamp, tmpl, link, target, times, ban, priority) values(%d, '%s', '%s', '%s', %d, '%s', %d)" % (int(time.time()), "baidu_news", "http://authcrawler.yixin.com/submit?tmpl=baidu_news&link=" + quote(link) + "&key=" + quote(sousuo) + "&type=" + quote(types) + "&date=" + quote(date) + "&origin=" + quote(origin) + "&image=" + quote(imageLink) + "&table=" + quote(table) + "&hashid=" + quote(hashid), link, 0, "false", priority)
        return insertStr
    return ""


def getTime(new):
    nowTime = time.strftime("%Y-%m-%d %H:%M", time.localtime())
    try:
        if u"时间" in new and len(new[u"时间"]) > 0:
            na = time.strptime(new[u"时间"].encode("utf-8"), "%Y年%m月%d日 %H:%M")
            return time.strftime('%Y-%m-%d %H:%M', time.localtime(time.mktime(na)))
            return new[u"时间"].encode("utf-8")

        if u"时间1" in new and len(new[u"时间1"]) > 0:
            hour = int(new[u"时间1"])
            t = time.time() - hours*60*60
            tt = time.strftime('%Y-%m-%d %H:%M', time.localtime(t))
            return tt

        if u"时间2" in new and len(new[u"时间2"]) > 0:
            minute = int(new[u"时间2"])
            t = time.time() - minute*60
            tt = time.strftime('%Y-%m-%d %H:%M', time.localtime(t))
            return tt

        return nowTime

    except Exception, e:
        print e
        return nowTime

exists = {}
for line in fileinput.input('data.txt'):
    try:
        lines = line.strip().split('\t')
        if len(lines) < 5:
            continue
    
        insert = []
        data = json.loads(lines[4])
        if u"搜索词" not in data or u"类型" not in data or u"新闻" not in data:
            continue
        if data[u"搜索词"] is None or len(data[u"搜索词"]) == 0 or data[u"类型"] is None or len(data[u"类型"]) == 0:
            continue

        sousuo = data[u"搜索词"].encode("utf-8")
        types = data[u"类型"].encode("utf-8")
        priority = 0
        table = "null"
        hashid = "null"
        if u"优先级" in data:
            priority = int(data[u"优先级"].encode("utf-8"))
        if u"table" in data:
            table = data[u"table"].encode("utf-8")
        if u"hashid" in data:
            hashid = data[u"hashid"].encode("utf-8")
        news = data[u"新闻"]
        for new in news:
            if u"链接" not in new or new[u"链接"] is None or len(new[u"链接"]) == 0:
                continue

            link = new[u"链接"].encode("utf-8")
            key = link
            if key in exists:
                continue

            origin = "null"
            if u"源网站" in new:
                origin = new[u"源网站"].encode("utf-8")
            elif u"源网站1" in new:
                origin = new[u"源网站1"].encode("utf-8")
            elif u"源网站2" in new:
                origin = new[u"源网站2"].encode("utf-8")
            elif u"源网站3" in new:
                origin = new[u"源网站3"].encode("utf-8")
            elif u"源网站4" in new:
                origin = new[u"源网站4"].encode("utf-8")

            imageLink = "null"
            if u"图片链接" in new and new[u"图片链接"] is not None:
                if "url" in new[u"图片链接"] and new[u"图片链接"]["url"] is not None:
                    imageLink = new[u"图片链接"]["url"]

            exists[key] = "1"
            date = getTime(new)
            insertStr = handle(sousuo, types, link, date, origin, imageLink, table, priority, hashid)
            if len(insertStr) > 0:
                insert.append(insertStr)

        if len(insert) > 0:
            print "insert total " + str(len(insert)) + " data to crawling table"
            sql.insert(insert)

    except Exception, e:
        print e
