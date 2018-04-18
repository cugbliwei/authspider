package record

import (
	"time"

	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/authspider/sql"
	_ "github.com/go-sql-driver/mysql"
)

type Step struct {
	Index   int
	Status  bool
	UseTime float64
	Message string
}

type Record struct {
	Id              string
	Tmpl            string
	Client          string
	Username        string
	Timestamp       int64
	InitTime        float64
	LoginTime       float64
	FetchTime       float64
	TotalTime       float64
	StartFetch      bool
	QrcodeSuccess   bool
	LoginSuccess    bool
	FinishFetchData bool
	Fail            bool
	FailMessage     string
	TotalPages      int
	TotalPageSize   int
	TotalPageTime   float64
}

func NewRecord(id, tmpl string, timestamp int64) *Record {
	return &Record{
		Id:        id,
		Tmpl:      tmpl,
		Timestamp: timestamp,
	}
}

func (self *Record) SendRecord(step bool) {
	if !config.Instance.OnLine {
		return
	}

	self.TotalPageSize = self.TotalPageSize / 1024
	month := time.Now().Format("200601")
	self.insertToAuthcrawlerTable(month)
}

func (self *Record) insertToAuthcrawlerTable(month string) int64 {
	insertAuth := "insert into authcrawler_" + month + "(crawler_id, tmpl, client, username, timestamp, init_time, login_time, fetch_time, total_time, start_fetch, qrcode_success, login_success, finish_fetch_data, fail, fail_message, total_pages, total_page_size, total_page_time) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
	params := []interface{}{}
	params = append(params, self.Id, self.Tmpl, self.Client, self.Username, self.Timestamp, self.InitTime, self.LoginTime, self.FetchTime, self.TotalTime, self.StartFetch, self.QrcodeSuccess, self.LoginSuccess, self.FinishFetchData, self.Fail, self.FailMessage, self.TotalPages, self.TotalPageSize, self.TotalPageTime)
	return sql.HandleMysqlTable(insertAuth, params)
}
