package sql

import (
	"encoding/json"
	"strconv"

	"github.com/cugbliwei/dlog"
)

type Header map[string]string

type Bill struct {
	Basic      *Basic     `json:"basic,omitempty"`
	Details    []*Detail  `json:"details,omitempty"`
	PointsInfo []*Points  `json:"points,omitempty"`
	Accounts   []*Account `json:"accounts,omitempty"`
	Header     Header     `json:"header,omitempty"`
	AlertInfo  []string   `json:"altert,omitempty"`
}

type Account struct {
	LastBalance    *float64 `json:"last_balance,omitempty"`
	NewBalance     *float64 `json:"new_balance,omitempty"`
	NewCharges     *float64 `json:"new_charges,omitempty"`
	NewPayments    *float64 `json:"new_payments,omitempty"`
	UsdLastBalance *float64 `json:"usd_last_balance,omitempty"`
	UsdNewBalance  *float64 `json:"usd_new_balance,omitempty"`
	UsdNewCharges  *float64 `json:"usd_new_charges,omitempty"`
	UsdNewPayments *float64 `json:"usd_new_payments,omitempty"`
}

type Basic struct {
	UserName                    string   `json:"user_name,omitempty"`
	Gender                      string   `json:"gender,omitempty"`
	BankName                    string   `json:"bank_name,omitempty"`
	CardNumber                  string   `json:"card_number,omitempty"`
	CardType                    string   `json:"card_type,omitempty"`
	BillDate                    string   `json:"bill_date,omitempty"`
	BillDatePeriod              string   `json:"bill_date_period,omitempty"`
	PaymentDueDate              string   `json:"payment_due_date,omitempty"`
	CreditLimit                 *float64 `json:"credit_limit,omitempty"`
	AvailableBalance            *float64 `json:"available_balance,omitempty"`
	InstallmentAvailableBalance *float64 `json:"installment_available_balance,omitempty"`
	CashLimit                   *float64 `json:"cash_limit,omitempty"`
	LastBalance                 *float64 `json:"last_balance,omitempty"`
	MinPayment                  *float64 `json:"min_payment,omitempty"`
	NewBalance                  *float64 `json:"new_balance,omitempty"`
	NewCharges                  *float64 `json:"new_charges,omitempty"`
	Adjustment                  *float64 `json:"adjustment,omitempty"`
	Interest                    *float64 `json:"interest,omitempty"`
	NewPayments                 *float64 `json:"new_payments,omitempty"`
	DisputeNumber               *float64 `json:"dispute_number,omitempty"`
	UsdLastBalance              *float64 `json:"usd_last_balance,omitempty"`
	UsdMinPayment               *float64 `json:"usd_min_payment,omitempty"`
	UsdNewBalance               *float64 `json:"usd_new_balance,omitempty"`
	UsdNewCharges               *float64 `json:"usd_new_charges,omitempty"`
	UsdAdjustment               *float64 `json:"usd_adjustment,omitempty"`
	UsdInterest                 *float64 `json:"usd_interest,omitempty"`
	UsdNewPayments              *float64 `json:"usd_new_payments,omitempty"`
	IsOriginal                  int      `json:"is_original"`
}

type Detail struct {
	PartialCardNumber string   `json:"partial_card_number,omitempty"`
	AccountType       string   `json:"account_type,omitempty"`
	TransDate         string   `json:"trans_date,omitempty"`
	PostDate          string   `json:"post_date,omitempty"`
	Description       string   `json:"description,omitempty"`
	CurrencyType      string   `json:"currency_type,omitempty"`
	TransCurrencyType string   `json:"trans_currency_type,omitempty"`
	TransArea         string   `json:"trans_area,omitempty"`
	TransType         string   `json:"trans_type,omitempty"`
	InstaTotal        *int64   `json:"insta_total,omitempty"`
	InstaNo           *int64   `json:"insta_no,omitempty"`
	InstaRemain       *int64   `json:"insta_remain,omitempty"`
	IncomePayment     *float64 `json:"income_payment,omitempty"`
	TransAmount       *float64 `json:"trans_amount,omitempty"`
	Amount            *float64 `json:"amount,omitempty"`
	InstaAmountRemain *float64 `json:"insta_amount_remain,omitempty"`
	InstaAmount       *float64 `json:"insta_amount,omitempty"`
	HoneyCategoryId   *int     `json:"honey_category_id,omitempty"`
}

