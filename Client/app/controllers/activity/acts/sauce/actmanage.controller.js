/**
 * Author: zhaobl
 * Create Date: 2018-3-5
 * Description: 活动管理controller
 */
define([], function() {
    var actmanageController = {
        ServiceType: "controller",
        ServiceName: "actmanageCtrl",
        ViewModelName: 'actmanageViewModel',
        ServiceContent: ['$scope','dateFormatFilter', function($scope,dateFormatFilter) {
            var $model = $scope.$model;
            
            $scope.showActList = true; //活动列表展示
            $scope.createAct = false; //新建活动或编辑活动
            $scope.showSeceiveDetail = false; //活动领奖明细
            $scope.actStatus = ''; //活动状态
            $scope.creatActStatus = true;
            var defaultImgUrl = 'statics/assets/image/default-upload-img.png';
            var defaultPro = 100; //初始换参与奖概率
            $scope.probability = defaultPro; //参与奖概率

            //初始化分页信息
            $scope.pageSize = 10; //每页显示多少条
            $scope.pageNum = 1; //当前页数
            $scope.totalPage = 0;//总页数
            var initPage = {
                pageNum : $scope.pageNum,
                pageSize : $scope.pageSize
            };
            $("#actStartTime").datetimepicker({ //活动列表搜索开始时间
                format: 'yyyy-mm-dd hh:ii', 
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1
            }).on('change', function (e) {
                var startTime = e.target.value;
                var endTime = $scope.actEndTime;
                if (endTime < startTime) {
                    $scope.actEndTime = '';
                    $scope.$apply();
                }
            })

            $("#actEndTime").datetimepicker({ //活动列表搜索结束时间
                format: 'yyyy-mm-dd hh:ii', 
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1
            }).on('change', function (e) {
                var endTime = e.target.value;
                var startTime = $scope.actStartTime;
                if (startTime > endTime) {
                    $scope.actStartTime = '';
                    $scope.$apply();
                }
            });

            function getActList(actPrame){ //获取活动列表数据
                $model.$getActList(actPrame).then(function (res) {
                    if(res.data.ret == 200000){
                        var dataObj = res.data.data;
                        $scope.actDataList = dataObj.list || [];
                        var newPageObj = {
                            allPages : dataObj.page.pageNumber,
                            currentPage : dataObj.page.currentPageNumber
                        };
                        $scope.pageNum = dataObj.page.currentPageNumber;
                        $scope.totalCount = dataObj.page.count;
                        if ($(".tcdPageCode").createPage) {
                            $(".tcdPageCode").remove();
                        }
                        $(".page_sec").append("<div class='tcdPageCode'></div>");
                        $scope.$apply();
                        createPageTools(newPageObj);
                    }
                });
            } 

            //创建分页工具
            function createPageTools(pageData){
                $(".tcdPageCode").createPage({
                    pageCount: pageData.allPages,
                    current : pageData.currentPage,
                    backFn : function(pageNum){
                        if($scope.showActList){ //显示活动列表
                            var curActPageData = {
                                pageNum : pageNum,
                                pageSize : $scope.pageSize,
                                state : $scope.actStatus ? $scope.actStatus : '',
                                startTime : $scope.actStartTime ? $scope.actStartTime + ':00' : '',
                                endTime : $scope.actEndTime ? $scope.actEndTime + ':00' : ''
                            };
                            getActList(curActPageData);
                        }
                        if($scope.showSeceiveDetail){ //显示领取明细列表
                            var curAwardPageData = {
                                pageNum : pageNum,
                                pageSize : $scope.pageSize,
                                startTime : $scope.actStartTime ? $scope.actStartTime + ':00' : '',
                                endTime : $scope.actEndTime ? $scope.actEndTime + ':00' : ''
                            }
                            getAwardDetail(curAwardPageData);
                        } 
                    }
                });
            }

            getActList(initPage); //初始化活动列表信息

            $scope.searchAct = function(){ //信息查询
                if($scope.showActList){//活动列表信息查询
                    var searchData = { 
                        pageNum : $scope.pageNum,
                        pageSize : $scope.pageSize,
                        state : $scope.actStatus ? $scope.actStatus : '',
                        startTime : $scope.actStartTime ? $scope.actStartTime + ':00' : '',
                        endTime : $scope.actEndTime ? $scope.actEndTime + ':00' : ''
                    };
                    getActList(searchData);
                }
                if($scope.showSeceiveDetail){ //领奖明细列表查询
                    var searchAwardData = { 
                        pageNum : $scope.pageNum,
                        pageSize : $scope.pageSize,
                        level : $scope.awardGrade ? $scope.awardGrade : '',
                        startTime : $scope.detStartTime ? $scope.detStartTime + ':00' : '',
                        endTime : $scope.detEndTime ? $scope.detEndTime + ':00' : '',
                        rovince : $scope.provinceCode ? $scope.provinceCode : '',
                        city : $scope.cityCode ? $scope.cityCode : '',
                        area : $scope.cityCode ? ($scope.areaCode ? $scope.areaCode : '') : ''
                    };
                    getAwardDetail(searchAwardData);
                }  
            }
            $scope.resetAct = function(){ //重置活动列表查询条件
                $scope.actStatus = '';
                $scope.actStartTime = '';
                $scope.actEndTime = '';
                getActList(initPage);
            }
            $scope.creatAct = function(){ //新建活动
                $scope.showActList = false;
                $scope.createAct = true;
                $scope.actObj = { //新建活动
                    activityName : '', //活动名称
                    totalNum : '', //投放数量
                    batch : '', //批次号
                    actRule : '', //活动规则
                    startTimeStr : '', //活动开始时间
                    endTimeStr : '', //活动结束时间
                    awards : [] //活动奖项设置
                }
                $scope.actObj.awards.push(awardObj); //初始化添加一个奖项配置
            }

            $("#actInfoStart").datetimepicker({ //新增或编辑活动开始时间
                format: 'yyyy-mm-dd hh:ii', 
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1
            }).on('change', function (e) {
                var startTime = e.target.value;
                var endTime = $scope.actObj.endTimeStr;
                if (endTime < startTime) {
                    $scope.actObj.endTimeStr = '';
                    $scope.$apply();
                }
            })
            
            $("#actInfoEnd").datetimepicker({ //新增或编辑活动结束时间
                format: 'yyyy-mm-dd hh:ii', 
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1
            }).on('change', function (e) {
                var endTime = e.target.value;
                var startTime = $scope.actObj.startTimeStr;
                if (startTime > endTime) {
                    $scope.actObj.startTimeStr = '';
                    $scope.$apply();
                }
            });

            $scope.backActList = function(){ //返回活动列表
                $scope.showActList = true;
                $scope.createAct = false;
                $scope.showSeceiveDetail = false;
                $scope.creatActStatus = true;
            }

            function checkNoStr(inputStr){
                if(inputStr == '' || inputStr.length == 0 || inputStr == undefined || inputStr == null){
                    return true;
                }
                return false;
            }

            var regBranch = /^[A-Za-z0-9]+$/;
            $scope.checkBranchNum = function(e){ //检验输入的批次号
                var inputBranch = e.target.value;
                if(!regBranch.test(inputBranch)){
                    e.target.value = '';
                }else{
                    $scope.actObj.batch = inputBranch;
                }
            }
            var regNum = /^\d+$/;
            $scope.checkProductProbability = function(e){ //检验中奖概率为整数也不能大于100
                var inputPro = e.target.value;
                if(!regNum.test(inputPro)){
                    e.target.value = '';
                }else if(inputPro > 100){
                    e.target.value = 100;
                }
            }

            $scope.takeProbability = function(){ //检验中奖概率
                var drawProbability = 0;
                for(var j=0,l=$scope.actObj.awards.length;j<l;j++){
                    var curPb =  $scope.actObj.awards[j].productProbability;
                    if(curPb != ''){
                        drawProbability += parseInt(curPb);
                    }
                }
                if(drawProbability > 100){
                    alert('中奖概率超过100%，请重新设置。');
                    $scope.probability = 0;
                }else{
                    $scope.probability = defaultPro - drawProbability; //更新参与奖概率
                }
            }

            $scope.checkNum = function(e){ //检验中奖数量为整数
                var inputNum = e.target.value;
                if(!regNum.test(inputNum)){
                    e.target.value = '';
                }else{
                    $scope.actObj.totalNum = inputNum;
                }
            }

            $scope.warnInfo = { //警告信息提示
                activityNameWarn : false, //活动名称警告
                totalNumWarn : false, //投放数量警告
                batchWarn : false, //批次号警告
                actRuleWarn : false, //活动规则警告
                timeWarn : false, //活动时间警告
            }

            var awardObj = { //奖项初始化参数
                productLevel : '1', //奖项等级
                levelName : '', //等级名称
                productProbability : '', //中奖概率
                amount : '', //中奖数量
                productName : '', //奖项名称
                productType : '1', //奖项类型
                productImg : 'statics/assets/image/default-upload-img.png', //奖品图片
                awardWarn : false //奖池信息完善提示
            }

            $scope.addAwardItem = function(){ //新增奖项配置
                if($scope.actObj.awards.length < 5){
                    var copyAwardItem = { //奖项初始化参数
                        productLevel : '1', //奖项等级
                        levelName : '', //等级名称
                        productProbability : '', //中奖概率
                        amount : '', //中奖数量
                        productName : '', //奖项名称
                        productType : '1', //奖项类型
                        productImg : 'statics/assets/image/default-upload-img.png', //奖品图片
                        awardWarn : false //奖池信息完善提示
                    }
                    //$scope.actObj.awards.push(_.cloneDeep(awardObj)); //克隆奖项设置
                    $scope.actObj.awards.push(copyAwardItem);
                }  
            }

            var awardImgType = ['png','PNG','jpg','JPG'];
            $('.shrInfo').on('change','.upload_input',function(){ //奖项图片上传
                var awardImgObj = $(this);
                var awardImgFile = awardImgObj[0].files[0];
                if(awardImgFile != undefined){
                    var awardIndex = awardImgObj.next().val();
                    var imgTpye = awardImgFile.type.split("/")[1];
                    if(awardImgType.indexOf(imgTpye) > -1){
                        var formData = new FormData();
                        formData.append('file',awardImgFile);
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
                                var uploadData = res.data;
                                $scope.actObj.awards[awardIndex].productImg = uploadData.accessUrl;
                                $scope.$apply();
                            }
                        }).fail(function(res) {
                            
                        });
                    }
                }
            })

            $scope.delAwardItem = function(index){ //删除奖项配置
                if(index > -1){
                    $scope.actObj.awards.splice(index,1);
                }
            }

            $scope.saveOrUpdate = function(){ //保存或更新活动信息
                if(checkNoStr($scope.actObj.activityName)){
                    $scope.warnInfo.activityNameWarn = true;
                    return;
                }else{
                    $scope.warnInfo.activityNameWarn = false;
                }
                if(checkNoStr($scope.actObj.totalNum)){
                    $scope.warnInfo.totalNumWarn = true;
                    return;
                }else{
                    $scope.warnInfo.totalNumWarn = false;
                }
                if(checkNoStr($scope.actObj.batch)){
                    $scope.warnInfo.batchWarn = true;
                    return;
                }else{
                    $scope.warnInfo.batchWarn = false;
                }
                if(checkNoStr($scope.actObj.actRule)){
                    $scope.warnInfo.actRuleWarn = true;
                    return;
                }else{
                    $scope.warnInfo.actRuleWarn = false;
                }
                if(checkNoStr($scope.actObj.startTimeStr)){
                    $scope.warnInfo.timeWarn = true;
                    return;
                }else{
                    $scope.actObj.startTimeStr = $scope.actObj.startTimeStr + ':00';
                    $scope.warnInfo.timeWarn = false;
                }
                if(checkNoStr($scope.actObj.endTimeStr)){
                    $scope.warnInfo.timeWarn = true;
                    return;
                }else{
                    $scope.actObj.endTimeStr = $scope.actObj.endTimeStr + ':00';
                    $scope.warnInfo.timeWarn = false;
                }
                for(var i = 0,l = $scope.actObj.awards.length;i<l;i++){
                    switch($scope.actObj.awards[i].productLevel){
                        case "1" :
                            $scope.actObj.awards[i].levelName = '一等奖';
                            break;
                        case "2" :
                            $scope.actObj.awards[i].levelName = '二等奖';
                            break;
                        case "3" :
                            $scope.actObj.awards[i].levelName = '三等奖';
                            break;
                        case "4" :
                            $scope.actObj.awards[i].levelName = '四等奖';
                            break;
                        case "5" :
                            $scope.actObj.awards[i].levelName = '五等奖';
                            break;
                        default:
                    }
                    for(var key in $scope.actObj.awards[i]){ //检查每个奖池信息是否完善
                        switch(key){
                            case 'productLevel':
                            case 'levelName':
                            case 'productProbability':
                            case 'amount':
                            case 'productName':
                            case 'productType':
                                if($scope.actObj.awards[i][key] == ''){
                                    $scope.actObj.awards[i].awardWarn = true;
                                    return;
                                }else{
                                    $scope.actObj.awards[i].awardWarn = false;
                                }
                                break;
                            case 'productImg':
                                if($scope.actObj.awards[i][key] == defaultImgUrl){
                                    $scope.actObj.awards[i].awardWarn = true;
                                    return;
                                }else{
                                    $scope.actObj.awards[i].awardWarn = false;
                                }
                                break;
                            default :
                        }
                    }
                }
                $model.$saveOrUpdateAct($scope.actObj).then(function (res) { //保存活动信息
                    if(res.data.ret == 200000){
                        $scope.showActList = true; //活动列表展示
                        $scope.createAct = false; //新建活动或编辑活动
                        getActList(initPage);
                    }
                })
                
            }
            function getActivityDetail(actObj){ //获取活动详细信息
                $model.$getActivityDetail(actObj).then(function (res) {
                    if(res.data.ret == 200000){
                        var detailObj = res.data.data;
                        $scope.actObj = { //活动信息
                            activityId : detailObj.activityId, //活动id
                            activityName : detailObj.activityName, //活动名称
                            totalNum : detailObj.totalNum, //投放数量
                            batch : detailObj.batch, //批次号
                            actRule : detailObj.actRule, //活动规则
                            startTimeStr : detailObj.startTimeStr, //活动开始时间
                            endTimeStr : detailObj.endTimeStr, //活动结束时间
                            awards : detailObj.awards //活动奖项设置
                        }
                        $scope.showActList = false; //活动列表展示
                        $scope.createAct = true; //新建活动或编辑活动
                        $scope.creatActStatus = false; //活动为新建状态
                        $scope.$apply();
                    }
                });
            }
            $scope.editActivity = function(actId){ //
                var activityObj = {
                    activityId : actId ? actId : ''
                }
                getActivityDetail(activityObj);
            }
            function getAwardDetail(actPrame){ //获取领奖明细列表
                $model.$getAwardList(actPrame).then(function (res) {
                    if(res.data.ret == 200000){
                        var awardObj = res.data.data;
                        $scope.awardDetailList = awardObj.list || [];
                        var newPageObj = {
                            allPages : awardObj.page.pageNumber,
                            currentPage : awardObj.page.currentPageNumber
                        };
                        $scope.pageNum = awardObj.page.currentPageNumber;
                        $scope.totalCount = awardObj.page.count;
                        if ($(".tcdPageCode").createPage) {
                            $(".tcdPageCode").remove();
                        }
                        $(".page_sec").append("<div class='tcdPageCode'></div>");
                        $scope.$apply();
                        createPageTools(newPageObj);
                    }
                });
            }
            function getAwardLevels(actId){ //根据活动获取该活动奖项等级
                $model.$getAwardLevels({
                    activityId: actId || ''
                }).then(function (res) {
                    if(res.data.ret == 200000){
                        $scope.awardLevelList = res.data.data;
                        $scope.$apply();
                    }
                });
            }
            
            $scope.getAwardDetail = function(actId){ //查看活动领奖详情
                getAwardLevels(actId);
                $scope.showActList = false;
                $scope.showSeceiveDetail = true;
                var actDetailObj = {
                    activeId : actId,
                    pageNum : 1,
                    pageSize : $scope.pageSize 
                }
                getAwardDetail(actDetailObj);
            }

            $("#detStartTime").datetimepicker({ //领奖明细开始时间
                format: 'yyyy-mm-dd hh:ii', 
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1
            }).on('change', function (e) {
                var startTime = e.target.value;
                var endTime = $scope.detEndTime;
                if (endTime < startTime) {
                    $scope.detEndTime = '';
                    $scope.$apply();
                }
            })

            $("#detEndTime").datetimepicker({ //领奖明细结束时间
                format: 'yyyy-mm-dd hh:ii', 
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1
            }).on('change', function (e) {
                var endTime = e.target.value;
                var startTime = $scope.detStartTime;
                if (startTime > endTime) {
                    $scope.detStartTime = '';
                    $scope.$apply();
                }
            });
            $model.$getProvince().then(function(res){ //获取省份列表
            	if(res.status != null){
            		var res = res.data || [];
            		$scope.province = res;
            		$scope.$apply();
            	}
            })
            $scope.changeProvince = function(provinceCode){ //根据省份获取市级列表
                $model.$getCity({
                    parentCode: provinceCode || ''
                }).then(function (res) {
                    $scope.city = res.data;
                    $scope.$apply();
                });
            }
            $scope.changeCity = function(cityCode){ //根据市级获取区县列表
                $model.$getArea({
                    parentCode: cityCode || ''
                }).then(function (res) {
                    $scope.area = res.data;
                    $scope.$apply();
                });
            }

            function exportAwardList(exportObj){ //导出活动中奖名单明细
                var url = '/api/tztx/xj/award/exportDrawDatas';
                var xhr = new XMLHttpRequest();
                var formData = new FormData();
                for(var attr in exportObj) {
                    formData.append(attr, exportObj[attr]);
                }
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
            $scope.exportAwardList = function(){ //导出中奖名单
                var exportAwardData = { 
                    level : $scope.awardGrade ? $scope.awardGrade : '',
                    startTime : $scope.detStartTime ? $scope.detStartTime + ':00' : '',
                    endTime : $scope.detEndTime ? $scope.detEndTime + ':00' : '',
                    province : $scope.provinceCode ? $scope.provinceCode : '',
                    city : $scope.cityCode ? $scope.cityCode : '',
                    area : $scope.cityCode ? ($scope.areaCode ? $scope.areaCode : '') : ''
                };
                exportAwardList(exportAwardData);
            }
        }]
    };

    return actmanageController;
});