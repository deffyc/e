
  (function($){
    var rotateLeft = function(lValue, iShiftBits) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    var addUnsigned = function(lX, lY) {
      var lX4, lY4, lX8, lY8, lResult;
      lX8 = (lX & 0x80000000);
      lY8 = (lY & 0x80000000);
      lX4 = (lX & 0x40000000);
      lY4 = (lY & 0x40000000);
      lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
      if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
      if (lX4 | lY4) {
        if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ lX8 ^ lY8);
      }
    }
    var F = function(x, y, z) {
      return (x & y) | ((~ x) & z);
    }
    var G = function(x, y, z) {
      return (x & z) | (y & (~ z));
    }
    var H = function(x, y, z) {
      return (x ^ y ^ z);
    }
    var I = function(x, y, z) {
      return (y ^ (x | (~ z)));
    }
    var FF = function(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };
    var GG = function(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };
    var HH = function(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };
    var II = function(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };
    var convertToWordArray = function(string) {
      var lWordCount;
      var lMessageLength = string.length;
      var lNumberOfWordsTempOne = lMessageLength + 8;
      var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
      var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
      var lWordArray = Array(lNumberOfWords - 1);
      var lBytePosition = 0;
      var lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    };
    var wordToHex = function(lValue) {
      var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValueTemp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
      }
      return WordToHexValue;
    };
    var uTF8Encode = function(string) {
      string = string.replace(/\x0d\x0a/g, "\x0a");
      var output = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          output += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          output += String.fromCharCode((c >> 6) | 192);
          output += String.fromCharCode((c & 63) | 128);
        } else {
          output += String.fromCharCode((c >> 12) | 224);
          output += String.fromCharCode(((c >> 6) & 63) | 128);
          output += String.fromCharCode((c & 63) | 128);
        }
      }
      return output;
    };
    $.extend({
      md5: function(string) {
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11=7, S12=12, S13=17, S14=22;
        var S21=5, S22=9 , S23=14, S24=20;
        var S31=4, S32=11, S33=16, S34=23;
        var S41=6, S42=10, S43=15, S44=21;
        string = uTF8Encode(string);
        x = convertToWordArray(string);
        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
          AA = a; BB = b; CC = c; DD = d;
          a = FF(a, b, c, d, x[k+0],  S11, 0xD76AA478);
          d = FF(d, a, b, c, x[k+1],  S12, 0xE8C7B756);
          c = FF(c, d, a, b, x[k+2],  S13, 0x242070DB);
          b = FF(b, c, d, a, x[k+3],  S14, 0xC1BDCEEE);
          a = FF(a, b, c, d, x[k+4],  S11, 0xF57C0FAF);
          d = FF(d, a, b, c, x[k+5],  S12, 0x4787C62A);
          c = FF(c, d, a, b, x[k+6],  S13, 0xA8304613);
          b = FF(b, c, d, a, x[k+7],  S14, 0xFD469501);
          a = FF(a, b, c, d, x[k+8],  S11, 0x698098D8);
          d = FF(d, a, b, c, x[k+9],  S12, 0x8B44F7AF);
          c = FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1);
          b = FF(b, c, d, a, x[k+11], S14, 0x895CD7BE);
          a = FF(a, b, c, d, x[k+12], S11, 0x6B901122);
          d = FF(d, a, b, c, x[k+13], S12, 0xFD987193);
          c = FF(c, d, a, b, x[k+14], S13, 0xA679438E);
          b = FF(b, c, d, a, x[k+15], S14, 0x49B40821);
          a = GG(a, b, c, d, x[k+1],  S21, 0xF61E2562);
          d = GG(d, a, b, c, x[k+6],  S22, 0xC040B340);
          c = GG(c, d, a, b, x[k+11], S23, 0x265E5A51);
          b = GG(b, c, d, a, x[k+0],  S24, 0xE9B6C7AA);
          a = GG(a, b, c, d, x[k+5],  S21, 0xD62F105D);
          d = GG(d, a, b, c, x[k+10], S22, 0x2441453);
          c = GG(c, d, a, b, x[k+15], S23, 0xD8A1E681);
          b = GG(b, c, d, a, x[k+4],  S24, 0xE7D3FBC8);
          a = GG(a, b, c, d, x[k+9],  S21, 0x21E1CDE6);
          d = GG(d, a, b, c, x[k+14], S22, 0xC33707D6);
          c = GG(c, d, a, b, x[k+3],  S23, 0xF4D50D87);
          b = GG(b, c, d, a, x[k+8],  S24, 0x455A14ED);
          a = GG(a, b, c, d, x[k+13], S21, 0xA9E3E905);
          d = GG(d, a, b, c, x[k+2],  S22, 0xFCEFA3F8);
          c = GG(c, d, a, b, x[k+7],  S23, 0x676F02D9);
          b = GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
          a = HH(a, b, c, d, x[k+5],  S31, 0xFFFA3942);
          d = HH(d, a, b, c, x[k+8],  S32, 0x8771F681);
          c = HH(c, d, a, b, x[k+11], S33, 0x6D9D6122);
          b = HH(b, c, d, a, x[k+14], S34, 0xFDE5380C);
          a = HH(a, b, c, d, x[k+1],  S31, 0xA4BEEA44);
          d = HH(d, a, b, c, x[k+4],  S32, 0x4BDECFA9);
          c = HH(c, d, a, b, x[k+7],  S33, 0xF6BB4B60);
          b = HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70);
          a = HH(a, b, c, d, x[k+13], S31, 0x289B7EC6);
          d = HH(d, a, b, c, x[k+0],  S32, 0xEAA127FA);
          c = HH(c, d, a, b, x[k+3],  S33, 0xD4EF3085);
          b = HH(b, c, d, a, x[k+6],  S34, 0x4881D05);
          a = HH(a, b, c, d, x[k+9],  S31, 0xD9D4D039);
          d = HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5);
          c = HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8);
          b = HH(b, c, d, a, x[k+2],  S34, 0xC4AC5665);
          a = II(a, b, c, d, x[k+0],  S41, 0xF4292244);
          d = II(d, a, b, c, x[k+7],  S42, 0x432AFF97);
          c = II(c, d, a, b, x[k+14], S43, 0xAB9423A7);
          b = II(b, c, d, a, x[k+5],  S44, 0xFC93A039);
          a = II(a, b, c, d, x[k+12], S41, 0x655B59C3);
          d = II(d, a, b, c, x[k+3],  S42, 0x8F0CCC92);
          c = II(c, d, a, b, x[k+10], S43, 0xFFEFF47D);
          b = II(b, c, d, a, x[k+1],  S44, 0x85845DD1);
          a = II(a, b, c, d, x[k+8],  S41, 0x6FA87E4F);
          d = II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);
          c = II(c, d, a, b, x[k+6],  S43, 0xA3014314);
          b = II(b, c, d, a, x[k+13], S44, 0x4E0811A1);
          a = II(a, b, c, d, x[k+4],  S41, 0xF7537E82);
          d = II(d, a, b, c, x[k+11], S42, 0xBD3AF235);
          c = II(c, d, a, b, x[k+2],  S43, 0x2AD7D2BB);
          b = II(b, c, d, a, x[k+9],  S44, 0xEB86D391);
          a = addUnsigned(a, AA);
          b = addUnsigned(b, BB);
          c = addUnsigned(c, CC);
          d = addUnsigned(d, DD);
        }
        var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
        return tempValue.toLowerCase();
      },
      xrzGet : function (option,method,callback){
        $.xrzGet.callback = function(data,isRepeat){
          if(isRepeat){
            var token = data;
          }else{
            var token = data.data.token;
            $.xrzGet.md5[md5Data] = token;
          }
           for(var i = 0,len = option.length; i < len; i++){
            if(option[i].indexOf('u_id') != -1 && option[i].split('=')[1] == 'null' ){          
              console.log(option[i].split('=')[1])
              return false;
            }
           }
          if(method == 'get' || method == 'pass' || method == 'delete'){//jsonP
            $.ajax({
              url : api_url + features[method]+'?'+$data+'&token='+token,
              dataType : 'jsonp',
              cache : true,
              success : function(data){
                callback && callback.call(this,data)
              },
              error : function(){
                alert('jsonperror')
              }
            })
          }else if(method == 'stockPool'){
            $.ajax({
              type : 'get',
              url : api_url + features[method],
              data : $data+'&token='+token+'&xrz_token=icaikee',
              dataType : 'json',
              success:function(data){
                callback && callback.call(this,data)
              },
              error:function(){
                alert('error')
              }
            })
          }else{ //ajax
            $.ajax({
              type : 'get',
              url : api_url + features[method],
              data : $data+'&token='+token,
              dataType : 'json',
              success:function(data){
                callback && callback.call(this,data)
              },
              error:function(){
                alert('error')
              }
            })
          } 
        }
        //
        var features = {
          pass : 'api/chanlun/v1/optional/create',
          get : 'api/chanlun/v1/optional/query',
          delete : 'api/chanlun/v1/optional/delete',
          reguser : 'api/user/v1/member/reguser',
          login : 'api/user/v1/ajaxmember/login',
          userData : 'api/user/v1/ajaxmember/query',
          changePassword : 'api/user/v1/ajaxmember/updatePassword',
          editData : 'api/user/v1/ajaxmember/form',
          bayRecord : 'api/user/v1/order/ajaxmyorder',//购买信息
          systemMessage : 'api/sys/v1/sysmsg/getsysmsg',//系统信息
          stockPool : 'api/chanlun/v1/quote/bspoints',//股票池
          findMobile : 'api/user/v1/member/findMobile',//查询手机号是否注册
          sendReg : 'api/service/v1/sms/sendReg',//sms验证码
          password : 'api/service/v1/sms/sendBack',//找回密码sms
          findPw : 'api/user/v1/ajaxmember/getBackPassword'//找回密码
        };

        !$.xrzGet.nub ? $.xrzGet.nub = 1 : $.xrzGet.nub++;
        !$.xrzGet.md5 ? $.xrzGet.md5 = {} : null;//用于缓存以获取的token

        $.xrzGet['result'+$.xrzGet.nub] = $.xrzGet.result;

        var method = arguments[1];
        var $data2 = (function(option){
                    for(var i = 0,len = option.length,arr = []; i < len; i++){
                        arr.push(encodeURI(option[i]))
                    }
                    return arr;
                })(arguments[0]);
        if(method == 'sendReg'){
           $data = $data2[0];
           $data2 = $data2.concat('appId=icaikeeApp');
        }else if(method == "findMobile"){
          $.xrzGet['findMobile'] = function(data){
            callback && callback.call(this,data)
          }
          var url = api_url + features[method]+'?'+$data2[0]+'&callback=$.xrzGet.findMobile';
          $.xrzTool.jsonP(url);
          return;
        }else{
          $data = $data2 = $data2.concat('appId=icaikeeApp');
          $data = $data.sort().join('&');
        }
        $data2 = $data2.concat('secret=icaikee').sort().join('&');

        var md5Data = $.md5($data2);//md5 加密
        if($.xrzGet.md5[md5Data]){
          $.xrzGet.callback($.xrzGet.md5[md5Data],true)
        }else{
          $.xrzGet['callback'+$.xrzGet.nub] = $.xrzGet.callback;
          var url = api_url + 'api/auth/v1/auth/getToken?'+$data2+'&jstoken='+md5Data+'&callback=$.xrzGet.callback'+$.xrzGet.nub;
          $.xrzTool.jsonP(url)
        }
      },
      xrzTool:{
          jsonPcallback : function(){
            return '$.xrzTool.jsoncallback'+$.xrzTool.getTime
          },
          alert : function(){
            if(!$('.optional-alert-wrap').length){
              $('body').append('<div class="optional-alert-wrap"><div class="optional-alert" style="display: block;"><p></p><div class="optional-alert-content"></div><div class="optional-btn clear"><div class="fl">确定</div><div class="fr canclel">取消</div></div></div></div>')
            }
            var callback = $.isArray(arguments[arguments.length-1]) ? arguments[arguments.length-1] : [arguments[arguments.length-1]];

            if(arguments.length > 1) $('.optional-alert p').html(arguments[0]);
            if(arguments.length > 2) $('.optional-alert .optional-alert-content').html(arguments[1]);
            if(typeof arguments[2] !== 'string'){
              $('.optional-btn div').eq(0).html('确认');
            }else{
              $('.optional-btn div').eq(0).html(arguments[2]);
            }
            $('.optional-alert-wrap').show()
            $('.optional-btn div').each(function(i){
              if(i == 0){
                this.onclick = function(){
                  callback[0] && callback[0].call($('.optional-alert-wrap'));
                  $('.optional-alert-wrap').hide();
                }
              }else{
                this.onclick = function(){
                  callback[1] && callback[1].call($('.optional-alert-wrap'));
                  $('.optional-alert-wrap').hide();
                }
              }
            })
            return $('.optional-btn');
          },
          jsonP : function(url){
            var script = document.createElement('script');
              script.src = url;
              document.body.appendChild(script);
              document.body.removeChild(script);
          },
          getTime : function(date,isArr){// date 前后几天 isArr 数组/yyyymmddhhMM
            var now = new Date();
            if(arguments.length > 1){
              if(typeof date == 'string' && date.charAt(0) == '-'){
                now.setDate(parseInt(now.getDate()) - date.substr(1,date.length));
              }else{
                now.setDate(parseInt(now.getDate()) + parseInt(date));
              }
            }
            var year = now.getFullYear(),
                month = now.getMonth() + 1,     
                day = now.getDate(),            
                hh = now.getHours(),            
                mm = now.getMinutes(),
                ss = now.getSeconds();         

            if(month < 10) month = "0" + month;
            if(day < 10) day = "0" + day;
            if(hh < 10) hh = "0" + hh;
            if(mm < 10) mm = "0" + mm; 
            if(ss < 10) ss = "0" + ss;

            return !arguments.length ? (''+year+month+day+hh+mm+ss) : arguments[arguments.length-1] == true ? [year,month,day,hh,mm] : (''+year+month+day+hh+mm);
          },
          isLogin : function(name,isFalse,isTrue){
            var cookies = (cookie.get('u_id') &&　cookie.get('xrz_token')) ? 
                          [cookie.get('u_id'),cookie.get('xrz_token')] : false; 
            if(typeof arguments[1] == 'function'){
              if(!$.xrzTool.isLogin('u_id',true)){
                window.open('login.html')
              }else if((!cookie.get('authority')  || cookie.get('authority').split(',').indexOf(name) == -1)){
                isFalse && isFalse.call(this);
                return false;
              }else{
                isTrue && isTrue.call(this)
              }
            }else if(name == 'u_id' && arguments.length == 1){
                if(!cookie.get('u_id')){
                  $.xrzTool.alert('您还没有登录，请登录','点击确认后跳转到登录界面',function(){
                    cookie.set('back_url',window.location.href);
                    window.location.href = 'login.html';
                  })
                  return null;
                }else{
                  return cookie.get(name)
                } 
            }
            return  cookies;
          },
          pagination : function(id,options,data,callback){
            var data = data;
            if(data.length > ($.isArray(options) ? options[0] : options)){
              var self = $(id).pagination({
                    dataSource: data,
                    pageSize: $.isArray(options) ? options[0] : options,
                    pageNumber: $.isArray(options) ? options[1] : 1,
                    showGoInput: true,
                    showGoButton: true,
                    beforeGoButtonOnClick: true,
                    callback: function(data,pagination) {
                        callback && callback.call(this,data,pagination)
                    }
                })
            }else{
              callback && callback.call(this,data,pagination)
            }
            return callback
          },
          getUserData : function(callback){
            $.xrzGet(['u_id='+$.xrzTool.isLogin('u_id')],'userData',function(data){
              callback && callback.call(this,data);
            })
          }
      }
    });
  })(jQuery);