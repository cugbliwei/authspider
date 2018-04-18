var system = require('system');
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

system.stdout.write('need_token\n');
var token = system.stdin.readLine().trim();

casper.start('http://authcrawler.yixin.com/site/taobao_ua.html?token=' + token);
casper.wait(300, function() {
    this.click('#fm-login-id');
});
casper.wait(350, function() {
    this.click('body');
});
casper.wait(400, function() {
    this.click('#fm-login-password');
});
casper.wait(100, function() {
    var ua = this.fetchText('#target_ua').trim();
    system.stdout.write('finish###' + ua + '\n');
});

casper.run();
