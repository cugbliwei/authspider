var system = require('system');
var fs = require('fs');
var casper = require('casper').create({
    javascriptEnabled: true,
    XSSAuditingEnabled: true,
    waitTimeout: 600000,
    pageSettings: {
        loadPlugins: false,
        loadImages: true,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36'
    }
});
var mouse = require("mouse").create(casper);

system.stdout.write('need_path\n');
var file_path = system.stdin.readLine().trim();
file_path = file_path + '/';
system.stdout.write('need_username\n');
var sms = '';

casper.start('https://login.taobao.com/member/login.jhtml?redirectURL=https%3A%2F%2Fi.taobao.com%2Fmy_taobao.htm');
casper.waitForSelector('#J_Quick2Static', function() {
    this.click('#J_Quick2Static');
});

casper.repeat(50, function() {
    var param = system.stdin.readLine().trim();
    //console.log('param:' + param);
    var params = param.split('###');
    var step = params[0];
    if (step == 'username') {
        var username = params[1];
        var password = params[2];

        casper.waitForSelector('#TPL_username_1', function() {
            fs.write(file_path + 'login1.html', this.getHTML(), 'w');
            this.capture(file_path + 'taobao1.png');
            this.sendKeys('#TPL_username_1', username);
            this.sendKeys('#TPL_password_1', password);
            this.click('#J_SubmitStatic');
        });

        loopLoginBody.call(this, 1, 1);

        casper.wait(100, function() {
            var x = 870;
            var y = 435;
            fs.write(file_path + 'login2.html', this.getHTML(), 'w');
            this.capture(file_path + 'taobao2.png');
            var errMsg = this.fetchText('#J_Message .error').trim();
            var safeMsg = this.fetchText('.ui-tiptext').trim();
            //console.log(safeMsg);
            if (errMsg.indexOf('密码和账户名不匹配') >= 0 || safeMsg.indexOf('密码和账户名不匹配') >= 0) {
                system.stdout.write('fail;用户名或密码错误\n');
                this.exit();
            }
            else if (safeMsg.indexOf('账户存在安全风险') >= 0) {
                x = 460;
                y = 300;
                //console.log(x);
            }

            if (this.exists('.btn_slide')) {
                this.mouse.down('.btn_slide');
                var j = 10;
                this.repeat(96, function() {
                    //console.log(j);
                    var w = Math.random() * 100;
                    this.wait(w, function () {
                        var ra = Math.random() * 6;
                        this.mouse.move(x + j + ra, y + ra);
                        fs.write('test' + j + '.html', this.getHTML(), 'w');
                        this.capture('test' + j + '.png');
                        j = j +3;
                    });
                });

                this.wait(100, function () {
                    this.mouse.up('.btn_slide');

                    if (y == 435) {
                        system.stdout.write('need_username\n');
                    }
                    else if (y == 300) { //需要身份证号验证
                        this.click('#submitBtn');
                        this.wait(3000, function () {
                            fs.write('submitBtn.html', this.getHTML(), 'w');
                            this.capture('submitBtn.png');
                        });
                    }
                });
            }

            if (this.exists('.s-my-stuffs')) {
                cookies = getCookie();
                system.stdout.write('cookie###' + cookies + '\n');
                this.exit();
            }

            if (this.exists('.login-check-left')) {
                this.page.switchToChildFrame(0);
                if (!this.exists('#J_GetCode')) {
                    if (this.exists('.ui-form-other')) {
                        console.log('click ui-form-other');
                        this.click('.ui-form-other');
                    }
                    else if (this.exists('#otherValidator')) {
                        console.log('click otherValidator');
                        this.click('#otherValidator');
                    }

                    fs.write(file_path + 'login3.html', this.getHTML(), 'w');
                    this.capture(file_path + 'taobao3.png');

                    loopOtherBody.call(this, 1, 1);

                    this.wait(50, function() {
                        fs.write(file_path + 'login4.html', this.getHTML(), 'w');
                        this.capture(file_path + 'taobao4.png');
                        //this.page.switchToChildFrame(0);
                        this.click("a[href*='tag=8']");

                        loopSmsBody.call(this, 1, 1);
                        this.wait(50, function() {
                            fs.write(file_path + 'login5.html', this.getHTML(), 'w');
                            this.capture(file_path + 'taobao5.png');
                            //this.page.switchToChildFrame(0);
                        });
                    });
                }

                this.waitForSelector('#J_GetCode', function() {
                    fs.write(file_path + 'login6.html', this.getHTML(), 'w');
                    this.capture(file_path + 'taobao6.png');
                    this.wait(50, function () {
                        sms = this.fetchText('#J_MobileVal').trim();
                        this.click('#J_GetCode');   //发送短信验证码
                        system.stdout.write('need_password2;' + sms + '\n');
                        this.wait(1000, function() { 
                            fs.write(file_path + 'login7.html', this.getHTML(), 'w');
                            this.capture(file_path + 'taobao7.png');
                        });
                    });
                });
            }
        });
    }
    else if (step == 'password2') {
        var smsCode = params[1];
        casper.sendKeys('#J_Phone_Checkcode', smsCode);
        casper.click('.ui-button');

        loopSendSmsBody.call(this, 1, 1);
        casper.wait(50, function() {
            fs.write(file_path + 'login8.html', this.getHTML(), 'w');
            this.capture(file_path + 'taobao8.png');
            if (this.exists('.s-my-stuffs')) {
                cookies = getCookie();
                system.stdout.write('cookie###' + cookies + '\n');
                this.exit();
            }

            var errMsg = this.fetchText('.ui-form-item').trim();
            if (errMsg.indexOf('手机验证码错误') >= 0) {
                system.stdout.write('wrong_password2;' + sms + '\n');
            }
            else if (errMsg.indexOf('校验码错误次数过多') >= 0 || errMsg.indexOf('请重新获取') >= 0 || errMsg.indexOf('过期') >= 0 || errMsg.indexOf('失效') >= 0) {
                this.click('#J_GetCode');   //重新发送短信验证码
                system.stdout.write('wrong_password2;' + sms + '\n');
            }
            else {
                system.stdout.write('fail;手机验证码错误次数过多，请重新登录\n');
                this.exit();
            }
        });
    }
});

