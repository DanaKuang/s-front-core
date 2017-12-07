/**
 * Author: {author}
 * Create Date: 2017-10-16
 * Description: interface
 */
define([], function() {
    var ordermanageController = {
        ServiceType: "controller",
        ServiceName: "ordermanageCtrl",
        ViewModelName: 'ordermanageViewModel',
        ServiceContent: ['$scope','dateFormatFilter', 'dayFilter', function($scope,dateFormatFilter, dayFilter) {
			var $model = $scope.$model;

            //初始化分页信息
            $scope.pageSize = 10; //每页显示多少条
            $scope.pageNum = 1; //当前页数
            $scope.totalPage = 0;//总页数
            var initPage = {
                page : $scope.pageNum,
                pageSize : $scope.pageSize
            };

            //设置input的默认时间
            // var allpage;
            // var stattime = dayFilter.beforenday('date', 10);
            // var endtime = dayFilter.today('date');

            function strToTimestamp(s) {
                s = s.replace(/-/g,"/");
                var date = new Date(s);
                return date.valueOf();
            }
            //时间戳变
            function getLocalTime(nS) {
                return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,4}$/,' ');
            }
            function openwin(){
                window.open("","","width=200,height=200")
            }
            // $("#durationStart").val(stattime);
            // $("#durationEnd").val(endtime); 
            // $("#durationStart").datetimepicker({
            //     format: 'yyyy-mm-dd HH:mm:ss',
            //     minView:'month',
            //     language: 'zh-CN',
            //     autoclose:true
            // }).on("click",function(){
            //     $("#durationStart").datetimepicker("setEndDate",$("#durationEnd").val());
            // });
            // $("#durationEnd").datetimepicker({
            //     format: 'yyyy-mm-dd HH:mm:ss',
            //     minView:'month',
            //     language: 'zh-CN',
            //     autoclose:true,
            //     endDate:new Date()
            // }).on("click",function(){
            //     $("#durationEnd").datetimepicker("setStartDate",$("#durationStart").val());
            // });

            $("#durationStart").datetimepicker({
                format: 'yyyy-mm-dd hh:ii', 
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1
            }).on('change', function (e) {
                var startTime = e.target.value;
                var endTime = $scope.endTime;
                if (endTime < startTime) {
                    $scope.endTime = '';
                    $scope.$apply();
                }
            })

            $("#durationEnd").datetimepicker({
                format: 'yyyy-mm-dd hh:ii', 
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1
            }).on('change', function (e) {
                var endTime = e.target.value;
                var startTime = $scope.startTime;
                if (startTime > endTime) {
                    $scope.startTime = '';
                    $scope.$apply();
                }
            });
            
            
            //订单状态
            $model.$orderStates().then(function(res){
                if(res.status != null){
                    var res = res.data || [];
                    $scope.allStatus = res;
                    $scope.$apply();
                }
            })
            // 省市区
             $model.$province().then(function(res){
            	if(res.status != null){
            		var res = res.data || [];
            		$scope.province = res;
            		 $scope.$apply();
            	}
            })

            $("#provinceId").change(function (e) {
                $model.$getCity({
                    parentCode: e.target.value || ''
                }).then(function (res) {
                    $scope.city = res.data;
                    $scope.$apply();
                });
            });
            $("#cityId").change(function (e) {
                $model.$getArea({
                    parentCode: e.target.value || ''
                }).then(function (res) {
                    $scope.area = res.data;
                    $scope.$apply();
                });
            });
            
            //搜索
            $scope.search = function(){
                var keyCode = $('#keyCode').val();
            	var statusChange = $('.form-controlmdg').val();
                var newCode = $('#newCode').val();
                var provinceId = $('#provinceId').val();
                var cityId = $('#cityId').val();
                var areaId = $('#areaId').val();
                var buyNum = $('#buyNum').val();

                var searchData = {
                    orderStatus: statusChange,//提现状态
                    provinceId:provinceId,//省份id
                    cityId:cityId,//地市id
                    areaId:areaId,//区县id                   
                    startTime: $scope.startTime ? $scope.startTime + ':00' : '',//开始时间
                    endTime: $scope.endTime ? $scope.endTime + ':00' : '',//结束时间
                    buyNum : buyNum, //购买数量
                    page: 1,
                    pageSize: 10
                }
                switch(keyCode){
                    case 'order-num':
                        searchData.orderId = newCode;
                        break;
                    case 'buy-person':
                        searchData.contactName = newCode;
                        break;
                    case 'telphone':
                        searchData.contactPhone = newCode;
                        break;
                    case 'dealer':
                        searchData.salerName = newCode;
                        break;
                    default:
                }
                getOrderList(searchData);
            }

            //重置
            $scope.reset = function(){
                $('#keyCode').val('order-num');
            	$('.form-controlmdg').val('');
                $('#newCode').val('');
                $('#provinceId').val('');
                $('#cityId').val('');
                $('#areaId').val('');
                $('#buyNum').val('');
                $scope.startTime = '';
                $scope.endTime = '';
                getOrderList(initPage);
            }

            //创建分页工具
            function createPageTools(pageData){
                $(".tcdPageCode").createPage({
                    pageCount: pageData.allPages,
                    current : pageData.currentPage,
                    backFn : function(pageNum){
                        var curPageData = {
                            page : pageNum,
                            pageSize : $scope.pageSize
                        };
                        var keyCode = $('#keyCode').val();
                        var statusChange = $('.form-controlmdg').val();
                        var newCode = $('#newCode').val();
                        var provinceId = $('#provinceId').val();
                        var cityId = $('#cityId').val();
                        var areaId = $('#areaId').val();
                        var buyNum = $('#buyNum').val();

                        curPageData.orderStatus = statusChange;//提现状态
                        curPageData.provinceId = provinceId;//省份id
                        curPageData.cityId = cityId;//地市id
                        curPageData.areaId = areaId;//区县id                   
                        curPageData.startTime = $scope.startTime ? $scope.startTime + ':00' : '';//开始时间
                        curPageData.endTime = $scope.endTime ? $scope.endTime + ':00' : '';//结束时间
                        curPageData.buyNum = buyNum; //购买数量
                        
                        switch(keyCode){
                            case 'order-num':
                                curPageData.orderId = newCode;
                                break;
                            case 'buy-person':
                                curPageData.contactName = newCode;
                                break;
                            case 'telphone':
                                curPageData.contactPhone = newCode;
                                break;
                            case 'dealer':
                                curPageData.salerName = newCode;
                                break;
                            default:
                        }
                        getOrderList(curPageData);
                    }
                });
            }

            //获取订单列表列表
            function  getOrderList(pageObj){
                $model.$getOrderList(pageObj).then(function(res){
                    var dataObj = res.data.data;
                    var listData = dataObj.list || [];
                    $scope.topTenTable = listData;
                    var newPageObj = {
                        allPages : dataObj.page.pageNumber,
                        currentPage : pageObj.page
                    };
                    $scope.pageNum = pageObj.page;
                    $scope.totalCount = dataObj.page.count;
                    if ($(".tcdPageCode").createPage) {
                        $(".tcdPageCode").remove();
                    }
                    $(".page_sec").append("<div class='tcdPageCode'></div>");
                    $scope.$apply();
                    createPageTools(newPageObj);
                })
            }

            //初始化查询全部数据
            getOrderList(initPage);
            //点击切换页面
            $scope.orderListShow = true;
            $scope.canCelOrder = true;
            $scope.showOrderDetail = function(curOrderId){
                $scope.orderListShow = !$scope.orderListShow;
                
                $model.$getOrderDetail({orderId:curOrderId}).then(function (res) {
                    $scope.detailInfo = res.data || [];
                    $scope.$apply();
                });
                $model.$getOrderTrack({orderId:curOrderId}).then(function (res) {
                    $scope.trackList = res.data || [];
                    $scope.$apply();
                });
            }
            $scope.goBack = function(params){
                $scope.orderListShow = !$scope.orderListShow;
            }
            //导出物流订单
            $scope.exportTrackOrder = function(){
                var keyCode = $('#keyCode').val();
            	var statusChange = $('.form-controlmdg').val();//提现状态
                var newCode = $('#newCode').val();//订单号
                var provinceId = $('#provinceId').val();//省份id
                var cityId = $('#cityId').val();//地市id
                var areaId = $('#areaId').val();//区县id
                // var durationStart = $('#durationStart').val();//开始时间
                // var durationEnd = $('#durationEnd').val();//结束时间
                var data = {};

                if(statusChange != '' && statusChange != null){
                    data.statusChange = statusChange;
                }
                if(provinceId != '' && provinceId != null){
                    data.provinceId = provinceId;
                }
                if(cityId != '' && cityId != null){
                    data.cityId = cityId;
                }
                if(areaId != '' && areaId != null){
                    data.areaId = areaId;
                }
                if($scope.startTime != '' && $scope.startTime != null){
                    var startStr = $scope.startTime + ':00';
                    data.startTime = startStr.replace(/:/g,'-');
                }
                if($scope.endTime != '' && $scope.endTime != null){
                    var endStr = $scope.endTime + ':00';
                    data.endTime = endStr.replace(/:/g,'-');
                }
                
                if(newCode != '' && newCode != null){
                    switch(keyCode){
                        case 'order-num':
                            data.orderId = newCode;
                            break;
                        case 'buy-person':
                            data.contactName = newCode;
                            break;
                        case 'telphone':
                            data.contactPhone = newCode;
                            break;
                        case 'dealer':
                            data.salerName = newCode;
                            break;
                        default:
                    }
                }
                var url = '/api/tztx/dataportal/fxback/exportOrders';
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
                    if (this.status == 200) {
                        var blob = new Blob([this.response], {type: 'application/vnd.ms-excel'});
                        var respHeader = xhr.getResponseHeader("Content-Disposition");
                        var fileName = decodeURI(respHeader.match(/filename=(.*?)(;|$)/)[1]);
                        if (window.navigator.msSaveOrOpenBlob) {
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
            //导入物流订单
            $('#importTrackOrder').change(function(){
                var addTrackFile = $('#importTrackOrder')[0].files[0];
                if(addTrackFile != undefined){
                    var formData = new FormData();
                    formData.append('file',addTrackFile);
                    $.ajax({
                        url: '/api/tztx/dataportal/fxback/importOrders',
                        type: 'POST',
                        cache: false,
                        data: formData,
                        processData: false,
                        contentType: false,
                        headers: {
                            ContentType: "multipart/form-data",
                            loginId : sessionStorage.access_loginId,
                            token : sessionStorage.access_token
                        }
                    }).done(function(res) {
                        getOrderList(initPage);
                        $scope.importTitle = '导入成功';
                        $('.import_success_box').modal('show');                        
                    }).fail(function(res) {
                        $scope.importTitle = '导入失败';
                        $('.import_success_box').modal('show');
                    });
                }
            });

            //修改收货地址
            $scope.updateTrackAdress = function(){
                var urdateData = {
                    'orderId' : $scope.detailInfo.orderId,
                    'contactName' : $('#updateName').val(),
                    'contactPhone' : $('#updateTel').val(),
                    'addrDetail' : $('#updateAdress').val()
                }
                $model.$updateAdress(urdateData).then(function (res) {
                    if(res.data.ok){
                        $scope.orderListShow = !$scope.orderListShow;
                        getOrderList(initPage);
                    }else{
                        alert('修改地址失败');
                    }
                });
                
            }
            //取消订单
            $scope.cancelOrder = function(){
                $('.cancel_box').modal('show');
            }
            //确认取消
            $scope.confirmCancel = function(){
                $('.cancel_box').modal('hide');
                var cancelObj = {
                    'orderId' : $scope.detailInfo.orderId,
                    'orderStatus' : 5
                }
                $model.$cancelOrder(cancelObj).then(function (res) {
                    if(res.data.ok){
                        getOrderList(initPage);
                        $scope.orderListShow = !$scope.orderListShow;
                    }else{
                        alert('订单取消失败');
                    }
                });
            };
        }]
    };

  return ordermanageController;
});