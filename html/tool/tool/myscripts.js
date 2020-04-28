//orientationchange方向改变事件
(function(doc, win) {
    var docEl = doc.documentElement, //根元素html
        //判断窗口有没有orientationchange这个方法，有就赋值给一个变量，没有就返回resize方法。
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            //把document的fontSize大小设置成跟窗口成一定比例的大小，从而实现响应式效果。
            if(clientWidth<700){
                docEl.style.fontSize = (clientWidth / 19) + 'px';
            }else{
                docEl.style.fontSize = (clientWidth / 40) + 'px';
            }
            
        };
    //alert(docEl)
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false); //addEventListener事件方法接受三个参数：第一个是事件名称比如点击事件onclick，第二个是要执行的函数，第三个是布尔值
    doc.addEventListener('DOMContentLoaded', recalc, false) //绑定浏览器缩放与加载时间
})(document, window);
//alert(document.documentElement.clientWidth/320)
var PlayTool = (function() {
    //
    var pointer;
    var autoNextPointer;

    //audio列表[HtmlElement]
    var playAudioPointer = -1;
    var audioList = [];
    var downloadNum;
    var loadPointer = -1;

    var textList = [];
    var restText;
    var ttsMap=new Map([['baidu','http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&text='],['google','https://translate.google.com/translate_tts?tl=zh-cn&client=tw-ob&q=']])
    var TTS_STATIC="ttsType"

    function PlayTool(args) {

        //参数：传递给单例的一个参数集合 
        //设置args变量为接收的参数或者为空（如果没有提供的话）
        args = args || {};
        //设置html node指针
        pointer = args.pointer || null;
        autoNextPointer = true;
        downloadNum = args.downloadNum || 2
        
        init();
        this.click = function() {
            if (audioList[playAudioPointer].paused) {
                pointerClear()
                audioList[playAudioPointer].play();
                pointerSet()
            } else {
                audioList[playAudioPointer].pause();
            }

        }
    }

    function init() {
        initTextList();
        initAudioList();
        initSrc();
    }

    function pointerClear() {
        pNodes = document.getElementsByTagName("p");
        for (var i = 0; i < pNodes.length; i++) {
            pNodes[i].innerHTML = pNodes[i].innerText;
        }
        /* if (spanNode != null) {
            pointer.innerHTML = pointer.innerHTML.replace(spanNode.outerHTML, textList[audioList[playAudioPointer].name]);
        }*/

    }

    function pointerSet() {
        tmpText = textList[audioList[playAudioPointer].name];
        pointer.innerHTML = pointer.innerText.replace(tmpText, '<span id="readText" style="background :#EEE8AA">' + tmpText + '</span>');
        spanNode = document.getElementById('readText');
        scrollTo(0, spanNode.offsetTop - 20);

    }

    function loadSrc(audio, textPointer) {
        recentLoadAudio = loadPointer === -1 ? -1 : ((loadPointer - 1) < 0 ? (downloadNum - 1) : (loadPointer - 1));
        if (loadPointer === -1) {
            loadPointer = 0;
        }
        this.textPointer = (textPointer === undefined ? false : textPointer) || (recentLoadAudio === -1 ? 0 : (audioList[recentLoadAudio].name + 1))
        this.textPointer = this.textPointer < textList.length ? this.textPointer : -1;
        if (this.textPointer == -1) {
            audio.name = -1;
            return true

        } else {
            var reg = /[\u3000|\uC2A7|\u223D|\uFE3B|\uFE3C|\uFE3D|\uFE3E|\u3012|\u2191|\u2193|\u2609|\u2299|\u25CF|\u3007|\u25CE|\uC2A4|\u2605|\u2606|\u25A0|\u2593|\u300C|\u300D|\u300E|\u300F|\u25C6|\u25C7|\u25B2|\u25B3|\u25BC|\u25BD|\u25E3|\u25E5|\u25E2|\u25E4| \u2116|\u2192|\u2190|\u2198|\u2199|\u03A8|\u203B|\u32A3|\u2211|\u2312|\u2229|\u3010|\u3011|\u3016|\u3017|\uFF20|\u03BE|\u03B6|\u03C9|\u25A1|\u222E|\u3013|\u300B|\u220F|\u5350|\u221A|\u2573|\u3005|\u2640|\u2642|\u221E|\u2460|\u3128|\u2261|\u256C|\u256D|\u256E|\u2570|\u256F|\u2571|\u2572|\u2582|\u2583|\u2584|\u2585|\u2586|\u2587|\u2588|\u2581|\u25CB|\u2295|\u0398|\u56DE|\u255D|\u255A|\u2554|\u2557|\u2550|\u2553|\u2569|\u2520|\u2528|\u252F|\u2537|\u250F|\u2513|\u2517|\u251B|\u2533|\u22A5|\u250C|\u22BF|\u250D|\u250E|\u2510|\u2511|\u2512|\u2014|\u2504|\u2508|\u251C|\u251D|\u251E|\u251F|\u2521|\u2522|\u2523||\u2506|\u250A|\u252C|\u252D|\u252E|\u2530|\u2531|\u2532|\u253C|\u253D|\u253E|\u253F|\u2540|\u2542|\u2541|\u2543|<br\/>|\n|\r]/g;
            audio.name = this.textPointer;
            text = textList[this.textPointer].replace(reg, "");
            ttsType=window.localStorage.getItem(TTS_STATIC)==null?"baidu":window.localStorage.getItem(TTS_STATIC)
            audio.rel="noreferrer"
            audio.src = ttsMap.get(ttsType) + (ttsType=="baidu"?encodeURI(encodeURI(text)):encodeURI(text));
            console.log(text+":"+audio.src);
            audio.loop = false;
            try {
                audio.load();
                loadPointer = (loadPointer + 1) < downloadNum ? (loadPointer + 1) : 0;
            } catch (e) {
                console.log(e.name + " :  " + e.message);
                if (this.textPointer - (recentLoadAudio === -1 ? 0 : audioList[recentLoadAudio].name) > 5) {
                    console.log(e.name + " :  " + e.message);
                } else {
                    loadSrc(audio, this.textPointer + 1)
                }
            }
            return false
        }
    }

    function initSrc() {
        loadPointer = -1
        for (var j = 0; j < audioList.length; j++) {
            var flag =loadSrc(audioList[j]);
            if (flag) break;
        }
        playAudioPointer = 0
    }

    function initAudioList() {
        if (downloadNum >= audioList.length) {
            for (var i = audioList.length; i < downloadNum; i++) {
                audioList[i] = document.createElement("audio");
                audioList[i].name = -1
                audioList[i].loop=false
                audioList[i].onended=function(){
                    playNextAudio();
                }
                audioList[i].onerror=function(){
                    playNextAudio();
                }
                
                //setInterval(console.log(audioList[i].ended),1000)
                
            }
        }
        loadPointer = 0;
    }

    function playNextAudio() {
        pointerClear();
        nextAudioPointer = (playAudioPointer + 1) < downloadNum ? (playAudioPointer + 1) : 0;
        if (audioList[nextAudioPointer].name != "-1") {
            pointerClear();
            playAudioPointer = nextAudioPointer
            audioList[nextAudioPointer].play();
            pointerSet();
            setTimeout(function(){
                loadSrc(audioList[loadPointer]);
            },1100)
            

        } else {
            nextPointer = pointer.nextSibling
            if (nextPointer != null) {
                _static.getInstance({
                    pointer: pointer.nextSibling
                }).click();
            }
        }
    }

    function initTextList() {
        textList = [];
        var allText = pointer.innerText;
        var reg = /([\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5|.|,|!|?])/g;
        allText = allText.replace(reg, "$1^");
        var textArr = allText.split("^");
        var flag = false;
        var tmpString = "";
        var defaultSize = 90;
        for (var i = 0; i < textArr.length; i++) {
            textlen = textArr[i].length;
            tmplen = tmpString.length;
            if (textlen < defaultSize) {
                if (tmplen + textlen > defaultSize) {
                    if (tmpString.length > 0) {
                        textList.push(tmpString);
                        tmpString = textArr[i];
                    }
                } else {
                    tmpString += textArr[i];
                }
            } else {
                tmpString += textArr[i]
                tinysize = Math.ceil(tmpString / defaultSize)
                for (var j = 0; j < tinysize; j++) {
                    if (tinysize - 1 == j) {
                        tmpString = textArr[i].substr(j, tmpString % defaultSize)
                    } else {
                        textList.push(tmpString.substr(j, defaultSize));
                    }
                }
            }
        }
        if (tmpString.length > 0) textList.push(tmpString);
    }
    //实例容器
    var instance;

    var _static = {
        name: 'PlayTool',

        //获取实例的方法
        //PlayTool
        getInstance: function(args) {
            if (window.localStorage) {
                window.localStorage.setItem(window.location.href, args.pointer.id)
            }
            if (instance === undefined) {
                instance = new PlayTool(args);
            } else {
                if (args.pointer !== pointer) {
                    pointerClear();
                    audioList[playAudioPointer].pause();
                    instance = new PlayTool(args);

                }
            }

            return instance;
        }
    };
    return _static;
})();
function getCancelFlag(){
    if(window.localStorage.getItem('cancelFlag') ==='true'){
        return true
    }else{
        return false
    }
}
function getCancelFlagName(){
    if(getCancelFlag()){
        return "播放"
    }else{
        return "复制"
    }
}

