/**
 * Author: jinlinyong
 * Create Date: 2017-09-14
 * Description: group
 */

define([], function () {
    var scannumber = angular.module('ngui.scannumber', []);

    var scannumberFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/scannumber.tpl.html',
            Arr: []
        };
        var defineObj = { //指令定义对象
            restrict: 'AE',
            replace: true,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.tpl || defaults.tpl;
            },
            scope: {
                conf: '=',
            },
            link: linkFn
        };
        function linkFn(scope, ele, attr) {
            util.uiExtend(scope, defaults, (scope.conf||{}), ['Arr']);
            scope.$watch('conf', function () {
                util.uiExtend(scope, defaults, (scope.conf||{}), ['Arr']);
            },true)
        };

        return defineObj;
    }

    scannumber.directive('saScannumber', ['$rootScope', '$http', '$compile', '$timeout', 'util', scannumberFn]);
})
