#!/usr/bin/env node
var readline = require('readline');
var fs = require('fs');
var path = require('path');
var INFO_PATH = "./html/data/info.json";

var keyArry = ['name', 'description', 'url', 'tags'];
var fReadName = "./html/data/all.txt";
var fRead = fs.createReadStream(fReadName); 
var objReadline = readline.createInterface({
    input: fRead,
});

var i = 0;
var rst = {};

var DATAPATH = './html/data/sites/';
var info = JSON.parse(fs.readFileSync('./html/data/info.json', 'utf-8'));
function init() {
	objReadline.on('line', (line)=>{
		str=line.replace(/(^\s*)|(\s*$)/g,"");
		var reg=new RegExp("^#");
		if(!reg.test(str) && str != ""){
			rst[keyArry[i]] = str;
			i++;

			if (i == keyArry.length) {
				fs.writeFile(path.join(DATAPATH, (++info.totalCount) + '.json'), JSON.stringify({
					name : rst.name,
					id : info.totalCount++,
					description: rst.description,
					tags: rst.tags,
					url: rst.url,
					createAt: +new Date()
				}), function(err) {
					if (err) {
						throw err;
					}
				});
				i = 0;
				rst = {};
			}
		}
	});  
}

init();

