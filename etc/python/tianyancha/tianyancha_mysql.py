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


def handle(company):
    company = company.encode('utf-8')
    if company is not None and len(company) > 0:
        company = company.replace("'", "\\\'")
        company = company.replace("\"", "\\\"")
        company = company.replace("%", "")
        company = company.replace("&", "")
        crawlingSql = "select * from crawling where tmpl = 'tianyancha' and target = '%s'" % (company)
        crawledSql = "select * from crawled where tmpl = 'tianyancha' and target = '%s'" % (company)
        if not sql.existFromTable(crawlingSql) and not sql.existFromTable(crawledSql):
            insertStr = "insert into crawling(timestamp, tmpl, link, target, times, ban) values(%d, '%s', '%s', '%s', %d, '%s')" % (int(time.time()), "tianyancha", "http://authcrawler.yixin.com/submit?tmpl=tianyancha&key=" + quote(company), company, 0, "false")
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
        if u"扩展搜索词" in data:
            for buf in data[u"扩展搜索词"]:
                if u"搜索词" in buf and buf[u"搜索词"] not in exists:
                    exists[buf[u"搜索词"]] = "1"
                    insertStr = handle(buf[u"搜索词"])
                    if len(insertStr) > 0:
                        insert.append(insertStr)

        if u"企业发展" in data:
            if u"投资事件" in data[u"企业发展"]:
                touzi = data[u"企业发展"][u"投资事件"]
                for tou in touzi:
                    if u"产品" in tou and tou[u"产品"] not in exists:
                        exists[tou[u"产品"]] = "1"
                        insertStr = handle(tou[u"产品"])
                        if len(insertStr) > 0:
                            insert.append(insertStr)

                    if u"投资方" in tou:
                        for fang in tou[u"投资方"]:
                            if u"公司" in fang and fang[u"公司"] not in exists:
                                exists[fang[u"公司"]] = "1"
                                insertStr = handle(fang[u"公司"])
                                if len(insertStr) > 0:
                                    insert.append(insertStr)

            if u"竞品信息" in data[u"企业发展"]:
                jingpin = data[u"企业发展"][u"竞品信息"]
                for pin in jingpin:
                    if u"产品" in pin and pin[u"产品"] not in exists:
                        exists[pin[u"产品"]] = "1"
                        insertStr = handle(pin[u"产品"])
                        if len(insertStr) > 0:
                            insert.append(insertStr)

            if u"融资历史" in data[u"企业发展"]:
                rongzi = data[u"企业发展"][u"融资历史"]
                for rong in rongzi:
                    if u"投资方" in rong:
                        for tr in rong[u"投资方"]:
                            if u"公司" in tr and tr[u"公司"] not in exists:
                                exists[tr[u"公司"]] = "1"
                                insertStr = handle(tr[u"公司"])
                                if len(insertStr) > 0:
                                    insert.append(insertStr)

        if u"企业背景" in data:
            if u"对外投资" in data[u"企业背景"]:
                duiwai = data[u"企业背景"][u"对外投资"]
                for tr in duiwai:
                    if u"被投资企业名称" in tr and tr[u"被投资企业名称"] not in exists:
                        exists[tr[u"被投资企业名称"]] = "1"
                        insertStr = handle(tr[u"被投资企业名称"])
                        if len(insertStr) > 0:
                            insert.append(insertStr)

            if u"分支机构" in data[u"企业背景"]:
                branch = data[u"企业背景"][u"分支机构"]
                for br in branch:
                    if u"企业名称" in br and br[u"企业名称"] not in exists:
                        exists[br[u"企业名称"]] = "1"
                        insertStr = handle(br[u"企业名称"])
                        if len(insertStr) > 0:
                            insert.append(insertStr)

        if len(insert) > 0:
            print "insert total " + str(len(insert)) + " data to crawling table"
            sql.insert(insert)

    except Exception, e:
        print e
