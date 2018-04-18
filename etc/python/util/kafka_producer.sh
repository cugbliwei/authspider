source ~/.bash_profile

python kafka_producer.py tianyancha 10000 0 >> tianyancha_kafka.log

python kafka_baidu.py baidu_news_search 10000 1 >> baidu_news_search_kafka.log
python kafka_priority.py baidu_news 10000 2 10 >> baidu_news_kafka.log
python kafka_producer.py baidu_news 10000 2 >> baidu_news_kafka.log

#python kafka_producer.py pedata_search 10000 2 >> pedata_kafka.log
#python kafka_producer.py pedata_ep 10000 2 >> pedata_kafka.log
#python kafka_producer.py pedata_org 10000 2 >> pedata_kafka.log
#python kafka_producer.py pedata_invest 10000 2 >> pedata_kafka.log
#python kafka_producer.py pedata_exit 10000 2 >> pedata_kafka.log
#python kafka_producer.py pedata_fund 10000 2 >> pedata_kafka.log
#python kafka_producer.py pedata_person 10000 2 >> pedata_kafka.log

python kafka_producer.py itjuzi_investfirm 10000 1 >> itjuzi_kafka.log
#python kafka_producer.py itjuzi_gp 10000 1 >> itjuzi_kafka.log
#python kafka_producer.py itjuzi_investevents 10000 1 >> itjuzi_kafka.log
#python kafka_producer.py itjuzi_person 10000 1 >> itjuzi_kafka.log
#python kafka_producer.py itjuzi_company 10000 1 >> itjuzi_kafka.log

python kafka_producer.py weixin 200000 2 >> weixin_kafka.log
