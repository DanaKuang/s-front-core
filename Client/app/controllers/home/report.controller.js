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
        ServiceContent: ['$scope', 'setDateConf', function ($scope, setDateConf) {
            var $model = $scope.$model;
            setDateConf.init($(".agree-date"), "day");
            //设置input的默认时间
            var stattime = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + (new Date().getDate() - 1);
            $(".date").find("input").val(stattime);
            //页面默认加载配置
            $scope.obj = {
                "statTime": "2017-07-11",
                "activityName": "芙蓉王硬细支（盒）"
            };
            $scope.summar = {
                "statTime": "2017-07-19"
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
                            $("#summary_table").append("<tr class='bg' ><td>" + res[i].diaplayName + "</td><td>" + res[i].c1 + "</td><td>" + res[i].c2 + "</td><td>" + res[i].c3 + "</td><td>" + res[i].c4 + "</td><td>" + res[i].c5 + "</td><td>" + res[i].c6 + "</td><td>" + res[i].c7 + "</td><td>" + res[i].c8 + "</td><td>" + res[i].c9 + "</td><td>" + res[i].c10 + "</td><td>" + res[i].c11 + "</td><td>" + res[i].c12 + "</td><td>" + res[i].c13 + "</td><td>" + res[i].c14 + "</td><td>" + res[i].c15 + "</td><td>" + res[i].c16 + "</td><td>" + res[i].c17 + "</td><td>" + res[i].c18 + "</td><td>" + res[i].c19 + "</td><td>" + res[i].c20 + "</td></tr>")
                        }
                    })
                },
                //规格
                "getProduct": function () {
                    $model.$getProduct().then(function (res) {
                        $(".report-gui").find("select").html("");
                        var res = res.data || [];
                        for (var i = 0; i < res.length; i++) {
                            $(".report-gui").find("select").append("<option value=" + res[i].productName + ">" + res[i].productName + "</option>")
                        }
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
            }

            //页面切换
            $scope.tabs = function (index) {
                $(".region-margin").hide();
                $(".region-margin").eq(index).show();
                if (index === 1) {
                    gloabl.winUser($scope.obj);
                    gloabl.getProduct();
                } else if (index === 2) {
                    gloabl.userPro($scope.obj);
                    gloabl.getProduct();
                } else if (index === 3) {
                    gloabl.summaryData($scope.summar);
                }
            }
            //点击按钮的返回
            $scope.goback = function () {
                $(".region-margin").hide();
                $(".region-margin").eq(0).show();
            }

            //查询按钮
            $scope.search = function ($event) {
                var that = $event.target;
                $scope.obj = {
                    "activityName": $(that).siblings(".report-gui").find("select").val(),
                    "statTime": $(that).siblings(".agree-date").find(".date").data().date ?
                        $(that).siblings(".agree-date").find(".date").data().date : $(that).siblings(".agree-date").find("input").val(),
                }
                if (arguments[1] === 1) {
                    gloabl.winUser($scope.obj);
                } else if (arguments[1] === 2) {
                    gloabl.userPro($scope.obj);
                } else if (arguments[1] === 3) {
                    $scope.summar = {
                        "statTime": $(that).siblings(".agree-date").find(".date").data().date ?
                            $(that).siblings(".agree-date").find(".date").data().date : $(that).siblings(".agree-date").find("input").val(),
                    }
                    gloabl.summaryData($scope.summar)
                }
            }
            //下载
            $scope.down = function (a) {
                // var pathName=window.document.location.pathname;
                // var ctxName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
                if (a === 1) {
                    var statTime = $scope.obj.statTime;
                    var activityName = $scope.obj.activityName;
                    window.location.href = 'http://172.16.1.109:8080/dataportal/fixatreport/importExcelWinUseProvData?staTime=' + statTime + '&activityName=' + encodeURI(encodeURI(activityName))
                } else if (a === 2) {
                    var statTime = $scope.obj.statTime;
                    var activityName = $scope.obj.activityName;
                    window.location.href = 'http://172.16.1.109:8080/dataportal/fixatreport/importExcelScanUseProvData?staTime=' + statTime + '&activityName=' + encodeURI(encodeURI(activityName))
                } else if (a === 3) {
                    var statTime = $scope.summar.statTime;
                    // console.log(statTime);
                    window.location.href = 'http://172.16.1.109:8080/dataportal/fixatreport/importExcelDailySummData?staTime='+statTime
                }
            }


        }]
    };

    return reportController;
});