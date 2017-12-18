/**
 * Author: hanzha
 * Create Date: 2017-11-28
 * Description: [重构]
 */

define([], function () {
    var visitRebateManageCtrl = {
        ServiceType: "controller",
        ServiceName: "visitRebateManageCtrl",
        ViewModelName: 'visitManageModel',
        ServiceContent: ['$rootScope', '$scope', '$timeout', '$location', 'visitManageModel', 'dateFormatFilter', function ($rootScope, $scope, $timeout, $location, $model, dateFormatFilter) {

          // 初始化一个对象，vm
          $scope.vm = {
            authStatus: '', // 状态
            commercial: '', // 业态
            district: '', // 区域
            searchType: 3, // 关键词类型
            licenceNo: '',  // 烟草证号
            addrProvince: '',
            addrCity: '',
            addrArea: '',
            appStartTime: '',
            appEndTime: '',
            sortType: 1,
            sortValue: 1,
            listData: [],
            pageNo: 1,
            pageSize: 10,
            currentPage: 'index'
          }

          // 获取table列表
          function getList(page, ispage) {
            var data = {
              brandCode: $scope.vm.brand || '', // 品牌编码
              sn: $scope.vm.spec || '', // 规格
              adCodes: $scope.vm.region || '', // 地域编码
              activityForm: $scope.vm.actType || '', // 类型
              status: $scope.vm.actStatus || '', // 状态
              keywords: $scope.vm.keywords || '', // 关键词
              activityStime: $scope.vm.activityStime || '',
              activityEtime: $scope.vm.activityEtime || '',
              pageNo: page || 1,
              pageSize: 10
            };

            $model.getRebateManageList(data).then(function(res) {
              if(res.data.ok) {
                $scope.vm.listData = res.data.data.list || [];

                // 是否刷新页码
                if(ispage) {
                  $scope.paginationConf = res.data;
                  // 因为接口文档定义的字段和原来写的字段不一致，所以这里改变下。
                  $scope.paginationConf.data.page.currentPageNumber =  res.data.data.page.pageNo; // 当前页
                  $scope.paginationConf.data.page.pageNumber =  res.data.data.page.pageCount; // 页数
                }

                // 获取当前页的id，组成一个数组，多选时要用到
                $scope.batchIds = [];
                angular.forEach($scope.vm.listData, function(item, index) {
                  $scope.batchIds.push(item.sellerId);
                })
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
          });

          // 品牌change
          $scope.brandChage = function () {
            if($scope.vm.brand != '') {
              // 规格select
              $model.rebateGetSpec({brandCode: $scope.vm.brand}).then(function (res) {
                $scope.specList = res.data.data;
                $('#spec').multiselect('dataprovider', _.forEach($scope.specList, function(v){
                  v.label = v.allName;
                  v.value = v.sn;
                }));
                $('#spec').multiselect('refresh');
              });
            } else {
              $scope.specList = [];
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
          });

          // 获取地区
          $model.getTierArea({parentCode: ''}).then(function (res) {
            var areaData = [];
            var regionList = res.data.data.datas;
            if (regionList.length != 0) {
              regionList.forEach(function (n ,index) {
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
                  $('#region').multiselect('dataprovider', areaData);
                })
              })
            }
          })

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
            $scope.vm = {
              brand: [], // 品牌编码
              spec: [], // 规格
              region: [], // 地域编码
              actType: '', // 类型
              actStatus: '',  // 状态
              keywords: '', // 关键词
              activityStime: '',
              activityEtime: '',
              pageNo: 1,
              pageSize: 10
            }
            $('#brand').multiselect('refresh');
            $('#spec').multiselect('refresh');
            $('#region').multiselect('refresh');
            getList(1, true);
          }


          // 设置返佣比例
          $scope.setRebate = function (code) {
            // 重置验证
            $scope.vm.rebate = '';
            $scope.rebateForm.$setPristine();
            $scope.rebateForm.$setUntouched();

            $scope.currentActivityCode = code;
          }

          // 设置返佣比例  确认按钮点击
          $scope.rebateConfirm = function() {
            if($scope.rebateForm.$valid) {
              var data = {
                activityCode: $scope.currentActivityCode,
                rebate: $scope.vm.rebate,
              }
              $model.setActivityRebate(data).then(function(res) {
                if(res.data.ok) {
                  // 审核成功后刷新列表
                  getList($scope.paginationConf.data.page.currentPageNumber);
                  // 隐藏弹窗
                  $('.rebate-modal').modal('hide');
                  alertMsg($('#newAlert'), 'success', '设置成功');
                } else {
                  alertMsg($('#newAlert'), 'danger', res.data.msg);
                }
              })
            }
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
            var appStartTime = e.target.value;
            var appEndTime = $scope.vm.appEndTime;
            if (appEndTime < appStartTime) {
              $scope.vm.appEndTime = '';
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
            var appEndTime = e.target.value;
            var appStartTime = $scope.vm.appStartTime;
            if (appStartTime > appEndTime) {
              $scope.vm.appStartTime = '';
              $scope.$apply();
            }
          });

        }]
    };
    return visitRebateManageCtrl;
})
