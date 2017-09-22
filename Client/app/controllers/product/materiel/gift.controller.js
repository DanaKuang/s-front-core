/**
 * Created by zhaobaoli on 2017/7/17.
 */
define([], function () {
    var giftController = {
        ServiceType: 'controller',
        ServiceName: 'GiftCtrl',
        ViewModelName: 'giftViewModel',
        ServiceContent: ['$scope','limitlengthFilter', 'dateFormatFilter', function ($scope,limitlengthFilter,dateFormatFilter) {
            //$('.add_cami_box').modal('show');
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
            var addCamiAttach = ''; //新增卡密文件
            var camiAttach = '';  //卡密文件
            var camiFileName = '';
            $scope.startTime = ''; //礼品有效期起始时间
            $scope.endTime = '';
            $scope.effectDays = -1; //礼品有效期标识
            var camiFileCount = ''; //卡密文件数量
            var addCimiFileCount = '';

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
                if($scope.addGift){
                    //获取新建时启用状态的供应商列表
                    var createSupply = {
                        pageSize : '-1',
                        status : 1
                    };
                    $model.getSupplyList(createSupply).then(function(res){
                        if(res.data.ret == 200000){
                            $scope.enableSupplyList = res.data.data.list;
                            $scope.$apply();
                        }
                    });
                    if($scope.effectDays == 0){
                        $('.time_validity').css('display','inline-block');
                    }else{
                        $('.time_validity').css('display','none');
                    }
                }
            };
            //礼品库/流水明细切换
            $scope.changeShowState = function(){
                $scope.showGiftList = !$scope.showGiftList;
                //清空搜索条件
                var SelectArr = $(".select_sec select");
                for (var i = 0; i < SelectArr.length; i++) {
                    SelectArr[i].options[0].selected = true;
                }
                $('#selectGiftName').val('');
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
                    $("select#brand").multiselect({
                        nonSelectedText: '请选择',
                        allSelectedText: '全部',
                        nSelectedText: '已选择',
                        selectAll:true,
                        selectAllText: '全部',
                        selectAllValue: 'all',
                        buttonWidth: '180px'
                    });
                }
            });

            $(document).ready(function () {
                 $("select.multi").multiselect({
                     nonSelectedText: '请选择',
                     allSelectedText: '全部',
                     nSelectedText: '已选择',
                     selectAll:true,
                     selectAllText: '全部',
                     selectAllValue: 'all',
                     buttonWidth: '180px'
                 });
             });
            /*$('#brand').on('click', function () {
                $model.getBrandList().then(function(res){
                    if(res.status == 200){
                        $scope.brandList = res.data.data;
                        $('[ng-model="selectAllBrands"]').multiselect('dataprovider', _.forEach($scope.brandList, function(v){
                            v.label = v.name;
                            v.value = v.brandCode;
                        }));
                        $('[ng-model="selectAllBrands"]').multiselect('refresh');
                    }
                })
            });*/
            //监听品牌选择信息
            $scope.$watch('selectAllBrands', function(n, o, s) {
                if (n !== o) {
                    $scope.selectAllBrands = n;
                    var brandListArrObj = {};
                    brandListArrObj.brandCode = n;
                    $model.getSpeciftByBrand(brandListArrObj).then(function (res) {
                        if(res.data.ret == "200000"){
                            $scope.speciftList = res.data.data;
                            $('[ng-model="selectSpeci"]').multiselect('dataprovider', _.forEach($scope.speciftList, function(v){
                                v.label = v.allName;
                                v.value = v.sn;
                            }));
                            $('[ng-model="selectSpeci"]').multiselect('refresh');
                        }
                    })
                }
            });
            $scope.$watch('selectSpeci', function (n, o, s) {
                if (n !== o) {
                    $scope.selectSpeci = n;
                }
            });
            /*$('#brand').change(function(){
                var curBrandValue = $(this).val();
                console.log(curBrandValue);
                $model.getSpeciftByBrand({brandCode:curBrandValue}).then(function(res){
                    if(res.status == 200){
                        $scope.speciftList = res.data.data;
                        $scope.$apply();
                        $("select#applySpecift").multiselect({
                            nonSelectedText: '请选择',
                            allSelectedText: '全部',
                            nSelectedText: '已选择',
                            selectAll:true,
                            selectAllText: '全部',
                            selectAllValue: 'all',
                            buttonWidth: '180px'
                        });
                    }
                });
            });*/
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
                var SelectArr = $(".select_sec select");
                for (var i = 0; i < SelectArr.length; i++) {
                    SelectArr[i].options[0].selected = true;
                }
                $('#selectGiftName').val('');
                var pageObj = {
                    currentPageNumber : 1,
                    pageSize : $scope.pageSize
                };
                if($scope.showGiftList){
                    pageObj.metraType = 'gift';
                }else{
                    pageObj.logType = 'gift';
                }
                getDataList(pageObj)
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
                $('.cancel_box').modal('show');
            };
            //确认取消
            $scope.confirmCancel = function(){
                $('.cancel_box').modal('hide');
                clearCreatGift();
                $scope.showTables = !$scope.showTables;
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
                            $('#giftImgName').css('color','#666').html(fileSuccessData.filename);
                        }
                    }).fail(function(res) {
                        $('.gift_img_warn').html('文件上传失败');
                    });
                }
            });

            //清空新建礼品列表
            function clearCreatGift(){
                /*var SelectArr = $("select");
                for (var i = 0; i < SelectArr.length; i++) {
                    SelectArr[i].options[0].selected = true;
                }*/
                $('#oneCategory')[0].options[0].selected = true;
                $('#secondCategory')[0].options[0].selected = true;
                $('#enableSupply')[0].options[0].selected = true;
                $('#giftName').val(''); //清空供应商名称
                //清空图片上传
                $('#giftImg').val('');
                $('#giftImgName').html('');
                $('.gift_img_warn').html('图片规格要求：建议尺寸330*330');
                $('#marketValue').val('');  //清空市面价值
                $('#stock').val('');  //清空库存
                $('#stockThresh').val('');  //清空库存阀值
                $('#linkUrl').val('');  //清空链接URL
                $scope.effectDays = -1; //礼品有效期
                $scope.startTime = '';
                $scope.endTime = '';
                $scope.selectAllBrands = '';  //清空适用品牌
                $scope.selectSpeci = '';     //清空适用规格
                $('#giftBrief').val('');    //清空礼品描述
                camiAttach = '';  //清空卡密文件信息
                camiFileName = '';
                $('#camiCreateName').html('');
                $('.cami_file_warn').html('仅当新建礼品为卡密类虚拟礼品时，需上传csv/excel格式卡密文件');
                $('[ng-model="selectAllBrands"]').multiselect().val([]).multiselect("refresh");
                $('[ng-model="selectSpeci"]').multiselect().val([]).multiselect("refresh");
                //隐藏警告弹框
                $('.gift_name_warn').hide();
                $('.category_warn').hide();
                $('.gift_supply_warn').hide();
                $('.apply_brand_warn').hide();
                $('.apply_specift_warn').hide();
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
                var brandNames = $('.brand_names .multiselect').attr('title');
                if(brandValue == '' || brandValue.length == 0){
                    $('.apply_brand_warn').show();
                    return;
                }else{
                    brandValue = brandValue.join(',');
                    $('.apply_brand_warn').hide();
                }
                //获取适用规格
                var applySpeciftObj = $('#applySpecift');
                var applySpeciftValue = applySpeciftObj.val();
                var speciftNames = $('.specift_names .multiselect').attr('title');
                if(applySpeciftValue == '' || applySpeciftValue.length == 0){
                    $('.apply_specift_warn').show();
                    return;
                }else{
                    applySpeciftValue = applySpeciftValue.join(',');
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
                //礼品图片
                if(giftPicAttach == ''){
                    $('#giftImgName').css('color','#ff3300').html('礼品图片不能为空');
                    return;
                }else{
                    $('#giftImgName').css('color','#666').html('');
                }
                //库存
                var stockVal = $('#stock').val();
                var regNum = /^\+?[1-9][0-9]*$/;
                if(!regNum.test(stockVal)){
                    $('.stock_warn').show();
                    return;
                }else{
                    if(camiFileCount != ''){
                        if(stockVal == camiFileCount){
                            $('.stock_warn').hide();
                            $('.cami_file_warn').css('color','#ACACAC').html('');
                        }else{
                            $('.cami_file_warn').css('color','#ff3300').html('录入'+ camiFileCount+ '条卡密数据，与库存数值不符');
                            return;
                        }
                    }
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
                //礼品有效期
                var camiValidity = $("input[type='radio']:checked").val();
                if(camiValidity == 0){
                    var camiStartTime = $scope.startTime;
                    var camiEndTime = $scope.endTime;
                    if(camiStartTime == '' || camiEndTime == ''){
                        $('.cami_validity_warn').css('color','#ff3300').html('起始日期/终止日期不可为空');
                        return;
                    }
                }
                //礼品描述
                var giftBriefInfo = $('#giftBrief').val();

                //开始保存数据
                var giftDataObj = {
                    name : giftName,
                    giftClass : oneCateValue,
                    giftType : secCateValue,
                    supplierCode : enableSupplyValue,
                    brandCodes : brandValue,
                    //brandNames : brandObj.find("option:selected").text(),
                    brandNames : brandNames,
                    units : applySpeciftValue,
                    //unitNames : applySpeciftObj.find("option:selected").text(),
                    unitNames : speciftNames,
                    marketMoney : marketValue,
                    giftPicAttach : giftPicAttach,
                    giftPic : giftPicUrl,
                    stock : stockVal,
                    stockWarning : stockThreshValue,
                    giftUrl : linkUrlVal,
                    effectDays : camiValidity,
                    cardsAttach : camiAttach,
                    memo : giftBriefInfo
                };

                if(giftDataObj.effectDays == 0){
                    giftDataObj.stimeStr = $scope.startTime+ ' 00:00:00';
                    giftDataObj.etimeStr = $scope.endTime+ ' 23:59:59';
                }

                //判断是否是编辑
                if(!$scope.addGift){
                    giftDataObj.id = $scope.operateGiftItem.id;
                }

                $model.saveOrUpdateData(giftDataObj).then(function(res){
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
                    //显示礼品池信息
                    $model.getGiftList(pageObj).then(function(res){
                        if(res.data.ret == 200000){
                            var giftObj = res.data.data;
                            if(giftObj.list != null){
                                for(var i=0;i<giftObj.list.length;i++){
                                    giftObj.list[i].showName = limitlengthFilter.limitLength(giftObj.list[i].name,5);
                                    giftObj.list[i].showSupplierName = limitlengthFilter.limitLength(giftObj.list[i].supplierName,5);
                                    giftObj.list[i].showBrandNames = limitlengthFilter.limitLength(giftObj.list[i].brandNames,5);
                                    giftObj.list[i].showUnitNames = limitlengthFilter.limitLength(giftObj.list[i].unitNames,5);
                                }
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
                                for(var i=0;i<detailObj.list.length;i++){
                                    detailObj.list[i].showBusinessName = limitlengthFilter.limitLength(detailObj.list[i].businessName,6);
                                    detailObj.list[i].showSupplierName = limitlengthFilter.limitLength(detailObj.list[i].supplierName,6);
                                    detailObj.list[i].showActivityName = limitlengthFilter.limitLength(detailObj.list[i].activityName,6);
                                    detailObj.list[i].showBrandNames = limitlengthFilter.limitLength(detailObj.list[i].brandNames,5);
                                    detailObj.list[i].showProdUnitsNames = limitlengthFilter.limitLength(detailObj.list[i].prodUnitsNames,5);
                                }
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
                    if(itemObj.effectDays == -1){
                        stateNum = 1;
                    }else if(itemObj.effectDays == 0){
                        var curentTime = new Date().getTime();
                        if(curentTime > itemObj.etime){
                            $('.expiration_date_box').modal('show');
                            return;
                        }else{
                            stateNum = 1;
                        }
                    }

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
                if(giftItem.supplierStatus == 1){
                    if(giftItem.status == 1){
                        //$('.add_pool_box').modal('show');
                        if(giftItem.hasCards == 1){
                            $('.add_cami_box').modal('show');
                        }else{
                            $('.add_pool_box').modal('show');
                        }
                    }else{
                        $('.gift_stop_box').modal('show');
                    }
                }else{
                    $('.supply_stop_box').modal('show');
                }
            };
            //确定礼品增库
            $scope.confirmAddPool = function(operateGiftItem){
                var regStock = /^\+?[1-9][0-9]*$/;
                var addPoolObj = {
                    id : operateGiftItem.id
                };
                if(operateGiftItem.hasCards == 1){
                    var addGiftStock = $('#addGiftCamiStock').val();
                    if(!regStock.test(addGiftStock)){
                        $('.add_cami_box .add_stock_warn').css({'display':'inline-block','margin-left':'10px'});
                        return;
                    }else{
                        $('.add_cami_box .add_stock_warn').css('display','none');
                        addPoolObj.addNum = addGiftStock;
                        if(addCamiAttach != ''){
                            addPoolObj.cardsAttach = addCamiAttach;
                            $('.add_cami_box .add_stock_warn').css({'display':'none','margin-left':'-133px'});
                        }else{
                            $('.cami_explain').css('color','#ff3300').html('未上传卡密文件');
                            return;
                        }
                    }
                }else{
                    var giftStock = $('#addGiftStock').val();
                    if(!regStock.test(giftStock)){
                        $('.add_pool_box .add_stock_warn').show();
                        return;
                    }else{
                        addPoolObj.addNum = giftStock;
                        $('.add_pool_box .add_stock_warn').hide();
                    }
                }

                $model.addGiftPool(addPoolObj).then(function(res){
                    if(res.data.ret == "200000"){
                        if(operateGiftItem.hasCards == 1){
                            $('.add_cami_box').modal('hide');
                            $('.add_cami_box .add_stock_warn').css({'display':'none','margin-left':'-133px'});
                            $('#addGiftCamiStock').val('');
                            $('.cami_explain').css('margin-left','135px').html('请确保增库物料与原物料有效期相同');
                            $('.cami_name').html('');
                            addCamiAttach = '';
                        }else{
                            $('.add_pool_box').modal('hide');
                            $('.add_pool_box .add_stock_warn').hide();
                            $('#addGiftStock').val('');
                        }
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
                /*$('.add_pool_box').modal('hide');
                $('.add_stock_warn').hide();
                $('#addGiftStock').val('');*/
                if($scope.operateGiftItem.hasCards == 1){
                    $('.add_cami_box').modal('hide');
                    $('.add_cami_box .add_stock_warn').css({'display':'none','margin-left':'-133px'});
                    $('#addGiftCamiStock').val('');
                    $('.cami_name').html('');
                    $('.cami_explain').css('margin-left','135px').html('请确保增库物料与原物料有效期相同');
                    addCamiAttach = '';
                }else{
                    $('.add_pool_box').modal('hide');
                    $('.add_pool_box .add_stock_warn').hide();
                    $('#addGiftStock').val('');
                }
            };
            //时间格式化
            function timesFormatStr(times){
                return times.getFullYear() + "-" + (times.getMonth() + 1) + "-" + times.getDate();
            }
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
                //编辑状态
                if(!$scope.addGift){
                    var createSupply = {
                        pageSize : '-1'
                    };
                    $model.getSupplyList(createSupply).then(function(res){
                        if(res.data.ret == 200000){
                            $scope.enableSupplyList = res.data.data.list;
                            $scope.$apply();
                            //供应商
                            $("#enableSupply option").each(function(){
                                var curEnableSupplyObj = $(this)[0];
                                if(giftItem.supplierCode == curEnableSupplyObj.value){
                                    curEnableSupplyObj.selected = true;
                                }
                            });
                        }
                    });
                }

                //品牌
                /*$("#brand option").each(function(){
                    var curBrandObj = $(this)[0];
                    if(giftItem.brandCodes == curBrandObj.value){
                        curBrandObj.selected = true;
                    }
                });*/
                //$('[ng-model="selectAllBrands"]').multiselect().val([]).multiselect("refresh");
                //$('[ng-model="selectSpeci"]').multiselect().val([]).multiselect("refresh");
                var brandValArr = giftItem.brandCodes.split(',');
                $('[ng-model="selectAllBrands"]').multiselect().val(brandValArr).multiselect("refresh");
                $('.brand_names .multiselect').attr('title',giftItem.brandNames);
                //适用规格
                if(giftItem.brandCodes != '' && giftItem.brandCodes != null){
                    $model.getSpeciftByBrand({brandCode: giftItem.brandCodes}).then(function(res){
                        if(res.status == 200){
                            $scope.speciftList = res.data.data;
                            $scope.$apply();
                            var speciftValArr = giftItem.units.split(',');
                            $('[ng-model="selectSpeci"]').multiselect().val(speciftValArr).multiselect("refresh");
                            $('.specift_names .multiselect').attr('title',giftItem.unitNames);
                        }
                        /*$("#applySpecift option").each(function(){
                            var applySpeciftObj = $(this)[0];
                            if(giftItem.units == applySpeciftObj.value){
                                applySpeciftObj.selected = true;
                            }
                        });*/
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
                //礼品有效期  effectDays
                $scope.effectDays = giftItem.effectDays;
                if($scope.effectDays == 0){
                    $('.time_validity').css('display','inline-block');
                    var stimeStr = new Date(giftItem.stime);
                    var etimeStr = new Date(giftItem.etime);
                    $scope.startTime = timesFormatStr(stimeStr);
                    $scope.endTime = timesFormatStr(etimeStr);
                }else{
                    $('.time_validity').css('display','none');
                }
                //卡密文件
                //camiAttach = giftItem.cardsAttach;
                if(giftItem.hasCards == 1){
                    $('#camiCreateName').html('已成功上传卡密文件');
                }
                //礼品描述
                $('#giftBrief').val(giftItem.memo);
                $scope.showTables = !$scope.showTables;
            };
            //监听有效期选中事件
            $("input:radio").click(function(){
                var cutVal = $(this).val();
                if(cutVal == 0){
                    $('.time_validity').css('display','inline-block');
                    $scope.effectDays = 0;
                }else{
                    $('.time_validity').css('display','none');
                    $scope.effectDays = -1;
                }

            });
            var fileTypeArr = ['xlsx','xls','csv'];
            //卡密文件上传
            $('#camiCreateFile').change(function(){
                var camiFile = $('#camiCreateFile')[0].files[0];
                //fileLimit 52428800  type fileExt(xlsx,xls,csv)
                if(camiFile != undefined){
                    var curFileName = camiFile.name;
                    var fileType = curFileName.substring(curFileName.lastIndexOf('.')+1,curFileName.length);
                    if(fileTypeArr.indexOf(fileType) == -1){
                        $('.cami_file_warn').css('color','#ff3300').html('此文件格式不符，请上传csv/excel格式文件');
                        $('#camiCreateName').html('');
                        camiAttach = '';
                        return;
                    }
                    if(camiFile.size > 10485760){
                        $('.cami_file_warn').css('color','#ff3300').html('上传文件大小不可超过10MB');
                        $('#camiCreateName').html('');
                        camiAttach = '';
                        return;
                    }
                    $('.cami_file_warn').css('color','#ACACAC').html('文件上传中...');
                    var formData = new FormData();
                    formData.append('file',camiFile);
                    $.ajax({
                        url: '/api/tztx/saas/saotx/metra/uploadCards',
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
                        var stockVal = $('#stock').val();
                        camiFileCount = res.data.successCount;
                        if(stockVal != null && stockVal != undefined && stockVal != ''){
                            if(res.data.successCount == stockVal){
                                camiAttach = res.data.attach.attachCode;
                                camiFileName = res.data.attach.filename;
                                $('#camiCreateName').css('color','#666').html(res.data.attach.filename);
                                $('.cami_file_warn').css('color','#ACACAC').html('文件上传成功，录入'+ res.data.successCount+ '条卡密数据');
                            }else{
                                $('.cami_file_warn').css('color','#ff3300').html('录入'+ res.data.successCount+ '条卡密数据，与库存数值不符');
                                return;
                            }
                        }else{
                            camiAttach = res.data.attach.attachCode;
                            camiFileName = res.data.attach.filename;
                            $('#camiCreateName').css('color','#666').html(res.data.attach.filename);
                            $('.cami_file_warn').css('color','#ACACAC').html('文件上传成功，录入'+ res.data.successCount+ '条卡密数据');
                        }

                    }).fail(function(res) {
                        $('.cami_file_warn').css('color','#ff3300').html('录入文件失败');
                    });
                }
            });
            //增库卡密文件上传
            $('#addPoolCamiFile').change(function(){
                var addCamiFile = $('#addPoolCamiFile')[0].files[0];
                //fileLimit 52428800  type fileExt(xlsx,xls,csv)
                if(addCamiFile != undefined){
                    var curAddFileName = addCamiFile.name;
                    var addFileType = curAddFileName.substring(curAddFileName.lastIndexOf('.')+1,curAddFileName.length);
                    if(fileTypeArr.indexOf(addFileType) == -1){
                        $('.cami_explain').css('color','#ff3300').html('此文件格式不符，请上传csv/excel格式文件');
                        $('.cami_name').css('color','#666').html('');
                        return;
                    }
                    if(addCamiFile.size > 10485760){
                        $('.cami_explain').css('color','#ff3300').html('上传文件大小不可超过10MB');
                        $('.cami_name').css('color','#666').html('');
                        return;
                    }
                    $('.cami_explain').css('color','#ACACAC').html('文件上传中...');
                    $('.cami_name').css('color','#666').html('');
                    var formData = new FormData();
                    formData.append('file',addCamiFile);
                    $.ajax({
                        url: '/api/tztx/saas/saotx/metra/uploadCards',
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
                        //addCamiAttach = res.data.attachCode;
                        //camiFileName = res.data.filename;
                        /*$('.cami_name').css('color','#666').html(res.data.filename);
                        $('.cami_explain').css('color','#ACACAC').html('文件上传成功！');*/

                        var addStockVal = $('#addGiftCamiStock').val();
                        addCimiFileCount = res.data.successCount;
                        if(addStockVal != null && addStockVal != undefined && addStockVal != ''){
                            if(res.data.successCount == addStockVal){
                                addCamiAttach = res.data.attach.attachCode;
                                //camiFileName = res.data.attach.filename;
                                $('.cami_name').css('color','#666').html(res.data.attach.filename);
                                $('.cami_explain').css('color','#ACACAC').html('文件上传成功，录入'+ res.data.successCount+ '条卡密数据');
                            }else{
                                $('.cami_explain').css('color','#ff3300').html('录入'+ res.data.successCount+ '条卡密数据，与库存数值不符');
                                $('.cami_name').css('color','#666').html('');
                                return;
                            }
                        }else{
                            addCamiAttach = res.data.attach.attachCode;
                            //camiFileName = res.data.attach.filename;
                            $('.cami_name').css('color','#666').html(res.data.attach.filename);
                            $('.cami_explain').css('color','#ACACAC').html('文件上传成功，录入'+ res.data.successCount+ '条卡密数据');
                        }

                    }).fail(function(res) {
                        $('.cami_explain').css('color','#ff3300').html('文件上传失败！');
                    });
                }
            });

            var todayDate = new Date();
            $("#startDate").datetimepicker({
                format: 'yyyy-mm-dd',
                language : 'zh-CN',
                startDate: todayDate,
                minView : 2,
                todayBtn : true,
                autoclose : true,
                todayHighlight: true
            }).on('change', function (e) {
                var startTime = e.target.value;
                var endTime = $scope.endTime;
                if (endTime < startTime) {
                    $scope.endTime = '';
                    $scope.$apply();
                }
            });
            $("#endDate").datetimepicker({
                format: 'yyyy-mm-dd',
                language : 'zh-CN',
                startDate: todayDate,
                minView : 2,
                todayBtn : true,
                autoclose : true,
                todayHighlight: true
            }).on('change', function (e) {
                var endTime = e.target.value;
                var startTime = $scope.startTime;
                if (startTime > endTime) {
                    $scope.startTime = '';
                    $scope.$apply();
                }
            });

        }]
    };

    return giftController;
});