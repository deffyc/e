window.onload = function() {
var metaArr = ['width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0|viewport','yes|apple-mobile-web-app-capable','black|apple-mobile-web-app-status-bar-style','telephone=no|format-detection'];
    for(var i=0;i<metaArr.length;i++){
        var oMeta = document.createElement('meta');
        var meta=metaArr[i].split('|');
        oMeta.content = meta[0]
        oMeta.name = meta[1]
        document.getElementsByTagName('head')[0].appendChild(oMeta);
    }
    
    var url = document.location.toString();
    var arrUrl = url.split("//");
    var start = arrUrl[1].indexOf("/");
　　var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

　　if(relUrl.indexOf("?") != -1){
　　　　relUrl = relUrl.split("?")[0];
　　}
    
    currentUrl=arrUrl[0]+"//"+relUrl
    var g = document.getElementsByTagName('a');
    for(var i=0;i<g.length;i++){
        var a = g[i];
        if(a.href.toLowerCase().indexOf(currentUrl.toLowerCase())>=0){
            a.href = (a.href +a.href.indexOf("?") != -1?"&":"?")+ 'title='+a.innerText;
        }
        }
    }

    var td1=document.getElementsByTagName("td")[0];
    if(typeof(td1)!="undefined"){
        
        bodyObj=document.getElementsByTagName('body')[0];
        console.log(document.body.scrollWidth)
        if(document.body.scrollWidth < 700){
            bodyObj.removeAttribute('background');
            td1.parentNode.removeChild(td1)
        }else{
            bodyObj.background='./buttons/backgd.gif';
            //bodyObj.removeAttribute('style');
        }
       
        //td1.parentNode.removeChild(td1)
    }
    
    /*var td1=document.getElementsByTagName("td")[0];
    var brArr=td1.getElementsByTagName("br");
    for(var i=0;i<brArr.length;i++){
        brArr[i].parentNode.removeChild(brArr[i])
    }
    var aArr=td1.getElementsByTagName("a");
    var div = document.createElement('div');
    div.id="nav"
    for(var i=0;i<aArr.length;i++){
        aArr[i].innerText=aArr[i].innerText.substring(1,aArr[i].innerText.length-1);
        div.appendChild(aArr[i]);
        aArr[i].parentNode.removeChild(aArr[i])
    }
    bodyObj=document.getElementsByTagName('body')[0];
    bodyObj.removeAttribute('background');
    bodyObj.insertBefore(div,bodyObj.getElementsByTagName("table")[0]);
    //td1.parentNode.removeChild(td1)*/
    
}
