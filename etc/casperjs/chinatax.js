var system = require('system');
var casper = require('casper').create({
    clientScripts: [
        '90a1c.js',
        'AesUtil.js',
        'aes.js',
        'bootstrap-datepicker.js',
        'bootstrap-datepicker.zh-CN.min.js',
        'common.js',
        'cookies.js',
        'indexfunc.js',
        'jquery-1.10.2.min.js',
        'jquery.PrintArea.js',
        'jquery.alerts.js',
        'jquery.md5.js',
        'm.q.d.min.js',
        'pbkdf2.js',
        'q.b.a.min.js',
        'result.js',
        's.d.b.min.js',
        'showModalDialog.js',
        't.q.b.min.js',
        't.q.d.min.js',
        't.q.e.min.js',
        't.q.z.min.js',
        'validate.js'
    ],
    javascriptEnabled: true,
    XSSAuditingEnabled: true,
    waitTimeout: 120000,
    timeout: 120000,
    //verbose: true,
    //logLevel: 'debug',
    pageSettings: {
        loadPlugins: false,
        loadImages: true,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36'
    }
});

system.stdout.write('need_code\n');
var fpdm = system.stdin.readLine().trim();
system.stdout.write('need_time\n');
var nowtime = system.stdin.readLine().trim();
var fplx = '';

casper.start('http://authcrawler.yixin.com/site/').wait(100, function() {
    var area = this.evaluate(function(fpdm) {
        var swjginfo = getSwjg(fpdm);
        var ar = swjginfo[2];
        return ar;
    }, fpdm);
    system.stdout.write('html1###' + area + '\n');

    var link = this.evaluate(function(fpdm) {
        var swjginfo = getSwjg(fpdm);
        var ip = swjginfo[1];
        return ip;
    }, fpdm);
    system.stdout.write('html2###' + link + '\n');

    var publickey = this.evaluate(function(fpdm, nowtime) {
        var publickey = $.ckcode(fpdm, nowtime);
        return publickey;
    }, fpdm, nowtime);
    system.stdout.write('html3###' + publickey + '\n');

    fplx = this.evaluate(function(fpdm) {
        var fplx = alxd(fpdm);
        return fplx;
    }, fpdm);
    system.stdout.write('html4###' + fplx + '\n');
});

casper.wait(10, function() {
    system.stdout.write('need_randcode\n');
    var param_all = system.stdin.readLine().trim();
    if (param_all.indexOf('casper_finish') >= 0) {
        system.stdout.write('finish\n');
        this.exit();
    }

    var params = param_all.split("###");

    if (fplx == "01" || fplx == "02" || fplx == "03") {
        var index = params[3].indexOf(".");
        if (index > 0) {
            var arr = params[3].split(".");
            if (arr[1] == "00" || arr[1] == "0") {
                params[3] = arr[0]
            } else if (arr[1].charAt(1) == "0") {
                params[3] = arr[0] + "." + arr[1].charAt(0)
            }
        }
    }
    system.stdout.write('html5###' + params[3] + '\n');

    var iv = this.evaluate(function() {
        var iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        return iv;
    });
    system.stdout.write('html6###' + iv + '\n');

    var salt = this.evaluate(function() {
        var salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        return salt;
    });
    system.stdout.write('html7###' + salt + '\n');

    var publickey = this.evaluate(function(params) {
        var publickey = $.ck(params[0], params[1], params[2], params[3], params[4], params[5]);
        return publickey;
    }, params);
    system.stdout.write('html8###' + publickey + '\n');

    var publickey_old = this.evaluate(function(params) {
        var publickey1 = $.ck(params[0], params[1], params[3], params[2], params[4], params[5]);
        return publickey1;
    }, params);
    system.stdout.write('html9###' + publickey_old + '\n');
});

casper.wait(10, function() {
    system.stdout.write('finish\n');
});

casper.run();
