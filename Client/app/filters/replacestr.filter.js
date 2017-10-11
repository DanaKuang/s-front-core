/**
 * Author: zhaobaoli
 * Create Date: 2017-10-10
 * Description: analysisfilter
 */
define([], function () {
    var replacestrFilter = {
        ServiceType: "factory",
        ServiceName: "replacestrFilter",
        ServiceContent: ['$filter', function ($filter) {
            function replaceStr(value){
                var valStr = value;
                var filterStr = valStr.substr(0, 2) + 'xxxxxxxxxxxxxxxxxxxx' + valStr.substr(valStr.length-2);
                return filterStr;
            }

            return angular.extend({
                __filter__: $filter,
                replaceStr : replaceStr
            });
        }]
    };
    return [replacestrFilter];
});