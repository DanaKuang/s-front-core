/**
 * Author: Kuang
 * Create Date: 2017-09-05
 * Description: giftpack
 */

define([], function () {
    var giftpack = angular.module('ngui.giftpack', []);

    var giftpackFn = function ($rootScope, $http, $compile, $timeout, util, numberFormat) {
        var defaults = { //默认配置
            tpl: '/giftpack.tpl.html',
            list: []
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list']);

                // 一开始进入页面的时候scope.conf是undefined
                if (scope.conf) {
                    // scope.conf.list = []
                }

                var that_scope = angular.element('.all-template-config-wrap').scope();
                if (that_scope.activityCode) {
                    scope.disabled = true;
                }
            }, true);

            // 删除某个礼品
            $('#surprisesetprize').on('click', '.gift-delete', function () {
                var this_item = $(e.target).parents('.prize-img-preview-wrap-repeat');
                var this_idx = this_item.index();
                scope.conf.list.splice(this_idx, 1);
                scope.$apply();
            })

        }
        return defineObj;
    }

    giftpack.directive('saGiftpack', ['$rootScope', '$http', '$compile', '$timeout', 'util', 'numberFormat', giftpackFn]);
})