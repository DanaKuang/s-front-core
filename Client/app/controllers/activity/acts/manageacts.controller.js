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

        // 通用方法-获取scope和对应conf
        var scope = function (selector) {
          return angular.element(selector).scope()
        }
        var scope_conf = function (selector) {
          var scope = angular.element(selector).scope();
          return scope ? scope.conf ? scope.conf : scope.conf = {} : false
        }

        // 全局变量
        var globalVariable = {};

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
          });
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

        // 获取全局搜索条件
        globalVariable.searchItem = function () {
          return {
            activityForm: $scope.categoryVal || '',
            status: $scope.statusVal || '',
            brands: $scope.selectAllBrands || [],
            sns: $scope.selectSpeci || [],
            areaCodes: $scope.allarea || [],
            keys: $scope.keysval || '',
            stime: $scope.startTime ? $scope.startTime.match(/:/g).length > 1 ? $scope.startTime.replace($scope.startTime.substr($scope.startTime.lastIndexOf(':') + 1), '00') : $scope.startTime += ':00' : '' || '',
            etime: $scope.endTime ? $scope.endTime.match(/:/g).length > 1 ? $scope.endTime.replace($scope.endTime.substr($scope.endTime.lastIndexOf(':') + 1), '00') : $scope.startTime += ':00' : '' || '',
            currentPageNumber: 1, 
            pageSize: 10
          }
        }

        // 获取活动列表，通用方法
        var getList = function (data) {
          var reset = false;
          if (!data) {
            reset = true;
            var data = {
              currentPageNumber:1, 
              pageSize: 10
            }
          }

          $model.getActivityList(data).then(function(res) {
            // 重置
            if (reset) {
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
            $scope.activitylistConf = res.data;
            $scope.paginationConf = res.data;
          })
        }

        // 进入页面，获取活动列表
        getList();

        // 翻页获取活动列表
        $scope.$on('frompagechange', function (e,v,f) {
          var target = Object.assign({}, globalVariable.searchItem(), f)
          getList(target)
        })

        // 搜索
        $scope.search = function (e) {
          getList(globalVariable.searchItem());
        }

        // 重置
        $scope.searchreset = function () {
          getList();
        }

        // 点击新建，获取模板对应的配置页面
        $scope.$on('typefromActSample', function (e,v,f) {
          $model.getTemplateSpecific(f).then(function(res){
            $scope.allConfigTemplateConf = res.data;
            getLaunchInfo();        
          })
        })

        $model.step().then(function (res) {
          $scope.createConf = res.data;
        })
        

        // 操作面板，活动模板
        $model.getActSampleList().then(function (res) {
          $scope.createActModalConf = res.data;
          $scope.actsampleList = res.data.data;
        });

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
          var default_val = $('[ng-model="selectAllBrands"]').find('option:first').val();
          $scope.selectAllBrands = default_val;
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
              getList(globalVariable.searchItem())
            })
          })
        })
          
        // 停用活动
        $scope.$on('terminateActivity', function (e, v, f) {
          $('.end-activity-modal .btn-primary').on('click', function(){
            $model.changeActivityStatus(f).then(function(){
              $('.modal-content .close').trigger('click');
              getList(globalVariable.searchItem())
            })
          })
        })

        // 编辑活动
        $scope.$on('editActivity', function (e, v, f) {
          if(f.activityForm != 'act-4'){
              $model.editActivity({'activityCode': f.activityCode}).then(function(res){
                $scope.allConfigTemplateConf = res.data;
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

        // 
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
              $('[ng-model="selectBrandVal"]').multiselect('dataprovider', _.forEach(res.data.data, function(v){
                  v.label = v.name;
                  v.value = v.brandCode;
              }));
              $('[ng-model="selectBrandVal"]').multiselect('refresh');
              // 给一个默认的初始值
              var default_val = $('[ng-model="selectBrandVal"]').find('option:first').val();
              selectCompanyScope.selectBrandVal = default_val;
            })
          })

          // 根据品牌，选择规格
          $scope.$on('brandCode', function (e, v, f) {
            $model.getProductList(f).then(function (res) {
              var selectBrandScope = angular.element('.select-specification').scope();
              selectBrandScope.specification = res.data.data;
              $('[ng-model="selectSpecificationVal"]').multiselect('dataprovider', _.forEach(res.data.data, function(v){
                  v.label = v.allName;
                  v.value = v.sn;
              }));
              $('[ng-model="selectSpecificationVal"]').multiselect('refresh');
              // 给一个默认的初始值
              var default_val = $('[ng-model="selectSpecificationVal"]').find('option:first').val();
              selectBrandScope.selectSpecificationVal = default_val;
            })
          })
        }

        // 获取已编辑的信息
        function getAlreadySelectedLaunchInfo(selectedData) {
          if(selectedData.activityForm != 'act-4'){
            $(document).ready(function () {
              $(".multi .select").multiselect({
                nonSelectedText: '请选择',
                nSelectedText: '已选择',
                includeSelectAllOption: true,
                selectAllText: '全部',
                allSelectedText: '全选',
                enableFiltering: true,
                buttonWidth: '453px',
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
              $('.multiselect.dropdown-toggle').addClass('disabled');
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
              $('.multiselect.dropdown-toggle').addClass('disabled');
            })
            // 获取已编辑的地区
            // getArea({parentCode: 0}, '[ng-model="selectAreaVal"]', true, selectedData.activityAreaList)
          }else{
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
              $('.multiselect.dropdown-toggle').addClass('disabled');
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
              $('.multiselect.dropdown-toggle').addClass('disabled');
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
                      $('.multiselect.dropdown-toggle').addClass('disabled');
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

        // 新增礼品库存
        $scope.$on('giftaddstockid', function (e,v,f) {
          globalVariable.giftaddstockid = f;
        })
        
        $scope.confirmGiftStock = function () {
          if (globalVariable.giftaddstockid.firstornot) {
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
          $('.modal-content .close').trigger('click');
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
          }
          hbaddstockid = f;
        })
        $scope.confirmHbStock = function () {
          var addNum = {addNum: $scope.hbnumber};
          if(hbaddstockid.activityForm != 'act-4'){
            var data = {
              addNum: $scope.hbnumber,
              id: hbaddstockid.id
            };
            if (!hbaddstockid.id) {
              alert('请先选择红包');
              $('.modal-content .close').trigger('click');
              return
            }
            $model.addhbstock(data).then(function(res) {
              var the_drawprizewrap_val = $('.first-draw .ready-set').find('.draw-prize-wrap').eq(hbaddstockid.index).find('.money').val();
              var add_val = parseFloat(the_drawprizewrap_val) + parseFloat($('[ng-model="hbnumber"]').val());
              $('.first-draw .ready-set').find('.draw-prize-wrap').eq(hbaddstockid.index).find('.money').val(add_val);
              $('.modal-content .close').trigger('click');
            })
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
              $('.modal-content .close').trigger('click');
              
            }
          }
          
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
                getList();
              }
            } else {
              alert(res.data.message);
            }
          })
        })

        //调查问卷
        $scope.$on('questionnaireSaveData', function(e,v,f){
          $model.saveQuestionnair(f).then(function(res){
            if (res.data.ret === '200000') {
              $model.getTemplateSpecific({}).then(function(res){
                $scope.allConfigTemplateConf = null;      
              })
              getList();
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
        };

    	}]
  	}
  	return manageactsController
})