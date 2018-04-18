package sql

import (
	"database/sql"

	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/dlog"
	_ "github.com/go-sql-driver/mysql"
)

var Mysql *sql.DB

func init() {
	if !config.Instance.OnLine {
		return
	}

	var err error
	host := config.Instance.Mysql.Username + ":" + config.Instance.Mysql.Password + "@tcp(" + config.Instance.Mysql.Host + ")/" + config.Instance.Mysql.Database
	Mysql, err = sql.Open("mysql", host)
	if err != nil {
		dlog.Error("open mysql error: %v", err)
		return
	}

	Mysql.SetMaxOpenConns(1000)
	Mysql.SetMaxIdleConns(500)
	if err = Mysql.Ping(); err != nil {
		dlog.Error("ping mysql error: %v", err)
	}
}

func HandleMysqlTable(prepare string, params []interface{}) int64 {
	stmt, err := Mysql.Prepare(prepare)
	if err != nil {
		dlog.Error("mysql prepare error: %v", err)
		return -1
	}
	defer stmt.Close()

	ret, err := stmt.Exec(params...)
	if err != nil {
		dlog.Warn("mysql exec error: %v", err)
		return -1
	}
	aid, err := ret.LastInsertId()
	if err != nil {
		dlog.Error("mysql get last insert id error: %v", err)
		return -1
	}
	return aid
}

func SelectFromCrawledTable(query string, params []interface{}) []map[string]string {
	rows, _ := Mysql.Query(query, params...)
	column, _ := rows.Columns()
	values := make([][]byte, len(column))
	scans := make([]interface{}, len(column))
	for i := range values {
		scans[i] = &values[i]
	}
	results := []map[string]string{}
	for rows.Next() {
		if err := rows.Scan(scans...); err != nil {
			return results
		}
		row := make(map[string]string)
		for k, v := range values {
			key := column[k]
			row[key] = string(v)
		}
		results = append(results, row)
	}
	return results
}
