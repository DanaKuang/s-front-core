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
            startView = (type == 'month' ? 3 : (type == 'year' ? 3 : 2));
            minView = (type == 'month' ? 3 : (type == 'year' ? 3 : 2));
            $(ele).find('.date, .form_datetime').datetimepicker({
                'language': 'zh-CN',  //日期
                'format': format,
                'autoclose': true,
                'todayBtn': true,
                'minView': minView,
                'startView': startView,
                'endDate': dateFormatFilter.date(new Date())
            });
            return this;
        };
        dateSearch.init = function (ele, type, fn) {
            var that = this;
            type = type || 'year';
            // $(ele).find('select, .form_datetime').on('change', function (e, val) {
            //     that.dateConf(val, ele);
            // })
            that.dateConf(type, ele);
            return that;
        };

        return dateSearch;
    }

    nguisearch.factory('setDateConf', ['dateFormatFilter', nguisearchFn]);
});