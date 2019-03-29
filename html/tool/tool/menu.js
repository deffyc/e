/********弧形菜单插件***************
 ********作者：决明子***************
 ***********************************/
var ArcMenu;
(function () {
    ArcMenu = function (options) {
        this.showStatus = false;
        this.initMenu = function () {
            var defaultPra = {
                mainMenuId: "ArcMenu",//主菜单id
                menuBoxId: "menuBox",//菜单包裹id
                position: "",//弧形菜单
                customPosition: "0,0",//自定义位置
                speed: 20,//展开速度
                radius: 100,//放射距离,
                menuRange: 100,//菜单展开范围
                childMenuClass: "Menu",
                triggerWay: "click",
                showStatus: false,
                childMenu: [//子菜单内容
                    { linkContent: getCancelFlagName(), linkUrl: "javascript:changeCancelFlag();", className: "Menu",id:"moshi"},
                    { linkContent: "网址", linkUrl: "javascript:copyToClipBoard();",className: "Menu"},
                    { linkContent: getTTSTypeName(), linkUrl: "javascript:setTTSType();", className: "Menu",id:"ttsType" }
                ]
            }
            for (var i in defaultPra) {
                if (options[i]) {
                    defaultPra[i] = options[i];
                }
            }
            var mainMenu = document.getElementById(defaultPra.mainMenuId);
            var menuBox = document.getElementById(defaultPra.menuBoxId);
            mainMenu.setAttribute("class", "topMenu")
            var childLen = defaultPra.childMenu.length;//子菜单个数
            var circular = 2 * Math.PI / 360 * (parseFloat(defaultPra.menuRange) / childLen); //分割后的弧度
            var positionStr = defaultPra.position ? defaultPra.position : "left,top";//主按钮位置
            var customPositionStr = /^\d+,\d+$/.test(defaultPra.customPosition) ? defaultPra.customPosition : "0,0";//自定义位置
            var positionVal = defaultPra.position.split(",");
            var customPositionVal = defaultPra.customPosition.split(",")
            mainMenu.style[positionVal[0]] = customPositionVal[0] + "px";
            mainMenu.style[positionVal[1]] = customPositionVal[1] + "px";
            for (var i = 0; i < childLen; i++) {
                var domA = document.createElement("a");
                var currChild = defaultPra.childMenu[i];
                domA.innerHTML = currChild.linkContent;
                domA.setAttribute("href", currChild.linkUrl);
                if(typeof(currChild.id)!="undefined") domA.id=currChild.id
                domA.className = defaultPra.mainMenuId + defaultPra.childMenuClass + " " + defaultPra.childMenuClass + " " + currChild.className;
                domA.style[positionVal[0]] = customPositionVal[0] + "px";;
                domA.style[positionVal[1]] = customPositionVal[1] + "px";
                menuBox.appendChild(domA);
            }
            addEvent(mainMenu, defaultPra.triggerWay, function () {
                var len = defaultPra.childMenu && defaultPra.childMenu.length || 0;
                var data = [];
                for (var i = 0; i < len; i++) {
                    var obj = new Object();
                    var v0 = parseFloat(mainMenu.style[positionVal[0]]);
                    var v1 = parseFloat(mainMenu.style[positionVal[1]]);
                    if (defaultPra.showStatus) {
                        obj[positionVal[1]] = v1;
                        obj[positionVal[0]] = v0;
                    } else {
                        obj[positionVal[0]] = defaultPra.radius * Math.cos(i * circular) + v0;
                        obj[positionVal[1]] = defaultPra.radius * Math.sin(i * circular) + v1;
                    }
                    data.push(obj);
                }
                currAnimate = animate(menuBox.getElementsByClassName(defaultPra.mainMenuId + defaultPra.childMenuClass), data, defaultPra.speed);
                defaultPra.showStatus = !defaultPra.showStatus;
            });
            function addEvent(obj, type, fn) {
                if (obj.addEventListener)
                    obj.addEventListener(type, fn, false);
                else if (obj.attachEvent) {
                    obj["e" + type + fn] = fn;
                    obj.attachEvent("on" + type, function () {
                        obj["e" + type + fn]();
                    });
                }
            };
            function animate(domObj, animateObj, speed) {
                var lenAni = animateObj && animateObj.length || 0;
                var i = 0;
                var trimer = 0
                var aniArr = [];
                this.animateCollect = [];
                this.stop = function () {
                    for (var j = 0; j < this.animateCollect.length; j++) {
                        this.animateCollect[j].stop();
                    }
                }
                this.start = function () {
                    this.animateCollect = func();
                }
                var func = function () {
                    aniArr[i] = new Object();
                    aniArr[i].isAnimate = false;
                    aniArr[i].trimer = 0;
                    aniArr[i].interval = setInterval(function () {
                        if (i == lenAni) {
                            return aniArr;
                        }
                        aniArr[i].isAnimate = true;
                        for (var k in animateObj[i]) {
                            if (aniArr[i].trimer == 0) {
                                domObj[i][k] = parseFloat(domObj[i].style[k])
                            }
                            domObj[i].style.display = "block";
                            domObj[i].style[k] = (parseFloat(domObj[i].style[k]) + ((parseFloat(animateObj[i][k]) - domObj[i][k]) / ((parseFloat(speed) / 1)))) + "px";
                        }
                        aniArr[i].trimer += 1;
                        if (aniArr[i].trimer >= speed) {
                            clearInterval(aniArr[i].interval);
                            aniArr[i].isAnimate = false;
                            aniArr[i].trimer = 0;
                            i++;
                            func();
                        }
                    }, 1);
                    aniArr[i].stop = function () {
                        clearInterval(aniArr[i].interval);
                        aniArr[i].isAnimate = false;
                        aniArr[i].trimer = 0;
                    }
                };
                this.start();
            }
        }
        this.initMenu();
    }
}())