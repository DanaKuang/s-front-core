/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: Web容器入口
 */

module.exports.start = function () {
    'use strict';

    //任务列表
    var tasks = require('./tasks')();

    !0
    && !!process.argv[2]
    && !tasks[process.argv[2]]
    && tasks['help']();
    !0
    && (!process.argv[2]
    || !!tasks[process.argv[2]])
    && tasks[process.argv[2]
    || 'default']();
}