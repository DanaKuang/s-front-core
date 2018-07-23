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
            $(".month-wrap").val(statmonth);
            var curTableIndex = '';
            var curWeekStr = '';
            var curSpeciftStr = '';

            $scope.scanWeekStatus = 'w4'; //区域活跃度扫码周报数据状态
            $scope.scanMonthStatus = 'm4'; //区域活跃度扫码月报数据状态
            var allProvinceData = [];  //全国省的数据
            var selectScanWeekBrand = []; //区域活跃度扫码周报选中的品牌
            var selectScanMonthBrand = []; //区域活跃度扫码月报选中的品牌
            $scope.selectActWeeekBrand = true;  //活跃度周报-品牌全选时只能选择全部w6,选择一个品牌时可选品牌和全部,此时全部为w4
            $scope.selectActMonthBrand = true;  //活跃度月报-品牌全选时只能选择全部m6,选择一个品牌时可选品牌和全部,此时全部为m4

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
                    case 5 :
                        gloabl.getBrand(5);
                        gloabl.getWeeks(5);
                        gloabl.getProvinceData(5);
                        break;
                    case 6 :
                        gloabl.getBrand(6);
                        gloabl.getProvinceData(6);
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
                                $model.$getBrandData().then(function (res) {
                                    var brandList = res.data || [];
                                    if(brandList.length > 0){
                                        var fristBrandName = "";
                                        $model.$getSpecifData({productBrand:fristBrandName}).then(function(res){
                                            var speciftList = res.data || [];
                                            if(speciftList.length > 0){
                                                var startTimeObj = {
                                                    'statTime' : $('#proviceDataWeeks').val(),
                                                    'productSn' : $('#specifts').multiselect().val().toString()?$('#specifts').multiselect().val().toString():"请选择",
                                                    'productBrand': $('#brands').multiselect().val().toString()?$('#brands').multiselect().val().toString():"请选择",
                                                    'staType': "week"
                                                }
                                            }
                                            gloabl.getWeekScanWinData(startTimeObj);
                                        });
                                    }
                                })
                                break;
                            case 2:
                                $model.$getBrandData().then(function (res) {
                                    var brandList = res.data || [];
                                    if(brandList.length > 0){
                                        var fristBrandName = "";
                                        $model.$getSpecifData({productBrand:fristBrandName}).then(function(res){
                                            var speciftList = res.data || [];
                                            if(speciftList.length > 0){
                                                var startRedWinDataObj = {
                                                    'statTime' : $('#redDataWeeks').val(),
                                                    'productSn' : $('#redweekspecifts').multiselect().val().toString()? $('#redweekspecifts').multiselect().val().toString():"请选择",
                                                    'productBrand': $('#redweekbrands').multiselect().val().toString()?$('#redweekbrands').multiselect().val().toString():"请选择",
                                                    'staType': "week"
                                                }
                                            }
                                            gloabl.getWeekRedWinData(startRedWinDataObj);

                                        });
                                    }
                                })
                                break;
                            case 5:
                                curWeekStr = $scope.weeksList[0].weekNo;
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
                                $("#brands").multiselect({
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
                                    $('#brands').multiselect().val(brandStrArr).multiselect("refresh");
                                }

                                curBrandName = $('#brands').multiselect().val().toString();
                                $model.$getSpecifData({productBrand: curBrandName}).then(function(res){
                                    $scope.speciftList = res.data || [];

                                    $scope.$apply();
                                    $("#specifts").multiselect({
                                        nonSelectedText: '请选择',
                                        allSelectedText: '全部',
                                        nSelectedText: '已选择',
                                        selectAll:true,
                                        selectAllText: '全部',
                                        selectAllValue: 'all',
                                        buttonWidth: '180px'
                                    });
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
                                $("#redweekbrands").multiselect({
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

                                curBrandName = $('#redweekbrands').multiselect().val().toString();
                                $model.$getSpecifData({productBrand: curBrandName}).then(function(res){
                                    $scope.speciftList = res.data || [];

                                    $scope.$apply();
                                    $("#redweekspecifts").multiselect({
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
                                $("#monthbrands").multiselect({
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
                                    $("#monthspecifts").multiselect({
                                        nonSelectedText: '请选择',
                                        allSelectedText: '全部',
                                        nSelectedText: '已选择',
                                        selectAll:true,
                                        selectAllText: '全部',
                                        selectAllValue: 'all',
                                        buttonWidth: '180px'
                                    });
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
                                $("#redmonthbrands").multiselect({
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

                                curBrandName = $('#redmonthbrands').multiselect().val().toString();
                                $model.$getSpecifData({productBrand: curBrandName}).then(function(res){
                                    $scope.speciftList = res.data || [];

                                    $scope.$apply();
                                    $("#redmonthspecifts").multiselect({
                                        nonSelectedText: '请选择',
                                        allSelectedText: '全部',
                                        nSelectedText: '已选择',
                                        selectAll:true,
                                        selectAllText: '全部',
                                        selectAllValue: 'all',
                                        buttonWidth: '180px'
                                    });
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
                        case 5:
                            $model.$getBrandList().then(function (res) {
                                $scope.brandList = res.data || [];
                                selectScanWeekBrand = res.data;
                                // $scope.slectWeekBrand = $scope.brandList[0].name;
                                // $scope.weekBrandVal = $scope.slectWeekBrand;
                                $scope.$apply();
                                // var curBrandName = $scope.weekBrandVal;
                                $("select#scanActWeekBrands").multiselect({
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
                                        brandStrArr.push($scope.brandList[i].name);
                                    }
                                    $('#scanActWeekBrands').multiselect().val(brandStrArr).multiselect("refresh");
                                }

                            })
                            break;
                        case 6:
                            $model.$getBrandList().then(function (res) {
                                $scope.brandList = res.data || [];
                                $scope.$apply();
                                selectScanMonthBrand = res.data;
                                // $scope.slectMonthBrand = $scope.brandList[0].name;
                                // $scope.$apply();
                                $("select#scanActMonthBrands").multiselect({
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
                                        brandStrArr.push($scope.brandList[i].name);
                                    }
                                    $('#scanActMonthBrands').multiselect().val(brandStrArr).multiselect("refresh");
                                }
                            })
                            break;
                        default:
                    }
                },
                'getWeekScanWinData' : function(timesObj){
                    $model.$getWeekScanData(timesObj).then(function (res) {

                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        //表标题显示
                        $('#weekDataTitle').html('扫码数据周报('+ curWeekStr + ')');
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
                    $model.$getWeekRedWinData(timesObj).then(function (res) {
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        //表标题显示
                        $('#redWeekDataTitle').html('扫码活动红包投入数据周报('+ $('#redDataWeeks').find("option:selected").text() + ')');
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
                'getMonthScanWinData' : function (timesObj) {
                    $model.$getMonthScanData(timesObj).then(function (res) {
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        $('#monthScanDataTitle').html('扫码数据月报('+$("#dataMonth").val()+')');
                        var str="";
                        if(res.length > 0){
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
                        var res = res.data || [];
                        $(".report-table").find("tbody").html("");
                        $('#monthRedDataTitle').html('扫码活动红包投入数据月报('+$("#redMonth").val()+')');
                        if(res.length > 0){
                            for (var i = 0; i < res.length; i++) {
                                $("#monthRedWin").append("<tr><td>" + res[i].col0 + "</td><td>" + res[i].col1 + "</td><td>" + res[i].col2 + "</td><td>" + res[i].col3 + "</td><td>" + res[i].col4 + "</td><td>" + res[i].col5 + "</td><td>" + res[i].col6 +"</td></tr>");
                            }
                        }else{
                            $("#monthRedWin").append("<tr><td colspan='7'>暂无符合条件的数据</td></tr>");
                        }
                    });
                },
                'getScanActWeekData' : function(paramObj){ //获取区县扫码活跃度周报
                    $model.$getScanActWeekData(paramObj).then(function (res) {
                        var res = res.data || [];
                        $('#scanActWeekTitle').html('开启GPS用户区县扫码活跃度('+curWeekStr+')');
                        $scope.scanActWeekList = res;
                        $scope.$apply();
                    });
                },
                'getScanActMonthData' : function(paramObj){ //获取区县扫码活跃度月报
                    $model.$getScanActMonthData(paramObj).then(function (res) {
                        var res = res.data || [];
                        $('#scanActMonthTitle').html('开启GPS用户区县扫码活跃度('+ $('#scanMonth').val() +')');
                        $scope.scanActMonthList = res;
                        $scope.$apply();
                    });
                },
                'getProvinceData' : function(num){  //省份获取
                    $model.$getProvinceData().then(function (res) {
                        var res = res.data || [];
                        allProvinceData = res;
                        if(num == 5){
                            $scope.scanWeekProList = res;
                            $scope.$apply();
                            $("select#scanWeekPro").multiselect({
                                nonSelectedText: '请选择',
                                allSelectedText: '全部',
                                nSelectedText: '已选择',
                                selectAll:true,
                                selectAllText: '全部',
                                selectAllValue: 'all',
                                buttonWidth: '180px'
                            });
                            var curWeekPro = {
                                name : [],
                                code : []
                            };
                            var curWeekCity = {
                                name : [],
                                code : []
                            }
                            if(res.length > 0){                                
                                for(var i=0;i<res.length;i++){
                                    if(res[i].name == '河北省'){
                                        curWeekPro.name.push(res[i].name);
                                        curWeekPro.code.push(res[i].code);
                                        $('#scanWeekPro').multiselect().val(curWeekPro.code).multiselect("refresh");
                                        var proObj = {
                                            provinceName : curWeekPro.name.join(',')
                                        }
                                        $model.$getCityData(proObj).then(function (res) {
                                            var cityData = res.data || [];
                                            $scope.scanWeekcityList = cityData;
                                            $scope.$apply();
                                            $("select#scanWeekCity").multiselect({
                                                nonSelectedText: '请选择',
                                                allSelectedText: '全部',
                                                nSelectedText: '已选择',
                                                selectAll:true,
                                                selectAllText: '全部',
                                                selectAllValue: 'all',
                                                buttonWidth: '180px'
                                            });
                                            if(cityData.length > 0){
                                                for(var j=0;j<cityData.length;j++){
                                                    if(cityData[j].cityName == '石家庄市'){
                                                        curWeekCity.code.push(cityData[j].cityId);
                                                        curWeekCity.name.push(cityData[j].cityName);
                                                        $('#scanWeekCity').multiselect().val(curWeekCity.code).multiselect("refresh");
                                                    }
                                                }
                                                
                                            }
                                            var scanWeekParam = {
                                                'statDate' : $('#scanActWeeks').val(),
                                                // 'statDate' : '201829',
                                                // 'brandName': $('#scanActWeekBrands').multiselect().val().toString()?$('#scanActWeekBrands').multiselect().val().toString():"请选择",
                                                // 'statType': $scope.selectActWeeekBrand ? 'w6':'w4',
                                                'provinceCode' : curWeekPro.code.join(','),
                                                'cityCode' : curWeekCity.code.join(',')
                                            }
                                            var selectWeekBrands = $('#scanActWeekBrands').multiselect().val();
                                            if(selectWeekBrands.length == selectScanWeekBrand.length){
                                                scanWeekParam.brandName = '全部';
                                                scanWeekParam.statType = 'w6';
                                            }else{
                                                scanWeekParam.brandName = selectWeekBrands.toString() ? selectWeekBrands.toString() : '';
                                                scanWeekParam.statType = 'w5';
                                            }
                                            // if($scope.selectActWeeekBrand){
                                            //     scanWeekParam.statType = 'w6';
                                            // }else{
                                            //     scanWeekParam.statType = $scope.scanWeekStatus;
                                            // }
                                            gloabl.getScanActWeekData(scanWeekParam);    
                                        });
                                    }
                                }
                                
                                
                            }
                        }else if(num == 6){
                            $scope.scanMonthProList = res;
                            $scope.$apply();
                            $("select#scanMonthPro").multiselect({
                                nonSelectedText: '请选择',
                                allSelectedText: '全部',
                                nSelectedText: '已选择',
                                selectAll:true,
                                selectAllText: '全部',
                                selectAllValue: 'all',
                                buttonWidth: '180px'
                            });
                            var curMonthPro = {
                                name : [],
                                code : []
                            };
                            var curMonthCity = {
                                name : [],
                                code : []
                            }
                            if(res.length > 0){                                
                                for(var i=0;i<res.length;i++){
                                    if(res[i].name == '河北省'){
                                        curMonthPro.name.push(res[i].name);
                                        curMonthPro.code.push(res[i].code);
                                        $('#scanMonthPro').multiselect().val(curMonthPro.code).multiselect("refresh");
                                        var proObj = {
                                            provinceName : curMonthPro.name.join(',')
                                        }
                                        $model.$getCityData(proObj).then(function (res) {
                                            var cityData = res.data || [];
                                            $scope.scanMonthcityList = cityData;
                                            $scope.$apply();
                                            $("select#scanMonthCity").multiselect({
                                                nonSelectedText: '请选择',
                                                allSelectedText: '全部',
                                                nSelectedText: '已选择',
                                                selectAll:true,
                                                selectAllText: '全部',
                                                selectAllValue: 'all',
                                                buttonWidth: '180px'
                                            });
                                            if(cityData.length > 0){
                                                for(var j=0;j<cityData.length;j++){
                                                    if(cityData[j].cityName == '石家庄市'){
                                                        curMonthCity.code.push(cityData[j].cityId);
                                                        curMonthCity.name.push(cityData[j].cityName);
                                                        $('#scanMonthCity').multiselect().val(curMonthCity.code).multiselect("refresh");
                                                    }
                                                }
                                                
                                            }
                                            var scanMonthParam = {
                                                'statDate' : $('#scanMonth').val()+"-01",
                                                // 'brandName': $('#scanActMonthBrands').multiselect().val().toString()?$('#scanActMonthBrands').multiselect().val().toString():"请选择",
                                                // 'statType': $scope.scanMonthStatus,
                                                'provinceCode' : curMonthPro.code.join(','),
                                                'cityCode' : curMonthCity.code.join(',')
                                            }
                                            var selectMonthBrands = $('#scanActMonthBrands').multiselect().val();
                                            if(selectMonthBrands.length == selectScanMonthBrand.length){
                                                scanMonthParam.brandName = '全部';
                                                scanMonthParam.statType = 'm6';
                                            }else{
                                                scanMonthParam.brandName = selectMonthBrands.toString() ? selectMonthBrands.toString() : '';
                                                scanMonthParam.statType = 'm5';
                                            }
                                            // if($scope.selectActMonthBrand){
                                            //     scanMonthParam.statType = 'm6';
                                            // }else{
                                            //     scanMonthParam.statType = $scope.scanMonthStatus;
                                            // }
                                            gloabl.getScanActMonthData(scanMonthParam);    
                                        });
                                    }
                                }
                                
                                
                            }
                        }
                        
                    });

                },
                'getCityData' : function(num,proObj){
                    if(num == 5){
                        $model.$getCityData(proObj).then(function (res) {                            
                            var cityData = res.data || [];
                            $scope.scanWeekcityList = cityData;
                            $scope.$apply();
                            $('#scanWeekCity').multiselect('dataprovider', _.forEach($scope.scanWeekcityList, function(v){
                                v.label = v.cityName;
                                v.value = v.cityId;
                            }));
                            $('#scanWeekCity').multiselect().val([]).multiselect("refresh");

                        });
                    }else if(num == 6){
                        $model.$getCityData(proObj).then(function (res) {                            
                            var cityData = res.data || [];
                            $scope.scanMonthcityList = cityData;
                            $scope.$apply();
                            $('#scanMonthCity').multiselect('dataprovider', _.forEach($scope.scanMonthcityList, function(v){
                                v.label = v.cityName;
                                v.value = v.cityId;
                            }));
                            $('#scanMonthCity').multiselect().val([]).multiselect("refresh");

                        });
                    }
                    
                }

            }

            $scope.selectWeekBrand = function(){ //区县扫码活跃度周报根据选择规格
                var selectBrandName = $('#scanActWeekBrands').val();
                $model.$getProductList({productBrand: selectBrandName}).then(function(res){
                    $scope.speciftList = res.data || [];
                    $scope.$apply();
                    $("#scanActsWeekSecifts").multiselect({
                        nonSelectedText: '请选择',
                        allSelectedText: '全部',
                        nSelectedText: '已选择',
                        selectAll:true,
                        selectAllText: '全部',
                        selectAllValue: 'all',
                        buttonWidth: '180px'
                    });
                    if($scope.speciftList.length > 0){
                        $('#scanActsWeekSecifts').multiselect().val($scope.speciftList[0].name).multiselect("refresh");
                        var speciftStrArr = [];
                        for(var i=0; i<$scope.speciftList.length; i++){
                            speciftStrArr.push($scope.speciftList[i].sn);
                        }
                        $('#scanActsWeekSecifts').multiselect().val(speciftStrArr).multiselect("refresh");
                        curSpeciftStr = "全部";
                    }else{
                        $scope.speciftList = [];
                        $('#scanActsWeekSecifts').multiselect().val([]).multiselect("refresh");
                    }
                    
                });

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
                        if(provWeekObj.val() != ''){
                            curWeekStr = provWeekObj.find("option:selected").text();
                        }
                        var provSpeciftObj = $('#proviceDataSpecift');
                        if(provSpeciftObj.val() != ''){
                            curSpeciftStr = provSpeciftObj.find("option:selected").text();
                        }
                        var cashWinDataObj = {
                            'statTime' : $('#proviceDataWeeks').val(),
                            'productSn' : $('#specifts').multiselect().val().toString()?$('#specifts').multiselect().val().toString():"请选择",
                            'productBrand': $('#brands').multiselect().val().toString()?$('#brands').multiselect().val().toString():"请选择",
                            'staType': "week"
                        }
                        gloabl.getWeekScanWinData(cashWinDataObj);
                        break;
                    case 2:
                        var provWeekObj = $('#redDataWeeks');
                        if(provWeekObj.val() != ''){
                            curWeekStr = provWeekObj.find("option:selected").text();
                        }
                        var provSpeciftObj = $('#proviceDataSpecift');
                        if(provSpeciftObj.val() != ''){
                            curSpeciftStr = provSpeciftObj.find("option:selected").text();
                        }

                        var redWinDataObj = {
                            'statTime' : $('#redDataWeeks').val(),
                            'productSn' : $('#redweekspecifts').multiselect().val().toString()? $('#redweekspecifts').multiselect().val().toString():"请选择",
                            'productBrand': $('#redweekbrands').multiselect().val().toString()?$('#redweekbrands').multiselect().val().toString():"请选择",
                            'staType': "week"
                        }
                        gloabl.getWeekRedWinData(redWinDataObj);
                        break;
                    case 3:
                        var scanWinDataObj = {
                            'statTime' : $('#dataMonth').val()+"-01",
                            'productSn' : $('#monthspecifts').multiselect().val().toString()?$('#monthspecifts').multiselect().val().toString():"请选择",
                            'productBrand': $('#monthbrands').multiselect().val().toString()?$('#monthbrands').multiselect().val().toString():"请选择",
                            'staType': "month"
                        }
                        gloabl.getMonthScanWinData(scanWinDataObj);
                        break;
                    case 4:
                        var redWinDataObj = {
                            'statTime' : $('#redMonth').val()+"-01",
                            'productSn' : $('#redmonthspecifts').multiselect().val().toString()?$('#redmonthspecifts').multiselect().val().toString():"请选择",
                            'productBrand': $('#redmonthbrands').multiselect().val().toString()?$('#redmonthbrands').multiselect().val().toString():"请选择",
                            'staType': "month"
                        }
                        gloabl.getMonthRedWinData(redWinDataObj);
                        break;
                    case 5:
                        var scanActWeekParam ={
                            // 'statDate' : '201829',
                            'statDate' : $('#scanActWeeks').val(),
                            // 'brandName': $('#scanActWeekBrands').multiselect().val().toString()?$('#scanActWeekBrands').multiselect().val().toString():"请选择",
                            // 'statType': $scope.selectActWeeekBrand ? 'w6':'w4',
                            'provinceCode' : $('#scanWeekPro').multiselect().val().join(','),
                            'cityCode' : $('#scanWeekCity').multiselect().val().join(',')
                        }

                        var selectWeekBrands = $('#scanActWeekBrands').multiselect().val();
                        if(selectWeekBrands.length == selectScanWeekBrand.length){
                            scanActWeekParam.brandName = '全部';
                            scanActWeekParam.statType = 'w6';
                        }else{
                            scanActWeekParam.brandName = selectWeekBrands.toString() ? selectWeekBrands.toString() : '';
                            scanActWeekParam.statType = 'w5';
                        }
                        // if($scope.selectActWeeekBrand){
                        //     scanActWeekParam.statType = 'w6'
                        // }else{
                        //     scanActWeekParam.statType = $scope.scanWeekStatus;
                        // }
                        
                        gloabl.getScanActWeekData(scanActWeekParam);
                        break;
                    case 6:
                        var scanMonthParam = {
                            'statDate' : $('#scanMonth').val()+"-01",
                            // 'brandName': $('#scanActMonthBrands').multiselect().val().toString()?$('#scanActMonthBrands').multiselect().val().toString():"请选择",
                            // 'statType': $scope.scanMonthStatus,
                            'provinceCode' : $('#scanMonthPro').multiselect().val().join(','),
                            'cityCode' : $('#scanMonthCity').multiselect().val().join(',')
                        }

                        var selectMonthBrands = $('#scanActMonthBrands').multiselect().val();
                        if(selectMonthBrands.length == selectScanMonthBrand.length){
                            scanMonthParam.brandName = '全部';
                            scanMonthParam.statType = 'm6';
                        }else{
                            scanMonthParam.brandName = selectMonthBrands.toString() ? selectMonthBrands.toString() : '';
                            scanMonthParam.statType = 'm5';
                        }
                        // if($scope.selectActMonthBrand){
                        //     scanMonthParam.statType = 'm6';
                        // }else{
                        //     scanMonthParam.statType = $scope.scanMonthStatus;
                        // }
                        gloabl.getScanActMonthData(scanMonthParam); 
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
                    if(curSpeciftStr != '' && curWeekStr != ''){
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
                    data.tableTitle = '扫码活动红包投入数据月报';

                    var url = "/api/tztx/dataportal/fixatreport/getRptScanRedDateMonthExcel";
                }else if(a === 5){
                    var data ={
                        // 'statDate' : '201829',
                        'statDate' : $('#scanActWeeks').val(),
                        // 'brandName': $('#scanActWeekBrands').multiselect().val().toString()?$('#scanActWeekBrands').multiselect().val().toString():"请选择",
                        // 'statType': $scope.selectActWeeekBrand ? 'w6':'w4',
                        'provinceCode' : $('#scanWeekPro').multiselect().val().join(','),
                        'cityCode' : $('#scanWeekCity').multiselect().val().join(',')
                    }
                    var selectWeekBrands = $('#scanActWeekBrands').multiselect().val();
                    if(selectWeekBrands.length == selectScanWeekBrand.length){
                        data.brandName = '全部';
                        data.statType = 'w6';
                    }else{
                        data.brandName = selectWeekBrands.toString() ? selectWeekBrands.toString() : '';
                        data.statType = 'w5';
                    }
                    // if($scope.selectActWeeekBrand){
                    //     data.statType = 'w6'
                    // }else{
                    //     data.statType = $scope.scanWeekStatus;
                    // }
                    data.tableTitle = '开启GPS用户区县扫码活跃度周报';
                    var url = "/api/tztx/dataportal/fixatreport/getWeekGpsScanDataExcel";
                }else if(a === 6){
                    var data = {
                        'statDate' : $('#scanMonth').val()+"-01",
                        // 'brandName': $('#scanActMonthBrands').multiselect().val().toString()?$('#scanActMonthBrands').multiselect().val().toString():"请选择",
                        // 'statType': $scope.scanMonthStatus,
                        'provinceCode' : $('#scanMonthPro').multiselect().val().join(','),
                        'cityCode' : $('#scanMonthCity').multiselect().val().join(',')
                    }
                    var selectMonthBrands = $('#scanActMonthBrands').multiselect().val();
                    if(selectMonthBrands.length == selectScanMonthBrand.length){
                        data.brandName = '全部';
                        data.statType = 'm6';
                    }else{
                        data.brandName = selectMonthBrands.toString() ? selectMonthBrands.toString() : '';
                        data.statType = 'm5';
                    }
                    // if($scope.selectActMonthBrand){
                    //     data.statType = 'm6';
                    // }else{
                    //     data.statType = $scope.scanMonthStatus;
                    // }
                    data.tableTitle = '开启GPS用户区县扫码活跃度月报';
                    var url = "/api/tztx/dataportal/fixatreport/getMonthGpsScanDataExcel";
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
                $model.$getSpecifData({productBrand:curBrandValue}).then(function(res){
                    $scope.speciftList = res.data || [];
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
                $model.$getSpecifData({productBrand:curBrandValue}).then(function(res){
                    $scope.speciftList = res.data || [];
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
                $model.$getSpecifData({productBrand:curBrandValue}).then(function(res){
                    $scope.speciftList = res.data || [];
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
                $model.$getSpecifData({productBrand:curBrandValue}).then(function(res){
                    $scope.speciftList = res.data || [];
                    $("#redmonthspecifts").multiselect('dataprovider', _.forEach($scope.speciftList, function (v) { // 这里有个小坑：循环的必须是数组包含对象他自己会在你的对象里塞个字段label
                        v.label = v.productName;
                        v.value = v.productSn;

                    }));
                    $("#redmonthspecifts").multiselect('refresh');
                    $scope.$apply();
                });
            });

            // 添加hover效果
            $("select").hover(function (e) {
                e.currentTarget.title = e.currentTarget.selectedOptions[0].innerText;
            });

            //监听周报省的变化
            $('#scanWeekPro').change(function(){
                var curWeekProVal = $(this).val();;
                var curWeekProName = [];
                for(var i = 0;i<allProvinceData.length;i++){
                    for(var j=0;j<curWeekProVal.length;j++){
                        if(allProvinceData[i].code == curWeekProVal[j]){
                            curWeekProName.push(allProvinceData[i].name);
                        }
                    }
                }
                if(curWeekProVal.length == allProvinceData.length){
                    $scope.scanWeekStatus = 'w5';
                }
                var curWeekProName = {
                    provinceName : curWeekProName.join(',')
                }
                gloabl.getCityData(5,curWeekProName);
            })
            //监听月报省的变化
            $('#scanMonthPro').change(function(){
                var curMonthProVal = $(this).val();
                var curMonthProName = [];
                for(var i = 0;i<allProvinceData.length;i++){
                    for(var j=0;j<curMonthProVal.length;j++){
                        if(allProvinceData[i].code == curMonthProVal[j]){
                            curMonthProName.push(allProvinceData[i].name);
                        }
                    }
                }
                if(curMonthProVal.length == allProvinceData.length){
                    $scope.scanMonthStatus = 'm5';
                }
                var curMonthProName = {
                    provinceName : curMonthProName.join(',')
                }
                gloabl.getCityData(6,curMonthProName);
            })

            //监听区县活跃度周报中的品牌变化
            // $('#scanActWeekBrands').change(function(){
            //     var curWeekBrandVal = $(this).val();
            //     if(curWeekBrandVal.length == selectScanWeekBrand.length){
            //         $scope.scanWeekStatus = 'w4';
            //         $scope.selectActWeeekBrand = true;
            //         $scope.$apply();
            //     }else{
            //         $scope.selectActWeeekBrand = false;
            //         $scope.$apply();
            //     }
            // });

            //监听区县活跃度月报中的品牌变化
            // $('#scanActMonthBrands').change(function(){
            //     var curMonthBrandVal = $(this).val();
            //     if(curMonthBrandVal.length == selectScanMonthBrand.length){
            //         $scope.scanMonthStatus = 'm4';
            //         $scope.selectActMonthBrand = true;
            //         $scope.$apply();
            //     }else{
            //         $scope.selectActMonthBrand = false;
            //         $scope.$apply();
            //     }
            // });
        }]
    };

    return reportController;
});