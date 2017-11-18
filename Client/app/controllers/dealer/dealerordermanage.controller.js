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
            
            	//列表
            	var lists = function(){
            		
            	var manageErwei = {
                    orderStatus: '',//提现状态
                    orderId:'',//订单号
                    contactName:'',//抢购人
                    contactPhone:'',//手机号
                    salerName:'',//经销商
                    provinceId:'',//省份id
                    cityId:'',//地市id
                    areaId:'',//区县id                   
                    pageNum: 1,
                    pageSize: 10,
                    startTime: '',//开始时间
                    endTime:  ''//结束时间
                }
            	
            	$model.$getOrderList(manageErwei).then(function(res){
            	console.log(res)
//          	if(res.status != null){
//          		
//          		var res = res.data || [];
//          		$scope.province = res;
//          		 $scope.$apply();
//          	}
            	})
            	}
            	lists()
        }]
    };

  return dealerordermanageController;
});