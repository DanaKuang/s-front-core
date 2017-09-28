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

        var act_back_data = $model.$activity.data || [];
        act_back_data = act_back_data.length ? act_back_data : [{activityName: '无数据',activityId: ''}];
        // 活动下拉
        $scope.activity = act_back_data;
        $scope.activityId = act_back_data[0].activityId;

        // 单选
        $(document).ready(function () {
            var $product = $('[name="activityId"]');
            $product.multiselect({
                nonSelectedText: '请选择',
                allSelectedText: '全部',
                nSelectedText: '已选择'
            });
            $product.multiselect('select', $scope.activityId);
            $product.multiselect('refresh');
        });

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
            // 可能存放多个，没关系
            window.IntervalArr.push(INTERVAL);
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
                        data: _.pluck(res.data, 'pv').reverse()
                    }, {
                        data: _.pluck(res.data, 'uv').reverse()
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
                var data = res.data || [];
                data = data.length ? data : $model.$defMap.data.def;
                opts.series[1].data = _.each(data, function (d) {
                    d.name = d.province;
                    d.value = d.pv;
                }) || [];
                opts.visualMap[0].max = _.max(opts.series[1].data, function (v) {return v.value}).value || 5000;
                mapEchart.setOption(opts);
            });
        }

        // 设置表格数据默认值
        function setTableData (actId) {
            $model.getCityPv({
                activityId: actId,
                provName: sessionStorage.getItem("account")==="henan"?"河南":"湖南"
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
    }]
  };

  return realtime;
});