var system = require('system');
var fs = require('fs');
var casper = require('casper').create({
    javascriptEnabled: true,
    XSSAuditingEnabled: true,
    waitTimeout: 400000,
    timeout: 400000,
    pageSettings: {
        loadPlugins: false,
        loadImages: true,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36'
    }
});
var file_path = '';
var exit = false;
var fileIndex = 0;

casper.start('https://passport.jd.com/common/loginPage?from=pop_vender&regTag=2&ReturnUrl=https%3A%2F%2Forder.jd.com%2Fcenter%2Flist.action');
casper.waitForSelector('#loginname', function() {
    this.click('#loginname');
});

system.stdout.write('need_path\n');

casper.repeat(20, function() {
    var param = '';
    var params = param.split('###');
    var step = 'finish';
    var flag = '';

    fs.write(file_path + 'tmp.html', this.getHTML(), 'w');
    this.capture(file_path + 'tmp.png');
    if (!exit) {
        param = system.stdin.readLine().trim();
        params = param.split('###');
        step = params[0];
    }

    if (step == 'path') {
        file_path = params[1] + '/';
        fs.write(file_path + 'tmp1.html', this.getHTML(), 'w');
        this.capture(file_path + 'tmp1.png');
        system.stdout.write('need_username\n');
    }
    else if (step == 'finish') {
        exit = true;
    }
    else if (step == 'username') {
        var username = params[1];
        var password = params[2];

        casper.waitForSelector('#loginname', function() {
            this.sendKeys('#loginname', username, {reset: true});
            this.sendKeys('#nloginpwd', password, {reset: true});
            fs.write(file_path + 'login_page.html', this.getHTML(), 'w');
            this.capture(file_path + 'login_page.png');
        });

        casper.wait(100, function() {
            if (this.visible('#JD_Verification1')) {
                flag = 'randcode';
                fs.write(file_path + 'need_randcode.html', this.getHTML(), 'w');
                this.capture(file_path + 'need_randcode.png');
                system.stdout.write('need_randcode;' + this.captureBase64('png', '#JD_Verification1') + '\n');
            }
        });

        casper.wait(100, function() {
            if (flag.length == 0) {
                this.wait(100, function() {
                    this.click('#paipaiLoginSubmit');
                });

                this.wait(100, function() {
                    loopLoginBody.call(this, 1, 1);
                });

                this.wait(100, function() {
                    handleText.call(this, 'login_result', true);
                });
            }
        });
    }
    else if (step == 'randcode') {
        var randcode = params[1];
        this.wait(100, function() {
            casper.sendKeys('#authcode', randcode, {reset: true});
        });

        this.wait(100, function() {
            casper.click('#paipaiLoginSubmit');
            var filepath = file_path + "first_send_randcode_" + fileIndex.toString();
            fileIndex = fileIndex + 1;
            fs.write(filepath + '.html', this.getHTML(), 'w');
            this.capture(filepath + '.png');
        });

        this.wait(100, function() {
            loopLoginBody.call(this, 1, 1);
        });

        this.wait(100, function() {
            handleText.call(this, 'send_randcode', false);
        });
    }
    else if (step == 'password2') {
        var password2 = params[1];
        this.wait(100, function() {
            casper.sendKeys('#code', password2, {reset: true});
        });

        this.wait(100, function() {
            casper.click('#submitBtn');
        });

        this.wait(100, function() {
            loopLoginBody.call(this, 1, 1);
        });

        this.wait(100, function() {
            fs.write(file_path + 'send_sms.html', this.getHTML(), 'w');
            this.capture(file_path + 'send_sms.png');
            var smsMsg = this.fetchText('#code-msg').trim();
            var phoneNumber = this.fetchText('.phone-text').trim();
            var loginSuccessMsg = this.fetchText('title').trim();
            var nicknameMsg = this.fetchText('.nickname').trim();

            this.wait(100, function() {
                if (loginSuccessMsg.indexOf('我的订单') >= 0 || nicknameMsg.length > 0) {
                    cookies = getCookie();
                    system.stdout.write('cookie###' + cookies + '\n');
                    exit = true;
                }
                else {
                    system.stdout.write('wrong_password2;' + phoneNumber + '\n');
                }
            });
        });
    }
    else {
        system.stdout.write('fail;未知错误\n');
    }
});

