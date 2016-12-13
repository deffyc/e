#!/usr/bin/env node
var readline = require('readline');
var fs = require('fs');
var path = require('path');
var INFO_PATH = "./data/info.json";

var keyArry = ['name', 'description', 'url', 'tags'];
var fReadName = "data/all.txt";
var fRead = fs.createReadStream(fReadName); 
var objReadline = readline.createInterface({
    input: fRead,
});

var i = 0;
var rst = {};

var DATAPATH = './data/sites/';
var totalCount=0
function init() {
	objReadline.on('line', (line)=>{
		str=line.replace(/(^\s*)|(\s*$)/g,"");
		var reg=new RegExp("^#");
		if(!reg.test(str) && str != ""){
			rst[keyArry[i]] = str;
			i++;

			if (i == keyArry.length) {
				fs.writeFile(path.join(DATAPATH, (++totalCount) + '.json'), JSON.stringify({
					name : rst.name,
					id : totalCount,
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

fs.writeFile(INFO_PATH, JSON.stringify({
	totalCount : 0,
	lastUpdateDate : +new Date(),
	lastUpdateCount: 0,
}), function(err) {
	if (err) {
		throw err;
	}
});
init();

