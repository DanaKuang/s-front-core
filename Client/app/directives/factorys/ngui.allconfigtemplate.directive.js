/**
 * Author: Kuang
 * Create Date: 2017-07-26
 * Description: allconfigtemplate
 */

define([], function () {
    var allconfigtemplate = angular.module('ngui.allconfigtemplate', []);

    var allconfigtemplateFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/allConfigTemplate.tpl.html',
            confUrl: '',
            pageName: ''
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl']);

                // 一开始进入页面的时候scope.conf是undefined
                if (scope.conf) {
                    var data = scope.conf.data[0];
                    scope.confUrl = data.confUrl;
                    scope.pageName = data.pageName;
                }
            }, true);

        }
        return defineObj;
    }

    allconfigtemplate.directive('saAllconfigtemplate', ['$rootScope', '$http', '$compile', '$timeout', 'util', allconfigtemplateFn]);
})
