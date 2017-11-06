/**
 * Author: zhaobaoli
 * Create Date: 2017-10-16
 * Description: questionnaireactivity
*/

define([], function () {
    var nguiQuestionnaireActivity = angular.module('ngui.questionnaireactivity', []);

    var nguiQuestionnaireActivityFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/questionnaireactivity.tpl.html',
            selectBrandVal: '',
            selectSpecificationVal: '',
            pageName: ''
        };
        var defineObj = { //指令定义对象
            restrict: 'AE',
            replace: true,
            transclude: true,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.tpl || defaults.tpl;
            },
            scope: {
                conf: '='
            },
            link: linkFn
        };

        function linkFn (scope, element, attrs) {
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['selectBrandVal', 'selectSpecificationVal', 'pageName']);

            // 监视conf变化更新 commonactivity
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['pageName']);
                var allconfigtemplateScope = angular.element('.all-template-config-wrap').scope();
                scope.pageName = allconfigtemplateScope.pageName;
            }, true);

            var questionnaireData = {
                'qc' : {}
            };

            var all_template_scope = angular.element('.all-template-config-wrap').scope();
            if(all_template_scope.activityCode){
                // 说明从编辑活动过来
                scope.disabled = true;
                scope.edit = true;
                var activity = all_template_scope.conf.data.activity;
                scope.activity = activity;
                scope.actForm = activity.activityForm;
                scope.selectBrandVal = activity.brandCode;
                scope.selectSpecificationVal = activity.sn;

                var cityCodeArr = activity.areaCode.split(',');
                var selectAreaVal = [];
                var adcodenames = [];

                scope.selectAreaVal = selectAreaVal.join(',');
                scope.adcodenames = activity.areaName;
                $('#quesName').val(activity.activityName).attr('disabled','true');
                var sTime = new Date(activity.stime);
                scope.startTime = timesFormatStr(sTime);
                var eTime = new Date(activity.etime);
                scope.endTime = timesFormatStr(eTime);
                $('#normalFileWarn').html(activity.attachName).css('color','#ccc');
                $('#normalFile').attr('disabled','true');
                $('#checkWxPacket').attr('disabled','true');
                if(activity.activityAwards.length > 0){
                    $('#checkWxPacket').attr('checked','true');
                    $('#selectPacketBox').removeClass('hide');
                    //normalFileWarn
                    $('#normalFileWarn').html(activity.attachName);
                    var activeAwardsObj = activity.activityAwards[0].details[0];
                    $('#chosePacket').html(activeAwardsObj.poolName);
                    scope.poolId = activeAwardsObj.poolId; //红包池id

                    //判断是随机还是固定金额
                    if(activeAwardsObj.bigred != activeAwardsObj.minred){
                        $('#ranAmont').attr({'checked':'true',"disabled":'true'});
                        $('#fixdAmont').attr("disabled",'true');
                        $('#fixdMoney').attr('disabled','true');
                        $('#startMoney').val(activeAwardsObj.minred).attr('disabled','true');
                        $('#endMoney').val(activeAwardsObj.bigred).attr('disabled','true');
                    }else{
                        $('#ranAmont').attr("disabled",'true');
                        $('#fixdAmont').attr({'checked':'true',"disabled":'true'});
                        $('#fixdMoney').val(activeAwardsObj.bigred).attr('disabled','true');
                        $('#startMoney').attr('disabled','true');
                        $('#endMoney').attr('disabled','true');
                    }
                    scope.oldTotalMoney = activeAwardsObj.redTotalMoney;
                    scope.oldAwardNum = activeAwardsObj.awardNums;
                    $('#packetToal').val(activeAwardsObj.redTotalMoney).attr('disabled','true');
                    $('#prizeNum').val(activeAwardsObj.awardNums).attr('disabled','true');
                }
            }else{
                var pageListObj = all_template_scope.conf.data[0];
                questionnaireData.activityForm = pageListObj.type;
                questionnaireData.copyOfPageCode = pageListObj.pageCode;
                $('#ranAmont').attr('checked','true');
            }
            
            //时间转换格式
            function timesFormatStr(times){
                return times.getFullYear() + "-" + strRegion((times.getMonth() + 1)) + "-" + strRegion(times.getDate()) + " " + strRegion(times.getHours()) + ":" + strRegion(times.getMinutes());
            }
            //时间补位
            function strRegion(timeStr){
                if(parseInt(timeStr) <= 9){
                    return '0'+timeStr;
                }
                return timeStr;
            }

            //品牌
            $('.select-brand').one('click', function() {
                if (!scope.disabled) {
                    scope.$emit('clickbrandval', event, {})
                } else {
                    return
                }
            })
                
            scope.$watch('selectBrandVal', function (n, o, s) {
                if (n !== '') {
                    var brandListArrObj = {};
                    brandListArrObj.brandCode = n;
                    scope.$emit('brandCode', event, brandListArrObj);
                }
            })

            //规格
            scope.$watch('selectSpecificationVal', function (n, o, s) {
                scope.$emit('specificationnotempty', event, {
                    canchoose: true
                });
            })

            //地区
            // 点击选择地区
            $('.select-area').one('click', function () {
                if (!scope.disabled) {
                    scope.$emit('clickselectarea', event, {parentCode: ''})
                } else {
                    return
                }
            })

            //开始时间
            $('input[name="startTime"]').datetimepicker({
                format: 'yyyy-mm-dd hh:ii:00', 
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startDate: new Date()
            }).on('change', function (e) {
                var startTime = e.target.value;
                var endTime = scope.endTime;
                if (endTime < startTime) {
                    scope.endTime = '';
                    scope.$apply();
                }
            });
            //结束时间
            $('input[name="endTime"]').datetimepicker({
                format: 'yyyy-mm-dd hh:ii:00', 
                language: 'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startDate: new Date()
            }).on('change', function (e) {
                var endTime = e.target.value;
                var startTime = scope.startTime;
                if (startTime > endTime) {
                    scope.startTime = '';
                    scope.$apply();
                }
            });

            //选择红包池
            $('.select_packet').on('click','.show-hb-list',function(e){
                var that_scope = angular.element('.select-brand').scope();
                if (that_scope.selectSpecificationVal != '') {
                    $(e.target).next().trigger('click');
                    var data = {
                        metraType: 'redpack',
                        brandCodes: that_scope.selectBrandVal,
                        unitCodes: that_scope.selectSpecificationVal,
                        status: 1,//礼品、红包池状态。0-停用；1-正常,
                        hasLeft: true//是否查询有库存的池数据。true-池剩余必须大于0；false或空参则忽略库存数量
                    }
                    scope.$emit('fromActivityConfigtoChooseHb', event, data);

                    // scope.chooseNum = $(e.target).parents('.draw-prize-wrap').index();
                    // scope.firstornot = $(e.target).parents('.gotoset').hasClass('first-draw');
                } else {
                    alert('请先选择品牌和规格！')
                }
            })

            //监听是否选择微信红包
            $('#checkWxPacket').on('change',function(){
                var isChoosePacket = $(this)[0].checked;
                if(isChoosePacket){
                    $('#selectPacketBox').removeClass('hide');
                }else{
                    $('#selectPacketBox').addClass('hide');
                }
            })

            //规范性文件及说明
            $('#normalFile').change(function(){
                var normalFile = $('#normalFile')[0].files[0];
                if(normalFile != undefined){
                    var curFileName = normalFile.name;
                    $('#normalFileWarn').css('color','#ACACAC').html('文件上传中...');
                    var formData = new FormData();
                    formData.append('file',normalFile);
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
                        if(res.ret == "200000"){
                            var fileData = res.data;
                            $('#normalFileWarn').css('color','#ACACAC').html(fileData.filename);
                            questionnaireData.normFile = fileData.attachCode;
                        }
                        

                    }).fail(function(res) {
                        $('#normalFileWarn').css('color','#ff3300').html('文件上传失败');
                    });
                }
            });

            function checkRanOrFix(){
                var isRan = $('#ranAmont')[0].checked;
                if(isRan){
                    $('#prizeNum').removeAttr('disabled').val('');
                    $('#packetToal').val('');
                    $('#fixdMoney').val('');
                }else{
                    $('#prizeNum').attr('disabled','true').val('');
                    $('#startMoney').val('');
                    $('#endMoney').val('');
                    $('#packetToal').val('');
                }
            }

            //是否选为随机金额
            $('#ranAmont').on('change',function(){
                checkRanOrFix();
            });
            //是否选为固定金额
            $('#fixdAmont').on('change',function(){
                checkRanOrFix();
            });

            //金额转换
            function formatMoney(moneyVal){
                if(moneyVal != ''){
                    var regNum = /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;
                    if(regNum.test(moneyVal)){
                        var numStr = moneyVal.toString().indexOf('.');
                        if(numStr > -1){
                            moneyVal = Number(moneyVal.toString().match(/^\d+(?:\.\d{0,2})?/));
                        }
                        return moneyVal;
                    }
                } 
            }

            scope.totalPacket = function(){
                //固定金额
                var fixdMoney = $('#fixdMoney').val();
                if(fixdMoney != ''){
                    var formatFixd = formatMoney(fixdMoney);
                    //红包总额
                    var packetToal = $('#packetToal').val();
                    var formatTotal = formatMoney(packetToal);
                    var packetNum = Math.floor(formatTotal/formatFixd);
                    $('#prizeNum').val(packetNum);
                } 
            }


            //完成题干进行下一步
            scope.finishGeneral = function(){
                // questionnaireData
                //活动名称
                var quesName = $('#quesName').val();
                if(quesName == ''){
                    $('#nameWarn').show();
                    return;
                }else{
                    $('#nameWarn').hide();
                    questionnaireData.activityName = quesName;
                }
                //选择品牌
                var that_scope = angular.element('.select-brand').scope();
                
                var selectBrand = that_scope.selectBrandVal;
                if(selectBrand == ''){
                    $('#brandWarn').show();
                    return;
                }else{
                    $('#brandWarn').hide();
                    // questionnaireData.brands = [];
                    // questionnaireData.brands.push(selectBrand);
                    questionnaireData.brandCode = selectBrand;
                }
                //选择规格
                var selectspecif = that_scope.selectSpecificationVal;
                if(selectspecif == ''){
                    $('#specifWarn').show();
                    return;
                }else{
                    $('#specifWarn').hide();
                    // questionnaireData.sns = [];
                    // questionnaireData.sns.push(selectspecif);
                    questionnaireData.sn = selectspecif;
                }
                //选择地区
                var area_scope = angular.element('.select-area').scope();
                var areaArr = area_scope.selectAreaVal;
                if(areaArr == undefined){
                    $('#areaWarn').show();
                    return;
                }else{
                    $('#areaWarn').hide();
                    questionnaireData.areaCode = areaArr.join(',');
                }
                //活动时段  select-duration
                var duration_scope = angular.element('.select-duration').scope();
                var startTime = duration_scope.startTime;
                if(startTime == undefined){
                    $('#durationWarn').show();
                    return;
                }else{
                    $('#durationWarn').hide();
                    questionnaireData.stime = startTime+":00";
                }

                var endTime = duration_scope.endTime;
                if(endTime == undefined){
                    $('#durationWarn').show();
                    return;
                }else{
                    $('#durationWarn').hide();
                    questionnaireData.etime = endTime+":00";
                }
                //规范性文件及说明
                if(questionnaireData.normFile == undefined || questionnaireData.normFile == ''){
                    $('#normalFileWarn').css('color','#ff3300').html('请上传规范性文件及说明文件');
                    return;
                }else{
                    $('#normalFileWarn').css('color','#ACACAC').html('');
                }

                //是否选择微信红包
                questionnaireData.activityAwards = [];
                var isSelectPacket = $('#checkWxPacket')[0].checked;
                if(isSelectPacket){
                    var packetObj = {
                        'probability' : 100,
                        'prizeName' : '参与奖',
                        'special' : '-1'
                    };
                    packetObj.details = [];
                    var packetDetail = {
                        'awardType' : 3
                    };
                    //红包Id
                    var packetId = $('#chosePacket').attr('data-packetid');
                    if(packetId == undefined || packetId == ''){
                        $('#chosePacket').html('请选择红包池');
                        return;
                    }else{
                        packetDetail.poolId = packetId;
                    }
                    //红包时固定金额还是随机金额
                    var ranAmontObj = $("#ranAmont");
                    var fixdAmontObj = $("#fixdAmont");
                    if(!ranAmontObj[0].checked && !fixdAmontObj[0].checked){
                        $("#ranWarn").html("请选择金额类型").show();
                        return;
                    }
                    if(ranAmontObj[0].checked){
                        $("#fixdWarn").hide();
                        var startMoney = $("#startMoney").val();
                        var endMoney = $("#endMoney").val();
                        if(startMoney == "" || endMoney == ""){
                            $("#ranWarn").show();
                            return;
                        }else{
                            $("#ranWarn").hide();
                            packetDetail.minred = startMoney;
                            packetDetail.bigred = endMoney;
                        }
                    }else{
                        $("#ranWarn").hide();
                        var fixdMoney = $("#fixdMoney").val();
                        if(fixdMoney == ''){
                            $("#fixdWarn").show();
                            return;
                        }else{
                            $("#fixdWarn").hide();
                            packetDetail.minred = fixdMoney;
                            packetDetail.bigred = fixdMoney;
                        }
                    }
                    //红包总额
                    var packetToal = $("#packetToal").val();
                    if(packetToal == ''){
                        $("#totalWarn").show();
                        return;
                    }else{
                        $("#totalWarn").hide();
                        packetDetail.redTotalMoney = packetToal;
                    }
                    //奖品数量
                    var prizeNum = $("#prizeNum").val();
                    if(prizeNum == ''){
                        $("#prizeNumWarn").show();
                        return;
                    }else{
                        $("#prizeNumWarn").hide();
                        packetDetail.awardNums = prizeNum;
                    }
                    packetObj.details.push(packetDetail);
                    questionnaireData.activityAwards.push(packetObj);

                }
                //活动名称显示
                $('#activeName').html(questionnaireData.activityName);
                $('#createQuestionnaire').hide();
                $('#addQquestion').show();
            }

            //试卷开始说明
            scope.startDesc = function(){
                var startExplain = $("#startExplain").val();
                questionnaireData.qc.preDesc = startExplain;
            }

            //试卷结束说明
            scope.endDesc = function(){
                var endExplain = $("#endExplain").val();
                questionnaireData.qc.afterDesc = endExplain;
            }

            //所有题目属性
            questionnaireData.qc.qcList = [];
            //添加题目
            scope.addQuestion = function(index){
                var movie_box = '<div class="movie_box" style="border: 1px solid rgb(255, 255, 255);"></div>';
                var Grade = $(".yd_box").find(".movie_box").length + 1;
                var quesType = index + 1;
                var subjectObj = {
                    'questType' : quesType,
                    'idx' : Grade
                };
                questionnaireData.qc.qcList.push(subjectObj);
                switch (index) {
                    case 0: //单选
                    case 1: //多选
                    case 2: //问答
                        var wjdc_list = '<ul class="wjdc_list"></ul>'; //问答 单选 多选
                        var danxuan = "";
                        if (index == 0) {
                            danxuan = '【单选】';
                        } else if (index == 1) {
                            danxuan = '【多选】';
                        } else if (index == 2) {
                            danxuan = '【问答】';
                        }
                        wjdc_list = $(wjdc_list).append(' <li><div class="tm_btitlt"><i class="nmb">' + Grade + '</i>. <i class="btwenzi">请编辑问题？</i><span class="tip_wz">' + danxuan + '</span></div>'+
                        '<div class="tm_breif"></div></li>');
                        if (index == 2) {
                            wjdc_list = $(wjdc_list).append('<li>  <label><textarea name="" cols="" rows="" class="input_wenbk btwen_text btwen_text_dx" ></textarea></label><div class="tm_breif"></div> </li>');
                        }
                        movie_box = $(movie_box).append(wjdc_list);
                        movie_box = $(movie_box).append('<div class="dx_box" data-t="' + index + '"></div>');

                        break;
                }

                $(movie_box).hover(function() {
                    var html_cz = "<div class='kzqy_czbut'><a href='javascript:void(0)' class='sy'>上移</a><a href='javascript:void(0)'  class='xy'>下移</a><a href='javascript:void(0)'  class='bianji'>编辑</a><a href='javascript:void(0)' class='del' >删除</a></div>"
                    $(this).css({
                        "border": "1px solid #0099ff"
                    });
                    $(this).children(".wjdc_list").after(html_cz);
                }, function() {
                    $(this).css({
                        "border": "1px solid #fff"
                    });
                    $(this).children(".kzqy_czbut").remove();
                    //$(this).children(".dx_box").hide(); 
                });
                $(".yd_box").append(movie_box);
            
            }


             //下移
            $(".yd_box").on("click",".xy", function() {
                //文字的长度 
                var leng = $(".yd_box").children(".movie_box").length;
                var dqgs = $(this).parent(".kzqy_czbut").parent(".movie_box").index();
                var xyIndex = dqgs + 1;
                if(dqgs < leng - 1) {
                    var czxx = $(this).parent(".kzqy_czbut").parent(".movie_box");
                    var xyghtml = czxx.next().html();
                    var syghtml = czxx.html();
                    czxx.next().html(syghtml);
                    czxx.html(xyghtml);
                    //序号
                    czxx.children(".wjdc_list").find(".nmb").text(dqgs + 1);
                    czxx.next().children(".wjdc_list").find(".nmb").text(dqgs + 2);

                    //数据序号更改
                    questionnaireData.qc.qcList[dqgs].idx =  questionnaireData.qc.qcList[dqgs].idx + 1;
                    questionnaireData.qc.qcList[xyIndex].idx =  questionnaireData.qc.qcList[xyIndex].idx - 1;
                    
                    //题目按照idx排序
                    var idxOrder = questionnaireData.qc.qcList.sort(  
                        function(a, b){
                            if(a.idx < b.idx) return -1;  
                            if(a.idx > b.idx) return 1;  
                            return 0;  
                        }  
                    ); 
                    $.each(idxOrder, function(index, value){  
                        
                    });
                } else {
                    alert("到底了");
                }
            });

            //上移
            $(".yd_box").on("click",".sy", function() {
                //文字的长度 
                var leng = $(".yd_box").children(".movie_box").length;
                var dqgs = $(this).parent(".kzqy_czbut").parent(".movie_box").index();
                var syIndex = dqgs - 1;
                if(dqgs > 0) {
                    var czxx = $(this).parent(".kzqy_czbut").parent(".movie_box");
                    var xyghtml = czxx.prev().html();
                    var syghtml = czxx.html();
                    czxx.prev().html(syghtml);
                    czxx.html(xyghtml);
                    //序号
                    czxx.children(".wjdc_list").find(".nmb").text(dqgs + 1);
                    czxx.prev().children(".wjdc_list").find(".nmb").text(dqgs);
                    //数据序号更改
                    questionnaireData.qc.qcList[dqgs].idx =  questionnaireData.qc.qcList[dqgs].idx - 1;
                    questionnaireData.qc.qcList[syIndex].idx =  questionnaireData.qc.qcList[syIndex].idx + 1;
                    
                    //题目按照idx排序
                    var idxOrder = questionnaireData.qc.qcList.sort(  
                        function(a, b){
                            if(a.idx < b.idx) return -1;  
                            if(a.idx > b.idx) return 1;  
                            return 0;  
                        }  
                    ); 
                    $.each(idxOrder, function(index, value){  
                        
                    });
                    

                } else {
                    alert("到头了");
                }
            });

            //删除
            $(".yd_box").on("click",".del", function(event) {
                //删除当前的编号
                var delIndex = $(this).parent(".kzqy_czbut").parent(".movie_box").children(".wjdc_list").children("li").eq(0).find(".nmb").text();

                for(var j = 0;j<questionnaireData.qc.qcList.length;j++){
                    if(questionnaireData.qc.qcList[j].idx == delIndex){
                        questionnaireData.qc.qcList.splice($.inArray(questionnaireData.qc.qcList[j],questionnaireData.qc.qcList),1);
                        for(var k=0;k<questionnaireData.qc.qcList.length;k++){
                            if(questionnaireData.qc.qcList[k].idx > delIndex){
                                questionnaireData.qc.qcList[k].idx = questionnaireData.qc.qcList[k].idx-1;
                            }
                        }
                    }
                }

                var czxx = $(this).parent(".kzqy_czbut").parent(".movie_box");
                var zgtitle_gs = czxx.parent(".yd_box").find(".movie_box").length;
                var xh_num = 1;
                
                czxx.remove();

                //重新编号
                $(".yd_box").find(".movie_box").each(function(i,c) {
                    $(this).children(".wjdc_list").children("li").eq(0).find(".nmb").text(xh_num);
                    xh_num++;
                });

            });

            //编辑
            $(".yd_box").on("click", ".bianji", function() {
                //编辑的时候禁止其他操作   
                $(this).siblings().hide();
                //$(this).parent(".kzqy_czbut").parent(".movie_box").unbind("hover"); 
                var dxtm = $(".dxuan").html();
                var duoxtm = $(".duoxuan").html();
                var tktm = $(".tktm").html();
                
                //接受编辑内容的容器
                var dx_rq = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".dx_box");
                var title = dx_rq.attr("data-t");
                //题目选项的个数
                var timlrxm = $(this).parent(".kzqy_czbut").parent(".movie_box").children(".wjdc_list").children("li").length;

                //单选题目
                if(title == 0) {
                    dx_rq.show().html(dxtm);
                    //模具题目选项的个数
                    var bjxm_length = dx_rq.find(".title_itram").children(".kzjxx_iteam").length;
                    var dxtxx_html = dx_rq.find(".title_itram").children(".kzjxx_iteam").html();
                    //添加选项题目
                    for(var i_tmxx = bjxm_length; i_tmxx < timlrxm - 1; i_tmxx++) {
                        dx_rq.find(".title_itram").append("<div class='kzjxx_iteam'>" + dxtxx_html + "</div>");
                    }
                    //赋值文本框 
                    //题目标题
                    var texte_bt_val = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".tm_btitlt").children(".btwenzi").text();
                    dx_rq.find(".btwen_text").val(texte_bt_val);
                    //标题描述
                    var texte_ms_val = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".tm_breif").text();
                    dx_rq.find(".btwen_brief").val(texte_ms_val);
                    //是否为必选题 nmb
                    var curIndex = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".nmb").text();
                    for(var i_num=0;i_num<questionnaireData.qc.qcList.length;i_num++){
                        if(questionnaireData.qc.qcList[i_num].idx == curIndex){
                            if(questionnaireData.qc.qcList[i_num].requireQuest == 1){
                                dx_rq.find(".bdtm")[0].checked = true;
                            }
                        }
                    }

                    //遍历题目项目的文字
                    var bjjs = 0;
                    $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").each(function() {
                        //可选框框
                        var ktksfcz = $(this).find("input").hasClass("wenb_input");
                        if(ktksfcz) {
                            var jsxz_kk = $(this).index();
                            dx_rq.find(".title_itram").children(".kzjxx_iteam").eq(jsxz_kk - 1).find("label").remove();
                        }
                        //题目选项
                        var texte_val = $(this).find("span").text();
                        if(bjjs > 0){
                            dx_rq.find(".title_itram").children(".kzjxx_iteam").eq(bjjs - 1).find(".input_wenbk").val(texte_val);
                        }
                        bjjs++

                    });
                }
                //多选题目  
                if(title == 1) {
                    dx_rq.show().html(duoxtm);
                    //模具题目选项的个数
                    var bjxm_length = dx_rq.find(".title_itram").children(".kzjxx_iteam").length;
                    var dxtxx_html = dx_rq.find(".title_itram").children(".kzjxx_iteam").html();
                    //添加选项题目
                    for(var i_tmxx = bjxm_length; i_tmxx < timlrxm - 1; i_tmxx++) {
                        dx_rq.find(".title_itram").append("<div class='kzjxx_iteam'>" + dxtxx_html + "</div>");
                    }
                    //赋值文本框 
                    //题目标题
                    var texte_bt_val = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".tm_btitlt").children(".btwenzi").text();
                    dx_rq.find(".btwen_text").val(texte_bt_val);
                    //标题描述
                    var texte_ms_val = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".tm_breif").text();
                    dx_rq.find(".btwen_brief").val(texte_ms_val);
                    //是否为必选题 nmb
                    var curIndex = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".nmb").text();
                    for(var i_num=0;i_num<questionnaireData.qc.qcList.length;i_num++){
                        if(questionnaireData.qc.qcList[i_num].idx == curIndex){
                            if(questionnaireData.qc.qcList[i_num].requireQuest == 1){
                                dx_rq.find(".bdtm")[0].checked = true;
                            }
                        }
                    }
                    //遍历题目项目的文字
                    var bjjs = 0;
                    $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").each(function() {
                        //可选框框
                        var ktksfcz = $(this).find("input").hasClass("wenb_input");
                        if(ktksfcz) {
                            var jsxz_kk = $(this).index();
                            dx_rq.find(".title_itram").children(".kzjxx_iteam").eq(jsxz_kk - 1).find("label").remove();
                        }
                        //题目选项
                        var texte_val = $(this).find("span").text();
                        dx_rq.find(".title_itram").children(".kzjxx_iteam").eq(bjjs - 1).find(".input_wenbk").val(texte_val);
                        bjjs++

                    });
                }
                //填空题目
                if(title == 2) {
                    dx_rq.show().html(tktm);
                    //赋值文本框 
                    //题目标题
                    var texte_bt_val = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".tm_btitlt").children(".btwenzi").text();
                    dx_rq.find(".btwen_text").val(texte_bt_val);
                    //标题描述
                    var texte_ms_val = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".tm_breif").text();
                    dx_rq.find(".btwen_brief").val(texte_ms_val);
                    //是否为必选题 nmb
                    var curIndex = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".nmb").text();
                    for(var i_num=0;i_num<questionnaireData.qc.qcList.length;i_num++){
                        if(questionnaireData.qc.qcList[i_num].idx == curIndex){
                            if(questionnaireData.qc.qcList[i_num].requireQuest == 1){
                                dx_rq.find(".bdtm")[0].checked = true;
                            }
                            //至少写多少字
                            var leastFontSize = questionnaireData.qc.qcList[i_num].minAnswer;
                            if( leastFontSize != undefined){
                                dx_rq.find(".font_size_limit").val(leastFontSize);
                            }
                        }
                    }
                }   
                
            });
            
            //改变至多选多少项的option
            function optionChangeNum(){
                //多选题增加至多选项
                var optionObj = $("#mostOption");
                var optionLen = optionObj.parent().parent().find('.title_itram').children('div').length;
                
                var selectChildLen = optionObj.children('option').length - 1;
                if(selectChildLen != optionLen){
                    optionObj.empty();
                    optionObj.append('<option value="0">请选择</option>');
                    for(var i=1;i<=optionLen;i++){
                        optionObj.append('<option value="'+i+'">'+i+'</option>');
                    }
                }
            }

            //增加选项  
            $(".yd_box").on("click",".zjxx", function() {
                var zjxx_html = $(this).prev(".title_itram").children(".kzjxx_iteam").html();
                $(this).prev(".title_itram").append("<div class='kzjxx_iteam'>" + zjxx_html + "</div>"); 
                // optionChangeNum();
            });

            //删除一行 
            $(".yd_box").on("click",".del_xm", function() {
                //获取编辑题目的个数
                var zuxxs_num = $(this).parent(".kzjxx_iteam").parent(".title_itram").children(".kzjxx_iteam").length;
                if(zuxxs_num > 1) {
                    $(this).parent(".kzjxx_iteam").remove();
                } else {
                    alert("手下留情");
                }
                // optionChangeNum();
            });
            //取消编辑
            $(".yd_box").on("click",".dx_box .qxbj_but", function() {
                $(this).parent(".bjqxwc_box").parent(".dx_box").empty().hide();
                $(".movie_box").css({
                    "border": "1px solid #fff"
                });
                $(".kzqy_czbut").remove();
                //            
            });

            //完成编辑（编辑）
            $(".yd_box").on("click",".swcbj_but", function() {

                var jcxxxx = $(this).parent(".bjqxwc_box").parent(".dx_box"); //编辑题目区
                var querstionType = jcxxxx.attr("data-t"); //获取题目类型
                //当前题目序号
                var finishIndex = jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").eq(0).find(".nmb").text();
                switch(querstionType) {
                    case "0": //单选
                    case "1": //多选	
                        //编辑题目选项的个数
                        var bjtm_xm_length = jcxxxx.find(".title_itram").children(".kzjxx_iteam").length; //编辑选项的 选项个数
                        var xmtit_length = jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").length - 1; //题目选择的个数

                        //赋值文本框
                        //题目标题
                        var texte_bt_val_bj = jcxxxx.find(".btwen_text").val(); //获取问题题目
                        // subjectObj.questName = texte_bt_val_bj;
                        jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").eq(0).find(".tm_btitlt").children(".btwenzi").text(texte_bt_val_bj); //将修改过的问题题目展示
                        //题目描述btwen_brief
                        var texte_ms_val_bj = jcxxxx.find(".btwen_brief").val(); //获取问题描述
                        // subjectObj.questDec = texte_ms_val_bj;
                        //必答题目
                        var bdtm = jcxxxx.find(".bdtm")[0].checked;
                        jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").eq(0).find(".tm_breif").text(texte_ms_val_bj);

                        //删除选项
                        for(var toljs = xmtit_length; toljs > 0; toljs--) {
                            jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").eq(toljs).remove();
                        }
                        //题目选项集合
                        var qcaList = [];
                        //遍历题目项目的文字
                        var bjjs_bj = 0;
                        jcxxxx.children(".title_itram").children(".kzjxx_iteam").each(function() {
                            //题目选项
                            var texte_val_bj = $(this).find(".input_wenbk").val(); //获取填写信息
                            // qcaList.push(texte_val_bj);
                            var optionObj = {
                                'answerName' : texte_val_bj
                            }
                            qcaList.push(optionObj);
                            var inputType = 'radio';
                            //jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").eq(bjjs_bj + 1).find("span").text(texte_val_bj);
                            if(querstionType == "1") {
                                inputType = 'checkbox';
                            }
                            var li = '<li><label><input name="a" type="' + inputType + '" value=""><span>' + texte_val_bj + '</span></label></li>';
                            jcxxxx.parent(".movie_box").children(".wjdc_list").append(li);

                            bjjs_bj++
                            //可填空  
                            var kxtk_yf = $(this).find(".fxk").is(':checked');
                            if(kxtk_yf) {
                                //第几个被勾选
                                var jsxz = $(this).index();
                                jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").eq(jsxz + 1).find("span").after("<input name='' type='text' class='wenb_input'>");
                            }
                        });

                        for(var i = 0;i<questionnaireData.qc.qcList.length;i++){
                            if(questionnaireData.qc.qcList[i].idx == finishIndex){

                                questionnaireData.qc.qcList[i].questName = texte_bt_val_bj;
                                questionnaireData.qc.qcList[i].questDec = texte_ms_val_bj;
                                questionnaireData.qc.qcList[i].qcaList = qcaList;

                                if(bdtm){
                                    questionnaireData.qc.qcList[i].requireQuest = 1;
                                }else{
                                    questionnaireData.qc.qcList[i].requireQuest = 0;
                                }
                            }
                        }

                        //是否已经存在该题目
                        // if (questionnaireData.qc.qcList.filter(function(f){
                        //     return f.idx == finishIndex;
                        // }).length) {

                        // } else {
                        //     questionnaireData.qc.qcList.push(subjectObj);
                        // }

                        break;
                    case "2":
                        var texte_bt_val_bj = jcxxxx.find(".btwen_text").val(); //获取问题题目
                        // subjectObj.questName = texte_bt_val_bj;
                        jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").eq(0).find(".tm_btitlt").children(".btwenzi").text(texte_bt_val_bj); //将修改过的问题题目展示
                        //题目描述btwen_brief
                        var texte_tk_val_bj = jcxxxx.find(".btwen_brief").val(); //获取问题描述
                        // subjectObj.questDec = texte_tk_val_bj;
                        jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").eq(0).find(".tm_breif").text(texte_tk_val_bj);
                        //必答题目
                        var bdtm = jcxxxx.find(".bdtm")[0].checked;
                        //至少写多少字
                        var texte_tk_least_val = jcxxxx.find(".least_size").val();
                        //是否已经存在该题目
                        // if (questionnaireData.qc.qcList.filter(function(f){
                        //     return f.idx == finishIndex;
                        // }).length) {

                        // } else {
                        //     questionnaireData.qc.qcList.push(subjectObj);
                        // }
                        for(var i = 0;i<questionnaireData.qc.qcList.length;i++){
                            if(questionnaireData.qc.qcList[i].idx == finishIndex){

                                questionnaireData.qc.qcList[i].questName = texte_bt_val_bj;
                                questionnaireData.qc.qcList[i].questDec = texte_tk_val_bj;

                                if(bdtm){
                                    questionnaireData.qc.qcList[i].requireQuest = 1;
                                }else{
                                    questionnaireData.qc.qcList[i].requireQuest = 0;
                                }

                                if(texte_tk_least_val != ''){
                                    questionnaireData.qc.qcList[i].minAnswer = texte_tk_least_val;
                                }
                            }
                        }
                        break;
                }
                //清除     
                $(this).parent(".bjqxwc_box").parent(".dx_box").empty().hide();
            });
            
            //是否启用本活动
            questionnaireData.status = 2;
            
            $("#isEnable").on('change',function(){
                var isEnable = $(this)[0].checked;
                if(isEnable){
                    questionnaireData.status = 1;
                }else{
                    questionnaireData.status = 2;
                }
            })

            //保存数据
            scope.saveData = function(){
                //是否赠送红包
                questionnaireData.qc.giveRedpack = 0;
                if(questionnaireData.activityAwards.length > 0){
                    questionnaireData.qc.giveRedpack = 1;
                }
                scope.$emit('questionnaireSaveData', event, questionnaireData);
            }

            //调查问卷预览
            scope.previewQuestionira = function(){
                $('#createQuestionnaire').hide();
                $('#addQquestion').hide();
                $('#viewQuestion').show();
                scope.previewData = questionnaireData;
            }
            //取消调查问卷创建
            scope.changeNair = function(){
                $('.cancel_box').modal('show');
                // 请求接口就好
                // scope.$emit('popback', event, {});
            }

            //退出预览
            scope.exitView = function(){
                $('#createQuestionnaire').hide();
                $('#viewQuestion').hide();
                $('#addQquestion').show();          
            }

            // 红包增库
          $('#createQuestionnaire').on('click', '.add-packet', function(e){
              var data = {
                  poolId: scope.poolId, 
                  activityForm: scope.actForm,
                  activityCode: all_template_scope.activityCode
              };
              scope.$emit('hbaddstockid', event, data);
          })
            //保存编辑时红包增库
            scope.saveEditData = function(){
                var editDataObj = {
                    activityCode: all_template_scope.activityCode,
                    pageCode : scope.activity.pageCode,
                    activityAwards : scope.activity.activityAwards
                }
                var nowToatal = $('#packetToal').val();
                var nowNum = $('#prizeNum').val();
                editDataObj.activityAwards[0].special = '-1';
                editDataObj.activityAwards[0].details[0].awardNums = nowNum; 
                editDataObj.activityAwards[0].details[0].redTotalMoney = nowToatal;
                scope.$emit('questionnaireSaveData', event, editDataObj);
            }
          
        }

        return defineObj;
    }

    nguiQuestionnaireActivity.directive('saQuestionnaireactivity', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguiQuestionnaireActivityFn]);
})
