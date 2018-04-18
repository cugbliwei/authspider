source ~/.bash_profile

date=`date --date="1 hour ago" "+%Y%m%d%H"`
year=`date --date="1 hour ago" "+%Y"`
hdfs dfs -text /user/yisou/crawler/baidu_news_search/${date}/dn1* | grep baidu_news_search_${year} | grep ExtractorInfo.json > data.txt

python baidu_mysql.py >> baidu_mysql.log

true > data.txt

curl "http://authcrawler.yixin.com/submit?tmpl=baidu_news_search&link=http%3A%2F%2Fnews.baidu.com%2Fns%3Fword%3D%E6%8A%95%E8%B5%84%E4%BA%8B%E4%BB%B6%26tn%3Dnews&key=投资事件&type=投资事件&priority=10&table=object"
curl "http://authcrawler.yixin.com/submit?tmpl=baidu_news_search&link=http%3A%2F%2Fnews.baidu.com%2Fns%3Fword%3D%E6%8A%95%E8%B5%84%E4%BA%8B%E4%BB%B6%26pn%3D10%26tn%3Dnews&key=投资事件&type=投资事件&priority=10&table=object"
curl "http://authcrawler.yixin.com/submit?tmpl=baidu_news_search&link=http%3A%2F%2Fnews.baidu.com%2Fns%3Fword%3D%E6%8A%95%E8%B5%84%E4%BA%8B%E4%BB%B6%26pn%3D20%26tn%3Dnews&key=投资事件&type=投资事件&priority=10&table=object"

curl "http://authcrawler.yixin.com/submit?tmpl=baidu_news_search&link=http%3A%2F%2Fnews.baidu.com%2Fns%3Fword%3D%E8%9E%8D%E8%B5%84%E4%BA%8B%E4%BB%B6%26tn%3Dnews&key=融资事件&type=融资事件&priority=10&table=object"
curl "http://authcrawler.yixin.com/submit?tmpl=baidu_news_search&link=http%3A%2F%2Fnews.baidu.com%2Fns%3Fword%3D%E8%9E%8D%E8%B5%84%E4%BA%8B%E4%BB%B6%26pn%3D10%26tn%3Dnews&key=融资事件&type=融资事件&priority=10&table=object"
curl "http://authcrawler.yixin.com/submit?tmpl=baidu_news_search&link=http%3A%2F%2Fnews.baidu.com%2Fns%3Fword%3D%E8%9E%8D%E8%B5%84%E4%BA%8B%E4%BB%B6%26pn%3D20%26tn%3Dnews&key=融资事件&type=融资事件&priority=10&table=object"
