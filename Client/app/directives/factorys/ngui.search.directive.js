/**
 * Author: liubin
 * Create Date: 2017-07-11
 * Description: search
 */

define([], function () {
    var nguisearch = angular.module('ngui.search', []);

    // 服务方法
    var nguisearchFn = function (dateFormatFilter) {
        var dateSearch = {};
        dateSearch.dateConf = function (type, ele) {
            var format = '',
                minView = '';
            format = (type == 'month'?'yyyy-mm':(type == 'year'?'yyyy':'yyyy-mm-dd'));
            minView = (type == 'month' ? 2 : (type == 'year' ? 3 : 2));
            $(ele).find('.date').datetimepicker({
                language:  'zh-CN',  //日期
                format: format,
                autoclose: true,
                todayBtn: true,
                minView: minView,
                endDate: dateFormatFilter.date(new Date()),
                pickerPosition: "bottom-left"
            });
            return this;
        };
        dateSearch.init = function (ele, type) {
            type = type || 'year';
            $(ele).find('select').on('chnage', function (e, val) {
                this.dateConf(val, ele);
            })
            this.dateConf(type, ele);
            return this;
        };

        return dateSearch;
    }

    nguisearch.factory('setDateConf', ['dateFormatFilter', nguisearchFn]);
});