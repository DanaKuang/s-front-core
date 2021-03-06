/**
 * Author: liubin
 * Create Date: 2018-04-16
 * Description: logs
 */

define([], function () {
    var logsCtrl = {
        ServiceType: "controller",
        ServiceName: "logsCtrl",
        ViewModelName: 'logsViewModel',
        ServiceContent: ['$scope', 'dateFormatFilter', function ($scope, df) {
            var $model = $scope.$model;

            var orgArr = $model.$org.data.data || [];
            var typeObj = $model.$type.data.data || {};
            var typeArr = [];

            _.forIn(typeObj, function (v, k) {
                typeArr.push({
                    typeKey: k,
                    typeVal: v
                });
            });

            // 属性扩展
            $scope = angular.extend($scope, {
                orgCode: '',
                userName: '',
                loggerType: '',
                stime: '',
                etime: '',
                orgArr: orgArr,
                typeArr: typeArr,
                paginationConf: '',
                search: searchFn,
                reset: resetFn
            });

            // 获取参数
            function getParams () {
                return {
                    orgCode: $scope.orgCode || '',
                    userName: $scope.userName || '',
                    loggerType: $scope.loggerType || '',
                    stime: $scope.stime || '',
                    etime: $scope.etime || '',
                    currentPageNumber: 1,
                    pageSize: 50
                }
            }

            // 查询函数
            function searchFn (params) {
                $model.getTableList(params || getParams()).then(function (res) {
                    res = res.data || {};
                    if (res.ret === '200000') {
                        var ret = res.data.list || [];
                        ret.forEach(function (r) {
                            r.operTime = df.datetime(r.operTime);
                            var filArr = orgArr.filter(function (o) {
                                return o.orgCode === r.orgCode;
                            });
                            if (filArr.length) {
                                r.orgName = filArr[0].orgName || "";
                            } else {
                                r.orgName = "";
                            }
                        });
                        $scope.tableArr = ret;
                        $scope.paginationConf = res;
                        $scope.$apply();
                    } else {
                        console.log('接口异常啦！！！');
                    }
                });
            }

            // 翻页
            $scope.$on('frompagechange', function (e,v,f) {
                searchFn(angular.extend({}, getParams(), f));
            });

            // 重置函数
            function resetFn () {
                $scope = angular.extend($scope, {
                    orgCode: '',
                    userName: '',
                    loggerType: '',
                    stime: '',
                    etime: ''
                });

                // 重置完之后search一下
                searchFn();
            }

            // 初始化多选
            $(document).ready(function () {

                // 时间组件
                $('[name="stime"]').datetimepicker({
                    language: "zh-CN",
                    format: "yyyy-mm-dd hh:ii:ss",
                    autoclose: true,
                    todayBtn: true,
                    minView: 0,
                    endDate: df.datetime(+new Date)
                }).on('change', function (e) {
                    var st = e.target.value || '';
                    var et = $scope.etime || '';
                    if (et < st) {
                        $scope.etime = st;
                        $scope.$apply();
                    }
                });
                $('[name="etime"]').datetimepicker({
                    language: "zh-CN",
                    format: "yyyy-mm-dd hh:ii:ss",
                    autoclose: true,
                    todayBtn: true,
                    minView: 0,
                    endDate: df.datetime(+new Date)
                }).on('change', function (e) {
                    var et = e.target.value || '';
                    var st = $scope.stime || '';
                    if (et < st) {
                        $scope.stime = et;
                        $scope.$apply();
                    }
                });

                // 刚进入页面查询一下
                searchFn();

                // 添加hover效果
                $("select").hover(function (e) {
                    e.currentTarget.title = e.currentTarget.selectedOptions[0].innerText;
                });
            });

        }]
    };

  return logsCtrl;
});
