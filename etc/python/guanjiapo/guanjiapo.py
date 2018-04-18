#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
 itemList: 商品信息
 orderList: 进货单
 orderDetail: 进货详细单
 returnList: 进货退货
 returnDetailList: 进货退货详单
 saleList: 销售出库单
 saleDetailList: 销售出库详细单
 saleReturnList: 销售退货单
 saleReturnDetailList: 销售退货详单
 stockList: 库存状况表
 stockBillsList: 库存明细账本
 analyseList: 往来单位应收应付
 monthBills: 月结存
 accountDetail: 收付款明细表
 profitList: 利润表
 profitDetailList: 利润明细表
 bossReport: 老板表
 bossReportDetail: 老板明细表
 balanceSheet: 资产负债表
 balanceSheelDetail: 资产负债明细
 employeeList: 职员应收应付
 partyList: 往来单位
 cashBankList: 现金银行
 billsDetailList: 费用支出
 saleYearReport: 销售年报
"""

import os
import re
import sys
import json
import time
import copy
import urlparse
import logging
import datetime
import requests
import traceback
import smtplib

from email.mime.text import MIMEText
from email.header import Header

# disable requests default log msg
# logging.getLogger('requests').setLevel(logging.CRITICAL)

logfile = os.path.dirname(os.path.realpath(__file__))
logfile = os.path.dirname(logfile)
logfile = os.path.dirname(logfile)
logfile = os.path.dirname(logfile)
logfile = os.path.join(logfile, 'guanjiapo.log')

logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
        datefmt='%a, %d %b %Y %H:%M:%S',
        filename=logfile
        )


def log(func):
    def wrap(*args, **kwargs):
        msg = '{} start crawl {}'.format(args[0].taskid, func.__name__)
        logging.info(msg)
        try:
            func(*args, **kwargs)
        except:
            logging.warning("crawl %s error! %s", func.__name__, traceback.format_exc())
    return wrap


class GjpSpider(object):

    def __init__(self, cookie_path, taskid):
        self.s = requests.Session()
        self.taskid = taskid
        self.cookie_path = cookie_path
        self.task_dir = os.path.dirname(cookie_path)
        self.result = dict((
            ('orderList', []),
            ('orderDetailList', []),
            ('returnList', []),
            ('returnDetailList', []),
            ('saleList', []),
            ('saleDetailList', []),
            ('saleReturnList', []),
            ('saleReturnDetailList', []),
            ('balanceSheet', []),
            ('balanceSheelDetail', []),
            ('saleYearReport', []),
            ('dailyReport', [])
            ))
        self.version = None

    def run(self):
        self._cookie()
        if self.version.startswith('4'):
            self.sale_year_report()
            self.get_balance_sheet()
            self.get_business_history()
        elif self.version.startswith('7.1'):
            self.get_v7_order()
            self.get_v7_sale()
            self.get_v7_daily_report()
        else:
            self.result = {'status': 'fail', 'data': 'Unknown version', 'id': taskid}
        return self.result

    def _request(self, url, method='GET', headers=None, data=None, body=None):
        if not headers:
            headers = self.headers if method == 'GET' else self.post_headers
        kwargs = {"timeout": 30}
        if data:
            kwargs.update({"data": data})
        if body:
            kwargs.update({"json": body})
        try:
            r = self.s.request(
                    method, url, headers=headers, cookies=self.cookies, **kwargs
                    )
        except:
            logging.warning('request error :\n %s', traceback.format_exc())
            return self._request(url, method=method, headers=headers, data=data, body=body)
        update = r.headers.get('set-cookie', None)
        # update cookies
        if update:
            self._cookie(update=update)
        time.sleep(0.05)
        return r

    @log
    def get_v7_order(self):
        path = '/Narnia/Report/ProductsIn.gspx'
        url = urlparse.urljoin(self.domain, path)
        today = datetime.datetime.today()
        endDate = today.strftime('%Y-%m-%d')
        endday = int(time.mktime(time.strptime(endDate, "%Y-%m-%d")) * 1000)
        beginDate = (today - datetime.timedelta(days=730)).strftime('%Y-%m-%d')
        beginday = int(time.mktime(time.strptime(beginDate, "%Y-%m-%d")) * 1000)
        params = '{"mode":"pbuy","reporttype":0,"querytype":0,"StartDate":"\/Date(%s)\/","EndDate":"\/Date(%s)\/","dlytype":[0,1],"pTypeid":null,"eTypeid":null,"kTypeid":null,"bTypeid":null,"saveDate":true,"pId":null,"pfullname":"","bId":null,"bfullname":"","eId":null,"efullname":"","kId":null,"kfullname":"","startDate":"%s","endDate":"%s","filter":1,"leveal":1}' % (beginday, endday, beginDate, endDate)
        r = self._request(url, headers=self.headers, data={'__Params': params})
        pager_id = self.get_pager_id(r.text)
        if not pager_id:
            logging.warning('pager_id not found when crawl: %s', url)
            return
        self.get_v7_order_list(pager_id, beginday, endday)

    @log
    def get_v7_order_list(self, pager_id, st, et, first=0):
        path = '/Carpa.Web.Script.DataService.ajax/GetPagerData'
        url = urlparse.urljoin(self.domain, path)
        body = {
                "pagerId": pager_id,
                "queryParams": None,
                "orders": None,
                "filter": None,
                "first": first,
                "count": 50
                }
        r = self._request(url, method="POST", headers=self.post_headers, body=body)
        info = self.formate_invalid_json(r.text)
        fields = info.get('itemList', {}).get('fields', [])
        if not fields:
            return
        kmap = {
                'itemId': 'pusercode',
                }
        for item in info.get('itemList', {}).get('rows', []):
            data = {k: item[fields.index(v)] for k, v in kmap.items()}
            data['fee'] = 0

            ptypeid = item[fields.index('ptypeid')]
            pfullname = item[fields.index('pfullname')]
            path = '/Narnia/Report/ProductsInDetails.gspx'
            url = urlparse.urljoin(self.domain, path)
            param = '{"mode":"pbuy","pTypeid":"%s","bTypeid":null,"eTypeid":null,"kTypeid":null,"dlytype":[0,1],"StartDate":"\/Date(%s)\/","EndDate":"\/Date(%s)\/","filter":0,"leveal":1,"querytype":0,"reporttype":0,"pfullname":"%s","sonnum":0,"bfullname":"","efullname":"","kfullname":"","isnullflag":"1"}' % (ptypeid, st, et, pfullname)
            r = self._request(url, headers=self.headers, data={'__Params': param})
            pager_id = self.get_pager_id(r.text)
            if not pager_id:
                logging.warning('pager_id not found when crawl: %s, reason: %s', url, r.text)
                return
            self.get_v7_order_detail_list(pager_id, data)

        item_count = info['itemCount']
        first += 50
        if first < item_count and first <= 1000:
            self.get_v7_order_list(pager_id, st, et, first=first)

    @log
    def get_v7_order_detail_list(self, pager_id, data, first=0):
        path = '/Carpa.Web/Carpa.Web.Script.DataService.ajax/GetPagerData'
        url = urlparse.urljoin(self.domain, path)
        body = {
                "pagerId": pager_id,
                "queryParams": None,
                "orders": None,
                "filter": None,
                "first": first,
                "count": 50
                }
        r = self._request(url, method="POST", headers=self.post_headers, body=body)
        info = self.formate_invalid_json(r.text)
        fields = info.get('itemList', {}).get('fields', [])
        if not fields:
            return
        kmap = {
                'docId': 'number',
                'itemName': 'pfullname',
                'cnt': 'backqty',
                'price': 'tpprice',
                'amt': 'tptotal',
                }
        tmp = copy.deepcopy(data)
        for item in info.get('itemList', {}).get('rows', []):
            data.update({k: item[fields.index(v)] for k, v in kmap.items()})
            date = self.formate_time(item[fields.index('billdate')] / 1000)
            data['date'] = date
            data['accountDate'] = date

            # 负数为退货数据
            if data['amt'] > 0:
                self.result['orderDetailList'].append(data)
            else:
                data['cnt'] = item[fields.index('alloutqty')]
                self.result['returnDetailList'].append(data)

        item_count = info['itemCount']
        first += 50
        if first < item_count and first <= 1000:
            self.get_v7_order_detail_list(pager_id, tmp, first=first)

    @log
    def get_v7_sale(self):
        path = '/Narnia/Report/ProductsSale.gspx'
        url = urlparse.urljoin(self.domain, path)
        today = datetime.datetime.today()
        ed = today.strftime('%Y-%m-%d')
        et = int(time.mktime(time.strptime(ed, "%Y-%m-%d")) * 1000)
        sd = (today - datetime.timedelta(days=730)).strftime('%Y-%m-%d')
        st = int(time.mktime(time.strptime(sd, "%Y-%m-%d")) * 1000)
        params = '{"mode":"psale","reporttype":0,"querytype":1,"StartDate":"\/Date(%s)\/","EndDate":"\/Date(%s)\/","dlytype":[0,1],"pTypeid":null,"eTypeid":null,"kTypeid":null,"bTypeid":null,"saveDate":true,"pId":null,"pfullname":"","bId":null,"bfullname":"","eId":null,"efullname":"","kId":null,"kfullname":"","startDate":"%s","endDate":"%s","filter":1,"leveal":1}' % (st, et, sd, ed)
        r = self._request(url, headers=self.headers, data={'__Params': params})
        pager_id = self.get_pager_id(r.text)
        if not pager_id:
            logging.warning('pager_id not found when crawl: %s', url)
            return
        self.get_v7_sale_list(pager_id, st, et)

    @log
    def get_v7_sale_list(self, pager_id, st, et, first=0):
        path = '/Carpa.Web/Carpa.Web.Script.DataService.ajax/GetPagerData'
        url = urlparse.urljoin(self.domain, path)
        body = {
                "pagerId": pager_id,
                "queryParams": None,
                "orders": None,
                "filter": None,
                "first": first,
                "count": 50
                }
        r = self._request(url, method="POST", headers=self.post_headers, body=body)
        info = self.formate_invalid_json(r.text)
        fields = info.get('itemList', {}).get('fields', [])
        if not fields:
            return
        for item in info.get('itemList', {}).get('rows', []):
            ptypeid = item[fields.index('ptypeid')].encode('utf8')
            pfullname = item[fields.index('pfullname')].encode('utf8')
            path = '/Narnia/Report/ProductsSaleDetails.gspx'
            url = urlparse.urljoin(self.domain, path)
            params = '{"mode":"psale","pTypeid":"%s","bTypeid":null,"eTypeid":null,"kTypeid":null,"dlytype":[0,1],"StartDate":"\/Date(%s)\/","EndDate":"\/Date(%s)\/","filter":0,"leveal":1,"querytype":1,"reporttype":0,"pfullname":"%s","sonnum":0,"bfullname":"全部单位","efullname":"全部职员","kfullname":"全部仓库","isnullflag":"1"}' % (ptypeid, st, et, pfullname)
            r = self._request(url, headers=self.headers, data={'__Params': params})
            pager_id = self.get_pager_id(r.text)
            if not pager_id:
                logging.warning('pager_id not found when crawl: %s, reason: %s', url, r.text)
                return
            self.get_v7_sale_detail_list(pager_id)

        item_count = info['itemCount']
        first += 50
        if first < item_count and first <= 1000:
            self.get_v7_sale_list(pager_id, st, et, first=first)

    @log
    def get_v7_sale_detail_list(self, pager_id, first=0):
        path = '/Carpa.Web/Carpa.Web.Script.DataService.ajax/GetPagerData'
        url = urlparse.urljoin(self.domain, path)
        body = {
                "pagerId": pager_id,
                "queryParams": None,
                "orders": None,
                "filter": None,
                "first": first,
                "count": 50
                }
        r = self._request(url, method="POST", headers=self.post_headers, body=body)
        info = self.formate_invalid_json(r.text)
        fields = info.get('itemList', {}).get('fields', [])
        if not fields:
            return
        kmap = {
                'docId': 'number',
                'itemId': 'pusercode',
                'itemName': 'pfullname',
                'uint': 'backqty',
                'cnt': 'alloutqty',
                'prePrice': 'tpprice',
                'taxedPrice': 'tpprice',
                'price': 'tpprice',
                'preAmt': 'tptotal',
                'amt': 'tptotal',
                'taxedAmt': 'tptotal',
                }
        for item in info.get('itemList', {}).get('rows', []):
            data = {k: item[fields.index(v)] for k, v in kmap.items()}
            data['ratio'] = 1
            date = self.formate_time(item[fields.index('billdate')] / 1000)
            data['accountDate'] = data['date'] = date

            if data['amt'] > 0:
                self.result['saleDetailList'].append(data)
            else:
                data['cnt'] = item[fields.index('alloutqty')]
                self.result['saleReturnDetailList'].append(data)

        item_count = info['itemCount']
        first += 50
        if first < item_count and first <= 1000:
            self.get_v7_sale_detail_list(pager_id, first=first)

    @log
    def get_v7_daily_report(self):
        path = '/Narnia/Assistant/BusinessDailyReports.gspx?beginDate=2018-01-08&endDate=2018-01-08'
        url = urlparse.urljoin(self.domain, path)
        _ = self._request(url, headers=self.headers)
        today = datetime.datetime.today()
        for i in range(0, 730):
            qd = (today - datetime.timedelta(days=i)).strftime('%Y-%m-%d')
            self.get_v7_daily_report_list(qd)

    @log
    def get_v7_daily_report_list(self, qd):
        path = '/Narnia/Narnia.Assistant.BusinessDailyReports.ajax/GetDataSource'
        url = urlparse.urljoin(self.domain, path)
        body = {'reportDate': qd}
        r = self._request(url, method="POST", headers=self.post_headers, body=body)
        info = self.formate_invalid_json(r.text)
        report = {
                'date': info['reportDate'],
                'gmv': info['income'],
                'cost': info['cost'],
                'profit': info['Grossprofit'],
                'profitRate': info['GrossprofitRate'],
                'fee': info['fees'],
                'receiveAmt': info['acceptmoney'],
                'sendCnt': info['sendqty'],
                'getCnt': info['acceptqty']
                }
        order = {
                'date': info['reportDate'],
                'stockOrderCnt': info['stockordercount'],
                'stockOrderAmt': info['stockordermoney'],
                'unCompleteOrderAmt': info['stockorderresiduemoney'],
                'stockCnt': info['stockcount'],
                'stockAmt': info['stockmoney'],
                'returnCnt': info['stockbackcount'],
                'returnAmt': info['stockbackmoney'],
                'changeCnt': info['stockchangecount'],
                'changeAmt': info['stockchangemoney'],
                }
        sale = {
                'date': info['reportDate'],
                'sellOrderCnt': info['salesordercount'],
                'sellOrderAmt': info['salesordermoney'],
                'unCompleteOrderAmt': info['salesorderresiduemoney'],
                'sellCnt': info['salescount'],
                'sellAmt': info['salesmoney'],
                'returnCnt': info['salesbackcount'],
                'returnAmt': info['salesbackmoney'],
                'changeCnt': info['saleschangecount'],
                'changeAmt': info['saleschangemoney'],
                }
        pay = {
                'date': info['reportDate'],
                'payOrderAmt': info['paidmoney'],
                'receiveOrderAmt': info['acceptmoney'],
                'receiveAmtAdd': info['paymoneyadd'],
                'receiveAmtMinue': info['acceptmoneydecrease'],
                'payAmtAdd': info['paymoneyadd'],
                'payAmtMinue': info['paymoneydecrease']
                }
        self.result['dailyReport'].append({'report': report, 'order': order, 'sale': sale, 'pay': pay})

    @log
    def get_balance_sheet(self):
        path = '/Beefun/Report/BalanceSheet.gspx'
        url = urlparse.urljoin(self.domain, path)
        r = self._request(url)
        pager_id = self.get_pager_id(r.text)
        if not pager_id:
            logging.warning('pager_id not found when crawl: %s', url)
            return
        self.get_balance_sheet_list(pager_id)

    @log
    def get_balance_sheet_list(self, pager_id, first=0):
        path = '/Carpa.Web/Carpa.Web.Script.DataService.ajax/GetPagerData'
        url = urlparse.urljoin(self.domain, path)
        body = {
                "pagerId": pager_id,
                "queryParams": None,
                "orders": None,
                "filter": None,
                "first": first,
                "count": 50
                }
        r = self._request(url, method="POST", body=body)
        info = self.formate_invalid_json(r.text)
        fields = info.get('itemList', {}).get('fields', [])
        if not fields:
            return
        kmap = {
                'capName': 'zcfullname',
                'endDateCap': 'zctotal',
                'debtAndRight': 'fzfullname',
                'endDateDebt': 'fztotal'
                }
        for item in info['itemList']['rows']:
            data = {k: item[fields.index(v)] for k, v in kmap.items()}
            self.result['balanceSheet'].append(data)

            zcid = item[fields.index('zcid')]
            capname = item[fields.index('zcfullname')]
            self.get_balance_sheet_detail(zcid, capname)

        item_count = info['itemCount']
        first += 50
        if first < item_count and first <= 1000:
            self.get_balance_sheet_list(pager_id, first)

    @log
    def get_balance_sheet_detail(self, zcid, capname):
        today = datetime.datetime.today()
        endDate = today.strftime('%Y-%m-%d')
        beginDate = (today - datetime.timedelta(days=1460)).strftime('%Y-%m-%d')
        path = '/Beefun/Report/AtypeAccountDetail.gspx?id={}&mode=asset&beginDate={}&endDate={}'
        url = urlparse.urljoin(self.domain, path)
        url = url.format(zcid, beginDate, endDate)
        r = self._request(url)
        pager_id = self.get_pager_id(r.text)
        if not pager_id:
            logging.warning('pager_id not found when crawl: %s', url)
            return
        self.get_balance_sheet_detail_list(pager_id, capname)

    @log
    def get_balance_sheet_detail_list(self, pager_id, capname, first=0):
        path = '/Carpa.Web/Carpa.Web.Script.DataService.ajax/GetPagerData'
        url = urlparse.urljoin(self.domain, path)
        body = {
                "pagerId": pager_id,
                "queryParams": None,
                "orders": None,
                "filter": None,
                "first": first,
                "count": 50
                }
        r = self._request(url, method='POST', body=body)
        info = self.formate_invalid_json(r.text)
        fields = info.get('itemList', {}).get('fields', [])
        if not fields:
            return
        kmap = {
                'docId': 'number',
                'docType': 'vchtype',
                'abstract': 'summary',
                'transParty': 'btypename',
                'addAmt': 'addcol',
                'minusAmt': 'deccol',
                'leftAmt': 'total'
                }
        for item in info['itemList']['rows']:
            data = {k: item[fields.index(v)] for k, v in kmap.items()}
            data['catName'] = capname
            data['date'] = item[fields.index('date')] + ' 00:00:00'
            self.result['balanceSheelDetail'].append(data)

        item_count = info['itemCount']
        first += 50
        if first < item_count and first <= 1000:
            self.get_balance_sheet_detail_list(pager_id, capname, first=first)

    @log
    def get_business_history(self):
        path = '/Beefun/Assistant/BusinessHistory.gspx'
        url = urlparse.urljoin(self.domain, path)
        r = self._request(url)
        pager_id = self.get_pager_id(r.text)
        if not pager_id:
            return
        types = (
                ('34', '进货入库单'),
                ('6', '进货退货单'),
                ('11', '销售出库单'),
                ('142', '销售退货单'),
                )
        for vchtype, vchfullname in types:
            self.get_order(pager_id, vchtype, vchfullname)

    @log
    def get_order(self, pager_id, vchtype, vchfullname, first=0):
        today = datetime.datetime.today()
        endDate = today.strftime('%Y-%m-%d')
        endday = int(time.mktime(time.strptime(endDate, "%Y-%m-%d")) * 1000)
        beginDate = (today - datetime.timedelta(days=550)).strftime('%Y-%m-%d')
        beginday = int(time.mktime(time.strptime(beginDate, "%Y-%m-%d")) * 1000)
        path = '/Carpa.Web/Carpa.Web.Script.DataService.ajax/GetPagerData'
        url = urlparse.urljoin(self.domain, path)
        body = {
                "pagerId": pager_id,
                "queryParams": {
                    "configid": 0,
                    "vchtype": vchtype,
                    "vchfullname": vchfullname,
                    "btypeid": None,
                    "bfullname": "",
                    "etypeid": None,
                    "efullname": "",
                    "ptypeid": None,
                    "pfullname": "",
                    "stockid": None,
                    "kfullname": "",
                    "atypeid": None,
                    "afullname": "",
                    "vchCode": "",
                    "summary": "",
                    "comment": "",
                    "detailscomment": "",
                    "pricetype": "0",
                    "ptypeprice": 0,
                    "discounttype": "0",
                    "discountprice": 0,
                    "beginDate": beginDate,
                    "endDate": endDate,
                    "begin": "/Date({})/".format(beginday),
                    "end": "/Date({})/".format(endday),
                    "saveDate": False,
                    "redwordType": 0,
                    "dlyType": 0
                    },
                "orders": None,
                "filter": None,
                "first": first,
                "count": 50
                }
        r = self._request(url, method="POST", body=body)
        info = self.formate_invalid_json(r.text)
        kmap = {
                'docId': 'number',
                'docType': 'vchtype',
                'docAmt': 'total',
                'createPerson': 'efullname',
                'transParty': 'btypename',
                'warehouse': 'kfullname',
                'busType': 'dlytype',
                'accountDate': 'overtime'
                }
        for item in info.get('itemList', []):
            data = {k: item[v] for k, v in kmap.iteritems()}
            data['date'] = item['date'] + ' 00:00:00'
            vchcode = item['vchcode']
            docid = item['number']

            if vchtype == '34':
                self.result['orderList'].append(data)
                self.get_order_detail(vchtype, vchcode, docid, data['date'], data['accountDate'])
            elif vchtype == '6':
                self.result['returnList'].append(data)
                self.get_order_detail(vchtype, vchcode, docid, data['date'], data['accountDate'])

            elif vchtype == '11':
                self.result['saleList'].append(data)
                self.get_sale_detail(vchtype, vchcode, docid, data['date'], data['accountDate'])
            elif vchtype == '142':
                self.result['saleReturnList'].append(data)
                self.get_sale_detail(vchtype, vchcode, docid, data['date'], data['accountDate'])

        item_count = info['itemCount']
        first += 50
        if first < item_count and first <= 1000:
            self.get_order(pager_id, vchtype, vchfullname, first=first)

    @log
    def get_sale_detail(self, vchtype, vchcode, docid, date, accountDate):
        path = '/Beefun/Bill/BillGateway.gspx?Vchtype={}&Vchcode={}&Mode=Read'
        url = urlparse.urljoin(self.domain, path)
        url = url.format(vchtype, vchcode)
        r = self._request(url)
        infos = re.findall("""form.dataBind\(\\'(.*)\\'\)""", r.text)[0]
        infos = self.formate_invalid_json(infos)
        kmap = {
                'itemId': 'ptypecode',
                'itemName': 'pfullname',
                'unit': 'ptypeunit',
                'cnt': 'qty',
                'prePrice': 'dpprice',
                'preAmt': 'dptotal',
                'ratio': 'discount',
                'price': 'price',
                'amt': 'total',
                'taxedPrice': 'tpprice',
                'taxedAmt': 'tptotal',
            }
        for item in infos.get('details', []):
            data = {k: item[v] for k, v in kmap.iteritems()}
            data['docId'] = docid
            data['date'] = date
            data['accountDate'] = accountDate
            if vchtype == '11':
                self.result['saleDetailList'].append(data)
            elif vchtype == '142':
                self.result['saleReturnDetailList'].append(data)

    @log
    def get_order_detail(self, vchtype, vchcode, docid, date, accountDate):
        path = '/Beefun/Bill/StockBill.gspx?Vchtype={}&Vchcode={}&Mode=Read'
        url = urlparse.urljoin(self.domain, path)
        url = url.format(vchtype, vchcode)
        r = self._request(url)
        infos = re.findall("""form.dataBind\(\\'(.*)\\'\)""", r.text)[0]
        infos = self.formate_invalid_json(infos)

        kmap = {
                'itemId': 'ptypecode',
                'itemName': 'pfullname',
                'cnt': 'qty',
                'price': 'price',
                'amt': 'total',
                'fee': 'costshare'
            }
        for item in infos.get('details', []):
            data = {k: item[v] for k, v in kmap.iteritems()}
            data['docId'] = docid
            data['date'] = date
            data['accountDate'] = accountDate
            if vchtype == '34':
                self.result['orderDetailList'].append(data)
            elif vchtype == '6':
                self.result['returnDetailList'].append(data)

    @log
    def sale_year_report(self):
        path = '/Beefun/Report/SaleYearReport.gspx'
        url = urlparse.urljoin(self.domain, path)
        data = {
                '__Params': '{"btypeid":null,"bfullname":"","etypeid":null,"efullname":"","ktypeid":null,"kfullname":""}'
                }
        r = self._request(url, method="POST", data=data)
        pager_id = self.get_pager_id(r.text)
        if not pager_id:
            logging.warning('pager_id not found when crawl: %s', url)
            return
        self.get_sale_year_report(pager_id)

    @log
    def get_sale_year_report(self, pager_id, first=0):
        path = '/Carpa.Web/Carpa.Web.Script.DataService.ajax/GetPagerData'
        url = urlparse.urljoin(self.domain, path)
        body = {
                "pagerId": pager_id,
                "queryParams": None,
                "orders": None,
                "filter": None,
                "first": first,
                "count": 50
                }
        r = self._request(url, method='POST', body=body)
        info = self.formate_invalid_json(r.text)
        fields = info.get('itemList', {}).get('fields', [])
        if not fields:
            return
        kmap = {
                'backAmt': 'hktotal',
                'gmv': 'xstotal',
                'cost': 'cbtotal',
                'profit': 'gaintotal',
                'fee': 'fytotal',
                'pay': 'fktotal',
                'profitRate': 'gainrate'
                }
        for item in info.get('itemList', {}).get('rows', []):
            data = {k: item[fields.index(v)] for k, v in kmap.iteritems()}
            month = item[fields.index('month1')]
            data['month'] = '-'.join(re.findall('\d+', month)[:2])

            self.result['saleYearReport'].append(data)

        item_count = info['itemCount']
        first += 50
        if first < item_count and first <= 1000:
            self.get_bills_list(pager_id, first=first)

    def _cookie(self, update=None):
        if update:
            self.cookies.update(dict([update.split(';')[0].split('=')]))
            return
        with open(self.cookie_path, 'r') as f:
            info = json.load(f)
            cookies = json.loads(info['cookies'])
            self.cookies = {c['Name']: c['Value'] for c in cookies['wsgjp.com.cn'].values()}
            self.result['username'] = info['username']
            self.domain = 'http://{}'.format(info['version'])
            self.get_version()
            self.result['version'] = self.version

    def formate_invalid_json(self, data):
        """将Json中的`new Date(int)`替换为int."""
        logging.info(self.taskid + " start to formate_invalid_json")
        data = re.sub('new Date\((.*?)\)', r'\1', data)
        data = json.loads(data)
        return data

    def formate_time(self, timestamp):
        return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(timestamp))

    def get_pager_id(self, text):
        pager_ids = re.findall(r'id="(.*?)"', text)
        pager_ids = filter(lambda x: 'grid_pager1' in x, pager_ids)
        if not pager_ids:
            return None
        return pager_ids[0]

    @log
    def get_version(self):
        version_api = '{}/Assistant/VersionInfo.gspx'.format(self.domain)
        r = self._request(version_api)
        try:
            version_info = re.findall('\"dataSource\":(.*),\"lazy', r.text)[0]
        except:
            version_info = re.findall('\"dataSource\":(.*),\"design', r.text)[0]
        info = self.formate_invalid_json(version_info)
        for x in info:
            if x['Title'] == u'管家婆云ERP':
                self.version = x['VersionNo']
            elif x['Title'].startswith(u'云ERP'):
                self.version = x['VersionNo']

    @property
    def headers(self):
        return {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
            "X-CarpaAjax": "Delta=true,ClientHeight=609,ClientWidth=1412,WindowWidth=1440,WindowHeight=739",
            "Referer": "{}/Main.gspx".format(self.domain),
            "Accept": "*/*"
            }

    @property
    def post_headers(self):
        return {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
            "Content-Type": "application/json; charset=UTF-8",
            "Referer": "{}/Main.gspx".format(self.domain),
            "Accept": "*/*",
            "Accept-Encoding": "gzip,deflate",
            "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6"
            }


def sendmail(body):
    sender = 'std-exception@bdp.yixin.com'
    revs = ['kangwang22@creditease.cn', 'weili105@creditease.cn', 'chengbofu@creditease.cn', 'cbdic.std.pm.list@creditease.cn']

    message = MIMEText(body, 'plain', 'utf-8')
    message['From'] = Header('std-exception@bdp.yixin.com', 'utf-8')
    message['to'] = Header(','.join(revs), 'utf-8')

    message['Subject'] = Header('管家婆爬虫抓取失败', 'utf-8')

    smtpobj = smtplib.SMTP('mail.bdp.idc', port=25)
    smtpobj.sendmail(sender, revs, message.as_string())


if __name__ == "__main__":
    try:
        file_path = sys.argv[1]
        taskid = file_path.split('/')[-2]
        logging.info('start crawl %s', taskid)
        spider = GjpSpider(file_path, taskid)
        result = spider.run()
        logging.info('crawl %s success!', taskid)
    except:
        logging.warning('Crawl Error!\n%s', traceback.format_exc())
        result = {'status': 'fail', 'data': '抓取失败', 'id': taskid}
        sendmail(taskid + ':\n' + traceback.format_exc())
    sys.stdout.write(json.dumps(result))
    # with open('test.json', 'w') as f:
    #     json.dump(result, f, indent=2)
