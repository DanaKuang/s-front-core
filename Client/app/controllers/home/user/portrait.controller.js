define([], function() {
	var PortraitController = {
		ServiceType: 'controller',
		ServiceName: 'PortraitCtrl',
		ViewModelName: 'PortraitViewModel',
		ServiceContent: ['$scope', 'setDateConf', function($scope, setDateConf) {
			var echarts = require('echarts');
			var $model = $scope.$model;
			//获取时间当前年月
			var date = new Date(); //获取系统当前时间
			var year = date.getFullYear();
			var month1 = date.getMonth() + 1;
			var month2 = date.getMonth();
			var month3 = date.getMonth() - 1;
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
							//							console.log(res);
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
//					window.sessionStorage.removeItem("mobileNo");
				}

				function public(params) {
					//页面加载提示弹窗
					//			$('.jiaZai_box').modal('show');
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
							$(".userSpan").html("(用户微信ID:&nbsp;&nbsp;" +openId+")")
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
							//							console.log(res);
							var res = res.data || [];
							for(var i = 0; i < res.length; i++) {
								optionThree.xAxis.data.push(res[i].statDate);
								optionThree.series.data.push(res[i].scanSmokeAvgVlue);
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
						optionFour.series.symbolSize = function(data) {
							return Math.sqrt(data) / 0.05e1;
						}
						optionFour.label.emphasis.formatter = function(param) {
							return param.datas;
						};

						//						console.log(optionFour)
						optionFour.xAxis.data = [];
						optionFour.series.data = [];
						$model.$getSaoYanFen(SaoYanFen).then(function(res) {
							//							console.log(res);
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
							var res = res.data || [];
							for(var i = 0; i < res.length; i++) {
								optionFour.xAxis.data.push(res[i].statDate);
								optionFour.series.data.push(res[i].effectScanPv);
							}
							myChart4.setOption(optionFour, true)
						})

					})();

					//设置分页（备用）
					$scope.pageSize = 5; //每页显示多少条
					$scope.currentPageNumber = 1; //当前页数
					$scope.totalPage = 0; //总页数
					var initPage = {
						currentPageNumber: $scope.currentPageNumber,
						pageSize: $scope.pageSize
					};
					//创建分页工具
					function createPageTools(pageData) {
						$(".tcdPageCode").createPage({
							pageCount: pageData.allPages,
							current: pageData.currentPage,
							backFn: function(pageNum) {
								var curPageData = {
									currentPageNumber: pageNum,
									pageSize: $scope.pageSize
								};
								getSupplyData(curPageData);
							}
						});
					}
					//用户各规格扫码烟包数
					function getSupplyData(initPage) {
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
							//							var dataObj = res.data;
							//							$scope.supplyLists = dataObj.list;
							//							$scope.totalPage = dataObj.page.pageNumber;
							//							$scope.totalCount = dataObj.page.count;
							//							var pageObj = {
							//								allPages: dataObj.page.pageNumber,
							//								currentPage: dataObj.page.currentPageNumber
							//							};
							//							$scope.currentPageNumber = dataObj.page.currentPageNumber;
							//							if($(".tcdPageCode").createPage) {
							//								$(".tcdPageCode").remove();
							//							}
							//							$(".page_sec").append("<div class='tcdPageCode'></div>");
							//							$scope.$apply();
							//							createPageTools(pageObj);
						})

					};
					getSupplyData(initPage);
					//各地用户扫码时段分析
					(function() {

						var myChart2 = echarts.init(document.getElementById("sunPie"));
						var optionTwo = $model.$hourschart.data;

												console.log(optionTwo)
						var openId = $('input:radio[name="saotianxia"]:checked').nextAll("span").eq(1).html();
						var mobileNo = $('.input_text').val();
						endTime = endTime;
						var SaoHourFen = {
							openId: openId,
							mobileNo: mobileNo,
							endTime: endTime
						}
						optionTwo.series.renderItem = function renderItem(params, api) {
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
									startAngle: coord[3] - size[1],
									endAngle: coord[3] + size[1]
								},
								style: api.style({
									fill: api.visual('color')
								})
							};
						}
						optionTwo.series.data = [];
						optionTwo.angleAxis.data = [];

						$model.$getSaoHourFen(SaoHourFen).then(function(res) {
							//							console.log(res);
							var res = res.data || [];
							for(var i = 0; i < res.length; i++) {
								optionTwo.series.data.push(res[i].scanPv);
								optionTwo.angleAxis.data.push(res[i].timeh);
							}
							myChart2.setOption(optionTwo)
						})
//						optionTwo.visualMap.max = echarts.util.reduce(optionTwo.series.data, function(max, item) {
//							return Math.max(max, item);
//						}, -Infinity);
						console.log(optionTwo.series.data)
						console.log(optionTwo.visualMap.max)
					})();
				}

			} else {
				return false;

			}

		}]
	};

	return PortraitController;
});