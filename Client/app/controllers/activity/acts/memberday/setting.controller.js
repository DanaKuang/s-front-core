/**
 * Author: liubin
 * Create Date: 2018-01-03
 * Description: 会员日活动设置
 */

define([], function () {
    var memberDaySettingCtrl = {
        ServiceType: 'controller',
        ServiceName: 'mdSettingCtrl',
        ViewModelName: 'mdSettingModel',
        ServiceContent: ['$scope', 'dateFormatFilter', function ($scope, df) {
            var $model = $scope.$model;
            // 品牌
            var brandArr = $model.$brand.data.data || [];
            var proArr = $model.$province.data.data || [];

            var f_def = {
                activityName: '',
                activityForm: 'act-12',
                pageCode: '',
                status: 1,
                attach: '',
                activityEntrance: '',
                activityEntranceAttach: '',
                idx: 0,
                activityDec: '',
                activityRuleHtml: ''
            };
            var s_def = {
                sns: '',
                areaCodes: '',
                stime: '',
                etime: '',
                memberdayRules: [{
                    ruleType: 1,
                    isuse: 0,
                    luckyNum: 0,
                    sweek: 0,
                    stime: '',
                    eweek: 0,
                    etime: ''
                }, {
                    ruleType: 2,
                    isuse: 0,
                    luckyNum: 0,
                    sweek: 0,
                    stime: '',
                    eweek: 0,
                    etime: ''
                }, {
                    ruleType: 3,
                    isuse: 0,
                    luckyNum: 0,
                    sweek: 0,
                    stime: '',
                    eweek: 0,
                    etime: ''
                }, {
                    ruleType: 4,
                    isuse: 0,
                    luckyNum: 0,
                    sweek: 0,
                    stime: '',
                    eweek: 0,
                    etime: ''
                }, {
                    ruleType: 4,
                    isuse: 0,
                    luckyNum: 0,
                    sweek: 0,
                    stime: '',
                    eweek: 0,
                    etime: ''
                }]
            };
            var t_def = {
                t_prizes: [{
                    id: 1,
                    name: '测试',
                    pic: '测试',
                    member: '测试',
                    content: '测试',
                    status: '测试',
                    money: '测试'
                }],
                t_add: t_add,
                t_edit: t_edit,
                t_enable: t_enable,
                t_disable: t_disable
            };

            $scope.f = angular.extend({}, f_def);
            $scope.s = angular.extend({}, s_def);
            $scope.t = angular.extend({}, t_def);

            $scope = angular.extend($scope, {
                f_uploadFile: f_uploadFile,
                filename: '',
                f_next: f_next,
                f_back: f_back,
                step: 0
            }, {
                s_brandCode: [],
                s_bnArr: brandArr,
                s_brandChange: brandChange,
                s_pnArr: [],
                s_proArr: proArr,
                s_province: '',
                s_ctArr: [],
                s_getCity: getCity,
                s_next: s_next,
                s_back: s_back
            }, {
                t_save: t_save,
                t_back: t_back
            });

            // 上传图片
            function f_uploadFile () {
                var e = event.target;
                var f = e.files[0];
                if (!~f.type.indexOf('image')) {
                    alert('图片格式不正确!');
                    return;
                }
                if (f.size > 2000000) {
                    alert('图片过大!');
                    return;
                }
                var fd = new FormData();
                fd.append('file', f);
                $model.upload(fd).then(function (res) {
                    if (res.ret === '200000') {
                        $scope.f.activityEntrance = res.data.accessUrl;
                        $scope.f.activityEntranceAttach = res.data.attachCode;
                        $scope.$apply();
                    } else {
                        alert('文件上传失败！');
                    }
                });
            }

            // 第一步 下一步
            function f_next () {
                $scope.step = 1;
            }
            // 第一步 返回
            function f_back () {
                window.location.reload();
            }
            // 第二步 下一步
            function s_next () {
                $scope.step = 2;
            }
            // 第二步 返回
            function s_back () {
                $scope.s = angular.extend({}, s_def);
                $scope.step = 0;
            }
            // 第三步 保存
            function t_save () {
                console.log($scope);
                debugger
                window.location.reload();
            }
            // 第三步 返回
            function t_back () {
                $scope.t = angular.extend({}, t_def);
                $scope.step = 1;
            }


            // 新增
            function t_add () {
                alert('新增');
            }

            // 编辑
            function t_edit (id) {
                if (!id) return;
                alert('编辑');
            }

            // 启用
            function t_enable (id) {
                if (!id) return;
                alert('启用');
            }

            // 停用
            function t_disable (id) {
                if (!id) return;
                alert('停用');
            }

            // 品牌选择
            function brandChange (type) {
                var $ipt = event.target;
                if (!type) {
                    $($ipt).parent().siblings().find('input').map(function (i, ipt) {
                        ipt.checked = $ipt.checked;
                    });
                    if ($ipt.checked) {
                        $scope.s_brandCode = _.map(brandArr, function (b) {
                            return b.brandCode;
                        });
                    } else {
                        $scope.s_brandCode = [];
                    }
                } else {
                    if ($ipt.checked) {
                        // 为了触发watch
                        var bak = angular.copy($scope.s_brandCode);
                        bak.push($ipt.id);
                        $scope.s_brandCode = bak;
                    } else {
                        $scope.s_brandCode = _.without($scope.s_brandCode, $ipt.id);
                    }
                    if ($scope.s_brandCode.length == brandArr.length) {
                        $("#quanxuan_id")[0].indeterminate = false;
                        $("#quanxuan_id")[0].checked = true;
                    } else if (!$scope.s_brandCode.length) {
                        $("#quanxuan_id")[0].indeterminate = false;
                        $("#quanxuan_id")[0].checked = false;
                    } else {
                        $("#quanxuan_id")[0].indeterminate = true;
                        $("#quanxuan_id")[0].checked = false;
                    }
                }
            }
            // 规格动态选择
            $scope.$watch('s_brandCode', function (n, o , scope) {
                if (n !== o) {
                    if (!n.length) {
                        $scope.pnArr = [];
                    } else {
                        $model.getProduct({
                            productBrand: n.join(',')
                        }).then(function (res) {
                            $scope.s_pnArr = res.data.data || [];
                            $scope.$apply();
                        });
                    }
                }
            });

            // 获取市
            function getCity (code) {
                if (!!code) {
                    $model.getCity({
                        parentCode: code
                    }).then(function (res) {
                        $scope.s_ctArr = res.data.data || [];
                        $scope.$apply();
                    });
                } else {
                    $scope.ctArr = [];
                    $scope.$apply();
                }
            }

            // 日期初始化
            $("#md_second .date").datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                startDate: ""
            }).on('change', function (e) {
                var st = $scope.s_startTime || '';
                var et = $scope.s_endTime || '';
                if (et < st) {
                    $scope.s_endTime = st;
                }
            });
            // 时分格式化
            $("#md_second .time").datetimepicker({
                language: "zh-CN",
                format: "hh:ii",
                autoclose: true,
                todayBtn: true,
                minuteStep: 2,
                startView: 1,
                maxView: 1,
                minView: 0,
                startDate: ""
            }).on('change', function (e) {
                var st = $scope.s_startTime || '';
                var et = $scope.s_endTime || '';
                if (et < st) {
                    $scope.s_endTime = st;
                }
            });

        }]
    };

    return memberDaySettingCtrl;
});