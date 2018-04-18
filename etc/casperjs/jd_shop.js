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

system.stdout.write('need_path\n');

casper.start('https://passport.jd.com/common/loginPage?from=pop_vender&regTag=2&ReturnUrl=https://shop.jd.com/index.action');
casper.waitForSelector('#loginname', function() {
    this.click('#loginname');
});

casper.repeat(20, function() {
    var param = '';
    var params = param.split('###');
    var step = 'finish';
    var flag = '';
    if (!exit) {
        param = system.stdin.readLine().trim();
        params = param.split('###');
        step = params[0];
    }

    if (step == 'path') {
        file_path = params[1] + '/';
        system.stdout.write('need_username\n');
    }
    else if (step == 'finish') {
        exit = true;
    }
    else if (step == 'username') {
        var username = params[1];
        var password = params[2];

        casper.waitForSelector('#loginname', function() {
            fs.write(file_path + 'login_page.html', this.getHTML(), 'w');
            this.capture(file_path + 'login_page.png');
            this.sendKeys('#loginname', username);
            this.sendKeys('#nloginpwd', password);
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
                this.click('#paipaiLoginSubmit');
                loopLoginBody.call(this, 1, 1);

                this.wait(100, function() {
                    handleText.call(this, 'login_result', true);
                });
            }
        });
    }
    else if (step == 'randcode') {
        var randcode = params[1];
        casper.sendKeys('#authcode', randcode);
        casper.click('#paipaiLoginSubmit');

        loopLoginBody.call(this, 1, 1);

        this.wait(100, function() {
            handleText.call(this, 'send_randcode', false);
        });
    }
    else if (step == 'password2') {
        var password2 = params[1];
        casper.sendKeys('#code', password2);
        casper.click('#submitBtn');

        loopLoginBody.call(this, 1, 1);

        this.wait(100, function() {
            fs.write(file_path + 'send_sms.html', this.getHTML(), 'w');
            this.capture(file_path + 'send_sms.png');
            var smsMsg = this.fetchText('#code-msg').trim();
            var phoneNumber = this.fetchText('.phone-text').trim();
            var nicknameMsg = this.fetchText('.e-hd-username a').trim();

            this.wait(100, function() {
                if (nicknameMsg.length > 0) {
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
    else if (step == 'password3') {
        var password2 = params[1];
        casper.sendKeys('#pcode', password2);
        casper.click('#checkCode');

        loopLoginBody.call(this, 1, 1);

        this.wait(100, function() {
            fs.write(file_path + 'send_sms3.html', this.getHTML(), 'w');
            this.capture(file_path + 'send_sms3.png');
            var sms3Msg = this.fetchText('#codeMsg').trim();
            var phone_number = this.fetchText('#mobile').trim();
            var nicknameMsg = this.fetchText('.e-hd-username a').trim();

            this.wait(100, function() {
                if (nicknameMsg.length > 0) {
                    cookies = getCookie();
                    system.stdout.write('cookie###' + cookies + '\n');
                    exit = true;
                }
                else {
                    system.stdout.write('wrong_password3;' + phone_number + '\n');
                }
            });
        });
    }
    else {
        system.stdout.write('fail;未知错误\n');
    }
});

function handleText(filename, step) {
    fs.write(file_path + filename + '.html', this.getHTML(), 'w');
    this.capture(file_path + filename + '.png');
    var loginType = this.fetchText('.mt').trim();
    var loginNameMsg = this.fetchText('#loginname_error').trim();
    var loginMsg = this.fetchText('#loginpwd_error').trim();
    var randcodeMsg = this.fetchText('#authcode_error').trim();
    var phoneNumber = this.fetchText('.phone-text').trim();
    var nicknameMsg = this.fetchText('.e-hd-username a').trim();
    var phoneMsg = this.fetchText('#tab_phoneV').trim();

    this.wait(100, function() {
        if (loginType.indexOf('重置密码') >= 0) {
            system.stdout.write('fail;账户存在安全风险，请重置密码后再登录\n');
            exit = true;
        }
        else if (loginNameMsg.indexOf('请刷新页面') >= 0 || loginNameMsg.indexOf('请您再次登录') >= 0 || loginMsg.indexOf('请刷新页面') >= 0) {
            system.stdout.write('fail;京东官网出错，请重试\n');
            exit = true;
        }
        else if (loginMsg.indexOf('您还可以尝试') >= 0) {
            system.stdout.write('fail;密码错误次数已准备超过限制\n');
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
        else if (phoneMsg.indexOf('短信验证') >= 0) {
            this.click('#tab_phoneV a');
            this.wait(1000, function() {
                var phone_number = this.fetchText('#mobile').trim();
                this.click('#sendCode');
                this.wait(500, function() {
                    fs.write(file_path + 'get_sms3.html', this.getHTML(), 'w');
                    this.capture(file_path + 'get_sms3.png');
                    system.stdout.write('need_password3;' + phone_number + '\n');
                });
            });
        }
        else if (phoneNumber.length > 0) {
            system.stdout.write('need_password2;' + phoneNumber + '\n');
        }
        else if (nicknameMsg.length > 0) {
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
            var sms3Msg = this.fetchText('#codeMsg').trim();
            var nicknameMsg = this.fetchText('.e-hd-username a').trim();
            var phoneMsg = this.fetchText('#tab_phoneV').trim();

            if (loginType.indexOf('重置密码') >= 0 || phoneMsg.indexOf('短信验证') >= 0) {
                flag = 0;
            }
            else if (nicknameMsg.length > 0 || loginNameMsg.length > 0 || loginMsg.length > 0 || randcodeMsg.length > 0 || smsMsg.length > 0 || sms3Msg.length > 0) {
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
