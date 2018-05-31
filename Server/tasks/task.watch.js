/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: 监控文件
 */
var port = 35729;
var Q = require('q');
var u = require('util');
var gulp = require('gulp');
var sass = require('gulp-sass');
var server = require('../server');
var colors = require('colors/safe');
var easyMonitor = require('easy-monitor');
var livereload = require('gulp-livereload');
var autoOpenBrowser = process.argv[2] !== 'restart';

// 监听浏览器端口刷新页面
var first = function() {
    var deferred = Q.defer();
    livereload.listen({
        port: port,
        start: true
    });
    deferred.resolve(true); // 参数传递
    return deferred.promise;
};

//插件配置，目前实现自动打开浏览器
var second = function() {
    var deferred = Q.defer();

    // 是否自动打开浏览器
    var openBrower = function(opts) {
        opts.openBrower = function(serverURL) {
            if (autoOpenBrowser) {
                require('open')(serverURL);
            }
        };
        return function(req, res, next) {
            next();
        }
    };

    // 是否启用性能监控
    var openMonitor = function (opts) {
        if (opts.easyMonitor) {
            easyMonitor({
                project_name: 'saas service platform',
                http: {
                    prefix: '/monitor'
                }
            });
        }
        return function(req, res, next) {
            next();
        }
    };

    deferred.resolve([openBrower, openMonitor]);
    return deferred.promise;
};

// 启动Web服务器
var third = function(plugins) {
    var deferred = Q.defer();
    server.start(plugins);
    deferred.resolve(true);
    return deferred.promise;
};

// 监控配置文件变化，重启服务
var forth = function() {
    var deferred = Q.defer();
    // TODO
    gulp.watch([
        './config/**/*.yml',
        './app/**/*.js'
    ], function(event) {
        process.stdout.write(colors.green('\x20\x20CHNAGED FILE: [' + event.path + ']\n'));
        process.stdout.write(colors.green('\x20\x20 server is restarting...\n'));
        process.send('restart'); //重启服务器
    });
    deferred.resolve(true);
    return deferred.promise;
};

// 监控less文件变化，编译重新生成css
var fifth = function () {
    var deferred = Q.defer();
    // TODO
    gulp.watch([
        './assets/sass/**/*.scss'
    ], function (event) {
        process.stdout.write(colors.green('\x20\x20COMPILE FILE: [' + event.path + ']\n'));
        gulp.src(event.path)
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./assets/style'));
    });
    deferred.resolve(true);
    return deferred.promise;
};

// 异常打印处理
var error = function(error) {
    process.stdout.write(u.format('%s', error));
    console.log(error.message);
}

// TODO
Q.fcall(first)
  .then(second)
  .then(third)
  .then(forth)
  .then(fifth)
  .catch(error)
  .done();