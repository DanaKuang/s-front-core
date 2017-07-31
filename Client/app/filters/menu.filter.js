/**
 * Author: liubin
 * Create Date: 2017-07-20
 * Description: 菜单格式化
 */
define([], function () {
    var menuFilter = {
        ServiceType: "factory",
        ServiceName: "menuFilter",
        ServiceContent: ['$filter', function ($filter) {
            function menuFormat (data) {
                data = data || [];
                var result = [], keyValue = "", keys = "";
                keyValue = _.groupBy(data, 'parentCode');
                keys = _.keys(keyValue);
                result = keyValue['0'];
                _.each(result, function (k, v) {

                });

                return result;
            }
            return angular.extend({
                __filter__: $filter,
                menuFormat: menuFormat
            });
        }]
    }
    return [menuFilter];
});