/**
 * Author: {author}
 * Create Date: 2017-10-16
 * Description: interface
 */
define([], function() {
    var dealerordermanageController = {
        ServiceType: "controller",
        ServiceName: "dealerordermanageCtrl",
        ViewModelName: 'dealerordermanageViewModel',
        ServiceContent: ['$scope','dateFormatFilter', 'dayFilter', function($scope,dateFormatFilter, dayFilter) {
			var $model = $scope.$model;
            //设置input的默认时间
            var allpage;
            var stattime = dayFilter.beforenday('date', 10);
            var endtime = dayFilter.today('date');

            function strToTimestamp(s) {
                s = s.replace(/-/g,"/");
                var date = new Date(s );
                return date.valueOf();
            }
            //时间戳变
            function getLocalTime(nS) {
                return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,4}$/,' ');
            }
            function openwin(){
                window.open("","","width=200,height=200")
            }
            $("#durationStart").val(stattime);
            $("#durationEnd").val(endtime); 
            $("#durationStart").datetimepicker({
                format: 'yyyy-mm-dd',
                minView:'month',
                language: 'zh-CN',
                autoclose:true
            }).on("click",function(){
                $("#durationStart").datetimepicker("setEndDate",$("#durationEnd").val());
            });
            $("#durationEnd").datetimepicker({
                format: 'yyyy-mm-dd',
                minView:'month',
                language: 'zh-CN',
                autoclose:true,
                endDate:new Date()
            }).on("click",function(){
                $("#durationEnd").datetimepicker("setStartDate",$("#durationStart").val());
            });
            
            
            //订单状态
            (function() {
            $model.$orderStates().then(function(res){
//          	console.log(res)
            	if(res.status != null){
            		
            		var res = res.data || [];
            		$scope.allBrands = res;
            		 $scope.$apply();
            	}
            })
            })()
            // 省市区
             $model.$province().then(function(res){
//          	console.log(res)
            	if(res.status != null){
            		
            		var res = res.data || [];
            		$scope.province = res;
            		 $scope.$apply();
            	}
            	})
            $("#provinceId").change(function (e) {
                $model.getCity({
                    parentCode: e.target.value || ''
                }).then(function (res) {
                	console.log(res)
                    $scope.city = res.data;
                    $scope.$apply();
                });
            });
            $("#cityId").change(function (e) {
                $model.getArea({
                    parentCode: e.target.value || ''
                }).then(function (res) {
                    $scope.area = res.data;
                    $scope.$apply();
                });
            });
            $scope.search = function(){
            	lists()
            }
            	//列表
            	var lists = function(){
            		var statusChange = $('.form-controlmdg').val();
            		var newCode = $('#newCode').val();
            		var provinceId = $('#provinceId').val();
            		var cityId = $('#cityId').val();
            		var areaId = $('#areaId').val();
            		var areaId = $('#areaId').val();
            		var durationStart = $('#durationStart').val();
            		var durationEnd = $('#durationEnd').val();
//          		var formcontrolaaa = $('.form-controlaaa').val();
            		console.log(durationStart)
            	var manageErwei = {
                    orderStatus: statusChange,//提现状态
                    orderId:newCode,//订单号
                    contactName:newCode,//抢购人
                    contactPhone:newCode,//手机号
                    salerName:newCode,//经销商
                    provinceId:provinceId,//省份id
                    cityId:cityId,//地市id
                    areaId:areaId,//区县id                   
                    pageNum: 1,
                    pageSize: 10,
                    startTime: durationStart,//开始时间
                    endTime:  durationEnd//结束时间
                }
            	
            	$model.$getOrderList(manageErwei).then(function(res){
            	console.log(res)
            	if(res.status != null){
            		for(var i=0;i<res.data.length;i++){
                        res.data[i].ctime=getLocalTime(res.data[i].ctime);
                        console.log(res.data[i].ctime)
                    }
            		var res = res.data || [];
            		$scope.topTenTable = res;
            		 $scope.$apply();
            	}
            	})
            	}
            	lists();
            	//跳转订单详情页
            	//点击切换页面
            	$scope.myVar = true;
            	$scope.canCelOrder = true;
            	$scope.orderInfo = function(params){
            		$scope.myVar = !$scope.myVar
            	}
            	$scope.goBack = function(params){
            		$scope.myVar = !$scope.myVar
            	}
        }]
    };

  return dealerordermanageController;
});