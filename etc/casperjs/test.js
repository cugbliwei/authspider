var system = require('system');
var fs = require('fs');
var casper = require('casper').create({
    javascriptEnabled: true,
    XSSAuditingEnabled: true,
    waitTimeout: 120000,
    timeout: 120000,
    pageSettings: {
        loadPlugins: false,
        loadImages: true,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36'
    }
});

for (var obj in up) {
	var r = Math.floor(Math.random() * 51);
	console.log(r, up[r]["username"], up[r]["password"]);
}

casper.run();
