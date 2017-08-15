/**
 * Created by zhaobaoli on 2017/7/17.
 */
define([], function () {
    var supplyController = {
        ServiceType: 'controller',
        ServiceName: 'SupplyCtrl',
        ViewModelName: 'supplyViewModel',
        ServiceContent: ['$scope','limitlengthFilter', function ($scope,limitlengthFilter) {
            //console.log('Supply controller is under control.');

            var $model = $scope.$model;
            //编辑状态
            $scope.createState = false;
            //显示列表
            $scope.showList = true;
            //初始化未搜索到的值
            $scope.noSearch = false;
            //文件上传限制大小
            var fileLimit = 52428800;
            var registAttach = '';  //登记文件
            var registFileName = '';
            var contractAttach = '';  //合同管理文件
            var contractFileName = '';
            var performanceAttach = '';  //绩效文件
            var performanceFileName = '';
            $scope.sameSupplyName = '';
            $scope.curSupplyItem = null;  //需要操作的供应商
            //合规评估维度值
            $model.getComment().then(function(res){
                var assmengData = res.data || [];
                if(assmengData.message == 'success'){
                    $scope.assmentData = assmengData.data;
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
            $scope.pageSize = 15; //每页显示多少条
            $scope.currentPageNumber = 1; //当前页数
            $scope.totalPage = 0;//总页数
            var initPage = {
                currentPageNumber : $scope.currentPageNumber,
                pageSize : $scope.pageSize
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
                        //判断查询参数
                        if(pageData.keys != undefined){
                            curPageData.keys = pageData.keys;
                        }
                        if(pageData.compliance != undefined){
                            curPageData.compliance = pageData.compliance;
                        }
                        if(pageData.examineYears != undefined){
                            curPageData.examineYears = pageData.examineYears;
                        }
                        if(pageData.status != undefined){
                            curPageData.status = pageData.status;
                        }
                        getSupplyData(curPageData);
                    }
                });
            }
            //获取列表信息
            function getSupplyData(initPage){
                $model.getSupList(initPage).then(function(res){
                    if(res.status == 200){
                        $scope.noSearch = false;
                        var dataObj = res.data.data;
                        if(dataObj.list != null && dataObj.list.length > 0 && dataObj.list != undefined){
                            for(var i=0;i<dataObj.list.length;i++){
                                dataObj.list[i].showName = limitlengthFilter.limitLength(dataObj.list[i].name);
                                dataObj.list[i].showRegistFileName = limitlengthFilter.limitLength(dataObj.list[i].registFileName);
                                dataObj.list[i].showContractFileName = limitlengthFilter.limitLength(dataObj.list[i].contractFileName);
                                dataObj.list[i].showPerformanceFileName = limitlengthFilter.limitLength(dataObj.list[i].performanceFileName);
                            }
                            $scope.supplyLists = dataObj.list;
                            $scope.totalPage = dataObj.page.pageNumber;
                            $scope.totalCount = dataObj.page.count;
                            var pageObj = {
                                allPages : dataObj.page.pageNumber,
                                currentPage : dataObj.page.currentPageNumber
                            };
                            //判断查询参数
                            if(initPage.keys != undefined){
                                pageObj.keys = initPage.keys;
                            }
                            if(initPage.compliance != undefined){
                                pageObj.compliance = initPage.compliance;
                            }
                            if(initPage.examineYears != undefined){
                                pageObj.examineYears = initPage.examineYears;
                            }
                            if(initPage.status != undefined){
                                pageObj.status = initPage.status;
                            }
                            $scope.currentPageNumber = dataObj.page.currentPageNumber;
                            if ($(".tcdPageCode").createPage) {
                                $(".tcdPageCode").remove();
                            }
                            $(".page_sec").append("<div class='tcdPageCode'></div>");
                            $scope.$apply();
                            createPageTools(pageObj);

                        }else{
                            $scope.noSearch = true;
                            $scope.$apply();
                        }
                    }
                })
            }
            getSupplyData(initPage);

            //切换新建状态
            $scope.changeState = function(){
                $scope.createState = true;
                $scope.showList = !$scope.showList;
            };

            //取消操作
            $scope.cancelOpe = function(){
                $scope.showList = !$scope.showList;
                clearCreateSupply();
            };
            //供应商名称不能为空显示
            $scope.showWarnSupply = false;
            //新增供应商
            $scope.saveOrUpdate = function(){
                //供应商名称
                var supplyName = $('#supplyName').val();
                if(supplyName.length == 0){
                    $scope.showWarnSupply = !$scope.showWarnSupply;
                    return;
                }else{
                    $scope.showWarnSupply = false;
                }
                if(registAttach == ''){
                    $('#regis_warn').css('color','#ff3300');
                    $('#regis_warn').html('登记文件不能为空');
                    return;
                }
                if(contractAttach == ''){
                    $('#contract_warn').css('color','#ff3300');
                    $('#contract_warn').html('合同管理不能为空');
                    return;
                }
                //合格评估状态
                var compliance = $("input[type='radio']:checked").val();
                if(compliance == undefined){
                    $('#compliance_warn').show();
                    return;
                }else{
                    $('#compliance_warn').hide();
                }

                //年审
                var examineYears = $("input[type='checkbox']:checked").val();
                if(examineYears == undefined){
                    examineYears == '';
                }
                //预警手机
                var warnTel = $('#warn_tel').val();
                if(warnTel != ''){
                    var telRex = /^1[3-9][0-9]{9}$/;
                    if(!telRex.test(warnTel)){
                        $('.tel_warn').css('color','#ff3300').html('请填写正确格式的手机号');
                        return;
                    }else {
                        $('.tel_warn').css('color','#ACACAC').html('供应商物料出现预警时，发送信息至此号码进行提示');
                    }
                }else{
                    $('.tel_warn').css('color','#ACACAC').html('供应商物料出现预警时，发送信息至此号码进行提示');
                }
                var sendSupplyData = {
                    'name' : supplyName, //供应商名称
                    'registAttach' :  registAttach,//登记文件名称
                    'registFileName': registFileName,
                    'contractAttach' :  contractAttach,//合同文件
                    'contractFileName': contractFileName,
                    'compliance': compliance, //合规评估
                    'performanceAttach' : performanceAttach, //绩效文件
                    'performanceFileName' : performanceFileName,
                    'examineYears': examineYears,//年审
                    'mobile': warnTel// 接收手机号
                };
                if(!$scope.createState){
                    sendSupplyData.id = $scope.curSupplyItem.id;
                }
                $model.saveOrUpdateData(sendSupplyData).then(function(resData){
                    if(resData.data.ret == 200000){
                        getSupplyData({currentPageNumber : 1,pageSize : $scope.pageSize});
                        $scope.showList = !$scope.showList;
                        $scope.$apply();
                        clearCreateSupply();
                    }else{
                        $scope.sameSupplyName = supplyName;
                        $scope.$apply();
                        $('.same_supply_box').modal('show');
                    }
                })

            };
            //清空新建供应商列表
            function clearCreateSupply(){
                $('#supplyName').val('');
                $('#registerFile').val('');
                $('#registerName').html('');
                $('#regis_warn').html('文件大小不能超过50M');
                $('#contractFile').val('');
                $('#contractName').html('');
                $('#contract_warn').html('文件大小不能超过50M');
                $('#performanceFile').val('');
                $('#performanceName').html('');
                $('#performance_warn').html('文件大小不能超过50M');
                $("input[type='radio']").each(function(){
                    $(this)[0].checked = false;
                });
                $("input[type='checkbox']").each(function(){
                    $(this)[0].checked = false;
                });
                $('#warn_tel').val('');

            }
            //编辑供应商
            $scope.editSupply = function(dataItem){
                $scope.showList = false;
                $scope.createState = false;
                $scope.curSupplyItem = dataItem;

                $('#supplyName').val(dataItem.name);
                $('#registerName').html(dataItem.registFileName);
                registFileName = dataItem.registFileName;
                registAttach = dataItem.registAttach;
                $('#contractName').html(dataItem.contractFileName);
                contractFileName = dataItem.contractFileName;
                contractAttach = dataItem.contractAttach;
                var curentCompliance = dataItem.compliance;
                $("input[type='radio']").each(function(){
                    var curRadioObj = $(this)[0];
                    if(curentCompliance == curRadioObj.value){
                        curRadioObj.checked = true;
                    }
                });
                $('#performanceName').html(dataItem.performanceFileName);
                performanceAttach = dataItem.performanceAttach;
                performanceFileName = dataItem.performanceFileName;
                var curExamineYears = dataItem.examineYears;
                if(curExamineYears != "undefined"){
                    $("input[type='checkbox']").each(function(){
                        var curCheckboxObj = $(this)[0];
                        if(curExamineYears == curCheckboxObj.value){
                            curCheckboxObj.checked = true;
                        }
                    });
                }
                $('#performanceName').html(dataItem.performanceFileName);
                $('#warn_tel').val(dataItem.mobile);
            };

            //重置操作
            $scope.resetValue = function(){
                $('#selectName').val('');
                var SelectArr = $("select");
                for (var i = 0; i < SelectArr.length; i++) {
                    SelectArr[i].options[0].selected = true;
                }
                getSupplyData({
                    currentPageNumber : 1,
                    pageSize : $scope.pageSize
                });

            };
            //搜索操作
            $scope.searchSupply = function(){
                var searchObj = {
                    keys : $('#selectName').val(),
                    compliance : $('#assMent option:selected').val(),
                    examineYears : $('#yearLimit option:selected').val(),
                    status : $('#selectStatus option:selected').val(),
                    currentPageNumber : 1,
                    pageSize : $scope.pageSize
                };
                getSupplyData(searchObj);
            };
            //更新状态的当前供应商
            function changeStatus(itemObj){
                var stateNum = 0;
                if(itemObj.status == 0){
                    stateNum = 1;
                }
                var disableObj = {
                    supplierCode : itemObj.supplierCode,
                    status : stateNum
                };
                $model.modifySupplierStatus(disableObj).then(function(res){
                    if(res.status == 200){
                        $('.supply_success_box').modal('show');
                        setTimeout(function(){
                            $('.supply_success_box').modal('hide');
                        },3000);
                        var curPageObj = {
                            currentPageNumber : $scope.currentPageNumber,
                            pageSize : $scope.pageSize
                        };
                        getSupplyData(curPageObj);
                    }else {
                        $('.supply_error_box').modal('show');
                        setTimeout(function(){
                            $('.supply_error_box').modal('hide');
                        },3000)
                    }
                })
            }

            //状态停用操作
            $scope.disabledStatus = function(itemObj){
                if(itemObj.status == 1){
                    $('.supply_disabled_box').modal('show');
                }
                $scope.curSupplyItem = itemObj;
            };
            //启用当前供应商状态
            $scope.enabledStatus = function(dataItem){
                changeStatus(dataItem);
            };
            //确定停用当前供应商状态
            $scope.confirmDisabledStatus = function(curSupplyItem){
                changeStatus(curSupplyItem);
                $('.supply_disabled_box').modal('hide');
            };
            //登记文件上传
            $('#registerFile').change(function(){
                var registerFile = $('#registerFile')[0].files[0];
                //fileLimit
                if(registerFile != undefined){
                    if(registerFile.size > fileLimit){
                        $('#regis_warn').html('文件大小超过50M，不能上传！');
                        return;
                    }
                    $('#regis_warn').css('color','#cdcdcd');
                    $('#regis_warn').html('文件上传中...');
                    var formData = new FormData();
                    formData.append('file',registerFile);
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
                        registAttach = res.data.attachCode;
                        registFileName = res.data.filename;
                        $('#registerName').html(res.data.filename);
                        $('#regis_warn').html('文件上传成功！');

                    }).fail(function(res) {
                        $('#regis_warn').html('文件上传失败！');
                    });
                }
            });

            //合同管理文件上传
            $('#contractFile').change(function(){
                var contractFile = $('#contractFile')[0].files[0];
                //fileLimit
                if(contractFile != undefined){
                    if(contractFile.size > fileLimit){
                        $('#contract_warn').html('文件大小超过50M，不能上传！');
                        return;
                    }
                    $('#contract_warn').css('color','#cdcdcd');
                    $('#contract_warn').html('文件上传中...');
                    var formData = new FormData();
                    formData.append('file',contractFile);
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
                        contractAttach = res.data.attachCode;
                        contractFileName = res.data.filename;
                        $('#contractName').html(res.data.filename);
                        $('#contract_warn').html('文件上传成功！');

                    }).fail(function(res) {
                        $('#contract_warn').html('文件上传失败！');
                    });
                }
            });

            //绩效文件上传
            $('#performanceFile').change(function(){
                var performanceFile = $('#performanceFile')[0].files[0];
                //fileLimit
                if(performanceFile != undefined){
                    if(performanceFile.size > fileLimit){
                        $('#performance_warn').html('文件大小超过50M，不能上传！');
                        return;
                    }
                    $('#performance_warn').html('文件上传中...');
                    var formData = new FormData();
                    formData.append('file',performanceFile);
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
                        performanceAttach = res.data.attachCode;
                        performanceFileName = res.data.filename;
                        $('#performanceName').html(res.data.filename);
                        $('#performance_warn').html('文件上传成功！');

                    }).fail(function(res) {
                        $('#performance_warn').html('文件上传失败！');
                    });
                }
            });

            //下载文件
            $scope.downloadFile = function(attachCode){
                if(attachCode != '' && attachCode != null){
                    var url = "/api/tztx/saas/saotx/attach/commonDownload";
                    var xhr = new XMLHttpRequest();
                    var formData = new FormData();
                    formData.append('attachCode', attachCode);
                    xhr.overrideMimeType("text/plain; charset=x-user-defined");
                    xhr.open('POST', url, true);
                    xhr.responseType = "blob";
                    xhr.responseType = "arraybuffer"
                    xhr.setRequestHeader("token", sessionStorage.getItem('access_token'));
                    xhr.setRequestHeader("loginId", sessionStorage.getItem('access_loginId'));
                    xhr.onload = function(res) {
                        if (this.status == 200) {
                            var blob = new Blob([this.response], {type: 'application/vnd.ms-excel'});
                            var respHeader = xhr.getResponseHeader("Content-Disposition");
                            var fileName = decodeURI(respHeader.match(/filename=(.*?)(;|$)/)[1]);
                            if (window.navigator.msSaveOrOpenBlob) {
                                navigator.msSaveBlob(blob, fileName);
                            } else {
                                var link = document.createElement('a');
                                link.href = window.URL.createObjectURL(blob);
                                link.download = fileName;
                                link.click();
                                window.URL.revokeObjectURL(link.href);
                            }
                        }
                    };
                    xhr.send(formData);
                }
            }

        }]
    };

    return supplyController;
});