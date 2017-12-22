/**
 * Author: liubin
 * Create Date: 2017-06-27
 * Description: index
 */

define([], function () {
  var KPIHenanCtrl = {
    ServiceType: "controller",
    ServiceName: "KPIHenanCtrl",
    ViewModelName: 'kpiHenanViewModel',
    ServiceContent: ['$scope', 'dateFormatFilter', 'formatFilter', function ($scope, dateFormatFilter, formatFilter) {
      var $model = $scope.$model;
      var echarts = require('echarts');
      var Interval_1,                     // 右侧栏实时对象
          Interval_2,                     // 滚动定时对象
          Interval_3,                     // map定时对象
          // Interval_4,                     // 表格刷新实时对象
          Interval_common = 3000,         // 循环滚动间隔
          Interval_scroll_I = 9000,       // 滚工区接口刷新
          Interval_table_I = 60*60*1000;  // 表格一小时刷新

      $('.ui-map-box').css({
          height: '' + $(document).height()-300 + 'px'
      });
      // 首页较特殊 页面切换清楚所有的定时器
      window.IntervalArr = [];

      // 历史数据
      var historyScanData = $model.$historyScan.data || [];
      // 计算环比
      function fixData (o, v) {
        var result = 0;
        o = o || 0; v = v || 0;
        o = Number(o); v = Number(v);
        result = o + v;
        if (result > 10000) {
            result = ''+Math.round(result/10000)+'万';
        }
        return result;
      }
      // tooltip
      // 先这么写吧，应该在指令里控制
      setTimeout(function () {
          $('[data-toggle="tooltip"]').tooltip();
      }, 500);

      (function () {
        function getRightData () {
          // 获取扫码次数
          $model.getScanTime().then(function (res) {
            var res = res.data || {};
            var st = res.scanTimes_of_day || 0;
            var hst = historyScanData[0] || {};
            var rt = fixData(hst.scanTotalPv, 0);
            $("#scan_day").html(st);
            $("#scan_day_rate").html(rt);
          });
          // 当日扫码人数
          $model.getScanUser().then(function (res) {
            var res = res.data || {};
            var su = res.scanUsers_of_day || 0;
            var hsu = historyScanData[0] || {};
            var rt = fixData(hsu.scanTotalUv, 0);
            $("#scan_user").html(su);
            $("#scan_user_rate").html(rt);
          });
          // 当日扫码烟包数
          $model.getScanCode().then(function (res) {
            var res = res.data || {};
            var sc = res.scanCodes_of_day || 0;
            var hsc = historyScanData[0] || {};
            var rt = fixData(hsc.scanTotalCode, 0);
            $("#scan_code").html(sc);
            $("#scan_code_rate").html(rt);
          });
          // top10
          $model.getTopTen().then(function (res) {
            var res = res.data || [];
            res = res instanceof Array ? res : [];
            $("#scan_top").html(_.compact(res).join('、'));
          });
        }
        // 右侧数据
        getRightData();
        Interval_1 = setInterval(getRightData, Interval_common);
        // 记录1
        window.IntervalArr.push(Interval_1);
      })();

      (function () {
        function getScrollData () {
          $model.getScrollData().then(function (res) {
            var data = res.data || [];
            clearInterval(wrapper);
            animateli && $wrap.html(_.map(data, function (d) {
                return '<li>'+d+'</li>';
            }).join(''));
            wrapper = setInterval(function() {
              if ($wrap.children().length <= 1) {
                clearInterval(wrapper);
                wrapper = null;
                return;
              }
              // 不可放置于函数起始处,li:first取值是变化的
              var $li = $wrap.find('li:first');
              var _h = $li.height();
              animateli = false;
              $li.css('visibility','hidden')
                 .animate({ marginTop: -_h + 'px' }, 400, function() {
                    animateli = true;
                    // 隐藏后,将该行的margin值置零,并插入到最后,实现无缝滚动
                    $li.css({'marginTop': 0, 'visibility': 'visible'}).appendTo($wrap);
              });
            }, Interval_common);
          });
        }
        getScrollData();
        // 滚动区域数据
        var $wrap = $("#scroll_data");
        var wrapper = null;
        var newData = "";
        var animateli = true;
        Interval_2 = setInterval(getScrollData, Interval_scroll_I);
        // 记录2
        window.IntervalArr.push(Interval_2);
      })();

      // 百度地图
      (function () {
        var chinaJson = $model.$chinaJson.data;
        echarts.registerMap('china', chinaJson)
        var myChart = echarts.init(document.getElementById('baiduMap'));
        window.onresize = myChart.resize

        var option = $model.$echartConf.data;
        var data = $model.$mapData.data || [];
        var convertData = function (data) {
          var res = [];
          data.forEach(function (d) {
            res.push({
              name: d.city,
              value: [d.longitude,d.latitude,d.scantimes]
            });
          });
          return res;
          // return data.filter(function (d) {
          //   return ([
          //     '西安市',
          //     '洛阳市',
          //     '平顶山市',
          //     '烟台市'
          //   ].indexOf(d.city) !== -1) || (Number(d.scantimes) > 10);
          // }).map(function (d) {
          //   return {
          //     name: d.city,
          //     value: [d.longitude,d.latitude,d.scantimes]
          //   }
          // });
        };

        var top0_30 = convertData(data.filter(function (a) {
            return a.type === '1';
        }));
        var top30_60 = convertData(data.filter(function (a) {
            return a.type === '2';
        }));
        var top60_90 = convertData(data.filter(function (a) {
            return a.type === '3';
        }));
        var top90_ = convertData(data);

        // var symbolSize = function (val) {
        //     return 15;
        // };

        // 自定义tooltip
        option.tooltip.formatter = function (params) {
            return params.name + '扫码量: ' + params.value[2] + '次';
        }
        // 所有点
        option.series[0].data = top90_;
        // option.series[0].symbolSize = symbolSize

        // top 60-90点
        option.series[1].data = top60_90;

        // top 30-60点
        option.series[2].data = top30_60;

        // top 30点
        option.series[3].data = top0_30;
        // option.series[1].symbolSize = symbolSize
        myChart.setOption(option);

        function getMapData () {
          // 这一块特别耗性能
          $model.getMapData().then(function (res) {
            var data = res.data || [];
            myChart.setOption({
              series: [{
                data: convertData(data)
              }, {
                data: convertData(data.filter(function (a) {
                  return a.type === '3';
                }))
              }, {
                data: convertData(data.filter(function (a) {
                  return a.type === '2';
                }))
              }, {
                data: convertData(data.filter(function (a) {
                  return a.type === '1';
                }))
              }]
            });
          });
        }
        getMapData();
        // 实时调用接口
        Interval_3 = setInterval(getMapData, Interval_common);
        // 记录3
        window.IntervalArr.push(Interval_3);
      })();

      // 表格
      (function () {
        // 销区指标
        var salesData = $model.$salesData.data;
        var salesTbl = $model.$salesConf.data;
        salesTbl.rows = formatFilter.salesTable(salesData);
        $scope.salesConf = salesTbl;
        // 销区指标
        $scope.reProvinceKPI = function () {
          $model.getProvinceKPI().then(function (res) {
            var salesData = res.data || [];
            var salesTbl = $model.$salesConf.data;
            salesTbl.rows = formatFilter.salesTable(salesData);
            $scope.salesConf = salesTbl;
            $scope.$apply();
            $('[data-toggle="tooltip"]').tooltip();
          });
        };

        // 销区规格
        $scope.reSpecificationKPI = function () {
          $model.getSpecificationKPI().then(function (res) {
            var formatData = res.data || [];
            var formatTbl = $model.$formatConf.data;
            formatTbl.rows = formatFilter.formatTable(formatData);
            $scope.formatConf = formatTbl;
            $scope.$apply();
            $('[data-toggle="tooltip"]').tooltip();
          });
        };

      })();
    }]
  };

  return KPIHenanCtrl;
});