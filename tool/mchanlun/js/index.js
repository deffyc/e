function InitEchars(data,vam,macd,candle_period,baseOptions){
	this.vam = vam;
	this.macd = macd;
	this.candle_period = candle_period;
	this.date = {};
	this.date.name = (data[data.length-1].min_time.substring(0,4)+'/'+data[data.length-1].min_time.substring(4,6)+'-'+data[data.length-1].min_time.substring(6,8))
	this.date.time = data[data.length-1].min_time.substring(8,10)+':'+data[data.length-1].min_time.substring(10,12);	
	this.date.value = new Array(data[data.length-1].open_px,data[data.length-1].close_px,data[data.length-1].low_px,data[data.length-1].high_px)

	this.baseOptions = baseOptions;
	this.options = this.handleData(data);
	this.bar = this.dealWith(data);
	this.ma5 = this.calculateMAK(5,this.options.close);
	this.ma10 = this.calculateMAK(10,this.options.close);
	this.ma20 = this.calculateMAK(20,this.options.close);
	this.ma30 = this.calculateMAK(30,this.options.close);
	if(this.macd[0].length < this.options.dates.length){
		this.macd[0].push([undefined])
		this.macd[1].push(undefined)
		this.macd[2].push(undefined)
    }
	this.init();
}

InitEchars.prototype.init = function(){
	var self = this;
		self.xAxis = ' ';
	var option1 = {
	    legend: {
	    	show:false,
	    	padding:20,
	        data:['ma5','ma10','ma20','ma30']
	    },
	    grid:{
		   		x: 4,
		        y: 16,
		        x2:0,
		        y2:14
		   	},
		dataZoom : {
					type:'inside',
			        realtime: true,
			        start : this.baseOptions.dataZoomStart,
			        end : this.baseOptions.dataZoomEnd,
			        throttle : 200
			},      	
	    xAxis : {
	            type : 'category',
                boundaryGap : true,
	            data : this.options.dates,
	            axisLine :{
	            	show:false
	            },
	            axisTick :{
	            	show:false,
	            	alignWithLabel : true
	            },
	            axisLabel:{
	            	show:false,
	            	formatter : function(value,index){
	            		if(value.indexOf(':') !== -1){
	            			if(value.indexOf(self.xAxis) == -1){
	            				self.xAxis = value.substring(0,6);
	            				return self.xAxis.substring(2,4)+'/'+self.xAxis.substring(4,6);
	            			}else{
	            				return value.substring(10,15)
	            			}
	            		}else{
	            			return value
	            		}
	            	}
	            }
	        },
	    yAxis : {
	            type : 'value',
	            scale:true,
	            axisLine:{
	            	show:false
	            },
	            axisTick:{
	            	show:false
	            },
	            axisLabel:{
	            	inside:true,
	            	textStyle:{
	            		fontSize:xrz.coordinateNub,
	            		color:'#949494'
	            	},
	            	margin:'-2',
	            	formatter:function (value, index) {
	            		return value > parseInt(value) ? xrz.fixed(value) : value; 
	            	}
	            },
	            splitLine:{
	            	show:false
	            },
	            boundaryGap: [0.001, 0.001],
	            splitNumber:4
	        },
	    series : [
	        {
	            name:'上证指数',
	        	silent:true,
	            type:'candlestick',
	            data:this.options.data,
	            itemStyle:{
	            	normal: {
	            		color:'transparent',
	            		color0:'#1aae52',
	            		borderColor:'#f3333b',
	            		borderColor0:'#1aae52'
	            	}
	            },
	            markLine:{
	                symbol : '',
	                large : true,
	                label :{
	                	normal: {
	                		show:false
	                	}
	                },
	                data : this.vam[0]
	            },
	            markArea:{
	            	symbol : '',
	                large : true,
	                label :{
	                	normal: {
	                		show:false
	                	}
	                },
	            	data : this.vam[1]
	            },
	            animation:false
	        },
		    {
	        	show:false,
	        	name:'ma5',
	        	silent:true,
	        	type:'line',
	        	symbol: 'none',
	        	data:this.ma5,
	        	itemStyle :{
			    	normal:{
			    		lineStyle:{
				    		'width':1,
				    		'color':'#949494'
			    		}
			    	},
			    },
			    animation:false	
	        },
	        {
	        	show:false,
	        	name:'ma10',
	        	silent:true,
	        	type:'line',
	        	symbol: 'none',
	        	data:this.ma10,
	        	itemStyle :{
			    	normal:{
			    		lineStyle:{
				    		'width':1,
				    		'color':'#ff7000'
			    		},
			    	},
			    },
			    animation:false	
	        },
	        {
	        	show:false,
	        	name:'ma20',
	        	silent:true,
	        	type:'line',
	        	symbol: 'none',
	        	data:this.ma20,
	        	itemStyle :{
			    	normal:{
			    		lineStyle:{
				    		'width':1,
				    		'color':'#9932CD'
			    		},
			    	}
			    },
			    animation:false
	        },
	        {
	        	show:false,
	        	name:'ma30',
	        	silent:true,
	        	type:'line',
	        	symbol: 'none',
	        	data:this.ma30,
	        	itemStyle :{
			    	normal:{
			    		lineStyle:{
				    		'width':1,
				    		'color':'#0c8ee7'
			    		},
			    	},
			    },
			    animation:false
	        }
	    ]
    }
    this.baseOptions.chars[0].setOption(option1,true);
}

