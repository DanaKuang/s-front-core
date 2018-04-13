/**
 * Author: kuang
 * Create Date: 2017-07-18
 * Description: manageacts
 */

define([], function () {
  	var manageactsController = {
    	ServiceType: 'controller',
    	ServiceName: 'manageactsCtrl',
    	ViewModelName: 'manageactsModel',
    	ServiceContent: ['$rootScope', '$scope', 'manageactsModel', 'dateFormatFilter', function ($rootScope, $scope, $model, dateFormatFilter) {
        // 通用方法 获取对应scope
        var scope = function (selector) {
          return angular.element(selector).scope() ? angular.element(selector).scope() : null
        }
        // 通用方法 获取对应conf
        var scope_conf = function (selector) {
          var scope = angular.element(selector).scope();
          return scope ? scope.conf ? scope.conf : scope.conf = {} : false
        }

        // 初始化multiselect
        $(document).ready(function () {
          $(".operation.multi .select").multiselect({
            nonSelectedText: '请选择',
            selectAllText: '全部',
            nSelectedText: '已选择',
            includeSelectAllOption: true,
            allSelectedText: '全选',
            enableFiltering: true,
            buttonWidth: '100%',
            maxHeight: '200px',
            numberDisplayed: 1
          })
        });

        // 初始化datetimepicker
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
        })

        $("#durationEnd").datetimepicker({
          format: 'yyyy-mm-dd hh:ii',
          language: 'zh-CN',
          todayBtn:  1,
          autoclose: 1,
          todayHighlight: 1
        }).on('change', function (e) {
          var endTime = e.target.value;
          var startTime = $scope.startTime;
          if (startTime > endTime) {
            $scope.startTime = '';
            $scope.$apply();
          }
        });

        // 全局变量
        var globalVariable = {};

        // 获取搜索条件
        globalVariable.searchItem = function () {
          return {
            activityForm: $scope.categoryVal || '',
            status: $scope.statusVal || '',
            brands: $scope.selectAllBrands || [],
            sns: $scope.selectSpeci || [],
            areaCodes: $scope.allarea || [],
            keys: $scope.keysval || '',
            stime: $scope.startTime ? $scope.startTime.match(/:/g).length > 1 ? $scope.startTime.replace($scope.startTime.substr($scope.startTime.lastIndexOf(':') + 1), '00') : $scope.startTime += ':00' : '' || '',
            etime: $scope.endTime ? $scope.endTime.match(/:/g).length > 1 ? $scope.endTime.replace($scope.endTime.substr($scope.endTime.lastIndexOf(':') + 1), '00') : $scope.endTime += ':00' : '' || '',
            currentPageNumber: 1,
            pageSize: 10
          }
        }

        // 获取活动列表，通用方法
        var getList = function (resetbool, data) {
          if (resetbool) {
            // 重置
            $scope.searchForm.$setPristine();
            $scope.searchForm.$setUntouched();
            searchForm.reset();
            $scope.categoryVal = '';
            $scope.statusVal = '';
            $scope.selectAllBrands = [];
            $scope.selectSpeci = [];
            $scope.allarea = [];
            $scope.keysval = '';
            $scope.startTime = '';
            $scope.endTime = '';
            $('[ng-model="selectAllBrands"]').multiselect('refresh');
            $('[ng-model="selectSpeci"]').multiselect('refresh');
            $('[ng-model="allarea"]').multiselect('refresh');
          }
          if (!data) {
            data = globalVariable.searchItem();
          }
          $model.getActivityList(data).then(function(res) {
            $scope.activitylistConf = res.data;
            $scope.paginationConf = res.data;
          })
        }

        // 进入页面，获取活动列表
        getList(false);

        // 翻页获取活动列表
        $scope.$on('frompagechange', function (e,v,f) {
          var target = Object.assign({}, globalVariable.searchItem(), f)
          getList(false, target)
        })

        // 搜索
        $scope.search = function (e) {
          getList(false, globalVariable.searchItem());
        }

        // 重置
        $scope.searchreset = function () {
          getList(true);
        }

        // ------------------ 1.0分界线 ------------------
        // 点击新建，获取模板对应的配置页面
        $scope.$on('typefromActSample', function (e,v,f) {
          $model.getTemplateSpecific(f).then(function(res){
            $scope.allConfigTemplateConf = res.data;
            $scope.allConfigTemplateConf.IMG = $scope.$model.$IMG.data[sessionStorage.account];
            getLaunchInfo();
          })
        })

        // 活动模板
        $model.getActSampleList().then(function (res) {
          $scope.createActModalConf = res.data;
          $scope.actsampleList = res.data.data;
          $scope.chooseConf = res.data;
        });

        // ------------------ 2.0分界线 ------------------
        // $model.getActSampleList().then(function (res) {
        //   $scope.chooseConf = res.data;
        //   $model.getwhichsample({type: ''}).then(function (res) {
        //     // 获取全部类型
        //     scope('.showtemplate').type = res.data.data.list;
        //   })
        // });

        // $scope.$on('choosetype', function (e, v, f) {
        //   $model.getTemplateSpecific(f).then(function(res){
        //     $scope.configtemplateConf = res.data;
        //   })
        // })

        // $model.step().then(function (res) {
        //   $scope.createConf = res.data;
        // })

        // 操作面板，活动状态
        $model.getActivityStatus().then(function(res) {
          $scope.statusList = res.data.data;
        })

        // 操作面板，获取品牌
        $model.getAllBrands().then(function(res) {
          $scope.allBrands = res.data.data;
          $('[ng-model="selectAllBrands"]').multiselect('dataprovider', _.forEach($scope.allBrands, function(v){
              v.label = v.name;
              v.value = v.brandCode;
          }));
          $('[ng-model="selectAllBrands"]').multiselect('refresh');
          // var default_val = $('[ng-model="selectAllBrands"]').find('option:first').val();
          // $scope.selectAllBrands = default_val;
        })

        // 操作面板，根据品牌获取规格
        $scope.$watch('selectAllBrands', function(n, o, s) {
          if (n !== o) {
            $scope.selectAllBrands = n;
            var brandListArrObj = {};
            brandListArrObj.brandCode = n;
            $model.getProductList(brandListArrObj).then(function (res) {
              $scope.speci = res.data.data;
              $('[ng-model="selectSpeci"]').multiselect('dataprovider', _.forEach($scope.speci, function(v){
                v.label = v.allName;
                v.value = v.sn;
              }));
              $('[ng-model="selectSpeci"]').multiselect('refresh');
            })
          }
        })

        // 操作面板，获取地区
        $('.operation').one('click', '.area', function (e) {
          var f = {parentCode: ''};
          getArea(f, '[ng-model="allarea"]')
        })

        // 启用活动
        $scope.$on('startActivity', function (e, v, f) {
          $('.start-activity-modal .btn-primary').on('click', function(){
            $model.changeActivityStatus(f).then(function(){
              $('.modal-content .close').trigger('click');
              getList(globalVariable.searchItem(false))
            })
          })
        })

        // 停用活动
        $scope.$on('terminateActivity', function (e, v, f) {
          $('.end-activity-modal .btn-primary').on('click', function(){
            $model.changeActivityStatus(f).then(function(){
              $('.modal-content .close').trigger('click');
              getList(globalVariable.searchItem(false))
            })
          })
        })

        // 编辑活动
        $scope.$on('editActivity', function (e, v, f) {
          if(f.activityForm != 'act-4'){
              $model.editActivity({'activityCode': f.activityCode}).then(function(res){
                $scope.allConfigTemplateConf = res.data;
                $scope.allConfigTemplateConf.IMG = $scope.$model.$IMG.data[sessionStorage.account];
                getAlreadySelectedLaunchInfo(res.data.data.activity);

                // 如果存在中奖地区
                var draeareascope = angular.element('.draw-area').scope();
                if (draeareascope) {
                  getAlreadySelectedDrawAreaInfo(res.data.data.caidanConfig);
                }
            })
          }else{
            $model.editActivityQuestionnair({'activityCode': f.activityCode}).then(function(res){
                $scope.allConfigTemplateConf = res.data;
                getAlreadySelectedLaunchInfo(res.data.data.activity);
            })
          }
        })

        // 查看活动
        $scope.$on('lookupActivity', function (e, v, f) {
          $model.lookActivity(f).then(function(res){
            $scope.lookupConf = res.data;
          })
        })

        // 返回
        $scope.$on('popback', function (e,v,f) {
          $model.getTemplateSpecific(f).then(function(res){
            $scope.allConfigTemplateConf = null;
          })
        })

        function getLaunchInfo() {
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
            //调查问卷地区选择
            $('#selectArea .select').multiselect({
              nonSelectedText: '请选择',
              nSelectedText: '已选择',
              includeSelectAllOption: true,
              selectAllText: '全部',
              allSelectedText: '全选',
              enableFiltering: true,
              buttonWidth: '100%',
              maxHeight: '200px',
              numberDisplayed: 1
            });
          });

          // 不需要根据供应商获取品牌信息
          $scope.$on('clickbrandval', function (e, v, f) {
            $model.getBrandList().then(function (res) {
              var selectCompanyScope = angular.element('.select-brand').scope();
              selectCompanyScope.brand = res.data.data;
            })
          })

          // 根据品牌，选择规格
          $scope.$on('brandCode', function (e, v, f) {
            $model.getProductList(f).then(function (res) {
              var selectBrandScope = angular.element('.select-specification').scope();
              selectBrandScope.specification = res.data.data;
            })
          })
        }

        // 获取已编辑的信息
        function getAlreadySelectedLaunchInfo(selectedData) {
          $('.pop .multiselect.dropdown-toggle').addClass('disabled');
          if(selectedData.activityForm != 'act-4'){
            $(document).ready(function () {
              $(".multi .select").multiselect({
                nonSelectedText: '请选择',
                nSelectedText: '已选择',
                includeSelectAllOption: true,
                selectAllText: '全部',
                allSelectedText: '全选',
                enableFiltering: true,
                maxHeight: '500px',
                numberDisplayed: 1
              });
            });
            // 获取已选品牌
            $model.getBrandList().then(function (res) {
              var selectCompanyScope = angular.element('.select-brand').scope();
              selectCompanyScope.brand = res.data.data;
              $('[ng-model="selectBrandVal"]').multiselect('dataprovider', _.forEach(res.data.data, function(v){
                  v.label = v.name;
                  v.value = v.brandCode;
              }));
              $('[ng-model="selectBrandVal"]').multiselect('refresh');
              $('[ng-model="selectBrandVal"]').multiselect('select', selectedData.activityBrandsList);
            })
            var alreadyselectedbrandsarrObj = {};
            alreadyselectedbrandsarrObj.brandCode = [];
            selectedData.activityBrandsList.forEach(function(n, index){
              alreadyselectedbrandsarrObj.brandCode.push(n);
            })

            // 获取已选规格
            $model.getProductList(alreadyselectedbrandsarrObj).then(function (res) {
              var selectBrandScope = angular.element('.select-specification').scope();
              selectBrandScope.specification = res.data.data;
              $('[ng-model="selectSpecificationVal"]').multiselect('dataprovider', _.forEach(res.data.data, function(v){
                  v.label = v.allName;
                  v.value = v.sn;
              }));
              $('[ng-model="selectSpecificationVal"]').multiselect('refresh');
              var activitySnSList = [];
              selectedData.activitySnSList.forEach(function(n, index) {
                activitySnSList.push(n.sn);
              })
              $('[ng-model="selectSpecificationVal"]').multiselect('select', activitySnSList);
            })

            // 异步
            setTimeout(function () {
              $('.draw-area').find('.btn-group').not('.edit').css('display', 'none');
              $('.select-area').find('.btn-group').not('.edit').css('display', 'none')
            }, 500)

            // 获取已编辑的地区
            // getArea({parentCode: 0}, '[ng-model="selectAreaVal"]', true, selectedData.activityAreaList)
          } else {
            // 获取已选品牌
            $model.getBrandList().then(function (res) {
              var selectCompanyScope = angular.element('.select-brand').scope();
              selectCompanyScope.brand = res.data.data;
              $('[ng-model="selectBrandVal"]').multiselect('dataprovider', _.forEach(res.data.data, function(v){
                  v.label = v.name;
                  v.value = v.brandCode;
              }));
              $('[ng-model="selectBrandVal"]').multiselect('refresh');
              $('[ng-model="selectBrandVal"]').multiselect('select', selectedData.brandCode);
            })
            var alreadyselectedbrandsarrObj = {};
            alreadyselectedbrandsarrObj.brandCode = [];
            alreadyselectedbrandsarrObj.brandCode.push(selectedData.brandCode);
            // 获取已选规格
            $model.getProductList(alreadyselectedbrandsarrObj).then(function (res) {
              var selectBrandScope = angular.element('.select-specification').scope();
              selectBrandScope.specification = res.data.data;
              $('[ng-model="selectSpecificationVal"]').multiselect('dataprovider', _.forEach(res.data.data, function(v){
                  v.label = v.allName;
                  v.value = v.sn;
              }));
              $('[ng-model="selectSpecificationVal"]').multiselect('refresh');
              var activitySnSList = [];
              activitySnSList.push(selectedData.sn);
              $('[ng-model="selectSpecificationVal"]').multiselect('select', activitySnSList);
            })
          }
        }

        // 获取已编辑的中奖地区
        // function getAlreadySelectedDrawAreaInfo(selectedDrawArea) {
        //   getArea({parentCode: 0}, '[ng-model="drawAreaVal"]', true, selectedDrawArea.adcodes)
        // }

        // 投放设置点击了地区
        $scope.$on('clickselectarea', function(n,v,f) {
          // 投放地区
          getArea(f, '[ng-model="selectAreaVal"]')
        })

        // 点击中奖区域
        $scope.$on('clickdrawarea', function (e, v, f) {
          getArea(f, '[ng-model="drawAreaVal"]')
        })

        // 获取地区
        function getArea(f, selector, bool, boolarr) {
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

                  // 如果是编辑模式，还要展现已选地区
                  if (bool) {
                    if (Array.isArray(boolarr)) {
                      // 如果是数组，则是中奖地区返回的
                      $(selector).multiselect('select', boolarr);
                      $('.multiselect.dropdown-toggle').addClass('disabled');
                    } else {
                      var alreadyselectedareaarr = [];
                      boolarr.forEach(function(n, index){
                        alreadyselectedareaarr.push(n.adCode);
                      })
                      $(selector).multiselect('select', alreadyselectedareaarr);
                    }
                  }
                })
              })
            }
          })
        }

        // 基本信息-活动图片上传
        $scope.$on('frombasicimage', function (e,v,f) {
          $.ajax({
            url: '/api/tztx/saas/saotx/attach/commonAliUpload',
            type: 'POST',
            cache: false,
            data: f,
            processData: false,
            contentType: false,
            headers: {
                ContentType: "multipart/form-data",
                loginId : sessionStorage.access_loginId,
                token : sessionStorage.access_token
            }
          }).done(function (res) {
            var data = res.data;
            var fileSuccessData = res.data;
            var basicScope = angular.element('.configuration-image').scope();
            basicScope.attachCode = fileSuccessData.attachCode; //图片编码
            basicScope.accessUrl = fileSuccessData.accessUrl; //图片保存地址
            if (basicScope.accessUrl) {
              $('.configuration-image').find('.wrong-tip').addClass('hidden');
            } else {
              $('.configuration-image').find('.wrong-tip').removeClass('hidden');
            }
          }).fail(function (res) {
            alert('文件上传失败，请重试');
            return
          })
        })

        // 礼品列表
        var fromActivityConfigtoChooseProduct = {};
        $scope.$on('fromActivityConfigtoChooseProduct', function (e, v, f) {
          fromActivityConfigtoChooseProduct = f;
          globalVariable.show_product_list_scope = fromActivityConfigtoChooseProduct.scope;
          delete fromActivityConfigtoChooseProduct.scope;
          var data = {
            currentPageNumber: 1,
            pageSize: 4
          }
          var target = Object.assign({}, f, data);

          $model.getProductChooseList(target).then(function (res) {
            $scope.realproductConf = res.data;
            $scope.paginationInnerConf = res.data;
          })
        })
        // 礼品列表翻页
        $scope.$on('fromgiftpagechange', function(e, v, f) {
          delete fromActivityConfigtoChooseProduct.scope;
          var newObj = Object.assign(fromActivityConfigtoChooseProduct, f);
          $model.getProductChooseList(newObj).then(function (res) {
            $scope.realproductConf = res.data;
            $scope.paginationInnerConf = res.data;
          })
        })

        // 红包列表
        var fromActivityConfigtoChooseHb = {};
        $scope.$on('fromActivityConfigtoChooseHb', function (e, v, f) {
          fromActivityConfigtoChooseHb = f;
          var data = {
            currentPageNumber: 1,
            pageSize: 5
          }
          var target = Object.assign({}, f, data);
          $model.getProductChooseList(target).then(function (res) {
            $scope.hbproductConf = res.data;
            $scope.paginationhbInnerConf = res.data;
          })
        })

        // 红包列表翻页
        $scope.$on('fromhbpagechange', function(e, v, f) {
          delete fromActivityConfigtoChooseHb.scope;
          var newObj = Object.assign(fromActivityConfigtoChooseHb, f);
          $model.getProductChooseList(newObj).then(function (res) {
            $scope.hbproductConf = res.data;
            $scope.paginationhbInnerConf = res.data;
          })
        })

        // 积分池列表
        var fromActivityConfigtoChooseJF = {};
        $scope.$on('fromActivityConfigtoChooseJF', function (e, v, f) {
          fromActivityConfigtoChooseJF = f;
          var data = {
            currentPageNumber: 1,
            pageSize: 6
          }
          var target = Object.assign({}, f, data);
          $model.getProductChooseList(target).then(function (res) {
            $scope.jfproductConf = res.data;
            $scope.paginationjfInnerConf = res.data;
          })
        })
        // 积分池列表翻页
        $scope.$on('fromjfpagechange', function(e, v, f) {
          delete fromActivityConfigtoChooseJF.scope;
          var newObj = Object.assign(fromActivityConfigtoChooseJF, f);
          $model.getProductChooseList(newObj).then(function (res) {
            $scope.jfproductConf = res.data;
            $scope.paginationjfInnerConf = res.data;
          })
        })

        var gitSurplusNum = 0; //礼品增库时剩余最大数量
        // 新增礼品库存
        $scope.$on('giftaddstockid', function (e,v,f) {
          globalVariable.giftaddstockid = f;
          var queryData = {
            id : globalVariable.giftaddstockid.poolId
          }
          //globalVariable.giftaddstockid.giftType  3-红包  6-积分  其他为实物礼品
          $model.getMaxPoolGift(queryData).then(function (res) {
            if(res.data.ret == 200000){
              var giftObj = res.data.data;
              gitSurplusNum = parseInt(giftObj.stock);
              $('[ng-model="giftnumber"]').attr('placeholder','增库最大数量为：'+ giftObj.stock +'');
            }
          })
        })

        $scope.confirmGiftStock = function () {
          var giftNum = parseInt($('[ng-model="giftnumber"]').val());
          if(parseInt(giftNum) <= 0){
            $('#addGiftNum').html('请输入大于0的正整数').show();
            return;
          }else{
            switch(globalVariable.giftaddstockid.specialCode){
              case 'FIRST_LOTTERY_BE_WON':
                if(giftNum > gitSurplusNum){
                  $('#addGiftNum').html('超过数量最大限制，请调整').show();
                  return;
                }else{
                  //初始化数量对象
                  var initialObj = $('#first_draw').find('[data-dataid="'+ globalVariable.giftaddstockid.potId +'"]').find('[data-poolid="'+ globalVariable.giftaddstockid.poolId +'"]').find('.initial');
                  //剩余数量对象
                  var surplusObj = $('#first_draw').find('[data-dataid="'+ globalVariable.giftaddstockid.potId +'"]').find('[data-poolid="'+ globalVariable.giftaddstockid.poolId +'"]').find('.surplus');
                  //初始化数量
                  var initialVal = initialObj.val();
                  //剩余数量
                  var surplusVal = surplusObj.val();
                  var addInitVal = parseFloat(initialVal) + parseFloat(giftNum);
                  var addSurplusVal = parseFloat(surplusVal) + parseFloat(giftNum);
                  initialObj.val(addInitVal);
                  surplusObj.val(addSurplusVal);
                  $('[ng-model="giftnumber"]').val('');
                  $('#addGiftNum').hide();
                  $('.add-giftstock-pop').modal('hide');
                }
                break;
              case 'COMMON':
                if(giftNum > gitSurplusNum){
                  $('#addGiftNum').html('超过数量最大限制，请调整').show();
                  return;
                }else{
                  //初始化数量对象
                  var initialObj = $('#none_first_draw').find('[data-dataid="'+ globalVariable.giftaddstockid.potId +'"]').find('[data-poolid="'+ globalVariable.giftaddstockid.poolId +'"]').find('.initial');
                  //剩余数量对象
                  var surplusObj = $('#none_first_draw').find('[data-dataid="'+ globalVariable.giftaddstockid.potId +'"]').find('[data-poolid="'+ globalVariable.giftaddstockid.poolId +'"]').find('.surplus');
                  //初始化数量
                  var initialVal = initialObj.val();
                  //剩余数量
                  var surplusVal = surplusObj.val();
                  var addInitVal = parseFloat(initialVal) + parseFloat(giftNum);
                  var addSurplusVal = parseFloat(surplusVal) + parseFloat(giftNum);
                  initialObj.val(addInitVal);
                  surplusObj.val(addSurplusVal);
                  $('[ng-model="giftnumber"]').val('');
                  $('#addGiftNum').hide();
                  $('.add-giftstock-pop').modal('hide');
                }
                break;
              case 'INVOLVE':
                if(giftNum > gitSurplusNum){
                  $('#addGiftNum').html('超过数量最大限制，请调整').show();
                  return;
                }else{
                  //初始化数量对象
                  var initialObj = $('#involve_draw').find('[data-dataid="'+ globalVariable.giftaddstockid.potId +'"]').find('[data-poolid="'+ globalVariable.giftaddstockid.poolId +'"]').find('.initial');
                  //剩余数量对象
                  var surplusObj = $('#involve_draw').find('[data-dataid="'+ globalVariable.giftaddstockid.potId +'"]').find('[data-poolid="'+ globalVariable.giftaddstockid.poolId +'"]').find('.surplus');
                  //初始化数量
                  var initialVal = initialObj.val();
                  //剩余数量
                  var surplusVal = surplusObj.val();
                  var addInitVal = parseFloat(initialVal) + parseFloat(giftNum);
                  var addSurplusVal = parseFloat(surplusVal) + parseFloat(giftNum);
                  initialObj.val(addInitVal);
                  surplusObj.val(addSurplusVal);
                  $('[ng-model="giftnumber"]').val('');
                  $('#addGiftNum').hide();
                  $('.add-giftstock-pop').modal('hide');
                }
                break;
              default :
            }
          }

          /**if (globalVariable.giftaddstockid.firstornot) {
            // 特殊奖
            var the_drawprizewrap_val = $('.first-draw .edit-part').eq(globalVariable.giftaddstockid.index).find('.prize-img-preview-wrap-repeat').eq(globalVariable.giftaddstockid.item_index).find('.number').val();

            var add_val = parseFloat(the_drawprizewrap_val) + parseFloat($('[ng-model="giftnumber"]').val());

            $('.first-draw .edit-part').eq(globalVariable.giftaddstockid.index).find('.prize-img-preview-wrap-repeat').eq(globalVariable.giftaddstockid.item_index).find('.number').val(add_val)
          } else {
            // 参与奖
            var the_drawprizewrap_val = $('.thanks-draw .edit-part').eq(globalVariable.giftaddstockid.index).find('.prize-img-preview-wrap-repeat').eq(globalVariable.giftaddstockid.item_index).find('.number').val();

            var add_val = parseFloat(the_drawprizewrap_val) + parseFloat($('[ng-model="giftnumber"]').val());

            $('.thanks-draw .edit-part').eq(globalVariable.giftaddstockid.index).find('.prize-img-preview-wrap-repeat').eq(globalVariable.giftaddstockid.item_index).find('.number').val(add_val)
          }
          $('.modal-content .close').trigger('click'); */
        }

        // 新增红包库存
        var hbaddstockid = {};
        $scope.$on('hbaddstockid', function (e,v,f) {
          if(f.activityForm == 'act-4'){
            $model.getPoolDetaiById({id:f.poolId}).then(function(res) {
              if(res.data.ret == '200000'){
                var poolDetailObj = res.data.data;
                $('#poolDetail').html('红包池剩余额度：'+ poolDetailObj.moneyPool +'元').show();
                $scope.poolDetailMoney = poolDetailObj.moneyPool;
              }
            })
          }else{
            $('#poolDetail').html('').hide();
            //不是调查问卷活动的红包
            $model.getMaxRedPack({id:f.poolId}).then(function(res) {
              if(res.data.ret == '200000'){
                var poolDetailObj = res.data.data;
                $scope.poolDetailMoney = poolDetailObj.moneyPool;
                $('[ng-model="hbnumber"]').attr('placeholder','红包池剩余额度：'+ poolDetailObj.moneyPool +'');
              }
            })
          }
          hbaddstockid = f;
        })

        $scope.confirmHbStock = function () {
          var addNum = {addNum: $scope.hbnumber};
          if(hbaddstockid.activityForm != 'act-4'){
            if($scope.hbnumber > $scope.poolDetailMoney){
              $('#poolDetail').html('增库额度超出红包剩余额度，请重新输入增库金额').show();
              return;
            }else if(parseFloat($scope.hbnumber) <= 0){
              $('#poolDetail').html('请输入大于0的数').show();
              return;
            }else{
              var data = {
                addNum: $scope.hbnumber,
                id: hbaddstockid.id
              };
              // if (!hbaddstockid.id) {
              //   alert('请先选择红包');
              //   $('.modal-content .close').trigger('click');
              //   return
              // }
              switch(hbaddstockid.specialCode){
                case 'FIRST_LOTTERY_BE_WON':
                  //初始化金额
                  var initMoney = $('#first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.money').val();
                  //剩余金额
                  var surplusMoney = $('#first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.surplus-money').val();
                  var addMoney = parseFloat(initMoney) + parseFloat($scope.hbnumber);
                  var addSurplusMoney = parseFloat(surplusMoney) + parseFloat($scope.hbnumber);
                  $('#first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.money').val(addMoney);
                  $('#first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.surplus-money').val(addSurplusMoney);
                  $('[ng-model="hbnumber"]').val('');
                  $('#poolDetail').html('').hide();
                  $('.add-hbstock-pop').modal('hide');
                  break;
                case 'COMMON':
                  //初始化金额
                  var initMoney = $('#none_first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.money').val();
                  //剩余金额
                  var surplusMoney = $('#none_first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.surplus-money').val();
                  var addMoney = parseFloat(initMoney) + parseFloat($scope.hbnumber);
                  var addSurplusMoney = parseFloat(surplusMoney) + parseFloat($scope.hbnumber);
                  $('#none_first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.money').val(addMoney);
                  $('#none_first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.surplus-money').val(addSurplusMoney);
                  $('[ng-model="hbnumber"]').val('');
                  $('#poolDetail').html('').hide();
                  $('.add-hbstock-pop').modal('hide');
                  break;
                default:
              }

              //原来的增加红包的代码
              // $model.addhbstock(data).then(function(res) {
              //   var the_drawprizewrap_val = $('.first-draw .ready-set').find('.draw-prize-wrap').eq(hbaddstockid.index).find('.money').val();
              //   var add_val = parseFloat(the_drawprizewrap_val) + parseFloat($('[ng-model="hbnumber"]').val());
              //   $('.first-draw .ready-set').find('.draw-prize-wrap').eq(hbaddstockid.index).find('.money').val(add_val);
              //   $('.modal-content .close').trigger('click');
              // })

            }
          }else{
            if($scope.hbnumber > $scope.poolDetailMoney){
              $('#poolDetail').html('增库额度超出红包剩余额度，请重新输入增库金额').show();
              return;
            }else{
              var saveEditData = {
                activityCode : hbaddstockid.activityCode,
                addPoolMoney : $scope.hbnumber
              }
              var nowTotal = $('#packetToal').val();
              var addTotalMoney = parseInt(nowTotal) + parseInt($scope.hbnumber);
              $('#packetToal').val(addTotalMoney);

              if(parseInt($scope.hbnumber) > 0){
                if($('#ranAmont')[0].checked){
                  $('#prizeNum').removeAttr("disabled");
                }else{
                  var fixdMoney = $('#fixdMoney').val();
                  var nowNum = Math.floor(addTotalMoney/parseInt(fixdMoney))
                  $('#prizeNum').val(nowNum).attr('disabled','true');
                }
              }
              $scope.hbnumber = '';
              // $('.modal-content .close').trigger('click');
              $('.add-hbstock-pop').modal('hide');

            }
          }
        }

        //红包数量增加
        $scope.confirmHbStockNum = function(){
          if(parseInt($scope.hbnumberNum) <= 0){
            $('#hbNumberErr').html('请输入大于0的正整数').show();
            return;
          }else{
            switch(hbaddstockid.specialCode){
              case 'FIRST_LOTTERY_BE_WON':
                //初始化金额
                var initMoneyNum = $('#first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.init-money-num').val();
                //剩余金额
                var surplusMoneyNum = $('#first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.surplus-money-num').val();
                var addMoneyNum = parseFloat(initMoneyNum) + parseFloat($scope.hbnumberNum);
                var addSurplusMoneyNum = parseFloat(surplusMoneyNum) + parseFloat($scope.hbnumberNum);
                $('#first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.init-money-num').val(addMoneyNum);
                $('#first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.surplus-money-num').val(addSurplusMoneyNum);
                $('[ng-model="hbnumberNum"]').val('');
                $('.add-hbstock-pop-num').modal('hide');
                break;
              case 'COMMON':
                //初始化金额
                var initMoneyNum = $('#none_first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.init-money-num').val();
                //剩余金额
                var surplusMoneyNum = $('#none_first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.surplus-money-num').val();
                var addMoneyNum = parseFloat(initMoneyNum) + parseFloat($scope.hbnumberNum);
                var addSurplusMoneyNum = parseFloat(surplusMoneyNum) + parseFloat($scope.hbnumberNum);
                $('#none_first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.init-money-num').val(addMoneyNum);
                $('#none_first_draw').find('[data-dataid="'+ hbaddstockid.dataId +'"]').find('.surplus-money-num').val(addSurplusMoneyNum);
                $('[ng-model="hbnumberNum"]').val('');
                $('.add-hbstock-pop-num').modal('hide');
                break;
              default:
            }
          }
        }

        //积分数量增库pointAddStock
        var pointAddStock = {};
        $scope.$on('pointAddStock', function (e,v,f) {
          pointAddStock = f;
        })

        //确定积分数量增库 pointsNumErr
        $scope.confirmPointsStockNum = function(){
          if(parseInt($scope.pointsNumber) <= 0){
            $('#pointsNumErr').html('请输入大于0的整数').show();
            return;
          }else{
            switch(pointAddStock.specialCode){
              case 'FIRST_LOTTERY_BE_WON':
                //初始化积分数量
                var initPointsNum = $('#first_draw').find('[data-dataid="'+ pointAddStock.dataId +'"]').find('.init-points-num').val();
                //剩余积分数量
                var surplusPointsNum = $('#first_draw').find('[data-dataid="'+ pointAddStock.dataId +'"]').find('.surplus-points-num').val();
                var addPointsNum = parseFloat(initPointsNum) + parseFloat($scope.pointsNumber);
                var addSurplusPointsNum = parseFloat(surplusPointsNum) + parseFloat($scope.pointsNumber);
                $('#first_draw').find('[data-dataid="'+ pointAddStock.dataId +'"]').find('.init-points-num').val(addPointsNum);
                $('#first_draw').find('[data-dataid="'+ pointAddStock.dataId +'"]').find('.surplus-points-num').val(addSurplusPointsNum);
                $('[ng-model="pointsNumber"]').val('');
                $('#pointsNumErr').hide();
                $('.add-points-pop').modal('hide');
                break;
              case 'COMMON':
                //初始化积分数量
                var initPointsNum = $('#none_first_draw').find('[data-dataid="'+ pointAddStock.dataId +'"]').find('.init-points-num').val();
                //剩余积分数量
                var surplusPointsNum = $('#none_first_draw').find('[data-dataid="'+ pointAddStock.dataId +'"]').find('.surplus-points-num').val();
                var addPointsNum = parseFloat(initPointsNum) + parseFloat($scope.pointsNumber);
                var addSurplusPointsNum = parseFloat(surplusPointsNum) + parseFloat($scope.pointsNumber);
                $('#none_first_draw').find('[data-dataid="'+ pointAddStock.dataId +'"]').find('.init-points-num').val(addPointsNum);
                $('#none_first_draw').find('[data-dataid="'+ pointAddStock.dataId +'"]').find('.surplus-points-num').val(addSurplusPointsNum);
                $('[ng-model="pointsNumber"]').val('');
                $('#pointsNumErr').hide();
                $('.add-points-pop').modal('hide');
                break;
              case 'INVOLVE':
                //初始化积分数量
                var initPointsNum = $('#involve_draw').find('[data-dataid="'+ pointAddStock.dataId +'"]').find('.init-points-num').val();
                //剩余积分数量
                var surplusPointsNum = $('#involve_draw').find('[data-dataid="'+ pointAddStock.dataId +'"]').find('.surplus-points-num').val();
                var addPointsNum = parseFloat(initPointsNum) + parseFloat($scope.pointsNumber);
                var addSurplusPointsNum = parseFloat(surplusPointsNum) + parseFloat($scope.pointsNumber);
                $('#involve_draw').find('[data-dataid="'+ pointAddStock.dataId +'"]').find('.init-points-num').val(addPointsNum);
                $('#involve_draw').find('[data-dataid="'+ pointAddStock.dataId +'"]').find('.surplus-points-num').val(addSurplusPointsNum);
                $('[ng-model="pointsNumber"]').val('');
                $('#pointsNumErr').hide();
                $('.add-points-pop').modal('hide');
                break;
              default:
            }
          }
        }

        //关闭礼品数量增库弹框
        $scope.closeAddGiftBox = function(){
          $('[ng-model="giftnumber"]').val('');
          $('#addGiftNum').hide();
          $('.add-giftstock-pop').modal('hide');
        }

        //关闭微信红包金额增库弹框
        $scope.closeAddHbMoneyBox = function(){
          $('[ng-model="hbnumber"]').val('');
          $('#poolDetail').hide();
          $('.add-hbstock-pop').modal('hide');
        }

        //关闭微信红包数量增库弹框
        $scope.closeAddHbNumBox = function(){
          $('[ng-model="hbnumberNum"]').val('');
          $('#hbNumberErr').hide();
          $('.add-hbstock-pop-num').modal('hide');
        }

        //关闭积分增库弹框
        $scope.closeAddPointsBox = function(){
          $('[ng-model="pointsNumber"]').val('');
          $('#pointsNumErr').hide();
          $('.add-points-pop').modal('hide');
        }

        // 多个礼品显示配置
        $scope.$on('fromrealproductchoose', function (e,v,f) {
          var giftpackScope = globalVariable.show_product_list_scope;
          if (f) {
            if (!giftpackScope.conf) {
              giftpackScope.conf = {
                list: []
              }
            }
            giftpackScope.conf.list.push(f);
          }
        })

        // 新增活动
        $scope.$on('fromcommonactivity', function(e,v,f){
          $model.addNewActivity(f).then(function(res){
            if (res.data.ret === '200000') {
              $scope.successshowlistConf = res.data;
              $('.submit-prize').trigger('click');
              $('.createSuccess').modal({
                keyboard: false,
                backdrop: false
              });
              $scope.iknow = function (e) {
                $model.getTemplateSpecific(f).then(function(res){
                  $scope.allConfigTemplateConf = null;
                })
                getList(true);
              }
            } else {
              alert(res.data.message);
            }
          })
        })

        var successTimer = null;
        //调查问卷
        $scope.$on('questionnaireSaveData', function(e,v,f){
          $model.saveQuestionnair(f).then(function(res){
            if (res.data.ret === '200000') {
              $('.ques_success_box').modal('show');
              successTimer = setTimeout(function(){
                  $('.ques_success_box').modal('hide');
                  clearTimeout(successTimer);
              },3000);
              $model.getTemplateSpecific({}).then(function(res){
                $scope.allConfigTemplateConf = null;
              })
              getList(true);
            }else{
              alert(res.data.message);
            }
          })
        })

        //确认取消调查问卷
        $scope.confirmCancel = function(){
            $('.cancel_box').modal('hide');
            $model.getTemplateSpecific({}).then(function(res){
                $scope.allConfigTemplateConf = null;
            })
        }

    	}]
  	}
  	return manageactsController
})