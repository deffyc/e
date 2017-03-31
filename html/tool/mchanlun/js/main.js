function InitEchars(data,vam,macd,candle_period,baseOptions){
	this.loading = document.getElementById('loading');
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
		tooltip : {
			trigger: 'axis',
			axisPointer: {
				type: 'line'
			},
			transitionDuration:0,
			alwaysShowContent:'none',
			triggerOn:'click',
			textStyle:{
				fontSize:'0.3125rem'
			},
			formatter: function(params){
				if(!params[0]) return;
				var res =  ((params[0].name.indexOf(':') == -1) ? ('20'+params[0].name.replace('/','-')) : (params[0].name.substring(0,4)+ '-' + params[0].name.substring(4,16).replace('/','-'))) +'</br><p style="height:6px;"></p>'+params[0].seriesName;
				res += '</br><p style="height:6px;"></p>  开盘 : ' + params[0].value[0] + '</br><p style="height:6px;"></p>  收盘 : ' + params[0].value[1];
				res += '<br/><p style="height:6px;"></p>  最高 : ' + params[0].value[3] + '</br><p style="height:6px;"></p>  最低 : ' + params[0].value[2];
				self.addDate(params) 
				return res
			}
		},
		legend: {
			show:false,
			padding:20,
			data:['ma5','ma10','ma20','ma30'],
			selected:{
				'ma5':false,
				'ma10':false,
				'ma20':false,
				'ma30':false
			}
		},
		grid:{
				x: 16,
				y: 10,
				x2:16,
				y2:'-8'
			},
		dataZoom : {
					type:'inside',
					realtime: true,
					start : this.baseOptions.dataZoomStart,
					end : this.baseOptions.dataZoomEnd,
					throttle : 100
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
				splitLine:{
					show:true,
					lineStyle:{
						type:'dashed',
						color:xrz.splitLineColor
					}
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
					lineStyle:{
						type:'dashed',
						color:xrz.splitLineColor
					}
				},
				boundaryGap: [0.001, 0.001],
				splitNumber:4
			},
		series : [
			{
				name:xrz.codeName,
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
				markPoint:{ 
					data : this.vam[2]
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
				name:'ma5',
				silent:true,
				type:'line',
				symbol: 'none',
				data:this.ma5,
				lineStyle:{
					normal:{
						'width':1,
						'color':'#949494'
					}
				},
				animation:false 
			},
			{
				name:'ma10',
				silent:true,
				type:'line',
				symbol: 'none',
				data:this.ma10,
				lineStyle:{
					normal:{
						'width':1,
						'color':'#ff7000'
					},
				},
				animation:false 
			},
			{
				name:'ma20',
				silent:true,
				type:'line',
				symbol: 'none',
				data:this.ma20,
				lineStyle:{
					normal:{
						'width':1,
						'color':'#9932CD'
					},
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
	var option2 = {
		tooltip : {
			trigger: 'axis',
			axisPointer: {
				type: 'line'
			},
			formatter:function(params){
				$('.stock-line-business-amount p').each(function(i){
					if(i == 0){
						if(params[i].name.length >=15 ){
							this.innerHTML = params[i].name.substring(4,6)+'-'+params[i].name.substring(7,9)+' '+params[i].name.substring(10,15)
						}else{
							this.innerHTML = '20'+params[i].name.replace('/','-')
						}
					}else{
						var value = params[i-1].value*10000/1000000000000;
						this.innerHTML = params[i-1].seriesName+' : ' + (value > parseInt(value) ? value.toFixed(2) : value)+'亿';
					}
				})
			}
		},
		legend: {
			show:true,
			padding:20,
			left:20
		},
		grid:{
			x: 16,
			y: 0,
			x2:16,
			y2:46
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
			splitNumber:30,
			boundaryGap:true,
			data : this.options.dates,
			axisLine :{
				show:false
			},
			axisTick :{
				show:false,
				alignWithLabel : true
			},
			splitLine:{
				show:true,
				lineStyle:{
					type:'dashed',
					color:xrz.splitLineColor
				}
			},
			axisLabel:{
				show:true,
				textStyle :{
					fontSize:xrz.coordinateNub,
					color:'#939393'
				},
				margin:14,
				formatter : function(value,index){
					if(value.indexOf(':') !== -1){
						if(value.indexOf(self.xAxis) == -1){
							self.xAxis = value.substring(0,6);
							return '           '+self.xAxis.substring(2,4)+'/'+self.xAxis.substring(4,6);
						}else{
							return '           '+value.substring(10,15)
						}
					}else{
						return '           '+value.substring(3,8)
					}
				}
			}
		},
		yAxis : {
			show:false,
			type : 'value',
			scale:true,
			boundaryGap: [0.1, 0.1],
			splitNumber:2,
			axisLine:{
					show:true,
					lineStyle:{
						color:'#ddd'
					}
			},
			axisTick:{
				show:false
			},
			axisLabel:{
				show:false,
				inside:true,
				margin:24,
				textStyle:{
					fontSize:xrz.coordinateNub,
					color:'#949494'
				}
			},
			splitLine:{
				lineStyle:{
					type:'dashed',
					color:xrz.splitLineColor
				}
			}
		},
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
			transitionDuration:0,
			triggerOn:'none',
			formatter:function(params){
				$('.stock-line-information p').each(function(i){
					if(i == 0){
						if(params[i].name.length >=15 ){
							this.innerHTML = params[i].name.substring(4,6)+'-'+params[i].name.substring(7,9)+' '+params[i].name.substring(10,15)
						}else{
							this.innerHTML = '20'+params[i].name.replace('/','-')
						}
					}else{
						var value = params[i-1].value;
						this.innerHTML = params[i-1].seriesName.toUpperCase() +' : '+ (typeof value !== 'number' ? '-' : value.toFixed(2))
					}
				})
			}
		},
		legend: {
			show:true,
			padding:14
		},
		grid:{
				x: 16,
				y: 0,
				x2:16,
				y2:46
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
				splitNumber:30,
				boundaryGap:true,
				data : this.options.dates,
				splitLine:{
					show:true,
					lineStyle:{
						type:'dashed',
						color:xrz.splitLineColor
					}
				},
				axisLine:{
					show:true,
					lineStyle:{
						color:'#ddd'
					}
				},
				axisLabel:{
					show:true,
					textStyle :{        
						fontSize:xrz.coordinateNub,
						color:'#939393'
					},
					margin:14,
					formatter : function(value,index){
						if(value.indexOf(':') !== -1){
							if(value.indexOf(self.xAxis) == -1){
								self.xAxis = value.substring(0,6);
								return '           '+self.xAxis.substring(2,4)+'/'+self.xAxis.substring(4,6);
							}else{
								return '           '+value.substring(10,15)
							}
						}else{
							return '           '+value.substring(3,8)
						}
					}
				}
			}
		,
		yAxis : {
				type : 'value',
				scale:true,
				boundaryGap: [0.1, 0.1],
				splitNumber:2,
				axisLine:{
					show:false
				},
				axisTick:{
					show:false
				},
				axisLabel:{
					show:false,
					inside:true,
					margin:24,
					textStyle:{
						color:'#949494'
					},
					formatter: function (v) {
						if(v == 0){
							return v
						}
						return v*10000/1000000000000 + ' 亿' 
					}
				},
				splitLine:{
					lineStyle:{
						type:'dashed',
						color:xrz.splitLineColor
					}
				}
			},
		series : [
			{
				name: 'macd',
				type: 'bar',
				data: this.macd[0],
				animation:false 
			},
			{
				name:'diff',
				type:'line',
				symbol: 'none',
				data:this.macd[1],
				animation:false 
			},
			{
				name:'dea',
				type:'line',
				symbol: 'none',
				data:this.macd[2],
				animation:false 
			}
		]
	}  
	var d = Date.now()
	if(xrz.firstchars){
		this.baseOptions.chars.forEach(function(value){
			value.clear();
		})
	}else{
		xrz.firstchars = true;
	}
console.log(d - Date.now())
	this.baseOptions.chars[1].setOption(option2,true);
	this.baseOptions.chars[2].setOption(option3,true);
	this.baseOptions.chars[0].setOption(option1,true);
console.log(d - Date.now())
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
	$('.stock-line-information p').each(function(i){
		switch(i){
			case 0:
				var value = self.options.dates[self.options.dates.length-1];
				if(value.length >=15 ){
					this.innerHTML = value.substring(4,6)+'-'+value.substring(7,9)+' '+value.substring(10,15)
				}else{
					this.innerHTML = '20'+value.replace('/','-')
				}
				break;
			case 1:
				var value = self.macd[0][self.macd[0].length-1].value
				this.innerHTML = 'MACD : ' + (value == undefined ? '-' : value.toFixed(2));
				break;
			case 2:
				var value = self.macd[1][self.macd[1].length-1]
				this.innerHTML = 'DIFF : ' + (value == undefined ? '-' : value.toFixed(2));
				break;
			case 3:
				var value = self.macd[2][self.macd[2].length-1]
				this.innerHTML = 'DEA : ' + (value == undefined ? '-' : value.toFixed(2));
				break;                      
		}   
	})
	$('.stock-line-business-amount p').each(function(i){
		switch(i){
			case 0:
				var value = self.options.dates[self.options.dates.length-1];
				if(value.length >=15 ){
					this.innerHTML = value.substring(4,6)+'-'+value.substring(7,9)+' '+value.substring(10,15)
				}else{
					this.innerHTML = '20'+value.replace('/','-')
				}
				break;
			case 1:
				var value = self.bar[self.bar.length-1].value*10000/1000000000000;
				this.innerHTML = '成交量 : ' + (value > parseInt(value) ? value.toFixed(2) : value)+'亿';
				break;
		}   
	})
}

//处理时间
InitEchars.prototype.handleData = function(data){

	$.search('.stock-search');// 添加搜索

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
			newData.dates.push(data[i].min_time.substring(2,4)+'/'+ data[i].min_time.substring(4,6) +'-'+ data[i].min_time.substring(6,8));
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
	var result = [[],[],[]];
	for(var i = 0,j = 1,len = data.length; i < len-1; i++,j++){
		if(data[i].value < data[j].value){
			result[0].push([{
				xAxis:(function(){
					return self.candle_period < 6 ?
						data[i].start_time.substring(0,6) + '/' +data[i].start_time.substring(6,8) + ' ' +data[i].start_time.substring(8,10)+':'+ data[i].start_time.substring(10,12)
					:   data[i].start_time.substring(2,4) +'/'+ data[i].start_time.substring(4,6) + '-' +data[i].start_time.substring(6,8)
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
				yAxis: data[j].value,
				itemStyle: {
					normal: {color: 'rgb(41,60,85)'}
				}
			}]);
			result[2].push({
				coord: [(function(){
					return self.candle_period < 6 ?
						data[i].start_time.substring(0,6) + '/' +data[i].start_time.substring(6,8) + ' ' +data[i].start_time.substring(8,10)+':'+ data[i].start_time.substring(10,12)
					:   data[i].start_time.substring(2,4) +'/'+ data[i].start_time.substring(4,6) + '-' +data[i].start_time.substring(6,8)
				})(),data[i].value],
				value: data[i].value,
				symbolSize:[60,50],
				itemStyle: {
					normal: {color: 'green'}
				}
			})
			result[2].push({
				coord: [(function(){
					return self.candle_period < 6 ?
						data[j].start_time.substring(0,6) + '/' + data[j].start_time.substring(6,8) + ' ' + data[j].start_time.substring(8,10)+':'+ data[j].start_time.substring(10,12)
					:   data[j].start_time.substring(2,4) + '/' + data[j].start_time.substring(4,6) +'-'+ data[j].start_time.substring(6,8) 
				})(),data[j].value],
				value: data[i].value,
				symbolSize:[60,50],
				itemStyle: {
					normal: {color: 'red'}
				}
			})
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
			}]);
			result[2].push({
				coord: [(function(){
					return self.candle_period < 6 ?
						data[i].start_time.substring(0,6) + '/' +data[i].start_time.substring(6,8) + ' ' +data[i].start_time.substring(8,10)+':'+ data[i].start_time.substring(10,12)
					:   data[i].start_time.substring(2,4) +'/'+ data[i].start_time.substring(4,6) + '-' +data[i].start_time.substring(6,8)
				})(),data[i].value],
				value: data[i].value,
				symbolSize:[60,50],
				itemStyle: {
					normal: {color: 'green'}
				}
			})
			result[2].push({
				coord: [(function(){
					return self.candle_period < 6 ?
						data[j].start_time.substring(0,6) + '/' +data[i].start_time.substring(6,8) + ' ' +data[i].start_time.substring(8,10)+':'+ data[i].start_time.substring(10,12)
					:   data[j].start_time.substring(2,4) +'/'+ data[i].start_time.substring(4,6) + '-' +data[i].start_time.substring(6,8)
				})(),data[i].value],
				value: data[i].value,
				symbolSize:[60,50],
				itemStyle: {
					normal: {color: 'red'}
				}
			})
		}

	}
	if(data2){
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
			result[2].push({
					coord: [xAxis2,data2[i].low_tail],
					value: data2[i].low_tail,
					symbolSize:[60,50],
					itemStyle: {
						normal: {color: 'rgb(41,60,85)'}
					}
				});
			result[2].push({
					coord: [xAxis2,data2[i].high_head],
					value: data2[i].high_head,
					symbolSize:[60,50],
					itemStyle: {
						normal: {color: 'rgb(41,60,85)'}
					}
				})
		}
	}	
	return result;
}

xrz.extendedTime =function (day){
		var time = xrz.getTime(day,true);
		return '' + time[0] + time[1] + time[2]
	}
xrz.init = function(){  
	xrz.isAdd = true;
	xrz.time1 =  xrz.getTime('1',true),
	xrz.time2 = xrz.extendedTime('-730');
	xrz.time4 = xrz.extendedTime('-1460');
	xrz.vam;
	xrz.macd;
	xrz.data;
	xrz.start_date = xrz.extendedTime('-15') + '0930';
	xrz.end_date = xrz.time1[0] +''+ xrz.time1[1] + xrz.time1[2] + '0930';
	xrz.candle_period = 2;
	xrz.prod_code = xrz.prod_code || window.location.href.split('?')[1].split('=')[1]; 
	xrz.stock_abbr_name = 1;
	xrz.chars = [];
	var Time = null;

	function $alert(html){ // 提示框
		clearTimeout(Time);
		Time = setTimeout(function(){
			$alert.alert.addClass('opacity0');
		},500)
		if($alert.alert){
			$alert.alert.html(html).show().removeClass('opacity0');
		}else{
			$alert.alert = $('.lr-alert');
			$alert.alert.html(html).show().removeClass('opacity0');
			$alert.alert.on('webkitTransitionEnd transitionEnd',function(){
				$(this).hide();
			})
		}
	}
			
	var u_id = window.localStorage.getItem("xrzU_id");

	xrz.getSuffix();
	
	$.xrzGet(['u_id='+u_id],'get',function(data){ // 关注、取消关注
		if(data.status == 200 && data.msg == "OK"){
			var addedCodes = [];
			data.data.forEach(function(value){
				addedCodes.push(value.code)
			})
			if(addedCodes.indexOf(xrz.prod_code) == -1){
				$('.attention').attr('src','images/add-stock.png').addClass('canAdd');
			}else if(data.data.length > 0){
				$('.attention').attr('src','images/remove-sotck.png').removeClass('canAdd');
			}

		}
	});
	$('.attention').on('touchend',function(){
		var self = this;
		$.member('mystock',function(){
			if($(self).hasClass('canAdd')){
				$.xrzGet(['code='+xrz.prod_code,'u_id='+u_id],'pass',function(data){
					if(data.data == true){
						$(self).attr('src','images/remove-sotck.png').removeClass('canAdd');
						$alert('已添加自选');
					}
				});
			}else{
				$.xrzGet(['code='+xrz.prod_code,'u_id='+u_id],'delete',function(data){
					if(data.data.msg == "删除成功"){
						$(self).attr('src','images/add-stock.png').addClass('canAdd');
						$alert('已删除自选')
					}
				});
			}
		})
	})

	xrz.options.chars[0] = echarts.init(document.getElementById('stock-k')); 
	xrz.options.chars[1] = echarts.init(document.getElementById('stock-line')); 
	xrz.options.chars[2] = echarts.init(document.getElementById('stock-macd'));

	xrz.options.chars[0].group = 'group1';
	xrz.options.chars[1].group = 'group1';
	xrz.options.chars[2].group = 'group1';
	echarts.connect('group1');

	$('.stock-line-macd').on('touchend',function(event){
		event.preventDefault();
		if($(this.children[0]).css('visibility') == 'hidden'){
			$('.stock-line-information-wrap').children().eq(0).addClass('hide');
			$('.stock-line-information-wrap').children().eq(1).removeClass('hide');
			$(this.children[0]).css('visibility','visible')
			$(this.children[1]).css('visibility','hidden')
		}else{
			$('.stock-line-information-wrap').children().eq(0).removeClass('hide');
			$('.stock-line-information-wrap').children().eq(1).addClass('hide');
			$(this.children[0]).css('visibility','hidden')
			$(this.children[1]).css('visibility','visible')
		}
	})

	$('.average').on('touchend',function(){//均线
		$(this).toggleClass('no-choose');
		xrz.options.chars[0].dispatchAction({
			type:'legendToggleSelect',
			name:'ma5'
		})
		xrz.options.chars[0].dispatchAction({
			type:'legendToggleSelect',
			name:'ma10'
		})
		xrz.options.chars[0].dispatchAction({
			type:'legendToggleSelect',
			name:'ma20'
		})
		xrz.options.chars[0].dispatchAction({
			type:'legendToggleSelect',
			name:'ma30'
		})
	})

	$('.minute-nav').on('touchend',function(){
		$('.stock-choose-day').removeClass('close');
		$('.mask1').addClass('mask-zIndex').show();
	})
	$('.stock-close').on('touchend',function(){
		$('.stock-choose-day').addClass('close');
		setTimeout(function(){
			$('.mask1').removeClass('mask-zIndex').hide();
		},200)
	})
}
var d = '';
xrz.fixed = function(nub,index){
	var num2= nub.toFixed(3),
		index = (index + 1) || 3;
	return num2.substring(0,num2.lastIndexOf('.')+index)
}
xrz.getSuffix = function(data){

	xrz.setJsonp(api_url+'api/chanlun/v1/quote/snapshot?prod_code='+ xrz.prod_code +'&fields=business_amount,business_balance,px_change_rate,last_px,business_balance,business_amount,down_px,current_amount,vol_ratio,amplitude,bid_grp,offer_grp,market_value,circulation_value,dyn_pb_rate,pe_rate,turnover_ratio,trade_status,business_amount_in,up_px,px_change,open_px,high_px,low_px,preclose_px&callback=xrz.setData')

	xrz.setJsonp(api_url+'api/chanlun/v1/quote/macd',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getMacd');
	xrz.setJsonp(api_url+'api/chanlun/v1/quote/cldata',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getVam');
	xrz.setJsonp(api_url+'api/chanlun/v1/quote/kline',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getData');
}
xrz.getVam = function (data){
	xrz.vam = xrz.calculateMAV(data);
	
	if(xrz.data && xrz.vam && xrz.macd){
		xrz.InitEchars(xrz.data,xrz.vam,xrz.macd)
	}
}

xrz.getMacd = function (data){
	xrz.macd = xrz.calculateMacd(data)

	if(xrz.data && xrz.vam && xrz.macd){
		xrz.InitEchars(xrz.data,xrz.vam,xrz.macd)
	}
}
xrz.getData = function (data){
	xrz.data = data.data.candle.candle_detail_data;
	
	if(xrz.data && xrz.vam && xrz.macd){
		xrz.InitEchars(xrz.data,xrz.vam,xrz.macd)
	}
}
xrz.InitEchars = function(data,vam,macd){
	$('.mask1').removeClass('mask-zIndex').hide();
	$('.prompt-box').hide();
	setTimeout(function(){
		xrz.isAdd = false;
	},200)
	var char = new InitEchars(data,vam,macd,xrz.candle_period,xrz.options);
	xrz.data = xrz.macd = xrz.vam = false;
}	
xrz.setData = function setData(data){
	$('.mask1').show();
	$('.prompt-box').show();
	data = data.data.snapshot.snapshot_detail_data;
	$('.stock-title p').each(function(i){ // title 设置
		if(i == 0){
			xrz.codeName = this.innerHTML = data.prod_name;
		}else if(i == 1){
			this.innerHTML = xrz.prod_code.split('.')[0];
		}
	})
	$('.index-informations-top p').each(function(i){
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
	$('.stock-information2 span').each(function(i){
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
			case 4:
				if(data.up_px !== 0){
					$(this).addClass('up');
					this.innerHTML = (data.up_px).toFixed(2)
				}else{
					this.innerHTML = '-';
				}
				break;
			case 5:
				if(data.down_px !== 0){
					$(this).addClass('down');
					this.innerHTML = (data.down_px).toFixed(2)
				}else{
					this.innerHTML = '-';
				}
				break;      
			case 6:
				this.innerHTML = data.market_value !== 0 ? ((parseInt(data.market_value*10000/1000000000000) == data.market_value*10000/1000000000000 ? data.market_value*10000/1000000000000 : (data.market_value*10000/1000000000000).toFixed(1))+'亿') : '-';
				break;
			case 7:
				this.innerHTML = data.circulation_value !== 0 ? ((parseInt(data.circulation_value*10000/1000000000000) == data.circulation_value*10000/1000000000000 ? data.circulation_value*10000/1000000000000 : (data.circulation_value*10000/1000000000000).toFixed(1)) + '亿') : '-' ;
				break;
			case 8:
				this.innerHTML = data.dyn_pb_rate !== 0 ? (data.dyn_pb_rate*10).toFixed(2) : '-';
				break;
			case 9:
				this.innerHTML = data.pe_rate !== 0 ? (parseInt(data.pe_rate*10) == data.pe_rate*10 ? data.pe_rate*10 : (data.pe_rate*10).toFixed(2)) : '-';
				break;
			case 10:
				this.innerHTML = data.current_amount !== 0 ? ((data.current_amount*10000/100000000).toFixed(2) + '万') : '-';
				break;              
		}
	})

	$('.spread').on('touchstart',function(event){
		event.preventDefault();
	}).on('touchend',function(event){
		event.preventDefault();
		if($('.stock-information2').css('overflow') =='visible'){
			$('.stock-information2').removeClass('expand').css('overflow','hidden');
			$('.second-stock-information2').hide();
			$('.mask1').hide();
		}else{
			$('.stock-information2').addClass('expand').css('overflow','visible');
			$('.second-stock-information2').show();
			$('.mask1').show();
		}
	})
}
xrz.setJsonp =  function(url,prod_code,candle_period,candle_mode,start_date,end_date,callback){
			arguments.length > 1 ? 
					url = (url + '?prod_code=' + prod_code + '&candle_period=' + candle_period + '&candle_mode=' + candle_mode + '&start_date=' + start_date + '&end_date=' + end_date + '&callback=' + callback)
				:   url = url;
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

	xrz.init();

	var stockNav = $('.stock-k-move').eq(0),
		moveWidth = parseInt($('.stock-k-move').width()) - parseInt($('.stock-k-nav2-wrap').width());
		
	var isMove = 'nomove';  

	stockNav.on('touchstart',function(event){
		this.disX = event.touches[0].clientX;
		this.disY = event.touches[0].clientY;
		this.left = parseInt($(this).css('left'));
	}).on('touchmove',function(event){
		isMove = 'ismove';
		var x = event.changedTouches[0].clientX - this.disX,
			y = event.changedTouches[0].clientY - this.disY,
			moveX = this.left + x;
		if(Math.abs(x) > Math.abs(y)){
			if(moveX > 0){
				moveX = 0;
			}else if(moveX < -moveWidth){
				moveX = -moveWidth;
			}
			$(this).css('left',moveX)
		}   
	}).on('touchend',function(){
		isMove = 'nomove';
	});

	$('.stock-choose').on('touchend',function(){
		if(isMove !== 'nomove' || xrz.isAdd) return;
		xrz.start_date = xrz.time2;

		switch(parseInt($(this).attr('data-chooseId'))){
			case 0: //5分
				xrz.candle_period = 2;
				xrz.start_date = xrz.extendedTime('-15') + '0930';
				break;
			case 1: //15分
				xrz.candle_period = 3;
				xrz.start_date = xrz.extendedTime('-45') + '0930';
				break;
			case 2: //30分
				xrz.candle_period = 4;
				xrz.start_date = xrz.extendedTime('-90') + '0930';
				break;
			case 3: //60分
				xrz.candle_period = 5;
				xrz.start_date = xrz.extendedTime('-180') + '0930';
				break;      
			case 4: //日
				xrz.candle_period = 6;
				break;
			case 5: //周
				xrz.candle_period = 7;
				break;
			case 6: //月
				xrz.candle_period = 8;
				xrz.start_date = xrz.time4;
				break;              
		}
		xrz.isAdd = true;
		$('.mask1').addClass('mask-zIndex').show();
		$('.stock-choose.act').removeClass('act');
		$(this).addClass('act');
		if(xrz.candle_period >=2 && xrz.candle_period <= 5){
			xrz.end_date = xrz.time1[0] +''+ xrz.time1[1]+xrz.time1[2] + '0930';
			$('.stock-choose-day').addClass('close');
			$('.minute-nav').addClass('act');
			$('.prompt-box').show();
			xrz.setJsonp(api_url+'api/chanlun/v1/quote/cldata',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getVam');
			xrz.setJsonp(api_url+'api/chanlun/v1/quote/macd',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getMacd');
			xrz.setJsonp(api_url+'api/chanlun/v1/quote/kline',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getData');
			return;
		}else{
			$('.minute-nav').removeClass('act');
			xrz.end_date = xrz.time1[0] +''+ xrz.time1[1]+xrz.time1[2];
		}

		$('.prompt-box').show();
		xrz.setJsonp(api_url+'api/chanlun/v1/quote/cldata',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getVam');
		xrz.setJsonp(api_url+'api/chanlun/v1/quote/macd',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getMacd');
		xrz.setJsonp(api_url+'api/chanlun/v1/quote/kline',xrz.prod_code,xrz.candle_period,'0',xrz.start_date,xrz.end_date,'xrz.getData');
	})

	$('body').on('touchmove', function (event) {
		if(isMove == 'ismove'){
			event.preventDefault();
		}
	});
})

