/**
 * Author: jinlinyong
 * Create Date: 2017-09-12
 * Description: group
 */

define([], function () {
  var GroupController = {
    ServiceType: 'controller',
    ServiceName: 'GroupCtrl',
    ViewModelName: 'GroupViewModel',
    ServiceContent: ['$scope', 'setDateConf', function ($scope, setDateConf) {
      var echarts = require('echarts');
      var $model = $scope.$model;
      setDateConf.init($(".group-month"), 'month');
      var amonth = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
      var yearMonth = new Date().getFullYear() + "-" + amonth;
      $(".group-month").find("input").val(yearMonth);
      var defaultMonth = { "statDate": yearMonth };
      var defaultBrand = {
        "statDate": yearMonth,
        "productSn":""
      };

      //获取屏幕高度
      function reHeight() {
        var windowHeight = $(window).height() - 210;
        $(".group-pannel-middle").css({"height":windowHeight+"px"});
      }
      reHeight();
      window.onresize = function() {
        reHeight();
      }
      $scope.daySearch = function ($event) {
        var that = $event.target;
        var $form = $(that).closest('form');
        defaultMonth = {
          "statDate" :$($form).find(".date").val()
        };
        defaultBrand = {
          "statDate" :$($form).find(".date").val(),
          "productSn":$scope.Product.sn
        }
        Global(defaultMonth);
        GlobalBrand(defaultBrand);

      };
      $scope.monScanUvConf = {
        Arr: []
      };
      $scope.monScanActUv = {
        Arr: []
      };
      $scope.monScanNewUv = {
        Arr: []
      };

      //品牌与规格联动
      $scope.brands = $model.$getUserBrand.data;
      $scope.Brand = $scope.brands[0];
      //品牌发生变化时
      $scope.BrandChange = function (caller) {
        var productBrand = {
          "productBrand":$scope.Brand.name
        }
        $model.$getProduct(productBrand).then(function(res){
          $scope.Products = res.data;
          $scope.Product = $scope.Products[0];
          $scope.$apply();
          //加载规格时，去渲染屏幕
          defaultBrand.productSn = $scope.Product.sn;
          GlobalBrand(defaultBrand);
          if (caller) {
            $scope.ProductChange();
          }
        })
      };

      //规格发生改变时
      $scope.ProductChange = function () {
        defaultBrand.productSn = $scope.Product.sn;
        GlobalBrand(defaultBrand);
      }
      //页面初始加载的时候传个参数
      $scope.BrandChange(1);
      function Global(data) {
        var obj1 = {};
        var obj2 = {};
        var obj3 = {};
        //扫码用户数
        $model.$getScanNumberUsers(data).then(function (res) {
          var res = res.data || {};
          obj1.tMonth = res.monaddScanUv;
          obj2.tMonth = res.monaddScanActUv;
          obj3.tMonth = res.monaddScanNewUv;
          obj1.lMonth = res.retMonaddScanUv;
          obj2.lMonth = res.retMonaddScanActUv;
          obj3.lMonth = res.retMonaddScanNewUv;
          $model.$getTagName().then(function (res) {
            var res = res.data;
            $(res).each(function (index, n) {
              if (n.tagId === "10001") {
                obj1.title = n.tagName;
                $scope.monScanUvConf = {
                  Arr: [obj1]
                };
              } else if (n.tagId === "10002") {
                obj2.title = n.tagName;
                $scope.monScanActUv = {
                  Arr: [obj2]
                };
              } else if (n.tagId === "10003") {
                obj3.title = n.tagName;
                $scope.monScanNewUv = {
                  Arr: [obj3]
                };
              }
              $scope.$apply();
            })
          })
        });

        //当月不同香烟类别扫码用户分布
        //饼图
        var smokePieChart = echarts.init(document.getElementById("group-smoke-pie"));
        var pieOPtion = $model.$pie.data;
        smokePieChart.setOption(pieOPtion, true);
        $model.$getSmokeTypePie(data).then(function (res) {
          var res = res.data;
          pieOPtion.series[0].data = [];
          $(res).each(function(index,n) {
            pieOPtion.legend.data.push(n.smokeTypeName);
            pieOPtion.series[0].data.push({
              "value":n.monaddScanUv,
              "name":n.smokeTypeName
            })
          });
          smokePieChart.setOption(pieOPtion, true);
        })

        //表格
        $model.$getSmokeTypeTable(data).then(function(res){
          $scope.type = res.data || [];
          $scope.$apply();
        });
      };
      //需要传Sn的
      function GlobalBrand(params) {
        //不同扫码频次用户分布
        var frequencyChartLeft = echarts.init(document.getElementById("frequency-chart-left"));
        var frequencyChartRight = echarts.init(document.getElementById("frequency-chart-right"));
        var frequencyDataLeft = _.cloneDeep($model.$frequency.data);
        frequencyDataLeft.yAxis.name = "近三个月扫码烟包数";
        var frequencyDataRight = _.cloneDeep($model.$frequency.data);
        frequencyDataRight.yAxis.name = "当月扫码烟包数"
        $model.$getThrMonScanSmokeBar(params).then(function(res) {
          var res = res.data || [];
          frequencyDataLeft.yAxis.data = [];
          frequencyDataLeft.series[0].data = [];
          $(res).each(function(index,n){
            frequencyDataLeft.yAxis.data.push(n.scanPvname);
            frequencyDataLeft.series[0].data.push(n.mon3addEffScanPv);
          })
          frequencyChartLeft.setOption(frequencyDataLeft,true)
        })
        $model.$getMonScanSmokeBar(params).then(function(res) {
          var res = res.data || [];
          frequencyDataRight.yAxis.data = [];
          frequencyDataRight.series[0].data = [];
          $(res).each(function(index,n){
            frequencyDataRight.yAxis.data.push(n.scanPvname);
            frequencyDataRight.series[0].data.push(n.monaddEffScanPv);
          })
          frequencyChartRight.setOption(frequencyDataRight,true)
        })

        //用户发展日趋势
        var userChartTrend = echarts.init(document.getElementById("user-chart-trend"));
        var userDayJson = $model.$dayTrend.data;
        $model.$getDayTrendScan(params).then(function(res){
          var res = res.data || [];
          userDayJson.xAxis[0].data = [];
          $(userDayJson.series).each(function(index,n){
            n.data = [];
          });
          $(res).each(function(index,n) {
            userDayJson.xAxis[0].data.push(n.statDate);
            userDayJson.series[0].data.push(n.scanUv);
            userDayJson.series[1].data.push(n.scanNewUv);
            userDayJson.series[2].data.push(n.day3EffScanAvgUV);
          })
          userChartTrend.setOption(userDayJson,true)
        })
        //用户发展月趋势
        var userMonthTrend = echarts.init(document.getElementById("user-month-trend"));
        var userMonthJson = $model.$monthTrend.data;
        $model.$getMonthTrendScan(params).then(function(res) {
          var res = res.data || [];
          if (res.length>=8) {
            userMonthJson.dataZoom.push({
              "type": "inside",
              "show": true,
              "start":0,
              "end": 30,
              "zoomLock":true
            })
          }
          userMonthJson.xAxis[0].data = [];
          $(userMonthJson.series).each(function(index,n){
            n.data = [];
          });
          $(res).each(function(index,n) {
            userMonthJson.xAxis[0].data.push(n.statDate);
            userMonthJson.series[0].data.push(n.scanUv);
            userMonthJson.series[1].data.push(n.scanNewUv);
            userMonthJson.series[2].data.push(n.day3EffScanAvgUV);
          })
          userMonthTrend.setOption(userMonthJson,true)
        })
        //当月次数排名前十
        $model.$getMonthTopten(params).then(function(res) {
          $scope.topTenTable = res.data || [];
          $scope.$apply();
        })
      }
      Global(defaultMonth);
    }]
  };

  return GroupController;
});