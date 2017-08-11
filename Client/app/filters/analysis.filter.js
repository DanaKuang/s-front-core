/**
 * Author: liubin
 * Create Date: 2017-07-20
 * Description: analysisfilter
 */
define([], function () {
    var analysisFilter = {
        ServiceType: "factory",
        ServiceName: "analysisFilter",
        ServiceContent: ['$filter', function ($filter) {
            function filterHour (data) {
                data = data || [];
                return _.map(data, function (d) {
                    return d.split('_')[1] + ':00';
                });
            }
            // 菜单
            function filterDay (data) {
                data = data || [];
                return data;
            }
            // 左饼图
            function filterLeftPie (data) {
                data = data || [];
                return _.map(data, function (d) {
                    return {
                        name: d.termType + '\n' + 'PV:' + d.activePv,
                        value: d.activePv
                    };
                });
            }
            // 右饼图
            function filterRightPie (data) {
                data = data || [];
                return _.map(data, function (d) {
                    return {
                        name: d.termType + '\n' + 'UV:' + d.activeUv,
                        value: d.activeUv
                    };
                });
            }
            // 页面转化
            function filterPage (data) {
                data = data || [];
                var baseRate = 687/770;
                var basePv = 0;
                return _.map(data.reverse(), function (d, i) {
                    var rate = basePv && d.activePv/basePv;
                    var baseWdith = 500;
                    basePv = d.activePv;
                    for (var j=0;j<data.length-i;j++) {
                        baseWdith *= baseRate;
                    }
                    return {
                        name: d.webName,
                        visit: d.activePv,
                        width: baseWdith,
                        rate: '' + (rate*100).toFixed(2) + '%'
                    };
                }).reverse();
            }
            // 热度转化
            function pvFilter (data) {
                data = data || [];
                var sum = _.sum(data, function (o) {return o.activePv;});
                _.each(data, function (d) {
                    d.hot = '' + ((d.activePv/sum)*100).toFixed(2) + '%';
                });
                return data;
            }
            return angular.extend({
                __filter__: $filter,
                pvFilter: pvFilter,
                filterDay: filterDay,
                filterHour: filterHour,
                filterPage: filterPage,
                filterLeftPie: filterLeftPie,
                filterRightPie: filterRightPie
            });
        }]
    }
    return [analysisFilter];
});