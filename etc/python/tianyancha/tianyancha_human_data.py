# coding: UTF-8
import json
import fileinput
import time
import sys
reload(sys)
sys.setdefaultencoding('utf8')


result = []
for line in fileinput.input('human.txt'):
    try:
        lines = line.strip().split('\t')
        if len(lines) < 5:
            continue
    
        insert = []
        exists = {}
        data = json.loads(lines[4])
        if u"所有商业角色" not in data and u"所有商业角色1" not in data:
            continue

        no1 = data[u"所有商业角色"]
        del data[u"所有商业角色"]
        no2 = data[u"所有商业角色1"]
        del data[u"所有商业角色1"]
        tmp = []
        role = ""
        for i, val in enumerate(no1):
            if u"企业id" in val and val[u"企业id"] is not None:
                role = val[u"角色"]
                tmp.append(val)
            else:
                v = no2[i]
                v[u"角色"] = role
                tmp.append(v)
        data[u"所有商业角色"] = tmp
        result.append(data)

    except Exception, e:
        print e

fp = file('human.json', 'w')
json.dump(result, fp, ensure_ascii=False, indent=4)
fp.close()
