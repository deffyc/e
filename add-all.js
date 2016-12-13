#!/usr/bin/env node
var readline = require('readline');
var fs = require('fs');
var path = require('path');
var INFO = "./data/info.json";

var keyArry = ['name', 'description', 'url', 'tags'];
var fReadName = 'data/all.txt';
var fRead = fs.createReadStream(fReadName); 
var objReadline = readline.createInterface({
    input: fRead,
});
/*var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});*/

var i = 0;
var rst = {};

var DATAPATH = './data/sites/';

fs.writeFile(INFO, JSON.stringify({
	totalCount : 0,
	lastUpdateDate : +new Date(),
	lastUpdateCount: 0,
}), function(err) {
	if (err) {
		throw err;
	}
});
				
var info = JSON.parse(fs.readFileSync('./data/info.json', 'utf-8'));

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

