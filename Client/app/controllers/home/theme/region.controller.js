/**
 * Author: jinlinyong
 * Create Date: 2017-07-04
 * Description: theme
 */

define([], function () {
    var regionController = {
        ServiceType: 'controller',
        ServiceName: 'RegionCtrl',
        ViewModelName: 'regionViewModel',
        ServiceContent: ['$scope', 'setDateConf', function ($scope, setDateConf) {
            var $model = $scope.$model;
            setDateConf.init($(".region-search-r:nth-of-type(1)"), 'day');
            var stattime = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + (new Date().getDate() - 1);
            $(".date").find("input").val(stattime);
            //省份下拉列表
            (function () {
                $model.$getProvince().then(function (res) {
                    var res = res.data || [];
                    for (var i = 0; i < res.length; i++) {
                        $(".region").append("<option value=" + res[i].provinceName + ">" + res[i].provinceName + "</option>")
                    }
                })
            })();
            //周下拉列表
            (function () {
                $model.$getWeeks().then(function (res) {
                    var res = res.data || [];
                    for (var i = 0; i < res.length; i++) {
                        $(".week").append("<option value=" + res[i].weekNo + ">" + res[i].weekNo + "</option>")
                    }
                })
            })();
            $(".ui-search").change(function () {
                var Value = $(this).siblings(".region").val();
                $(".region-search-r").each(function (i) {
                    $(".region-search-r").eq(i).hide();
                });
                $(".ui-search option").each(function (i) {
                    $(".ui-search option").eq(i).attr("selected", false);
                })
                $(".region option").each(function (i) {
                    $(".region option").eq(i).attr("selected", false);
                    $(".region").find("option[value=" + Value + "]").attr("selected", "selected")
                })
                if ($(this).val() === "month") {
                    $("#month").attr("selected", "selected");
                    $(".region-search-r").eq(0).show();
                } else if ($(this).val() === "day") {
                    $("#day").attr("selected", "selected");
                    $(".region-search-r").eq(0).show();
                } else {
                    $("#week").attr("selected", "selected");
                    $(".region-search-r").eq(1).show();
                }
            });
            $scope.search = function ($event) {
                var that = $event.target;
                var reg = /(省|市|区)/;
                var params = {
                    "provinceName": $(that).siblings(".region").val().replace(reg, ""),
                    "statTime": $(that).siblings().hasClass("date") ?
                        ($(that).siblings(".date").data().date ? $(that).siblings(".date").data().date : $(that).siblings(".date").find("input").val())
                        : $(that).siblings(".week").val().substr(10, 10).replace(/\./g, "-"),
                    "statType": $(that).siblings(".ui-search").val()
                }
                console.log(params);
                public(params)
            };


            function public(params) {
                //仪表盘
                (function () {
                    var firstChart = echarts.init(document.getElementById("gauge-first"));
                    var secondChart = echarts.init(document.getElementById("gauge-second"));
                    var thirdChart = echarts.init(document.getElementById("gauge-third"));
                    var option = $model.$gaugechart.data;
                    var firChart = {
                        "tooltip": option.tooltip,
                        "series": _.cloneDeep(option.series)
                    };
                    var secChart = {
                        "tooltip": option.tooltip,
                        "series": _.cloneDeep(option.series)
                    };
                    var thrChart = {
                        "tooltip": option.tooltip,
                        "series": _.cloneDeep(option.series)
                    };

                    firChart.series[0].name = "扫码次数";
                    secChart.series[0].name = "扫码包数";
                    thrChart.series[0].name = "扫码人数";
                    firChart.series[0].data[0].name = "扫码次数\n\n时间段内总共产生的扫码次数，包含重复扫码的情况";
                    secChart.series[0].data[0].name = "扫码包数\n\n时间段内总共产生的扫码次数，包含重复扫码的情况";
                    thrChart.series[0].data[0].name = "扫码人数\n\n时间段内扫码用户去重后总人数";
                    // console.log(firChart);
                    // console.log(secChart);
                    $model.$getScanData(params).then(function (res) {
                        var data = res.data[0] || {};
                        firChart.series[0].data[0].value = data.scanPv;
                        firChart.series[0].max = data.scanAvgPv * 2;
                        secChart.series[0].data[0].value = data.scanUv;
                        secChart.series[0].max = data.scanAvgUv * 2;
                        thrChart.series[0].data[0].value = data.scanCode;
                        thrChart.series[0].max = data.scanAvgCode * 2;
                        firstChart.setOption(firChart, true);
                        secondChart.setOption(secChart, true);
                        thirdChart.setOption(thrChart, true);
                    })

                })();
                //扫码次数时刻趋势
                (function () {
                    var myChart = echarts.init(document.getElementById("hours-chart"));
                    var option = $model.$hourschart.data;
                    option.series[0].data = [];
                    option.xAxis.data = [];
                    $model.$hourTrend(params).then(function (res) {
                        var res = res.data || [];
                        for (var i = 0; i < res.length; i++) {
                            option.series[0].data.push(res[i].scanPv);
                            option.xAxis.data.push(res[i].statHour)
                        }
                        myChart.setOption(option, true)
                    })

                    //console.log(hoursChart.series[0].data);
                })();

                //扫码次数时间趋势
                (function () {
                    var myChart = echarts.init(document.getElementById("plan-chart"));
                    var option = $model.$planchart.data;
                    var seriesArr = [];
                    var obj = $model.$Default.data;
                    for (x in obj) {
                        obj[x].data = [];
                    }
                    option.xAxis.data = []
                    $model.$timeTrend(params).then(function (res) {
                        // console.log(res.data);
                        var res = res.data || [];
                        for (x in obj) {
                            for (var i = 0; i < res.length; i++) {
                                switch (x) {
                                    case "促销计划":
                                        obj[x].data.push(res[i].awardPutPv);
                                        break;
                                    case "抽奖次数":
                                        obj[x].data.push(res[i].drawPv);
                                        break;
                                    case "中奖数量":
                                        obj[x].data.push(res[i].drawResultPv);
                                        break;
                                    case "实发数量":
                                        obj[x].data.push(res[i].awardPayPv);
                                        break;
                                }
                            }
                        }
                        for (var i = 0; i < res.length; i++) {
                            option.xAxis.data.push(res[i].statTime)
                        }
                        seriesArr[0] = obj["促销计划"];
                        myChart.setOption(option, true);
                    })
                    option.series = seriesArr;
                    $(".plan input").click(function () {
                        seriesArr.length = 0;
                        $(".plan input").each(function () {
                            if ($(this).is(":checked")) {
                                seriesArr.push(obj[$(this)[0].name]);
                            }
                        })
                        myChart.clear();
                        myChart.setOption(option);
                    })
                })();

                //扫码包数时间趋势
                (function () {
                    var myChart = echarts.init(document.getElementById("bag-chart"));
                    var option = $model.$bagchart.data;
                    var obj = {
                        "包": {
                            "name": "包  ",
                            "type": "line",
                            "lineStyle": {
                                "normal": {
                                    "color": "#3fb6ed"
                                }
                            },
                            "label": {
                                "normal": {
                                    "show": true
                                }
                            },
                            "itemStyle": {
                                "normal": {
                                    "color": "#3fb6ed"
                                }
                            },
                            "data": []
                        },
                        "条": {
                            "name": "条",
                            "type": "line",
                            "lineStyle": {
                                "normal": {
                                    "color": "#53bc9d"
                                }
                            },
                            "label": {
                                "normal": {
                                    "show": true
                                }
                            },
                            "itemStyle": {
                                "normal": {
                                    "color": "#53bc9d"
                                }
                            },
                            "data": []
                        }
                    }
                    var seriesArr = [];
                    for (x in obj) {
                        obj[x].data = [];
                    }
                    option.xAxis.data = [];
                    $model.$bagTrend(params).then(function (res) {
                        var res = res.data || [];
                        for (x in obj) {
                            for (var i = 0; i < res.length; i++) {
                                switch (x) {
                                    case "包":
                                        obj[x].data.push(res[i].scanCode);
                                        break;
                                    default :
                                        obj[x].data.push(res[i].scanPair);
                                        break;
                                }
                            }
                        }
                        for (var i = 0; i < res.length; i++) {
                            option.xAxis.data.push(res[i].statTime)
                        }
                        seriesArr[0] = obj["包"];
                        option.series = seriesArr;
                        myChart.setOption(option, true);
                    })
                    $(".bag input").click(function () {
                        seriesArr.length = 0;
                        $(".bag input").each(function () {
                            //console.log($(this)[0].name);
                            if ($(this).is(":checked")) {
                                seriesArr.push(obj[$(this)[0].name]);
                            }
                        })
                        myChart.clear();
                        myChart.setOption(option);
                    })
                })();

                //各规格扫码次数
                (function () {
                    var myChart = echarts.init(document.getElementById("name-chart"));
                    // var data = [1200, 1994, 2000, 3304, 2090, 2330, 2220];
                    var option = $model.$namechart.data;
                    option.series[0].data = [];
                    option.xAxis[0].data = [];
                    $model.$scanTimes(params).then(function (res) {
                        var res = res.data || [];
                        for (var i = 0; i < res.length; i++) {
                            option.xAxis[0].data.push(res[i].productName)
                            option.series[0].data.push(res[i].scanPv)
                        }
                        // console.log(res.data);
                        // console.log(option);
                        myChart.setOption(option, true);
                    })
                    // option.series[0].data = data;
                })();

                //各地市扫码扫码次数
                (function () {
                    var myChart = echarts.init(document.getElementById("city-chart"));
                    var option = $model.$citychart.data;
                    option.xAxis[0].data = [];
                    option.series[0].data = [];
                    $model.$City(params).then(function (res) {
                        var res = res.data || [];
                        for (var i = 0; i < res.length; i++) {
                            option.xAxis[0].data.push(res[i].cityName);
                            option.series[0].data.push(res[i].scanPv);
                        }
                        myChart.setOption(option, true);
                    })
                })();
            }

            public();

        }]
    };

    return regionController;
});