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
            function nav (data) {
                data = data || [];
                return _.groupBy(data, 'parentCode')['0'];
            }
            // 菜单
            function menu (data) {
                data = data || [];
                return data;
            }
            return angular.extend({
                __filter__: $filter,
                nav: nav,
                menu: menu
            });
        }]
    }
    return [menuFilter];
});