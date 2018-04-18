# coding: UTF-8
import time
import json
from kafka import KafkaProducer
from kafka.errors import KafkaError
import sys
reload(sys)
sys.setdefaultencoding('utf8')


def produce(data):
    if len(data) == 0:
        return

    try:
        producer = KafkaProducer(bootstrap_servers=['10.130.64.46:9092', '10.130.64.47:9092', '10.130.64.48:9092'])
        for d in data:
            producer.send(d['topic'], key='params', value=d['value'], partition=d['partition'])
        producer.flush()
    except KafkaError as e:
        print e
    return
