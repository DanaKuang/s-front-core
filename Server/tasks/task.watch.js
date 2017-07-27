/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: 监控文件
 */
var port = 35729;
var Q = require('q');
var u = require('util');
var server = require('../server');

var livereload = require('gulp-livereload');

// 监听浏览器端口刷新页面
var first = function () {
  var deferred = Q.defer();
  livereload.listen({
      port: port,
      start: true
  });
  deferred.resolve(true); // 参数传递
  return deferred.promise;
};

//插件配置，目前实现自动打开浏览器
var second = function () {
  var deferred = Q.defer();
  var openBrower = function (opts) {
    opts.openBrower = function (serverURL) {
      // 根据传递参数是否为restart判断进程启动
      // var autoOpenBrower = process.argv[2] !== 'restart';
      process.stdout.write(u.inspect(opts));
      if (opts.autoOpenBrower) {
        require('open')(serverURL);
      }
    };
    return function (req, res, next) {
      next();
    }
  };

  deferred.resolve([openBrower]);
  return deferred.promise;
};

// 启动Web服务器
var third = function (plugins) {
  var deferred = Q.defer();
  server.start(plugins);
  deferred.resolve(true);
  return deferred.promise;
};

// 监听文件变化，代码审查，刷新浏览器
var forth = function () {
  var deferred = Q.defer();
  // TODO

  deferred.resolve(true);
  return deferred.promise;
};

// 异常打印处理
var error = function (error) {
  process.stdout.write(u.format('%s', error));
  console.log(error.message);
}

// TODO
Q.fcall(first)
 .then(second)
 .then(third)
 .then(forth)
 .catch(error)
 .done();
