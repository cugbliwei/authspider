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


def handle(company, no):
    if company is not None and len(company) > 0:
        company = company.replace("'", "\\\'")
        company = company.replace("\"", "\\\"")
        company = company.replace("%", "")
        company = company.replace("&", "")
        crawlingSql = "select * from crawling where tmpl = 'tianyancha' and target = '%s'" % (company)
        if sql.existFromTable(crawlingSql):
            deleteSql = "delete from crawling where tmpl = 'tianyancha' and target = '%s'" % (company)
            sql.executeFromTable(deleteSql)
        link = 'http://authcrawler.yixin.com/submit?tmpl=tianyancha&key={}&no={}'.format(quote(company), no)
        insertStr = "insert into crawling(timestamp, tmpl, link, target, times, ban) values(%d, '%s', '%s', '%s', %d, '%s')" % (
        int(time.time()), "tianyancha", link, company, 0, "false")
        return insertStr
    return ""


exists = {}
for line in fileinput.input('insurance_data.txt'):
    try:
        lines = line.strip().split('\t')
        if len(lines) < 5:
            continue

        insert = []
        data = json.loads(lines[4])
        if u"企业背景" in data:
            if u"对外投资" in data[u"企业背景"]:
                duiwai = data[u"企业背景"][u"对外投资"]
                for tr in duiwai:
                    if u"爬取次数" in tr and u"被投资企业名称" in tr and tr[u"被投资企业名称"] not in exists:
                        no = tr[u"爬取次数"]
                        if no == u"4" or no == u"null":
                            break
                        exists[tr[u"被投资企业名称"]] = "1"
                        company = tr[u"被投资企业名称"].encode('utf8')
                        next_no = int(no) + 1
                        insertStr = handle(company, next_no)
                        if len(insertStr) > 0:
                            insert.append(insertStr)

        if len(insert) > 0:
            print "insert total " + str(len(insert)) + " data to crawling table"
            sql.insert(insert)

    except Exception, e:
        print e
