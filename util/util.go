package util

import (
	"crypto/md5"
	"encoding/hex"
	"strings"

	"golang.org/x/text/encoding/simplifiedchinese"
)

func GetPathLastPart(path string) string {
	var fn string
	segs := strings.Split(path, "/")
	if len(segs) >= 1 {
		fn = segs[len(segs)-1]
	} else {
		fn = path
	}
	fn = strings.Replace(fn, ".", "_", -1)
	return fn
}

func Md5Encode(src string) string {
	h := md5.New()
	h.Write([]byte(src)) // 需要加密的字符串为 123456
	cipherStr := h.Sum(nil)
	return hex.EncodeToString(cipherStr)
}

func GbkToUtf8(str string) string {
	decoder := simplifiedchinese.GBK.NewDecoder()
	res, err := decoder.String(str)
	if err != nil {
		return str
	}
	return res
}

func Utf8ToGbk(str string) string {
	encoder := simplifiedchinese.GBK.NewEncoder()
	res, err := encoder.String(str)
	if err != nil {
		return str
	}
	return res
}
