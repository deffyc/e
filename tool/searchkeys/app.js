$(function() {
    //var keys; //= new Array("a712/1", "b2/1", "b223/8", "b5/1", "b82/20", "b821/26", "b821/55", "b825/3", "b831/7", "b844/3", "b848/26", "b848/54", "b848/91", "b946/5", "c35/1", "c62/11", "c62/52", "c912/11", "c913/11", "c934/4", "c96/2", "d235/4", "d59/1", "d816/1", "e/95", "e892/33", "f0/1", "f279/2", "f729/1", "g/1", "g191/8", "g40/20", "g421/1", "g479/8", "g623/2", "g629/3", "g633/8", "g634/60", "g634/93", "g635/3", "g78/16", "g811/7", "", "", "h0/1", "h033/1", "h136/8", "h194/9", "h216/1", "h315/1", "h319/41", "h319/71", "h319/113", "", "", "i01/1", "i106/28", "i109/16", "i11/14", "i11/121", "i14/29", "i16/39", "i206/8", "i206.2/90", "i207/19", "i207.2/27", "i210.1/1", "i211/12", "i211/59", "i214.8/24", "i217.1/13", "i222.7/9", "i227/2", "i242/2", "i242/4/133", "i242.4/18", "i242.4/90", "i242.4/108", "i246/1", "i247/7", "i247.5/17", "i247.5/84", "i247.5/113", "i247.5/144", "i247.5/191", "i247.8/19", "i247.8/42", "i247.8/62", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "i25/1", "i25/29", "i25/58", "i26/7", "i266/19", "i266/54", "i267/37", "i267/71", "i267/107", "i267.1/4", "i267.3/1", "i287.4/3", "i287.5/51", "i313.4/6", "i512.2/4", "i512.4/33", "i521.3/1", "i561.3/6", "i564.8/1", "i711.8/1", "i712.4/33", "", "", "", "", "j/1", "j2/3", "j292/6", "j613/2", "j657/3", "", "", "k0/1", "k109/9", "k109/64", "k20/5", "k204/15", "k204/44", "k207/1", "k209/47", "k209/106", "k231/2", "k247/10", "k265/9", "k295/1", "k811/22", "k816/5", "k820/16", "k820/65", "k825/28", "k825/64", "k825/92","k827/24", "k827/76", "k827/122", "", "", "", "", "",  "k833/1", "k837/16", "k892/12", "k92/4", "k928/26", "", "", "", "n092/1", "n49/6", "n49/47", "", "o112/1", "p/1", "p28/1", "p941/1", "q1/1", "q95/5", "", "r153/1", "r54/1", "s/1", "tl/1", "ts97/7", "u/1", "v/1", "x/1", "x503/1", "z12/1", "z126/4", "z228/3", "z228/31", "z228/76", "z228/120", "z228/171", "z835/25", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
	$.ajax({ url: "http://e.hj2z.com/tool/basic/web/index.php?r=cat/keys",async:true, success: function(data){
        var keys=JSON.parse(data).keys;
     	
	
    var openJia = new Array();
    for (var i = 0; i < 22; i++) {
        openJia[i] = new Array();
        for (var j = 0; j < 10; j++) {
            openJia[i][j] = keys[i * 10 + j]
        }
    }
    for (var i = 5; i >= 0; i--) {
        var tempArr = [],
        hash = {};
        $("<div />", {
            id: "row" + i,
            "class": "row-fluid show-grid",
        }).appendTo("#c");
        $("<div />", {
            id: "row" + i + "-span1",
            "class": "span6",
        }).appendTo("#row" + i);
        $("<div />", {
            id: "row" + i + "-1",
            "class": "row-fluid show-grid ",
        }).appendTo("#row" + i + "-span1");
        if (i == 5) {
            $("<div />", {
                text: "     ",
                "class": "span12",
            }).appendTo("#" + "row" + i + "-1")
        } else {
            for (var j = 10 * i + 9; j >= 10 * i + 5; j--) {
                if (keys[j] != "" && !hash[keys[j].substr(0, 1)]) {
                    tempArr.push(keys[j].substr(0, 1));
                    hash[keys[j].substr(0, 1)] = true
                }
                $("<div />", {
                    id: "col" + j,
                    html: '<abbr title="'+(j <= 109 ? (Math.floor(j / 10) + 1) : (Math.floor(j / 10) - 10)) + "." + (j % 10 + 1)+'">'+keys[j]+'</abbr>',
                    "class": "span2",
                }).appendTo("#" + "row" + i + "-1")
            }
            $("<div />", {
                text: tempArr.join("、"),
                "class": "span2",
            }).appendTo("#" + "row" + i + "-1")
        }
        $("<div />", {
            id: "row" + i + "-2",
            "class": "row-fluid show-grid ",
        }).appendTo("#row" + i + "-span1");
        var tempArr = [],
        hash = {};
        if (i == 5) {
            $("<div />", {
                "class": "span12",
            }).appendTo("#" + "row" + i + "-2")
        } else {
            for (var j = 10 * i; j < 10 * i + 5; j++) {
                if (keys[j] != "" && !hash[keys[j].substr(0, 1)]) {
                    tempArr.push(keys[j].substr(0, 1));
                    hash[keys[j].substr(0, 1)] = true
                }
                $("<div />", {
                    id: "col" + j,
                    html: '<abbr title="'+(j <= 109 ? (Math.floor(j / 10) + 1) : (Math.floor(j / 10) - 10)) + "." + (j % 10 + 1)+'">'+keys[j]+'</abbr>',
                    "class": "span2",
                }).appendTo("#" + "row" + i + "-2")
            }
            $("<div />", {
                text: tempArr.join("、"),
                "class": "span2",
            }).appendTo("#" + "row" + i + "-2")
        }
        $("<div />", {
            id: "row" + i + "-span2",
            "class": "span6",
        }).appendTo("#row" + i);
        $("<div />", {
            id: "row" + i + "-3",
            "class": "row-fluid show-grid ",
        }).appendTo("#row" + i + "-span2");
        var tempArr = [],
        hash = {};
        for (var j = 49 + 10 * (i + 1); j >= 49 + 10 * (i + 1) - 4; j--) {
            if (keys[j] != "" && !hash[keys[j].substr(0, 1)]) {
                tempArr.push(keys[j].substr(0, 1));
                hash[keys[j].substr(0, 1)] = true
            }
            $("<div />", {
                id: "col" + j,
                html: '<abbr title="'+(j <= 109 ? (Math.floor(j / 10) + 1) : (Math.floor(j / 10) - 10)) + "." + (j % 10 + 1)+'">'+keys[j]+'</abbr>',
                "class": "span2",
            }).appendTo("#" + "row" + i + "-3")
        }
        $("<div />", {
            text: tempArr.join("、"),
            "class": "span2",
        }).prependTo("#" + "row" + i + "-3");
        $("<div />", {
            id: "row" + i + "-4",
            "class": "row-fluid show-grid ",
        }).appendTo("#row" + i + "-span2");
        var tempArr = [],
        hash = {};
        for (var j = 49 + 10 * (i + 1) - 9; j < 49 + 10 * (i + 1) - 4; j++) {
            if (keys[j] != "" && !hash[keys[j].substr(0, 1)]) {
                tempArr.push(keys[j].substr(0, 1));
                hash[keys[j].substr(0, 1)] = true
            }
            $("<div />", {
                id: "col" + j,
                html: '<abbr title="'+(j <= 109 ? (Math.floor(j / 10) + 1) : (Math.floor(j / 10) - 10)) + "." + (j % 10 + 1)+'">'+keys[j]+'</abbr>',
                "class": "span2",
            }).appendTo("#" + "row" + i + "-4")
        }
        $("<div />", {
            text: tempArr.join("、"),
            "class": "span2",
        }).prependTo("#" + "row" + i + "-4")
    }
    $("<div />", {
        id: "fenge",
        "class": "row-fluid show-grid",
    }).appendTo("#c");
    $("<div />", {
        text: "二楼大厅",
        "class": "span12",
    }).appendTo("#fenge");
    for (var i = 6; i < 12; i++) {
        var tempArr = [],
        hash = {};
        $("<div />", {
            id: "row" + i,
            "class": "row-fluid show-grid",
        }).appendTo("#c");
        $("<div />", {
            id: "row" + i + "-span1",
            "class": "span6",
        }).appendTo("#row" + i);
        $("<div />", {
            id: "row" + i + "-1",
            "class": "row-fluid show-grid ",
        }).appendTo("#row" + i + "-span1");
        if (i == 11) {
            $("<div />", {
                text: "     ",
                "class": "span12",
            }).appendTo("#" + "row" + i + "-1")
        } else {
            for (var j = 110 + 10 * (i) + 4; j >= 110 + 10 * (i); j--) {
                if (keys[j] != "" && !hash[keys[j].substr(0, 1)]) {
                    tempArr.push(keys[j].substr(0, 1));
                    hash[keys[j].substr(0, 1)] = true
                }
                $("<div />", {
                    id: "col" + j,
                    html: '<abbr title="'+(j <= 109 ? (Math.floor(j / 10) + 1) : (Math.floor(j / 10) - 10)) + "." + (j % 10 + 1)+'">'+keys[j]+'</abbr>',
                    "class": "span2",
                }).appendTo("#" + "row" + i + "-1")
            }
            $("<div />", {
                text: tempArr.join("、"),
                "class": "span2",
            }).appendTo("#" + "row" + i + "-1")
        }
        $("<div />", {
            id: "row" + i + "-2",
            "class": "row-fluid show-grid ",
        }).appendTo("#row" + i + "-span1");
        var tempArr = [],
        hash = {};
        if (i == 11) {
            $("<div />", {
                "class": "span12",
            }).appendTo("#" + "row" + i + "-2")
        } else {
            for (var j = 110 + 10 * (i) + 5; j < 110 + 10 * (i + 1); j++) {
                if (keys[j] != "" && !hash[keys[j].substr(0, 1)]) {
                    tempArr.push(keys[j].substr(0, 1));
                    hash[keys[j].substr(0, 1)] = true
                }
                $("<div />", {
                    id: "col" + j,
                    html: '<abbr title="'+(j <= 109 ? (Math.floor(j / 10) + 1) : (Math.floor(j / 10) - 10)) + "." + (j % 10 + 1)+'">'+keys[j]+'</abbr>',
                    "class": "span2",
                }).appendTo("#" + "row" + i + "-2")
            }
            $("<div />", {
                text: tempArr.join("、"),
                "class": "span2",
            }).appendTo("#" + "row" + i + "-2")
        }
        $("<div />", {
            id: "row" + i + "-span2",
            "class": "span6",
        }).appendTo("#row" + i);
        $("<div />", {
            id: "row" + i + "-3",
            "class": "row-fluid show-grid ",
        }).appendTo("#row" + i + "-span2");
        var tempArr = [],
        hash = {};
        for (var j = 50 + 10 * i + 4; j >= 50 + 10 * i; j--) {
            if (keys[j] != "" && !hash[keys[j].substr(0, 1)]) {
                tempArr.push(keys[j].substr(0, 1));
                hash[keys[j].substr(0, 1)] = true
            }
            $("<div />", {
                id: "col" + j,
                html: '<abbr title="'+(j <= 109 ? (Math.floor(j / 10) + 1) : (Math.floor(j / 10) - 10)) + "." + (j % 10 + 1)+'">'+keys[j]+'</abbr>',
                "class": "span2",
            }).appendTo("#" + "row" + i + "-3")
        }
        $("<div />", {
            text: tempArr.join("、"),
            "class": "span2",
        }).prependTo("#" + "row" + i + "-3");
        $("<div />", {
            id: "row" + i + "-4",
            "class": "row-fluid show-grid ",
        }).appendTo("#row" + i + "-span2");
        var tempArr = [],
        hash = {};
        for (var j = 50 + 10 * i + 5; j < 50 + 10 * (i + 1); j++) {
            if (keys[j] != "" && !hash[keys[j].substr(0, 1)]) {
                tempArr.push(keys[j].substr(0, 1));
                hash[keys[j].substr(0, 1)] = true
            }
            $("<div />", {
                id: "col" + j,
                html: '<abbr title="'+(j <= 109 ? (Math.floor(j / 10) + 1) : (Math.floor(j / 10) - 10)) + "." + (j % 10 + 1)+'">'+keys[j]+'</abbr>',
                "class": "span2",
            }).appendTo("#" + "row" + i + "-4")
        }
        $("<div />", {
            text: tempArr.join("、"),
            "class": "span2",
        }).prependTo("#" + "row" + i + "-4")
    }
    
    var lastKey="";
    var deleteFlag=true;
    $("#keyTxt").keyup(function(e) {
    	var code = e.keyCode ? e.keyCode: e.which;
    	if (code == 27 || code == 96) {
        	deleteFlag=true;
			clearTip();
			$("#keyTxt").val("");
			return;
       	}else if(code == 13){
       		deleteFlag=false;
       	}else if(code==8){
       		return;
       		
       	}else{
       		//其他特殊功能暂不定义
       	}
       	
        var key=$("#keyTxt").val().trim().replace("，","");
        if(key.indexOf("删除")>=0){
        	key=key.substring(key.indexOf("删除")+2);
        	$("#keyTxt").val(key);
        }
        var start=key.substr(0,1);
        if (start=='/') key="G"+key.substring(1);
        if (key.indexOf("why")>=0) key="Y"+key.substring(key.indexOf("why")+3);
        if (key.indexOf("，")+2) key=key.replace("，","");
        var myReg = /^[\u4e00-\u9fa5]+$/;
        if(myReg.test(start)){
        	b=[];
        	b[0]={"yy":"G","py":'J'};
        	b[1]={"yy":"I","py":"Ai"};
			b[2]={"yy":"K","py":"K"};
			b[3]={"yy":"R","py":"A"};
			b[4]={"yy":"N","py":"En"};
			b[5]={"yy":"E","py":"Yi"};
			b[6]={"yy":"A","py":"Ei"};
			b[7]={"yy":"B","py":"B"};
			b[8]={"yy":"C","py":"C"};
			b[9]={"yy":"D","py":"D"};
			b[10]={"yy":"J","py":"Zhe"};
			b[11]={"yy":"O","py":"Ou"};
			b[12]={"yy":"P","py":"P"};
        	b[13]={"yy":"U","py":"Yo"};
        	b[14]={"yy":"E","py":"1"};
        	b[15]={"yy":"J","py":"Zh"};
        	b[16]={"yy":"Z","py":"R"};
        	b[17]={"yy":"Z","py":"Z"};
        	b[18]={"yy":"I","py":"Er"};
        	b[19]={"yy":"I","py":"2"};
        	b[20]={"yy":"F","py":"F"};
        	for(var i=0;i<b.length;i++){
        		var reg=new RegExp("^"+b[i].py)
        		if(reg.test($(this).toPinyin())){
        			if((b[i].py=="Zhe" || b[i].py=="Zh") && key.substr(1,1)=="1") key=key.substring(0,1)+key.substring(2);
        			zimu=b[i].yy;
        			key=key.replace(start,zimu);
        			break;
        		}
        	}
        }else{
        	//首字符为1,对应E
        	if(start=='1') key="E"+key.substring(1);
        }
        
        	a=[];
        	a[0]={"yy":"/","py":"-"};
	        a[1]={"yy":".","py":"D"};
			a[2]={"yy":"/","py":"G"};
			a[3]={"yy":"1","py":"Y"};
			a[4]={"yy":"2","py":"Er"};
			a[5]={"yy":"3","py":"Sa"};
			a[6]={"yy":"4","py":"Si"};
			a[7]={"yy":"5","py":"W"};
			a[8]={"yy":"6","py":"Liu"};
			a[9]={"yy":"7","py":"Q"};
			a[10]={"yy":"8","py":"B"};
			a[11]={"yy":"9","py":"J"};
			a[12]={"yy":"0","py":"Lin"};
			a[13]={"yy":"/","py":"ang"};
			a[14]={"yy":"/","py":"ing"};
			for(var i=0;i<key.length;i++){
				var pinyin=$("<input value='"+key[i]+"'/>").toPinyin();
				if(myReg.test(key[i]) || key.indexOf('-')>0){
					
					for(var j=0;j<a.length;j++){
						var reg=new RegExp(a[j].py);
						if(reg.test(pinyin)){
							zimu=a[j].yy;
							key=key.replace(key[i],zimu);
							break;
						}
					}
				}
        	}
        $("#keyTxt").val(key);
        
                
        var tmp=-1;
        var reg=/^[0-9]{12}$/;
        
       	
       	if(lastKey==key){
        	return;
        }else{
        	lastKey=key;
        }
       	
		if(key.indexOf(",")!=-1 && deleteFlag){
       		clearTip();
       		deleteFlag=false;
	       	var keyArr=key.split(",");
	    	for(var i=0;i<keyArr.length;i++){
	    		tmp=searchKey(keyArr[i]);
    			showTip(tmp,deleteFlag);
	    	}
	    	deleteFlag=true;
       	}else if(reg.test(key)){
	    	var settings = {
				type: "get",
				url:"http://e.hj2z.com/tool/basic/web/index.php?r=book/view&id="+key,
				dataType:"json",
				success: function(data) {
					key=data.key;
					var tmp=searchKey(key);
					showTip(tmp,deleteFlag);
					$("#keyTxt").select();
				},
				error:function(e){
					alert("图书编号找不到或服务器无响应");
					$("#keyTxt").select();
				},
				headers: {
					"Accept":"application/json"
				}
			};
			$.ajax(settings);
    	}else{
    		if(key=="" && deleteFlag){
    			clearTip();
				return;
    		}else if(deleteFlag){
    			var tmp=searchKey(key);
    			showTip(tmp,deleteFlag);
    		}else{
    			//回车后，不响应索书号查询
    		}
    	}
        
    });

    var colorArr = {};
	var posArr=[];
    function searchKey(key) {
        key = key.trim();
      	key=key.toLowerCase();
        var tmp = 0;
        if(key.substr(0,1)>"z" || key.substr(0,1)<"a"){
        	return -1
        }
        
        if (key.indexOf("/") == -1) {
            key = key + "/"
        }
        var keyf = key.substring(0, key.indexOf("/"));
        var keyb = key.substring(key.indexOf("/") + 1);
        for (var i = 0; i <= keys.length - 1; i++) {
            if (keys[i] != "") {
                var destf = keys[i].substring(0, keys[i].indexOf("/"));
                var destb = keys[i].substring(keys[i].indexOf("/") + 1);
                if (keyf > destf || (keyf == destf && parseInt(keyb) >= parseInt(destb))) {
                    tmp = i
                } /*else {
                	if(keyf.substr(0,1)!=keys[tmp].substr(0, 1) &&keyf.substr(0,1)==keys[i].substr(0, 1)){
                		tmp=i;
                	}
                    break;
                }*/
            }
        }
        return tmp;
    }
    
    function showTip(tmp,deleteFlag){
    	if(tmp==-1){
    		return;
    	}
		var posNum=(tmp <= 109 ? (Math.floor(tmp / 10) + 1) : (Math.floor(tmp / 10) - 10)) + "." + (tmp % 10 + 1);
        var tipstr= ' <abbr title="'+keys[tmp]+'" '+(tmp <= 109 ?'style="background-color:red"':'')+'>'+posNum+'</abbr> ';
        if(deleteFlag){
        	clearTip();
        	$("#positionTip").html(tipstr)
			posArr[0]=posNum;
        }else{
        	$("#positionTip").append(tipstr)
			posArr.push(posNum);
        }
        for (var j in colorArr) {
	         $(j).css("background-color", "#c09853");
        }
        if (typeof(colorArr["#col" + tmp]) == "undefined") {
        	colorArr["#col" + tmp] = $("#col" + tmp).css("background-color")
         }
         
    	 $("#col" + tmp).css("background-color", "#98bf21");
    }
    
    function clearTip(){
    	$("#positionTip").html("")
    	for (var j in colorArr) {
	         $(j).css("background-color", colorArr[j]);
        }
        $("#positionTip").html("")
        colorArr = {};
		posArr=[];
    }
	
	function dijkstra(){
		var  MAXINT = 32767;
		var MAXNUM = posArr.length+2;
		var dist=new Array(MAXNUM);
		var prev=new Array(MAXNUM);
		var S=new Array(MAXNUM);                // 判断是否已存入该点到S集合中
		var n=MAXNUM;
		var jiafen=6,xjiafen=5;
		var A=new Array();
		for (var i=0;i<=n-2;++i){
			A[i]=new Array();
			for(var j=0;j<=n-2;++j){
				var ijia=parseInt(posArr[i].substring(0, posArr[i].indexOf(".")));
				var ixjia=parseInt(posArr[i].substring(posArr[i].indexOf(".") + 1));
				var jjia=parseInt(posArr[j].substring(0, posArr[j].indexOf(".")));
				var jxjia=parseInt(posArr[j].substring(posArr[j].indexOf(".") + 1));
				A[i][j]=0;
				
				if((ijia<=jiafen && jjia<=jiafen) || (ijia>jiafen && jjia>jiafen)){
					//两个架子在同一侧
					if((ixjia<=xjiafen && jxjia<=xjiafen) || (ixjia>xjiafen && jxjia>xjiafen)){
						//两小架朝同一面，,判断是否本身就是一面。小架间隔目测1.2，架子间隔2+0.5*2
						A[i][j]=A[i][j]+Math.abs(ijia-jjia)+Math.abs(ixjia-jxjia)+ijia==jjia?0:(3+Math.min(ixjia,jxjia)%5>3?(5-Math.min(ixjia,jxjia))%5:(Math.min(ixjia,jxjia)%5));
					}else if(ixjia>xjiafen && jxjia<=xjiafen){
						//两小架不朝同一面,小架相对,注意架子相邻的情况
						A[i][j]=A[i][j]+Math.abs(ijia-jjia)-1+Math.abs(ixjia%5-jxjia)+(Math.abs(ijia-jjia)-1)==0?0:(3+Math.min(ixjia%5,jxjia)>3?(5-Math.min(ixjia%5,jxjia)):(Math.min(ixjia%5,jxjia)));
					}else{
						//两小架不朝同一面,小架相向。注意一个架子情况
						A[i][j]=A[i][j]+Math.abs(ijia-jjia)+1+Math.abs(ixjia-jxjia)+3+Math.min(ixjia,jxjia%5)>3?(5-Math.min(ixjia,jxjia%5)):Math.min(ixjia,jxjia%5);
					}
				}else{
					//两个架子不在同一侧
				}
				
			}
		}
  　　	for(var i=1; i<=n; ++i){
      　　dist[i] = A[v0][i];
      　　S[i] = false;                                // 初始都未用过该点
      　　if(dist[i] == MAXINT)
            　　prev[i] = -1;
 　　     else 
            　　prev[i] = v0;
   　　	}
   　 	dist[v0] = 0;
		S[v0] = true; 　　
		for(var i=2; i<=n; i++)
 　　 	{
			var mindist = MAXINT;
			var u = v0; 　　                            // 找出当前未使用的点j的dist[j]最小值
			for(var j=1; j<=n; ++j)
			if((!S[j]) && dist[j]<mindist)
			{
				u = j;                             // u保存当前邻接点中距离最小的点的号码 
				mindist = dist[j];
			}
			S[u] = true; 
			for(var j=1; j<=n; j++)
			if((!S[j]) && A[u][j]<MAXINT)
			{
				if(dist[u] + A[u][j] < dist[j])     //在通过新加入的u点路径找到离v0点更短的路径  
				{
					dist[j] = dist[u] + A[u][j];    //更新dist 
					prev[j] = u;                    //记录前驱顶点 
				}
			}
		}
	}
	}});
});