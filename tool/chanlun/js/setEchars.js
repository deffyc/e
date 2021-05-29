function InitEchars(data,vam,macd,candle_period,baseOptions){

	this.loading = document.getElementById('loading');
	this.vam = vam;
	this.macd = macd;
	this.candle_period = candle_period;
	this.date = {};
	this.date.name = (data[data.length-1].min_time.substring(0,4)+'/'+data[data.length-1].min_time.substring(4,6)+'-'+data[data.length-1].min_time.substring(6,8))
	this.date.time = data[data.length-1].min_time.substring(8,10)+':'+data[data.length-1].min_time.substring(10,12);	
	this.date.value = new Array(data[data.length-1].open_px,data[data.length-1].close_px,data[data.length-1].low_px,data[data.length-1].high_px)

	this.showDetails(this.date,true)

	this.baseOptions = baseOptions;
	var options = this.options = this.handleData(data);
	this.bar = this.dealWith(data);
	this.ma5 = this.calculateMAK(5,options.close);
	this.ma10 = this.calculateMAK(10,options.close);
	this.ma20 = this.calculateMAK(20,options.close);
	this.ma30 = this.calculateMAK(30,options.close);
	this.init();
	xrz.options.chars[0].dispatchAction({
		type:'legendUnSelect',
		name:'ma5'
	})
	xrz.options.chars[0].dispatchAction({
		type:'legendUnSelect',
		name:'ma10'
	})
	xrz.options.chars[0].dispatchAction({
		type:'legendUnSelect',
		name:'ma20'
	})
	xrz.options.chars[0].dispatchAction({
		type:'legendUnSelect',
		name:'ma30'
	})
	$('#average-line input')[0].checked = false;
}

