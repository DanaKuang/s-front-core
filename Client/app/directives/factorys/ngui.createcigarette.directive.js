/**
 * Author: Kuang
 * Create Date: 2017-07-24
 * Description: actsample
 */

define([], function () {
    var createcigarette = angular.module('ngui.createcigarette', []);

    var createcigaretteFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/createcigarette.tpl.html',
            disabled: true
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['disabled']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['disabled']);

            }, true);

            scope.$watch('disabled', function (n, o, s) {
                if (n !== o) {
                    scope.disabled = n;
                }
            })

            // 品牌
            scope.$emit('choosebrands', event, {})
            // 卷烟类型
            scope.$emit('cigarettestyle', event, {})
            // 烟支规格
            scope.$emit('cigarettetype', event, {})
            // 包装
            scope.$emit('cigarettepack', event, {})
            // 一级价类
            scope.$emit('cigarettegrade', event, {})

            scope.checksn = function () {
                scope.$emit('checksn', event, {sn: scope.sn})
            }

        }
        return defineObj;
    }

    createcigarette.directive('saCreatecigarette', ['$rootScope', '$http', '$compile', '$timeout', 'util', createcigaretteFn]);
})
