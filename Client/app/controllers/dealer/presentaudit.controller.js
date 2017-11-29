/**
 * Author: zhaobaoli
 * Create Date: 2017-11-27
 * Description: 提现审核
 */
define([], function() {
    var presentauditCtrl = {
        ServiceType: "controller",
        ServiceName: "presentauditCtrl",
        ViewModelName: 'presentauditViewModel',
        ServiceContent: ['$scope','dateFormatFilter','dayFilter', '$location',function($scope,dateFormatFilter,dayFilter, $location) {
            var $model = $scope.$model;

            //初始化分页信息
            $scope.pageSize = 10; //每页显示多少条
            $scope.pageNum = 1; //当前页数
            $scope.totalPage = 0;//总页数
            var initPage = {
                page : $scope.pageNum,
                pageSize : $scope.pageSize
            };
            
            //设置input的默认时间
            var stattime = dayFilter.beforenday('date', 10);
            var endtime = dayFilter.today('date');

            function strToTimestamp(s) {
                s = s.replace(/-/g,"/");
                var date = new Date(s );
                return date.valueOf();
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

            // 省市区
            $model.$province().then(function(res){
            	if(res.status != null){
            		var res = res.data || [];
            		$scope.province = res;
            		 $scope.$apply();
            	}
            })

            $("#provinceId").change(function (e) {
                $model.$getCity({
                    parentCode: e.target.value || ''
                }).then(function (res) {
                    $scope.city = res.data;
                    $scope.$apply();
                });
            });
            $("#cityId").change(function (e) {
                $model.$getArea({
                    parentCode: e.target.value || ''
                }).then(function (res) {
                    $scope.area = res.data;
                    $scope.$apply();
                });
            });

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
                        var keyCode = $('#keyCode').val();
                        var statusChange = $('.form-controlmdg').val();
                        var newCode = $('#newCode').val();
                        var provinceId = $('#provinceId').val();
                        var cityId = $('#cityId').val();
                        var areaId = $('#areaId').val();
                        var durationStart = $('#durationStart').val();
                        var durationEnd = $('#durationEnd').val();
                        var buyNum = $('#buyNum').val();

                        curPageData.appStatus = statusChange,//提现状态
                        curPageData.provinceId = provinceId,//省份id
                        curPageData.cityId = cityId,//地市id
                        curPageData.areaId = areaId,//区县id                   
                        curPageData.startTime = durationStart,//开始时间
                        curPageData.endTime =  durationEnd;//结束时间
                        if(newCode != '' && newCode != null){
                            switch(keyCode){
                                case 'telphone':
                                    curPageData.phoneNo = newCode;
                                    break;
                                case 'dealer':
                                    curPageData.salerName = newCode;
                                    break;
                                case 'wx':
                                    curPageData.wxId = newCode;
                                    break;
                                default:
                            }
                        }
                        getDrawsList(curPageData);
                    }
                });
            }

            //获取提现列表
            function  getDrawsList(pageObj){
                $model.$getWithDrawsList(pageObj).then(function(res){
                    var dataObj = res.data.data;
                    var listData = dataObj.list || [];
                    $scope.drawsList = listData;
                    var newPageObj = {
                        allPages : dataObj.page.pageNumber,
                        currentPage : pageObj.page
                    };
                    $scope.pageNum = pageObj.page;
                    $scope.totalCount = dataObj.page.count;
                    if ($(".tcdPageCode").createPage) {
                        $(".tcdPageCode").remove();
                    }
                    $(".page_sec").append("<div class='tcdPageCode'></div>");
                    $scope.$apply();
                    createPageTools(newPageObj);
                })
            } 

            //初始化查询全部数据
            getDrawsList(initPage);

            //搜索
            $scope.search = function(){
                var keyCode = $('#keyCode').val();
            	var statusChange = $('.form-controlmdg').val();
                var newCode = $('#newCode').val();
                var provinceId = $('#provinceId').val();
                var cityId = $('#cityId').val();
                var areaId = $('#areaId').val();
                var durationStart = $('#durationStart').val();
                var durationEnd = $('#durationEnd').val();
                var buyNum = $('#buyNum').val();

                var searchData = {
                    appStatus: statusChange,//提现状态
                    provinceId:provinceId,//省份id
                    cityId:cityId,//地市id
                    areaId:areaId,//区县id                   
                    startTime: durationStart,//开始时间
                    endTime:  durationEnd,//结束时间
                    page: 1,
                    pageSize: 10
                }
                if(newCode != '' && newCode != null){
                    switch(keyCode){
                        case 'telphone':
                            searchData.phoneNo = newCode;
                            break;
                        case 'dealer':
                            searchData.salerName = newCode;
                            break;
                        case 'wx':
                            searchData.wxId = newCode;
                            break;
                        default:
                    }
                }
                getDrawsList(searchData);
            }

            //重置
            $scope.reset = function(){
                $('#keyCode').val('telphone');
            	$('.form-controlmdg').val('');
                $('#newCode').val('');
                $('#provinceId').val('');
                $('#cityId').val('');
                $('#areaId').val('');
                $('#durationStart').val('');
                $('#durationEnd').val('');
                getDrawsList(initPage);
            }

            //显示详情
            $scope.showDealerDetail = function(salerId){
                sessionStorage.setItem('salerId',salerId);
                // window.location.href = '/#/view/dealer/manage';
                $location.path('view/dealer/manage');
            }

            //审核通过
            $scope.auditPass = function(id){
                $scope.passId = id;
                $('.audit_pass_box').modal('show')
            }

            //确定审核通过
            $scope.confirmPass = function(){
                var aduitPassObj = {
                    'id' : $scope.passId,
                     'appStatus' : 1
                }
                $model.$aduitOperate(aduitPassObj).then(function (res) {
                    if(res.data.ok){
                        $('.audit_pass_box').modal('hide');
                        getDrawsList(initPage);
                    }
                });
            }

            //审核不通过弹框
            $scope.auditNoPass = function(id){
                $scope.noPassId = id;
                $('.audit_no_pass_box').modal('show')
            }
            //确认审核不通过
            $scope.confirmNoPass = function(){
                alert($scope.aduitNoPassPerson);
                var aduitNoPassObj = {
                    'id' : $scope.noPassId,
                     'appStatus' : 2,
                     'failReason' : $scope.aduitNoPassPerson
                }
                $model.$aduitOperate(aduitNoPassObj).then(function (res) {
                    if(res.data.ok){
                        $('.audit_no_pass_box').modal('hide');
                        $scope.aduitNoPassPerson = '';
                        getDrawsList(initPage);
                    }
                });
            }
            //隐藏审核不通过弹框
            $scope.cancelBox = function(){
                $scope.aduitNoPassPerson = '';
                $('.audit_no_pass_box').modal('hide');
            }

        }]
    };

  return presentauditCtrl;
});