define([], function() {
	var labelmanageCtrl = {
		ServiceType: "controller",
		ServiceName: "labelmanageCtrl",
		ViewModelName: 'labelmanageViewModel',
		ServiceContent: ['$scope', '$compile', function($scope, $compile) {
			var $model = $scope.$model;
			//初始化基本属性列表显示
			$scope.showLabelList = true;
			$scope.showKuoHao = true;
			// 页面加载
			var onload = function() {
				$("#tableFirst").show();
				$("#tableSecond").hide();
				//获取一级标签
				$model.$getFirstLabelList({
					labelTypeId: 1
				}).then(function(res) {
					//					console.log(res)
					//					$scope.firstLabelList = res.data || [];
					var res = res.data || [];
					$('.firstSubstance').html('');
					if(res != null) {
						for(var i = 0; i < res.length; i++) {
							$('.firstSubstance').append($compile("<span data-id=" + res[i].labelLevel1Id + " class='firstMenu_span'>" + res[i].labelLevel1Name + "</span>")($scope))
						}
						$('.firstMenu_span').eq(0).addClass('d-item-active')
					}
				})
				$model.$getFirstLabelList({
					labelTypeId: 2
				}).then(function(res) {
					$scope.secondLabelList = res.data || [];
				})
			}
			onload();
			//大区、省、地市
			var zoneCity = function() {
				$("#zoneCity").show();
				$("#content_box_one").hide();
				$model.$getSaleZoneLabelList().then(function(res) {
					//										console.log(res)
					//					$scope.getSaleZoneLabelList = res.data || [];
					var res = res.data || [];
					$('.daQuList').html('');
					if(res != null) {
						for(var i = 0; i < res.length; i++) {
							$('.daQuList').append($compile("<span data-id=" + res[i].zoneCode + " class='secondMenu_span'>" + res[i].zoneName + "</span>")($scope))
						}
					}
				})
				$model.$getProvinceLabelList().then(function(res) {
					//										console.log(res)
					//					$scope.getProvinceLabelList = res.data || [];
					var res = res.data || [];
					$('.provinceList').html('');

					if(res != null) {
						for(var i = 0; i < res.length; i++) {
							$('.provinceList').append($compile("<span data-id=" + res[i].provinceId + " class='threeMenu_span'>" + res[i].provinceName + "</span>")($scope))
						}
					}
				})
				$model.$getCitysByProvinceLabelList().then(function(res) {
					//					console.log(res)
					//					$scope.getCitysByProvinceLabelList = res.data || [];
					var res = res.data || [];
					$('#cityItems').html('');
					if(res != null) {
						for(var i = 0; i < res.length; i++) {
							$('#cityItems').append($compile("<span data-id=" + res[i].cityId + " class='cityNameList_span'>" + res[i].cityName + "、" + "</span>")($scope))
						}
					}
				})
			}
			zoneCity()
			//会员扫码行为
			var vipSao = function() {
				$("#vipSao").hide();
				$("#vipXiao").hide();
				$("#content_box_two").show();
				var params = {
					labelLevel1Id: '203'
				}
				$model.$getSecondLabelList(params).then(function(res) {
					//					console.log(res)
					$scope.vipSaoLabelList = res.data || [];
					var aaa = {
						labelLevel2Id: '20301'
					}
					$model.$getThirdLabelList(aaa).then(function(res) {
						//						console.log(res)
						//$scope.getaaaLabelList = res.data || [];
						var res = res.data || [];
						$('.vipSaoList').html('');
						if(res != null) {
							for(var i = 0; i < res.length; i++) {
								$('.vipSaoList').append($compile("<span data-id=" + res[i].labelLevel3Id + " class='secondMenu_spans'>" + res[i].labelLevel3Name + "</span>")($scope))
							}
						}
					})
				})

			}
			vipSao();
			//会员消费行为
			var vipXiao = function() {
				$("#vipXiao").hide();
				$("#vipSao").hide();
				$("#content_box_two").show();
				var params = {
					labelLevel1Id: '204'
				}
				$model.$getSecondLabelList(params).then(function(res) {
					//					console.log(res)
					$scope.vipSaoLabelListTwo = res.data || [];
					var aaa = {
						labelLevel2Id: '20401'
					}
					$model.$getThirdLabelList(aaa).then(function(res) {
						//						console.log(res)
						//$scope.getaaaLabelListTwo = res.data || [];
						var res = res.data || [];
						$('.vipXiaoList').html('');
						if(res != null) {
							for(var i = 0; i < res.length; i++) {
								$('.vipXiaoList').append($compile("<span data-id=" + res[i].labelLevel3Id + " class='secondMenu_spans'>" + res[i].labelLevel3Name + "</span>")($scope))
							}
						}
					})
				})

			}
			vipXiao();
			//基本属性/用户行为属性切换
			$scope.changeShowStateFist = function(params) {
				$scope.showLabelList = !$scope.showLabelList;
				$("#tableFirst").show();
				$("#tableSecond").hide();
			}
			$scope.changeShowStateSecond = function(params) {
				$scope.showLabelList = !$scope.showLabelList;
				$("#tableFirst").hide();
				$("#tableSecond").show();
			}
			// 二级标签101栏
			//			$scope.changeShowSecondLabel = function(params) {
			$('.firstSubstance').on("click", '.firstMenu_span', function() {
				$(this).addClass('d-item-active').siblings('.firstMenu_span').removeClass('d-item-active');
				$scope.index = $(this).attr('data-id');
				//				console.log($scope.index)
				var params = {
					labelLevel1Id: $(this).attr('data-id')
				}
				if($scope.index == '101' || $scope.index == '102') {
					$("#zoneCity").show();
					$("#content_box_one").hide();
				} else if($scope.index == '104') {
					$("#zoneCity").hide();
					$("#content_box_one").show();
					$model.$getProductOfNoNuitList().then(function(res) {
						//						console.log(res)
						var res = res.data || [];
						$('#content_box_one').html('');
						if(res != null) {
							for(var i = 0; i < res.length; i++) {
								$('#content_box_one').append($compile("<div data-id=" + res[i].sn + " class='cityNameLists'>" + res[i].name + "</div>")($scope))
							}
						}
					})
				} else {
					$("#zoneCity").hide();
					$("#content_box_one").show();
					$model.$getSecondLabelList(params).then(function(res) {
						//						console.log(res)
						var res = res.data || [];

						$('#content_box_one').html('');
						if(res != null) {
							for(var i = 0; i < res.length; i++) {
								$('#content_box_one').append($compile("<div data-id=" + res[i].labelLevel2Id + " class='cityNameLists'>" + res[i].labelLevel2Name + "</div>")($scope))
							}
						}

					})
				}

			})
			// 二级标签102栏
			$scope.changeShowSecondLabelTwo = function(params) {
				$scope.index = params;
				var params = {
					labelLevel1Id: params
				}
				$model.$getSecondLabelList(params).then(function(res) {
					//					console.log(res)
					var res = res.data || [];
					if($scope.index == '203') {
						$("#vipSao").show();
						$("#vipXiao").hide();
						$("#content_box_two").hide();
					} else if($scope.index == '204') {
						//						if(res != null) {
						//							for(var i = 0; i < res.length; i++) {
						//								$('#content_box_two').append("<div class='cityNameLists'>" + res[i].labelLevel2Name + "</div>")
						//
						//							}
						//						}
						$("#vipXiao").show();
						$("#vipSao").hide();
						$("#content_box_two").hide();
					} else {

						$("#vipSao").hide();
						$("#vipXiao").hide();
						$("#content_box_two").show();
						$('#content_box_two').html('');
						if(res != null) {
							for(var i = 0; i < res.length; i++) {
								$('#content_box_two').append("<div data-id=" + res[i].labelLevel2Id + " class='cityNameLists'>" + res[i].labelLevel2Name + "</div>")

							}
						}

					}
				})

			}
			//点击24个英文字母
			$scope.selectCityName = function(params) {

				var params = {
					firstPinyin: params
				}
				$model.$getCitysByProvinceLabelListTwo(params).then(function(res) {
					//					console.log(res)
					$('#cityItems').html('');
					var res = res.data || [];
					//					$scope.mdgCityLabelList = res.data || [];
					if(res != null) {
						for(var i = 0; i < res.length; i++) {
							$('#cityItems').append($compile("<span data-code=" + res[i].cityId + " class='cityNameList_span'>" + res[i].cityName + "、" + "</span>")($scope))

						}
					}

				})
			}

			//括号显示隐藏
			$scope.changeKuoHao = function() {
				$scope.showKuoHao = !$scope.showKuoHao;
			}
			//左括号背景颜色变化				
			$('.middle').on("click", '.zuoKuoHao', function() {
				var aaaaaa = $(this).html();
				if(aaaaaa != '') {
					$(this).html('');
					$(this).css('background', '#7378ca');
				} else {
					$(this).css('background', '#fff');
					$(this).html('(');
				}
			})
			//右括号背景颜色变化	
			$('.middle').on("click", '.youKuoHao', function() {
				var bbbbbb = $(this).html();
				if(bbbbbb != '') {
					$(this).html('');
					$(this).css('background', '#7378ca');
				} else {
					$(this).css('background', '#fff');
					$(this).html(')');
				}
			})
			//点击关闭按钮删除标签				
			$('.middle').on("click", '.aui_close', function() {
				var asfsaf = $(this).parents('.aui_title').attr('data-id');
				$('.cityNameLists[data-id=' + asfsaf + ']').removeClass('d-item-active');
				$('.secondMenu_span[data-id=' + asfsaf + ']').removeClass('d-item-active');
				$('.threeMenu_span[data-id=' + asfsaf + ']').removeClass('d-item-active');
				$('.secondMenu_spans[data-id=' + asfsaf + ']').removeClass('d-item-active');

				var removeBiao = $(this).parents('.aui_title').text();
				var removeBiaos = removeBiao.replace(/×/g, '');
				var ddddd = $('#cityItems').children().text().split('、');
				for(var i = 0; i < ddddd.length; i++) {
					if(ddddd[i] == removeBiaos) {
						$('.cityNameList_span').eq(i).removeClass('d-item-active');
					}
				}

				var length = $('.aui_title').length;
				if(length > 1) {
					$(this).parents('.aui_title').prev().prev().remove();
					$(this).parents('.aui_title').prev().remove();
					$(this).parents('.aui_title').next().remove()
					$(this).parents('.aui_title').remove();
				} else if(length == 1) {
					$('.middle').children().remove();
				} else {
					$(this).parents('.aui_title').prev().remove();
					$(this).parents('.aui_title').next().remove()
					$(this).parents('.aui_title').remove();

				}

			})
			//				})
			//点击全部且
			$('.qieAll').click(function() {
				$('.select_option').val('且')
			})
			//点击全部或
			$('.huoAll').click(function() {
				$('.select_option').val('或')
			})
			//点击全部删除
			$('.removeAll').click(function() {
				$('.select_option').val('删除')
				//					alert($('.aui_title').length)

			})

			//动态添加标签
			//点击大区标签
			$('.daQuList').on('click', '.secondMenu_span', function() {
				var dataId = $(this).attr('data-id');
				//				console.log(dataId)
				$(this).addClass('d-item-active');
				var letterBtn = $(this).html();
				var length = $('.aui_title').length;
				if(length >= 1) {
					$('.middle').append($compile(
						"<div style='display:none;'>" + "a" + "</div>" +
						"<select class='select_option'>" +
						"<option value='且'>" + "且" + "</option>" +
						"<option value='或'>" + "或" + "</option>" +
						"<option value='删除'>" + "删除" + "</option>" +
						"</select>" + "<div ng-show='!showKuoHao' class='zuoKuoHao' ></div>" +
						"<div class='aui_title' data-id=" + dataId + ">" +
						letterBtn +
						"<a href='javascript:;' class='aui_close'>" + "×" + "</a>" +
						"</div>" +
						"<div ng-show='!showKuoHao' class='youKuoHao'></div>")($scope))

				} else {
					$('.middle').append($compile("<div ng-show='!showKuoHao' class='zuoKuoHao' ></div>" +
						"<div class='aui_title' data-id=" + dataId + ">" +
						letterBtn +
						"<a href='javascript:;'  class='aui_close' >" + "×" + "</a>" +
						"</div>" +
						"<div ng-show='!showKuoHao' class='youKuoHao'></div>")($scope))

				}
			})
			//点击省份标签
			$('.provinceList').on('click', '.threeMenu_span', function() {
				var dataId = $(this).attr('data-id');
				//				console.log(dataId)
				$(this).addClass('d-item-active');
				var letterBtn = $(this).html();
				var length = $('.aui_title').length;
				if(length >= 1) {
					$('.middle').append($compile(
						"<div style='display:none;'>" + "a" + "</div>" +
						"<select class='select_option'>" +
						"<option value='且'>" + "且" + "</option>" +
						"<option value='或'>" + "或" + "</option>" +
						"<option value='删除'>" + "删除" + "</option>" +
						"</select>" + "<div ng-show='!showKuoHao' class='zuoKuoHao' ></div>" +
						"<div class='aui_title' data-id=" + dataId + ">" +
						letterBtn +
						"<a href='javascript:;' class='aui_close'>" + "×" + "</a>" +
						"</div>" +
						"<div ng-show='!showKuoHao' class='youKuoHao'></div>")($scope))

				} else {
					$('.middle').append($compile("<div ng-show='!showKuoHao' class='zuoKuoHao' ></div>" +
						"<div class='aui_title' data-id=" + dataId + ">" +
						letterBtn +
						"<a href='javascript:;'  class='aui_close' >" + "×" + "</a>" +
						"</div>" +
						"<div ng-show='!showKuoHao' class='youKuoHao'></div>")($scope))

				}
			})
			//点击24个英文字母上传标签
			$('#cityItems').on('click', '.cityNameList_span', function() {
				var letterBtn = $(this).html();
				$(this).addClass('d-item-active')
				var letterBtns = letterBtn.replace(/、/g, '')
				var length = $('.aui_title').length;
				if(length >= 1) {
					$('.middle').append($compile(
						"<div style='display:none;'>" + "a" + "</div>" +
						"<select class='select_option'>" +
						"<option value='且'>" + "且" + "</option>" +
						"<option value='或'>" + "或" + "</option>" +
						"<option value='删除'>" + "删除" + "</option>" +
						"</select>" + "<div ng-show='!showKuoHao' class='zuoKuoHao' ></div>" +
						"<div class='aui_title'>" +
						letterBtns +
						"<a href='javascript:;' class='aui_close' >" + "×" + "</a>" +
						"</div>" +
						"<div ng-show='!showKuoHao' class='youKuoHao'></div>")($scope))

				} else {
					$('.middle').append($compile("<div ng-show='!showKuoHao' class='zuoKuoHao' ></div>" +
						"<div class='aui_title'>" +
						letterBtns +
						"<a href='javascript:;'  class='aui_close' >" + "×" + "</a>" +
						"</div>" +
						"<div ng-show='!showKuoHao' class='youKuoHao'></div>")($scope))

				}
			})
			//			点击202添加标签			
			$('#content_box_two').on('click', '.cityNameLists', function() {
				var dataId = $(this).attr('data-id');
				//				console.log(dataId)
				$(this).addClass('d-item-active');
				var letterBtn = $(this).html();
				var length = $('.aui_title').length;
				if(length >= 1) {
					$('.middle').append($compile(
						"<div style='display:none;'>" + "a" + "</div>" +
						"<select class='select_option'>" +
						"<option value='且'>" + "且" + "</option>" +
						"<option value='或'>" + "或" + "</option>" +
						"<option value='删除'>" + "删除" + "</option>" +
						"</select>" + "<div ng-show='!showKuoHao' class='zuoKuoHao' ></div>" +
						"<div class='aui_title' data-id=" + dataId + ">" +
						letterBtn +
						"<a href='javascript:;' class='aui_close'>" + "×" + "</a>" +
						"</div>" +
						"<div ng-show='!showKuoHao' class='youKuoHao'></div>")($scope))

				} else {
					$('.middle').append($compile("<div ng-show='!showKuoHao' class='zuoKuoHao' ></div>" +
						"<div class='aui_title' data-id=" + dataId + ">" +
						letterBtn +
						"<a href='javascript:;'  class='aui_close' >" + "×" + "</a>" +
						"</div>" +
						"<div ng-show='!showKuoHao' class='youKuoHao'></div>")($scope))

				}
			})
			$('#content_box_one').on('click', '.cityNameLists', function() {
				var dataId = $(this).attr('data-id');
				//				console.log(dataId)
				$(this).addClass('d-item-active');
				var letterBtn = $(this).html();
				var length = $('.aui_title').length;
				if(length >= 1) {
					$('.middle').append($compile(
						"<div style='display:none;'>" + "a" + "</div>" +
						"<select class='select_option'>" +
						"<option value='且'>" + "且" + "</option>" +
						"<option value='或'>" + "或" + "</option>" +
						"<option value='删除'>" + "删除" + "</option>" +
						"</select>" + "<div ng-show='!showKuoHao' class='zuoKuoHao' ></div>" +
						"<div class='aui_title' data-id=" + dataId + ">" +
						letterBtn +
						"<a href='javascript:;' class='aui_close'>" + "×" + "</a>" +
						"</div>" +
						"<div ng-show='!showKuoHao' class='youKuoHao'></div>")($scope))

				} else {
					$('.middle').append($compile("<div ng-show='!showKuoHao' class='zuoKuoHao' ></div>" +
						"<div class='aui_title' data-id=" + dataId + ">" +
						letterBtn +
						"<a href='javascript:;'  class='aui_close' >" + "×" + "</a>" +
						"</div>" +
						"<div ng-show='!showKuoHao' class='youKuoHao'></div>")($scope))

				}
			})
			//点击VIP
			$('#vipSao').on('click', '.secondMenu_spans', function() {
				var dataId = $(this).attr('data-id');
				//				console.log(dataId)
				$(this).addClass('d-item-active');
				var letterBtn = $(this).html();
				var length = $('.aui_title').length;
				if(length >= 1) {
					$('.middle').append($compile(
						"<div style='display:none;'>" + "a" + "</div>" +
						"<select class='select_option'>" +
						"<option value='且'>" + "且" + "</option>" +
						"<option value='或'>" + "或" + "</option>" +
						"<option value='删除'>" + "删除" + "</option>" +
						"</select>" + "<div ng-show='!showKuoHao' class='zuoKuoHao' ></div>" +
						"<div class='aui_title' data-id=" + dataId + ">" +
						letterBtn +
						"<a href='javascript:;' class='aui_close'>" + "×" + "</a>" +
						"</div>" +
						"<div ng-show='!showKuoHao' class='youKuoHao'></div>")($scope))

				} else {
					$('.middle').append($compile("<div ng-show='!showKuoHao' class='zuoKuoHao' ></div>" +
						"<div class='aui_title' data-id=" + dataId + ">" +
						letterBtn +
						"<a href='javascript:;'  class='aui_close' >" + "×" + "</a>" +
						"</div>" +
						"<div ng-show='!showKuoHao' class='youKuoHao'></div>")($scope))

				}
			})
			//点击VIP消费
			$('#vipXiao').on('click', '.secondMenu_spans', function() {
				var dataId = $(this).attr('data-id');
				//				console.log(dataId)
				$(this).addClass('d-item-active');
				var letterBtn = $(this).html();
				var length = $('.aui_title').length;
				if(length >= 1) {
					$('.middle').append($compile(
						"<div style='display:none;'>" + "a" + "</div>" +
						"<select class='select_option'>" +
						"<option value='且'>" + "且" + "</option>" +
						"<option value='或'>" + "或" + "</option>" +
						"<option value='删除'>" + "删除" + "</option>" +
						"</select>" + "<div ng-show='!showKuoHao' class='zuoKuoHao' ></div>" +
						"<div class='aui_title' data-id=" + dataId + ">" +
						letterBtn +
						"<a href='javascript:;' class='aui_close'>" + "×" + "</a>" +
						"</div>" +
						"<div ng-show='!showKuoHao' class='youKuoHao'></div>")($scope))

				} else {
					$('.middle').append($compile("<div ng-show='!showKuoHao' class='zuoKuoHao' ></div>" +
						"<div class='aui_title' data-id=" + dataId + ">" +
						letterBtn +
						"<a href='javascript:;'  class='aui_close' >" + "×" + "</a>" +
						"</div>" +
						"<div ng-show='!showKuoHao' class='youKuoHao'></div>")($scope))

				}
			})
			//点击保存
			$scope.saveGiftData = function() {
//				drag()
				var ccccc = $(".tabName_text").val();
				var tag = /^[\u4e00-\u9fa5_a-zA-Z]+$/;
				var prompt = $('.middle').children().text();

				var reg1 = new RegExp(/且或删除/g);
				var str = prompt.replace(reg1, '');
				var btns = new Array();

				$('.select_option').each(function(key, value) {
					btns[key] = $(this).val();
				});
				var result = str.match(/a/g);
				btns.forEach(function(n, i) {
					str = str.replace(result[i], n);
					return str;
				})
				var ttt = str.replace(/×/g, '');
				if(ccccc == '') {
					alert("标签名称不能为空!")
					return;
				} else if(!tag.test(ccccc)) {
					alert('标签名称为中英文组合')
					return;
				} else {
					$('.cancel_box').modal('show');
					$('.box_cont').html(ttt.replace(/a/g, ''))
				}
			}
			//点击确定
			$scope.confirmCancel = function() {
				$('.middle').html('');
				$('.cancel_box').modal('hide');
				$('.box_cont').html('');
				$('.tabName_text').val('');
				$('.descriptionBus_text').val('');
			}
			//点击取消
			$scope.cancelCreateGift = function() {
				$('.middle').html('');
				$('.cancel_box').modal('hide');
				$('.box_cont').html('');
				$('.tabName_text').val('');
				$('.descriptionBus_text').val('');
				onload();
				zoneCity();
				$scope.showLabelList = true;
				$("#tableFirst").show();
				$("#tableSecond").hide();
			}
			//拖拽
//			var drag = function(callback) {
//				var handler = $(".middle");
//				var oBox_inner = document.querySelectorAll('.aui_title');
//				handler.on('mousedown', '.aui_title', function(ev) {
////				for(var i = 0 ; i < oBox_inner.length ; i++){
////					oBox_inner[i].onmousedown = function(event){
//					var ev = ev || event;
//					//             通过event获取到当前对象
//					var This = $(this);
//					//					This.css({'position':'absolute','cursor':'move'})
//					//             获取到鼠标离当前元素上边框的距离
////					var disX = ev.clientX - $(this).offset().left;
//					var disX = ev.offsetX + 200;
////					console.log(disX)
////					console.log($(this).offset().left)
//
//					//             获取到元素距离左边框的距离 
//					//             因为在拖拽的过程中不变的是鼠标距离元素边框的距离 通过不变和已知求变量
////					var disY = ev.clientY - $(this).offset().top;
//					var disY = ev.offsetY + 50;
//					//设置定位和宽高;
//										var nWidth = This.width(); 
//										var nHeight =This.height();
//										This.css('width','nWidth + "px" + ');
//										This.css('height','nHeight + "px" + ');
//					this.style.position = "absolute";
////										console.log(This.css('width'))
////										console.log(This.css('height'))
//					$(document).on('mousemove', function(ev) {
//						var ev = ev || event;
//						//               将所改变的值通过样式设置给当前元素
//
//						This.css({
//							"left": ev.clientX - disX + 'px'
//						});
//						This.css({
//							"top": ev.clientY - disY + 'px'
//						});
////						console.log(This.css('left'))
////						console.log(This.css('top'))
//					});
//					$(document).on('mouseup', function() {
//						//               鼠标松开时关闭所有事件
//						$(document).off();
//						var upleft = This.offset().left - 200;
//						var uptop = This.offset().top - 50;
//						console.log(upleft + ":" + uptop);
//						//检测重合面积; 允许10px误差;
//
//					
//						//回原位;
//						This.css('position', '');
//					})
//				})
////}
////}
//				//获取坐标数组; 
//
//		var positionArr = [];
//
//		for(var i = 0 ; i < oBox_inner.length; i++){
//
//			//将坐标存入对象;
//
//			var obj = {
//				left : oBox_inner[i].offsetLeft,
//				top : oBox_inner[i].offsetTop,
//			}
//
//			positionArr[i] = obj;
//
//		}
//
//		console.log(positionArr)
//				//清空事件
//			};
//			drag()
			// 三级标签
			//			$scope.changeShowThirdLabel = function(params) {
			//				$scope.$indexs = params;
			//				console.log(params)
			//				var params = {
			//					labelLevel2Id: params
			//				}
			//				$model.$getThirdLabelList(params).then(function(res) {
			//					console.log(res)
			//					$scope.thirdLabelList = res.data || [];
			//				})
			//			}
		}]
	};

	return labelmanageCtrl;
});