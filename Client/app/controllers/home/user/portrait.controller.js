define([], function() {
	var PortraitController = {
		ServiceType: 'controller',
		ServiceName: 'PortraitCtrl',
		ViewModelName: 'PortraitViewModel',
		ServiceContent: ['$scope', 'setDateConf', function($scope, setDateConf) {
			var echarts = require('echarts');
			var $model = $scope.$model;
			var opendId ="";
//			var params;
			
			
			
			//查询弹窗
			$scope.chaXun = function() {
				$('.gift_stop_box').modal('show');
				var tellNo ="15910352745";
//				var tellNo = $('.input_text').val();
				var PhoneNo ={
					mobileNo: tellNo
				}
					
 				$model.$getPhoneNo(PhoneNo).then(function (res) {
 					console.log(res);
   					if(res.status == 200){
   						for(var i=0;i<res.data.length;i++){
   							$scope.radioList = res.data;
   							$scope.$apply();
   							console.log(radioList)
   						}
// 						$scope.giftList = res.data;
   					}else{
   						alert(3333)
   					}
 				})
			};
			//查询
            $scope.search = function () {
            	var openId="123456789";
				var tellNo ="15910352745";
                var params = {
                    openId:openId,
                    tellNo:tellNo
                }
               // console.log(params);
                public(params)
            };

			function public(params) {
				//页面加载提示弹窗
//			$('.jiaZai_box').modal('show');
				//用户基本信息
				(function() {
					var openId="123456789";
					var tellNo ="15910352745"; 
					var JiBenInfo={
						openId:openId,
						tellNo:tellNo
					}
					$model.$getJiBenInfo(JiBenInfo).then(function (res) {
						console.log(res)
						$scope.itemList = res.data[0];
						$scope.$apply();
					})
				})();
				//用户扫码频度分析
				(function() {
					var myChart = echarts.init(document.getElementById("main"));
					var option = $model.$citychart.data;
					var openId="123456789";
					var tellNo ="15910352745"; 
					var endTime = "2017-09-08";
					var SaoPinFen={
						openId:openId,
						tellNo:tellNo,
						endTime:endTime
					}
					option.xAxis[0].data = [];
                    option.series[0].data = [];
                    $model.$getSaoPinFen(SaoPinFen).then(function (res) {
                    	console.log(res);
                        var res = res.data || [];
                        for (var i = 0; i < res.length; i++) {
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
					var openId="123456789";
					var tellNo ="15910352745"; 
					var endTime = "2017-09-08";
					var SaoJieFen={
						openId:openId,
						tellNo:tellNo,
						endTime:endTime
					}
					optionThree.xAxis.data = [];
                    optionThree.series.data = [];
                    $model.$getSaoJieFen(SaoJieFen).then(function (res) {
                    	console.log(res);
                        var res = res.data || [];
                        for (var i = 0; i < res.length; i++) {
                            optionThree.xAxis.data.push(res[i].statDate);
                            optionThree.series.data.push(res[i].scanSmokeVlue);
                        }
                        myChart3.setOption(optionThree, true)
                    })

				})();
				//用户扫码轨迹
				(function() {

					var myChart4 = echarts.init(document.getElementById("saoGuiJi"));
					var optionFour = $model.$Guijichart.data;
					var openId="123456789";
					var tellNo ="15910352745"; 
					var statDate = "2017-09-08";
					var endTime = "2017-09-08";
					var SaoYanFen={
						openId:openId,
						tellNo:tellNo,
						endTime:endTime
					}
//					var SaoYanFen2={
//						openId:openId,
//						tellNo:tellNo,
//						statDate:statDate
//					}
					optionFour.series.symbolSize = function(data) {
						return Math.sqrt(data) / 0.5e1;
					}
					optionFour.label.emphasis.formatter = function(param) {
						return param.datas;
					};

					console.log(optionFour)
					optionFour.xAxis.data = [];
                    optionFour.series.data = [];
                    $model.$getSaoYanFen(SaoYanFen).then(function (res) {
                    	console.log(res);
                        for (var i = 0; i < res.data.length; i++) {
						$scope.EffectScanPv=res.data;
						$scope.apply();
						
                        }
                    })
                    $model.$getSaoGeGuiFen(SaoYanFen).then(function (res) {
                    	console.log(res);
                    	var res = res.data || [];
                        for (var i = 0; i < res.length; i++) {
						optionFour.xAxis.data.push(res[i].statDate);
                        optionFour.series.data.push(res[i].effectScanPv);
                        }
                        myChart4.setOption(optionFour, true)
                    })

				})();
				//用户各规格扫码烟包数
				(function() {
					var openId="123456789";
					var tellNo ="15910352745"; 
					var statDate = "2017-09-08";
					var tableInfo={
						openId:openId,
						tellNo:tellNo,
						statDate:statDate
					}
                    $model.$getTableInfo(tableInfo).then(function (res) {
                    	console.log(res);
                        for (var i = 0; i < res.data.length; i++) {
                        	$scope.tableList = res.data;
                        	$scope.$apply();
                        	console.log($scope.tableList[0].monthPv)
                        }
                    })

				})();
				//各地用户扫码时段分析
				(function() {

					var myChart2 = echarts.init(document.getElementById("sunPie"));
					var optionTwo = $model.$hourschart.data;
					
					console.log(optionTwo)
					var openId="123456789";
					var tellNo ="15910352745"; 
					var endTime = "2017-09-08";
					var SaoHourFen={
						openId:openId,
						tellNo:tellNo,
						endTime:endTime
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
					optionTwo.visualMap.max = echarts.util.reduce(optionTwo.series.data, function(max, item) {
						return Math.max(max, item);
					}, -Infinity);
					$model.$getSaoHourFen(SaoHourFen).then(function (res) {
                    	console.log(res);
                    	var res = res.data || [];
                        for (var i = 0; i < res.length; i++) {
                        optionTwo.series.data.push(res[i].scanPv);
                        optionTwo.angleAxis.data.push(res[i].timeh);
                        }
                        myChart2.setOption(optionTwo, true)
                    })
					

				})();

			}
		}]
	};

	return PortraitController;
});