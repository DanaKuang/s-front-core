/**
 * Author: liubin
 * Create Date: 2017-07-20
 * Description: analysisfilter
 */
define([], function () {
    var analysisFilter = {
        ServiceType: "factory",
        ServiceName: "limitlengthFilter",
        ServiceContent: ['$filter', function ($filter) {
            function limitLength(value,max){
                if(value != null){
                    if(max == undefined || max == null){
                        max = 8;
                    }
                    if (value.length <= max){
                        return value;
                    }else{
                        value = value.substr(0, max);
                        return value +  '…';
                    }
                }
            }

            return angular.extend({
                __filter__: $filter,
                limitLength : limitLength
            });
        }]
    };
    return [analysisFilter];
});