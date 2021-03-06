/**
 * Author: Kuang
 * Create Date: 2017-07-24
 * Description: actsample
 */

define([], function () {
    var activitylist = angular.module('ngui.activitylist', []);

    var activitylistFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/activitylist.tpl.html',
            list: [],
            totalCount: 0,
            size: 0,
            curPage: 1,
            pageNumber: 1
        };
        var defineObj = { //指令定义对象
            restrict: 'AE',
            replace: true,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.tpl || defaults.tpl;
            },
            scope: {
                conf: '='
            },
            link: linkFn
        };

        function linkFn (scope, element, attrs) {
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list', 'totalCount', 'curPage', 'pageNumber']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list', 'totalCount', 'curPage', 'pageNumber']);

                // 一开始进入页面的时候scope.conf是undefined
                if (scope.conf) {
                    var data = scope.conf.data;
                    var page = data.page;
                    scope.list = data.list;
                    scope.totalCount = page.count;
                    scope.size = page.count - page.start > page.pageSize ? page.pageSize : page.count - page.start;
                    scope.curPage = page.currentPageNumber;
                    scope.pageNumber = page.pageNumber;
                }
            }, true);

            // 启用
            scope.startActivity = function (e) {
                var data = {
                    activityCode: e.target.dataset.activitycode,
                    status: e.target.dataset.status
                }
                scope.$emit('startActivity', event, data);
            }

            // 停用
            scope.terminateActivity = function (e) {
                var data = {
                    activityCode: e.target.dataset.activitycode,
                    status: e.target.dataset.status
                }
                scope.$emit('terminateActivity', event, data);
            }

            // 编辑
            scope.editActivity = function (e) {
                var sendData = {
                    activityCode : e.target.dataset.activitycode,
                    activityForm : e.target.dataset.activityform
                }
                scope.$emit('editActivity', event, sendData)
            }

            // 停用-查看
            scope.lookupActivity = function (e) {
                scope.$emit('lookupActivity', event, {activityCode: e.target.dataset.activitycode})
            }
            // 页面跳转
            scope.turnToReal = function () {
                angular.element(".ui-navbar-header").scope().changeNav(null, {menuCode: 'index'});
                sessionStorage.setItem('menuCode', 'realtime');
            }

            // 管理世界杯活动
            scope.activityCtrl =  function (item) {
                location.href = "/#/view/activity/acts/quiz/" + item.activityCode;
            }
        }
        return defineObj;
    }

    activitylist.directive('saActivitylist', ['$rootScope', '$http', '$compile', '$timeout', 'util', activitylistFn]);
})
