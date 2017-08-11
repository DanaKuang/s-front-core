/**
 * Author: liubin
 * Create Date: 2017-06-29
 * Description: menu
 */

define([], function () {
    var nguiMenu = angular.module('ngui.menu', []);

    var nguiMenuFn = function ($http, $compile, $timeout, util, fetchTemplate, $location) {
        var defaults = { //默认配置
            tpl: '/menu.tpl.html',
            style: 'tab', //样式 tab,pill
            tabs: [], //选项卡数组
            activeId: 0 // 默认标记第一个active
        };
        var defineObj = { //指令定义对象
            restrice: 'AE',
            replace: true,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.tpl || defaults.tpl;
            },
            scope: {
                conf: '='
            },
            link: linkFn
        };

        // link
        function linkFn (scope, element, attrs) {
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['style', 'tabs', 'activeId']);

            // 监视conf变化更新menu
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['style', 'tabs']);
                //
                scope.tabs.length && scope.clickTab({}, sessionStorage.menuCode ? {
                    menu: {
                        menuCode: sessionStorage.menuCode || ""
                    },
                    nodeList: []
                } : scope.tabs[0]);
            }, true);

            // menu事件绑定
            scope.getActiveLi = function(e, node) {
                scope.activeHash = node.menuCode;
            };

            // open close
            scope.clickTab = function ($event, tab) {
                scope.activeCode = tab.menu.menuCode;
                var tabs = scope.tabs || [];
                _.each(tabs, function (v, i) {
                    if (v.menu.menuCode === scope.activeCode) {
                        scope.activeId = i;
                        sessionStorage.setItem('menuCode', scope.activeCode);
                    }
                });
                if (tab.nodeList.length) {
                    var $li = $(event.target).closest('li');
                    if (tab.open) {
                        $li.animate({
                            height: '40px'
                        }, 300, function () {
                            tab.open = !tab.open;
                            scope.$apply();
                        });
                    } else {
                        $li.animate({
                            height: '' + (tab.nodeList.length+1) * 40 + 'px'
                        }, 300, function () {
                            tab.open = !tab.open;
                            scope.$apply();
                        });
                    }
                }
            };
        }

        return defineObj;
    };

    nguiMenu.directive('saMenu', ['$http', '$compile', '$timeout', 'util', 'fetchTemplate', '$location', nguiMenuFn]);
    return nguiMenu;
});