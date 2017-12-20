define([], function() {
	var PortraitController = {
		ServiceType: 'controller',
		ServiceName: 'PortraitCtrl',
		ViewModelName: 'PortraitViewModel',
		ServiceContent: ['$scope', 'setDateConf', function($scope, setDateConf) {
			var echarts = require('echarts');
			var $model = $scope.$model;
			var myChart2 = echarts.init(document.getElementById("sunPie"));
			//获取时间当前年月
			var date = new Date(); //获取系统当前时间
			var year = date.getFullYear();
			var month1 = date.getMonth() == 12 ? 1 : date.getMonth()+1;
			var month2 = date.getMonth();
			var month3 = date.getMonth() == 1 ? 12 : date.getMonth()-1;
			var day = date.getDate() - 1;
			month1 = (month1 < 10 ? "0" + month1 : month1);
			month2 = (month2 < 10 ? "0" + month2 : month2);
			month3 = (month3 < 10 ? "0" + month3 : month3);
			var endTime = (year.toString() + '-' + month1.toString() + "-" + day.toString());
			var mydate1 = (year.toString() + '年' + month1.toString() + "月");
			var mydate2 = (year.toString() + '年' + month2.toString() + "月");
			var mydate3 = (year.toString() + '年' + month3.toString() + "月");
			$(".topTitle1").html(mydate1 + "(当月)扫码烟包数");
			$(".topTitle2").html(mydate2 + "(上月)扫码烟包数");
			$(".topTitle3").html(mydate3 + "(上上月)扫码烟包数");
			//			15910352745

			var mobileNo = window.sessionStorage.getItem("mobileNo");
			if(mobileNo) {
				$('.input_text').val(mobileNo);

				//查询弹窗
				$scope.chaXun = function() {
					var mobileNo = $('.input_text').val();
					//					console.log(mobileNo)

					var PhoneNo = {
						mobileNo: mobileNo
					}

					if(mobileNo.match(/^1[34578]\d{9}$/)) {

						$model.$getPhoneNo(PhoneNo).then(function(res) {
							console.log(res);
							//							console.log(PhoneNo)
							if(res.data.length == 0) {
								alert("该手机号查询不到微信ID!");
								return false;
							} else {
								$('.gift_stop_box').modal('show');
								for(var i = 0; i < res.data.length; i++) {
									$scope.radioList = res.data;
									$scope.$apply();
									//									console.log($scope.radioList)
								}

							}
						})
					} else {
						alert("查询不到手机号！")
					}
				};
				//查询
				$scope.search = function() {
					var openId = $('input:radio[name="saotianxia"]:checked').nextAll("span").eq(1).html();
										console.log(openId)
					var mobileNo = $('.input_text').val();
					var params = {
						openId: openId,
						mobileNo: mobileNo
					}
					if(openId == null) {
						alert("请选择微信ID!");
						return false;
					} else {
						public(params)
					}
					window.sessionStorage.removeItem("mobileNo");
				}

			} else {
				//初始页面加载
				$('.input_text').val("17702147500");
				var mpbileNo = "17702147500";
				var openId = "osPmCv1yeLHfAOaFJcoMMgu-izJg";
				var params = {
					openId: openId,
					mobileNo: mobileNo
				}
				publicTwo(params);
				//查询弹窗
				$scope.chaXun = function() {
					var mobileNo = $('.input_text').val();
					//					console.log(mobileNo)

					var PhoneNo = {
						mobileNo: mobileNo
					}

					if(mobileNo.match(/^1[34578]\d{9}$/)) {

						$model.$getPhoneNo(PhoneNo).then(function(res) {
							console.log(res);
							//							console.log(PhoneNo)
							if(res.data.length == 0) {
								alert("该手机号查询不到微信ID!");
								return false;
							} else {
								$('.gift_stop_box').modal('show');
								for(var i = 0; i < res.data.length; i++) {
									$scope.radioList = res.data;
									$scope.$apply();
									//									console.log($scope.radioList)
								}

							}
						})
					} else {
						alert("查询不到手机号！")
					}
				};
				//查询
				$scope.search = function() {
					var openId = $('input:radio[name="saotianxia"]:checked').nextAll("span").eq(1).html();
					//					console.log(openId)
					var mobileNo = $('.input_text').val();
					var params = {
						openId: openId,
						mobileNo: mobileNo
					}
					if(openId == null) {
						alert("请选择微信ID!");
						return false;
					} else {
						public(params)
					}
					window.sessionStorage.removeItem("mobileNo");
				}

			}
			//各表单数据调用
			function public(params) {
				//用户基本信息
				(function() {
					var openId = $('input:radio[name="saotianxia"]:checked').nextAll("span").eq(1).html();
					var mobileNo = $('.input_text').val();
					//						console.log(mobileNo)
					var JiBenInfo = {
						openId: openId,
						mobileNo: mobileNo
					}
					$model.$getJiBenInfo(JiBenInfo).then(function(res) {
						//							console.log(res)
						$scope.itemList = res.data[0];
						$scope.$apply();
						$(".userSpan").html("(用户微信ID:&nbsp;&nbsp;" + openId + ")")
						if(res.data[0].woas == 0) {
							$(".questionOneAnswer").html("&nbsp;&nbsp;&nbsp;&nbsp;否")
						} else if(res.data[0].woas == 1) {
							$(".questionOneAnswer").html("&nbsp;&nbsp;&nbsp;&nbsp;是")
						}
					})
				})();
				//用户扫码频度分析
				(function() {
					var myChart = echarts.init(document.getElementById("main"));
					var option = $model.$citychart.data;
					var openId = $('input:radio[name="saotianxia"]:checked').nextAll("span").eq(1).html();
					var mobileNo = $('.input_text').val();
					endTime = endTime;
					var SaoPinFen = {
						openId: openId,
						mobileNo: mobileNo,
						endTime: endTime
					}
					option.xAxis[0].data = [];
					option.series[0].data = [];
					$model.$getSaoPinFen(SaoPinFen).then(function(res) {
						//							console.log(res);
						var res = res.data || [];
						for(var i = 0; i < res.length; i++) {
							option.xAxis[0].data.push(res[i].statDate);
							option.series[0].data.push(res[i].scanPv);
						}
						myChart.setOption(option, true);
					})
				})();

				//各地用户扫码结构分析
				(function() {
					var myChart3 = echarts.init(document.getElementById("zheXianPic"));
					var optionThree = $model.$hours.data;
					var openId = $('input:radio[name="saotianxia"]:checked').nextAll("span").eq(1).html();
					var mobileNo = $('.input_text').val();
					endTime = endTime;
					var SaoJieFen = {
						openId: openId,
						mobileNo: mobileNo,
						endTime: endTime
					}
					optionThree.xAxis.data = [];
					optionThree.series.data = [];
					$model.$getSaoJieFen(SaoJieFen).then(function(res) {
						console.log(res);
						var res = res.data || [];
						for(var i = 0; i < res.length; i++) {
							num = res[i].scanSmokeAvgVlue.toFixed(2);
							optionThree.xAxis.data.push(res[i].statDate);
							optionThree.series.data.push(num);
						}
						myChart3.setOption(optionThree, true)
					})

				})();
				//用户扫码轨迹
				(function() {

					var myChart4 = echarts.init(document.getElementById("saoGuiJi"));
					var optionFour = $model.$Guijichart.data;
					var openId = $('input:radio[name="saotianxia"]:checked').nextAll("span").eq(1).html();
					var mobileNo = $('.input_text').val();
					endTime = endTime;
					var SaoYanFen = {
						openId: openId,
						mobileNo: mobileNo,
						endTime: endTime
					}
					var dataX = dataX = []
					var datamdg = [
						['2017-01-01', '芙蓉王（硬细支）', 1],
						['2017-01-02', '白沙(精品二代)', 2],
						['2017-01-03', '芙蓉王（硬细支）', 1],
						['2017-01-04', '芙蓉王（硬细支）', 3],
						['2017-01-05', '芙蓉王（硬细支）', 1],
						['2017-01-06', '白沙(精品二代)', 1],
						['2017-01-07', '芙蓉王（硬细支）', 2],
						['2017-01-08', '芙蓉王（硬细支）', 0],
						['2017-01-09', '白沙(硬精品三代)', 0],
						['2017-01-10', '白沙(硬红运当头)', 1]
					];
					//						console.log(datamdg)
					var data = [];
					var dataY = [];
					optionFour.xAxis.data = [];
					optionFour.series.data = [];

					//						console.log(optionFour)

					$model.$getSaoYanFen(SaoYanFen).then(function(res) {
						//														console.log(res);
						var sum = 0;
						for(var i = 0; i < res.data.length; i++) {
							$scope.EffectScanPv = res.data;
							$scope.$apply();
							sum = sum + res.data[i].effectScanPv;
						}
						$(".effectScanPvSum").html("近30天扫码烟包数:&nbsp;&nbsp;" + sum + "包")
					})

					$model.$getSaoGeGuiFen(SaoYanFen).then(function(res) {
						//							console.log(res);
						var str = "";
						var str2 = "";
						var str3 = "";
						var res = res.data || [];
						//							console.log(optionFour.series.data)
						//去重
						Array.prototype.unique3 = function() {
							var res = [];
							var json = {};
							for(var j = 0; j < this.length; j++) {
								if(!json[this[j]]) {
									res.push(this[j]);
									json[this[j]] = 1;
								}
							}
							return res;
						}
						var result = [];
						var result2 = [];
						var result3 = [];
						for(var i = 0; i < res.length; i++) {
							str = res[i].productName;
							str2 = res[i].statDate;
							str3 = res[i].effectScanPv;
							result.push(str);
							result2.push(str2);
							result3.push(str3);
						}
						dataY = result.unique3();
						dataX = result2;
						var dataInfo = []
						for(var e = 0; e < res.length; e++) {

							data = result2[e] + ',' + result[e] + ',' + result3[e];
							datalist = data.split(",");
							//							console.log(data)

							dataInfo.push(datalist)
						}
						//							console.log(dataInfo)

						//循环遍历三组数据
						for(var a = 0; a < dataX.length; a++) {
							optionFour.xAxis.data.push(dataX[a])
						} //X轴
						for(var b = 0; b < dataY.length; b++) {
							optionFour.yAxis.data.push(dataY[b])
						} //Y轴
						for(var z = 0; z < dataInfo.length; z++) {
							optionFour.series.data.push(dataInfo[z])
						} //数据
						optionFour.series.symbolSize = function(data) {
							return Math.sqrt(data[2]) * 5;
						}

						optionFour.label.emphasis.formatter = function(param) {
							//							console.log(data)
							return param.data;
						};
						myChart4.setOption(optionFour, true)
					})

				})();

				//用户各规格扫码烟包数
				function getSupplyData() {
					var openId = $('input:radio[name="saotianxia"]:checked').nextAll("span").eq(1).html();
					var mobileNo = $('.input_text').val();
					var statDate = endTime;
					var tableInfo = {
						openId: openId,
						mobileNo: mobileNo,
						statDate: statDate
					}
					$model.$getTableInfo(tableInfo).then(function(res) {
						//							console.log(res);
						for(var i = 0; i < res.data.length; i++) {
							$scope.tableList = res.data;
							$scope.$apply();
							//								console.log($scope.tableList[0].monthPv)
						}

					})

				};
				getSupplyData();
				//各地用户扫码时段分析
				(function() {
					var optionTwo = myChart2.getOption();
					if (!optionTwo) {
						optionTwo = $model.$hourschart.data;
					}
					var openId = $('input:radio[name="saotianxia"]:checked').nextAll("span").eq(1).html();
					var mobileNo = $('.input_text').val();
					var SaoHourFen = {
						openId: openId,
						mobileNo: mobileNo,
						endTime: endTime
					}
					optionTwo.series[0].renderItem = function renderItem(params, api) {
						var values = [api.value(0), api.value(1)];
						var coord = api.coord(values);
						var size = api.size([1, 1], values);
						return {
							type: 'sector',
							shape: {
								cx: params.coordSys.cx,
								cy: params.coordSys.cy,
								r0: coord[2] - size[0] / 2,
								r: coord[2] + size[0] / 2,
								startAngle: coord[3] - size[1] / 2,
								endAngle: coord[3] + size[1] / 2
							},
							style: api.style({
								fill: "#a72e43"
							})
						};
					}
					optionTwo.series[0].data = [];
					optionTwo.angleAxis.data = [];

					$model.$getSaoHourFen(SaoHourFen).then(function(res) {
						console.log(res);
						var res = res.data || [];
						for(var i = 0; i < res.length; i++) {
							optionTwo.series[0].data.push(res[i].scanPv);
							optionTwo.angleAxis.data.push(res[i].timeh);
						}
						optionTwo.visualMap.max = _.max(optionTwo.series[0].data);
						myChart2.setOption(optionTwo)
					})

				})();
			}




			//调取openId
			function publicTwo(params) {
				//用户基本信息
				(function() {
					var openId = "osPmCv1yeLHfAOaFJcoMMgu-izJg";
					var mobileNo = "17702147500";
					//						console.log(mobileNo)
					var JiBenInfo = {
						openId: openId,
						mobileNo: mobileNo
					}
					$model.$getJiBenInfo(JiBenInfo).then(function(res) {
						//							console.log(res)
						$scope.itemList = res.data[0];
						$scope.$apply();
						$(".userSpan").html("(用户微信ID:&nbsp;&nbsp;" + openId + ")")
						if(res.data[0].woas == 0) {
							$(".questionOneAnswer").html("&nbsp;&nbsp;&nbsp;&nbsp;否")
						} else if(res.data[0].woas == 1) {
							$(".questionOneAnswer").html("&nbsp;&nbsp;&nbsp;&nbsp;是")
						}
					})
				})();
				//用户扫码频度分析
				(function() {
					var myChart = echarts.init(document.getElementById("main"));
					var option = $model.$citychart.data;
					var openId = "osPmCv1yeLHfAOaFJcoMMgu-izJg";
					var mobileNo = "17702147500";
					endTime = endTime;
					var SaoPinFen = {
						openId: openId,
						mobileNo: mobileNo,
						endTime: endTime
					}
					option.xAxis[0].data = [];
					option.series[0].data = [];
					$model.$getSaoPinFen(SaoPinFen).then(function(res) {
						//							console.log(res);
						var res = res.data || [];
						for(var i = 0; i < res.length; i++) {
							option.xAxis[0].data.push(res[i].statDate);
							option.series[0].data.push(res[i].scanPv);
						}
						myChart.setOption(option, true);
					})
				})();

				//各地用户扫码结构分析
				(function() {
					var myChart3 = echarts.init(document.getElementById("zheXianPic"));
					var optionThree = $model.$hours.data;
					var openId = "osPmCv1yeLHfAOaFJcoMMgu-izJg";
					var mobileNo = "17702147500";
					endTime = endTime;
					var SaoJieFen = {
						openId: openId,
						mobileNo: mobileNo,
						endTime: endTime
					}
					optionThree.xAxis.data = [];
					optionThree.series.data = [];
					$model.$getSaoJieFen(SaoJieFen).then(function(res) {
						console.log(res);
						var res = res.data || [];
						for(var i = 0; i < res.length; i++) {
							num = res[i].scanSmokeAvgVlue.toFixed(2);
							optionThree.xAxis.data.push(res[i].statDate);
							optionThree.series.data.push(num);
						}
						myChart3.setOption(optionThree, true)
					})

				})();
				//用户扫码轨迹
				(function() {

					var myChart4 = echarts.init(document.getElementById("saoGuiJi"));
					var optionFour = $model.$Guijichart.data;
					var openId = "osPmCv1yeLHfAOaFJcoMMgu-izJg";
					var mobileNo = "17702147500";
					endTime = endTime;
					var SaoYanFen = {
						openId: openId,
						mobileNo: mobileNo,
						endTime: endTime
					}
					var dataX = dataX = []
					var datamdg = [
						['2017-01-01', '芙蓉王（硬细支）', 1],
						['2017-01-02', '白沙(精品二代)', 2],
						['2017-01-03', '芙蓉王（硬细支）', 1],
						['2017-01-04', '芙蓉王（硬细支）', 3],
						['2017-01-05', '芙蓉王（硬细支）', 1],
						['2017-01-06', '白沙(精品二代)', 1],
						['2017-01-07', '芙蓉王（硬细支）', 2],
						['2017-01-08', '芙蓉王（硬细支）', 0],
						['2017-01-09', '白沙(硬精品三代)', 0],
						['2017-01-10', '白沙(硬红运当头)', 1]
					];
					//						console.log(datamdg)
					var data = [];
					var dataY = [];
					optionFour.xAxis.data = [];
					optionFour.series.data = [];

					//						console.log(optionFour)

					$model.$getSaoYanFen(SaoYanFen).then(function(res) {
						//														console.log(res);
						var sum = 0;
						for(var i = 0; i < res.data.length; i++) {
							$scope.EffectScanPv = res.data;
							$scope.$apply();
							sum = sum + res.data[i].effectScanPv;
						}
						$(".effectScanPvSum").html("近30天扫码烟包数:&nbsp;&nbsp;" + sum + "包")
					})

					$model.$getSaoGeGuiFen(SaoYanFen).then(function(res) {
						//							console.log(res);
						var str = "";
						var str2 = "";
						var str3 = "";
						var res = res.data || [];
						//							console.log(optionFour.series.data)
						//去重
						Array.prototype.unique3 = function() {
							var res = [];
							var json = {};
							for(var j = 0; j < this.length; j++) {
								if(!json[this[j]]) {
									res.push(this[j]);
									json[this[j]] = 1;
								}
							}
							return res;
						}
						var result = [];
						var result2 = [];
						var result3 = [];
						for(var i = 0; i < res.length; i++) {
							str = res[i].productName;
							str2 = res[i].statDate;
							str3 = res[i].effectScanPv;
							result.push(str);
							result2.push(str2);
							result3.push(str3);
						}
						dataY = result.unique3();
						dataX = result2;
						var dataInfo = []
						for(var e = 0; e < res.length; e++) {

							data = result2[e] + ',' + result[e] + ',' + result3[e];
							datalist = data.split(",");
							//							console.log(data)

							dataInfo.push(datalist)
						}
						//							console.log(dataInfo)

						//循环遍历三组数据
						for(var a = 0; a < dataX.length; a++) {
							optionFour.xAxis.data.push(dataX[a])
						} //X轴
						for(var b = 0; b < dataY.length; b++) {
							optionFour.yAxis.data.push(dataY[b])
						} //Y轴
						for(var z = 0; z < dataInfo.length; z++) {
							optionFour.series.data.push(dataInfo[z])
						} //数据
						optionFour.series.symbolSize = function(data) {
							return Math.sqrt(data[2]) * 5;
						}

						optionFour.label.emphasis.formatter = function(param) {
							//							console.log(data)
							return param.data;
						};
						myChart4.setOption(optionFour, true)
					})

				})();

				//用户各规格扫码烟包数
				function getSupplyData() {
					var openId = "osPmCv1yeLHfAOaFJcoMMgu-izJg";
					var mobileNo ="17702147500";
					var statDate = endTime;
					var tableInfo = {
						openId: openId,
						mobileNo: mobileNo,
						statDate: statDate
					}
					$model.$getTableInfo(tableInfo).then(function(res) {
						//							console.log(res);
						for(var i = 0; i < res.data.length; i++) {
							$scope.tableList = res.data;
							$scope.$apply();
							//								console.log($scope.tableList[0].monthPv)
						}

					})

				};
				getSupplyData();
				//各地用户扫码时段分析
				(function() {
					var optionTwo = myChart2.getOption();
					if (!optionTwo) {
						optionTwo = $model.$hourschart.data;
					}

					var openId = "osPmCv1yeLHfAOaFJcoMMgu-izJg";
					var mobileNo = "17702147500";
					endTime = endTime;
					var SaoHourFen = {
						openId: openId,
						mobileNo: mobileNo,
						endTime: endTime
					}
					optionTwo.series[0].renderItem = function renderItem(params, api) {
						var values = [api.value(0), api.value(1)];
						var coord = api.coord(values);
						var size = api.size([1, 1], values);
						return {
							type: 'sector',
							shape: {
								cx: params.coordSys.cx,
								cy: params.coordSys.cy,
								r0: coord[2] - size[0] / 2,
								r: coord[2] + size[0] / 2,
								startAngle: coord[3] - size[1] / 2,
								endAngle: coord[3] + size[1] / 2
							},
							style: api.style({
								fill: "#a72e43"
							})
						};
					}
					optionTwo.series[0].data = [];
					optionTwo.angleAxis.data = [];
					$model.$getSaoHourFen(SaoHourFen).then(function(res) {
						var res = res.data || [];
						for(var i = 0; i < res.length; i++) {
							optionTwo.series[0].data.push(res[i].scanPv);
							optionTwo.angleAxis.data.push(res[i].timeh);
						}
						optionTwo.visualMap.max = _.max(optionTwo.series[0].data);
						myChart2.setOption(optionTwo)
					})
				})();
			}
		}]
	};

	return PortraitController;
});