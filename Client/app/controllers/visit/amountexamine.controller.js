/**
 * Author: zhaobaoli
 * Create Date: 2017-11-27
 * Description: 提现审核
 */
define([], function() {
    var amountexmineCtrl = {
        ServiceType: "controller",
        ServiceName: "amountexmineCtrl",
        ViewModelName: 'visitManageModel',
        ServiceContent: ['$scope','dateFormatFilter','dayFilter', '$location',function($scope,dateFormatFilter,dayFilter, $location) {
            var $model = $scope.$model;

            $scope.keyType = '4';
            $scope.selectStatus = '1'; //提现状态默认为未审核
            $scope.keyWords = ''; //关键字
            //初始化分页信息
            $scope.pageSize = 10; //每页显示多少条
            $scope.pageNo = 1; //当前页数
            $scope.totalPage = 0;//总页数
            var initPage = {
                pageNo : $scope.pageNo,
                pageSize : $scope.pageSize,
                status : $scope.selectStatus
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
            $model.getProvinceList().then(function(res){
            	if(res.status == 200){
            		var res = res.data || [];
                    $scope.province = res;
            		$scope.$apply();
            	}
            })

            $("#provinceId").change(function (e) {
                $model.getCityList({
                    parentCode: e.target.value || ''
                }).then(function (res) {
                    $scope.city = res.data;
                    $scope.$apply();
                });
            });
            $("#cityId").change(function (e) {
                $model.getAreaList({
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
                            pageNo : pageNum,
                            pageSize : $scope.pageSize
                        };
                        // var keyCode = $('#keyCode').val();
                        var statusChange = $('.form-controlmdg').val();
                        // var newCode = $('#newCode').val();
                        if($scope.provinceCode != '' && $scope.provinceCode != undefined){
                            // provinceName = $('#provinceId').find("option:selected").text();
                            curPageData.addrProvince = $('#provinceId').val();//省份id
                        }    
                        if($scope.cityCode != '' && $scope.cityCode != undefined){
                            // cityName = $('#cityId').find("option:selected").text();
                            curPageData.addrCity = $('#cityId').val();//地市id
                        }
                        if($scope.areaCode != '' && $scope.areaCode != undefined){
                            // areaName = $('#areaId').find("option:selected").text();
                            curPageData.addrArea = $('#areaId').val();//区县id
                        }
                        var durationStart = $('#durationStart').val();
                        var durationEnd = $('#durationEnd').val();

                        curPageData.status = statusChange;//提现状态                   
                        curPageData.stime = durationStart;//开始时间
                        curPageData.etime =  durationEnd;//结束时间
                        if($scope.keyType != '' && $scope.keyType != null){
                            curPageData.searchType = $scope.keyType;
                            curPageData.keywords = $scope.keyWords;
                        }
                        getAmountExamineList(curPageData);
                    }
                });
            }

            //获取提现列表
            function getAmountExamineList(pageObj){
                $model.amountExamineList(pageObj).then(function(res){
                    if(res.status == 200){
                        var dataObj = res.data.data;
                        var listData = dataObj.list || [];
                        $scope.drawsList = listData;
                        var newPageObj = {
                            allPages : dataObj.page.pageCount,
                            currentPage : pageObj.pageNo
                        };
                        $scope.pageNo = pageObj.pageNo;
                        $scope.totalCount = dataObj.page.count;
                        if ($(".tcdPageCode").createPage) {
                            $(".tcdPageCode").remove();
                        }
                        $(".page_sec").append("<div class='tcdPageCode'></div>");
                        $scope.$apply();
                        createPageTools(newPageObj);
                    }
                })
            } 

            //初始化查询全部数据
            getAmountExamineList(initPage);

            //搜索
            $scope.search = function(){
                var durationStart = $('#durationStart').val();
                var durationEnd = $('#durationEnd').val();
                var searchData = {
                    status: $scope.selectStatus,//提现状态
                    pageNo: 1,
                    pageSize: $scope.pageSize
                }
                if($scope.startTime){
                    searchData.stime = durationStart; //开始时间
                }
                if($scope.endTime){
                    searchData.etime = durationEnd; //结束时间
                }
                if($scope.provinceCode != '' && $scope.provinceCode != undefined){
                    searchData.addrProvince = $('#provinceId').val();//省份id
                }    
                if($scope.cityCode != '' && $scope.cityCode != undefined){
                    searchData.addrCity = $('#cityId').val();//地市id
                }
                if($scope.areaCode != '' && $scope.areaCode != undefined){
                    searchData.addrArea = $('#areaId').val();//区县id
                }
                if($scope.keyType != '' && $scope.keyType != null){
                    searchData.searchType = $scope.keyType;
                    searchData.keywords = $scope.keyWords;
                }
                getAmountExamineList(searchData);
            }

            //重置
            $scope.reset = function(){
                $scope.keyType = '4';
                $scope.selectStatus = '1'; //提现状态默认为未审核
                $scope.keyWords = ''; //关键字
                $('#provinceId').val('');
                $('#cityId').val('');
                $('#areaId').val('');
                $('#durationStart').val('');
                $('#durationEnd').val('');
                getAmountExamineList(initPage);
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
                    'txId' : $scope.passId,
                    'authResult' : 1
                }
                $model.setTxStatus(aduitPassObj).then(function (res) {
                    if(res.data.ok){
                        $('.audit_pass_box').modal('hide');
                        getAmountExamineList(initPage);
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
                var aduitNoPassObj = {
                    'txId' : $scope.noPassId,
                    'authResult' : 0,
                    'authDesc' : $scope.aduitNoPassPerson
                }
                $model.setTxStatus(aduitNoPassObj).then(function (res) {
                    if(res.data.ok){
                        $('.audit_no_pass_box').modal('hide');
                        $scope.aduitNoPassPerson = '';
                        getAmountExamineList(initPage);
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

  return amountexmineCtrl;
});