/**
 * Author: hanzha
 * Create Date: 2017-11-28
 * Description: [重构]
 */

define([], function () {
    var visitReviewManageCtrl = {
        ServiceType: "controller",
        ServiceName: "visitReviewManageCtrl",
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
              authStatus: $scope.vm.authStatus || '', // 状态
              commercial: $scope.vm.commercial || '', // 业态
              district: $scope.vm.district || '', // 区域
              searchType: $scope.vm.searchType || '', // 关键词类型
              addrProvince: $scope.vm.addrProvince || '',
              addrCity: $scope.vm.addrCity || '',
              addrArea: $scope.vm.addrArea || '',
              appStartTime: $scope.vm.appStartTime || '',
              appEndTime: $scope.vm.appEndTime || '',
              sortType: $scope.vm.sortType || 1,
              sortValue: $scope.vm.sortValue,
              pageNo: page || 1,
              pageSize: 10
            };

            // 根据关键词搜索条件，传不同数据
            if($scope.vm.searchType == '3') {
              data.licenceNo = $scope.vm.keywords || ''; // 烟草证号
            } else if($scope.vm.searchType == '1') {
              data.ownerName = $scope.vm.keywords || ''; // 联系人信息
            } else if($scope.vm.searchType == '2') {
              data.phoneNo = $scope.vm.keywords || ''; // 联系人手机号
            } else if($scope.vm.searchType == '4') {
              data.shopName = $scope.vm.keywords || ''; // 门店名称
            } else if($scope.vm.searchType == '5') {
              data.salesmanName = $scope.vm.keywords || ''; // 业务员
            }

            $model.getManageList(data).then(function(res) {
              $scope.vm.listData = res.data.list || [];

              // 是否刷新页码
              if(ispage) {
                $scope.paginationConf = res;
                // 因为接口文档定义的字段和原来写的字段不一致，所以这里改变下。
                $scope.paginationConf.data.page.currentPageNumber =  res.data.page.pageNo; // 当前页
                $scope.paginationConf.data.page.pageNumber =  res.data.page.pageCount; // 页数
              }

              // 获取当前页的id，组成一个数组，多选时要用到
              $scope.batchIds = [];
              angular.forEach($scope.vm.listData, function(item, index) {
                $scope.batchIds.push(item.sellerId);
              })
            })
          }

          // 刚进入页面
          getList(1, true);

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

          // 省
          $model.getManageProvince().then(function (res) {
            $scope.provinceList = res.data;
          });

          // 省份change
          $scope.provinceChage = function (e) {
            if($scope.vm.addrProvince) {
              // 市
              $model.getManageCity({parentCode: $scope.vm.addrProvince}).then(function (res) {
                $scope.cityList = res.data;
                $scope.vm.addrCity = '';
                $scope.vm.addrArea = '';
              });
            } else {
              $scope.cityList = [];
              $scope.vm.addrCity = '';
              $scope.areaList = [];
              $scope.vm.addrArea = '';
            }
          }

          // 城市change
          $scope.cityChage = function (e) {
            if($scope.vm.addrCity != '') {
              // 区/县
              $model.getManageCountry({parentCode: $scope.vm.addrCity}).then(function (res) {
                $scope.areaList = res.data;
                $scope.vm.addrArea = '';
              });
            } else {
              $scope.areaList = [];
              $scope.vm.addrArea = '';
            }
          }


          // 搜索
          $scope.search = function (e) {
            getList(1, true);
          }

          // 重置
          $scope.reset = function () {
            var data = {
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
              pageSize: 10
            }
            // 获取到的数据放入vm里
            $scope.vm = Object.assign({}, $scope.vm, data);

            $scope.cityList = '';
            $scope.areaList = '';
            getList(1, true);
          }


          // *** 批量审批 start
          $scope.selected = []; // 当前选中的id组合
          $scope.ifBatch = true; // 多选按钮disabled

          // 单个儿checkbox的id数组是添加还是移除
          var updateSelected = function (action, id) {
            if (action == 'add' && $scope.selected.indexOf(id) == -1)
              $scope.selected.push(id);

            if (action == 'remove' && $scope.selected.indexOf(id) != -1)
              $scope.selected.splice($scope.selected.indexOf(id), 1);

            if($scope.selected.length <= 1)
              $scope.ifBatch = true;
            else
              $scope.ifBatch = false;
          };

          // 单个儿ng-click
          $scope.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            updateSelected(action, id);
          };
          // 单个儿的ng-checked
          $scope.isSelected = function (id) {
            return $scope.selected.indexOf(id) >= 0;
          };

          // 全选ng-click
          $scope.selectAll = function ($event) {
            var allCheckbox = $event.target;
            var action = (allCheckbox.checked ? 'add' : 'remove');
            for (var i = 0; i < $scope.vm.listData.length; i++) {
              updateSelected(action, $scope.batchIds[i]);
            }
          };
          // 全选的的ng-checked
          $scope.isSelectedAll = function () {
            return $scope.selected.length === $scope.vm.listData.length;
          };

          // 单个儿审核按钮点击
          $scope.reviewAndPass = function (id, value) {
            // 重置验证
            $scope.vm.noPassReason = '';
            $scope.reviewForm.$setPristine();
            $scope.reviewForm.$setUntouched();
            $scope.textareaNum = 0;

            if(id != '') {
              $scope.selected = [id];
              $scope.ifBatch = true;
            }

            $scope.reviewValue = value; // 要传的值，1通过，2不通过
            // 根据值去显示弹窗
            if(value == 1) {
              $scope.isReview = true;
            } else {
              $scope.isReview = false;
            }
          }

          // 审核  确认按钮点击
          $scope.reviewConfirm = function() {
            if($scope.reviewForm.$valid) {
              var data = {
                sellerIds: $scope.selected,
                authResult: $scope.reviewValue,
              }
              if($scope.reviewValue == 2) {
                data.failReason = $scope.vm.noPassReason;
              }
              $model.reviewAndPass(data).then(function(res) {
                if(res.data.ok) {
                  // 审核成功后刷新列表
                  getList($scope.paginationConf.data.page.currentPageNumber);
                  // 隐藏弹窗
                  $('.review-modal').modal('hide');
                  alertMsg($('#newAlert'), 'success', '设置成功');
                } else {
                  alertMsg($('#newAlert'), 'danger', res.data.msg);
                }
              })
            }
          }

          // 输入不通过理由
          $scope.textareaChage = function() {
            $scope.textareaNum = $scope.vm.noPassReason.length;
          }
          // *** 批量审批 end


          // 查看点击
          $scope.viewReviewManage = function(id) {
            sessionStorage.setItem('sellerId', id);
            $location.path('view/visit/manage');
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
    return visitReviewManageCtrl;
})
