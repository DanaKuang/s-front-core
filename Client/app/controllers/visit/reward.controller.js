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
			   var award=parseInt($(".money").val());
			   // alert(award);
			   $model.getAward({
				   	percent: award
			   }).then(function (res) {
				   $scope.awardData = res.data.data || [];
				   $scope.$apply();
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
			
				var index=1;
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
			//维码设置历史记录
			
			// $("#freestore").off().on('click', function (e) {
			// 	 $scope.his= $model.$his.data.data;
			// 	$("#content-reward").css("opacity","0.5")
			// 	 $($scope.his).each(function(index){
 		// 			var time=getLocalTime($scope.his[index].ctime);
			// 		$("#bbb").append("<p>"+time+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开启&nbsp;&nbsp;免费名额"+$scope.his[index].qrFreeNum+"人</p>");
			// 	 })
			// 	 	// console.dir($scope.his[i]);
			// 	 	// $("#bbb").html($scope.his[i].ctime);
			// 	 $("#aaa").css("z-index","999");
			// 	 $("#pleaseColse").on('click',function(){
			// 	 	 $("#aaa").hide();
			// 	 	 $("#content-reward").css("opacity","1")
			// 	 })
			// });
			//免费二维码设置
			$("#numbleSave").off().on('click', function (e) {
					var freeNum=$(".numble input").val();
					var qrExpenses=$("#copyMoney").val();
			    	$model.getQr({
			    		isFree:index || '',
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