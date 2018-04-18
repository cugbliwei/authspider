package sql

import (
	"encoding/base64"
	"fmt"
	"time"

	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/dlog"
	"gopkg.in/redis.v4"
)

var RedisClient *redis.Client
var RedisClusterClient *redis.ClusterClient

func init() {
	host := config.Instance.Redis.Single
	if !config.Instance.OnLine {
		host = config.Instance.Local.RedisHost
	}

	RedisClient = GetRedisClient(host)
	if config.Instance.OnLine {
		RedisClusterClient = GetRedisClusterClient()
	}
}

func GetRedisClient(host string) *redis.Client {
	return redis.NewClient(
		&redis.Options{
			Addr:         host,
			DialTimeout:  time.Duration(config.Instance.Redis.WriteTimeout) * time.Second,
			ReadTimeout:  time.Duration(config.Instance.Redis.WriteTimeout) * time.Second,
			WriteTimeout: time.Duration(config.Instance.Redis.WriteTimeout) * time.Second,
		},
	)
}

func DeleteFromRedis(key string) int64 {
	ret, _ := RedisClient.Del(key).Result()
	return ret
}

func GetFromRedis(key string) (string, error) {
	ret, err := RedisClient.Get(key).Result()
	return ret, err
}

func HGetFromRedis(key, field string) (string, error) {
	return RedisClient.HGet(key, field).Result()
}

func WriteToRedis(key, val string, timeout int) {
	if ret := RedisClient.Set(key, val, time.Duration(timeout)*time.Minute); ret.Err() != nil {
		dlog.Error("write key: %s to redis error: %s", key, ret.Err())
		return
	}
	dlog.Warn("write key: %s to redis success", key)
}

func WriteToRedisGetError(key, val string, timeout int) error {
	ret := RedisClient.Set(key, val, time.Duration(timeout)*time.Minute)
	return ret.Err()
}

func GetRedisClusterClient() *redis.ClusterClient {
	return redis.NewClusterClient(
		&redis.ClusterOptions{
			Addrs:        config.Instance.Redis.Cluster,
			DialTimeout:  time.Duration(config.Instance.Redis.WriteTimeout) * time.Second,
			ReadTimeout:  time.Duration(config.Instance.Redis.WriteTimeout) * time.Second,
			WriteTimeout: time.Duration(config.Instance.Redis.WriteTimeout) * time.Second,
		},
	)
}

func GetFromClusterRedis(key string) (string, error) {
	return RedisClusterClient.Get(key).Result()
}

func HGetFromClusterRedis(key, field string) (string, error) {
	return RedisClusterClient.HGet(key, field).Result()
}

func WriteToClusterRedis(key, val string, timeout int) {
	if ret := RedisClusterClient.Set(key, val, time.Duration(timeout)*time.Minute); ret.Err() != nil {
		dlog.Error("write key: %s to cluster redis error: %s", key, ret.Err())
		return
	}
	dlog.Warn("write key: %s to cluster redis success", key)
}

func WriteToClusterRedisGetError(key, val string, timeout int) error {
	ret := RedisClusterClient.Set(key, val, time.Duration(timeout)*time.Minute)
	return ret.Err()
}

func GetFromMixRedis(key string) (string, error) {
	if config.Instance.OnLine {
		return GetFromClusterRedis(key)
	}
	return GetFromRedis(key)
}

func HGetFromMixRedis(key, field string) (string, error) {
	if config.Instance.OnLine {
		return HGetFromClusterRedis(key, field)
	}
	return HGetFromRedis(key, field)
}

func WriteToMixRedis(key, val string, timeout int) {
	if config.Instance.OnLine {
		WriteToClusterRedis(key, val, timeout)
	} else {
		WriteToRedis(key, val, timeout)
	}
}

func WriteToMixRedisGetError(key, val string, timeout int) error {
	if config.Instance.OnLine {
		return WriteToClusterRedisGetError(key, val, timeout)
	}
	return WriteToRedisGetError(key, val, timeout)
}

func UploadImageToRedis(ubody []byte) (url string, err error) {
	val := base64.StdEncoding.EncodeToString(ubody)
	nano := time.Now().UnixNano()
	key := "randcode_" + fmt.Sprintf("%d", nano)
	err = WriteToRedisGetError(key, val, config.Instance.Redis.SingleStoreTimeout)
	url = config.Instance.ServiceHost + "/randcode/" + key + ".png"
	return
}

func BrpopFromRedis(timeout time.Duration, keys ...string) ([]string, error) {
	if config.Instance.OnLine {
		return RedisClusterClient.BRPop(timeout, keys...).Result()
	}
	return RedisClient.BRPop(timeout, keys...).Result()
}

func BrpopLpushFromRedis(source, destination string, timeout time.Duration) (string, error) {
	if config.Instance.OnLine {
		return RedisClusterClient.BRPopLPush(source, destination, timeout).Result()
	}
	return RedisClient.BRPopLPush(source, destination, timeout).Result()
}

func LpushToRedis(key string, values ...interface{}) (int64, error) {
	if config.Instance.OnLine {
		return RedisClusterClient.LPush(key, values...).Result()
	}
	return RedisClient.LPush(key, values...).Result()
}

func RpushToRedis(key string, values ...interface{}) (int64, error) {
	if config.Instance.OnLine {
		return RedisClusterClient.RPush(key, values...).Result()
	}
	return RedisClient.RPush(key, values...).Result()
}
