var system = require('system');
var fs = require('fs');
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
var file_path = '';
var address = '';
var fileIndex = 0;
var flag = true;

system.stdout.write("need_url, start scripts, try to read\n");
address = system.stdin.readLine().trim();
if (address.indexOf('hasFinished') >= 0) {
	system.stdout.write('finish\n');
} else {
    system.stdout.write('need_path\n');
    file_path = system.stdin.readLine().trim();
    
    casper.start('https://www.taobao.com/');
    
    casper.repeat(3, function() {
        this.open(address).then(function() {
            fs.write(file_path + '/search_' + fileIndex + '.html', this.getHTML(), 'w');
            this.capture(file_path + '/search_' + fileIndex + '.png');
            fileIndex += 1;
            var searchResult = this.evaluate(function(){
    			for(var i=0; i<document.scripts.length; i++){
    				var temp = document.scripts[i].textContent;
    				if(temp.indexOf("g_page_config") > -1 && temp.length > 300){
    					return temp;
    				}
    			}
    			return "";
    		});
    		if (searchResult.length > 0){
    			system.stdout.write('finish#result is: ' + searchResult.replace(/[\r\n]*/g,"").trim() + '\n');
    			flag = false;
    			this.exit();
    		}
        });
    });
    
    casper.wait(100, function() {
    	if (flag == true) {
    		system.stdout.write('fail#try_3_times_give_up\n');
    	}
    });
}

casper.run();
