/**
 * Author: hanzha
 * Create Date: 2017-09-14
 * Description: 广告管理controller
 */

define([], function () {
  var adssourceController = {
    ServiceType: 'controller',
    ServiceName: 'adssourceCtrl', // zha: 对应html的<div ng-controller="adssourceCtrl">
    ViewModelName: 'adssourceModel', // zha: 对应model，下面的第三个参数也是model
    ServiceContent: ['$rootScope', '$scope', 'adssourceModel', 'dateFormatFilter', function ($rootScope, $scope, $model, dateFormatFilter) {

      // 获取指令的html结构的作用域（指定一个容器）
      var scope = function (selector) {
        return angular.element(selector).scope()
      }

      function getList(page, ispage) {
        // 刚进入页面
        var data = {
          status: $scope.selectStatus || '', // 状态
          keys: $scope.keysVal || '',
          currentPageNumber: page,
          pageSize: 10
        };
        $model.getAdsSourceList(data).then(function(res) {
          $scope.adssourceConf = res.data; // zha: 这里adsenseConf是指令的属性的值，但是属于controller下；conf传一些配置到模板，改变后会重新渲染模板
          if(ispage) {
            $scope.paginationConf = res.data;
          }
        })
      }
      getList(1, true);

      // 编辑活动，
      // zha: e,v,d; - - e为event事件参数(这个事件是editAds)，v为event(事件对象，$emit那边触发的事件，比如点击)，d为在$emit里传过来的data； 本来只需要event、data，但是emit传过来三个参数。
      // zha: $on监听的是editAds这个事件。 猜想：点击事件触发一次，就会$emit一次editAds，然后$on就监听到了。
      // 对应：scope.$emit('editAds', event, {activityCode: e.target.dataset.id})
      $scope.$on('editAds', function (e, v, d) {
        $scope.clickType = 'edit';
        // 自定义指令的scope
        var direScope = scope('.adsnew-list');
        direScope.isDisabled = false; // 设置input可用
        $scope.modalType = false; // 表示弹窗为编辑或查看，而不是新增
        direScope.isView = false; // 表示弹窗为编辑，而不是查看
        direScope.isShow = true; // 设置图片的关闭按钮隐藏

        // 重置form状态，提交、失去焦点
        direScope.form.$setPristine();
        direScope.form.$setUntouched();

        // 点击编辑获取当前点击对象对应的数据
        $model.getAdsInfo(d).then(function(res){
          editViewModal(res, 'edit');
        })
      })


      // 新建广告按钮点击
      $scope.newAdsClick = function(e) {
        $scope.clickType = 'new';
        // 自定义指令的scope
        var direScope = scope('.adsnew-list');
        direScope.isDisabled = false; // 设置input可用
        $scope.modalType = true;
        direScope.isView = false;
        direScope.isShow = true; // 设置图片的关闭按钮隐藏

        // 重置form状态
        direScope.form.$setPristine();
        direScope.form.$setUntouched();

        // 初始化表单值
        direScope.adCode = ''; // 编码
        direScope.id = '';
        direScope.adsName = '' // 名称
        direScope.adsSort = ''; // 优先级
        direScope.adUrl = ''; // 链接
        direScope.adsImage = ''; // 图片
        direScope.adsEnabled = ''; // 是否启用本广告
        direScope.adsType = true; // 类型
        // 设置日历
        direScope.startTime = '';
        direScope.endTime = '';
        // $('.datetimepicker').remove();

        // 时间设置
        editViewModal('', 'new');
      }

      // 新增、编辑保存
      $scope.$on('createAds', function (e, v, ads) {
        // 自定义指令的scope
        var direScope = scope('.adsnew-list');

        // 如果验证成功
        if(direScope.form.$valid) {
          // 广告类型
          if(direScope.adsType) {
            var adType = 1
          } else {
            var adType = 2
          }

          if(direScope.adsEnabled) { // 是否启用本广告，0是停用，1是启用，2 待启用
            var adStatus = 1
          } else {
            var adStatus = 2
          }

          if($scope.clickType == 'new') {
            // 新增保存
            if(direScope.adsType) {
              var data = {
                // 新增不传adCode、id
                adName: direScope.adsName || '', // 名称
                stime: direScope.startTime || '', // 开始时间
                etime: direScope.endTime || '', // 结束时间
                adPic: direScope.adsImage || '', // 图片地址
                attachCode: direScope.attachCode || '', //图片编码
                idx: direScope.adsSort || '', // 优先级
                adType: adType, // 广告类型
                adUrl: ads.adUrl || '', // 链接
                status: adStatus
              };
            } else {
              var data = {
                // 新增不传adCode、id
                adName: direScope.adsName || '', // 名称
                stime: direScope.startTime || '', // 开始时间
                etime: direScope.endTime || '', // 结束时间
                adPic: direScope.adsImage || '', // 图片地址
                attachCode: direScope.attachCode || '', //图片编码
                idx: direScope.adsSort || '', // 优先级
                adType: adType, // 礼品
                giftId: direScope.giftId,
                cardNo: direScope.cardNo,
                cardNum: ads.cardNum,
                status: adStatus
              };
            }
          } else {
            if(direScope.adsType) {
              // 编辑保存时传给接口的数据对象
              var data = {
                // 新增不传adCode、id
                adCode: direScope.adCode || '',
                id: direScope.id || '',
                adName: direScope.adsName || '', // 名称
                stime: direScope.startTime || '', // 开始时间
                etime: direScope.endTime || '', // 结束时间
                adPic: direScope.adsImage || '', // 图片地址
                attachCode: direScope.attachCode || '', //图片编码
                idx: direScope.adsSort || '', // 优先级
                adType: adType, // 广告类型
                adUrl: ads.adUrl || '', // 链接
                status: adStatus
              };
            } else {
              // 编辑保存时传给接口的数据对象
              var data = {
                // 新增不传adCode、id
                adCode: direScope.adCode || '',
                id: direScope.id || '',
                adName: direScope.adsName || '', // 名称
                stime: direScope.startTime || '', // 开始时间
                etime: direScope.endTime || '', // 结束时间
                adPic: direScope.adsImage || '', // 图片地址
                attachCode: direScope.attachCode || '', //图片编码
                idx: direScope.adsSort || '', // 优先级
                adType: adType, // 广告类型
                giftId: direScope.giftId,
                cardNo: direScope.cardNo,
                cardNum: ads.cardNum,
                status: adStatus
              };
            }
          }

          // zha: 表单数据data作为搜索条件传入$model.getAdsSourceList
          $model.editAds(data).then(function(res) {
            if(res.status == '200') {
              if($scope.clickType == 'new') {
                getList($scope.paginationConf.data.page.currentPageNumber || 1, true);
              } else {
                getList($scope.paginationConf.data.page.currentPageNumber || 1);
              }

              $('.create-ads-modal').modal('hide');
            } else {
              alert(res.data.message);
            }
          })
        } else {
          return;
        }
      })

      // 获取活动列表
      $scope.$on('frompagechange', function (e, v, f) {// zha: 如果点击了分页导航;  $on监听和接收数据(接收event与data)
        getList(f.currentPageNumber || 1, true);
      })

      // zha: $watch监听selectStatus这个ng-model（select值）是否变化，n新值，o旧值，s是作用域scope
      // $scope.$watch('selectStatus', function(n, o, s) {
      //   if (n !== o) {
      //     $scope.selectStatus = n;
      //   }
      // })

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
        $scope.selectStatus = '';
        $scope.keysVal = '';

        // zha: 上面初始化值后，调取列表和分页接口，只传1和15，上面搜索传的是获取的所有值。
        $model.getAdsSourceList({
          currentPageNumber:1,
          pageSize: 10
        }).then(function(res) {
          // $('[ng-model="selectAllBrands"]').multiselect('refresh');
          $scope.adssourceConf = res.data;
          $scope.paginationConf = res.data;
        })
      }

      // 启用、终止
      $scope.$on('startDisableSource', function (e, v, f) {
        $model.startDisableAds(f).then(function () {
          getList($scope.paginationConf.data.page.currentPageNumber || 1);
        });
      })

      // 查看
      $scope.$on('viewSource', function (e, v, d) {
        // 自定义指令的scope
        var direScope = scope('.adsnew-list');
        $scope.modalType = false; // 表示弹窗为编辑或查看，而不是新增
        direScope.isView = true; // 表示弹窗为查看，而不是编辑
        direScope.isDisabled = true; // 设置input不可用
        direScope.isShow = true; // 设置图片的关闭按钮隐藏

        // 重置form状态
        direScope.form.$setPristine();
        direScope.form.$setUntouched();

        // 点击编辑获取当前点击对象对应的数据
        $model.getAdsInfo(d).then(function(res){
          editViewModal(res, 'view')
        })
      })

      // 获取礼品列表
      $scope.$on('getGiftList', function (e, v, d){
        var data = {
          metraType: 'gift',
          currentPageNumber: 1,
          pageSize: 5
        }
        $model.giftAds(data).then(function(res){
          $scope.adsgiftConf = res.data;
          $scope.paginationInnerConf = res.data;
        })
      })
      // 礼品列表翻页,5条数据的就是fromhbpagechange，固定的。
      $scope.$on('fromhbpagechange', function(e, v, f) {
        var data = {
          metraType: 'gift',
          currentPageNumber: f.currentPageNumber,
          pageSize: 5
        }
        $model.giftAds(data).then(function (res) {
          $scope.adsgiftConf = res.data;
          $scope.paginationInnerConf = res.data;
        })
      })

      // 选择礼品
      $scope.$on('adsgiftchecked', function (e, v, d){
        // 自定义指令的scope
        var direScope = scope('.adsnew-list');
        direScope.imgshow = true;
        // 获取礼品id
        direScope.giftId = d.giftId;
        direScope.cardNo = d.cardNo;

        // 设置礼品图
        direScope.giftPic = d.giftPic;
        direScope.giftName = d.giftName;
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
          var direScope = scope('.adsnew-list');
          direScope.attachCode = data.attachCode; //图片编码
          direScope.adsImage = data.accessUrl; //图片保存地址

          direScope.adsImageShow = true;
          $scope.$apply();

          // 格式不正确等报错
          if(res.ret != '200000') {
            alert(res.message);
          }
        }).fail(function (res) {
          console.log('文件上传失败，请重试');
          return
        })
      })

      // 公用代码
      function editViewModal(res, type) {
        // 自定义指令的scope
        var direScope = scope('.adsnew-list');

        if(type == 'edit' || type == 'view') {
          $scope.editAdsModalConf = res.data; //conf传一些配置到模板
          var data = res.data.data;
          direScope.ads = data;

          // 根据接口数据，设置各项的值
          direScope.adCode = data.adCode; // 编码
          direScope.id = data.id;
          direScope.adsName = data.adName; // 名称
          direScope.adsSort = data.idx; // 优先级
          direScope.ads.adUrl = data.adUrl; // 链接

          direScope.attachCode = data.attachCode; // 图片编码
          // direScope.adsImage = data.adPic; // 图片
          // 如果有广告图
          if(data.adsImage != '') {
            // 显示礼品图和name
            direScope.adsImageShow = true;
            direScope.adsImage = data.adPic;
          } else {
            direScope.adsImageShow = false;
          }

          if(data.status == 1) { // 是否启用本广告，0是停用，1是启用，2是待启用
            direScope.adsEnabled = true; // 类型
          } else {
            direScope.adsEnabled = false; // 类型
          }

          if(data.adType == 1) {
            direScope.adsType = true; // 类型
          } else {
            direScope.adsType = false; // 类型

            // 如果有礼品
            if(data.giftId != '') {
              // 显示礼品图和name
              direScope.imgshow = true;
              direScope.giftPic = data.giftPic;
              direScope.giftName = data.giftName;
              direScope.giftId = data.giftId;
              direScope.cardNo = data.cardNo;
              // 获取不到数量，所以用了这种方式，加点  .
              direScope.ads.cardNum = data.cardNum;
            } else {
              direScope.imgshow = false;
            }
          }

          // 设置日历
          direScope.startTime = data.stime || '';
          direScope.endTime = data.etime || '';
        }

        if(type == 'new') {
          direScope.adsImageShow = false;
          direScope.imgshow = false;
          direScope.ads = {};
          direScope.ads.cardNum = '';
        }

        if(type == 'edit' || type == 'new') {
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

  return adssourceController
})