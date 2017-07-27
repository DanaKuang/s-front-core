/**
 * Author: liubin
 * Create Date: 2017-07-03
 * Description: commit
 */

module.exports = function () {
  const del = require('del');

  var Q = require('q');
  var colors = require('colors/safe');
  var exec = require('child_process').exec;

  // 删除不需要提交的目录
  var del_dir = function () {
    var deferred = Q.defer();
    process.stdout.write(colors.green('1): del-> \n'));
    process.stdout.write(colors.blue('\x20\x20\x20 del logs\n'));
    process.stdout.write(colors.blue('\x20\x20\x20 del node_modules\n'));
    process.stdout.write(colors.blue('\x20\x20\x20 del bower_components\n'));
    del(['./logs', '../Server/node_modules', 'bower_components'], {force: true}, function (error, stdout, stderr) {
      process.stdout.write(colors.green('\x20\x20\x20 successfully!\n'));
      deferred.resolve(true);
    });
    return deferred.promise;
  }

  // 检查git是否安装
  var check_git = function () {
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
  }

  // 代码提交到git
  var git_commit = function () {
    var deferred = Q.defer();
    process.stdout.write(colors.green('3): git committing...\n'));
    exec('cd .. && git add .', function (error, stdout, stderr) {
      process.stdout.write(colors.blue('\x20\x20\x20 git add .\n'));
      var params = process.argv[3];
      process.stdout.write(colors.blue('\x20\x20\x20 git commit -m "'+params+'"\n'));
      if (!params) {
        process.stdout.write(colors.red('\x20\x20\x20 commit needs logs.\n'));
        deferred.reject(false);
      } else {
        exec('git commit -m "'+params+'"', function (error, stdout, stderr) {
          process.stdout.write(colors.blue('\x20\x20\x20 git push -u origin master\n'));
          exec('git push -u origin master', function (error, stdout, stderr) {
            process.stdout.write(colors.green('\x20\x20\x20 commit successfully!\n'));
            return deferred.resolve(true);
          });
        });
      }
    });
    return deferred.promise;
  }

  // 错误处理
  var catch_err = function (error) {
    process.stdout.write(colors.red.blod('Field!\n'));
    process.stdout.write(colors.red(error.message));
  };

  Q.fcall(del_dir)
   .then(check_git)
   .then(git_commit)
   .catch(catch_err);
}
