/**
 * Author: jinlinyong
 * Create Date: 2017-07-04
 * Description: theme
 */

define([], function() {
	var regionController = {
		ServiceType: 'controller',
		ServiceName: 'RegionCtrl',
		ViewModelName: 'regionViewModel',
		ServiceContent: ['$scope', 'setDateConf', 'dayFilter', function($scope, setDateConf, dayFilter) {
			var echarts = require('echarts');
			var $model = $scope.$model;
			setDateConf.init($(".region-search-r:nth-of-type(1)"), 'day');
			setDateConf.init($(".region-search-r:nth-of-type(3)"), 'month');
			var amonth = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
			var stattime = dayFilter.yesterday("date");
			var regionMonth = new Date().getFullYear() + "-" + amonth;
			$(".region-day").find("input").val(stattime);
			$(".region-month").find("input").val(regionMonth);
			//设置默认值
			var Default = {};
			//省份下拉列表
			(function() {
				$model.$getProvince().then(function(res) {
					var res = res.data || [];
					for(var i = 0; i < res.length; i++) {
						if(res[i].code === $model.$DefaultProvince.data[0].orgRegion) {
							// console.log($model.$DefaultProvince)
							$(".region-search-r .region").append("<option value=" + res[i].name + " selected>" + res[i].name + "</option>")
						} else {
							$(".region-search-r .region").append("<option value=" + res[i].name + ">" + res[i].name + "</option>");
						}
					}
					var curBrandName = $(".region-search-r .region").val();
					$model.$getCityName({
						provinceName: curBrandName
					}).then(function(res) {
						if(res.status == 200) {
							$scope.secondCategoryList = res.data;
							$scope.$apply();
						}
					});
					//页面加载
					Default = {
						"provinceName": $(".region-search-r .region").val(),
						"statTime": stattime,
						"statType": "day",
						"cityName": ''
					};
					public(Default);
				})
			})();

			//地市下拉列表
			$('.region-search-r .region').change(function() {
				var params = {
					provinceName: $(this).val()
				}
				$model.$getCityName(params).then(function(res) {
					if(res.status == 200) {
						$scope.secondCategoryList = res.data;
						$scope.$apply();
					}
				})

			});
			//周下拉列表
			(function() {
				$model.$getWeeks().then(function(res) {
					var res = res.data || [];
					for(var i = 0; i < res.length; i++) {
						$(".week").append("<option value=" + res[i].weekNo + ">" + res[i].weekNo + "</option>")
					}
				})
			})();

			//日期改变时
			$(".ui-search").change(function() {
				var Value = $(this).siblings(".region").val();
				var cityValue = $(this).siblings(".regions").val();
				$(".region-search-r").each(function(i) {
					$(".region-search-r").eq(i).hide();
				});
				$(".ui-search option").each(function(i) {
					$(".ui-search option").eq(i).attr("selected", false);
				})
				
				if($(this).val() === "month") {
					$("#month").attr("selected", "selected");
					$(".region-search-r").eq(2).show();
					$(".region-describle").text("仪表盘中间值确定方式：往前推两月（不包括本月）的均值")
				} else if($(this).val() === "day") {
					$("#day").attr("selected", "selected");
					$(".region-search-r").eq(0).show();
					$(".region-describle").text("仪表盘中间值确定方式：往前推7天（包括当天）的均值")
				} else {
					$("#week").attr("selected", "selected");
					$(".region-search-r").eq(1).show();
					$(".region-describle").text("仪表盘中间值确定方式：往前推四周（不包括本周）的均值")
				}
				$(".region option").each(function(i) {
					$(".region option").eq(i).attr("selected", false);
					$(".region").find("option[value=" + Value + "]").attr("selected", "selected");
				})
				$(".regions option").each(function(i) {
					$(".regions option").eq(i).attr("selected", false);
					$(".regions").find("option[value=" + cityValue + "]").attr("selected", "selected");
				})
			});
			//查询
			$scope.search = function($event) {
				var that = $event.target;
				// var reg = /(省|市|区)/;
				var params = {
					"provinceName": $(that).siblings(".region").val(),
					"cityName": $(that).siblings('.regions').val() == '全部' ? '' : $(that).siblings(".regions").val(),
					"statTime": $(that).siblings().hasClass("date-wrap") ?
						($(that).siblings(".date-wrap").data().date ? $(that).siblings(".date-wrap").data().date : $(that).siblings(".date-wrap").find("input").val()) : $(that).siblings(".week").val().substr(10, 10).replace(/\./g, "-"),
					"statType": $(that).siblings(".ui-search").val()
				}
				public(params);
			};

			function public(params) {
				//仪表盘
				(function() {
					var firstChart = echarts.init(document.getElementById("gauge-first"));
					var secondChart = echarts.init(document.getElementById("gauge-second"));
					var thirdChart = echarts.init(document.getElementById("gauge-third"));
					var option = $model.$gaugechart.data;
					var firChart = {
						"tooltip": option.tooltip,
						"series": _.cloneDeep(option.series)
					};
					var secChart = {
						"tooltip": option.tooltip,
						"series": _.cloneDeep(option.series)
					};
					var thrChart = {
						"tooltip": option.tooltip,
						"series": _.cloneDeep(option.series)
					};

					firChart.series[0].name = "扫码次数";
					secChart.series[0].name = "扫码烟包数";
					thrChart.series[0].name = "扫码人数";
					firChart.series[0].data[0].name = "扫码次数（单位：万）\n\n扫码总次数(包含重复扫码的情况)";
					secChart.series[0].data[0].name = "扫码烟包数（单位：万）\n\n扫码总条数和总包数(不包含重复扫码的情况)";
					thrChart.series[0].data[0].name = "扫码人数（单位：万）\n\n时间段内扫码用户去重后总人数";
					// console.log(firChart);
					$model.$getScanData(params).then(function(res) {
						var data = res.data[0] || {};
						firChart.series[0].data[0].value = data.scanPv / 10000;
						firChart.series[0].max = (data.scanAvgPv * 2 / 10000).toFixed(4);
						secChart.series[0].data[0].value = data.scanCode / 10000;
						secChart.series[0].max = (data.scanAvgCode * 2 / 10000).toFixed(4);
						thrChart.series[0].data[0].value = data.scanUv / 10000;
						thrChart.series[0].max = (data.scanAvgUv * 2 / 10000).toFixed(4);
						firstChart.setOption(firChart, true);
						secondChart.setOption(secChart, true);
						thirdChart.setOption(thrChart, true);
					})

				})();
				//扫码次数时刻趋势
				(function() {
					var myChart = echarts.init(document.getElementById("date-chart"));
					var option = $model.$datechart.data;
					var obj = {
						"扫码次数": {
							"name": "扫码次数",
							"type": "line",
							"lineStyle": {
								"normal": {
									"color": "#A7A393"
								}
							},
							"label": {
								"normal": {
									"show": true
								}
							},
							"itemStyle": {
								"normal": {
									"color": "#A7A393"
								}
							},
							"data": []
						},
						"扫码烟包数": {
							"name": "扫码烟包数",
							"type": "line",
							"lineStyle": {
								"normal": {
									"color": "#FF7525"
								}
							},
							"label": {
								"normal": {
									"show": true
								}
							},
							"itemStyle": {
								"normal": {
									"color": "#FF7525"
								}
							},
							"data": []
						},
						"扫码人数": {
							"name": "扫码人数",
							"type": "line",
							"lineStyle": {
								"normal": {
									"color": "#399BD2"
								}
							},
							"label": {
								"normal": {
									"show": true
								}
							},
							"itemStyle": {
								"normal": {
									"color": "#399BD2"
								}
							},
							"data": []
						}
					}
					var seriesArr = [];
					for(x in obj) {
						obj[x].data = [];
					}
					option.xAxis.data = [];
					$model.$dateTrend(params).then(function(res) {
						var res = res.data || [];
						for(var x in obj) {
							for(var i = 0; i < res.length; i++) {
								switch(x) {
									case "扫码次数":
										obj[x].data.push(res[i].scanPv);
										break;
									case '扫码烟包数':
										obj[x].data.push(res[i].scanCode);
										break;
									case '扫码人数':
										obj[x].data.push(res[i].scanUv);
										break;
									default:
								}
							}
						}
						
						for(var i = 0; i < res.length; i++) {
							//判断是周还是日月
							var x = res[i].statTime || res[i].weekNo;
							option.xAxis.data.push(x);
						}
						//页面几个复选框选中展示几条
						$(".date-trend input").each(function() {
							if($(this).is(":checked")) {
								seriesArr.push(obj[$(this)[0].name]);
							}
						})
						option.series = seriesArr;
						myChart.setOption(option, true);
					})
					$(".date-trend input").click(function() {
						seriesArr.length = 0;
						$(".date-trend input").each(function() {
							if($(this).is(":checked")) {
								seriesArr.push(obj[$(this)[0].name]);
							}
						})
						myChart.clear();
						myChart.setOption(option);
					})
				})();

				//扫码次数时刻趋势
				(function() {
					var myChart = echarts.init(document.getElementById("hours-chart"));
					var option = $model.$hourschart.data;
					// console.log(option);
					option.series[0].data = [];
					option.xAxis.data = [];
					$model.$hourTrend(params).then(function(res) {
						var res = res.data || [];
						for(var i = 0; i < res.length; i++) {
							option.series[0].data.push(res[i].scanPv);
							option.xAxis.data.push(res[i].statHour)
						}
						myChart.setOption(option, true)
					})

					//console.log(hoursChart.series[0].data);
				})();

				//扫码次数时间趋势
				(function() {
					var myChart = echarts.init(document.getElementById("plan-chart"));
					var option = $model.$planchart.data;
					var seriesArr = [];
					var obj = $model.$Default.data;
					for(x in obj) {
						obj[x].data = [];
					}
					option.xAxis.data = []
					$model.$timeTrend(params).then(function(res) {
						// console.log(res.data);
						var res = res.data || [];
						for(x in obj) {
							for(var i = 0; i < res.length; i++) {
								switch(x) {
									case "促销计划":
										obj[x].data.push(res[i].awardPutPv);
										break;
									case "抽奖次数":
										obj[x].data.push(res[i].drawPv);
										break;
									case "中奖数量":
										obj[x].data.push(res[i].drawResultPv);
										break;
									case "领取数量":
										obj[x].data.push(res[i].awardPayPv);
										break;
								}
							}
						}
						for(var i = 0; i < res.length; i++) {
							//判断是周还是日月
							var x = res[i].statTime || res[i].weekNo
							option.xAxis.data.push(x)
						}
						//页面几个复选框选中展示几条
						$(".plan input").each(function() {
							if($(this).is(":checked")) {
								seriesArr.push(obj[$(this)[0].name]);
							}
						})
						//seriesArr[0] = obj["促销计划"];
						myChart.setOption(option, true);
					})
					option.series = seriesArr;
					$(".plan input").click(function() {
						seriesArr.length = 0;
						$(".plan input").each(function() {
							if($(this).is(":checked")) {
								seriesArr.push(obj[$(this)[0].name]);
							}
						})
						myChart.clear();
						myChart.setOption(option);
					})
				})();

				//扫码包数时间趋势
				(function() {
					var myChart = echarts.init(document.getElementById("bag-chart"));
					var option = $model.$bagchart.data;
					var obj = {
						"盒": {
							"name": "盒",
							"type": "line",
							"lineStyle": {
								"normal": {
									"color": "#3fb6ed"
								}
							},
							"label": {
								"normal": {
									"show": true
								}
							},
							"itemStyle": {
								"normal": {
									"color": "#3fb6ed"
								}
							},
							"data": []
						},
						"条": {
							"name": "条",
							"type": "line",
							"lineStyle": {
								"normal": {
									"color": "#53bc9d"
								}
							},
							"label": {
								"normal": {
									"show": true
								}
							},
							"itemStyle": {
								"normal": {
									"color": "#53bc9d"
								}
							},
							"data": []
						}
					}
					var seriesArr = [];
					for(x in obj) {
						obj[x].data = [];
					}
					option.xAxis.data = [];
					$model.$bagTrend(params).then(function(res) {
						var res = res.data || [];
						for(x in obj) {
							for(var i = 0; i < res.length; i++) {
								switch(x) {
									case "盒":
										obj[x].data.push(res[i].scanCode);
										break;
									default:
										obj[x].data.push(res[i].scanPair);
										break;
								}
							}
						}
						for(var i = 0; i < res.length; i++) {
							//判断是周还是日月
							var x = res[i].statTime || res[i].weekNo;
							option.xAxis.data.push(x)
						}
						//页面几个复选框选中展示几条
						$(".bag input").each(function() {
							//console.log($(this)[0].name);
							if($(this).is(":checked")) {
								seriesArr.push(obj[$(this)[0].name]);
							}
						})
						option.series = seriesArr;
						myChart.setOption(option, true);
					})
					$(".bag input").click(function() {
						seriesArr.length = 0;
						$(".bag input").each(function() {
							//console.log($(this)[0].name);
							if($(this).is(":checked")) {
								seriesArr.push(obj[$(this)[0].name]);
							}
						})
						myChart.clear();
						myChart.setOption(option);
					})
				})();

				//前十规格扫码次数
				(function() {
					var myChart = echarts.init(document.getElementById("name-chart"));
					// var data = [1200, 1994, 2000, 3304, 2090, 2330, 2220];
					var option = $model.$namechart.data;
					option.series[0].data = [];
					option.xAxis[0].data = [];
					$model.$scanTimes(params).then(function(res) {
						var res = res.data || [];
						var Length = res.length > 15 ? 15 : res.length;
						if(!(res.toString() === [].toString())) {
							for(var i = 0; i < Length; i++) {
								option.xAxis[0].data.push(res[i].productName)

								option.series[0].data.push(res[i].scanPv)
							};
						}
						myChart.setOption(option, true);
					})
					// option.series[0].data = data;
				})();

				//获取各地市扫码次数数据
				function getCityTimesData(paramsObj){
					$model.$cityCodeTimes(paramsObj).then(function(res) {
						$scope.resData = res.data || [];
						if($scope.resData.length > 0){
							for(var i=0;i<$scope.resData.length;i++){
								//最大扫码次数
								if($scope.resData[i].rownum == 1){
									$scope.maxPv = $scope.resData[i].scanPv;
								}
								//最大扫码烟包数
								if($scope.resData[i].rownum2 == 1){
									$scope.maxCode = $scope.resData[i].scanCode;
								}
								//最大扫码人数
								if($scope.resData[i].rownum3 == 1){
									$scope.maxUv = $scope.resData[i].scanUv;
								}
							}
						}
						$scope.$apply();
					})
				}
				//各地市扫码扫码次数
				/*(function() {
					var myChart = echarts.init(document.getElementById("city-chart"));
					var option = $model.$citychart.data;
					option.xAxis[0].data = [];
					option.series[0].data = [];
					$model.$City(params).then(function(res) {
						var res = res.data || [];
						for(var i = 0; i < res.length; i++) {
							option.xAxis[0].data.push(res[i].cityName);
							option.series[0].data.push(res[i].scanPv);
						}
						myChart.setOption(option, true);
					})
				})();*/
				(function() {
					//默认根据扫码次数排序
					params.kpiType = 'pv';
					getCityTimesData(params);
				})();
				//根据扫码次数排序查询
				$scope.orderByPv = function(){
					params.kpiType = 'pv';
					getCityTimesData(params);
				}
				//根据扫码烟包数排序查询
				$scope.orderByCode = function(){
					params.kpiType = 'code';
					getCityTimesData(params);
				}
				//根据扫码人数排序查询
				$scope.orderByUv = function(){
					params.kpiType = 'uv';
					getCityTimesData(params);
				}
			}

		}]
	};

	return regionController;
});