function getColor(nextFlag){
    themes={
        "c1":"background-color: rgb(248, 248, 250); color: rgb(51, 51, 51);",
        "c2":"background-color: rgba(244, 236, 216, 0.56); color: rgb(91, 70, 54);",
        "c3":"background-color: rgba(206, 234, 186, 0.6); color: rgb(51, 51, 51);",
        "c4":"background-color: rgba(64, 68, 71, 0.73); color: rgb(157, 159, 163);",
        "c5":"background-color: rgba(51, 51, 51, 0.6); color: rgb(181, 172, 162);"
    }
    //获取主题颜色
    themeName=window.localStorage.getItem('themeName')
    themeColor="";
    if(themeName && themes[themeName]){
        if(nextFlag){
            nextNum=themeName.substr(1)*1+1
            themeName="c"+(nextNum>5?"1":nextNum)
        }
        themeColor=themes[themeName]
    }else{
        themeName="c1"
        themeColor=themes[themeName]
    }
    window.localStorage.setItem('themeName',themeName)
    return themeColor
    
}
function loadColor(color){
    document.getElementById('content').style.cssText=color
    htmlNode=document.getElementsByTagName('html')[0]
    htmlNode.style.backgroundColor=document.getElementById('content').style.backgroundColor
    htmlNode.style.color=document.getElementById('content').style.color
}

