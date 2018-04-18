# coding: UTF-8
import time
import json
import mysql.connector
import sys
reload(sys)
sys.setdefaultencoding('utf8')


def getMysqlConn():
    config = {
        'user': 'platform',
        'password': 'platformMojiti',
        'host': '10.130.0.144',
        'port': 3329,
        'database': 'platform'
    }
    conn = mysql.connector.connect(**config)
    return conn

def getFundMysqlConn():
    config = {
        'user': 'fund_w',
        'password': 'RJ7mRYG0',
        'host': '10.130.0.114',
        'port': 3314,
        'database': 'fund_release'
    }
    conn = mysql.connector.connect(**config)
    return conn

def getMonitorMysqlConn():
    config = {
        'user': 'fund_w',
        'password': 'RJ7mRYG0',
        'host': '10.130.0.114',
        'port': 3314,
        'database': 'fund_prod'
    }
    conn = mysql.connector.connect(**config)
    return conn

def selectFromTable(sql):
    conn = getMysqlConn()
    cur = conn.cursor()
    cur.execute(sql)
    result = cur.fetchall()
    conn.commit()
    cur.close()
    conn.close()
    return result

def selectFromFundTable(sql):
    conn = getFundMysqlConn()
    cur = conn.cursor()
    cur.execute(sql)
    result = cur.fetchall()
    conn.commit()
    cur.close()
    conn.close()
    return result

def selectFromMonitorTable(sql):
    conn = getMonitorMysqlConn()
    cur = conn.cursor()
    cur.execute(sql)
    result = cur.fetchall()
    conn.commit()
    cur.close()
    conn.close()
    return result

def executeFromMonitorTable(sql):
    conn = getMonitorMysqlConn()
    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()

def executeFromFundTable(sql):
    conn = getFundMysqlConn()
    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()

def insert(executes):
    if len(executes) == 0:
        return

    conn = getMysqlConn()
    cur = conn.cursor()
    for sql in executes:
        cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()

def existFromTable(sql):
    if len(sql) == 0:
        return False

    conn = getMysqlConn()
    cur = conn.cursor()
    cur.execute(sql)
    result = cur.fetchall()
    conn.commit()
    cur.close()
    conn.close()
    if len(result) > 0:
        return True
    return False

def executeFromTable(sql):
    conn = getMysqlConn()
    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()

