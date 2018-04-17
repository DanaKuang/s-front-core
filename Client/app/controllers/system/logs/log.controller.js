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

            // 属性扩展
            $scope = angular.extend($scope, {
                company: '',
                user: '',
                type: '',
                stime: '',
                etime: '',
                paginationConf: '',
                search: searchFn,
                reset: resetFn
            });

            // 获取参数
            function getParams () {
                return {
                    company: $scope.company || '',
                    user: $scope.user || '',
                    type: $scope.type || '',
                    stime: $scope.stime || '',
                    etime: $scope.etime || '',
                    currentPageNumber: 1,
                    pageSize: 10
                }
            }

            // 查询函数
            function searchFn (params) {
                $model.getTableList(params || getParams()).then(function (res) {
                    res = res.data || {};
                    if (res.ret === '200000') {
                        var ret = res.data.list || [];
                        ret.forEach(function (l) {
                            l.rptTime = df.datetime(l.rptTime);
                        }) || [];
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
                    company: '',
                    user: '',
                    type: '',
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
                    startDate: ""
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
                    startDate: ""
                }).on('change', function (e) {
                    var et = e.target.value || '';
                    var st = $scope.stime || '';
                    if (et < st) {
                        $scope.stime = et;
                        $scope.$apply();
                    }
                });

                // 刚进入页面查询一下
                // searchFn();

                // 添加hover效果
                $("select").hover(function (e) {
                    e.currentTarget.title = e.currentTarget.selectedOptions[0].innerText;
                });
            });

        }]
    };

  return logsCtrl;
});
