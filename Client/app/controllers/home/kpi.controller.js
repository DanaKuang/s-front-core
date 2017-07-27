/**
 * Author: liubin
 * Create Date: 2017-06-27
 * Description: index
 */

define([], function () {
  var KPICtrl = {
    ServiceType: "controller",
    ServiceName: "KPICtrl",
    ViewModelName: 'kpiViewModel',
    ServiceContent: ['$scope', 'dateFormatFilter', 'formatFilter', function ($scope, dateFormatFilter, formatFilter) {
      var $model = $scope.$model;
      var Interval_1,                     // 右侧栏实时对象
          Interval_2,                     // 滚动定时对象
          Interval_3,                     // map定时对象
          // Interval_4,                     // 表格刷新实时对象
          Interval_common = 3000,         // 循环滚动间隔
          Interval_scroll_I = 9000,       // 滚工区接口刷新
          Interval_table_I = 60*60*1000;  // 表格一小时刷新

      // 首页较特殊 页面切换清楚所有的定时器
      window.IntervalArr = [];

      // 右侧数据
      (function () {
        // 计算环比
        function rate (o, n) {
          o = Number(o);
          n = Number(n);
          return '' + (((n-o)/n)*100).toFixed(2);
        }

        Interval_1 = setInterval(function() {
          // 获取扫码次数
          $model.getScanTime().then(function (res) {
            var res = res.data || {};
            var st = res.scanTimes_of_day || 0;
            var hst = $model.$historyScan.data[0] || {};
            var rt = rate(hst.scanPv, st);
            var f = hst.scanPv > st ? 'down' : 'up';
            $("#scan_day").html(st);
            $("#scan_day_rate").html(rt).siblings('i').attr('class', f);
          });
          // 当日扫码人数
          $model.getScanUser().then(function (res) {
            var res = res.data || [];
            var su = res.scanUsers_of_day || 0;
            var hsu = $model.$historyScan.data[0] || {};
            var rt = rate(hsu.scanUv, su);
            var f = hsu.scanUv > su ? 'down' : 'up';
            $("#scan_user").html(su);
            $("#scan_user_rate").html(rt).siblings('i').attr('class', f);
          });
          // 当日扫码烟包数
          $model.getScanCode().then(function (res) {
            var res = res.data || {};
            var sc = res.scanCodes_of_day || 0;
            var hsc = $model.$historyScan.data[0] || {};
            var rt = rate(hsc.scanCode, sc);
            var f = hsc.scanCode > sc ? 'down' : 'up';
            $("#scan_code").html(sc);
            $("#scan_code_rate").html(rt).siblings('i').attr('class', f);
          });
          // top10
          $model.getTopTen().then(function (res) {
            var res = res.data || [];
            $("#scan_top").html(res.join('、'));
          });
        }, Interval_common);
        // 记录1
        window.IntervalArr.push(Interval_1);
      })();

      // 滚动区域数据
      (function () {
        var $wrap = $("#scroll_data");
        var wrapper = null;
        Interval_2 = setInterval(function () {
          $model.getScrollData().then(function (res) {
            var data = res.data || [];
            var result = [];
            data.forEach(function (d) {
              result.push('<li>'+d+'</li>');
            });
            $wrap.html(result.join(''));
            clearInterval(wrapper);
            wrapper = setInterval(function() {
                if ($wrap.children().length <= 1) {
                    clearInterval(wrapper);
                    wrapper = null;
                    return;
                }
                // 不可放置于函数起始处,li:first取值是变化的
                var $li = $wrap.find('li:first');
                var _h = $li.height();
                $li.css('visibility','hidden')
                   .animate({ marginTop: -_h + 'px' }, 600, function() {
                    // 隐藏后,将该行的margin值置零,并插入到最后,实现无缝滚动
                    $li.css({'marginTop': 0, 'visibility': 'visible'}).appendTo($wrap);
                });
            }, Interval_common);
          });
        }, Interval_scroll_I);
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
        };

        var top_10 = convertData(data.sort(function (a, b) {
                        return b.scantimes - a.scantimes;
                    }).slice(0, 10));

        var symbolSize = function (val) {
            return val[2] / 10;
        };

        // 自定义tooltip
        option.tooltip.formatter = function (params) {
            return params.name + '扫码量: ' + params.value[2] + '次';
        }
        // 所有点
        option.series[0].data = convertData(data);
        option.series[0].symbolSize = symbolSize

        // top 10点
        option.series[1].data = top_10;
        option.series[1].symbolSize = symbolSize

        myChart.setOption(option);
        myChart.on('click', function (params) {
          event.stopPropagation();
          if (params.componentType !== 'series') return;
          console.log('echart 点击事件。');
          console.log(params);
        });

        // 实时调用接口
        Interval_3 = setInterval(function () {
          $model.getMapData().then(function (res) {
            var data = res.data || [];
            var option = myChart.getOption();
            option.series[0].data = convertData(data);
            option.series[1].data = convertData(data.sort(function (a, b) {
                return b.scantimes - a.scantimes;
            }).slice(0, 10));
            myChart.setOption(option)
          });
        }, Interval_common);
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

        // 规格指标
        var formatData = $model.$formatData.data;
        var formatTbl = $model.$formatConf.data;
        formatTbl.rows = formatFilter.formatTable(formatData);
        $scope.formatConf = formatTbl;

        // 销区与规格
        var sfData = $model.$fscanData.data;
        var sfTbl = $model.$sfConf.data;
        sfTbl.rows = formatFilter.sfTable(sfData);
        $scope.sfConf = sfTbl;
      })();
    }]
  };

  return KPICtrl;
});