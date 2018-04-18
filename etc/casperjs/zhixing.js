var casper = require('casper').create();
var system = require('system');

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36');

casper.start("http://zhixing.court.gov.cn/");

casper.then(function() {
    var cookies = JSON.stringify(phantom.cookies);
    system.stdout.write("cookie" + cookies + "\n");
});

casper.run();