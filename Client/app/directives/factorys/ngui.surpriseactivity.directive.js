/**
 * Author: Kuang
 * Create Date: 2017-07-24
 * Description: redpackactivity
 */

define([], function () {
    var surpriseactivity = angular.module('ngui.surpriseactivity', []);

    var surpriseactivityFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/surpriseactivity.tpl.html'
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['commonActivity']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['commonActivity']);
            }, true);

            $('.pop-back').on('click', function(){
                $(this).parents('.pop').addClass('hidden');
            })

        }

        return defineObj;
    }

    surpriseactivity.directive('saSurpriseactivity', ['$rootScope', '$http', '$compile', '$timeout', 'util', surpriseactivityFn]);
})
