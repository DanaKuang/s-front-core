/**
 * Author: jinlinyong
 * Create Date: 2017-07-04
 * Description: theme
 */

define([], function () {
  var specController = {
    ServiceType: 'controller',
    ServiceName: 'SpecCtrl',
    ViewModelName: 'specViewModel',
    ServiceContent: ['$scope', 'setDateConf', function ($scope,setDateConf) {
      var $model = $scope.$model;
      setDateConf.init($(".region-search-r:nth-of-type(1)"), 'day');
      var stattime = new Date().getFullYear()+"-"+"0"+(new Date().getMonth()+1)+"-"+(new Date().getDate()-1);
      $(".date").find("input").val(stattime);
      //规格下拉列表
      (function () {
        $model.$getProduct().then(function (res) {
          var res = res.data || [];
          for(var i=0;i<res.length;i++){
            $(".region").append("<option value="+res[i].productId+">"+res[i].productName+"</option>")
          }
        })
      })();
      //周下拉列表
      (function () {
        $model.$getWeeks().then(function (res) {
          var res = res.data || [];
          for(var i=0;i<res.length;i++){
            $(".week").append("<option value="+res[i].weekNo+">"+res[i].weekNo+"</option>")
          }
        })
      })();
      $(".ui-search").change(function () {
        var Value = $(this).siblings(".region").val();
        $(".region-search-r").each(function (i) {
          $(".region-search-r").eq(i).hide();
        });
        $(".ui-search option").each(function (i) {
          $(".ui-search option").eq(i).attr("selected",false);
        })
        $(".region option").each(function (i) {
          $(".region option").eq(i).attr("selected",false);
          $(".region").find("option[value="+Value+"]").attr("selected","selected")
        })
        if($(this).val()==="month"){
          $("#month").attr("selected","selected");
          $(".region-search-r").eq(0).show();
        }else if($(this).val() === "day"){
          $("#day").attr("selected","selected");
          $(".region-search-r").eq(0).show();
        }else{
          $("#week").attr("selected","selected");
          $(".region-search-r").eq(1).show();
        }
      });
      $scope.search = function($event){
        var that = $event.target;
        var reg = /(省|市|区)/;
        var params = {
          "productId":$(that).siblings(".region").val().replace(reg,""),
          "statTime":$(that).siblings(). hasClass("date") ?
              ($(that).siblings(".date").data().date ? $(that).siblings(".date").data().date : $(that).siblings(".date").find("input").val())
              : $(that).siblings(".week").val().substr(10,10).replace(/\./g,"-"),
          "statType":$(that).siblings(".ui-search").val()
        }
        public(params)
      };

      function public (param) {
        (function () {
          $scope.spec = {
            "count": 0,
            "active": 0,
            "bag": 0,
            "reduce": 0
          };
          $model.$specfication(param).then(function (res) {
            var data = res.data[0] || {};
            $(".count i").html(data.scanPv || 0);
            $(".active i").html(data.activeUv || 0);
            $(".bag i").html(data.scanCode || 0);
            $(".reduce i").html(data.scanAddUv || 0);
            $(".img").attr("src",data.image)
          });
        })();
        //扫码次数时刻趋势
        (function () {
          var myChart = echarts.init(document.getElementById("hours-chart"));
          var option = $model.$hourchart.data;
          $model.$hourTrend().then(function (res) {
            var res = res.data || [];
            option.series[0].data = [];
            option.xAxis.data = [];
           for(var i = 0;i<res.length;i++){
             option.series[0].data.push(res[i].scanPv);
             option.xAxis.data.push(res[i].statHour)
           }
            myChart.setOption(option,true);
          })
        })();

        //扫码次数时间趋势
        (function () {
          var myChart = echarts.init(document.getElementById("plan-chart"));
          var option = $model.$planchart.data;
          var obj = $model.$Default.data;
          var seriesArr = [];
          for(x in obj){
            obj[x].data = [];
          }
          $model.$timesTrendOfSpec(param).then(function (res) {
            var res = res.data || [];
            option.xAxis.data = [];
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
            option.series = seriesArr;
            myChart.setOption(option,true);
          })
          $(".plan input").click(function () {
            seriesArr.length = 0;
            $(".plan input").each(function () {
              //console.log($(this)[0].name);
              if ($(this).is(":checked")) {
                seriesArr.push(obj[$(this)[0].name]);
              }
            })
            myChart.clear();
            myChart.setOption(option);
          })
        })();

        //各地市扫码扫码次数
        (function () {
          var chinaJson = $model.$chinaJson.data;
          echarts.registerMap('china', chinaJson);
          var myChart = echarts.init(document.getElementById("city-chart"));
          var mapChart = echarts.init(document.getElementById("map-chart"));
          var option = $model.$citychart.data;
          var mapOption = $model.$mapchart.data;
          $model.$getMap(param).then(function (res) {
            mapOption.series[0].data = [];
            for (var i = 0; i < res.data.length; i++) {
              var obj = {
                "value": res.data[i].scanPv,
                "name": res.data[i].provinceName
              }
              mapOption.series[0].data.push(obj)
            }
            mapChart.setOption(mapOption);
          })
          $model.$City(param).then(function (res) {
            option.xAxis[0].data = [];
            option.series[0].data = [];
            for (var i = 0; i < res.data.length; i++) {
              option.xAxis[0].data.push(res.data[i].cityName);
              option.series[0].data.push(res.data[i].scanPv);
            }
            myChart.setOption(option);
          })
        })();

        //抽奖次数时间趋势
        (function () {
          var myChart = echarts.init(document.getElementById("award-chart"));
          var option = $model.$awardchart.data
          var obj = $model.$draw.data;
          var seriesArr = [];
          for(x in obj){
            obj[x].data = [];
          }
          $model.$drawTimes(param).then(function (res) {
            var res = res.data || [];
            option.xAxis.data = [];
            for (x in obj) {
              for (var i = 0; i < res.length; i++) {
                switch (x) {
                  case "扫码次数":
                    obj[x].data.push(res[i].scanPv);
                    break;
                  case "有效扫码数":
                    obj[x].data.push(res[i].scanCode);
                    break;
                  case "抽奖次数":
                    obj[x].data.push(res[i].drawPv);
                    break;
                  case "奖品领取":
                    obj[x].data.push(res[i].awardPayPv);
                    break;
                }
              }
            }
            for (var i = 0; i < res.length; i++) {
              option.xAxis.data.push(res[i].statTime)
            }
            seriesArr[0] = obj["扫码次数"];
            option.series = seriesArr;
            myChart.setOption(option,true);
          })
          $(".award input").click(function () {
            seriesArr.length = 0;
            $(".award input").each(function () {
              if ($(this).is(":checked")) {
                seriesArr.push(obj[$(this)[0].name]);
              }
            })
            myChart.clear();
            myChart.setOption(option);
          })
        })();
        //奖品分布
        (function () {
          var myChart = echarts.init(document.getElementById("pie1-chart"));
          var pieChart = echarts.init(document.getElementById("pie2-chart"));
          var option = $model.$pie1chart.data;
          var pieOption = $model.$pie2chart.data;

          $model.$money(param, 1).then(function (res) {
            var res = res.data || [];
            for(var i = 0;i<option.series.length;i++){
              option.series[i].data = [];
            }
            for (var i = 0; i < res.length; i++) {
              var obj = {
                "value": res[i].awardPayPv,
                "name": res[i].awardName
              }
              option.series[0].data.push(obj);
              option.series[1].data.push(obj);
            }
            // console.log(option);
            myChart.setOption(option,true);
            // console.log(res.data);
          })
          $model.$thing(param).then(function (res) {
            var res = res.data || [];
            for(var i = 0;i<option.series.length;i++){
              pieOption.series[i].data = [];
            }
            for (var i = 0; i < res.length; i++) {
              var obj = {
                "value": res[i].awardPayPv,
                "name": res[i].awardName
              }
              pieOption.series[0].data.push(obj);
              pieOption.series[1].data.push(obj);
            }
            pieChart.setOption(pieOption,true);
            // console.log(res.data);
          })

          // pieOption.series[0].data = pieData;
          // pieOption.series[1].data = pieData;
          // myChart.setOption(option);
          // pieChart.setOption(pieOption);
        })();
      }
      public ();
    }]
  };

  return specController;
});