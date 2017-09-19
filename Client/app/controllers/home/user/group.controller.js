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
      $scope.daySearch = function ($event) {
        var that = $event.target;        
        defaultMonth = {
          "statDate" :$(that).siblings(".date-wrap").data().date ? $(that).siblings(".date-wrap").data().date : $(that).siblings(".date-wrap").find("input").val()
        };
        Global(defaultMonth);        

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
          if (caller) {
            $scope.ProductChange();
          }
        })
      };

      //规格发生改变时
      $scope.ProductChange = function () {
        defaultBrand = {
          "statDate": yearMonth,
          "productSn": $scope.Product.sn
        };
        GlobalBrand(defaultBrand);        
      }
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
        frequencyDataLeft.title.text = "近三个月扫码烟包数";
        var frequencyDataRight = _.cloneDeep($model.$frequency.data);    
        frequencyDataRight.title.text = "当月扫码烟包数"     
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
          console.log(_.max(res,"day3EffScanAvgUV"));
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
      }

      Global(defaultMonth);






    }]
  };

  return GroupController;
});