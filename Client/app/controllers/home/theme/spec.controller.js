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
      setDateConf.init($(".ui-spec-form:nth-of-type(1)"), 'day');
      setDateConf.init($(".ui-spec-form:nth-of-type(3)"), 'month');
      // var Dates = new Date(new Date()-24*60*60*1000);
      var amonth = (new Date().getMonth() + 1)<10 ? '0'+ (new Date().getMonth() + 1):(new Date().getMonth() + 1);
      // var aday = Dates.getDate()<10 ? '0' + Dates.getDate() : Dates.getDate();
      var stattime = dayFilter.yesterday("date");
      var specMonth = new Date().getFullYear() + "-" + amonth;
      $(".spec-day").find("input").val(stattime);
      $(".spec-month").find("input").val(specMonth);
      //设置默认值
      var Default =  {
        "productSn":"",
        "statTime":stattime,
        "statType":"day"
      };

      // 添加hover效果
      $("select").hover(function (e) {
        e.currentTarget.title = e.currentTarget.selectedOptions[0].innerText;
      });

      //数据初始化；
      var global = {}
      global.initProvinceData = {
        productSn:'',
        statTime: stattime,
        provinceName: '',
        statType: 'day'
      };

      //品牌
      (function(){
        $model.$getBrand().then(function(res){
          var res = res.data || [];
          for(var i=0;i<res.length;i++){
              $(".brand").append("<option value="+res[i].name+">"+res[i].name+"</option>")
          };
          console.log($(".brand").val())
          getProduct({productBrand:$(".brand").val()},1)
        })
      })();
      //品牌与规格联动
      $(".brand").change(function(){
        getProduct({productBrand:$(this).val()})
      })
      //规格下拉列表
      function getProduct(params,caller) {
        $model.$getProduct(params).then(function (res) {
          var res = res.data || [];
          $(".region.spec").html("");
          for(var i=0;i<res.length;i++) {
              $(".region.spec").append("<option value="+res[i].sn+">"+res[i].name+"</option>")
          }
          Default.productSn = $(".region.spec").val();
          global.initProvinceData.productSn = $(".region.spec").val();
          if(caller === 1) {
            public (Default);


          }


        })
      };
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
        $(".ui-spec-form").each(function (i) {
          $(".ui-spec-form").eq(i).hide();
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
          $(".ui-spec-form").eq(2).show();
        }else if($(this).val() === "day"){
          $("#day").attr("selected","selected");
          $(".ui-spec-form").eq(0).show();
        }else{
          $("#week").attr("selected","selected");
          $(".ui-spec-form").eq(1).show();
        }
      });

      //查询
      $scope.search = function($event){
        var that = $event.target;
        var $form = $(that).closest('form');
        var reg = /(省|市|区)/;
        var params = {
          "productSn":$($form).find(".region").val() || "",
          "statTime":$($form).find('.date').length ? $($form).find('.date').val() : $($form).find(".week").val().substr(10,10).replace(/\./g,"-"),
          "statType":$($form).find(".ui-search").val()
        };

        params.productSn = params.productSn.replace(reg,"");

        if(params.statType === "day") {
          $timeout(function () {
            $scope.spec = {
              "daycount" : "本日扫码次数",
              "dayactive" : "本日连续月活用户",
              "weekactive":"本日连续周活用户",
              "daybag" : "本日扫码烟包数",
              "dayreduce" : "本日新增扫码用户数"
            }
          },0)
        }else if(params.statType === "week") {
          $timeout(function () {
            $scope.spec = {
              "daycount" : "本周扫码次数",
              "dayactive" : "本周连续月活用户",
              "weekactive":"本周连续周活用户",
              "daybag" : "本周扫码烟包数",
              "dayreduce" : "本周新增扫码用户数"
            }
          },0)
        }else if(params.statType === "month") {
          $timeout(function () {
            $scope.spec = {
              "daycount" : "本月扫码次数",
              "dayactive" : "本月连续月活用户",
              "weekactive":"本月连续周活用户",
              "daybag" : "本月扫码烟包数",
              "dayreduce" : "本月新增扫码用户数"
            }
          },0)
        }
        public(params);
      };

      //页面执行函数
      $scope.spec = {
        "count": 0,
        "active": 0,
        "bag": 0,
        "reduce": 0,
        "daycount" : "本日扫码次数",
        "dayactive" : "本日连续月活用户",
        "weekactive":"本日连续周活用户",
        "daybag" : "本日扫码烟包数",
        "dayreduce" : "本日新增扫码用户数"
      };
      function public (param) {
        global.initProvinceData.productSn = param.productSn;
        global.initProvinceData.statTime = param.statTime;
        global.initProvinceData.statType = param.statType;
        (function () {
          $model.$specfication(param).then(function (res) {
            var data = res.data[0] || {};
            $(".region-margin .count i").html(data.scanPv || 0);
            $(".region-margin .active i").html(data.activeUv || 0);
            $(".region-margin .weekactive i").html(data.weekActiveUv || 0);
            $(".region-margin .bag i").html(data.scanCode || 0);
            $(".region-margin .reduce i").html(data.scanAddUv || 0);
            $(".region-margin .img").attr("src",data.image || "")
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
        //扫码人数时间趋势
        (function () {
          var myChart = echarts.init(document.getElementById("people-chart"));
          var option = $model.$peopletrend.data;
          // 自定义tooltip
            option.tooltip.formatter = function (params) {
                return "<i style='float:left;margin:5px 3px 0 0;width:10px;height:10px;background:#ea7d3c'></i>" + "新增扫码人数:" + params[1].data + "<br>" + "<i style='float:left;margin:5px 3px 0 0;width:10px;height:10px;background:#5d9cd2'></i>" + "历史扫码人数:" + params[0].data + "<br>" + "<i style='float:left;margin:5px 3px 0 0;width:10px;height:10px;background:#fff'></i>" + "扫码总人数:" + (params[1].data + params[0].data);
            }
          $model.$peopleTrend(param).then(function (res) {
            //console.log(param)
            var res = res.data || [];
            option.series[0].data = [];
            option.series[1].data = [];
            option.xAxis.data = [];
           for(var i = 0;i<res.length;i++){
             //console.log(res[i]);
             option.series[1].data.push(res[i].scanAddUv);
             option.series[0].data.push(res[i].scanHistoryUv);
              if(param.statType === "day") {
                option.xAxis.data.push(res[i].statTime.replace(/-/g,"/"));
              }else if(param.statType === "month"){
                option.xAxis.data.push(res[i].statTime.replace(/-/g,""));

              } else{
                option.xAxis.data.push(res[i].weekNo);
              }

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
                  case "扫码烟包数":
                    obj[x].data.push(res[i].scanCode);
                    break;
                  case "抽奖次数":
                    obj[x].data.push(res[i].drawPv);
                    break;
                  case "中奖数量":
                    obj[x].data.push(res[i].drawResultPv);
                    break;
                  case "领取数量":
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
              if ($(this).is(":checked")) {
                seriesArr.push(obj[$(this)[0].name]);
              }
            })
            myChart.clear();
            myChart.setOption(option);
          })
        })();

        //扫码地域分布
        (function () {
          //分省分布；
          var chinaJson = $model.$chinaJson.data;
          echarts.registerMap('china', chinaJson);
          var mapEchart = echarts.init(document.getElementById('map-chart'));
          var mapConf = $model.$mapConf.data;
          mapConf.tooltip.formatter = function (params) {
            console.log(params);
            return "扫码烟包数" + '<br>' + params.name + ":" + (params.data.value || 0);
          }
          mapEchart.setOption(mapConf);
          //地域地图显示；
          var reg = /省|市|区/;
          var mongoReg = /内蒙区/;

          $model.$getProvincialAnalysis(param).then(function (res) {
            var opts = mapEchart.getOption();
            var data = res.data || [];
            opts.series[1].data = _.each(data, function (d) {
              if (d.provinceName != '全国') {
                 d.name = mongoReg.test(d.provinceName) ? '内蒙古' : reg.test(d.provinceName.substr(d.provinceName.length-1)) ? d.provinceName.substr(0, d.provinceName.length - 1) : d.provinceName;
                  d.value = d.scanCode;

              }
            }) || [];
            opts.visualMap[0].max = _.max(opts.series[1].data, function (v) {return v.value}).value || 5000;
            mapEchart.setOption(opts);
          })


          //扫码烟包数时间时间趋势；
          var districtChart = echarts.init(document.getElementById('time-chart'));
          var districtOption = $model.$districtConf.data;


          //省内各地市扫码烟包数排名；
          var cityChart = echarts.init(document.getElementById('city-chart'));
          var cityOption = $model.$cityConf.data;

           //console.log(global.initProvinceData);
          //扫码烟包数时间趋势；
          // if(sessionStorage.getItem('account')  === "hunan") {
          //   global.initProvinceData.provinceName = "湖南省"
          // }
          // if(sessionStorage.)
          // $model.$getUserInfo({}).then(function(res) {
          //   console.log(res);
          // })
          var province = sessionStorage.getItem('orgCode');
          switch(province) {
            case "hunanzhongyan" :
              global.initProvinceData.provinceName = "湖南省";
              break;
            case "hebeizhongyan" :
              global.initProvinceData.provinceName = "河北省";
              break;
            case "shankunzhongyan" :
              global.initProvinceData.provinceName = "山西省";
              break;
            case "henanzhongyan" :
              global.initProvinceData.provinceName = "河南省";
              break;
              case "hebeihehua" :
              global.initProvinceData.provinceName = "河北省";
              break;


          }
          $model.$getDistrictTrend(global.initProvinceData).then(function (res) {

            var res = res.data || [];
            districtOption.series[0].data = [];
            districtOption.xAxis.data = [];
            for(var i = 0;i<res.length;i++){
              if(res[0].weekNo) {
                districtOption.xAxis.data.push(res[i].weekNo);
              }else{
                districtOption.xAxis.data.push(res[i].statTime);
              }
              districtOption.series[0].data.push(res[i].scanCode);
            }
            districtChart.setOption(districtOption);
          })
          $model.$getCityTrend(global.initProvinceData).then(function(res) {
          var res = res.data || [];
          cityOption.series[0].data = [];
          cityOption.xAxis.data = [];
          for(var i = 0;i<res.length;i++){
            cityOption.xAxis.data.push(res[i].cityName);
            cityOption.series[0].data.push(res[i].scanCode);
          }
          cityChart.setOption(cityOption);
        })
          mapEchart.off();
          mapEchart.on('click', function (e) {
            var data = {
              provinceName: "",
              statTime: global.initProvinceData.statTime,
              statType: global.initProvinceData.statType,
              productSn: global.initProvinceData.productSn
            }
            if (e.componentType === 'series') {
            // {provinceName: "湖南省", statTime: "2017-10-24", statType: "day"}

                data.provinceName = e.data.provinceName;
                if(data.provinceName !== undefined) {
                  $model.$getDistrictTrend(data).then(function(res) {
                    var res = res.data || [];
                    districtOption.series[0].data = [];
                    districtOption.xAxis.data = [];
                    for(var i = 0;i<res.length;i++){
                      if(res[0].weekNo) {
                        districtOption.xAxis.data.push(res[i].weekNo);
                      }else{
                        districtOption.xAxis.data.push(res[i].statTime);
                      }
                      districtOption.series[0].data.push(res[i].scanCode);
                    }
                    districtChart.setOption(districtOption);
                  })
                  $model.$getCityTrend(data).then(function(res) {
                    var res = res.data || [];
                    console.log(res);
                    if(res.length > 7) {
                      cityOption.dataZoom[0].end = (7/res.length)*100;
                    }else{
                      cityOption.dataZoom[0].end = 100;
                    }
                    cityOption.series[0].data = [];
                    cityOption.xAxis.data = [];
                    for(var i = 0;i<res.length;i++){
                      cityOption.xAxis.data.push(res[i].cityName);
                      cityOption.series[0].data.push(res[i].scanCode);
                    }
                    cityChart.setOption(cityOption);
                  })
                }else {
                  data.provinceName = "";
                  data.statTime = "";
                  data.statType = "";
                  data.productSn ="";
                  $model.$getDistrictTrend(data).then(function(res) {
                    var res = res.data || [];
                    districtOption.series[0].data = [];
                    districtOption.xAxis.data = [];
                    for(var i = 0;i<res.length;i++){
                      if(res[0].weekNo) {
                        districtOption.xAxis.data.push(res[i].weekNo);
                      }else{
                        districtOption.xAxis.data.push(res[i].statTime);
                      }
                      districtOption.series[0].data.push(res[i].scanCode);
                    }
                    districtChart.setOption(districtOption);
                  })
                  $model.$getCityTrend(data).then(function(res) {
                    var res = res.data || [];

                    cityOption.series[0].data = [];
                    cityOption.xAxis.data = [];
                    for(var i = 0;i<res.length;i++){
                      cityOption.xAxis.data.push(res[i].cityName);
                      cityOption.series[0].data.push(res[i].scanCode);
                    }
                    cityChart.setOption(cityOption);
                  })
                }

            }

        });

        })();
        //全国地市扫码烟包数排名；
        (function () {
          var myChart = echarts.init(document.getElementById("award-chart"));
          var option = $model.$scan.data;
          $model.$getScan(param).then(function (res) {
              if(res.data.length > 12) {
                option.dataZoom[0].end = (12/res.data.length)*100;
              }

            option.xAxis[0].data = [];
            option.series[0].data = [];
            for (var i = 0; i < res.data.length; i++) {
              option.xAxis[0].data.push(res.data[i].cityName);
              option.series[0].data.push(res.data[i].scanCode);
            }
            myChart.setOption(option);
          })
        })();
        //奖品分布
        (function () {
          var myChart = echarts.init(document.getElementById("pie1-chart"));
          var pieChart = echarts.init(document.getElementById("pie2-chart"));
          var option = $model.$fenbu.data;
          var jiangoption = _.cloneDeep(option);
          //自定义tooltip
          // jiangoption.tooltip.formatter = function (params) {
          //   console.log(params[0].data,params[1].data);
          //   return params[0].name + "<br>" + "领奖数量:" + (params[0].data - params[1].data) + "<br>" + "中奖数量:" + params[0].data;
          // }
          jiangoption.title.text = "现金红包";
          var shioption = _.cloneDeep(option);
          shioption.title.text = "实物奖品";
          jiangoption.series[0].data = [];
          jiangoption.series[1].data = [];
          jiangoption.yAxis.data = [];
          shioption.series[0].data = [];
          shioption.series[1].data = [];
          shioption.yAxis.data = [];
          $model.$getMoney(param, 2).then(function (res) {
            var res = res.data || [];
            for(var i=0;i<res.length;i++){
              jiangoption.series[1].data.push(res[i].drawResultPv);
              jiangoption.series[0].data.push(res[i].awardPayPv);
              jiangoption.yAxis.data.push(res[i].awardName)
            }
            //console.log(jiangoption.series);
            myChart.setOption(jiangoption,true);
          })
          // shioption.tooltip.formatter = function (params) {
          //   return params[0].name + "<br>" + "领奖数量:" + (params[0].data - params[1].data) + "<br>" + "中奖数量:" + params[0].data;
          // }
          $model.$getThing(param,1).then(function (res) {
            var res = res.data || [];
            for (var i = 0; i < res.length; i++) {
              shioption.series[1].data.push(res[i].drawResultPv);
              shioption.series[0].data.push(res[i].awardPayPv);
              shioption.yAxis.data.push(res[i].awardName);
            };
            pieChart.setOption(shioption,true);
          });
        })();
      }
    }]
  };

  return specController;
});