type Points struct {
	CardNumber     string   `json:"card_number,omitempty"`
	LastPoints     *float64 `json:"last_points,omitempty"`
	EarnedPoints   *float64 `json:"earned_points,omitempty"`
	BonusPoints    *float64 `json:"bonus_points,omitempty"`
	AdjustedPoints *float64 `json:"adjusted_points,omitempty"`
	RedeemedPoints *float64 `json:"redeemed_points,omitempty"`
	NewPoints      *float64 `json:"new_points,omitempty"`
}

type BillResponse struct {
	HoneyCombBill          []*Bill `json:"honeycomb_bills"`
	CasperCloudBill        []*Bill `json:"caspercloud_bills"`
	ErrorMessage           string  `json:"warning_message"`
	HoneyCrawlStatus       string  `json:"honeycomb_crawl_status,omitempty"`
	CaspercloudCrawlStatus string  `json:"caspercloud_crawl_status,omitempty"`
}

type HoneycombBills struct {
	Bills []*BillBasic       `json:"bills,omitempty"`
	Trans []*BillTransDetail `json:"tranDetails,omitempty"`
}

type BillBasic struct {
	BillBaseInfoId   int64    `json:"billBaseInfoId,omitempty"`
	CurrencyCode     string   `json:"currencyCode,omitempty"`
	NewBalanceAmount *float64 `json:"newBalanceAmount,omitempty"`
	BillDate         string   `json:"billDate,omitempty"`
	CashLimit        *float64 `json:"cashLimit,omitempty"`
	CreditLimit      *float64 `json:"creditLimit,omitempty"`
	BalanceBF        *float64 `json:"balanceBF,omitempty"`
	NewCharges       *float64 `json:"newCharges,omitempty"`
	BankCode         string   `json:"bankCode,omitempty"`
	CardNo           string   `json:"cardNo,omitempty"`
	EmailId          int64    `json:"emailId,omitempty"`
	MinPayment       *float64 `json:"minPayment,omitempty"`
	IsOriginal       int      `json:"isOriginal"`
	Adjustment       *float64 `json:"adjustment,omitempty"`
	Interest         *float64 `json:"interest,omitempty"`
	PaymentDueDate   string   `json:"paymentDueDate,omitempty"`
	CardHolder       string   `json:"cardholder,omitempty"`
	PaymentBF        *float64 `json:"paymentBF,omitempty"`
}

func (e *BillBasic) ToBasic() *Basic {
	ret := &Basic{}
	if len(e.CardHolder) != 0 {
		ret.UserName = e.CardHolder
	}

	if len(e.BankCode) != 0 {
		ret.BankName = e.BankCode
	}

	if len(e.CardNo) != 0 {
		ret.CardNumber = e.CardNo
	}

	if e.CreditLimit != nil {
		ret.CreditLimit = e.CreditLimit
	}

	if e.CashLimit != nil {
		ret.CashLimit = e.CashLimit
	}

	if len(e.BillDate) != 0 {
		ret.BillDate = e.BillDate
	}

	if len(e.PaymentDueDate) != 0 {
		ret.PaymentDueDate = e.PaymentDueDate
	}

	if e.BalanceBF != nil {
		ret.LastBalance = e.BalanceBF
	}

	if e.PaymentBF != nil {
		ret.NewPayments = e.PaymentBF
	}

	if e.MinPayment != nil {
		ret.MinPayment = e.MinPayment
	}

	if e.NewBalanceAmount != nil {
		ret.NewBalance = e.NewBalanceAmount
	}

	if e.NewCharges != nil {
		ret.NewCharges = e.NewCharges
	}

	if e.Adjustment != nil {
		ret.Adjustment = e.Adjustment
	}

	if e.Interest != nil {
		ret.Interest = e.Interest
	}

	ret.IsOriginal = e.IsOriginal

	return ret
}

