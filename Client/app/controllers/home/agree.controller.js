/**
 * Author: {author}
 * Create Date: 2017-07-04
 * Description: multi
 */

define([], function () {
  var agreeController = {
    ServiceType: 'controller',
    ServiceName: 'AgreeCtrl',
    ViewModelName: 'agreeViewModel',
    ServiceContent: ['$scope','setDateConf', function ($scope,setDateConf) {
      setDateConf.init($(".agree-date"), 'day');

      //设置input的默认时间
      var stattime = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + (new Date().getDate() - 1);
      $(".date").find("input").val(stattime);
      var $model = $scope.$model;
      $scope.bool = true;
      //页面默认配置
      var countDeafault = {
        "startTime":"2017-07-17",
        "endTime":"2017-07-17",
        "reportId":"1",
        "productName":"",
        "mobile":"4266",
        "cityName":""
      }
      var Deafault = _.cloneDeep(countDeafault);
      Deafault.page = 1;
      Deafault.pageSize = 3;
      var prizeCount = {
        "startTime":"2017-07-17",
        "endTime":"2017-07-17",
        "reportId":"2",
        "mobile":"4266",
        "productName":"白沙",
        "type":"条",
        "cityName":""
      }
      var prize = _.cloneDeep(prizeCount);
      prize.page = 1;
      prize.pageSize = 3;
      var allpage; //计算总页数
      //tab 切换
      $scope.Tabs = function (boolean) {
        $scope.bool = boolean;
        if($scope.bool) {
          global.other(Deafault);
          global.othersCou(countDeafault);
        } else {
          global.getPrize(prize);
          global.getBrand();
          global.prizeCount(prizeCount)
        }
      }

      //执行的函数
      var global = {
        //异业
        "other" : function (params) {
          $model.$others(params).then(function (res) {
            var res = res.data || [];
            $(".res_table tbody").html("");
            for(var i = 0;i<res.length;i++){
              $(".res_table tbody").append( "<tr><td>"+res[i].mobile+"</td><td>"+res[i].productName+"</td> <td>"+res[i].cityName+"</td> <td>"+res[i].statTime+"</td> </tr>")
            }
          })
        },
        //现金分发
        "getPrize": function (params) {
          $model.$getPrize(params).then(function (res) {
            var res = res.data || [];
            $(".gift_table tbody").html("");
            for(var i = 0;i<res.length;i++){
              $(".gift_table tbody").append( "<tr><td>"+res[i].mobile+"</td><td>"+res[i].productName+"</td> <td>"+res[i].cityName+"</td> <td>"+res[i].statTime+"</td> <td>"+res[i].backpageDenomination+"</td><td>"+res[i].drawCnt+"</td><td>"+res[i].drawFee+"</td></tr>")
            }
        })
        },
        //计算异业的总页数
        "othersCou": function (params) {
          $model.$othersCount(params).then(function (res) {
            allpage = Math.ceil(res.data.Count/3);
            global.createPage();
          })
        },
        //计算奖金总页数
        "prizeCou": function (params) {
          $model.$othersCount(params).then(function (res) {
            allpage = Math.ceil(res.data.Count/3);
            global.createPage();
          })
        },
        //计算奖品分发的总页数
        "prizeCount": function (params) {
          $model.$prizeCount(params).then(function (res) {
            allpage = Math.ceil(res.data.Count/3);
            global.createPage();
          })
        },
        //品牌列表
        "getBrand": function () {
          $model.$getBrand().then(function (res) {
            var res = res.data || [];
            $(".gift_select select").html("");
            for(var i=0;i<res.length;i++){
              $(".gift_select select").append("<option value="+res[i].productBrand+">"+res[i].productBrand+"</option>")
            }
          })
        },
        //创建分页
        "createPage" : function () {
          if($(".tcdPageCode").createPage)
          {
            $(".tcdPageCode").remove();
            $(".rf").append("<div class='tcdPageCode'></div>");
          }
          $(".tcdPageCode").createPage({
            pageCount:allpage,
            current:1,
            backFn:function(page){
              if($scope.bool){
                Deafault.page = page;
                global.other(Deafault);
              } else {
                prize.page = page;
                global.getPrize(prize)
              }

            }
          });
        }
      }
      $(".res_btn").click(function () {
        countDeafault = {};
        Deafault = {};
        countDeafault = {
          "startTime": $(".res-start").find(".date").data().date ?
              $(".res-start").find(".date").data().date : $(this).siblings(".res-start").find("input").val(),
          "endTime":$(".res-end").find(".date").data().date ?
              $(".res-end").find(".date").data().date : $(this).siblings(".res-end").find("input").val(),
          "reportId":"1",
          "productName":$(".res_award").find("input").val(),
          "mobile": $(".res_tel").find("input").val(),
          "cityName":$(".res_city").find("input").val()
        }
        Deafault = _.cloneDeep(countDeafault);
        Deafault.page = 1;
        Deafault.pageSize = 3;
        global.other(Deafault);
        global.othersCou(countDeafault);

        // console.log(options);
      })
      $(".gift_btn").click(function(){
        prizeCount = {};
        prizeCount = {
              "startTime": $(".gift_start").find(".date").data().date ?
                  $(".gift_start").find(".date").data().date : $(this).siblings(".gift_start").find("input").val(),
              "endTime":$(".gift_end").find(".date").data().date ?
                  $(".gift_end").find(".date").data().date : $(this).siblings(".gift_end").find("input").val(),
              "reportId":"2",
              "mobile":$(".gift_tel").find("input").val(),
              "productName":$(".gift_select").find("select").val(),
              "type":$(".gift_bag").find("select").val(),
              "cityName":$(".gift_city").find("input").val()
        }
        prize = _.cloneDeep(prizeCount);
        prize.page = 1;
        prize.pageSize = 3;
        global.getPrize(prize);
        global.prizeCou(prizeCount);
      })
      global.other(Deafault);
      global.othersCou(countDeafault);

    }]
  };

  return agreeController;
});