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
        ServiceContent: ['$scope', 'dateFormatFilter', 'util', 'dayFilter', function ($scope, df, u, dayf) {
            var $model = $scope.$model;
            // 品牌
            var brandArr = $model.$brand.data.data || [];
            var DETAIL = $model.$detail.data.data || {};
            var regionArr = $model.$area.data.data || [];
            var hAreaArr = $model.$allArea.data.data || [];
            var s_pnArr = [];

            regionArr.forEach(function (r) {
                r.label = r.name;
                r.value = r.code;
                if (r.childrens && r.childrens.length) {
                    r.childrens.forEach(function (c) {
                        c.label = c.name;
                        c.value = c.code;
                        delete c.childrens;
                    });
                }
                r.children = r.childrens || [];
            });

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
                stime: dayf.today('datetime'),
                etime: dayf.tomorrow('datetime'),
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
                    propValue: '1@20:30'
                }, {
                    id: '',
                    activityCode: '',
                    propKey: 'REAWARD_DURATION',
                    propValue: ''
                }, {
                    id: '',
                    activityCode: '',
                    propKey: 'MEMBERDAY_BLACKLIST',
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

                // 勾选
                setTimeout(function () {
                    DETAIL.activity.brandCode.split(',').forEach(function (id) {
                        $('#'+id).trigger('click');
                    });
                }, 0);

                _.each(s_def.memberdayRules, function (md, idx) {
                    u.uiExtend(md, DETAIL.activity.memberdayRules.sort(function (a, b) {
                        return a.ruleType - b.ruleType;
                    })[idx], [
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
                    md.isuse = !!md.isuse;
                });

                DETAIL.activity.memberdayProps.forEach(function (mp) {
                    switch(mp.propKey) {
                        case 'DRAW_AWARD_TIME':
                            u.uiExtend(s_def.memberdayProps[0], mp, [
                                'activityCode',
                                'id',
                                'propValue'
                            ]);
                            break;
                        case 'REAWARD_DURATION':
                            u.uiExtend(s_def.memberdayProps[1], mp, [
                                'activityCode',
                                'id',
                                'propValue'
                            ]);
                            break;
                        case 'MEMBERDAY_BLACKLIST':
                            u.uiExtend(s_def.memberdayProps[2], mp, [
                                'activityCode',
                                'id',
                                'propValue'
                            ]);
                            break;
                    }
                });
                s_def.sns = DETAIL.activity.sn.split(',');
                s_def.areaCodes = DETAIL.activity.areaCode.split(',');
                s_def.areaBlackCityCodes = _.union(DETAIL.activity.areaBlackCityCodes.split(','));
                s_def.areaBlackVillCodes = _.union(DETAIL.activity.areaBlackVillCodes.split(','));
                s_def.stime = df.datetime(DETAIL.activity.stime);
                s_def.etime = df.datetime(DETAIL.activity.etime);

                t_def.activityAwards[0].details[0].bigred = DETAIL.activity.activityAwards[0].details[0].bigred;
                t_def.activityAwards[0].details[0].minred = DETAIL.activity.activityAwards[0].details[0].minred;

                t_def.activityAwards[1].details[0].bigred = DETAIL.activity.activityAwards[1].details[0].bigred;
                t_def.activityAwards[1].details[0].minred = DETAIL.activity.activityAwards[1].details[0].minred;

                t_def.activityAwards[2].details[0].bigred = DETAIL.activity.activityAwards[2].details[0].bigred;
                t_def.activityAwards[2].details[0].minred = DETAIL.activity.activityAwards[2].details[0].minred;
            }

            var s_memberdayProps_0 = s_def.memberdayProps[0].propValue;
            var s_memberdayProps_1 = s_def.memberdayProps[1].propValue;
            var s_memberdayProps_2 = s_def.memberdayProps[2] || {};

            $scope.f = angular.extend({}, f_def);
            $scope.s = angular.extend({}, s_def);
            $scope.t = angular.extend({}, t_def);

            $scope = angular.extend($scope, {
                f_uploadImg: f_uploadImg,
                f_uploadFile: f_uploadFile,
                f_next: f_next,
                step: 0
            }, {
                s_brandCode: [],
                s_bnArr: brandArr,
                s_brand_valide: false,
                s_brandChange: brandChange,
                s_pnArr: [],
                s_rgArr: regionArr,
                s_hrgArr: regionArr,
                s_hisuse: !!Number(s_memberdayProps_2.propValue),
                s_hacArr: [],
                s_memberdayProps_week: s_memberdayProps_0.split('@')[0],
                s_memberdayProps_time: s_memberdayProps_0.split('@')[1],
                s_memberdayProps_isuse: !!Number(s_memberdayProps_1.split('@')[0]),
                s_memberdayProps_wweek: s_memberdayProps_1.split('@')[1],
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
                        $scope.f.attachCode = res.data.attachCode;
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

            // 第二步 下一步
            function f_next () {
                $("#md_first").fadeOut('fast');
                $("#md_second").fadeIn('fast');
                $("#md_third").fadeOut('fast');
            }
            // 第三步 下一步
            function s_next () {
                $("#md_first").fadeOut('fast');
                $("#md_second").fadeOut('fast');
                $("#md_third").fadeIn('fast');
            }
            // 第一步 返回
            function s_back () {
                $("#md_first").fadeIn('fast');
                $("#md_second").fadeOut('fast');
                $("#md_third").fadeOut('fast');
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
                $scope.s.memberdayProps[1].propValue = ''+(0+$scope.s_memberdayProps_isuse)+'@'+$scope.s_memberdayProps_wweek;
                $scope.s.memberdayProps[2].propValue = 0 + $scope.s_hisuse;

                $model.update(angular.extend(
                    $scope.f, $scope.s, $scope.t, {
                        areaBlackCityCodes: !!$scope.s.areaBlackVillCodes.length ? $scope.s.areaBlackCityCodes.join(',') : '',
                        areaBlackVillCodes: $scope.s.areaBlackVillCodes.join(',') || ''
                    }
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
                    var $sns = $("[name='sns']");
                    if (!n.length) {
                        $scope.pnArr = [];
                        $scope.s_brand_valide = true;
                        $sns.multiselect('dataprovider', []);
                        $scope.s.sns = [];
                        $sns.multiselect('refresh');
                    } else {
                        $scope.s_brand_valide = false;
                        $model.getProduct({
                            brandCode: n.join(',')
                        }).then(function (res) {
                            $scope.s_pnArr = res.data.data || [];
                            $scope.$apply();
                            $sns.multiselect('dataprovider', _.map(res.data.data, function(val) {
                                return {
                                    label: val.name,
                                    value: val.sn
                                }
                            }));
                            $sns.multiselect('select', $scope.s.sns);
                            $sns.multiselect('refresh');
                        });
                    }
                }
            });

            // 黑名单显示
            $scope.$watch('s.areaBlackCityCodes', function (n, o) {
                if (n !== o) {
                    initAreaBlackVill(n);
                }
            });

            function initAreaBlackVill(n) {
                var s_hacArr = [];
                n.forEach(function (f) {
                    s_hacArr = s_hacArr.concat(hAreaArr.areas[f] || []);
                });
                s_hacArr.forEach(function (r) {
                    r.label = r.name;
                    r.value = r.code;
                });
                $scope.s_hacArr = s_hacArr;
                $("#harea select").multiselect('dataprovider', $scope.s_hacArr);
                $("#harea select").multiselect('select', $scope.s.areaBlackVillCodes);
            }

            // 初始化多选
            $(document).ready(function () {
                $(".multi select").multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择',
                    filterPlaceholder: '查询'
                });
                $("#region select").multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择',
                    enableFiltering: true,
                    buttonWidth: '200px',
                    filterPlaceholder: '查询',
                    enableClickableOptGroups: true,
                    enableCollapsibleOptGroups: true
                }).multiselect('dataprovider', regionArr)
                  .multiselect('select', $scope.s.areaCodes);

                $("#hregion select").multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择',
                    enableFiltering: true,
                    buttonWidth: '200px',
                    filterPlaceholder: '查询',
                    enableClickableOptGroups: true,
                    enableCollapsibleOptGroups: true
                }).multiselect('dataprovider', regionArr)
                  .multiselect('select', $scope.s.areaBlackCityCodes);

                // 黑名单
                $("#harea select").multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择',
                    buttonWidth: '200px'
                });
                if (!!$scope.s.areaBlackCityCodes.length) {
                    initAreaBlackVill($scope.s.areaBlackCityCodes);
                }

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
                        setTimeout(function () {
                            $('[name="s.etime"]').val(st);
                        }, 0)
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
                    startDate: df.date(+new Date)+' 00:00:00',
                    endDate: df.date(+new Date)+' 23:59:59'
                });
                // 时分格式化
                $("#md_second .time-second").datetimepicker({
                    language: "zh-CN",
                    format: "hh:ii:ss",
                    autoclose: true,
                    todayBtn: true,
                    minuteStep: 2,
                    startView: 1,
                    maxView: 1,
                    minView: 0,
                    startDate: df.date(+new Date)+' 00:00:00',
                    endDate: df.date(+new Date)+' 23:59:59'
                });

                // 显示第一栏
                $("#md_first").show();
            });

        }]
    };

    return memberDaySettingCtrl;
});