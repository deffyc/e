function getAppKey() {
    var AppId= "A6058950411861";
    var AppKey="739DA57D-5065-52EC-E3A0-E2BEE19F0CBB";
    var now = Date.now();
    //var appKey = SHA1(AppId + "UZ" + AppKey + "UZ" + now) + "." + now;
    return {
        /*"X-APICloud-AppId": AppId,
        "X-APICloud-AppKey": appKey*/
        "X-APICloud-AppKey":"d633436feb69632ad5a8fbb5900ffaba9dd5959f"
    }
}

//创建ajax函数

function ajax(config) {
    config = config || {};
    var url = config.url || '';
    var method = (config.type || 'GET').toUpperCase();
    var async = config.async === undefined ? true : config.async;
    var contentType = config.contentType || 'application/x-www-form-urlencoded';
    var dataType = (config.dataType || 'json').toUpperCase();
    var header = config.header || {};
    var data = config.data||null;
    var params=''

    //创建-第一步
    var xhr;
    //非IE6
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        //ie6及其以下版本浏览器
        xhr = ActiveXObject('Microsoft.XMLHTTP');
    }
    if(method=='GET'){
        prefix="?"
        params=formatParams(data)
        data=null
        if(url.indexOf("?")!=-1)prefix="&"
        url+=prefix+params
    }
    // 初始化请求
    xhr.open(method, url, async);
    // 设置header的默认值
    xhr.setRequestHeader('Content-Type', contentType);
    // 设置其它header
    for (var item in header) {
        xhr.setRequestHeader(item, header[item]);
    }

    // 发送请求
    xhr.send(data);
    //接收-第三步

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var status = xhr.status;
            if (status >= 200 && status < 300) {
                config.success && config.success(dataType === 'JSON'?JSON.parse(xhr.responseText):xhr.responseText, xhr.responseXML);
            } else {
                config.error && config.error(status);
            }
        }
    }
}

//格式化参数

function formatParams(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    arr.push(('v=' + Math.random()).replace('.', ''));
    return arr.join('&');
}

function jsonp(options) {
    options = options || {};
    if (!options.url || !options.callback) {
        throw new Error("参数不合法");
    }

    //创建 script 标签并加入到页面中
    var callbackName = ('jsonp_' + Math.random()).replace(".", "");
    var oHead = document.getElementsByTagName('head')[0];
    options.data[options.callback] = callbackName;
    var params = formatParams(options.data);
    var oS = document.createElement('script');
    oHead.appendChild(oS);

    //创建jsonp回调函数
    window[callbackName] = function(json) {
        oHead.removeChild(oS);
        clearTimeout(oS.timer);
        window[callbackName] = null;
        options.success && options.success(json);
    };

    //发送请求
    oS.src = options.url + '?' + params;

    //超时处理
    if (options.time) {
        oS.timer = setTimeout(function() {
            window[callbackName] = null;
            oHead.removeChild(oS);
            options.fail && options.fail({
                message: "超时"
            });
        }, time);
    }
};

//格式化参数

function formatParams(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[i]));
    }
    return arr.join('&');
}
