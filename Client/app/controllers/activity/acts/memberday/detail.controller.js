/**
 * Author: liubin
 * Create Date: 2018-01-03
 * Description: 会员日活动设置
 */

define([], function () {
    var memberDayDetailCtrl = {
        ServiceType: 'controller',
        ServiceName: 'mdDetailCtrl',
        ViewModelName: 'mdDetailModel',
        ServiceContent: ['$scope', 'dateFormatFilter', function ($scope, df) {
            var $model = $scope.$model;

            var regionArr = $model.$area.data.data || [];
            var weekArr = $model.$week.data || [];
            var TYPE = $model.$type.data.data || [];

            regionArr.forEach(function (r) {
                r.label = r.name;
                r.value = r.code;
                if (r.childrens && r.childrens.length) {
                    r.childrens.forEach(function (c) {
                        c.label = c.name;
                        c.value = c.code;
                        delete c.childrens;
                    });
                }
                r.children = r.childrens || [];
            });

            // 默认值
            $scope = angular.extend($scope, {
                stArr: [{name:'作废',code:0},{name:'生效',code:1},{name:'已收货',code:2}],
                status: 0,
                regionArr: regionArr,
                region: '',
                weekArr: weekArr,
                weekTime: weekArr[0].weekNo || '',
                pArr: TYPE,
                prize: TYPE[0].prize_name,
                listArr: [],
                detailSearch: initSearch,
                export: exportFn
            });

            // 初始化查询
            function initSearch () {
                var weekTime = $scope.weekTime.slice($scope.weekTime.indexOf('(')+1,$scope.weekTime.indexOf(')')).replace(/\./g,'-').split('~');
                $model.getTableData({
                    stime: weekTime[0],
                    etime: weekTime[1],
                    status: $scope.status || '',
                    areaCode: $scope.region,
                    prize: $scope.prize || '',
                    realThing: 1,
                    currentPageNumber: 1,
                    pageSize: 10
                }).then(function (res) {
                    var data = res.data.data || [];
                    $scope.listArr = data.list || [];
                    $scope.$apply();
                });
            }

            // 导出
            function exportFn () {
                var weekTime = $scope.weekTime.slice($scope.weekTime.indexOf('(')+1,$scope.weekTime.indexOf(')')).replace(/\./g,'-').split('~');

                // 导出奖品明细
                var data = {
                    areaCodes: $scope.region || [],
                    realThing: 1,
                    status: $scope.status || '',
                    stime: weekTime[0] || '',
                    etime: weekTime[1] || ''
                };
                var url = "/api/tztx/saas/saotx/order/exportOrder";
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
                }
                xhr.send(formData);
            }

            // 渲染多选
            $(document).ready(function () {
                var $region = $('[name="region"]');
                $(".ui-search-panel select").multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择',
                    enableClickableOptGroups: true,
                    enableCollapsibleOptGroups: true
                });
                $region.multiselect('dataprovider', regionArr);
                initSearch();
            });
        }]
    };

    return memberDayDetailCtrl;
});