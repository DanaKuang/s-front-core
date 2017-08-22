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
            $(".date").find("input").val(stattime);
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
                if (index === 1) {
                    gloabl.getProduct();
                } else if (index === 2) {
                    gloabl.getProductNo();
                } else if (index === 3) {
                    gloabl.summaryData($scope.summar);
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
                if (arguments[1] === 1) {
                    $scope.obj = {
                        "activityName": $(that).siblings(".report-gui").find("select").val(),
                        "statTime": $(that).siblings(".agree-date").find(".date").data().date ?
                            $(that).siblings(".agree-date").find(".date").data().date : $(that).siblings(".agree-date").find("input").val(),
                        "productSn": $(that).siblings(".report-gui").find("select option:selected").attr("data-sn")
                    }
                    //console.log($scope.obj);
                    gloabl.winUser($scope.obj);
                } else if (arguments[1] === 2) {
                    $scope.saoobj = {
                        "activityName": $(that).siblings(".report-gui").find("select").val(),
                        "statTime": $(that).siblings(".agree-date").find(".date").data().date ?
                            $(that).siblings(".agree-date").find(".date").data().date : $(that).siblings(".agree-date").find("input").val(),
                    }
                    gloabl.userPro($scope.saoobj);
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
                    var activityName = encodeURI(encodeURI($scope.obj.activityName));
                    var productSn = $scope.obj.productSn;
                    var url = "/fixatreport/importExcelWinUseProvData";
                    var xhr = new XMLHttpRequest();
                    var formData = new FormData();
                    formData.append('statTime', statTime);
                    formData.append('activityName', activityName);
                    formData.append('productSn', productSn);                    
                    xhr.overrideMimeType("text/plain; charset=x-user-defined");
                    xhr.open('POST', url, true);
                    xhr.responseType = "blob";
                    xhr.responseType = "arraybuffer";
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
                    // window.location.href = '/fixatreport/importExcelWinUseProvData?staTime=' + statTime + '&activityName=' + encodeURI(encodeURI(activityName)) + '&productSn=' + productSn;
                } else if (a === 2) {
                    var statTime = $scope.saoobj.statTime;
                    var activityName = encodeURI(encodeURI($scope.saoobj.activityName));
                    var url = "/fixatreport/importExcelScanUseProvData";
                    var xhr = new XMLHttpRequest();
                    var formData = new FormData();
                    formData.append('statTime', statTime);
                    formData.append('activityName', activityName);
                    xhr.overrideMimeType("text/plain; charset=x-user-defined");
                    xhr.open('POST', url, true);
                    xhr.responseType = "blob";
                    xhr.responseType = "arraybuffer";
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
                    // window.location.href = '/fixatreport/importExcelScanUseProvData?staTime=' + statTime + '&activityName=' + encodeURI(encodeURI(activityName))
                } else if (a === 3) {
                    var statTime = $scope.summar.statTime;
                    var url = "/fixatreport/importExcelDailySummData";
                    var xhr = new XMLHttpRequest();
                    var formData = new FormData();
                    formData.append('statTime', statTime);
                    xhr.overrideMimeType("text/plain; charset=x-user-defined");
                    xhr.open('POST', url, true);
                    xhr.responseType = "blob";
                    xhr.responseType = "arraybuffer";
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
                    window.location.href = '/fixatreport/importExcelDailySummData?staTime=' + statTime
                }
            }

        }]
    };

    return reportController;
});