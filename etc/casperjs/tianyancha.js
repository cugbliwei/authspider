var up = [
    {"username": "17310653630", "password": "weili105"},
    {"username": "17183246634", "password": "17183246634uio"},
    {"username": "17181264695", "password": "17181264695uio"},
    {"username": "17183246845", "password": "17183246845uio"},
    {"username": "17183246841", "password": "17183246841uio"},
    {"username": "17183146824", "password": "17183146824uio"},
    {"username": "17183014690", "password": "17183014690uio"},
    {"username": "17183143094", "password": "17183143094uio"},
    {"username": "17187032945", "password": "17187032945uio"},
    {"username": "17186114095", "password": "17186114095uio"},
    {"username": "17183141248", "password": "17183141248uio"},
    {"username": "17183141243", "password": "17183141243uio"},
    {"username": "17188202634", "password": "17188202634uio"},
    {"username": "17187629463", "password": "17187629463uio"},
    {"username": "17187629469", "password": "17187629469uio"},
    {"username": "17187611437", "password": "17187611437uio"},
    {"username": "17188581834", "password": "17188581834uio"},
    {"username": "17181404315", "password": "17181404315uio"},
    {"username": "17181404439", "password": "17181404439uio"},
    {"username": "17181404436", "password": "17181404436uio"},
    {"username": "17181404425", "password": "17181404425uio"},
    {"username": "17181404415", "password": "17181404415uio"},
    {"username": "17181404407", "password": "17181404407uio"},
    {"username": "17181404406", "password": "17181404406uio"},
    {"username": "17187794436", "password": "17187794436uio"},
    {"username": "17187794204", "password": "17187794204uio"},
    {"username": "17183246745", "password": "17183246745uio"},
    {"username": "17183246804", "password": "17183246804uio"},
    {"username": "17183246824", "password": "17183246824uio"},
    {"username": "17183246834", "password": "17183246834uio"},
    {"username": "17187790254", "password": "17187790254uio"},
    {"username": "17187790415", "password": "17187790415uio"},
    {"username": "17187794438", "password": "17187794438uio"},
    {"username": "17187792364", "password": "17187792364uio"},
    {"username": "17187793640", "password": "17187793640uio"},
    {"username": "17187793641", "password": "17187793641uio"},
    {"username": "17187793642", "password": "17187793642uio"},
    {"username": "17187794465", "password": "17187794465uio"},
    {"username": "17187794463", "password": "17187794463uio"},
    {"username": "17185964824", "password": "17185964824uio"},
    {"username": "17185965241", "password": "17185965241uio"},
    {"username": "17187794174", "password": "17187794174uio"},
    {"username": "17187612475", "password": "17187612475uio"},
    {"username": "17187621714", "password": "17187621714uio"},
    {"username": "17187624878", "password": "17187624878uio"},
    {"username": "17187628437", "password": "17187628437uio"},
    {"username": "17183246646", "password": "17183246646uio"},
    {"username": "17183141435", "password": "17183141435uio"},
    {"username": "17183141434", "password": "17183141434uio"},
    {"username": "17182407634", "password": "17182407634uio"},
    {"username": "17182417340", "password": "17182417340uio"}
];

var system = require('system');
var fs = require('fs');
var casper = require('casper').create({
    javascriptEnabled: true,
    XSSAuditingEnabled: true,
    waitTimeout: 120000,
    timeout: 120000,
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

casper.start('http://www.tianyancha.com/login');

casper.waitForSelector('.modulebtn2', function() {
    this.click('.modulebtn2');
    this.wait(500, function() {
        var r = Math.floor(Math.random() * 51);
        //console.log(r, up[r]["username"], up[r]["password"]);
        this.sendKeys('.mobile_box .contactphone', up[r]["username"], {reset: true});
        this.sendKeys('.mobile_box .contactword', up[r]["password"], {reset: true});
        this.click('.mobile_box .login_btn');
    });
});

casper.waitForSelector('.search_button', function() {
    this.click('#live-search');
    //this.capture('submit.png');
});

casper.wait(50, function() {
    system.stdout.write('need_path\n');
    file_path = system.stdin.readLine().trim() + '/';
    system.stdout.write('need_key\n');
    key = system.stdin.readLine().trim();
});

casper.wait(50, function() {
    this.sendKeys('#live-search', key, {reset: true});
    this.wait(100, function() {
        this.click('.search_button');
    });
});

casper.waitForSelector('.search-multi-filter', function() {
    fs.write(file_path + 'submit.html', this.getHTML(), 'w');
    this.capture(file_path + 'submit.png');
    if(!this.exists('.query_name span')) {
        system.stdout.write('finish###没有找到相关结果\n');
        this.exit();
    }
    
    var urls = this.getElementsAttribute('.query_name', 'href');
    this.wait(50, function() {
        var length = 5;
        var i = 0;
        if (urls.length < 5) {
            length = urls.length;
        }

        if (length != 0) {
            this.repeat(length, function() {
                this.open(urls[i]).waitForSelector('.company_header_width', function() {
                    this.wait(1000, function() {
                        html = this.getHTML();
                        html = html.replace(new RegExp('\n', 'gm'), '');
                        system.stdout.write('html###' + html + '\n');
                        fs.write(file_path + 'url_' + parseInt(i) + '.html', this.getHTML(), 'w');
                        this.capture(file_path + 'url_' + parseInt(i) + '.png');

                        i = i + 1;
                        if(i == length) {
                            this.mouse.move('.user_title .fa-caret-down');
                            this.evaluate(function() {
                                document.querySelector('#userShow .list-group-item:nth-child(4)').click();
                            });
                            this.waitForSelector('.search_button', function() {
                                //wait logout
                            });
                        }
                    });
                });
            });
            this.wait(50, function() {
                system.stdout.write('finish###抓取完成\n');
            });
        }
    });
});

casper.run();
