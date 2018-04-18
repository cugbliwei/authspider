source ~/.bash_profile

date=`date --date="1 hour ago" "+%Y%m%d%H"`
year=`date --date="1 hour ago" "+%Y"`
hdfs dfs -text /user/yisou/crawler/tianyancha/${date}/dn1* | grep tianyancha_${year} | grep ExtractorInfo.json > insurance_data.txt

python insurance_mysql.py > insurance_mysql.log 2>&1

true > insurance_data.txt