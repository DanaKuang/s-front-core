/**
 * Author: zhaobl
 * Create Date: 2018-3-5
 * Description: 活动管理controller
 */
define([], function() {
    var achievementController = {
        ServiceType: "controller",
        ServiceName: "achievementCtrl",
        ViewModelName: 'visitManageModel',
        ServiceContent: ['$scope','dateFormatFilter', function($scope,dateFormatFilter) {
            var $model = $scope.$model;

            //初始化分页信息
            $scope.pageSize = 10; //每页显示多少条
            $scope.pageNo = 1; //当前页数
            $scope.totalPage = 0;//总页数
            var initPage = {
                pageNo : $scope.pageNo,
                pageSize : $scope.pageSize
            };
            var defauteNum = 5; //默认显示5行奖池配置
            
            $scope.showAchList = true; //显示业绩列表
            $scope.periodName = ''; //活动名称默认名称
            $scope.createAch = false; //新建业绩或编辑业绩
            $scope.showDelAwardBtn = false; //默认隐藏删除奖项按钮
            $scope.creatAchStatus = true; //默认为新建业绩配置状态
            $scope.showAchDetail = false; //默认隐藏业绩排名详情
            $scope.isSendCase = false; //默认不能派发现金奖项
            $scope.sendTemplateBox = false; //发送模板信息

            //创建分页工具
            function createPageTools(pageData){
                $(".tcdPageCode").createPage({
                    pageCount: pageData.allPages,
                    current : pageData.currentPage,
                    backFn : function(pageNum){
                        if($scope.showAchList){ //显示业绩排名列表
                            var curAchPageData = {
                                pageNo : pageNum,
                                pageSize : $scope.pageSize,
                                status : $scope.achStatus ? $scope.achStatus : '', //活动状态
                                periodName : $scope.periodName ? $scope.periodName : '', //活动名称
                                achievementType : $scope.achType ? $scope.achType : '' //活动类型
                            };
                            getAchList(curAchPageData);
                        }
                        if($scope.showAchDetail){ //业绩名次排名查询
                            var searchRankData = { 
                                pageNo : pageNum,
                                pageSize : $scope.pageSize,
                                periodId : $scope.periodId, //业绩ID
                                shopName : $scope.shopName, //店铺名称
                                rankSection : $scope.rankSection//名次区间
                            };
                            getPeriodResultList(searchRankData);
                        }
                    }
                });
            }

            function getAchList(actPrame){ //获取业绩列表数据
                $model.getAchieveList(actPrame).then(function (res) {
                    if(res.data.ok){
                        var dataObj = res.data.data;
                        $scope.achDataList = dataObj.list || [];
                        var newPageObj = {
                            allPages : dataObj.page.pageCount,
                            currentPage : dataObj.page.pageNo
                        };
                        $scope.pageNo = dataObj.page.pageNo;
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

            getAchList(initPage); //业绩列表信息

            $scope.searchAch = function(){
                if($scope.showAchList){//查询业绩排名
                    var searchAchData = { 
                        pageNo : 1,
                        pageSize : $scope.pageSize,
                        status : $scope.achStatus ? $scope.achStatus : '', //活动状态
                        periodName : $scope.periodName ? $scope.periodName : '', //活动名称
                        achievementType : $scope.achType ? $scope.achType : '' //活动类型
                    };
                    getAchList(searchAchData);
                }
                if($scope.showAchDetail){ //业绩名次排名查询
                    var searchRankData = { 
                        pageNo : 1,
                        pageSize : $scope.pageSize,
                        periodId : $scope.periodId, //业绩ID
                        shopName : $scope.shopName, //店铺名称
                        rankSection : $scope.rankSection//名次区间
                    };
                    getPeriodResultList(searchRankData);
                }
            }
            $scope.resetAct = function(){ //重置业绩排名查询条件
                if($scope.showAchList){
                    $scope.achStatus = '';
                    $scope.periodName = '';
                    $scope.achType = '';
                    getAchList(initPage);
                }
                if($scope.showAchDetail){
                    $scope.rankSection = '';
                    $scope.shopName = '';
                    var rankInitData = {
                        pageNo : 1,
                        pageSize : $scope.pageSize,
                        periodId : $scope.periodId, //业绩ID
                    }
                    getPeriodResultList(rankInitData);
                }  
            }
            $scope.warnInfo = { //警告信息提示
                achNameWarn : false, //活动名称警告
                achRuleWarn : false, //活动规则警告
                achTimeWarn : false, //活动时间警告
                achWXTempWarn : false //微信消息模板ID警告
            }
            $scope.creatAch = function(){ //新建业绩
                $scope.showAchList = false; //显示业绩列表
                $scope.createAch = true; //新建业绩或编辑业绩
                $scope.achObj = { //新建活动
                    periodName : '', //活动名称
                    achievementType : '1', //活动类型 1:默认排行榜 2:拉新排行榜
                    ruleHtml : '', //活动规则
                    stimeStr : '', //活动开始时间
                    etimeStr : '', //活动结束时间
                    templateId : '', //微信消息模板ID
                    awards : [] //活动奖项设置
                    
                }
                var awardItemObj = { //奖项初始化参数
                    rankStart : '', //区间开始值
                    rankEnd : '', //区间结束值
                    rankStr : '', //名次区间拼接字符串
                    awardName : '', //奖品名称
                    awardPrice : '', //奖项市场价值
                    awardType : 3, //奖项类型
                    awardWarn : false //奖池信息完善提示
                }
                $scope.achObj.awards.push(awardItemObj); //初始化添加一个奖项配置
            }
            $("#stimeStr").datetimepicker({ //新增或编辑活动开始时间
                format: 'yyyy-mm-dd hh:ii', 
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1
            }).on('change', function (e) {
                var startTime = e.target.value;
                var endTime = $scope.achObj.etimeStr;
                if (endTime < startTime) {
                    $scope.achObj.etimeStr = '';
                    $scope.$apply();
                }
            })
            
            $("#etimeStr").datetimepicker({ //新增或编辑活动结束时间
                format: 'yyyy-mm-dd hh:ii', 
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1
            }).on('change', function (e) {
                var endTime = e.target.value;
                var startTime = $scope.achObj.stimeStr;
                if (startTime > endTime) {
                    $scope.achObj.stimeStr = '';
                    $scope.$apply();
                }
            });
            $scope.clearNoNum = function(obj,attr){ //验证市场价格
                //先把非数字的都替换掉，除了数字和.
                obj[attr] = obj[attr].replace(/[^\d.]/g,"");
                //必须保证第一个为数字而不是.
                obj[attr] = obj[attr].replace(/^\./g,"");
                //保证只有出现一个.而没有多个.
                obj[attr] = obj[attr].replace(/\.{2,}/g,"");
                //保证.只出现一次，而不能出现两次以上
                obj[attr] = obj[attr].replace(".","$#$").replace(/\./g,"").replace("$#$",".");
            }
            $scope.addAwardItem = function(){ //添加奖项配置
                if($scope.achObj.awards.length < 10){
                    var awardItemObj = { //奖项初始化参数
                        rankStart : '', //区间开始值
                        rankEnd : '', //区间结束值
                        rankStr : '', //名次区间拼接字符串
                        awardName : '', //奖品名称
                        awardPrice : '', //奖项市场价值
                        awardType : 3, //奖项类型
                        awardWarn : false //奖池信息完善提示
                    }
                    $scope.achObj.awards.push(awardItemObj);
                }
                if($scope.achObj.awards.length > 1){
                    $scope.showDelAwardBtn = true;
                } 
            }
            $scope.delAwardItem = function(){ //删除奖项设置
                var cutAwardIndex = $scope.achObj.awards.length - 1;
                if(cutAwardIndex > 0){
                    $scope.achObj.awards.splice(cutAwardIndex,1);
                    if($scope.achObj.awards.length < 2){
                        $scope.showDelAwardBtn = false;
                    }
                }  
            }
            var regTime = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            $scope.saveOrUpdate = function(){ //保存或更新业绩配置
                if($scope.achObj.periodName == ''){ //检验活动名称
                    $scope.warnInfo.achNameWarn = true;
                    return;
                }else{
                    $scope.warnInfo.achNameWarn = false;
                }
                if($scope.achObj.ruleHtml == ''){ //检验活动规则
                    $scope.warnInfo.achRuleWarn = true;
                    return;
                }else{
                    $scope.warnInfo.achRuleWarn = false;
                }
                if($scope.achObj.stimeStr == ''){ //检验活动开始时间
                    $scope.warnInfo.achTimeWarn = true;
                    return;
                }else{                    
                    $scope.warnInfo.achTimeWarn = false;
                }
                if($scope.achObj.etimeStr == ''){ //检验活动结束时间
                    $scope.warnInfo.achTimeWarn = true;
                    return;
                }else{                    
                    $scope.warnInfo.achTimeWarn = false;
                }
                if($scope.achObj.templateId == ''){ //微信消息模板ID
                    $scope.warnInfo.achWXTempWarn = true;
                    return;
                }else{                    
                    $scope.warnInfo.achWXTempWarn = false;
                }
                for(var i = 0,l = $scope.achObj.awards.length;i<l;i++){
                    for(var key in $scope.achObj.awards[i]){ //检查每个奖池信息是否完善
                        switch(key){
                            case 'awardName':
                            case 'awardPrice':
                                if($scope.achObj.awards[i][key] == ''){
                                    $scope.achObj.awards[i].awardWarn = true;
                                    return;
                                }else{
                                    $scope.achObj.awards[i].awardWarn = false;
                                }
                                break;
                            case 'rankStr':
                                if($scope.achObj.awards[i][key] == ''){
                                    $scope.achObj.awards[i].awardWarn = true;
                                    return;
                                }else{
                                    var rankArr = $scope.achObj.awards[i][key].split('-');
                                    $scope.achObj.awards[i].rankStart = rankArr[0]; //区间开始值
                                    $scope.achObj.awards[i].rankEnd = rankArr[1]; //区间结束值
                                    $scope.achObj.awards[i].awardWarn = false;
                                }
                                break;
                            default :
                        }
                    }
                }
                if(!regTime.test($scope.achObj.stimeStr)){
                    $scope.achObj.stimeStr += ':00';
                }
                if(!regTime.test($scope.achObj.etimeStr)){
                    $scope.achObj.etimeStr += ':59';
                }
                $model.saveOrUpdateAch($scope.achObj).then(function (res) { //保存业绩信息
                    if(res.data.ok){
                        $scope.showAchList = true; //显示业绩列表
                        $scope.createAch = false; //新建业绩或编辑业绩
                        getAchList(initPage); //业绩列表信息
                    }else{
                        alert(res.data.msg);
                    }
                })  
            }
            $scope.backAchList = function(){ //返回业绩列表
                $scope.showAchList = true; //显示业绩列表
                $scope.createAch = false; //新建业绩或编辑业绩
                $scope.creatAchStatus = true;
                $scope.showAchDetail = false; //默认隐藏业绩排名详情
                $scope.isSendCase = false; //默认不能派发现金奖项
                $scope.sendTemplateBox = false; //发送模板信息
                getAchList(initPage); //业绩列表信息
            }
            $scope.editAchivity = function(achId){ //编辑业绩配置
                if(achId){
                    $model.getAchDetil({periodId : achId}).then(function (res) { //获取业绩详情
                        if(res.data.ok){
                            var detailObj = res.data.data;
                            $scope.achObj = { //业绩配置信息
                                id : detailObj.id, //活动id
                                achievementType : detailObj.achievementType, //活动类型
                                periodName : detailObj.periodName, //活动名称
                                ruleHtml : detailObj.ruleHtml, //活动规则
                                stimeStr : detailObj.stimeStr, //开始时间
                                etimeStr : detailObj.etimeStr, //结束时间
                                awards : detailObj.awards, //活动奖项设置
                                templateId : detailObj.templateId //微信消息模板ID
                            }
                            for(var i=0;i<$scope.achObj.awards.length;i++){
                                $scope.achObj.awards[i].rankStr = $scope.achObj.awards[i].rankStart + '-' + $scope.achObj.awards[i].rankEnd;
                            }
                            if($scope.achObj.awards.length > 1){
                                $scope.showDelAwardBtn = true;
                            }
                            $scope.showAchList = false; //显示业绩列表
                            $scope.createAch = true; //新建业绩或编辑业绩
                            $scope.creatAchStatus = false;
                            $scope.$apply();
                        }
                    })  
                }
            }
            function getPeriodResultList(actPrame){ //获取业绩排名列表数据
                $model.getPeriodResultList(actPrame).then(function (res) {
                    if(res.data.ok){
                        var dataObj = res.data.data;
                        $scope.rankDataList = dataObj.list || [];
                        var newPageObj = {
                            allPages : dataObj.page.pageCount,
                            currentPage : dataObj.page.pageNo
                        };
                        $scope.pageNo = dataObj.page.pageNo;
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
            $scope.getAchDetail = function(achId){ //查看业绩排名详情
                if(achId){
                    $scope.periodId = achId; //当前业绩的排名
                    $model.getQueryAwardList({periodId : achId}).then(function (res) { //业绩排名名次
                        if(res.data.ok){
                            $scope.rankList = [];
                            var awardDataObj = res.data.data;
                            for(var i =0;i<awardDataObj.length;i++){
                                var rankItem = {
                                    rankSection : awardDataObj[i].rankStart + '-' + awardDataObj[i].rankEnd
                                }
                                $scope.rankList.push(rankItem);
                            }
                            $scope.$apply();
                        }
                    })
                    var achObj = {
                        periodId : achId
                    };
                    getPeriodResultList(achObj);
                    $model.getAchDetil(achObj).then(function (res) { //查看是否可派发现金奖项
                        if(res.data.ok){
                            var detailObj = res.data.data;
                            var entTimes = detailObj.etime;
                            var curTimes = new Date().getTime();
                            if(curTimes > entTimes){
                                $scope.isSendCase = true;
                                $scope.$apply();
                            }
                        }
                    })
                    $scope.showAchList = false; //显示业绩列表
                    $scope.showAchDetail = true; //默认隐藏业绩排名详情
                }
            }
            function exportAwardList(exportObj){ //导出活动中奖名单明细
                var url = '/api/tztx/seller-manager/achieve/exportPeriodResult';
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
                var exportRankData = {
                    periodId : $scope.periodId, //业绩ID
                    shopName : $scope.shopName ? $scope.shopName : '', //店铺名称
                    rankSection : $scope.rankSection ? $scope.rankSection : ''//名次区间
                };
                exportAwardList(exportRankData);
            }
            $scope.sendCashRank = function(){ //派发现金奖项
                if($scope.isSendCase && $scope.periodId){
                    $('.send_case_box').modal('show');
                }
            }
            $scope.confirmSendCase = function(){ //确定派发现金
                $model.payAchievement({periodId:$scope.periodId}).then(function (res) { //查看是否可派发现金奖项
                    if(res.data.ok){
                        $('.send_case_box').modal('hide');
                    }else{
                        alert(res.data.msg);
                    }
                })
            }
            $scope.sendInfoObj = { //发送模板数据
                topDescribe : '', //顶部描述
                actName : '', //活动名称
                sendTime : '', //活动时间
                bottomDescribe : '', //底部描述
                sendRange : 2, //发送范围
                templateUrl : '' //链接地址
            }
            $scope.sendWarnInfo = { //发送模板警告信息提示
                topWarn : false, //顶部描述警告
                actNameWarn : false, //活动名称
                sendTimeWarn : false, //活动时间警告
                bottomWarn : false //底部描述警告 
            }
            $scope.sendTemplateInfo = function(){ //发送模板消息
                if($scope.isSendCase){
                    $scope.sendTemplateBox = true; //发送模板信息
                    $scope.showAchDetail = false;
                }
            }
            $scope.backAchRank = function(){ //返回排名列表
                $scope.sendTemplateBox = false; //发送模板信息
                $scope.showAchDetail = true;
            }
            $scope.comSendInfo = function(){ //确定发送模板信息
                if($scope.sendInfoObj.topDescribe == ''){ //检验顶部描述
                    $scope.sendWarnInfo.topWarn = true;
                    return;
                }else{
                    $scope.sendWarnInfo.topWarn = false;
                }
                if($scope.sendInfoObj.actName == ''){ //检验活动名称
                    $scope.sendWarnInfo.actNameWarn = true;
                    return;
                }else{
                    $scope.sendWarnInfo.actNameWarn = false;
                }
                if($scope.sendInfoObj.sendTime == ''){ //检验活动时间
                    $scope.sendWarnInfo.sendTimeWarn = true;
                    return;
                }else{
                    $scope.sendWarnInfo.sendTimeWarn = false;
                }
                if($scope.sendInfoObj.bottomDescribe == ''){ //检验底部描述
                    $scope.sendWarnInfo.bottomWarn = true;
                    return;
                }else{
                    $scope.sendWarnInfo.bottomWarn = false;
                }
                $('.send_tem_box').modal('show');
            }
            $scope.confirmSendTem = function(){ //确定发送模板消息
                var sendTemInfo = {
                    wxTemplateParams : {
                        first : $scope.sendInfoObj.topDescribe,
                        keyword1 : $scope.sendInfoObj.actName,
                        keyword2 : $scope.sendInfoObj.sendTime,
                        remark : $scope.sendInfoObj.bottomDescribe,
                        templateUrl : $scope.sendInfoObj.templateUrl,
                        
                    },
                    achieveParams:{
                        sendScope : $scope.sendInfoObj.sendRange,
                        periodId : $scope.periodId
                    } 
                }
                $model.sendWechatTemplate(sendTemInfo).then(function (res) { //发送模板消息
                    if(res.data.ok){
                        $('.send_tem_box').modal('hide');
                        $scope.sendTemplateBox = false; //发送模板信息
                        $scope.showAchDetail = true;
                        var reflectRankData = { 
                            pageNo : 1,
                            pageSize : $scope.pageSize,
                            periodId : $scope.periodId //业绩ID
                            //shopName : $scope.shopName, //店铺名称
                            //rankSection : $scope.rankSection//名次区间
                        };
                        getPeriodResultList(reflectRankData);
                    }else{
                        alert(res.data.msg);
                    }
                })
            }
            $scope.showDealerDetail = function(retailId){
                sessionStorage.setItem('retailId',retailId);
                $("[data-target='sellerAchievement']").parent().removeClass('active');
                $("[data-target='sellermanage']").trigger('click');
                $("[data-target='sellermanage']").parent().addClass('active');
            }

        }]
    };

    return achievementController;
});