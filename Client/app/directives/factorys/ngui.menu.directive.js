/**
 * Author: liubin
 * Create Date: 2017-06-29
 * Description: menu
 */

define([], function () {
    var nguiMenu = angular.module('ngui.menu', []);

    var nguiMenuFn = function (util, $location) {
        var defaults = { //默认配置
            tpl: '/menu.tpl.html',
            style: 'tab', //样式 tab,pill
            tabs: [] //选项卡数组
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['style', 'tabs']);

            // 监视conf变化更新menu
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['style', 'tabs']);
            }, true);

            // menu事件绑定
            scope.getActiveLi = function(e, node) {
                scope.activeHash = node.menuCode;
            };

            // open close
            scope.clickTab = function ($event, tab) {
                scope.activeCode = tab.menu.menuCode;
                var tabs = scope.tabs || [];
                if (tab.nodeList.length) {
                    var $li = $($event.target).closest('li');
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

    // 默认值
    nguiMenu.directive('repeatFinish', ['$timeout', function ($timeout) {
        return {
            link: function (scope, element, attr) {
                if (scope.$last == true) {
                    $timeout(function () {
                        // 默认取第一个
                        var $li = $(".ui-navbar-left li")[0];
                        if ($($li).find('a').hash) {
                            $($li).find('a').trigger('click');
                        } else {
                            $($li).find('a').trigger('click');
                            $($($li).find('ul li a')[0]).trigger('click');
                        }
                    });
                }
            }
        }
    }]);

    nguiMenu.directive('saMenu', ['util', '$location', nguiMenuFn]);
    return nguiMenu;
});