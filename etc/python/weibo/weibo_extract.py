#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re
import time
import logging
import traceback
import json
import sys
import requests
import random

from lxml import etree

reload(sys)
sys.setdefaultencoding('utf8')


logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
        datefmt='%a, %d %b %Y %H:%M:%S',
        )

user_agent_list = [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.134 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.104 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.140 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_{}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36',
        ]


def extract_html(body_path):
    with open(body_path, 'r') as f:
        info = json.load(f)
        table = info['table']
        search_key = info['search_key']
        content1 = info['content_1']
        content2 = info['content_2']
        contents = [content1, content2]
    results = {}
    results['result'] = []
    search_page = 1
    for content in contents:
        content_pattern = re.compile(r'"pl_weibo_direct".*"html":"(.*)"}\)</script>')
        html = content_pattern.search(content).group(1)
        html = html.encode("utf-8").decode('unicode_escape').encode("utf-8").replace("\\", "")
        page = etree.HTML(html.decode('utf-8'))
        weibo_list = page.xpath('//div[@class="WB_cardwrap S_bg2 clearfix"]')
        for weibo in weibo_list:
            try:
                result = {}
                result['table'] = table
                result['search_key'] = search_key
                result['page'] = str(search_page)
                try:
                    source = weibo.xpath('.//div[@class="content clearfix"]/div[@class="feed_from W_textb"]/a[2]/text()')[0]
                except:
                    source = ''
                result['source'] = source
                timestamp = weibo.xpath('.//div[@class="content clearfix"]/div[@class="feed_from W_textb"]/a/@date')[0]
                time_local = time.localtime(float(timestamp[:-3]))
                publish_time = time.strftime("%Y-%m-%d %H:%M:%S", time_local)
                result['publish_time'] = publish_time
                id_card = weibo.xpath('.//div[@class="feed_content wbcon"]/a[@class="W_texta W_fb"]/@usercard')[0]
                user_id = re.search(r'id=(\d+)&', id_card).group(1)
                result['user_id'] = user_id
                like = weibo.xpath('.//div[@class="feed_action clearfix"]/ul/li[4]//em/text()')
                like = "".join(like)
                if like == "":
                    like = '0'
                result['like'] = like
                content = ''
                action_data = weibo.xpath('.//div[@class="feed_content wbcon"]/p/a[contains(@class,"WB_text_opt")]/@action-data')
                if action_data != []:
                    action_url = 'http://s.weibo.com/ajax/direct/morethan140?' + action_data[0]
                    user_agent = random.choice(user_agent_list)
                    user_agent = user_agent.format(random.randint(2, 6))
                    headers = {
                        "User-Agent": user_agent
                    }
                    action_content = requests.get(action_url, headers=headers).json()
                    action_html = action_content['data']['html']
                    action_page = etree.HTML(action_html.decode('utf-8'))
                    content = action_page.xpath('string(.)')
                else:
                    content_list = weibo.xpath('.//div[@class="feed_content wbcon"]/p//text()')
                    for temp in content_list:
                        content += temp.strip()
                result['content'] = content
                forword = weibo.xpath('.//div[@class="feed_action clearfix"]/ul/li[2]//em/text()')
                forword = "".join(forword)
                if forword == "":
                    forword = '0'
                result['forword'] = forword
                content_id = weibo.xpath('./div/@mid')[0]
                result['content_id'] = content_id
                user_name = weibo.xpath('.//div[@class="feed_content wbcon"]/a[@class="W_texta W_fb"]/@nick-name')[0]
                result['user_name'] = user_name
                no_comments = weibo.xpath('.//div[@class="feed_action clearfix"]/ul/li[3]//em/text()')
                no_comments = "".join(no_comments)
                if no_comments == "":
                    no_comments = '0'
                result['no_comments'] = no_comments
                results['result'].append(result)
            except:
                logging.warning(traceback.format_exc())
        search_page += 1

    return results


if __name__ == "__main__":
    try:
        body_path = sys.argv[1]
        logging.info('get content: %s', body_path)
        results = extract_html(body_path)
    except:
        logging.warning('Crawl Error!\n%s', traceback.format_exc())
        results = {'status': 'fail', 'data': '解析失败'}
    sys.stdout.write(json.dumps(results))