/***/
function strToTimestamp(s) {
  s = s.replace(/-/g,"/");
  var date = new Date(s );
  return date.valueOf();
}
define([], function () {
	var achievementCtrl = {
		ServiceType: "controller",
	    ServiceName: "achievementCtrl",
	    ViewModelName: 'achievementViewModel',
	    ServiceContent: ['$scope', function ($scope) {
	    	var $model = $scope.$model;
	    	//设置input的默认时间
	        var stattime = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + (new Date().getDate() - 1);
	        var endtime = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + (new Date().getDate());
	        $("#timeStart1").val(stattime);
	        $("#timeStart2").val(stattime);
	        $("#timeEnd1").val(endtime);
	        $("#timeEnd2").val(endtime);
	    	$("#timeStart1").datetimepicker({
		        format: 'yyyy-mm-dd',
		        minView:'month',
		        language: 'zh-CN',
		        autoclose:true
		    }).on("click",function(){
		        $("#timeStart1").datetimepicker("setEndDate",$("#timeStart2").val());
		    });
		    $("#timeEnd1").datetimepicker({
		        format: 'yyyy-mm-dd',
		        minView:'month',
		        language: 'zh-CN',
		        autoclose:true
		    }).on("click",function(){
		        $("#timeEnd1").datetimepicker("setStartDate",$("#timeStart1").val());
		    });
		    $("#timeStart2").datetimepicker({
		        format: 'yyyy-mm-dd',
		        minView:'month',
		        language: 'zh-CN',
		        autoclose:true
		    }).on("click",function(){
		        $("#timeStart2").datetimepicker("setEndDate",$("#timeStart2").val());
		    });
		    $("#timeEnd2").datetimepicker({
		        format: 'yyyy-mm-dd',
		        minView:'month',
		        language: 'zh-CN',
		        autoclose:true
		    }).on("click",function(){
		        $("#timeEnd2").datetimepicker("setStartDate",$("#timeStart2").val());
		    });
			$("#seacherId").off().on('click', function (e) {
				var startTime = $("#timeStart2").val();
				var endTime = $("#timeEnd2").val();
		    	$model.getTblStatic({
		    		pageNum: 1,
		    		pageSize: 10,
		    		startTime: strToTimestamp(startTime),
		    		endTime: strToTimestamp(endTime)
			    }).then(function (res) {
			    	$scope.staticData = res.data.data || [];
			    	$scope.$apply();
			    });
		    });
		    $("#achievement-seacher").off().on('click', function (e) {
		    	var startTime = $("#timeStart1").val();
				var endTime = $("#timeEnd1").val();
				var search = $("#input1").val();
		    	$model.getTblDetail({
		    		search: search || [],
		    		pageNum: 1,
		    		pageSize: 10,
		    		startTime: strToTimestamp(startTime),
		    		endTime: strToTimestamp(endTime)
			    }).then(function (res) {
			    	for(var i=0;i<res.data.data.length;i++){
				    	res.data.data[i].cousumerScTime=getLocalTime(res.data.data[i].cousumerScTime);
				    }
			    	$scope.detailData = res.data.data || [];
			    	$scope.$apply();
			    });
		    });	 	    
		}]
	};
	return achievementCtrl;
})