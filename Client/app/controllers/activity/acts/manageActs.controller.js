/**
 * Author: kuang
 * Create Date: 2017-07-18
 * Description: manageActs
 */

define([], function () {
  	var manageActsController = {
    	ServiceType: 'controller',
    	ServiceName: 'manageActsCtrl',
    	ViewModelName: 'manageActsModel',
    	ServiceContent: ['$rootScope', '$scope', 'manageActsModel', 'dateFormatFilter', function ($rootScope, $scope, $model, dateFormatFilter) {
      		console.log('manageActs controller is under control.');

      		$("#durationStart").datetimepicker({
		      	format: 'yyyy-mm-dd hh:ii:ss', 
		      	language: 'zh-CN',
		      	weekStart: 1,
		        todayBtn:  1,
		        autoclose: 1,
		        todayHighlight: 1,
		        startView: 2,
		        minView: 2,
		        forceParse: 0
      		});
      
      		$("#durationEnd").datetimepicker({
		      	format: 'yyyy-mm-dd hh:ii:ss', 
		      	language: 'zh-CN',
		      	weekStart: 1,
		        todayBtn:  1,
		        autoclose: 1,
		        todayHighlight: 1,
		        startView: 2,
		        minView: 2,
		        forceParse: 0
      		});

          // 获取活动类型/活动模板
          $model.getActSampleList().then(function (res) {
            $scope.createActModalConf = res.data;
            $scope.actsampleList = res.data.data;
          });

          // 活动状态
          $model.getActivityStatus().then(function(res) {
            $scope.statusList = res.data.data;
          })
      		
          // 获取活动列表
          $scope.$on('frompagechange', function (e,v, f) {
            $model.getActivityList(f).then(function(res) {
              $scope.activitylistConf = res.data;
              $scope.paginationConf = res.data;
            })
          })

          // 获取所有品牌
          $(document).ready(function () {
            $(".operation.multi .select").multiselect({
              includeSelectAllOption: true,
              selectAllText: '全部',
              selectAllValue: 'all',
              enableClickableOptGroups: true,
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
          var brandListArr = [];
          $scope.$watch('selectAllBrands', function(n, o, s) {
            if (n !== o) {
              if (n.length != 0) {
                $scope.selectAllBrands = n;
                n.forEach(function(n, index){
                    brandListArr[index] = {brandCode: n}
                })
                $model.getProductList(brandListArr).then(function (res) {
                  $scope.speci = res.data.data;
                  $('[ng-model="selectSpeci"]').multiselect('dataprovider', _.forEach($scope.speci, function(v){
                    v.label = v.name;
                    v.value = v.productCode;
                  }));
                  $('[ng-model="selectAllBrands"]').multiselect('refresh');
                })
              }
            }
          })

          var productListArr = [];
          $scope.$watch('selectSpeci', function (n, o, s) {
            if (n !== o) {
              if (n.length != 0) {
                $scope.selectSpeci = n;
                n.forEach(function (n, index) {
                  productListArr[index] = {productCode: n}
                })
              }
            }
          })

          $scope.$watch('allarea', function (n, o, s) {
            if (n !== o) {
              $scope.allarea = n;
            }
          })

          // 操作面板，获取地区
          // window.setTimeout(function(){
          //   $model.getTierArea({parentCode: 0}).then(function (res) {
          //     var areaData = [];
          //     var provinceArr = res.data.data;
          //     provinceArr.forEach(function (n ,index) {
          //       var group = {
          //         label: n.shortName, 
          //         value: n.code,
          //         children: []
          //       };
          //       $model.getTierArea({parentCode: n.code}).then(function(res) {
          //           var cityArr = res.data.data;
          //           cityArr.forEach(function (n, index) {
          //               group['children'].push({
          //                   label: n.shortName,
          //                   value: n.code
          //               })
          //           })
          //           areaData.push(group);
          //           $('[ng-model="allarea"]').multiselect('dataprovider', areaData);
          //       })
          //     })
          //   })
          // }, 2000)

          // 点击搜索
          $scope.search = function (e) {
            var data = {
              activityForm: $scope.categoryVal,
              status: $scope.statusVal,
              brandCode: brandListArr || [],
              sn: productListArr || [],
              areaCodes: $scope.allarea || [],
              keys: $scope.keysval || '',
              currentPageNumber: 1,
              pageSize: 15,
              stime: $scope.startTime,
              etime: $scope.endTime
            };
            $model.getActivityList(data).then(function(res) {
              $scope.activitylistConf = res.data;
              $scope.paginationConf = res.data;
            })
          }

          // 重置
          $scope.reset = function () {
            $scope.categoryVal = '';
            $scope.statusVal = '';
            $scope.selectAllBrands = '';
            $scope.selectSpeci = '';
            $scope.allarea = '';
            $scope.keysval = '';
            $scope.startTime = '';
            $scope.endTime = '';
            $model.getActivityList({
              currentPageNumber:1, 
              pageSize: 15
            }).then(function(res) {
              $('[ng-model="selectAllBrands"]').multiselect('refresh');
              $('[ng-model="selectSpeci"]').multiselect('refresh');
              $('[ng-model="allarea"]').multiselect('refresh');
              $scope.activitylistConf = res.data;
              $scope.paginationConf = res.data;
            })
          }
          
          // 获取模板对应的配置页面
          $scope.$on('typefromActSample', function (e,v,f) {
            $model.getTemplateSpecific(f).then(function(res){
              $scope.allConfigTemplateConf = res.data;
                // 抽奖都是common
                // redpack是红包
                // qa是问答
                // holiday节假日
                // unexpected 彩蛋
              $(document).ready(function () {
                $(".ui-search-block.multi .select").multiselect({
                  includeSelectAllOption: true,
                  selectAllText: '全部',
                  selectAllValue: 'all',
                  enableClickableOptGroups: true,
                  enableFiltering: true,
                  buttonWidth: '453px',
                  maxHeight: '500px',
                  numberDisplayed: 1
                });
              });

              // 获取供应商接口
              $model.getSupplierCompany().then(function (res) {
                var selectCompanyScope = angular.element('.select-company').scope();
                selectCompanyScope.company = res.data.data;
              })

              // 根据供应商，选择品牌
              $scope.$on('supplierCode', function (e, v, f) {
                $model.getBrandList(f).then(function (res) {
                  var selectCompanyScope = angular.element('.select-brand').scope();
                  selectCompanyScope.brand = res.data.data;
                  $('[ng-model="selectBrandVal"]').multiselect('dataprovider', _.forEach(res.data.data, function(v){
                      v.label = v.name;
                      v.value = v.brandCode;
                  }));
                  $('[ng-model="selectBrandVal"]').multiselect('refresh');
                })
              })

              // 根据品牌，选择规格
              $scope.$on('brandCode', function (e, v, f) {
                $model.getProductList(f).then(function (res) {
                  var selectBrandScope = angular.element('.select-specification').scope();
                  selectBrandScope.specification = res.data.data;
                  $('[ng-model="selectSpecificationVal"]').multiselect('dataprovider', _.forEach(res.data.data, function(v){
                      v.label = v.name;
                      v.value = v.productCode;
                  }));
                  $('[ng-model="selectSpecificationVal"]').multiselect('refresh');
                })
              })
           
              // 投放地区
              // $model.getTierArea({parentCode: 0}).then(function (res) {
              //   var areaData = [];
              //   var provinceArr = res.data.data;
              //   if (provinceArr.length != 0) {
              //     provinceArr.forEach(function (n ,index) {
              //       var group = {
              //           label: n.shortName, 
              //           value: n.code,
              //           children: []
              //       };
              //       $model.getTierArea({parentCode: n.code}).then(function(res) {
              //           var cityArr = res.data.data;
              //           if (cityArr.length != 0) {
              //             cityArr.forEach(function (n, index) {
              //               group['children'].push({
              //                   label: n.shortName,
              //                   value: n.code
              //               })
              //             })
              //           }
              //           areaData.push(group);
              //           $('[ng-model="selectAreaVal"]').multiselect('dataprovider', areaData);
              if ($('.surprise-pop').length != 0) {
                $('[ng-model="drawAreaVal"]').multiselect('dataprovider', areaData);
              }
              
              //         })
              //     })
              //   }
              // })
            })
          })

          // 基本信息上传
          $scope.$on('frombasicfiles', function (e,v,f) {
            $model.uploadfiletoaly(f).then(function(res){
              
            })
          })

          // 礼品列表
          var fromActivityConfigtoChooseProduct = {};
          $scope.$on('fromActivityConfigtoChooseProduct', function (e, v, f) {
            fromActivityConfigtoChooseProduct = f;
            $model.getProductChooseList(f).then(function (res) {
              $scope.realproductConf = res.data;
              $scope.paginationInnerConf = res.data;
            })
          })

          // 红包列表
          var fromActivityConfigtoChooseHb = {};
          $scope.$on('fromActivityConfigtoChooseHb', function (e, v, f) {
            fromActivityConfigtoChooseHb = f;
            $model.getProductChooseList(f).then(function (res) {
              $scope.hbproductConf = res.data;
              $scope.paginationhbInnerConf = res.data;
            })
          })

          // 礼品列表选择翻页,红包选择翻页
          $scope.$on('frominnerpagechange', function(e, v, f) {
            var newObj = Object.assign(fromActivityConfigtoChooseProduct, f);
            $model.getProductChooseList(newObj).then(function (res) {
              $scope.realproductConf = res.data;
              $scope.paginationInnerConf = res.data;
            })
          })

          // 新增礼品库存
          var giftaddstockid = {};
          $scope.$on('giftaddstockid', function (e,v,f) {
            giftaddstockid = f;
          })
          $scope.confirmGiftStock = function () {
            var addNum = {addNum: $scope.giftnumber};
            var data = Object.assign(addNum, giftaddstockid);
            $model.addgiftstock(data).then(function(res) {
              $('.modal-content .close').trigger('click');
            })
          } 

          // 新增红包库存
          var hbaddstockid = {};
          $scope.$on('hbaddstockid', function (e,v,f) {
            hbaddstockid = f;
          })
          $scope.confirmHbStock = function () {
            var addNum = {addNum: $scope.hbnumber};
            var data = Object.assign(addNum, hbaddstockid);
            $model.addhbstock(data).then(function(res) {
              $('.modal-content .close').trigger('click');
            })
          }
          
          // 新增活动
          $scope.$on('fromcommonactivity', function(e,v,f){
            console.log(f);
            $model.addNewActivity(f).then(function(res){

            })
          })

          var addNewActivityData = {
            copyOfPageCode: 'jiugongge',
            status: 1,
            name: '测试新建第一个活动',
            description: '我是活动描述',
            idx: 100,
            score: 10,
            limitPer: 1,
            limitAll: 10,
            activityForm: 'act-5',
            supplier: '湖南中烟',
            brands: ['白沙', '芙蓉王'],
            sns: ['6901028192095'],
            areaCodes: ['南昌', '北京'],
            holiday: 3,
            specialAwards: 1,
            specialAwardPics: ['https://weiopn.oss-cn-beijing.aliyuncs.com/chengxing/image/or-logo.png'],
            specialAwardNums: 10,
            specialAwardScores: 10,
            chance: '10%',
            commonAwards: [1,2],
            commonAwardPics: ['https://weiopn.oss-cn-beijing.aliyuncs.com/chengxing/image/or-logo.png', 'https://weiopn.oss-cn-beijing.aliyuncs.com/chengxing/image/or-logo.png'],
            commonAwardNums: 1000,
            commonAwardScores: 0
          }
 
    	}]
  	}
  	return manageActsController
})
