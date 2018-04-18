var system = require('system');
var fs = require('fs');
var casper = require('casper').create({
    javascriptEnabled: true,
    XSSAuditingEnabled: true,
    waitTimeout: 400000,
    timeout: 400000,
    //verbose: true,
    //logLevel: 'debug',
    pageSettings: {
        loadPlugins: false,
        loadImages: true,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36'
    }
});
system.stdout.write('need_username\n');
param = system.stdin.readLine().trim();
params = param.split('###');

casper.start('https://www.lagou.com/');
casper.waitForSelector('#lg_tbar', function() {
    this.click("a[href*='/frontLogin.do']");
});

casper.waitForSelector('.form_body .btn_group', function() {
    this.sendKeys("div[data-propertyname*='username'] input", params[0], {reset: true});
    this.sendKeys("div[data-propertyname*='password'] input", params[1], {reset: true});
    this.click("div[data-view*='passwordLogin'] .btn_active");
});

casper.waitForSelector('.user_dropdown', function() {
    //fs.write('./success.html', this.getHTML(), 'w');
    //this.capture('./success.png');
    cookies = getCookie();
    system.stdout.write('cookie###' + cookies + '\n');
});

function getCookie() {
    var cookies = JSON.stringify(phantom.cookies);
    return cookies;
}

casper.run();
