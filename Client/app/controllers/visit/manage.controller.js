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
            var allpage;
            var stattime = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + (new Date().getDate() - 10);
            var endtime = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + (new Date().getDate());
            $("#timeStart1").val(stattime);
            $("#timeStart2").val(stattime);
            $("#timeEnd1").val(endtime);
            $("#timeEnd2").val(endtime);
            $("#timeStart").val(endtime);
            $("#timeStart1").datetimepicker({
                format: 'yyyy-mm-dd',
                minView:'month',
                language: 'zh-CN',
                autoclose:true
            }).on("click",function(){
                $("#timeStart1").datetimepicker("setEndDate",$("#timeEnd1").val());
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
                $("#timeStart2").datetimepicker("setEndDate",$("#timeEnd2").val());
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
            //零售户管理-->零售户列表
            $("#manage-list").off().on('click', function(){
                var provinceId = $("#provinceId").val();
                var cityId = $("#cityId").val();
                var areaId = $("#areaId").val();
                var timeStart1 = $("#timeStart1").val();
                var timeEnd1 = $("#timeEnd1").val();
                var authStatus = $("#authStatus").val();
                var manageList = {
                    search: $("#input1").val(),
                    pageNum: 1,
                    pageSize: 10,
                    addrCity: cityId,
                    addrArea:areaId,
                    addrProvince: provinceId,
                    authStatus:authStatus,
                    appStartTime: strToTimestamp(timeStart1) || '',
                    appEndTime: strToTimestamp(timeEnd1)+86400000 || ''
                };
                var arr=['食杂店', '便利店', '超市', '商场', '烟酒商店', '娱乐服务', '其他'];
                $model.getTblData(manageList).then(function(res) {
                    for(var i=0;i<res.data.data.length;i++){
                        res.data.data[i].applyTime=getLocalTime(res.data.data[i].applyTime);
                        if(res.data.data[i].authStatus==1){
                            res.data.data[i].authStatus = "待审核";
                            res.data.data[i].isShow= false;
                        }else if(res.data.data[i].authStatus==2){
                            res.data.data[i].authStatus = "审核通过";
                            res.data.data[i].isShow= true;
                        }else if(res.data.data[i].authStatus==3){
                            res.data.data[i].authStatus = "审核未通过";
                            res.data.data[i].isShow= false;
                        }
                        var commercial = res.data.data[i].commercial;
                        res.data.data[i].commercial = arr[commercial-1];
                        var district= parseInt(res.data.data[i].district);
                        if(district==1){
                            district ="城镇";
                        }else if(district==2){
                            district ="乡村";
                        }
                        res.data.data[i].district =district;
                    }
                    $scope.listData = res.data.data || [];
                    $scope.$apply();
                    var pageCount = Math.ceil(res.data.totalNum/manageList.pageSize);
                    $("#pageCount").text(res.data.totalNum);
                    if(manageList.pageSize<=res.data.totalNum){
                        $("#pageSize").text(manageList.pageSize);
                    }else{
                        $("#pageSize").text(res.data.totalNum);
                    }
                    $(".tcdPageCode").remove();
                    $(".rf").append("<div class='tcdPageCode'></div>");
                    $(".tcdPageCode").createPage({
                        pageCount:pageCount,
                        current: manageList.pageNum,
                        backFn: function(p) {
                            manageList.pageNum =p;
                            $model.getTblData(manageList).then(function(res) {
                                for(var i=0;i<res.data.data.length;i++){
                                    res.data.data[i].applyTime=getLocalTime(res.data.data[i].applyTime);
                                    if(res.data.data[i].authStatus==1){
                                        res.data.data[i].authStatus = "待审核";
                                        res.data.data[i].isShow= false;
                                    }else if(res.data.data[i].authStatus==2){
                                        res.data.data[i].authStatus = "审核通过";
                                        res.data.data[i].isShow= true;
                                    }else if(res.data.data[i].authStatus==3){
                                        res.data.data[i].authStatus = "审核未通过";
                                        res.data.data[i].isShow= false;
                                    }
                                    var commercial = res.data.data[i].commercial;
                                    res.data.data[i].commercial = arr[commercial-1];
                                    var district= parseInt(res.data.data[i].district);
                                    if(district==1){
                                        district ="城镇";
                                    }else if(district==2){
                                        district ="乡村";
                                    }
                                    res.data.data[i].district =district;
                                }
                                $scope.listData = res.data.data || [];
                                $scope.$apply();
                                $("#pageCount").text(res.data.totalNum);

                                if(manageList.pageSize<=res.data.totalNum){
                                    if(manageList.pageNum==pageCount){
                                        $("#pageSize").text(res.data.totalNum%manageList.pageSize);
                                    }else{
                                        $("#pageSize").text(manageList.pageSize);
                                    }

                                }else{
                                    $("#pageSize").text(res.data.totalNum);
                                }
                            });
                        }
                    });
                });
            });
            // 图片放大功能
            $scope.showBig=function(licenceImg){
                var img = new Image();
                // 改变图片的src
                img.src = licenceImg;
                var Height=0.5*img.height
                var Width=0.5*img.width
                $("#bigImg").css({"height":Height+"px","width":Width+"px"});
                $("#file-modal-content1").css({"height":Height+"px","width":Width+"px"});
                $("#bigImg").attr('src',licenceImg);
            }
            $('#tab1[data-toggle="tab"]').on('show.bs.tab',function(e){
                $("#manage-list").trigger('click');
            });
            $("#manage-list").trigger('click');

            $scope.aaa = function(tr){
                $("#sellerId").val(tr.sellerId);

            }
            //零用户管理->零售户二维码
            $("#manage-erwei").off().on('click', function(){
                var timeStart2 = $("#timeStart2").val();
                var timeEnd2 = $("#timeEnd2").val();
                var isDispatch = $("#send").val();
                var manageErwei = {
                    search: $("#input2").val(),
                    pageNum: 1,
                    pageSize: 10,
                    isDispatch:isDispatch,
                    // orderStatus:orderStatus,
                    isPay:$("#is-pay").val(),
                    startTime: strToTimestamp(timeStart2) || '',
                    endTime: strToTimestamp(timeEnd2)+86400000 || ''
                }
                var authStatusArr=["","认证中","已认证","认证失败"];
                var orderStatusArr=["","待支付","待处理","已发货","已收货","已取消","已处理"]
                $model.getTbErwei(manageErwei).then(function(res) {
                    for(var i=0;i<res.data.data.length;i++){
                        res.data.data[i].ctime=getLocalTime(res.data.data[i].ctime);
                        res.data.data[i].authStatus = authStatusArr[res.data.data[i].authStatus];
                        res.data.data[i].orderStatus = orderStatusArr[res.data.data[i].orderStatus];
                    }
                    $scope.erweiData = res.data.data || [];
                    $scope.$apply();
                    var pageCount = Math.ceil(res.data.totalNum/manageErwei.pageSize);
                    $("#pageCount").text(res.data.totalNum);
                    if(manageErwei.pageSize<=res.data.totalNum){
                        $("#pageSize").text(manageErwei.pageSize);
                    }else{
                        $("#pageSize").text(res.data.totalNum);
                    }
                    $(".tcdPageCode").remove();
                    $(".rf").append("<div class='tcdPageCode'></div>");
                    $(".tcdPageCode").createPage({
                        pageCount:pageCount,
                        current: manageErwei.pageNum,
                        backFn: function(p) {
                            manageErwei.pageNum =p;
                            $model.getTbErwei(manageErwei).then(function(res) {
                                for(var i=0;i<res.data.data.length;i++){
                                    res.data.data[i].authStatus = authStatusArr[res.data.data[i].authStatus];
                                    res.data.data[i].orderStatus = orderStatusArr[res.data.data[i].orderStatus];
                                    res.data.data[i].ctime=getLocalTime(res.data.data[i].ctime);
                                }
                                $scope.erweiData = res.data.data || [];
                                $scope.$apply();
                                $("#pageCount").text(res.data.totalNum);
                                if(manageErwei.pageSize<=res.data.totalNum){
                                    if(manageErwei.pageNum==pageCount){
                                        $("#pageSize").text(res.data.totalNum%manageErwei.pageSize);
                                    }else{
                                        $("#pageSize").text(manageErwei.pageSize);
                                    }

                                }else{
                                    $("#pageSize").text(res.data.totalNum);
                                }
                            });
                        }
                    });
                });
            });
            //页面加载的时候加载数据
            $('#tab2[data-toggle="tab"]').on('show.bs.tab',function(e){
                $("#manage-erwei").trigger('click');
            });
            $('#tabFx[data-toggle="tab"]').on('show.bs.tab',function(e){
                $("#return").trigger("click");
            });
            $('#tabSao[data-toggle="tab"]').on('show.bs.tab',function(e){
                $("#tabSao").trigger("click");
            });
            $('#tabTx[data-toggle="tab"]').on('show.bs.tab',function(e){
                $("#tixian").trigger("click");
            });
            //点击切换页面
            $scope.myVar = true;
            $scope.showDetail = function(tr) {
                $scope.myVar = !$scope.myVar;
                $scope.sellerId =tr.sellerId;
                $("#return").trigger("click");
                var arr=['食杂店', '便利店', '超市', '商场', '烟酒商店', '娱乐服务', '其他'];
                $model.getDetail({
                    sellerId:tr.sellerId
                }).then(function (res) {
                    res.data.data.sellerInfo.applyTime = getLocalTime(res.data.data.sellerInfo.applyTime);
                    res.data.data.sellerInfo.lastUpdateTime = getLocalTime(res.data.data.sellerInfo.lastUpdateTime);
                    var authStatus= parseInt(res.data.data.sellerInfo.authStatus);
                    var commercial= parseInt(res.data.data.sellerInfo.commercial);
                    var district= parseInt(res.data.data.sellerInfo.district);
                    if( authStatus== 1){
                        authStatus = "待审核";
                    }else if(authStatus == 2){
                        authStatus = "审核通过";
                    }else if(authStatus == 3){
                        authStatus = "审核未通过";
                    }
                    if(district==1){
                        district ="城镇";
                    }else if(district==2){
                        district ="乡村";
                    }
                    res.data.data.sellerInfo.commercial = arr[res.data.data.sellerInfo.commercial-1];
                    res.data.data.sellerInfo.authStatus = authStatus;
                    res.data.data.sellerInfo.district = district;
                    $scope.sellerInfo = res.data.data.sellerInfo || [];
                    $scope.walletInfo = res.data.data.walletInfo || [];
                    $scope.wxinfo = res.data.data.wxinfo || [];

                    $scope.$apply();
                });
            };
            //商品详情-->审核通过
            $scope.secondThough=function(){
                alert("恭喜您审核已经通过");
                $("#authStatus").text("审核通过");
            }
            ////商品详情-->审核驳回
            $scope.secondBack=function(){
                // $("#though-check").css("display","none");
                $(".goods-back").attr({"data-toggle":"modal","data-target":"#myModal"});
                $("#shen-though").css("display","none");
                $("#shen-back").css("display","none");
                $("#content-text").css("display","block");
                $("#modal-content").css("height","280px");
                $("#refuse-reason").css("height","186px");
                $("#refuse-reason").change(function(){
                    var mydate = new Date();
                    var str = "" + mydate.getFullYear() + "年";
                    str += (mydate.getMonth()+1) + "月";
                    str += mydate.getDate() + "日";
                    $("#reason-box").append("<p id='back-reason' 'class'='col-ms-12'><p>");
                    $("#back-reason").append("<li>"+str+"&nbsp;&nbsp;&nbsp;&nbsp;"+$('#refuse-reason').val()+"</li>");
                    if($("#back-reason").find("li").length>=3){
                        $("#back-reason li:first").remove();
                    }
                })
            }
            // 省市区
            $scope.province = $model.$province.data;
            $("#provinceId").change(function (e) {
                $model.getCity({
                    parentCode: e.target.value || ''
                }).then(function (res) {
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
            //审核
            $scope.shenThough = function(authResult){
                $scope.authResult = 1;
                $("#modal-content").css("height","124px");
                $("#content-text").css("display","none");
                var sellerId=$("#sellerId").val();
                $model.getApproval({
                    authResult: authResult,
                    failReason: '',
                    note: '',
                    sellerId:sellerId
                }).then(function (res) {
                    $scope.approvalData = res.data.data || [];
                    $scope.$apply();
                    if(res.data.ok = true){
                        $("#though-backDown").css("display","none");
                        $("#though-check").css("display","block");
                    }else {
                        $("#though-check").css("display","node");
                        $("#though-backDown").css("display","block");
                    };
                });
            }
            $scope.thoughClose=function(){
                $("#though-check").css("display","none");
                $("#modal-content").css("height","90px");
            }
            $scope.shenBack=function(){
                $("#content-text").css("display","block");
                $("#though-check").css("display","none");
                $("#refuse-reason").css("height","186px")
                $("#modal-content").css("height","325px");

            }
            //点击提交按钮关闭文件上传模态框
            $scope.fileButton =function(){
                $('#myModalFile').modal('hide');
            }
            //点击下载按钮关闭文件上传模态框
            $scope.downButton =function(){
                $('#myModalDown').modal('hide');
            }
            //审核驳回理由
            $scope.backReason=function(){
                $scope.authResult = 2;
                var sellerId=$("#sellerId").val();
                var failReason=$("#refuse-reason").val();
                $model.getApproval({
                    authResult: 2,
                    failReason: failReason,
                    note: '',
                    sellerId:sellerId
                }).then(function (res) {
                    $scope.approvalData = res.data.data || [];
                    $scope.$apply();
                });
                $('#myModal').modal('hide');
                $("#though-check").css("display","none");
                $("#modal-content").css("height","90px");
            }
            // 零售户详情
            //返回零售户列表
            $scope.goBack = function(){
                // window.history.back();
                $scope.myVar = !$scope.myVar;
            }
            //设置input的默认时间
            var stattime = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + (new Date().getDate() - 10);
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
            //扫码返现
            $("#return").off().on('click', function(){
                var unit = $("#manage-unit").val();
                var isFx = $("#manage-isfx").val();
                var startTime = strToTimestamp($("#timeStart111").val());
                var endTime = strToTimestamp($("#timeEnd111").val())+86400000;
                var returnNum = {
                    pageNum: 1,
                    pageSize: 10,
                    isFx: isFx,
                    startTime: startTime,
                    endTime: endTime,
                    sellerId:$scope.sellerId
                };
                $model.getFxlist(returnNum).then(function(res) {
                    //将时间戳变为日期
                    for(var i=0;i<res.data.data.length;i++){
                        res.data.data[i].ctime=getLocalTime(res.data.data[i].ctime);
                        res.data.data[i].zjTime=getLocalTime(res.data.data[i].zjTime);
                        var unit = res.data.data[i].unit;
                        if(unit == 1){
                            unit = "盒";
                        }else if(unit==2){
                            unit = "条";
                        }
                        res.data.data[i].unit = unit;
                    }
                    $scope.returnData = res.data.data || [];
                    $scope.$apply();
                    var pageCount = Math.ceil(res.data.totalNum/returnNum.pageSize);
                    $("#pageAmout").text(res.data.totalNum);
                    if(returnNum.pageSize<=res.data.totalNum){
                        $("#pageSize1").text(returnNum.pageSize);
                    }else{
                        $("#pageSize1").text(res.data.totalNum);
                    }
                    $(".tcdPageCode").remove();
                    $(".rf").append("<div class='tcdPageCode'></div>");
                    //创建分页同时数据再次加载

                    $(".tcdPageCode").createPage({
                        pageCount:pageCount,
                        current: returnNum.pageNum,
                        backFn: function(p) {
                            returnNum.pageNum = p;

                            $model.getFxlist(returnNum).then(function(res) {
                                for(var i=0;i<res.data.data.length;i++){
                                    res.data.data[i].ctime=getLocalTime(res.data.data[i].ctime);
                                    res.data.data[i].zjTime=getLocalTime(res.data.data[i].zjTime);
                                    var unit = res.data.data[i].unit;
                                    if(unit == 1){
                                        unit = "盒";
                                    }else if(unit==2){
                                        unit = "条";
                                    }
                                    res.data.data[i].unit = unit;
                                }
                                $scope.returnData = res.data.data || [];
                                $scope.$apply();
                                $("#pageAmout").text(res.data.totalNum);

                                if(returnNum.pageSize<=res.data.totalNum){
                                    if(returnNum.pageNum==pageCount){
                                        $("#pageSize1").text(res.data.totalNum%returnNum.pageSize);
                                    }else{
                                        $("#pageSize1").text(returnNum.pageSize);
                                    }

                                }else{
                                    $("#pageSize1").text(res.data.totalNum);
                                }
                            });
                        }
                    });
                });
            });

            //提现记录
            $("#tixian").off().on('click', function(){
                var timeEnd333=$("#timeEnd333").val();
                var timeStart333=$("#timeStart333").val();
                var tixianNum = {
                    pageNum: 1,
                    pageSize: 10,
                    startTime: strToTimestamp(timeStart333),
                    endTime: strToTimestamp(timeEnd333),
                    sellerId:$scope.sellerId
                }
                $model.getTixian(tixianNum).then(function(res) {
                    //将时间戳变为日期
                    for(var i=0;i<res.data.data.length;i++){
                        res.data.data[i].txTime=getLocalTime(res.data.data[i].txTime);
                    }
                    $scope.tixianData = res.data.data || [];
                    $scope.$apply();
                    var pageCount = Math.ceil(res.data.totalNum/tixianNum.pageSize);
                    $("#pageAmout2").text(res.data.totalNum);
                    if(tixianNum.pageSize<=res.data.totalNum){
                        $("#pageSize3").text(tixianNum.pageSize);
                    }else{
                        $("#pageSize3").text(res.data.totalNum);
                    }
                    $(".tcdPageCode").remove();
                    $(".rf").append("<div class='tcdPageCode'></div>");
                    $(".tcdPageCode").createPage({
                        pageCount:pageCount,
                        current: tixianNum.pageNum,
                        backFn: function(p) {
                            tixianNum.pageNum = p;
                            $model.getTixian(tixianNum).then(function(res) {
                                for(var i=0;i<res.data.data.length;i++){
                                    res.data.data[i].txTime=getLocalTime(res.data.data[i].txTime);
                                }
                                $scope.tixianData = res.data.data || [];
                                $scope.$apply();
                                $("#pageAmout2").text(res.data.totalNum);
                                if(tixianNum.pageSize<=res.data.totalNum){
                                    if(tixianNum.pageNum==pageCount){
                                        $("#pageSize3").text(res.data.totalNum%tixianNum.pageSize);
                                    }else{
                                        $("#pageSize3").text(tixianNum.pageSize);
                                    }

                                }else{
                                    $("#pageSize3").text(res.data.totalNum);
                                }
                            });
                        }
                    });
                });
            });
            //扫码用户
            $("#tabSao").off().on('click', function(){
                var countNum = {
                    pageNum: 1,
                    pageSize: 10,
                    sellerId:$scope.sellerId
                }
                $model.getCount(countNum).then(function(res) {
                    for(var i=0;i<res.data.data.length;i++){
                        res.data.data[i].lastScanTime=getLocalTime(res.data.data[i].lastScanTime);
                    }
                    $scope.countData = res.data.data || [];
                    $scope.$apply();
                    var pageCount = Math.ceil(res.data.totalNum/countNum.pageSize);
                    $("#pageAmout1").text(res.data.totalNum);
                    if(countNum.pageSize<=res.data.totalNum){
                        $("#pageSize2").text(countNum.pageSize);
                    }else{
                        $("#pageSize2").text(res.data.totalNum);
                    }
                    $(".tcdPageCode").remove();
                    $(".rf").append("<div class='tcdPageCode'></div>");
                    $(".tcdPageCode").createPage({
                        pageCount:pageCount,
                        current: countNum.pageNum,
                        backFn: function(p) {
                            countNum.pageNum = p;
                            $model.getCount(countNum).then(function(res) {
                                $scope.countData = res.data.data || [];
                                $scope.$apply();
                                $("#pageAmout1").text(res.data.totalNum);
                                if(countNum.pageSize<=res.data.totalNum){
                                    if(countNum.pageNum==pageCount){
                                        $("#pageSize2").text(res.data.totalNum%countNum.pageSize);
                                    }else{
                                        $("#pageSize2").text(countNum.pageSize);
                                    }

                                }else{
                                    $("#pageSize2").text(res.data.totalNum);
                                }
                            });
                        }
                    });
                });
            });
            // 订单下载模块
            $("#timeStart").datetimepicker({
                format: 'yyyy-mm-dd',
                minView:'month',
                language: 'zh-CN',
                autoclose:true,
                endDate:new Date()
            }).on("click",function(){
                $("#timeStart").datetimepicker("setEndDate",$("#timeEnd").val());
            });
            $scope.seacherbtn = function(){
                var timeStart= $("#timeStart").val();
                $("#third").show();
                $(".down").text($("#timeStart").val()+"日订单下载");
                $("#fileDownBox").css("height","180px");
            }
            //上传订单文件
            $("#timeStart1111").datetimepicker({
                format: 'yyyy-mm-dd',
                minView:'month',
                language: 'zh-CN',
                autoclose:true,
                endDate:new Date()
            }).on("click",function(){
                $("#timeStart1111").datetimepicker("setEndDate",$("#timeStart1111").val());
            });
            $("#timeStart2222").datetimepicker({
                format: 'yyyy-mm-dd',
                minView:'month',
                language: 'zh-CN',
                autoclose:true,
                endDate:new Date()
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
                var startTime = strToTimestamp($("#timeStart").val())
                var endTime = startTime+86400000;
                var url = 'https://retailer.taozuike.com/seller-manager/export/print/qr';
                startTime &&(url += '?startTime=' +startTime);
                endTime && (url += '&endTime=' + endTime);
                window.open(url);
            });
            //创建分页
            function createPage3(n){
                if (n === 1) {
                    $(".tcdPageCode").remove();
                } else {
                    if ($(".tcdPageCode").createPage) {
                        $(".tcdPageCode").remove();
                        $(".rf").append("<div class='tcdPageCode'></div>");
                    }
                }
                $(".tcdPageCode").createPage({
                    pageCount: n,
                    current: Defalut3.page,
                    backFn: function (page) {
                        Defalut3.page = page;
                        searchFun(Defalut3);
                    }
                });
            }



        }]
    };
    return manageCtrl;
})
