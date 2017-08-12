define([], function () {
	var winCountCtrl = {
		ServiceType: "controller",
	    ServiceName: "winCountCtrl",
	    ViewModelName: 'winCountViewModel',
	    ServiceContent: ['$scope', function ($scope) {
	    	var $model = $scope.$model;
		    $("#exampleInputName1").datetimepicker({
		        format: 'yyyy-mm-dd',
		        minView:'month',
		        language: 'zh-CN',
		        autoclose:true,
		        startDate:new Date()
		    }).on("click",function(){
		        $("#exampleInputName1").datetimepicker("setEndDate",$("#exampleInputName2").val());
		    });
		    $("#exampleInputName2").datetimepicker({
		        format: 'yyyy-mm-dd',
		        minView:'month',
		        language: 'zh-CN',
		        autoclose:true,
		        startDate:new Date()
		    }).on("click",function(){
		        $("#exampleInputName2").datetimepicker("setStartDate",$("#exampleInputName1").val());
		    });
	    }]
	};
	return winCountCtrl;
})