var system = require('system');
var fs = require('fs');
var casper = require('casper').create({
    javascriptEnabled: true,
    XSSAuditingEnabled: true,
    waitTimeout: 300000,
    timeout: 300000,
    //verbose: true,
    //logLevel: 'debug',
    onAlert: function(self, msg) {
        if (msg.indexOf('用户名或密码不正确') >= 0 || msg.indexOf('公司名不存在') >= 0) {
            system.stdout.write('fail;' + msg + '\n');
            casper.exit();
        }
    },
    onError: function(self, msg) {
        if (msg.indexOf('Failed') < 0) {
            system.stdout.write('fail;' + msg + '\n');
            casper.exit();
        }
    },
    pageSettings: {
        loadPlugins: false,
        loadImages: true,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36'
    }
});

casper.setFilter('page.confirm', function(message) {
    return false;
});

var file_path = '';
var exit = false;

casper.start('http://login.wsgjp.com.cn/');
casper.waitForSelector('#ContentPlaceHolder1_txt_CompanyNames', function() {
    this.click('#ContentPlaceHolder1_txt_CompanyNames');
});

system.stdout.write('need_path\n');

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
        fs.write(file_path + 'start_login.html', this.getHTML(), 'w');
        this.capture(file_path + 'start_login.png');
        system.stdout.write('need_username\n');
    }
    else if (step == 'finish') {
        exit = true;
    }
    else if (step == 'username') {
        var username = params[1];
        var password = params[2];
        var company = params[3];

        casper.waitForSelector('#ContentPlaceHolder1_txt_CompanyNames', function() {
            this.sendKeys('#ContentPlaceHolder1_txt_CompanyNames', company);
            this.sendKeys('#ContentPlaceHolder1_txt_UserNames', username);
            this.sendKeys('#txt_PassWords', password);
            this.click('#ContentPlaceHolder1_cb_RemenberMe');
            this.capture(file_path + 'input_msg.png');
            this.click('#ContentPlaceHolder1_btnlogin');
        });

        casper.wait(2000, function() {
            if (this.exists('#btnsure')) {
                this.capture(file_path + 'btnsure.png');
                this.click('#btnsure');
            }
        });

        var need_sms = false;
        casper.wait(5000, function() {
            fs.write(file_path + 'login_result.html', this.getHTML(), 'w');
            this.capture(file_path + 'login_result.png');
            this.wait(100, function() {
                var phoneNum = this.getElementAttribute('.Edit.disabled', 'value');
                if (phoneNum != null) {
                    this.click('button[id*="$sendsmsbtn"]');
                    fs.write(file_path + 'sms.html', this.getHTML(), 'w');
                    this.capture(file_path + 'sms.png');
                    system.stdout.write('need_sms;' + phoneNum + '\n');
                    need_sms = true;
                }
            });
        });

        this.wait(3000, function() {
            fs.write(file_path + 'login_success.html', this.getHTML(), 'w');
            this.capture(file_path + 'login_success.png');
            var html = this.getHTML()
            this.wait(100, function() {
                if (need_sms == false) {
                    if (html.indexOf("进货") > 0) {
                        cookies = getCookie();
                        var domain = getDomain();
                        system.stdout.write('version###' + domain + '\n');
                        system.stdout.write('cookie###' + cookies + '\n');
                        exit = true;
                    } else {
                        system.stdout.write('fail;授权失败，请重试\n');
                    }
                }
            });
        });

    }
    else if (step == 'sms') {
        var sms = params[1];
        this.wait(100, function(){
            this.sendKeys('input[id*="$code"]', sms);
            this.click('a[id*="$submitbtn"]');
        });
        this.wait(1000, function(){
            this.capture(file_path + 'sms_result.png');
            fs.write(file_path + 'sms_result.html', this.getHTML(), 'w');
            if (this.visible('.MessageBoxText')) {
                this.capture(file_path + 'input_sms.png');
                system.stdout.write('wrong_password2' + this.fetchText('.MessageBoxText') + '\n');
            }
        });
        this.wait(3000, function(){
            fs.write(file_path + 'sms_login_success.html', this.getHTML(), 'w');
            this.capture(file_path + 'sms_login_success.png');
            var html = this.getHTML()
            if (html.indexOf("进货") > 0) {
                cookies = getCookie();
                var domain = getDomain();
                system.stdout.write('version###' + domain + '\n');
                system.stdout.write('cookie###' + cookies + '\n');
                exit = true;
            } else {
                system.stdout.write('fail;授权失败，请重试\n');
            }
        });
    }
    else {
        system.stdout.write('fail;未知错误\n');
    }
});

function getCookie() {
    var domain = getDomain()
    var cookies = phantom.cookies;
    var newCookies = new Array();
    for (var i=0; i<cookies.length; i++) {
        if (cookies[i].domain == '.wsgjp.com.cn') {
            newCookies.push(cookies[i]);
        } else if (cookies[i].domain == domain) {
            cookies[i].domain = '.wsgjp.com.cn';
            newCookies.push(cookies[i]);
        }
    }
    var cookies = JSON.stringify(newCookies);
    return cookies;
}

function getDomain() {
    var domain = casper.evaluate(function() {
        return document.domain;
    });
    return domain
}

casper.run();
