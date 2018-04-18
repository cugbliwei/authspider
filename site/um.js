/* 2016-08-25 16:32:12 */
!function(e) {
    function t(r) {
        if (n[r])
            return n[r].exports;
        var a = n[r] = {
            exports: {},
            id: r,
            loaded: !1
        };
        return e[r].call(a.exports, a, a.exports, t),
        a.loaded = !0,
        a.exports
    }
    var n = {};
    return t.m = e,
    t.c = n,
    t.p = "",
    t(0)
}([function(e, t, n) {
    (function(e) {
        var t, r = n(1), a = n(2), i = n(3), o = n(6), u = n(9), c = n(15), s = e, l = (s.document,
        {}), f = {
            version: "3.3.2",
            getStatus: function(e) {
                return t ? e ? t.status : t.status >= 200 : e ? 0 : !1
            },
            getData: function() {
                return t ? t.getData() : "{}"
            },
            getToken: function() {
                return t ? t.getToken() : u()
            },
            init: function(e) {
                var n = i.extend({}, c, e || {});
                if (!n.enabled)
                    return r.reject("not enabled");
                var a = n.token || u();
                if (l[a])
                    return l[a];
                var s = r.defer();
                return l[a] = s.promise,
                t = new o(n),
                t.init(),
                t.defer = s,
                s.promise
            }
        };
        a.trigger("main.loaded", {
            um: f
        });
        var d = s.umx && s.umx.version >= "3.1.0";
        d || (s.umx = f),
        s.pointman && s.pointman.define("um", function() {
            return d ? s.umx : f
        })
    }
    ).call(t, function() {
        return this
    }())
}
, function(e, t) {
    function n(e) {
        return this instanceof n ? (this._state = c,
        this._onFulfilled = [],
        this._onRejected = [],
        this._value = null,
        this._reason = null,
        void (f(e) && e(i(this.resolve, this), i(this.reject, this)))) : new n(e)
    }
    function r(e, t, n) {
        return function(r) {
            if (f(t))
                try {
                    var i = t(r);
                    a(i) ? i.then(function(t) {
                        e.resolve(t)
                    }, function(t) {
                        e.reject(t)
                    }) : e.resolve(i)
                } catch (o) {
                    e.reject(o)
                }
            else
                e[n](r)
        }
    }
    function a(e) {
        return e && f(e.then)
    }
    function i(e, t) {
        var n = [].slice
          , r = n.call(arguments, 2)
          , a = function() {}
          , i = function() {
            return e.apply(this instanceof a ? this : t, r.concat(n.call(arguments)))
        };
        return a.prototype = e.prototype,
        i.prototype = new a,
        i
    }
    function o(e) {
        return function(t) {
            return {}.toString.call(t) == "[object " + e + "]"
        }
    }
    function u(e, t) {
        for (var n = 0, r = e.length; r > n; n++)
            t(e[n], n)
    }
    var c = 0
      , s = 1
      , l = 2;
    n.prototype = {
        constructor: n,
        then: function(e, t) {
            var a = new n
              , i = r(a, e, "resolve")
              , o = r(a, t, "reject");
            return this._state === s ? i(this._value) : this._state === l ? o(this._reason) : (this._onFulfilled.push(i),
            this._onRejected.push(o)),
            a
        },
        resolve: function(e) {
            this._state === c && (this._state = s,
            this._value = e,
            u(this._onFulfilled, function(t) {
                t(e)
            }),
            this._onFulfilled = [])
        },
        reject: function(e) {
            this._state === c && (this._state = l,
            this._reason = e,
            u(this._onRejected, function(t) {
                t(e)
            }),
            this._onRejected = [])
        },
        "catch": function(e) {
            return this.then(null, e)
        },
        always: function(e) {
            return this.then(e, e)
        }
    },
    n.defer = function() {
        var e = {};
        return e.promise = new n(function(t, n) {
            e.resolve = t,
            e.reject = n
        }
        ),
        e
    }
    ,
    n.race = function(e) {
        var t = n.defer();
        e.length;
        return u(e, function(e) {
            e.then(function(e) {
                t.resolve(e)
            }, function(e) {
                t.reject(e)
            })
        }),
        t.promise
    }
    ,
    n.all = function(e) {
        var t = n.defer()
          , r = e.length
          , a = [];
        return u(e, function(e, n) {
            e.then(function(e) {
                a[n] = e,
                r--,
                0 === r && t.resolve(a)
            }, function(e) {
                t.reject(e)
            })
        }),
        t.promise
    }
    ,
    n.resolve = function(e) {
        return new n(function(t) {
            t(e)
        }
        )
    }
    ,
    n.reject = function(e) {
        return new n(function(t, n) {
            n(e)
        }
        )
    }
    ;
    var f = o("Function");
    e.exports = n
}
, function(e, t) {
    var n = [].slice
      , r = {}
      , a = function(e, t) {
        var n = r[e] || (r[e] = []);
        n.push(t)
    }
      , i = function(e, t) {
        var n = function() {
            o(e, n),
            t.apply(null, arguments)
        };
        a(e, n)
    }
      , o = function(e, t) {
        if (!e && !t)
            return void (r = {});
        var n = r[e];
        if (n)
            if (t)
                for (var a = n.length - 1; a >= 0; a--)
                    n[a] === t && n.splice(a, 1);
            else
                delete r[e]
    }
      , u = function(e) {
        var t = r[e]
          , a = n.call(arguments, 1);
        if (t) {
            t = t.slice();
            for (var i = 0, o = t.length; o > i; i++)
                t[i].apply(null, a)
        }
    };
    e.exports = {
        on: a,
        one: i,
        off: o,
        trigger: u,
        __events: r
    }
}
, function(e, t, n) {
    (function(t) {
        function r(e) {
            return function(t) {
                return {}.toString.call(t) == "[object " + e + "]"
            }
        }
        var a = t
          , i = a.document
          , o = n(4)
          , u = n(1)
          , c = n(5)
          , s = (a.JSON || o).stringify
          , l = (a.JSON || o).parse
          , f = i.getElementsByTagName("script")[0].parentNode
          , d = function(e, t, n) {
            if (e) {
                var r = 0
                  , a = e.length;
                if (a === +a)
                    for (; a > r && t.call(n, e[r], r, e) !== !1; r++)
                        ;
                else
                    for (r in e)
                        if (e.hasOwnProperty(r) && t.call(n, e[r], r, e) === !1)
                            break
            }
        }
          , p = {
            isObject: r("Object"),
            isFunction: r("Function"),
            wait: function(e) {
                return new u(function(t, n) {
                    setTimeout(n, e)
                }
                )
            },
            allSettled: function(e) {
                var t = u.defer()
                  , n = 0;
                return d(e, function() {
                    n++
                }),
                d(e, function(e) {
                    e.always(function() {
                        n--,
                        0 === n && t.resolve()
                    })
                }),
                t.promise
            },
            each: d,
            singleton: function(e, t) {
                var n;
                return function() {
                    return "undefined" != typeof n ? n : n = e.apply(t, arguments)
                }
            },
            extend: function(e) {
                for (var t, n, r = [].slice.call(arguments), a = r.length, i = 1; a > i; i++) {
                    t = r[i];
                    for (n in t)
                        t.hasOwnProperty(n) && (e[n] = t[n])
                }
                return e
            },
            poll: function(e, t, n) {
                n = n || 1e4,
                t = t || 500;
                var r = null
                  , a = u.race([p.wait(n), new u(function(n, a) {
                    function i() {
                        var t = e();
                        return t ? (n(t),
                        1) : 0
                    }
                    i() || (r = setInterval(i, t))
                }
                )]);
                return a.always(function() {
                    clearInterval(r)
                }),
                a
            },
            append: function(e, t) {
                e || (e = i.body);
                var n = i.createElement("span");
                n.innerHTML = t,
                e.insertBefore(n.firstChild, e.firstChild),
                n = null
            },
            post: function(e, t, n) {
                var r = "undefined" != typeof XMLHttpRequest && "withCredentials"in new XMLHttpRequest;
                if (!r || n)
                    return p.jsonp(e, t);
                var a = new u(function(n, r) {
                    var a, i = "POST", o = function() {
                        var e = a && a.responseText;
                        n(l(e || "{}"))
                    }, u = function(e) {
                        r(e)
                    };
                    setTimeout(r, 5e3),
                    a = new XMLHttpRequest,
                    a.open(i, e, !0),
                    a.withCredentials = !0,
                    a.setRequestHeader && a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"),
                    a.onload = o,
                    a.onerror = u,
                    a.send("data=" + encodeURIComponent(t))
                }
                );
                return a["catch"](function(n) {
                    return p.jsonp(e, t)
                })
            },
            jsonp: function(e, t) {
                return new u(function(n, r) {
                    var o = i.createElement("script")
                      , u = "_" + parseInt(1e4 * Math.random(), 10) + "_" + (new Date).getTime()
                      , c = [];
                    o.onerror = function(e) {
                        r(e)
                    }
                    ,
                    setTimeout(r, 5e3),
                    c.push("data=" + encodeURIComponent(t)),
                    c.push("_callback=" + u),
                    e += e.indexOf("?") > 0 ? "&" : "?",
                    e += c.join("&"),
                    o.src = e,
                    a[u] = function(e) {
                        n(e);
                        try {
                            f.removeChild(o),
                            delete a[u]
                        } catch (t) {}
                    }
                    ,
                    f.appendChild(o)
                }
                )
            },
            parseJson: l,
            toJson: s,
            log: function(e) {
                var t = new Image
                  , n = "_um_img_" + Math.random();
                a[n] = t,
                t.onload = t.onerror = function() {
                    a[n] = null
                }
                ,
                t.src = e
            },
            groupHash: function(e) {
                if (0 === e.length)
                    return "";
                var t = {};
                d(e, function(e) {
                    var n = e.charAt(0).toUpperCase();
                    ("A" > n || n > "Z") && (n = "zh"),
                    t[n] = t[n] || [],
                    t[n].push(e)
                });
                var n = [];
                return d(t, function(e, t) {
                    n.push(("zh" === t ? "#" : t) + c.hash(e.join(",")))
                }),
                n.join(",")
            }
        };
        e.exports = p
    }
    ).call(t, function() {
        return this
    }())
}
, function(module, exports) {
    var JSON = {};
    !function() {
        "use strict";
        function f(e) {
            return 10 > e ? "0" + e : e
        }
        function this_value() {
            return this.valueOf()
        }
        function quote(e) {
            return rx_escapable.lastIndex = 0,
            rx_escapable.test(e) ? '"' + e.replace(rx_escapable, function(e) {
                var t = meta[e];
                return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + e + '"'
        }
        function str(e, t) {
            var n, r, a, i, o, u = gap, c = t[e];
            switch (c && "object" == typeof c && "function" == typeof c.toJSON && (c = c.toJSON(e)),
            "function" == typeof rep && (c = rep.call(t, e, c)),
            typeof c) {
            case "string":
                return quote(c);
            case "number":
                return isFinite(c) ? String(c) : "null";
            case "boolean":
            case "null":
                return String(c);
            case "object":
                if (!c)
                    return "null";
                if (gap += indent,
                o = [],
                "[object Array]" === Object.prototype.toString.apply(c)) {
                    for (i = c.length,
                    n = 0; i > n; n += 1)
                        o[n] = str(n, c) || "null";
                    return a = 0 === o.length ? "[]" : gap ? "[\n" + gap + o.join(",\n" + gap) + "\n" + u + "]" : "[" + o.join(",") + "]",
                    gap = u,
                    a
                }
                if (rep && "object" == typeof rep)
                    for (i = rep.length,
                    n = 0; i > n; n += 1)
                        "string" == typeof rep[n] && (r = rep[n],
                        a = str(r, c),
                        a && o.push(quote(r) + (gap ? ": " : ":") + a));
                else
                    for (r in c)
                        Object.prototype.hasOwnProperty.call(c, r) && (a = str(r, c),
                        a && o.push(quote(r) + (gap ? ": " : ":") + a));
                return a = 0 === o.length ? "{}" : gap ? "{\n" + gap + o.join(",\n" + gap) + "\n" + u + "}" : "{" + o.join(",") + "}",
                gap = u,
                a
            }
        }
        var rx_one = /^[\],:{}\s]*$/
          , rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g
          , rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g
          , rx_four = /(?:^|:|,)(?:\s*\[)+/g
          , rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
          , rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        }
        ,
        Boolean.prototype.toJSON = this_value,
        Number.prototype.toJSON = this_value,
        String.prototype.toJSON = this_value);
        var gap, indent, meta, rep;
        "function" != typeof JSON.stringify && (meta = {
            "\b": "\\b",
            "	": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        JSON.stringify = function(e, t, n) {
            var r;
            if (gap = "",
            indent = "",
            "number" == typeof n)
                for (r = 0; n > r; r += 1)
                    indent += " ";
            else
                "string" == typeof n && (indent = n);
            if (rep = t,
            t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length))
                throw new Error("JSON.stringify");
            return str("", {
                "": e
            })
        }
        ),
        "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
            function walk(e, t) {
                var n, r, a = e[t];
                if (a && "object" == typeof a)
                    for (n in a)
                        Object.prototype.hasOwnProperty.call(a, n) && (r = walk(a, n),
                        void 0 !== r ? a[n] = r : delete a[n]);
                return reviver.call(e, t, a)
            }
            var j;
            if (text = String(text),
            rx_dangerous.lastIndex = 0,
            rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function(e) {
                return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
            })),
            rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, "")))
                return j = eval("(" + text + ")"),
                "function" == typeof reviver ? walk({
                    "": j
                }, "") : j;
            throw new SyntaxError("JSON.parse")
        }
        )
    }(),
    module.exports = JSON
}
, function(e, t) {
    var n = {};
    n.encode = function(e) {
        var t = e.replace(/[\u0080-\u07ff]/g, function(e) {
            var t = e.charCodeAt(0);
            return String.fromCharCode(192 | t >> 6, 128 | 63 & t)
        });
        return t = t.replace(/[\u0800-\uffff]/g, function(e) {
            var t = e.charCodeAt(0);
            return String.fromCharCode(224 | t >> 12, 128 | t >> 6 & 63, 128 | 63 & t)
        })
    }
    ,
    n.ROTL = function(e, t) {
        return e << t | e >>> 32 - t
    }
    ,
    n.toHexStr = function(e) {
        for (var t, n = "", r = 7; r >= 0; r--)
            t = e >>> 4 * r & 15,
            n += t.toString(16);
        return n
    }
    ,
    n.f = function(e, t, n, r) {
        switch (e) {
        case 0:
            return t & n ^ ~t & r;
        case 1:
            return t ^ n ^ r;
        case 2:
            return t & n ^ t & r ^ n & r;
        case 3:
            return t ^ n ^ r
        }
    }
    ,
    n.hash = function(e, t) {
        t = "undefined" == typeof t ? !0 : t,
        t && (e = n.encode(e));
        var r = [1518500249, 1859775393, 2400959708, 3395469782];
        e += String.fromCharCode(128);
        var a, i, o, u = e.length / 4 + 2, c = Math.ceil(u / 16), s = new Array(c);
        for (a = 0; c > a; a++)
            for (s[a] = new Array(16),
            o = 0; 16 > o; o++)
                s[a][o] = e.charCodeAt(64 * a + 4 * o) << 24 | e.charCodeAt(64 * a + 4 * o + 1) << 16 | e.charCodeAt(64 * a + 4 * o + 2) << 8 | e.charCodeAt(64 * a + 4 * o + 3);
        s[c - 1][14] = 8 * (e.length - 1) / Math.pow(2, 32),
        s[c - 1][14] = Math.floor(s[c - 1][14]),
        s[c - 1][15] = 8 * (e.length - 1) & 4294967295;
        var l, f, d, p, h, m = 1732584193, g = 4023233417, v = 2562383102, T = 271733878, C = 3285377520, y = new Array(80);
        for (a = 0; c > a; a++) {
            for (i = 0; 16 > i; i++)
                y[i] = s[a][i];
            for (i = 16; 80 > i; i++)
                y[i] = n.ROTL(y[i - 3] ^ y[i - 8] ^ y[i - 14] ^ y[i - 16], 1);
            for (l = m,
            f = g,
            d = v,
            p = T,
            h = C,
            i = 0; 80 > i; i++) {
                var S = Math.floor(i / 20)
                  , B = n.ROTL(l, 5) + n.f(S, f, d, p) + h + r[S] + y[i] & 4294967295;
                h = p,
                p = d,
                d = n.ROTL(f, 30),
                f = l,
                l = B
            }
            m = m + l & 4294967295,
            g = g + f & 4294967295,
            v = v + d & 4294967295,
            T = T + p & 4294967295,
            C = C + h & 4294967295
        }
        return n.toHexStr(m) + n.toHexStr(g) + n.toHexStr(v) + n.toHexStr(T) + n.toHexStr(C)
    }
    ,
    e.exports = n
}
, function(e, t, n) {
    (function(t) {
        function r(e, t) {
            e && a(e).then(function(e) {
                i(e, t)
            })
        }
        function a(e) {
            return s.poll(function() {
                return m.getElementById(e)
            }, 100, 2e3)
        }
        function i(e, t) {
            var n, r, a = e.getElementsByTagName("input");
            for (n = 0; n < a.length; n++)
                if ("um_token" == a[n].getAttribute("name")) {
                    r = a[n];
                    break
                }
            return r ? r.value = t : (r = m.createElement("input"),
            r.type = "hidden",
            r.name = "um_token",
            r.value = t,
            e.appendChild(r)),
            r
        }
        var o = n(7)
          , u = n(8)
          , c = n(9)
          , s = n(3)
          , l = n(12)
          , f = n(13)
          , d = n(11)
          , p = {
            cn: "https://ynuf.alipay.com/service/um.json",
            us: "https://us.ynuf.alipay.com/service/um.json",
            sg: "https://sgynuf.alibaba.com/service/um.json",
            daily: "https://umidstable.alibaba-inc.com/service/um.json"
        }
          , h = t
          , m = h.document
          , g = function(e) {
            e = e || {},
            e.serviceUrl = e.serviceUrl || p[e.serviceLocation],
            this.options = e,
            this.status = 0,
            this.clientToken = c(),
            this.data = {}
        };
        g.prototype = {
            getToken: function() {
                return this.options.token || this.serverToken || this.clientToken
            },
            init: function() {
                var e = this.options;
                this.status = 1,
                this.startTime = new Date,
                s.extend(this.data, {
                    xv: "3.3.2",
                    xt: this.getToken(),
                    etf: e.token ? "b" : "u",
                    xa: e.appName,
                    uid: e.userId,
                    eml: e.model,
                    etid: e.traceId,
                    esid: e.sessionId
                }),
                r(e.formId, this.getToken()),
                e.closeImage || s.log(e.serviceUrl.replace("um.json", "clear.png") + "?xt=" + this.getToken() + "&xa=" + e.appName),
                this.run()
            },
            run: function() {
                var e = this
                  , t = e.options;
                e.status = 2;
                var n = l.init(t, e);
                s.allSettled(n).then(function() {
                    var t = {};
                    s.each(n, function(e, n) {
                        null != e._value && (s.isObject(e._value) ? s.extend(t, e._value) : t[n] = e._value)
                    }),
                    s.extend(e.data, t),
                    e.send()
                })["catch"](function() {})
            },
            getData: function() {
                return s.toJson(this.data)
            },
            send: function() {
                var e = this
                  , t = e.options;
                if (t.noRequest) {
                    try {
                        t.callback()
                    } catch (n) {}
                    return void e.defer.resolve()
                }
                e.status = 4;
                var a = "ENCODE~~V01~~" + u.encode(e.getData());
                s.post(t.serviceUrl, a, t.jsonp).then(function(n) {
                    n && n.id ? (e.status = 255,
                    f.set(d.storeKey, n.id)) : e.status = 200;
                    try {
                        t.callback(n)
                    } catch (a) {}
                    e.defer.resolve(n),
                    o.set(d.storeTimeKey, new Date - e.startTime),
                    n.tn && (e.serverToken = n.tn,
                    o.set(d.tkCache, s.toJson({
                        t: +new Date,
                        tk: n.tn
                    })),
                    r(t.formId, n.tn))
                })["catch"](function(n) {
                    e.defer.reject(n),
                    t.errorCallback && t.errorCallback(n)
                })
            }
        },
        e.exports = g
    }
    ).call(t, function() {
        return this
    }())
}
, function(e, t) {
    e.exports = {
        set: function(e, t) {
            try {
                localStorage.setItem(e, t)
            } catch (n) {}
        },
        get: function(e) {
            try {
                return localStorage.getItem(e)
            } catch (t) {}
        },
        remove: function(e) {
            try {
                localStorage.removeItem(e)
            } catch (t) {}
        }
    }
}
, function(e, t) {
    var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
      , r = function(e) {
        if (!e)
            return "";
        for (var t, r, a, i, o, u, c, s = "", l = 0; l < e.length; )
            t = e.charCodeAt(l++),
            r = e.charCodeAt(l++),
            a = e.charCodeAt(l++),
            i = t >> 2,
            o = (3 & t) << 4 | r >> 4,
            u = (15 & r) << 2 | a >> 6,
            c = 63 & a,
            isNaN(r) ? u = c = 64 : isNaN(a) && (c = 64),
            s = s + n.charAt(i) + n.charAt(o) + n.charAt(u) + n.charAt(c);
        return s
    };
    e.exports = {
        encode: r
    }
}
, function(e, t, n) {
    (function(t) {
        function r(e) {
            for (var t = ""; t.length < e; )
                t += Math.random().toString().substr(2);
            return t.substring(t.length - e)
        }
        var a = t
          , i = n(10)
          , o = n(11).collinaCookieKey
          , u = function() {
            var e = a._sec_module = a._sec_module || {};
            if (e.token)
                return "C" + e.token;
            var t = +new Date
              , n = i.get(o);
            n || (n = t + r(11),
            i.set(o, n, null, 3650, "/"));
            var u = n + t + r(3);
            return e.token = u,
            "C" + u
        };
        e.exports = u
    }
    ).call(t, function() {
        return this
    }())
}
, function(e, t) {
    var n = 864e5
      , r = encodeURIComponent
      , a = function(e) {
        return decodeURIComponent((e + "").replace(/\+/g, " "))
    }
      , i = function(e) {
        return "string" == typeof e && "" !== e
    };
    e.exports = {
        get: function(e) {
            var t, n;
            return i(e) && (n = String(document.cookie).match(new RegExp("(?:^| )" + e + "(?:(?:=([^;]*))|;|$)"))) && (t = n[1] ? a(n[1]) : ""),
            t
        },
        set: function(e, t, a, o, u, c) {
            var s = String(r(t))
              , l = o;
            return "number" == typeof l && (l = new Date,
            l.setTime(l.getTime() + o * n)),
            l instanceof Date && (s += "; expires=" + l.toUTCString()),
            i(a) && (s += "; domain=" + a),
            i(u) && (s += "; path=" + u),
            c && (s += "; secure"),
            document.cookie = e + "=" + s,
            this
        },
        remove: function(e, t, n, r) {
            return this.set(e, "", t, -1, n, r),
            this
        }
    }
}
, function(e, t) {
    e.exports = {
        storeKey: "_umdata",
        storeTimeKey: "_umcost",
        tkCache: "_umtk",
        collinaCookieKey: "_uab_collina"
    }
}
, function(e, t, n) {
    (function(t) {
        function r() {
            var e = top && top.location;
            if (!e)
                return "";
            var t = e.pathname;
            return "/" !== t.charAt(0) && (t = "/" + t),
            e.protocol + "//" + e.host + t, "https://passport.aliexpress.com/mini_login.htm"
        }
        var a, i = n(1), o = n(5), u = n(2), c = n(10), s = n(7), l = n(13), f = n(3), d = n(11), p = n(14), h = p.support, m = f.each, g = f.extend, v = f.singleton, T = f.groupHash, C = t, y = C.document, S = C.navigator, B = function() {}, M = {
            type: function() {
                return "pc"
            },
            nce: function() {
                return S.cookieEnabled
            },
            plat: function() {
                var e = S.platform;
                return e ? e.split(" ").shift() : void 0
            },
            nacn: function() {
                return S.appCodeName
            },
            nan: function() {
                return S.appName
            },
            nlg: function() {
                return S.language
            },
            sw: function() {
                return C.screen.width
            },
            sh: function() {
                return C.screen.height
            },
            saw: function() {
                return C.screen.availWidth
            },
            sah: function() {
                return C.screen.availHeight
            },
            bsw: function() {
                return y.body && y.body.clientWidth
            },
            bsh: function() {
                return y.body && y.body.clientHeight
            },
            eloc: function() {
                return encodeURIComponent(r())
            },
            etz: function() {
                var e = new Date;
                e.setDate(1),
                e.setMonth(5);
                var t = -e.getTimezoneOffset();
                e.setMonth(11);
                var n = -e.getTimezoneOffset();
                return Math.min(t, n)
            },
            ett: function() {
                return (new Date).getTime()
            },
            ecn: function() {
                if (p.support.canvas) {
                    var e = y.createElement("canvas")
                      , t = e.getContext("2d");
                    return e.height = 60,
                    e.width = 400,
                    e.style.display = "inline",
                    t.textBaseline = "alphabetic",
                    t.fillStyle = "#f60",
                    t.fillRect(125, 1, 62, 20),
                    t.fillStyle = "#069",
                    t.font = "11pt no-real-font-123",
                    t.fillText("Cwm fjordbank glyphs vext quiz, 😃", 2, 15),
                    t.fillStyle = "rgba(102, 204, 0, 0.7)",
                    t.font = "18pt Arial",
                    t.fillText("Cwm fjordbank glyphs vext quiz, 😃", 4, 45),
                    o.hash(e.toDataURL() || "")
                }
            },
            eca: function() {
                return c.get("cna")
            },
            token: function() {
                var e = l.get(d.storeKey);
                return e && e.value ? {
                    est: e.type,
                    xs: e.value
                } : void 0
            },
            ms: function() {
                return s.get(d.storeTimeKey)
            },
            erd: function() {
                var e = i.defer();
                return S.mediaDevices && S.mediaDevices.enumerateDevices ? navigator.mediaDevices.enumerateDevices().then(function(t) {
                    var n = t.map(function(e) {
                        return e.deviceId
                    });
                    e.resolve(n.join(","))
                }, function() {
                    e.reject()
                }) : e.reject(),
                e
            }
        }, b = i.defer();
        b.promise.then(function() {
            a = y.getElementById("umFlash")
        }),
        C.__flash__removeCallback = function(e, t) {
            e && (e[t] = null)
        }
        ;
        var x = v(function(e, t, n) {
            var r = '<object type="application/x-shockwave-flash" data="' + t + '" width="1" height="1" id="umFlash" class="umidWrapper" tabindex="-1"><param name="movie" value="' + t + '" /><param name="allowScriptAccess" value="always" /></object>';
            return f.append(e, r),
            w(n),
            1
        })
          , w = function(e) {
            var t = f.poll(function() {
                var e = y.getElementById("umFlash");
                return e && e.md5 && e.getCapabilities
            }, 100, e > 2e3 ? 2e3 : e);
            t.then(b.resolve, b.reject)
        }
          , k = v(function(e) {
            var t = '<embed height="1" width="1" id="umDcp" type="application/alidcp" class="umidWrapper" tabindex="-1" />';
            return f.append(e, t),
            1
        })
          , A = function(e) {
            var t = y.getElementById("umDcp");
            try {
                t && "undefined" != typeof t.getHardVersion && (e = parseInt(t.getHardVersion().replace(/\./g, ""), 10) || 1)
            } catch (n) {}
            return e
        };
        M.xh = function(e) {
            var t = e.enableMod ? p.getModVersion() : 0;
            if (t && !p.isIE && e.containers.dcp && (k(e.containers.dcp),
            t = A(t)),
            t)
                try {
                    var n = h.ActiveXObject ? new ActiveXObject("Alim.webmod") : y.getElementById("umDcp");
                    return t >= 2001 && (n.timestamp = e.timestamp || "-"),
                    n.ciraw()
                } catch (r) {}
        }
        ,
        M.flash = function(e, t) {
            var n = p.getFlashVersion();
            return e.enableFlash && n >= 9 && e.containers.flash ? (x(e.containers.flash, e.flashUrl, e.timeout),
            b.promise.then(function() {
                if (a) {
                    var e = {
                        fp: a.getCapabilities("playerType"),
                        fm: a.getCapabilities("manufacturer"),
                        fv: a.getCapabilities("version"),
                        fsc: a.getCapabilities("screenColor"),
                        fsx: a.getCapabilities("screenResolutionX"),
                        fsy: a.getCapabilities("screenResolutionY"),
                        flgs: a.getCapabilities("language"),
                        fos: a.getCapabilities("os")
                    };
                    M.token = B;
                    var t = l.get(d.storeKey);
                    return t && t.value && g(e, {
                        est: t.type,
                        xs: t.value
                    }),
                    h.CORS && g(e, {
                        fonts: a.getFontsMd5(),
                        efts: a.getFontsByGroupMd5().join(","),
                        efty: 0,
                        efcn: a.getFontCount()
                    }),
                    e
                }
            })) : void 0
        }
        ;
        var I = [];
        !function() {
            function e(e) {
                function n(t) {
                    var n = t.match(o);
                    if (n) {
                        var r = n[1];
                        i[r] || (e(r),
                        i[r] = !0)
                    }
                }
                if (t) {
                    try {
                        var r = new t({
                            iceServers: [{
                                url: "stun:stun.services.mozilla.com"
                            }]
                        },{
                            optional: [{
                                RtpDataChannels: !0
                            }]
                        })
                    } catch (a) {
                        return
                    }
                    var i = {}
                      , o = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
                    r.onicecandidate = function(e) {
                        e.candidate && n(e.candidate.candidate)
                    }
                    ,
                    r.createDataChannel(""),
                    r.createOffer(function(e) {
                        if (r.setLocalDescription(e, function() {}, function() {}),
                        e.sdp) {
                            var t = e.sdp.split("\n");
                            t.forEach(function(e) {
                                0 === e.indexOf("a=candidate:") && n(e)
                            })
                        }
                    }, function() {}),
                    f.poll(function() {
                        if (r.localDescription && r.localDescription.sdp) {
                            var e = r.localDescription.sdp.split("\n");
                            return e.forEach(function(e) {
                                0 === e.indexOf("a=candidate:") && n(e)
                            }),
                            I.length >= 2
                        }
                    }, 50, 1500)
                }
            }
            var t = h.RTCPeerConnection;
            e(function(e) {
                e && I.push(e)
            })
        }(),
        M.ips = function(e) {
            return f.poll(function() {
                return I.length >= e.maxIPNum
            }, 50, 1e3).always(function() {
                return I.join(",")
            })
        }
        ;
        var O = function() {
            var e = ["monospace", "sans-serif", "serif"]
              , t = "mmmmmmmmmmlli"
              , n = "72px"
              , r = y.getElementsByTagName("body")[0]
              , a = document.createElement("span");
            a.style.fontSize = n,
            a.innerHTML = t;
            var i = {}
              , o = {};
            for (var u in e)
                a.style.fontFamily = e[u],
                r.appendChild(a),
                i[e[u]] = a.offsetWidth,
                o[e[u]] = a.offsetHeight,
                r.removeChild(a);
            var c = function(t) {
                var n = !1;
                for (var u in e) {
                    a.style.fontFamily = t + "," + e[u],
                    r.appendChild(a);
                    var c = a.offsetWidth !== i[e[u]] || a.offsetHeight !== o[e[u]];
                    r.removeChild(a),
                    n = n || c
                }
                return n
            }
              , s = ["Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS", "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style", "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New", "Garamond", "Geneva", "Georgia", "Helvetica", "Helvetica Neue", "Impact", "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode", "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO", "Palatino", "Palatino Linotype", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol", "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS", "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"]
              , l = ["Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter", "American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER", "ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville", "Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD", "Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed", "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara", "CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer", "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold", "Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark", "DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC", "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte", "FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER", "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT", "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD", "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV", "Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT", "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN", "Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island", "Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic", "Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti", "MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli", "Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN", "OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB", "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla", "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood", "Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket", "Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC", "Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold", "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin", "ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"];
            s = s.concat(l);
            for (var f = [], d = 0, p = s.length; p > d; d++)
                c(s[d]) && f.push(s[d]);
            return f
        };
        M.jsfonts = function(e) {
            if (h.CORS && e.enableJSFonts) {
                var t = O()
                  , n = {
                    jfonts: o.hash(t.join(",")),
                    efcn: t.length,
                    efts: T(t),
                    efty: 1
                };
                return n.fonts = n.jfonts,
                n
            }
        }
        ;
        var j = function() {
            var e = 0;
            return h.plugin ? !!S.plugins["Silverlight Plug-In"] : h.ActiveXObject ? !!new ActiveXObject("AgControl.AgControl") : e
        }
          , E = function() {
            var e = [];
            return m(S.plugins || [], function(t) {
                try {
                    if (t) {
                        var n, r = [];
                        for (n = 0; n < t.length; n++)
                            t.item(n) && r.push(t.item(n).type);
                        var a = t.name + "";
                        t.version && (a += t.version + ""),
                        a += t.filename + "",
                        a += r.join(""),
                        e.push(a)
                    }
                } catch (i) {}
            }),
            e
        }
          , N = function() {
            var e = []
              , t = function(t) {
                if (t) {
                    for (var n = 0, r = null; null === r && n < t.ids.length; ) {
                        try {
                            r = new ActiveXObject(t.ids[n])
                        } catch (a) {}
                        n++
                    }
                    if (r)
                        try {
                            e.push(t.name + "==" + t.getVersion(r, t.ids[n]))
                        } catch (a) {}
                }
            }
              , n = [{
                name: "Quicktime",
                ids: ["QuickTimeCheckObject.QuickTimeCheck", "QuickTime.QuickTime"],
                getVersion: function(e) {
                    return e.QuickTimeVersion.toString(16).replace(/^(.)(.)(.).*/, "$1.$2.$3")
                }
            }, {
                name: "Acrobat",
                ids: ["AcroPDF.PDF", "PDF.PdfCtrl"],
                getVersion: function(e) {
                    var t;
                    return t = e.GetVersions().split(","),
                    t = t[0].split("="),
                    t = parseFloat(t[1])
                }
            }, {
                name: "RealPlayer",
                ids: ["RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "rmocx.RealPlayer G2 Control"],
                getVersion: function(e, t) {
                    return parseFloat(e.GetVersionInfo())
                }
            }, {
                name: "Flash",
                ids: ["ShockwaveFlash.ShockwaveFlash"],
                getVersion: function(e, t) {
                    return e.GetVariable("$version").replace(/[a-zA-Z ]*([0-9,]+)/, "$1").replace(/,/g, ".")
                }
            }, {
                name: "Adobe SVG",
                ids: ["Adobe.SVGCtl"],
                getVersion: function(e, t) {
                    return e.getSVGViewerVersion().replace(/[a-zA-Z ]*([0-9.]+)/, "$1")
                }
            }, {
                name: "Windows Media Player",
                ids: ["WMPlayer.OCX", "MediaPlayer.MediaPlayer.1"],
                getVersion: function(e, t) {
                    return e.versionInfo
                }
            }, {
                name: "DivX",
                ids: ["npdivx.DivXBrowserPlugin.1", "npdivx.DivXBrowserPlugin"],
                getVersion: function(e, t) {
                    return e.GetVersion()
                }
            }, {
                name: "WPFe (Silverlight)",
                ids: ["AgControl.AgControl"],
                getVersion: function(e, t) {
                    for (var n = "1", r = "0", a = "0"; e.IsVersionSupported(n + "." + r + "." + a); )
                        n++;
                    for (n--; e.IsVersionSupported(n + "." + r + "." + a); )
                        r++;
                    for (r--; e.IsVersionSupported(n + "." + r + "." + a); )
                        a++;
                    return a--,
                    n + "." + r + "." + a
                }
            }, {
                name: "MSXML",
                ids: ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0"],
                getVersion: function(e, t) {
                    return t.replace(/^[a-zA-Z.2]+\.([0-9]+\.[0-9.]+)/, "$1")
                }
            }];
            return m(n, t),
            e
        };
        M.plugin = function() {
            if (h.CORS) {
                var e = [];
                return h.plugin ? e = E() : h.ActiveXObject && (e = N()),
                {
                    epl: e.length,
                    ep: o.hash(e.join(",")),
                    epls: T(e),
                    esl: j()
                }
            }
        }
        ,
        u.one("main.loaded", function(e) {
            var t = e.um;
            t.flashLoaded = function() {
                b.resolve()
            }
        }),
        u.on("store.set", function(e) {
            try {
                a.setCookie(e.name, e.value)
            } catch (t) {}
        }),
        u.on("store.remove", function(e) {
            try {
                a.setCookie(e.name, "")
            } catch (t) {}
        }),
        u.on("store.get", function(e) {
            try {
                value = a.getCookie(e.name) || "",
                value && (e.type = 1,
                e.value = value)
            } catch (t) {}
        }),
        e.exports = {
            init: function(e, t) {
                var n = {};
                return f.each(M, function(r, a) {
                    try {
                        var o = r(e, t);
                        "undefined" == typeof o ? n[a] = i.reject() : f.isObject(o) ? o instanceof i ? n[a] = o : o.promise instanceof i ? (setTimeout(function() {
                            o.reject(a + ": timeout")
                        }, 3e3),
                        n[a] = o.promise) : n[a] = i.resolve(o) : n[a] = i.resolve(o)
                    } catch (u) {}
                }),
                n
            }
        }
    }
    ).call(t, function() {
        return this
    }())
}
, function(e, t, n) {
    var r = n(2)
      , a = n(10)
      , i = n(7);
    e.exports = {
        set: function(e, t) {
            r.trigger("store.set", {
                name: e,
                value: t
            }),
            i.set(e, t),
            a.set(e, t, null, 365, "/")
        },
        get: function(e) {
            var t, n = {
                name: e
            };
            return r.trigger("store.get", n),
            (t = n.value) ? {
                type: n.type,
                value: t
            } : (t = i.get(e)) ? {
                type: 2,
                value: t
            } : (t = a.get(e),
            t ? {
                type: 16,
                value: t
            } : void 0)
        },
        remove: function(e) {
            a.remove(e),
            i.remove(e),
            r.trigger("store.remove", {
                name: e
            })
        }
    }
}
, function(e, t, n) {
    (function(t) {
        var r = n(3)
          , a = t
          , i = a.document
          , o = a.navigator
          , u = i.createElement("canvas")
          , c = {
            canvas: !(!u.getContext || !u.getContext("2d")),
            CORS: !!("undefined" != typeof XMLHttpRequest && "withCredentials"in new XMLHttpRequest)
        }
          , s = {
            support: c
        };
        r.extend(c, {
            plugin: "undefined" != typeof o.plugins,
            ActiveXObject: "undefined" != typeof a.ActiveXObject,
            RTCPeerConnection: a.RTCPeerConnection || a.mozRTCPeerConnection || a.webkitRTCPeerConnection
        });
        var l = function(e, t) {
            return o.plugins && o.plugins[e] && o.mimeTypes && o.mimeTypes[t] && o.mimeTypes[t].enabledPlugin ? o.plugins[e] : !1
        }
          , f = function(e) {
            var t = !1;
            try {
                t = new ActiveXObject(e)
            } catch (n) {}
            return t
        };
        r.extend(s, {
            detectPlugin: l,
            detectActiveXObject: f,
            isIE: "Microsoft Internet Explorer" === o.appName,
            getFlashVersion: function() {
                var e, t = 0, n = "";
                if (c.plugin && (obj = l("Shockwave Flash", "application/x-shockwave-flash"),
                n = obj.description),
                c.ActiveXObject && (obj = f("ShockwaveFlash.ShockwaveFlash"),
                obj))
                    try {
                        n = obj.GetVariable("$version")
                    } catch (r) {}
                return n && (e = /(\d+)[\.,]\d+/.exec(n),
                e && (t = parseInt(e[1], 10))),
                t
            },
            getModVersion: function() {
                var e, t = 0;
                if (c.plugin && (e = l("Alipay webmod control", "application/alidcp"),
                e && (t = 1)),
                c.ActiveXObject && (e = f("Alim.webmod")))
                    try {
                        t = 1,
                        "undefined" != typeof e.getHardVersion && (t = parseInt(e.getHardVersion().replace(/\./g, ""), 10) || 1)
                    } catch (n) {}
                return t
            }
        }),
        e.exports = s
    }
    ).call(t, function() {
        return this
    }())
}
, function(e, t, n) {
    var r = n(3)
      , a = /aliexpress/.test(location.href) ? "aeis.alicdn.com" : "g.alicdn.com"
      , i = {
        enabled: !0,
        cache: !0,
        closeImage: !0,
        jsonp: !1,
        token: "",
        appName: "",
        sessionId: "",
        userId: n(16).get() || "",
        model: "AA",
        traceId: "",
        formId: "",
        serviceLocation: "cn",
        noRequest: !1,
        clientType: "M"
    };
    r.extend(i, {
        clientType: "P",
        maxIPNum: 2,
        enableJSFonts: !1,
        timeout: 3e3,
        timestamp: "-",
        flashUrl: "https://" + a + "/security/umflash/fp.swf?v1=1&f=umx",
        enableMod: !0,
        enableFlash: !0,
        containers: {
            flash: null,
            dcp: null
        }
    }),
    e.exports = i
}
, function(e, t, n) {
    var r = n(10)
      , a = n(7)
      , i = n(3)
      , o = i.parseJson
      , u = {
        taobao: function() {
            return r.get("tracknick")
        },
        alipay: function() {
            var e = a.get("home-username");
            if (e) {
                e = o(e);
                var t = e.match(/^(\d+?)\|/);
                return t && 2 === t.length ? o(e.replace(t[0], "")).value : void 0
            }
        },
        alibaba: function() {
            var e, t, n = document.getElementById("alibaba-login-box");
            return n && (e = n.src,
            t = /loginId=(?:([^&#]*)|&|#|$)/.exec(e)) ? decodeURIComponent(t[1]) : void 0
        }
    };
    e.exports = {
        get: function() {
            var e;
            return i.each(u, function(t) {
                try {
                    e = t()
                } catch (n) {}
                return e ? !1 : void 0
            }),
            e
        }
    }
}
]);
