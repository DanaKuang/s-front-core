/**
 * Author: liubin
 * Create Date: 2017-07-29
 * Description: 日期
 */

define([], function () {
    var dateFormat = {
        ServiceType: "factory",
        ServiceName: "dayFilter",
        ServiceContent: ['$filter', function ($filter) {
            var DAY, daytime, year, month, day, hour, minute, second;

            // 初始化日期
            function init () {
                DAY = new Date();
                daytime = +DAY;
                year = DAY.getFullYear();
                month = DAY.getMonth() + 1;
                day = DAY.getDate();
                hour = DAY.getHours();
                minute = DAY.getMinutes();
                second = DAY.getSeconds();

                month  = month  < 10 ? '0' + month  : month;
                hour   = hour   < 10 ? '0' + hour   : hour;
                minute = minute < 10 ? '0' + minute : minute;
                second = second < 10 ? '0' + second : second;
            }
            // 今天
            function today (type) {
                init();
                var value = daytime;
                return filter()[type](value);
            }
            // 昨天
            function yesterday (type) {
                init();
                var value = daytime - 24 * 60 * 60 * 1000;
                return filter()[type](value);
            }
            // 明天
            function tomorrow (type) {
                init();
                var value = daytime + 24 * 60 * 60 * 1000;
                return filter()[type](value);
            }
            // 上周
            function beforeweek (type) {
                init();
                var value = daytime - 7 * 24 * 60 * 60 * 1000;
                return filter()[type](value);
            }
            // 下周
            function nextweek (type) {
                init();
                var value = daytime + 7 * 24 * 60 * 60 * 1000;
                return filter()[type](value);
            }
            // 下月
            function nextmonth (type) {
                init();
                var value = "";
                if (month == 12) {
                    value = '' + (year + 1) + '-01-' + day + ' ' + hour + ':' + minute + ':' + second;
                } else {
                    var m = Number(month) + 1 < 10 ? '0' + (Number(month) + 1)  : Number(month) + 1;
                    value = '' + year + '-' + m + '-' + day + ' ' + hour + ':' + minute + ':' + second;
                }
                return filter()[type](+new Date(value));
            }
            // 上月
            function beforemonth (type) {
                init();
                var value = "";
                if (month == 1) {
                    value = '' + (year - 1) + '-12-' + day + ' ' + hour + ':' + minute + ':' + second;
                } else {
                    var m = Number(month) - 1 < 10 ? '0' + (Number(month) - 1)  : Number(month) - 1;
                    value = '' + year + '-' + m + '-' + day + ' ' + hour + ':' + minute + ':' + second;
                }
                return filter()[type](+new Date(value));
            }
            // 几天前
            function beforenday (type, num) {
                init();
                var value = daytime - num * 24 * 60 * 60 * 1000;
                return filter()[type](value);
            }

            // 分组
            function minutearr (minute, num) {
                init();
                var result = [];
                var value = daytime;
                for (var i=0;i<num;i++) {
                    result.unshift(filter()['hours_minute'](value -= i*(minute/num)*60*1000));
                }
                return result;
            }

            function filter () {
                return {
                    datetime: function (value) {
                        return $filter('date')(value, 'yyyy-MM-dd HH:mm:ss');
                    },
                    date: function (value) {
                        return $filter('date')(value, 'yyyy-MM-dd');
                    },
                    year_month: function (value) {
                        return $filter('date')(value, 'yyyy-MM');
                    },
                    year: function (value) {
                        return $filter('date')(value, 'yyyy');
                    },
                    month: function (value) {
                        return $filter('date')(value, 'MM');
                    },
                    hours_minute: function (value) {
                        return $filter('date')(value, 'HH:mm');
                    }
                }
            }

            return {
                today: today,
                yesterday: yesterday,
                tomorrow: tomorrow,
                nextweek: nextweek,
                beforeweek: beforeweek,
                nextmonth: nextmonth,
                beforemonth: beforemonth,
                beforenday: beforenday,
                minutearr: minutearr
            };
        }]
    }
    return [dateFormat];
});