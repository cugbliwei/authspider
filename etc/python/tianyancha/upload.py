# coding: UTF-8
import json
import time
import sys
import fileinput
from urllib import quote
reload(sys)
sys.setdefaultencoding('utf8')


def _in(x, y):
    if not y:
        return False
    if x in y:
        return True
    return False
all = []
for line in fileinput.input('data.txt'):
    try:
        lines = line.strip().split('\t')
        if len(lines) < 5:
            continue

        data = json.loads(lines[4])
        if u"行政处罚类型" in data and _in(u"信用中国", data[u"行政处罚类型"]):
            if u"经营风险" in data and _in(u"行政处罚", data[u"经营风险"]) and _in(u"行政处罚-信用中国", data[u"经营风险"]):
                data[u"经营风险"][u"行政处罚"] = data[u"经营风险"][u"行政处罚-信用中国"]
        if u"经营风险" in data and _in(u"行政处罚", data[u"经营风险"]) and len(data[u"经营风险"][u"行政处罚"]) > 0:
            if _in(u"类型", data[u"经营风险"][u"行政处罚"][0]) and _in("areaName", data[u"经营风险"][u"行政处罚"][0][u"类型"]):
                data[u"经营风险"][u"行政处罚"] = data[u"经营风险"][u"行政处罚-信用中国"]
        all.append(data)

    except Exception, e:
        print e

fp = file('data.json', 'w')
json.dump(all, fp, ensure_ascii=False, indent=4)
fp.close()
