/**
 * Author: liubin
 * Create Date: 2017-07-04
 * Description: report
 */

define([], function () {
    var reportController = {
        ServiceType: 'controller',
        ServiceName: 'hbReportCtrl',
        ViewModelName: 'hbReportViewModel',
        ServiceContent: ['$scope', 'setDateConf','dayFilter', function ($scope, setDateConf,dayFilter) {
            var $model = $scope.$model;
            setDateConf.init($(".agree-date"), "day");
            setDateConf.init($(".agree-month"), "month");
            //设置input的默认时间
            var stattime = dayFilter.yesterday("date");
            var amonth = (new Date().getMonth() + 1)<10 ? '0'+ (new Date().getMonth() + 1):(new Date().getMonth() + 1);
            var statmonth = new Date().getFullYear() + "-" + amonth;
            
            $(".date-wrap").find("input").val(stattime);
            $(".month-wrap").find("input").val(statmonth);
            var curTableIndex = '';
            var curWeekStr = '';
            var curSpeciftStr = '';
            
            
            $scope.weekScanData = {
                'statTime' : "",
                'productSn' : "",
                'productBrand': "",
                'staType': "week"
            }
            
            
            //页面切换
            $scope.tabs = function (index) {
                $(".region-margin").hide();
                $(".region-margin").eq(index).show();
                switch(index){
                    case 1 : 
                        gloabl.getBrand(1);
                        curTableIndex = 1;
                        gloabl.getWeeks(1);
                        break;
                    case 2 : 
                        gloabl.getBrand(2);
                        curTableIndex = 2;
                        gloabl.getWeeks(2);
                        break;
                    case 3 :
                        gloabl.getBrand(3);
                        break;
                    case 4 :
                        gloabl.getBrand(4);
                        break;
                    default :      
                }
            }
            var gloabl = {
                "getWeeks":  function (num) {
                    $model.$getWeeksData().then(function (res) {
                        // var res = res.data || [];
                        $scope.weeksList = res.data || [];
                        $scope.$apply();
                        var startTimeObj = {
                            statTime : $scope.weeksList[0].weekId
                        }
                        $scope.weekScanData.statTime = $scope.weeksList[0].weekId;
                        switch(num){
                            case 1:
                                //查询时间；
                                curWeekStr = $scope.weeksList[0].weekNo;
                                //console.log(curWeekStr);
                                $model.$getBrandData().then(function (res) {
                                    var brandList = res.data || [];
                                    //console.log(brandList);
                                    if(brandList.length > 0){
                                        var fristBrandName = "";
                                        $model.$getSpecifData({productBrand:fristBrandName}).then(function(res){
                                            var speciftList = res.data || [];
                                            //console.log(speciftList);
                                            if(speciftList.length > 0){
                                                
                                                startTimeObj.productSn = "";
                                                startTimeObj.productBrand = ""
                                                startTimeObj.staType = "week";
                                            }
                                            //console.log(startTimeObj);
                                            if(startTimeObj.statTime != null && startTimeObj.statTime != undefined){
                                                gloabl.getProvData(startTimeObj);
                                            }
                                        });
                                    }
                                })
                                break;

                            case 2: 
                                $model.$getBrandData().then(function (res) {
                                    //console.log(res);
                                    var brandList = res.data || [];
                                    if(brandList.length > 0){
                                        var fristBrandName = "";
                                        $model.$getSpecifData({productBrand:fristBrandName}).then(function(res){
                                            var speciftList = res.data || [];
                                            //console.log(speciftList);
                                            if(speciftList.length > 0){
                                                
                                                startTimeObj.productSn = "";
                                                startTimeObj.productBrand = ""
                                                startTimeObj.staType = "week";
                                            }
                                            console.log(startTimeObj);
                                            if(startTimeObj.statTime != null && startTimeObj.statTime != undefined){
                                                gloabl.getRedData(startTimeObj);
                                            }
                                        });
                                    }
                                })
                                break;
                            default:
                        }                 
                
                    })
                },
                "getBrand":  function (num) {
                    switch(num){
                        case 1 : 
                            $model.$getBrandData().then(function (res) {
                                $scope.brandList = res.data || [];
                                $scope.$apply();  
                                var curBrandName = "";
                                $("select#brands").multiselect({
                                    nonSelectedText: '请选择',
                                    allSelectedText: '全部',
                                    nSelectedText: '已选择',
                                    selectAll:true,
                                    selectAllText: '全部',
                                    selectAllValue: 'all',
                                    buttonWidth: '180px'
                                }); 
                                console.log($scope.brandList);
                                if($scope.brandList.length > 0) {
                                    var brandStrArr = [];
                                    for(var i=0; i<$scope.brandList.length; i++){
                                        brandStrArr.push($scope.brandList[i].productBrand);
                                    }
                                    $('#brands').multiselect().val(brandStrArr).multiselect("refresh");
                                }
                                // console.log($('#brands').multiselect().val("转世"));
                                
                                curBrandName = $('#brands').multiselect().val().toString();
                                console.log($('#brands').multiselect().val());
                                $model.$getSpecifData({productBrand: curBrandName}).then(function(res){
                                    $scope.speciftList = res.data || [];
                                    
                                    $scope.$apply();
                                    $("select#specifts").multiselect({
                                        nonSelectedText: '请选择',
                                        allSelectedText: '全部',
                                        nSelectedText: '已选择',
                                        selectAll:true,
                                        selectAllText: '全部',
                                        selectAllValue: 'all',
                                        buttonWidth: '180px'
                                    }); 
                                    // console.log($('#brands').multiselect().val("转世"));
                                    $('#specifts').multiselect().val($scope.speciftList[0].productName).multiselect("refresh");
                                    if($scope.speciftList.length > 0){
                                        var speciftStrArr = [];
                                        for(var i=0; i<$scope.speciftList.length; i++){
                                            speciftStrArr.push($scope.speciftList[i].productSn);
                                        }
                                        $('#specifts').multiselect().val(speciftStrArr).multiselect("refresh");
                                        curSpeciftStr = "全部";
                                    }
                                });
                                
                            })
                            break;
                        case 2 :
                            $model.$getBrandData().then(function (res) {
                                $scope.brandList = res.data || [];
                                $scope.$apply();  
                                var curBrandName = "";
                                $("select#redweekbrands").multiselect({
                                    nonSelectedText: '请选择',
                                    allSelectedText: '全部',
                                    nSelectedText: '已选择',
                                    selectAll:true,
                                    selectAllText: '全部',
                                    selectAllValue: 'all',
                                    buttonWidth: '180px'
                                }); 
                                if($scope.brandList.length > 0) {
                                    var brandStrArr = [];
                                    for(var i=0; i<$scope.brandList.length; i++){
                                        brandStrArr.push($scope.brandList[i].productBrand);
                                    }
                                    $('#redweekbrands').multiselect().val(brandStrArr).multiselect("refresh");
                                }
                                // console.log($('#brands').multiselect().val("转世"));
                                
                                curBrandName = $('#redweekbrands').multiselect().val().toString();
                                console.log($('#brands').multiselect().val());
                                $model.$getSpecifData({productBrand: curBrandName}).then(function(res){
                                    $scope.speciftList = res.data || [];
                                    
                                    $scope.$apply();
                                    $("select#redweekspecifts").multiselect({
                                        nonSelectedText: '请选择',
                                        allSelectedText: '全部',
                                        nSelectedText: '已选择',
                                        selectAll:true,
                                        selectAllText: '全部',
                                        selectAllValue: 'all',
                                        buttonWidth: '180px'
                                    }); 
                                    $('#redweekspecifts').multiselect().val($scope.speciftList[0].productName).multiselect("refresh");
                                    if($scope.speciftList.length > 0){
                                        var speciftStrArr = [];
                                        for(var i=0; i<$scope.speciftList.length; i++){
                                            speciftStrArr.push($scope.speciftList[i].productSn);
                                        }
                                        $('#redweekspecifts').multiselect().val(speciftStrArr).multiselect("refresh");
                                        curSpeciftStr = "全部";
                                    }
                                });
                                
                            })
                            break;
                        case 3 : 
                            $model.$getBrandData().then(function (res) {
                                $scope.brandList = res.data || [];
                                $scope.$apply();  
                                var curBrandName = "";
                                $("select#monthbrands").multiselect({
                                    nonSelectedText: '请选择',
                                    allSelectedText: '全部',
                                    nSelectedText: '已选择',
                                    selectAll:true,
                                    selectAllText: '全部',
                                    selectAllValue: 'all',
                                    buttonWidth: '180px'
                                }); 
                                if($scope.brandList.length > 0) {
                                    var brandStrArr = [];
                                    for(var i=0; i<$scope.brandList.length; i++){
                                        brandStrArr.push($scope.brandList[i].productBrand);
                                    }
                                    $('#monthbrands').multiselect().val(brandStrArr).multiselect("refresh");
                                }
                               
                                
                                curBrandName = $('#monthbrands').multiselect().val().toString();
                                $model.$getSpecifData({productBrand: curBrandName}).then(function(res){
                                    $scope.speciftList = res.data || [];
                                    
                                    $scope.$apply();
                                    $("select#monthspecifts").multiselect({
                                        nonSelectedText: '请选择',
                                        allSelectedText: '全部',
                                        nSelectedText: '已选择',
                                        selectAll:true,
                                        selectAllText: '全部',
                                        selectAllValue: 'all',
                                        buttonWidth: '180px'
                                    }); 
                                    // console.log($('#brands').multiselect().val("转世"));
                                    $('#monthspecifts').multiselect().val($scope.speciftList[0].productName).multiselect("refresh");
                                    if($scope.speciftList.length > 0){
                                        var speciftStrArr = [];
                                        for(var i=0; i<$scope.speciftList.length; i++){
                                            speciftStrArr.push($scope.speciftList[i].productSn);
                                        }
                                        $('#monthspecifts').multiselect().val(speciftStrArr).multiselect("refresh");
                                        curSpeciftStr = "全部";
                                        var scanDataObj = {
                                            'statTime' : $('#dataMonth').val()+"-01",
                                            'productSn' : $('#monthspecifts').multiselect().val().toString(),
                                            'productBrand': $('#monthbrands').multiselect().val().toString(),
                                            'staType': "month"
                                        }
                                        gloabl.getMonthScanWinData(scanDataObj);

                                    }
                                });
                                
                            })
                            break;
                        case 4 :
                            $model.$getBrandData().then(function (res) {
                                $scope.brandList = res.data || [];
                                $scope.$apply();  
                                var curBrandName = "";
                                $("select#redmonthbrands").multiselect({
                                    nonSelectedText: '请选择',
                                    allSelectedText: '全部',
                                    nSelectedText: '已选择',
                                    selectAll:true,
                                    selectAllText: '全部',
                                    selectAllValue: 'all',
                                    buttonWidth: '180px'
                                }); 
                                if($scope.brandList.length > 0) {
                                    var brandStrArr = [];
                                    for(var i=0; i<$scope.brandList.length; i++){
                                        brandStrArr.push($scope.brandList[i].productBrand);
                                    }
                                    $('#redmonthbrands').multiselect().val(brandStrArr).multiselect("refresh");
                                }
                                // console.log($('#brands').multiselect().val("转世"));
                                
                                curBrandName = $('#redmonthbrands').multiselect().val().toString();
                                $model.$getSpecifData({productBrand: curBrandName}).then(function(res){
                                    $scope.speciftList = res.data || [];
                                    
                                    $scope.$apply();
                                    $("select#redmonthspecifts").multiselect({
                                        nonSelectedText: '请选择',
                                        allSelectedText: '全部',
                                        nSelectedText: '已选择',
                                        selectAll:true,
                                        selectAllText: '全部',
                                        selectAllValue: 'all',
                                        buttonWidth: '180px'
                                    }); 
                                    // console.log($('#brands').multiselect().val("转世"));
                                    $('#redmonthspecifts').multiselect().val($scope.speciftList[0].productName).multiselect("refresh");
                                    if($scope.speciftList.length > 0){
                                        var speciftStrArr = [];
                                        for(var i=0; i<$scope.speciftList.length; i++){
                                            speciftStrArr.push($scope.speciftList[i].productSn);
                                        }
                                        $('#redmonthspecifts').multiselect().val(speciftStrArr).multiselect("refresh");
                                        curSpeciftStr = "全部";
                                        var redDataObj = {
                                            'statTime' : $('#redMonth').val()+"-01",
                                            'productSn' : $('#redmonthspecifts').multiselect().val().toString(),
                                            'productBrand': $('#redmonthbrands').multiselect().val().toString(),
                                            'staType': "month"
                                        }
                                        gloabl.getMonthRedWinData(redDataObj);

                                    }
                                });
                                
                            })
                            break;
                        default:
                    }
                },
                'getWeekScanWinData' : function(timesObj){
                    $model.$getWeekScanData(timesObj).then(function (res) {
                        console.log(res);
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        //表标题显示
                        //console.log($("#proviceDataSpecift").val())
                        $('#provDataTitle').html(curSpeciftStr +'扫码数据汇总('+ curWeekStr + ')');
                        if(res.length > 0){
                            for (var i = 0; i < res.length; i++) {
                                $("#weekScanWin").append("<tr><td>" + res[i].col0 + "</td><td>" + res[i].col1 + "</td><td>" + res[i].col2 + "</td><td>" + res[i].col3 + "</td><td>" + res[i].col4 + "</td><td>" + res[i].col5 + "</td><td>" + res[i].col6 + "</td><td>" + res[i].col7 + "</td><td>" + res[i].col8 + "</td><td>"+res[i].col9+"</td><td>"+res[i].col10+"</td><td>"+res[i].col11+"</td></tr>");
                            }
                        }else{
                            $("#weekScanWin").append("<tr><td colspan='12'>暂无符合条件的数据</td></tr>");
                        }
                        
                    })
                },
                //红包查询数据；
                'getWeekRedWinData' : function(timesObj) {
                    console.log(timesObj);
                    $model.$getWeekRedWinData(timesObj).then(function (res) {
                        console.log(res);
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        //表标题显示
                        //console.log($("#proviceDataSpecift").val())
                        $('#redWeekDataTitle').html('扫码活动红包投入数据周报('+ curWeekStr + ')');
                        if(res.length > 0){
                            for (var i = 0; i < res.length; i++) {
                                var curNum = i+1;
                                $("#redWeekDataDetail").append("<tr><td>" + res[i].col0 + "</td><td>" + res[i].col1 + "</td><td>" + res[i].col2 + "</td><td>" + res[i].col3 + "</td><td>" + res[i].col4 + "</td><td>" + res[i].col5 + "</td><td>" + res[i].col6 + "</td></tr>");
                            }
                        }else{
                            $("#redWeekDataDetail").append("<tr><td colspan='15'>暂无符合条件的数据</td></tr>");
                        }
                    })
                } ,
                //初始化数据；
                'getProvData' : function(timesObj){
                    console.log(timesObj);
                    $model.$getProvData(timesObj).then(function (res) {
                        console.log(res);
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        //表标题显示
                        //console.log($("#proviceDataSpecift").val())
                        $('#provDataTitle').html(curSpeciftStr +'扫码数据汇总('+ curWeekStr + ')');
                        if(res.length > 0){
                            for (var i = 0; i < res.length; i++) {
                                var curNum = i+1;
                                $("#weekScanWin").append("<tr><td>" + res[i].col0 + "</td><td>" + res[i].col1 + "</td><td>" + res[i].col2 + "</td><td>" + res[i].col3 + "</td><td>" + res[i].col4 + "</td><td>" + res[i].col5 + "</td><td>" + res[i].col6 + "</td><td>" + res[i].col7 + "</td><td>" + res[i].col8 + "</td><td>"+res[i].col9+"</td><td>"+res[i].col10+"</td><td>"+res[i].col11+"</td></tr>");
                            }
                        }else{
                            $("#weekScanWin").append("<tr><td colspan='15'>暂无符合条件的数据</td></tr>");
                        }
                    })
                },
                //初始化红包数据；
                'getRedData' : function(timesObj) {
                    console.log(timesObj);
                    $model.$getWeekRedWinData(timesObj).then(function (res) {
                        console.log(res);
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        //表标题显示
                        //console.log($("#proviceDataSpecift").val())
                        $('#redWeekDataTitle').html('扫码活动红包投入数据周报('+ curWeekStr + ')');
                        if(res.length > 0){
                            for (var i = 0; i < res.length; i++) {
                                var curNum = i+1;
                                $("#redWeekDataDetail").append("<tr><td>" + res[i].col0 + "</td><td>" + res[i].col1 + "</td><td>" + res[i].col2 + "</td><td>" + res[i].col3 + "</td><td>" + res[i].col4 + "</td><td>" + res[i].col5 + "</td><td>" + res[i].col6 + "</td></tr>");
                            }
                        }else{
                            $("#redWeekDataDetail").append("<tr><td colspan='15'>暂无符合条件的数据</td></tr>");
                        }
                    })
                },
                'getMonthScanWinData' : function (timesObj) {
                    $model.$getMonthScanData(timesObj).then(function (res) {
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        $('#monthScanDataTitle').html('扫码月报数据汇总('+$("#dataMonth").val()+')');
                        var str="";
                        if(res.length > 0){
                            console.log(111111);
                            console.log(res);
                            for (var i = 0; i < res.length; i++) {
                                
                                $("#monthScanWin").append("<tr><td>" + res[i].col0 + "</td><td>" + res[i].col1 + "</td><td>" + res[i].col2 + "</td><td>" + res[i].col3 + "</td><td>" + res[i].col4 + "</td><td>" + res[i].col5 + "</td><td>" + res[i].col6 + "</td><td>" + res[i].col7 + "</td><td>" + res[i].col8 + "</td><td>"+res[i].col9+"</td><td>"+res[i].col10+"</td><td>"+res[i].col11+"</td></tr>");
                                
                            }

                        }else{
                            $("#monthScanWin").html("<tr><td colspan='12'>暂无符合条件的数据</td></tr>");
                        }
                    });
                },
                //月投入红包量；
                'getMonthRedWinData' :  function (timesObj) {
                    $model.$getMonthRedWinData(timesObj).then(function (res) {
                        console.log(res);
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        
                        $('#monthRedDataTitle').html('扫码月报数据汇总('+$("#redMonth").val()+')');
                        if(res.length > 0){
                            for (var i = 0; i < res.length; i++) {
                                $("#monthRedWin").append("<tr><td>" + res[i].col0 + "</td><td>" + res[i].col1 + "</td><td>" + res[i].col2 + "</td><td>" + res[i].col3 + "</td><td>" + res[i].col4 + "</td><td>" + res[i].col5 + "</td><td>" + res[i].col6 +"</td></tr>");
                                
                            }
                        }else{
                            $("#monthRedWin").append("<tr><td colspan='7'>暂无符合条件的数据</td></tr>");
                        }
                    });
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
                switch(arguments[1]){
                    case 1:
                        var provWeekObj = $('#proviceDataWeeks');
                        //console.log(provWeekObj.val());
                        if(provWeekObj.val() != ''){
                            curWeekStr = provWeekObj.find("option:selected").text();
                           // console.log(curWeekStr)
                        }
                        var provSpeciftObj = $('#proviceDataSpecift');
                        console.log(provSpeciftObj.val());
                        if(provSpeciftObj.val() != ''){
                            curSpeciftStr = provSpeciftObj.find("option:selected").text();
                            //console.log(curSpeciftStr);
                        }

                        //$('#curSpeciftStr').html()
                        var cashWinDataObj = {
                            'statTime' : $('#proviceDataWeeks').val(),
                            'productSn' : $('#specifts').multiselect().val().toString(),
                            'productBrand': $('#brands').multiselect().val().toString(),
                            'staType': "week"
                        }
                        console.log(cashWinDataObj);
                        gloabl.getWeekScanWinData(cashWinDataObj);
                        break;
                    case 2:
                        var provWeekObj = $('#redDataWeeks');
                        //console.log(provWeekObj.val());
                        if(provWeekObj.val() != ''){
                            curWeekStr = provWeekObj.find("option:selected").text();
                           // console.log(curWeekStr)
                        }
                        var provSpeciftObj = $('#proviceDataSpecift');
                        //console.log(provSpeciftObj.val());
                        if(provSpeciftObj.val() != ''){
                            curSpeciftStr = provSpeciftObj.find("option:selected").text();
                            //console.log(curSpeciftStr);
                        }

                        //$('#curSpeciftStr').html()
                        var redWinDataObj = {
                            'statTime' : $('#redDataWeeks').val(),
                            'productSn' : $('#redweekspecifts').multiselect().val().toString(),
                            'productBrand': $('#redweekbrands').multiselect().val().toString(),
                            'staType': "week"
                        }
                        console.log(redWinDataObj);
                        gloabl.getWeekRedWinData(redWinDataObj);
                        break;
                    case 3:
                        
                        var scanWinDataObj = {
                            'statTime' : $('#dataMonth').val()+"-01",
                            'productSn' : $('#monthspecifts').multiselect().val().toString(),
                            'productBrand': $('#monthbrands').multiselect().val().toString(),
                            'staType': "month"
                        }
                        gloabl.getMonthScanWinData(scanWinDataObj);
                        break;
                    case 4:
                        var redWinDataObj = {
                            'statTime' : $('#redMonth').val()+"-01",
                            'productSn' : $('#redmonthspecifts').multiselect().val().toString(),
                            'productBrand': $('#redmonthbrands').multiselect().val().toString(),
                            'staType': "month"
                        }
                        console.log(redWinDataObj);
                        gloabl.getMonthRedWinData(redWinDataObj);
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
                if (a === 1) {
                    var data = {
                        'statTime' : $('#proviceDataWeeks').val(),
                        'productSn' : $('#specifts').multiselect().val().toString(),
                        'productBrand': $('#brands').multiselect().val().toString(),
                        'staType': "week"
                    }
                    console.log(data);
                    if(curSpeciftStr != '' && curWeekStr != ''){
                        // console.log(curSpeciftStr + ':' + curWeekStr);
                        data.tableTitle = curSpeciftStr +'扫码数据汇总('+ curWeekStr + ')';
                    }
                    var url = "/api/tztx/dataportal/fixatreport/getRptScanNumDateWeekExcel";
                }else if (a === 2) {
                    var data = {
                        'statTime' : $('#redDataWeeks').val(),
                        'productSn' : $('#redweekspecifts').multiselect().val().toString(),
                        'productBrand': $('#redweekbrands').multiselect().val().toString(),
                        'staType': "week"
                    }
                    if(curSpeciftStr != '' && curWeekStr != ''){
                        // console.log(curSpeciftStr + ':' + curWeekStr);
                        data.tableTitle = '扫码活动红包投入数据周报('+ curWeekStr + ')';
                    }
                    var url = "/api/tztx/dataportal/fixatreport/getRptScanRedDateWeekExcel";
                }else if (a === 3) {
                    var data = {
                        'statTime' : $('#dataMonth').val()+"-01",
                        'productSn' : $('#monthspecifts').multiselect().val().toString(),
                        'productBrand': $('#monthbrands').multiselect().val().toString(),
                        'staType': "month"
                    }
                    data.tableTitle = '扫码数据汇总';
                    
                    var url = "/api/tztx/dataportal/fixatreport/getRptScanNumDateMonthExcel";
                }else if(a === 4) {
                    var data = {
                        'statTime' : $('#redMonth').val()+"-01",
                        'productSn' : $('#redmonthspecifts').multiselect().val().toString(),
                        'productBrand': $('#redmonthbrands').multiselect().val().toString(),
                        'staType': "month"
                    }
                    console.log(data);
                    data.tableTitle = '扫码活动红包投入数据月报';
                    
                    var url = "/api/tztx/dataportal/fixatreport/getRptScanRedDateMonthExcel";
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
            
            //监听品牌变化；
            $('#brands').change(function(){
                var curBrandValue = $(this).val().toString();
                console.log(curBrandValue);
                $model.$getSpecifData({productBrand:curBrandValue}).then(function(res){
                    $scope.speciftList = res.data || [];
                    console.log($scope.speciftList);
                    $("#specifts").multiselect('dataprovider', _.forEach($scope.speciftList, function (v) { // 这里有个小坑：循环的必须是数组包含对象他自己会在你的对象里塞个字段label
                        v.label = v.productName;
                        v.value = v.productSn;
                        
                    }));
                    $("#specifts").multiselect('refresh');
                    $scope.$apply();
                });
            });
            //监听品牌变化；
            $('#redweekbrands').change(function(){
                var curBrandValue = $(this).val().toString();
                console.log(curBrandValue);
                $model.$getSpecifData({productBrand:curBrandValue}).then(function(res){
                    $scope.speciftList = res.data || [];
                    console.log($scope.speciftList);
                    $("#redweekspecifts").multiselect('dataprovider', _.forEach($scope.speciftList, function (v) { // 这里有个小坑：循环的必须是数组包含对象他自己会在你的对象里塞个字段label
                        v.label = v.productName;
                        v.value = v.productSn;
                        
                    }));
                    $("#redweekspecifts").multiselect('refresh');
                    $scope.$apply();
                });
            });
            //监听月报品牌变化；
            $('#monthbrands').change(function(){
                var curBrandValue = $(this).val().toString();
                console.log(curBrandValue);
                $model.$getSpecifData({productBrand:curBrandValue}).then(function(res){
                    $scope.speciftList = res.data || [];
                    console.log($scope.speciftList);
                    $("#monthspecifts").multiselect('dataprovider', _.forEach($scope.speciftList, function (v) { // 这里有个小坑：循环的必须是数组包含对象他自己会在你的对象里塞个字段label
                        v.label = v.productName;
                        v.value = v.productSn;
                        
                    }));
                    $("#monthspecifts").multiselect('refresh');
                    $scope.$apply();
                });
            });

            //监听月报品牌变化；
            $('#redmonthbrands').change(function(){
                var curBrandValue = $(this).val().toString();
                console.log(curBrandValue);
                $model.$getSpecifData({productBrand:curBrandValue}).then(function(res){
                    $scope.speciftList = res.data || [];
                    console.log($scope.speciftList);
                    $("#redmonthspecifts").multiselect('dataprovider', _.forEach($scope.speciftList, function (v) { // 这里有个小坑：循环的必须是数组包含对象他自己会在你的对象里塞个字段label
                        v.label = v.productName;
                        v.value = v.productSn;
                        
                    }));
                    $("#redmonthspecifts").multiselect('refresh');
                    $scope.$apply();
                });
            });
        }]
    };

    return reportController;
});