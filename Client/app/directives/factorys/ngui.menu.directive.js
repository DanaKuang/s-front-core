/**
 * Author: liubin
 * Create Date: 2017-06-29
 * Description: menu
 */

define([], function () {
    var nguiMenu = angular.module('ngui.menu', []);

    var nguiMenuFn = function (util, $location) {
        //默认配置
        var defaults = {
            tpl: '/menu.tpl.html',  // 模板文件
            style: 'tab',           //样式 tab,pill
            tabs: []                //选项卡数组
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
                sessionStorage.menuCode = node.menuCode || '';
            };

            // open close
            scope.clickTab = function ($event, tab) {
                scope.activeCode = tab.menu.menuCode;
                sessionStorage.menuCode = tab.menu.menuCode || '';
                var $li = $($event.target).closest('li');
                var tabs = scope.tabs || [];
                _.each(tabs, function (t) {
                    if (t.menu.menuCode === tab.menu.menuCode) {
                        if (t.nodeList.length) {
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
                    } else {
                        if (t.nodeList.length) {
                            if (t.open) {
                                $li.siblings().animate({
                                    height: '40px'
                                }, 300, function () {
                                    t.open = false;
                                    scope.$apply();
                                });
                                t.open = false;
                            }
                        }
                    }
                });
            };
        }

        return defineObj;
    };

    // 默认值
    nguiMenu.directive('repeatFinish', ['$timeout', function ($timeout) {
        return {
            link: function (scope, element, attr) {
                var code = sessionStorage.menuCode;
                if (scope.$last == true) {
                    $timeout(function () {
                        var $target = $("[data-target='"+code+"']");
                        if (code && $target.length) {
                            var $child = $target.closest('.child');
                            if ($child.length) {
                                $($child).prev().trigger('click');
                            }
                            $target.trigger('click');
                        } else {
                            // 默认取第一个
                            var $li = $(".ui-navbar-left li")[0];
                            if ($($li).find('a').hash) {
                                $($li).find('a').trigger('click');
                            } else {
                                $($li).find('a').trigger('click');
                                $($($li).find('ul li a')[0]).trigger('click');
                            }
                        }

                    });
                }
            }
        }
    }]);

    nguiMenu.directive('saMenu', ['util', '$location', nguiMenuFn]);
    return nguiMenu;
});