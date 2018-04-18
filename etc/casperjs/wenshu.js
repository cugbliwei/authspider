var system = require('system');
var fs = require('fs');
var casper = require('casper').create({
    javascriptEnabled: true,
    XSSAuditingEnabled: true,
    waitTimeout: 400000,
    timeout: 400000,
    logLevel: "debug",
    verbose: true,
    pageSettings: {
        loadPlugins: false,
        loadImages: true,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36'
    }
});
var exit = false;
var key = '';

casper.start('http://wenshu.court.gov.cn/');

casper.wait(3000, function() {
    fs.write('index.html', this.getHTML(), 'w');
    this.capture('index.png');
});

casper.waitForSelector('.head_search_btn', function() {
    this.click('.head_search_key');
});

casper.wait(50, function() {
    system.stdout.write('need_key\n');
    key = system.stdin.readLine().trim();
});

casper.wait(50, function() {
    this.sendKeys('.head_search_key', key, {reset: true});
    this.wait(500, function() {
        this.click('.head_search_btn');
    });
    this.waitForSelector('.list_datacount', function() {
        fs.write('submit.html', this.getHTML(), 'w');
        this.capture('submit.png');
    });
});

casper.run();
