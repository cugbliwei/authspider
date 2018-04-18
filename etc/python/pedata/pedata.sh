source ~/.bash_profile

date=`date --date="1 hour ago" "+%Y%m%d%H"`
year=`date --date="1 hour ago" "+%Y"`
hdfs dfs -text /user/yisou/crawler/pedata_search/${date}/dn1* | grep pedata_search_${year} | grep ExtractorInfo.json > data.txt

python pedata_mysql.py >> pedata_mysql.log

true > data.txt