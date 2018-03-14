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
            var SERVERT = $model.$sTime.data.data || +new Date;

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
                stArr: [{name:'作废',code:0},{name:'生效',code:1}],
                status: 0,
                regionArr: regionArr,
                region: '',
                weekArr: weekArr,
                weekTime: weekArr[0].weekNo || '',
                pArr: TYPE,
                idx: TYPE[0].idx,
                listArr: [],
                curPage: 1,
                detailSearch: initSearch,
                detailReset: detailReset,
                export: exportFn,
                sendMessage: sendMessage
            });

            // 发送消息
            function sendMessage (item) {
                if (!item.id) return;
                $model.sendMsg({
                    awardName: item.awardName || '',
                    openId: item.openId || '',
                    minred: item.minred || '',
                    ctime: item.ctime || ''
                }).then(function (res) {
                    if (res.ret === '200000') {
                        alert('发送成功！');
                    }
                });
            }

            // 重置
            function detailReset () {
                $("[name='status']").multiselect('select', 0);
                $("[name='region']").multiselect('deselect', $scope.region);
                $("[name='weekTime']").multiselect('select', weekArr[0].weekNo);
                $("[name='idx']").multiselect('select', TYPE[0].idx);
                $(".ui-search-panel select").multiselect('refresh');
                $acope = angular.extend($scope, {
                    status: 0,
                    region: '',
                    weekTime: weekArr[0].weekNo || '',
                    idx: TYPE[0].idx,
                    curPage: 1
                });
            }

            // 日期判断
            function canSendFilter (d) {
                var nowWeek = $scope.weekArr[0].weekNo || "";// 本周
                var befWeek = $scope.weekArr[1].weekNo || "";// 上周
                befWeek = befWeek.slice(befWeek.indexOf('(')+1,befWeek.indexOf(')')).replace(/\./g,'-').split('~');
                nowWeek = nowWeek.slice(nowWeek.indexOf('(')+1,nowWeek.indexOf(')')).replace(/\./g,'-').split('~');

                // 判断本周是否开奖
                // 当前时间在周六20:30--周日23:59
                if (+new Date(nowWeek[1]+' 23:59:59') > SERVERT) {
                    if (+new Date(nowWeek[1]+' 23:59:59') - SERVERT < (24*60*60*1000+3.5*60*60*1000)) {
                        if (d.term === nowWeek[0]) {
                            return true;
                        }
                    }
                }
                // 当前时间在本周一00:00--本周二20:30
                if (SERVERT > (+new Date(nowWeek[0]+' 23:59:59'))) {
                    if (SERVERT - (+new Date(nowWeek[0]+' 00:00:00')) < (24*60*60*1000+20.5*60*60*1000)) {
                        if (d.term === befWeek[0]) {
                            return true;
                        }
                    }
                }
                return false;
            }

            // 初始化查询
            function initSearch (page) {
                var weekTime = $scope.weekTime.slice($scope.weekTime.indexOf('(')+1,$scope.weekTime.indexOf(')')).replace(/\./g,'-').split('~');
                $model.getTableData(angular.extend({
                    stime: weekTime[0],
                    etime: weekTime[1],
                    status: $scope.status,
                    areaCodes: $scope.region,
                    idx: $scope.idx || '',
                    currentPageNumber: $scope.curPage,
                    pageSize: 100
                }, page || {})).then(function (res) {
                    var data = res.data.data || {};
                    data.list&&data.list.forEach(function (l) {
                        l.canSend = canSendFilter(l);
                    });
                    $scope.listArr = data.list || [];
                    // $scope.paginationConf = res.data;
                    $scope.$apply();
                });
            }

            // 翻页
            // $scope.$on('frompagechange', function (scope, event, page) {
            //     initSearch(page);
            // });

            // 导出
            function exportFn () {
                var weekTime = $scope.weekTime.slice($scope.weekTime.indexOf('(')+1,$scope.weekTime.indexOf(')')).replace(/\./g,'-').split('~');

                // 导出奖品明细
                var data = {
                    areaCodes: $scope.region || "",
                    status: $scope.status,
                    idx: $scope.idx,
                    stime: weekTime[0],
                    etime: weekTime[1]
                };
                var url = "/api/tztx/saas/saotx/activity/exportMemberAwards";
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