function changeColor(){
    themeColor=getColor(true)
    console.log(themeColor)
    loadColor(themeColor)
}
function getThemeName(){
    loadColor(getColor(false))
    return "主题"
}

function changeCancelFlag(){
    window.localStorage.setItem('cancelFlag', !getCancelFlag())
    document.getElementById('moshi').innerHTML=getCancelFlagName()
}

function getTTSTypeName(){
    if(window.localStorage.getItem('ttsType')=="google"){
        return "谷歌"
    }else{
        return "百度"
    }
}

function setTTSType(){
    ttsType=window.localStorage.getItem('ttsType')
    window.localStorage.setItem('ttsType',ttsType=="baidu"?"google":"baidu");
    document.getElementById('ttsType').innerHTML=getTTSTypeName()
}

function copyToClipBoard(content){
    var input = document.getElementById("url");
    var url = input.value;
    content=(content.replace(/[\n\r]/g,'') || "" )+"\r\n"+ url;
    input.value = content // 修改文本框的内容
    input.select(); // 选中文本
    document.execCommand("copy"); // 执行浏览器复制命令
    input.value =url;
    alert(content+"\r\n已复制，请粘贴到 微信/QQ 分享给朋友");
    
}


window.onload = function() {
    ArcMenu({
        mainMenuId: "menu",
        position: "right,bottom"//"left,top"
    })
    var metaArr = ['width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0|viewport', 'yes|apple-mobile-web-app-capable', 'black|apple-mobile-web-app-status-bar-style', 'telephone=no|format-detection'];
    for (var i = 0; i < metaArr.length; i++) {
        var oMeta = document.createElement('meta');
        var meta = metaArr[i].split('|');
        oMeta.content = meta[0]
        oMeta.name = meta[1]
        document.getElementsByTagName('head')[0].appendChild(oMeta);
    }

    //去除开头结尾的标记

    var pArr = document.getElementsByTagName("p");
    var start;
    var end;
    for (var j = 0; j <= pArr.length - 1; j++) {
        if (pArr[j].innerText.indexOf("xys.org") >= 0) {
            if (typeof(start) == "undefined" && typeof(end) == "undefined") {
                start = pArr[j];
                if (pArr.length === 1) end = pArr[j];
            } else {
                end = pArr[j];
                break;
            }
        }
    }
    if (typeof(start) != "undefined" && typeof(end) != "undefined") {
        var startstr = start.innerText.replace(/\s+/g, "");
        var endstr = end.innerText.replace(/\s+/g, "");
        var len = startstr.length;
        for (var x = (len / 2 >= 70 ? 70 : len); x >= 8; x--) {
            var rabstart = startstr.substr(0, x);
            var rabend = endstr.substr(endstr.length - x, endstr.length);
            if (rabstart == rabend) {
                start.innerText = start.innerText.replace(rabstart, '');
                end.innerText = end.innerText.replace(rabstart, '');
                if (start.innerText.trim() === "") start.parentNode.removeChild(start);
                if (end.innerText.trim() === "") end.parentNode.removeChild(end);
                break;
            }
        }
    }

    var touchable = 'createTouch' in document;
    var startX, startY, moveEndX, moveEndY, X, Y;
    startPoint=null;
    var mybody = document.getElementsByTagName('body')[0];
    var h = document.documentElement.clientHeight;

    /*mybody.addEventListener('touchend', function(e) {
        e.preventDefault();
        moveEndX = e.changedTouches[0].pageX;
        moveEndY = e.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;



        if (Math.abs(X) > Math.abs(Y) && X > 50) {
            //alert("向右");
        } else if (Math.abs(X) > Math.abs(Y) && X < -3) {
            //alert("向左");
            PlayTool.getInstance({
                    pointer: startPoint
                }).click();
        } else if (Math.abs(Y) > Math.abs(X) && Y > 0) {

            //alert("向下");

        } else if (Math.abs(Y) > Math.abs(X) && Y < 0) {

            //alert("向上");

        } else {
            //alert("没滑动");

        }
        startPoint=null;
    });*/
    
    for (var j = 0; j <= pArr.length - 1; j++) {
        pArr[j].id = j
        /*if (touchable) {
            pArr[j].addEventListener('touchstart', function(e) {
                if (startPoint == null) {
                    startX = e.touches[0].pageX;
                    startY = e.touches[0].pageY;
                    startPoint=this
                }
            }, false);
        } else {
            pArr[j].addEventListener('click', function(e) {
                if(cancelFlag) return
                PlayTool.getInstance({
                    pointer: this
                }).click();
            }, false);
        }*/
        pArr[j].addEventListener('click', function(e) {
                if(!getCancelFlag()){
                    copyToClipBoard(this.innerText)
                    return
                }
                PlayTool.getInstance({
                    pointer: this
                }).click();
            }, false);
    }
    var strKey = window.location.href
    var pIndex = false;

    if (window.localStorage) {
        pIndex = window.localStorage.getItem(strKey)
    }
    if (pIndex) {
        var msg = "reading the recent location?";
        if (confirm(msg) == true) {
            scrollTo(0, pArr[pIndex].offsetTop);
        } else {
            window.localStorage.removeItem(strKey)
        }
    }
}
