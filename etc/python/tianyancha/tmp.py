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

inserts = []
count = 0
for line in fileinput.input('tyc_org.txt'):
    company = line.strip()
    ins = handle(company)
    count += 1
    if len(ins) > 0:
        inserts.append(ins)
    if count % 10000 == 0:
        sql.insert(inserts)
        inserts = []

sql.insert(inserts)