function handleText(filename, step) {
    var filepath = file_path + filename + "_" + fileIndex.toString();
    fileIndex = fileIndex + 1;
    fs.write(filepath + '.html', this.getHTML(), 'w');
    this.capture(filepath + '.png');
    var loginType = this.fetchText('.mt').trim();
    var loginNameMsg = this.fetchText('#loginname_error').trim();
    var loginMsg = this.fetchText('#loginpwd_error').trim();
    var randcodeMsg = this.fetchText('#authcode_error').trim();
    var phoneNumber = this.fetchText('.phone-text').trim();
    var qrcodeLogin = this.fetchText('.checked').trim();
    var loginSuccessMsg = this.fetchText('title').trim();
    var nicknameMsg = this.fetchText('.nickname').trim();
    var noPhone = this.fetchText('.tip-box').trim();

    this.wait(100, function() {
        if (loginType.indexOf('重置密码') >= 0) {
            system.stdout.write('fail;账户存在安全风险，请重置密码后再登录\n');
            exit = true;
        }
        else if (loginNameMsg.indexOf('请刷新页面') >= 0 || loginNameMsg.indexOf('请您再次登录') >= 0 || loginMsg.indexOf('请刷新页面') >= 0 || qrcodeLogin.indexOf('扫码登录') >= 0) {
            system.stdout.write('fail;京东官网出错，请重试\n');
            exit = true;
        }
        else if (loginMsg.indexOf('您还可以尝试') >= 0) {
            system.stdout.write('fail;密码错误次数已准备超过限制\n');
            exit = true;
        }
        else if (noPhone.indexOf('尚未绑定手机') >= 0) {
            system.stdout.write('fail;您的账户尚未绑定手机，请绑定手机后再登录\n');
            exit = true;
        }
        else if (loginNameMsg.indexOf('账户名不存在') >= 0 || loginMsg.indexOf('账户名与密码不匹配') >= 0 || loginMsg.indexOf('密码错误') >= 0) {
            system.stdout.write('fail;用户名或密码错误\n');
            exit = true;
        }
        else if (loginNameMsg.indexOf('封锁') >= 0) {
            system.stdout.write('fail;账号因安全原因被暂时封锁\n');
            exit = true;
        }
        else if (step && randcodeMsg.indexOf('请输入验证码') >= 0) {
            system.stdout.write('need_randcode;' + this.captureBase64('png', '#JD_Verification1') + '\n');
        }
        else if (!step && randcodeMsg.indexOf('验证码不正确') >= 0 || randcodeMsg.indexOf('验证码已过期') >= 0) {
            this.click('.flk13');
            this.wait(1000, function() {
                system.stdout.write('wrong_randcode;' + this.captureBase64('png', '#JD_Verification1') + '\n');
            });
        }
        else if (phoneNumber.length > 0) {
            system.stdout.write('need_password2;' + phoneNumber + '\n');
        }
        else if (loginSuccessMsg.indexOf('我的订单') >= 0 || nicknameMsg.length > 0) {
            cookies = getCookie();
            system.stdout.write('cookie###' + cookies + '\n');
            exit = true;
        }
        else {
            system.stdout.write('fail;未知错误\n');
            exit = true;
        }
    });
}

function loopLoginBody(flag, times){
    if (flag == 0 || times > 60) {
        return;
    }
    this.then(function(){
        this.wait(500, function() {
            var loginType = this.fetchText('.mt').trim();
            var loginNameMsg = this.fetchText('#loginname_error').trim();
            var loginMsg = this.fetchText('#loginpwd_error').trim();
            var randcodeMsg = this.fetchText('#authcode_error').trim();
            var smsMsg = this.fetchText('#code-msg').trim();
            var qrcodeLogin = this.fetchText('.checked').trim();
            var loginSuccessMsg = this.fetchText('title').trim();
            var nicknameMsg = this.fetchText('.nickname').trim();

            if (loginType.indexOf('重置密码') >= 0) {
                flag = 0;
            }
            else if (loginNameMsg.length > 0) {
                flag = 0;
            }
            else if (loginMsg.length > 0) {
                flag = 0;
            }
            else if (randcodeMsg.length > 0) {
                flag = 0;
            }
            else if (smsMsg.length > 0) {
                flag = 0;
            }
            else if (loginSuccessMsg.indexOf('我的订单') >= 0 || nicknameMsg.length > 0) {
                flag = 0;
            }
            else if (qrcodeLogin.indexOf('扫码登录') >= 0) {
                flag = 0;
            }
        });
    });
    this.then(function(){
        times++;
        loopLoginBody.call(this, flag, times);
    });
}

function getCookie() {
    var cookies = JSON.stringify(phantom.cookies);
    //console.log(cookies);
    return cookies;
}

casper.run();
