/**
 * Author: Kuang
 * Create Date: 2017-07-24
 * Description: participateinfo
 */

define([], function () {
    var launchinfo = angular.module('ngui.launchinfo', []);

    var launchinfoFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/launchinfo.tpl.html',
            // selectCompanyVal: '',
            selectBrandVal: '',
            selectSpecificationVal: '',
            hours: _.map(Array(24),function(v, i){return i;})
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

            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['selectBrandVal', 'selectSpecificationVal', 'hours']);

            // 监视conf变化更新 launchinfo
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['selectBrandVal', 'selectSpecificationVal', 'hours']);
            }, true);

            // scope.$watch('selectCompanyVal', function (n, o, s) {
            //     if (n !== o) {
            //         scope.$emit('supplierCode', event, {supplierCode: scope.selectCompanyVal});
            //     }
            // })

            scope.$watch('selectBrandVal', function (n, o, s) {
                if (n !== '') {
                    var brandListArrObj = {};
                    brandListArrObj.brandCode = n;
                    scope.$emit('brandCode', event, brandListArrObj);
                }
            })

            scope.$watch('selectSpecificationVal', function (n, o, s) {
                scope.$emit('specificationnotempty', event, {
                    canchoose: true
                });
            })
            
            var that_scope = angular.element('.all-template-config-wrap').scope();

            if (that_scope.activityCode) {
                // 说明从编辑活动过来
                scope.disabled = true;
                var activity = that_scope.conf.data.activity;
                scope.activity = activity;
                
                scope.selectBrandVal = activity.activityBrandsList.join(',');

                var selectSpecificationVal = [];
                activity.activitySnSList.forEach(function(n, index) {
                    selectSpecificationVal[index] = n.sn;
                })
                scope.selectSpecificationVal = selectSpecificationVal.join(',');

                var selectAreaVal = [];
                activity.activityAreaList.forEach(function(n, index) {
                    selectAreaVal[index] = n.adCode;
                })
                scope.selectAreaVal = selectAreaVal.join(',');

                scope.whichday = activity.holiday;
                if (scope.whichday == 3) {
                    $('.both').trigger('click')
                } else if (scope.whichday == 2) {
                    $('.weekend').trigger('click')
                } else {
                    $('.weekday').trigger('click')
                }
                
                var selectDurationStart = new Date(activity.stime).toLocaleString();
                scope.startTime = adjustafternoon(selectDurationStart);

                var selectDurationEnd = new Date(activity.etime).toLocaleString();
                scope.endTime = adjustafternoon(selectDurationEnd);
            }

            function adjustafternoon(datestr) {
                datestr = datestr.replace(/\//g, '-');
                if (datestr.match(/上/)) {
                    return datestr = datestr.replace('上午', '');
                } else {
                    datestr = datestr.replace('下午', '')
                    var datestr_arr = datestr.split(' ');
                    var hms_arr = datestr_arr[1].split(':');
                    hms_arr[0] = Number(hms_arr[0]) + 12;
                    var hms_str = hms_arr.join(':');
                    var newdatestr = datestr_arr[0].concat(' ').concat(hms_str);
                    return newdatestr
                }
            }

            $('input[name="startTime"]').datetimepicker({
                format: 'yyyy-mm-dd hh:ii:00', 
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startDate: new Date()
            }).on('change', function (e) {
                var startTime = e.target.value;
                var endTime = scope.endTime;
                if (endTime < startTime) {
                    scope.endTime = '';
                    scope.$apply();
                }
            });
          
            $('input[name="endTime"]').datetimepicker({
                format: 'yyyy-mm-dd hh:ii:00', 
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startDate: new Date()
            }).on('change', function (e) {
                var endTime = e.target.value;
                var startTime = scope.startTime;
                if (startTime > endTime) {
                    scope.startTime = '';
                    scope.$apply();
                }
            });

            scope.whichday = $('.remark').find('input[type="radio"]:checked').val();

            $('.select-brand').one('click', function() {
                if (!scope.disabled) {
                    scope.$emit('clickbrandval', event, {})
                } else {
                    return
                }
            })

            // 点击选择地区
            $('.select-area').one('click', function () {
                if (!scope.disabled) {
                    scope.$emit('clickselectarea', event, {parentCode: ''})
                } else {
                    return
                }
            })

        }

        return defineObj;
    }

    launchinfo.directive('saLaunchinfo', ['$rootScope', '$http', '$compile', '$timeout', 'util', launchinfoFn]);
})
