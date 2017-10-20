/**
 * Author: Kuang
 * Create Date: 2017-07-24
 * Description: basicinfo
 */

define([], function () {
    var basicinfo = angular.module('ngui.basicinfo', []);

    var basicinfoFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/basicinfo.tpl.html',
            pageName: '',
            parentForm: {},
            activity: {}
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
            require: '^form',
            link: linkFn
        };

        function linkFn (scope, element, attrs, ctrl) {

            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl', 'activityForm', 'pageName', 'points', 'accessUrl', 'attachCode', 'disabled', 'nameValue']);

            // 监视conf变化更新 basicinfo
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl', 'activityForm', 'pageName', 'points', 'accessUrl', 'attachCode', 'disabled', 'nameValue']);
            }, true);

            var that_scope = angular.element('.all-template-config-wrap').scope();
            var sample_list_scope = angular.element('.sample-list').scope();

            // 判断是否从编辑活动过来
            if (that_scope.activityCode) {
                // 编辑
                scope.disabled = true;
                var activity = that_scope.conf.data.activity;
                scope.confUrl = that_scope.conf.data.confUrl;
                scope.activity = activity;
                scope.nameVaule = activity.activityName;
                scope.points = activity.idx || 1;
                scope.descValue = activity.activityDec;
                scope.introValue = activity.activityDoc;
                scope.accessUrl = activity.activityEntrance;
                scope.attachCode = activity.activityEntranceAttach;

                var pageListObj = that_scope.conf.data.pageList[0];
                scope.activityForm = pageListObj.type;
                scope.pageName = pageListObj.pageName;
                scope.pageCode = pageListObj.pageCode;
            } else {
                // 新增
                scope.activityForm = sample_list_scope && sample_list_scope.type;
                scope.confUrl = that_scope.confUrl;
                scope.pageName = that_scope.pageName;
                
                // 这样才能拿到父作用域中的scope的form
                scope.parentForm = angular.element('.css-form').scope().form;

                scope.change = function() {
                    if (event.target.classList.contains('uploadimage')) {
                        var files = event.target.files[0];
                        var formData = new FormData();
                        formData.append('file', files);
                        scope.$emit('frombasicimage', event, formData);
                    }
                }

                $("textarea[maxlength]").bind('input propertychange', function() {  
                    var maxLength = $(this).attr('maxlength');  
                    if ($(this).val().length > maxLength) {  
                        $(this).val($(this).val().substring(0, maxLength));  
                    }  
                })  
            }
        }

        return defineObj;
    }

    basicinfo.directive('saBasicinfo', ['$rootScope', '$http', '$compile', '$timeout', 'util', basicinfoFn]);
})