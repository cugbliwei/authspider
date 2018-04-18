var system = require('system');
var fs = require('fs');
var casper = require('casper').create({
    javascriptEnabled: true,
    XSSAuditingEnabled: true,
    waitTimeout: 60000,
    timeout: 60000,
    //logLevel: "debug",
    //verbose: true,
    pageSettings: {
        loadPlugins: false,
        loadImages: true,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36'
    }
});
var mouse = require("mouse").create(casper);
var file_path = '';
var key = '';
system.stdout.write('need_username\n');
param = system.stdin.readLine().trim();
params = param.split('###');

casper.start('http://www.tianyancha.com/login').wait(100, function() {
    loopBody.call(this, 1, 1, '.modulebtn2');
});

casper.wait(100, function() {
    this.click('.modulebtn2');
    this.wait(500, function() {
        //console.log(r, up[r]["username"], up[r]["password"]);
        this.sendKeys('.mobile_box .contactphone', params[0], {reset: true});
        this.sendKeys('.mobile_box .contactword', params[1], {reset: true});
        this.click('.mobile_box .login_btn');
    });
});

casper.wait(100, function() {
    loopBody.call(this, 1, 1, '.search_button');
});

casper.wait(100, function() {
    cookies = getCookie();
    system.stdout.write('cookie###' + cookies + '\n');
});

function loopBody(flag, times, target) {
    if (flag == 0) {
        return;
    }
    else if (times > 120) {
        //fs.write(file_path + 'wrong.html', this.getHTML(), 'w');
        //this.capture(file_path + 'wrong.png');
        system.stdout.write('fail###网络超时\n');
        return
    }
    this.then(function(){
        this.wait(500, function() {
            var tar = this.fetchText(target).trim();
            if(tar.length > 0) {
                flag = 0;
            }
        });
    });
    this.then(function(){
        times++;
        loopBody.call(this, flag, times, target);
    });
}

function getCookie() {
    var cookies = JSON.stringify(phantom.cookies);
    //console.log(cookies);
    return cookies;
}

casper.run();
