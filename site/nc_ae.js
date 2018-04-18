/* v1.1.27,1.2.2,1 2017-04-25 09:48:27 */
!function() {
    function cond() {
        return Math.random()
    }
    function chkQuerySet() {
        var e, t = window[QUERY_KEY];
        return isNaN(t) ? (e = location.href.split(QUERY_KEY + "=")[1],
        t = parseFloat(e),
        void (isNaN(t) || (GREY_RATIO = t))) : void (GREY_RATIO = t)
    }
    var GREY_RATIO = 1
      , QUERY_KEY = "aq-nc-grey-ratio"
      , STABLE_ACTION = function() {}
      , NEW_ACTION = function() {
        !function(e) {
            function t(i) {
                if (n[i])
                    return n[i].exports;
                var o = n[i] = {
                    i: i,
                    l: !1,
                    exports: {}
                };
                return e[i].call(o.exports, o, o.exports, t),
                o.l = !0,
                o.exports
            }
            var n = {};
            return t.m = e,
            t.c = n,
            t.i = function(e) {
                return e
            }
            ,
            t.d = function(e, n, i) {
                t.o(e, n) || Object.defineProperty(e, n, {
                    configurable: !1,
                    enumerable: !0,
                    get: i
                })
            }
            ,
            t.n = function(e) {
                var n = e && e.__esModule ? function() {
                    return e["default"]
                }
                : function() {
                    return e
                }
                ;
                return t.d(n, "a", n),
                n
            }
            ,
            t.o = function(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t)
            }
            ,
            t.p = "",
            t(t.s = 134)
        }([, function(e, t, n) {
            "use strict";
            function i(e) {
                return this instanceof i ? (this._state = l,
                this._onFulfilled = [],
                this._onRejected = [],
                this._value = null,
                this._reason = null,
                void (p(e) && e(r(this.resolve, this), r(this.reject, this)))) : new i(e)
            }
            function o(e, t, n) {
                return function(i) {
                    if (p(t))
                        try {
                            var o = t(i);
                            a(o) ? o.then(function(t) {
                                e.resolve(t)
                            }, function(t) {
                                e.reject(t)
                            }) : e.resolve(o)
                        } catch (r) {
                            e.reject(r)
                        }
                    else
                        e[n](i)
                }
            }
            function a(e) {
                return e && p(e.then)
            }
            function r(e, t) {
                var n = [].slice
                  , i = n.call(arguments, 2)
                  , o = function() {}
                  , a = function() {
                    return e.apply(this instanceof o ? this : t, i.concat(n.call(arguments)))
                };
                return o.prototype = e.prototype,
                a.prototype = new o,
                a
            }
            function c(e) {
                return function(t) {
                    return {}.toString.call(t) == "[object " + e + "]"
                }
            }
            function s(e, t) {
                for (var n = 0, i = e.length; i > n; n++)
                    t(e[n], n)
            }
            var l = 0
              , d = 1
              , u = 2;
            i.prototype = {
                constructor: i,
                then: function(e, t) {
                    var n = new i
                      , a = o(n, e, "resolve")
                      , r = o(n, t, "reject");
                    return this._state === d ? a(this._value) : this._state === u ? r(this._reason) : (this._onFulfilled.push(a),
                    this._onRejected.push(r)),
                    n
                },
                resolve: function(e) {
                    this._state === l && (this._state = d,
                    this._value = e,
                    s(this._onFulfilled, function(t) {
                        t(e)
                    }),
                    this._onFulfilled = [])
                },
                reject: function(e) {
                    this._state === l && (this._state = u,
                    this._reason = e,
                    s(this._onRejected, function(t) {
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
            i.defer = function() {
                var e = {};
                return e.promise = new i(function(t, n) {
                    e.resolve = t,
                    e.reject = n
                }
                ),
                e
            }
            ,
            i.race = function(e) {
                var t = i.defer();
                return e.length,
                s(e, function(e) {
                    e.then(function(e) {
                        t.resolve(e)
                    }, function(e) {
                        t.reject(e)
                    })
                }),
                t.promise
            }
            ,
            i.all = function(e) {
                var t = i.defer()
                  , n = e.length
                  , o = [];
                return s(e, function(e, i) {
                    e.then(function(e) {
                        o[i] = e,
                        n--,
                        0 === n && t.resolve(o)
                    }, function(e) {
                        t.reject(e)
                    })
                }),
                t.promise
            }
            ,
            i.resolve = function(e) {
                return new i(function(t) {
                    t(e)
                }
                )
            }
            ,
            i.reject = function(e) {
                return new i(function(t, n) {
                    n(e)
                }
                )
            }
            ;
            var p = c("Function");
            e.exports = i
        }
        , function(e, t, n) {
            "use strict";
            function i(e, t, n) {
                if (e) {
                    var i = 0
                      , o = e.length;
                    if (o === +o)
                        for (; o > i && t.call(n, e[i], i, e) !== !1; i++)
                            ;
                    else
                        for (i in e)
                            if (e.hasOwnProperty(i) && t.call(n, e[i], i, e) === !1)
                                break
                }
            }
            function o(e, t) {
                if (!t)
                    return !1;
                if (e.classList) {
                    for (var n = t.split(/\s+/), i = 0; i < n.length; i++)
                        if (!e.classList.contains(n[i]))
                            return !1;
                    return !0
                }
                return new RegExp("(\\s|^)" + t + "(\\s|$)").test(e.className)
            }
            function a(e, t) {
                t && !o(e, t) && (e.classList ? e.classList.add.apply(e.classList, t.split(/\s+/)) : e.className += " " + t)
            }
            function r(e, t) {
                t && o(e, t) && (e.classList ? e.classList.remove.apply(e.classList, t.split(/\s+/)) : e.className = e.className.replace(new RegExp("(\\s|^)" + t + "(\\s|$)"), " ").replace(/^\s+|\s+$/g, ""))
            }
            function c(e) {
                var t = [];
                for (var n in e)
                    e.hasOwnProperty(n) && t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
                return t.join("&")
            }
            function s(e) {
                for (var t = e.offsetLeft, n = e.offsetParent; null !== n; )
                    t += n.offsetLeft,
                    n = n.offsetParent;
                return t
            }
            function l(e) {
                for (var t = e.offsetTop, n = e.offsetParent; null !== n; )
                    t += n.offsetTop,
                    n = n.offsetParent;
                return t
            }
            var d = window
              , u = document
              , p = n(1)
              , f = t.rndId = function(e) {
                return ((e || "") + Math.random()).replace(".", "")
            }
            ;
            t.each = i,
            t.hasClass = o,
            t.addClass = a,
            t.removeClass = r,
            t.toggleClass = function(e, t) {
                o(e, t) ? r(e, t) : a(e, t)
            }
            ,
            t.getElementsByClassName = function(e, t, n) {
                if (t = t || u,
                n = n || "*",
                u.getElementsByClassName)
                    return t.getElementsByClassName(e);
                for (var i = [], a = "*" === n && t.all ? t.all : t.getElementsByTagName(n), r = a.length; --r >= 0; )
                    o(a[r], e) && i.push(a[r]);
                return i
            }
            ,
            t.setCookie = function(e, t, n) {
                console.log("will set cookie:", e, "->", t);
                n = n || 7;
                var i = new Date;
                i.setTime(i.getTime() + 864e5 * n),
                document.cookie = [encodeURIComponent(e), "=", encodeURIComponent("" + t), ";expires=", i.toGMTString()].join("")
            }
            ,
            t.send = function(e) {
                console.log(e);
                var t = f("_nc_r_")
                  , n = d[t] = new Image;
                n.onload = n.onerror = function() {
                    d[t] = null
                }
                ,
                n.src = e
            }
            ,
            t.obj2param = c,
            t.addHourStamp = function(e, t) {
                var n = Math.floor((new Date).getTime() / (36e5 * (t || 2)))
                  , i = -1 === e.indexOf("?") ? "?" : "&";
                return e + i + "_t=" + n
            }
            ;
            var g = {};
            t.isIEX = function(e) {
                if (e in g)
                    return g[e];
                var t = u.createElement("b");
                return t.innerHTML = "<!--[if IE " + e + "]><i></i><![endif]-->",
                g[e] = 1 === t.getElementsByTagName("i").length
            }
            ;
            var s = t.getElementLeft = function(e) {
                for (var t = e.offsetLeft, n = e.offsetParent; null !== n; )
                    t += n.offsetLeft,
                    n = n.offsetParent;
                return t
            }
              , l = t.getElementTop = function(e) {
                for (var t = e.offsetTop, n = e.offsetParent; null !== n; )
                    t += n.offsetTop,
                    n = n.offsetParent;
                return t
            }
            ;
            t.getClientRect = function(e) {
                var t = u.documentElement.scrollTop
                  , n = u.documentElement.scrollLeft;
                if (e.getBoundingClientRect) {
                    var i = e.getBoundingClientRect();
                    return {
                        left: i.left - n,
                        right: i.right - n,
                        top: i.top - t,
                        bottom: i.bottom - t
                    }
                }
                var o = s(e)
                  , a = l(e);
                return {
                    left: o,
                    right: o + e.offsetWidth,
                    top: a,
                    bottom: a + e.offsetHeight
                }
            }
            ,
            t.getOffset = function(e) {
                var t = e.target;
                void 0 === t.offsetLeft && (t = t.parentNode);
                var n = h(t)
                  , i = {
                    x: d.pageXOffset + e.clientX,
                    y: d.pageYOffset + e.clientY
                };
                return {
                    offsetX: i.x - n.x,
                    offsetY: i.y - n.y
                }
            }
            ;
            var h = t.getPageCoord = function(e) {
                for (var t = {
                    x: 0,
                    y: 0
                }; e; )
                    t.x += e.offsetLeft,
                    t.y += e.offsetTop,
                    e = e.offsetParent;
                return t
            }
              , _ = {
                before: function(e, t) {
                    return function() {
                        return e.call(this),
                        t.apply(this, arguments)
                    }
                },
                after: function(e, t) {
                    return function() {
                        var n = e.apply(this, arguments);
                        return t.call(this, n, arguments),
                        n
                    }
                }
            };
            t.decorator = _,
            t.mix = function(e) {
                for (var t, n, i = [].slice.call(arguments), o = i.length, a = 1; o > a; a++) {
                    t = i[a];
                    for (n in t)
                        t.hasOwnProperty(n) && (e[n] = t[n])
                }
                return e
            }
            ,
            t.clone = function(e) {
                var t = {};
                for (var n in e)
                    e.hasOwnProperty(n) && (t[n] = e[n]);
                return t
            }
            ,
            t.addHandler = function(e, t, n) {
                e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent && e.attachEvent("on" + t, n)
            }
            ,
            t.removeHandler = function(e, t, n) {
                e.removeEventListener ? e.removeEventListener(t, n, !1) : e.detachEvent && e.detachEvent("on" + t, n)
            }
            ,
            t.getEvent = function(e) {
                return e ? e : d.event
            }
            ,
            t.getTarget = function(e) {
                return e.target || e.srcElement
            }
            ,
            t.bind = function(e, t) {
                var n = [].slice
                  , i = n.call(arguments, 2)
                  , o = function() {}
                  , a = function() {
                    return e.apply(this instanceof o ? this : t, i.concat(n.call(arguments)))
                };
                return o.prototype = e.prototype,
                a.prototype = new o,
                a
            }
            ,
            t.imageLoaded = function(e) {
                var t = p.defer()
                  , n = new Image;
                return n.onload = function() {
                    t.resolve(this)
                }
                ,
                n.onerror = function(e) {
                    t.reject({
                        type: "img",
                        error: e
                    })
                }
                ,
                setTimeout(function() {
                    t.reject({
                        type: "img",
                        error: "timeout"
                    })
                }, 5e3),
                n.src = e,
                t.promise
            }
            ,
            t.request = function(e) {
                console.log(e);
                var t = p.defer()
                  , n = e.data || {}
                  , i = ("jsonp_" + Math.random()).replace(".", "");
                d[i] = function(e) {
                    t.resolve(e)
                }
                ,
                n[e.callback || "callback"] = i,
                t.promise.always(function() {
                    try {
                        delete d[i]
                    } catch (e) {
                        d[i] = null
                    }
                });
                var o = u.createElement("script");
                o.src = e.url + (-1 === e.url.indexOf("?") ? "?" : "&") + c(n);
                var a = u.getElementsByTagName("script")[0];
                return a.parentNode.insertBefore(o, a),
                setTimeout(function() {
                    t.reject({
                        type: "request",
                        error: "timeout"
                    })
                }, 5e3),
                t.promise
            }
            ,
            t.getElementLeft = s,
            t.getElementTop = l
        }
        , function(e, t, n) {
            "use strict";
            var i = window
              , o = n(2);
            o.loadScript = n(106).loadScript;
            var a = {};
            o.getImgSize = function(e, t) {
                a[e] && t(null, a[e]);
                var n = new Image;
                n.onreadystatechange = function() {
                    n.readyState
                }
                ,
                n.onload = function() {
                    var i = n.naturalWidth ? [n.naturalWidth, n.naturalHeight] : [n.width, n.height];
                    a[e] = i,
                    t(null, i)
                }
                ,
                n.onerror = function(e) {
                    t(e)
                }
                ,
                n.src = e
            }
            ,
            o.addEventHandler = function(e, t, n) {
                e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent ? e.attachEvent("on" + t, function(e) {
                    return n(e || i.event)
                }) : e["on" + t] = function(e) {
                    return n(e || i.event)
                }
            }
            ,
            o.on = o.addEventHandler,
            o.map = function(e, t) {
                for (var n = [], i = 0, o = e.length; o > i; i++)
                    n.push(t(e[i], i));
                return n
            }
            ,
            o.getOS = n(18),
            o.obj2style = function(e) {
                var t = ""
                  , n = void 0;
                for (n in e)
                    e.hasOwnProperty(n) && (t += n + ":" + e[n] + ";");
                return t
            }
            ,
            o.fill = function(e, t) {
                if ("function" == typeof e.fill)
                    e.fill(t);
                else
                    for (var n = 0, i = e.length; i > n; n++)
                        e[n] = t;
                return e
            }
            ,
            e.exports = o
        }
        , function(e, t, n) {
            "use strict";
            function i(e, t) {
                var n, i, a = t ? {} : e;
                for (n in e)
                    e.hasOwnProperty(n) && (i = e[n],
                    "string" == typeof i && (i = [i]),
                    a[n] = '<span class="nc-lang-cnt" data-nc-lang="' + n + '">' + o(g[n], i) + "</span>");
                return a
            }
            function o(e, t) {
                return (e + "").replace(/\\?\{\s*([^{}\s]+)\s*\}/g, function(e, n) {
                    return "\\" === e.charAt(0) ? e.slice(1) : t[n] || ""
                })
            }
            function a(e, t) {
                var n, o = h[e] = h[e] || {};
                t = i(t, !0);
                for (n in t)
                    t.hasOwnProperty(n) && (o[n] = t[n])
            }
            function r(e, t) {
                return e.replace(/(javascript:noCaptcha.reset\()(\))/gi, "$1" + t + "$2")
            }
            var c, s = "javascript:noCaptcha.reset()", l = "http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN", d = "http://survey.taobao.com/survey/40BtED_K?token=%TOKEN", u = "http://survey.taobao.com/survey/Q0dcgfAv?token=%TOKEN", p = "https://survey.taobao.com/survey/AMnMVgrS4?type=%TYPE&str=%STR", f = "{0}", g = {
                _startTEXT: f,
                _yesTEXT: "<b>{0}</b>",
                _noTEXT: f,
                _errorTEXT: f,
                _errorClickTEXT: f,
                _errorActionTimeout: '{0}<a href="{1}">{2}</a>{3}<a target="_blank" href="{4}">{5}</a>',
                _errorLOADING: '{0}<a href="{1}">{2}</a>{3}<a target="_blank" href="{4}">{5}</a>',
                _errorTooMuch: '{0}<a target="_blank" href="{1}">{2}</a>',
                _errorTooMuchClick: '{0}<a target="_blank" href="{1}">{2}</a>',
                _errorVerify: '{0}<a href="{1}">{2}</a>{3}<a target="_blank" href="{4}">{5}</a>',
                _Loading: "<b>{0}</b>",
                _errorServer: f,
                _error300: '{0}<a href="{1}">{2}</a>{3}',
                _errorNetwork: '{0}<a href="{1}">{2}</a>{3}<a target="_blank" href="{4}">{5}</a>',
                _infoTEXT: f,
                _submit: f,
                _learning: f,
                _closeHelp: f,
                _slideToVerify: f,
                _notVerified: f,
                _captcha: f,
                _OK: f,
                _sthWrong: f,
                _reload: f,
                _feedback: f,
                _cc_select: f,
                _cc_title: f,
                _cc_fail: f,
                _wait: f,
                _cc_refresh: f,
                _verify: f,
                _cancel: f,
                _retry: f,
                _cc_contact: '{0}<a href="{1}" target="_blank">{2}</a>',
                _cc_img_fail: f,
                _cc_req_fail: f,
                _close: f,
                _ggk_start: f,
                _ggk_net_err: '{0}<a href="{1}">{2}</a>{3}<a target="_blank" href="{4}">{5}</a>',
                _ggk_too_fast: '{0}<a href="{1}">{2}</a>{3}<a target="_blank" href="{4}">{5}</a>',
                _ggk_action_timeout: '{0}<a href="{1}">{2}</a>{3}<a target="_blank" href="{4}">{5}</a>',
                _ggk_fail: '{0}<a href="{1}">{2}</a>{3}<a target="_blank" href="{4}">{5}</a>',
                _ggk_success: f
            }, h = {
                cn: {
                    _startTEXT: "\u8bf7\u6309\u4f4f\u6ed1\u5757\uff0c\u62d6\u52a8\u5230\u6700\u53f3\u8fb9",
                    _yesTEXT: "\u9a8c\u8bc1\u901a\u8fc7",
                    _noTEXT: "\u8bf7\u5728\u4e0b\u65b9\u8f93\u5165\u9a8c\u8bc1\u7801",
                    _errorTEXT: "\u9a8c\u8bc1\u7801\u8f93\u5165\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165",
                    _errorClickTEXT: "\u9a8c\u8bc1\u7801\u70b9\u51fb\u9519\u8bef\uff0c\u8bf7\u91cd\u8bd5",
                    _errorLOADING: ["\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7", s, "\u70b9\u51fb\u5237\u65b0", "\uff0c\u6216", l, "\u63d0\u4ea4\u53cd\u9988"],
                    _errorTooMuch: ["\u8f93\u5165\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\uff0c\u6216", l, "\u63d0\u4ea4\u53cd\u9988"],
                    _errorTooMuchClick: ["\u70b9\u51fb\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\uff0c\u6216", l, "\u63d0\u4ea4\u53cd\u9988"],
                    _errorVerify: ["\u9a8c\u8bc1\u5931\u8d25\uff0c\u8bf7", s, "\u70b9\u51fb\u5237\u65b0", "\uff0c\u6216", l, "\u63d0\u4ea4\u53cd\u9988"],
                    _Loading: "\u52a0\u8f7d\u4e2d",
                    _errorServer: "\u670d\u52a1\u5668\u9519\u8bef\u6216\u8005\u8d85\u65f6",
                    _error300: ["\u54ce\u5440\uff0c\u51fa\u9519\u4e86\uff0c\u70b9\u51fb", s, "\u5237\u65b0", "\u518d\u6765\u4e00\u6b21"],
                    _errorNetwork: ["\u7f51\u7edc\u4e0d\u7ed9\u529b\uff0c\u8bf7", s, "\u70b9\u51fb\u5237\u65b0", "\uff0c\u6216", l, "\u63d0\u4ea4\u53cd\u9988"],
                    _infoTEXT: "",
                    _submit: "\u63d0\u4ea4",
                    _learning: "\u4e86\u89e3\u65b0\u529f\u80fd",
                    _closeHelp: "\u5173\u95ed\u5e2e\u52a9",
                    _slideToVerify: "\u5411\u53f3\u6ed1\u52a8\u9a8c\u8bc1",
                    _notVerified: "\u9a8c\u8bc1\u672a\u901a\u8fc7",
                    _captcha: "\u9a8c\u8bc1\u7801",
                    _OK: "\u786e\u5b9a",
                    _sthWrong: "\u975e\u5e38\u62b1\u6b49\uff0c\u8fd9\u51fa\u9519\u4e86...",
                    _reload: "\u5237\u65b0",
                    _feedback: "\u53cd\u9988",
                    _cc_select: "\u8bf7\u9009\u62e9\u56fe\u7247\u9a8c\u8bc1",
                    _cc_title: "\u8bf7\u9009\u62e9\u4e0b\u9762\u4e0e\u5de6\u56fe\u540c\u4e00\u7c7b\u522b\u7684\u56fe\u7247",
                    _cc_fail: "\u56fe\u7247\u9009\u62e9\u4e0d\u6b63\u786e\uff0c\u8bf7\u91cd\u8bd5",
                    _wait: "\u8bf7\u7a0d\u5019",
                    _cc_refresh: "\u6362\u4e00\u6279",
                    _verify: "\u9a8c\u8bc1",
                    _cancel: "\u53d6\u6d88",
                    _retry: "\u91cd\u8bd5",
                    _cc_contact: ["\u9047\u5230\u95ee\u9898\u4e86\uff1f", l, "\u70b9\u6b64\u53cd\u9988"],
                    _cc_img_fail: "\u56fe\u7247\u9a8c\u8bc1\u7801\u83b7\u53d6\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u8fde\u63a5\u5e76\u91cd\u8bd5\u3002",
                    _cc_req_fail: "\u65e0\u6cd5\u8fde\u63a5\u670d\u52a1\u5668\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u8fde\u63a5\u5e76\u91cd\u8bd5\u3002",
                    _close: "\u5173\u95ed",
                    _ggk_start: "\u8bf7\u5728\u6b64\u5904\u522e\u51fa\u4e24\u53ea\u5c0f\u9e21\uff0c\u65b9\u53ef\u8fdb\u5165\u4e0b\u4e00\u6b65",
                    _ggk_net_err: ["\u7f51\u7edc\u5b9e\u5728\u4e0d\u7ed9\u529b\uff0c\u8bf7", s, "\u5237\u65b0", "\u518d\u6765\u4e00\u6b21\u6216", p, "\u63d0\u4ea4\u53cd\u9988"],
                    _ggk_too_fast: ["\u60a8\u522e\u5f97\u592a\u5feb\u5566\uff0c\u8bf7\u6162\u70b9", s, "\u518d\u6765\u4e00\u6b21", "\u6216", p, "\u63d0\u4ea4\u53cd\u9988"],
                    _ggk_action_timeout: ["\u64cd\u4f5c\u8d85\u65f6\uff0c\u8bf7", s, "\u70b9\u51fb\u5237\u65b0", "\uff0c\u6216", p, "\u63d0\u4ea4\u53cd\u9988"],
                    _ggk_fail: ["\u5440\uff0c\u5c0f\u9e21\u9003\u8dd1\u4e86\uff0c\u8bf7\u91cd\u65b0", s, "\u518d\u6765\u4e00\u6b21", "\u6216", p, "\u63d0\u4ea4\u53cd\u9988"],
                    _ggk_success: "\u606d\u559c\u4f60\u6210\u529f\u522e\u51fa\u5c0f\u9e21\uff0c\u7ee7\u7eed\u4e0b\u4e00\u6b65\u64cd\u4f5c\u5427"
                },
                tw: {
                    _startTEXT: "\u8acb\u6309\u4f4f\u6ed1\u584a\uff0c\u62d6\u52d5\u5230\u6700\u53f3\u908a",
                    _yesTEXT: "\u9a57\u8b49\u901a\u904e",
                    _noTEXT: "\u8acb\u5728\u4e0b\u65b9\u8f38\u5165\u9a57\u8b49\u78bc",
                    _errorTEXT: "\u9a57\u8b49\u78bc\u8f38\u5165\u932f\u8aa4\uff0c\u8acb\u91cd\u65b0\u8f38\u5165",
                    _errorClickTEXT: "\u9a57\u8b49\u78bc\u9ede\u64ca\u932f\u8aa4\uff0c\u8acb\u91cd\u8a66",
                    _errorLOADING: ["\u52a0\u8f09\u5931\u6557\uff0c\u8acb", s, "\u9ede\u64ca\u5237\u65b0", "\uff0c\u6216", d, "\u63d0\u4ea4\u53cd\u994b"],
                    _errorTooMuch: ["\u8f38\u5165\u932f\u8aa4\uff0c\u8acb\u91cd\u65b0\u8f38\u5165\uff0c\u6216", d, "\u63d0\u4ea4\u53cd\u994b"],
                    _errorTooMuchClick: ["\u9ede\u64ca\u932f\u8aa4\uff0c\u8acb\u91cd\u65b0\u8f38\u5165\uff0c\u6216", d, "\u63d0\u4ea4\u53cd\u994b"],
                    _errorVerify: ["\u9a57\u8b49\u5931\u6557\uff0c\u8acb", s, "\u9ede\u64ca\u5237\u65b0", "\uff0c\u6216", d, "\u63d0\u4ea4\u53cd\u994b"],
                    _Loading: "\u52a0\u8f09\u4e2d",
                    _errorServer: "\u670d\u52d9\u5668\u932f\u8aa4\u6216\u8005\u8d85\u6642",
                    _error300: ["\u54ce\u5440\uff0c\u51fa\u932f\u4e86\uff0c\u9ede\u64ca", s, "\u5237\u65b0", "\u518d\u4f86\u58f9\u6b21"],
                    _errorNetwork: ["\u7db2\u7d61\u4e0d\u7d66\u529b\uff0c\u8acb", s, "\u9ede\u64ca\u5237\u65b0", "\uff0c\u6216", d, "\u63d0\u4ea4\u53cd\u994b"],
                    _infoTEXT: "",
                    _submit: "\u63d0\u4ea4",
                    _learning: "\u4e86\u89e3\u65b0\u529f\u80fd",
                    _closeHelp: "\u5173\u95ed\u5e2e\u52a9",
                    _slideToVerify: "\u5411\u53f3\u6ed1\u52d5\u9a57\u8b49",
                    _notVerified: "\u9a57\u8b49\u672a\u901a\u904e",
                    _captcha: "\u9a57\u8b49\u78bc",
                    _OK: "\u78ba\u5b9a",
                    _sthWrong: "\u975e\u5e38\u62b1\u6b49\uff0c\u9019\u51fa\u932f\u4e86...",
                    _reload: "\u5237\u65b0",
                    _feedback: "\u53cd\u994b"
                },
                en: {
                    _startTEXT: "Please slide to verify",
                    _yesTEXT: "Verified",
                    _noTEXT: "Please input verification code",
                    _errorTEXT: "Please try again",
                    _errorClickTEXT: "Please try again",
                    _errorLOADING: ["Loading failed, ", s, "refresh", " or ", u, "provide feedback"],
                    _errorTooMuch: ["Please try again or ", u, "provide feedback"],
                    _errorTooMuchClick: ["Please try again or ", u, "provide feedback"],
                    _errorVerify: ["Verify failed, ", s, "refresh", " or ", u, "provide feedback"],
                    _errorServer: "Server Error",
                    _Loading: "Loading",
                    _error300: ["Oops... something's wrong. Please ", s, "refresh", " and try again."],
                    _errorNetwork: ["Net Err. Please ", s, "refresh", ", or ", u, "feedback"],
                    _infoTEXT: "",
                    _submit: "Submit",
                    _learning: "help",
                    _closeHelp: "Close",
                    _slideToVerify: "slide to verify",
                    _notVerified: "Not Verified",
                    _captcha: "Captcha",
                    _OK: "OK",
                    _sthWrong: "Sorry, something wrong....",
                    _reload: "Reload",
                    _feedback: "Feedback",
                    _ggk_action_timeout: ["Action timeout, ", s, "refresh", " or ", u, "provide feedback"]
                }
            };
            for (c in h)
                h.hasOwnProperty(c) && i(h[c]);
            h.zh_CN = h.cn,
            h.zh_TW = h.tw,
            h.en_US = h.en,
            t.language = h,
            t.upLang = a,
            t.upResetIndex = r
        }
        , function(e, t, n) {
            "use strict";
            t.v = 845
        }
        , function(e, t) {
            function n(e, t) {
                for (var n = 0; n < e.length; n++) {
                    var i = e[n]
                      , o = p[i.id];
                    if (o) {
                        o.refs++;
                        for (var a = 0; a < o.parts.length; a++)
                            o.parts[a](i.parts[a]);
                        for (; a < i.parts.length; a++)
                            o.parts.push(s(i.parts[a], t))
                    } else {
                        for (var r = [], a = 0; a < i.parts.length; a++)
                            r.push(s(i.parts[a], t));
                        p[i.id] = {
                            id: i.id,
                            refs: 1,
                            parts: r
                        }
                    }
                }
            }
            function i(e) {
                for (var t = [], n = {}, i = 0; i < e.length; i++) {
                    var o = e[i]
                      , a = o[0]
                      , r = o[1]
                      , c = o[2]
                      , s = o[3]
                      , l = {
                        css: r,
                        media: c,
                        sourceMap: s
                    };
                    n[a] ? n[a].parts.push(l) : t.push(n[a] = {
                        id: a,
                        parts: [l]
                    })
                }
                return t
            }
            function o(e, t) {
                var n = h()
                  , i = v[v.length - 1];
                if ("top" === e.insertAt)
                    i ? i.nextSibling ? n.insertBefore(t, i.nextSibling) : n.appendChild(t) : n.insertBefore(t, n.firstChild),
                    v.push(t);
                else {
                    if ("bottom" !== e.insertAt)
                        throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
                    n.appendChild(t)
                }
            }
            function a(e) {
                e.parentNode.removeChild(e);
                var t = v.indexOf(e);
                t >= 0 && v.splice(t, 1)
            }
            function r(e) {
                var t = document.createElement("style");
                return t.type = "text/css",
                o(e, t),
                t
            }
            function c(e) {
                var t = document.createElement("link");
                return t.rel = "stylesheet",
                o(e, t),
                t
            }
            function s(e, t) {
                var n, i, o;
                if (t.singleton) {
                    var s = m++;
                    n = _ || (_ = r(t)),
                    i = l.bind(null, n, s, !1),
                    o = l.bind(null, n, s, !0)
                } else
                    e.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (n = c(t),
                    i = u.bind(null, n),
                    o = function() {
                        a(n),
                        n.href && URL.revokeObjectURL(n.href)
                    }
                    ) : (n = r(t),
                    i = d.bind(null, n),
                    o = function() {
                        a(n)
                    }
                    );
                return i(e),
                function(t) {
                    if (t) {
                        if (t.css === e.css && t.media === e.media && t.sourceMap === e.sourceMap)
                            return;
                        i(e = t)
                    } else
                        o()
                }
            }
            function l(e, t, n, i) {
                var o = n ? "" : i.css;
                if (e.styleSheet)
                    e.styleSheet.cssText = y(t, o);
                else {
                    var a = document.createTextNode(o)
                      , r = e.childNodes;
                    r[t] && e.removeChild(r[t]),
                    r.length ? e.insertBefore(a, r[t]) : e.appendChild(a)
                }
            }
            function d(e, t) {
                var n = t.css
                  , i = t.media;
                if (i && e.setAttribute("media", i),
                e.styleSheet)
                    e.styleSheet.cssText = n;
                else {
                    for (; e.firstChild; )
                        e.removeChild(e.firstChild);
                    e.appendChild(document.createTextNode(n))
                }
            }
            function u(e, t) {
                var n = t.css
                  , i = t.sourceMap;
                i && (n += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(i)))) + " */");
                var o = new Blob([n],{
                    type: "text/css"
                })
                  , a = e.href;
                e.href = URL.createObjectURL(o),
                a && URL.revokeObjectURL(a)
            }
            var p = {}
              , f = function(e) {
                var t;
                return function() {
                    return "undefined" == typeof t && (t = e.apply(this, arguments)),
                    t
                }
            }
              , g = f(function() {
                return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())
            })
              , h = f(function() {
                return document.head || document.getElementsByTagName("head")[0]
            })
              , _ = null
              , m = 0
              , v = [];
            e.exports = function(e, t) {
                if ("undefined" != typeof DEBUG && DEBUG && "object" != typeof document)
                    throw new Error("The style-loader cannot be used in a non-browser environment");
                t = t || {},
                "undefined" == typeof t.singleton && (t.singleton = g()),
                "undefined" == typeof t.insertAt && (t.insertAt = "bottom");
                var o = i(e);
                return n(o, t),
                function(e) {
                    for (var a = [], r = 0; r < o.length; r++) {
                        var c = o[r]
                          , s = p[c.id];
                        s.refs--,
                        a.push(s)
                    }
                    if (e) {
                        var l = i(e);
                        n(l, t)
                    }
                    for (var r = 0; r < a.length; r++) {
                        var s = a[r];
                        if (0 === s.refs) {
                            for (var d = 0; d < s.parts.length; d++)
                                s.parts[d]();
                            delete p[s.id]
                        }
                    }
                }
            }
            ;
            var y = function() {
                var e = [];
                return function(t, n) {
                    return e[t] = n,
                    e.filter(Boolean).join("\n")
                }
            }()
        }
        , function(e, t, n) {
            "use strict";
            e.exports = function() {
                var e = [];
                return e.toString = function() {
                    for (var e = [], t = 0; t < this.length; t++) {
                        var n = this[t];
                        n[2] ? e.push("@media " + n[2] + "{" + n[1] + "}") : e.push(n[1])
                    }
                    return e.join("")
                }
                ,
                e.i = function(t, n) {
                    "string" == typeof t && (t = [[null, t, ""]]);
                    for (var i = {}, o = 0; o < this.length; o++) {
                        var a = this[o][0];
                        "number" == typeof a && (i[a] = !0)
                    }
                    for (o = 0; o < t.length; o++) {
                        var r = t[o];
                        "number" == typeof r[0] && i[r[0]] || (n && !r[2] ? r[2] = n : n && (r[2] = "(" + r[2] + ") and (" + n + ")"),
                        e.push(r))
                    }
                }
                ,
                e
            }
        }
        , function(e, t, n) {
            "use strict";
            function i(e) {
                var t = ("_nc_r_" + Math.random()).replace(/\./, "")
                  , n = a[t] = new Image;
                n.onload = n.onerror = function() {
                    a[t] = null
                }
                ,
                n.src = e
            }
            var o = "//cf.aliyun.com/scratchCardSlide/dataReport.jsonp"
              , a = window;
            t.log = function(e) {
                var t, n, a = ["a", "t", "scene", "ns", "jsv", "usa", "p", "jsType", "os", "em", "ec"], r = [], c = a.length;
                for (t = 0; c > t; t++)
                    n = a[t],
                    e.hasOwnProperty(n) && r.push(n + "=" + encodeURIComponent(e[n]));
                r.push("r=" + Math.random()),
                i(o + "?" + r.join("&"))
            }
        }
        , function(e, t, n) {
            "use strict";
            t.names = {
                init: "init",
                ready: "ready",
                actionstart: "actionstart",
                actionend: "actionend",
                beforeverify: "beforeverify",
                afterverify: "afterverify",
                error: "error",
                fail: "fail",
                success: "success",
                switchevent: "switch",
                slide_start: "slide_start",
                slide_end: "slide_end",
                before_code: "before_code",
                after_code: "after_code",
                error300: "error300"
            },
            t.deprecated = {
                slide_start: "actionstart",
                slide_end: "actionend",
                before_code: "beforeverify",
                after_code: "afterverify",
                error300: "error"
            }
        }
        , function(e, t, n) {
            "use strict";
            var i = n(2)
              , o = {
                log: "//log.mmstat.com/",
                gm: "//gm.mmstat.com/",
                gj: "//gj.mmstat.com/"
            };
            t.mmstat_base = o;
            var a = i.isIEX(8)
              , r = i.isIEX(7)
              , c = i.isIEX(6)
              , s = !!(c || r || a)
              , l = {
                0: {
                    analyze: s ? "//cf2.aliyun.com/nocaptcha/analyze.jsonp" : "//cf.aliyun.com/nocaptcha/analyze.jsonp",
                    get_captcha: "//diablo.alibaba.com/captcha/click/get.jsonp",
                    get_captcha_pre: "//diablo.alibaba.com/captcha/click/pre_get.jsonp",
                    get_img: "//diablo.alibaba.com/captcha/image/get.jsonp",
                    get_img_pre: "//diablo.alibaba.com/captcha/image/pre_get.jsonp",
                    checkcode: s ? "//cf2.aliyun.com/captcha/checkcode.jsonp" : "//cf.aliyun.com/captcha/checkcode.jsonp",
                    cc: "//diablo.alibaba.com/diablo/captcha_api/get.jsonp",
                    cc_pre: "//diablo.alibaba.com/diablo/captcha_api/pre_get.jsonp",
                    umid_Url: "aliexpress/um.js",
                    uab_Url: "//af.alicdn.com/js/uac.js",
                    umid_serUrl: "https://ynuf.aliapp.org/service/um.json"
                },
                1: {
                    analyze: "//cfus.aliyun.com/nocaptcha/analyze.jsonp",
                    get_captcha: "//usdiablo.alibaba.com/captcha/click/get.jsonp",
                    get_captcha_pre: "//usdiablo.alibaba.com/captcha/click/pre_get.jsonp",
                    get_img: "//usdiablo.alibaba.com/captcha/image/get.jsonp",
                    get_img_pre: "//usdiablo.alibaba.com/captcha/image/pre_get.jsonp",
                    checkcode: "//cfus.aliyun.com/captcha/checkcode.jsonp",
                    cc: "//usdiablo.alibaba.com/diablo/captcha_api/get.jsonp",
                    cc_pre: "//usdiablo.alibaba.com/diablo/captcha_api/pre_get.jsonp",
                    umid_Url: "aliexpress/um.js",
                    uab_Url: "//aeu.alicdn.com/js/uab.js",
                    umid_serUrl: "https://us.ynuf.aliapp.org/service/um.json"
                },
                2: {
                    analyze: "//cfun.aliyun.com/nocaptcha/analyze.jsonp",
                    get_captcha: "//diablo.alibaba.com/captcha/click/get.jsonp",
                    get_captcha_pre: "//diablo.alibaba.com/captcha/click/pre_get.jsonp",
                    get_img: "//diablo.alibaba.com/captcha/image/get.jsonp",
                    get_img_pre: "//diablo.alibaba.com/captcha/image/pre_get.jsonp",
                    checkcode: "//cfun.aliyun.com/captcha/checkcode.jsonp",
                    cc: "//diablo.alibaba.com/diablo/captcha_api/get.jsonp",
                    cc_pre: "//diablo.alibaba.com/diablo/captcha_api/pre_get.jsonp",
                    umid_Url: "aliexpress/um.js",
                    uab_Url: "//aeu.alicdn.com/js/uab.js",
                    umid_serUrl: "https://ynuf.aliapp.org/service/um.json"
                }
            };
            t.URL_MAP = l
        }
        , , function(e, t, n) {
            "use strict";
            !function() {
                var n = {
                    VERSION: "2.4.0",
                    Result: {
                        SUCCEEDED: 1,
                        NOTRANSITION: 2,
                        CANCELLED: 3,
                        PENDING: 4
                    },
                    Error: {
                        INVALID_TRANSITION: 100,
                        PENDING_TRANSITION: 200,
                        INVALID_CALLBACK: 300
                    },
                    WILDCARD: "*",
                    ASYNC: "async",
                    create: function(e, t) {
                        var i = "string" == typeof e.initial ? {
                            state: e.initial
                        } : e.initial
                          , o = e.terminal || e["final"]
                          , a = t || e.target || {}
                          , r = e.events || []
                          , c = e.callbacks || {}
                          , s = {}
                          , l = {}
                          , d = function(e) {
                            var t = Array.isArray(e.from) ? e.from : e.from ? [e.from] : [n.WILDCARD];
                            s[e.name] = s[e.name] || {};
                            for (var i = 0; i < t.length; i++)
                                l[t[i]] = l[t[i]] || [],
                                l[t[i]].push(e.name),
                                s[e.name][t[i]] = e.to || t[i];
                            e.to && (l[e.to] = l[e.to] || [])
                        };
                        i && (i.event = i.event || "startup",
                        d({
                            name: i.event,
                            from: "none",
                            to: i.state
                        }));
                        for (var u = 0; u < r.length; u++)
                            d(r[u]);
                        for (var p in s)
                            s.hasOwnProperty(p) && (a[p] = n.buildEvent(p, s[p]));
                        for (var p in c)
                            c.hasOwnProperty(p) && (a[p] = c[p]);
                        return a.current = "none",
                        a.is = function(e) {
                            return Array.isArray(e) ? e.indexOf(this.current) >= 0 : this.current === e
                        }
                        ,
                        a.can = function(e) {
                            return !this.transition && void 0 !== s[e] && (s[e].hasOwnProperty(this.current) || s[e].hasOwnProperty(n.WILDCARD))
                        }
                        ,
                        a.cannot = function(e) {
                            return !this.can(e)
                        }
                        ,
                        a.transitions = function() {
                            return (l[this.current] || []).concat(l[n.WILDCARD] || [])
                        }
                        ,
                        a.isFinished = function() {
                            return this.is(o)
                        }
                        ,
                        a.error = e.error || function(e, t, n, i, o, a, r) {
                            throw r || a
                        }
                        ,
                        a.states = function() {
                            return Object.keys(l).sort()
                        }
                        ,
                        i && !i.defer && a[i.event](),
                        a
                    },
                    doCallback: function(e, t, i, o, a, r) {
                        if (t)
                            try {
                                return t.apply(e, [i, o, a].concat(r))
                            } catch (c) {
                                return e.error(i, o, a, r, n.Error.INVALID_CALLBACK, "an exception occurred in a caller-provided callback function", c)
                            }
                    },
                    beforeAnyEvent: function(e, t, i, o, a) {
                        return n.doCallback(e, e.onbeforeevent, t, i, o, a)
                    },
                    afterAnyEvent: function(e, t, i, o, a) {
                        return n.doCallback(e, e.onafterevent || e.onevent, t, i, o, a)
                    },
                    leaveAnyState: function(e, t, i, o, a) {
                        return n.doCallback(e, e.onleavestate, t, i, o, a)
                    },
                    enterAnyState: function(e, t, i, o, a) {
                        return n.doCallback(e, e.onenterstate || e.onstate, t, i, o, a)
                    },
                    changeState: function(e, t, i, o, a) {
                        return n.doCallback(e, e.onchangestate, t, i, o, a)
                    },
                    beforeThisEvent: function(e, t, i, o, a) {
                        return n.doCallback(e, e["onbefore" + t], t, i, o, a)
                    },
                    afterThisEvent: function(e, t, i, o, a) {
                        return n.doCallback(e, e["onafter" + t] || e["on" + t], t, i, o, a)
                    },
                    leaveThisState: function(e, t, i, o, a) {
                        return n.doCallback(e, e["onleave" + i], t, i, o, a)
                    },
                    enterThisState: function(e, t, i, o, a) {
                        return n.doCallback(e, e["onenter" + o] || e["on" + o], t, i, o, a)
                    },
                    beforeEvent: function(e, t, i, o, a) {
                        return !1 === n.beforeThisEvent(e, t, i, o, a) || !1 === n.beforeAnyEvent(e, t, i, o, a) ? !1 : void 0
                    },
                    afterEvent: function(e, t, i, o, a) {
                        n.afterThisEvent(e, t, i, o, a),
                        n.afterAnyEvent(e, t, i, o, a)
                    },
                    leaveState: function(e, t, i, o, a) {
                        var r = n.leaveThisState(e, t, i, o, a)
                          , c = n.leaveAnyState(e, t, i, o, a);
                        return !1 !== r && !1 !== c && (n.ASYNC === r || n.ASYNC === c ? n.ASYNC : void 0)
                    },
                    enterState: function(e, t, i, o, a) {
                        n.enterThisState(e, t, i, o, a),
                        n.enterAnyState(e, t, i, o, a)
                    },
                    buildEvent: function(e, t) {
                        return function() {
                            var i = this.current
                              , o = t[i] || (t[n.WILDCARD] != n.WILDCARD ? t[n.WILDCARD] : i) || i
                              , a = Array.prototype.slice.call(arguments);
                            if (this.transition)
                                return this.error(e, i, o, a, n.Error.PENDING_TRANSITION, "event " + e + " inappropriate because previous transition did not complete");
                            if (this.cannot(e))
                                return this.error(e, i, o, a, n.Error.INVALID_TRANSITION, "event " + e + " inappropriate in current state " + this.current);
                            if (!1 === n.beforeEvent(this, e, i, o, a))
                                return n.Result.CANCELLED;
                            if (i === o)
                                return n.afterEvent(this, e, i, o, a),
                                n.Result.NOTRANSITION;
                            var r = this;
                            this.transition = function() {
                                return r.transition = null,
                                r.current = o,
                                n.enterState(r, e, i, o, a),
                                n.changeState(r, e, i, o, a),
                                n.afterEvent(r, e, i, o, a),
                                n.Result.SUCCEEDED
                            }
                            ,
                            this.transition.cancel = function() {
                                r.transition = null,
                                n.afterEvent(r, e, i, o, a)
                            }
                            ;
                            var c = n.leaveState(this, e, i, o, a);
                            return !1 === c ? (this.transition = null,
                            n.Result.CANCELLED) : n.ASYNC === c ? n.Result.PENDING : this.transition ? this.transition() : void 0
                        }
                    }
                };
                "undefined" != typeof e && e.exports && (t = e.exports = n),
                t.StateMachine = n
            }()
        }
        , function(e, t, n) {
            var i = n(14);
            "string" == typeof i && (i = [[e.i, i, ""]]),
            n(6)(i, {}),
            i.locals && (e.exports = i.locals)
        }
        , function(e, t, n) {
            t = e.exports = n(7)(),
            t.push([e.i, ".nc-container div#nc-loading-circle {\n  background: transparent;\n  width: 20px;\n  height: 20px;\n  display: inline-block;\n  position: relative;\n  vertical-align: middle;\n}\n.nc-container div#nc-loading-circle .sk-circle {\n  background: transparent;\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n.nc-container #nc-loading-circle .sk-circle:before {\n  content: '';\n  display: block;\n  margin: 0 auto;\n  width: 15%;\n  height: 15%;\n  background-color: #818181;\n  border-radius: 100%;\n  -webkit-animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;\n  animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;\n}\n.nc-container #nc-loading-circle .sk-circle2 {\n  -webkit-transform: rotate(30deg);\n  -ms-transform: rotate(30deg);\n  transform: rotate(30deg);\n}\n.nc-container #nc-loading-circle .sk-circle3 {\n  -webkit-transform: rotate(60deg);\n  -ms-transform: rotate(60deg);\n  transform: rotate(60deg);\n}\n.nc-container #nc-loading-circle .sk-circle4 {\n  -webkit-transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  transform: rotate(90deg);\n}\n.nc-container #nc-loading-circle .sk-circle5 {\n  -webkit-transform: rotate(120deg);\n  -ms-transform: rotate(120deg);\n  transform: rotate(120deg);\n}\n.nc-container #nc-loading-circle .sk-circle6 {\n  -webkit-transform: rotate(150deg);\n  -ms-transform: rotate(150deg);\n  transform: rotate(150deg);\n}\n.nc-container #nc-loading-circle .sk-circle7 {\n  -webkit-transform: rotate(180deg);\n  -ms-transform: rotate(180deg);\n  transform: rotate(180deg);\n}\n.nc-container #nc-loading-circle .sk-circle8 {\n  -webkit-transform: rotate(210deg);\n  -ms-transform: rotate(210deg);\n  transform: rotate(210deg);\n}\n.nc-container #nc-loading-circle .sk-circle9 {\n  -webkit-transform: rotate(240deg);\n  -ms-transform: rotate(240deg);\n  transform: rotate(240deg);\n}\n.nc-container #nc-loading-circle .sk-circle10 {\n  -webkit-transform: rotate(270deg);\n  -ms-transform: rotate(270deg);\n  transform: rotate(270deg);\n}\n.nc-container #nc-loading-circle .sk-circle11 {\n  -webkit-transform: rotate(300deg);\n  -ms-transform: rotate(300deg);\n  transform: rotate(300deg);\n}\n.nc-container #nc-loading-circle .sk-circle12 {\n  -webkit-transform: rotate(330deg);\n  -ms-transform: rotate(330deg);\n  transform: rotate(330deg);\n}\n.nc-container #nc-loading-circle .sk-circle2:before {\n  -webkit-animation-delay: -1.1s;\n  animation-delay: -1.1s;\n}\n.nc-container #nc-loading-circle .sk-circle3:before {\n  -webkit-animation-delay: -1s;\n  animation-delay: -1s;\n}\n.nc-container #nc-loading-circle .sk-circle4:before {\n  -webkit-animation-delay: -0.9s;\n  animation-delay: -0.9s;\n}\n.nc-container #nc-loading-circle .sk-circle5:before {\n  -webkit-animation-delay: -0.8s;\n  animation-delay: -0.8s;\n}\n.nc-container #nc-loading-circle .sk-circle6:before {\n  -webkit-animation-delay: -0.7s;\n  animation-delay: -0.7s;\n}\n.nc-container #nc-loading-circle .sk-circle7:before {\n  -webkit-animation-delay: -0.6s;\n  animation-delay: -0.6s;\n}\n.nc-container #nc-loading-circle .sk-circle8:before {\n  -webkit-animation-delay: -0.5s;\n  animation-delay: -0.5s;\n}\n.nc-container #nc-loading-circle .sk-circle9:before {\n  -webkit-animation-delay: -0.4s;\n  animation-delay: -0.4s;\n}\n.nc-container #nc-loading-circle .sk-circle10:before {\n  -webkit-animation-delay: -0.3s;\n  animation-delay: -0.3s;\n}\n.nc-container #nc-loading-circle .sk-circle11:before {\n  -webkit-animation-delay: -0.2s;\n  animation-delay: -0.2s;\n}\n.nc-container #nc-loading-circle .sk-circle12:before {\n  -webkit-animation-delay: -0.1s;\n  animation-delay: -0.1s;\n}\n@-webkit-keyframes sk-circleFadeDelay {\n  0%, 39%, 100% {\n    opacity: 0;\n  }\n  40% {\n    opacity: 1;\n  }\n}\n@-webkit-keyframes sk-circleFadeDelay {\n  0%, 39%, 100% {\n    opacity: 0;\n  }\n  40% {\n    opacity: 1;\n  }\n}\n@keyframes sk-circleFadeDelay {\n  0%, 39%, 100% {\n    opacity: 0;\n  }\n  40% {\n    opacity: 1;\n  }\n}\n.nc-container .scale_text2 #nc-loading-circle .sk-circle:before {\n  background-color: #fff;\n}\n", ""])
        }
        , , , function(e, t, n) {
            "use strict";
            t.fail = function(e) {
                throw new Error("NC Fail: " + e)
            }
        }
        , function(e, t, n) {
            "use strict";
            e.exports = function() {
                var e = navigator.userAgent;
                return /Windows/.test(e) ? "win" : /Macintosh/.test(e) ? "mac" : /Android/.test(e) ? "Android" : /(iPhone|iPad)/.test(e) ? "iOS" : /Linux/.test(e) ? "linux" : "unknow"
            }
        }
        , function(e, t, n) {
            "use strict";
            function i(e, t) {
                if ("string" == typeof t && -1 !== t.indexOf(".")) {
                    var n = t.split(".")
                      , o = n[0]
                      , a = n.slice(1).join(".");
                    return e.hasOwnProperty(o) ? i(e[o], a) : ""
                }
                return e.hasOwnProperty(t) ? e[t] : ""
            }
            function o(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                return e.replace(/\{\{([\w\.]+)\}\}/g, function(e, n) {
                    return i(t, n)
                })
            }
            t.render = o
        }
        , function(e, t, n) {
            "use strict";
            function i(e) {
                var t, n = "", i = g.getElementById("umFlash");
                if (i && !n)
                    try {
                        t = i.getCookie(e) || "",
                        n = t
                    } catch (o) {}
                try {
                    f.localStorage && !n && (t = localStorage[e] || "",
                    n = t)
                } catch (o) {}
                if (f.navigator.cookieEnabled && !n) {
                    var a = g.cookie.indexOf(e + "=");
                    if (-1 != a) {
                        a += e.length + 1;
                        var r = g.cookie.indexOf(";", a);
                        -1 == r && (r = g.cookie.length),
                        t = decodeURIComponent(g.cookie.substring(a, r)) || "",
                        n = t
                    }
                }
                return n
            }
            function o(e, t, n) {
                n = n || 7;
                var i = new Date;
                i.setTime(i.getTime() + 864e5 * n),
                g.cookie = [encodeURIComponent(e), "=", encodeURIComponent("" + t), ";expires=", i.toGMTString()].join("")
            }
            function a() {
                var e, t = /Firefox/.test(navigator.userAgent);
                if (t)
                    try {
                        e = localStorage.getItem(h)
                    } catch (n) {}
                return e = e || i(h),
                e || (e = _ + r(11),
                o(h, e, 3650)),
                e
            }
            function r(e) {
                for (var t = ""; t.length < e; )
                    t += Math.random().toString().substr(2);
                return t.substring(t.length - e)
            }
            function c() {
                var e = f._sec_module = f._sec_module || {};
                if (d = e.token)
                    return d;
                var t = a();
                return d = t + _ + r(3),
                e.token = d,
                d
            }
            function s() {
                if (u)
                    return u;
                var e = "_umdata";
                try {
                    f.localStorage && (u = localStorage.getItem(e))
                } catch (t) {}
                return u ? u : (u = i(e),
                u || "")
            }
            function l() {
                return p ? p : p = s() || c()
            }
            var d, u, p, f = window, g = document, h = "_uab_collina", _ = f.pointman && pointman._now ? pointman._now : (new Date).getTime();
            t.getSecToken = c,
            t.getNCToken = l
        }
        , function(e, t, n) {
            "use strict";
            function i(e, t) {
                this.id = function(e) {
                    return 0 === e.indexOf("#") ? r.getElementById(e.slice(1)) : r.getElementById(e)
                }
                ,
                this.tag = function(e) {
                    var t = e.split(" ");
                    return this.id(t[0]).getElementsByTagName(t[1])
                }
                ,
                this.toggle = function(e) {
                    var t = this.id(e);
                    "none" == t.style.display || "" === t.style.display ? t.style.display = "block" : t.style.display = "none"
                }
                ,
                this.clone = function(e) {
                    var t, n, i = e;
                    if (e && ((n = e instanceof Array) || e instanceof Object)) {
                        i = n ? [] : {};
                        for (t in e)
                            e.hasOwnProperty(t) && (i[t] = this.clone(e[t]))
                    }
                    return i
                }
                ,
                this.extend = function(e, t, n) {
                    var i, o;
                    if (t instanceof Array)
                        for (i = 0,
                        o = t.length; o > i; i++)
                            this.extend(e, t[i], n);
                    for (i in t)
                        i in e && t.hasOwnProperty(i) && (e[i] = t[i]);
                    return e
                }
                ,
                this.objUpdate = function(e, t) {
                    var n;
                    for (n in t)
                        t.hasOwnProperty(n) && (e[n] = t[n])
                }
                ,
                this.loadjs = function(e, t, n) {
                    function i() {
                        clearTimeout(l),
                        s || (s = !0,
                        t())
                    }
                    var o = r.createElement("script");
                    o.type = "text/javascript";
                    var a = n || "";
                    c.getElementsByClassName(a),
                    o.className = a;
                    var s;
                    o.onreadystatechange = function() {
                        "loaded" != o.readyState && "complete" != o.readyState || (o.onreadystatechange = null,
                        i())
                    }
                    ,
                    o.onload = i,
                    o.src = e,
                    o.onerror = function(e) {
                        t(e),
                        o.onload = null
                    }
                    ;
                    var l = setTimeout(function() {
                        o.onerror("timeout")
                    }, 5e3)
                      , d = r.getElementsByTagName("script")[0];
                    d.parentNode.insertBefore(o, d)
                }
                ,
                this.jsonp = function(n) {
                    var i = 0;
                    n.timeout = e.timeout || 3e3,
                    n.times = e.times || 3;
                    var o;
                    if (n = n || {},
                    !n.url || !n.callback)
                        throw new Error("\u53c2\u6570\u4e0d\u5408\u6cd5");
                    var c = ("jsonp_" + Math.random()).replace(".", "")
                      , s = r.getElementsByTagName("script")[0]
                      , l = "";
                    n.data ? (n.data[n.callback] = c,
                    l += t(n.data)) : l += n.callback + "=" + c;
                    var d = r.createElement("script");
                    s.parentNode.insertBefore(d, s),
                    a[c] = function(e) {
                        a[c] = function() {
                            report("\u56de\u8c03\u5df2\u6267\u884c\u8fc7,\u4e0d\u518d\u6267\u884c"),
                            a[c] = null
                        }
                        ;
                        try {
                            d.parentNode && d.parentNode.removeChild(d)
                        } catch (t) {}
                        clearInterval(o),
                        n.success && n.success(e)
                    }
                    ,
                    d.src = n.url + (-1 == n.url.indexOf("?") ? "?" : "&") + l,
                    n.timeout && (o = setInterval(function() {
                        i++;
                        var e;
                        if (i >= n.times) {
                            a[c] = function() {}
                            ,
                            clearInterval(o);
                            try {
                                d.parentNode && d.parentNode.removeChild(d)
                            } catch (t) {}
                            n.fail(1)
                        } else
                            try {
                                d.parentNode && d.parentNode.removeChild(d),
                                d = r.createElement("script"),
                                e = r.getElementsByTagName("script")[0],
                                e.parentNode.insertBefore(d, e),
                                d.src = n.url + (-1 == n.url.indexOf("?") ? "?" : "&") + l + "&t=" + Math.random()
                            } catch (t) {}
                    }, n.timeout))
                }
                ,
                this.obj2str = function n(e) {
                    var t, i = [], a = n;
                    if ("string" == typeof e)
                        return '"' + e.replace(/(['"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + '"';
                    if ("undefined" == typeof e)
                        return "undefined";
                    if ("object" == ("undefined" == typeof e ? "undefined" : o(e))) {
                        if (null === e)
                            return "null";
                        if (e.sort) {
                            for (t = 0; t < e.length; t++)
                                i.push(a(e[t]));
                            i = "[" + i.join() + "]"
                        } else {
                            for (t in e)
                                e.hasOwnProperty(t) && i.push('"' + t + '":' + a(e[t]));
                            i = "{" + i.join() + "}"
                        }
                        return i
                    }
                    return e.toString()
                }
                ,
                this.addHandler = function(e, t, n) {
                    e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent && e.attachEvent("on" + t, n)
                }
                ,
                this.removeEvt = function(e, t, n) {
                    e.removeEventListener ? e.removeEventListener(t, n, !1) : e.detachEvent && e.detachEvent("on" + t, n)
                }
            }
            var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
              , a = window
              , r = document
              , c = n(2);
            t.BaseFun = i
        }
        , function(e, t, n) {
            "use strict";
            var i = n(20)
              , o = {
                renderTo: "",
                isEnabled: !0,
                foreign: 0,
                cssUrl: !1,
                uaUrl: "",
                appkey: "",
                trans: {},
                token: i.getNCToken(),
                elementID: "",
                audio: !1,
                timeout: 3e3,
                times: 3,
                is_Opt: 0,
                language: "cn",
                umidServer: "h",
                scene: "",
                is_tbLogin: 0,
                tb_errMsg: "",
                glog: .05,
                apimap: {},
                callback: function() {},
                error: function() {},
                verifycallback: function() {}
            };
            t.default_opt = o
        }
        , , , , , , , , , , , , , , , , , , , , , , , , function(e, t, n) {
            "use strict";
            var i = window
              , o = n(2);
            t.makeLog = function(e) {
                function t(e, t, n) {
                    var i = o.obj2param({
                        appkey: encodeURIComponent(e),
                        token: encodeURIComponent(t),
                        flag: n
                    });
                    o.send(a + "?cache=" + Math.random() + "&gmkey=evt&gokey=" + encodeURIComponent(i))
                }
                function n(t) {
                    i.console && void 0;
                    var n = e + "jstracker.2"
                      , a = o.obj2param({
                        type: "9",
                        id: "jstracker",
                        v: "1",
                        nick: "",
                        islogin: "",
                        msg: t,
                        file: "",
                        ua: "",
                        line: "",
                        scrolltop: "",
                        screen: "",
                        t: +new Date
                    });
                    o.send(n + "?" + a)
                }
                e = e || "//gm.mmstat.com/";
                var a = e + "aq.1.1.3"
                  , r = {};
                return r.log = t,
                r.report = n,
                r
            }
        }
        , function(e, t, n) {
            "use strict";
            e.exports = n(4)
        }
        , function(e, t, n) {
            "use strict";
            var i = n(3);
            t.init = function(e) {
                var t = e.fsm;
                t.onenteractiontimeout = function() {
                    i.addClass(e.el, "nc-fail")
                }
                ,
                t.onleaveactiontimeout = function() {
                    i.removeClass(e.el, "nc-fail")
                }
            }
        }
        , function(e, t, n) {
            "use strict";
            t.init = function(e) {
                var t = e.fsm;
                t.onenterdestroyed = function() {
                    e.el.innerHTML = ""
                }
                ,
                t.onleavedestroyed = function() {}
            }
        }
        , function(e, t, n) {
            "use strict";
            t.init = function(e) {
                var t = e.fsm;
                t.onentererror = function() {}
                ,
                t.onleaveerror = function() {}
            }
        }
        , function(e, t, n) {
            "use strict";
            var i = n(3);
            t.init = function(e) {
                var t = e.fsm;
                t.onenterfail = function() {
                    i.addClass(e.el, "nc-fail")
                }
                ,
                t.onleavefail = function() {
                    i.removeClass(e.el, "nc-fail")
                }
            }
        }
        , function(e, t, n) {
            "use strict";
            t.init = function(e) {
                var t = e.fsm;
                t.onenterinitially = function() {}
                ,
                t.onleaveinitially = function() {}
            }
        }
        , function(e, t, n) {
            "use strict";
            t.init = function(e) {
                var t = e.fsm;
                t.onenterload_error = function() {}
                ,
                t.onleaveload_error = function() {}
            }
        }
        , function(e, t, n) {
            "use strict";
            var i = n(128)
              , o = n(129)
              , a = n(127)
              , r = n(3)
              , c = a.names
              , s = n(1);
            t.init = function(e) {
                var t = e.fsm;
                t.onenterloading = function() {
                    var n = e.scrape || o.create(e);
                    e.scrape = n,
                    s.resolve().then(function() {
                        var t = e._custom_state._on_loading;
                        return t = Array.isArray(t) ? t : [],
                        t.length > 0 ? s.all(r.map(t, function(e) {
                            return e()
                        })) : 0
                    }).then(function() {
                        return new s(function(t, n) {
                            i.load(e, function(e) {
                                return e ? n(e) : t()
                            })
                        }
                        )
                    }).then(function() {
                        var t = e._custom_state.loading;
                        return t = Array.isArray(t) ? t : [],
                        t.length > 0 ? s.all(r.map(t, function(e) {
                            return e()
                        })) : 0
                    }).then(function() {
                        return new s(function(t, i) {
                            o.render(n, function(n) {
                                return n ? void i(n) : (e.fire(c.ready),
                                void t())
                            })
                        }
                        )
                    }).then(function() {
                        return t.load()
                    })["catch"](function(e) {
                        t.loaderror()
                    })
                }
                ,
                t.onleaveloading = function() {
                    e.on_leave_loading && e.on_leave_loading()
                }
            }
        }
        , function(e, t, n) {
            "use strict";
            t.init = function(e) {
                var t = e.fsm;
                t.onenterneed_two_step_verify = function() {}
                ,
                t.onleaveneed_two_step_verify = function() {}
            }
        }
        , function(e, t, n) {
            "use strict";
            var i = n(3);
            t.init = function(e) {
                var t = e.fsm;
                t.onenterpass = function() {
                    i.addClass(e.el, "nc-pass")
                }
                ,
                t.onleavepass = function() {
                    i.removeClass(e.el, "nc-pass")
                }
            }
        }
        , function(e, t, n) {
            "use strict";
            t.init = function(e) {
                var t = e.fsm;
                t.onenterready = function() {}
                ,
                t.onleaveready = function() {}
            }
        }
        , function(e, t, n) {
            "use strict";
            t.init = function(e) {
                var t = e.fsm;
                t.onenterreseting = function() {
                    t.resetdone()
                }
                ,
                t.onleavereseting = function() {}
            }
        }
        , function(e, t, n) {
            "use strict";
            t.init = function(e) {
                var t = e.fsm;
                t.onenterts_error = function() {}
                ,
                t.onleavets_error = function() {}
            }
        }
        , function(e, t, n) {
            "use strict";
            t.init = function(e) {
                var t = e.fsm;
                t.onenterts_fail = function() {}
                ,
                t.onleavets_fail = function() {}
            }
        }
        , function(e, t, n) {
            "use strict";
            t.init = function(e) {
                var t = e.fsm;
                t.onenterts_loading = function() {}
                ,
                t.onleavets_loading = function() {}
            }
        }
        , function(e, t, n) {
            "use strict";
            t.init = function(e) {
                var t = e.fsm;
                t.onenterts_pass = function() {}
                ,
                t.onleavets_pass = function() {}
            }
        }
        , function(e, t, n) {
            "use strict";
            t.init = function(e) {
                var t = e.fsm;
                t.onenterts_ready = function() {}
                ,
                t.onleavets_ready = function() {}
            }
        }
        , function(e, t, n) {
            "use strict";
            t.init = function(e) {
                var t = e.fsm;
                t.onenterts_verifying = function() {}
                ,
                t.onleavets_verifying = function() {}
            }
        }
        , function(e, t, n) {
            "use strict";
            t.init = function(e) {
                var t = e.fsm;
                t.onenterverifying = function() {}
                ,
                t.onleaveverifying = function() {}
            }
        }
        , function(e, t, n) {
            "use strict";
            !function(e, t) {
                var n = e.createElement("style");
                if (e.getElementsByTagName("head")[0].appendChild(n),
                n.styleSheet)
                    n.styleSheet.disabled || (n.styleSheet.cssText = t);
                else
                    try {
                        n.innerHTML = t
                    } catch (i) {
                        n.innerText = t
                    }
            }(document, '@charset "utf-8";\n@font-face{font-family:\'nc_iconfont\';src:url("//at.alicdn.com/t/font_1465353706_4784257.eot");src:url("//at.alicdn.com/t/font_1465353706_4784257.eot?#iefix") format(\'embedded-opentype\'),url("//at.alicdn.com/t/font_1465353706_4784257.woff") format(\'woff\'),url("//at.alicdn.com/t/font_1465353706_4784257.ttf") format(\'truetype\'),url("//at.alicdn.com/t/font_1465353706_4784257.svg#iconfont") format(\'svg\')}.nc-container div#nc-loading-circle{background:transparent;width:20px;height:20px;display:inline-block;position:relative;vertical-align:middle}.nc-container div#nc-loading-circle .sk-circle{background:transparent;width:100%;height:100%;position:absolute;left:0;top:0}.nc-container #nc-loading-circle .sk-circle:before{content:\'\';display:block;margin:0 auto;width:15%;height:15%;background-color:#818181;border-radius:100%;-webkit-animation:sk-circleFadeDelay 1.2s infinite ease-in-out both;animation:sk-circleFadeDelay 1.2s infinite ease-in-out both}.nc-container #nc-loading-circle .sk-circle2{-webkit-transform:rotate(30deg);-ms-transform:rotate(30deg);transform:rotate(30deg)}.nc-container #nc-loading-circle .sk-circle3{-webkit-transform:rotate(60deg);-ms-transform:rotate(60deg);transform:rotate(60deg)}.nc-container #nc-loading-circle .sk-circle4{-webkit-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg)}.nc-container #nc-loading-circle .sk-circle5{-webkit-transform:rotate(120deg);-ms-transform:rotate(120deg);transform:rotate(120deg)}.nc-container #nc-loading-circle .sk-circle6{-webkit-transform:rotate(150deg);-ms-transform:rotate(150deg);transform:rotate(150deg)}.nc-container #nc-loading-circle .sk-circle7{-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg)}.nc-container #nc-loading-circle .sk-circle8{-webkit-transform:rotate(210deg);-ms-transform:rotate(210deg);transform:rotate(210deg)}.nc-container #nc-loading-circle .sk-circle9{-webkit-transform:rotate(240deg);-ms-transform:rotate(240deg);transform:rotate(240deg)}.nc-container #nc-loading-circle .sk-circle10{-webkit-transform:rotate(270deg);-ms-transform:rotate(270deg);transform:rotate(270deg)}.nc-container #nc-loading-circle .sk-circle11{-webkit-transform:rotate(300deg);-ms-transform:rotate(300deg);transform:rotate(300deg)}.nc-container #nc-loading-circle .sk-circle12{-webkit-transform:rotate(330deg);-ms-transform:rotate(330deg);transform:rotate(330deg)}.nc-container #nc-loading-circle .sk-circle2:before{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.nc-container #nc-loading-circle .sk-circle3:before{-webkit-animation-delay:-1s;animation-delay:-1s}.nc-container #nc-loading-circle .sk-circle4:before{-webkit-animation-delay:-.9s;animation-delay:-.9s}.nc-container #nc-loading-circle .sk-circle5:before{-webkit-animation-delay:-.8s;animation-delay:-.8s}.nc-container #nc-loading-circle .sk-circle6:before{-webkit-animation-delay:-.7s;animation-delay:-.7s}.nc-container #nc-loading-circle .sk-circle7:before{-webkit-animation-delay:-.6s;animation-delay:-.6s}.nc-container #nc-loading-circle .sk-circle8:before{-webkit-animation-delay:-.5s;animation-delay:-.5s}.nc-container #nc-loading-circle .sk-circle9:before{-webkit-animation-delay:-.4s;animation-delay:-.4s}.nc-container #nc-loading-circle .sk-circle10:before{-webkit-animation-delay:-.3s;animation-delay:-.3s}.nc-container #nc-loading-circle .sk-circle11:before{-webkit-animation-delay:-.2s;animation-delay:-.2s}.nc-container #nc-loading-circle .sk-circle12:before{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes sk-circleFadeDelay{0%,39%,100%{opacity:0}40%{opacity:1}}@-webkit-keyframes sk-circleFadeDelay{0%,39%,100%{opacity:0}40%{opacity:1}}@keyframes sk-circleFadeDelay{0%,39%,100%{opacity:0}40%{opacity:1}}.nc-container .scale_text2 #nc-loading-circle .sk-circle:before{background-color:#fff}.nc_iconfont{font-family:"nc_iconfont";color:#ff3f08;font-size:16px;font-style:normal}.captcha-error .icon_ban{float:left;font-size:16px;padding-right:5px;line-height:14px}.clickCaptcha_text .btn_refresh{font-style:normal;cursor:pointer;background:#fff;color:#737383}.imgCaptcha .btn_refresh{font-size:20px;cursor:pointer;background:#fff;color:#737383}.nc_voice{display:none;position:relative;margin-top:-34px;z-index:99;width:auto;height:34px;background:#fff}.omeo-code-img,.omeo-code-audio{font-size:0;text-align:left}.omeo-code-audiobox,.omeo-code-img a,.omeo-code-audio a,.omeo-code-state{display:inline-block;*display:inline;zoom:1;height:32px;vertical-align:top;font-size:12px}.omeo-code .omeo-code-refresh{background:transparent;width:32px;height:32px;font-size:20px;color:#888;text-align:center;text-decoration:none;padding-left:4px;line-height:32px}.omeo-code .omeo-switch{display:none;width:32px;height:32px;border-left:1px solid #e1e1e1;background-image:url("//aeis.alicdn.com/sd/ncpc/images/checkcode.png");background-repeat:no-repeat}.omeo-img-active .omeo-code-img{display:block}.omeo-img-active .omeo-code-audio{display:none}.omeo-code-img img{border:1px solid #cdcdcd;cursor:pointer}.omeo-code-img .omeo-switch{background-position:9px -41px}.omeo-audio-active .omeo-code-audio{display:block}.omeo-audio-active .omeo-code-img{display:none}.omeo-code-refresh{position:relative;left:95px}.omeo-code-audiobox{position:relative;height:30px;line-height:32px;border:1px solid #e1e1e1;text-align:center;overflow:hidden;left:100px;top:1px;width:45%;min-width:80px;background-color:#eee}.omeo-code-audiobox a{display:block;text-decoration:none;color:#06c}.omeo-code-audiobox-playing a{visibility:hidden}.omeo-code-audiobox span,.omeo-code-audiobox b{visibility:hidden;position:absolute;top:0;left:0;height:30px;font-weight:100;overflow:hidden}.omeo-code-audiobox-playing span,.omeo-code-audiobox-playing b{visibility:visible}.omeo-code-audiobox span{z-index:0;width:0;background:#186bca}.omeo-code-audiobox b{width:100%;z-index:1;text-align:left;text-indent:30px;color:#999;background:url("//aeis.alicdn.com/sd/ncpc/images/checkcode.png") no-repeat 14px -89px}.omeo-code-audio .omeo-switch{background-position:5px 10px}input[type=text]::-ms-clear{display:none}.omeo-box{position:relative;background-color:#fff}.omeo-code-echo{position:absolute;top:2px;left:2px}.omeo-code-echo input{padding:5px;height:18px;line-height:18px;border:1px solid #ddd;width:80px;outline:0}.omeo-code-state{height:30px;line-height:30px;text-indent:25px;white-space:nowrap;background-image:url("//aeis.alicdn.com/sd/ncpc/images/checkcode.png");background-repeat:no-repeat;background-position:100px 100px}.omeo-code-echo .omeo-code-state-error{width:auto;background-position:7px -193px}.omeo-code-echo .omeo-code-state-success{position:absolute;width:30px;background-position:7px -243px}.omeo-code-state{position:absolute;left:0;top:28px}.nc_voice_close{display:inline-block;position:relative;cursor:pointer;left:95px;top:0;border-left:#ddd 2px solid;padding:0 0 0 7px;background-color:#fff;font-size:20px;color:#888;line-height:32px}.nc_help{position:absolute;width:100%;height:100%;left:0;top:0;z-index:99999}.nc_help .mask{background-color:#000;opacity:.5;filter:alpha(opacity=50);width:100%;height:100%;top:0;left:0}.nc_btn_close{position:absolute;height:20px;left:500px;border-radius:20px;padding:10px 30px;background-color:#aaa;color:#fff;cursor:pointer;z-index:10}.nc_btn_close:hover{background-color:#afafaf}.nc_hand{position:absolute;width:68px;height:53px;background-image:url("//aeis.alicdn.com/sd/ncpc/images/hand.png");z-index:3}.nc_slide_bg{z-index:3;font-size:12px;text-align:center;color:#fff;line-height:34px}.nc_voicebtn{position:absolute;padding:0;right:-25px;font-size:23px;color:#888;cursor:pointer;line-height:34px}.nc_helpbtn{position:absolute;cursor:pointer;right:-95px;top:4px;font-size:12px;background-color:#ffb668;color:#fff;padding:4px;border-radius:2px;line-height:18px;display:none}.nc_helpbtn:before{width:0;height:0;content:"";position:absolute;left:-2px;top:6px;border-top:4px solid transparent;border-bottom:4px solid transparent;border-right:4px solid #ffb668}.nc-container .errloading{border:#faf1d5 1px solid;text-indent:3px;background-image:none;font-size:12px;width:290px;line-height:20px;padding:7px 5px 8px 5px;color:#ef9f06;}.nc-container .errloading a{color:#30a7fc}.nc_captcha_text .nc_err{float:left;text-indent:0}.button_move{transition:left .5s;-moz-transition:left .5s;-webkit-transition:left .5s;-o-transition:left .5s}.bg_move{transition:width .5s;-moz-transition:width .5s;-webkit-transition:width .5s;-o-transition:width .5s}.nc_slide_box{position:absolute}.nc_captcha_text{height:auto;line-height:20px;visibility:hidden;font-size:12px;color:#999;font-weight:normal}.nc-container .nc_captcha_img_text{width:auto;height:auto;line-height:20px;visibility:hidden;font-size:12px;color:#999;font-weight:normal;display:none;padding:0 0 10px 0;background-position:0 0;}.nc-container .nc_captcha_img_text span.nc-lang-cnt{line-height:inherit}.nc-container .imgCaptcha .nc_captcha_img_text{width:auto}.nc_captcha_img_text{height:auto;line-height:20px;visibility:hidden;font-size:12px;color:#999;font-weight:normal;display:none;padding:0 0 10px 3px;background-position:0 0}.nc-container .nc_wrapper{width:auto}.nc_scale{width:auto;height:34px;background:#e8e8e8;position:relative;margin:0;padding:0}.nc_scale.is_audio{margin-right:25px}.nc-container .nc_scale div{height:auto}.nc-container .nc_scale ul{list-style:none}.nc-container .nc_scale .btn_slide{color:#737383;background-image:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.nc-container .nc_scale span{text-align:center;width:40px;height:32px;line-height:32px;border:1px solid #ccc;position:absolute;left:0;cursor:move;background:#fff;z-index:2}.nc-container .nc_scale span.nc-lang-cnt{*line-height:34px;float:none;width:auto;height:auto;*height:34px;border:none;position:static;cursor:inherit;background:none;z-index:0;display:inline}.nc_slide_button{width:40px;height:32px;border:1px solid #ccc;position:absolute;left:0;cursor:move;background:#fff url("//aeis.alicdn.com/sd/ncpc/images/rt.png") no-repeat center;z-index:2}@media screen and (-ms-high-contrast:active),(-ms-high-contrast:none){.nc_scale span{height:32px}}.nc-container .nc_scale .btnok{cursor:default;background:#fff url("//aeis.alicdn.com/sd/ncpc/images/yes.png") no-repeat center;z-index:3}.nc-container .nc_scale .btnok2{cursor:default;font-size:20px;background:#fff url("//aeis.alicdn.com/sd/ncpc/images/no.png") no-repeat center;z-index:3}.nc-container .nc_scale .btn_warn{cursor:default;color:#ff3f08;line-height:34px;text-align:center;font-size:20px;background:#fff;z-index:3}.nc-container .clickCaptcha_text .btn_refresh{font-size:20px}.nc-container .clickCaptcha_text .icon_close{line-height:30px;margin-left:8px;cursor:default;color:#ff3f08;font-size:16px;float:left;margin-right:2px;background:transparent;z-index:3}.nc-container .nc_captcha_img_text .icon_close{cursor:default;color:#ff3f08;font-size:16px;float:left;margin-right:4px;background:transparent;z-index:3;line-height:18px}.nc-container .errloading .icon_warn{cursor:default;color:#ff3f08;font-size:18px;float:left;background:transparent;z-index:3}.nc-container .nc_scale .btn_ok{cursor:default;line-height:34px;text-align:center;font-size:20px;background:#fff;z-index:3;color:#76c61d}.nc-container .nc_scale .nc_ok,.nc-container .nc_scale .nc_bg{background:#7ac23c}.nc-container .nc_scale .nc_bg{position:absolute;height:100%;_height:34px;left:0;width:10px}.nc-container .nc_scale div.redbar{background:#fc461e;opacity:.5;filter:alpha(opacity=50)}.nc-container .nc_scale div.orange{background:#f00}.nc-container .nc_scale .scale_text{width:100%;height:100%;text-align:center;position:absolute;z-index:1;background:transparent;color:#9c9c9c;line-height:34px;font-size:12px;cursor:pointer}.nc-container .nc_scale .scale_text2{text-align:left;color:#fff;font-size:12px;text-indent:10px}.nc-container .nc_scale .scale_text2 b{padding-left:0;font-weight:normal}.nc-container .nc_scale .scale_text.scale_loading_text{text-align:center}.nc-container .nc_scale .imgCaptcha,.nc-container .nc_scale .clickCaptcha{display:none;overflow:hidden;border:1px solid #ccc;background:#fff;z-index:20000;}.nc-container .nc_scale .imgCaptcha p.error span,.nc-container .nc_scale .clickCaptcha p.error span{line-height:normal}.nc-container .nc_scale .imgCaptcha{height:auto}.nc-container .nc_scale .clickCaptcha{position:absolute;left:0;top:35px;height:270px;background:#fff;display:none;}.nc-container .nc_scale .clickCaptcha p.error i{color:#ff3f08;font-style:normal}.nc-container .nc_scale .clickCaptcha div{position:static;clear:both;width:100%;background:#fff;height:auto}.nc-container .nc_scale .clickCaptcha .clickCaptcha_text{height:30px;line-height:30px;font-size:12px;color:#999;}.nc-container .nc_scale .clickCaptcha .clickCaptcha_text b{font-weight:normal}.nc_btn_2{position:absolute;right:0;top:0;cursor:pointer;margin:2px 9px 0 0}.nc_iconfont.nc_btn_2{position:absolute;right:0;top:0;cursor:pointer}.nc_iconfont.nc_btn_1{position:absolute;top:10px;right:5px}.nc_btn_1{top:10px;right:10px}.scale_text i{font-style:normal;border:none;position:static;cursor:default;color:#fffc00;background:none;display:inline;width:100%}.nc-container .clickCaptcha .clickCaptcha_img{margin:0 auto;clear:both;position:relative;}.nc-container .clickCaptcha .clickCaptcha_img img{width:230px;height:230px;margin-left:10px;margin-top:5px}.nc-container .clickCaptcha .clickCaptcha_btn{margin:10px 0 0 15px;position:relative;text-align:left;}.nc-container .clickCaptcha .clickCaptcha_btn img{cursor:pointer}.nc-container .imgCaptcha{position:absolute;left:0;top:35px;height:auto;padding-bottom:15px;border:1px solid #ccc;background:#fff;}.nc-container .imgCaptcha div{position:static;width:90%;background-color:#fff}.nc-container .imgCaptcha,.nc-container .clickCaptcha{text-align:left;}.nc-container .imgCaptcha a,.nc-container .clickCaptcha a{color:#ff3f08}.nc-container .imgCaptcha .imgCaptcha_text{height:42px;line-height:42px;width:120px;background:#fff;font-size:14px;text-align:left;color:#747474;float:left;margin-left:10px;}.nc-container .imgCaptcha .imgCaptcha_text input{margin-top:5px;height:30px;line-height:30px;font-size:14px;width:90px;background:#fff}.nc-container .imgCaptcha .imgCaptcha_text input:focus{outline:none;color:#bbb}.nc-container .imgCaptcha .imgCaptcha_btn{margin:0 0 0 12px;*margin-left:0;clear:both;padding-top:5px;width:90%;}.nc-container .imgCaptcha .imgCaptcha_btn img{cursor:pointer}.nc-container .imgCaptcha .nc_scale_submit{margin:0 auto;cursor:pointer;background-color:#fc461e;width:120px;height:32px;line-height:32px;color:#fff;text-align:center}.nc-container .imgCaptcha .imgCaptcha_img{margin:4px 0 0 100px;height:40px;width:130px;overflow:hidden;cursor:pointer;}.nc-container .imgCaptcha .imgCaptcha_img img{width:130px}.nc-container .imgCaptcha .imgCaptcha_img input{border:solid 1px #ccc}.nc-lang-ar_MA,.nc-lang-ar_SA,.nc-lang-iw_HE,.nc-lang-iw_IL{text-align:right;*text-align:left;}.nc-lang-ar_MA .nc_scale .scale_text2,.nc-lang-ar_SA .nc_scale .scale_text2,.nc-lang-iw_HE .nc_scale .scale_text2,.nc-lang-iw_IL .nc_scale .scale_text2{text-align:right;}.nc-lang-ar_MA .nc_scale .scale_text2 span,.nc-lang-ar_SA .nc_scale .scale_text2 span,.nc-lang-iw_HE .nc_scale .scale_text2 span,.nc-lang-iw_IL .nc_scale .scale_text2 span{*display:inline-block;padding:0 56px 0 0}.nc-lang-ar_MA .nc_captcha_img_text,.nc-lang-ar_SA .nc_captcha_img_text,.nc-lang-iw_HE .nc_captcha_img_text,.nc-lang-iw_IL .nc_captcha_img_text{*text-align:right}.nc-lang-ar_MA span.nc-lang-cnt,.nc-lang-ar_SA span.nc-lang-cnt,.nc-lang-iw_HE span.nc-lang-cnt,.nc-lang-iw_IL span.nc-lang-cnt{text-align:right;direction:rtl}.nocaptcha span.nc-lang-cnt{float:none;height:auto;line-height:30px}.nc-container{font-size:12px;-ms-touch-action:none;touch-action:none;}.nc-container p{margin:0;padding:0;display:inline}.nc-container .scale_text.scale_text span[data-nc-lang="_startTEXT"]{display:inline-block;width:100%}.nc-container .scale_text.scale_text.slidetounlock span[data-nc-lang="_startTEXT"]{background:-webkit-gradient(linear,left top,right top,color-stop(0,#4d4d4d),color-stop(.4,#4d4d4d),color-stop(.5,#fff),color-stop(.6,#4d4d4d),color-stop(1,#4d4d4d));-webkit-background-clip:text;-webkit-text-fill-color:transparent;-webkit-animation:slidetounlock 3s infinite;-webkit-text-size-adjust:none}.nc-container .nc_scale .nc-align-center.scale_text2{text-align:center;text-indent:-42px}@-webkit-keyframes slidetounlock{0%{background-position:-200px 0}100%{background-position:200px 0}}.nc-container.tb-login .clickCaptcha_text .icon_close{line-height:30px;margin-left:0;cursor:default;color:#ff3f08;font-size:16px;float:left;margin-right:0;background:transparent;z-index:3}.nc-container.tb-login{position:relative;margin-top:20px;display:none;}.nc-container.tb-login .nc_scale{width:auto;}.nc-container.tb-login .nc_scale .scale_text2{text-indent:-42px;text-align:center;}.nc-container.tb-login .nc_scale .scale_text2 b{padding:0}.nc-container.tb-login .nc_scale.nc_err div.scale_text{background:#f79977}.nc-container.tb-login .errloading{width:auto}.nc-container.tb-login .imgCaptcha,.nc-container.tb-login .clickCaptcha{width:252px;*width:256px;border:0;*height:300px;min-height:300px;max-height:inherit !important;}.nc-container.tb-login .imgCaptcha div.login-msg.error,.nc-container.tb-login .clickCaptcha div.login-msg.error{background:#fff2f2}.nc-container.tb-login .imgCaptcha .captcha-error,.nc-container.tb-login .clickCaptcha .captcha-error{position:absolute;top:0;width:244px;height:auto;margin-bottom:15px;padding:3px;border:solid 1px #ff8e8e;line-height:18px}.nc-container.tb-login .imgCaptcha .captcha-inform,.nc-container.tb-login .clickCaptcha .captcha-inform{font-size:110%;margin-left:20px}.nc-container.tb-login .imgCaptcha{padding-top:66px;}.nc-container.tb-login .imgCaptcha .imgCaptcha_text{width:100px;margin-left:0;}.nc-container.tb-login .imgCaptcha .imgCaptcha_text input:focus{color:#000}.nc-container.tb-login .imgCaptcha .imgCaptcha_img{width:120px;_width:100px}.nc-container.tb-login .imgCaptcha .imgCaptcha_btn{width:100%;margin-left:0}.nc-container.tb-login .imgCaptcha .nc_scale_submit{width:100%;height:36px;line-height:36px;margin-top:20px;margin-left:0;border-radius:3px;font-size:16px;font-family:Tahoma,Helvetica,Arial,sans-serif;background:#ff3f08}.nc-container.tb-login .clickCaptcha{padding-top:40px;}.nc-container.tb-login .clickCaptcha .clickCaptcha_text{text-indent:4px}.nc-container.tb-login .clickCaptcha .clickCaptcha_img img{margin-left:10px}.nc-container.tb-login .nc_btn_1{top:77px;_top:57px}.nc-container.tb-login .nc_btn_2{top:36px}.login .nc-container.tb-login .login-msg p,.login-box .nc-container.tb-login .login-msg p{width:auto;float:left}.nc-container.tb-login.nc-old-login{margin:20px 0 10px 0;width:250px;}.nc-container.tb-login.nc-old-login .nc_wrapper{width:250px}.nc-container.tb-login.nc-old-login .imgCaptcha,.nc-container.tb-login.nc-old-login .clickCaptcha{width:250px;min-height:auto;}.nc-container.tb-login.nc-old-login .imgCaptcha .captcha-error,.nc-container.tb-login.nc-old-login .clickCaptcha .captcha-error{line-height:16px}.nc-container.tb-login.nc-old-login .clickCaptcha{padding-top:28px;}.nc-container.tb-login.nc-old-login .clickCaptcha .clickCaptcha_img img{width:200px;height:200px}.nc-container.nc-old-login.show-click-captcha{padding-bottom:60px}.nc-container.nc-old-login.show-click-captcha.nc-tm-min-fix{padding-bottom:40px}.nc-container.tb-login.nc-tm-min-fix .clickCaptcha{max-height:340px !important}#content .login-box .bd .nc-container.tb-login .login-msg{margin:10px auto 15px auto}#content .login-box .bd .nc-container.tb-login.nc-old-login.show-click-captcha .login-msg{margin:2px 0 0 0}.nc-container .nc_scale .nc-cc{display:none;position:absolute;left:0;top:35px;z-index:20000;width:360px;height:570px;border:1px solid #5eaef1;border-radius:4px;background:#fff;font-size:14px;line-height:18px;color:#333;}.nc-container .nc_scale .nc-cc.nc-cc-status-loading .nc-cc-btn,.nc-container .nc_scale .nc-cc.nc-cc-status-verifing .nc-cc-btn{background-color:#90c1eb}.nc-container .nc_scale .nc-cc.nc-cc-status-loading .nc-cc-btn,.nc-container .nc_scale .nc-cc.nc-cc-status-verifing .nc-cc-btn,.nc-container .nc_scale .nc-cc.nc-cc-status-loading .nc-cc-refresh,.nc-container .nc_scale .nc-cc.nc-cc-status-verifing .nc-cc-refresh{cursor:default}.nc-container .nc_scale .nc-cc.nc-cc-status-loading .nc-cc-refresh,.nc-container .nc_scale .nc-cc.nc-cc-status-verifing .nc-cc-refresh{color:#999}.nc-container .nc_scale .nc-cc a{color:#3199f4;text-decoration:none}.nc-container .nc_scale .nc-cc .nc_iconfont{vertical-align:top;margin-right:8px}.nc-container .nc_scale .nc-cc-btn{display:inline-block;*display:inline;*zoom:1;vertical-align:top;letter-spacing:normal;word-spacing:normal;width:100px;line-height:30px;text-align:center;background-color:#3199f4;color:#fff;border-radius:4px;cursor:pointer;}.nc-container .nc_scale .nc-cc-btn.nc-cc-disabled{background-color:#90c1eb;cursor:default}.nc-container .nc_scale .nc-cc-btn .nc-lang-cnt{line-height:18px}.nc-container .nc_scale .nc-cc-header{padding:20px 20px 19px 20px;height:100px;background:#f4f8fa;border-bottom:1px solid #ccc}.nc-container .nc_scale .nc-cc-img1-box{float:left;width:100px;height:100px;margin-right:16px}.nc-container .nc_scale .nc-cc-txt{overflow:hidden;*zoom:1;line-height:30px;padding-top:11px}.nc-container .nc_scale .nc-cc-img2-box{position:relative;padding:0 20px;margin-top:20px}.nc-container .nc_scale .nc-cc-items{position:absolute;left:20px;_left:0;top:0;width:320px;overflow:hidden}.nc-container .nc_scale .nc-cc-items-inner{margin-right:-20px}.nc-container .nc_scale .nc-cc-item{position:relative;display:inline-block;*display:inline;*zoom:1;vertical-align:top;letter-spacing:normal;word-spacing:normal;margin-right:10px;margin-bottom:10px;border:1px solid #ccc;width:98px;height:98px;background:url("//gtms02.alicdn.com/tps/i2/T1ty2QFNNXXXc6Yc2r-1-1.gif");}.nc-container .nc_scale .nc-cc-item:hover{border-color:#3199f4}.nc-container .nc_scale .nc-cc-item .nc_iconfont{display:none;position:absolute;right:0;bottom:0;color:#3199f4;font-size:22px;margin-right:0}.nc-container .nc_scale .nc-cc-item.nc-cc-selected .nc_iconfont{display:block}.nc-container .nc_scale .nc-cc-tip{display:none;position:absolute;left:0;bottom:60px;width:360px;line-height:18px;text-align:center;color:#eb4f38;}.nc-container .nc_scale .nc-cc-tip span{line-height:normal}.nc-container .nc_scale .nc-cc-footer{position:absolute;left:0;bottom:20px;width:360px;height:30px;line-height:30px;text-align:center;}.nc-container .nc_scale .nc-cc-footer .nc_iconfont{color:#c4cbd0}.nc-container .nc_scale .nc-cc-refresh,.nc-container .nc_scale .nc-cc-wait{position:absolute;left:20px;top:0;color:#3199f4;cursor:pointer}.nc-container .nc_scale .nc-cc-wait{display:none}.nc-container .nc_scale .nc-cc-cancel{position:absolute;right:20px;top:0;color:#3199f4;cursor:pointer;}.nc-container .nc_scale .nc-cc-cancel .nc_iconfont{position:relative;top:-1px}.nc-container .nc_scale .nc-cc-loading{margin-top:247px;text-align:center;line-height:14px}.nc-container .nc_scale .nc-cc-loading-img{display:inline-block;*display:inline;*zoom:1;vertical-align:top;letter-spacing:normal;word-spacing:normal;vertical-align:middle;background:url("//imaeis.alicdn.com/tps/TB1OdxsKpXXXXcgXFXXXXXXXXXX-14-14.gif") no-repeat;width:14px;height:14px;position:relative;top:-1px;margin-right:9px}.nc-container .nc_scale .nc-cc-fail{position:absolute;left:50%;top:50%;width:320px;height:180px;margin-left:-160px;margin-top:-90px;background:#fff;border-radius:4px}.nc-container .nc_scale .nc-cc-fail-inner{text-align:center;padding:55px 10px 10px}.nc-container .nc_scale .nc-cc-fail-action{margin:28px 0 18px;}.nc-container .nc_scale .nc-cc-fail-action a{display:inline-block;*display:inline;*zoom:1;vertical-align:top;letter-spacing:normal;word-spacing:normal;line-height:30px;margin-left:16px}.nc-container .nc_scale .nc-cc-contact{text-align:right;color:#666;padding-right:9px}.nc-container .nc_scale .nc-cc-mask{display:none;position:absolute;left:0;top:0;width:360px;height:570px;background:rgba(0,0,0,0.3);filter:progid:DXImageTransform.Microsoft.gradient(enabled=\'true\',startColorstr=\'#4C000000\', endColorstr=\'#4C000000\');}:root .nc-container .nc_scale .nc-cc-mask{-webkit-filter:none;filter:none}.nc-container .nc_scale .nc-cc-arrow-1,.nc-container .nc_scale .nc-cc-arrow-2{display:none;position:absolute;top:340px;border:solid transparent;height:0;width:0}.nc-container .nc_scale .nc-cc-arrow-1{border-width:16px;margin-top:-1px}.nc-container .nc_scale .nc-cc-arrow-2{border-width:15px}.nc-container .nc_scale .nc-cc-right .nc-cc-arrow-1,.nc-container .nc_scale .nc-cc-left .nc-cc-arrow-1,.nc-container .nc_scale .nc-cc-right .nc-cc-arrow-2,.nc-container .nc_scale .nc-cc-left .nc-cc-arrow-2{display:block;_display:none}.nc-container .nc_scale .nc-cc-right{left:180px;top:-339px;}.nc-container .nc_scale .nc-cc-right .nc-cc-arrow-1{border-right-color:#5eaef1;left:-32px}.nc-container .nc_scale .nc-cc-right .nc-cc-arrow-2{border-right-color:#fff;left:-30px}.nc-container .nc_scale .nc-cc-left{left:-335px;top:-339px;}.nc-container .nc_scale .nc-cc-left .nc-cc-arrow-1{border-left-color:#5eaef1;right:-32px}.nc-container .nc_scale .nc-cc-left .nc-cc-arrow-2{border-left-color:#fff;right:-30px}');
        }
        , , function(e, t, n) {
            "use strict";
            var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            ;
            Object.getPrototypeOf || (Object.getPrototypeOf = function(e) {
                if (e !== Object(e))
                    throw TypeError("Object.getPrototypeOf called on non-object");
                return e.__proto__ || e.constructor.prototype || Object.prototype
            }
            ),
            "function" != typeof Object.getOwnPropertyNames && (Object.getOwnPropertyNames = function(e) {
                if (e !== Object(e))
                    throw TypeError("Object.getOwnPropertyNames called on non-object");
                var t, n = [];
                for (t in e)
                    Object.prototype.hasOwnProperty.call(e, t) && n.push(t);
                return n
            }
            ),
            "function" != typeof Object.create && (Object.create = function(e, t) {
                function n() {}
                if ("object" !== ("undefined" == typeof e ? "undefined" : i(e)))
                    throw TypeError();
                n.prototype = e;
                var o = new n;
                if (e && (o.constructor = n),
                void 0 !== t) {
                    if (t !== Object(t))
                        throw TypeError();
                    Object.defineProperties(o, t)
                }
                return o
            }
            ),
            function() {
                if (!Object.defineProperty || !function() {
                    try {
                        return Object.defineProperty({}, "x", {}),
                        !0
                    } catch (e) {
                        return !1
                    }
                }()) {
                    var e = Object.defineProperty;
                    Object.defineProperty = function(t, n, i) {
                        if (e)
                            try {
                                return e(t, n, i)
                            } catch (o) {}
                        if (t !== Object(t))
                            throw TypeError("Object.defineProperty called on non-object");
                        return Object.prototype.__defineGetter__ && "get"in i && Object.prototype.__defineGetter__.call(t, n, i.get),
                        Object.prototype.__defineSetter__ && "set"in i && Object.prototype.__defineSetter__.call(t, n, i.set),
                        "value"in i && (t[n] = i.value),
                        t
                    }
                }
            }(),
            "function" != typeof Object.defineProperties && (Object.defineProperties = function(e, t) {
                if (e !== Object(e))
                    throw TypeError("Object.defineProperties called on non-object");
                var n;
                for (n in t)
                    Object.prototype.hasOwnProperty.call(t, n) && Object.defineProperty(e, n, t[n]);
                return e
            }
            ),
            Object.keys || (Object.keys = function(e) {
                if (e !== Object(e))
                    throw TypeError("Object.keys called on non-object");
                var t, n = [];
                for (t in e)
                    Object.prototype.hasOwnProperty.call(e, t) && n.push(t);
                return n
            }
            ),
            Function.prototype.bind || (Function.prototype.bind = function(e) {
                if ("function" != typeof this)
                    throw TypeError("Bind must be called on a function");
                var t = Array.prototype.slice.call(arguments, 1)
                  , n = this
                  , i = function() {}
                  , o = function() {
                    return n.apply(this instanceof i ? this : e, t.concat(Array.prototype.slice.call(arguments)))
                };
                return this.prototype && (i.prototype = this.prototype),
                o.prototype = new i,
                o
            }
            ),
            Array.isArray = Array.isArray || function(e) {
                return Boolean(e && "[object Array]" === Object.prototype.toString.call(Object(e)))
            }
            ,
            Array.prototype.indexOf || (Array.prototype.indexOf = function(e) {
                if (void 0 === this || null === this)
                    throw TypeError();
                var t = Object(this)
                  , n = t.length >>> 0;
                if (0 === n)
                    return -1;
                var i = 0;
                if (arguments.length > 0 && (i = Number(arguments[1]),
                isNaN(i) ? i = 0 : 0 !== i && i !== 1 / 0 && i !== -(1 / 0) && (i = (i > 0 || -1) * Math.floor(Math.abs(i)))),
                i >= n)
                    return -1;
                for (var o = i >= 0 ? i : Math.max(n - Math.abs(i), 0); n > o; o++)
                    if (o in t && t[o] === e)
                        return o;
                return -1
            }
            ),
            Array.prototype.lastIndexOf || (Array.prototype.lastIndexOf = function(e) {
                if (void 0 === this || null === this)
                    throw TypeError();
                var t = Object(this)
                  , n = t.length >>> 0;
                if (0 === n)
                    return -1;
                var i = n;
                arguments.length > 1 && (i = Number(arguments[1]),
                i !== i ? i = 0 : 0 !== i && i !== 1 / 0 && i !== -(1 / 0) && (i = (i > 0 || -1) * Math.floor(Math.abs(i))));
                for (var o = i >= 0 ? Math.min(i, n - 1) : n - Math.abs(i); o >= 0; o--)
                    if (o in t && t[o] === e)
                        return o;
                return -1
            }
            ),
            Array.prototype.every || (Array.prototype.every = function(e) {
                if (void 0 === this || null === this)
                    throw TypeError();
                var t = Object(this)
                  , n = t.length >>> 0;
                if ("function" != typeof e)
                    throw TypeError();
                var i, o = arguments[1];
                for (i = 0; n > i; i++)
                    if (i in t && !e.call(o, t[i], i, t))
                        return !1;
                return !0
            }
            ),
            Array.prototype.some || (Array.prototype.some = function(e) {
                if (void 0 === this || null === this)
                    throw TypeError();
                var t = Object(this)
                  , n = t.length >>> 0;
                if ("function" != typeof e)
                    throw TypeError();
                var i, o = arguments[1];
                for (i = 0; n > i; i++)
                    if (i in t && e.call(o, t[i], i, t))
                        return !0;
                return !1
            }
            ),
            Array.prototype.forEach || (Array.prototype.forEach = function(e) {
                if (void 0 === this || null === this)
                    throw TypeError();
                var t = Object(this)
                  , n = t.length >>> 0;
                if ("function" != typeof e)
                    throw TypeError();
                var i, o = arguments[1];
                for (i = 0; n > i; i++)
                    i in t && e.call(o, t[i], i, t)
            }
            ),
            Array.prototype.map || (Array.prototype.map = function(e) {
                if (void 0 === this || null === this)
                    throw TypeError();
                var t = Object(this)
                  , n = t.length >>> 0;
                if ("function" != typeof e)
                    throw TypeError();
                var i = [];
                i.length = n;
                var o, a = arguments[1];
                for (o = 0; n > o; o++)
                    o in t && (i[o] = e.call(a, t[o], o, t));
                return i
            }
            ),
            Array.prototype.filter || (Array.prototype.filter = function(e) {
                if (void 0 === this || null === this)
                    throw TypeError();
                var t = Object(this)
                  , n = t.length >>> 0;
                if ("function" != typeof e)
                    throw TypeError();
                var i, o = [], a = arguments[1];
                for (i = 0; n > i; i++)
                    if (i in t) {
                        var r = t[i];
                        e.call(a, r, i, t) && o.push(r)
                    }
                return o
            }
            ),
            Array.prototype.reduce || (Array.prototype.reduce = function(e) {
                if (void 0 === this || null === this)
                    throw TypeError();
                var t = Object(this)
                  , n = t.length >>> 0;
                if ("function" != typeof e)
                    throw TypeError();
                if (0 === n && 1 === arguments.length)
                    throw TypeError();
                var i, o = 0;
                if (arguments.length >= 2)
                    i = arguments[1];
                else
                    for (; ; ) {
                        if (o in t) {
                            i = t[o++];
                            break
                        }
                        if (++o >= n)
                            throw TypeError()
                    }
                for (; n > o; )
                    o in t && (i = e.call(void 0, i, t[o], o, t)),
                    o++;
                return i
            }
            ),
            Array.prototype.reduceRight || (Array.prototype.reduceRight = function(e) {
                if (void 0 === this || null === this)
                    throw TypeError();
                var t = Object(this)
                  , n = t.length >>> 0;
                if ("function" != typeof e)
                    throw TypeError();
                if (0 === n && 1 === arguments.length)
                    throw TypeError();
                var i, o = n - 1;
                if (arguments.length >= 2)
                    i = arguments[1];
                else
                    for (; ; ) {
                        if (o in this) {
                            i = this[o--];
                            break
                        }
                        if (--o < 0)
                            throw TypeError()
                    }
                for (; o >= 0; )
                    o in t && (i = e.call(void 0, i, t[o], o, t)),
                    o--;
                return i
            }
            ),
            String.prototype.trim || (String.prototype.trim = function() {
                return String(this).replace(/^\s+/, "").replace(/\s+$/, "")
            }
            ),
            Date.now || (Date.now = function() {
                return Number(new Date)
            }
            ),
            Date.prototype.toISOString || (Date.prototype.toISOString = function() {
                function e(e) {
                    return ("00" + e).slice(-2)
                }
                function t(e) {
                    return ("000" + e).slice(-3)
                }
                return this.getUTCFullYear() + "-" + e(this.getUTCMonth() + 1) + "-" + e(this.getUTCDate()) + "T" + e(this.getUTCHours()) + ":" + e(this.getUTCMinutes()) + ":" + e(this.getUTCSeconds()) + "." + t(this.getUTCMilliseconds()) + "Z"
            }
            )
        }
        , function(e, t, n) {
            "use strict";
            function i(e) {
                var t;
                e && (t = e.filename + "") && (t = t.split("?")[0],
                t.match(/(\/ncpc\/nc\.js$)|(\/uab\.js$)|(umscript.*\/um\.js$)/) && (a.console && void 0,
                o()))
            }
            function o(e) {
                "function" == typeof ncDowngrade ? (ncDowngrade(),
                e && a.__nc && a.__nc.show()) : e || setTimeout(function() {
                    o(1)
                }, 100)
            }
            var a = window;
            a.addEventListener ? a.addEventListener("error", i, !0) : a.attachEvent && a.attachEvent("onerror", i)
        }
        , function(e, t, n) {
            "use strict";
            var i, o, a = "//aeis.alicdn.com/sd/ncpc/nc.css", r = document.getElementsByTagName("link"), c = r.length;
            try {
                for (i = 0; c > i; i++)
                    o = r[i],
                    o.href && -1 != o.href.indexOf(a) && (o.disabled = !0)
            } catch (s) {}
        }
        , function(e, t, n) {
            "use strict";
            var i = n(3);
            t.makeNC = function(e, t) {
                function o(e) {
                    var n = new s(e);
                    d[t.index] = n.__nc;
                    var o = ["on", "reset", "reload", "show", "hide", "upLang", "getToken", "destroy", "getTrans", "setTrans"];
                    return i.map(o, function(e) {
                        n[e] = function() {
                            if (this.is_destroyed)
                                return this;
                            for (var t = arguments.length, n = Array(t), i = 0; t > i; i++)
                                n[i] = arguments[i];
                            var o = this.__nc[e].apply(this.__nc, n);
                            return "destroy" === e && (this.is_destroyed = !0),
                            "getToken" === e || "getTrans" === e || "setTrans" === e ? o : this
                        }
                    }),
                    n
                }
                function a(e) {
                    var n = new l(e,t);
                    return d[t.index] = n,
                    n
                }
                function r(e) {
                    return e && "scrape" === e.type ? a(e) : o(e)
                }
                var c = {}
                  , s = n(113).makeNC(e, t, c)
                  , l = n(120).NC2
                  , d = [];
                return r.config = function(e) {
                    i.mix(c, e)
                }
                ,
                r.getByIndex = function(e) {
                    return d[e]
                }
                ,
                r.reset = function(e) {
                    var t = r.getByIndex(e);
                    t && t.reset()
                }
                ,
                r
            }
        }
        , , function(e, t, n) {
            var i = n(75);
            "string" == typeof i && (i = [[e.i, i, ""]]),
            n(6)(i, {}),
            i.locals && (e.exports = i.locals)
        }
        , , function(e, t, n) {
            t = e.exports = n(7)(),
            t.push([e.i, '.nc-container.nc-scrape {\n  font-size: 12px;\n  line-height: 20px;\n}\n.nc-container.nc-scrape a {\n  text-decoration: none;\n}\n.nc-container.nc-scrape .nc-toolbar {\n  height: 30px;\n  line-height: 30px;\n  font-size: 14px;\n}\n.nc-container.nc-scrape .nc-toolbar .nc-btns {\n  float: right;\n  height: 30px;\n  overflow: hidden;\n}\n.nc-container.nc-scrape .nc-toolbar .nc-btns i {\n  cursor: pointer;\n  margin-right: 5px;\n}\n.nc-container.nc-scrape .nc-toolbar .nc-btns i.icon_refresh {\n  color: #999;\n}\n.nc-container.nc-scrape .nc-toolbar .nc-btns i.icon_info {\n  color: #e98e0c;\n}\n.nc-container.nc-scrape .nc-canvas {\n  position: relative;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  overflow: hidden;\n}\n.nc-container.nc-scrape .nc-canvas .nc-bg {\n  position: absolute;\n  background: #ccc url("https://imaeis.alicdn.com/tps/TB1ml9hPFXXXXcjXFXXXXXXXXXX-100-80.png");\n}\n.nc-container.nc-scrape .nc-canvas .nc-bg img.nc-scrape-icon {\n  position: absolute;\n}\n.nc-container.nc-scrape .nc-canvas .nc-cover {\n  position: absolute;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.nc-container.nc-scrape .nc-canvas .nc-cover canvas {\n  position: absolute;\n  background-color: transparent;\n}\n.nc-container.nc-scrape .nc-canvas .nc-cover .nc-canvas-dg {\n  position: absolute;\n}\n.nc-container.nc-scrape .nc-canvas .nc-cover .nc-canvas-dg-grid {\n  position: absolute;\n}\n.nc-container.nc-scrape .nc-canvas .nc-cover .nc-canvas-dg-grid.nc-clean {\n  background: transparent !important;\n}\n.nc-container.nc-scrape .nc-canvas .nc-cover .nc-inform,\n.nc-container.nc-scrape .nc-canvas .nc-cover .nc-loading {\n  font-size: 14px;\n  position: absolute;\n  z-index: 1;\n  top: 50%;\n  width: 100%;\n  line-height: 1.3em;\n  text-align: center;\n  margin-top: -0.65em;\n  color: #fff;\n}\n.nc-container.nc-scrape .nc-canvas .nc-show-how {\n  position: absolute;\n  display: none;\n  background: url("https://imaeis.alicdn.com/tps/TB1CpkYPFXXXXXZXXXXXXXXXXXX-68-53.png") no-repeat;\n  width: 68px;\n  height: 53px;\n  z-index: 10;\n  top: 20px;\n  margin-left: 20px;\n}\n.nc-container.nc-scrape .nc-verify-ok,\n.nc-container.nc-scrape .nc-verify-fail,\n.nc-container.nc-scrape .nc-load-error {\n  display: none;\n  margin: auto;\n  width: 240px;\n  height: 80px;\n  text-align: center;\n  font-size: 14px;\n  color: #fff;\n  line-height: 20px;\n}\n.nc-container.nc-scrape .nc-verify-ok img,\n.nc-container.nc-scrape .nc-verify-fail img,\n.nc-container.nc-scrape .nc-load-error img {\n  display: block;\n  width: 80px;\n  height: 80px;\n  vertical-align: middle;\n  float: left;\n}\n.nc-container.nc-scrape .nc-verify-ok>div,\n.nc-container.nc-scrape .nc-verify-fail>div,\n.nc-container.nc-scrape .nc-load-error>div {\n  width: 160px;\n  height: 80px;\n  display: table;\n}\n.nc-container.nc-scrape .nc-verify-ok>div>span,\n.nc-container.nc-scrape .nc-verify-fail>div>span,\n.nc-container.nc-scrape .nc-load-error>div>span {\n  display: table-cell;\n  vertical-align: middle;\n  height: 80px;\n  text-align: left;\n}\n.nc-pass .nc-container.nc-scrape .nc-toolbar .nc-btns {\n  visibility: hidden;\n}\n.nc-pass .nc-container.nc-scrape .nc-bg img {\n  display: none;\n}\n.nc-pass .nc-container.nc-scrape .nc-cover canvas,\n.nc-pass .nc-container.nc-scrape .nc-cover .nc-verify-fail {\n  display: none;\n}\n.nc-pass .nc-container.nc-scrape .nc-verify-ok {\n  display: block;\n}\n.nc-fail .nc-container.nc-scrape .nc-canvas .nc-bg {\n  background: url("https://imaeis.alicdn.com/tps/TB1ml9hPFXXXXcjXFXXXXXXXXXX-100-80.png");\n}\n.nc-fail .nc-container.nc-scrape .nc-canvas .nc-bg img {\n  display: none;\n}\n.nc-fail .nc-container.nc-scrape .nc-cover canvas,\n.nc-fail .nc-container.nc-scrape .nc-cover .nc-verify-ok,\n.nc-fail .nc-container.nc-scrape .nc-cover .nc-canvas-dg {\n  display: none;\n}\n.nc-fail .nc-container.nc-scrape .nc-verify-fail {\n  display: block;\n}\n.nc-state-load-error .nc-container.nc-scrape .nc-load-error {\n  display: block;\n}\n.nc-state-load-error .nc-container.nc-scrape canvas,\n.nc-state-load-error .nc-container.nc-scrape .nc-inform {\n  display: none;\n}\n.nc-prepared .nc-container.nc-scrape .nc-bg {\n  background: #ccc url("https://imaeis.alicdn.com/tps/TB1531mPFXXXXc_XpXXXXXXXXXX-100-80.png");\n}\n.nc-container.nc-scrape #nc-loading-circle {\n  margin: 0 10px;\n}\n.nc-container.nc-scrape #nc-loading-circle .sk-circle:before {\n  background-color: #fff;\n}\n', ""])
        }
        , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(e, t, n) {
            "use strict";
            function i(e, t, n) {
                var i = void 0
                  , o = a.createElement("script");
                o.src = e;
                var c = void 0;
                o.onreadystatechange = function() {
                    var e = o.readyState;
                    if ("loaded" === e || "complete" === e) {
                        if (i)
                            return;
                        i = !0,
                        o.onreadystatechange = null,
                        t("ok")
                    }
                }
                ,
                o.onload = function() {
                    i || (i = !0,
                    o.onload = null,
                    o.parentNode.removeChild(o),
                    -1 != c && (clearTimeout(c),
                    t("ok")))
                }
                ,
                o.onerror = function() {
                    i || (i = !0,
                    o.onerror = null,
                    o.parentNode.removeChild(o),
                    -1 != c && (clearTimeout(c),
                    t("err")))
                }
                ,
                c = setTimeout(function() {
                    i || (i = !0,
                    c = -1,
                    t(r))
                }, n || 5e3);
                var s = a.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(o, s)
            }
            function o(e, t, n, o) {
                function a() {
                    c++;
                    var d = e.indexOf("?") > -1 ? "&" : "?"
                      , u = e;
                    c > 1 && (u = e + d + "__retry=" + c),
                    i(u, function(e) {
                        if (s)
                            return void t(r);
                        if ("ok" === e)
                            t(e);
                        else {
                            if (e === r || c >= o)
                                return void t(r);
                            l = setTimeout(function() {
                                a()
                            }, 3e3)
                        }
                    }, n)
                }
                o = o || 3;
                var c = 0
                  , s = void 0
                  , l = void 0
                  , d = void 0;
                t = function(e) {
                    return function() {
                        d || (d = !0,
                        clearTimeout(l),
                        e.apply(null, arguments))
                    }
                }(t),
                a(),
                setTimeout(function() {
                    s = !0,
                    t(r)
                }, n)
            }
            var a = document
              , r = "timeout";
            t.loadScript = o
        }
        , function(e, t, n) {
            "use strict";
            function i(e, t) {
                return "undefined" != typeof UA_Opt[e] && UA_Opt[e] > 0 ? UA_Opt[e] : t
            }
            t.init = function(e) {
                e.is_Opt ? (UA_Opt.MPInterval = i("MPInterval", 4),
                UA_Opt.MMInterval = i("MMInterval", 5),
                UA_Opt.MaxMCLog = i("MaxMCLog", 12),
                UA_Opt.MaxKSLog = i("MaxKSLog", 14),
                UA_Opt.MaxMPLog = i("MaxMPLog", 5),
                UA_Opt.MaxFocusLog = i("MaxFocusLog", 6),
                UA_Opt.SendInterval = i("SendInterval", 5),
                UA_Opt.SendMethod = i("SendMethod", 8),
                UA_Opt.GPInterval = i("GPInterval", 50),
                UA_Opt.MaxGPLog = i("MaxGPLog", 1),
                UA_Opt.MaxTCLog = i("MaxTCLog", 12),
                UA_Opt.Flag = i("Flag", 882894)) : (UA_Opt.SendInterval = 5,
                UA_Opt.SendMethod = 8,
                UA_Opt.MaxMCLog = 12,
                UA_Opt.MaxKSLog = 14,
                UA_Opt.MaxMPLog = 5,
                UA_Opt.MaxGPLog = 1,
                UA_Opt.MaxTCLog = 12,
                UA_Opt.GPInterval = 50,
                UA_Opt.MPInterval = 4,
                UA_Opt.MMInterval = 5,
                UA_Opt.MaxFocusLog = 6,
                UA_Opt.isSendError = 1,
                UA_Opt.Flag = 882894)
            }
        }
        , function(e, t, n) {
            "use strict";
            function i(e, t, n) {
                var i = e.prefix
                  , r = 1
                  , u = navigator && navigator.userAgent || ""
                  , p = /Firefox\/([\d.]*)/.test(u)
                  , f = -1 !== u.indexOf("Windows")
                  , g = (new Date).getTime()
                  , h = (new Date).getTime()
                  , _ = a.head || a.getElementsByTagName("head")[0] || a.documentElement
                  , m = function(e) {
                    return a.getElementById(e)
                }
                  , v = {
                    "default": 4,
                    number: 6,
                    "150_40": 4,
                    login_wan3: 4,
                    login_wan10: 6
                }
                  , y = d.isIEX(8)
                  , b = new s(function(e, t) {
                    return y ? void t() : void d.imageLoaded("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==").then(function(n) {
                        1 === n.width && 1 === n.height ? e() : t()
                    }, t)
                }
                )
                  , x = function(e) {
                    this.lang = e.lang;
                    var t = "//diablo.alibaba.com";
                    this.config = {
                        apiserver: e.apiserver || t,
                        type: e.type || "default",
                        codeLength: e.checkCodeLength || v[e.type || "default"],
                        identity: e.identity || "",
                        sessionid: e.sessionid || "",
                        element: e.element || null,
                        a: e.a,
                        t: e.t,
                        n: e.n,
                        lang: e.lang,
                        scene: e.scene,
                        p: e.p
                    },
                    this.tipText = {};
                    var n, i = l[e.lang] || l.en;
                    for (n in i)
                        i.hasOwnProperty(n) && (this.tipText[n] = e[n] || i[n]);
                    this.service = {
                        imgURL: "{apiserver}/get_img?sessionid={sessionid}&identity={identity}&type={type}",
                        checkImgURL: "{apiserver}/check_img?sessionid={sessionid}&identity={identity}&type={type}",
                        checkAudioURL: "//cf.aliyun.com/captcha/checkcode.jsonp?csessionid={sessionid}&identity={identity}",
                        audioURL: "{apiserver}/captcha/audio/get.jsonp?identity={identity}&sessionid={sessionid}",
                        audioURL_pre: "{apiserver}/captcha/audio/pre_get.jsonp?identity={identity}&sessionid={sessionid}"
                    },
                    this.cache = {
                        codeType: "img",
                        oldCode: null,
                        lastCheckCode: "",
                        checkedCode: null,
                        checkState: "notstart",
                        audio: null,
                        audioPlayer: null,
                        callback: null,
                        captchaToken: null
                    }
                };
                return x.prototype = {
                    render: function() {
                        var e = this
                          , t = e.config;
                        if (!t.element)
                            return !1;
                        "[object String]" == Object.prototype.toString.call(t.element) && (t.element = m(t.element));
                        for (var n in this.service)
                            if (this.service.hasOwnProperty(n)) {
                                var i = this.service[n];
                                i = i.replace("{apiserver}", t.apiserver).replace("{identity}", t.identity).replace("{sessionid}", t.sessionid).replace("{type}", t.type),
                                this.service[n] = i
                            }
                        return e.renderCode(),
                        this
                    },
                    renderCode: function() {
                        function e() {
                            var e = p || m(i + "omeo-code-key");
                            e.value = e.value.replace(/[^\w\d]/g, "")
                        }
                        function o() {
                            var e, t = f, i = -1;
                            for (g.stopAudio(); "body" !== t.tagName.toLowerCase(); ) {
                                if (e = t.getAttribute("data-nc-idx"),
                                null !== e) {
                                    i = e;
                                    break
                                }
                                t = t.parentNode
                            }
                            try {
                                noCaptcha.getByIndex(parseInt(i)).reload(),
                                n(c.switchevent, {
                                    from: "audio",
                                    to: "scale"
                                })
                            } catch (o) {
                                report("reload failed")
                            }
                            return !1
                        }
                        var r = this
                          , s = r.tipText
                          , l = r.config
                          , d = a.createElement("div")
                          , u = l.element;
                        d.className = "omeo-box",
                        d.innerHTML = '<div class="omeo-code omeo-img-active" id="' + i + 'omeo-code"><div class="omeo-code-img"><img id="' + i + 'omeo-code-imgwrap" data-action="refreshImg" src="' + r.service.imgURL + '" onmousedown="return false;"/><a data-action="refreshImg" href="javascript:;" onmousedown="return false;" title="' + s.refresh + '" class="nc_iconfont btn_refresh omeo-code-refresh">&#xe607;</a><a data-action="switchToAudio" href="javascript:;" onmousedown="return false;" title="' + s.audioText + '" class="omeo-switch"></a></div><div class="omeo-code-audio"><div id="' + i + 'omeo-code-audiobox" class="omeo-code-audiobox omeo-code-audiobox-playing"><a data-action="replayAudio" href="javascript:;">' + s.clickPlay + '</a><span id="' + i + 'omeo-audio-process" class="omeo-audio-process"></span><b>' + s.audioTips + '</b></div><a id="' + i + 'omeo-refresh-audio" data-action="refreshAudio" href="javascript:;" onmousedown="return false;" title="' + s.refresh + '" class="nc_iconfont omeo-code-refresh">&#xe607;</a><i id="' + i + '_voice_close" class="nc_voice_close nc_iconfont" >&#xe600;</i><a data-action="switchToImg" href="javascript:;" onmousedown="return false;" title="' + s.imgText + '" class="omeo-switch"></a></div></div><div class="omeo-code-echo"><input id="' + i + 'omeo-code-key" type="text" name="code" maxlength="6" placeholder="' + s.placeholder + '" /><span class="omeo-code-state" id="' + i + 'omeo-code-state"></span></div>',
                        u.appendChild(d);
                        var p = m(i + "omeo-code-key");
                        u.addEventListener ? (u.addEventListener("click", function(e) {
                            r.triggerEvent(e)
                        }, !1),
                        m(i + "omeo-code-imgwrap").addEventListener("error", function() {
                            r.log({
                                e: "IMGERROR"
                            }),
                            "img" == r.cache.codeType && r.refreshCode()
                        }, !1),
                        p.addEventListener("blur", function() {
                            e(),
                            r.validateCode({
                                code: m(i + "omeo-code-key").value.replace(/^\s|\s$/g, "")
                            })
                        }, !1),
                        p.addEventListener("keyup", function() {
                            e(),
                            r.listenerCodeType(this.value.replace(/^\s|\s$/g, ""))
                        }, !1),
                        p.addEventListener("paste", function(e) {
                            e.preventDefault()
                        }, !0)) : (u.attachEvent("onclick", function(e) {
                            return r.triggerEvent(e),
                            !1
                        }),
                        m(i + "omeo-code-imgwrap").attachEvent("onerror", function() {
                            r.log({
                                e: "IMGERROR"
                            }),
                            "img" == r.cache.codeType && r.refreshCode()
                        }),
                        p.attachEvent("onblur", function() {
                            e(),
                            r.validateCode({
                                code: m(i + "omeo-code-key").value.replace(/^\s|\s$/g, "")
                            })
                        }),
                        p.attachEvent("onkeyup", function() {
                            e(),
                            r.listenerCodeType(m(i + "omeo-code-key").value.replace(/^\s|\s$/g, ""))
                        }),
                        p.attachEvent("onpaste", function() {
                            return !1
                        }));
                        var f = t.id(i + "_voice_close")
                          , g = this;
                        t.addHandler(f, "click", o)
                    },
                    listenerCodeType: function(e) {
                        this.cache.oldCode && this.cache.oldCode.length !== this.config.codeLength || 1 !== e.length || (h = (new Date).getTime()),
                        this.cache.oldCode = e,
                        e.length == this.config.codeLength && this.validateCode({
                            code: e
                        })
                    },
                    updateAudioBoxWidth: function() {
                        var e = 7
                          , t = m(i + "wrapper").offsetWidth
                          , n = m(i + "omeo-refresh-audio").offsetWidth
                          , o = m(i + "_voice_close").offsetWidth
                          , a = m(i + "omeo-code-key").offsetWidth
                          , r = t - n - o - a - e;
                        m(i + "omeo-code-audiobox").style.width = r + "px"
                    },
                    triggerEvent: function(e) {
                        var t = e.target || e.srcElement
                          , n = t.getAttribute("data-action");
                        try {
                            m(i + "omeo-code-key").focus()
                        } catch (e) {}
                        "refreshAudio" === n && this.refreshCode(),
                        "switchToAudio" === n && (this.cache.codeType = "audio",
                        this.switchCode({
                            type: "audio"
                        })),
                        "replayAudio" == n && this.playAudio()
                    },
                    resetPlayer: function(e) {
                        var t = m(i + "omeo-audio-process");
                        t.style.width = 0,
                        "playing" == e.state ? t.parentNode.className = "omeo-code-audiobox omeo-code-audiobox-playing" : t.parentNode.className = "omeo-code-audiobox",
                        this.updateAudioBoxWidth()
                    },
                    refreshCode: function() {
                        var e = m(i + "omeo-code-state");
                        e.className = "omeo-code-state",
                        e.innerHTML = "",
                        o.__progtid && clearInterval(o.__progtid),
                        m(i + "omeo-code-key").value = "",
                        this.resetPlayer({
                            state: "playing"
                        }),
                        this.playAudio(),
                        g = h = (new Date).getTime()
                    },
                    switchCode: function(e) {
                        "img" == e.type ? (this.stopAudio(),
                        m(i + "omeo-code").className = "omeo-code omeo-img-active") : (m(i + "omeo-code").className = "omeo-code omeo-audio-active",
                        this.resetPlayer({
                            state: "playing"
                        }),
                        !this.audioSupport || p || (m(i + "omeo-refresh-audio").style.display = ""),
                        this.playAudio()),
                        this.cache.checkState = "notstart",
                        this.cache.checkedCode = null;
                        var t;
                        t = m(i + "omeo-code-state"),
                        t.className = "omeo-code-state",
                        t.innerHTML = "",
                        t = m(i + "omeo-code-key"),
                        t.value = "",
                        t.focus(),
                        this.cache.oldCode && this.refreshCode(),
                        g = h = (new Date).getTime()
                    },
                    playErrAudio: function() {
                        var e = "//aeis.alicdn.com/sd/ncpc/images/"
                          , t = e + "error.wav"
                          , n = e + "error_en.mp3"
                          , i = "cn" == this.lang || "zh_CN" == this.lang;
                        this.playAudio(i ? t : n)
                    },
                    playAudio: function(e) {
                        function t(t) {
                            var n;
                            t && (e = t.result.data[0],
                            this.cache.captchaToken = t.result.captchaToken),
                            n = e.indexOf(".mp3") > -1 ? "audio/mpeg" : "audio/x-wav";
                            var c;
                            if (this.audioSupport)
                                this.cache.audio = new Audio,
                                c = a.createElement("source"),
                                c.type = n,
                                c.src = e,
                                this.cache.audio.appendChild(c),
                                this.cache.audio.load(),
                                this.cache.audio.play(),
                                this.bindAudioProgress();
                            else if (this.isIE) {
                                var s = a.createElement("bgsound");
                                s.setAttribute("id", "omeo-bgsound-audio" + r),
                                s.setAttribute("autostart", "true"),
                                s.setAttribute("src", e),
                                _.appendChild(s),
                                this.cache.audioPlayer = m(i + "omeo-bgsound-audio" + r),
                                this.resetPlayer({
                                    state: "playing"
                                });
                                var l = 0
                                  , d = this;
                                o.__progtid && clearInterval(o.__progtid),
                                o.__progtid = setInterval(function() {
                                    l += 10,
                                    l > 100 && (l = 100),
                                    d.updateProgress(l),
                                    l >= 100 && clearInterval(o.__progtid)
                                }, 1e3)
                            } else
                                _.appendChild('<embed src="' + e + '" id="' + i + "omeo-flash-audio" + r + '" ' + (f ? 'type="application/x-mplayer2"' : 'type="' + n + '"') + " autostart hidden />"),
                                this.cache.audioPlayer = m(i + "omeo-flash-audio" + r),
                                this.updateProgress("NOPROGRESS")
                        }
                        var n = this;
                        if (n.stopAudio(),
                        e)
                            t.call(n);
                        else {
                            var c = b.then(function() {
                                e = n.service.audioURL
                            }, function() {
                                e = n.service.audioURL_pre
                            }).then(function() {
                                var i = {
                                    url: e,
                                    callback: "callback",
                                    data: {}
                                };
                                return d.request(i).then(function(e) {
                                    return e.success && 0 === e.result.resultCode ? void t.call(n, e) : s.reject({
                                        type: "request",
                                        code: e.result.resultCode,
                                        msg: e.result.message
                                    })
                                })
                            });
                            c["catch"](function(e) {
                                /^(request)$/.test(e.type)
                            })
                        }
                    },
                    bindAudioProgress: function() {
                        var e = this
                          , t = e.cache;
                        t.audio.addEventListener("timeupdate", function() {
                            null !== m(i + "omeo-audio-process") && (!p || this.duration && this.duration !== 1 / 0 ? e.updateProgress(parseInt(100 * this.currentTime / this.duration)) : e.updateProgress(100))
                        }, t.audio),
                        t.audio.addEventListener("ended", function() {
                            e.updateProgress(100)
                        }, t.audio)
                    },
                    updateProgress: function(e) {
                        switch (e) {
                        case -1:
                            break;
                        case 100:
                            this.resetPlayer({
                                state: "end"
                            });
                            break;
                        case "NOPROGRESS":
                            this.resetPlayer({
                                state: "end"
                            });
                            break;
                        default:
                            m(i + "omeo-audio-process").style.width = e + "%"
                        }
                    },
                    stopAudio: function() {
                        var e = this.cache;
                        this.audioSupport ? e.audio && e.audio.pause() : e.audioPlayer && (e.audioPlayer.src = "",
                        e.audioPlayer.parentNode.removeChild(this.cache.audioPlayer),
                        e.audioPlayer = null)
                    },
                    replayAudio: function() {
                        this.audioSupport && this.cache.audio && (this.resetPlayer({
                            state: "playing"
                        }),
                        this.cache.audio.currentTime = 0,
                        this.cache.audio.pause(),
                        this.cache.audio.play())
                    },
                    loadResource: function(e, t) {
                        var n = null;
                        /\.css/g.test(e) ? (a.createStyleSheet && a.createStyleSheet(e),
                        n = a.createElement("link"),
                        n.rel = "stylesheet",
                        n.href = e) : (n = a.createElement("script"),
                        n.src = e),
                        "onload"in n ? n.onload = function() {
                            t && t()
                        }
                        : n.onreadystatechange = function() {
                            /loaded|complete/.test(n.readyState) && t && t()
                        }
                        ,
                        _.appendChild(n)
                    },
                    isIE: function() {
                        return !!/MSIE ([^;]*)|Trident.*; rv(?:\s|:)?([0-9.]+)/.test(u)
                    }(),
                    audioSupport: function() {
                        try {
                            return "Audio"in o && (new Audio).canPlayType("audio/x-wav")
                        } catch (e) {
                            return !1
                        }
                    }(),
                    validateCode: function(e) {
                        var n = this
                          , a = m(i + "omeo-code-state")
                          , c = "omeocode" + r + (+new Date).toString().substr(-6, 6)
                          , s = n.service.checkAudioURL;
                        if (n.cache.checkedCode && n.cache.checkedCode === n.cache.oldCode)
                            return !1;
                        if (n.cache.lastCheckCode == e.code)
                            return !1;
                        if (n.cache.lastCheckCode = e.code,
                        n.cache.checkedCode = null,
                        "checking" == n.cache.checkState)
                            return !1;
                        if (n.cache.checkState = "checking",
                        /^[a-z0-9]{4,6}$/gi.test(e.code)) {
                            var l = {
                                checkcode: function() {
                                    var i = {};
                                    return i.answer = e.code,
                                    i.captchaToken = n.cache.captchaToken,
                                    t.obj2str(i)
                                }(),
                                callback: c,
                                a: n.config.a,
                                t: n.config.t,
                                n: n.config.n,
                                lang: n.config.lang,
                                scene: n.config.scene
                            };
                            s += "&" + d.obj2param(l),
                            o[c] = function(t) {
                                var o = {};
                                if (t.success && 100 == t.result.code) {
                                    n.cache.checkedCode = e.code,
                                    a.className = "omeo-code-state omeo-code-state-success",
                                    a.innerHTML = "",
                                    n.cache.checkState = "success",
                                    o = {
                                        message: "success"
                                    };
                                    var r = (new Date).getTime();
                                    n.log({
                                        t1: r - h,
                                        t2: r - g,
                                        s: t && "SUCCESS." === t.message,
                                        t: n.cache.codeType
                                    })
                                } else
                                    a.className = "omeo-code-state omeo-code-state-error",
                                    a.innerHTML = n.tipText.codeError,
                                    setTimeout(function() {
                                        var e = m(i + "omeo-code-state");
                                        e && (e.className = "",
                                        e.innerHTML = "",
                                        m(i + "omeo-code-key").value = "")
                                    }, 3e3),
                                    n.cache.checkState = "codeError",
                                    o = {
                                        message: "error"
                                    },
                                    m(i + "omeo-code-key").select(),
                                    "true" == t.refresh && n.refreshCode();
                                n.cache.callback && n.cache.callback(o)
                            }
                            ,
                            n.loadResource(s)
                        } else
                            n.cache.checkState = "codeError",
                            a.className = "omeo-code-state omeo-code-state-error",
                            a.innerHTML = "\u9a8c\u8bc1\u7801\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165",
                            n.playErrAudio(),
                            setTimeout(function() {
                                var e = m(i + "omeo-code-state");
                                e && (e.className = "",
                                e.innerHTML = "",
                                e = m(i + "omeo-code-key"),
                                e.value = "",
                                e.focus(),
                                n.resetPlayer({
                                    state: "playing"
                                }),
                                n.playAudio())
                            }, 5e3)
                    },
                    check: function(e) {
                        "success" == this.cache.checkState && e && e({
                            message: "success"
                        }),
                        "codeError" == this.cache.checkState && e && e({
                            message: "error"
                        }),
                        this.cache.callback = e
                    },
                    log: function() {}
                },
                x
            }
            var o = window
              , a = document
              , r = n(9)
              , c = r.names
              , s = n(1)
              , l = n(112).language
              , d = n(2);
            n(21),
            t.init = i
        }
        , function(e, t, n) {
            "use strict";
            function i() {
                var e = r.createElement("style");
                e.appendChild(r.createTextNode(""));
                var t = r.getElementsByTagName("script")
                  , n = t[t.length - 1];
                return n.parentNode.insertBefore(e, n),
                e.sheet
            }
            function o(e, t, n, i) {
                "number" != typeof i && (i = 1),
                "insertRule"in e ? e.insertRule(t + "{" + n + "}", i) : "addRule"in e && e.addRule(t, n, i)
            }
            function a(e) {
                var t = r.createElement("style");
                t.type = "text/css",
                t.className = "nc-style",
                t.styleSheet ? t.styleSheet.cssText = e : t.innerHTML = e;
                var n = r.getElementsByTagName("script")
                  , i = n[n.length - 1];
                i.parentNode.insertBefore(t, i)
            }
            var r = document;
            e.exports = {
                createSheet: i,
                addCSSRule: o,
                insertCSS: a
            }
        }
        , function(e, t, n) {
            "use strict";
            function i(e, t) {
                return this.options = e || {},
                this.params = t || {},
                this.init(),
                this
            }
            function o(e) {
                var t = p.defer()
                  , n = e.data || {}
                  , i = ("jsonp_" + Math.random()).replace(".", "");
                s[i] = function(e) {
                    t.resolve(e)
                }
                ,
                n[e.callback || "callback"] = i,
                t.promise.always(function() {
                    try {
                        delete s[i]
                    } catch (e) {
                        s[i] = null
                    }
                });
                var o = l.createElement("script");
                o.src = e.url + (-1 === e.url.indexOf("?") ? "?" : "&") + f.obj2param(n);
                var a = l.getElementsByTagName("script")[0];
                return a.parentNode.insertBefore(o, a),
                setTimeout(function() {
                    t.reject({
                        type: "request",
                        error: "timeout"
                    })
                }, 5e3),
                t.promise
            }
            function a(e) {
                var t = p.defer()
                  , n = new Image;
                return n.onload = function() {
                    t.resolve(this)
                }
                ,
                n.onerror = function(e) {
                    t.reject({
                        type: "img",
                        error: e
                    })
                }
                ,
                setTimeout(function() {
                    t.reject({
                        type: "img",
                        error: "timeout"
                    })
                }, 5e3),
                n.src = e,
                t.promise
            }
            function r(e) {
                e.style.display = "block"
            }
            function c(e) {
                e.style.display = "none"
            }
            var s = window
              , l = document
              , d = l.documentElement
              , u = function() {}
              , p = n(1)
              , f = n(2)
              , g = n(10).URL_MAP
              , h = n(4).language
              , _ = f.isIEX(8)
              , m = new p(function(e, t) {
                return _ ? void t() : void a("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==").then(function(n) {
                    1 === n.width && 1 === n.height ? e() : t()
                }, t)
            }
            )
              , v = p.reject({
                type: "destroy"
            })
              , y = "&#xe60e;"
              , b = "&#xe607;"
              , x = "&#xe60a;"
              , k = "&#xe60b;"
              , w = {
                INITIAL: 0,
                READY: 1,
                LOADING: 2,
                LOAD_FAIL: 3,
                LOADED: 4,
                VERIFING: 5
            }
              , E = "nc-cc"
              , T = {};
            f.each(w, function(e, t) {
                T[e] = E + "-status-" + t.toLowerCase().replace("_", "-")
            }),
            i.prototype = {
                init: function() {
                    this.initProps(),
                    this.render(),
                    this.bindEvents(),
                    this.setStatus(w.READY),
                    this.updateCaptcha(!0)
                },
                setStatus: function(e) {
                    var t = this.status;
                    e !== t && (this.status = e,
                    T[t] && f.removeClass(this.$container, T[t]),
                    T[e] && f.addClass(this.$container, T[e]))
                },
                initProps: function() {
                    this.status = w.INITIAL,
                    this.prefix = this.options.prefix,
                    this.nc = this.options.nc,
                    this.urls = g[this.options.foreign] || g[0],
                    this.language = h[this.options.language],
                    this.$container = l.getElementById(this.prefix + "cc"),
                    this.clickIndex = 0,
                    this.onerror = this.options.onerror || u,
                    this.onfail = this.options.onfail || u,
                    this.onsuccess = this.options.onsuccess || u
                },
                render: function() {
                    var e = this.language
                      , t = '\n<div class="' + E + '-body"></div>\n<div class="' + E + '-tip"><i class="nc_iconfont">' + x + "</i>" + e._cc_fail + '</div>\n<div class="' + E + '-footer">\n<div class="' + E + '-wait">\n<i class="' + E + '-loading-img"></i>' + e._wait + '\n</div>\n<div class="' + E + '-refresh" data-action="refresh"><i class="nc_iconfont" data-action="refresh">' + b + "</i>" + e._cc_refresh + '</div>\n<div class="' + E + "-btn " + E + '-confirm" data-action="confirm">' + e._verify + '</div>\n<div class="' + E + '-cancel" data-action="close"><i class="nc_iconfont" data-action="close">' + y + "</i>" + e._cancel + '</div>\n</div>\n<div class="' + E + '-mask"></div>\n<div class="' + E + '-arrow-1"></div>\n<div class="' + E + '-arrow-2"></div>\n';
                    this.$container.innerHTML = t,
                    r(this.$container),
                    this.pin(),
                    f.each(["body", "footer", "tip", "confirm", "wait", "refresh", "mask"], function(e) {
                        this["$" + e] = this.klass(e)[0]
                    }, this)
                },
                pin: function() {
                    var e = this.options.$wrapper
                      , t = e.offsetWidth
                      , n = f.getElementLeft(e)
                      , i = f.getElementTop(e)
                      , o = this.$container.offsetWidth
                      , a = s.innerWidth || d && d.clientWidth || l.body.clientWidth
                      , r = "";
                    a - t - n > o ? (r = "right",
                    this.$container.style.left = (t - 150) / 2 + 108 + 30 + "px") : n > o && (r = "left",
                    this.$container.style.left = -(o + 25 - (t - 150) / 2) + "px"),
                    339 > i && (this.$container.style.top = -i + 5 + "px"),
                    r && f.addClass(this.$container, E + "-" + r)
                },
                updateCaptcha: function(e) {
                    var t = this
                      , n = this.language;
                    if (this.status !== w.LOADING) {
                        this.setStatus(w.LOADING),
                        e ? this.$body.innerHTML = '\n<div class="' + E + '-loading">\n<i class="' + E + '-loading-img"></i>\n' + n._wait + "\n</div>\n" : (c(this.$refresh),
                        r(this.$wait));
                        var i = m.then(function() {
                            return t.urls.cc
                        }, function() {
                            return t.urls.cc_pre
                        }).then(function(e) {
                            var n = t.options;
                            return o({
                                url: e,
                                data: {
                                    sessionid: n.csessionid,
                                    identity: n.appkey,
                                    style: n.value,
                                    type: "SUDOKU_IMG",
                                    token: n.token
                                }
                            })
                        }).then(function(e) {
                            return t.hasDestroy() ? v : e.success && 0 === e.result.resultCode ? (t.captchaToken = e.result.captchaToken,
                            p.all([a(e.result.data[0]), a(e.result.data[1])])) : p.reject({
                                type: "request",
                                code: e.result.resultCode,
                                msg: e.result.message
                            })
                        }).then(function(e) {
                            return t.hasDestroy() ? v : (t.setStatus(w.LOADED),
                            void t.renderImg(e[0], e[1]))
                        });
                        e || i.always(function() {
                            r(t.$refresh),
                            c(t.$wait)
                        }),
                        i["catch"](function(n) {
                            /^(request|img)$/.test(n.type) && (t[n.type + "Fail"](e),
                            t.onerror())
                        })
                    }
                },
                bindEvents: function() {
                    var e = this.nc
                      , t = {};
                    t[w.LOAD_FAIL] = {
                        retry: function() {
                            c(this.$mask),
                            this.updateCaptcha()
                        }
                    },
                    t[w.LOADED] = {
                        refresh: function() {
                            c(this.$tip),
                            this.updateCaptcha()
                        },
                        confirm: this.confirm,
                        select: this.select
                    },
                    this._handler = f.bind(function(n) {
                        n = f.getEvent(n);
                        var i = f.getTarget(n)
                          , o = i.getAttribute("data-nc-lang") ? i.parentNode.getAttribute("data-action") : i.getAttribute("data-action");
                        o && ("close" === o && (this.destroy(),
                        e.reset()),
                        t[this.status] && t[this.status][o] && t[this.status][o].call(this, i, n))
                    }, this),
                    f.addHandler(this.$container, "click", this._handler)
                },
                select: function(e, t) {
                    if (f.toggleClass(e, E + "-selected"),
                    f.hasClass(e, E + "-selected")) {
                        var n = t.pageX
                          , i = t.pageY;
                        void 0 === n && (n = t.clientX + (l.body.scrollLeft || d.scrollLeft)),
                        void 0 === i && (i = t.clientY + (l.body.scrollTop || d.scrollTop));
                        var o = f.getPageCoord(e.parentNode);
                        e.setAttribute("data-x", n - o.x),
                        e.setAttribute("data-y", i - o.y),
                        e.setAttribute("data-ci", this.clickIndex++)
                    }
                    var a = this.klass("selected")
                      , r = a.length;
                    0 === r ? f.addClass(this.$confirm, E + "-disabled") : f.removeClass(this.$confirm, E + "-disabled"),
                    c(this.$tip)
                },
                confirm: function() {
                    var e = this
                      , t = (e.nc,
                    this.klass("selected"));
                    if (0 !== t.length && this.status !== w.VERIFING) {
                        this.setStatus(w.VERIFING),
                        t = [].slice.call(t),
                        t.sort(function(e, t) {
                            var n, i = parseInt(e.getAttribute("data-ci"), 10), o = parseInt(t.getAttribute("data-ci"), 10);
                            return n = i == o ? 0 : i > o ? 1 : -1
                        });
                        var n = [];
                        f.each(t, function(e) {
                            n.push("[" + [e.getAttribute("data-x"), e.getAttribute("data-y"), e.getAttribute("data-i")].join(",") + "]");
                        }),
                        n = "[" + n.join(",") + "]",
                        o({
                            url: this.urls.checkcode,
                            data: {
                                csessionid: this.options.csessionid,
                                checkcode: this.params.obj2str({
                                    answer: n,
                                    captchaToken: this.captchaToken
                                }),
                                a: this.options.appkey,
                                t: this.options.token,
                                n: s._n || "",
                                p: "{}",
                                r: Math.random(),
                                lang: this.options.language,
                                v: this.params.v
                            }
                        }).then(function(t) {
                            return e.hasDestroy() ? v : void (t.success && 100 === t.result.code ? (e.onsuccess(t.result.sig),
                            e.destroy()) : (e.updateCaptcha(),
                            r(e.$tip),
                            e.onfail()))
                        })["catch"](function(t) {
                            "request" === t.type && (e.requestFail(),
                            e.onerror())
                        })
                    }
                },
                renderImg: function(e, t) {
                    for (var n = "", i = 0; 9 > i; i++)
                        n += '<a href="javascript:void(0);" class="' + E + '-item" data-action="select" data-i="' + i + '"><i class="nc_iconfont">' + k + "</i></a>";
                    this.$body.innerHTML = '\n<div class="' + E + '-header">\n<div class="' + E + '-img1-box"></div>\n<div class="' + E + '-txt">' + this.language._cc_title + '</div>\n</div>\n<div class="' + E + '-img2-box">\n<div class="' + E + '-items">\n<div class="' + E + '-items-inner">\n' + n + "\n</div>\n</div>\n</div>\n",
                    this.klass("img1-box")[0].appendChild(e),
                    this.klass("img2-box")[0].appendChild(t),
                    f.addClass(this.$confirm, E + "-disabled")
                },
                imgFail: function(e) {
                    this.setStatus(w.LOAD_FAIL);
                    var t = this.$body
                      , n = this.language
                      , i = "close";
                    e ? c(this.$footer) : (t = this.$mask,
                    i = "retry",
                    r(t));
                    var o = n._cc_contact.replace("%TOKEN", this.options.token);
                    t.innerHTML = '\n<div class="' + E + '-fail">\n<div class="' + E + '-fail-inner">\n<p>' + n._cc_img_fail + '</p>\n<div class="' + E + '-fail-action">\n<div class="' + E + '-btn" data-action="' + i + '">' + n._retry + '</div>\n<a href="javascript:void(0);" data-action="close">' + n._cancel + '</a>\n</div>\n<div class="' + E + '-contact">\n' + o + "\n</div>\n</div>\n</div>\n"
                },
                requestFail: function(e) {
                    var t = this.language
                      , n = t._cc_contact.replace("%TOKEN", this.options.token);
                    this.setStatus(w.LOAD_FAIL),
                    this.$body.innerHTML = '\n<div class="' + E + '-fail">\n<div class="' + E + '-fail-inner">\n<p>' + t._cc_req_fail + '</p>\n<div class="' + E + '-fail-action">\n<div class="' + E + '-btn" data-action="close">' + t._close + '</div>\n</div>\n<div class="' + E + '-contact">\n' + n + "\n</div>\n</div>\n</div>\n",
                    c(this.$footer)
                },
                unbindEvents: function() {
                    f.removeHandler(this.$container, "click", this._handler)
                },
                klass: function(e) {
                    return f.getElementsByClassName([E, e].join("-"), this.$container)
                },
                destroy: function() {
                    c(this.$container),
                    this.unbindEvents(),
                    this.$container.innerHTML = "";
                    for (var e in this)
                        this.hasOwnProperty(e) && delete this[e];
                    this.destroy = u
                },
                hasDestroy: function() {
                    return this.destroy === u
                }
            },
            e.exports = i
        }
        , function(e, t, n) {
            "use strict";
            function i(e, t, n, i) {
                var a;
                for (a in i)
                    i.hasOwnProperty(a) && (n[a] = i[a]);
                var c = n[t];
                if (c) {
                    e.opt.language = t;
                    var l, d = e.opt.renderTo;
                    d && (l = r.getElementById(d)) && (s.addClass(l, "nc-lang-" + t),
                    o(l, c))
                }
            }
            function o(e, t) {
                var n, i, o, a, r = e.getElementsByTagName("*"), c = "data-nc-lang";
                for (n = 0; n < r.length; n++)
                    i = r[n],
                    o = i.getAttribute(c),
                    o && (a = t[o]) && a && !function(e, t) {
                        setTimeout(function() {
                            e.innerHTML = t.replace(/^\s*<span[^>]*?>|<\/span>\s*$/g, "")
                        }, 1)
                    }(i, a)
            }
            function a(e, t, n) {
                window.nc_ex_lang = function(o) {
                    i(e, t, n, o)
                }
                ;
                var o = "script"
                  , a = r.createElement(o);
                a.charset = "utf-8",
                a.src = c;
                var s = r.getElementsByTagName(o)[0];
                s.parentNode.insertBefore(a, s)
            }
            var r = document
              , c = "//aeis.alicdn.com/sd/ncpc/lang-ex.js?t=" + Math.floor((new Date).getTime() / 846e5)
              , s = n(2);
            t.loadExLang = a
        }
        , function(e, t, n) {
            "use strict";
            var i = {
                cn: {
                    placeholder: "\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801",
                    audioText: "\u83b7\u53d6\u8bed\u97f3\u9a8c\u8bc1\u7801",
                    imgText: "\u83b7\u53d6\u56fe\u7247\u9a8c\u8bc1\u7801",
                    refresh: "\u91cd\u65b0\u83b7\u53d6\u9a8c\u8bc1\u7801",
                    codeError: "\u9a8c\u8bc1\u7801\u9519\u8bef\uff0c\u5373\u5c06\u64ad\u653e\u4e0b\u4e00\u6bb5",
                    clickPlay: "\u70b9\u51fb\u64ad\u653e\u8bed\u97f3",
                    audioTips: "\u8bf7\u4ed4\u7ec6\u6536\u542c"
                },
                en: {
                    placeholder: "enter the code",
                    audioText: "retrieve pass code from the audio",
                    imgText: "retrieve pass code from the image",
                    refresh: "retrieve pass code again",
                    codeError: "Incorrect pass code, please try again",
                    clickPlay: "click to play the audio",
                    audioTips: "please listen carefully"
                }
            };
            i.zh_CN = i.cn,
            i.en_US = i.en,
            t.language = i
        }
        , function(e, t, n) {
            "use strict";
            var i = n(114)
              , o = n(116).makeScale
              , a = n(9)
              , r = n(2)
              , c = n(21).BaseFun
              , s = n(10).mmstat_base;
            t.makeNC = function(e, t, l) {
                function d(e, i, a, c) {
                    var l = n(46).makeLog(i.foreign ? s.gj : s.gm)
                      , d = i.glog;
                    "boolean" != typeof t._b_glog && (t._b_glog = d && "number" == typeof d && Math.random() < d);
                    var u = function(e) {
                        t._b_glog && !m[e] && l.log(i.appkey, UA_Opt.Token || i.token, e);
                        var n = a[e];
                        if (n && n.length) {
                            var o, r = [];
                            for (o = 1; o < arguments.length; o++)
                                r.push(arguments[o]);
                            for (o = 0; o < n.length; o++)
                                if (n[o].apply(null, r) === !1)
                                    return !1
                        }
                    };
                    return u = r.decorator.after(u, function(t) {
                        t === !1 && setTimeout(function() {
                            var t = h[e];
                            t && t.reload()
                        }, 1)
                    }),
                    [o(c, t, u), u]
                }
                function u(o) {
                    o = r.mix(r.clone(_), o),
                    t.index++,
                    t.prefix = o.prefix || "nc_" + t.index + "_",
                    n(115).reg(o);
                    var a = {}
                      , s = {}
                      , l = new c(o,r.obj2param)
                      , u = d(t.index, o, a, l)
                      , p = u[0]
                      , f = u[1]
                      , g = i.makeNoCaptcha(e, s, t, a, p, f, l)
                      , h = new g;
                    return h._index = t.index,
                    h.init(o),
                    h
                }
                function p(e) {
                    e && this.init(e)
                }
                function f(e) {
                    p.prototype[e] = function() {
                        if (this.is_destroyed)
                            return this;
                        var t = g[this.index]
                          , n = t[e].apply(t, arguments);
                        return "destroy" === e && (this.is_destroyed = !0),
                        "getToken" === e || "getTrans" === e || "setTrans" === e ? n : this
                    }
                }
                var g = []
                  , h = []
                  , _ = l || {}
                  , m = a.deprecated;
                p.reset = function(e) {
                    var t = g[e];
                    t && t.reset && t.reset()
                }
                ,
                p.config = function(e) {
                    r.mix(_, e)
                }
                ,
                p.getByIndex = function(e) {
                    return h[e]
                }
                ,
                p.prototype = {
                    init: function(e) {
                        var n = u(e);
                        return this.index = t.index,
                        this.__nc = n,
                        g[this.index] = n,
                        h[this.index] = this,
                        this
                    }
                };
                var v, y = ["on", "reset", "reload", "show", "hide", "upLang", "getToken", "destroy", "getTrans", "setTrans"];
                for (v = 0; v < y.length; v++)
                    f(y[v]);
                return p
            }
        }
        , function(module, exports, __webpack_require__) {
            "use strict";
            function makeNoCaptcha(module_nc, opt, inn_vars, nc_events, Scale, onNCEvent, _) {
                function _upResetIndex(e) {
                    return upResetIndex(e, nc_index)
                }
                function _getToken() {
                    return opt.token || UA_Opt.Token || umx.getToken()
                }
                function showError(e, t) {
                    var n, i = t ? '<span class="nc-errcode"> (' + t + ")</span>" : "";
                    n = e ? language[opt.language]._errorNetwork + i : language[opt.language]._errorLOADING + i,
                    n = n.replace("%TOKEN", opt.token),
                    n = _upResetIndex(n),
                    _.id(opt.renderTo).innerHTML = '<div class="errloading"><i class="nc_iconfont icon_warn">' + icon_warn + "</i>" + n + "</div>",
                    el_render_to && util.removeClass(el_render_to, "show-click-captcha")
                }
                function NoCaptcha() {}
                var nc_index = inn_vars.index, nc_prefix = inn_vars.prefix, scale_btn = nc_prefix + "n1z", scale_bar = nc_prefix + "n1t", TEXTELEM, gErrTimes = 0, ajaxURL, clsCheckCode = m_checkcode.init(inn_vars, _, onNCEvent), objCheckCode, tpl = makeTemplate({
                    idx: nc_index,
                    prefix: nc_prefix
                }), glog = __webpack_require__(46).makeLog(opt.foreign ? mmstat_base.gj : mmstat_base.gm), report = glog.report, reportLoadJSError = function(e, t) {
                    report2.log({
                        a: opt.appkey,
                        t: _getToken(),
                        scene: opt.scene,
                        ns: "",
                        jsv: inn_vars.v,
                        usa: navigator.userAgent,
                        p: "",
                        jsType: "pc",
                        os: "",
                        em: t,
                        ec: e
                    })
                }, el_render_to, showHelp = makeShowHelp(opt, _, inn_vars), loading_circle_html = '\n        <div id="nc-loading-circle" class="nc-loading-circle">\n          <div class="sk-circle1 sk-circle"></div>\n          <div class="sk-circle2 sk-circle"></div>\n          <div class="sk-circle3 sk-circle"></div>\n          <div class="sk-circle4 sk-circle"></div>\n          <div class="sk-circle5 sk-circle"></div>\n          <div class="sk-circle6 sk-circle"></div>\n          <div class="sk-circle7 sk-circle"></div>\n          <div class="sk-circle8 sk-circle"></div>\n          <div class="sk-circle9 sk-circle"></div>\n          <div class="sk-circle10 sk-circle"></div>\n          <div class="sk-circle11 sk-circle"></div>\n          <div class="sk-circle12 sk-circle"></div>\n        </div>\n    ', isIE8 = util.isIEX(8), isIE9 = util.isIEX(9);
                (isIE8 || isIE9) && (loading_circle_html = "");
                var supportDataURI = new Promise(function(e, t) {
                    return isIE8 ? void t() : void util.imageLoaded("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==").then(function(n) {
                        1 === n.width && 1 === n.height ? e() : t()
                    }, t)
                }
                );
                return NoCaptcha.prototype = {
                    init: function(e) {
                        win.__nc = this,
                        module_nc.nc = this;
                        var t = default_opt.language;
                        e.foreign && (t = "en",
                        default_opt.language = t),
                        _.objUpdate(opt, default_opt),
                        _.objUpdate(opt, e),
                        opt.token || (opt.token = default_opt.token),
                        this.opt = opt,
                        language[opt.language] || (loadExLang(this, opt.language, language),
                        opt.language = t),
                        this.render_to = opt.renderTo,
                        this.render_to && (el_render_to = _.id(this.render_to)),
                        el_render_to && util.addClass(el_render_to, "nc-container"),
                        opt.is_tbLogin && (tb_login = __webpack_require__(118).makeTBLogin(inn_vars)),
                        ajaxURL = URL_MAP[opt.foreign] || URL_MAP[0],
                        ajaxURL = util.mix(ajaxURL, opt.apimap),
                        ajaxURL.uab_Url = opt.uaUrl || ajaxURL.uab_Url;
                        var n;
                        if (opt.renderTo && opt.appkey && opt.token) {
                            n = _.id(opt.renderTo);
                            var i = Math.min(n.offsetWidth, n.parentNode.offsetWidth);
                            !opt.customWidth && i > 300 && (opt.customWidth = 300),
                            this.updateWidth(opt.customWidth),
                            n.setAttribute("data-nc-idx", inn_vars.index.toString()),
                            n && (n.innerHTML = '<div id="' + nc_prefix + 'nocaptcha"><div id="' + nc_prefix + 'wrapper" class="nc_wrapper"><div id="' + nc_prefix + '_n1t_loading" class="nc_scale"><div id="' + nc_prefix + '_bg" class="nc_bg" style="width: 0;"></div><div id="' + nc_prefix + '_scale_text_loading" class="scale_text">' + language[opt.language]._Loading + loading_circle_html + "</div></div></div></div>"),
                            UA_Opt.LogVal = "_n",
                            "undefined" == typeof win.acjs ? this.inituab() : (this.initUaParam(),
                            UA_Opt.Token = (new Date).getTime() + ":" + opt.token,
                            UA_Opt.reload && UA_Opt.reload()),
                            this.afterUA()
                        }
                        if (opt.logo && css.insertCSS(".nc-container .nc_scale .scale_text {background-image: url(" + NC_LOGO_URL + "); background-repeat: repeat-x;}"),
                        opt.cssUrl)
                            if (doc.createStyleSheet)
                                doc.createStyleSheet(opt.cssUrl);
                            else {
                                var o = doc.createElement("link");
                                o.type = "text/css",
                                o.rel = "stylesheet",
                                o.className = "nc-custom-style-" + nc_index,
                                o.href = inn_vars.has_pointman ? util.addHourStamp(opt.cssUrl) : opt.cssUrl;
                                var a = doc.getElementsByTagName("script")[0];
                                a.parentNode.insertBefore(o, a)
                            }
                        onNCEvent(event_names.init)
                    },
                    on: function(e, t) {
                        var n = window.console
                          , i = event_deprecated[e];
                        i && n && n.warn && n.warn("NC: Event '" + e + "' will be deprecated, use '" + i + "' instead."),
                        nc_events[e] = nc_events[e] || [],
                        nc_events[e].push(t)
                    },
                    updateWidth: function(e, t) {
                        if (e) {
                            var n, i, o = "undefined" == typeof e ? "undefined" : _typeof(e);
                            "number" == o ? n = e : i = "string" == o ? _.id(e) : e,
                            i && (n = i.offsetWidth),
                            n && (this.c_width = n,
                            this.__is_c_width_setted = 1,
                            this.try2setWidth(nc_prefix + "wrapper"),
                            this.updateCSS(nc_prefix, n, t))
                        }
                    },
                    updateCSS: function(e, t, n) {
                        var i = util.isIEX(6)
                          , o = util.isIEX(7)
                          , a = i || o ? " !important" : "";
                        css.insertCSS((n ? "" : ".nc-container #" + e + "wrapper,.nc-container.tb-login #" + e + "wrapper{width:" + t + "px}\n") + [".nc-container .imgCaptcha", ".nc-container .clickCaptcha"].join(",") + "{width:" + (t - 2) + "px" + a + ";}\n" + [".nc-container.tb-login .imgCaptcha", ".nc-container.tb-login .clickCaptcha"].join(",") + "{width:" + t + "px" + a + ";}\n" + [".nc-container.tb-login .imgCaptcha .captcha-error", ".nc-container.tb-login .clickCaptcha .captcha-error"].join(",") + "{width:" + (t - 8) + "px" + a + ";}\n.nc-container.tb-login .errloading, .nc-container .errloading {width:" + (t - 10) + "px;}")
                    },
                    updateAudioBoxWidth: function(e, t, n) {
                        var i = _.id(e + "omeo-refresh-audio").offsetWidth
                          , o = _.id(e + "_voice_close").offsetWidth
                          , a = _.id(e + "omeo-code-key").offsetWidth
                          , r = t - i - o - a - n;
                        _.id(e + "omeo-code-audiobox").style.width = r + "px"
                    },
                    try2setWidth: function(e, t) {
                        "string" == typeof e && (e = _.id(e)),
                        t = t || this.c_width || (el_render_to ? el_render_to.offsetWidth : 0),
                        t && e && e.style && (e.style.width = t + "px")
                    },
                    inituab: function() {
                        this.initUaParam(),
                        UA_Opt.Token = (new Date).getTime() + ":" + opt.token,
                        _.loadjs(util.addHourStamp(ajaxURL.uab_Url), function(e) {
                            if ("timeout" === e)
                                showError(!0, ERR_CODE_UABTIMEOUT),
                                report("loaduab failed"),
                                reportLoadJSError(LOAD_JS_TIMEOUT, "uab.js timeout");
                            else
                                try {
                                    UA_Opt.reload()
                                } catch (t) {
                                    report("uab die")
                                }
                        }, "nc-required-js-" + nc_index + " nc-uab-script")
                    },
                    initUaParam: function() {
                        function e(e, t) {
                            UA_Opt[e] = "undefined" != typeof UA_Opt[e] && UA_Opt[e] > 0 ? UA_Opt[e] : t
                        }
                        opt.is_Opt ? (e("MPInterval", 4),
                        e("MaxMCLog", 12),
                        e("MaxKSLog", 14),
                        e("MaxMPLog", 5),
                        e("MaxFocusLog", 6),
                        e("SendInterval", 5),
                        e("SendMethod", 8),
                        e("GPInterval", 50),
                        e("MaxGPLog", 1),
                        e("MaxTCLog", 12),
                        e("Flag", 882894)) : (UA_Opt.SendInterval = 5,
                        UA_Opt.SendMethod = 8,
                        UA_Opt.MaxMCLog = 12,
                        UA_Opt.MaxKSLog = 14,
                        UA_Opt.MaxMPLog = 5,
                        UA_Opt.MaxGPLog = 1,
                        UA_Opt.MaxTCLog = 12,
                        UA_Opt.GPInterval = 50,
                        UA_Opt.MPInterval = 4,
                        UA_Opt.MaxFocusLog = 6,
                        UA_Opt.isSendError = 1,
                        UA_Opt.Flag = 882894)
                    },
                    afterUA: function() {
                        "undefined" == typeof umx ? this.initUM() : this.afterUM()
                    },
                    initUM: function() {
                        var e = this;
                        _.loadjs(ajaxURL.umid_Url, function(t) {
                            if ("timeout" === t)
                                showError(!0, ERR_CODE_UMTIMEOUT),
                                reportLoadJSError(LOAD_JS_TIMEOUT, "um.js timeout");
                            else {
                                try {
                                    if (t) {
                                        if (--default_opt.times > 0)
                                            return void setTimeout(function() {
                                                e.initUM()
                                            }, 500);
                                        report("initUM")
                                    }
                                    var n = document.getElementById("_umfp")
                                      , i = (new Date).getTime();
                                    umx.init({
                                        timeout: opt.timeout,
                                        timestamp: i,
                                        token: opt.token,
                                        serviceUrl: ajaxURL.umid_serUrl,
                                        appName: opt.appkey,
                                        containers: {
                                            flash: n,
                                            dcp: n
                                        },
                                        closeImage: !1
                                    })
                                } catch (t) {
                                    report("umx die")
                                }
                                e.afterUM()
                            }
                        }, "nc-required-js-" + nc_index + " nc-umid-script")
                    },
                    afterUM: function() {
                        function e() {
                            win.__acjs ? (t.reload(),
                            clearInterval(o),
                            onNCEvent(event_names.ready)) : i++ > 100 && (showError(!0, ERR_CODE_UABTIMEOUT),
                            clearInterval(o))
                        }
                        if (!this.__nc_afterUM) {
                            this.__nc_afterUM = !0;
                            var t = this;
                            if ("undefined" == typeof umx)
                                return report("afterUM"),
                                void showError(!0, ERR_CODE_UMXUNDEFINED);
                            var n, i = 0;
                            setTimeout(function() {
                                n = !0
                            }, 3e3);
                            var o = setInterval(e, 100);
                            e()
                        }
                    },
                    __reload_voicebtn: function() {
                        var e, t = _.id(nc_prefix + "_voicebtn"), n = this;
                        _.addHandler(t, "keydown", function i(e) {
                            var n = e || window.event;
                            13 != n.keyCode && 13 != n.which || (_.removeEvt(t, "keydown", i),
                            t.click())
                        }),
                        t.onclick = function() {
                            function t() {
                                a || umx.getStatus() ? (clearInterval(c),
                                _.jsonp({
                                    url: ajaxURL.analyze,
                                    callback: "callback",
                                    data: {
                                        a: opt.appkey,
                                        t: opt.token,
                                        n: win._n || (UA_Opt.LogVal ? win[UA_Opt.LogVal] : "") || "",
                                        _a: "audio",
                                        p: _.obj2str(opt.trans),
                                        lang: opt.language,
                                        scene: opt.scene,
                                        v: inn_vars.v
                                    },
                                    success: i,
                                    fail: function() {
                                        e && report("audio fail")
                                    }
                                })) : r++ > 100 && (showError(!0, ERR_CODE_UMXRETRYLIMIT),
                                clearInterval(c))
                            }
                            function i(t) {
                                function i(e) {
                                    if (e.success)
                                        if (100 == e.result.code)
                                            n.userCallback(objCheckCode.config.sessionid, e.result.value, e.result.sig);
                                        else if (900 == e.result.code) {
                                            UA_Opt.reload && UA_Opt.reload();
                                            var t = _.id(nc_prefix + "_captcha_text")
                                              , i = language[opt.language]._errorClickTEXT;
                                            ++gErrTimes > MAX_ERR_TIME && (i = language[opt.language]._errorTooMuch.replace("%TOKEN", opt.token)),
                                            t.innerHTML = '<i class="nc_iconfont icon_close">' + icon_close + "</i>" + i,
                                            t.style.visibility = "visible"
                                        } else
                                            300 != e.result.code && 69634 != e.result.code || (report("block"),
                                            _.id(opt.renderTo).innerHTML = '<div class="errloading"><i class="nc_iconfont icon_warn">' + icon_warn + "</i>" + _upResetIndex(language[opt.language]._error300) + "</div>",
                                            onNCEvent(event_names.error),
                                            onNCEvent(event_names.error300));
                                    else
                                        n.errorCallback()
                                }
                                if (e) {
                                    var a = t.result;
                                    a && (objCheckCode || (objCheckCode = new clsCheckCode({
                                        a: opt.appkey,
                                        t: opt.token,
                                        n: win._n || (UA_Opt.LogVal ? win[UA_Opt.LogVal] : "") || "",
                                        type: "150_40",
                                        identity: opt.appkey,
                                        sessionid: a.csessionid,
                                        element: o,
                                        codeType: "audio",
                                        lang: opt.language,
                                        scene: opt.scene,
                                        p: _.obj2str(opt.trans)
                                    }),
                                    objCheckCode.check(function(e) {
                                        "success" != e.message && (objCheckCode.playErrAudio(),
                                        setTimeout(function() {
                                            var e = _.id(nc_prefix + "omeo-refresh-audio");
                                            e && e.click()
                                        }, 5e3)),
                                        "success" == e.message && _.jsonp({
                                            url: ajaxURL.checkcode,
                                            callback: "callback",
                                            data: {
                                                csessionid: a.csessionid,
                                                checkcode: function() {
                                                    var e = {};
                                                    return e.answer = objCheckCode.cache.lastCheckCode,
                                                    _.obj2str(e)
                                                }(),
                                                a: opt.appkey,
                                                t: opt.token,
                                                n: win._n || "",
                                                p: "{}",
                                                r: Math.random(),
                                                lang: opt.language,
                                                v: inn_vars.v
                                            },
                                            success: i,
                                            fail: function(e) {
                                                n.errorCallback(e)
                                            }
                                        })
                                    }),
                                    objCheckCode.render(),
                                    onNCEvent(event_names.switchevent, {
                                        from: "scale",
                                        to: "audio"
                                    }),
                                    objCheckCode.switchCode({
                                        type: "audio"
                                    })))
                                }
                            }
                            var o = _.id(nc_prefix + "_voice");
                            if (_.id(nc_prefix + "imgCaptcha").style.display = "none",
                            _.id(nc_prefix + "clickCaptcha").style.display = "none",
                            e)
                                return e = !1,
                                o.style.display = "none",
                                objCheckCode && objCheckCode.stopAudio(),
                                clearInterval(win.__progtid),
                                n.reset(),
                                !1;
                            e = !0,
                            o.style.display = "block",
                            objCheckCode && (objCheckCode.resetPlayer({
                                state: "end"
                            }),
                            objCheckCode.switchCode({
                                type: "audio"
                            }));
                            var a, r = 0;
                            setTimeout(function() {
                                a = !0
                            }, 3e3);
                            var c = setInterval(t, 100);
                            t()
                        }
                    },
                    reload: function() {
                        objCheckCode = null,
                        clearInterval(win.__progtid);
                        var e = _.id(opt.renderTo);
                        e && (e.innerHTML = tpl,
                        util.addClass(el_render_to, "nc-container")),
                        opt.audio && (_.id(nc_prefix + "_voicebtn").style.display = "block",
                        util.addClass(_.id(nc_prefix + "n1t"), "is_audio")),
                        tb_login && tb_login.init(this.render_to, el_render_to, opt.customFloatHeight),
                        this.__reload_voicebtn();
                        var t = _.id(nc_prefix + "_helpbtn");
                        t && (navigator.userAgent.indexOf("MSIE 6.0") >= 0 && (t.style.display = "none"),
                        t.innerHTML = language[opt.language]._learning,
                        t.onclick = function() {
                            setTimeout(showHelp, 100)
                        }
                        ),
                        TEXTELEM = _.tag(scale_bar + " div")[1],
                        inn_vars.TEXTELEM = TEXTELEM,
                        opt.isEnabled && new Scale(scale_btn,scale_bar,this)
                    },
                    reset: function() {
                        this.__nc_afterUM = !1,
                        win.UA_Opt && (UA_Opt.Token = (new Date).getTime() + ":" + opt.token);
                        var e;
                        opt.renderTo && opt.appkey && opt.token && (e = _.id(opt.renderTo),
                        e && util.addClass(el_render_to, "nc-container"),
                        e.innerHTML = '<div id="' + nc_prefix + 'nocaptcha"><div id="' + nc_prefix + 'wrapper" class="nc_wrapper"><div id="' + nc_prefix + '_n1t_loading" class="nc_scale"><div id="' + nc_prefix + '_bg" class="nc_bg" style="width: 0;"></div><div id="' + nc_prefix + '_scale_text_loading" class="scale_text">' + language[opt.language]._Loading + loading_circle_html + "</div></div></div></div>",
                        "undefined" == typeof win.acjs ? this.loaduab() : (UA_Opt.LogVal = "_n",
                        this.initUaParam(),
                        UA_Opt.Token = (new Date).getTime() + ":" + opt.token,
                        UA_Opt.reload && UA_Opt.reload()),
                        this.afterUA())
                    },
                    show: function() {
                        el_render_to && (el_render_to.style.display = "block",
                        tb_login && tb_login.adjustPosition(opt.customFloatHeight),
                        this.is_show = !0)
                    },
                    hide: function() {
                        el_render_to && (el_render_to.style.display = "none",
                        this.is_show = !1)
                    },
                    getTrans: function() {
                        return opt.trans
                    },
                    setTrans: function(e) {
                        return e && (opt.trans = e),
                        opt.trans
                    },
                    loaduab: function() {
                        UA_Opt.LogVal = "_n",
                        this.initUaParam(),
                        UA_Opt.Token = (new Date).getTime() + ":" + opt.token,
                        _.loadjs(util.addHourStamp(ajaxURL.uab_Url), function(e) {
                            "timeout" === e && (showError(!0, ERR_CODE_UABTIMEOUT),
                            report("loaduab failed"));
                            try {
                                UA_Opt.reload()
                            } catch (t) {
                                report("uab die")
                            }
                        }, "nc-required-js-" + nc_index + " nc-uab-script")
                    },
                    enabled: function() {
                        return new Scale(scale_btn,scale_bar,this)
                    },
                    errorCallback: function(e) {
                        var t = _.id(scale_bar)
                          , n = this
                          , i = t.getElementsByTagName("span")
                          , o = t.getElementsByTagName("div");
                        if (onNCEvent(event_names.fail),
                        0 !== i.length && 0 !== o.length) {
                            var a = i[0]
                              , r = o[0];
                            showError(e),
                            util.addClass(r, "orange"),
                            util.addClass(a, "reload"),
                            _.addHandler(t, "click", function() {
                                UA_Opt.Token = (new Date).getTime() + ":" + opt.token,
                                UA_Opt.reload && UA_Opt.reload(),
                                n.reload(),
                                _.removeEvt(t, "click")
                            }),
                            e && opt.error && opt.error(language[opt.language]._errorServer)
                        }
                    },
                    onScaleReady: function onScaleReady(elem) {
                        function waitForUmx() {
                            if (is_umx_getStatus_timeout || umx.getStatus()) {
                                clearInterval(timer);
                                try {
                                    UA_Opt.sendSA()
                                } catch (e) {}
                                _.jsonp({
                                    url: ajaxURL.analyze,
                                    callback: "callback",
                                    data: {
                                        a: opt.appkey,
                                        t: opt.token,
                                        n: win[UA_Opt.LogVal || "_n"] || "",
                                        p: _.obj2str(trans),
                                        scene: opt.scene || (inn_vars.has_pointman ? pointman.config.common.scene : "") || "",
                                        asyn: 0,
                                        lang: opt.language,
                                        v: inn_vars.v
                                    },
                                    success: function(e) {
                                        me.onScaleReadyCallback(e, elem)
                                    },
                                    fail: function(e) {
                                        report("onScaleReady"),
                                        me.errorCallback(e)
                                    }
                                })
                            } else
                                retry++ > 100 && (showError(!0, ERR_CODE_UMXRETRYLIMIT),
                                clearInterval(timer))
                        }
                        var trans = opt.trans || {};
                        "string" == typeof trans && (trans = eval("0," + trans));
                        for (var arr = opt.elementID || [], i = 0; i < arr.length; i++) {
                            var id = arr[i]
                              , el = doc.getElementById(id);
                            el && (trans[id] = el.value)
                        }
                        var me = this;
                        TEXTELEM.innerHTML = language[opt.language]._Loading + loading_circle_html,
                        util.addClass(inn_vars.TEXTELEM, "nc-align-center"),
                        util.addClass(TEXTELEM, "scale_text2");
                        var retry = 0, is_umx_getStatus_timeout;
                        setTimeout(function() {
                            is_umx_getStatus_timeout = !0
                        }, 3e3);
                        var timer = setInterval(waitForUmx, 100);
                        waitForUmx()
                    },
                    onScaleReadyCallback: function(e, t) {
                        if (e.success) {
                            var n = e.result
                              , i = n.code;
                            0 === i ? (_.id(scale_btn).className = "nc_iconfont btn_ok",
                            _.id(scale_btn).innerHTML = icon_ok_sign,
                            TEXTELEM.innerHTML = language[opt.language]._yesTEXT,
                            util.removeClass(t.btn.parentNode, "nc_err"),
                            this.userCallback(n.csessionid, "pass", n.value)) : (UA_Opt.reload && (UA_Opt.Token = (new Date).getTime() + ":" + opt.token,
                            UA_Opt.reload && UA_Opt.reload()),
                            util.addClass(t.btn, "nc_iconfont btn_warn"),
                            util.addClass(t.btn.parentNode, "nc_err"),
                            t.btn.innerHTML = icon_warn,
                            t.bar = _.tag(scale_bar + " div")[0],
                            TEXTELEM.innerHTML = language[opt.language]._Loading + loading_circle_html,
                            "function" == typeof opt.verifycallback && 300 != i && opt.verifycallback(n),
                            100 == i ? (this.__inn = 1,
                            this.onScale100(n.csessionid, n.value)) : 200 == i ? (this.__inn = 1,
                            this.onScale200(n.csessionid, n.value)) : 260 == i ? this.onScale260(n.csessionid, n.value) : 300 != i && 69634 != i || (report("block"),
                            util.removeClass(inn_vars.TEXTELEM, "nc-align-center"),
                            _.id(opt.renderTo).innerHTML = '<div class="errloading"><i class="nc_iconfont icon_warn">' + icon_warn + "</i>" + _upResetIndex(language[opt.language]._error300) + "</div>",
                            onNCEvent(event_names.error),
                            onNCEvent(event_names.error300)))
                        } else
                            this.errorCallback()
                    },
                    onScale100: function e(t, n, i) {
                        var o = e
                          , a = i || this
                          , r = _.tag(nc_prefix + "clickCaptcha div");
                        this.__inn && (this.__inn = 0,
                        _.addHandler(_.id(nc_prefix + "_btn_2"), "click", function() {
                            o.call(a, t, n)
                        }));
                        var c, s = setTimeout(function() {
                            s = -1,
                            c || (showError(!0, ERR_CODE_UABTIMEOUT),
                            report("captcha timeout"))
                        }, 5e3);
                        onNCEvent(event_names.beforeverify),
                        onNCEvent(event_names.before_code),
                        supportDataURI.then(function() {
                            return ajaxURL.get_captcha
                        }, function() {
                            return ajaxURL.get_captcha_pre
                        }).then(function(e) {
                            _.jsonp({
                                url: e,
                                callback: "callback",
                                data: {
                                    sessionid: t,
                                    identity: opt.appkey,
                                    style: n,
                                    lang: opt.language,
                                    v: inn_vars.v
                                },
                                success: function(e) {
                                    if (e.result.question && (e.result.question = e.result.question.replace(/<span[^>]+?>/g, "<i>"),
                                    e.result.question = e.result.question.replace(/<\/span[^>]*?>/g, "</i>"),
                                    a.captchaToken = e.result.captchaToken),
                                    c = !0,
                                    -1 != s) {
                                        if (clearTimeout(s),
                                        !e.result.tags)
                                            return report("no tag"),
                                            void showError(!0, ERR_CODE_CAPTCHA_NOTAG);
                                        var i = _.id(nc_prefix + "clickCaptcha");
                                        i && (i.style.display = "block",
                                        a.__is_c_width_setted || a.updateWidth(_.id(nc_prefix + "wrapper"), 1)),
                                        el_render_to && util.addClass(el_render_to, "show-click-captcha");
                                        var l = opt.appkey + "&sessionid"
                                          , d = e.result.question.split(e.result.tags[0])
                                          , u = d.shift();
                                        util.removeClass(inn_vars.TEXTELEM, "nc-align-center"),
                                        _.id(nc_prefix + "_scale_text") && (-1 == e.result.question.indexOf("<i>") ? _.id(nc_prefix + "_scale_text").innerHTML = u + "<i>\u201c" + e.result.tags[0] + "\u201d</i>" + d.join(e.result.tags[0]) : _.id(nc_prefix + "_scale_text").innerHTML = e.result.question),
                                        tb_login && tb_login.getInform(_.id(nc_prefix + "clickCaptcha"), module_nc.nc),
                                        r[1].innerHTML = '<img src="' + e.result.data + '" >';
                                        var p, f = r[1].getElementsByTagName("img")[0];
                                        f.onload = function() {
                                            p = !0,
                                            -1 != g && clearTimeout(g)
                                        }
                                        ,
                                        f.onerror = function() {
                                            report("captcha onerror"),
                                            showError()
                                        }
                                        ;
                                        var g = setTimeout(function() {
                                            g = -1,
                                            p || (showError(!0, ERR_CODE_IMAGE_TIMEOUT),
                                            report("captcha timeout"))
                                        }, 5e3);
                                        _.addHandler(f, "click", function(e) {
                                            util.addClass(inn_vars.TEXTELEM, "nc-align-center"),
                                            TEXTELEM.innerHTML = language[opt.language]._Loading + loading_circle_html,
                                            _.jsonp({
                                                url: ajaxURL.checkcode,
                                                callback: "callback",
                                                data: {
                                                    csessionid: t,
                                                    checkcode: function() {
                                                        var t = {};
                                                        return t.imgid = l,
                                                        t.w = f.width.toString(),
                                                        t.h = f.height.toString(),
                                                        t.x = void 0 === e.offsetX ? util.getOffset(e).offsetX : e.offsetX,
                                                        t.y = void 0 === e.offsetY ? util.getOffset(e).offsetY : e.offsetY,
                                                        t.x = parseInt(t.x).toString(),
                                                        t.y = parseInt(t.y).toString(),
                                                        t.captchaToken = a.captchaToken,
                                                        _.obj2str(t)
                                                    }(),
                                                    a: opt.appkey,
                                                    t: opt.token,
                                                    n: win._n || (UA_Opt.LogVal ? win[UA_Opt.LogVal] : "") || "",
                                                    p: "{}",
                                                    r: Math.random(),
                                                    lang: opt.language,
                                                    v: inn_vars.v
                                                },
                                                success: function(e) {
                                                    var i = _.id(scale_btn);
                                                    if (e.success)
                                                        if (100 == e.result.code)
                                                            i.className = "nc_iconfont btn_ok",
                                                            i.innerHTML = icon_ok_sign,
                                                            util.addClass(inn_vars.TEXTELEM, "nc-align-center"),
                                                            _.tag(scale_bar + " div")[0].className = "nc_bg",
                                                            TEXTELEM.innerHTML = language[opt.language]._yesTEXT,
                                                            util.removeClass(i.parentNode, "nc_err"),
                                                            _.toggle(nc_prefix + "clickCaptcha"),
                                                            el_render_to && util.removeClass(el_render_to, "show-click-captcha"),
                                                            a.userCallback && a.userCallback(t, n, e.result.sig);
                                                        else if (900 == e.result.code) {
                                                            UA_Opt.reload && UA_Opt.reload(),
                                                            o.call(a, t, n, a);
                                                            var r = _.id(nc_prefix + "_captcha_text")
                                                              , c = language[opt.language]._errorClickTEXT;
                                                            ++gErrTimes > MAX_ERR_TIME && (c = language[opt.language]._errorTooMuchClick.replace("%TOKEN", opt.token)),
                                                            r.innerHTML = '<i class="nc_iconfont icon_close">' + icon_close + "</i>" + c,
                                                            r.style.visibility = "visible"
                                                        } else
                                                            300 != e.result.code && 69634 != e.result.code || (report("block"),
                                                            _.id(opt.renderTo).innerHTML = '<div class="errloading"><i class="nc_iconfont icon_warn">' + icon_warn + "</i>" + _upResetIndex(language[opt.language]._error300) + "</div>",
                                                            onNCEvent(event_names.error),
                                                            onNCEvent(event_names.error300));
                                                    else
                                                        a.errorCallback()
                                                },
                                                fail: function(e) {
                                                    a.errorCallback(e)
                                                }
                                            })
                                        }),
                                        onNCEvent(event_names.afterverify),
                                        onNCEvent(event_names.after_code)
                                    }
                                },
                                fail: function() {
                                    _.id(opt.renderTo).innerHTML = '<div class="errloading"><i class="nc_iconfont icon_warn">' + icon_warn + "</i>" + _upResetIndex(language[opt.language]._errorLOADING) + "</div>",
                                    a.errorCallback(!0)
                                }
                            })
                        })
                    },
                    onScale200: function t(e, n) {
                        function i(e) {
                            var t = _.id(nc_prefix + "captcha_input");
                            return (f = t.value.replace(/[^\w\/]/gi, "")) ? (f.length > p.length ? u.push(f.slice(p.length)) : f.length < p.length ? u.push("bsp") : u.push("oth"),
                            void (p = f)) : (p = "",
                            void u.push("oth"))
                        }
                        function o() {
                            var t = _.tag(nc_prefix + "imgCaptcha input")[0].value;
                            if (t) {
                                var i = {
                                    ksl: u.slice(0, 20)
                                };
                                _.jsonp({
                                    url: ajaxURL.checkcode,
                                    callback: "callback",
                                    data: {
                                        csessionid: e,
                                        checkcode: function() {
                                            var e = {};
                                            return e.answer = t,
                                            e.captchaToken = c.captchaToken,
                                            _.obj2str(e)
                                        }(),
                                        a: opt.appkey,
                                        t: opt.token,
                                        n: win._n || (UA_Opt.LogVal ? win[UA_Opt.LogVal] : "") || "",
                                        p: _.obj2str(i),
                                        lang: opt.language,
                                        v: inn_vars.v
                                    },
                                    success: function(t) {
                                        if (t.success) {
                                            var i = _.id(scale_btn)
                                              , o = _.tag(nc_prefix + "imgCaptcha div")[2];
                                            if (100 == t.result.code)
                                                i.className = "nc_iconfont btn_ok",
                                                i.innerHTML = icon_ok_sign,
                                                _.tag(scale_bar + " div")[0].className = "nc_bg",
                                                TEXTELEM.innerHTML = language[opt.language]._yesTEXT,
                                                util.addClass(inn_vars.TEXTELEM, "nc-align-center"),
                                                util.removeClass(i.parentNode, "nc_err"),
                                                o.style.borderTopColor = "#e5e5e5",
                                                _.toggle(nc_prefix + "imgCaptcha"),
                                                c.userCallback.call(this, e, n, t.result.sig);
                                            else if (900 == t.result.code) {
                                                var a = _.tag(nc_prefix + "imgCaptcha input")[0];
                                                a && (a.value = ""),
                                                UA_Opt.reload && UA_Opt.reload(),
                                                r.call(c, e, n);
                                                var s = language[opt.language]._errorTEXT;
                                                ++gErrTimes > MAX_ERR_TIME && (s = language[opt.language]._errorTooMuch.replace("%TOKEN", opt.token));
                                                var l = _.id(nc_prefix + "_captcha_img_text");
                                                l.innerHTML = '<i class="nc_iconfont icon_close">' + icon_close + "</i>" + s,
                                                l.style.display = "block",
                                                l.style.visibility = "visible",
                                                o.style.borderTopColor = "red"
                                            } else
                                                300 != t.result.code && 69634 != t.result.code || (report("block"),
                                                _.id(opt.renderTo).innerHTML = '<div class="errloading"><i class="nc_iconfont icon_warn">' + icon_warn + "</i>" + _upResetIndex(language[opt.language]._error300) + "</div>",
                                                onNCEvent(event_names.error),
                                                onNCEvent(event_names.error300))
                                        } else
                                            c.errorCallback();
                                        u = [],
                                        p = ""
                                    },
                                    fail: function(e) {
                                        c.errorCallback(e)
                                    }
                                })
                            }
                        }
                        onNCEvent(event_names.beforeverify),
                        onNCEvent(event_names.before_code);
                        var a = _.id(nc_prefix + "imgCaptcha");
                        a && (this.__is_c_width_setted || this.updateWidth(_.id(nc_prefix + "wrapper"), 1));
                        var r = t
                          , c = this
                          , s = _.tag(nc_prefix + "imgCaptcha div")
                          , l = supportDataURI.then(function() {
                            return ajaxURL.get_img
                        }, function() {
                            return ajaxURL.get_img_pre
                        }).then(function(t) {
                            var i = opt;
                            return util.request({
                                url: t,
                                data: {
                                    sessionid: e,
                                    identity: i.appkey,
                                    token: opt.token,
                                    style: n
                                }
                            })
                        }).then(function(e) {
                            return e.success && 0 === e.result.resultCode ? (c.captchaToken = e.result.captchaToken,
                            util.imageLoaded(e.result.data[0])) : Promise.reject({
                                type: "request",
                                code: e.result.resultCode,
                                msg: e.result.message
                            })
                        }).then(function(t) {
                            a.style.display = "block",
                            s[1].innerHTML = "",
                            s[1].appendChild(t);
                            var i = s[1].getElementsByTagName("img")[0];
                            _.addHandler(i, "click", function() {
                                r.call(c, e, n)
                            }),
                            TEXTELEM.innerHTML = language[opt.language]._noTEXT,
                            tb_login && tb_login.getInform(_.id(nc_prefix + "imgCaptcha"), module_nc.nc),
                            util.removeClass(inn_vars.TEXTELEM, "nc-align-center"),
                            _.id(nc_prefix + "scale_submit").innerHTML = language[opt.language]._submit
                        });
                        l["catch"](function(e) {
                            /^(request)$/.test(e.type) ? showError(!0, ERR_CODE_IMAGE_REQUEST_ERROR) : /^(img)$/.test(e.type) && showError()
                        });
                        var d, u = [], p = "", f = "";
                        this.__inn && (this.__inn = 0,
                        _.addHandler(_.id(nc_prefix + "scale_submit"), "click", o),
                        _.addHandler(_.id(nc_prefix + "_btn_2"), "click", function() {
                            r.call(this, e, n)
                        }),
                        window.addEventListener ? _.id(nc_prefix + "captcha_input").addEventListener("input", i) : _.id(nc_prefix + "captcha_input").attachEvent("onpropertychange", function(e) {
                            "value" === e.propertyName && i()
                        }),
                        d = _.id(nc_prefix + "imgCaptcha"),
                        d && (d = d.getElementsByTagName("input")[0]) && _.addHandler(d, "keydown", function(e) {
                            return e = e || window.event,
                            13 == e.keyCode || 13 == e.which ? (o(),
                            e.preventDefault ? e.preventDefault() : window.event.returnValue = !1,
                            !1) : void 0
                        })),
                        onNCEvent(event_names.afterverify),
                        onNCEvent(event_names.after_code)
                    },
                    onScale260: function(e, t) {
                        var n = this;
                        onNCEvent(event_names.beforeverify),
                        onNCEvent(event_names.before_code),
                        TEXTELEM.innerHTML = language[opt.language]._cc_select,
                        this.imgCategoryCaptcha = new ImgCategoryCaptcha(util.mix({
                            nc: this,
                            prefix: nc_prefix,
                            $wrapper: _.id(nc_prefix + "wrapper"),
                            csessionid: e,
                            value: t,
                            onfail: function() {
                                onNCEvent(event_names.fail)
                            },
                            onerror: function() {
                                onNCEvent(event_names.error),
                                onNCEvent(event_names.error300)
                            },
                            onsuccess: function(i) {
                                var o = _.id(scale_btn);
                                o.className = "nc_iconfont btn_ok",
                                o.innerHTML = icon_ok_sign,
                                TEXTELEM.innerHTML = language[opt.language]._yesTEXT,
                                util.removeClass(o.parentNode, "nc_err");
                                try {
                                    n.userCallback(e, t, i)
                                } catch (a) {
                                    throw a
                                }
                            }
                        }, opt),{
                            v: inn_vars.v,
                            obj2str: _.obj2str
                        }),
                        onNCEvent(event_names.afterverify),
                        onNCEvent(event_names.after_code)
                    },
                    userCallback: function(e, t, n) {
                        var i = {
                            csessionid: e || null,
                            value: t || null,
                            sig: n || null,
                            token: _getToken()
                        };
                        opt.callback && opt.callback.call(this, i),
                        onNCEvent(event_names.success, i)
                    },
                    upLang: function(e, t) {
                        return _upLang(e, t)
                    },
                    getToken: function() {
                        return _getToken()
                    },
                    destroy: function() {
                        el_render_to.innerHTML = "";
                        var e, t, n, i = util.getElementsByClassName("nc-custom-style-" + nc_index);
                        if (util.getElementsByClassName("nc-required-js-" + nc_index),
                        e = i.length,
                        e > 0)
                            for (t = 0; e > t; t++)
                                n = i[0].parentNode,
                                n && n.removeChild(i[0])
                    }
                },
                NoCaptcha
            }
            var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            , win = window, doc = document, tb_login, util = __webpack_require__(2), ImgCategoryCaptcha = __webpack_require__(110), mmstat_base = __webpack_require__(10).mmstat_base, URL_MAP = __webpack_require__(10).URL_MAP, language = __webpack_require__(4).language, _upLang = __webpack_require__(4).upLang, upResetIndex = __webpack_require__(4).upResetIndex, loadExLang = __webpack_require__(111).loadExLang, makeTemplate = __webpack_require__(119).makeTemplate, m_checkcode = __webpack_require__(108), makeShowHelp = __webpack_require__(117).makeShowHelp, default_opt = __webpack_require__(22).default_opt, report2 = __webpack_require__(8), css = __webpack_require__(109), MAX_ERR_TIME = 3, NC_LOGO_URL = "//imaeis.alicdn.com/tfs/TB1itI1PVXXXXXTXVXXXXXXXXXX-52-32.png", ERR_CODE_UABTIMEOUT = "01", ERR_CODE_UMTIMEOUT = "02", ERR_CODE_UMXUNDEFINED = "04", ERR_CODE_UMXRETRYLIMIT = "08", ERR_CODE_CAPTCHA_NOTAG = "16", ERR_CODE_IMAGE_TIMEOUT = "32", ERR_CODE_IMAGE_REQUEST_ERROR = "64", LOAD_JS_TIMEOUT = "LOAD_JS_TIMEOUT", icon_warn = "&#xe60a;", icon_ok_sign = "&#xe60b;", icon_close = "&#xe609;", m_event = __webpack_require__(9), event_names = m_event.names, event_deprecated = m_event.deprecated, Promise = __webpack_require__(1);
            exports.makeNoCaptcha = makeNoCaptcha
        }
        , function(e, t, n) {
            "use strict";
            t.reg = function(e) {
                if (-1 !== location.hostname.indexOf("alipay.com")) {
                    var t = e.renderTo;
                    if (t && "string" == typeof t) {
                        t = t.replace("#", "");
                        var n = document.getElementById(t);
                        if (n) {
                            var i = n.parentNode;
                            i && "_umfp" == i.id && (e.customWidth = e.customWidth || 300)
                        }
                    }
                }
            }
        }
        , function(e, t, n) {
            "use strict";
            function i() {
                var e = navigator.userAgent;
                return !/Firefox|MSIE/.test(e)
            }
            function o(e, t, n) {
                function o(e, n, o) {
                    t.TEXTELEM && (t.TEXTELEM.innerHTML = s[o.opt.language || l.language]._startTEXT,
                    i() && c.addClass(t.TEXTELEM, "slidetounlock")),
                    this.btn = r.getElementById(e),
                    this.bar = r.getElementById(n),
                    this.txt = r.getElementById(u + "_scale_text"),
                    this.step = this.bar.getElementsByTagName("DIV")[0],
                    this.init(o)
                }
                var u = t.prefix;
                return o.prototype = {
                    init: function(t) {
                        function i(i) {
                            function a() {
                                s.btn.onmousedown = null,
                                s.txt.onmousedown = null,
                                e.removeEvt(l, "mousemove", r),
                                e.removeEvt(l, "mouseup", g),
                                e.removeEvt(l, "touchmove", _),
                                e.removeEvt(l, "touchend", h),
                                e.removeEvt(s.btn, "touchstart", o),
                                e.removeEvt(s.txt, "touchstart", o);
                                var i = {};
                                i.btn = s.btn,
                                i.bar = s.bar.childNodes[1],
                                n(d.actionend),
                                n(d.slide_end),
                                t.onScaleReady(i)
                            }
                            function r(e) {
                                m || (n(d.actionstart),
                                n(d.slide_start),
                                m = !0);
                                var t = (e || p.event).clientX
                                  , i = f.min(b, f.max(-2, x + (t - v)));
                                s.btn.style.left = i + "px",
                                s.ondrag(f.round(100 * f.max(0, i / b)), i);
                                var o = k + s.bar.offsetWidth;
                                if (t >= o && (b > i || b > t - x))
                                    return void g.call(this);
                                var r = c.getClientRect(s.btn).left;
                                i != b && t - r - y != b || a()
                            }
                            function g() {
                                var t = parseInt(s.btn.style.left);
                                b > t && (c.addClass(s.btn, "button_move"),
                                c.addClass(e.id(u + "_bg"), "bg_move"),
                                s.btn.style.left = "0px",
                                s.ondrag(0, 0),
                                setTimeout(function() {
                                    c.removeClass(s.btn, "button_move"),
                                    c.removeClass(e.id(u + "_bg"), "bg_move")
                                }, 500)),
                                e.removeEvt(this, "touchmove", _),
                                e.removeEvt(l, "touchmove", _),
                                e.removeEvt(l, "mousemove", r),
                                e.removeEvt(l, "mouseup", g)
                            }
                            function h(e) {
                                g.call(this, e.touches[0])
                            }
                            function _(e) {
                                e.preventDefault(),
                                r.call(this, e.touches[0])
                            }
                            var m = !1
                              , v = (i || p.event).clientX
                              , y = s.btn.offsetWidth
                              , b = s.bar.offsetWidth - y
                              , x = s.btn.offsetLeft
                              , k = c.getClientRect(s.bar).left;
                            e.addHandler(l, "mousemove", r),
                            e.addHandler(l, "mouseup", g),
                            e.addHandler(l, "touchmove", _),
                            e.addHandler(l, "touchend", h)
                        }
                        function o(e) {
                            e.preventDefault(),
                            i.call(this, e.touches[0])
                        }
                        var s = this
                          , l = r
                          , p = a
                          , f = Math;
                        s.btn.onmousedown = i,
                        s.txt.onmousedown = i,
                        e.addHandler(s.btn, "touchstart", o),
                        e.addHandler(s.txt, "touchstart", o),
                        s.bar.onselectstart = function() {
                            return !1
                        }
                    },
                    ondrag: function(e, t) {
                        this.step.style.width = Math.max(0, t) + "px"
                    },
                    text: function() {}
                },
                o
            }
            var a = window
              , r = document
              , c = n(2)
              , s = n(4).language
              , l = n(22).default_opt
              , d = n(9).names;
            t.makeScale = o
        }
        , function(e, t, n) {
            "use strict";
            function i(e, t, n) {
                function i() {
                    c || (c = r()),
                    c()
                }
                function r() {
                    function n() {
                        var e = o.createElement("div");
                        return e.innerHTML = r,
                        e.firstChild
                    }
                    function i() {
                        function n() {
                            var t = 0
                              , n = 260
                              , i = setInterval(function() {
                                t += 5,
                                t > n ? (p.innerHTML = a[e.language]._Loading,
                                t > n + 100 && (p.innerHTML = a[e.language]._yesTEXT,
                                clearInterval(i),
                                setTimeout(function() {
                                    f.click()
                                }, 2e3))) : (g.style.left = s + 20 + t + "px",
                                u.style.left = t + "px",
                                p.style.width = t + "px")
                            }, 16)
                        }
                        p.innerHTML = "",
                        c.style.display = "block";
                        var i = t.id(e.renderTo)
                          , r = i.getBoundingClientRect()
                          , s = r.left
                          , l = r.top + 20 + o.body.scrollTop;
                        d.style.left = s + "px",
                        d.style.top = l + "px",
                        u.style.left = s - 10 + "px",
                        g.style.left = s + 20 + "px",
                        g.style.top = l + 20 + "px",
                        f.style.left = s + 200 + "px",
                        f.style.top = l + 90 + "px",
                        n()
                    }
                    var r = '<div id="' + s + '_help" class="nc_help"><div class="mask"></div><div id="' + s + '_slide_box" class="nc_scale"><div id="' + s + '_slide_button"></div><div id="' + s + '_slide_text" class="scale_text"></div><div id="' + s + '_slide_bg"></div></div><div id="' + s + '_btn_close"></div><div id="' + s + '_hand"></div>'
                      , c = n(r);
                    o.body.appendChild(c),
                    c.style.display = "none",
                    c.style.width = o.body.scrollWidth + "px",
                    c.style.height = o.body.scrollHeight + "px";
                    var l = t.id(s + "_slide_text");
                    l.innerHTML = a[e.language]._startTEXT;
                    var d = t.id(s + "_slide_box")
                      , u = t.id(s + "_slide_button")
                      , p = t.id(s + "_slide_bg")
                      , f = t.id(s + "_btn_close")
                      , g = t.id(s + "_hand");
                    return f.innerHTML = a[e.language]._closeHelp,
                    f.onclick = function() {
                        c.style.display = "none"
                    }
                    ,
                    i
                }
                var c, s = n.prefix;
                return i
            }
            var o = document
              , a = n(4).language;
            t.makeShowHelp = i
        }
        , function(e, t, n) {
            "use strict";
            function i(e) {
                function t(e) {
                    return o.getElementById(e)
                }
                function i(e) {
                    if (!e)
                        return 0;
                    for (var t = e.offsetTop, n = e.offsetParent; n; )
                        t += n.offsetTop,
                        n = n.offsetParent;
                    return t
                }
                function a(e, t) {
                    var n, i, o, a = e.getElementsByTagName("div");
                    for (n = 0; n < a.length; n++)
                        if (i = a[n],
                        o = i.className,
                        o && o.indexOf(t) > -1)
                            return i;
                    return null
                }
                function r(e) {
                    var n = t(h + "_scale_text")
                      , i = a(e, "captcha-error");
                    i || (i = o.createElement("div"),
                    i.className = "captcha-error login-msg error",
                    e.appendChild(i)),
                    i.innerHTML = ["<i class='nc_iconfont icon_ban'>&#xe603;</i>", "<p class='error'>", n.innerHTML, "</p>"].join("")
                }
                function c(e, t) {
                    var n = e.className;
                    n.match(new RegExp("(^|\\s)" + t + "(\\s|$)")) || (e.className = (e.className + " " + t).replace(/^\s+|\s+$/g, ""))
                }
                function s() {
                    var e = 0
                      , n = t("J_Message");
                    return n && (e = n.offsetHeight),
                    e
                }
                function l() {
                    s() > 0 && g && c(g, "nc-tm-min-fix")
                }
                function d(e) {
                    if (g) {
                        var n;
                        m && (n = t(h + "_btn_1")) && (n.style.position = "absolute",
                        n.style.top = "77px",
                        n.style.right = "0");
                        var o = g.className || ""
                          , a = "tb-login";
                        -1 == o.indexOf(a) && (g.className = (o + " " + a).replace(/^\s+|\s+$/g, "")),
                        g.className.match(/\bnc-old-login\b/) && (p = !0);
                        var r;
                        if (r = t("J_LoginBox") || t("J_Login") || _.getElementsByClassName("nc-outer-box")[0]) {
                            var c = p ? 0 : 2
                              , u = i(g)
                              , f = d;
                            if (0 >= u) {
                                if (f._count > 100)
                                    return;
                                return f._count = (f._count || 0) + 1,
                                void setTimeout(f, 100)
                            }
                            var v, y, b = i(r) - u, x = r.getBoundingClientRect();
                            "number" == typeof e ? (v = e,
                            y = 1) : v = x.height ? x.height : x.bottom - x.top;
                            var k, w;
                            w = t(h + "imgCaptcha"),
                            w && (w.style.top = b + c + "px",
                            k = v - c - 66,
                            y && (k -= 13),
                            y || 0 !== s() || (w.style.minHeight = "290px",
                            k -= 10),
                            w.style.height = k + "px",
                            y && (w.style.minHeight = 0)),
                            w = t(h + "clickCaptcha"),
                            w && (w.style.top = b + c + "px",
                            p ? (l(),
                            k = v + 30,
                            255 > k && (k = 255),
                            w.style.height = k + "px") : (l(),
                            k = v - c - 30,
                            y && (k -= 8),
                            w.style.height = k + "px"),
                            y && (w.style.minHeight = 0))
                        }
                    }
                }
                function u(e, t, n) {
                    f = e,
                    g = t,
                    d(n)
                }
                var p, f, g, h = e.prefix, _ = n(2), m = _.isIEX(6);
                return {
                    init: u,
                    adjustPosition: d,
                    getInform: r
                }
            }
            var o = document;
            t.makeTBLogin = i
        }
        , function(e, t, n) {
            "use strict";
            function i(e) {
                var t = e.prefix
                  , n = '\n<div id="' + t + 'wrapper" class="nc_wrapper">\n<div id="' + t + 'n1t" class="nc_scale">\n<div id="' + t + '_bg" class="nc_bg"></div>\n<span id="' + t + 'n1z" class="nc_iconfont btn_slide">&#xe601;</span>\n<div id="' + t + '_scale_text" class="scale_text"></div>\n<div id="' + t + 'clickCaptcha" class="clickCaptcha">\n<div class="clickCaptcha_text">\n<b id="' + t + '_captcha_text" class="nc_captch_text"></b>\n<i id="' + t + '_btn_2" class="nc_iconfont nc_btn_2 btn_refresh">&#xe607;</i>\n</div>\n<div class="clickCaptcha_img"></div>\n<div class="clickCaptcha_btn"></div>\n</div>\n<div id="' + t + 'imgCaptcha" class="imgCaptcha">\n<div class="imgCaptcha_text"><input id="' + t + 'captcha_input" maxlength="6" type="text" style="ime-mode:disabled"></div>\n<div class="imgCaptcha_img" id="' + t + '_imgCaptcha_img"></div>\n<i id="' + t + '_btn_1" class="nc_iconfont nc_btn_1 btn_refresh"\n    onclick="document.getElementById(\'' + t + '_imgCaptcha_img\').children[0].click()">&#xe607;</i>\n<div class="imgCaptcha_btn">\n<div id="' + t + '_captcha_img_text" class="nc_captcha_img_text"></div>\n<div id="' + t + 'scale_submit" class="nc_scale_submit"></div>\n</div>\n</div>\n<div id="' + t + 'cc" class="nc-cc"></div>\n<i id="' + t + '_voicebtn" tabindex="0" role="button" class="nc_voicebtn nc_iconfont" style="display:none" >&#xe604;</i>\n<b id="' + t + '_helpbtn" class="nc_helpbtn"></b>\n</div>\n<div id="' + t + '_voice" class="nc_voice"></div>\n</div>\n';
                return n
            }
            t.makeTemplate = i
        }
        , function(e, t, n) {
            "use strict";
            function i(e, t) {
                if (!(e instanceof t))
                    throw new TypeError("Cannot call a class as a function")
            }
            var o = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        i.enumerable = i.enumerable || !1,
                        i.configurable = !0,
                        "value"in i && (i.writable = !0),
                        Object.defineProperty(e, i.key, i)
                    }
                }
                return function(t, n, i) {
                    return n && e(t.prototype, n),
                    i && e(t, i),
                    t
                }
            }()
              , a = n(12)
              , r = n(17)
              , c = n(3)
              , s = n(126).default_opt
              , l = n(8)
              , d = n(1)
              , u = [{
                name: "init",
                from: "initially",
                to: "loading"
            }, {
                name: "load",
                from: "loading",
                to: "ready"
            }, {
                name: "loaderror",
                from: ["loading", "ready"],
                to: "load_error"
            }, {
                name: "continueloading",
                from: "load_error",
                to: "loading"
            }, {
                name: "verify",
                from: ["ready", "fail"],
                to: "verifying"
            }, {
                name: "timeout",
                from: "ready",
                to: "actiontimeout"
            }, {
                name: "verifyfail",
                from: ["ready", "verifying"],
                to: "fail"
            }, {
                name: "verifyerror",
                from: "verifying",
                to: "error"
            }, {
                name: "verifytwostep",
                from: "verifying",
                to: "need_two_step_verify"
            }, {
                name: "verifypass",
                from: "verifying",
                to: "pass"
            }, {
                name: "reset",
                from: ["*"],
                to: "reseting"
            }, {
                name: "resetdone",
                from: "reseting",
                to: "loading"
            }, {
                name: "destroy",
                from: ["*"],
                to: "destroyed"
            }, {
                name: "showtwostep",
                from: "need_two_step_verify",
                to: "ts_loading"
            }, {
                name: "ts_load",
                from: "ts_loading",
                to: "ts_ready"
            }, {
                name: "ts_verify",
                from: ["ts_ready", "ts_fail"],
                to: "ts_verifying"
            }, {
                name: "ts_verifyfail",
                from: "ts_verifying",
                to: "ts_fail"
            }, {
                name: "ts_verifyerror",
                from: "ts_verifying",
                to: "ts_error"
            }, {
                name: "ts_verifyerror2",
                from: "ts_error",
                to: "error"
            }, {
                name: "ts_verifypass",
                from: "ts_verifying",
                to: "ts_pass"
            }, {
                name: "ts_passed",
                from: "ts_pass",
                to: "pass"
            }]
              , p = function() {
                function e(t, n) {
                    i(this, e);
                    var o = s.language;
                    t.foreign && (o = "en",
                    s.language = o),
                    this.options = c.mix({}, o, t),
                    this.inn_vars = n,
                    n.index++,
                    this.index = n.index,
                    this.jsv = n.v,
                    this.el = document.getElementById(t.renderTo.replace(/^#/, "")),
                    this.el || r.fail("'renderTo'(" + t.renderTo + ") does not match any node."),
                    this.makeFSM(),
                    this.initStates(),
                    this.event_listeners = {},
                    this._custom_state = {},
                    this.fsm.init()
                }
                return o(e, [{
                    key: "makeFSM",
                    value: function() {
                        var e = this;
                        this.fsm = a.create({
                            initial: "initially",
                            events: u
                        }),
                        this.fsm.onenterstate = function(t, n, i) {
                            if ("loading" !== i) {
                                var o = e._custom_state[i];
                                Array.isArray(o) && d.all(c.map(o, function(e) {
                                    return e()
                                }))
                            }
                        }
                    }
                }, {
                    key: "initStates",
                    value: function() {
                        var e = this;
                        c.map(u, function(t) {
                            n(133)("./" + t.to).init(e)
                        })
                    }
                }, {
                    key: "on",
                    value: function(e, t) {
                        (this.event_listeners[e] = this.event_listeners[e] || []).push(t)
                    }
                }, {
                    key: "reg",
                    value: function(e, t) {
                        this._custom_state[e] = this._custom_state[e] || [],
                        this._custom_state[e].push(t)
                    }
                }, {
                    key: "fire",
                    value: function(e) {
                        for (var t = this.event_listeners[e] = this.event_listeners[e] || [], n = 0; n < t.length && t[n].call() !== !1; n++)
                            ;
                    }
                }, {
                    key: "reload",
                    value: function() {
                        this.fsm.reset()
                    }
                }, {
                    key: "reset",
                    value: function() {
                        this.fsm.reset()
                    }
                }, {
                    key: "show",
                    value: function() {
                        this.el.style.display = "block"
                    }
                }, {
                    key: "hide",
                    value: function() {
                        this.el.style.display = "none"
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        this.is_destroyed || (this.fsm.destroy(),
                        this.is_destroyed = !0)
                    }
                }, {
                    key: "_log",
                    value: function(e, t) {
                        var n = this.options
                          , i = n.token || UA_Opt.Token || ("undefined" != typeof umx && umx.getToken ? umx.getToken() : "");
                        l.log({
                            a: n.appkey,
                            t: i,
                            scene: n.scene,
                            ns: "",
                            jsv: this.jsv,
                            usa: navigator.userAgent,
                            p: "",
                            jsType: "pc",
                            os: c.getOS(),
                            em: t,
                            ec: e
                        })
                    }
                }]),
                e
            }();
            t.NC2 = p
        }
        , function(e, t, n) {
            "use strict";
            e.exports = n(21).BaseFun
        }
        , function(module, exports, __webpack_require__) {
            "use strict";
            function _classCallCheck(e, t) {
                if (!(e instanceof t))
                    throw new TypeError("Cannot call a class as a function")
            }
            var _slicedToArray = function() {
                function e(e, t) {
                    var n = []
                      , i = !0
                      , o = !1
                      , a = void 0;
                    try {
                        for (var r, c = e[Symbol.iterator](); !(i = (r = c.next()).done) && (n.push(r.value),
                        !t || n.length !== t); i = !0)
                            ;
                    } catch (s) {
                        o = !0,
                        a = s
                    } finally {
                        try {
                            !i && c["return"] && c["return"]()
                        } finally {
                            if (o)
                                throw a
                        }
                    }
                    return n
                }
                return function(t, n) {
                    if (Array.isArray(t))
                        return t;
                    if (Symbol.iterator in Object(t))
                        return e(t, n);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }()
              , _createClass = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        i.enumerable = i.enumerable || !1,
                        i.configurable = !0,
                        "value"in i && (i.writable = !0),
                        Object.defineProperty(e, i.key, i)
                    }
                }
                return function(t, n, i) {
                    return n && e(t.prototype, n),
                    i && e(t, i),
                    t
                }
            }()
              , html = __webpack_require__(125).html
              , kvTpl = __webpack_require__(19)
              , BaseFn = __webpack_require__(121)
              , util = __webpack_require__(3)
              , cfg = __webpack_require__(123)
              , language = __webpack_require__(47).language
              , upResetIndex = __webpack_require__(47).upResetIndex
              , Promise = __webpack_require__(1)
              , doc = document
              , getElementById = function(e) {
                return doc.getElementById(e)
            }
              , styleEl = function(e, t, n) {
                return e.style[t] = n
            }
              , ERR_CODE_API_FAIL = "SCRAPE_API_FAIL"
              , FAIL_PREPARE = "fail_prepare"
              , FAIL_ANALYZE = "fail_analyze"
              , win = window;
            __webpack_require__(13),
            __webpack_require__(73);
            var obj_w = -1
              , obj_h = -1
              , Scrape = function() {
                function Scrape(e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    _classCallCheck(this, Scrape),
                    this.nc = e,
                    this.prefix = e.prefix || "nc_" + e.index + "_",
                    this.root = e.el;
                    var n = {};
                    t.foreign && (n.language = "en"),
                    this.options = util.mix({}, cfg.default_options, n, e.options || {}, t),
                    this._last_x = -1,
                    this._last_y = -1,
                    this.stroke_size = t.stroke_size || cfg.default_stroke_width,
                    this.svr_data = {},
                    this._t_action = null,
                    this.is_downgraded = !1,
                    this._lang = language[this.options.language],
                    this.mousedown = !1,
                    this.baseFn = new BaseFn(this.options,util.obj2param),
                    this.reg()
                }
                return _createClass(Scrape, [{
                    key: "reg",
                    value: function() {
                        var e = this
                          , t = this.nc;
                        t.reg("_on_loading", function() {
                            return e.loading_render()
                        }),
                        t.reg("loading", function() {
                            return e.loading_initGetSize()
                        }),
                        t.reg("verifying", function() {
                            return e.verifyMethod()
                        }),
                        t.reg("load_error", function() {
                            return e.on_load_error()
                        }),
                        t.reg("pass", function() {
                            return e.on_pass()
                        }),
                        t.reg("fail", function() {
                            return e.on_fail()
                        }),
                        t.reg("reseting", function() {
                            return e.on_reseting()
                        }),
                        t.reg("actiontimeout", function() {
                            return e.on_actiontimeout()
                        }),
                        t.on_leave_loading = function() {
                            return e.on_leave_loading()
                        }
                    }
                }, {
                    key: "loading_initGetSize",
                    value: function() {
                        var e = this
                          , t = this.options.objects;
                        return Promise.all(util.map(t, function(e) {
                            return new Promise(function(t, n) {
                                util.getImgSize(e, function(e, i) {
                                    e ? n([0, 0]) : t(i)
                                })
                            }
                            )
                        })).then(function(t) {
                            var n = 0
                              , i = 0;
                            util.map(t, function(e) {
                                n = Math.max(n, e[0]),
                                i = Math.max(i, e[1])
                            }),
                            e.obj_w = n,
                            e.obj_h = i
                        })["catch"](function(t) {
                            e.nc.fsm.loaderror()
                        })
                    }
                }, {
                    key: "on_leave_loading",
                    value: function() {
                        this.hideEl("loading")
                    }
                }, {
                    key: "on_reseting",
                    value: function() {
                        var e = this;
                        return Promise.resolve().then(function() {
                            return e.loading_render()
                        })
                    }
                }, {
                    key: "getParamOl",
                    value: function() {
                        var e = this.el_nc_canvas
                          , t = util.getElementLeft(e)
                          , n = util.getElementTop(e);
                        return {
                            x: t,
                            y: n
                        }
                    }
                }, {
                    key: "loading_sendInitReq",
                    value: function() {
                        var e = this;
                        return new Promise(function(t, n) {
                            var i = e.options
                              , o = e.getParamOl();
                            e.baseFn.jsonp({
                                url: cfg.api_prepare,
                                data: {
                                    a: i.appkey,
                                    t: i.token,
                                    scene: i.scene,
                                    jsType: e.nc.inn_vars.js_type,
                                    ol: '{"x":' + o.x + ',"y":' + o.y + "}",
                                    os: util.getOS(),
                                    w: e.size.width,
                                    h: e.size.height,
                                    ow: e.obj_w,
                                    oh: e.obj_h,
                                    v: e.nc.inn_vars.v
                                },
                                callback: "callback",
                                success: function(i) {
                                    if (!i.success)
                                        return void n("data fail");
                                    if (!i.result || !i.result.result)
                                        return void n("bad data");
                                    try {
                                        e._prepare_result = i.result.result,
                                        e.parsePrepareData(e._prepare_result)
                                    } catch (o) {
                                        return void n("prepare data parse fail!")
                                    }
                                    e.putObjects();
                                    var a = e.getEl("inform");
                                    a.style.display = "block",
                                    a.innerHTML = e._lang._ggk_start,
                                    util.addClass(e.root, "nc-prepared"),
                                    util.removeClass(e.root, "nc-state-load-error"),
                                    t()
                                },
                                fail: function() {
                                    n("net fail")
                                }
                            })
                        }
                        )["catch"](function(t) {
                            e.nc._err = FAIL_PREPARE,
                            e.nc._log(ERR_CODE_API_FAIL + "_prepare", t),
                            e.nc.fsm.loaderror()
                        })
                    }
                }, {
                    key: "parsePrepareData",
                    value: function parsePrepareData(result) {
                        try {
                            result = UA_Opt.decryptJSON(result)
                        } catch (e) {
                            throw e
                        }
                        if (!result.success)
                            throw new Error("decrypt fail2!");
                        result = result.data;
                        var data = result.replace(/&quot;/g, '"');
                        eval("data = " + data),
                        this.stroke_size = data.brushWidth,
                        this.svr_data = data,
                        this.session_id = data.sessionId
                    }
                }, {
                    key: "getEl",
                    value: function(e) {
                        return getElementById(this.prefix + e)
                    }
                }, {
                    key: "putObjects",
                    value: function() {
                        var e = this
                          , t = this.svr_data
                          , n = t.objectPoints
                          , i = n.points;
                        if (this._points = i,
                        !i || !Array.isArray(i) || i.length !== n.objectPointsCount)
                            throw new Error("Bad data: objectPoints.length is not equal to objectCounts!");
                        var o = this.getEl("bg");
                        o.innerHTML = util.map(i, function(t, n) {
                            var i = t.x
                              , o = t.y
                              , a = i - e.obj_w / 2
                              , r = o - e.obj_h / 2
                              , c = cfg.default_options.objects
                              , s = c[n % c.length];
                            return '<img src="' + s + '" class="nc-scrape-icon" style="left:' + a + "px;top:" + r + 'px;">'
                        }).join("\n")
                    }
                }, {
                    key: "getSize",
                    value: function() {
                        var e = {
                            width: this.options.width,
                            height: this.options.height
                        }
                          , t = this.options.hasOwnProperty("width")
                          , n = this.options.hasOwnProperty("height")
                          , i = this.getEl("nc-canvas");
                        return this.el_nc_canvas = i,
                        t || (e.width = i.offsetWidth),
                        e.width < cfg.min_width && (e.width = cfg.min_width,
                        styleEl(i, "width", e.width + "px")),
                        n || (e.height = i.offsetHeight),
                        e.height < cfg.min_height && (e.height = cfg.min_height,
                        styleEl(i, "height", e.height + "px")),
                        e
                    }
                }, {
                    key: "render_bg",
                    value: function() {
                        this.el_bg = this.getEl("bg"),
                        styleEl(this.el_bg, "width", this.size.width + "px"),
                        styleEl(this.el_bg, "height", this.size.height + "px")
                    }
                }, {
                    key: "mkGridId",
                    value: function(e, t) {
                        return [this.prefix, "grid", e, t].join("-")
                    }
                }, {
                    key: "render_surface_dg",
                    value: function() {
                        var e = this
                          , t = this.getEl("canvas-dg")
                          , n = this.size.width
                          , i = this.size.height;
                        t.style.width = n + "px",
                        t.style.height = i + "px",
                        t.style.display = "block";
                        for (var o = cfg.grid_size, a = Math.ceil(n / o), r = Math.ceil(i / o), c = [], s = "//imaeis.alicdn.com/tps/TB1ml9hPFXXXXcjXFXXXXXXXXXX-100-80.png", l = 0; r > l; l++)
                            for (var d = 0; a > d; d++) {
                                var u = o * l
                                  , p = o * d
                                  , f = {
                                    width: o + "px",
                                    height: o + "px",
                                    top: u + "px",
                                    left: p + "px",
                                    "background-image": "url(" + s + ")",
                                    "background-position": "-" + p + "px -" + u + "px"
                                }
                                  , g = this.mkGridId(d, l)
                                  , h = '<div id="' + g + '" class="nc-canvas-dg-grid" style="' + util.obj2style(f) + '"></div>';
                                c.push(h)
                            }
                        t.innerHTML = c.join("");
                        var _ = this.getEl("inform");
                        util.on(_, "touchstart", function(t) {
                            return e.eventDown(t)
                        }),
                        util.on(_, "mousedown", function(t) {
                            return e.eventDown(t)
                        }),
                        util.on(t, "touchstart", function(t) {
                            return e.eventDown(t)
                        }),
                        util.on(document, "touchend", function(t) {
                            return e.eventUp(t)
                        }),
                        util.on(t, "touchmove", function(t) {
                            return e.eventMove(t)
                        }),
                        util.on(t, "mousedown", function(t) {
                            return e.eventDown(t)
                        }),
                        util.on(document, "mouseup", function(t) {
                            return e.eventUp(t)
                        }),
                        util.on(t, "mousemove", function(t) {
                            return e.eventMove(t)
                        })
                    }
                }, {
                    key: "render_surface",
                    value: function() {
                        var e = this;
                        this.hideEl("canvas-dg");
                        var t = this.el_canvas
                          , n = this.ctx
                          , i = this.size;
                        t.width = i.width,
                        t.height = i.height;
                        var o = this.getEl("cover");
                        o.style.width = i.width + "px",
                        o.style.height = i.height + "px";
                        var a = this.getEl("inform");
                        n.fillStyle = "#8a8a8a",
                        n.fillRect(0, 0, i.width, i.height);
                        var r = new Image;
                        r.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABQCAAAAADKYo8zAAACzElEQVR4AWKYQwcAaMcuEhw2ggCK3v8M85vVpIaqIya2whzDavxXWtUT0wf5IN8Y+SAfxJbTvBnxXYbM7N+JWD0d/pTzvUjC5L3MexBDGpEioclO8A4kzLmX9KBbmoiv274e8V1HpEbvg6WrnoGXIF/8khvSHETVBscSXfi+XomkUb1WRxqyxEI7zKnzpr4K8XmfsxGz7pVN0ATYcluGFyFpahljZZLoCSS1UGRE4DUIYa+mzU+R5dwpydg98krRcy+l+CziezNV25KyY6nghqqozsNyRSv5OSQNWWqtjKH93P0+LusIhlvuAEgxPYHYsnXaqsWsXado3afFrZ25SuVwgDE8jiQZccqea3OMtZrWJeM02XCFqc0+deDDWb32Ltrc3OCOdcgkpMAtGw/AEPjLvv4LYo4pejC1WhHpLlDWGEUcV9RWuHoUCXWvw61B0r5Ec17bxrassdwyQMolPIP4KXKkIUW92TNF1Xn4Frq5hFQdYA/HM4jT1Lv0VaRh45Ct+ZTuuDI558dfJIyxP+YsjFFmHXlVMXZXV3UXC2C4FX18EHGiV9tD1FOqBsmacVVmMtzL1QHe8BgSRcZ59tZqnA5WO/bZVx2L0QNXhNL8E+9dQSRyFbVBFqdZz7gnVyECpBweRH5vYEQMRuYyDnNwlWq2gIGHkcuwteQEVM3Qfv9yEFt1z72mXoYZqno0i9MFfjvuxTvMYXgO6SsCXVV71AKn3kzu2dIzfAFPIjHb+7Qx3dYNUTu3nAFyL+4ViNF2H5ZcVdWE0QWEozrABXgFwhKDV9WVVNVjdAKp1fTK7xOvGYaqxqUdolbANvdSBF2QVHVksXCqB3DwUuTQCLFODQWCjrd8zl1HAawFpoa3IDQdnquqnfcgTNWZg4Gk274LIQ5VVZlJPG9DwB51LPHm80fimyMf5IN8fRDe0tcHeawP8kE+yAd5Qz8AkpEvA2RA5xcAAAAASUVORK5CYII=",
                        r.onload = function() {
                            n.globalCompositeOperation = "source-over";
                            for (var e = r.naturalWidth ? [r.naturalWidth, r.naturalHeight] : [r.width, r.height], t = _slicedToArray(e, 2), o = t[0], a = t[1], c = Math.ceil(i.width / o), s = Math.ceil(i.height / a), l = 0; s > l; l++)
                                for (var d = 0; c > d; d++)
                                    n.drawImage(r, d * o, l * a);
                            n.globalCompositeOperation = "destination-out"
                        }
                        ,
                        r.onerror = function() {
                            n.globalCompositeOperation = "destination-out"
                        }
                        ,
                        util.on(a, "touchstart", function(t) {
                            return e.eventDown(t)
                        }),
                        util.on(a, "mousedown", function(t) {
                            return e.eventDown(t)
                        }),
                        util.on(t, "touchstart", function(t) {
                            return e.eventDown(t)
                        }),
                        util.on(document, "touchend", function(t) {
                            return e.eventUp(t)
                        }),
                        util.on(t, "touchmove", function(t) {
                            return e.eventMove(t)
                        }),
                        util.on(t, "mousedown", function(t) {
                            return e.eventDown(t)
                        }),
                        util.on(document, "mouseup", function(t) {
                            return e.eventUp(t)
                        }),
                        util.on(t, "mousemove", function(t) {
                            return e.eventMove(t)
                        })
                    }
                }, {
                    key: "getPos",
                    value: function(e) {
                        var t = doc.documentElement.scrollLeft || doc.body.scrollLeft
                          , n = doc.documentElement.scrollTop || doc.body.scrollTop
                          , i = (e.clientX + t || e.pageX) - (this.offsetX || 0)
                          , o = (e.clientY + n || e.pageY) - (this.offsetY || 0);
                        return [i, o]
                    }
                }, {
                    key: "_clearTo_dg",
                    value: function(e, t) {
                        var n = Math.floor(e / cfg.grid_size)
                          , i = Math.floor(t / cfg.grid_size)
                          , o = this.mkGridId(n, i)
                          , a = document.getElementById(o);
                        util.addClass(a, "nc-clean");
                        var r = this._grid_x_count * i + n;
                        this.matrix[r] = 0
                    }
                }, {
                    key: "_clearTo",
                    value: function(e, t) {
                        if (this.is_downgraded)
                            return this._clearTo_dg(e, t);
                        var n = this.ctx;
                        n.fillStyle = "#fff",
                        n.beginPath(),
                        n.arc(e, t, this.stroke_size / 2, 0, 2 * Math.PI),
                        n.fill(),
                        this._last_x >= 0 && this._last_y >= 0 && (n.beginPath(),
                        n.lineWidth = this.stroke_size,
                        n.moveTo(this._last_x, this._last_y),
                        n.lineTo(e, t),
                        n.stroke()),
                        this._last_x = e,
                        this._last_y = t
                    }
                }, {
                    key: "_calcRegion",
                    value: function(e, t, n, i) {
                        for (var o = this.ctx.getImageData(e, t, n, i).data, a = 0, r = 0; r < o.length; r += 4)
                            o[r] && o[r + 1] && o[r + 2] && o[r + 3] && a++;
                        return 1 - a / n / i
                    }
                }, {
                    key: "_calcRegion_dg",
                    value: function(e, t, n, i) {
                        for (var o = cfg.grid_size, a = Math.floor(e / o), r = Math.floor(t / o), c = Math.floor(n / o), s = Math.floor(i / o), l = 0, d = r; r + s > d; d++)
                            for (var u = a; a + c > u; u++) {
                                var p = this._grid_x_count * d + u;
                                l += this.matrix[p]
                            }
                        return 1 - l / c / s
                    }
                }, {
                    key: "calc_dg",
                    value: function() {
                        var e = this
                          , t = void 0
                          , n = void 0
                          , i = this.matrix.reduce(function(e, t) {
                            return e + t
                        }, 0);
                        t = 1 - i / this._grid_sum;
                        var o = this.is_downgraded ? .7 : .9
                          , a = this.obj_w / 2 * o
                          , r = this.obj_h / 2 * o;
                        return n = util.map(this._points, function(t) {
                            var n = t.x
                              , i = t.y;
                            return e._calcRegion_dg(n - a, i - r, e.obj_w, e.obj_h)
                        }),
                        {
                            r_all: t,
                            r_objects: n
                        }
                    }
                }, {
                    key: "calc",
                    value: function() {
                        var e = this;
                        if (this.is_downgraded)
                            return this.calc_dg();
                        var t = this.size
                          , n = t.width
                          , i = t.height
                          , o = this._calcRegion(0, 0, n, i)
                          , a = this.obj_w / 2
                          , r = this.obj_h / 2
                          , c = util.map(this._points, function(t) {
                            var n = t.x
                              , i = t.y;
                            return e._calcRegion(n - a, i - r, e.obj_w, e.obj_h)
                        });
                        return {
                            r_all: o,
                            r_objects: c
                        }
                    }
                }, {
                    key: "getEventCount",
                    value: function() {
                        var e = ("undefined" != typeof UA_Opt ? UA_Opt.eventCounters : null) || {};
                        return (e.newMousemove || 0) + (e.newTouchmove || 0)
                    }
                }, {
                    key: "checkEnd",
                    value: function(e, t) {
                        var n = 0 === t.filter(function(e) {
                            return .5 > e
                        }).length;
                        if ((e > .9 || n) && this.getEventCount() >= cfg.min_events_count)
                            this.verify();
                        else if (e > .9 && n) {
                            var i = [win._n, this.baseFn.obj2str(this._prepare_result)];
                            this.nc._err = "3A",
                            this._fail_msg = this._updateSurveyUrl(this._lang._ggk_too_fast, i),
                            this.verify_fail()
                        }
                    }
                }, {
                    key: "verify",
                    value: function() {
                        var e = this.nc.fsm;
                        e.can("verify") && this.nc.fsm.verify()
                    }
                }, {
                    key: "verifyMethod",
                    value: function() {
                        var e = this
                          , t = this.options;
                        return clearTimeout(this._t_action),
                        new Promise(function(n, i) {
                            try {
                                UA_Opt.sendSA()
                            } catch (o) {
                                i(o.message)
                            }
                            e.baseFn.jsonp({
                                url: cfg.api_analyze,
                                callback: "callback",
                                data: {
                                    a: t.appkey,
                                    t: t.token,
                                    s: e.session_id,
                                    n: win._n || (UA_Opt.LogVal ? win[UA_Opt.LogVal] : "") || "",
                                    p: e.baseFn.obj2str(t.trans),
                                    scene: t.scene,
                                    jsType: e.nc.inn_vars.js_type,
                                    lang: t.language,
                                    v: e.nc.inn_vars.v
                                },
                                success: function(t) {
                                    if (t.success && t.result && t.result.success) {
                                        var o = t.result.result;
                                        if (0 === o.code)
                                            return e.verify_ok(o),
                                            void n();
                                        e.nc._err = e.nc._err || "4A"
                                    }
                                    i(t.msg)
                                },
                                fail: function(t) {
                                    e.nc._err = e.nc._err || FAIL_ANALYZE;
                                    var n = e._lang._ggk_net_err;
                                    n = e._updateSurveyUrl(n),
                                    e._fail_msg = n,
                                    i("net fail!")
                                }
                            })
                        }
                        ).then(function() {
                            UA_Opt.reload()
                        })["catch"](function(t) {
                            UA_Opt.reload(),
                            e.nc._err = e.nc._err || "4A",
                            e.nc._log(ERR_CODE_API_FAIL + "_analyze", t),
                            e.verify_fail()
                        })
                    }
                }, {
                    key: "verify_ok",
                    value: function(e) {
                        this.verify_result = e,
                        this.nc.fsm.verifypass()
                    }
                }, {
                    key: "verify_fail",
                    value: function(e) {
                        this.nc.fsm.verifyfail()
                    }
                }, {
                    key: "_upResetIndex",
                    value: function(e) {
                        return upResetIndex(e, this.nc.index)
                    }
                }, {
                    key: "_mkErrInfo",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : []
                          , n = this.options
                          , i = e
                          , o = [n.appkey, n.token, n.scene];
                        switch (e) {
                        case FAIL_PREPARE:
                            i = "2A";
                            break;
                        case FAIL_ANALYZE:
                            i = "2D";
                            break;
                        case "TIMEOUT_uab":
                            i = "2C";
                            break;
                        case "TIMEOUT_um":
                            i = "2B"
                        }
                        switch (i) {
                        case "3A":
                            o = o.concat(t);
                            break;
                        case "4A":
                            t = [this.session_id, win._n],
                            o = o.concat(t)
                        }
                        return {
                            type: i,
                            str: o.map(function(e) {
                                return encodeURIComponent(e)
                            }).join(":-o")
                        }
                    }
                }, {
                    key: "_updateSurveyUrl",
                    value: function(e, t) {
                        e = e.replace(/%TOKEN\b/, this.options.token);
                        var n = this._mkErrInfo(this.nc._err, t);
                        return e = e.replace(/%TYPE\b/, n.type),
                        e = e.replace(/%STR\b/, n.str),
                        e = this._upResetIndex(e)
                    }
                }, {
                    key: "on_load_error",
                    value: function(e) {
                        var t = this;
                        return new Promise(function(e, n) {
                            util.addClass(t.root, "nc-state-load-error"),
                            util.removeClass(t.root, "nc-prepared");
                            var i = function o() {
                                var n = t.getEl("load-error")
                                  , i = void 0
                                  , a = t.getEl("cover");
                                if (!t.size || !a)
                                    return void setTimeout(o, 10);
                                t.showEl("load-error"),
                                i = t.size ? t.size.height : a.offsetHeight,
                                n.style.marginTop = (i - 80) / 2 + "px";
                                var r = t._lang._ggk_net_err;
                                r = t._updateSurveyUrl(r),
                                t.getEl("load-error-msg").innerHTML = r,
                                t.tryToUpdateErrIcon(),
                                e()
                            };
                            i()
                        }
                        )
                    }
                }, {
                    key: "on_pass",
                    value: function() {
                        var e = this;
                        return clearTimeout(this._t_action),
                        Promise.resolve().then(function() {
                            e.hideEl("canvas-dg");
                            var t = e.getEl("ok");
                            t.style.marginTop = (e.size.height - 80) / 2 + "px",
                            e.getEl("ok-msg").innerHTML = e._lang._ggk_success;
                            var n = e.options.callback;
                            "function" == typeof n && n(e.verify_result)
                        })
                    }
                }, {
                    key: "getErrIcon",
                    value: function(e) {
                        return cfg["err_" + e]
                    }
                }, {
                    key: "tryToUpdateErrIcon",
                    value: function() {
                        var e = this.getEl("fail-icon")
                          , t = this.getEl("load-error-icon");
                        if (t.src = e.src = cfg.obj_fail,
                        this.nc._err) {
                            var n = this.getErrIcon(this.nc._err);
                            n && (t.src = e.src = n)
                        }
                        this.nc._err = ""
                    }
                }, {
                    key: "on_fail",
                    value: function() {
                        var e = this;
                        return clearTimeout(this._t_action),
                        Promise.resolve().then(function() {
                            e.is_downgraded && e.hideEl("canvas-dg");
                            var t = e.getEl("fail");
                            t.style.marginTop = (e.size.height - 80) / 2 + "px";
                            var n = e._fail_msg || e._lang._ggk_fail;
                            n = e._updateSurveyUrl(n),
                            e.getEl("fail-msg").innerHTML = n,
                            e._fail_msg = "",
                            e.tryToUpdateErrIcon();
                            var i = e.options.error;
                            "function" == typeof i && i()
                        })
                    }
                }, {
                    key: "actionTimeout",
                    value: function() {
                        this.nc.fsm.timeout()
                    }
                }, {
                    key: "on_actiontimeout",
                    value: function() {
                        var e = this;
                        return Promise.resolve().then(function() {
                            var t = e.getEl("fail");
                            t.style.marginTop = (e.size.height - 80) / 2 + "px",
                            e.hideEl("canvas-dg");
                            var n = e._lang._ggk_action_timeout;
                            n = e._updateSurveyUrl(n),
                            e.getEl("fail-msg").innerHTML = n;
                            var i = e.options.error;
                            "function" == typeof i && i()
                        })
                    }
                }, {
                    key: "eventDown",
                    value: function(e) {
                        try {
                            e.preventDefault()
                        } catch (t) {}
                        this.mousedown = !0,
                        this.getEl("inform").style.display = "none",
                        this.offsetX = this.el_nc_canvas.offsetLeft,
                        this.offsetY = this.el_nc_canvas.offsetTop;
                        var n = this.getPos(e)
                          , i = _slicedToArray(n, 2)
                          , o = i[0]
                          , a = i[1];
                        this._clearTo(o, a),
                        this._old_onselectstart = doc.body.onselectstart,
                        this._old_ondrag = doc.body.ondrag,
                        this.is_downgraded && (doc.body.onselectstart = doc.body.ondrag = function() {
                            return !1
                        }
                        )
                    }
                }, {
                    key: "eventMove",
                    value: function(e) {
                        var t = this;
                        try {
                            e.preventDefault()
                        } catch (n) {}
                        if (this.mousedown) {
                            clearTimeout(this._t_action),
                            "ready" === this.nc.fsm.current && (this._t_action = setTimeout(function() {
                                t.actionTimeout()
                            }, cfg.action_timeout)),
                            e.changedTouches && (e = e.changedTouches[e.changedTouches.length - 1]);
                            var i = this.getPos(e)
                              , o = _slicedToArray(i, 2)
                              , a = o[0]
                              , r = o[1];
                            this._clearTo(a, r);
                            var c = this.calc()
                              , s = c.r_all
                              , l = c.r_objects;
                            this.checkEnd(s, l)
                        }
                    }
                }, {
                    key: "eventUp",
                    value: function() {
                        this.mousedown = !1,
                        this._last_x = -1,
                        this._last_y = -1,
                        this.is_downgraded && (doc.body.onselectstart = this._old_onselectstart,
                        doc.body.ondrag = this._old_ondrag),
                        this._old_onselectstart = null,
                        this._old_ondrag = null
                    }
                }, {
                    key: "mkMatrix",
                    value: function() {
                        var e = this.size
                          , t = e.width
                          , n = e.height
                          , i = cfg.grid_size
                          , o = Math.ceil(t / i)
                          , a = Math.ceil(n / i)
                          , r = o * a;
                        this._grid_x_count = o,
                        this.matrix = util.fill(new Array(r), 1),
                        this._grid_sum = r
                    }
                }, {
                    key: "downgrade",
                    value: function() {
                        this.is_downgraded = !0,
                        this.mkMatrix()
                    }
                }, {
                    key: "bindEvents",
                    value: function() {
                        var e = this
                          , t = this.getEl("btn-refresh")
                          , n = this.getEl("btn-info");
                        util.on(t, "touchend", function(t) {
                            try {
                                t.preventDefault()
                            } catch (t) {}
                            e.nc.reset()
                        }),
                        util.on(t, "mouseup", function(t) {
                            try {
                                t.preventDefault()
                            } catch (t) {}
                            e.nc.reset()
                        }),
                        util.on(n, "touchend", function(t) {
                            try {
                                t.preventDefault()
                            } catch (t) {}
                            e.showHow()
                        }),
                        util.on(n, "mouseup", function(t) {
                            try {
                                t.preventDefault()
                            } catch (t) {}
                            e.showHow()
                        })
                    }
                }, {
                    key: "showHow",
                    value: function() {
                        var e = this.getEl("show-how")
                          , t = 0
                          , n = 200
                          , i = 5;
                        e.style.display = "block",
                        e.style.left = t + "px";
                        var o = function a() {
                            n > t ? (t += i,
                            e.style.left = t + "px",
                            setTimeout(a, 20)) : e.style.display = "none"
                        };
                        o()
                    }
                }, {
                    key: "showEl",
                    value: function(e) {
                        var t = this.getEl(e);
                        t && (t.style.display = "block")
                    }
                }, {
                    key: "hideEl",
                    value: function(e) {
                        var t = this.getEl(e);
                        t && (t.style.display = "none")
                    }
                }, {
                    key: "loading_render",
                    value: function() {
                        var e = this;
                        return new Promise(function(t, n) {
                            try {
                                var i = e.nc;
                                if (e.root.innerHTML = kvTpl.render(html, {
                                    nc: i,
                                    prefix: e.prefix,
                                    inform: "",
                                    loading: e._lang._Loading
                                }),
                                e.showEl("loading"),
                                e.hideEl("load-error"),
                                e.getEl("title").innerHTML = "\u9a8c\u8bc1\uff1a",
                                e.bindEvents(),
                                e.size = e.getSize(),
                                e.getEl("container").style.width = e.size.width + "px",
                                e.render_bg(),
                                e.el_canvas = e.getEl("canvas"),
                                !e.el_canvas.getContext || !(e.ctx = e.el_canvas.getContext("2d")))
                                    return e.downgrade(),
                                    e.render_surface_dg(),
                                    void t();
                                e.render_surface(),
                                t()
                            } catch (o) {
                                n(o)
                            }
                        }
                        )
                    }
                }, {
                    key: "render",
                    value: function() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function() {
                            return 0
                        }
                          , t = this.loading_sendInitReq();
                        t.then(e)["catch"](e)
                    }
                }]),
                Scrape
            }();
            module.exports = Scrape
        }
        , function(e, t, n) {
            "use strict";
            var i = "//cf.aliyun.com";
            e.exports = {
                min_width: 300,
                min_height: 100,
                default_stroke_width: 16,
                min_events_count: 30,
                max_retry: 3,
                api_prepare: i + "/scratchCardSlide/prepare.jsonp",
                api_report: i + "/scratchCardSlide/dataReport.jsonp",
                api_analyze: i + "/scratchCardSlide/analyze.jsonp",
                obj_ok: "//imaeis.alicdn.com/tfs/TB1q8uoQXXXXXbYXXXXXXXXXXXX-80-80.png",
                obj_fail: "//imaeis.alicdn.com/tfs/TB125VFQXXXXXc5apXXXXXXXXXX-80-80.png",
                obj_size: 80,
                bg_back: "//imaeis.alicdn.com/tps/TB1ml9hPFXXXXcjXFXXXXXXXXXX-100-80.png",
                bg_front: "//imaeis.alicdn.com/tps/TB1531mPFXXXXc_XpXXXXXXXXXX-100-80.png",
                err_TIMEOUT_uab: "//imaeis.alicdn.com/tfs/TB1GgteQXXXXXb8XVXXXXXXXXXX-80-80.png",
                err_TIMEOUT_um: "//imaeis.alicdn.com/tfs/TB1tppBQXXXXXX6XpXXXXXXXXXX-80-80.png",
                err_fail_prepare: "//imaeis.alicdn.com/tfs/TB1HzEYPVXXXXcnapXXXXXXXXXX-80-80.png",
                err_fail_analyze: "//imaeis.alicdn.com/tfs/TB1um72PVXXXXacapXXXXXXXXXX-80-80.png",
                grid_size: 8,
                action_timeout: 6e4,
                default_options: {
                    language: "cn",
                    objects: ["//imaeis.alicdn.com/tps/TB18lChPFXXXXcCXFXXXXXXXXXX-80-80.png", "//imaeis.alicdn.com/tps/TB1BT9jPFXXXXbyXFXXXXXXXXXX-80-80.png"]
                }
            }
        }
        , function(e, t, n) {
            "use strict";
            var i = n(122);
            t.create = function(e, t) {
                return new i(e,t)
            }
        }
        , function(e, t, n) {
            "use strict";
            t.html = '<div id="{{prefix}}container" class="nc-container nc-scrape"><div id="{{prefix}}for-tmp" class="nc-for-tmp"></div><div id="{{prefix}}toolbar" class="nc-toolbar"><span id="{{prefix}}title" class="nc-title">{{title}}</span> <span class="nc-btns"><i id="{{prefix}}btn-refresh" class="nc_iconfont icon_refresh">&#xe607;</i> <i id="{{prefix}}btn-info" class="nc_iconfont icon_info">&#xe602;</i></span></div><div id="{{prefix}}nc-canvas" class="nc-canvas"><div id="{{prefix}}bg" class="nc-bg"></div><div id="{{prefix}}cover" class="nc-cover"><canvas id="{{prefix}}canvas" class="nc-canvas-node"></canvas><div id="{{prefix}}canvas-dg" class="nc-canvas-dg" unselectable="on" style="-moz-user-select:none;-webkit-user-select:none" onselectstart="return false"></div><div id="{{prefix}}ok" class="nc-verify-ok"><img src="//imaeis.alicdn.com/tfs/TB1q8uoQXXXXXbYXXXXXXXXXXXX-80-80.png" alt=""><div><span id="{{prefix}}ok-msg"></span></div></div><div id="{{prefix}}fail" class="nc-verify-fail"><img id="{{prefix}}fail-icon" src="//imaeis.alicdn.com/tfs/TB125VFQXXXXXc5apXXXXXXXXXX-80-80.png" alt=""><div><span id="{{prefix}}fail-msg"></span></div></div><div id="{{prefix}}loading" class="nc-loading"><div id="nc-loading-circle" class="nc-loading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div></div><span>{{loading}}</span></div><div id="{{prefix}}inform" class="nc-inform">{{inform}}</div><div id="{{prefix}}load-error" class="nc-load-error"><img id="{{prefix}}load-error-icon" src="//imaeis.alicdn.com/tfs/TB125VFQXXXXXc5apXXXXXXXXXX-80-80.png" alt=""><div><span id="{{prefix}}load-error-msg">Load Error!</span></div></div></div><div id="{{prefix}}show-how" class="nc-show-how"></div></div></div>'
        }
        , function(e, t, n) {
            "use strict";
            e.exports = n(22)
        }
        , function(e, t, n) {
            "use strict";
            e.exports = n(9)
        }
        , function(e, t, n) {
            "use strict";
            function i(e, t, n) {
                function i(e) {
                    a || (a = !0,
                    e || o(),
                    t(e))
                }
                var a = void 0
                  , r = d[e.foreign] || d[0];
                r = l.mix(r, e.apimap),
                UA_Opt.LogVal = "_n",
                u.init(e),
                UA_Opt.sendMethod = 8,
                UA_Opt.Token = (new Date).getTime() + ":" + e.token,
                c.acjs || c.__acjs ? ("function" == typeof UA_Opt.reload && UA_Opt.reload(),
                i()) : (c[UA_Opt.LogVal] = "",
                l.loadScript(l.addHourStamp(r.uab_Url), function(e) {
                    function t() {
                        a || (c.__acjs && i(e),
                        setTimeout(t, 50))
                    }
                    t()
                }, n, e.retryTimes)),
                setTimeout(function() {
                    i(p)
                }, n)
            }
            function o() {}
            function a(e, t, n) {
                function i(e) {
                    o || (o = !0,
                    e || r(),
                    t(e))
                }
                var o = void 0;
                if ("undefined" != typeof umx)
                    return void i();
                var a = d[e.foreign] || d[0];
                a = l.mix(a, e.apimap),
                l.loadScript(a.umid_Url, function(t) {
                    if (t === p)
                        return void i(t);
                    var n = s.getElementById("_umfp")
                      , o = (new Date).getTime();
                    try {
                        umx.init({
                            timeout: e.timeout,
                            timestamp: o,
                            token: e.token,
                            serviceUrl: a.umid_serUrl,
                            appName: e.appkey,
                            containers: {
                                flash: n,
                                dcp: n
                            },
                            closeImage: !1
                        }),
                        i()
                    } catch (r) {
                        i(r)
                    }
                }, n, e.retryTimes),
                setTimeout(function() {
                    i(p)
                }, n)
            }
            function r() {
                function e() {
                    (n || umx.getStatus()) && c.__acjs ? clearInterval(i) : t++ > 100 && clearInterval(i)
                }
                if (!g) {
                    g = !0;
                    var t = 0
                      , n = void 0;
                    setTimeout(function() {
                        n = !0
                    }, 3e3);
                    var i = setInterval(e, 100);
                    e()
                }
            }
            var c = window
              , s = document
              , l = n(3)
              , d = n(131).URL_MAP
              , u = n(107)
              , p = (n(8),
            "timeout")
              , f = "LOAD_JS_TIMEOUT"
              , g = void 0;
            t.load = function(e, t) {
                var n = void 0
                  , o = void 0
                  , r = void 0
                  , c = e.options
                  , s = c.timeout || 1e4;
                i(c, function(i) {
                    n = 1;
                    var a = i == p;
                    !r && o && (a && (e._err = "TIMEOUT_uab",
                    e._log(f, "uab.js timeout")),
                    t(a),
                    r = 1)
                }, s),
                a(c, function(i) {
                    o = 1;
                    var a = i == p;
                    !r && n && (a && (e._err = "TIMEOUT_um",
                    e._log(f, "um.js timeout")),
                    t(a),
                    r = 1)
                }, s)
            }
        }
        , function(e, t, n) {
            "use strict";
            n(130);
            var i = n(124);
            t.create = function(e) {
                return i.create(e, {})
            }
            ,
            t.render = function(e, t) {
                e.render(t)
            }
        }
        , function(e, t, n) {
            "use strict";
            !function(e, t) {
                var n = e.createElement("style");
                if (e.getElementsByTagName("head")[0].appendChild(n),
                n.styleSheet)
                    n.styleSheet.disabled || (n.styleSheet.cssText = t);
                else
                    try {
                        n.innerHTML = t
                    } catch (i) {
                        n.innerText = t
                    }
            }(document, ".nc-wrapper.nc-ggk{font-size:12px}")
        }
        , function(e, t, n) {
            "use strict";
            e.exports = n(10)
        }
        , , function(e, t, n) {
            function i(e) {
                return n(o(e))
            }
            function o(e) {
                var t = a[e];
                if (!(t + 1))
                    throw new Error("Cannot find module '" + e + "'.");
                return t
            }
            var a = {
                "./actiontimeout": 48,
                "./actiontimeout.js": 48,
                "./destroyed": 49,
                "./destroyed.js": 49,
                "./error": 50,
                "./error.js": 50,
                "./fail": 51,
                "./fail.js": 51,
                "./initially": 52,
                "./initially.js": 52,
                "./load_error": 53,
                "./load_error.js": 53,
                "./loading": 54,
                "./loading.js": 54,
                "./need_two_step_verify": 55,
                "./need_two_step_verify.js": 55,
                "./pass": 56,
                "./pass.js": 56,
                "./ready": 57,
                "./ready.js": 57,
                "./reseting": 58,
                "./reseting.js": 58,
                "./ts_error": 59,
                "./ts_error.js": 59,
                "./ts_fail": 60,
                "./ts_fail.js": 60,
                "./ts_loading": 61,
                "./ts_loading.js": 61,
                "./ts_pass": 62,
                "./ts_pass.js": 62,
                "./ts_ready": 63,
                "./ts_ready.js": 63,
                "./ts_verifying": 64,
                "./ts_verifying.js": 64,
                "./verifying": 65,
                "./verifying.js": 65
            };
            i.keys = function() {
                return Object.keys(a)
            }
            ,
            i.resolve = o,
            e.exports = i,
            i.id = 133
        }
        , function(e, t, n) {
            "use strict";
            !function(e) {
                var t = "_nc_initialized";
                if (!e[t]) {
                    e[t] = 1;
                    var i = n(5).v;
                    window.console || (window.console = {
                        log: function() {
                            return 0
                        }
                    }),
                    n(68),
                    n(70),
                    n(66),
                    n(69);
                    var o = e.pointman && "19" == pointman._z
                      , a = {}
                      , r = {
                        has_pointman: o,
                        index: 0,
                        js_type: "pc",
                        v: i
                    };
                    e.UA_Opt = e.UA_Opt || {};
                    var c = n(71).makeNC(a, r);
                    c.v = i,
                    a.init = function() {}
                    ,
                    r.has_pointman && (a.noCaptcha = c,
                    pointman.define("nc", function() {
                        return a
                    })),
                    e.noCaptcha = c
                }
            }(window)
        }
        ])
    };
    chkQuerySet(),
    cond() > GREY_RATIO ? STABLE_ACTION() : NEW_ACTION()
}();
