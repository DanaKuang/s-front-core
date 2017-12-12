/**
 * Author: hanzha
 * Create Date: 2017-11-28
 * Description: [重构]
 */

define([], function () {
    var visitManageCtrl = {
        ServiceType: "controller",
        ServiceName: "visitManageCtrl",
        ViewModelName: 'visitManageModel',
        ServiceContent: ['$rootScope', '$scope', '$timeout', '$location', 'visitManageModel', 'dateFormatFilter', function ($rootScope, $scope, $timeout, $location, $model, dateFormatFilter) {

          // 初始化一个对象，vm
          $scope.vm = {
            status: '', // 状态
            commercial: '', // 业态
            district: '', // 区域
            searchType: 3, // 关键词类型
            licenceNo: '',  // 烟草证号
            addrProvince: '',
            addrCity: '',
            addrArea: '',
            appStartTime: '',
            appEndTime: '',
            isPrint: '',
            sortType: 1,
            sortValue: 1,
            pageNo: 1,
            pageSize: 10,
            currentPage: 'index'
          }

          // *** 详情 开始
          $scope.detial = {
            detialPage: 'info'
          };

          // 基本信息
          $scope.info = {
            // isEdit: false
          };

          // 判断是否为 审核管理 跳转过来的
          if(sessionStorage.sellerId) {
            getDetialList(sessionStorage.sellerId);

            sessionStorage.removeItem('sellerId') // 进入详情页后，移除sellerId，防止刷新再进入
            $scope.fromPage = 'reviewManage'; // 在返回列表时，根据来源返回。
          }

          // 获取table列表
          function getList(page, ispage) {
            var data = {
              status: $scope.vm.status || '', // 状态
              commercial: $scope.vm.commercial || '', // 业态
              district: $scope.vm.district || '', // 区域
              searchType: $scope.vm.searchType || '', // 关键词类型
              addrProvince: $scope.vm.addrProvince || '',
              addrCity: $scope.vm.addrCity || '',
              addrArea: $scope.vm.addrArea || '',
              appStartTime: $scope.vm.appStartTime || '',
              appEndTime: $scope.vm.appEndTime || '',
              isPrint: $scope.vm.isPrint || '',
              sortType: $scope.vm.sortType || 1,
              sortValue: $scope.vm.sortValue,
              pageNo: page || 1,
              pageSize: 10
              // currentPageNumber: page || 1,
              // pageSize: 10
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

                $scope.indexPaginationConf = res;
              }
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
            // 新增
            $scope.new.provinceList = res.data;
            // 详情 - 基本信息
            $scope.info.provinceList = res.data;
          });

          // 省份change
          $scope.provinceChage = function (e) {
            if($scope.vm.addrProvince != '') {
              // 市
              $model.getManageCity({parentCode: $scope.vm.addrProvince}).then(function (res) {
                $scope.cityList = res.data;
                $scope.vm.addrCity = '';
                $scope.vm.addrArea = '';
              });
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
            }
          }


          // 搜索
          $scope.search = function (e) {
            getList(1, true);
          }

          // 重置
          $scope.reset = function () {
            $scope.vm = {
              status: '', // 状态
              commercial: '', // 业态
              district: '', // 区域
              searchType: 3, // 关键词类型
              licenceNo: '',  // 烟草证号
              addrProvince: '',
              addrCity: '',
              addrArea: '',
              appStartTime: '',
              appEndTime: '',
              isPrint: '',
              pageNo: 1,
              pageSize: 10
            }
            $scope.provinceList = '';
            $scope.cityList = '';
            $scope.areaList = '';
            getList(1, true);
          }

          // 排序
          $scope.sortBy = function (e, type) {
            $scope.vm.sortValue = ($scope.vm.sortValue == 1 ? 0 : 1); // 升序、降序
            $scope.vm.sortType = type;
            getList(1, true);
          }

          // 监听sorttype，如果变了，说明换了一个排序，那就初始value值为1（降序）.
          $scope.$watch('vm.sortType', function(n, o) {
            if (n !== o) {
              $scope.vm.sortValue = 1;
              getList(1, true); // fixme: 多调用了一次，这里怎么解决？？？
            }
          }, true)


          // 获取详情信息
          function getDetialList(id, from) {
            // 初始化 基本信息，这里注意，不能写成$scope.info={isEdit : true,licenceImg: ''}
            $scope.info.isEdit = false;
            $scope.info.licenceImg = '';

            $scope.vm.currentPage = 'detial'; // 当前页改为详情

            if(from == 'nowPage') {
              // 重置form状态
              $scope.infoForm.$setPristine();
              $scope.infoForm.$setUntouched();
            }

            $model.getManageDetial({sellerId: id}).then(function(res) {
              $scope.info = Object.assign({}, $scope.info, res.data.data.sellerInfo);

              // 这时加载市、区列表
              // 市
              $model.getManageCity({parentCode: $scope.info.addrProvince}).then(function (res) {
                $scope.info.cityList = res.data;
              });
              // 区/县
              $model.getManageCountry({parentCode: $scope.info.addrCity}).then(function (res) {
                $scope.info.areaList = res.data;
              });
            })
          }

          // 查看点击
          $scope.viewManage = function(e, id) {
            getDetialList(id, 'nowPage');
          }

          // 基本信息 - 修改点击
          $scope.info.edit = function() {
            $scope.info.isEdit = true;

            // 重置form状态
            $scope.infoForm.$setPristine();
            $scope.infoForm.$setUntouched();

            // 这里用jQuery去设置，因为angular没办法。 fixme:以后可以再解决
            $('#infoProvince').val($scope.info.addrProvince);
            $('#infoCity').val($scope.info.addrCity);
            $('#infoArea').val($scope.info.addrArea);
          }

          // 基本信息 - 保存点击
          $scope.info.save = function(type) {
            // 验证，id，点击类型
            newAndEdit($scope.infoForm.$valid, type);
          }

          // 基本信息 - 取消点击
          $scope.info.cancel = function(e, id) {
            $scope.info.isEdit = false;
          }

          // 基本信息 - 返回列表点击
          $scope.info.back = function(e, id) {
            if($scope.fromPage == 'reviewManage') {
              $location.path('view/visit/reviewmanage');
            } else {
              $scope.vm.currentPage = 'index';
              $scope.paginationConf = $scope.indexPaginationConf;
            }
          }
          // *** 详情 结束




          // **** 新增开始
          $scope.new = {};

          // 新增点击
          $scope.newRetailerClick = function(e) {
            $scope.vm.currentPage = 'new';
            $scope.new.licenceImg = ''

            // 重置form状态
            $scope.form.$setPristine();
            $scope.form.$setUntouched();
          }

          // 图片删除
          $scope.new.newPhotoDelete = function() {
            $scope.new.licenceImg = '';
            $('#newImgUpload').val(''); // 搭配这个方法才行，不知道为什么？？？
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

          var newAndEdit = function(valid, type, clickType) {
            // 如果验证通过
            if(valid) {
              if(type == 'new') {
                var data = {
                  sellerId: '', // 零售户编码
                  licenceImg: $scope.new.licenceImg || '', // 许可证照片地址
                  shopName: $scope.new.shopName || '', // 店铺名称
                  ownerName: $scope.new.ownerName || '', // 经营人姓名
                  phoneNo: $scope.new.phoneNo || '', // 店主联系电话

                  addrProvince: $scope.new.addrProvince || '', // 省份编码
                  addrCity: $scope.new.addrCity || '', // 地市编码
                  addrArea: $scope.new.addrArea || '', // 区县编码
                  addrDetail: $scope.new.addrDetail || '', // 门店所在地详细信息
                  licenceNo: $scope.new.licenceNo || '', // 许可证号

                  district: $scope.new.district || '', // 区域
                  commercial: $scope.new.commercial || '', // 业态
                  salesManNames: $scope.new.salesManNames || '', // 业务员名称
                  contactName: $scope.new.contactName || '', // 联系人姓名
                  contactPhone: $scope.new.contactPhone || '', // 联系人手机号

                  qrStyle: 1, // 店码样式，默认传1
                  authStatus: 4, // 新增的零售户，默认审批通过，待激活状态
                };
              } else if(type == 'edit') {
                var data = {
                  sellerId: $scope.info.sellerId || '', // 零售户编码
                  licenceImg: $scope.info.licenceImg || '', // 许可证照片地址
                  shopName: $scope.info.shopName || '', // 店铺名称
                  ownerName: $scope.info.ownerName || '', // 经营人姓名
                  phoneNo: $scope.info.phoneNo || '', // 店主联系电话

                  addrProvince: $scope.info.addrProvince || '', // 省份编码
                  addrCity: $scope.info.addrCity || '', // 地市编码
                  addrArea: $scope.info.addrArea || '', // 区县编码
                  addrDetail: $scope.info.addrDetail || '', // 门店所在地详细信息
                  licenceNo: $scope.info.licenceNo || '', // 许可证号

                  district: $scope.info.district || '', // 区域
                  commercial: $scope.info.commercial || '', // 业态
                  salesManNames: $scope.info.salesManNames || '', // 业务员名称
                  contactName: $scope.info.contactName || '', // 联系人姓名
                  contactPhone: $scope.info.contactPhone || '', // 联系人手机号

                  authOrg: '', // 状态
                };
                // data.authOrg.status = $scope.info.status;
              }

              $model.newManageSave(data).then(function (res) {
                if(res.data.ok) {
                  if(type == 'new') {
                    var typeInfo = '新建成功'
                  } else {
                    var typeInfo = '保存成功'
                  }
                  alertMsg($('#newAlert'), 'success', typeInfo);

                  if(clickType == 'saveAndBack') {
                    $timeout(function(){
                      $scope.vm.currentPage = 'index';
                    }, 1000)
                  }
                } else {
                  alertMsg($('#newAlert'), 'danger', res.data.msg);
                }
              });
            }
          }

          // 新增保存
          $scope.new.save = function(type, clickType) {
            // 验证，id，点击类型
            newAndEdit($scope.form.$valid, type, clickType);
          }

          $scope.new.back = function() {
            $scope.vm.currentPage = 'index';
          }
          // **** 新增结束








          // 门店照片上传
          $scope.new.uploadImage = function(e) {
            var files = event.target.files[0];
            var formData = new FormData();
            formData.append('file', files);

            $.ajax({
              url: '/api/tztx/seller-manager/file/upload',
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
              $scope.new.licenceImg = res.msg; //图片保存地址
              $scope.info.licenceImg = res.msg; //图片保存地址
              $scope.$apply(); // 因为是异步的？所以这里需要$scope.$apply();
            }).fail(function (res) {
              alert('上传失败，请重试');
              return
            })
          }

          // 新增 省份change
          $scope.new.provinceChage = function (e) {

            if($scope.new.addrProvince != '') {
              // 市
              $model.getManageCity({parentCode: $scope.new.addrProvince}).then(function (res) {
                $scope.new.cityList = res.data;
                $scope.new.addrCity = '';
                $scope.new.addrArea = '';
              });
            }
          }

          // 新增 城市change
          $scope.new.cityChage = function (e) {
            if($scope.new.addrCity != '') {
              // 区/县
              $model.getManageCountry({parentCode: $scope.new.addrCity}).then(function (res) {
                $scope.new.areaList = res.data;
                $scope.new.addrArea = '';
              });
            }
          }


          // info 省份change
          $scope.info.provinceChage = function (e) {
            if($scope.info.addrProvince != '') {
              // 市
              $model.getManageCity({parentCode: $scope.info.addrProvince}).then(function (res) {
                $scope.info.cityList = res.data;
                $scope.info.addrCity = '';
                $scope.info.addrArea = '';
              });
            }
          }

          // info 城市change
          $scope.info.cityChage = function (e) {
            if($scope.info.addrCity != '') {
              // 区/县
              $model.getManageCountry({parentCode: $scope.info.addrCity}).then(function (res) {
                $scope.info.areaList = res.data;
                $scope.info.addrArea = '';
              });
            }
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
    return visitManageCtrl;
})
