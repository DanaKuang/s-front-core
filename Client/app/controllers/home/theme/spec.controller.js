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
    ServiceContent: ['$scope','$timeout', 'setDateConf','dayFilter', function ($scope,$timeout,setDateConf,dayFilter) {
      var echarts = require('echarts');
      var $model = $scope.$model;
      setDateConf.init($(".region-search-r:nth-of-type(1)"), 'day');
      setDateConf.init($(".region-search-r:nth-of-type(3)"), 'month');
      // var Dates = new Date(new Date()-24*60*60*1000);
      var amonth = (new Date().getMonth() + 1)<10 ? '0'+ (new Date().getMonth() + 1):(new Date().getMonth() + 1);
      // var aday = Dates.getDate()<10 ? '0' + Dates.getDate() : Dates.getDate();
      var stattime = dayFilter.yesterday("date");
      var specMonth = new Date().getFullYear() + "-" + amonth;
      $(".spec-day").find("input").val(stattime);
      $(".spec-month").find("input").val(specMonth);
      //设置默认值
      var Default =  {
        "productSn":"6901028201711",
        "statTime":stattime,
        "statType":"day"
      };
      //规格下拉列表
      (function () {
        $model.$getProduct().then(function (res) {
          var res = res.data || [];
          for(var i=0;i<res.length;i++){
            if(res[i].name ==="盒-芙蓉王（硬细支）"){
              $(".region").append("<option value="+res[i].sn+" selected>"+res[i].name+"</option>")
            }else {
              $(".region").append("<option value="+res[i].sn+">"+res[i].name+"</option>")
            }
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
      //选择周，月，日
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
          $(".region-search-r").eq(2).show();
        }else if($(this).val() === "day"){
          $("#day").attr("selected","selected");
          $(".region-search-r").eq(0).show();
        }else{
          $("#week").attr("selected","selected");
          $(".region-search-r").eq(1).show();
        }
      });

      //查询
      $scope.search = function($event){
        var that = $event.target;
        var reg = /(省|市|区)/;
        var params = {
          "productSn":$(that).siblings(".region").val().replace(reg,""),
          "statTime":$(that).siblings(). hasClass("date") ?
              ($(that).siblings(".date").data().date ? $(that).siblings(".date").data().date : $(that).siblings(".date").find("input").val())
              : $(that).siblings(".week").val().substr(10,10).replace(/\./g,"-"),
          "statType":$(that).siblings(".ui-search").val()
        };
        if($(that).siblings(".ui-search").val() === "day") {
          $timeout(function () {
            $scope.spec = {
              "daycount" : "本日扫码次数",
              "dayactive" : "本日活跃用户",
              "daybag" : "本日扫码烟包数",
              "dayreduce" : "本日新增扫码用户数"
            }
          },0)
        }else if($(that).siblings(".ui-search").val() === "week") {
          $timeout(function () {
            $scope.spec = {
              "daycount" : "本周扫码次数",
              "dayactive" : "本周活跃用户",
              "daybag" : "本周扫码烟包数",
              "dayreduce" : "本周新增扫码用户数"
            }
          },0)
        }else if($(that).siblings(".ui-search").val() === "month") {
          $timeout(function () {
            $scope.spec = {
              "daycount" : "本月扫码次数",
              "dayactive" : "本月活跃用户",
              "daybag" : "本月扫码烟包数",
              "dayreduce" : "本月新增扫码用户数"
            }
          },0)
        }
        public(params);
      };


      //页面执行函数
      function public (param) {
        (function () {
          $scope.spec = {
            "count": 0,
            "active": 0,
            "bag": 0,
            "reduce": 0,
            "daycount" : "本日扫码次数",
            "dayactive" : "本日活跃用户",
            "daybag" : "本日扫码烟包数",
            "dayreduce" : "本日新增扫码用户数"
          };
          $model.$specfication(param).then(function (res) {
            var data = res.data[0] || {};
            $(".region-margin .count i").html(data.scanPv || 0);
            $(".region-margin .active i").html(data.activeUv || 0);
            $(".region-margin .bag i").html(data.scanCode || 0);
            $(".region-margin .reduce i").html(data.scanAddUv || 0);
            $(".region-margin .img").attr("src",data.image)
          });
        })();
        //扫码次数时刻趋势
        (function () {
          var myChart = echarts.init(document.getElementById("hours-chart"));
          var option = $model.$hourchart.data;
          $model.$hourTrend(param).then(function (res) {
            var res = res.data || [];
            option.series[0].data = [];
            option.xAxis.data = [];
           for(var i = 0;i<res.length;i++){
             option.series[0].data.push(res[i].scanPv);
             option.xAxis.data.push(res[i].statHour);
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
              var x = res[i].statTime || res[i].weekNo;
              option.xAxis.data.push(x);
            }
            //页面几个复选框选中展示几条
            $(".plan input").each(function () {
              //console.log($(this)[0].name);
              if ($(this).is(":checked")) {
                seriesArr.push(obj[$(this)[0].name]);
              }
            })
            //seriesArr[0] = obj["促销计划"];
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
           var reg = /(省|市|区)/;
          $model.$getMap(param).then(function (res) {
            mapOption.series[0].data = [];
            for (var i = 0; i < res.data.length; i++) {
              if(res.data[i].provinceName === "内蒙区"){
                res.data[i].provinceName = "内蒙古"
              }
              var obj = {
                "value": res.data[i].scanPv,
                "name": res.data[i].provinceName.replace(reg,"")
              }
              mapOption.series[0].data.push(obj)
            }
            //console.log(mapOption);
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

        //扫码趋势分析
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
              var x = res[i].statTime || res[i].weekNo
              option.xAxis.data.push(x)
            }

            //页面几个复选框选中展示几条
            $(".award input").each(function () {
              if ($(this).is(":checked")) {
                seriesArr.push(obj[$(this)[0].name] || {type:'line'});
              }
            })
            //seriesArr[0] = obj["扫码次数"];
            option.series = seriesArr;
            myChart.setOption(option,true);
          })
          $(".award input").click(function () {
            seriesArr.length = 0;
            $(".award input").each(function () {
              if ($(this).is(":checked")) {
                seriesArr.push(obj[$(this)[0].name] || {type:'line'});
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
          var option = $model.$fenbu.data;
          var jiangoption = _.cloneDeep(option);
          jiangoption.title.text = "现金红包";
          var shioption = _.cloneDeep(option);
          shioption.title.text = "实物奖品";
          jiangoption.series[0].data = [];
          jiangoption.yAxis.data = [];
          shioption.series[0].data = [];
          shioption.yAxis.data = [];
          $model.$money(param, 1).then(function (res) {
            var res = res.data || [];
            for(var i=0;i<res.length;i++){
              jiangoption.series[0].data.push(res[i].awardPayPv);
              jiangoption.yAxis.data.push(res[i].awardName)
            }
            myChart.setOption(jiangoption,true);
          })
          $model.$thing(param).then(function (res) {
            var res = res.data || [];
            for (var i = 0; i < res.length; i++) {
              shioption.series[0].data.push(res[i].awardPayPv);
              shioption.yAxis.data.push(res[i].awardName);
            };
            pieChart.setOption(shioption,true);
          });
        })();
      }
       public (Default);
    }]
  };

  return specController;
});