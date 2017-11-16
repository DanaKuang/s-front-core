/**
 * Author: hanzha
 * Create Date: 2017-11-10
 * Description: 广告位管理
 */

define([], function () {
  var adsenseController = {
    ServiceType: 'controller',
    ServiceName: 'adsenseCtrl', // zha: 对应html的<div ng-controller="adsenseCtrl">
    ViewModelName: 'adsenseModel', // zha: 对应model，下面的第三个参数也是model
    ServiceContent: ['$rootScope', '$scope', 'adsenseModel', 'dateFormatFilter', function ($rootScope, $scope, $model, dateFormatFilter) {

      // 获取指令的html结构的作用域（指定一个容器）
      var scope = function (selector) {
        return angular.element(selector).scope()
      }

      // 获取table列表
      function getList(page, ispage) {
        var data = {
          orgCode: $scope.selectManufacturer || '', // 厂家
          brandCode: $scope.selectBrands || '', // 品牌
          status: $scope.selectStatus || '', // 状态
          keys: $scope.adName || '',
          currentPageNumber: page,
          pageSize: 10
        }
        $model.getAdsenseList(data).then(function(res) {
          $scope.adsenseConf = res.data; // 这里adsenseConf是指令的属性的值，但是属于controller下
          if(ispage) {
            $scope.paginationConf = res.data;
          }
        })
      }
      getList(1, true);

      $scope.isView = false;// 设置编译弹窗的footer显示，查看时隐藏。

      // 获取广告位列表
      $scope.$on('frompagechange', function (e, v, f) {// zha: 如果点击了分页导航;  $on监听和接收数据(接收event与data)
        getList(f.currentPageNumber || 1, true);
      })

      // 厂家
      $model.getAdsManufacturer().then(function (res) {
        $scope.selectManufacturerList = res.data.data;
        // 自定义指令的scope
        var direScope = scope('.adsenseedit-list');
        direScope.selectManufacturerList = res.data.data;
      });

      // 品牌
      $model.getAdsBrandsList().then(function (res) {
        $scope.selectBrandsList = res.data.data;
        // 自定义指令的scope
        var direScope = scope('.adsenseedit-list');
        direScope.selectBrandsList = res.data.data;
      });

      // 使用状态
      $model.getAdsStatusList().then(function (res) {
        $scope.adsStatusList = res.data.data;
      });

      // 点击搜索
      $scope.search = function (e) {
        getList(1, true);
      }

      // 重置
      $scope.reset = function () {
        $scope.selectManufacturer = '';
        $scope.selectStatus = '';
        $scope.selectBrands = '';
        $scope.adName = '';

        // zha: 上面初始化值后，调取列表和分页接口，只传1和10，上面搜索传的是获取的所有值。
        $model.getAdsenseList({
          currentPageNumber:1,
          pageSize: 10
        }).then(function(res) {
          // $('[ng-model="selectAllBrands"]').multiselect('refresh');
          $scope.adsenseConf = res.data;
          $scope.paginationConf = res.data;
        })
      }

      // 启用、终止
      $scope.$on('startDisableAdsense', function (e, v, f) {
        // 先传id过去，再获取当前最新列表状态。
        $model.startDisableAds(f).then(function () {
          getList($scope.paginationConf.data.page.currentPageNumber || 1)
        });
      })

      // 编辑保存
      $scope.$on('updateAds', function (e, v, f) {
        // 自定义指令的scope
        var direScope = scope('.adsenseedit-list');
        // 如果验证成功
        if(direScope.form.$valid) {
          // 保存时传给接口的数据对象
          var data = {
            // 根据接口数据，设置各项的值
            id: direScope.id || '', // 广告位id
            adOrgCode: direScope.adOrgCode || '', // 投放厂家
            adBrandCode: direScope.adBrandCode || '', // 投放品牌
            stime: direScope.stime || '', // 开始时间
            etime: direScope.etime || '', // 结束时间
            adCode: direScope.adCode || '', // 选择广告
          };

          // zha: 表单数据data作为搜索条件传入$model.getAdsenseList
          $model.editAds(data).then(function(res) {
            getList($scope.paginationConf.data.page.currentPageNumber || 1);

            $('.modal').modal('hide');
          })
        } else {
          return;
        }
      })

      // 基本信息-活动图片上传
      $scope.$on('uploadImage', function (e,v,d) {
        // 这里不从model里设置，而是使用ajax
        $.ajax({
          url: '/api/tztx/saas/saotx/attach/commonAliUpload',
          type: 'POST',
          cache: false,
          data: d,
          processData: false,
          contentType: false,
          headers: {
            ContentType: "multipart/form-data",
            loginId : sessionStorage.access_loginId,
            token : sessionStorage.access_token
          }
        }).done(function (res) {
          var data = res.data;
          // 自定义指令的scope
          var direScope = scope('.adsenseedit-list');
          direScope.attachCode = data.attachCode; //图片编码
          direScope.adsImage = data.accessUrl; //图片保存地址

          if (direScope.accessUrl) {
            // $('.configuration-image').find('.wrong-tip').addClass('hidden');
          } else {
            // $('.configuration-image').find('.wrong-tip').removeClass('hidden');
          }

          // 格式不正确等报错
          if(res.ret != '200000') {
            alert(res.message);
          }
        }).fail(function (res) {
          console.log('文件上传失败，请重试');
          return
        })
      })

      // 多选搜索下拉
      $(document).ready(function () {
        $('.multi .select').multiselect({
          nonSelectedText: '请选择',
          nSelectedText: '已选择',
          includeSelectAllOption: true,
          selectAllText: '全部',
          allSelectedText: '全选',
          enableFiltering: true,
          buttonWidth: '100%',
          maxHeight: '500px',
          numberDisplayed: 1
        });
      })

      // 获取广告列表
      $model.getAdsList().then(function(res){
        // 自定义指令的scope
        var direScope = scope('.adsenseedit-list');
        direScope.selectAdCodeList = res.data.data;

        // 多选搜索下拉
        $('[ng-model="adCode"]').multiselect('dataprovider', _.forEach(direScope.selectAdCodeList, function(v){
          v.label = v.adName;
          v.value = v.adCode;
        }));
        $('[ng-model="adCode"]').multiselect('refresh');
        var default_val = $('[ng-model="adCode"]').find('option:first').val();
        $scope.adCode = default_val;


        // 注意：获取广告列表后，再去进行编辑、查看点击获取数据
        // 查看
        $scope.$on('viewAdsense', function (e, v, d) {
          $scope.isView = true; // 表示弹窗为查看，而不是编辑
          direScope.isDisabled = true; // 设置input不可用

          // 点击编辑获取当前点击对象对应的数据
          $model.getAdsInfo(d).then(function(res){
            editViewModal(res, 'view')
          })
        })

        // 编辑活动，
        $scope.$on('editAds', function (e, v, d) {
          $scope.isView = false; // 表示弹窗为编辑，而不是查看
          direScope.isDisabled = false; // 设置input可用

          // 点击编辑获取当前点击对象对应的数据
          $model.getAdsInfo(d).then(function(res){
            editViewModal(res, 'edit');
          })
        })
      })

      // 查看、编辑的通用代码
      function editViewModal(res, type) {
        $scope.editAdsModalConf = res.data; //conf传一些配置到模板
        var data = res.data.data;
        // 自定义指令的scope
        var direScope = scope('.adsenseedit-list');

        // 重置form状态
        direScope.form.$setPristine();
        direScope.form.$setUntouched();

        // 根据接口数据，设置各项的值
        direScope.id = data.id; // id
        direScope.adSpPosition = data.adSpPosition; // id
        direScope.adOrgCode = data.adOrgCode; // 投放厂家
        direScope.adBrandCode = data.adBrandCode; // 投放品牌
        direScope.adCode = data.adCode; // 选择广告
        // 设置日历
        direScope.stime = data.stime || '';
        direScope.etime = data.etime || '';

        if(type == 'view') {
          $('.multiselect').prop('disabled', true);
        }
        if(type == 'edit') {
          $('.multiselect').prop('disabled', false);
          // 时间设置
          $("#durationStart").datetimepicker({
            format: 'yyyy-mm-dd hh:ii:00',
            language: 'zh-CN',
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1
          }).on('change', function (e) {
            var startTime = e.target.value;
            var endTime = scope.endTime;
            if (endTime < startTime) {
              $scope.endTime = '';
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
            var startTime = scope.startTime;
            if (startTime > endTime) {
              $scope.startTime = '';
              $scope.$apply();
            }
          });
        }
      }
    }]
  }

  return adsenseController
})