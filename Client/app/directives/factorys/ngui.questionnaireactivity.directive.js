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
                var allconfigtemplateScope = angular.element('.pop').scope();
                scope.pageName = allconfigtemplateScope.pageName;
            }, true);

            var questionnaireData = {};

            //品牌
            // scope.parentForm = angular.element('#createQuestionnaire').scope();

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
                // alert(111);
                var that_scope = angular.element('.select-brand').scope();
                if (that_scope.selectSpecificationVal != '') {
                    $(e.target).next().trigger('click');
                    var data = {
                        metraType: 'redpack',
                        // supplierCode: that_scope.selectCompanyVal,
                        brandCodes: that_scope.selectBrandVal,//
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
                console.log(typeof $(this)[0].checked);
                var isChoosePacket = $(this)[0].checked;
                if(isChoosePacket){
                    console.log(111);
                    $('#selectPacketBox').removeClass('hide');
                }else{
                    $('#selectPacketBox').addClass('hide');
                }
            })

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
                    questionnaireData.name = quesName;
                }
                //选择品牌
                var that_scope = angular.element('.select-brand').scope();
                
                var selectBrand = that_scope.selectBrandVal;
                if(selectBrand == ''){
                    $('#brandWarn').show();
                    return;
                }else{
                    $('#brandWarn').hide();
                    questionnaireData.brands = [];
                    questionnaireData.brands.push(selectBrand);
                }
                //选择规格
                var selectspecif = that_scope.selectSpecificationVal;
                if(selectspecif == ''){
                    $('#specifWarn').show();
                    return;
                }else{
                    $('#specifWarn').hide();
                    questionnaireData.sns = [];
                    questionnaireData.sns.push(selectspecif);
                }
                //选择地区
                var area_scope = angular.element('.select-area').scope();
                var areaArr = area_scope.selectAreaVal;
                console.log('地区');
                console.log(areaArr);
                if(areaArr.length == 0){
                    $('#areaWarn').show();
                    return;
                }else{
                    questionnaireData.areaCodes = areaArr;
                }





                console.log(questionnaireData);
            }

            //添加题目
            scope.addQuestion = function(index){
                var movie_box = '<div class="movie_box" style="border: 1px solid rgb(255, 255, 255);"></div>';
                var Grade = $(".yd_box").find(".movie_box").length + 1;
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


                //鼠标移上去显示按钮
                $(".movie_box").hover(function() {
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

                 //下移
                $(".movie_box").on("click",".xy", function() {
                    //文字的长度 
                    var leng = $(".yd_box").children(".movie_box").length;
                    var dqgs = $(this).parent(".kzqy_czbut").parent(".movie_box").index();

                    if(dqgs < leng - 1) {
                        var czxx = $(this).parent(".kzqy_czbut").parent(".movie_box");
                        var xyghtml = czxx.next().html();
                        var syghtml = czxx.html();
                        czxx.next().html(syghtml);
                        czxx.html(xyghtml);
                        //序号
                        czxx.children(".wjdc_list").find(".nmb").text(dqgs + 1);
                        czxx.next().children(".wjdc_list").find(".nmb").text(dqgs + 2);
                    } else {
                        alert("到底了");
                    }
                });

                //上移
                $(".movie_box").on("click",".sy", function() {
                    //文字的长度 
                    var leng = $(".yd_box").children(".movie_box").length;
                    var dqgs = $(this).parent(".kzqy_czbut").parent(".movie_box").index();
                    if(dqgs > 0) {
                        var czxx = $(this).parent(".kzqy_czbut").parent(".movie_box");
                        var xyghtml = czxx.prev().html();
                        var syghtml = czxx.html();
                        czxx.prev().html(syghtml);
                        czxx.html(xyghtml);
                        //序号
                        czxx.children(".wjdc_list").find(".nmb").text(dqgs + 1);
                        czxx.prev().children(".wjdc_list").find(".nmb").text(dqgs);

                    } else {
                        alert("到头了");
                    }
                });

                //删除
                $(".movie_box").on("click",".del", function() {
                    var czxx = $(this).parent(".kzqy_czbut").parent(".movie_box");
                    var zgtitle_gs = czxx.parent(".yd_box").find(".movie_box").length;
                    var xh_num = 1;
                    //重新编号
                    czxx.parent(".yd_box").find(".movie_box").each(function() {
                        $(".yd_box").children(".movie_box").eq(xh_num).find(".nmb").text(xh_num);
                        xh_num++;
                        //alert(xh_num);
                    });
                    czxx.remove();
                });

                //编辑
                $(".movie_box").on("click", ".bianji", function() {
                    //编辑的时候禁止其他操作   
                    $(this).siblings().hide();
                    //$(this).parent(".kzqy_czbut").parent(".movie_box").unbind("hover"); 
                    var dxtm = $(".dxuan").html();
                    var duoxtm = $(".duoxuan").html();
                    var tktm = $(".tktm").html();
                    
                    //接受编辑内容的容器
                    var dx_rq = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".dx_box");
                    var title = dx_rq.attr("data-t");
                    //alert(title);
                    //题目选项的个数
                    var timlrxm = $(this).parent(".kzqy_czbut").parent(".movie_box").children(".wjdc_list").children("li").length;

                    //单选题目
                    if(title == 0) {
                        dx_rq.show().html(dxtm);
                        //模具题目选项的个数
                        var bjxm_length = dx_rq.find(".title_itram").children(".kzjxx_iteam").length;
                        // console.log(bjxm_length);
                        var dxtxx_html = dx_rq.find(".title_itram").children(".kzjxx_iteam").html();
                        //添加选项题目
                        for(var i_tmxx = bjxm_length; i_tmxx < timlrxm - 1; i_tmxx++) {
                            dx_rq.find(".title_itram").append("<div class='kzjxx_iteam'>" + dxtxx_html + "</div>");
                        }
                        //赋值文本框 
                        //题目标题
                        var texte_bt_val = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".tm_btitlt").children(".btwenzi").text();
                        // console.log(texte_bt_val);
                        dx_rq.find(".btwen_text").val(texte_bt_val);
                        //标题描述
                        var texte_ms_val = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".tm_breif").text();
                        // console.log(texte_ms_val);
                        dx_rq.find(".btwen_brief").val(texte_ms_val);
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
                            //alert(i_tmxx);
                        }
                        //赋值文本框 
                        //题目标题
                        var texte_bt_val = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".tm_btitlt").children(".btwenzi").text();
                        dx_rq.find(".btwen_text").val(texte_bt_val);
                        //标题描述
                        var texte_ms_val = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".tm_breif").text();
                        // console.log(texte_ms_val);
                        dx_rq.find(".btwen_brief").val(texte_ms_val);
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
                        // console.log('填空开始啦啦啦');
                        // console.log(tktm);
                        dx_rq.show().html(tktm);
                        //赋值文本框 
                        //题目标题
                        var texte_bt_val = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".tm_btitlt").children(".btwenzi").text();
                        dx_rq.find(".btwen_text").val(texte_bt_val);
                        //标题描述
                        var texte_ms_val = $(this).parent(".kzqy_czbut").parent(".movie_box").find(".wjdc_list").children("li").eq(0).find(".tm_breif").text();
                        // console.log(texte_ms_val);
                        dx_rq.find(".btwen_brief").val(texte_ms_val);
                    }
                    
                });
                
                //改变至多选多少项的option
                function optionChangeNum(){
                    //多选题增加至多选项
                    var optionObj = $("#mostOption");
                    var optionLen = optionObj.parent().parent().find('.title_itram').children('div').length;
                    // console.log("show："+optionLen);
                    
                    var selectChildLen = optionObj.children('option').length - 1;
                    // console.log("option："+selectChildLen);
                    if(selectChildLen != optionLen){
                        optionObj.empty();
                        optionObj.append('<option value="0">请选择</option>');
                        for(var i=1;i<=optionLen;i++){
                            optionObj.append('<option value="'+i+'">'+i+'</option>');
                        }
                    }
                }

                //增加选项  
                $(".movie_box").on("click",".zjxx", function() {
                    var zjxx_html = $(this).prev(".title_itram").children(".kzjxx_iteam").html();
                    $(this).prev(".title_itram").append("<div class='kzjxx_iteam'>" + zjxx_html + "</div>"); 
                    // optionChangeNum();
                });

                //删除一行 
                $(".movie_box").on("click",".del_xm", function() {
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
                $(".movie_box").on("click",".dx_box .qxbj_but", function() {
                    $(this).parent(".bjqxwc_box").parent(".dx_box").empty().hide();
                    $(".movie_box").css({
                        "border": "1px solid #fff"
                    });
                    $(".kzqy_czbut").remove();
                    //            
                });

                //完成编辑（编辑）
                $(".movie_box").on("click",".swcbj_but", function() {

                    var jcxxxx = $(this).parent(".bjqxwc_box").parent(".dx_box"); //编辑题目区
                    var querstionType = jcxxxx.attr("data-t"); //获取题目类型

                    switch(querstionType) {
                        case "0": //单选
                        case "1": //多选	
                            //编辑题目选项的个数
                            var bjtm_xm_length = jcxxxx.find(".title_itram").children(".kzjxx_iteam").length; //编辑选项的 选项个数
                            var xmtit_length = jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").length - 1; //题目选择的个数

                            //赋值文本框 
                            //题目标题
                            var texte_bt_val_bj = jcxxxx.find(".btwen_text").val(); //获取问题题目
                            // console.log(texte_bt_val_bj);
                            jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").eq(0).find(".tm_btitlt").children(".btwenzi").text(texte_bt_val_bj); //将修改过的问题题目展示
                            //题目描述btwen_brief
                            var texte_ms_val_bj = jcxxxx.find(".btwen_brief").val(); //获取问题描述
                            // console.log('问题描述：'+texte_ms_val_bj);
                            jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").eq(0).find(".tm_breif").text(texte_ms_val_bj);

                            //删除选项
                            for(var toljs = xmtit_length; toljs > 0; toljs--) {
                                jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").eq(toljs).remove();
                            }
                            //遍历题目项目的文字
                            var bjjs_bj = 0;
                            jcxxxx.children(".title_itram").children(".kzjxx_iteam").each(function() {
                                // console.log(111111);
                                // console.log($(this));
                                //题目选项
                                var texte_val_bj = $(this).find(".input_wenbk").val(); //获取填写信息
                                // console.log(22222);
                                // console.log(texte_val_bj);
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
                                    //alert(jsxz);
                                    jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").eq(jsxz + 1).find("span").after("<input name='' type='text' class='wenb_input'>");
                                }
                            });

                            break;
                        case "2":
                            var texte_bt_val_bj = jcxxxx.find(".btwen_text").val(); //获取问题题目
                            jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").eq(0).find(".tm_btitlt").children(".btwenzi").text(texte_bt_val_bj); //将修改过的问题题目展示
                            //题目描述btwen_brief
                            var texte_tk_val_bj = jcxxxx.find(".btwen_brief").val(); //获取问题描述
                            // console.log('问题描述：'+texte_ms_val_bj);
                            jcxxxx.parent(".movie_box").children(".wjdc_list").children("li").eq(0).find(".tm_breif").text(texte_tk_val_bj);
                            break;
                    }
                    //清除     
                    $(this).parent(".bjqxwc_box").parent(".dx_box").empty().hide();
                });


            }

             
        }

        return defineObj;
    }

    nguiQuestionnaireActivity.directive('saQuestionnaireactivity', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguiQuestionnaireActivityFn]);
})
