source ~/.bash_profile

date=`date --date="1 hour ago" "+%Y%m%d%H"`
year=`date --date="1 hour ago" "+%Y"`
hdfs dfs -text /user/yisou/crawler/tianyancha/${date}/dn1* | grep tianyancha_${year} | grep ExtractorInfo.json > data.txt

python tianyancha_mysql.py >> tianyancha_mysql.log
python upload.py

hdfs dfs -mkdir /user/yisou/weili105/tianyancha/${date}
hdfs dfs -put data.json /user/yisou/weili105/tianyancha/${date}/data.json

python person.py >> person.log


true > data.txt
true > data.json



hdfs dfs -text /user/yisou/crawler/tianyancha_human/${date}/dn1* | grep tianyancha_human_${year} | grep ExtractorInfo.json > human.txt

python tianyancha_human_data.py

hdfs dfs -mkdir -p /user/yisou/weili105/tianyancha_human/${date}
hdfs dfs -put human.json /user/yisou/weili105/tianyancha_human/${date}/data.json

true > human.txt
true > human.json
