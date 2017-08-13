/**
 * Author: liubin
 * Create Date: 2017-07-07
 * Description: destroy
 */

module.exports = function () {
    var Q = require('q');
    var del = require('del');
    var colors = require('colors/safe');

    // 第一步
    var first_step = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.red('\x20 project destroying...\n'));
        process.stdout.write(colors.red('\x20\x20 1): Client->\n'));
        del(['./*'], {force: true}, function (error, stdout, stderr) {
            process.stdout.write(colors.green('\x20\x20\x20 successfully!\n'));
            deferred.resolve(true);
        });
        return deferred.promise;
    };

    // 第二步
    var second_step = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.red('\x20\x20 2): Server->\n'));
        del(['../Server/*'], {force: true}, function (error, stdout, stderr) {
            process.stdout.write(colors.green('\x20\x20\x20 successfully!\n'));
            deferred.resolve(true);
        });
        return deferred.promise;
    };

    // 第三步
    var third_step = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('\x20 project destroyed!\n'));
        return deferred.promise;
    };

    // 错误处理
    var catch_err = function (error) {
        process.stdout.write(colors.red.blod('Field!\n'));
        process.stdout.write(colors.red(error.message));
    };

    Q.fcall(first_step)
     .then(second_step)
     .then(third_step)
     .catch(catch_err);
}
