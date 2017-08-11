/**
 * Author: kuang
 * Create Date: 2017-07-20
 * Description: integralHistory
 */

define([], function () {
  var integralHistoryController = {
    ServiceType: 'controller',
    ServiceName: 'integralHistoryCtrl',
    ViewModelName: 'integralHistoryModel',
    ServiceContent: ['$rootScope', '$scope', 'mPrizeGotHistoryModel', 'dateFormatFilter', function ($rootScope, $scope, $model, dateFormatFilter) {
      
    	$("#durationStart").datetimepicker({
        format: 'yyyy-mm-dd hh:ii:ss', 
        language: 'zh-CN',
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1
      }).on('change', function (e) {
          var startTime = e.target.value;
          var endTime = $scope.endTime;
          if (endTime < startTime) {
              $scope.endTime = '';
              $scope.$apply();
          }
      });
  
      $("#durationEnd").datetimepicker({
        format: 'yyyy-mm-dd hh:ii:ss', 
        language: 'zh-CN',
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        endDate: new Date()
      }).on('change', function (e) {
          var endTime = e.target.value;
          var startTime = $scope.startTime;
          if (startTime > endTime) {
              $scope.startTime = '';
              $scope.$apply();
          }
      });

      $scope.hours = _.map(Array(24),function(v, i){return i;});

      // 获取领奖明细
      $scope.$on('frompagechange', function (e, v, f) {
      	var realthing = {realThing: 0, awardType: 6};
      	var data = Object.assign(f, realthing);
        $model.getprizelist(data).then(function(res) {
          $scope.vprizegotlistConf = res.data;
          $scope.paginationConf = res.data;
        })
      })

      // 操作面板，获取所有品牌
      $(document).ready(function () {
        $(".operation.multi .select").multiselect({
          includeSelectAllOption: true,
          selectAllText: '全部',
          selectAllValue: 'all',
          enableFiltering: true,
          buttonWidth: '170px',
          maxHeight: '200px',
          numberDisplayed: 1
        });
      });

      $model.getAllBrands().then(function(res) {
        $scope.allBrands = res.data.data;
        $('[ng-model="selectAllBrands"]').multiselect('dataprovider', _.forEach($scope.allBrands, function(v){
            v.label = v.name;
            v.value = v.brandCode;
        }));
        $('[ng-model="selectAllBrands"]').multiselect('refresh');
      })

      // 操作面板，根据品牌获取规格
      var brandListArrObj = {};
      $scope.$watch('selectAllBrands', function(n, o, s) {
        if (n !== o) {
          $scope.selectAllBrands = n;
          brandListArrObj.brandCode = n;
          $model.getProductList(brandListArrObj).then(function (res) {
            $scope.speci = res.data.data;
            $('[ng-model="selectSpeci"]').multiselect('dataprovider', _.forEach($scope.speci, function(v){
              v.label = v.name;
              v.value = v.sn;
            }));
            $('[ng-model="selectAllBrands"]').multiselect('refresh');
          })
        }
      })

      var productListArrObj = [];
      $scope.$watch('selectSpeci', function (n, o, s) {
        if (n !== o) {
          $scope.selectSpeci = n;
          productListArrObj.sns = n;
        }
      })

      // 操作面板，获取活动状态
      $model.getActivityStatus().then(function(res) {
        $scope.statusList = res.data.data;
      })

      // 操作面板，点击获取地区
      $('.operation').one('click', '.area', function (e) {
        var f = {parentCode: 0}
        getArea(f, '[ng-model="allarea"]')
      })

      // 获取地区
      function getArea(f, selector, bool) {
        $model.getTierArea(f).then(function (res) {
            var areaData = [];
            var provinceArr = res.data.data;
            if (provinceArr.length != 0) {
              provinceArr.forEach(function (n ,index) {
                var group = {
                    label: n.shortName, 
                    value: n.code,
                    children: []
                };
                $model.getTierArea({parentCode: n.code}).then(function(res) {
                    var cityArr = res.data.data;
                    if (cityArr.length != 0) {
                      cityArr.forEach(function (n, index) {
                        group['children'].push({
                            label: n.shortName,
                            value: n.code
                        })
                      })
                    }
                    areaData.push(group);
                    $(selector).multiselect('dataprovider', areaData);
                  })
              })
            }
        })
      }

      // 点击搜索
      $scope.search = function (e) {
        var data = {
          orderCode: $scope.orderCode || '',
          brandCode: brandListArr || [],
          sn: productListArr || [],
          areaCodes: $scope.allarea || [],
          keys: $scope.keysval || '',
          realThing: 0,
          awardType: 6,
          status: $scope.statusVal || '', //活动状态
          orderStatus: $scope.orderstatus || '',
          stime: $scope.startTime || '',
          etime: $scope.endTime || '',
          currentPageNumber: 1,
          pageSize: 10
        };
        $model.getprizelist(data).then(function(res) {
          $scope.vprizegotlistConf = res.data;
          $scope.paginationConf = res.data;
        })
      }

      // 重置
      $scope.reset = function () {
        $scope.orderstatus = '';
        $scope.statusVal = '';
        $scope.selectAllBrands = '';
        $scope.selectSpeci = '';
        $scope.allarea = '';
        $scope.keysval = '';
        $scope.startTime = '';
        $scope.endTime = '';
        $model.getprizelist({
          currentPageNumber:1, 
          pageSize: 10,
          realThing: 0,
          awardType: 6
        }).then(function(res) {
          $('[ng-model="selectAllBrands"]').multiselect('refresh');
          $('[ng-model="selectSpeci"]').multiselect('refresh');
          $('[ng-model="allarea"]').multiselect('refresh');
          $scope.vprizegotlistConf = res.data;
          $scope.paginationConf = res.data;
        })
      }

      // 根据订单号查询
      $scope.$on('orderid', function (e,v,f) {
      	$model.getorderdetail(f).then(function(res){
      		$scope.vorderdetailConf = res.data;
      	})
      })
      
    }]
  };

  return integralHistoryController;
});