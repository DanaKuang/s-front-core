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
            var $model = $scope.$model;
            // 百度地图json
            var chinaJson = $model.$chinaJson.data;
            echarts.registerMap('china', chinaJson);
            // 日分析折线图
            var dayEchart = echarts.init(document.getElementById("dayMap"));
            var dayMapConf = $model.$dayMapConf.data;
            dayEchart.setOption(dayMapConf);
            // 地域分析
            var mapEchart = echarts.init(document.getElementById("baiduMap"));
            var mapConf = $model.$mapConf.data;
            mapEchart.setOption(mapConf);
            // 城市折线图
            var cityEchart = echarts.init(document.getElementById("cityMap"));
            var cityMapConf = $model.$cityMapConf.data;
            cityEchart.setOption(cityMapConf);
            // 饼图
            var pieLeftEchart = echarts.init(document.getElementById("pie_left"));
            var pieLeftConf = $model.$pieLeftConf.data;
            pieLeftEchart.setOption(pieLeftConf);
            var pieRightEchart = echarts.init(document.getElementById("pie_right"));
            var pieRightConf = $model.$pieRightConf.data;
            pieRightEchart.setOption(pieRightConf);

            // 初始化搜索配置
            $scope.dayConf = {
                startTime: "2017-08-04" || dateFormatFilter.date(+new Date),
                endTime: "2017-08-04" || dateFormatFilter.date(+new Date),
                pbArray: $model.$brand.data || [{productBrand: ""}],
                productBrand: "芙蓉王" || $model.$brand.data[0].productBrand || "",
                pnArray: [],
                productName: "",
                acArray: $model.$activity.data || [{activityName: "无数据", activityId: ""}],
                activity: 'ACT-2E7J6228B48' || $model.$activity.data[0].activityId || "",
                daySearch: daySearch
            };

            // 搜索
            function daySearch () {
                var sScope = angular.element('.ui-form-select').scope();
                console.log(sScope);
                var params = {
                    productBrand: sScope.productBrand || "所有",
                    productSn: sScope.productName && sScope.productName.join(',') || "99999999",
                    activityId: sScope.activity || "",
                    cityName: $scope.cityName || "合计",
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
                }, params));

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
                // 初始化饼图
                initPieMap(angular.extend({
                    startTime: sScope.startTime || "",
                    endTime: sScope.endTime || ""
                }, params));
                // 页面流失统计
                initRateMap(angular.extend({
                    webId: "1001",
                    startTime: sScope.startTime || "",
                    endTime: sScope.endTime || ""
                }, params));
            }


            // 初始化select
            $(document).ready(function () {
                var sScope = angular.element('.ui-form-select').scope();
                var $select = $(".ui-form-select select");
                $select.multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全选',
                    nSelectedText: '已选择'
                });
                var $prBrand = $("[name='productBrand']");
                var $product = $("[name='productName']");
                // 品牌
                $prBrand.multiselect('select', sScope.productBrand);
                $prBrand.multiselect('refresh');
                // 规格
                $product.next().off().on('click', function (e) {
                    $model.getProduct({
                        productBrand: sScope.productBrand
                    }).then(function (res) {
                        sScope.pnArray = res.data || [];
                        sScope.$apply();
                        $product.multiselect('dataprovider', _.forEach(res.data, function(val) {
                            val.label = val.productName;
                            val.value = val.sn;
                        }));
                        $product.multiselect('select', sScope.productName);
                        $product.multiselect('refresh');
                    });
                });
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
                            $scope.setDef(0);
                        });
                    } else {
                        // 非对比数据
                        $scope.setDef(0);
                    }
                    $('[name="searchGroup"]')[0].checked = true;
                });
                // 点击事件
                $scope.setDef = function (n) {
                    !n ? initAverage($model.dayMapData) :
                    n == 1 ? initPv($model.dayMapData) :
                    initUv($model.dayMapData);
                };
                // 初始化平均
                function initAverage (data) {
                    option.series[0].name = '平均访问深度';
                    option.series[0].data = _.pluck(data.first, 'avgVistDepth');
                    option.series[1] = {};
                    if (!!data.second) {
                        option.series[1].name = '平均访问深度';
                        option.series[1].type = 'line';
                        option.series[1].data = _.pluck(data.second, 'avgVistDepth');
                    }
                    dayEchart.setOption(option);
                }
                // 初始化PV
                function initPv (data) {
                    option.series[0].name = '浏览量（PV）';
                    option.series[0].data = _.pluck(data.first, 'activePv');
                    option.series[1] = {};
                    if (!!data.second) {
                        option.series[1].name = '浏览量（PV）';
                        option.series[1].type = 'line';
                        option.series[1].data = _.pluck(data.second, 'activePv');
                    }
                    dayEchart.setOption(option);
                }
                // 初始化Uv
                function initUv (data) {
                    option.series[0].name = '访客数（UV）';
                    option.series[0].data = _.pluck(data.first, 'activeUv');
                    option.series[1] = {};
                    if (!!data.second) {
                        option.series[1].name = '访客数（UV）';
                        option.series[1].type = 'line';
                        option.series[1].data = _.pluck(data.second, 'activeUv');
                    }
                    dayEchart.setOption(option);
                }
            }

            // 初始化 地域分析
            function initBaiDuMap (params) {
                var option = mapEchart.getOption();
                $model.getMapData(params).then(function (res) {
                    option.series[1].data =  _.each(res.data, function (d) {
                        d.name = d.provinceName;
                        d.value = Number(d.activePv) + Number(d.activeUv);
                    }) || [];
                    mapEchart.setOption(option);
                });
                // 地图点击事件
                mapEchart.on('click', function (e) {
                    if (e.componentType === 'series') {
                        $model.getCityName({
                            provinceName: e.name + '省'
                        }).then(function (res) {
                            $scope.cityArr = [{cityName:"请选择"}].concat(res.data || []);
                            $scope.cityName = $scope.cityArr[0].cityName || "";
                            $scope.$apply();
                        });
                    }
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
                    option.series[0].name = 'PV';
                    option.series[0].data = _.pluck(data.first, 'activePv');
                    option.series[1] = {};
                    if (!!data.second) {
                        option.series[1].name = 'PV';
                        option.series[1].data = _.pluck(data.second, 'activePv');
                    }
                    cityEchart.setOption(option);
                }
                // 初始化Uv
                function initUv (data) {
                    option.series[0].name = 'UV';
                    option.series[0].data = _.pluck(data.first, 'activeUv');
                    option.series[1] = {};
                    if (!!data.second) {
                        option.series[1].name = 'UV';
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
                var rate = 687/770;
                var base = 500;
                $model.getPageData(params).then(function (res) {
                    $scope.pages = a_f.filterPage(res.data);
                    $scope.$apply();
                });
            }
        }]
    };

  return dayanalysis;
});