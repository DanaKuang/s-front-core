/**
 * Author: liubin
 * Create Date: 2017-06-27
 * Description: index
 */

define([], function () {
    var ActiveCtrl = {
        ServiceType: "controller",
        ServiceName: "ActiveCtrl",
        ViewModelName: 'activeViewModel',
        ServiceContent: ['$scope', 'dateFormatFilter', 'alertService', function ($scope, df, alt) {
            var $model = $scope.$model;

            // 属性扩展
            $scope = angular.extend($scope, {
                code: '',
                verifycode: '',
                type: '1',
                tableArr: [],
                paginationConf: '',
                search: searchFn,
                reset: resetFn,
                activeFn: activeFn
            });

            function getParams () {
                return {
                    verifycode: $scope.verifycode || '',
                    code: $scope.code || '',
                    type: $scope.type || ''
                }
            }

            // 查询函数
            function searchFn () {
                $model.getCodeList(getParams()).then(function (res) {
                    res = res.data || {};
                    if (res.ret === '200000') {
                        var ret = res.data || [];
                        $scope.tableArr = [ret];
                        ret.lastcreatetime = df.datetime(ret.lastcreatetime);
                        ret.firstscantime = df.datetime(ret.firstscantime);
                        $scope.$apply();
                    } else {
                        alt.error(res.message || "接口异常！");
                    }
                });
            }

            // 激活
            function activeFn () {
                $model.actCode(getParams()).then(function (res) {
                    res = res.data || {};
                    if (res.ret == '200000') {
                        alt.success("激活成功！");
                        searchFn();
                    } else {
                        alt.error("激活失败！");
                    }
                });
            }

            // 重置函数
            function resetFn () {
                $scope = angular.extend($scope, {
                    code: '',
                    verifycode: '',
                    type: '1'
                });
            }

            // 初始化多选
            $(document).ready(function () {
                // 刚进入页面查询一下
                // searchFn();

                // 添加hover效果
                $("select").hover(function (e) {
                    e.currentTarget.title = e.currentTarget.selectedOptions[0].innerText;
                });
            });

        }]
    };

  return ActiveCtrl;
});