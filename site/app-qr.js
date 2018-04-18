var id = "";
var publicKey = "";
var pki = forge.pki;
var start = (new Date()).getTime();
var userid = "";
var tmpl = "";

function printTime(result) {
    var end = (new Date()).getTime();
    $(result).append((end - start) / 1000 + "秒<br/>");
    start = (new Date()).getTime();
}

function getData(param) {
    $.ajax({
        url: "../submit?" + $.param(param),
        dataType: "json",
        success: function (data) {
                id = data.id;
                if (data.status != "WaitScanQRCode" && data.status != "ScanQRCodeSuccess" && data.status != "ScanQRCodeFinish") {
                    printTime("#result");
                } else {
                    $('#status_result').html("");
                    printTime("#status_result");
                }
                if (data.status == "OutputVerifyQrcode") {
                    $('#result').empty();
                    $('#result').html("");
                    $("#result").append("<img id=\"randcode_img\" src='" + data.data + "'/><br/>");
                    $("#result").append("扫我😫<br/>");
                    //var button = "<div class=\"form-group\">"+
                    //"<button type=\"submit\" onclick=\"checkStatus();\" class=\"btn btn-default\" id=\"randcode_send\">不停点我check用户扫描状态，哈哈😄</button></div>";
                    //$("#result").append(button);
                    getData({
                        tmpl: tmpl,
                        id: data.id,
                        t2: 1213213
                    });
                    if(tmpl=='url_taobao_shop' || tmpl=='url_tmall_shop'){
                        $("#result").empty().append("<p>请在手机自带浏览器里打开这个链接并确认登录<a target='_blank' href='" + data.data + "'>"+data.data+"</p>");
                    }
                } else if (data.status == "ScanQRCodeFinish") {
                    getData({
                        tmpl: tmpl,
                        id: data.id
                    });
                } else if (data.status == "need_param") {
                    if (data.need_param == "password2") {
                        $("#result").empty();
                        $("#result").html("");
                        if (data.data.length != 0) {
                            $("#result").append("手机号码：" + data.data + "<br/>");
                        }
                        addPassword2Div("#result");
                    }

                    if (data.need_param == "phone") {
                        $("#result").empty();
                        $("#result").html("");
                        var phones = jQuery.parseJSON(data.data);

                        var phoneSelect = "<div class=\"form-group\"><select id=\"phone\">";
                        $.each(phones, function (index, value) {
                            phoneSelect = phoneSelect + "<option value=\"" + value + "\">" + value + "</option>"
                        });
                        phoneSelect = phoneSelect + "</select></div>";
                        $("#result").append(phoneSelect);

                        var button = "<div class=\"form-group\">" +
                            "<button type=\"submit\" onclick=\"sendPhone();\" class=\"btn btn-default\" id=\"randcode_send\">发送手机号码</button></div>";
                        $("#result").append(button);
                    }

                    if (data.need_param == "tradecode") {
                        addTradecode2Div("#result");
                    }
                } else if (data.status == "fail") {
                    if (tmpl == "taobao_shop" || tmpl == "tmall_shop") {
                        alert("抓取失败:" + data.data);
                    }
                } else if (data.status == "login_success") {
                    if (tmpl == "taobao_shop" || tmpl == "tmall_shop") {
                        alert("登录成功！");
                    }
                    $("#result").append("登录成功<br/>");
                    getData({
                        id: data.id
                    });
                } else if (data.status == "in_crawling") {
                    $("#result").append("正在抓取中，请稍后<br/>");
                    getData({
                        id: data.id
                    });
                } else if (data.status == "begin_fetch_data") {
                    $("#result").append("开始获取数据<br/>");
                    getData({
                        id: data.id
                    });
                } else if (data.status == "finish_fetch_data") {
                    $("#result").append("成功获取数据<br/>");
                } else if (data.status == "output_publickey") {
                    getData({
                        id: data.id,
                        t1: (new Date).getTime()
                    })
                    $("#result").append("获取公钥成功<br/>");
                } else if (data.status == "WaitScanQRCode" || data.status == "ScanQRCodeSuccess") {
                    $("#status_result").append(data.status + "<br/>");
                } else if (data.status == "ScanQRCodeFinish") {
                    $("#status_result").append(data.status + "<br/>");
                    var button = "<div class=\"form-group\">" +
                        "<button type=\"submit\" onclick=\"checkStatus2();\" class=\"btn btn-default\" id=\"randcode_send2\">用户已经确认登录，点我开始获取数据</button></div>";
                    $("#result").append(button);
                }
            },
            error: function () {
                $("#result").append("超时");
                printTime();
            },
            timeout: 120000,
    });
}

function crawl() {
    userid = $("#userid").val();
    start = (new Date()).getTime();
    tmpl = $("#tmpl").val();

    if (tmpl.length == 0) {
        alert("您的输入有误，请检查！");
        return;
    }
    $("#result").html("开始<br/>");
    getData({
        tmpl: tmpl,
        userid: userid
    });
}

function addPassword2Div(container) {
    $(container).append('<div id="password2"></div>')
    $("#password2").append('<div class="form-group">' + '<input type="password" class="form-control" id="password2_input" placeholder="独立密码" />' + '</div>');
    $("#password2").append('<div class="form-group">' + '<button type="submit" onclick="sendPassword2();" class="btn btn-default">提交独立密码</button>' + '</div>');
}

function addTradecode2Div(container) {
    $(container).empty();
    $(container).html("");
    $(container).append('<div id="tradecode"></div>')
    $("#tradecode").append('<div class="form-group">' + '<input type="password" class="form-control" id="tradecode_input" placeholder="交易码" />' + '</div>');
    $("#tradecode").append('<div class="form-group">' + '<button type="submit" onclick="sendTradecode();" class="btn btn-default">提交交易码</button>' + '</div>');
}


function sendPassword2() {
    var password2 = $("#password2_input").val();
    if (id.length == 0 || password2.length == 0) {
        alert("您的输入有误，请检查！");
        return;
    }

    getData({
        id: id,
        password2: password2
    });
}

function sendTradecode() {
    var tradecode = $("#tradecode_input").val();
    if (id.length == 0 || tradecode.length == 0) {
        alert("您的输入有误，请检查！");
        return;
    }
    getData({
        id: id,
        tradecode: tradecode
    });
}

function sendPhone() {
    alert("start send phone");
    var phone = $("#phone").val();
    if (id.length == 0 || phone.length == 0) {
        alert("您的输入有误，请检查！");
        return;
    }
    getData({
        id: id,
        phone: phone
    });
}

function checkStatus() {
    if (id.length == 0) {
        alert("您的输入有误，请检查！");
        return;
    }
    start = (new Date()).getTime();
    getData({
        id: id,
        t1: start
    });
}

function checkStatus2() {
    if (id.length == 0) {
        alert("您的输入有误，请检查！");
        return;
    }
    start = (new Date()).getTime();
    getData({
        id: id,
        t2: start
    });
}

(function () {
    $("#test").change(function () {
        var tc = $("#test").val();
        var tks = tc.split(/#/g);
        if (tks.length == 3) {
            $("#username").val(tks[0]);
            $("#password").val(tks[1]);
            $("#tmpl").val(tks[2]);
        }
    });
}());