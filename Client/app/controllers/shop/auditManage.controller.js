/**
 * Author: zhaobaoli
 * Create Date: 2018-06-20
 * Description: 积分商城审核管理
 */

define([], function () {
    var auditManageCtrl = {
        ServiceType: "controller",
        ServiceName: "auditManageCtrl",
        ViewModelName: 'auditManageModel',
        ServiceContent: ['$scope', '$timeout','dateFormatFilter', function ($scope, $timeout, dateFormatFilter) {
            var $model = $scope.$model || {};
            $scope.vm = {
                status: '0', //审核状态
                appStartTime: '', //开始时间
                appEndTime: '', //结束时间
                pageSize : 10, //每页显示多少条
                pageNo : 1, //当前页数
                totalPage : 0, //总页数
                unAudit : false, //未审核状态
                buildOrderList : []
            }
            var initPage = { //初始化分页信息
                currentPageNumber : $scope.vm.pageNo,
                pageSize : $scope.vm.pageSize,
                jdOrderStatus : $scope.vm.status
            };

            // 时间设置
            $("#durationStart").datetimepicker({
                format: 'yyyy-mm-dd hh:ii:00',
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1
            }).on('change', function (e) {
                var appStartTime = e.target.value;
                var appEndTime = $scope.vm.appEndTime;
                if (appEndTime < appStartTime) {
                    $scope.vm.appEndTime = '';
                    $scope.$apply();
                }
            });

            $("#durationEnd").datetimepicker({
                format: 'yyyy-mm-dd hh:ii:00',
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1
            }).on('change', function (e) {
                var appEndTime = e.target.value;
                var appStartTime = $scope.vm.appStartTime;
                if (appStartTime > appEndTime) {
                    $scope.vm.appStartTime = '';
                    $scope.$apply();
                }
            });
          

            $scope.search = function(){ //搜索
                if($scope.vm.status == 0 && $scope.vm.status != ''){ //判断审核状态
                    $scope.vm.unAudit = false;
                }else{
                    $scope.vm.unAudit = true;
                }
                var serachData = {
                    currentPageNumber : $scope.vm.pageNo,
                    pageSize : $scope.vm.pageSize,
                    jdOrderStatus : $scope.vm.status,
                    startTime : $scope.vm.appStartTime,
                    endTime : $scope.vm.appEndTime
                }
                getAuditList(serachData);
                $scope.selected = [];
            }

            
            $scope.resetSelect = function(){ //重置搜索条件
                $scope.vm.status = '0'; //审核状态
                $scope.vm.appStartTime = ''; //开始时间
                $scope.vm.appEndTime = ''; //结束时间
                var resetData = {
                    jdOrderStatus : $scope.vm.status,
                    startTime : $scope.vm.appStartTime,
                    endTime : $scope.vm.appEndTime,
                    currentPageNumber : $scope.vm.pageNo,
                    pageSize : $scope.vm.pageSize
                }
                getAuditList(resetData);
                $scope.selected = [];
            }

            //创建分页工具
            function createPageTools(pageData){
                $(".tcdPageCode").createPage({
                    pageCount: pageData.allPages,
                    current : pageData.currentPageNumber,
                    backFn : function(pageNum){
                        var curPageData = {
                            currentPageNumber : pageNum,
                            pageSize : $scope.vm.pageSize,
                            jdOrderStatus : $scope.vm.status,  //商品状态
                            startTime : $scope.vm.appStartTime, //开始时间
                            endTime : $scope.vm.appEndTime //结束时间
                        };
                        getAuditList(curPageData);
                    }
                });
            }

            //获取提现列表
            function getAuditList(pageObj){
                $model.getAuditList(pageObj).then(function(res){
                    var resData = res.data;
                    if(resData.ret == 200000){
                        var dataObj = resData.data;
                        var listData = dataObj.list || [];
                        $scope.vm.buildOrderList = listData;
                        if($scope.vm.buildOrderList.length > 0){
                            $scope.batchIds = [];
                            angular.forEach($scope.vm.buildOrderList, function(item, index) {
                                $scope.batchIds.push(item.id);
                            })
                        }
                        var newPageObj = {
                            allPages : dataObj.page.pageNumber,
                            currentPageNumber : pageObj.currentPageNumber
                        };
                        $scope.vm.pageNo = pageObj.currentPageNumber;
                        $scope.vm.totalCount = dataObj.page.count;
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
            getAuditList(initPage);

            // 弹窗框
            var alertMsg = function(e, t, i) { // e为元素，t为类型，i为信息
                var promptCon = e.clone();

                if(t == 'success') { // 成功
                    e.addClass('alert-success');
                } else if(t == 'warning') { // 警告
                    e.addClass('alert-warning');
                } else if(t == 'danger') { // 错误
                    e.addClass('alert-danger');
                }

                e.find('.prompt').text(i || '请求错误请重试');
                e.show().addClass('in');

                // 克隆的再放进body
                e.on('closed.bs.alert', function () {
                    $('body').append(promptCon);
                })

                // 3秒后隐藏
                var alertHide = $timeout(function(){
                    e.alert('close')
                }, 3000)

                e.hover(function() {
                    $timeout.cancel(alertHide);
                }, function() {
                    // 3秒后隐藏
                    var alertHide = $timeout(function(){
                        e.alert('close')
                    }, 3000)
                })
            }

            $scope.adthOrNo = function(jdOrderId,status,jdOrderStatus){ //审核订单
                if(jdOrderStatus == 0){
                    $scope.shelfId = jdOrderId;
                    $scope.shelfStatus = status;
                    $scope.isUpShelf = status;
                    $('.shelf-modal').modal('show');
                }              
            }

            $scope.shelfConfirm = function(){ //确认审核订单

                if($scope.shelfStatus){
                    var adthData = {
                        ids : $scope.shelfId,
                        jdOrderStatus : 1
                    }
                }else{
                    var adthData = {
                        ids : $scope.shelfId,
                        jdOrderStatus : 2
                    }
                }

                $model.modifyAuditOrder(adthData).then(function(res) {
                    var data = res.data;
                    if(data.ret == 200000){
                        var refreshData = {
                            currentPageNumber : $scope.vm.pageNo,
                            pageSize : $scope.vm.pageSize,
                            jdOrderStatus : $scope.vm.status,  //商品状态
                            startTime : $scope.vm.appStartTime, //开始时间
                            endTime : $scope.vm.appEndTime //结束时间
                        }
                        getAuditList(refreshData);
                        $('.shelf-modal').modal('hide');
                        alertMsg($('#newAlert'), 'success', '设置成功');
                        $scope.$apply();
                    }else{
                        alertMsg($('#newAlert'), 'danger', res.data.msg);
                    }
                })
            }

            $scope.authConfirm = function(){ //确认批量通过
                var batchData = {
                    ids : $scope.selected.join(','),
                    jdOrderStatus : 1
                }
                $model.modifyAuditOrder(batchData).then(function(res) {
                    var data = res.data;
                    if(data.ret == 200000){
                        var refreshData = {
                            currentPageNumber : $scope.vm.pageNo,
                            pageSize : $scope.vm.pageSize,
                            jdOrderStatus : $scope.vm.status,  //商品状态
                            startTime : $scope.vm.appStartTime, //开始时间
                            endTime : $scope.vm.appEndTime //结束时间
                        }
                        getAuditList(refreshData);
                        $('.remove-modal').modal('hide');
                        alertMsg($('#newAlert'), 'success', '设置成功');
                        $scope.$apply();
                    }else{
                        alertMsg($('#newAlert'), 'danger', res.data.msg);
                    }
                })
            }

            // *** 批量删除 start
            $scope.selected = []; // 当前选中的id组合
            $scope.ifBatch = true; // 多选按钮disabled
            // 单个儿checkbox的id数组是添加还是移除
            var updateSelected = function (action, id) {
                if (action == 'add' && $scope.selected.indexOf(id) == -1){
                    $scope.selected.push(id);
                }
                if (action == 'remove' && $scope.selected.indexOf(id) != -1){
                    $scope.selected.splice($scope.selected.indexOf(id), 1);
                }
                if($scope.selected.length <= 1){
                    $scope.ifBatch = true;
                }else{
                    $scope.ifBatch = false;
                }
            };
            // 单个儿的ng-checked
            $scope.isSelected = function (id) {
                return $scope.selected.indexOf(id) >= 0;
            };
            // 单个儿ng-click
            $scope.updateSelection = function ($event, id) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                updateSelected(action, id);
            };
            // 全选的的ng-checked
            $scope.isSelectedAll = function () {
                return $scope.selected.length === $scope.vm.buildOrderList.length;
            };
            // 全选ng-click
            $scope.selectAll = function ($event) {
                var allCheckbox = $event.target;
                var action = (allCheckbox.checked ? 'add' : 'remove');
                for (var i = 0; i < $scope.vm.buildOrderList.length; i++) {
                    updateSelected(action, $scope.batchIds[i]);
                }
            };
        }]
    };
    return auditManageCtrl;
})
