/**
 * Author: hanzha
 * Create Date: 2017-11-28
 * Description: [重构]
 */

define([], function () {
  var visitStorageManageCtrl = {
    ServiceType: "controller",
    ServiceName: "visitStorageManageCtrl",
    ViewModelName: 'visitManageModel',
    ServiceContent: ['$rootScope', '$scope', '$timeout', '$location', 'visitManageModel', function ($rootScope, $scope, $timeout, $location, $model) {

      // 初始化一个对象，vm
      $scope.vm = {
        listData: [],
        pageNo: 1,
        pageSize: 10,
        currentPage: 'index'
      }

      $scope.new = {
        brand: '',
        spec: '',
        poolId: '',
        sellerId: '',
        headImg: '',
        shopName: '',
        ownerName: '',
      }

      $scope.detial = {
        sortColumn: 'ssia.ctime',
        sortType: 'desc'
      };

      // 判断是否为 管理返回 跳转过来的
      if(sessionStorage.fromPage) {
        // 当前页改为详情
        $scope.vm.currentPage = 'detial';
        backTop();

        $scope.detial.settingId = sessionStorage.settingId;
        $scope.detial.awardType = sessionStorage.awardType;

        getDetialInfo();
        getDetialInfoList(1, true);

        sessionStorage.removeItem('fromPage');
        sessionStorage.removeItem('settingId');
        sessionStorage.removeItem('awardType');

        // 返回后获取之前搜索数据
        if(sessionStorage.storageDetialData) {
          console.log(sessionStorage.storageDetialData)
          var data = $.parseJSON(sessionStorage.getItem('storageDetialData'));;
          // 获取到的数据放入vm里
          $scope.detial = Object.assign({}, $scope.detial, data);
          sessionStorage.removeItem('storageDetialData');
        }
      }

      // 获取table列表
      function getList(page, ispage) {
        var data = {
          brandCode: $scope.vm.brand || '', // 品牌编码
          sn: $scope.vm.spec || '', // 规格
          activityForm: $scope.vm.actType || '', // 类型
          status: $scope.vm.actStatus || '', // 状态
          startTime: $scope.vm.startTime || '',
          endTime: $scope.vm.endTime || '',
          pageNo: page || 1,
          pageSize: 10
        };

        $model.getStorageManageList(data).then(function(res) {
          if(res.data.ok) {
            $scope.vm.listData = res.data.data.list || [];

            // 是否刷新页码
            if(ispage) {
              $scope.paginationConf = res.data;
              // 因为接口文档定义的字段和原来写的字段不一致，所以这里改变下。
              $scope.paginationConf.data.page.currentPageNumber =  res.data.data.page.pageNo; // 当前页
              $scope.paginationConf.data.page.pageNumber =  res.data.data.page.pageCount; // 页数
            }

            $scope.indexPaginationConf = res.data;
          } else {
            alertMsg($('#newAlert'), 'danger', res.data.msg);
          }
        })
      }

      // 刚进入页面
      getList(1, true);


      // 初始化多选下拉框
      $('.select').multiselect({
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

      // *** 搜索项 start
      // 品牌select
      $model.rebateGetBrands().then(function (res) {
        $scope.brandList = res.data.data;
        $('#brand').multiselect('dataprovider', _.forEach($scope.brandList, function(v){
          v.label = v.name;
          v.value = v.brandCode;
        }));
        $('#brand').multiselect('refresh');

        // new
        $scope.new.brandList = res.data.data;
        $('#newBrand').multiselect('dataprovider', _.forEach($scope.new.brandList, function(v){
          v.label = v.name;
          v.value = v.brandCode;
        }));
        $('#newBrand').multiselect('refresh');
      });

      // 品牌change
      $scope.brandChage = function (v, ele, type) { // $scope.vm.brand, spec, $scope.specList
        if(v != '') {
          // 规格select
          $model.rebateGetSpec({brandCode: v}).then(function (res) {
            if(type = 'new') {
              $scope.specList = res.data.data;
            } else {
              $scope.newSpecList = res.data.data;
            }
            $('#'+ele).multiselect('dataprovider', _.forEach(res.data.data, function(v){
              v.label = v.allName;
              v.value = v.sn;
            }));
            $('#'+ele).multiselect('refresh');
          });
        } else {
          if(type = 'new') {
            $scope.new.specList = [];
          } else {
            $scope.specList = [];
          }
        }
      }

      // 规格select
      $model.rebateGetSpec().then(function (res) {
        $scope.specList = res.data.data;
        $('#spec').multiselect('dataprovider', _.forEach($scope.specList, function(v){
          v.label = v.allName;
          v.value = v.sn;
        }));
        $('#spec').multiselect('refresh');

        $scope.new.specList = res.data.data;
        $('#newSpec').multiselect('dataprovider', _.forEach($scope.new.specList, function(v){
          v.label = v.allName;
          v.value = v.sn;
        }));
        $('#newSpec').multiselect('refresh');
      });

      
      // 活动类型select
      $model.rebateGetActType().then(function (res) {
        $scope.actTypeList = res.data.data;
      });

      // 活动状态select
      $model.rebateGetActStatus().then(function (res) {
        $scope.actStatusList = res.data.data;
      });
      // *** 搜索项 end

      // 搜索
      $scope.search = function (e) {
        getList(1, true);
      }

      // 重置
      $scope.reset = function () {
        var data = {
          brand: [], // 品牌编码
          spec: [], // 规格
          actType: '', // 类型
          actStatus: '',  // 状态
          startTime: '',
          endTime: '',
          pageNo: 1,
          pageSize: 10
        }
        // 获取到的数据放入vm里
        $scope.vm = Object.assign({}, $scope.vm, data);

        $('#brand').multiselect('refresh');
        $('#spec').multiselect('refresh');
        getList(1, true);
      }


      // 启用、禁用
      $scope.setEnabled = function (code, value) {
        $scope.currentId = code;
        $scope.currentStatus = value;
        if(value == 1) {
          $scope.vm.isEnabled = true;
        } else {
          $scope.vm.isEnabled = false;
        }
      }

      // 启用、禁用  确认按钮点击
      $scope.enabledConfirm = function() {
        if($scope.storageForm.$valid) {
          var data = {
            id: $scope.currentId,
            status: $scope.currentStatus,
          }
          $model.setStorageEnabled(data).then(function(res) {
            if(res.data.ok) {
              // 审核成功后刷新列表
              getList($scope.paginationConf.data.page.currentPageNumber);
              // 隐藏弹窗
              $('.storage-modal').modal('hide');
              alertMsg($('#newAlert'), 'success', '设置成功');
            } else {
              alertMsg($('#newAlert'), 'danger', res.data.msg);
            }
          })
        }
      }


      // *** 新增start
      // 新增点击
      $scope.newRetailerClick = function(e) {
        $scope.vm.currentPage = 'new';
        backTop();

        // 初始化数据
        var data = {
          brand: '',
          spec: '',
          specList: '',
          stime: '',
          etime: '',

          poolId: '', // 奖品物料池id
          award: '', // 积分值
          awardNum: '', // 奖品设置数量
          hadSave: false
        }

        $('#newBrand').val('').multiselect('refresh');

        // 规格select
        $model.rebateGetSpec().then(function (res) {
          $scope.new.specList = res.data.data;
          $('#newSpec').multiselect('dataprovider', _.forEach($scope.new.specList, function(v){
            v.label = v.allName;
            v.value = v.sn;
          }));
          $('#newSpec').multiselect('refresh');
        });


        // 获取到的数据放入new里
        $scope.new = Object.assign({}, $scope.new, data);
      }

      // 返回
      var back = function() {
        $scope.vm.currentPage = 'index';
        backTop();

        // 清空数据
        var data = {
          sellerId: '',
          headImg: '',
          shopName: '',
          ownerName: '',
          poolId: '',
          hadSave: false
        }
        $scope.new = Object.assign({}, $scope.new, data);

        // 重置form状态
        $scope.newForm.$setPristine();
        $scope.newForm.$setUntouched();

        if($scope.vm.currentPage == 'new') {
          getList(1, true);
        }
      }
      $scope.new.back = function() {
        back();
      }

      // 积分池列表
      var getScoreList = function(page) {
        var data = {
          metraType: 'integral',
          brandCodes: $scope.new.brand,//
          unitCodes: $scope.new.spec,
          status: 1, //礼品、红包池状态。0-停用；1-正常,
          hasLeft: true, //是否查询有库存的池数据。true-池剩余必须大于0；false或空参则忽略库存数量
          currentPageNumber: page || 1,
          pageSize: 6
        }

        $model.getProductChooseList(data).then(function (res) {
          if(res.data.ret == '200000') {
            $scope.jfChooseList = res.data.data.list;
            $scope.paginationjfInnerConf = res.data;
          } else {
            alertMsg($('#newAlert'), 'danger', res.data.msg);
          }
        })
      }

      // 积分池列表
      $scope.chooseScore = function() {
        if($scope.new.brand == '' || $scope.new.spec == '') {
          alertMsg($('#newAlert'), 'warning', '请先选择投放的品牌和规格');
        } else {
          $('.create-jfProduct-modal').modal('show');
          getScoreList(1);
        }
      }

      // 积分池列表翻页
      $scope.$on('fromjfpagechange', function(e, v, f) {
        getScoreList(f.currentPageNumber);
      })

      // 选择
      $scope.new.choose = function (id) {
        $scope.new.poolId = id;
        $('.create-jfProduct-modal').modal('hide');
      }

      // new保存
      $scope.new.save = function(type){
        // 如果验证通过
        if($scope.newForm.$valid) {
          var data = {
            brandCode: $scope.new.brand || '',
            sn: $scope.new.spec || '',
            stimeStr: $scope.new.stime || '',
            etimeStr: $scope.new.etime || '',

            awardType: 6, // 奖品类型	1-实物礼品；3-红包；6-积分
            poolId: $scope.new.poolId || '', // 奖品物料池id
            score: $scope.new.award == 0 ? 0 : ($scope.new.award || ''), // 积分值
            totalNum: $scope.new.awardNum || '', // 奖品设置数量
          }

          if($scope.vm.currentPage == 'edit') {
            data.id = $scope.new.id;
          }

          $model.newStorage(data).then(function(res) {
            if(res.data.ok) {
              if($scope.vm.currentPage == 'new') {
                var typeInfo = '新建成功'
              } else {
                var typeInfo = '保存成功'
              }

              // 新增保存成功后，直接返回列表。 如果是编辑，还停留在当前页面。并且有  保存并返回按钮。
              if($scope.vm.currentPage == 'new') {
                back();
                getList(1, true);
              } else {
                // 保存并退出
                if(type == 'saveAndBack') {
                  back();
                }
              }

              $scope.new.hadSave = true;

              alertMsg($('#newAlert'), 'success', typeInfo);
            } else {
              alertMsg($('#newAlert'), 'danger', res.data.msg);
            }
          })
        }
      }
      // *** 新增end


      // 返回顶部
      backTop = function() {
        $('.ui-view-container').scrollTop(0);
      }

      // 新建、修改 fixme
      $scope.editStorage = function (id) {
        $scope.vm.currentPage = 'edit';
        backTop();

        // 获取数据
        $model.getStorageDetial({id: id}).then(function(res) {
          if(res.data.ok) {
            // 获取到的数据放入detial里
            $scope.detial = Object.assign({}, $scope.detial, res.data.data);

            // 设置数据
            var data = {
              id: id,
              brand: $scope.detial.brandCode,
              spec: $scope.detial.sn,
              stime: $scope.detial.stimeStr,
              etime: $scope.detial.etimeStr,
              poolId: $scope.detial.poolId,
              // awardType: $scope.detial.awardType,
              award: $scope.detial.score,
              awardNum: $scope.detial.totalNum,
            }
            $scope.new = Object.assign({}, $scope.new, data);

            // 这里用val来设置，因为scope下设置不管用
            $('#newBrand').val($scope.detial.brandCode).multiselect('refresh');

            // 规格select
            $model.rebateGetSpec({brandCode: $scope.detial.brandCode}).then(function (res) {
              $scope.new.specList = res.data.data;
              $('#newSpec').multiselect('dataprovider', _.forEach($scope.new.specList, function(v){
                v.label = v.allName;
                v.value = v.sn;
              }));
              $('#newSpec').val($scope.detial.sn).multiselect('refresh');
            });
          } else {
            alertMsg($('#newAlert'), 'danger', res.data.msg);
          }
        })
      }


      // 查看点击
      $scope.viewStorage = function(id, awardType) {
        // 当前页改为详情
        $scope.vm.currentPage = 'detial';
        $scope.detial.settingId = id;
        $scope.detial.awardType = awardType;
        backTop();

        getDetialInfo();
        getDetialInfoList(1, true);
      }

      // 获取详情信息
      function getDetialInfo() {
        // 当前页改为详情
        $scope.vm.currentPage = 'detial';
        backTop();

        $model.getStorageDetial({id: $scope.detial.settingId}).then(function(res) {
          if(res.data.ok) {
            // 获取到的数据放入detial里
            $scope.detial = Object.assign({}, $scope.detial, res.data.data);
          } else {
            alertMsg($('#newAlert'), 'danger', res.data.msg);
          }
        })
      }

      // 获取详情信息
      function getDetialInfoList(page, ispage) {
        var data = {
          settingId: $scope.detial.settingId || '',
          awardType: $scope.detial.awardType || '',

          shopName: $scope.detial.shopName || '',
          startTime: $scope.detial.startTime ? $scope.detial.startTime+':00' : '',
          endTime: $scope.detial.endTime ? $scope.detial.endTime+':00' : '',

          sortColumn: $scope.detial.sortColumn || 'ssia.ctime', // ssia.ctime 时间, ssia.num 数量
          sortType: $scope.detial.sortType || 'desc', // desc默认降序，asc升序

          pageNo: page || 1,
          pageSize: 10
        }
        $scope.storageDetialData = data;
        
        $model.getStorageDetialList(data).then(function(res) {
          if(res.data.ok) {
            // 获取到的数据放入detial里
            $scope.detial = Object.assign({}, $scope.detial, res.data.data);

            $scope.detial.listData = res.data.data.list || [];

            // 是否刷新页码
            if(ispage) {
              $scope.paginationConf = res.data;
              // 因为接口文档定义的字段和原来写的字段不一致，所以这里改变下。
              $scope.paginationConf.data.page.currentPageNumber =  res.data.data.page.pageNo; // 当前页
              $scope.paginationConf.data.page.pageNumber =  res.data.data.page.pageCount; // 页数
            }
          } else {
            alertMsg($('#newAlert'), 'danger', res.data.msg);
          }
        })
      }

      // 排序
      $scope.detial.previousColumn = 'ssia.ctime';
      $scope.detial.sortBy = function (type) {
        // 设置当前点击的排序
        $scope.detial.sortColumn = type;

        // 获取 sortType； 如果新点击了另一个排序，那就设置为desc。点击同一个，则设置相反的
        if($scope.detial.previousColumn == type) {
          $scope.detial.sortType = ($scope.detial.sortType == 'desc' ? 'asc' : 'desc'); // 升序、降序
        } else {
          $scope.detial.sortType = 'desc';
        }

        getDetialInfoList(1, true);
        // 上一个值设置为当前
        $scope.detial.previousColumn = type;
      }


      // detial 搜索
      $scope.detial.search = function () {
        getDetialInfoList(1, true);
      }

      // detial 重置
      $scope.detial.reset = function () {
        var data = {
          settingId: $scope.detial.settingId,
          shopName: '',
          startTime: '',
          endTime: '',
          startTime: '',
          sortColumn: 'ssia.ctime',
          sortType: 'desc',
          pageNo: 1,
          pageSize: 10
        }
        // 获取到的数据放入detial里
        $scope.detial = Object.assign({}, $scope.detial, data);

        getDetialInfoList(1, true);

        $scope.detial.startTime = '';
        $scope.detial.endTime = '';
      }

      // detial - 返回列表点击
      $scope.detial.back = function() {
        $scope.vm.currentPage = 'index';
        $scope.paginationConf = $scope.indexPaginationConf;
        backTop();
      }

      // detial - 查看详情
      $scope.detial.view = function(sellerId, settingId, awardType) {
        sessionStorage.setItem('storageId', sellerId);
        sessionStorage.setItem('settingId', settingId);
        sessionStorage.setItem('awardType', awardType);
        sessionStorage.setItem('storageDetialData', JSON.stringify($scope.storageDetialData));
        $location.path('view/visit/manage');
        backTop();
      }



      // 弹窗框
      var alertMsg = function(e, t, i) { // e为元素，t为类型，i为信息
        var promptCon = e.clone();

        if(t == 'success') { // 成功
          e.addClass('alert-success');
        } else if(t == 'warning') { // 警告
          e.addClass('alert-warning');
        } else if(t == 'danger') { // 错误
          e.addClass('alert-danger');
        }

        e.find('.prompt').text(i || '请求错误请重试');
        e.show().addClass('in');

        // 克隆的再放进body
        e.on('closed.bs.alert', function () {
          $('body').append(promptCon);
        })

        // 3秒后隐藏
        var alertHide = $timeout(function(){
          e.alert('close')
        }, 3000)

        e.hover(function() {
          $timeout.cancel(alertHide);
        }, function() {
          // 3秒后隐藏
          var alertHide = $timeout(function(){
            e.alert('close')
          }, 3000)
        })
      }

      // 监视paginationConf变化更新page
      $scope.$watch('paginationConf', function () {
        // 属性赋值
        if ($scope.paginationConf && $scope.paginationConf.data) {
          var page = $scope.paginationConf.data.page;
          $scope.totalCount = page.count;
          $scope.size = page.count - page.start > page.pageSize ? page.pageSize : page.count - page.start;
          $scope.curPage = page.currentPageNumber; // 当前页
          $scope.pageNumber = page.pageNumber; // 页数
        }
      }, true);

      // 分页点击
      $scope.$on('frompagechange', function (e, v, f) {
        getList(f.currentPageNumber, true);
      })

      // 时间设置
      $("#durationStart").datetimepicker({
        format: 'yyyy-mm-dd hh:ii:00',
        language: 'zh-CN',
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1
      }).on('change', function (e) {
        var startTime = e.target.value;
        var endTime = $scope.vm.endTime;
        if (endTime < startTime) {
          $scope.vm.endTime = '';
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
        var startTime = $scope.vm.startTime;
        if (startTime > endTime) {
          $scope.vm.startTime = '';
          $scope.$apply();
        }
      });

      // 时间设置
      $("#detialStart").datetimepicker({
        format: 'yyyy-mm-dd hh:ii:00',
        language: 'zh-CN',
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1
      }).on('change', function (e) {
        var startTime = e.target.value;
        var endTime = $scope.detial.endTime;
        if (endTime < startTime) {
          $scope.detial.endTime = '';
          $scope.$apply();
        }
      });

      $("#detialEnd").datetimepicker({
        format: 'yyyy-mm-dd hh:ii:00',
        language: 'zh-CN',
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1
      }).on('change', function (e) {
        var endTime = e.target.value;
        var startTime = $scope.detial.startTime;
        if (startTime > endTime) {
          $scope.detial.startTime = '';
          $scope.$apply();
        }
      });

      // 时间设置
      $("#newStart").datetimepicker({
        format: 'yyyy-mm-dd hh:ii:00',
        language: 'zh-CN',
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1
      }).on('change', function (e) {
        var appStartTime = e.target.value;
        var appEndTime = $scope.new.etime;
        if (appEndTime < appStartTime) {
          $scope.new.etime = '';
          $scope.$apply();
        }
      });

      $("#newEnd").datetimepicker({
        format: 'yyyy-mm-dd hh:ii:00',
        language: 'zh-CN',
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1
      }).on('change', function (e) {
        var appEndTime = e.target.value;
        var appStartTime = $scope.new.stime;
        if (appStartTime > appEndTime) {
          $scope.new.stime = '';
          $scope.$apply();
        }
      });

    }]
  };
  return visitStorageManageCtrl;
})
