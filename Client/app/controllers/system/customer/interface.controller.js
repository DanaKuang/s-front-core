/**
 * Author: {author}
 * Create Date: 2017-10-16
 * Description: interface
 */
define([], function() {
	var interfaceCtrl = {
		ServiceType: "controller",
		ServiceName: "interfaceCtrl",
		ViewModelName: 'interfaceViewModel',
		ServiceContent: ['$scope', 'interfaceViewModel', 'limitlengthFilter', function($scope, $model, limitlengthFilter) {
			var $model = $scope.$model;
			//初始化显示列表
			$scope.showTables = true;
			//文件上传限制大小
			var fileLimit = 65536;
			//认证文件
			var transferVoucherFilename = '';
			var transferVoucherAttach = '';
			//初始化分页信息
			$scope.pageSize = 10; //每页显示多少条
			$scope.currentPageNumber = 1; //当前页数
			$scope.totalPage = 0; //总页数
			var initPage = {
				currentPageNumber: $scope.currentPageNumber,
				pageSize: $scope.pageSize,
				orgName: ''
			};
			$("#payHtml").hide();
			$("#ShouHtml").show();
			$("#interfaceHtml").hide();
			//创建分页工具
			function createPageTools(pageData) {
				$(".tcdPageCode").createPage({
					pageCount: pageData.allPages,
					current: pageData.currentPage,
					backFn: function(pageNum) {
						var curPageData = {
							currentPageNumber: pageNum,
							pageSize: $scope.pageSize,
							orgName: ''
						};
						getActivityList(curPageData);
					}
				});
			}
			//加载列表
			var getActivityList = function(pageObjs) {
				$model.$getActivityList(pageObjs).then(function(res) {
					//					console.log(res)
					var giftObj = res.data.data;
					if(giftObj.list != null) {
						$scope.giftList = giftObj.list;
						$scope.totalPage = giftObj.page.pageNumber;
						$scope.totalCount = giftObj.page.count;
						$scope.currentPageNumber = giftObj.page.currentPageNumber;
						//						$('.SheZhiStyle').attr('data-code',giftItem.orgCode);
						var pageObj = {

							allPages: giftObj.page.pageNumber,
							currentPage: giftObj.page.currentPageNumber,
							orgName: ''
						};
						if($(".tcdPageCode").createPage) {
							$(".tcdPageCode").remove();
						}
						$(".page_sec").append("<div class='tcdPageCode'></div>");
						$scope.$apply();
						createPageTools(pageObj);
					}
				})
			}
			getActivityList(initPage);

			//查询
			$scope.search = function() {
				var searchData = {
					orgName: $("#inputKey").val(),
					currentPageNumber: 1,
					pageSize: $scope.pageSize
				};
				getActivityList(searchData);
			}
			//重置
			$scope.searchreset = function() {
				$("#inputKey").val('');
				var searchresetData = {
					orgName: '',
					currentPageNumber: 1,
					pageSize: $scope.pageSize
				};
				getActivityList(searchresetData);
			}

			//跳转到微信接口设置页面

			$scope.goInterfaceItem = function(orgCode) {
				$("#interfaceHtml").show();
				$("#payHtml").hide();
				$("#ShouHtml").hide();
				var orgId = {
					orgId: orgCode
				};
				//下拉框接口
				$model.$getSelectOptions().then(function(res) {
					//					console.log(res)
					if(res.data.ret == 200000) {
						$scope.allSupplyList = res.data.data;
						$scope.$apply();

					}
				});
				$model.$getActivityListsss(orgId).then(function(res) {
					//					console.log(res);
					var result = res.data.data;
					if(result !== null) {
						$("#oneCategory").val(result.appname);
						$("#MiYaoName").val(result.appid);
						$("#brand").val(result.secret);
						$("#selectSupply").val(result.compAppid);
						$("#applySpecift").val(result.domain);
						$("#orgId").val(result.orgId);
						$("#Idname").val(result.id);
					} else {
						$("#oneCategory").val('');
						$("#MiYaoName").val('');
						$("#brand").val('');
						$("#selectSupply").val('');
						$("#applySpecift").val('');
						$("#orgId").val('');
						$("#Idname").val('');
					}
				})
			}
			//跳转到微信支付管理页面
			$scope.goPayItem = function(orgId) {
				$("#payHtml").show();
				$("#ShouHtml").hide();
				$("#interfaceHtml").hide();
				var orgId = {
					orgId: orgId
				};
				$model.$getActivityListsss(orgId).then(function(res) {
					console.log(res);
					var result = res.data.data;
					if(result != null) {
						$("#shzhAccount").val(result.mchId);
						$("#applyzsmy").val(result.payKey);
						$("#orgIds").val(result.orgId);
						$("#Idnames").val(result.id);
					} else {

						alert('请先进行微信接口设置!')
						$("#payHtml").hide();
						$("#ShouHtml").hide();
						$("#interfaceHtml").show();

					}
				})
			}
			//清空数据
			var clearCreatGift = function() {
				$('.gift_name_zhushi').html('(公众号应用ID)');
				$('.gift_name_zhushi').css({
					'color': '#707478',
					'font-size': '12px',
					'margin-left': '0px'
				});

				$('.category_warnmdg').html('');

				$('.apply_brand_zhushi').html('(32位的API密钥)');
				$('.apply_brand_zhushi').css({
					'color': '#707478',
					'font-size': '12px',
					'margin-left': '0px'
				});

				$('.openValue').html('');

				$('.apply_specift_warns').html('');
			}
			//清空数据2
			var clearCreatGiftTwo = function() {
				$('#transfer_warn').html('');
				$('#transferName').html('');
				$('#regis_warn').html('');
				$('.shzhAccount_warn').html('');
				$('.apply_specift_zhushi').html('(32位的API密钥)');
				$('.apply_specift_zhushi').css({
					'color': '#707478',
					'font-size': '12px',
					'margin-left': '0px'
				});
			}
			//取消设置页面
			$scope.cancelCreateGift = function() {
				clearCreatGift();
				$("#ShouHtml").show();
				$("#payHtml").hide();
				$("#interfaceHtml").hide();
				$("#oneCategory").val('');
				$("#MiYaoName").val('');
				$("#brand").val('');
				$("#selectSupply").val('');
				$("#applySpecift").val('');
				$("#orgId").val('');
				$("#Idname").val('');
			}
			//取消设置页面
			$scope.cancelCreateGiftTwo = function() {
				clearCreatGiftTwo();
				$("#ShouHtml").show();
				$("#payHtml").hide();
				$("#interfaceHtml").hide();
				$("#shzhAccount").val('');
				$("#applyzsmy").val('');

			}
			//保存微信接口设置
			$scope.saveGiftData = function() {
				//公众号名称
				var gongName = $('#oneCategory').val();
				if(gongName == '') {
					$('.category_warnmdg').html('公众号名称不能为空');
					$('.category_warnmdg').css({
						'color': '#ff3300',
						'font-size': '15px',
						'margin-left': '10px'
					});
					return;
				} else {
					$('.category_warnmdg').html('输入正确');
					$('.category_warnmdg').css({
						'color': 'green',
						'font-size': '15px',
						'margin-left': '10px'
					});
				}
				//公众号ID
				var gongName = $('#MiYaoName').val();
				var reg2 = /^[a-zA-Z_0-9]+$/;
				if(gongName == '') {
					$('.gift_name_zhushi').html('公众号ID不能为空');
					$('.gift_name_zhushi').css({
						'color': '#ff3300',
						'font-size': '15px',
						'margin-left': '10px'
					});
					return;
				} else if(!reg2.test(gongName)) {
					$('.gift_name_zhushi').html('请输入数字或者英文结合的形式');
					$('.gift_name_zhushi').css({
						'color': '#ff3300',
						'font-size': '15px',
						'margin-left': '10px'
					});
					return;
				} else {
					$('.gift_name_zhushi').html('输入正确');
					$('.gift_name_zhushi').css({
						'color': 'green',
						'font-size': '15px',
						'margin-left': '10px'
					});
				}
				//Key
				var KeyName = $('#brand').val();
				var reg3 = /^[a-zA-Z_0-9]{32}/;
				if(KeyName == '') {
					$('.apply_brand_zhushi').html('Key值不能为空');
					$('.apply_brand_zhushi').css({
						'color': '#ff3300',
						'font-size': '15px',
						'margin-left': '10px'
					});
					return;
				} else if(!reg3.test(KeyName)) {
					$('.apply_brand_zhushi').html('请输入32位数字或者英文结合的形式');
					$('.apply_brand_zhushi').css({
						'color': '#ff3300',
						'font-size': '15px',
						'margin-left': '10px'
					});
					return;
				} else {
					$('.apply_brand_zhushi').html('输入正确');
					$('.apply_brand_zhushi').css({
						'color': 'green',
						'font-size': '15px',
						'margin-left': '10px'
					});
				}
				//选择开放平台
				var openValue = $("#selectSupply").val();
				if(openValue == '') {
					$('.openValue').html('请选择开放平台');
					$('.openValue').css({
						'color': '#ff3300',
						'font-size': '15px',
						'margin-left': '10px'
					});
					return;
				} else {
					$('.openValue').html('输入正确');
					$('.openValue').css({
						'color': 'green',
						'font-size': '15px',
						'margin-left': '10px'
					});
				}
				//域名
				var applySpeciftValue = $("#applySpecift").val();
				if(applySpeciftValue == '') {
					$('.apply_specift_warns').html('请输入域名');
					$('.apply_specift_warns').css({
						'color': '#ff3300',
						'font-size': '15px',
						'margin-left': '10px'
					});
					return;
				} else {
					$('.apply_specift_warns').html('输入正确');
					$('.apply_specift_warns').css({
						'color': 'green',
						'font-size': '15px',
						'margin-left': '10px'
					});
				}
				//开始保存数据
				var giftDataObj = {
					appid: $("#MiYaoName").val(), //公众号ID
					secret: $("#brand").val(), //公众号秘钥
					appname: $("#oneCategory").val(), //公众号名称
					compAppid: $("#selectSupply").val(), //授权的开放平台id
					domain: $("#applySpecift").val(), //域名
					orgId: $("#orgId").val(),
					id: $("#Idname").val()
				};

				$model.$saveOrUpdateData(giftDataObj).then(function(res) {
					console.log(res)
					if(res.data.ret == 200000) {

						alert('保存成功')
						$("#ShouHtml").show();
						$("#payHtml").hide();
						$("#interfaceHtml").hide();
						getActivityList(initPage);
						clearCreatGift();
						$scope.$apply();
					} else {
						//提示保存失败
						var errorTimer = null;
						$('.gift_error_box').modal('show');
						errorTimer = setTimeout(function() {
							$('.gift_error_box').modal('hide');
							clearTimeout(errorTimer);
						}, 3000)
					}
				})
			};

			//支付证书上传
			$('#transfer').change(function() {
				var transferFile = $('#transfer')[0].files[0];
				if(transferFile != undefined) {
					if(transferFile.size > fileLimit) {
						$('#regis_warn').html('上传文件大小不可超过64KB');
						return;
					} else {
						$('#regis_warn').html('');
					}
					$('#transfer_warn').html('文件上传中...');
					var formData = new FormData();
					formData.append('file', transferFile);
					$.ajax({
						url: '/api/tztx/saas/saotx/attach/commonUploadFiles',
						type: 'POST',
						cache: false,
						data: formData,
						processData: false,
						contentType: false,
						headers: {
							ContentType: "multipart/form-data",
							loginId: sessionStorage.access_loginId,
							token: sessionStorage.access_token
						}
					}).done(function(res) {
						console.log(res)
						if(res.ret == 200000) {
							$('#transfer_warn').html('文件上传成功');
							var fileSuccessData = res.data;
							transferVoucherFilename = fileSuccessData.filename;
							transferVoucherAttach = fileSuccessData.attachCode;
							$('#transferName').html(fileSuccessData.filename);
						}
					}).fail(function(res) {
						$('#transfer_warn').html('文件上传失败');
					});
				}
			});

			//保存微信支付管理
			$scope.goPayData = function() {
				//				var orgId = 
				//				$model.$getActivityListsss(orgId).then(function(res) {
				//					//					console.log(res);
				//					var result = res.data.data;
				//					if(result == null) {
				//						alert('请先进行微信接口设置!')
				//						return;
				//					}
				//				})

				var transferFile = $('#transfer')[0].files[0];
				if(transferFile != undefined) {
					if(transferFile.size > fileLimit) {
						$('#regis_warn').html('上传文件大小不可超过64KB');
						return;
					} else {
						$('#regis_warn').html('');
					}

				}

				//商户号
				var shopName = $('#shzhAccount').val();
				var regPay1 = /^[a-zA-Z_0-9]+$/;
				if(shopName == '') {
					$('.shzhAccount_warn').html('商户号不能为空');
					$('.shzhAccount_warn').css({
						'color': '#ff3300',
						'font-size': '15px',
						'margin-left': '10px'
					});
					return;
				} else if(!regPay1.test(shopName)) {
					$('.shzhAccount_warn').html('商户号为数字或者字母组合的形式');
					$('.shzhAccount_warn').css({
						'color': '#ff3300',
						'font-size': '15px',
						'margin-left': '10px'
					});
					return;
				} else {
					$('.shzhAccount_warn').html('输入正确');
					$('.shzhAccount_warn').css({
						'color': 'green',
						'font-size': '15px',
						'margin-left': '10px'
					});
				}
				//证书密钥
				var zsScret = $('#applyzsmy').val();
				var regPay2 = /^[a-zA-Z_0-9]{32}/;
				if(zsScret == '') {
					$('.apply_specift_zhushi').html('证书密钥不能为空');
					$('.apply_specift_zhushi').css({
						'color': '#ff3300',
						'font-size': '15px',
						'margin-left': '10px'
					});
					return;
				} else if(!regPay2.test(zsScret)) {
					$('.apply_specift_zhushi').html('请输入32位数字或者英文结合的形式');
					$('.apply_specift_zhushi').css({
						'color': '#ff3300',
						'font-size': '15px',
						'margin-left': '10px'
					});
					return;
				} else {
					$('.apply_specift_zhushi').html('输入正确');
					$('.apply_specift_zhushi').css({
						'color': 'green',
						'font-size': '15px',
						'margin-left': '10px'
					});
				}
				//支付证书
				var moneyBook = $("#transferName").html();
				if(moneyBook == '') {
					$('#transferName').html('请上传证书');
					return;
				}
				//开始保存数据
				var giftDataObjTwo = {
					attachCode: transferVoucherAttach, //支付证书
					mchId: $('#shzhAccount').val(), //商户号id
					payKey: $('#applyzsmy').val(), //支付apikey
					orgId: $("#orgIds").val(),
					id: $("#Idnames").val()
				};

				$model.$saveOrUpdateDataTwo(giftDataObjTwo).then(function(res) {
					console.log(res)
					if(res.data.ret == 200000) {

						alert('保存成功')
						$("#ShouHtml").show();
						$("#payHtml").hide();
						$("#interfaceHtml").hide();
						getActivityList(initPage);
						clearCreatGiftTwo();
						$scope.$apply();
					} else {
						//提示保存失败
						var errorTimer = null;
						$('.gift_error_box').modal('show');
						errorTimer = setTimeout(function() {
							$('.gift_error_box').modal('hide');
							clearTimeout(errorTimer);
						}, 3000)
					}
				})
			};

		}]
	};

	return interfaceCtrl;
});