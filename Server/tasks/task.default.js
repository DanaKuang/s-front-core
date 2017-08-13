/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: default
 */

module.exports = function () {
  'use strict';

  var colors = require('colors/safe');
  var watch = __dirname + '/task.watch.js';
  var content = require('child_process').fork(watch);

  // 线程重启函数
  var reStart = function (msg) {
    if (msg === 'restart') {
      content.kill('SIGINT');
      content = require('child_process').fork(watch, ['restart']);
      process.stdout.write(colors.green('\nReceived RESTART, restarting...\n'));
      content.on('message', function (msg) {
        reStart(msg);
      });
    }
  };

  // 监听线程重启
  content.on('message', function (msg) {
    reStart(msg);
  });

  // 系统结束指令[ctrl + c]
  process.on('SIGINT', function () {
    content.kill('SIGINT');
    process.stdout.write(colors.red('\nReceived SIGINT, process was exited.\n'));
    process.exit();
  });
}