function loopLoginBody(flag, times){
    if (flag == 0 || times > 60) {
        return;
    }
    this.then(function(){
        this.wait(500, function() {
            if (this.exists('.btn_slide')) {
                flag = 0;
            }
            else if (this.exists('.login-check-left')) {
                this.page.switchToChildFrame(0);
                if (this.exists('.ui-form-other') || this.exists('#J_GetCode') || this.exists('#otherValidator')) {
                    flag = 0;
                }
                this.page.switchToParentFrame();
            }
            else if (this.exists('.s-my-stuffs')) {
                flag = 0;
            }
        });
    });
    this.then(function(){
        times++;
        loopLoginBody.call(this, flag, times);
    });
}

function loopOtherBody(flag, times){
    if (flag == 0 || times > 60) {
        return;
    }
    this.then(function(){
        this.wait(500, function() {
            if (this.exists('.select-strategy')) {
                flag = 0;
            }
        });
    });
    this.then(function(){
        times++;
        loopOtherBody.call(this, flag, times);
    });
}

function loopSmsBody(flag, times){
    if (flag == 0 || times > 60) {
        return;
    }
    this.then(function(){
        this.wait(500, function() {
            if (this.exists('#J_GetCode')) {
                flag = 0;
            }
        });
    });
    this.then(function(){
        times++;
        loopSmsBody.call(this, flag, times);
    });
}

function loopSendSmsBody(flag, times){
    if (flag == 0 || times > 60) {
        return;
    }
    this.then(function(){
        this.wait(500, function() {
            if (this.exists('.s-my-stuffs')) {
                flag = 0;
            }
            if (this.exists('.ui-form-item')) {
                var errMsg = this.fetchText('.ui-form-item').trim();
                if (errMsg.length > 0) {
                    flag = 0;
                }
            }
        });
    });
    this.then(function(){
        times++;
        loopSendSmsBody.call(this, flag, times);
    });
}

function getCookie() {
    var cookies = JSON.stringify(phantom.cookies);
    //console.log(cookies);
    return cookies;
}

casper.run();
