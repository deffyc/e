QQShuru = {};
QQShuru.Util = {};
QQShuru.Util.Browser = {};
QQShuru.Util.Browser.isIE = (navigator.appName == "Microsoft Internet Explorer");
QQShuru.Util.Browser.touchable = 'createTouch' in document;
QQShuru.Util.Browser.getX=function(obj){
		var parObj=obj;  
		var left=obj.offsetLeft;  
	 	while(parObj=parObj.offsetParent){  
	  		left+=parObj.offsetLeft;  
		}  
 		return left;  
	};
  
QQShuru.Util.Browser.getY=function(obj){  
		var parObj=obj;  
		var top=obj.offsetTop;  
		while(parObj = parObj.offsetParent){  
	 		top+=parObj.offsetTop;  
	 	}  
	 return top;  
};
QQShuru.Util.Loader = {
    CURRENT_PATH: "handwritingapi.js",
    getCurrentLocation: function() {
        var e = "";
        var g = this.CURRENT_PATH;
        var a = document.getElementsByTagName("script");
        var f = a.length;
        for (var c = 0; c < f; ++c) {
            var h = a[c].getAttribute("src");
            if (h) {
                var b = h.lastIndexOf(g);
                var d = h.lastIndexOf("?");
                if (d < 0) {
                    d = h.length
                }
                if ((b > -1) && (b + g.length == d)) {
                    e = h.slice(0, d - g.length);
                    b = null;
                    d = null;
                    h = null;
                    break
                }
                b = null;
                d = null
            }
            h = null
        }
        g = null;
        a = null;
        f = null;
        return e
    }
};
QQShuru.Util.Loader.include = function(a) {
    var k = QQShuru.Util.Loader.getCurrentLocation();
    var b = a.length;
    var f = document.getElementsByTagName("head").length ? document.getElementsByTagName("head")[0] : document.body;
    var e = function(h) {
        var c = h.lastIndexOf(".");
        var i = h.substring(c + 1);
        return i
    };
    for (var d = 0; d < b; d++) {
        var j = e(a[d]);
        switch (j) {
        case "js":
            var l = document.createElement("script");
            l.setAttribute("charset", "utf-8");
            l.src = k + a[d];
            f.appendChild(l);
            break;
        case "css":
            var g = document.createElement("link");
            g.setAttribute("rel", "stylesheet");
            g.setAttribute("type", "text/css");
            g.setAttribute("href", k + a[d]);
            f.appendChild(g);
            break;
        default:
        }
    }
};
QQShuru.Util.Ajax = {};
QQShuru.Util.Ajax.get = function(a, c) {
    var b = document.createElement("script");
    b.setAttribute("charset", "utf-8");
    b.id = Math.random();
    document.getElementsByTagName("head")[0].appendChild(b);
    b.src = a + "&c=" + c;
    if (QQShuru.Util.Browser.isIE) {
        b.onreadystatechange = function() {
            if (b.readyState == "loaded") {
                document.getElementsByTagName("head")[0].removeChild(b)
            }
        }
    } else {
        b.onload = function() {
            document.getElementsByTagName("head")[0].removeChild(b)
        }
    }
};
QQShuru.Util.Event = {};
QQShuru.Util.Event.addEvent = function() {
    if (QQShuru.Util.Browser.isIE) {
        return function(b, c, a) {
            b.attachEvent("on" + c, a)
        }
    } else {
        return function(b, c, a, d) {
            b.addEventListener(c, a, d || false)
        }
    }
} ();
QQShuru.Util.Event.remEvent = function() {
    if (QQShuru.Util.Browser.isIE) {
        return function(b, c, a) {
            b.detachEvent("on" + c, a)
        }
    } else {
        return function(b, c, a, d) {
            b.removeEventListener(c, a, d || false)
        }
    }
} ();
QQShuru.Util.Event.getPoint = function(a) {
	var lastX,lastY;
	if(QQShuru.Util.Browser.touchable){
		lastX=a.touches[0].clientX;
		lastY=a.touches[0].clientY;
	}else{
		lastX=a.clientX;
		lastY=a.clientY;
	}
	
	var top,left,oDiv;    
	oDiv=document.getElementById("qqshuru_canvas");    
	top=QQShuru.Util.Browser.getY(oDiv);    
	left=QQShuru.Util.Browser.getX(oDiv);    
	lastX= lastX - left+document.body.scrollLeft;
	lastY = lastY -top+document.body.scrollTop;
	//return [a.x, a.y]
    return [Math.round(lastX), Math.round(lastY)]
    
};
QQShuru.HWPanel = function(E, G) {
    var o = QQShuru.Util.Browser.isIE;
    var m = QQShuru.Util.Event.addEvent;
    var j = QQShuru.Util.Event.remEvent;
    var B = QQShuru.Util.Event.getPoint;
    QQShuru.Util.Loader.include(["handwritingapi.css"]);
    o && document.createElement("canvas");
    var S = ['<div id="qqshuru_container">', '<div id="qqshuru_header">', '<span id="qqshuru_title">云手写输入法</span>', "</div>", '<canvas id="qqshuru_canvas" width="300" height="288">', "</canvas>", '<table id="qqshuru_candidate" cellspacing="0" cellpadding="0" border="0">', '<tr class="qqshuru_base_tr"><td/><td/><td/><td/><td/><td/></tr>', '<tr class="qqshuru_three_tds">', '<td colspan="2"></td><td colspan="2"></td><td colspan="2" class="qqshuru_last_td"></td>', "</tr>", '<tr class="qqshuru_three_tds">', '<td colspan="2"></td><td colspan="2"></td><td colspan="2" class="qqshuru_last_td"></td>', "</tr>", '<tr class="qqshuru_three_tds">', '<td colspan="2"></td><td colspan="2"></td><td colspan="2" class="qqshuru_last_td"></td>', "</tr>", '<tr class="qqshuru_three_tds">', '<td colspan="2"></td><td colspan="2"></td><td colspan="2" class="qqshuru_last_td"></td>', "</tr>", '<tr class="qqshuru_two_tds">', '<td colspan="3"></td><td colspan="3" class="qqshuru_last_td"></td>', "</tr>", '<tr class="qqshuru_two_tds">', '<td colspan="3"></td><td colspan="3" class="qqshuru_last_td"></td>', "</tr>", '<tr class="qqshuru_two_tds">', '<td colspan="3"></td><td colspan="3" class="qqshuru_last_td"></td>', "</tr>", '<tr class="qqshuru_one_td">', '<td colspan="6"></td>', "</tr>", "</table>", '<div id="qqshuru_operate_panel">', '<span id="qqshuru_back_btn">退笔</span>', '<span id="qqshuru_clear_btn">重写</span>', "</div>", "</div>"];
    E.innerHTML = S.join("");
    var h = document;
    var H = document.body;
    var z = document.documentElement;
    var b = document.getElementById("qqshuru_candidate");
    var F = function() {
        var aa = this;
        if (o) {
            var X = window.event;
            aa = X.srcElement
        }
        var Z = aa.innerHTML;
        var Y = function(ab) {
            switch (ab) {
            case "&nbsp;":
                ab = "";
                break;
            case "&lt;":
                ab = "<";
                break;
            case "&gt;":
                ab = ">";
                break;
            case "&amp;":
                ab = "&";
                break;
            case "&quot;":
                ab = '"';
                break;
            case "&copy;":
                ab = "?";
                break;
            case "&reg;":
                ab = "?";
                break;
            default:
            }
            return ab
        };
        var W = Y(Z);
        G(W);
        V()
    };
    var M = b.rows;
    var f = [];
    var K = [];
    var O = [];
    var U = function() {
        for (var X = 1; X < 5; X++) {
            for (var W = 0; W < 3; W++) {
                f[(X - 1) * 3 + W] = M[X].cells[W];
                m(M[X].cells[W], "click", F)
            }
        }
        for (var X = 5; X < 8; X++) {
            for (var W = 0; W < 2; W++) {
                K[(X - 5) * 2 + W] = M[X].cells[W];
                m(M[X].cells[W], "click", F)
            }
        }
        O[0] = M[8].cells[0];
        m(M[8].cells[0], "click", F)
    } ();
    var i = document.getElementById("qqshuru_canvas");
    if (o) {
        var w = QQShuru.Util.Loader.getCurrentLocation();
        i.style.cursor = w + "pen.cur, pointer"
    }
    var v = o ? 1 : 0;
    var a = 2;
    var N = 300;
    var R = 287;
    var c = "#000000";
    var y = 4;
    var t = "round";
    var J = !!i.getContext;
    if (J) {
        var Q = i.getContext("2d");
        Q.lineCap = t;
        Q.lineJoin = t;
        Q.lineWidth = y;
        Q.strokeStyle = c
    } else {
        var x = "qqshuru";
        if (!document.namespaces[x]) {
            document.namespaces.add(x, "urn:schemas-microsoft-com:vml")
        }
        if (!h.styleSheets[x + "css"]) {
            var q = document.createStyleSheet();
            q.owningElement.id = x + "css";
            q.cssText = "canvas{display:inline-block;overflow:hidden;text-align:left;width:" + N + "px;height:" + R + "px;}" + x + "\\:shape," + x + "\\:stroke {behavior:url(#default#VML);}"
        }
    }
    var L = false;
    var P = false;
    var u = 0;
    var T = [];
    var r = 0;
    var e = [],
    d = [],
    I = [];
    var D = [],
    C = [];
    pointsDeltaXY = [];
    var k = [0, 0];
    var l = function(W) {
        if (v !== W.button) {
            if (a === W.button) {
                g()
            }
            return
        }
        var Y = B(W);
        if (!Y) {
            return
        }
        L = true;
        r = 0;
        e = [];
        d = [];
        I = [];
        D = [];
        C = [];
        pointsDeltaXY = [];
        e[r] = Y[0];
        d[r] = Y[1];
        I[r * 2] = Y[0];
        I[r * 2 + 1] = Y[1];
        D[r] = Y[0];
        C[r] = Y[1];
        pointsDeltaXY[r * 2] = Y[0];
        pointsDeltaXY[r * 2 + 1] = Y[1];
        if (J) {
            Q.beginPath();
            Q.moveTo(Y[0], Y[1])
        } else {
            if (o) {
                var Z = "m" + Y[0] + "," + Y[1] + " l" + Y[0] + "," + Y[1] + " e";
                if (u in T) {
                    T[u].e.path.value = Z;
                    T[u].e.style.visibility = "visible"
                } else {
                    var X = h.createElement("<" + x + ':shape style="position:absolute;left:0;top:0;width:' + N + "px;height:" + R + 'px;" coordsize="' + N + "," + R + '" filled="f" stroked="t" strokecolor="' + c + '" strokeweight="' + y + '" path="' + Z + '"/>');
                    i.appendChild(X);
                    X.appendChild(h.createElement("<" + x + ':stroke  opacity="1" miterlimit="' + y + '" joinstyle="' + t + '" endcap="' + t + '"/>'));
                    T[u] = {
                        e: X
                    }
                }
            } else {
                alert("很抱歉，您的浏览器不支持手写功能！");
                return
            }
        }
        k[0] = Y[0];
        k[1] = Y[1];
        r++;
        if (o) {
            m(i, "losecapture", n);
            i.setCapture()
        } else {
            m(window, "blur", n)
        }
    };
    var A = function(W) {
        if (!L) {
            return
        }
        var Y = B(W);
        if (!Y) {
            return
        }
        if (o && "div" !== W.srcElement.tagName && "qqshuru_canvas" !== W.srcElement.id) {
            false === P && (P = true);
            return
        }
        e[r] = Y[0];
        d[r] = Y[1];
        I[r * 2] = Y[0];
        I[r * 2 + 1] = Y[1];
        D[r] = Y[0] - k[0];
        C[r] = Y[1] - k[1];
        pointsDeltaXY[r * 2] = D[r];
        pointsDeltaXY[r * 2 + 1] = C[r];
        if (J) {
            Q.lineTo(Y[0], Y[1]);
            Q.stroke()
        } else {
            var X = T[u].e.path;
            X.value = X.value.replace(" e", "," + Y[0] + "," + Y[1] + " e")
        }
        k[0] = Y[0];
        k[1] = Y[1];
        r++
    };
    var n = function(W) {
        if (!L) {
            return
        }
        L = false;
        if (1 === r) {
            if (!J) {
                T[u].e.style.visibility = "hidden"
            }
            return
        }
        if (J) {
            Q.closePath();
            var Z = i.cloneNode(false);
            Z.style.display = "none";
            Z.getContext("2d").drawImage(i, 0, 0);
            T[u] = {
                e: Z
            };
            Z = null
        }
        var aa = T[u];
        aa.count = r;
        aa.x = e.slice(0);
        aa.y = d.slice(0);
        aa.xy = I.slice(0);
        aa.deltaX = D.slice(0);
        aa.deltaY = C.slice(0);
        aa.deltaXY = pointsDeltaXY.slice(0);
        u++;
        var X = [];
        for (var Y = 0; Y < r; Y++) {
            X[Y] = "[" + e[Y] + ", " + d[Y] + "]"
        }
        if (o) {
            j(i, "losecapture", n);
            i.releaseCapture()
        } else {
            j(window, "blur", n)
        }
        if (1 === u) {
            i.className = "writting"
        }
        s(u)
    };
    var V = function(W) {
        if (0 === u) {
            return
        }
        var ab = "";
        var aa = M.length;
        for (var Z = 0; Z < aa; Z++) {
            var X = M[Z].cells.length;
            for (var Y = 0; Y < X; Y++) {
                M[Z].cells[Y].innerHTML = ab
            }
        }
        if (J) {
            Q.clearRect(0, 0, N, R)
        }
        for (var Z = 0; Z < u; Z++) {
            T[Z].e.style.visibility = "hidden"
        }
        u = 0;
        i.className = ""
    };
    var g = function(W) {
        if (0 === u) {
            return
        }
        if (1 === u) {
            V();
            return
        }
        u--;
        if (J) {
            Q.clearRect(0, 0, N, R);
            Q.drawImage(T[u - 1].e, 0, 0)
        }
        T[u].e.style.visibility = "hidden";
        s(u)
    };
    var p = function(W, ab) {
        var aa = ab || W.length;
        var Z = "";
        var ad = "";
        for (var X = 0; X < aa; ++X) {
            var ac = W[X];
            ad = X ? ",eb,": "";
            var Y = ad + ac.deltaXY.join(",");
            Z += Y
        }
        return Z
    };
    this.ajax_callback = function(X) {
        if (X.ret === 0) {
            var ac = X.cand;
            var ab = X.asso;
            var ae = X.assos;
            var aa = "";
            var ad = 0;
            if (ac) {
                ad = ac.length
            }
            if (ad > 0) {
                ad = (ad < 16) ? ad: 16;
                for (var Y = 0; Y < ad; Y++) {
                    f[Y].innerHTML = ac[Y]
                }
            } else {
                for (var Y = 0; Y < 16; Y++) {
                    f[Y].innerHTML = aa
                }
            }
            var W = 0;
            if (ab) {
                W = ab.length
            }
            if (W > 0) {
                W = (W < 6) ? W: 6;
                for (var Y = 0; Y < W; Y++) {
                    K[Y].innerHTML = ab[Y]
                }
            } else {
                for (var Y = 0; Y < 4; Y++) {
                    K[Y].innerHTML = aa
                }
            }
            var Z = 0;
            if (ae) {
                Z = ae.length
            }
            if (Z > 0) {
                Z = (Z < 1) ? Z: 1;
                for (var Y = 0; Y < Z; Y++) {
                    O[Y].innerHTML = ae[Y]
                }
            } else {
                for (var Y = 0; Y < 1; Y++) {
                    O[Y].innerHTML = aa
                }
            }
        } else {}
    };
    QQShuru.HWPanel.ajax_callback = this.ajax_callback;
    var s = function(Y) {
        var Z = p(T, Y);
        var ab = "QQShuru.HWPanel.ajax_callback";
        var W = "http://handwriting.shuru.qq.com/cloud/cgi-bin/cloud_hw_pub.wsgi";
        var aa = "track_str=" + Z + "&cmd=0";
        var X = W + "?" + aa;
        QQShuru.Util.Ajax.get(X, ab)
    };
	
	if(QQShuru.Util.Browser.touchable){
		m(i, "touchstart", l);
		m(i, "touchmove", A);
		m(i, "touchend", n);
	}else{
		m(i, "mousedown", l);
		m(i, "mousemove", A);
		m(i, "mouseup", n);
		
	}
   
    m(i, "dblclick", V);
    QQShuru.Util.Ajax.get("http://handwriting.shuru.qq.com/cloud/cgi-bin/cloud_hw_pub.wsgi?track_str=0,0&cmd=0","");
    m(i, "contextmenu",
    function(W) {
        o ? (W.returnValue = false) : W.preventDefault()
    });
    m(h, "mouseup", n);
    m(h.getElementById("qqshuru_clear_btn"), "click", V);
    m(h.getElementById("qqshuru_back_btn"), "click", g)
};