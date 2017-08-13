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
        }

        return defineObj;
    };

    nguiMenu.directive('saMenu', ['$http', '$compile', '$timeout', 'util', 'fetchTemplate', '$location', nguiMenuFn]);
    return nguiMenu;
});