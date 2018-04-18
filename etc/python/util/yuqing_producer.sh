source ~/.bash_profile

python kafka_baidu_yuqing.py >> baidu_news_search_kafka.log
python kafka_baidu_now.py >> baidu_news_search_kafka.log
