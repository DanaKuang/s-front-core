/***/
function strToTimestamp(s) {
  s = s.replace(/-/g,"/");
  var date = new Date(s );
  return date.valueOf();
}
define([], function () {
	var manageCtrl = {
		ServiceType: "controller",
	    ServiceName: "manageCtrl",
	    ViewModelName: 'manageViewModel',
	    ServiceContent: ['$scope', 'dateFormatFilter', function ($scope, dateFormatFilter) {
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
		        autoclose:true,
		        endDate:new Date()
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
		        autoclose:true,
		        endDate:new Date()
		    }).on("click",function(){
		        $("#timeEnd2").datetimepicker("setStartDate",$("#timeStart2").val());
		    });
		    //零售户列表
		    $("#manage-list").off().on('click', function (e) {
		    	var search = $("#input1").val();
		    	var timeStart = strToTimestamp($("#timeStart1").val());
		    	var timeEnd = strToTimestamp($("#timeEnd1").val());
		    	$model.getTblData({
		    		search: '',
		    		pageNum: 1,
		    		pageSize: 10,
		    		addrCity: addrCity,
		    		appStartTime: timeStart,
		    		appEndTime:timeEnd
			    }).then(function (res) {
			    	for(var i=0;i<res.data.data.length;i++){
				    	res.data.data[i].applyTime=getLocalTime(res.data.data[i].applyTime);
				    	// if(res.data.data[i].authStatus==1){
				    	// 	res.data.data[i].authStatus = "审核通过";
				    	// }else if(res.data.data[i].authStatus==2){
				    	// 	res.data.data[i].authStatus = "审核不通过";
				    	// }
				    }

			    	$scope.listData = res.data.data || [];
			    	$scope.$apply();
			    });
		    });
		    //零用户管理->零售户二维码
		    $("#manage-erwei").off().on('click', function (e) {
		     	var timeStart2 = $("#timeStart2").val();
			    var timeEnd2 = $("#timeEnd2").val();
			    var search = $("#input2").val();
			    var isPay = $("#is-pay option:selected").text();
			    if(isPay=="未支付"){
			    	isPay=0;
			    }else {
			    	isPay=1;
			    }
			    var orderStatus = $("#send option:selected").text();
			    if(orderStatus=="未发货"){
			    	orderStatus=5;
			    }else {
			    	orderStatus=1;
			    }
		    	$model.getTbErwei({
		    		search: '',
		    		pageNum: 1,
		    		pageSize: 10,
		    		isPay:isPay,
		    		orderStatus:orderStatus,
		    		startTime: strToTimestamp(timeStart2),
			    	endTime: strToTimestamp(timeEnd2)
			    }).then(function (res) {
			    	for(var i=0;i<res.data.data.length;i++){
				    	res.data.data[i].ctime=getLocalTime(res.data.data[i].ctime);
				    }
			    	$scope.erweiData = res.data.data || [];
			    	$scope.$apply();
			    });
		    });
		     //点击切换页面
		    $scope.myVar = true;
		    $scope.toggle = function() {
		        $scope.myVar = !$scope.myVar;
		        // sellerId
		        $model.getDetail({
		    		sellerId:3000044
			    }).then(function (res) {
			    	res.data.data.sellerInfo.applyTime = getLocalTime(res.data.data.sellerInfo.applyTime);
			    	res.data.data.sellerInfo.lastUpdateTime = getLocalTime(res.data.data.sellerInfo.lastUpdateTime);
			    	var authStatus= parseInt(res.data.data.sellerInfo.authStatus);
			    	if( authStatus== 1){
			    		authStatus = "审核通过";
			    	}else if(authStatus == 2){
			    		authStatus = "审核未通过";
			    	}else if(authStatus == 3){
			    		authStatus = "在审核";
			    	}
			    	res.data.data.sellerInfo.authStatus =authStatus;
			    	$scope.detailData = res.data.data || [];
			    	$scope.$apply();
			    });
		    };
		    //商品详情-->审核通过
		    $scope.secondThough=function(){
		    	alert("恭喜您审核已经通过");
		    	$("#authStatus").text("审核通过");
		    	console.log($("#authStatus").text())
		    }
		    ////商品详情-->审核驳回
		     $scope.secondBack=function(){
		     	$(".goods-back").attr({"data-toggle":"modal","data-target":"#myModal"});
		     	$("#shen-though").css("display","none");
		     	$("#shen-back").css("display","none");
		     	$("#content-text").css("display","block");
		     	$("#refuse-reason").change(function(){
		     		var mydate = new Date();
				    var str = "" + mydate.getFullYear() + "年";
				    str += (mydate.getMonth()+1) + "月";
				    str += mydate.getDate() + "日";
		     		$("#reason-box").append("<p id='back-reason' 'class'='col-ms-12'><p>");
		     		$("#back-reason").text(str + $("#refuse-reason").val());
		     	})
		    }
		    // 省市区
		    var addrCity=0;
		   $scope.province = $model.$province.data;
		   $("#provinceId").change(function (e) {
		   		$model.getCity({
		   			parentCode: e.target.value || ''
		   		}).then(function (res) {
		   			$scope.city = res.data;
		   			$scope.$apply();
		   			addrCity = res.data[0].code;
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
		   //审核
		   	$scope.authResult = 1;
		   	$scope.shenThough=function(){
		   		$scope.authResult = 1;
		   		$("#though-check").css("display","block");
		   		$("#content-text").css("display","none");
			    $model.getApproval({
			    	authResult: $scope.authResult,
			    	failReason: '',
			    	note: '',
			    	sellerId:3000050
				}).then(function (res) {
					$scope.approvalData = res.data.data || [];
					$scope.$apply();
				});
		   	}
		   	$scope.shenBack=function(){
		   		$("#content-text").css("display","block");
		   		$("#though-check").css("display","none");
		   		$scope.authResult = 2;
		   		$scope.failReason = $("#refuse-reason").val();
			    $model.getApproval({
			    	authResult: $scope.authResult,
			    	failReason: $scope.failReason,
			    	note: '',
			    	sellerId:3000050
				}).then(function (res) {
					$scope.approvalData = res.data.data || [];
					$scope.$apply();
				});
		   	}
		   	
		   // 零售户详情
		   //设置input的默认时间
	        var stattime = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + (new Date().getDate() - 1);
	        var endtime = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + (new Date().getDate());
	        $("#timeStart111").val(stattime);
	        $("#timeStart222").val(stattime);
	        $("#timeStart333").val(stattime);
	        $("#timeEnd111").val(endtime);
	        $("#timeEnd222").val(endtime);
	        $("#timeEnd333").val(endtime);
		         $("#timeStart111").datetimepicker({
				      format: 'yyyy-mm-dd',
				       minView:'month',
				       language: 'zh-CN',
				       autoclose:true
				 }).on("click",function(){
				       $("#timeStart111").datetimepicker("setEndDate",$("#timeEnd111").val());
				 });
			$("#timeEnd111").datetimepicker({
			          format: 'yyyy-mm-dd',
			          minView:'month',
			          language: 'zh-CN',
			          autoclose:true,
			          endDate:new Date()
			}).on("click",function(){
			     $("#timeEnd111").datetimepicker("setStartDate",$("#timeStart111").val());
			});
			$("#timeStart222").datetimepicker({
			          format: 'yyyy-mm-dd',
			          minView:'month',
			          language: 'zh-CN',
			          autoclose:true
			}).on("click",function(){
			     $("#timeStart222").datetimepicker("setEndDate",$("#timeEnd222").val());
			});
			$("#timeEnd222").datetimepicker({
			          format: 'yyyy-mm-dd',
			          minView:'month',
			          language: 'zh-CN',
			          autoclose:true,
			          endDate:new Date()
			}).on("click",function(){
			     $("#timeEnd222").datetimepicker("setStartDate",$("#timeStart222").val());
			});
			$("#timeStart333").datetimepicker({
			          format: 'yyyy-mm-dd',
			          minView:'month',
			          language: 'zh-CN',
			          autoclose:true
			}).on("click",function(){
			     $("#timeStart333").datetimepicker("setEndDate",$("#timeEnd333").val());
			});
			$("#timeEnd333").datetimepicker({
			          format: 'yyyy-mm-dd',
			          minView:'month',
			          language: 'zh-CN',
			          autoclose:true,
			          endDate:new Date()
			}).on("click",function(){
			     $("#timeEnd333").datetimepicker("setStartDate",$("#timeStart333").val());
			});
			$("#return").off().on('click', function (e) {
			      	var unit = $("#manage-unit option:selected").text();
			      	var isFx = $("#manage-isfx option:selected").text();
			      	
			      	if(isFx=="有"){
			      		isFx=1;
			      	} else {
			      		isFx=0;
			      	}
			      	alert(isFx);
			      	var startTime = strToTimestamp($("#timeStart111").val());
					var endTime = strToTimestamp($("#timeEnd111").val());
			    	$model.getReturn({
			    		pageNum: 1,
			    		pageSize: 10,
			    		unit: unit || [],
			    		isFx: isFx,
			    		startTime: startTime,
			    		endTime: endTime,
			    		sellerId:3000037
				    }).then(function (res) {
				    	//将时间戳变为日期
				    	for(var i=0;i<res.data.data.length;i++){
				    		res.data.data[i].ctime=getLocalTime(res.data.data[i].ctime);
				    		res.data.data[i].zjTime=getLocalTime(res.data.data[i].zjTime);	
				    	}
				    	// console.log(res.data.data[0].zjTime)
				    	$scope.returnData = res.data.data || [];
				    	$scope.$apply();
				    });
			});
			      
			$("#tixian").off().on('click', function (e) {
			    	var timeEnd333=$("#timeEnd333").val();
			    	var timeStart333=$("#timeStart333").val();
			    	$model.getTixian({
			    		pageNum: 1,
			    		pageSize: 10,
			    		startTime: strToTimestamp(timeStart333),
			    		endTime: strToTimestamp(timeEnd333),
			    		sellerId:3000044
				    }).then(function (res) {
				    	for(var i=0;i<res.data.data.length;i++){
				    		res.data.data[i].txTime=getLocalTime(res.data.data[i].txTime);
				    	}
				    	$scope.tixianData = res.data.data || [];
				    	$scope.$apply();
				    });
			});
			$("#count").off().on('click', function (e) {
			    	$model.getCount({
			    		pageNum: 1,
			    		pageSize: 10,
			    		sellerId:3000037
				    }).then(function (res) {
				    	$scope.countData = res.data.data || [];
				    	$scope.$apply();
				    });
			});
			// 订单下载模块
			$("#timeStart").datetimepicker({
		        format: 'yyyy-mm-dd',
		        minView:'month',
		        language: 'zh-CN',
		        autoclose:true
		    }).on("click",function(){
		        $("#timeStart").datetimepicker("setEndDate",$("#timeEnd").val());
		    });
		    $("#timeEnd").datetimepicker({
		        format: 'yyyy-mm-dd',
		        minView:'month',
		        language: 'zh-CN',
		        autoclose:true
		    }).on("click",function(){
		        $("#timeEnd").datetimepicker("setStartDate",$("#timeStart").val());
		    });
		    $("#timeStart11").datetimepicker({
		        format: 'yyyy-mm-dd',
		        minView:'month',
		        language: 'zh-CN',
		        autoclose:true
		    }).on("click",function(){
		        $("#timeStart11").datetimepicker("setEndDate",$("#timeStart11").val());
		    });
		    $("#timeStart22").datetimepicker({
		        format: 'yyyy-mm-dd',
		        minView:'month',
		        language: 'zh-CN',
		        autoclose:true
		    }).on("click",function(){
		        $("#timeStart22").datetimepicker("setEndDate",$("#timeStart22").val());
		    });
		    $("#timeStart33").datetimepicker({
		        format: 'yyyy-mm-dd',
		        minView:'month',
		        language: 'zh-CN',
		        autoclose:true
		    }).on("click",function(){
		        $("#timeStart33").datetimepicker("setEndDate",$("#timeStart33").val());
		    });
		    //上传订单文件
		    $("#timeStart1111").datetimepicker({
		        format: 'yyyy-mm-dd',
		        minView:'month',
		        language: 'zh-CN',
		        autoclose:true
		    }).on("click",function(){
		        $("#timeStart1111").datetimepicker("setEndDate",$("#timeStart1111").val());
		    });
		    $("#timeStart2222").datetimepicker({
		        format: 'yyyy-mm-dd',
		        minView:'month',
		        language: 'zh-CN',
		        autoclose:true
		    }).on("click",function(){
		        $("#timeStart2222").datetimepicker("setStartDate",$("#timeStart2222").val());
		    });
		    $('#jqmeter-container').jQMeter({
		        goal:'$100',
		        raised:'$70',
		        orientation:'vertical',
		        width:'460px',
		        height:'40px',
		        bgColor:'#ECEDF0',
		        barColor:'lightgreen'
		    });  
		    // 二维码订单导出
			$(".down").click(function (e) {
				var search = $("#timeStart11").val();
				var timeEnd = $("#timeEnd").val();
				var timeStart = $("#timeStart").val();
				var url = '/api/tztx/seller-manager/export/print/qr?';
				search && (url += 'search=' + strToTimestamp(search) + '&');
				timeEnd && (url += 'endTime=' + strToTimestamp(timeEnd) + '&');
				timeStart && (url += 'startTime=' + strToTimestamp(timeStart));
				window.open(url);
			});
			// 文件上传
			$('#fileupload').change(function(){
			    var performanceFile = $('#fileupload')[0].files[0];
			    //fileLimit
			    if(performanceFile != undefined){
			        if(performanceFile.size > fileLimit){
			            $('#performance_warn').html('文件大小超过50M，不能上传！');
			            return;
			        }
			        $('#performance_warn').html('文件上传中...');
			        var formData = new FormData();
			        formData.append('file',performanceFile);
			        $.ajax({
			            url: '/api/tztx/seller-manager/import/tracking/info',
			            type: 'POST',
			            cache: false,
			            data: formData,
			            processData: false,
			            contentType: false,
			            headers: {
			                ContentType: "multipart/form-data",
			                loginId : sessionStorage.access_loginId ,
			                token : sessionStorage.access_token
			            }
			        }).done(function(res) {
			            performanceAttach = res.data.attachCode;
			            performanceFileName = res.data.filename;
			            $('#performanceName').html(res.data.filename);
			            $('#performance_warn').html('文件上传成功！');

			        }).fail(function(res) {
			            $('#performance_warn').html('文件上传失败！');
			        });
			    }
			});
	    }]
	};
	return manageCtrl;
})