InitEchars.prototype.init = function(){
	var self = this;
		self.xAxis = ' ';
	var option1 = {
	    tooltip : {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'line'
	        },
			position: function (point, params, dom) {
			  // 固定在顶部
			  if(point[0] < 200){
			  	return [point[0]+30,30]
			  }else{
			  	return [64,30];
			  }
			},
			transitionDuration:0,
			formatter: function(params){
				if(!params[0]) return;
				var res =  ((params[0].name.indexOf(':') == -1) ? params[0].name : (params[0].name.substring(0,4)+ ' ' + params[0].name.substring(4,16).replace('/','-'))) +'</br>'+params[0].seriesName;
				res += '</br>  开盘 : ' + params[0].value[0] + '</br>  收盘 : ' + params[0].value[1];
	            res += '<br/>  最高 : ' + params[0].value[3] + '</br>  最低 : ' + params[0].value[2];
	            if(params[1]){
		            res += '<br/>  '+ params[1].seriesName +' : ' + params[1].value;
		            res += '<br/>  '+ params[2].seriesName +' : ' + params[2].value;
		            res += '<br/>  '+ params[3].seriesName +' : ' + params[3].value;
		            res += '<br/>  '+ params[4].seriesName +' : ' + params[4].value;
		        }    
	            self.showDetails(params[0]);
				return res
			}
	    },
	    legend: {
	    	show:true,
	    	padding:20,
	        data:['ma5','ma10','ma20','ma30']
	    },
	    grid:{
		   		x: 60,
		        y: 10,
		        x2:44,
		        y2:25
		   	},
		dataZoom : [{
					type:'inside',
			        realtime: true,
			        xAxisIndex:0,
			        start : this.baseOptions.dataZoomStart,
			        end : this.baseOptions.dataZoomEnd
			},{
				show:false,
		        type:'slider',
		        realtime: true,
		        xAxisIndex:0,
		        start : this.baseOptions.dataZoomStart,
		        end : this.baseOptions.dataZoomEnd
		    }],      	
	    xAxis : {
	            type : 'category',
	            boundaryGap : true,
	            data : this.options.dates,
	            axisTick :{
	            	alignWithLabel : true
	            },
	            axisLabel:{
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
	            boundaryGap: [0.001, 0.001],
	            splitNumber:4
	        },
	    series : [
	        {
	            name:xrz.stock_abbr_name,
	        	silent:true,
	            type:'candlestick',
	            data:this.options.data,
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
				    		'color':'blue'
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
				    		'color':'yellow'
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
			    		color:'purple',
			    		lineStyle:{
				    		'width':1,
				    		'color':'purple'
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
			    		color:'green',
			    		lineStyle:{
				    		'width':1,
				    		'color':'green'
			    		},
			    	},
			    },
			    animation:false
	        }
	    ]
    }
	var option2 = {
	    tooltip : {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'line'
	        },
	        position: function (point, params, dom) {
			  // 固定在顶部
			  if(!params[0]) return;
			  if(point[0] < 200){
			  	return [point[0]+30,30]
			  }else{
			  	return [64,30];
			  }
			},
			transitionDuration:0,
			formatter:function(params){
				var res =  ((params[0].name.indexOf(':') == -1) ? params[0].name : (params[0].name.substring(0,4)+ ' ' + params[0].name.substring(4,16).replace('/','-'))) +'</br>'+params[0].seriesName;
				return res + '</br>成交量：' + xrz.fixed(params[0].value*10000/1000000000000)+'亿' 
			}
	    },
	    legend: {
	    	show:true,
	    	padding:20,
	    	left:20,
	        data:[{
    	        	name:'成交量',
    	        	//icon:'image://url'
    	        }] 
	    },
	    grid:{
	   			x: 60,
		        y: 10,
		        x2:44,
		        y2:10
		   	},
		dataZoom : [{
					type:'inside',
			        realtime: true,
			        xAxisIndex:0,
			        start : this.baseOptions.dataZoomStart,
			        end : this.baseOptions.dataZoomEnd
			},{
				show:false,
		        type:'slider',
		        realtime: true,
		        xAxisIndex:0,
		        start : this.baseOptions.dataZoomStart,
		        end : this.baseOptions.dataZoomEnd
		    }],     	
	    xAxis : {
	    		show : false,
	    		type : 'category',
	            boundaryGap : true,
	            data : this.options.dates,
	            axisTick :{
	            	alignWithLabel : true
	            },
	            axisLabel:{
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
	    yAxis : [
	        {
	            type : 'value',
	            scale:true,
	            boundaryGap: [0.1, 0.1],
	            min:0,
	            axisLabel: {
	                formatter: function (v) {
	                	if(v == 0){
	                		return v
	                	}
	                    return v*10000/1000000000000 + ' 亿' 
	                }
	            },
	            splitNumber:2
	        }
	    ],
	    series : [
	        {
	            name: '成交量',
	            type: 'bar',
	            data: self.bar,
	            itemStyle:{
	            	normal:{
	            		color:'red'
	            	}
	            }
	        }
	    ]
    }    
    var option3 = {
	    tooltip : {
	        trigger: 'axis', 
	        axisPointer: {
	            type: 'line'
	        },
	        position: function (point, params, dom) {
			  // 固定在顶部
			  if(!params[0]) return;
			  if(point[0] < 200){
			  	return [point[0]+30,30]
			  }else{
			  	return [64,30];
			  }
			},
			transitionDuration:0,
			formatter:function(params){
				var res =  ((params[0].name.indexOf(':') == -1) ? params[0].name : (params[0].name.substring(0,4)+ ' ' + params[0].name.substring(4,16).replace('/','-'))) +'</br>'+params[0].seriesName;
				return res + '</br>成交量：' + xrz.fixed(params[0].value*10000/1000000000000)+'亿' 
			}
	    },
	    legend: {
	    	show:true,
	    	padding:14,
	        data:['macd','diff','dea']
	    },
	    grid:{
	   			x: 60,
		        y: 10,
		        x2:44,
		        y2:40
		   	},
		dataZoom : [{
					type:'inside',
			        realtime: true,
			        xAxisIndex:0,
			        start : this.baseOptions.dataZoomStart,
			        end : this.baseOptions.dataZoomEnd
			},{
		        type:'slider',
		        realtime: true,
		        xAxisIndex:0,
		        start : this.baseOptions.dataZoomStart,
		        end : this.baseOptions.dataZoomEnd
		    }],      	
	    xAxis : {
	    		show : false,
	    		type : 'category',
	            scale:true,
	            boundaryGap : true,
	            data : this.options.dates,
	            axisTick :{
	            	alignWithLabel : true
	            },
	            axisLabel:{
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
		    }
	    ,
	    yAxis : [
	        {
	            type : 'value',
	            scale:true,
	            boundaryGap: [0.01, 0.01],
	            splitNumber:4
	        }
	    ],
	    series : [
	        {
	            name: 'macd',
	            type: 'bar',
	            data: this.macd[0]
	        },
	        {
	        	name:'diff',
	        	type:'line',
	        	symbol: 'none',
	        	data:this.macd[1]
	        },
	        {
	        	name:'dea',
	        	type:'line',
	        	symbol: 'none',
	        	data:this.macd[2]
	        }
	    ]
    }  

    this.baseOptions.chars[0].setOption(option1);
    this.baseOptions.chars[1].setOption(option2);
    this.baseOptions.chars[2].setOption(option3);
	this.loading.style.display = 'none';
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

//展示数据
InitEchars.prototype.showDetails = function(data,first){
	var $open = $('.open span'),
		$closing = $('.closing span'),
		$high = $('.high span'),
		$low = $('.low span'),
		$quoteChange = $('.quote-change span');
		$date = $('.date');
		$week = $('.week');
		if(data.value[1] - data.value[0] > 0){ //high
			$quoteChange.removeClass('down').addClass('up');
			$quoteChange.html('+' + xrz.fixed(data.value[1] - data.value[0]));
		}else{ //low
			$quoteChange.removeClass('up').addClass('down');
			$quoteChange.html(xrz.fixed(data.value[1] - data.value[0]));
		}

		$open.html(xrz.fixed(data.value[0]));
		$closing.html(xrz.fixed(data.value[1]));
		$high.html(xrz.fixed(data.value[3]));
		$low.html(xrz.fixed(data.value[2]));
		var year = new Date().getFullYear();
		if(first){
			this.candle_period < 6 ? $date.addClass('dataTime').html( year + ' ' +data.name.substring(5,11)+"   <span>"+data.time+'</span>') : $date.removeClass('dataTime').html(data.name);
			var date = new Date(data.name.replace("-",'/')).getDay();
		}else if(this.candle_period >= 6){
			$date.removeClass('dataTime').html('20'+data.name);
			var date = new Date('20'+data.name.replace("-",'/')).getDay();
		}else{
			$date.addClass('dataTime').html( data.name.substring(0,4) + ' ' +data.name.substring(4,9).replace('/','-')+"   <span>"+data.name.substring(9,16)+'</span>');
			date = new Date((data.name.substring(0,4)+','+data.name.substring(4,6)+','+data.name.substring(7,9))).getDay();
		}
		if(date == 1){
			date = '周一'
		}else if(date == 2){
			date = '周二'
		}else if(date == 3){
			date = '周三'
		}else if(date == 4){
			date = '周四'
		}else if(date >= 5){
			date = '周五'
		}
		$week.html(date);
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


//xrz·································································

var xrz = {};

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
						data[j].start_time.substring(0,6) + '/' +data[j].start_time.substring(6,8) + ' ' + data[j].start_time.substring(8,10)+':'+ data[j].start_time.substring(10,12)
					:   data[j].start_time.substring(2,4) +'/'+ data[j].start_time.substring(4,6) +'-'+ data[j].start_time.substring(6,8) 
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
						color:'#efefef',
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

xrz.getVam = function (data){
	xrz.vam = xrz.calculateMAV(data);
	if(xrz.macd){
		xrz.setJsonp(api_url + 'api/chanlun/v1/quote/kline',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getData');
	}
}

xrz.getMacd = function (data){
	xrz.macd = xrz.calculateMacd(data)
	if(xrz.vam){
		xrz.setJsonp(api_url + 'api/chanlun/v1/quote/kline',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getData');
	}
}

xrz.getData = function (data){
	var char = new InitEchars(data.data.candle.candle_detail_data,xrz.vam,xrz.macd,xrz.candle_period,xrz.options);
	xrz.macd = xrz.vam = false;
}

xrz.fixed = function(nub,index){
	var num2= nub.toFixed(3),
		index = (index + 1) || 3;
	return num2.substring(0,num2.lastIndexOf('.')+index)
}	
xrz.setData = function setData(data){
	var data = data.data.snapshot.snapshot_detail_data;
	document.title = xrz.stock_abbr_name + data.last_px + '  ' + data.px_change + '('+xrz.fixed(data.px_change_rate*100)+'%)';
	if(data.last_px > data.preclose_px){
		$('.stockbigk-index').html(data.last_px)
		$('.stockbigk-increase').html('+'+data.px_change + '(+'+xrz.fixed(data.px_change_rate*100)+'%)')
	}else{
		$('.stockbigk-index').html(data.last_px).parent().addClass('green');
		$('.stockbigk-increase').html(data.px_change + '('+xrz.fixed(data.px_change_rate*100)+'%)')
	}
	$('.stockbigk-detail span').each(function(i){
		switch(i){
			case 0: this.innerHTML = parseFloat(data.open_px);
				break;
			case 1: this.innerHTML = xrz.fixed(data.preclose_px);
				break;
			case 2: this.innerHTML = xrz.fixed(data.high_px);
				break;
			case 3: this.innerHTML = xrz.fixed(data.low_px);
				break;
			case 4: this.innerHTML = xrz.fixed(data.last_px);
				break;
			case 5: this.innerHTML = xrz.fixed(parseInt(data.business_balance)/100000000) + '亿元';
				break;	
			case 6: this.innerHTML = xrz.fixed(data.business_amount*10000/100000000) + '万股';
				break;
			case 7: this.innerHTML = xrz.fixed(data.px_change*10000/10000);
				break;
			case 8: this.innerHTML = xrz.fixed(data.px_change_rate*10000/100) + '%';
				break;
			case 9: this.innerHTML = xrz.fixed(data.up_px);
				break;
			case 10: this.innerHTML = xrz.fixed(data.down_px);
				break;
			case 11: this.innerHTML = xrz.fixed(data.current_amount/10000) + '万股';
				break;
			case 12: this.innerHTML = xrz.fixed(data.vol_ratio);
				break;
			case 13: this.innerHTML = xrz.fixed(data.market_value/100000000) + '亿';
				break;
			case 14: this.innerHTML = xrz.fixed(data.circulation_value/100000000) + '亿';
				break;
			case 15: this.innerHTML = xrz.fixed(data.dyn_pb_rate);
				break;
			case 16: this.innerHTML = xrz.fixed(data.pe_rate);
				break;
			case 17: this.innerHTML = xrz.fixed(data.turnover_ratio*10000/100) +'%';
				break;
		}
	})
}

xrz.setTime = function setTime(){
		var oDate = new Date();
		xrz.time = {};
		xrz.time.year = oDate.getFullYear(),
		xrz.time.month = oDate.getMonth()+1 < 10 ?  '0'+(oDate.getMonth() + 1) : oDate.getMonth()+1,
		xrz.time.date = oDate.getDate() < 10 ?  '0'+ oDate.getDate() : oDate.getDate(),
		xrz.time.hours = oDate.getHours() < 10 ? '0'+oDate.getHours() : oDate.getHours();
		xrz.time.minutes = oDate.getMinutes() < 10 ? '0'+oDate.getMinutes() : oDate.getMinutes();
		xrz.time.seconds = oDate.getSeconds() < 10 ? '0'+oDate.getSeconds() : oDate.getSeconds();
		xrz.time.time = xrz.time.hours + ':' + xrz.time.minutes;
		xrz.time.type2 = xrz.time.year + xrz.time.month + xrz.time.date + xrz.time.time.split(':').join('');
		xrz.time.type3 = xrz.time.type2.substring(0,8);

		xrz.end_date = xrz.time.type2;

		xrz.setJsonp(api_url + 'api/chanlun/v1/quote/fuzzyquery?query_str='+ window.location.href.split('prod_code=')[1] + '&callback=xrz.getSuffix')	
	}

xrz.getSuffix = function(data){
	var data = data.data.stocks;
	for(var i = 0,len = data.length; i < len; i++){
		if(data[i].stock_abbr_name == xrz.stock_abbr_name || i == len - 1){
			xrz.prod_code =  xrz.prod_code + '.' + data[i].hq_type_code;
			xrz.stock_abbr_name = decodeURIComponent(data[i].stock_abbr_name);
			break
		}
	}

	$('.stockbigk-name').html(xrz.stock_abbr_name+'(SH:'+ window.location.href.split('prod_code=')[1].slice(0,6) +')');
	$('.stockbigk-time').html(xrz.time.month + '-' + xrz.time.date + '&nbsp&nbsp' + xrz.time.time + '(北京时间)');
	$('.stockbigk-attention').attr('data-code',data[0].prod_code+'.'+data[0].hq_type_code);

	if($.xrzTool.isLogin('u_id',false)){
		$.xrzGet(['code='+$('.stockbigk-attention').attr('data-code'),'u_id='+$.xrzTool.isLogin('u_id')],'get',function(data){
			
			var code = $('.stockbigk-attention').attr('data-code'),
				len = data.data.length;
			if(data.data.length){
				for(var i = 0; i < len; i++ ){
					if(code == data.data[i].code){
						$('.stockbigk-attention').addClass('remove').removeClass('vhide').html('移除关注');
						return;
					}
				}
			}
			$('.stockbigk-attention').removeClass('remove vhide').html('加关注');		
		});
	}else{
		$('.stockbigk-attention').removeClass('remove vhide').html('加关注');

	}
	$('.stockbigk-attention').click(function(){
		var self = this;
		if(!$(this).hasClass('remove')){
			var self = this;
			$.xrzGet(['code='+$(this).attr('data-code'),'u_id='+$.xrzTool.isLogin('u_id')],'pass',function(data){
				if(data.status == 200 && data.data){
					$(self).addClass('remove').html('移除关注');
				}else{
					$(self).removeClass('remove').html('加关注');	
				}
			});
		}else{
			$('.optional-alert').show();
			$.xrzTool.alert('确定不再关注该股票吗','点击确定后，该股票将会从您的自选股中移除。',function(){
				$(this).hide();
				$.xrzGet(['code='+$('.stockbigk-attention').attr('data-code'),'u_id='+$.xrzTool.isLogin('u_id')],'delete',function(data){
					if(data.status == 200 && data.data.msg == '删除成功'){
						$(self).removeClass('remove').html('加关注');	
					}
				});	
			})
		}
	})
	
	xrz.setJsonp(api_url + 'api/chanlun/v1/quote/snapshot?prod_code='+ xrz.prod_code +'&fields=business_amount,business_balance,px_change_rate,last_px,business_balance,business_amount,down_px,current_amount,vol_ratio,amplitude,bid_grp,offer_grp,market_value,circulation_value,dyn_pb_rate,pe_rate,turnover_ratio,trade_status,business_amount_in,up_px,px_change,open_px,high_px,low_px,preclose_px&callback=xrz.setData')

	xrz.setJsonp(api_url + 'api/chanlun/v1/quote/macd',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getMacd');
	xrz.setJsonp(api_url + 'api/chanlun/v1/quote/cldata',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getVam');
}

xrz.setJsonp = 	function(url,prod_code,candle_period,candle_mode,start_date,end_date,callback){
			arguments.length > 1 ? 
					url = (url + '?prod_code=' + prod_code + '&candle_period=' + candle_period + '&candle_mode=' + candle_mode + '&start_date=' + start_date + '&end_date=' + end_date + '&callback=' + callback)
				:	url = url;
			var script = document.createElement('script');
			script.src = url;
			document.body.appendChild(script); 
		}

xrz.init = function(){	
	xrz.time1 = $.xrzTool.getTime(true),
	xrz.time2 = $.xrzTool.getTime('-180',true),
	xrz.vam,
	xrz.macd,
	xrz.data,
	xrz.start_date = (xrz.time1[0] - 1) +''+ xrz.time1[1]+xrz.time1[2],
	xrz.end_date = undefined,
	xrz.candle_period = 6,
	xrz.prod_code = window.location.href.split('prod_code=')[1], 
	xrz.stock_abbr_name = decodeURIComponent(window.location.href.split('stock_abbr_name=')[1].split('&prod_code=')[0]);
	xrz.chars = [];

	xrz.setTime();
	
	xrz.options.chars[0] = echarts.init(document.getElementById('stockbigk')); 
    xrz.options.chars[1] = echarts.init(document.getElementById('stockbigk-bar'));  
    xrz.options.chars[2] = echarts.init(document.getElementById('macd'));    
    
    
    xrz.options.chars[0].group = 'group1';
    xrz.options.chars[1].group = 'group1';
    xrz.options.chars[2].group = 'group1';

    echarts.connect('group1');
	
	// 拉长K线
	document.getElementById('shorten-k').onclick = function(){
  		var start = xrz.options.chars[0].getOption().dataZoom[0].start
    	if(start + 5 >= 100){
    		return
    	}else{
    		xrz.options.chars[0].dispatchAction({
			    type: 'dataZoom',
			    start: start + 5,
			    end: 100
			});
    	}
    }

	//缩短K线
	document.getElementById('increase-k').onclick = function(){
		var start = xrz.options.chars[0].getOption().dataZoom[0].start
    	if(start - 5 < 0){
    		return
    	}else{
    		xrz.options.chars[0].dispatchAction({
			    type: 'dataZoom',
			    start: start - 5,
			    end: 100
			});
    	}
    }

	document.getElementById('average-line').children[0].onclick = function(){
    	
    	if(this.checked){
    		xrz.options.chars[0].dispatchAction({
	    		type:'legendSelect',
	    		name:'ma5'
	    	})
	    	xrz.options.chars[0].dispatchAction({
	    		type:'legendSelect',
	    		name:'ma10'
	    	})
	    	xrz.options.chars[0].dispatchAction({
	    		type:'legendSelect',
	    		name:'ma20'
	    	})
	    	xrz.options.chars[0].dispatchAction({
	    		type:'legendSelect',
	    		name:'ma30'
	    	})
    	}else{
    		xrz.options.chars[0].dispatchAction({
	    		type:'legendUnSelect',
	    		name:'ma5'
	    	})
    		xrz.options.chars[0].dispatchAction({
	    		type:'legendUnSelect',
	    		name:'ma10'
	    	})
	    	xrz.options.chars[0].dispatchAction({
	    		type:'legendUnSelect',
	    		name:'ma20'
	    	})
	    	xrz.options.chars[0].dispatchAction({
	    		type:'legendUnSelect',
	    		name:'ma30'
	    	})
    	}
    }


	$('#pkktabs li').click(function(){
		if($(this).hasClass('arr')) return;
		$(this).parent().children('.arr').removeClass('arr');
		$(this).addClass('arr');

		xrz.start_date = (xrz.time1[0] - 1) +''+ xrz.time1[1]+xrz.time1[2];
		switch($(this).index()){
			case 0: //日
				xrz.candle_period = 6;
				break;
			case 1: //周
				xrz.candle_period = 7;
				break;
			case 2: //月
				xrz.candle_period = 8;
				break;	
			case 3: //5分
				xrz.candle_period = 2;
				xrz.start_date = xrz.time2[0] +''+ xrz.time2[1] + xrz.time2[2] + '0930';
				break;
			case 4: //15分
				xrz.candle_period = 3;
				xrz.start_date = xrz.time2[0] +''+ xrz.time2[1] + xrz.time2[2] + '0930';
				break;
			case 5: //30分
				xrz.candle_period = 4;
				xrz.start_date = xrz.time2[0] +''+ xrz.time2[1] + xrz.time2[2] + '0930';
				break;
			case 6: //60分
				xrz.candle_period = 5;
				xrz.start_date = xrz.time2[0] +''+ xrz.time2[1] + xrz.time2[2] + '0930';
				break;				
		}

		if(xrz.candle_period < 6){
			xrz.end_date = xrz.time.type2;
		}else{
			xrz.end_date = xrz.time.type3;
		}
		xrz.setJsonp(api_url + 'api/chanlun/v1/quote/cldata',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getVam');
		xrz.setJsonp(api_url + 'api/chanlun/v1/quote/macd',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getMacd');

		document.getElementById('loading').style.display = 'block';
	})

}
$(xrz.init)

