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
        ServiceContent: ['$scope', 'dateFormatFilter', 'util', function ($scope, df, u) {
            var $model = $scope.$model;
            // 品牌
            var brandArr = $model.$brand.data.data || [];
            var proArr = $model.$province.data.data || [];
            var DETAIL = $model.$detail.data.data || {};

            var f_def = {
                copyOfPageCode: 'huiyuanri',
                activityCode: '',
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
                    scoreNum: 0,
                    luckyNum: 0,
                    sweek: 1,
                    stime: '',
                    eweek: 1,
                    etime: ''
                }, {
                    ruleType: 2,
                    isuse: 0,
                    scoreNum: 0,
                    luckyNum: 0,
                    sweek: 1,
                    stime: '',
                    eweek: 1,
                    etime: ''
                }, {
                    ruleType: 3,
                    isuse: 0,
                    scoreNum: 0,
                    luckyNum: 0,
                    sweek: 1,
                    stime: '',
                    eweek: 1,
                    etime: ''
                }, {
                    ruleType: 1,
                    isuse: 0,
                    scoreNum: 0,
                    luckyNum: 0,
                    sweek: 1,
                    stime: '',
                    eweek: 1,
                    etime: ''
                }, {
                    ruleType: 4,
                    isuse: 0,
                    luckyNum: 0,
                    scoreNum: 0,
                    sweek: 1,
                    stime: '',
                    eweek: 1,
                    etime: ''
                }],
                memberdayProps: [{
                    id: '',
                    activityCode: '',
                    propKey: 'DRAW_AWARD_TIME',
                    propValue: ''
                }, {
                    id: '',
                    activityCode: '',
                    propKey: 'REAWARD_DURATION',
                    propValue: ''
                }]
            };
            var t_def = {
                activityAwards: [{
                    idx: 1,
                    special: 0,
                    prizeName: '一等奖',
                    details: [{
                        awardType: 3,
                        bigred: 0,
                        minred: 0,
                    }]
                }, {
                    idx: 2,
                    special: 0,
                    prizeName: '二等奖',
                    details: [{
                        awardType: 3,
                        bigred: 0,
                        minred: 0
                    }]
                }, {
                    idx: 3,
                    special: 0,
                    prizeName: '三等奖',
                    details: [{
                        awardType: 3,
                        bigred: 0,
                        minred: 0
                    }]
                }]
            };
            // 编辑
            if (DETAIL.activity) {
                u.uiExtend(f_def, DETAIL.activity, [
                    'activityCode',
                    'activityName',
                    'pageCode',
                    'attach',
                    'activityEntrance',
                    'activityEntranceAttach',
                    'idx',
                    'activityDec',
                    'activityRuleHtml'
                ]);

                _.each(s_def.memberdayRules, function (md, idx) {
                    u.uiExtend(md, DETAIL.activity.memberdayRules[idx], [
                        'activityCode',
                        'etime',
                        'eweek',
                        'id',
                        'isuse',
                        'luckyNum',
                        'scoreNum',
                        'ruleType',
                        'stime',
                        'sweek'
                    ]);
                });

                if (DETAIL.activity.memberdayProps[0].propKey === "DRAW_AWARD_TIME") {
                    u.uiExtend(s_def.memberdayProps[0], DETAIL.activity.memberdayProps[0], [
                        'activityCode',
                        'id',
                        'propValue'
                    ]);
                    u.uiExtend(s_def.memberdayProps[1], DETAIL.activity.memberdayProps[1], [
                        'activityCode',
                        'id',
                        'propValue'
                    ]);
                } else {
                    u.uiExtend(s_def.memberdayProps[0], DETAIL.activity.memberdayProps[1], [
                        'activityCode',
                        'id',
                        'propValue'
                    ]);
                    u.uiExtend(s_def.memberdayProps[1], DETAIL.activity.memberdayProps[0], [
                        'activityCode',
                        'id',
                        'propValue'
                    ]);
                }

                s_def.sns = DETAIL.activity.sn.split(',');
                s_def.areaCodes = DETAIL.activity.areaCode.split(',');
                s_def.stime = df.datetime(DETAIL.activity.stime);
                s_def.etime = df.datetime(DETAIL.activity.etime);

                t_def.activityAwards[0].details[0].bigred = DETAIL.activity.activityAwards[0].details[0].bigred;
                t_def.activityAwards[0].details[0].minred = DETAIL.activity.activityAwards[0].details[0].minred;

                t_def.activityAwards[1].details[0].bigred = DETAIL.activity.activityAwards[1].details[0].bigred;
                t_def.activityAwards[1].details[0].minred = DETAIL.activity.activityAwards[1].details[0].minred;

                t_def.activityAwards[2].details[0].bigred = DETAIL.activity.activityAwards[2].details[0].bigred;
                t_def.activityAwards[2].details[0].minred = DETAIL.activity.activityAwards[2].details[0].minred;
            }

            var s_memberdayProps = s_def.memberdayProps[0].propValue;

            $scope.f = angular.extend({}, f_def);
            $scope.s = angular.extend({}, s_def);
            $scope.t = angular.extend({}, t_def);

            $scope = angular.extend($scope, {
                f_uploadImg: f_uploadImg,
                f_uploadFile: f_uploadFile,
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
                s_memberdayProps_week: s_memberdayProps.split('@')[0],
                s_memberdayProps_time: s_memberdayProps.split('@')[1],
                s_next: s_next,
                s_back: s_back
            }, {
                t_save: t_save
            });

            // 上传文件
            function f_uploadFile () {
                var e = event.target;
                var f = e.files[0];
                var fd = new FormData();
                fd.append('file', f);
                $model.upload(fd).then(function (res) {
                    if (res.ret === '200000') {
                        $scope.f.attach = res.data.accessUrl;
                        $scope.$apply();
                    } else {
                        alert('文件上传失败！');
                    }
                });
            }

            // 上传图片
            function f_uploadImg () {
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
                // $scope.s = angular.extend({}, s_def);
                $scope.step = 0;
            }
            // 第三步 保存
            function t_save () {
                console.log($scope);
                $scope.s.memberdayRules[0].isuse += 0;
                $scope.s.memberdayRules[1].isuse += 0;
                $scope.s.memberdayRules[2].isuse += 0;
                $scope.s.memberdayRules[3].isuse += 0;
                $scope.s.memberdayRules[4].isuse += 0;

                $scope.s.memberdayProps[0].propValue = ''+$scope.s_memberdayProps_week+'@'+$scope.s_memberdayProps_time;
                $model.update(angular.extend(
                    $scope.f, $scope.s, $scope.t
                )).then(function (res) {
                    if (res.data.ret === '200000') {
                        alert('保存成功！');
                        // window.location.reload();
                    }
                });
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
                            $("[name='sns']").multiselect('dataprovider', _.map(res.data.data, function(val) {
                                return {
                                    label: val.name,
                                    value: val.sn
                                }
                            }));
                            $("[name='sns']").multiselect('refresh');
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
                        $("[name='areaCodes']").multiselect('dataprovider', _.map(res.data.data, function(val) {
                            return {
                                label: val.name,
                                value: val.code
                            }
                        }));
                        $("[name='sns']").multiselect('refresh');
                    });
                } else {
                    $scope.ctArr = [];
                    $scope.$apply();
                    $("[name='areaCodes']").multiselect('dataprovider', []);
                    $("[name='areaCodes']").multiselect('refresh');
                }
            }

            // 初始化多选
            $(document).ready(function () {
                $(".multi select").multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择',
                    enableFiltering: true,
                    filterPlaceholder: '查询'
                });

                // 年月日时分秒
                $("#md_second .datetime").datetimepicker({
                    language: "zh-CN",
                    format: "yyyy-mm-dd hh:ii:ss",
                    autoclose: true,
                    todayBtn: true,
                    minView: 0,
                    maxView: 4,
                    startDate: ""
                }).on('change', function (e) {
                    var st = $scope.s.stime || '';
                    var et = $scope.s.etime || '';
                    if (et < st) {
                        $scope.s.etime = st;
                    }
                });

                // 日期初始化
                $("#md_second .date").datetimepicker({
                    language: "zh-CN",
                    format: "yyyy-mm-dd",
                    autoclose: true,
                    todayBtn: true,
                    minView: 2,
                    startDate: ""
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
                });
            });

        }]
    };

    return memberDaySettingCtrl;
});