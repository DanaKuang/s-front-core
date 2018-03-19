/**
 * Author: liubin
 * Create Date: 2018-03-19
 * Description: 日期获取
 */

// 以2018年01月01日为基准值 周一
// 获取当前时间是今年的第几周，开始时间及结束时间
// { 写个坑 }

define([], function() {

    var weekService = {
        ServiceType: "service",
        ServiceName: "weekService",
        ServiceContent: [function () {

            var standard = +new Date('2018-01-01 00:00:00');
            /**
             * [getWeeks description]
             * @param  {[type]} now [description]
             * @return {[type]}     [description]
             */
            function getWeeks(now) {

                now = now || +new Date;

                now = +new Date(now);

                // 如果当前日期小于基准值 不支持
                if (!now && now < standard) return ;

                // 一周的毫秒数
                var weeks = 7*24*60*60*1000;

                var weekTime, startTime, endTime;

                // 当前处于第几周
                weekTime = Math.ceil((now - standard)/weeks);
                // 一周的开始
                startTime = standard + (weekTime-1)*weeks;
                // 一周的结束
                endTime = standard + weekTime*weeks-1;

                return {
                    weekTime: weekTime,
                    startTime: startTime,
                    endTime: endTime,
                }
            }

            // 获取周数组
            function getWeekArr (now, num) {

                now = now || +new Date;

                now = +new Date(now);

                // 如果当前日期小于基准值 不支持
                if (!now && now < standard) return ;

                var ret = [];

                while(num > 0) {
                    --num;
                    ret.unshift(getWeeks(now-(num*7*24*60*60*1000)));
                }

                return ret;
            }

            return {
                getWeeks: getWeeks,
                getWeekArr: getWeekArr
            }
        }]
    }

    return weekService;
});