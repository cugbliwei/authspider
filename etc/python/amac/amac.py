#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import time
import logging

logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
        datefmt='%a, %d %b %Y %H:%M:%S',
        )


def get_page():
    url = "http://gs.amac.org.cn/amac-infodisc/api/pof/fund?rand=0.5941409075181603&page=0&size=20"
    headers = dict((
            ('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'),
            ('Content-Type', 'application/json'),
            ('Referer', 'http://gs.amac.org.cn/amac-infodisc/res/pof/fund/index.html')
            ))
    data = {}
    r = requests.post(
        url=url,
        headers=headers,
        json=data,
        timeout=10
    )
    total_page = r.json().get('totalPages')
    return total_page

if __name__ == "__main__":
    total_page = get_page()
    logging.info('total page: %s', total_page)
    for i in range(total_page):
        link = 'http://authcrawler.yixin.com/submit?tmpl=amac&page_idx={}'.format(i)
        with requests.Session() as s:
            s.get(link)
            logging.info('get link: %d', i)
        time.sleep(10)

