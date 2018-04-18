source ~/.bash_profile

date=`date --date="1 hour ago" "+%Y%m%d%H"`
year=`date --date="1 hour ago" "+%Y"`
#hdfs dfs -text /user/yisou/crawler/itjuzi_investfirm/${date}/dn1* | grep itjuzi_investfirm_${year} | grep ExtractorInfo.json > data.txt

#python itjuzi_investfirm_mysql.py >> itjuzi_mysql.log

hdfs dfs -text /user/yisou/crawler/itjuzi_investevents_increment/${date}/dn1* | grep itjuzi_investevents_increment_${year} | grep ExtractorInfo.json > data.txt

python itjuzi_investevents_increment_mysql.py >> itjuzi_mysql.log
curl "http://authcrawler.yixin.com/submit?tmpl=itjuzi_investevents_increment"

true > data.txt

hdfs dfs -text /user/yisou/crawler/itjuzi_company_increment/${date}/dn1* | grep itjuzi_company_increment_${year} | grep ExtractorInfo.json > data.txt

python itjuzi_company_increment_mysql.py >> itjuzi_mysql.log
curl "http://authcrawler.yixin.com/submit?tmpl=itjuzi_company_increment"

true > data.txt