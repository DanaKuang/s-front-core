/***/

define([], function () {
	var rewardCtrl = {
		ServiceType: "controller",
	    ServiceName: "rewardCtrl",
	    ViewModelName: 'rewardViewModel',
	    ServiceContent: ['$scope', function ($scope) {
	    	var $model = $scope.$model;
	    	//客户返现设置
			$("#award").off().on('click', function (e) {
			   var award=$(".money").val();
			   $model.getAward({
				   	percent: award
			   }).then(function (res) {
				   $scope.awardData = res.data.data || [];
				   $scope.$apply();
				   res.data.seller_reward_percent=res.data.seller_reward_percent*100;
			   });
			});
	    	//客户活动介绍
		   	$("#intrSave").off().on('click', function (e) {
		   	   var introduction=$("#textintro").val();
			   $model.getIntroduction({
				   	introduction: introduction
			   }).then(function (res) {
				   $scope.introductionData = res.data.data || [];
				   $scope.$apply();
			   });
			});
			//开启关闭按钮
			
			var index;
			$scope.openSet=function(){
			    $(".openButton1").css("backgroundColor","#6db1fb");
			    $(".closeButton1").css("backgroundColor","#fff")
			    index=1;
			    $("#free-numble").removeAttr("disabled"); 
			};
			$scope.closeSet=function(){
			    $(".closeButton1").css("backgroundColor","#6db1fb");
			    $(".openButton1").css("backgroundColor","#fff")
			   	index=0;
				$("#free-numble").attr("disabled","disabled"); 
			} 			
			//免费二维码设置
			$("#numbleSave").off().on('click', function (e) {
					var freeNum=$(".numble input").val();
					var qrExpenses=$("#copyMoney").val();
			    	$model.getQr({
			    		isFree:index,
			    		freeNum: freeNum || '',
			    		qrExpenses:qrExpenses || ''
				    }).then(function (res) {
				    	$scope.tixianData = res.data.data || [];
				    	$scope.$apply();
				    });
			 });
			$scope.select = $model.$select.data.data;
			//店码-盒码关联间隔设置
			$("#consumerSave").off().on('click', function (e) {
					var time=$(".spaceTime input").val();
			    	$model.getConsumer({
			    		time:time
				    }).then(function (res) {
				    	$scope.consumerData = res.data.data || [];
				    	$scope.$apply();
				    });
			 });
	    }]
	};
	return rewardCtrl;
})