//处理时间
InitEchars.prototype.handleData = function(data){
	var newData = {
		dates : [],
		open : [],
		close : [],
		high : [],
		low : [],
		data : [],
		amount : [],
		balance : [],
		min_time : []
	}
	for (var i = 0,len = data.length; i < len; i++) {
		if(this.candle_period < 6){
			newData.dates.push(data[i].min_time.substring(0,6) + '/' +data[i].min_time.substring(6,8) + ' ' +data[i].min_time.substring(8,10)+':'+data[i].min_time.substring(10,12))
		}else{
			newData.dates.push(data[i].min_time.substring(2,4)+'/'+	data[i].min_time.substring(4,6)	+'-'+ data[i].min_time.substring(6,8));
		}
		newData.open.push(data[i].open_px.toFixed(2)-0);
		newData.close.push(data[i].close_px.toFixed(2)-0);
		newData.high.push(data[i].high_px.toFixed(2)-0);
		newData.low.push(data[i].low_px.toFixed(2)-0);
		newData.amount.push(data[i].business_amount/100000000);
		newData.balance.push(data[i].business_balance/100000000);
		newData.min_time.push(data[i].min_time)
		newData.data.push(new Array(newData.open[i],newData.close[i],newData.low[i],newData.high[i]));
	}

	if(newData.dates.length > 60){
		this.baseOptions.dataZoomStart = (100 - 100/(newData.dates.length/60))
	}else{
		this.baseOptions.dataZoomStart = 0;
	}
	return newData;
}

//处理MAK
InitEchars.prototype.calculateMAK = function(dayCount,data0) {
    var result = [];
    for (var i = 0, len = data0.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += data0[i - j];
        }
        result.push((sum / dayCount).toFixed(2));
    }
    return result;
}
//处理with
InitEchars.prototype.dealWith = function(data){
	var bar = [];
	for(var i = 0,len = data.length; i < len; i++){
		if(data[i].close_px - data[i].open_px > 0){
			bar.push({
				value : data[i].business_amount,
				itemStyle:{
					normal:{
						color: 'red'
					}
				}
			})
		}else{
			bar.push({
				value : data[i].business_amount,
				itemStyle:{
					normal:{
						color: 'green'
					}
				}
			})
		}
	}
	return bar
}
InitEchars.prototype.addDate = function(params){

	if(params.length < 2){
		$('.ma span').each(function(i){
			switch(i){
				case 0:
					this.innerHTML = '5 : -';
					break;
				case 1:
					this.innerHTML = '10 : -';
					break;
				case 2:
					this.innerHTML = '20 : -';
					break;
				case 3:
					this.innerHTML = '30 : -';
					break;	
			}			
		})
	}else{
		$('.ma span').each(function(i){
			this.innerHTML = params[i+1].seriesName.replace('ma','') +' : ' + params[i+1].value;
		})
	}
	
}

//xrz·································································

var xrz = {};
xrz.coordinateNub = $('html').attr('data-dpr')*10;
xrz.options = {
	dataZoomStart : 80,
	dataZoomEnd : 100,
	chars : []
}

xrz.calculateMacd = function (data){
	data = data.data.macd.points;
	var result = [[],[],[]];
	for(var i = 0,len = data.length; i < len; i++){
		if(data[i].macd < 0){
			result[0].push({
				value:data[i].macd,
				itemStyle:{
					normal:{
						color: 'green'
					}
				}
			})
		}else{
			result[0].push({
				value:data[i].macd,
				itemStyle:{
					normal:{
						color: 'red'
					}
				}
			})
		}
		result[1].push(
			data[i].dif
		)
		result[2].push(
			data[i].dea
		)
	}
	return result;
}


