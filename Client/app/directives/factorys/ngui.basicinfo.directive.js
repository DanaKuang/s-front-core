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
            confUrl: '',
            activityForm: '',
            pageName: '',
            accessUrl: '',
            attachCode: '',
            namePriority: 0
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

            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl', 'activityForm', 'pageName', 'namePriority', 'accessUrl', 'attachCode']);

            // 监视conf变化更新 basicinfo
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl', 'activityForm', 'pageName', 'namePriority', 'accessUrl', 'attachCode']);
                var that_scope = angular.element('.all-template-config-wrap').scope();
                var sample_list_scope = angular.element('.sample-list').scope();

                // 判断是否从编辑活动过来
                if (that_scope.activityCode) {
                    // 编辑
                    scope.disabled = true;
                    var activity = that_scope.conf.data.activity;
                    scope.nameVaule = activity.activityName;
                    scope.namePriority = that_scope.conf.data.activity.idx || 0;
                    scope.descValue = activity.activityDec;
                    scope.introValue = activity.activityDoc;
                    scope.accessUrl = activity.activityEntrance;
                    scope.attachCode = activity.activityEntranceAttach; //缺失
                    // scope.attachUrl = 
                    var pageListObj = that_scope.conf.data.pageList[0];
                    scope.activityForm = pageListObj.type;
                    scope.pageName = pageListObj.pageName;
                    scope.pageCode = pageListObj.pageCode;
                } else {
                    // 新增
                    scope.activityForm = sample_list_scope && sample_list_scope.type;
                    scope.confUrl = that_scope.confUrl;
                    scope.pageName = that_scope.pageName;
                }
            }, true);

            scope.change = function() {
                if (event.target.classList.contains('uploadimage')) {
                    var files = event.target.files[0];
                    var formData = new FormData();
                    formData.append('file', files);
                    scope.$emit('frombasicimage', event, formData);
                }
            }

            // 活动名称 5~30字
            scope.namekeyup = function (e) {
                var val = e.target.value;
                if (val) {
                    if (val.length < 5) {
                        $(e.target).prev().removeClass('hidden')
                    } else {
                        $(e.target).prev().addClass('hidden')
                    }
                }
            }

            // 优先级 最大500
            var numReg = /^\d+$/;
            scope.prioritykeyup = function(e) {
                var val = e.target.value;
                if (val) {
                   if (numReg.test(val)) {
                        if (val > 500) {
                            scope.namePriority = e.target.value = deletezero('500')
                        } else if (val < 0) {
                             scope.namePriority = e.target.value = deletezero('0')
                        } else {
                             scope.namePriority = e.target.value = deletezero(val);
                        }
                    } else {
                         scope.namePriority = e.target.value = deletezero('0');
                    }
                }
            }

            function deletezero(str) {
                if (str.length > 1) {
                    if (str[0] === '0') {
                        str = str.substr(1);
                        deletezero(str)
                    } else {
                        return str
                    }
                } else {
                    return str
                }
            }
        }

        return defineObj;
    }

    basicinfo.directive('saBasicinfo', ['$rootScope', '$http', '$compile', '$timeout', 'util', basicinfoFn]);
})