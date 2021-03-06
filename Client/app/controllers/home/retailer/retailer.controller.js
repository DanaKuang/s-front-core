/**
 * Author: liubin
 * Create Date: 2017-08-02
 * Description: retailer
 */

define([], function () {
    var retailerCtrl = {
        ServiceType: 'controller',
        ServiceName: 'retailerCtrl',
        ViewModelName: 'retailerViewModel',
        ServiceContent: ['$scope', 'dateFormatFilter', 'dayFilter', function ($scope, dateFormatFilter, dayFilter) {
            var echarts = require('echarts');
            var $model = $scope.$model;

            // 增长折线图
            var growEchart = echarts.init(document.getElementById('growMap'));
            var growMapConf = $model.$growMapConf.data;
            growEchart.setOption(growMapConf);
            // 业态分布折线图
            var distEchart = echarts.init(document.getElementById('distMap'));
            var distMapConf = $model.$distMapConf.data;
            distEchart.setOption(distMapConf);
            // 业态分布零售户增长折线图
            var dgEchart = echarts.init(document.getElementById('distGrowMap'));
            var dgMapConf = $model.$dgMapConf.data;
            dgEchart.setOption(dgMapConf);
            // 左侧饼图
            var lpEchart = echarts.init(document.getElementById('leftPieMap'));
            var lpMapConf = $model.$lpMapConf.data;
            lpEchart.setOption(lpMapConf);
            // 右侧饼图
            var rpEchart = echarts.init(document.getElementById('rightPieMap'));
            var rpMapConf = $model.$rpMapConf.data;
            rpEchart.setOption(rpMapConf);

            // 日期
            $('[name="startTime"]').datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                endDate: dayFilter.yesterday('date')
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
                endDate: dayFilter.yesterday('date')
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
            var drop_back_data = $model.$dropShop.data || [];
            drop_back_data = drop_back_data.length ? drop_back_data : [{bizCode:""}];
            var weekArray = $model.$week.data || [];
            weekArray = weekArray.length ? weekArray : [{weekNo:'无数据'}];
            // 周
            $scope.weekArray = $model.$week.data || [];
            $scope.weekStaTime = weekArray[0].weekNo || "";
            $scope.weekEndTime = weekArray[0].weekNo || "";
            // 查询
            $scope = angular.extend($scope, {
                type: 'day',
                retailerSearch: initSearch,
                cityArr: drop_back_data,
                cityName: drop_back_data[0].bizCode,
                endTime: dayFilter.yesterday('date'),
                startTime: dayFilter.yesterday('date'),
                weekStaTime: weekArray[0].weekNo || "",
                weekEndTime: weekArray[0].weekNo || "",
                monStaTime: dateFormatFilter.year_month(+new Date) || "",
                monEndTime: dateFormatFilter.year_month(+new Date) || ""
            });

            // 初始化
            initSearch();

            // 初始化查询
            function initSearch () {
                var params = {
                    statType: $scope.type || ""
                };
                // 不知道该写啥
                var weekStaTime = $scope.weekStaTime || "";
                weekStaTime = weekStaTime.slice(weekStaTime.indexOf('(')+1, weekStaTime.indexOf(')'));
                weekStaTime = weekStaTime.split('~') || [];
                weekStaTime = weekStaTime[0] || "";

                var weekEndTime = $scope.weekEndTime || "";
                weekEndTime = weekEndTime.slice(weekEndTime.indexOf('(')+1, weekEndTime.indexOf(')'));
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
                // 初始化图表
                initContent(params);
                initGrow(params);
                initDist(params);
                initdgMap(angular.extend({
                    bizType: $scope.cityName || ""
                }, params));
                initLeftPie(params);
                initRightPie(params);

                // 监听城市变化
                $scope.setCityMap = function (cityName) {
                    cityName && initdgMap(angular.extend({
                        bizType: cityName
                    }, params));
                }
            }

            // 初始化contentBox
            function initContent (params) {
                // 累计零售户
                $model.getTotal(params).then(function (res) {
                    res.data = res.data || [];
                    $scope.addUser = res.data[0] && res.data[0].arriveNum || 0;
                    $scope.$apply();
                });
                // 参与活动零售户
                $model.getActivity(params).then(function (res) {
                    res.data = res.data || [];
                    $scope.joinUser = res.data[0] && res.data[0].dayPart || 0;
                    $scope.$apply();
                });
                // 新增零售户
                $model.getNew(params).then(function (res) {
                    res.data = res.data || [];
                    $scope.newUser = res.data[0] && res.data[0].dayJoin || 0;
                    $scope.$apply();
                });
            }

            // 初始化增长
            function initGrow (params) {
                $model.getGrowth(params).then(function (res) {
                    res.data = res.data || [];
                    growEchart.setOption({
                        xAxis: [{
                            data: params.weekStaTime ? _.map(_.pluck(res.data, 'weekNo'), function (d) {
                                return d.replace(new Date().getFullYear(), new Date().getFullYear()+'第')+'周';
                            }) : _.pluck(res.data, 'statTime')
                        }],
                        series: [{
                            data: _.pluck(res.data, 'arriveNum')
                        }, {
                            data: _.pluck(res.data, 'dayJoin')
                        }]
                    });
                });
            }

            // 初始化业态分布
            function initDist (params) {
                $model.getPie(params).then(function (res) {
                    res.data = res.data || [];
                    distEchart.setOption({
                        legend: {
                            data: _.pluck(res.data, 'bizName')
                        },
                        series: [{
                            data: _.map(res.data, function (d) {
                                return {
                                    name: d.bizName || "",
                                    value: d.arriveNum || 0
                                };
                            })
                        }]
                    });
                });
            }

            // 初始化零售户增长
            function initdgMap (params) {
                $model.getShop(params).then(function (res) {
                    res.data = res.data || {};
                    dgEchart.setOption({
                        xAxis: [{
                            data: params.weekStaTime ? _.map(_.pluck(res.data, 'weekNo'), function (d) {
                                return d.replace(new Date().getFullYear(), new Date().getFullYear()+'第')+'周';
                            }) : _.pluck(res.data, 'statTime')
                        }],
                        series: [{
                            data: _.pluck(res.data, 'arriveNum')
                        }, {
                            data: _.pluck(res.data, 'dayJoin')
                        }]
                    });
                });
            }

            // 初始化左侧饼图
            function initLeftPie (params) {
                $model.getShopPro(params).then(function (res) {
                    res.data = res.data || {};
                    lpEchart.setOption({
                        series: [{
                            data: _.map(res.data, function (d) {
                                return {
                                    name: d.saleZone || "",
                                    value: d.arriveNum || 0
                                }
                            })
                        }]
                    });
                });
            }

            // 初始化右侧饼图
            function initRightPie (params) {
                $model.getShopCity(params).then(function (res) {
                    res.data = res.data || {};
                    rpEchart.setOption({
                        series: [{
                            data: _.map(res.data, function (d) {
                                return {
                                    name: d.cityClass || "",
                                    value: d.arriveNum || 0
                                }
                            })
                        }]
                    });
                });
            }

            // 搜索
            $(document).ready(function () {
                var $multi = $(".ui-retailer-search select");
                $multi.multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择'
                });
            });

        }]
    };

  return retailerCtrl;
});