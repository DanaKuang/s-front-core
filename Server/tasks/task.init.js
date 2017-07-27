/**
 * Author: liubin
 * Create Date: 2017-07-03
 * Description: init
 */

module.exports = function () {
  'use strict';
  var dep = 'cd ../Server && npm install q && npm install colors';
  var exec = require('child_process').exec;

  // 依赖q和colors
  exec(dep, function (error, stdout, stderr) {
    var Q = require('q');
    var colors = require('colors/safe');

    // 安装npm依赖[不需要检查node是否安装]
    var check_npm = function (success) {
      var deferred = Q.defer();
      process.stdout.write(colors.green('\nSAAS-FRONT AUTO INSTALLED ON STEPS:\n\n'));
      process.stdout.write(colors.green('1): npm dependents installing...\n'));
      exec('cd ../Server && npm install', {
          stdio: 'inherit',
          shell: true
      }, function (error, stdout, stderr) {
        process.stdout.write(colors.blue('\x20\x20\x20 npm had installed.\n\n'));
        deferred.resolve(true);
      });
      return deferred.promise;
    };

    // 检查git安装
    var check_git = function (success) {
      var deferred = Q.defer();
      process.stdout.write(colors.green('2): git checking...\n'));
      exec('git --version', function (error, stdout, stderr) {
        if (/^git version/.test(stdout)) {
          process.stdout.write(colors.blue('\x20\x20\x20 git had installed.\n\n'));
          deferred.resolve(true);
        } else {
          process.stdout.write(colors.red('\x20\x20\x20 please install git form url: https://git-scm.com/\n'));
          deferred.reject(false);
        }
      });
      return deferred.promise;
    };

    // 检查bower安装
    var check_bower = function (success) {
      var deferred = Q.defer();
      process.stdout.write(colors.green('3): bower checking...\n'));
      exec('bower --version', function (error, stdout, stderr) {
        if (/[0-9].[0-9].[0-9]/.test(stdout)) {
          process.stdout.write(colors.blue('\x20\x20\x20 bower had installed.\n\n'));
          deferred.resolve(true);
        } else {
          process.stdout.write(colors.red('\x20\x20\x20 bower is undefined!\n'));
          process.stdout.write(colors.green('\x20\x20\x20 bower installing...\n'));
          exec('npm install bower -g', function (error, stdout, stderr) {
            process.stdout.write(colors.blue('\x20\x20\x20 bower is installed.\n'));
            deferred.resolve(true);
          });
        }
      });
      return deferred.promise;
    };

    // 安装bower依赖
    var bower_install = function () {
      var deferred = Q.defer();
      process.stdout.write(colors.green('4): bower dependents installing...\n'));
      exec('cd ../Client && bower install', function (error, stdout, stderr) {
        process.stdout.write(colors.blue('\x20\x20\x20 successfully!\n'));
        deferred.resolve(true);
      });
      return deferred.promise;
    }

    // 启动项目
    var start_main = function () {
      var deferred = Q.defer();
      process.stdout.write(colors.green('5): For starting this project, please write command line follow: \n'));
      process.stdout.write(colors.green('\x20\x20\x20 node main.js [default]\n\n'));
      return deferred.promise;
      deferred.resolve(true);
    };

    // 错误处理
    var catch_err = function (error) {
      process.stdout.write(colors.red.blod('Field!\n'));
      process.stdout.write(colors.red(error.message));
    };

    Q.fcall(check_npm)
     .then(check_git)
     .then(check_bower)
     .then(bower_install)
     .then(start_main)
     .catch(catch_err);

  });
}
