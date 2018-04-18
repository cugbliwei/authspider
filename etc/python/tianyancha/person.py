# coding: UTF-8
import json
import time
import sys
from urllib import quote
reload(sys)
sys.setdefaultencoding('utf8')
sys.path.append('../util')
import sql


def handle(humanUrl):
    if humanUrl is not None and len(humanUrl) > 0:
        if "https://www.tianyancha.com/human/" in humanUrl:
            crawlingSql = "select * from crawling where tmpl = 'tianyancha_human' and target = '%s'" % (humanUrl)
            crawledSql = "select * from crawled where tmpl = 'tianyancha_human' and target = '%s'" % (humanUrl)
            if not sql.existFromTable(crawlingSql) and not sql.existFromTable(crawledSql):
                insertStr = "insert into crawling(timestamp, tmpl, link, target, times, ban) values(%d, '%s', '%s', '%s', %d, '%s')" % (int(time.time()), "tianyancha_human", "http://authcrawler.yixin.com/submit?tmpl=tianyancha_human&link=" + quote(humanUrl), humanUrl, 0, "false")
                return insertStr
    return ""


vcs = json.load(file('data.json'))
insert = []
exists = {}
for vc in vcs:
    if u"企业背景" in vc and u"法人信息" in vc[u"企业背景"]:
        legalInfo = vc[u"企业背景"][u"法人信息"]
        for li in legalInfo:
            if u"法人姓名id" in li:
                nameId = li[u"法人姓名id"]
                if nameId in exists:
                    continue

                exists[nameId] = "1"
                insertStr =  handle(nameId)
                if len(insertStr) > 0:
                    insert.append(insertStr)

    if u"企业背景" in vc and u"主要人员" in vc[u"企业背景"]:
        mager = vc[u"企业背景"][u"主要人员"]
        for mg in mager:
            if "id" in mg:
                mgId = mg["id"]
                if mgId in exists:
                    continue

                exists[mgId] = "1"
                insertStr =  handle(mgId)
                if len(insertStr) > 0:
                    insert.append(insertStr)

if len(insert) > 0:
    print "insert total " + str(len(insert)) + " data to crawling table"
    sql.insert(insert)