type BillTransDetail struct {
	BillBaseInfoId       int64    `json:"billBaseInfoId,omitempty"`
	PeriodNo             *int64   `json:"periodNo,omitempty"`
	CurrencyCode         string   `json:"currencyCode,omitempty"`
	PostDate             string   `json:"postDate,omitempty"`
	BillDetailCategoryId *int     `json:"billDetailCategoryId,omitempty"`
	TransactionDate      string   `json:"transactionDate,omitempty"`
	BankCode             string   `json:"bankCode,omitempty"`
	Id                   *int64   `json:"id,omitempty"`
	CardNo               string   `json:"cardNo,omitempty"`
	Amount               *float64 `json:"amount,omitempty"`
	PeriodTotal          *int64   `json:"periodTotal,omitempty"`
	EmailId              int64    `json:"emailId,omitempty"`
	Description          string   `json:"description,omitempty"`
}

func (e *BillTransDetail) ToDetail() *Detail {
	ret := &Detail{}
	if len(e.CardNo) != 0 {
		ret.PartialCardNumber = e.CardNo
	}

	if len(e.TransactionDate) != 0 {
		ret.TransDate = e.TransactionDate
	}

	if len(e.PostDate) != 0 {
		ret.PostDate = e.PostDate
	}

	if e.Amount != nil {
		ret.Amount = e.Amount
	}

	if len(e.Description) != 0 {
		ret.Description = e.Description
	}

	if len(e.CurrencyCode) != 0 {
		ret.CurrencyType = e.CurrencyCode
	}

	if e.PeriodNo != nil {
		ret.InstaNo = e.PeriodNo
	}

	if e.PeriodTotal != nil {
		ret.InstaTotal = e.PeriodTotal
	}

	if e.BillDetailCategoryId != nil {
		ret.HoneyCategoryId = e.BillDetailCategoryId
	}

	return ret
}

func HoneycombBillsConvert(bills *HoneycombBills) []*Bill {
	return HoneycombConvert(bills.Bills, bills.Trans)
}

func HoneycombConvert(bills []*BillBasic, trans []*BillTransDetail) []*Bill {
	transmap := make(map[string][]*BillTransDetail)
	for _, tran := range trans {
		key := strconv.FormatInt(tran.BillBaseInfoId, 10) + "_" + tran.CardNo
		_, ok := transmap[key]
		if !ok {
			transmap[key] = []*BillTransDetail{}
		}
		transmap[key] = append(transmap[key], tran)
	}

	ret := []*Bill{}
	for _, b := range bills {
		cbill := &Bill{
			Basic:   b.ToBasic(),
			Details: []*Detail{},
		}
		key := strconv.FormatInt(b.BillBaseInfoId, 10) + "_" + b.CardNo
		ts, ok := transmap[key]
		if ok {
			for _, t := range ts {
				cbill.Details = append(cbill.Details, t.ToDetail())
			}
		}
		ret = append(ret, cbill)
	}
	return ret
}

func getBillData(data string) (string, error) {
	var bills HoneycombBills
	if err := json.Unmarshal([]byte(data), &bills); err != nil {
		dlog.Error("unmarshal get error: %v", err)
		return "", err
	}
	resp := &BillResponse{}
	resp.HoneyCombBill = HoneycombBillsConvert(&bills)
	resp.HoneyCrawlStatus = "parse_succeed"
	resp.CaspercloudCrawlStatus = "not_received"
	rdata, err := json.Marshal(resp)
	if err != nil {
		return "", err
	}
	return string(rdata), nil
}
