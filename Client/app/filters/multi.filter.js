/**
 * Author: liubin
 * Create Date: 2017-07-20
 * Description: 多维数据格式化
 */
define([], function () {
    var multiFilter = {
        ServiceType: "factory",
        ServiceName: "multiFilter",
        ServiceContent: ['$filter', function ($filter) {
            function formatList (data) {
                var result = [];
                data = data || [];
                _.each(data, function (d) {
                    var r = '';
                    d['startTime']    && (r += d.startTime    + '-');
                    d['endTime']      && (r += d.endTime      + '+');
                    d['productBrand'] && (r += d.productBrand + '+');
                    d['productName']  && (r += d.productName  + '+');
                    d['productPack']  && (r += d.productPack  + '+');
                    d['saleZone']     && (r += d.saleZone     + '+');
                    d['provinceName'] && (r += d.provinceName + '+');
                    d['cityName']     && (r += d.cityName     + ' ');
                    result.push({temp: r});
                });
                return result;
            }
            return angular.extend({
                __filter__: $filter,
                list: formatList
            });
        }]
    }
    return [multiFilter];
});