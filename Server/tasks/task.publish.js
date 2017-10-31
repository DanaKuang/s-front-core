/**
 * Author: liubin
 * Creat date: 2017-07-31
 * Description: 一键部署
 */
module.exports = function () {
    'use strict';
    var Q = require('q');
    var node_ssh = require('node-ssh');
    var build = require('./task.build');
    var colors = require('colors/safe');
    var exec = require('child_process').exec;
    var ips = [{
        host: '123.56.29.106',
        post: 22,
        user: 'root',
        dist: '/root',
        privateKey: '/Users/Kuang/.ssh/id_rsa'
    }];
    var SERVER = {
        172: {
            type: 'dev',
            host: '172.17.15.172',
            port: 22,
            user: '',
            dist: '/opt/webapps',
            privateKey: ''
        },
        173: {
            type: 'dev',
            host: '172.17.15.173',
            port: 22,
            user: '',
            dist: '/opt/webapps',
            privateKey: ''
        },
        174: {
            type: 'test',
            host: '172.17.15.174',
            port: 22,
            user: '',
            dist: '/opt/webapps',
            privateKey: ''
        }
    };
    if (!!process.argv[3] && SERVER[process.argv[3]]){
        ips.push(SERVER[process.argv[3]]);
    } else {
        process.stdout.write(colors.blue('\x20server required!\n'));
        process.stdout.write(colors.blue('\x20\x20\x20 node main pusblish 172\n'));
        process.stdout.write(colors.blue('\x20\x20\x20 node main pusblish 173\n'));
        process.stdout.write(colors.blue('\x20\x20\x20 node main pusblish 174\n'));
        return;
    }
    var center = new node_ssh();

    // 第一步 文件打包
    var firstStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('1、build: \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 building...\n'));
        build(function (file) {
            process.stdout.write(colors.blue('\x20\x20\x20 build successfully!\n'));
            deferred.resolve(file);
        });
        return deferred.promise;
    };

    // 第二步 将打包文件上传至中控
    var secondStep = function (file) {
        var deferred = Q.defer();
        process.stdout.write(colors.green('2、upload: \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 upload '+file.filename+' to '+ips[0].host+'...\n'));
        exec('scp ./dist/'+file.filename+' '+ips[0].user+'@'+ips[0].host+':'+ips[0].dist, function (error, stdout, stderr) {
            process.stdout.write(colors.blue('\x20\x20\x20 upload to '+ips[0].host+' successfully!\n'));
            deferred.resolve(file);
        });
        return deferred.promise;
    };

    // 第三步 连接中控机
    var thirdStep = function (file) {
        var deferred = Q.defer();
        process.stdout.write(colors.green('3、login: \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 login '+ips[0].host+'...\n'));
        center.connect({
            host: ips[0].host,
            port: ips[0].port,
            username: ips[0].user,
            privateKey: ips[0].privateKey
        }).then(function () {
            process.stdout.write(colors.blue('\x20\x20\x20 welcome to '+ips[0].host+'!\n'));
            deferred.resolve(file);
        });
        return deferred.promise;
    };

    // 第四步 解压文件
    var forthStep = function (file) {
        var deferred = Q.defer();
        process.stdout.write(colors.green('4、unzip: \n'));
        center.exec('unzip -o '+ips[0].dist+'/'+file.filename)
        .then(function (result) {
            process.stdout.write(colors.blue('\x20\x20\x20 unzip successfully!\n'));
            deferred.resolve(file);
        });
        return deferred.promise;
    };

    // 第五步 将文件拷贝到服务器
    var fifthStep = function (file) {
        var deferred = Q.defer();
        process.stdout.write(colors.green('5、copy: \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 copy data-front to '+ips[1].host+'!\n'));
        center.exec('scp -r '+ips[0].dist+'/data-front'+' '+ips[1].host+':'+ips[1].dist)
        .then(function (result) {
            process.stdout.write(colors.blue('\x20\x20\x20 copy successfully!\n'));
            deferred.resolve(file);
        });
        return deferred.promise;
    };

    // 第六步 删除打包文件
    var sixthStep = function (file) {
        var deferred = Q.defer();
        process.stdout.write(colors.green('6、del: \n'));
        center.exec('rm -rf '+file.filename+' '+'data-front/').then(function (result) {
            process.stdout.write(colors.blue('\x20\x20\x20 del successfully!\n'));
            deferred.resolve(true);
        });
        return deferred.promise;
    };

    // 第七步 成功提示
    var seventhStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('\x20PUBLISH SUCCESSFULLY!\n'));
        deferred.resolve(true);
        return deferred.promise;
    };

    // 错误处理
    var error_catch = function (error) {
        process.stdout.write(colors.red('Field!\n'));
        process.stdout.write(colors.red(error.message));
    };

    Q.fcall(firstStep)
    .then(secondStep)
    .then(thirdStep)
    .then(forthStep)
    .then(fifthStep)
    .then(sixthStep)
    .then(seventhStep)
    .catch(error_catch)
    .done();
};