xrz.calculateMAV = function (data0) {
	var self = this;
	var data = data0.data.cstructure.bi_data;
	var data2 = data0.data.cstructure.bi_zs_data;
	var result = [[],[]];
	for(var i = 0,j = 1,len = data.length; i < len-1; i++,j++){
		if(data[i].value < data[j].value){
			result[0].push([{
				xAxis:(function(){
					return self.candle_period < 6 ?
						data[i].start_time.substring(0,6) + '/' +data[i].start_time.substring(6,8) + ' ' +data[i].start_time.substring(8,10)+':'+ data[i].start_time.substring(10,12)
					:	data[i].start_time.substring(2,4) +'/'+ data[i].start_time.substring(4,6) + '-' +data[i].start_time.substring(6,8)
				})(),
				yAxis: data[i].value,
				lineStyle: {
					normal: {
						color:'red',
						type:'dashed',
						width:2
					}
				}
			},{
				xAxis:(function(){
					return self.candle_period < 6 ?
						data[j].start_time.substring(0,6) + '/' + data[j].start_time.substring(6,8) + ' ' + data[j].start_time.substring(8,10)+':'+ data[j].start_time.substring(10,12)
					:   data[j].start_time.substring(2,4) + '/' + data[j].start_time.substring(4,6) +'-'+ data[j].start_time.substring(6,8) 
				})(),
				yAxis: data[j].value
			}])
		}else{
			result[0].push([{
				xAxis:(function(){
					return self.candle_period < 6 ? 
						data[i].start_time.substring(0,6) + '/' + data[i].start_time.substring(6,8) + ' ' + data[i].start_time.substring(8,10)+':'+ data[i].start_time.substring(10,12)
					:   data[i].start_time.substring(2,4) +'/'+ data[i].start_time.substring(4,6) +'-'+ data[i].start_time.substring(6,8) 
				})(),
				yAxis: data[i].value,
				lineStyle: {
					normal: {
						color:'green',
						type:'dashed',
						width:2
					}
				}
			},{
				xAxis:(function(){
					return self.candle_period < 6 ?
						data[j].start_time.substring(0,6) + '/' + data[j].start_time.substring(6,8) + ' ' + data[j].start_time.substring(8,10)+':'+ data[j].start_time.substring(10,12)
					:   data[j].start_time.substring(2,4) +'/'+ data[j].start_time.substring(4,6) +'-'+ data[j].start_time.substring(6,8) 
				})(),
				yAxis: data[j].value
			}])
		}
	}
	for(i = 0,len = data2.length; i < len; i++){
		var xAxis = (function(){
					return self.candle_period < 6 ?
						data2[i].start_time.substring(0,6) + '/' +data2[i].start_time.substring(6,8) + ' ' + data2[i].start_time.substring(8,10)+':'+ data2[i].start_time.substring(10,12)
					:   data2[i].start_time.substring(2,4) +'/'+ data2[i].start_time.substring(4,6) +'-'+ data2[i].start_time.substring(6,8) 
				})();

		var xAxis2 = (function(){
					return self.candle_period < 6 ?
						data2[i].end_time.substring(0,6) + '/' +data2[i].end_time.substring(6,8) + ' ' + data2[i].end_time.substring(8,10)+':'+ data2[i].end_time.substring(10,12)
					:   data2[i].end_time.substring(2,4) +'/'+ data2[i].end_time.substring(4,6) +'-'+ data2[i].end_time.substring(6,8) 
				})();
		result[1].push([{
				xAxis:xAxis,
				yAxis: data2[i].low_tail,
				itemStyle: {
					normal: {
						color:'rgba(0,0,0,0)',
						borderWidth:1,
						borderType:'solid',
						borderColor:'green'
					}
				}
			},{
				xAxis:xAxis2,
				yAxis: data2[i].high_head
			}])
	}
	return result;
}
xrz.init = function(){	
	xrz.time1 = xrz.getTime(true),
	xrz.time2 = xrz.getTime('-730',true),
	xrz.time3 = xrz.getTime('-60',true),
	xrz.time4 = xrz.getTime('-1460',true),
	xrz.vam,
	xrz.macd,
	xrz.data,
	xrz.start_date = xrz.time2[0] +''+ xrz.time2[1] + xrz.time2[2];
	xrz.end_date = xrz.time1[0] +''+ xrz.time1[1]+xrz.time1[2],
	xrz.candle_period = 6,
	xrz.prod_codes = ['000001.XSHG.MRI','399001.XSHE.MRI','399006.XSHE.MRI'],
	xrz.prod_code = xrz.prod_codes[0], 
	xrz.stock_abbr_name = 1;
	xrz.chars = [];

	xrz.getSuffix();

	var offset = $('.index-stock').offset(),
		ml = parseInt($('.index-stock').css('margin-top')),
		height = document.documentElement.clientHeight - offset.top - $('.footer').height();
		
	
		$('.index-stock').height(height - ml);

	xrz.options.chars[0] = echarts.init(document.getElementById('index-stock')); 
}
xrz.fixed = function(nub,index){
	var num2= nub.toFixed(3),
		index = (index + 1) || 3;
	return num2.substring(0,num2.lastIndexOf('.')+index)
}
xrz.getSuffix = function(){
	xrz.setJsonp(api_url+'api/chanlun/v1/quote/snapshot?prod_code='+ xrz.prod_code +'&fields=business_amount,business_balance,px_change_rate,last_px,business_balance,business_amount,down_px,current_amount,vol_ratio,amplitude,bid_grp,offer_grp,market_value,circulation_value,dyn_pb_rate,pe_rate,turnover_ratio,trade_status,business_amount_in,up_px,px_change,open_px,high_px,low_px,preclose_px&callback=xrz.setData')

	xrz.setJsonp(api_url+'api/chanlun/v1/quote/macd',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getMacd');
	xrz.setJsonp(api_url+'api/chanlun/v1/quote/cldata',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getVam');
}
xrz.getVam = function (data){
	xrz.vam = xrz.calculateMAV(data);
	if(xrz.macd){
		xrz.setJsonp(api_url+'api/chanlun/v1/quote/kline',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getData');
	}
}

xrz.getMacd = function (data){
	xrz.macd = xrz.calculateMacd(data)
	if(xrz.vam){
		xrz.setJsonp(api_url+'api/chanlun/v1/quote/kline',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getData');
	}
}
xrz.getData = function (data){
	$('.prompt-box').hide()

	var char = new InitEchars(data.data.candle.candle_detail_data,xrz.vam,xrz.macd,xrz.candle_period,xrz.options);
	xrz.macd = xrz.vam = false;
	$('canvas').on('touchmove',function(event){
		this.move = true;
	}).on('touchend',function(){ // 页面跳转
		if(this.move){
			this.move = false;
			return;
		}
		window.location.href = 'details.html?code='+xrz.prod_code
	})
}
	
xrz.setData = function setData(data){
	data = data.data.snapshot.snapshot_detail_data
	$('.index-informations-left p').each(function(i){
		switch(i){
			case 0:
				xrz.isUp = (data.last_px - data.preclose_px) > 0 ? true : false;
				xrz.isUp ? $(this).parent().addClass('up') : $(this).parent().addClass('down');
				this.innerHTML = data.last_px > parseInt(data.last_px) ? xrz.fixed(data.last_px) : data.last_px;
				break;
			case 1:
				this.innerHTML = (xrz.isUp ? '+' : '') + xrz.fixed(data.px_change);
				break;
			case 2:
				this.innerHTML = (xrz.isUp ? '+' : '') + xrz.fixed(data.px_change_rate*100) +'%';		
		}
	})
	$('.index-informations-right .number').each(function(i){
		switch(i){
			case 0:
				this.innerHTML = data.open_px;
				break;
			case 1:
				this.innerHTML = xrz.fixed(data.business_amount*10000/10000000000)+'万手';
				break;
			case 2:
				this.innerHTML = data.preclose_px;
				break;
			case 3:
				this.innerHTML = xrz.fixed(data.business_balance*10000/1000000000000)+'亿';
				break;			
		}
	})
	$('.index-informations-bottom span').each(function(i){
		switch(i){
			case 0:
				this.innerHTML = data.high_px;
				break;
			case 1:
				this.innerHTML = data.low_px;
				break;
			case 2:
				this.innerHTML = xrz.fixed(data.vol_ratio*10);
				break;
			case 3:
				this.innerHTML = (data.turnover_ratio*100).toFixed(2) + '%';
				break;
		}
	})
}	
xrz.setJsonp = 	function(url,prod_code,candle_period,candle_mode,start_date,end_date,callback){
			arguments.length > 1 ? 
					url = (url + '?prod_code=' + prod_code + '&candle_period=' + candle_period + '&candle_mode=' + candle_mode + '&start_date=' + start_date + '&end_date=' + end_date + '&callback=' + callback)
				:	url = url;
			var script = document.createElement('script');
			script.src = url;
			document.body.appendChild(script);
			document.body.removeChild(script); 
		}
xrz.getTime = function(date,isArr){// date 前后几天 isArr 数组/yyyymmddhhMM
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
    }

$(function(){
	xrz.init()
	$('.index-nav li').on('touchend',function(){
		$(this).addClass('act').siblings().removeClass('act');
		$('.prompt-box').show()
		xrz.prod_code = xrz.prod_codes[$(this).index()];
		xrz.getSuffix();
	})
})


