/**
 * Author: Kuang
 * Create Date: 2017-07-24
 * Description: basicinfo
 */

define([], function () {
    var basicinfo = angular.module('ngui.basicinfo', ['ng']);

    var basicinfoFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/basicInfo.tpl.html',
            confUrl: '',
            activityForm: ''
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

            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl', 'activityForm']);

            // 监视conf变化更新 basicinfo
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl', 'activityForm']);
                var that_scope = angular.element('.all-template-config-wrap').scope();
                scope.activityForm_scope = angular.element('.sample-list').scope() && angular.element('.sample-list').scope().type;
                if (that_scope.confUrl == 'holiday') {
                    scope.confUrl = 'holiday'
                }
                if (that_scope.confUrl == 'unexpected') {
                    scope.confUrl = 'unexpected' 
                }
            }, true);

            scope.change = function() {
                var files = event.target.files[0];
                var formData = new FormData();
                formData.append('file', files);
                scope.$emit('frombasicfiles', event, formData);
            }
        }

        return defineObj;
    }

    basicinfo.directive('saBasicinfo', ['$rootScope', '$http', '$compile', '$timeout', 'util', basicinfoFn]);
})
