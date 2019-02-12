/**
 * csv file to 2D arr
 * */
$.fn.csv2arr = function(callback) {
	if (typeof(FileReader) == 'undefined') { //if not H5
		alert("IE9及以下浏览器不支持，请使用Chrome或Firefox浏览器\nYour browser is too old,please use Chrome or Firefox");
		return false;
	}
	if (!$(this)[0].files[0]) {
		alert("请选择文件\nPlease select a file");
		return false;
	}
	var fReader = new FileReader;
	fReader.readAsDataURL($(this)[0].files[0]);
	$fileDOM = $(this);
	fReader.onload = function(evt) {
		var data = evt.target.result;
		//        console.log( data );
		var encoding = checkEncoding(data);
		//        console.log(encoding);
		//转换成二维数组，需要引入Papaparse.js
		Papa.parse($($fileDOM)[0].files[0], {
			encoding: encoding,
			complete: function(results) { // UTF8 \r\n与\n混用时有可能会出问题
				// console.log(results);
				var res = results.data;
				if (res[res.length - 1] == "") { //去除最后的空行
					res.pop;
				}
				callback && callback(res);
			}
		});
	}
	fReader.onerror = function(evt) {
		// console.log(evt);
		alert("文件已修改，请重新选择(Firefox)\nThe file has changed,please select again.(Firefox)");
	}
	//检查编码，引用了 jschardet
	function checkEncoding(base64Str) {
		//这种方式得到的是一种二进制串
		var str = atob(base64Str.split(";base64,")[1]);
		//        console.log(str);
		//要用二进制格式
		var encoding = jschardet.detect(str);
		encoding = encoding.encoding;
		//        console.log( encoding );
		if (encoding == "windows-1252") { //有时会识别错误（如UTF8的中文二字）
			encoding = "ANSI";
		}
		return encoding;
	}
}
Array.prototype.unique = function() {
	var n = {},
		r = []; //n为hash表，r为临时数组
	for (var i = 0; i < this.length; i++) //遍历当前数组
	{
		if (!n[this[i]]) //如果hash表中没有当前项
		{
			n[this[i]] = true; //存入hash表
			r.push(this[i]); //把当前数组的当前项push到临时数组里面
		}
	}
	return r;
}
if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	};
}
Array.prototype.trim = function() {
	for (var i = 0; i < this.length; i++) //遍历当前数组
	{
		if (typeof(this[i]) == "string")
			this[i] = this[i].trim()
	}
	return this
}
$.rowsToJson=function(arr,nameFn,dataFn){
	keyArray = nameFn(arr[0])
	jsonObjs = []
	jsonObjs.push(keyArray)
	for (var i = 1; i < arr.length; i++) {
		arr[i] = dataFn(arr[i])
		minLength = keyArray.length - arr[i].length <= 0 ? keyArray.length : arr[i].length
		tmpOjb = {}
		for (var j = 0; j < minLength; j++) {
			tmpOjb[keyArray[j]] = arr[i][j].trim()
		}
		if (arr[i].length > minLength) jsonObjs[keyArray[minLength - 1]] += arr[i].slice(minLength).trim().join()
		jsonObjs.push(tmpOjb)
	}
	return jsonObjs
}
