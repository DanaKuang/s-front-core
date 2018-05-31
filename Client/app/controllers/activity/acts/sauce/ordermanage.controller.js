/**
 * Author: zhaobl
 * Create Date: 2018-3-6
 * Description: 活动管理-订单管理controller
 */
define([], function() {
    var actmanageController = {
        ServiceType: "controller",
        ServiceName: "actOrderManageCtrl",
        ViewModelName: 'actOrderManageViewModel',
        ServiceContent: ['$scope','dateFormatFilter', function($scope,dateFormatFilter) {
            var $model = $scope.$model;

            $scope.showOrderList = true; //显示订单管理列表
            $scope.keyCode = "orderId"; //默认订单号
             //初始化分页信息
             $scope.pageSize = 10; //每页显示多少条
             $scope.pageNum = 1; //当前页数
             $scope.totalPage = 0;//总页数
             var initPage = {
                 page : $scope.pageNum,
                 pageSize : $scope.pageSize
             };

            $("#startTime").datetimepicker({
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

            $("#endTime").datetimepicker({
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

            $model.$getProvince().then(function(res){ //获取省份列表
            	if(res.status != null){
            		var res = res.data || [];
            		$scope.province = res;
            		$scope.$apply();
            	}
            })
            $scope.changeProvince = function(provinceCode){ //根据省份获取市级列表
                $model.$getCity({
                    parentCode: provinceCode || ''
                }).then(function (res) {
                    $scope.city = res.data;
                    $scope.$apply();
                });
            }
            $scope.changeCity = function(cityCode){ //根据市级获取区县列表
                $model.$getArea({
                    parentCode: cityCode || ''
                }).then(function (res) {
                    $scope.area = res.data;
                    $scope.$apply();
                });
            }
            $model.$getActList().then(function(res){ //获取活动信息
                if(res.data.ret == 200000){
                    var dataObj = res.data.data;
                    $scope.actDataList = dataObj.list || [];
                    $scope.$apply();
                }
            })

            $scope.getActLevel = function(activeId){ //根据活动获取奖项等级
                $model.$getAwardLevels({
                    activityId: activeId || ''
                }).then(function (res) {
                    if(res.data.ret == 200000){
                        $scope.awardLevelList = res.data.data;  
                    }else{
                        $scope.awardLevelList = [];
                    }
                    $scope.$apply();
                });
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
                        curPageData.status = $scope.orderState;//订单状态
                        curPageData.provinceCode = $scope.provinceCode;//省份id
                        curPageData.cityCode = $scope.cityCode;//地市id
                        curPageData.areaCode = $scope.areaCode;//区县id                   
                        curPageData.startTime = $scope.startTime ? $scope.startTime + ':00' : '';//开始时间
                        curPageData.endTime = $scope.endTime ? $scope.endTime + ':00' : '';//结束时间
                        curPageData.activityId = $scope.activeId ? $scope.activeId : ''; //活动名称
                        curPageData.productLevel = $scope.awardLevel ? $scope.awardLevel : ''; //奖项等级
                        
                        switch($scope.keyCode){
                            case 'orderId':
                                curPageData.orderId = $scope.keyStr ? $scope.keyStr : '';
                                break;
                            case 'telphone':
                                curPageData.mobile = $scope.keyStr ? $scope.keyStr : '';
                                break;
                            case 'personName':
                                curPageData.name = $scope.keyStr ? $scope.keyStr : '';
                                break;
                            default:
                        }
                        getOrderList(curPageData);
                    }
                });
            }

            //获取订单列表列表
            function getOrderList(pageObj){
                $model.$getOrderList(pageObj).then(function(res){
                    if(res.data.ret == 200000){
                        var dataObj = res.data.data;
                        var listData = dataObj.list || [];
                        $scope.orderList = listData;
                        var newPageObj = {
                            allPages : dataObj.page.pageNumber,
                            currentPage : dataObj.page.currentPageNumber
                        };
                        $scope.pageNum = dataObj.page.currentPageNumber;
                        $scope.totalCount = dataObj.page.count;
                        if ($(".tcdPageCode").createPage) {
                            $(".tcdPageCode").remove();
                        }
                        $(".page_sec").append("<div class='tcdPageCode'></div>");
                        $scope.$apply();
                        createPageTools(newPageObj);
                    }
                })
            }

            getOrderList(initPage);

            //搜索
            $scope.search = function(){
                var searchData = {
                    status : $scope.orderState,//订单状态
                    provinceCode : $scope.provinceCode,//省份id
                    cityCode : $scope.cityCode,//地市id
                    areaCode : $scope.areaCode,//区县id                   
                    startTime : $scope.startTime ? $scope.startTime + ':00' : '',//开始时间
                    endTime : $scope.endTime ? $scope.endTime + ':00' : '',//结束时间
                    activityId : $scope.activeId ? $scope.activeId : '', //活动名称
                    productLevel : $scope.awardLevel ? $scope.awardLevel : '', //奖项等级
                    pageNum: 1,
                    pageSize: 10
                }
                switch($scope.keyCode){
                    case 'orderId':
                        searchData.orderId = $scope.keyStr ? $scope.keyStr : '';
                        break;
                    case 'telphone':
                        searchData.mobile = $scope.keyStr ? $scope.keyStr : '';
                        break;
                    case 'personName':
                        searchData.name = $scope.keyStr ? $scope.keyStr : '';
                        break;
                    default:
                }
                getOrderList(searchData);
            }
            //重置
            $scope.reset = function(){
                $scope.orderState = '';
                $scope.provinceCode = '';
                $scope.cityCode = '';
                $scope.areaCode = '';
                $scope.startTime = '';
                $scope.endTime = '';
                $scope.activeName = '';
                $scope.awardLevel = '';
                getOrderList(initPage);
            }
            function exportNoDelivery(exportObj){ //导出未发货订单
                var url = '/api/tztx/xj/order/export/undeliveredOrder';
                var xhr = new XMLHttpRequest();
                var formData = new FormData();
                for(var attr in exportObj) {
                    formData.append(attr, exportObj[attr]);
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
            $scope.exportNoDelivery = function(){ //导出未发货订单
                var exportData = {
                    status : $scope.orderState ? $scope.orderState : '',//订单状态
                    provinceCode : $scope.provinceCode ? $scope.provinceCode : '',//省份id
                    cityCode : $scope.cityCode ? $scope.cityCode : '',//地市id
                    areaCode : $scope.areaCode ? $scope.areaCode : '',//区县id                   
                    startTime : $scope.startTime ? $scope.startTime + ':00' : '',//开始时间
                    endTime : $scope.endTime ? $scope.endTime + ':00' : '',//结束时间
                    activityId : $scope.activeId ? $scope.activeId : '', //活动id
                    productLevel : $scope.awardLevel ? $scope.awardLevel : '' //奖项等级
                }
                switch($scope.keyCode){
                    case 'orderId':
                        exportData.orderId = $scope.keyStr ? $scope.keyStr : '';
                        break;
                    case 'telphone':
                        exportData.mobile = $scope.keyStr ? $scope.keyStr : '';
                        break;
                    case 'personName':
                        exportData.name = $scope.keyStr ? $scope.keyStr : '';
                        break;
                    default:
                }
                exportNoDelivery(exportData);
            }
            //导入物流订单
            $('#importTrackOrder').change(function(){
                var addTrackFile = $('#importTrackOrder')[0].files[0];
                if(addTrackFile != undefined){
                    var formData = new FormData();
                    formData.append('file',addTrackFile);
                    $.ajax({
                        url: '/api/tztx/xj/order/import/OrdersTracking',
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
            $scope.showOrderDetail = function(orderId){ //显示订单详情
                $model.$getOrderDetailById({orderId:orderId}).then(function(res){
                    if(res.data.ret == 200000){
                        $scope.orderDetailItem = res.data.data;
                        $scope.orderId = $scope.orderDetailItem.baseInfo.orderId;
                        $scope.name = $scope.orderDetailItem.userInfo.name;
                        $scope.mobile = $scope.orderDetailItem.userInfo.mobile;
                        $scope.selectProvince = $scope.orderDetailItem.userInfo.provinceCode;
                        $scope.changeProvince($scope.selectProvince);
                        $scope.selectCity = $scope.orderDetailItem.userInfo.cityCode;
                        $scope.changeCity($scope.selectCity);
                        $scope.selectArea = $scope.orderDetailItem.userInfo.areaCode;
                        $scope.address = $scope.orderDetailItem.userInfo.address;
                        $scope.showOrderList = false;
                        $scope.$apply();
                    }
                })
            }
            $scope.goBack = function(){ //返回订单详情列表
                $scope.showOrderList = true;
            }
            function updatedTrackAddress(trackAddressObj){ //修改物流收货地址
                $model.$updateTrackAddress(trackAddressObj).then(function(res){
                    if(res.data.ret == 200000){
                        $scope.showOrderList = true;
                        getOrderList(initPage);
                        $scope.$apply();
                    }
                })
            }
            $scope.updateTrackAddress = function(){ //修改收货地址
                if($scope.orderDetailItem.baseInfo.status < 3){ //待发货的状态可修改地址
                    var trackAddressObj = {
                        orderId : $scope.orderId,
                        name : $scope.name,
                        mobile : $scope.mobile,
                        address : $scope.address,
                        provinceCode : $scope.selectProvince,
                        cityCode : $scope.selectCity,
                        areaCode : $scope.selectArea
                    }
                    updatedTrackAddress(trackAddressObj);
                }else{
                    $scope.showOrderList = true; 
                }
            }
        }]
    };

    return actmanageController;
});