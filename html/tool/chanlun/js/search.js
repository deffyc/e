if(typeof(window.location.href.split('prod_code=')[1])=="undefined"){
	window.location.href=window.location.href+"?stock_abbr_name=上证指数&prod_code=000001.XSHG.MRI"
}
var utils = (function(){
	var u = {};
	u.getClassArr = function(className){
		if(!className.trim()) return [];
		return className.trim().split(' ');
	};
	u.addClass = function(obj,className){
		var nowClassArr = this.getClassArr(obj.className);
		if(nowClassArr.length && nowClassArr.indexOf(className) == -1){
			obj.className = nowClassArr.push(className).join(' ');
		}else{
			obj.className = className;
		}
	};
	u.removeClass = function(obj,className){
		var nowClassArr = this.getClassArr(obj.className);
		var index = nowClassArr.indexOf(className);
		if(nowClassArr.length && index != 1){
			nowClassArr.splice(index,1);
			obj.className = nowClassArr.join(' ');
		}
	}
	u.extend = function(target,obj){
		for(attr in obj){
			target[attr] = obj[i];
		}
	}
	return u;
})()


function Search(options){
	this.options = {
		shData : undefined,
		shInput : null,
		shListsW  : null,
		sherFun : null,
		shListChooseClass : null

	};

	this.isOnFocus = false;
	this.shValue = undefined;

	for(attr in options){
		this.options[attr] = options[attr];
	}

	this.init();
}

Search.fn = Search.prototype = {
	constructor : Search,
	init : function(){
		this.shLists = this.options.shListsW.getElementsByTagName('li');
		this.initEvent();
		$(this.options.shListsW).on('click','a',function(){
			var self = this;
			window.location.href =$(self).attr('data-href');
		})
	},

	initEvent : function(){
		this.options.shInput.addEventListener('input',this,false)
		this.options.shInput.addEventListener('keydown',this,false)
		this.options.shInput.addEventListener('keyup',this,false)
		this.options.shInput.addEventListener('focus',this,false)
		this.options.shInput.addEventListener('blur',this,false)
	},

	initshLists : function(){
		this.shListsLen = this.shLists.length;
		this.shListIndex = -1;
	},

	_focus : function(){
		if(this.options.shListsW.children.length) this.options.shListsW.style.display = 'block';
		this.isOnFocus = true;
	},

	_blur : function(){
		$('#search-list').animate({
			opacity:0
		},400,function(){
			$(this).hide().css('opacity','1');
		})
		this.isOnFocus = false;
	},

	_input : function(){
		this.options.inputCallBack && this.options.inputCallBack.call(this.options.shInput);
		this._addSearchData();
	},

	_keydown : function(e){
		if(e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13){
			e.preventDefault()
		}	
	},

	_keyup : function(code){

		if(code == 13){ 
			this.options.searcherFun && this.options.searcherFun.call(this)
		}
		//if(!this.isOnFocus) return;
		if(code == 38){
			this.shListIndex > -1 && $(this.shLists[this.shListIndex]).removeClass(this.options.shListChooseClass);
			if(this.shListIndex < 0 || --this.shListIndex < 0){
				this.shListIndex = this.shListsLen - 1;
			}
			$(this.shLists[this.shListIndex]).addClass(this.options.shListChooseClass);
		} 
		if(code == 40){
			this.shListIndex > -1 && $(this.shLists[this.shListIndex]).removeClass(this.options.shListChooseClass);  
			if(this.shListIndex < 0 || ++this.shListIndex >= this.shListsLen){
				this.shListIndex = 0;
			}
			$(this.shLists[this.shListIndex]).addClass(this.options.shListChooseClass);
		}
		this.shListIndex > 0 ? this.shValue = this.shLists[this.shListIndex].innerText : this.shValue = '';
		this.options.onkeyup && this.options.onkeyup.call(this);
		return false;
	},

	_addSearchData : function(){
		if(!this.options.shData){
			this.options.shListsW.style.display = 'none';
			return;
		}else{
			this.options.shListsW.style.display = 'block';
		}
		var html = '',
			data = this.options.shData;
		for(var i = 0,len = data.length; i < len; i++){
			html +='<li>'+ data[i] +'</li>';
		}	
		html = '<ul>' + html + '</ul>';
		this.options.shListsW.innerHTML = html;
		this.initshLists()
	},

	handleEvent : function(e){
		switch(e.type){
			case 'input':
			case 'propertychange':
				this._input();
				break;

			case 'keyup':
				this._keyup(e.keyCode);
				break;

			case 'keydown':
				this._keydown(e);
				break;

			case 'focus':
				this._focus();
				break;

			case 'blur':
				this._blur();
				break;
	
		}
	}
	
}

