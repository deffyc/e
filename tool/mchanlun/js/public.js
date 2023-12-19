$.extend($,{
	detectionMember:function(options){
		var $obj = $('.prompt-buymember');
			if($obj.length){
				$('.prompt-buymember h3').html(options[0]);
				$('.prompt-buymember p').html(options[1]);
				$obj.show();
				$('.mask').addClass('mask-zIndex1').show();
			}else{
				var html = '<div class="prompt-buymember">\
								<div class="close bs"><img src="images/x.png" alt="" /></div>\
								<img class="pic" src="images/buy-bg.png" >\
								<h3>'+ options[0] +'</h2>\
								<p>'+ options[1] +'</p>\
								<a href="javascript:;"></a>\
							</div>'
				$('body').append(html);
				$('.prompt-buymember .close').on('touchend',function(event){
					event.preventDefault();
					$(this).parent().hide();
					$('.mask').removeClass('mask-zIndex1').hide();
				})
			}
			if(!$('.mask').length){
				$('body').append('<div class="mask mask-zIndex1"></div>');	
			}else{
				$('.mask').addClass('mask-zIndex1').show();
			}
	},
	member:function(name,callback){
			//var u_id = window.localStorage.getItem("xrzU_id");
			var u_id = name;
				if(!u_id){
					$.detectionMember(['请于登录后操作','']);
					$('.prompt-buymember a').attr('href','login.html').html('立即登录');
					return false;
				}
				if(name == 'u_id'){
					return u_id;
				}
				if(!name){
					callback && callback();
					return false;
				}
				/*$.xrzGet(['u_id='+u_id],'userData',function(data){
					var authority = data.data.authority.split(',');
			      	if(authority.indexOf(name) != -1){
			      		callback && callback();
			      		return true;
			      	}else{
			      		if(name == 'stocklist'){
			      			$.detectionMember(['购买高级会员','掌握云端股票池'])
			      		}else if(name == 'mystock'){
			      			$.detectionMember(['购买缠论会员','随时查看我的自选'])
			      		}else if(name == 'member'){
			      			$.detectionMember(['购买缠论会员','搜索所有个股'])
			      		}else if(name == 'stock'){
			      			$.detectionMember(['购买缠论会员','随时查看缠论结构'])
			      		}
			      		$('.prompt-buymember a').attr('href','https://kdt.im/f2Kgyr').html('立即购买');
			      		return false;
			      	}
			    })*/
				callback && callback();
			    return true;
	},
	'search':function(select){ // 搜索组件
		if($("#search-wraper").length){
			$(select).on('touchend',function(){
				//if($.member('u_id'))
				$('#search-wraper').css('top',0);
				setTimeout(function(){
					$search[0].focus();
				},200)
			})
			return false;
		}

		var html = 	'<div class="clear" id="search">'+
						'<div class="_search-wrap fl">'+
							'<div class="_search-icon">'+
								'<img src="images/search-icon.png">'+
							'</div>'+
							'<div class="_search-wrap2">'+
								'<input class="_search" type="text" placeholder="输入股票代码/名称/拼音首字母">'+
							'</div>'+
							'<img src="images/x.png" class="clear">'+
						'</div>'+
						'<div class="_search-close fl">取消</div>'+
					'</div>'+
					'<dl class="_search-result"></dl>'
			$('body').append('<div id="search-wraper" style="top:'+document.documentElement.clientHeight+'px">'+html+'</div>');
		
			var u_id = window.localStorage.getItem("xrzU_id");	

		var $search = $('._search').eq(0),
			$searchWraper = $('#search-wraper'),
			$searchClose = $('._search-close ').eq(0),
			$searchResult = $('._search-result').eq(0),
			$clear= $('._search-wrap .clear');
		var isMove = false;	

		$.xrzTool.search = function(data){

			$.xrzGet(['u_id='+$.member('u_id')],'get',function(datas){
				var html = '<dt>查询结果</dt>',
					addedCodes = [];
				datas.data.forEach(function(value){
					addedCodes.push(value.code)
				})
				if(!data.data.stocks){
					$searchResult.html('<dt>无相关股票</dt>')
					return;
				}

				data.data.stocks.forEach(function(value){
					var code = value.prod_code+'.'+value.hq_type_code;
					html +='<dd>'+
							'<div class="list" data-code="'+ code +'">'+
								'<p class="fl">'+ value.prod_code+'</p>'+
								'<p class="fl">'+ value.stock_abbr_name +'</p>'+
								'<i class="fr '+ (addedCodes.indexOf(code) != -1 ? 'remove' : 'add') +'" data-code="'+ code +'"><em class="bs"></em></i>'+
							'</div>'+
						'</dd>';
				})	
				$searchResult.html(html);
			})
		}
		
		$searchResult.on('touchstart',function(){
			$search[0].blur();
		}).on('touchmove',function(){
			isMove = true;
		}).on('touchend','i',function(event){
			event.stopPropagation();
			var self = this;
			$.member('mystock',function(){
				if($(self).hasClass('add')){
					$(self).removeClass('add');
					$.xrzGet(['code='+self.getAttribute('data-code'),'u_id='+u_id],'pass',function(data){
						if(data.data){
							$(self).addClass('remove');
							$searchClose.isOperat = true;
						}
					});
				}else{
					$(self).removeClass('remove');
					$.xrzGet(['code='+self.getAttribute('data-code'),'u_id='+u_id],'delete',function(data){
						if(data.data){
							$(self).addClass('add').removeClass('remove');
							$searchClose.isOperat = true;
						}
					});
				}
			})
			return false;
		}).on('touchend','.list',function(event){
			if(isMove){
				isMove = false;
				return;
			}
			if(event.target.nodeName == 'I' || event.target.nodeName == 'EM'){
				return;
			}
			var self = this;
			$.member('member',function(){
				window.location.href = 'details.html?code=' + self.getAttribute('data-code');
			})
		})

		$(select).on('touchend',function(){
			//if($.member('u_id'))
			$('#search-wraper').css('top',0);
			setTimeout(function(){
				$('input').each(function(){
					this.focus();
				}) 
			});
		});

		$searchClose.on('touchend',function(event){
			event.stopPropagation();
			$search[0].blur();
			$('#search-wraper').css('top',document.documentElement.clientHeight);
			$searchClose.isOperat && $.search.closeCallback && $.search.closeCallback();
			$searchClose.isOperat = false;
		});
		$search.on('input',function(){
			if(this.value.length){
				$clear.show();
			}else{
				$clear.hide();
			}
			if(/^[\u4e00-\u9fa5]+$/i.test(this.value)){
				$.xrzTool.jsonP(api_url + 'api/chanlun/v1/quote/fuzzyquery?query_str='+this.value+'&callback=$.xrzTool.search')
			}else if(this.value.length >= 3){
				$.xrzTool.jsonP(api_url + 'api/chanlun/v1/quote/fuzzyquery?query_str='+this.value+'&callback=$.xrzTool.search')
			}else if(/^[a-zA-Z]+$/.test(this.value)){
				$.xrzTool.jsonP(api_url + 'api/chanlun/v1/quote/fuzzyquery?query_str='+this.value+'&callback=$.xrzTool.search')
			}else{
				$searchResult.html('')
			}
		})
		$clear.on('touchend',function(){
			this.style.display = 'none';
			$search.val('');
			$searchResult.html('')
		})
	}	
})

$(function(){
	$('.footer li').on('touchend',function(){
		switch($(this).index()){
			case 1:
				$.member('stocklist',function(){
					window.location.href = 'stock-pool.html';
				});
				break;
			case 2:
				$.member('mystock',function(){
					window.location.href = 'optional-stock.html';
				});
				break;	
			case 3:
				$.member('',function(){
					window.location.href = 'personal-center.html';
				});
				break;		
		}
	})
	$.search('.search-wrap');// 添加搜索
})
