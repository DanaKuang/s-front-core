/**
 * Author: liubin
 * Create Date: 2017-07-04
 * Description: report
 */

define([], function() {
	var formarReportController = {
		ServiceType: 'controller',
		ServiceName: 'formarReportCtrl',
		ViewModelName: 'formarReportViewModel',
		ServiceContent: ['$scope', 'setDateConf', 'dayFilter', function($scope, setDateConf, dayFilter) {
			var $model = $scope.$model;
			setDateConf.init($(".agree-date"), "day");
			//设置input的默认时间
			var stattime = dayFilter.yesterday("date");
			$(".date-wrap").find("input").val(stattime);
			var curTableIndex = '';
			var curWeekStr = '';
			var curSpeciftStr = '';
			
			//			var guiGeBihend= '';
			//页面默认加载配置
			$scope.obj = {
				"dt": stattime,
				"productBrand": "黄金叶",
				"productSn": "6901028165242",
				"provinceName": "",
				"cityName": ""
			};
			$scope.saoobj = {
				"dt": stattime,
				"activityName": "芙蓉王（硬细支）"
			};
			$scope.summar = {
				"dt": stattime,
				"productBrand": "黄金叶",
				"productSn": "6901028165242"
			};
			$scope.cashWinDataObj = {
				"dt": stattime
			};
			$scope.cashWinDataObjmdg = {
				"dt": stattime
			};
			//页面切换
			$scope.tabs = function(index) {
				$(".region-margin").hide();
				$(".region-margin").eq(index).show();
				switch(index) {
					case 1:
//						gloabl.getTitleHtml();
						gloabl.getBrand();
						gloabl.getProviceName();
						gloabl.winUser($scope.obj);
						break;
					case 2:
						gloabl.getZhongGift();
						gloabl.userPro($scope.saoobj);
						break;
					case 3:
						gloabl.getBrand();
						gloabl.summaryData($scope.summar)
						break;
					case 4:
						gloabl.getActivityName();
						break;
					case 5:
						gloabl.getProvData($scope.cashWinDataObj);
						break;
					case 6:
						gloabl.getWeekCashWinData($scope.cashWinDataObjmdg)
						break;
					default:

				}
			}
			var gloabl = {
				//品牌
				"getBrand": function() {
					$model.$getBrandData().then(function(res) {
						$scope.brandList = res.data || [];
						$scope.$apply();

						var curBrandName = $scope.brandList[0].name;

						$model.$getSpecifData({
							productBrand: curBrandName
						}).then(function(res) {
							$scope.speciftList = res.data || [];
							$scope.$apply();
							//							if($scope.speciftList.length > 0) {
							curSpeciftStr = $scope.speciftList[0].name;
							console.log(curSpeciftStr)
							//							}
						});

					});
				},
				//KPI数据分省统计日报
				"winUser": function(params) {
					$model.$winUser(params).then(function(res) {
						//						console.log(res)
						var res = res.data || [];
						var guiGeBihend = $("#proviceDataSpecift").val();
						//						curSpeciftStr = $scope.speciftList[0].name;
						console.log(guiGeBihend)
						var inputOne = $("#inputOne").val();
						$("#win_table").html("");
						$("#titlePOne").html('规格&nbsp;&nbsp;' + (guiGeBihend == null?'条-黄金叶（爱尚）':guiGeBihend) + '&nbsp;&nbsp;' + '(' + inputOne + ')');
						if(res.length > 0) {
							for(var i = 0; i < res.length; i++) {
								var curNum = i + 1;
								$("#win_table").append("<tr><td>" + res[i].provinceName + "</td><td>" + res[i].cityName + "</td><td>" + res[i].scanPv + "</td><td>" + res[i].scanUv + "</td><td>" + res[i].effectScanPv + "</td><td>" + res[i].scanUv + "</td><td>" + res[i].yearScanPv + "</td><td>" + res[i].yearScanPv + "</td><td>" + res[i].rafflePv + "</td><td>" + res[i].drawPv + "</td><td>" + res[i].drawRate + "</td><td>" + res[i].drawUv + "</td><td>" + res[i].redpacketFee + "</td><td>" + res[i].yearRedpacketFee + "</td></tr>");
							}
						} else {
							$("#win_table").append("<tr><td colspan='15'>暂无符合条件的数据</td></tr>");
						}
					})
				},

				//活动中奖统计日报
				"userPro": function(params) {
					$model.$getUserPro(params).then(function(res) {
						var res = res.data || [];
						$("#user_table").html("");
						var guiGeBihendTwo = $("#activityNameMdg").val();
						var inputTwo = $("#inputTwo").val();
						$("#titlePTwo").html('活动名称&nbsp;&nbsp;' + guiGeBihendTwo + '&nbsp;&nbsp;' + '(' + inputTwo + ')')
						if(res.length > 0) {
							for(var i = 0; i < res.length; i++) {
								$("#user_table").append("<tr><td>" + res[i].provinceName + "</td><td>" + res[i].cityName + "</td><td>" + res[i].rafflePv + "</td><td>" + res[i].drawPv + "</td><td>" + res[i].drawRate + "</td><td>" + res[i].addRafflePv + "</td><td>" + res[i].addDrawPv + "</td><td>" + res[i].addDrawRate + "</td></tr>");
							}
						} else {
							$("#user_table").append("<tr><td colspan='15'>暂无符合条件的数据</td></tr>");
						}
					})
				},
				//活动下拉菜单
				"getZhongGift": function() {
					$model.$getZhongGift().then(function(res) {
						$(".report-gui").find("select").html("");
						var res = res.data || [];
						for(var i = 0; i < res.length; i++) {
							if(res[i].activityName === '“爱尚”翻牌子，爱上赢红包') {
								$(".report-gui").find("select").append("<option value=" + res[i].activityName + " selected>" + res[i].activityName + "</option>")
							} else {
								$(".report-gui").find("select").append("<option value=" + res[i].activityName + ">" + res[i].activityName + "</option>")
							}
						}
						//						$scope.saoobj.productBrand = $(".report-gui").find("select").val();
						//console.log($scope.saoobj);
						//						gloabl.userPro($scope.saoobj);
					})
				},
				//活动多选框下拉菜单
				"getActivityName": function() {
					$model.$getZhongGiftTwo().then(function(res) {
						console.log(res)
						if(res.status == 200) {
							$scope.selectActivityNameList = res.data;
							$scope.$apply();
							$("select#activityName").multiselect({
								includeSelectAllOption: true,
								enableFiltering: true,
								nonSelectedText: '请选择',
								allSelectedText: '全部',
								nSelectedText: '已选择',
								selectAllText: '全部',
								selectAllValue: 'all',
								buttonWidth: '240px',
								maxHeight: '200px',
								numberDisplayed: 1
							});
							//							.report-search .multiselect-container li label
						}

					});

					//地市多选下拉框
					$model.$getSpeciftByBrandTwo().then(function(res) {
						console.log(res)
						if(res.status == 200) {
							$scope.selectActivityCityNameList = res.data;
							$scope.$apply();
							console.log($scope.selectActivityCityNameList)
							$("select#activityCityName").multiselect({
								nonSelectedText: '请选择',
								allSelectedText: '全部',
								includeSelectAllOption: true,
								enableFiltering: true,
								nSelectedText: '已选择',
								selectAllText: '全部',
								selectAllValue: 'all',
								buttonWidth: '240px',
								maxHeight: '200px',
								numberDisplayed: 1
							});
						}

					});
				},
//				"getTitleHtml":function(){
//					$("#titlePOne").html('规格&nbsp;&nbsp;' + '条-黄金叶（爱尚）' + '&nbsp;&nbsp;' + '(' + stattime + ')');
//				},
				"summaryData": function(params) {
					$model.$getsummaryData(params).then(function(res) {
						console.log(res);
						$("#summary_table").html("");
						var res = res.data || [];
						var summarProduct = $("#moneyDataSpecift").val();
						var summarDt = $(".summarDt").val();

						$(".report-table").find("tbody").html("");
						$(".titleTop").html("规格&nbsp;&nbsp;" + (summarProduct == null?'条-黄金叶（爱尚）':summarProduct) + "&nbsp;&nbsp;" + (summarDt));
						if(res.length > 0) {
							for(var i = 0; i < res.length; i++) {
								var curNum = i + 1;
								$("#summary_table").append("<tr><td>" + res[i].cityName + "</td><td>" + res[i].awardName + "</td><td>" + res[i].awardPrice + "</td><td>" + res[i].drawPv + "</td><td>" + res[i].drawFee + "</td><td>" + res[i].yearDrawPv + "</td><td>" + res[i].yearDrawFee + "</td></tr>");
							}
						} else {
							$("#summary_table").append("<tr><td colspan='15'>暂无符合条件的数据</td></tr>");
						}
					})
				},

				"getProviceName": function() {
					$model.$getProviceName().then(function(res) {
						//						console.log(res)

						if(res.status == 200) {
							$scope.brandListsss = res.data;
							//							console.log($scope.brandListsss)
							$scope.$apply();
							$("select#proviceName").multiselect({
								includeSelectAllOption: true,
								enableFiltering: true,
								nonSelectedText: '请选择',
								allSelectedText: '全部',
								nSelectedText: '已选择',
								selectAllText: '全部',
								selectAllValue: 'all',
								buttonWidth: '240px',
								maxHeight: '200px',
								numberDisplayed: 1
							});

						}
						$('[ng-model="selectAllBrands"]').multiselect('refresh');

					})

					$(document).ready(function() {
						$("select.multi").multiselect({
							includeSelectAllOption: true,
							enableFiltering: true,
							nonSelectedText: '请选择',
							allSelectedText: '全部',
							nSelectedText: '已选择',
							selectAllText: '全部',
							selectAllValue: 'all',
							buttonWidth: '240px',
							maxHeight: '200px',
							numberDisplayed: 1
						});
					});

					//监听省份选择信息
					$scope.$watch('selectAllBrands', function(n, o, s) {
						if(n !== "") {
							$scope.selectAllBrands = n;
							var brandListArrObj = {};
//							var aaa = n.join()
							brandListArrObj.provinceName = n.join();

							$model.$getSpeciftByBrand(brandListArrObj).then(function(res) {
								//                  	console.log(res)
								if(res.status == "200") {
									$scope.speciftListsss = res.data;
									$('[ng-model="selectSpeci"]').multiselect('dataprovider', _.forEach($scope.speciftListsss, function(v) {
										v.label = v.cityName;
										v.value = v.cityName;
									}));
									$('[ng-model="selectSpeci"]').multiselect('refresh');
								}
							})
						}
					});
					$scope.$watch('selectSpeci', function(n, o, s) {
						if(n !== "") {
							$scope.selectSpeci = n;
						}
					});

					//监听省份选择信息
					//          $('#proviceName').change(function(){
					//              var curBrandValue = $(this).val();
					//              console.log(curBrandValue)
					//              $model.$getSpeciftByBrand({brandCode:curBrandValue}).then(function(res){
					//              	console.log(res)
					//                  if(res.status == 200){
					//                      $scope.selectSpeciftList = res.data.data;
					//                      $scope.$apply();
					//                  }
					//              });
					//          });
				},
				//tab4
				'getWeekScanWinData': function(timesObj) {
					$model.$getWeekScanWinData(timesObj).then(function(res) {
						$("#weekScanWin").html('');
						console.log(res)
						var res = res.data || [];
						$(".report-table").find("tbody").html("");
						if(res.length > 0) {
							for(var i = 0; i < res.length; i++) {
								$("#weekScanWin").append("<tr><td>" + res[i].activityName + "</td><td>" + res[i].cityName + "</td><td>" + res[i].awardName + "</td><td>" + res[i].drawPv + "</td><td>" + res[i].yearDrawPv + "</td></tr>");
							}
						} else {
							$("#weekScanWin").append("<tr><td colspan='9'>暂无符合条件的数据</td></tr>");
						}

					})
				},
				//tab5
				'getProvData': function(params) {
					$model.$getProvData(params).then(function(res) {
						console.log(res)
						var res = res.data || [];
						$(".report-table").find("tbody").html("");
						if(res.length > 0) {
							for(var i = 0; i < res.length; i++) {
								$("#provDataDetail").append("<tr><td>" + res[i].cityName + "</td><td>" + (res[i].integralType == '0' ? '总计' : (res[i].integralType == '1' ? '盒包扫码获得积分' : (res[i].integralType == '2' ? '条包扫码获得积分' : (res[i].integralType == '3' ? '兑奖消耗积分' : '抽奖消耗积分')))) + "</td><td>" + (res[i].integralType == '0' ? '-' : res[i].integralValue) + "</td><td>" + res[i].addIntegralValue + "</td></tr>");
							}
						} else {
							$("#provDataDetail").append("<tr><td colspan='15'>暂无符合条件的数据</td></tr>");
						}
					})
				},
				//tab6
				'getWeekCashWinData': function(cashWinDataObjmdg) {
					$model.$getWeekCashWinData(cashWinDataObjmdg).then(function(res) {
						console.log(res);
						var res = res.data || [];
						$(".report-table").find("tbody").html("");
						if(res.length > 0) {
							for(var i = 0; i < res.length; i++) {
								var curNum = i + 1;
								$("#weekCashWin").append("<tr><td>" + res[i].resourceName + "</td><td class='td2'>" + res[i].cityName + "</td><td>" + res[i].integralExchangeCnt + "</td><td>" + res[i].addIntegralExchangeCnt + "</td></tr>");
							}
						} else {
							$("#weekCashWin").append("<tr><td colspan='15'>暂无符合条件的数据</td></tr>");
						}

					})
				}
			}
			//点击按钮的返回
			$scope.goback = function() {
				$(".region-margin").hide();
				$(".region-margin").eq(0).show();
				$("#proviceName").multiselect().val([]).multiselect("refresh");
				$("#applySpecift").multiselect().val([]).multiselect("refresh");
				console.log($("#proviceName").multiselect().val([]))
				$("#activityName").multiselect().val([]).multiselect("refresh");
				$("#activityCityName").multiselect().val([]).multiselect("refresh");

				$('#brand').val('');
				$('#specift').val('');
				$('#proviceName').val('');
				$('#user_table').html('');
				$('#win_table').html('');
				$('#weekScanWin').html('');
				$('#summary_table').html('');
				$('#provDataDetail').html('');
				$('#weekCashWin').html('');
				$('#applySpecift').val('');
				$('#activityName').val('');
				$('#activityCityName').val('');
				if($scope.speciftList != undefined && $scope.speciftList.length > 0) {
					$scope.speciftList.length = 0;
				}
				if($scope.speciftListsss != undefined && $scope.speciftListsss.length > 0) {
					$scope.speciftListsss.length = 0;
				}
				if($scope.selectActivityNameList != undefined && $scope.selectActivityNameList.length > 0) {
					$scope.selectActivityNameList.length = 0;
				}
				$("#proviceDataSpecift").val();
				$('#packs').multiselect().val([]).multiselect("refresh");
				$('#cycleTime').multiselect().val([]).multiselect("refresh");
				$('#cashWinSpecift').val('');
				$('#entityWinSpecift').val('');
			}

			//查询按钮
			$scope.search = function($event) {
				var that = $event.target;

				switch(arguments[1]) {
					case 1:
						$scope.obj = {
							"productBrand": $("#proviceDataBrand").val(),
							"dt": $(that).siblings(".agree-date").find(".date-wrap").data().date ?
								$(that).siblings(".agree-date").find(".date-wrap").data().date : $(that).siblings(".agree-date").find("input").val(),
							"productSn": $(".mengdeguo").find("select option:selected").attr("data-sn"),
							"provinceName": $("#proviceName").val().join(),
							"cityName": $("#applySpecift").val().join()
						}
						gloabl.winUser($scope.obj);
						break;
					case 2:
						$scope.saoobj = {
							"activityName": $(that).siblings(".report-gui").find("select").val(),

							"dt": $(that).siblings(".agree-date").find(".date-wrap").data().date ?
								$(that).siblings(".agree-date").find(".date-wrap").data().date : $(that).siblings(".agree-date").find("input").val(),
						}
						gloabl.userPro($scope.saoobj);
						break;
					case 3:
						$scope.summar = {
							"dt": $(that).siblings(".agree-date").find(".date-wrap").data().date ?
								$(that).siblings(".agree-date").find(".date-wrap").data().date : $(that).siblings(".agree-date").find("input").val(),
							"productBrand": $("#moneyDataBrand").val(),
							"productSn": $(".mengdeguoTwo").find("select option:selected").attr("data-sn")
							//								"productSn":"6901028165235"
						}
						gloabl.summaryData($scope.summar);
						break;
					case 4:

						$scope.winDataObj = {
							'activityName': $("#activityName").val().join(),
							'cityName': $("#activityCityName").val().join(),
							'awardName': $("#inputSou").val()
						}

						gloabl.getWeekScanWinData($scope.winDataObj);
						break;
					case 5:

						$scope.cashWinDataObj = {
							'dt': $('#jifenData').val(),
						}
						gloabl.getProvData($scope.cashWinDataObj);
						break;
					case 6:
						$scope.cashWinDataObjmdg = {
							'dt': $('#cashWinWeeks').val(),
						}
						gloabl.getWeekCashWinData($scope.cashWinDataObjmdg);
						break;
					default:
				}
			}
			//转化undefined为0
			function formatNum(formarStr) {
				if(formarStr == undefined) {
					return 0;
				}
				return formarStr;
			}
			//下载
			$scope.down = function(a) {
				// var pathName=window.document.location.pathname;
				// var ctxName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
				if(a === 1) {
					var data = {
						"dt": $scope.obj.dt,
						"productBrand": $scope.obj.productBrand,
						"productSn": $scope.obj.productSn,
						"provinceName": $scope.obj.provinceName,
						"cityName": $scope.obj.cityName
					}
					var url = "/api/tztx/dataportal/henanreport/importProvReportData";
				} else if(a === 2) {
					var data = {
						"dt": $scope.saoobj.dt,
						"activityName": $scope.saoobj.activityName
					}
					var url = "/api/tztx/dataportal/henanreport/importActReportData";
				} else if(a === 3) {
					var data = {
						"dt": $scope.summar.dt,
						"productBrand": $scope.summar.productBrand,
						"productSn": $scope.summar.productSn,

					}
					var url = "/api/tztx/dataportal/henanreport/importRedPacketReportData";
					// var statTime = $scope.summar.statTime;
					// window.location.href = '/fixatreport/importExcelDailySummData?staTime=' + statTime
				} else if(a === 4) {
					var data = {
						'activityName': $scope.winDataObj.activityName,
						'cityName': $scope.winDataObj.cityName,
						'awardName': $scope.winDataObj.awardName
					}
					var url = "/api/tztx/dataportal/henanreport/importObjectReportData";
				} else if(a === 5) {
					var data = {
						'dt': $scope.cashWinDataObj.dt
					}
					//					if(curSpeciftStr != '' && curWeekStr != '') {
					//						// console.log(curSpeciftStr + ':' + curWeekStr);
					//						data.tableTitle = curSpeciftStr + '扫码数据汇总(' + curWeekStr + ')';
					//					}
					var url = "/api/tztx/dataportal/henanreport/importIntegralDarwReportData";
				} else if(a === 6) {
					var data = {
						'dt': $scope.cashWinDataObjmdg.dt
					}
					var url = "/api/tztx/dataportal/henanreport/importIntegralListReportData";
				}
				var xhr = new XMLHttpRequest();
				var formData = new FormData();
				for(var attr in data) {
					formData.append(attr, data[attr]);
				}
				xhr.overrideMimeType("text/plain; charset=x-user-defined");
				xhr.open('POST', url, true);
				xhr.responseType = "blob";
				xhr.responseType = "arraybuffer"
				xhr.setRequestHeader("token", sessionStorage.getItem('access_token'));
				xhr.setRequestHeader("loginId", sessionStorage.getItem('access_loginId'));
				xhr.onload = function(res) {
					if(this.status == 200) {
						var blob = new Blob([this.response], {
							type: 'application/vnd.ms-excel'
						});
						var respHeader = xhr.getResponseHeader("Content-Disposition");
						var fileName = decodeURI(respHeader.match(/filename=(.*?)(;|$)/)[1]);
						if(window.navigator.msSaveOrOpenBlob) {
							navigator.msSaveBlob(blob, fileName);
						} else {
							var link = document.createElement('a');
							link.href = window.URL.createObjectURL(blob);
							link.download = fileName;
							link.click();
							window.URL.revokeObjectURL(link.href);
						}
					}
				};
				xhr.send(formData);
			}
			//监听品牌变化			
			$('#moneyDataBrand').change(function() {
				var curBrandValue = $(this).val();
				$model.$getSpecifData({
					productBrand: curBrandValue
				}).then(function(res) {
					$scope.speciftList = res.data || [];
					$scope.$apply();
				});
			});
			$('#proviceDataBrand').change(function() {
				var curBrandValue = $(this).val();
				$model.$getProduct({
					productBrand: curBrandValue
				}).then(function(res) {
					$scope.speciftList = res.data || [];
					$scope.$apply();
				});
			});
		}]
	};

	return formarReportController;
});