if (typeof(Worker) !== "undefined") {
 			//
 		}
		 else {
			 document.getElementById("info").innerHTML = "您的浏览器不支持html5,请用<a href='http://www.yibizi.com/'>FLASH版</a>！";      
 		}



    


	function getX(obj){
		var parObj=obj;  
		var left=obj.offsetLeft;  
	 	while(parObj=parObj.offsetParent){  
	  		left+=parObj.offsetLeft;  
		}  
 		return left;  
	}  
  
	function getY(obj){  
		var parObj=obj;  
		var top=obj.offsetTop;  
		while(parObj = parObj.offsetParent){  
	 		top+=parObj.offsetTop;  
	 	}  
	 return top;  
	}  
  
	function DisplayCoord(event){  
		var top,left,oDiv;  
		oDiv=document.getElementById("demo");  
		top=getY(oDiv);  
		left=getX(oDiv);  
		document.getElementById("mp_x").innerHTML = (event.clientX-left+document.body.scrollLeft)  -2+"px";  
		document.getElementById("mp_y").innerHTML = (event.clientY-top+document.body.scrollTop) -2+"px";  	  
	} 
 

//get canvas
var canvas = document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var img=new Image();
img.onload = function(){
ctx.drawImage(img,0,0);
};
img.src="./images/shouxie.png";

//是否支持触摸
var touchable = 'createTouch' in document;
if (touchable) {
    canvas.addEventListener('touchstart', onTouchStart, false);
    canvas.addEventListener('touchmove', onTouchMove, false);
	canvas.addEventListener('touchend', onTouchEnd, false);
}
else
{
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mousemove', onMouseMove, false);
	canvas.addEventListener('mouseup', onMouseUp, false);
}
//上一次触摸坐标
var lastX;
var lastY;

var imagedataa=new Array();
var lga=new Array();
var bihuaa=new Array();


var ctx =canvas.getContext("2d");
ctx.lineWidth=6;//画笔粗细
ctx.strokeStyle="#000000";//画笔颜色
var drawing = false;
function onMouseUp(event) {
    //ev = event || window.event; 
	//var mousePos = mousePosition(event);
	drawing =false; 
	bihua = bihua+"s";
	senddata();

}
function onMouseDown(event) {
	var imgData=ctx.getImageData(0,0,canvas.width,canvas.height);
	imagedataa.push(imgData);
        bihuaa.push(bihua);
	lga.push(lg);
    //ev = event || window.event; 
	//var mousePos = mousePosition(event);
	drawing =true; 
    lastX=event.clientX;
    lastY=event.clientY;
	var top,left,oDiv;    
    oDiv=document.getElementById("canvas");    
    top=getY(oDiv);    
    left=getX(oDiv);    
	lastX= lastX - left+document.body.scrollLeft;
	lastY = lastY -top+document.body.scrollTop;
    drawRound(lastX,lastY);

}
function onMouseMove(event) {
    //ev = event || window.event; 
	//var mousePos = mousePosition(event); 
	if(drawing)
    {
		//lastX=event.clientX;
    	//lastY=event.clientY;
    	//drawRound(lastX,lastY);
		try
    	{
     	 	//event.preventDefault();
			var top,left,oDiv;    
			oDiv=document.getElementById("canvas");    
			top=getY(oDiv);    
			left=getX(oDiv);    
     	 	drawLine(lastX,lastY,event.clientX - left+document.body.scrollLeft,event.clientY -top+document.body.scrollTop );
     	 	lastX=event.clientX;
    	  	lastY=event.clientY;
			lastX= lastX - left+document.body.scrollLeft;
			lastY = lastY -top+document.body.scrollTop;
   		 }
   		 catch(err){
   	     	alert( err.description);
   		 }
	}
}

