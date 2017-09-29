/**
 * Author: liubin
 * Create Date: 2017-07-04
 * Description: report
 */

define([], function () {
    var reportController = {
        ServiceType: 'controller',
        ServiceName: 'ReportCtrl',
        ViewModelName: 'reportViewModel',
        ServiceContent: ['$scope', 'setDateConf','dayFilter', function ($scope, setDateConf,dayFilter) {
            var $model = $scope.$model;
            setDateConf.init($(".agree-date"), "day");
            //设置input的默认时间
            var stattime = dayFilter.yesterday("date");
            $(".date-wrap").find("input").val(stattime);
            var curTableIndex = '';
            var curWeekStr = '';
            var curSpeciftStr = '';
            //页面默认加载配置
            $scope.obj = {
                "statTime": stattime,
                "activityName": "盒-芙蓉王（硬细支）",
                "productSn": "",
            };
            $scope.saoobj = {
                "statTime": stattime,
                "activityName": "芙蓉王（硬细支）"
            };
            $scope.summar = {
                "statTime": stattime
            }
            //页面切换
            $scope.tabs = function (index) {
                $(".region-margin").hide();
                $(".region-margin").eq(index).show();
                // if (index === 1) {
                //     gloabl.getProduct();
                // } else if (index === 2) {
                //     gloabl.getProductNo();
                // } else if (index === 3) {
                //     gloabl.summaryData($scope.summar);
                // }
                switch(index){
                    case 1 : 
                        gloabl.getProduct();
                        break;
                    case 2 : 
                        gloabl.getProductNo();
                        break;
                    case 3 : 
                        gloabl.summaryData($scope.summar);
                        break;
                    case 4 : 
                        gloabl.getBrand();
                        gloabl.getWeeks(4);
                        gloabl.getPack(4);
                        gloabl.getTimes();
                        break;
                    case 5 : 
                        gloabl.getBrand();
                        curTableIndex = 5;
                        gloabl.getWeeks(5);
                        break;
                    case 6 : 
                        gloabl.getBrand();
                        curTableIndex = 6;
                        gloabl.getWeeks(6);
                        gloabl.getPack(6);
                        break;
                    case 7 : 
                        gloabl.getBrand();
                        curTableIndex = 7;
                        gloabl.getWeeks(7);
                        gloabl.getPack(7);
                        break;
                    default : 
                        
                }
            }
            var gloabl = {
                //中奖用户
                "winUser": function (params) {
                    $model.$winUser(params).then(function (res) {
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        gloabl.showall(res, "win_table", 11, "provinceName", "cityName");
                    })
                },
                //扫码用户
                "userPro": function (params) {
                    $model.$userPro(params).then(function (res) {
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        gloabl.showall(res, "user_table", 13, "province", "city");
                    })
                },
                //日报
                "summaryData": function (params) {
                    $model.$summaryData(params).then(function (res) {
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        for (var i = 0; i < res.length; i++) {
                            $("#summary_table").append("<tr class='bg' ><td>" + res[i].diaplayName + "</td><td>" + res[i].c1 + "</td><td>" + res[i].c2 + "</td><td>" + res[i].c3 + "</td><td>" + res[i].c4 + "</td><td>" + (res[i].c5*100).toFixed(2) + "%</td><td>" + res[i].c6 + "</td><td>" + res[i].c7 + "</td><td>" + res[i].c8 + "</td><td>" + res[i].c9 + "</td><td>" + res[i].c10 + "</td><td>" + res[i].c11 + "</td><td>" + res[i].c12 + "</td><td>" + res[i].c13 + "</td><td>" + res[i].c14 + "</td><td>" + res[i].c15 + "</td><td>" + res[i].c16 + "</td><td>" + res[i].c17 + "</td><td>" + res[i].c18 + "</td><td>" + res[i].c19 + "</td><td>" + res[i].c20 + "</td></tr>")
                        }
                    })
                },
                //扫码规格
                "getProductNo": function () {
                    $model.$getProductNo().then(function (res) {
                        $(".report-gui").find("select").html("");
                        var res = res.data || [];
                        for (var i = 0; i < res.length; i++) {
                            if(res[i].name ==="芙蓉王（硬细支）"){
                                $(".report-gui").find("select").append("<option value=" + res[i].name + " selected>" + res[i].name + "</option>")
                            }else {
                                $(".report-gui").find("select").append("<option value=" + res[i].name + ">" + res[i].name + "</option>")
                            }
                        }
                        $scope.saoobj.activityName = $(".report-gui").find("select").val();
                        //console.log($scope.saoobj);
                        gloabl.userPro($scope.saoobj);
                    })
                },
                //中奖规格
                "getProduct": function () {
                    $model.$getProduct().then(function (res) {
                        $(".report-gui").find("select").html("");
                        var res = res.data || [];
                        for (var i = 0; i < res.length; i++) {
                            if(res[i].name ==="盒-芙蓉王（硬细支）"){
                                $(".report-gui").find("select").append("<option value=" + res[i].name + " data-sn=" + res[i].sn + " selected>" + res[i].name + "</option>")
                            }else{
                                $(".report-gui").find("select").append("<option value=" + res[i].name + " data-sn=" + res[i].sn + ">" + res[i].name + "</option>")
                            }
                        }
                        $scope.obj.activityName = $(".report-gui").find("select").val();
                        $scope.obj.productSn = $(".report-gui").find("select option:selected").attr("data-sn");
                        //console.log($scope.obj);
                        gloabl.winUser($scope.obj);
                    })
                },
                //显示所有数据 n 几列  p 省份  y 城市
                "showall": function (data, id, n, p, y) {
                    //分类身份
                    var list = _.groupBy(data, p);
                    // console.log(list);
                    //初始化表单行数，从0开始
                    var rownum = 0;
                    for (x in list) {
                        // console.log(list[x]);
                        var rowspan = list[x].length;
                        for (var i = 0; i < rowspan; i++) {
                            var tmpRow = document.getElementById(id).insertRow(rownum);
                            tmpRow.className = "bg";
                            //为每行设置不重复的ID，为了插入cell定位使用
                            tmpRow.id = "rowid" + rownum;
                            rownum = rownum + 1;
                        }
                        var rownumfirst = rownum - rowspan;
                        var tmprow = document.getElementById("rowid" + rownumfirst).insertCell(0);
                        tmprow.innerHTML = x;
                        tmprow.rowSpan = rowspan;
                        tmprow.className = "report-provice";
                        gloabl.createtable(list[x], rownumfirst, n, y);
                    }
                },
                //创建表格
                "createtable": function (data, n, x, y) {
                    for (var i = 0; i < data.length; i++) {
                        var rownum = parseInt(n) + i;
                        var cityName = data[i][y];
                        if (i == 0) {
                            var tmpcell = document.getElementById("rowid" + rownum).insertCell(1);
                        } else {
                            var tmpcell = document.getElementById("rowid" + rownum).insertCell(0);
                        }
                        ;
                        tmpcell.innerHTML = cityName;
                        for (var j = 1; j < x; j++) {
                            var a = 'c' + j;
                            if (i == 0) {
                                var tmpcell = document.getElementById("rowid" + rownum).insertCell(j + 1);
                            } else {
                                var tmpcell = document.getElementById("rowid" + rownum).insertCell(j);
                            }
                            ;
                            tmpcell.innerHTML = data[i][a];
                        }
                        ;
                    }
                },
                "getWeeks":  function (num) {
                    $model.$getWeeksData().then(function (res) {
                        // var res = res.data || [];
                        $scope.weeksList = res.data || [];
                        $scope.$apply();
                        var startTimeObj = {
                            statTime : $scope.weeksList[0].weekId
                        }
                        switch(num){
                            case 4:
                                $("select#weeks").multiselect({
                                    nonSelectedText: '请选择',
                                    allSelectedText: '全部',
                                    nSelectedText: '已选择',
                                    selectAll:true,
                                    selectAllText: '全部',
                                    selectAllValue: 'all',
                                    buttonWidth: '180px'
                                });
                                // $('#weeks').val($scope.weeksList[0].weekId);
                                $('#weeks').multiselect().val($scope.weeksList[0].weekId).multiselect("refresh");
                                $model.$getBrandData().then(function (res) {
                                    var brandList = res.data || [];
                                    if(brandList.length > 0){
                                        var fristBrandName = brandList[0].name;
                                        $model.$getSpecifData({productBrand:fristBrandName}).then(function(res){
                                            var speciftList = res.data || [];
                                            if(speciftList.length > 0){
                                                var firstSpeciftSn = speciftList[0].name;
                                                startTimeObj.productSn = firstSpeciftSn;
                                            }

                                            $model.$getPackAndTimeData({"pageName":"report"}).then(function (res) {
                                                var packsList = res.data || [];
                                                if(packsList.length > 0){
                                                    var packStrArr = [];
                                                    for(var i=0;i<packsList.length;i++){
                                                        packStrArr.push(packsList[i].tagId);
                                                    }
                                                    $('#packs').multiselect().val(packStrArr).multiselect("refresh");
                                                    var packArr = packStrArr.join(',');
                                                    startTimeObj.unit = packArr;
                                                }

                                                 $model.$getPackAndTimeData({"pageName":"packtype"}).then(function (res) {
                                                    var statisTimeList = res.data || [];
                                                    if(statisTimeList.length > 0){
                                                        var statisTimeArr = [];
                                                        for(var i=0;i<statisTimeList.length;i++){
                                                            statisTimeArr.push(statisTimeList[i].tagName);
                                                        }
                                                        $('#cycleTime').multiselect().val(statisTimeArr).multiselect("refresh");
                                                        var statisTimeStr = statisTimeArr.join(',');
                                                        startTimeObj.cycle = statisTimeStr;
                                                    }                                                    
                                                    if(startTimeObj.statTime != null && startTimeObj.statTime != undefined){
                                                        gloabl.getWeekScanWinData(startTimeObj);
                                                    }
                                                })          
                                            })  
                                        });
                                    }
                                })
                                // if(startTimeObj.statTime != null && startTimeObj.statTime != undefined){
                                //     gloabl.getWeekScanWinData(startTimeObj);
                                // }
                                break;
                            case 5:
                                curWeekStr = $scope.weeksList[0].weekNo;
                                $model.$getBrandData().then(function (res) {
                                    var brandList = res.data || [];
                                    if(brandList.length > 0){
                                        var fristBrandName = brandList[0].name;
                                        $model.$getSpecifData({productBrand:fristBrandName}).then(function(res){
                                            var speciftList = res.data || [];
                                            if(speciftList.length > 0){
                                                var firstSpeciftSn = speciftList[0].name;
                                                startTimeObj.productSn = firstSpeciftSn;
                                            }
                                            
                                            if(startTimeObj.statTime != null && startTimeObj.statTime != undefined){
                                                gloabl.getProvData(startTimeObj);
                                            }
                                        });
                                    }
                                })
                                break;
                            case 6:
                                $model.$getBrandData().then(function (res) {
                                    var brandList = res.data || [];
                                    if(brandList.length > 0){
                                        var fristBrandName = brandList[0].name;
                                        $model.$getSpecifData({productBrand:fristBrandName}).then(function(res){
                                            var speciftList = res.data || [];
                                            if(speciftList.length > 0){
                                                startTimeObj.productSn = speciftList[0].name;
                                            }
                                            $model.$getPackAndTimeData({"pageName":"report"}).then(function (res) {
                                                var packsList = res.data || [];
                                                if(packsList.length > 0){
                                                    startTimeObj.unit = packsList[0].tagId;
                                                }
                                                if(startTimeObj.statTime != null && startTimeObj.statTime != undefined){
                                                    gloabl.getWeekCashWinData(startTimeObj);
                                                }               
                                            })
                                            
                                        });
                                    }
                                })
                                // if(startTimeObj.statTime != null && startTimeObj.statTime != undefined){
                                //     gloabl.getWeekCashWinData(startTimeObj);
                                // }
                                break;
                            case 7:
                                $model.$getBrandData().then(function (res) {
                                    var brandList = res.data || [];
                                    if(brandList.length > 0){
                                        var fristBrandName = brandList[0].name;
                                        $model.$getSpecifData({productBrand:fristBrandName}).then(function(res){
                                            var speciftList = res.data || [];
                                            if(speciftList.length > 0){
                                                startTimeObj.productSn = speciftList[0].name;
                                            }
                                            $model.$getPackAndTimeData({"pageName":"report"}).then(function (res) {
                                                var packsList = res.data || [];
                                                if(packsList.length > 0){
                                                    startTimeObj.unit = packsList[0].tagId;
                                                }
                                                if(startTimeObj.statTime != null && startTimeObj.statTime != undefined){
                                                    gloabl.getWeekEntityWinData(startTimeObj);
                                                }               
                                            })
                                        });
                                    }
                                })
                                // if(startTimeObj.statTime != null && startTimeObj.statTime != undefined){
                                //     gloabl.getWeekEntityWinData(startTimeObj);
                                // }
                                break;
                            default:
                        }                 
                
                    })
                },
                "getBrand":  function () {
                    $model.$getBrandData().then(function (res) {
                        $scope.brandList = res.data || [];
                        $scope.$apply();  
                        var curBrandName = $scope.brandList[0].name;
                        
                        $model.$getSpecifData({productBrand:curBrandName}).then(function(res){
                            $scope.speciftList = res.data || [];
                            $scope.$apply();
                            if($scope.speciftList.length > 0){
                                curSpeciftStr = $scope.speciftList[0].name
                            }
                        });
                        
                    })
                },
                "getPack":  function (typeNum) {
                    $model.$getPackAndTimeData({"pageName":"report"}).then(function (res) {
                        $scope.packsList = res.data || [];
                        $scope.$apply(); 
                        if(typeNum == 4){
                            $("select#packs").multiselect({
                                nonSelectedText: '请选择',
                                allSelectedText: '全部',
                                nSelectedText: '已选择',
                                selectAll:true,
                                selectAllText: '全部',
                                selectAllValue: 'all',
                                buttonWidth: '180px'
                            }); 
                        }
                                     
                    })
                },
                "getTimes":  function () {
                    $model.$getPackAndTimeData({"pageName":"packtype"}).then(function (res) {
                        $scope.statisTimeList = res.data || [];
                        $scope.$apply();
                        $("select#cycleTime").multiselect({
                            nonSelectedText: '请选择',
                            allSelectedText: '全部',
                            nSelectedText: '已选择',
                            selectAll:true,
                            selectAllText: '全部',
                            selectAllValue: 'all',
                            buttonWidth: '180px'
                        });                      
                        
                    })
                },
                'getWeekScanWinData' : function(timesObj){
                    $model.$getWeekScanWinData(timesObj).then(function (res) {
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        if(res.length > 0){
                            for (var i = 0; i < res.length; i++) {
                                $("#weekScanWin").append("<tr><td>" + res[i].statTime + "</td><td>" + res[i].name + "</td><td>" + res[i].unit + "</td><td>" + res[i].cycle + "</td><td>" + res[i].scanCode + "</td><td>" + res[i].scanPv + "</td><td>" + formatNum(res[i].redNum) + "</td><td>" + formatNum(res[i].realNum) + "</td><td>" + formatNum(res[i].redValue) + "</td></tr>");
                            }
                        }else{
                            $("#weekScanWin").append("<tr><td colspan='9'>暂无符合条件的数据</td></tr>");
                        }
                        
                    })
                },
                'getWeekCashWinData' : function(timesObj){
                    $model.$getWeekCashWinData(timesObj).then(function (res) {
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        if(res.length > 0){
                            for (var i = 0; i < res.length; i++) {
                                $("#weekCashWin").append("<tr><td>扫码活动</td><td>" + res[i].name + "</td><td>" + res[i].unit + "</td><td>" + res[i].awardName + "</td><td>" + formatNum(res[i].price) + "</td><td>" + formatNum(res[i].cudreNum) + "</td><td>" + formatNum(res[i].lastdreNum) + "</td><td>" + formatNum(res[i].lratio) + "%</td><td>" + formatNum(res[i].totalNum) + "</td><td>" + formatNum(res[i].drawMoney) + "</td><td>" + formatNum(res[i].totalMoney )+ "</td></tr>");
                            }
                        }else{
                            $("#weekCashWin").append("<tr><td colspan='11'>暂无符合条件的数据</td></tr>");
                        }
                        
                    })
                },
                'getWeekEntityWinData' : function(timesObj){
                    $model.$getWeekEntityWinData(timesObj).then(function (res) {
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        if(res.length > 0){
                            for (var i = 0; i < res.length; i++) {
                                $("#weekEntityWin").append("<tr><td>扫码活动</td><td>" + res[i].name + "</td><td>" + res[i].unit + "</td><td>" + formatNum(res[i].awardName) + "</td><td>" + formatNum(res[i].cudreNum) + "</td><td>" + formatNum(res[i].lastdreNum) + "</td><td>" + formatNum(res[i].lratio) + "%</td><td>" + formatNum(res[i].totalNum) + "</td></tr>");
                            }
                        }else{
                            $("#weekEntityWin").append("<tr><td colspan='8'>暂无符合条件的数据</td></tr>");
                        }
                        
                    })
                },
                'getProvData' : function(timesObj){
                    $model.$getProvData(timesObj).then(function (res) {
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        //表标题显示
                        $('#provDataTitle').html(curSpeciftStr +'扫码数据汇总('+ curWeekStr + ')');
                        if(res.length > 0){
                            for (var i = 0; i < res.length; i++) {
                                var curNum = i+1;
                                $("#provDataDetail").append("<tr><td>"+ formatNum(curNum) +"</td><td>" + formatNum(res[i].province) + "</td><td>" + formatNum(res[i].scanPv) + "</td><td>" + formatNum(res[i].scanUv) + "</td><td>" + formatNum(res[i].scanCode) + "</td><td>" + formatNum(res[i].totalScanPv) + "</td><td>" + formatNum(res[i].totalScanUv) + "</td><td>" + formatNum(res[i].totalScanCode) + "</td><td>" + formatNum(res[i].heprovince) + "</td><td>" + formatNum(res[i].heScanPv) + "</td><td>" + formatNum(res[i].heScanUv) + "</td><td>" + formatNum(res[i].heScanCode) + "</td><td>" + formatNum(res[i].heTotalScanPv) + "</td><td>" + formatNum(res[i].heTotalScanUv) + "</td><td>" + formatNum(res[i].heTotalScanCode) + "</td></tr>");
                            }
                        }else{
                            $("#provDataDetail").append("<tr><td colspan='15'>暂无符合条件的数据</td></tr>");
                        }
                    })
                }
            }
            //点击按钮的返回
            $scope.goback = function () {
                $(".region-margin").hide();
                $(".region-margin").eq(0).show();
                $('#weeks').multiselect().val([]).multiselect("refresh");
                $('#brand').val('');
                $('#specift').val('');
                if($scope.speciftList != undefined && $scope.speciftList.length > 0){
                    $scope.speciftList.length = 0;
                }
                $('#packs').multiselect().val([]).multiselect("refresh");
                $('#cycleTime').multiselect().val([]).multiselect("refresh");
                $('#cashWinSpecift').val('');
                $('#entityWinSpecift').val('');
            }

            //查询按钮
            $scope.search = function ($event) {
                var that = $event.target;
                // if (arguments[1] === 1) {
                //     $scope.obj = {
                //         "activityName": $(that).siblings(".report-gui").find("select").val(),
                //         "statTime": $(that).siblings(".agree-date").find(".date-wrap").data().date ?
                //             $(that).siblings(".agree-date").find(".date-wrap").data().date : $(that).siblings(".agree-date").find("input").val(),
                //         "productSn": $(that).siblings(".report-gui").find("select option:selected").attr("data-sn")
                //     }
                //     //console.log($scope.obj);
                //     gloabl.winUser($scope.obj);
                // } else if (arguments[1] === 2) {
                //     $scope.saoobj = {
                //         "activityName": $(that).siblings(".report-gui").find("select").val(),
                //         "statTime": $(that).siblings(".agree-date").find(".date-wrap").data().date ?
                //             $(that).siblings(".agree-date").find(".date-wrap").data().date : $(that).siblings(".agree-date").find("input").val(),
                //     }
                //     gloabl.userPro($scope.saoobj);
                // } else if (arguments[1] === 3) {
                //     $scope.summar = {
                //         "statTime": $(that).siblings(".agree-date").find(".date-wrap").data().date ?
                //             $(that).siblings(".agree-date").find(".date-wrap").data().date : $(that).siblings(".agree-date").find("input").val(),
                //     }
                //     gloabl.summaryData($scope.summar)
                // }
                switch(arguments[1]){
                    case 1:
                        $scope.obj = {
                            "activityName": $(that).siblings(".report-gui").find("select").val(),
                            "statTime": $(that).siblings(".agree-date").find(".date-wrap").data().date ?
                                $(that).siblings(".agree-date").find(".date-wrap").data().date : $(that).siblings(".agree-date").find("input").val(),
                            "productSn": $(that).siblings(".report-gui").find("select option:selected").attr("data-sn")
                        }
                        gloabl.winUser($scope.obj);
                        break;
                    case 2:
                        $scope.saoobj = {
                            "activityName": $(that).siblings(".report-gui").find("select").val(),
                            "statTime": $(that).siblings(".agree-date").find(".date-wrap").data().date ?
                                $(that).siblings(".agree-date").find(".date-wrap").data().date : $(that).siblings(".agree-date").find("input").val(),
                        }
                        gloabl.userPro($scope.saoobj);
                        break;
                    case 3:
                        $scope.summar = {
                            "statTime": $(that).siblings(".agree-date").find(".date-wrap").data().date ?
                            $(that).siblings(".agree-date").find(".date-wrap").data().date : $(that).siblings(".agree-date").find("input").val(),
                        }
                        gloabl.summaryData($scope.summar);
                        break;
                    case 4:
                        var weekArr = $('#weeks').val();
                        var weekStr = weekArr.join(',');
                        var packArr = $('#packs').val();
                        var packStr = '请选择包装';
                        if(packArr.length > 0){
                            packStr = packArr.join(',');
                        }
                        
                        var cycleTimeArr = $('#cycleTime').val();
                        var cycleTimeStr = '请选择统计周期';
                        if(cycleTimeArr.length > 0){
                            cycleTimeStr = cycleTimeArr.join(',');
                        }
                        
                        var winDataObj = {
                            'statTime' : weekStr,
                            'productSn' : $('#specift').val(),
                            'unit' : packStr,
                            'cycle' : cycleTimeStr
                        }
                        
                        gloabl.getWeekScanWinData(winDataObj);
                        break;
                    case 5:
                        var provWeekObj = $('#proviceDataWeeks');
                        if(provWeekObj.val() != ''){
                            curWeekStr = provWeekObj.find("option:selected").text();
                        }
                        var provSpeciftObj = $('#proviceDataSpecift');
                        if(provSpeciftObj.val() != ''){
                            curSpeciftStr = provSpeciftObj.find("option:selected").text();
                        }
                        
                        var cashWinDataObj = {
                            'statTime' : $('#proviceDataWeeks').val(),
                            'productSn' : $('#proviceDataSpecift').val()
                        }
                        gloabl.getProvData(cashWinDataObj);
                        break;
                    case 6:
                        var cashWinDataObj = {
                            'statTime' : $('#cashWinWeeks').val(),
                            'productSn' : $('#cashWinSpecift').val(),
                            'unit' : $('#cashWinPacks').val()
                        }
                        gloabl.getWeekCashWinData(cashWinDataObj);
                        break;
                    case 7:
                        var entityWinDataObj = {
                            'statTime' : $('#entityWinWeeks').val(),
                            'productSn' : $('#entityWinSpecift').val(),
                            'unit' : $('#entityWinPacks').val()
                        }
                        gloabl.getWeekEntityWinData(entityWinDataObj);
                        break;
                    default :
                }
            }
            //转化undefined为0
            function formatNum(formarStr){
                if(formarStr == undefined){
                    return 0;
                }
                return formarStr;
            }
            //下载
            $scope.down = function (a) {
                // var pathName=window.document.location.pathname;
                // var ctxName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
                if (a === 1) {
                    var data = {
                        "statTime":$scope.obj.statTime,
                        "activityName":$scope.obj.activityName,
                        "productSn":$scope.obj.productSn
                    }
                    var url ="/fixatreport/importExcelWinUseProvData";
                    // var statTime = $scope.obj.statTime;
                    // var activityName = $scope.obj.activityName;
                    // var productSn = $scope.obj.productSn;
                    // window.location.href = '/fixatreport/importExcelWinUseProvData?staTime=' + statTime + '&activityName=' + encodeURI(encodeURI(activityName)) + '&productSn=' + productSn;
                } else if (a === 2) {
                    var data = {
                        "statTime":$scope.saoobj.statTime,
                        "activityName":$scope.saoobj.activityName
                    }
                    var url ="/fixatreport/importExcelScanUseProvData";
                    // var statTime = $scope.saoobj.statTime;
                    // var activityName = $scope.saoobj.activityName;
                    // window.location.href = '/fixatreport/importExcelScanUseProvData?staTime=' + statTime + '&activityName=' + encodeURI(encodeURI(activityName))
                } else if (a === 3) {
                    var data = {
                        "statTime":$scope.summar.statTime
                    }
                    var url ="/fixatreport/importExcelDailySummData";                    
                    // var statTime = $scope.summar.statTime;
                    // window.location.href = '/fixatreport/importExcelDailySummData?staTime=' + statTime
                } else if (a === 4){
                    var weekArr = $('#weeks').val();
                    var weekStr = weekArr.join(',');
                    var packArr = $('#packs').val();
                    var packStr = packArr.join(',');
                    var cycleTimeArr = $('#cycleTime').val();
                    var cycleTimeStr = cycleTimeArr.join(',');
                    var data = {
                        'statTime' : weekStr,
                        'productSn' : $('#specift').val(),
                        'unit' : packStr,
                        'cycle' : cycleTimeStr
                    }
                    var url = "/api/tztx/dataportal/fixatreport/impExcelWeekScanWinData";
                }else if(a === 5){
                    var data = {
                        'statTime' : $('#proviceDataWeeks').val(),
                        'productSn' : $('#proviceDataSpecift').val()
                    }
                    if(curSpeciftStr != '' && curWeekStr != ''){
                        // console.log(curSpeciftStr + ':' + curWeekStr);
                        data.tableTitle = curSpeciftStr +'扫码数据汇总('+ curWeekStr + ')';
                    }
                    var url = "/api/tztx/dataportal/fixatreport/impExcelWeekScanProvData";
                }else if(a === 6){
                    var data = {
                        'statTime' : $('#cashWinWeeks').val(),
                        'productSn' : $('#cashWinSpecift').val(),
                        'unit' : $('#cashWinPacks').val()
                    }
                    var url = "/api/tztx/dataportal/fixatreport/impExcelWeekCashBonusData";
                }else if(a === 7){
                    var data = {
                        'statTime' : $('#entityWinWeeks').val(),
                        'productSn' : $('#entityWinSpecift').val(),
                        'unit' : $('#entityWinPacks').val()
                    }
                    var url = "/api/tztx/dataportal/fixatreport/impExcelWeekEntityWinData";
                }
                var xhr = new XMLHttpRequest();
                var formData = new FormData();
                for(var attr in data) {
                    formData.append(attr, data[attr]);
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
            //监听品牌变化
            $('#brand').change(function(){
                var curBrandValue = $(this).val();
                $model.$getSpecifData({productBrand:curBrandValue}).then(function(res){
                    $scope.speciftList = res.data || [];
                    $scope.$apply();
                });
            });
            $('#cashWinBrand').change(function(){
                var curBrandValue = $(this).val();
                $model.$getSpecifData({productBrand:curBrandValue}).then(function(res){
                    $scope.speciftList = res.data || [];
                    $scope.$apply();
                });
            });
            $('#entityWinBrand').change(function(){
                var curBrandValue = $(this).val();
                $model.$getSpecifData({productBrand:curBrandValue}).then(function(res){
                    $scope.speciftList = res.data || [];
                    $scope.$apply();
                });
            });
            $('#proviceDataBrand').change(function(){
                var curBrandValue = $(this).val();
                $model.$getSpecifData({productBrand:curBrandValue}).then(function(res){
                    $scope.speciftList = res.data || [];
                    $scope.$apply();
                });
            });
        }]
    };

    return reportController;
});