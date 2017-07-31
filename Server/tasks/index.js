/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: task index
 */

module.exports = function () {
  'use strict';
  return {
    'help': require('./task.help'),         // 帮助
    'init': require('./task.init'),         // 初始化项目安装依赖
    'build': require('./task.build'),       // 文件打包
    'commit': require('./task.commit'),     // 文件打包
    'destroy': require('./task.destroy'),   // **
    'publish': require('./task.publish'),   // 打包发布
    'default': require('./task.default')    // 默认启用项目
  }
}