//触摸开始事件
function onTouchStart(event) {
	 var imgData=ctx.getImageData(0,0,canvas.width,canvas.height);
	imagedataa.push(imgData);
        bihuaa.push(bihua);
	lga.push(lg);

    event.preventDefault();
    lastX=event.touches[0].clientX;
    lastY=event.touches[0].clientY;
	var top,left,oDiv;    
    oDiv=document.getElementById("canvas");    
    top=getY(oDiv);    
    left=getX(oDiv);    
	lastX= lastX - left+document.body.scrollLeft;
	lastY = lastY -top+document.body.scrollTop;
    drawRound(lastX,lastY);

}
//触摸结束
function onTouchEnd(event) {
    bihua = bihua+"s";

	senddata();
}

//触摸滑动事件
function onTouchMove(event) {
    try
    {
	  var top,left,oDiv;    
		oDiv=document.getElementById("canvas");    
		top=getY(oDiv);    
		left=getX(oDiv);
      event.preventDefault();
      drawLine(lastX,lastY,event.touches[0].clientX-left+document.body.scrollLeft,event.touches[0].clientY-top+document.body.scrollTop);
      lastX=event.touches[0].clientX;
      lastY=event.touches[0].clientY;
	    
		lastX= lastX - left+document.body.scrollLeft;
		lastY = lastY -top+document.body.scrollTop;
    }
    catch(err){
        alert( err.description);
    }

}
var lg="zh-cn";
var bihua="";
var info = document.getElementById("info");
//画圆
function drawRound(x,y)
{
    ctx.fillStyle="#000000";
    ctx.beginPath();
    ctx.arc(x,y,3,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
	bihua = bihua+Math.round(x)+"a"+Math.round(y)+"a";
	
}
//画线
function drawLine(startX,startY,endX,endY)
{
    ctx.beginPath();
    ctx.lineCap="round";
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
	bihua = bihua+Math.round(endX)+"a"+Math.round(endY)+"a";
}

function senddata()
{
 $.post("http://www.yibizi.com/html5/hd8.php?key=qq576844233", { bh: lg+bihua},
   function(data){
     document.getElementById("info").innerHTML=YBZ_DeleteTheSameChar(data); 
	 //document.getElementById("info2").innerHTML=bihua; 
   });
 
}
function YBZ_DeleteTheSameChar(str) {
   var newStr = "";
   for (var i = 0; i<20; i++) {
     if (newStr.indexOf(str.charAt(i)) == -1) {
	   pName = str.charAt(i).replace(/(')/g,'&#39');	//单引号：&#39; 双引号：&#34;进行替换
       newStr += "<input style='width:30px;' type='button' value='"+pName+"' onclick='javascript:showmsg(this.value);'/>";
     }
   }
   return newStr;  
}
function YBZ_setlang(str){
	lg = str;
	senddata();
  }
  
function showmsg(str){
	if(document.getElementById("keyword").value =="输入你要查找的关键词"){
		document.getElementById("keyword").value = "";
	}
	document.getElementById("keyword").value=document.getElementById("keyword").value+str;
	document.getElementById("keyword").focus();
	rewrite();
  }
  
function YBZ_app_search(type){
	var txt = document.getElementById("keyword").value;
	if(txt=="")
	{alert("内容为空！"); return;}
	if(lg=="zh-cn")
	window.open("http://www.yibizi.com/s/"+encodeURIComponent(txt)+".html"); 
	else if(lg=="ja-jp")
	window.open("http://www.yibizi.com/bd.html?url="+escape("http:\/\/fanyi.baidu.com/translate#auto2jp|"+txt)); 
        else if(lg=="ko-kr")
	window.open("http://www.yibizi.com/bd.html?url="+escape("http:\/\/www.hotdic.com/s/"+txt+"/")); 
} 
function rewrite(){
		bihuaa = new Array();
        lga = new Array();
        imagedataa = new Array();
		ctx.clearRect(0,0,canvas.width,canvas.height);
        bihua ="";
		ctx.drawImage(img,0,0);
		
  }
function revoke(){
	if(bihua.length>0){
		bihua =bihuaa.pop();
		lg = lga.pop();
	
        var imgData=imagedataa.pop();
        if(imgData){
        	ctx.putImageData(imgData,0,0);
                senddata();
        }
	}
	
}
