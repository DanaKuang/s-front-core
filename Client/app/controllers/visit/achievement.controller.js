/***/
function strToTimestamp(s) {
	s = s.replace(/-/g, "/");
	var date = new Date(s);
	return date.valueOf();
}
define([], function() {
	var achievementCtrl = {
		ServiceType: "controller",
		ServiceName: "achievementCtrl",
		ViewModelName: 'achievementViewModel',
		ServiceContent: ['$scope', function($scope) {
			var $model = $scope.$model;
			//设置input的默认时间
			var stattime = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + (new Date().getDate() - 10);
			var endtime = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + (new Date().getDate());
			$("#timeStart1").val(stattime);
			$("#timeStart2").val(stattime);
			$("#timeEnd1").val(endtime);
			$("#timeEnd2").val(endtime);
			$("#timeStart1").datetimepicker({
				format: 'yyyy-mm-dd',
				minView: 'month',
				language: 'zh-CN',
				autoclose: true
			}).on("click", function() {
				$("#timeStart1").datetimepicker("setEndDate", $("#timeEnd1").val());
			});
			$("#timeEnd1").datetimepicker({
				format: 'yyyy-mm-dd',
				minView: 'month',
				language: 'zh-CN',
				autoclose: true,
				endDate:new Date()
			}).on("click", function() {
				$("#timeEnd1").datetimepicker("setStartDate", $("#timeStart1").val());
			});
			$("#timeStart2").datetimepicker({
				format: 'yyyy-mm-dd',
				minView: 'month',
				language: 'zh-CN',
				autoclose: true
			}).on("click", function() {
				$("#timeStart2").datetimepicker("setEndDate", $("#timeEnd2").val());
			});
			$("#timeEnd2").datetimepicker({
				format: 'yyyy-mm-dd',
				minView: 'month',
				language: 'zh-CN',
				autoclose: true,
				endDate:new Date()
			}).on("click", function() {
				$("#timeEnd2").datetimepicker("setStartDate", $("#timeStart2").val());
			});
			//零售户业绩排名
			$("#seacherId").off().on('click', function(){
				var startTime = $("#timeStart2").val();
				var endTime = $("#timeEnd2").val();
				var seacherId = {
					pageNum: 1,
					pageSize: 2,
					startTime: strToTimestamp(startTime),
					endTime: strToTimestamp(endTime)
			 	}
                $model.getTblStatic(seacherId).then(function(res) {
					$scope.staticData = res.data.data || [];
					$scope.$apply();
					var pageCount = Math.ceil(res.data.totalNum/seacherId.pageSize);					
					$(".tcdPageCode").remove();
                    $(".rf").append("<div class='tcdPageCode'></div>");
                    $(".tcdPageCode").createPage({
						pageCount:pageCount,
						current: seacherId.pageNum,
						backFn: function(p) {     
                            seacherId.pageNum =p;
							$model.getTblStatic(seacherId).then(function(res) {
								$scope.staticData = res.data.data || [];
								$scope.$apply();
							});
						}
					});
				});
			});
			$("#seacherId").trigger("click");
			//零售户业绩列表
			$("#achievement-seacher").off().on('click', function(){
				var search = $("#input1").val();
				var isFx=$("#isReturn").val();
				var startTime=$("#timeStart1").val();
				var endTime=$("#timeEnd1").val();
				var yjParam = {
					search: search,
					isFx:isFx,
					startTime:strToTimestamp(startTime),
					endTime:strToTimestamp(endTime),
					pageNum:1,
					pageSize:2
			 	}
                $model.getTblDetail(yjParam).then(function(res) {
					for(var i = 0; i < res.data.data.length; i++) {

						res.data.data[i].cousumerScTime = getLocalTime(res.data.data[i].cousumerScTime);
					}
					$scope.detailData = res.data.data || [];
					$scope.$apply();
					var pageCount = Math.ceil(res.data.totalNum/yjParam.pageSize);					
					$(".tcdPageCode").remove();
                    $(".rf").append("<div class='tcdPageCode'></div>");
                    $(".tcdPageCode").createPage({
						pageCount:pageCount,
						current: yjParam.pageNum,
						backFn: function(p) {     
                            yjParam.pageNum =p;
							$model.getTblDetail(yjParam).then(function(res) {
								for(var i = 0; i < res.data.data.length; i++) {
									if(res.data.data[i].cousumerScTime){
										res.data.data[i].cousumerScTime = getLocalTime(res.data.data[i].cousumerScTime);
									};
									
								}
								$scope.detailData = res.data.data || [];
								$scope.$apply();
							});
						}
					});
				});
			});

			$("#achievement-seacher").trigger('click');
		}]
	};
	return achievementCtrl;
})

