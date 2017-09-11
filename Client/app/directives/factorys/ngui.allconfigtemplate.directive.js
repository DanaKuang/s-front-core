/**
 * Author: Kuang
 * Create Date: 2017-07-26
 * Description: allconfigtemplate
 */

define([], function () {
    var allconfigtemplate = angular.module('ngui.allconfigtemplate', []);

    var allconfigtemplateFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/allconfigtemplate.tpl.html',
            confUrl: '',
            pageName: '',
            pageCode: '',
            activityCode: ''
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl', 'pageName', 'pageCode', 'activityCode']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl', 'pageName', 'pageCode', 'activityCode']);
                // 一开始进入页面的时候scope.conf是undefined

                // 两种进来方式，一种是新建活动，一种是编辑活动。
                if (scope.conf) {
                    var data = scope.conf.data;
                    if (Array.isArray(data)) {
                        // 新建活动
                        scope.confUrl = data[0].confUrl;
                        scope.pageName = data[0].pageName;
                        scope.pageCode = data[0].pageCode;
                    } else {
                        // 编辑活动
                        scope.confUrl = data.confUrl;
                        scope.pageName = data.pageExt.pageName;
                        scope.pageCode = data.pageExt.pageCode;
                        scope.activityCode = data.activity.activityCode;
                        scope.dcList = data.dcList;
                    }
                }
                
            }, true);

        }
        return defineObj;
    }

    allconfigtemplate.directive('saAllconfigtemplate', ['$rootScope', '$http', '$compile', '$timeout', 'util', allconfigtemplateFn]);
})
