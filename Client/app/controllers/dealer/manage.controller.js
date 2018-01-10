/**
 * Author: hanzha
 * Create Date: 2017-11-18
 * Description: 经销商管理
 */

define([], function () {
  var manageController = {
    ServiceType: 'controller',
    ServiceName: 'dealerManageCtrl', // zha: 对应html的<div ng-controller="manageCtrl">
    ViewModelName: 'dealerManageModel', // zha: 对应model，下面的第三个参数也是model
    ServiceContent: ['$rootScope', '$scope', '$location', 'dealerManageModel', 'dateFormatFilter', function ($rootScope, $scope, $location, $model, dateFormatFilter) {

      $scope.vm = this; // ???

      // 判断是否为提现审核页面跳转过来的
      if(sessionStorage.salerId) {
        // 当前页改为详情
        $scope.isDetial = true;
        $scope.currentSalerId = sessionStorage.salerId

        // 顶部详情
        $model.getSalerDetail({salerId: $scope.currentSalerId}).then(function(res) {
          $scope.detialInfoConf = res.data;
        })

        getTeamList(1, true);

        sessionStorage.removeItem('salerId') // 进入详情页后，移除salerId，防止下次刷新再进入
        $scope.fromPage = 'presentaudit';
      }


      // 获取指令的html结构的作用域（指定一个容器）
      var scope = function (selector) {
        return angular.element(selector).scope()
      }


      // 监听省
      $scope.$watch("vm.selectProvince", function(n){
        if(n) {
          $scope.provinceName = n.name;
          $scope.provinceId = n.code;
          // 省份change
          $model.getManageCity({parentCode: $scope.provinceId}).then(function (res) {
            $scope.manageCityList = res.data;
            $scope.vm.selectCity = '';
            $scope.vm.selectCountry = '';
          });
        } else {
          $scope.provinceName = '';
          $scope.provinceId = '';
        }
      })
      // 监听市
      $scope.$watch("vm.selectCity", function(n){
        if(n) {
          $scope.cityName = n.name;
          $scope.cityId = n.code;
          // 城市change，获取区/县
          $model.getManageCountry({parentCode: $scope.cityId}).then(function (res) {
            $scope.manageCountryList = res.data;
            $scope.vm.selectCountry = '';
          });
        } else {
          $scope.cityName = '';
          $scope.cityId = '';
        }
      })
      // 监听区
      $scope.$watch("vm.selectCountry", function(n){
        if(n) {
          $scope.areaName = n.name;
          $scope.areaId = n.code;
        } else {
          $scope.areaName = '';
          $scope.areaId = '';
        }
      })

      // 获取table列表
      function getList(page, ispage) {
        var data = {
          accountStatus: $scope.vm.selectStatus || '', // 状态
          provinceName: $scope.provinceName || '',
          cityName: $scope.cityName || '',
          areaName: $scope.areaName || '',
          orderBy: $scope.orderBy || 1,
          currentPageNumber: page || 1,
          pageSize: 10
        };

        // 根据关键词搜索条件，传不同数据
        if($scope.vm.keysKey == 'salerName') {
          data.salerName = $scope.vm.keysVal || ''; // 姓名
        } else if($scope.vm.keysKey == 'phoneNo') {
          data.phoneNo = $scope.vm.keysVal || ''; // 手机号
        } else if($scope.vm.keysKey == 'wxOpenId') {
          data.wxOpenId = $scope.vm.keysVal || ''; // 微信ID
        }

        $model.getManageList(data).then(function(res) {
          $scope.manageConf = res.data; // zha: 这里manageenseConf是指令的属性的值，但是属于controller下；conf传一些配置到模板，改变后会重新渲染模板
          // 是否刷新页码
          if(ispage) {
            $scope.paginationConf = res.data;
            $scope.indexPaginationConf = res.data; // 记录下来首页的分页数据，因为详情页的分页数据会覆盖它。
          }
        })
      }

      // 刚进入页面
      getList(1, true);

      // 省
      $model.getManageProvince().then(function (res) {
        $scope.manageProvinceList = res.data;
      });


      // 点击搜索
      $scope.search = function (e) {
        getList(1, true);
      }

      // 重置
      $scope.reset = function () {
        $scope.vm.selectStatus = ''; // 状态

        $scope.vm.selectProvince = '';
        $scope.vm.selectCity = '';
        $scope.vm.selectCountry = '';

        $scope.provinceName = '';
        $scope.provinceId = '';
        $scope.cityName = '';
        $scope.cityId = '';
        $scope.areaName = '';

        $scope.manageCityList = '';
        $scope.manageCountryList = '';

        $scope.vm.keysKey = 'salerName';
        $scope.vm.keysVal = '';
        getList(1, true);
      }


      // 排序
      $scope.$on('orderBy', function (e, v, f) {
        $scope.orderBy = f.orderBy;
        getList(1, true);
      })

      // 启用、禁用
      $scope.$on('startManage', function (e, v, f) {
        $scope.startConfirmData = f;
        // 根据启用、禁用来显示对应弹窗的文字
        if(f.accountStatus == '1') {
          $scope.isStart = true;
        } else {
          $scope.isStart = false;
        }
      })

      // 审核通过  确认点击
      $scope.startConfirm = function() {
        var f = $scope.startConfirmData;

        $model.updateSalers(f).then(function(res) {
          // 审核成功后刷新列表
          getList($scope.paginationConf.data.page.currentPageNumber);
          // 隐藏弹窗
          $('.start-manage-modal').modal('hide');
        })
      }

      // 获取活动列表
      $scope.$on('frompagechange', function (e, v, f) {
        // 自定义指令的scope
        var direScope = scope('.dealer-manage-detial');
        if($scope.isDetial == true) {
          if(direScope.currentPage == 'team') {
            getTeamList(f.currentPageNumber, true);
          } else if(direScope.currentPage == 'commission') {
            getCommissionList(f.currentPageNumber, true);
          } else if(direScope.currentPage == 'withdraw') {
            getWithdrawList(f.currentPageNumber, true);
          } else if(direScope.currentPage == 'orders') {
            getOrdersList(f.currentPageNumber, true);
          }
        } else {
          getList(f.currentPageNumber, true);
        }
      })


      // 查看详情点击
      $scope.$on('viewManage', function (e, v, f) {
        // 当前页改为详情
        $scope.isDetial = true;
        $scope.currentSalerId = f.salerId;

        // 顶部详情
        $model.getSalerDetail({salerId: $scope.currentSalerId}).then(function(res) {
          $scope.detialInfoConf = res.data;
        })

        getTeamList(1, true);
      })


      // TA的团队 - 获取table列表
      function getTeamList(page, ispage) {
        var data = {
          salerId: $scope.currentSalerId || '', // 状态
          orderBy: $scope.teamOrderBy,
          currentPageNumber: page || 1,
          pageSize: 10
        };

        $model.getTeamList(data).then(function(res) {
          $scope.detialTeamConf = res.data;
          // 是否刷新页码
          if(ispage) {
            $scope.paginationConf = res.data;
          }
        })
      }

      // 佣金明细 - 获取table列表
      function getCommissionList(page, ispage) {
        // 自定义指令的scope
        var direScope = scope('.dealer-manage-detial');
        var data = {
          source: direScope.vm.selectType || 0, // 佣金来源
          salerId: $scope.currentSalerId || '', // 状态
          startTime: direScope.vm.startTime || '', //
          endTime: direScope.vm.endTime || '', //
          currentPageNumber: page || 1,
          pageSize: 10
        };
        // 选择团队返佣时，才发这个
        if(direScope.vm.selectType == 2) {
          data.teamSalerId = direScope.vm.selectName || 0; // 我的团队中的某个人的id
        } else {
          delete data.teamSalerId; // 不传，传了报错
        }

        $model.getMyCommission(data).then(function(res) {
          $scope.detialTeamConf = res.data;
          // 是否刷新页码
          if(ispage) {
            $scope.paginationConf = res.data;
          }
        })
      }

      // 提现记录 - 获取table列表
      function getWithdrawList(page, ispage) {
        // 自定义指令的scope
        var direScope = scope('.dealer-manage-detial');
        var data = {
          salerId: $scope.currentSalerId || '', //
          appStatus: direScope.vm.appStatus || 0, // 提现状态
          startTime: direScope.vm.startTime || '', //
          endTime: direScope.vm.endTime || '', //
          currentPageNumber: page || 1,
          pageSize: 10
        };

        $model.getMyWithDraw(data).then(function(res) {
          $scope.detialTeamConf = res.data;
          // 是否刷新页码
          if(ispage) {
            $scope.paginationConf = res.data;
          }
        })
      }

      // 推广订单明细 - 获取table列表
      function getOrdersList(page, ispage) {
        // 自定义指令的scope
        var direScope = scope('.dealer-manage-detial');
        var data = {
          salerId: $scope.currentSalerId || '', //
          appStatus: direScope.vm.orderStatus || 0, // 支付状态
          startTime: direScope.vm.startTime || '', //
          endTime: direScope.vm.endTime || '', //
          currentPageNumber: page || 1,
          pageSize: 10
        };

        $model.getMyOrders(data).then(function(res) {
          $scope.detialTeamConf = res.data;
          // 是否刷新页码
          if(ispage) {
            $scope.paginationConf = res.data;
          }
        })
      }

      // TA的团队 - 团队排序
      $scope.$on('teamOrderBy', function (e, v, f) {
        $scope.teamOrderBy = f.orderBy;
        getTeamList(1, true);
      })

      // 详情 - 导航点击
      $scope.$on('detialNav', function (e, v, f) {
        // 自定义指令的scope
        var direScope = scope('.dealer-manage-detial');
        // 判断当前nav页
        if(f == 'team') {
          direScope.currentPage = 'team';
          getTeamList(1, true);
        } else if(f == 'commission') {
          direScope.currentPage = 'commission';
          getCommissionList(1, true);
        } else if(f == 'withdraw') {
          direScope.currentPage = 'withdraw';
          getWithdrawList(1, true);
        } else if(f == 'orders') {
          direScope.currentPage = 'orders';
          getOrdersList(1, true);
        }

        // 点击导航清空日历
        direScope.vm.startTime = ''
        direScope.vm.endTime = ''

        // 时间设置
        $("#durationStart").datetimepicker({
          format: 'yyyy-mm-dd hh:ii:00',
          language: 'zh-CN',
          todayBtn:  1,
          autoclose: 1,
          todayHighlight: 1
        }).on('change', function (e) {
          var startTime = e.target.value;
          var endTime = direScope.vm.endTime;
          if (endTime < startTime) {
            direScope.vm.endTime = '';
            $scope.$apply();
          }
        });

        $("#durationEnd").datetimepicker({
          format: 'yyyy-mm-dd hh:ii:00',
          language: 'zh-CN',
          todayBtn:  1,
          autoclose: 1,
          todayHighlight: 1
        }).on('change', function (e) {
          var endTime = e.target.value;
          var startTime = direScope.vm.startTime;
          if (startTime > endTime) {
            direScope.vm.startTime = '';
            $scope.$apply();
          }
        });
      })

      // 佣金明细 - 佣金来源change
      $scope.$on('sourceChage', function (e, v, f) {
        // 自定义指令的scope
        var direScope = scope('.dealer-manage-detial');

        // 是否显示团队列表
        if(direScope.vm.selectType == '2') {
          direScope.sourceIsTeam = true;
          // 获取我的团队列表
          $model.getMyTeam({salerId: $scope.currentSalerId}).then(function(res) {
            direScope.myTeamList = res.data;
          })
        } else {
          direScope.sourceIsTeam = false;
        }
      })

      // 详情 - 佣金明细 - 查询
      $scope.$on('detialSearch', function (e, v, f) {
        // 自定义指令的scope
        var direScope = scope('.dealer-manage-detial');
        if(direScope.currentPage == 'team') {
          getTeamList(1, true);
        } else if(direScope.currentPage == 'commission') {
          getCommissionList(1, true);
        } else if(direScope.currentPage == 'withdraw') {
          getWithdrawList(1, true);
        } else if(direScope.currentPage == 'orders') {
          getOrdersList(1, true);
        }
      })


      // 返回列表
      $scope.$on('backList', function (e, v, f) {
        if($scope.fromPage == 'presentaudit') {
          $location.path('view/dealer/presentaudit');
          $scope.fromPage == 'manage';
        } else {
          // 当前页改为详情
          $scope.isDetial = false;
          $scope.paginationConf = $scope.indexPaginationConf;
        }
      })
    }]
  }

  return manageController
})