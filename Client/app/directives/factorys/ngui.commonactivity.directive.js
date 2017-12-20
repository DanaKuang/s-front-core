/**
 * Author: Kuang
 * Create Date: 2017-07-21
 * Description: commonactivity
*/

define([], function () {
    var nguiCommonActivity = angular.module('ngui.commonactivity', []);

    var nguiCommonActivityFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/commonactivity.tpl.html',
            pageName: ''
        };
        var defineObj = { //指令定义对象
            restrict: 'AE',
            replace: true,
            transclude: true,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.tpl || defaults.tpl;
            },
            scope: {
                conf: '='
            },
            link: linkFn
        };

        function linkFn (scope, element, attrs) {
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['pageName']);

            // 监视conf变化更新 commonactivity
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['pageName']);
                var allconfigtemplateScope = angular.element('.all-template-config-wrap').scope();
                scope.pageName = allconfigtemplateScope.pageName;
                if (!!allconfigtemplateScope.conf.data[0]) {
                    var type = allconfigtemplateScope.conf.data[0].type || '0';
                } else if (!!allconfigtemplateScope.conf.data.pageExt) {
                    var type = allconfigtemplateScope.conf.data.pageExt.type || '0';
                } else {
                    var type = allconfigtemplateScope.conf.data.pageList[0].type || '0';
                }

                scope.actsrc = [
                    '',
                    'statics/assets/image/dazhuanpan.png',
                    'statics/assets/image/guaguaka.png',
                    'statics/assets/image/fanpai.png',
                    '',
                    'statics/assets/image/jiugonge.png',
                    '',
                    '',
                    'statics/assets/image/fanpai.png',
                    'statics/assets/image/dianyuanbao.png',
                    'statics/assets/image/fanzhuanshi.png'
                ][type.replace('act-','')] || 'statics/assets/image/fanpai.png';
            }, true);

        }

        return defineObj;
    }

    nguiCommonActivity.directive('saCommonactivity', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguiCommonActivityFn]);
})
