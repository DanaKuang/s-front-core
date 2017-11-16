/**
 * Author: hanzha
 * Create Date: 2017-11-15
 * Description: 广告管理的礼品列表
 */

define([], function () {
    var adsgift = angular.module('ngui.adsgift', []);

    var adsgiftFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/adsgift.tpl.html',
            productChooseList: [],
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
                    scope.productChooseList = data.list;
                    scope.totalCount = page.count;
                    scope.size = page.pageSize;
                    scope.curPage = page.currentPageNumber;
                    scope.pageNumber = page.pageNumber;
                }
            }, true);

            // 选择奖品
            scope.choose = function (e) {
                var item = this.item;

                var listitem = {
                    giftId: item.id,
                    cardNo: item.id,
                    giftPic: item.giftPic,
                    giftName: item.name,
                }
                // scope.listitem = {
                //     id: item.id,
                //     giftPic: item.giftPic,
                //     name: item.name,
                //     giftType: item.giftType
                // }

                scope.$emit('adsgiftchecked', event, listitem);
                $('.create-adsgift-modal').modal('hide');
            }

        }
        return defineObj;
    }

    adsgift.directive('saAdsgift', ['$rootScope', '$http', '$compile', '$timeout', 'util', adsgiftFn]);
})
