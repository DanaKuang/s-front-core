/**
 * Author: Kuang
 * Create Date: 2017-07-29
 * Description: hbproduct 选择红包模板
 */

define([], function () {
    var hbproduct = angular.module('ngui.hbproduct', []);

    var hbproductFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/hbproduct.tpl.html',
            hbChooseList: [],
            totalCount: 0,
            size: 0,
            curPage: 1,
            pageNumber: 0
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

            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), []);

            // 监视conf变化更新 basicinfo
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), []);
                if (scope.conf) {
                    var data = scope.conf.data;
                    var page = data.page;
                    scope.hbChooseList = data.list;
                    scope.totalCount = page.count;
                    scope.size = page.pageSize;
                    scope.curPage = page.currentPageNumber;
                    scope.pageNumber = page.pageNumber;
                }

            }, true);

            // 选择奖品
            scope.choose = function (e) {
                var item = this.item;
                var setprizeScope = angular.element('.draw-prize-wrap').scope();
                var firstornot = setprizeScope.firstornot;
                var chooseNum = setprizeScope.chooseNum;
                
                if (firstornot) {
                    // 特殊项里的设置
                    var osJQobject = $('.first-draw').find('.ready-set .create-part').children().eq(chooseNum);
                    var osJSobject = osJQobject[0];
                } else {
                    // 非特殊奖项里的设置
                    var osJQobject = $('.non-first-draw').find('.ready-set .create-part').children().eq(chooseNum);
                    var osJSobject = osJQobject[0];
                }
                osJSobject.dataset.id = item.id;
                $(osJSobject).find('.radio-res').not('.hidden').find('.show-chosen').html('（已选择：' + item.name + '）');
                $('.modal-content .close').trigger('click');
            }
        }
        return defineObj;
    }

    hbproduct.directive('saHbproduct', ['$rootScope', '$http', '$compile', '$timeout', 'util', hbproductFn]);
})
