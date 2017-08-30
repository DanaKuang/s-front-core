/**
 * Author: liubin
 * Create Date: 2017-08-02
 * Description: dayanalysis
 */

define([], function () {
    var dayanalysis = {
        ServiceType: 'controller',
        ServiceName: 'dayanalysisCtrl',
        ViewModelName: 'dayanalysisViewModel',
        ServiceContent: ['$scope', 'dateFormatFilter', 'analysisFilter', function ($scope, dateFormatFilter, a_f) {
            var echarts = require('echarts');
            var $model = $scope.$model;
            // 百度地图json
            var chinaJson = $model.$chinaJson.data;
            echarts.registerMap('china', chinaJson);
            // 日分析折线图
            var dayEchart = echarts.init(document.getElementById("dayMap"));
            var dayMapConf = $model.$dayMapConf.data;
            dayMapConf.tooltip.formatter = function (params) {
                return params.seriesName + params.value;
            }
            dayEchart.setOption(dayMapConf);
            // 地域分析
            var mapEchart = echarts.init(document.getElementById("baiduMap"));
            var mapConf = $model.$mapConf.data;
            mapConf.tooltip.formatter = function (params) {
                var data = params.data || {};
                return "日均访问量："+data.activePv+"</br>"+"日均用户数："+data.activeUv;
            }
            mapEchart.setOption(mapConf);
            // 城市折线图
            var cityEchart = echarts.init(document.getElementById("cityMap"));
            var cityMapConf = $model.$cityMapConf.data;
            cityMapConf.tooltip.formatter = function (params) {
                return params.seriesName + params.value;
            }
            cityEchart.setOption(cityMapConf);
            // 饼图
            var pieLeftEchart = echarts.init(document.getElementById("pie_left"));
            var pieLeftConf = $model.$pieLeftConf.data;
            pieLeftEchart.setOption(pieLeftConf);
            var pieRightEchart = echarts.init(document.getElementById("pie_right"));
            var pieRightConf = $model.$pieRightConf.data;
            pieRightEchart.setOption(pieRightConf);

            // 后端数据
            // var brand_back_data = $model.$brand.data || [];
            // brand_back_data = brand_back_data.length ? brand_back_data : [{productBrand: ""}];
            // brand_back_data = [{productBrand:"所有"}].concat(brand_back_data);
            var act_back_data = $model.$activity.data || [];
            act_back_data = act_back_data.length ? act_back_data : [{activityName: "无数据", activityId: ""}];

            // 初始化搜索配置
            $scope.dayConf = {
                startTime: dateFormatFilter.date(+new Date),
                endTime: dateFormatFilter.date(+new Date),
                // pbArray: brand_back_data,
                // productBrand: "芙蓉王" || brand_back_data[0].productBrand || "",
                // pnArray: [],
                // productName: "",
                acArray: act_back_data,
                activity: act_back_data[0].activityId || "",
                daySearch: daySearch
            };

            // 搜索
            function daySearch () {
                var sScope = angular.element('.ui-daily-search').scope();
                console.log(sScope);
                var params = {
                    // productBrand: sScope.productBrand || "所有",
                    // productSn: sScope.productName && sScope.productName.join(',') || "99999999",
                    activityId: sScope.activity || "",
                    timeType: sScope.startTime == sScope.endTime ? "hour" : "day"
                };
                // 初始化折线图
                initDayMap(angular.extend({
                    startTime: sScope.startTime || "",
                    endTime: sScope.endTime || ""
                }, params), angular.extend({
                    startTime: sScope.b_startTime || "",
                    endTime: sScope.b_endTime || ""
                }, params));
                // 初始化百度地图
                initBaiDuMap(angular.extend({
                    startTime: sScope.startTime || "",
                    endTime: sScope.endTime || ""
                }, params, {
                    timeType: "day"
                }));

                // 初始化城市
                $scope.setCityMap = function (cityName) {
                    cityName && initCityMap(angular.extend({
                        cityName: cityName || "",
                        startTime: sScope.startTime || "",
                        endTime: sScope.endTime || ""
                    }, params), angular.extend({
                        cityName: cityName || "",
                        startTime: sScope.b_startTime || "",
                        endTime: sScope.b_endTime || ""
                    }, params));
                };
                // 默认值
                clickOfMap("湖南");
                $scope.setCityMap($scope.cityName||"长沙");
                // 初始化饼图
                initPieMap(angular.extend({
                    startTime: sScope.startTime || "",
                    endTime: sScope.endTime || ""
                }, params, {
                    timeType: "day"
                }));
                // 页面流失统计
                initRateMap(angular.extend({
                    webId: "1001",
                    startTime: sScope.startTime || "",
                    endTime: sScope.endTime || ""
                }, params, {
                    timeType: "day"
                }));
            }


            // 初始化select
            $(document).ready(function () {
                var sScope = angular.element('.ui-daily-search').scope();
                var $select = $(".ui-daily-search select");
                $select.multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择'
                });
                // var $prBrand = $("[name='productBrand']");
                // var $product = $("[name='productName']");
                var $activity = $("[name='activity']");
                // 品牌
                // $prBrand.multiselect('select', sScope.productBrand);
                // $prBrand.multiselect('refresh');
                // 规格
                // $product.next().off().on('click', function (e) {
                //     $model.getProduct({
                //         productBrand: sScope.productBrand
                //     }).then(function (res) {
                //         sScope.pnArray = res.data || [];
                //         sScope.$apply();
                //         $product.multiselect('dataprovider', _.forEach(res.data, function(val) {
                //             val.label = val.productName;
                //             val.value = val.sn;
                //         }));
                //         $product.multiselect('select', sScope.productName);
                //         $product.multiselect('refresh');
                //     });
                // });
                // 活动
                $activity.multiselect('select', sScope.activity);
                $activity.multiselect('refresh');
                // 默认值
                daySearch();
            });

            // 初始化 日分析折线图
            function initDayMap (params_f, params_s) {
                var option = dayEchart.getOption();
                $model.dayMapData = {first: "", second: ""};
                $model.getDayMap(params_f).then(function (first) {
                    // 格式化日期
                    if (params_f.startTime == params_f.endTime) {
                        option.xAxis[0].data = a_f.filterHour(_.pluck(first.data, 'dt'));
                    } else {
                        option.xAxis[0].data = a_f.filterDay(_.pluck(first.data, 'dt'));
                    }
                    $model.dayMapData.first = first.data || [];
                    // 对比数据
                    if (!!params_s.startTime) {
                        $model.getDayMap(params_s).then(function (second) {
                            $model.dayMapData.second = second.data || [];
                            $scope.setDef(1);
                        });
                    } else {
                        // 非对比数据
                        $scope.setDef(1);
                    }
                    $('[name="searchGroup"]')[1].checked = true;
                });
                // 点击事件
                $scope.setDef = function (n) {
                    !n ? initAverage($model.dayMapData) :
                    n == 1 ? initPv($model.dayMapData) :
                    initUv($model.dayMapData);
                };
                // 初始化平均
                function initAverage (data) {
                    option.series[0].name = params_f.startTime+'～'+params_f.endTime+'<br/>平均访问深度：';
                    option.series[0].data = _.pluck(data.first, 'avgVistDepth').map(function(v){return v.toFixed(2)});
                    option.series[1] = {};
                    option.series[1].name = params_s.startTime+'～'+params_s.endTime+'<br/>平均访问深度：';
                    option.series[1].type = 'line';
                    option.series[1].data = [];
                    if (!!data.second) {
                        option.series[1].data = _.pluck(data.second, 'avgVistDepth').map(function(v){return v.toFixed(2)});
                    }
                    dayEchart.setOption(option);
                }
                // 初始化PV
                function initPv (data) {
                    option.series[0].name = params_f.startTime+'～'+params_f.endTime+'<br/>浏览量（PV）：';
                    option.series[0].data = _.pluck(data.first, 'activePv');
                    option.series[1] = {};
                    option.series[1].name = params_s.startTime+'～'+params_s.endTime+'<br/>浏览量（PV）：';
                    option.series[1].type = 'line';
                    option.series[1].data = [];
                    if (!!data.second) {
                        option.series[1].data = _.pluck(data.second, 'activePv');
                    }
                    dayEchart.setOption(option);
                }
                // 初始化Uv
                function initUv (data) {
                    option.tooltip.formatter = "{a} <br/>访客量（UV）：{c}";
                    option.series[0].name = params_f.startTime+'～'+params_f.endTime+'<br/>访客量（UV）：';
                    option.series[0].data = _.pluck(data.first, 'activeUv');
                    option.series[1] = {};
                    option.series[1].name = params_s.startTime+'～'+params_s.endTime+'<br/>访客量（UV）：';
                    option.series[1].type = 'line';
                    option.series[1].data = [];
                    if (!!data.second) {
                        option.series[1].data = _.pluck(data.second, 'activeUv');
                    }
                    dayEchart.setOption(option);
                }
            }

            // 初始化 地域分析
            function initBaiDuMap (params) {
                var option = mapEchart.getOption();
                $model.getMapData(params).then(function (res) {
                    var data = res.data || [];
                    data = data.length ? data : $model.$defMap.data.def;
                    option.series[1].data =  _.each(data, function (d) {
                        d.name = d.provinceName;
                        d.value = d.activePv;
                    }) || [];
                    option.visualMap[0].max = _.max(option.series[1].data, function (v) {return v.value}).value || 5000;
                    mapEchart.setOption(option);
                });
            }
            // 地图点击事件
            mapEchart.on('click', function (e) {
                if (e.componentType === 'series') {
                    clickOfMap(e.name);
                }
            });

            // 地图点击事件
            function clickOfMap (name) {
                $model.getCityName({
                    provinceName: name + '省'
                }).then(function (res) {
                    var backArray = res.data || [];
                    $scope.cityArr = backArray.length ? backArray : [{cityName:''}];
                    $scope.cityName = name == "湖南" ? "长沙" : backArray[0].cityName;
                    $scope.$apply();
                });
            }

            // 初始化 城市折线图
            function initCityMap (params_f, params_s) {
                var option = cityEchart.getOption();
                $model.cityMapData = {first: "", second: ""};
                $model.getCityMap(params_f).then(function (first) {
                    // 格式化日期
                    if (params_f.startTime == params_f.endTime) {
                        option.xAxis[0].data = a_f.filterHour(_.pluck(first.data, 'dt'));
                    } else {
                        option.xAxis[0].data = a_f.filterDay(_.pluck(first.data, 'dt'));
                    }
                    $model.cityMapData.first = first.data || [];
                    // 对比数据
                    if (!!params_s.startTime) {
                        $model.getCityMap(params_s).then(function (second) {
                            $model.cityMapData.second = second.data || [];
                            $scope.setPvUv(0);
                        });
                    } else {
                        // 非对比数据
                        $scope.setPvUv(0);
                    }
                    $('[name="pvUvGroup"]')[0].checked = true;
                });
                // 点击事件
                $scope.setPvUv = function (n) {
                    !n ? initPv($model.cityMapData) :
                    initUv($model.cityMapData);
                };
                // 初始化PV
                function initPv (data) {
                    option.series[0].name = params_f.startTime+'～'+params_f.endTime+'<br/>浏览量（PV）：';
                    option.series[0].data = _.pluck(data.first, 'activePv');
                    option.series[1] = {};
                    option.series[1].name = params_s.startTime+'～'+params_s.endTime;
                    option.series[1].data = [];
                    if (!!data.second) {
                        option.series[1].data = _.pluck(data.second, 'activePv')+'<br/>浏览量（PV）：';
                    }
                    cityEchart.setOption(option);
                }
                // 初始化Uv
                function initUv (data) {
                    option.series[0].name = params_f.startTime+'～'+params_f.endTime+'<br/>访客量（UV）：';
                    option.series[0].data = _.pluck(data.first, 'activeUv');
                    option.series[1] = {};
                    option.series[1].name = params_s.startTime+'～'+params_s.endTime+'<br/>访客量（UV）：';
                    option.series[1].data = [];
                    if (!!data.second) {
                        option.series[1].data = _.pluck(data.second, 'activeUv');
                    }
                    cityEchart.setOption(option);
                }
            }

            // 初始化饼图
            function initPieMap (params) {
                $model.getPieData(params).then(function (res) {
                    pieLeftEchart.setOption({
                        series: [{
                            data: a_f.filterLeftPie(res.data)
                        }]
                    });
                    pieRightEchart.setOption({
                        series: [{
                            data: a_f.filterRightPie(res.data)
                        }]
                    });
                });
            }

            // 初始化转化率
            function initRateMap (params) {
                $model.getPageData(params).then(function (res) {
                    $scope.pages = a_f.filterPage(res.data);
                    $scope.$apply();
                });
            }
        }]
    };

  return dayanalysis;
});