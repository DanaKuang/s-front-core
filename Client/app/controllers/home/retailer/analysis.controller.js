/**
 * Author: chenliang
 * Create Date: 2017-12-05
 * Description: retailer
 */
define([], function () {
    var analysisCtrl = {
        ServiceType: 'controller',
        ServiceName: 'analysisCtrl',
        ViewModelName: 'analysisViewModel',
        ServiceContent: ['$scope', 'dateFormatFilter', 'dayFilter','$location', function ($scope, dateFormatFilter, dayFilter,$location) {
            //  点击三角切换显示隐藏
            var flag = true;
            $('.ui-detail-search .ui-detail-screen h4 span').on('click', function () {
                $(this).parent().parent().siblings('div').toggle();
                if (!flag) {
                    $(this).css("transform", "rotate(-360deg)");
                    flag = true;
                } else {
                    $(this).css("transform", "rotate(-90deg)");
                    flag = false;
                }
            })

            // 点击对比切换显示隐藏
            $('#contrast-container .input_check+label').on('click', function () {
                $('#contrast-container').siblings('div').toggle();
                $(this).toggleClass('color');
            })

            var echarts = require('echarts');
            var $model = $scope.$model || {};

            // 业态分布（玫瑰图）
            var caLEchart = echarts.init(document.getElementById('caLMap'));
            var caLMapConf = $model.$caLMapConf.data;
            caLEchart.setOption(caLMapConf);
            // 业态分布（柱状图）
            var caREchart = echarts.init(document.getElementById('caRMap'));
            var caRMapConf = $model.$caRMapConf.data;

            //  地域分布 (柱形图)
            var ttEchart = echarts.init(document.getElementById('ttMap'));
            var ttMapConf = $model.$ttMapConf.data;

            //  发展时间趋势 (折线图)
            var timeTEchart = echarts.init(document.getElementById('timeTMap'));
            var timeTMapConf = $model.$timeTMapConf.data;


            $scope.ShopDownBox = $model.$ShopDownBox.data || []; // 业态下拉框
            $scope.ProvByorgId = $model.$ProvByorgId.data[0] || []; // 用户默认省份
            $scope.UserProv = $model.$UserProv.data || []; // 省份

            // 省市发生变化
            $('#proviceId').on('change', function () {
                if ($('#proviceId').val() == '000000') { // 证明选中了全部按钮（置灰地市，地市等级）
                    $("#prefecture").siblings('div').children('button').attr('disabled', 'disabled');
                    $("#levelOfCities").siblings('div').children('button').attr('disabled', 'disabled');
                    $('#prefecture').siblings('div').children('button').children('span').html('全部');
                    $('#levelOfCities').siblings('div').children('button').children('span').html('全部');
                    // 处理对比按钮
                    $('#contrast-container .input_check+label').off('click').css('cursor','not-allowed');
                    $('.ui-detail-comparison').css('cursor','not-allowed');
                    $('#checkbox').prop('checked',false);
                    $('#checkbox').hide();
                    $('#checkbox').attr('type','input');
                    $('#checkbox').siblings('label').hasClass('color') && $('#checkbox').siblings('label').removeClass('color');
                    $('.my-hidden').hide();
                    $('#levelOfCities').val("");
                    $('#prefecture').val("");
                } else {
                    $("#prefecture").siblings('div').children('button').removeAttr('disabled');
                    $("#levelOfCities").siblings('div').children('button').removeAttr('disabled');
                    $('#contrast-container .input_check+label').on('click',function () {
                        $('#contrast-container').siblings('div').toggle();
                        $(this).toggleClass('color');
                    }).css('cursor','pointer');
                    $('.ui-detail-comparison').css('cursor','pointer');
                    $('#checkbox').attr('type','checkbox');
                    $('#checkbox').show();
                    initFrame(); // 地市等级和地市
                }
            });

            //  初始化地市等级和地市
            initFrame(initSearch);

            function initFrame(initSearch) {
                $model.City({ // 获取地市等级
                    proviceId: $('#proviceId').val() || $scope.ProvByorgId.orgRegion
                }).then(function (res) {
                    $scope.City = res.data || {};
                    $scope.$apply();
                    $('#levelOfCities').multiselect('dataprovider', _.forEach($scope.City, function (v) {
                        v.label = v.cityClassName;
                        v.value = v.cityClassName;
                    }));
                    $('#levelOfCities').multiselect('refresh');

                    $model.CityDown({ // 获取地市
                        proviceId: $('#proviceId').val(),
                        cityClass: $('#levelOfCities').val() || res.data[0].cityClass
                    }).then(function (res) {
                        $scope.CityDown = res.data || {};
                        $scope.$apply();
                        $('#prefecture').multiselect('dataprovider', _.forEach($scope.CityDown, function (v) {
                            v.label = v.cityName;
                            v.value = v.cityId;
                        }));
                        $('#prefecture').multiselect('refresh');

                        $('#levelOfCities').on('change', function () { // 地市等级发生变化，获取地市
                            $model.CityDown({
                                proviceId: $('#proviceId').val(),
                                cityClass: $('#levelOfCities').val() || res.data[0].cityClass
                            }).then(function (res) { // 获取地市
                                $scope.CityDown = res.data || {};
                                $scope.$apply();
                                $('#prefecture').multiselect('dataprovider', _.forEach($scope.CityDown, function (v) {
                                    v.label = v.cityName;
                                    v.value = v.cityId == -1 ? '' : v.cityId;
                                }));
                                $('#prefecture').multiselect('refresh');
                            });
                        });
                        // 初始化
                        initSearch && initSearch();
                    });
                });
            };

            // 初始化对比地市等级和地市
            function initVSPrefecture() {
                // 获取对比地市等级
                $model.VsCity({
                    vsProviceId: $('#vsProvince').val() || $scope.ProvByorgId.orgRegion
                }).then(function (res) {
                    $scope.VsCity = res.data || {};
                    $scope.$apply();
                    $('#vsLevelOfCities').multiselect('dataprovider', _.forEach($scope.VsCity, function (v) {
                        v.label = v.vscityClassName;
                        v.value = v.vscityClassName;
                    }));
                    $('#vsLevelOfCities').multiselect('refresh');

                    // 对比地市
                    $model.VsCityDownBox({
                        vsProviceId: $('#vsProvince').val() || $scope.ProvByorgId.orgRegion,
                        vsCityClass: $('#vsLevelOfCities').val() || res.data[0].vsCityClassName
                    }).then(function (res) {
                        $scope.VsCityDown = res.data || {};
                        $scope.$apply();
                        $('#vsPrefecture').multiselect('dataprovider', _.forEach($scope.VsCityDown, function (v) {
                            v.label = v.vsCityName;
                            v.value = v.vsCityId;
                        }));
                        $('#vsPrefecture').multiselect('refresh');
                    });

                    // 当对比地市等级发生变化
                    $('#vsLevelOfCities').on('change', function () {
                        // 获取对比地市
                        $model.VsCityDownBox({
                            vsProviceId: $('#vsProvince').val() || $scope.ProvByorgId.orgRegion,
                            vsCityClass: $('#vsLevelOfCities').val() || res.data[0].vsCityClassName
                        }).then(function (res) {
                            $scope.VsCityDown = res.data || {};
                            $scope.$apply();
                            $('#vsPrefecture').multiselect('dataprovider', _.forEach($scope.VsCityDown, function (v) {
                                v.label = v.vsCityName;
                                v.value = v.vsCityId;
                            }));
                            $('#vsPrefecture').multiselect('refresh');
                        });
                    })
                });
            };

            // 初始化对比地市等级和对比地市
            initVSPrefecture();

            // 对比省份变化了
            $('#vsProvince').on('change', function () {
                initVSPrefecture();
            });


            // 日期
            $('[name="startTime"]').datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                startDate: ""
            }).on('change', function (e) {
                var st = e.target.value || '';
                var et = $scope.endTime || '';
                if (et < st) {
                    $scope.endTime = st;
                }
            });

            $('[name="endTime"]').datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                startDate: ""
            }).on('change', function (e) {
                var et = e.target.value || '';
                var st = $scope.startTime || '';
                if (et < st) {
                    $scope.startTime = et;
                }
            });
            $('[name="monStaTime"]').datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm",
                autoclose: true,
                todayBtn: true,
                startView: 3,
                minView: 3,
                startDate: ""
            }).on('change', function (e) {
                var st = e.target.value || '';
                var et = $scope.monEndTime || '';
                if (et < st) {
                    $scope.monEndTime = st;
                }
            });
            $('[name="monEndTime"]').datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm",
                autoclose: true,
                todayBtn: true,
                startView: 3,
                minView: 3,
                startDate: ""
            }).on('change', function (e) {
                var et = e.target.value || '';
                var st = $scope.monStaTime || '';
                if (et < st) {
                    $scope.monStaTime = et;
                }
            });

            // 后端数据
            var weekArray = $model.$week.data || [];
            weekArray = weekArray.length ? weekArray : [{
                weekNo: '无数据'
            }];

            // 周
            $scope.weekArray = $model.$week.data || [];
            $scope.weekStaTime = weekArray[0].weekNo || "";
            $scope.weekEndTime = weekArray[0].weekNo || "";
            // 查询
            var provinceName = '';
            $scope.UserProv.forEach(function (element) {
                if (element.code == $scope.ProvByorgId.orgRegion) {
                    provinceName = element.name;
                }
            })
            $scope = angular.extend($scope, {
                type: 'day',
                retailerSearch: initSearch, // 点击按钮要调用的函数
                endTime: dayFilter.yesterday('date'),
                startTime: dayFilter.yesterday('date'),
                weekStaTime: weekArray[0].weekNo || "",
                weekEndTime: weekArray[0].weekNo || "",
                monStaTime: dateFormatFilter.year_month(+new Date) || "",
                monEndTime: dateFormatFilter.year_month(+new Date) || "",
                provinceName: provinceName || "",
                /* gong 零售户地域分布使用  */
                isFlag: "", // 提供给标题文字使用。
                normal: "",     // 城市名称
                normalNum: "", // 数量
                vs: "",       // 对比的城市名称
                vsNum: "",    // 对比的数量
                go:go //去零售户明细查询
            });
             function go() {
                $location.path('view/home/retailer/detail');
            };
            // 初始化查询
            var flag = true;
            function initSearch(n) {
                $scope.isFlag = $('#checkbox').prop('checked');
                var params = {
                    statType: $scope.type || ""
                };
                // 不知道该写啥
                var weekStaTime = $scope.weekStaTime || "";
                weekStaTime = weekStaTime.slice(weekStaTime.indexOf('(') + 1, weekStaTime.indexOf(')'));
                weekStaTime = weekStaTime.split('~') || [];
                weekStaTime = weekStaTime[0] || "";

                var weekEndTime = $scope.weekEndTime || "";
                weekEndTime = weekEndTime.slice(weekEndTime.indexOf('(') + 1, weekEndTime.indexOf(')'));
                weekEndTime = weekEndTime.split('~') || [];
                weekEndTime = weekEndTime[1] || "";
                weekEndTime = weekEndTime.replace(/\./g, '-') || "";

                // 前一天
                weekEndTime = weekEndTime && +new Date(weekEndTime) - 24 * 60 * 60 * 1000;

                params = params.statType == 'week' ?
                    angular.extend({
                        weekStaTime: weekStaTime.replace(/\./g, '-') || "",
                        weekEndTime: dateFormatFilter.date(weekEndTime)
                    }, params) : (params.statType == 'month' ?
                        angular.extend({
                            monStaTime: $scope.monStaTime || "",
                            monEndTime: $scope.monEndTime || ""
                        }, params) : angular.extend({
                            beginTime: $scope.startTime || "",
                            endTime: $scope.endTime || ""
                        }, params));

                // 初始化multiselect
                $(document).ready(function () {
                    $(".select").multiselect({
                        nonSelectedText: '请选择',
                        selectAllText: '全部',
                        nSelectedText: '已选择',
                        includeSelectAllOption: true,
                        allSelectedText: '全选',
                        enableFiltering: true,
                        maxHeight: '200px',
                        numberDisplayed: 1,
                        selectedList: 3,
                        selectAllValue: '',
                    })
                });

                /* 只有点按钮调用的才会传入参数 */
                if (flag) {
                    flag = false
                    var ids = []; // 设置默认选中的值
                    $scope.ShopDownBox.some(function (item, i) {
                        if (item.bizCode != -1) {
                            ids.push(item.bizCode);
                        }
                    });
                    $('[ng-model="selectSpeci"]').val(ids);
                };
                var selectValueStr = []; // 取出选中的值
                $("#selectSpeci option:selected").each(function () {
                    selectValueStr.push($(this).val());
                });
                // 初始化图表 */
                initLeftPie(angular.extend({ // 零售户业态分布（左侧玫瑰图）
                    proviceId:$('#proviceId').val() || $scope.ProvByorgId.orgRegion,
                    cityId: $('#prefecture').val() == '-1' ? "" : $('#prefecture').val() == null ? "" : $('#prefecture').val(), // 地市
                    cityClass: $('#levelOfCities').val() || '',  // 地市等级
                }, params));


                initRightPie(angular.extend({   // 零售户业态分布（右侧柱状图）
                    bizCode: selectValueStr.join(',') || '',  // 获取的业态
                    proviceId: $('#proviceId').val() || $scope.ProvByorgId.orgRegion,
                    isFlag: $('#checkbox').prop('checked') == false ? 'N' : 'Y',
                    cityId: $('#prefecture').val() == '-1' ? "" : $('#prefecture').val() == null ? "" : $('#prefecture').val(), // 地市
                    cityClass: $('#levelOfCities').val() || '',  // 地市等级
                    vsProviceId: $('#checkbox').prop('checked') == false ? '' : $('#vsProvince').val(), //对比省份
                    vscityClass: $('#checkbox').prop('checked') == false ? '' : $('#vsLevelOfCities').val(), //对比地市等级
                    vsCityId: $('#checkbox').prop('checked') == false ? '' : $('#vsPrefecture').val(), //对比地市
                }, params));

                // 发展地域分布
                if($('#checkbox').prop('checked') == false){
                    ZeroBizRegionalBarOrVSZeroBizRegionalBar(0,selectValueStr,params);
                }else{
                    ZeroBizRegionalBarOrVSZeroBizRegionalBar(1,selectValueStr,params);
                };

                // title值
                if($('#checkbox').prop('checked') == false){
                    getZeroBizTheCall(angular.extend({ // 零售户地域分布-无对比-title
                        bizCode: selectValueStr.join(',') || '',
                        proviceId: $('#proviceId').val() || $scope.ProvByorgId.orgRegion,
                        cityId: $('#prefecture').val() == '-1' ? "" : $('#prefecture').val() == null ? "" : $('#prefecture').val(), // 地市
                        cityClass: $('#levelOfCities').val() || '',  // 地市等级
                        isFlag: $('#checkbox').prop('checked') == false ? 'N' : 'Y',
                    }, params));
                }else{
                    getZeroBizTheCall(angular.extend({ // 零售户地域分布-无对比-title
                        bizCode: selectValueStr.join(',') || '',
                        proviceId: $('#proviceId').val() || $scope.ProvByorgId.orgRegion,
                        cityId: $('#prefecture').val() == '-1' ? "" : $('#prefecture').val() == null ? "" : $('#prefecture').val(), // 地市
                        cityClass: $('#levelOfCities').val() || '',  // 地市等级
                        isFlag: $('#checkbox').prop('checked') == false ? 'N' : 'Y',
                    }, params));
                    getVsZeroBizTheCall(angular.extend({ // 零售户地域分布-对比-title
                        bizCode: selectValueStr.join(',') || '',
                        vsProviceId: $('#checkbox').prop('checked') == false ? '' : $('#vsProvince').val(), //对比省份
                        vsCityId: $('#checkbox').prop('checked') == false ? '' : $('#vsPrefecture').val(), //对比地市
                        vscityClass: $('#checkbox').prop('checked') == false ? '' : $('#vsLevelOfCities').val(), //对比地市等级
                        isFlag: $('#checkbox').prop('checked') == false ? 'N' : 'Y',
                    }, params))
                };

                // 发展时间趋势
                if($('#checkbox').prop('checked') == false){
                    ZeroBizTimelineOrVSZeroBizTimeline(0,selectValueStr,params)
                }else{
                    ZeroBizTimelineOrVSZeroBizTimeline(1,selectValueStr,params)
                };

                ZeroShopkpiSelectTable(angular.extend({ // 零售户关键指标查询
                    bizCode: selectValueStr.join(',') || '',
                    isFlag: $('#checkbox').prop('checked') == false ? 'N' : 'Y',
                    proviceId:$('#proviceId').val() || $scope.ProvByorgId.orgRegion,
                    cityId: $('#prefecture').val() == '-1' ? "" : $('#prefecture').val() == null ? "" : $('#prefecture').val(), // 地市
                    cityClass: $('#levelOfCities').val() || '',  // 地市等级
                    vsProviceId: $('#checkbox').prop('checked') == false ? '' : $('#vsProvince').val(), //对比省份
                    vscityClass: $('#checkbox').prop('checked') == false ? '' : $('#vsLevelOfCities').val(), //对比地市等级
                    vsCityId: $('#checkbox').prop('checked') == false ? '' : $('#vsPrefecture').val(), //对比地市
                }, params));
            }

            // 左侧玫瑰图
            function initLeftPie(params) {
                $model.ZeroBizL(params).then(function (res) {
                    res.data = res.data || {};
                    caLEchart.setOption({
                        series: [{
                            data: _.map(res.data, function (d) {
                                return {
                                    name: d.bizName || "",
                                    value: d.arriveNum || 0
                                }
                            })
                        }]
                    });
                });
            };

            //  右侧柱状图
            function initRightPie(params) {
                $model.ZeroBizR(params).then(function (res) {
                    res.data = res.data || [];
                    if (params.isFlag == 'Y') { // 点击了对比的
                        caRMapConf.series.length < 2 ? caRMapConf.series.push({
                            "name": "",
                            "type": "bar",
                            "data": [],
                            "barWidth": "40%",
                            "barGap": "10%",
                        }):'';
                        caRMapConf.series[0].data.length = 0;
                        caRMapConf.series[1].data.length = 0;
                        res.data.forEach(function (item) {
                            if(caRMapConf.xAxis[0].data.length<res.data.length){
                                caRMapConf.xAxis[0].data.push(item.bizName)
                            }
                            caRMapConf.series[0].data.push(item.arriveNum)
                            caRMapConf.series[1].data.push(item.vsarriveNum)
                        })
                        caRMapConf.series[0].name = res.data[0] && res.data[0].cityName;
                        caRMapConf.series[1].name = $('#vsPrefecture').siblings('.btn-group').children('button').attr('title'); /* res.data[1] && res.data[1].vscityName; */
                        caREchart.setOption(caRMapConf, true);
                    } else { // 没有点击对比

                        caRMapConf.xAxis[0].data = [];
                        caRMapConf.series = [{
                            "name": "",
                            "type": "bar",
                            "data": [],
                            "barWidth": "40%",
                            "barGap": "10%"
                        }];
                        res.data.forEach(function (item) {
                            caRMapConf.xAxis[0].data.push(item.bizName)
                            caRMapConf.series[0].data.push(item.arriveNum)
                        })
                        caRMapConf.series[0].name = res.data[0] && res.data[0].cityName;
                        caREchart.setOption(caRMapConf, true)
                    }
                });
            };

            // 地域分布 （n：是否是对比状态，selectValueStr：业态的数据，params：时间的参数）
            function ZeroBizRegionalBarOrVSZeroBizRegionalBar(n,selectValueStr,params) {
                // 零售户地域分布-无对比
                var data = angular.extend({ // 零售户地域分布-无对比
                    bizCode: selectValueStr.join(',') || '',  // 获取的业态
                    proviceId:$('#proviceId').val() || $scope.ProvByorgId.orgRegion,
                    cityId: $('#prefecture').val() == '-1' ? "" : $('#prefecture').val() == null ? "" : $('#prefecture').val(), // 地市
                    cityClass: $('#levelOfCities').val() || '',  // 地市等级
                    isFlag: $('#checkbox').prop('checked') == false ? 'N' : 'Y',
                }, params);
                $model.ZeroBizRegionalBar(data).then(function (res) {
                    // ttMapConf = ttEchart.getOption();
                    res.data = res.data || {};
                    ttMapConf.series[1] && ttMapConf.series.splice(1, 1);
                    ttMapConf.xAxis[0].data = [];
                    ttMapConf.series[0].data = [];
                    res.data.forEach(function (item) {
                        ttMapConf.xAxis[0].data.push(item.cityName);
                        ttMapConf.series[0].data.push(item.arriveNum);
                    });
                    // ttMapConf.series[0].name = res.data[0] && res.data[0].cityName;
                    // ttEchart.setOption(ttMapConf, true);
                    ttEchart.setOption(ttMapConf,true);
                    if (n) {
                        // 零售户地域分布-对比
                        var data = angular.extend({ // 零售户地域分布-对比
                            bizCode: selectValueStr.join(',') || '',
                            vsProviceId: $('#checkbox').prop('checked') == false ? '' : $('#vsProvince').val(), //对比省份
                            vsCityId: $('#checkbox').prop('checked') == false ? '' : $('#vsPrefecture').val(), //对比地市
                            vscityClass: $('#checkbox').prop('checked') == false ? '' : $('#vsLevelOfCities').val(), //对比地市等级
                            isFlag: $('#checkbox').prop('checked') == false ? 'N' : 'Y',
                        }, params);
                        $model.VSZeroBizRegionalBar(data).then(function (res) {
                            res.data = res.data || {};
                            ttMapConf = ttEchart.getOption();
                            if (ttMapConf.series.length < 2) {
                                ttMapConf.series.push({
                                    "name": "",
                                    "type": "bar",
                                    "data": [],
                                    "barGap": 0,
                                    "barWidth": 70
                                });
                            };
                            ttMapConf.series[1].data = [];
                            res.data.forEach(function (item) {
                                ttMapConf.series[1].data.push(item.arriveNum)
                            });
                            // ttMapConf.series[0].name = res.data[0] && res.data[0].cityName; // 把上次的作比较的市传过来
                            ttMapConf.series[1].name = res.data[0] && res.data[0].cityName;
                            ttEchart.setOption(ttMapConf,true);
                        });
                    };
                });
            };

            // 零售户地域分布无对比的 title
            function getZeroBizTheCall(params) {
                $model.getZeroBizTheCall(params).then(function (res) {
                    if (res.status == 200) {
                        $scope.normal = res.data[0] && res.data[0].cityName;
                        $scope.normalNum = res.data[0] && res.data[0].arriveNum; // 数量
                        $scope.vs = $('#vsPrefecture').find("option:selected").attr('label');
                    }
                });
            };
            // 零售户地域分布对比的 title
            function getVsZeroBizTheCall(params) {
                $model.getVsZeroBizTheCall(params).then(function (res) {
                    if (res.status == 200) {
                        $scope.vs = res.data[0] && res.data[0].cityName;
                        $scope.vsNum = res.data[0] && res.data[0].arriveNum; // 数量
                    }
                });
            };

            // 发展时间趋势 （n：是否是对比状态，selectValueStr：业态的数据，params：时间的参数）
            function ZeroBizTimelineOrVSZeroBizTimeline(n,selectValueStr,params) {
                var data = angular.extend({ // 零售户发展时间趋势-无对比
                    bizCode: selectValueStr.join(',') || '',
                    proviceId:$('#proviceId').val() || $scope.ProvByorgId.orgRegion,
                    cityId: $('#prefecture').val() == '-1' ? "" : $('#prefecture').val() == null ? "" : $('#prefecture').val(), // 地市
                    cityClass: $('#levelOfCities').val() || '',  // 地市等级
                    vsProviceId: $('#checkbox').prop('checked') == false ? '' : $('#vsProvince').val(), //对比省份
                    vsCityId: $('#checkbox').prop('checked') == false ? '' : $('#vsPrefecture').val(), //对比地市
                    vscityClass: $('#checkbox').prop('checked') == false ? '' : $('#vsLevelOfCities').val(), //对比地市等级
                    isFlag: $('#checkbox').prop('checked') == false ? 'N' : 'Y',
                }, params);
                $model.ZeroBizTimeline(data).then(function (res) {
                    res.data = res.data || {};
                    timeTMapConf.series[1] && timeTMapConf.series.splice(1,1);
                    timeTMapConf.xAxis.data = [];
                    timeTMapConf.series[0].data = [];
                    res.data.forEach(function (item) {
                        timeTMapConf.xAxis.data.push(item.statTime);
                        timeTMapConf.series[0].data.push(item.arriveNum);
                    })
                    timeTMapConf.series[0].name = res.data[0] && res.data[0].cityName;
                    timeTEchart.setOption(timeTMapConf,true);
                    if(n){
                        var data = angular.extend({ // 零售户发展时间趋势-对比
                            bizCode: selectValueStr.join(',') || '',
                            proviceId:$('#proviceId').val() || $scope.ProvByorgId.orgRegion,
                            cityId: $('#prefecture').val() == '-1' ? "" : $('#prefecture').val() == null ? "" : $('#prefecture').val(), // 地市
                            cityClass: $('#levelOfCities').val() || '',  // 地市等级
                            vsProviceId: $('#checkbox').prop('checked') == false ? '' : $('#vsProvince').val(), //对比省份
                            vsCityId: $('#checkbox').prop('checked') == false ? '' : $('#vsPrefecture').val(), //对比地市
                            vscityClass: $('#checkbox').prop('checked') == false ? '' : $('#vsLevelOfCities').val(), //对比地市等级
                            isFlag: $('#checkbox').prop('checked') == false ? 'N' : 'Y',
                        }, params);
                        $model.VSZeroBizTimeline(data).then(function (res) {
                            res.data = res.data || {};
                            timeTMapConf = timeTEchart.getOption();
                            if(timeTMapConf.series.length < 2){
                                timeTMapConf.series.push({
                                    "name": "",
                                    "type": "line",
                                    "label": {
                                        "normal": {
                                            "show": false
                                        }
                                    },
                                    "data": [],
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FF8B22"
                                        }
                                    }
                                });
                            };
                            timeTMapConf.series[1].data = [];
                            res.data.forEach(function (item) {
                                timeTMapConf.series[1].data.push(item.arriveNum);
                            });
                            timeTMapConf.series[1].name = res.data[0] && res.data[0].cityName;
                            timeTEchart.setOption(timeTMapConf,true);
                        });
                    }
                });
            }

            // 零售户关键指标查询
            function ZeroShopkpiSelectTable(params) {
                $model.ZeroShopkpiSelectTable(params).then(function (res) {
                    res.data = res.data || {};
                    $scope.ZeroShopkpiSelectTable = res.data;
                    $scope.$apply();
                });
            };

            // 添加hover效果
            $("select").hover(function (e) {
                e.currentTarget.title = e.currentTarget.selectedOptions[0].innerText;
            });
        }]
    };
    return analysisCtrl;
});