$(function(){

	var main = document.body.children[1],
		footer = document.getElementsByClassName('footer')[0];	
	var h = footer.getBoundingClientRect().top + footer.offsetHeight - document.documentElement.clientHeight;

	if(h < 0){
		main.style.minHeight = main.clientHeight-h+'px'
	}

	window.search = function(data){
		var datas = data.data.stocks;
		oSearch.options.shData = [];
		if(datas){
			for(var i = 0,len = datas.length; i < len; i++){
				oSearch.options.shData.push('<a href="javascript:;" data-href="index.html?stock_abbr_name='+ datas[i].stock_abbr_name.trim() +'&prod_code='+ datas[i].prod_code+'">'+ datas[i].prod_code +'<span>'+ datas[i].stock_abbr_name +'</span></a>')
			}

		}
		oSearch._addSearchData()
	}
	var oSearch = new Search({
		shInput : document.getElementById('search-input'),
		shListsW : document.getElementById('search-list'),
		shData : [],
		shListChooseClass : 'choose',
		inputCallBack : function(){
			if(/^[\u4e00-\u9fa5]+$/i.test(this.value)){
				$.xrzTool.jsonP(api_url + 'api/chanlun/v1/quote/fuzzyquery?query_str='+this.value+'&callback=search')
			}else if(this.value.length >= 3){
				$.xrzTool.jsonP(api_url + 'api/chanlun/v1/quote/fuzzyquery?query_str='+this.value+'&callback=search')
			}else if(/^[a-zA-Z]+$/.test(this.value)){
				$.xrzTool.jsonP(api_url + 'api/chanlun/v1/quote/fuzzyquery?query_str='+this.value+'&callback=search')
			}else{
				oSearch.options.shData = []
			}
		},
		searcherFun : function(){
			var self = this;
			if(this.shListIndex >= 0 && this.shListIndex < this.shListsLen){
				window.location.href=$(self.shLists[self.shListIndex].children[0]).attr('data-href');
			}
		}
	})
	}
)
if($.xrzTool.isLogin('u_id',true)){
	var html = '<a href="personal.html" data-navId="1"><img src="images/head2016.png" class="radius100"><a/>'+
				'<div class="logining-nav-wrap">'+
					'<div class="logining-nav">'+
						'<div class="triangle"></div>'+
						'<a href="personal.html" data-navId="1">修改密码</a>'+
						'<a href="javascript:;" data-href="personal.html" data-navId="2">我的自选</a>'+
						'<a href="personal.html" data-navId="3">购买记录</a>'+
						'<a href="javascript:;" id="dropOut">退出</a>'+
					'</div>'+
				'</div>'
	$('.logining').html(html).show();
	$('#dropOut').click(function(){
		cookie.remove(['u_id','xrz_token','authority','navId']);
		if(window.location.href.indexOf('login.html') == -1 && window.location.href.indexOf('register.html') == -1){
			cookie.set('back_url',window.location.href)
		}
		window.location.href = "login.html";
	})
	$('a[data-navId]').click(function(){
		var self = this;
		if($(this).attr('data-navId') == 2){
			cookie.set('navId',$(self).attr('data-navId'))
				window.location.href = $(self).attr('data-href');
			return false;
		}
		cookie.set('navId',$(this).attr('data-navId'))
	})
}else{
	$('.logining').hide();
	$('.login-register').show();
}
$('.login-register').html('<a href="javascript:;" class="login-a">登录</a> / <a href="register.html" class="register-a">注册</a>')
$('.login-register a').eq(0).click(function(){
	if(window.location.href.indexOf('login.html') == -1 && window.location.href.indexOf('register.html') == -1){
		cookie.set('back_url',window.location.href)
	}
	window.location.href = "login.html";
})

$('.head-nav a[data-href]').click(function(){
	var self = this;
	if($(this).attr('data-href').indexOf('optional-stock') != -1){//自选
		window.location.href = $(self).attr('data-href');
		
	}else if($(this).attr('data-href').indexOf('stock-pool') != -1){
		window.location.href = $(self).attr('data-href');
	}
})
