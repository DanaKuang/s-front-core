/**
 * Author: zhaobaoli
 * Create Date: 2017-10-10
 * Description: sweepDetail
 */

define([], function () {
    var sweepDetailController = {
        ServiceType: 'controller',
        ServiceName: 'SweepDetailCtrl',
        ViewModelName: 'sweepDetailViewModel',
        ServiceContent: ['$scope', 'setDateConf','dayFilter','replacestrFilter', function ($scope, setDateConf,dayFilter,replacestrFilter) {
            var $model = $scope.$model;
            setDateConf.init($(".agree-date"), "day");
            //设置input的默认时间
            var stattime = dayFilter.today("date");
            $(".agree-date").find("input").val(stattime);
            //小时时间段数组
            $scope.hoursArr = ['00:00:00~00:59:59','01:00:00~01:59:59','02:00:00~02:59:59','03:00:00~03:59:59','04:00:00~04:59:59',
            '05:00:00~05:59:59','06:00:00~06:59:59','07:00:00~07:59:59','08:00:00~08:59:59','09:00:00~09:59:59','10:00:00~10:59:59',
            '11:00:00~11:59:59','12:00:00~12:59:59','13:00:00~13:59:59','14:00:00~14:59:59','15:00:00~15:59:59','16:00:00~16:59:59',
            '17:00:00~17:59:59','18:00:00~18:59:59','19:00:00~19:59:59','20:00:00~20:59:59','21:00:00~21:59:59','22:00:00~22:59:59','23:00:00~23:59:59'];

            //初始化分页信息
            $scope.pageSize = 15; //每页显示多少条
            $scope.currentPageNumber = 1; //当前页数
            $scope.totalPage = 0;//总页数
            $scope.sweepDetailData = [];
            var initPage = {
                "page" : $scope.currentPageNumber,
                "pageSize" : $scope.pageSize
            };

            //当前的详情码
            $scope.curCode = '';

            //开始查询
            $scope.sweepSearch = function(){
                var urerIdStr = $('#userId').val();
                if(urerIdStr == ''){
                    alert('请输入user_id');
                    return;
                }
                var productSnStr = $('#snId').val();
                if(productSnStr == ''){
                    alert('请输入SN');
                    return;
                }
                var searchDate = {
                    'userid' : urerIdStr,
                    'productSn' : productSnStr
                }
                var dayStr = $('#dayTime').val();
                var selectHour = $('#hoursSeg').val();
                var hours = selectHour.split('~');
                searchDate.beginTime = dayStr + ' ' + hours[0];
                searchDate.endTime = dayStr + ' ' + hours[1];

                $model.$sweepDetailData(searchDate).then(function (res) {
                    var res = res.data || [];
                    for(var i=0;i<res.length;i++){
                        res[i].showCode = replacestrFilter.replaceStr(res[i].code);
                    }
                    $('#sweepDetailTable').show();
                    $scope.sweepDetailData = res;
                    $scope.$apply();

                    // $("#sweep_table").html("");
                    // $('#sweepDetailTable').show();
                    // if(res.length > 0){
                    //     for (var i = 0; i < res.length; i++) {
                    //         $("#sweep_table").append("<tr><td class='code_detail' ng-click='searchDetailByCode("+res[i].code+")' data-code='"+ res[i].code+"'>查询CODE相关扫码明细</td><td>" + res[i].code + "</td><td>" + res[i].memo + "</td><td>" + res[i].userid + "</td><td>" + res[i].productSn + "</td><td>" + res[i].ctime + "</td></tr>");
                    //     }
                    // }else{
                    //     $("#sweep_table").append("<tr><td colspan='6'>暂无符合条件的数据</td></tr>");
                    // }

                })
            }

            //根据code查询明细
            $scope.searchDetailByCode = function(codeStr,showCodeStr){
                if(codeStr != ''){
                    $scope.curCode = codeStr;
                    $scope.showCodeStr = showCodeStr;
                    initPage.code = codeStr;
                    getDetailByCode(initPage);
                }
            }

            //根据code查询详细扫码信息
            function getDetailByCode(pageObj){
                $scope.currentPageNumber = pageObj.page;
                $model.$detailDataByCode(pageObj).then(function (res) {
                    var res = res.data || [];
                    $scope.totalPage = res.Count;
                    $('#sweepDataTable').hide();
                    $('#codeDataTable').show();
                    $scope.codeDetailData = res.list;

                    var curPageObj = {
                        allPages : Math.ceil(res.Count/$scope.pageSize),
                        currentPage : $scope.currentPageNumber
                    };
                    if ($(".tcdPageCode").createPage) {
                        $(".tcdPageCode").remove();
                    }
                    $(".footer_sec").append("<div class='tcdPageCode'></div>");
                    $scope.$apply();
                    createPageTools(curPageObj);
                    $scope.$apply();

                })
            }

            //点击按钮的返回
            $scope.goback = function () {
                $('#codeDataTable').hide();
                $('#sweepDataTable').show();
            }

            //创建分页工具
            function createPageTools(pageData){
                $(".tcdPageCode").createPage({
                    pageCount: pageData.allPages,
                    current : pageData.currentPage,
                    backFn : function(pageNum){
                        var curPageData = {
                            "page" : pageNum,
                            "pageSize" : $scope.pageSize,
                            "code" : $scope.curCode
                        };
                        getDetailByCode(curPageData);
                    }
                });
            }

            // 添加hover效果
            $("select").hover(function (e) {
                e.currentTarget.title = e.currentTarget.selectedOptions[0].innerText;
            });
        }]
    };

    return sweepDetailController;
})