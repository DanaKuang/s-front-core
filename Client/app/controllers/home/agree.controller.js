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
    ServiceContent: ['$scope','setDateConf','dayFilter', function ($scope,setDateConf,dayFilter) {
      // setDateConf.init($(".agree-date"), 'day');

      //设置input的默认时间
      // var stattime = dayFilter.yesterday("date");
      // $(".date").find("input").val(stattime);
      var $model = $scope.$model;
      $scope.bool = false;
      //页面默认配置
      var countDeafault = {
        // "startTime":stattime,
        // "endTime":stattime,
        // "reportId":"1",
        "productBrand": "",
        "productSn": "",
        "awardType": "",
        "activityName": "",
        "checkPerson": "",
        "checkStatus": $(".res_status select").val()
      }
      var Deafault = _.cloneDeep(countDeafault);
      Deafault.page = 1;
      Deafault.pageSize = 10;
      var allpage; //计算总页数
      $("#agree_brand").change(function() {
        global.getProduct({productBrand:$("#agree_brand").val()})
      })      
      // var prizeCount = {
      //   "startTime":stattime,
      //   "endTime":stattime,
      //   "reportId":"2",
      //   "mobile":"",
      //   "productName":"芙蓉王",
      //   "type":"盒",
      //   "cityName":""
      // };
      // var prize = _.cloneDeep(prizeCount);
      // prize.page = 1;
      // prize.pageSize = 10;
      //tab 切换
      // $scope.Tabs = function (boolean) {
      //   $scope.bool = boolean;
      //   if($scope.bool) {
      //     global.other(Deafault);
      //     global.othersCou(countDeafault);
      //   } else {
      //     global.getPrize(prize);
      //     // global.getBrand();
      //     global.prizeCou(prizeCount);
      //   }
      // };

      //执行的函数
      var global = {
        //异业
        // "other" : function (params) {
        //   $model.$others(params).then(function (res) {
        //     var res = res.data || [];
        //     $(".res_table tbody").html("");
        //     for(var i = 0;i<res.length;i++){
        //       $(".res_table tbody").append( "<tr><td>"+res[i].mobile+"</td><td>"+res[i].productName+"</td> <td>"+res[i].cityName+"</td> <td>"+res[i].statTime+"</td> </tr>")
        //     }
        //     $(".res_btn").removeClass("gray_btn");
        //   })
        // },
        //履约表格
        "getPerformAppoint" : function (params) {
          $model.$getPerformAppoint(params).then(function (res) {
            var res = res.data || [];
            $(".res_btn").removeClass("gray_btn");
          $(res).each(function(index,n){
            if (n.checkStatus == "1") {
              n.checkStatus = "待核实";
          } else if (n.checkStatus == "2") {
            n.checkStatus = "已核实";
          } else if (n.checkStatus == "3") {
            n.checkStatus = "不属实";
          } else if (n.checkStatus == "4") {
            n.checkStatus = "联系不上";
          }
          })
            $scope.table = res;
            $scope.$apply();
            // for(var i = 0;i<res.length;i++){
            //   $(".res_table tbody").append( "<tr><td>"+res[i].mobile+"</td><td>"+res[i].productName+"</td> <td>"+res[i].cityName+"</td> <td>"+res[i].statTime+"</td> </tr>")
            // }
            // $(".res_btn").removeClass("gray_btn");
          })
        },
        //现金分发
        // "getPrize": function (params) {
        //   $model.$getPrize(params).then(function (res) {
        //     var res = res.data || [];
        //     $(".gift_table tbody").html("");
        //     for(var i = 0;i<res.length;i++){
        //       $(".gift_table tbody").append( "<tr><td>"+res[i].mobile+"</td><td>"+res[i].productName+"</td><td>"+res[i].type+"</td> <td>"+res[i].cityName+"</td> <td>"+res[i].statTime+"</td> <td>"+res[i].backpageDenomination+"</td><td>"+res[i].drawCnt+"</td><td>"+res[i].drawFee+"</td></tr>");
        //     }
        //     $(".gift_btn").removeClass("gray_btn");
        // })
        // },
        //计算异业的总页数
        // "othersCou": function (params) {
        //   $model.$othersCount(params).then(function (res) {
        //     allpage = Math.ceil(res.data.Count/10);
        //     global.createPage();
        //   })
        // },
        //计算履约报表页数
        "getPerformAppointCount": function (params) {
          $model.$getPerformAppointCount(params).then(function (res) {
            allpage = Math.ceil(res.data.Count/10);
            global.createPage();
          })
        },
        //计算奖金总页数
        // "prizeCou": function (params) {
        //   $model.$prizeCount(params).then(function (res) {
        //     allpage = Math.ceil(res.data.Count/10);
        //     global.createPage();
        //   })
        // },
        //计算奖品分发的总页数
        // "prizeCount": function (params) {
        //   $model.$prizeCount(params).then(function (res) {
        //     allpage = Math.ceil(res.data.Count/10);
        //     global.createPage();
        //   })
        // },
        //品牌列表
        "getBrand": function () {
          $model.$getBrand().then(function (res) {
            var res = res.data || [];
            for(var i=0;i<res.length;i++){
                $("#agree_brand").append("<option value="+res[i].productBrand+">"+res[i].productBrand+"</option>")
            };
            global.getProduct({productBrand:$("#agree_brand").val()});            
          })
        },
        //规格列表
        "getProduct": function(params) {
          $model.$getProduct(params).then(function (res) {
            var res = res.data || [];
            $("#agree_product").html("");
            $("#agree_product").append("<option value=''>全部</option>");                    
            for(var i=0;i<res.length;i++){
                $("#agree_product").append("<option value="+res[i].sn+">"+res[i].name+"</option>")
            };
        })
        },
        //奖品类别
        "getAwardType": function(){
          $model.$getAwardType().then(function(res){
            var res = res.data || [];
            $(res).each(function(index,n){
              $(".res_award select").append("<option value="+n.awardTypeId+">"+n.awardTypeName+"</option>")              
            })
            Deafault.awardType = $(".res_award select").val();
            countDeafault.awardType = $(".res_award select").val();
            global.getPerformAppoint(Deafault);
            global.getPerformAppointCount(countDeafault);
          })
        },
        //创建分页
        "createPage" : function () {
          if(allpage === 0){
            $(".tcdPageCode").remove();
          }else {
            if($(".tcdPageCode").createPage) {
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
      }
      $(".res_btn").click(function () {
        if(!$(this).hasClass("gray_btn")) {
          $(this).addClass("gray_btn");
          countDeafault = {};
          Deafault = {};
          countDeafault = {
            "productBrand": $(".agree_brand select").val(),
            "productSn": $(".agree_product select").val(),
            "awardType": $(".res_award select").val(),
            "activityName": $(".res_tel input").val(),
            "checkPerson": $(".res_person input").val(),
            "checkStatus": $(".res_status select").val()
          }
          Deafault = _.cloneDeep(countDeafault);
          Deafault.page = 1;
          Deafault.pageSize = 10;
          global.getPerformAppoint(Deafault);
          global.getPerformAppointCount(countDeafault);
        }
        // console.log(options);
      })
      // $(".gift_btn").click(function(){
      //   if(!$(this).hasClass("gray_btn")) {
      //     $(this).addClass("gray_btn");
      //     prizeCount = {};
      //     prizeCount = {
      //       "startTime": $(".gift_start").find(".date").data().date ?
      //           $(".gift_start").find(".date").data().date : $(this).siblings(".gift_start").find("input").val(),
      //       "endTime": $(".gift_end").find(".date").data().date ?
      //           $(".gift_end").find(".date").data().date : $(this).siblings(".gift_end").find("input").val(),
      //       "reportId": "2",
      //       "mobile": $(".gift_tel").find("input").val(),
      //       "productName": $(".gift_select").find("select").val(),
      //       "type": $(".gift_bag").find("select").val(),
      //       "cityName": $(".gift_city").find("input").val()
      //     }
      //     prize = _.cloneDeep(prizeCount);
      //     prize.page = 1;
      //     prize.pageSize = 10;
      //     global.getPrize(prize);
      //     global.prizeCou(prizeCount);
      //   }
      // })
            
      global.getBrand();
      global.getAwardType();

    }]
  };

  return agreeController;
});