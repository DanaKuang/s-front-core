/**
 * Author: hanzha
 * Create Date: 2017-11-18
 * Description: 经销商审核
 */

define([], function () {
  var reviewController = {
    ServiceType: 'controller',
    ServiceName: 'reviewCtrl', // zha: 对应html的<div ng-controller="reviewCtrl">
    ViewModelName: 'reviewModel', // zha: 对应model，下面的第三个参数也是model
    ServiceContent: ['$rootScope', '$scope', 'reviewModel', 'dateFormatFilter', function ($rootScope, $scope, $model, dateFormatFilter) {

      // 获取指令的html结构的作用域（指定一个容器）
      var scope = function (selector) {
        return angular.element(selector).scope()
      }

      // 获取table列表
      function getList(page, ispage) {
        var data = {
          appStatus: $scope.selectStatus || '', // 状态
          provinceId: $scope.selectProvince || '',
          cityId: $scope.selectCity || '',
          areaId: $scope.selectCountry || '',
          currentPageNumber: page || 1,
          pageSize: 10
        };

        // 根据关键词搜索条件，传不同数据
        if($scope.keysKey == 'salerName') {
          data.salerName = $scope.keysVal || ''; // 姓名
        } else if($scope.keysKey == 'phoneNo') {
          data.phoneNo = $scope.keysVal || ''; // 手机号
        } else if($scope.keysKey == 'wxOpenId') {
          data.wxOpenId = $scope.keysVal || ''; // 微信ID
        }

        $model.getReviewList(data).then(function(res) {
          console.log(res)
          $scope.reviewConf = res.data; // zha: 这里reviewenseConf是指令的属性的值，但是属于controller下；conf传一些配置到模板，改变后会重新渲染模板
          // 是否刷新页码
          if(ispage) {
            $scope.paginationConf = res.data;
          }
        })
      }

      // 刚进入页面
      getList(1, true);

      // 省
      $model.getReviewProvince().then(function (res) {
        $scope.reviewProvinceList = res.data;
      });

      // 省份change
      $scope.provinceChage = function (e) {
        if($scope.selectProvince != '') {
          // 市
          $model.getReviewCity({parentCode: $scope.selectProvince}).then(function (res) {
            $scope.reviewCityList = res.data;
            $scope.selectCity = '';
            $scope.selectCountry = '';
          });
        }
      }

      // 城市change
      $scope.cityChage = function (e) {
        console.log($scope.selectCity)
        if($scope.selectCity != '') {
          // 区/县
          $model.getReviewCountry({parentCode: $scope.selectCity}).then(function (res) {
            $scope.reviewCountryList = res.data;
            $scope.selectCountry = '';
          });
        }
      }

      // 点击搜索
      $scope.search = function (e) {
        getList(1, true);
      }

      // 重置
      $scope.reset = function () {
        $scope.selectStatus = ''; // 状态
        $scope.selectProvince = '';
        $scope.selectCity = '';
        $scope.selectCountry = '';
        $scope.keysKey = 'salerName';
        $scope.keysVal = '';
        getList(1, true);
      }

      // 审核
      $scope.$on('passReview', function (e, v, f) {
        $scope.passConfirmData = f;
        $scope.appNote = '';

        // 重置form状态
        $scope.form.$setPristine();
        $scope.form.$setUntouched();
      })

      // 审核通过  确认点击
      $scope.passIsConfirm = function() {
        var f = $scope.passConfirmData;

        if(f.appStatus == 3) {
          f.appNote = $scope.appNote || '';
          // 如果验证成功
          if($scope.form.$valid) {
            $model.approvalSalers(f).then(function(res) {
              // 审核成功后刷新列表
              getList($scope.paginationConf.data.page.currentPageNumber);
              // 隐藏弹窗
              $('.review-modal').modal('hide');
            })
          }
        } else {
          $model.approvalSalers(f).then(function(res) {
            // 审核成功后刷新列表
            getList($scope.paginationConf.data.page.currentPageNumber);
            // 隐藏弹窗
            $('.review-modal').modal('hide');
          })
        }
      }

      // 输入不通过理由
      $scope.textareaChage = function() {
        $scope.textareaNum = $scope.appNote.length;
      }

      // 获取活动列表
      $scope.$on('frompagechange', function (e, v, f) {// zha: 如果点击了分页导航;  $on监听和接收数据(接收event与data)
        getList(f.currentPageNumber, true);
      })

    }]
  }

  return reviewController
})