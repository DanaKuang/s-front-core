/**
 * Created by zhaobaoli on 2017/7/17.
 */
define([], function () {
    var packetController = {
        ServiceType: 'controller',
        ServiceName: 'PacketCtrl',
        ViewModelName: 'packetViewModel',
        ServiceContent: ['$scope','limitlengthFilter', function ($scope,limitlengthFilter) {
            console.log('agree controller is under control.');
            var $model = $scope.$model;

            //初始化列表显示
            $scope.showTables = true;
            //初始化红包池列表显示
            $scope.showPacketList = true;
            //文件上传限制大小
            var fileLimit = 52428800;
            //资金转账凭证文件
            var transferVoucherFilename = '';
            var transferVoucherAttach = '';
            $scope.noSearchData = false;  //未搜索到红包信息
            $scope.noSearchLog = false;  //未搜索到流水信息
            $scope.addPocket = true;  //新增红包标识
            $scope.editPacketId = '';  //当前编辑的红包id
            $scope.operateItemPacket = null;
            //初始化分页信息
            $scope.pageSize = 15; //每页显示多少条
            $scope.currentPageNumber = 1; //当前页数
            $scope.totalPage = 0;//总页数
            var initPage = {
                currentPageNumber : $scope.currentPageNumber,
                pageSize : $scope.pageSize,
                metraType : 'redpack'
            };

            //红包池/流水明细切换
            $scope.changeShowState = function(){
                $scope.showPacketList = !$scope.showPacketList;
                //清空搜索条件
                var SelectArr = $(".packet_select_sec select");
                for (var i = 0; i < SelectArr.length; i++) {
                    SelectArr[i].options[0].selected = true;
                }
                $('allSupply').val('');
                var pageObj = {
                    currentPageNumber : 1,
                    pageSize : $scope.pageSize
                };
                if($scope.showPacketList){
                    pageObj.metraType = 'redpack';
                }else{
                    pageObj.logType = 'redpack';
                }
                getDataList(pageObj);
            };

            //新增红包池
            $scope.createPacket = function(){
                $scope.addPocket = true;
                $scope.showTables = !$scope.showTables;
                //获取新建时启用状态的供应商列表
                if($scope.addPocket){
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
                }
            };
            //取消新建红包
            $scope.cancelCreatePacket = function(){
                $('.cancel_box').modal('show');
            };
            //确认取消
            $scope.confirmCancel = function(){
                $('.cancel_box').modal('hide');
                clearCreatPacket();
                $scope.showTables = !$scope.showTables;
            };

            //取对应品牌
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
            //获取操作动作维度值
            $model.getQueryLog().then(function(res){
                if(res.status == 200){
                    $scope.activeLogList = res.data.data;
                    $scope.$apply();
                }
            });

            //资金转账凭证上传
            $('#transfer').change(function(){
                var transferFile = $('#transfer')[0].files[0];
                if(transferFile != undefined){
                    if(transferFile.size > fileLimit){
                        //$('#regis_warn').html('文件大小超过50M，不能上传！');
                        return;
                    }
                    $('#transfer_warn').html('文件上传中...');
                    var formData = new FormData();
                    formData.append('file',transferFile);
                    $.ajax({
                        url: '/api/tztx/saas/saotx/attach/commonUploadFiles',
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
                        if(res.ret == 200000){
                            $('#transfer_warn').html('文件上传成功');
                            var fileSuccessData = res.data;
                            transferVoucherFilename = fileSuccessData.filename;
                            transferVoucherAttach = fileSuccessData.attachCode;
                            $('#transferName').html(fileSuccessData.filename);
                        }
                    }).fail(function(res) {
                        $('#transfer_warn').html('文件上传失败');
                    });
                }
            });
            //清空新建红包列表
            function clearCreatPacket(){
                //清空红包名称
                $('#packetName').val('');
                //清空供应商选择
                var supplyOption = $("#supply");
                supplyOption[0].options[0].selected = true;
                //清空品牌
                $scope.selectAllBrands = '';  //清空适用品牌
                $('[ng-model="selectAllBrands"]').multiselect().val([]).multiselect("refresh");
                //var brandOption = $("#brand");
                //brandOption[0].options[0].selected = true;
                //清空规格
                $scope.selectSpeci = '';     //清空适用规格
                $('[ng-model="selectSpeci"]').multiselect().val([]).multiselect("refresh");
                //var speciftOption = $("#specift");
                //speciftOption[0].options[0].selected = true;
                //清空资金
                $('#capital').val('');
                //清空物料阀值
                $('#packerThresh').val('');
                //清空资金转账凭证
                $('#transfer').val('');
                $('#transferName').html('');
                $('#transfer_warn').html('');
                $scope.operateItemPacket = null;
            }
            //监听品牌选择信息
            /*$('#brand').change(function(){
                var curBrandValue = $(this).val();
                $model.getSpeciftByBrand({brandCode:curBrandValue}).then(function(res){
                    if(res.status == 200){
                        $scope.speciftList = res.data.data;
                        $scope.$apply();
                    }
                });
            });*/
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
            //监听搜索框品牌选择信息
            $('#allBrand').change(function(){
                var selectBrandValue = $(this).val();
                $model.getSpeciftByBrand({brandCode:selectBrandValue}).then(function(res){
                    if(res.status == 200){
                        $scope.allSpeciftList = res.data.data;
                        $scope.$apply();
                    }
                });
            });
            //保存红包信息
            $scope.savePacketInfo = function(){
                //红包池名称
                var packetName = $('#packetName').val();
                if(packetName == ''){
                    $('.packet_name').show();
                    return;
                }else{
                    $('.packet_name').hide();
                }
                //选择供应商
                var supplyVal = $('#supply').val();
                if(supplyVal == ''){
                    $('.select_supply').show();
                    return;
                }else{
                    $('.select_supply').hide();
                }
                //选择品牌
                var brandVal = $('#brand').val();
                //var brandValue = brandObj.val();
                var brandNames = $('.brand_names .multiselect').attr('title');
                if(brandVal == '' || brandVal.length == 0){
                    $('.select_brand').show();
                    return;
                }else{
                    brandVal = brandVal.join(',');
                    $('.select_brand').hide();
                }
                //选择规格
                var speciftVal = $('#specift').val();
                var speciftNames = $('.specift_names .multiselect').attr('title');
                if(speciftVal == '' || speciftVal.length == 0){
                    $('.select_specift').show();
                    return;
                }else{
                    speciftVal = speciftVal.join(',');
                    $('.select_specift').hide();
                }
                //资金
                var regNum = /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;
                var capitalVal = $('#capital').val();
                if(capitalVal == ''){
                    $('.entry_capital').show();
                    return;
                }else{
                    if(regNum.test(capitalVal)){
                        var numStr = capitalVal.toString().indexOf('.');
                        if(numStr > -1){
                            capitalVal = Number(capitalVal.toString().match(/^\d+(?:\.\d{0,2})?/));
                        }
                        $('.entry_capital').hide();
                    }else {
                        $('.entry_capital').html('请输入大于0的数字').show();
                        return;
                    }
                }
                //红包阀值
                var packerThresh = $('#packerThresh').val();
                if(packerThresh != ''){
                    if(regNum.test(packerThresh)){
                        var packerThreshStr = packerThresh.toString().indexOf('.');
                        if(packerThreshStr > -1){
                            packerThresh = Number(packerThresh.toString().match(/^\d+(?:\.\d{0,2})?/));
                        }
                        $('.packet_thresh').hide();
                    }else {
                        $('.packet_thresh').show();
                        return;
                    }
                }
                //新建时红包阀值不能大于库存
                if($scope.addPocket){
                    if(parseFloat(capitalVal) < parseFloat(packerThresh)){
                        $('.packet_thresh').html('库存阀值不可高于红包池资金额度').show();
                        return;
                    }else{
                        $('.packet_thresh').hide();
                    }
                }
                var packetData = {
                    name: packetName,
                    supplierCode : supplyVal,
                    brandCodes : brandVal,
                    //brandNames : $('#brand').find("option:selected").text(),
                    brandNames : brandNames,
                    units : speciftVal,
                    //unitNames: $('#specift').find("option:selected").text(),
                    unitNames: speciftNames,
                    moneyPool : capitalVal,
                    poolWarning: packerThresh,
                    transferVoucherFilename : transferVoucherFilename,
                    transferVoucherAttach : transferVoucherAttach
                };
                //判断是否为编辑
                if(!$scope.addPocket){
                    packetData.id = $scope.operateItemPacket.id;
                }

                //保存数据
                $model.savePacketData(packetData).then(function(res){
                    if(res.status == 200){
                        if(res.data.ret == '200000'){
                            $scope.showTables = !$scope.showTables;
                            getDataList(initPage);
                            clearCreatPacket();
                            $scope.$apply();
                        }else if(res.data.ret == "400401"){
                            $('.packet_name').html("此红包池名称已经存在").show();
                            /*$('.save_exist_box').modal('show');
                            $scope.addExistPacketCapitalVal = capitalVal;
                            $scope.exitPacketData = res.data.data;
                            $scope.$apply();*/
                        }else{
                            $('.supply_error_box').modal('show');
                        }
                    }
                });

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
                        if($scope.showPacketList){
                            curPageData.metraType = 'redpack';
                        }else{
                            curPageData.logType = 'redpack';
                        }
                        getDataList(curPageData);
                    }
                });
            }
            //获取红包池列表
            function getDataList(pageObj){
                if($scope.showPacketList){
                    //显示红包池信息
                    $model.getPacketList(pageObj).then(function(res){
                        if(res.status == 200){
                            var packetObj = res.data.data;
                            if(packetObj.list != null){
                                for(var i=0;i<packetObj.list.length;i++){
                                    packetObj.list[i].showPacketName = limitlengthFilter.limitLength(packetObj.list[i].name);
                                    packetObj.list[i].showSupplierName = limitlengthFilter.limitLength(packetObj.list[i].supplierName);
                                    packetObj.list[i].showBrandNames = limitlengthFilter.limitLength(packetObj.list[i].brandNames,5);
                                    packetObj.list[i].showUnitNames = limitlengthFilter.limitLength(packetObj.list[i].unitNames,5);
                                }
                                $scope.noSearchData = false;
                                $scope.packetList = packetObj.list;
                                $scope.totalPage = packetObj.page.pageNumber;
                                $scope.totalCount = packetObj.page.count;
                                $scope.currentPageNumber = packetObj.page.currentPageNumber;
                                var pageObj = {
                                    allPages : packetObj.page.pageNumber,
                                    currentPage : packetObj.page.currentPageNumber,
                                    metraType : 'redpack'
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
                                $scope.packetList = [];
                                $scope.$apply();
                            }
                        }
                    });
                }else {
                    //显示红包流水明细
                    $model.getPacketDetail(pageObj).then(function(res){
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
                                    logType : 'redpack'
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
            getDataList(initPage);

            //获取全部供应商列表
            $model.getSupplyList({pageSize:'-1'}).then(function(res){
                if(res.status == 200){
                    $scope.allSupplyList = res.data.data.list;
                    $scope.$apply();
                }
            });
            //获取数据状态
            $model.getDataStatus().then(function(res){
                if(res.status == 200){
                    $scope.dataStatusList = res.data.data;
                    $scope.$apply();
                }
            });

            //搜索数据
            $scope.searchData = function(){
                var searchData = {
                    keys: $('#allPacketName').val(),
                    supplierCode: $('#allSupply option:selected').val(),
                    brandCodes : $('#allBrand option:selected').val(),
                    unitCodes:  $('#allSpecift option:selected').val(),
                    currentPageNumber : 1,
                    pageSize : $scope.pageSize
                };
                if($scope.showPacketList){
                    searchData.status = $('#dataStatus option:selected').val();
                    searchData.metraType = 'redpack';
                }else{
                    searchData.operCode = $('#activeLog option:selected').val();
                    searchData.logType = 'redpack';
                }
                getDataList(searchData);

            };

            //重置功能
            $scope.resetData = function(){
                var SelectArr = $("select");
                for (var i = 0; i < SelectArr.length; i++) {
                    SelectArr[i].options[0].selected = true;
                }
                var pageObj = {
                    currentPageNumber : 1,
                    pageSize : $scope.pageSize
                };
                if($scope.showPacketList){
                    pageObj.metraType = 'redpack';
                }else{
                    pageObj.logType = 'redpack';
                }
                getDataList(pageObj);
            };

            //编辑红包池信息
            $scope.editItemPacket = function(itemPacket){
                $scope.addPocket = false;
                $scope.operateItemPacket = itemPacket;
                if(!$scope.addPocket){
                    var createSupply = {
                        pageSize : '-1'
                    };
                    $model.getSupplyList(createSupply).then(function(res){
                        if(res.status == 200){
                            $scope.enableSupplyList = res.data.data.list;
                            $scope.$apply();
                        }
                        $("#supply option").each(function(){
                            var curSupplyOptionObj = $(this)[0];
                            if(itemPacket.supplierCode == curSupplyOptionObj.value){
                                curSupplyOptionObj.selected = true;
                            }
                        });
                    });
                }
                //品牌
                /*$("#brand option").each(function(){
                    var curBrandOptionObj = $(this)[0];
                    if(itemPacket.brandCodes == curBrandOptionObj.value){
                        curBrandOptionObj.selected = true;
                    }
                });*/
                var brandValArr = itemPacket.brandCodes.split(',');
                $('[ng-model="selectAllBrands"]').multiselect().val(brandValArr).multiselect("refresh");
                $('.brand_names .multiselect').attr('title',itemPacket.brandNames);
                //适用规格
                if(itemPacket.brandCodes != '' && itemPacket.brandCodes != null){
                    $model.getSpeciftByBrand({brandCode: itemPacket.brandCodes}).then(function(res){
                        if(res.data.ret == 200000){
                            $scope.speciftList = res.data.data;
                            $scope.$apply();
                            var speciftValArr = itemPacket.units.split(',');
                            $('[ng-model="selectSpeci"]').multiselect().val(speciftValArr).multiselect("refresh");
                            $('.specift_names .multiselect').attr('title',itemPacket.unitNames);
                        }
                        /*$("#specift option").each(function(){
                            var packetSpeciftObj = $(this)[0];
                            if(itemPacket.units == packetSpeciftObj.value){
                                packetSpeciftObj.selected = true;
                            }
                        });*/
                    });
                }

                $('#packetName').val(itemPacket.name);
                $('#capital').val(itemPacket.moneyPool);
                $('#packerThresh').val(itemPacket.poolWarning);
                transferVoucherAttach = itemPacket.transferVoucherAttach;
                transferVoucherFilename = itemPacket.transferVoucherFilename;
                $('#transferName').html(itemPacket.transferVoucherFilename);
                $scope.showTables = !$scope.showTables;
            };
            //确定红包增库
            $scope.confirmAddPool = function(operateItemPacket){
                var poolMoney = $('#poolMoney').val();
                var numStr = poolMoney.toString().indexOf('.');
                if(numStr > -1){
                    poolMoney = Number(poolMoney.toString().match(/^\d+(?:\.\d{0,2})?/));
                }
                var addPoolObj = {
                    id : operateItemPacket.id,
                    addNum : poolMoney
                };
                $model.addPacketPool(addPoolObj).then(function(res){
                    $('#poolMoney').val('');
                    $('.packet_add_box').modal('hide');
                    if(res.data.ret == 200000){
                        var curPageObj = {
                            currentPageNumber : $scope.currentPageNumber,
                            pageSize : $scope.pageSize,
                            metraType : 'redpack'
                        };
                        getDataList(curPageObj);
                    }else{
                        $('.supply_error_box').modal('show');
                    }
                });
            };
            //红包增库
            $scope.addPacketPool = function(itemPacket){
                $scope.operateItemPacket = itemPacket;
                if(itemPacket.supplierStatus == 1){
                    if(itemPacket.status == 1){
                        $('.packet_add_box').modal('show');
                    }else{
                        $('.packet_stop_box').modal('show');
                    }
                }else{
                    $('.supply_stop_box').modal('show');
                }

            };
            //红包停用状态
            $scope.stopStatus = function(packetItem){
                $('.packet_disabled_box').modal('show');
                $scope.operateItemPacket = packetItem;
            };
            //更新红包的适用状态
            function changePacketStatus(itemObj){
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
                $model.modifyPacketStatus(disableObj).then(function(res){
                    if(res.status == 200){
                        $('.supply_success_box').modal('show');
                        var curPageObj = {
                            currentPageNumber : $scope.currentPageNumber,
                            pageSize : $scope.pageSize,
                            metraType : 'redpack'
                        };
                        getDataList(curPageObj);
                        successTimer = setTimeout(function(){
                            $('.supply_success_box').modal('hide');
                            clearTimeout(successTimer);
                        },3000);
                    }else {
                        $('.supply_error_box').modal('show');
                        errorTimer = setTimeout(function(){
                            $('.supply_error_box').modal('hide');
                            clearTimeout(errorTimer);
                        },3000)
                    }
                })
            }
            //确认停用
            $scope.confirmStopStatus = function(operateItemPacket){
                $('.packet_disabled_box').modal('hide');
                changePacketStatus(operateItemPacket);
            };
            //启用红包
            $scope.useStatus = function(packetItem){
                changePacketStatus(packetItem);
            };
            //确定新增资金到以后红包池对应关系
            $scope.confirmAddExistPool = function(exitPacketData){
                $('.save_exist_box').modal('hide');
                var addPoolObj = {
                    id : exitPacketData.id,
                    addNum : $scope.addExistPacketCapitalVal
                };
                var poolSuccess = null;
                var poolError = null;
                $model.addPacketPool(addPoolObj).then(function(res){
                    if(res.status == 200){
                        $('.supply_success_box').modal('show');
                        poolSuccess = setTimeout(function(){
                            $('.supply_success_box').modal('hide');
                            clearTimeout(poolSuccess);
                        },3000);
                        var curPageObj = {
                            currentPageNumber : $scope.currentPageNumber,
                            pageSize : $scope.pageSize,
                            metraType : 'redpack'
                        };
                        $scope.showTables = !$scope.showTables;
                        $scope.showPacketList = !$scope.showPacketList;
                        $scope.$apply();
                        getDataList(curPageObj);
                    }else{
                        $('.supply_error_box').modal('show');
                        poolError = setTimeout(function(){
                            $('.supply_error_box').modal('hide');
                            clearTimeout(poolError);
                        },3000)
                    }
                });
            }
        }]
    };

    return packetController;
});