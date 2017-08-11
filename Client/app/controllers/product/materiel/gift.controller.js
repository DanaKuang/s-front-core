/**
 * Created by zhaobaoli on 2017/7/17.
 */
define([], function () {
    var giftController = {
        ServiceType: 'controller',
        ServiceName: 'GiftCtrl',
        ViewModelName: 'giftViewModel',
        ServiceContent: ['$scope', function ($scope) {

            var $model = $scope.$model;
            //初始化显示列表
            $scope.showTables = true;
            //初始化红包池列表显示
            $scope.showGiftList = true;
            var giftPicAttach = ''; //图片编码
            var giftPicUrl = ''; //图片保存地址
            $scope.operateGiftItem = null;  //操作的单个礼品
            $scope.noSearchData = false;  //未搜索到礼品信息
            $scope.noSearchLog = false;   //未搜索到礼品流水
            $scope.addGift = true;  //新增礼品标识
            //初始化分页信息
            $scope.pageSize = 15; //每页显示多少条
            $scope.currentPageNumber = 1; //当前页数
            $scope.totalPage = 0;//总页数
            var initPage = {
                currentPageNumber : $scope.currentPageNumber,
                pageSize : $scope.pageSize,
                metraType : 'gift'
            };

            //新建礼品
            $scope.createGift = function(){
                $scope.addGift = true;
                $scope.showTables = !$scope.showTables;
            };
            //礼品库/流水明细切换
            $scope.changeShowState = function(){
                $scope.showGiftList = !$scope.showGiftList;
                //清空搜索条件
                var SelectArr = $("select");
                for (var i = 0; i < SelectArr.length; i++) {
                    SelectArr[i].options[0].selected = true;
                }
                $('selectGiftName').val('');
                var pageObj = {
                    currentPageNumber : 1,
                    pageSize : $scope.pageSize
                };
                if($scope.showGiftList){
                    pageObj.metraType = 'gift';
                }else{
                    pageObj.logType = 'gift';
                }
                getDataList(pageObj);
            };
            //获取新建时启用状态的供应商列表
            var createSupply = {
                pageSize : '-1',
                status : 1
            };
            $model.getSupplyList(createSupply).then(function(res){
                if(res.status == 200){
                    $scope.enableSupplyList = res.data.data.list;
                    $scope.$apply();
                }
            });
            //获取全部供应商列表
            $model.getSupplyList({pageSize:'-1'}).then(function(res){
                if(res.status == 200){
                    $scope.allSupplyList = res.data.data.list;
                    $scope.$apply();
                }
            });
            //获取对应品牌
            $model.getBrandList().then(function(res){
                if(res.status == 200){
                    $scope.brandList = res.data.data;
                    $scope.$apply();
                }
            });
            //监听品牌选择信息
            $('#brand').change(function(){
                var curBrandValue = $(this).val();
                $model.getSpeciftByBrand({brandCode:curBrandValue}).then(function(res){
                    if(res.status == 200){
                        $scope.speciftList = res.data.data;
                        $scope.$apply();
                    }
                });
            });
            //监听搜索品牌选择信息
            $('#selectBrand').change(function(){
                var curBrandValue = $(this).val();
                $model.getSpeciftByBrand({brandCode:curBrandValue}).then(function(res){
                    if(res.status == 200){
                        $scope.selectSpeciftList = res.data.data;
                        $scope.$apply();
                    }
                });
            });
            //获取数据状态
            $model.getDataStatus().then(function(res){
                if(res.status == 200){
                    $scope.dataStatusList = res.data.data;
                    $scope.$apply();
                }
            });
            //获取操作动作维度值
            $model.getActiveValue().then(function(res){
                if(res.status == 200){
                    $scope.activeValueList = res.data.data;
                    $scope.$apply();
                }
            });
            //获取一级礼品类型
            $model.getGiftType().then(function(res){
                if(res.status == 200){
                    $scope.oneCategoryList = res.data.data;
                    $scope.$apply();
                }
            });
            //根据一级分类获取二级分类
            $('#oneCategory').change(function(){
                var curCategoryValue = $(this).val();
                $model.getGiftType({parentCode:curCategoryValue}).then(function(res){
                    if(res.status == 200){
                        $scope.secondCategoryList = res.data.data;
                        $scope.$apply();
                    }
                })

            });
            //重置功能
            $scope.resetData = function(){
                var SelectArr = $("select");
                for (var i = 0; i < SelectArr.length; i++) {
                    SelectArr[i].options[0].selected = true;
                }
                $('#selectGiftName').val('');
            };
            //搜索数据
            $scope.searchData = function(){
                var searchData = {
                    keys : $('#selectGiftName').val(),
                    supplierCode: $('#selectSupply option:selected').val(),
                    businessType : $('#selectTopCategory option:selected').val(),
                    brandCodes : $('#selectBrand option:selected').val(),
                    unitCodeArr : $('#selectSpecift option:selected').val(),
                    currentPageNumber : 1,
                    pageSize : $scope.pageSize
                };
                if($scope.showGiftList){
                    searchData.status = $('#giftStatus option:selected').val();
                    searchData.metraType = 'gift';
                } else{
                    searchData.operCode = $('#selectActive option:selected').val();
                    searchData.logType = 'gift';
                }
                getDataList(searchData);

            };
            //取消新建红包
            $scope.cancelCreateGift = function(){
                $scope.showTables = !$scope.showTables;
                clearCreatGift();
            };

            //礼品图片上传
            $('#giftImg').change(function(){
                var giftImgFile = $('#giftImg')[0].files[0];
                if(giftImgFile != undefined){
                    $('.gift_img_warn').html('文件上传中...');
                    var formData = new FormData();
                    formData.append('file',giftImgFile);
                    $.ajax({
                        url: '/api/tztx/saas/saotx/attach/commonAliUpload',
                        type: 'POST',
                        cache: false,
                        data: formData,
                        processData: false,
                        contentType: false,
                        headers: {
                            ContentType: "multipart/form-data",
                            loginId : sessionStorage.access_loginId ,
                            token : sessionStorage.access_token
                        }
                    }).done(function(res) {
                        if(res.ret == "200000"){
                            $('.gift_img_warn').html('文件上传成功');
                            var fileSuccessData = res.data;
                            giftPicAttach = fileSuccessData.attachCode; //图片编码
                            giftPicUrl = fileSuccessData.accessUrl; //图片保存地址
                            $('#giftImgName').html(fileSuccessData.filename);
                        }
                    }).fail(function(res) {
                        $('.gift_img_warn').html('文件上传失败');
                    });
                }
            });

            //清空新建礼品列表
            function clearCreatGift(){
                var SelectArr = $("select");
                for (var i = 0; i < SelectArr.length; i++) {
                    SelectArr[i].options[0].selected = true;
                }
                $('#giftName').val(''); //清空供应商名称
                //清空图片上传
                $('#giftImg').val('');
                $('#giftImgName').html('');
                $('.gift_img_warn').html('图片规格要求：建议尺寸330*330');
                $('#marketValue').val('');  //清空市面价值
                $('#stock').val('');  //清空库存
                $('#stockThresh').val('');  //清空库存阀值
                $('#linkUrl').val('');  //清空链接URL
            }

            //保存礼品信息
            $scope.saveGiftData = function(){
                //礼品名称
                var giftName = $('#giftName').val();
                if(giftName == ''){
                    $('.gift_name_warn').show();
                    return;
                }else{
                    $('.gift_name_warn').hide();
                }
                //获取一级分类
                var oneCateValue = $('#oneCategory').val();
                if(oneCateValue == ''){
                    $('.category_warn').html('一级类目不能为空').show();
                    return;
                }else{
                    $('.category_warn').html('').hide();
                }
                //获取二级类目
                var secCateValue = $('#secondCategory').val();
                if(oneCateValue == '2' && secCateValue == ''){
                    $('.category_warn').html('二级类目不能为空').show();
                    return;
                }else {
                    $('.category_warn').html('').hide();
                }
                //获取供应商
                var enableSupplyValue = $('#enableSupply').val();
                if(enableSupplyValue == ''){
                    $('.gift_supply_warn').show();
                    return;
                }else{
                    $('.gift_supply_warn').hide();
                }
                //获取适用品牌
                var brandObj = $('#brand');
                var brandValue = brandObj.val();
                if(brandValue == ''){
                    $('.apply_brand_warn').show();
                    return;
                }else{
                    $('.apply_brand_warn').hide();
                }
                //获取适用规格
                var applySpeciftObj = $('#applySpecift');
                var applySpeciftValue = applySpeciftObj.val();
                if(applySpeciftValue == ''){
                    $('.apply_specift_warn').show();
                    return;
                }else{
                    $('.apply_specift_warn').hide();
                }
                //市面价值
                var marketValue = $('#marketValue').val();
                if(marketValue != ''){
                    var regNum = /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;
                    if(regNum.test(marketValue)){
                        var numStr = marketValue.toString().indexOf('.');
                        if(numStr > -1){
                            marketValue = Number(marketValue.toString().match(/^\d+(?:\.\d{0,2})?/));
                        }
                    }else {
                        $('.market_value_warn').html('请输入大于0的数字').show();
                        return;
                    }
                }

                //库存
                var stockVal = $('#stock').val();
                var regNum = /^\+?[1-9][0-9]*$/;
                if(!regNum.test(stockVal)){
                    $('.stock_warn').show();
                    return;
                }else{
                    $('.stock_warn').hide();
                }
                //库存阀值
                var stockThreshValue = $('#stockThresh').val();
                if(parseInt(stockThreshValue) > parseInt(stockVal)){
                    $('.stockThresh_warn').show();
                    return;
                }else{
                    $('.stockThresh_warn').hide();
                }
                //链接url
                var linkUrlVal = $('#linkUrl').val();

                //开始保存数据
                var giftDataObj = {
                    name : giftName,
                    giftClass : oneCateValue,
                    giftType : secCateValue,
                    supplierCode : enableSupplyValue,
                    brandCodes : brandValue,
                    brandNames : brandObj.find("option:selected").text(),
                    units : applySpeciftValue,
                    unitNames : applySpeciftObj.find("option:selected").text(),
                    marketMoney : marketValue,
                    giftPicAttach : giftPicAttach,
                    giftPic : giftPicUrl,
                    stock : stockVal,
                    stockWarning : stockThreshValue,
                    giftUrl : linkUrlVal
                };

                //判断是否是编辑
                if(!$scope.addGift){
                    giftDataObj.id = $scope.operateGiftItem.id;
                }

                $model.saveOrUpdateData(giftDataObj).then(function(res){
                    console.log('保存数据');
                    console.log(res);
                    if(res.data.ret == 200000){
                        //$scope.secondCategoryList = res.data.data;
                        $scope.showGiftList = true;
                        $scope.showTables = !$scope.showTables;
                        getDataList(initPage);
                        clearCreatGift();
                        $scope.$apply();
                    }else{
                        //提示保存失败
                        var errorTimer = null;
                        $('.gift_error_box').modal('show');
                        errorTimer = setTimeout(function(){
                            $('.gift_error_box').modal('hide');
                            clearTimeout(errorTimer);
                        },3000)
                    }
                })
            };

            //创建分页工具
            function createPageTools(pageData){
                $(".tcdPageCode").createPage({
                    pageCount: pageData.allPages,
                    current : pageData.currentPage,
                    backFn : function(pageNum){
                        var curPageData = {
                            currentPageNumber : pageNum,
                            pageSize : $scope.pageSize
                        };
                        if($scope.showGiftList){
                            curPageData.metraType = 'gift';
                        }else{
                            curPageData.logType = 'gift';
                        }
                        getDataList(curPageData);
                    }
                });
            }
            //获取红包池列表
            function getDataList(pageObj){
                if($scope.showGiftList){
                    //显示红包池信息
                    $model.getGiftList(pageObj).then(function(res){
                        if(res.status == 200){
                            var giftObj = res.data.data;
                            if(giftObj.list != null){
                                $scope.noSearchData = false;
                                $scope.giftList = giftObj.list;
                                $scope.totalPage = giftObj.page.pageNumber;
                                $scope.totalCount = giftObj.page.count;
                                $scope.currentPageNumber = giftObj.page.currentPageNumber;
                                var pageObj = {
                                    allPages : giftObj.page.pageNumber,
                                    currentPage : giftObj.page.currentPageNumber,
                                    metraType : 'gift'
                                };
                                if ($(".tcdPageCode").createPage) {
                                    $(".tcdPageCode").remove();
                                }
                                $(".page_sec").append("<div class='tcdPageCode'></div>");
                                $scope.$apply();
                                createPageTools(pageObj);
                            }else{
                                $scope.noSearchData = true;
                                $scope.totalPage = 0;
                                $scope.totalCount = 0;
                                $scope.giftList = [];
                                $scope.$apply();
                            }
                        }
                    });
                }else{
                    //显示礼品流水明细
                    $model.getGiftDetail(pageObj).then(function(res){
                        if(res.status == 200){
                            var detailObj = res.data.data;
                            if(detailObj.list != null){
                                $scope.noSearchLog = false;
                                $scope.detailList = detailObj.list;
                                $scope.totalPage = detailObj.page.pageNumber;
                                $scope.totalCount = detailObj.page.count;
                                $scope.currentPageNumber = detailObj.page.currentPageNumber;
                                var pageObj = {
                                    allPages : detailObj.page.pageNumber,
                                    currentPage : detailObj.page.currentPageNumber,
                                    logType : 'gift'
                                };
                                if ($(".tcdPageCode").createPage) {
                                    $(".tcdPageCode").remove();
                                }
                                $(".page_sec").append("<div class='tcdPageCode'></div>");
                                $scope.$apply();
                                createPageTools(pageObj)
                            }else{
                                $scope.noSearchLog = true;
                                $scope.totalPage = 0;
                                $scope.totalCount = 0;
                                $scope.detailList = [];
                                $scope.$apply();
                            }
                        }
                    })
                }
            }
            //初始化获取列表
            getDataList(initPage);

            //更新礼品的使用状态
            function changeGiftStatus(itemObj){
                var successTimer = null;
                var errorTimer = null;
                var stateNum = 0;
                if(itemObj.status == 0){
                    stateNum = 1;
                }
                var disableObj = {
                    id : itemObj.id,
                    status : stateNum
                };
                $model.modifyGiftStatus(disableObj).then(function(res){
                    if(res.status == 200){
                        $('.gift_success_box').modal('show');
                        successTimer = setTimeout(function(){
                            $('.gift_success_box').modal('hide');
                            clearTimeout(successTimer);
                        },3000);
                        var curPageObj = {
                            currentPageNumber : $scope.currentPageNumber,
                            pageSize : $scope.pageSize,
                            metraType : 'gift'
                        };
                        getDataList(curPageObj);
                    }else {
                        $('.gift_error_box').modal('show');
                        errorTimer = setTimeout(function(){
                            $('.gift_error_box').modal('hide');
                            clearTimeout(errorTimer);
                        },3000)
                    }
                })
            }
            //礼品停用状态
            $scope.stopStatus = function(giftItem){
                $('.disabled_gift_box').modal('show');
                $scope.operateGiftItem = giftItem;
            };
            //启用红包
            $scope.useStatus = function(giftItem){
                changeGiftStatus(giftItem);
            };
            //确认停用
            $scope.confirmStopStatus = function(operateGiftItem){
                $('.disabled_gift_box').modal('hide');
                changeGiftStatus(operateGiftItem);
            };
            //增库操作
            $scope.addGiftPool = function(giftItem){
                $scope.operateGiftItem = giftItem;
                if(giftItem.status == 0){
                    $('.not_add_pool_box').modal('show');
                }else{
                    $('.add_pool_box').modal('show');
                }
            };
            //确定礼品增库
            $scope.confirmAddPool = function(operateGiftItem){
                var giftStock = $('#addGiftStock').val();
                var regStock = /^\+?[1-9][0-9]*$/;
                if(!regStock.test(giftStock)){
                    $('.add_stock_warn').show();
                    return;
                }else{
                    $('.add_stock_warn').hide();
                }
                var addPoolObj = {
                    id : operateGiftItem.id,
                    addNum : giftStock
                };
                $model.addGiftPool(addPoolObj).then(function(res){
                    if(res.data.ret == "200000"){
                        $('.add_pool_box').modal('hide');
                        $('.add_stock_warn').hide();
                        $('#addGiftStock').val('');
                        var curPageObj = {
                            currentPageNumber : $scope.currentPageNumber,
                            pageSize : $scope.pageSize,
                            metraType : 'gift'
                        };
                        getDataList(curPageObj);
                    }
                });
            };
            //取消增加礼品库
            $scope.cancelAddGiftStock = function(){
                $('.add_pool_box').modal('hide');
                $('.add_stock_warn').hide();
                $('#addGiftStock').val('');
            };
            //编辑礼品
            $scope.editGiftItem = function(giftItem){
                $scope.addGift = false;
                $scope.operateGiftItem = giftItem;
                //礼品名称
                $('#giftName').val(giftItem.name);
                //一级类目
                $("#oneCategory option").each(function(){
                    var curOneCategoryObj = $(this)[0];
                    if(giftItem.giftClass == curOneCategoryObj.value){
                        curOneCategoryObj.selected = true;
                    }
                });
                //二级类目（如果一级类目是虚拟则存在二级类目）
                if(giftItem.giftClass == 2){
                    $model.getGiftType({parentCode:giftItem.giftClass}).then(function(res){
                        if(res.status == 200){
                            $scope.secondCategoryList = res.data.data;
                            $scope.$apply();
                        }
                        $("#secondCategory option").each(function(){
                            var curSecondCategoryObj = $(this)[0];
                            if(giftItem.giftType == curSecondCategoryObj.value){
                                curSecondCategoryObj.selected = true;
                            }
                        });
                    });
                }
                //供应商
                $("#enableSupply option").each(function(){
                    var curEnableSupplyObj = $(this)[0];
                    if(giftItem.supplierCode == curEnableSupplyObj.value){
                        curEnableSupplyObj.selected = true;
                    }
                });
                //品牌
                $("#brand option").each(function(){
                    var curBrandObj = $(this)[0];
                    if(giftItem.brandCodes == curBrandObj.value){
                        curBrandObj.selected = true;
                    }
                });
                //适用规格
                if(giftItem.brandCodes != '' && giftItem.brandCodes != null){
                    $model.getSpeciftByBrand({brandCode: giftItem.brandCodes}).then(function(res){
                        if(res.status == 200){
                            $scope.speciftList = res.data.data;
                            $scope.$apply();
                        }
                        $("#applySpecift option").each(function(){
                            var applySpeciftObj = $(this)[0];
                            if(giftItem.units == applySpeciftObj.value){
                                applySpeciftObj.selected = true;
                            }
                        });
                    });
                }
                //市值
                $('#marketValue').val(giftItem.marketMoney);
                //礼品图片
                giftPicAttach = giftItem.giftPicAttach;
                giftPicUrl = giftItem.giftPic;
                $('#giftImgName').html(giftItem.giftPicName);
                //库存
                $('#stock').val(giftItem.stock);
                //库存阀值
                $('#stockThresh').val(giftItem.stockWarning);
                //链接URL
                $('#linkUrl').val(giftItem.giftUrl);



                $scope.showTables = !$scope.showTables;
            }

        }]
    };

    return giftController;
});