/**
 * Author: kuang
 * Create Date: 2017-07-18
 * Description: realPrizeGotHistory
 */

define([], function () {
  var mPrizeGotHistoryController = {
    ServiceType: 'controller',
    ServiceName: 'mPrizeGotHistoryCtrl',
    ViewModelName: 'mPrizeGotHistoryModel',
    ServiceContent: ['$rootScope', '$scope', 'mPrizeGotHistoryModel', 'dateFormatFilter', function ($rootScope, $scope, $model, dateFormatFilter) {

      $("#durationStart").datetimepicker({
        format: 'yyyy-mm-dd hh:ii',
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
        format: 'yyyy-mm-dd hh:ii',
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

      // 一进入页面调用
      $model.getprizelist({
        realThing: 1
      }).then(function(res) {
        $scope.prizegotlistConf = res.data;
        $scope.paginationConf = res.data;
      })

    	// 获取领奖明细
      $scope.$on('frompagechange', function (e, v, f) {
        var data = {
          orderCode: $scope.orderCode || '',
          brandCodeArr : $scope.selectAllBrands || [],
          unitArr: $scope.selectSpeci || [],
          areaCodes: $scope.allarea || [],
          keys: $scope.keysval || '',
          realThing: 1,
          status: $scope.statusVal || '', //活动状态
          orderStatus: $scope.orderstatus || '',
          stime: $scope.startTime || '',
          etime: $scope.endTime || ''
        };
        var target = Object.assign({}, f, data);
        $model.getprizelist(target).then(function(res) {
          $scope.prizegotlistConf = res.data;
          $scope.paginationConf = res.data;
        })
      })

      // 操作面板，根据品牌获取规格
      $('.brand').one('click', function () {
        $model.getAllBrands().then(function(res) {
          $scope.allBrands = res.data.data;
        })
      })

      $scope.$watch('selectAllBrands', function(n, o, s) {
        if (n !== o) {
          $scope.selectAllBrands = n;
          var brandListArrObj = {};
          brandListArrObj.brandCode = n;
          $model.getProductList(brandListArrObj).then(function (res) {
            $scope.speci = res.data.data;
            // 给一个默认的初始值
            var default_val = $('[ng-model="selectSpeci"]').find('option:first').val();
            $scope.selectSpeci = default_val;
          })
        }
      })

      // 操作面板，获取发货状态
      $model.getorderstatus().then(function (res) {
        $scope.orderstatuslist = res.data.data;
      })

      // 操作面板，获取活动状态
      // $model.getActivityStatus().then(function(res) {
      //   $scope.statusList = res.data.data;
      // })

      // 操作面板，点击获取地区
      $('.operation').one('click', '.area', function (e) {
        var f = {parentCode: ''}
        getArea(f, '[ng-model="allarea"]')
      })

      // 获取地区
      function getArea(f, selector, bool) {
        $model.getTierArea(f).then(function (res) {
            var areaData = [];
            var provinceArr = res.data.data.datas;
            if (provinceArr.length != 0) {
              provinceArr.forEach(function (n ,index) {
                var group = {
                    label: n.shortName,
                    value: n.code,
                    children: []
                };
                $model.getTierArea({parentCode: n.code}).then(function(res) {
                    var cityArr = res.data.data.datas;
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
          brandCodeArr : $scope.selectAllBrands || [],
          unitArr: $scope.selectSpeci || [],
          areaCodes: $scope.allarea || [],
          keys: $scope.keysval || '',
          realThing: 1,
          status: $scope.statusVal || '', //活动状态
          orderStatus: $scope.orderstatus || '',
          stime: $scope.startTime ? $scope.startTime.match(/:/g).length > 1 ? $scope.startTime.replace($scope.startTime.substr($scope.startTime.lastIndexOf(':') + 1), '00') : $scope.startTime += ':00' : '' || '',
          etime: $scope.endTime ? $scope.endTime.match(/:/g).length > 1 ? $scope.endTime.replace($scope.endTime.substr($scope.endTime.lastIndexOf(':') + 1), '00') : $scope.endTime += ':00' : '' || '',
          currentPageNumber: 1,
          pageSize: 10
        };
        $model.getprizelist(data).then(function(res) {
          $scope.prizegotlistConf = res.data;
          $scope.paginationConf = res.data;
        })
      }

      // 重置
      $scope.reset = function () {
        $scope.form.$setPristine();
        $scope.form.$setUntouched();
        form.reset();
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
          realThing: 1
        }).then(function(res) {
          $('[ng-model="selectAllBrands"]').multiselect('refresh');
          $('[ng-model="selectSpeci"]').multiselect('refresh');
          $('[ng-model="allarea"]').multiselect('refresh');
          $scope.prizegotlistConf = res.data;
          $scope.paginationConf = res.data;
        })
      }

      // 根据订单号查询
      $scope.$on('orderid', function (e,v,f) {
      	$model.getorderdetail(f).then(function(res){
      		$scope.orderdetailConf = res.data;
      	})
      })

      // 导出奖品明细
      $scope.export = function (e) {
        if ($('.mprizegothistory').find('tbody').children().length == 0) {
          return
        }
        var data = {
          orderCode: $scope.orderCode || '',
          brandCodeArr: $scope.selectAllBrands || [],
          sn: $scope.selectSpeci || [],
          areaCodes: $scope.allarea || [],
          keys: $scope.keysval || '',
          realThing: 1,
          status: $scope.statusVal || '', //活动状态
          orderStatus: $scope.orderstatus || '',
          stime: $scope.startTime || '',
          etime: $scope.endTime || ''
        };
        var url = "/api/tztx/saas/saotx/order/exportOrder";

        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        for(var attr in data) {
            formData.append(attr, data[attr]);
        }
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
        xhr.open('POST', url, true);
        xhr.responseType = "blob";
        xhr.responseType = "arraybuffer"
        xhr.setRequestHeader("token", sessionStorage.getItem('access_token'));
        xhr.setRequestHeader("loginId", sessionStorage.getItem('access_loginId'));
        xhr.onload = function(res) {
            if (this.status == 200) {
                var blob = new Blob([this.response], {type: 'application/vnd.ms-excel'});
                var respHeader = xhr.getResponseHeader("Content-Disposition");
                var fileName = decodeURI(respHeader.match(/filename=(.*?)(;|$)/)[1]);
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }
            }
        }
        xhr.send(formData);
      }

      // 导入奖品明细
      $scope.change = function () {
        // importPrizeDetail
        var files = event.target.files[0];
        var formData = new FormData();
        formData.append('file', files);
        $.ajax({
          url: '/api/tztx/saas/saotx/order/readOrderData',
          type: 'POST',
          cache: false,
          data: formData,
          processData: false,
          contentType: false,
          headers: {
              ContentType: "multipart/form-data",
              loginId : sessionStorage.access_loginId,
              token : sessionStorage.access_token
          }
        }).done(function (res) {
          if (res.message === 'success') {
            alert('文件导入成功');
            return
          }
        }).fail(function (res) {
          alert('文件只能导入excle格式，此次导入失败，请重试');
          return
        })
      }

    }]
  };

  return mPrizeGotHistoryController;
});