/**
 * Author: liubin
 * Create Date: 2017-08-02
 * Description: realtime
 */

define([], function () {
  var realtime = {
    ServiceType: 'controller',
    ServiceName: 'realtimeCtrl',
    ViewModelName: 'realtimeViewModel',
    ServiceContent: ['$scope', 'dateFormatFilter', 'dayFilter', function ($scope, DF, dayFilter) {
        var echarts = require('echarts');
        var $model = $scope.$model;
        var chinaJson = $model.$chinaJson.data;
        echarts.registerMap('china', chinaJson)
        var axisEchart = echarts.init(document.getElementById("axisMap"));
        var mapEchart = echarts.init(document.getElementById("baiduMap"));
        var axisConf = $model.$axisConf.data;
        var mapConf = $model.$mapConf.data;
        // 存放定时
        window.IntervalArr = [];
        // 默认秒数
        var DEFAULT, INTERVAL = null, ACTIVEID;

        axisEchart.setOption(axisConf);
        mapConf.tooltip.formatter = function (params) {
            return params.name+'<br>'+'PV:'+(params.data.pv||0)+' | UV:'+(params.data.uv||0);
        }
        mapEchart.setOption(mapConf);

        // 活动下拉
        $scope.activity = $model.$activity.data || [{activityName: '无数据',activityId: ''}];
        $scope.activityId = $scope.activity[0].activityId;

        // 倒计时
        function initInterval() {
            DEFAULT = 30;
            clearInterval(INTERVAL);
            INTERVAL = null;
            if (!ACTIVEID) return;
            INTERVAL = setInterval(function () {
                if (--DEFAULT <= 0) {
                    $scope.realSearch(ACTIVEID);
                    initInterval();
                }
                $("#turnto").html(DEFAULT);
            }, 1000);
        }
        // 查询入口
        $scope.realSearch = function () {
            ACTIVEID = $scope.activityId || "";
            if (!!ACTIVEID) {
                initInterval();
                setRealTime(ACTIVEID);
                setAxisMap(ACTIVEID);
                setBaiduMap(ACTIVEID);
                setTableData(ACTIVEID);
                setDetail(ACTIVEID);
            }
        };
        $scope.realSearch();
        initInterval();

        // 当前访问人数
        function setRealTime (actId) {
            $model.getActPv({
                activityId: actId
            }).then(function (res) {
                $("#turnto").html(DEFAULT = 30);
                $scope.daytime = DF.datetime(+new Date);
                $scope.dayPv = res.data && res.data.pv_of_activity || 0;
                $scope.dayUv = res.data && res.data.uv_of_activity || 0;
                $scope.$apply();
            });
        }

        // 设置折线图
        function setAxisMap (actId) {
            $model.getMinPv({
                activityId: actId
            }).then(function (res) {
                axisEchart.setOption({
                    xAxis: [{
                        data: _.pluck(res.data, 'time').reverse()
                    }],
                    series: [{
                        data: _.pluck(res.data, 'pv')
                    }, {
                        data: _.pluck(res.data, 'uv')
                    }]
                });
            });
        }

        // 设置地图
        function setBaiduMap (actId) {
            $model.getProPv({
                activityId: actId
            }).then(function (res) {
                var opts = mapEchart.getOption();
                opts.series[1].data = _.each(res.data, function (d) {
                    d.name = d.province;
                    d.value = Number(d.pv) + Number(d.uv);
                }) || [];
                mapEchart.setOption(opts);
            });
        }

        // 设置表格数据默认值
        function setTableData (actId) {
            $model.getCityPv({
                activityId: actId,
                provName: "湖南"
            }).then(function (res) {
                $scope.rows = res.data || [];
                $scope.$apply();
            });
        }

        // 设置表格数据
        mapEchart.on('click', function (e) {
            if (e.componentType === 'series') {
                $model.getCityPv({
                    activityId: ACTIVEID,
                    provName: e.name || ""
                }).then(function (res) {
                    $scope.rows = res.data || [];
                    $scope.$apply();
                });
            }
        });

        // 设置表格详情
        function setDetail (actId) {
            $model.getDetail({
                activityId: actId
            }).then(function (res) {
                $scope.detail = res.data || [];
                $scope.$apply();
            });
        }

        window.IntervalArr.push(INTERVAL);
    }]
  };

  return realtime;
});