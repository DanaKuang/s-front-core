/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: 一键打包
 */
/**
 * [exports description]
 * @return {[type]} [description]
 */
module.exports = function (callback) {
    'use strict';
    var O = 'data-front';
    var Q = require('q');
    var del = require('del');
    var gulp = require('gulp');
    var path = require('path');
    var zip = require('gulp-zip');
    var rjs = require('gulp-requirejs');
    var uglify = require('gulp-uglify');
    var rename = require('gulp-rename');
    var colors = require('colors/safe');
    var dateFormat = require('dateformat');
    var imagemin = require('gulp-imagemin');
    var minifyCss = require('gulp-minify-css');
    var pngquant = require('imagemin-pngquant');
    var minifyJson = require('gulp-jsonminify');
    var minifyHtml = require('gulp-minify-html');
    var zipfile = O + '-' + dateFormat(new Date(), "yyyy-mm-dd-HH-MM-ss") + '.zip';

    // 第一步 删除目标文件夹
    var firstStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('01): del -> \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 del dist\n'));
        del(['dist'], {force: true}, function (error, stdout, stderr) {
            process.stdout.write(colors.blue('\x20\x20\x20 del dist successfully!\n'));
            deferred.resolve(true);
        });
        return deferred.promise;
    };

    // 第二步 复制要压缩的项目
    var secondStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('02): copy -> \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 copy !doc/*\n'));
        process.stdout.write(colors.blue('\x20\x20\x20 copy !logs/*\n'));
        process.stdout.write(colors.blue('\x20\x20\x20 copy !bower_components/*\n'));
        gulp.src(['./**', '!bower_components/**/*', '!logs/**/*', '!doc/**/*', '!assets/sass/*'])
            .pipe(gulp.dest('dist/'+ O +'/Client'))
            .on('finish', function () {
                process.stdout.write(colors.blue('\x20\x20\x20 copy js successfully!\n'));
                deferred.resolve(true);
            }).on('error', function (error) {
                process.stdout.write(colors.red('\x20\x20\x20 copy js field!\n'));
                deferred.reject(new Error(error));
            });
        return deferred.promise;
    };

    // 第三步 压缩app目录文件
    var thirdStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('03)：app -> \n'));
        rjs({
            baseUrl: process.cwd() + '/dist/'+ O +'/Client/app',
            name: "app",
            out: "app.min.js"
        }).pipe(uglify())
        .pipe(gulp.dest(process.cwd() + '/dist/'+ O +'/Client/app'));
        process.stdout.write(colors.blue('\x20\x20\x20 uglify app successfully!\n'));
        return true;
    };

    // 第四步 删除app下的脚步文件,重命名app.min
    var forthStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.blue('\x20\x20\x20 del !app.min, app/* \n'));
        del([
            'dist/'+ O +'/Client/app/controllers',
            'dist/'+ O +'/Client/app/directives',
            'dist/'+ O +'/Client/app/services',
            'dist/'+ O +'/Client/app/filters',
            'dist/'+ O +'/Client/app/models',
            'dist/'+ O +'/Client/app/app.js',
        ], {force: true}, function (error, stdout, stderr) {
            gulp.src('dist/'+ O +'/Client/app/app.min.js')
                .pipe(rename('app.js'))
                .pipe(gulp.dest('dist/'+ O +'/Client/app'))
                .on('finish', function () {
                    process.stdout.write(colors.blue('\x20\x20\x20 del app/* successfully!\n'));
                    del(['dist/'+ O +'/Client/app/app.min.js'], {force: true}, function (error, stdout, stderr) {
                        process.stdout.write(colors.blue('\x20\x20\x20 del app.min successfully!\n'));
                        deferred.resolve(true);
                    });
                }).on('error', function (error) {
                    process.stdout.write(colors.red('\x20\x20\x20 del app/* field!\n'));
                    deferred.reject(new Error(error));
                });
        });
        return deferred.promise;
    };

    // 第五步 将html模版文件压缩
    var fifthStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('04)：templates -> \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 minify template html \n'));
        gulp.src('dist/'+ O +'/Client/components/templates/**.tpl.html')
            .pipe(minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe(gulp.dest('dist/'+ O +'/Client/components/templates'))
            .on('finish', function () {
                process.stdout.write(colors.blue('\x20\x20\x20 minify template html successfully!\n'));
                deferred.resolve(true);
            })
            .on('error', function () {
                process.stdout.write(colors.red('\x20\x20\x20 minify template html field!\n'));
                deferred.reject(new Error(error));
            });
        return deferred.promise;
    };

    // 第六步 将views下的html压缩
    var sixthStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('05)：views -> \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 minify views html \n'));
        gulp.src('dist/'+ O +'/Client/views/**/**.html')
            .pipe(minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe(gulp.dest('dist/'+ O +'/Client/views/'))
            .on('finish', function () {
                process.stdout.write(colors.blue('\x20\x20\x20 minify views html successfully!\n'));
                deferred.resolve(true);
            })
            .on('error', function () {
                process.stdout.write(colors.red('\x20\x20\x20 minify views html field!\n'));
                deferred.reject(new Error(error));
            });
        return deferred.promise;
    };

    // 第七步 将data下的json压缩
    var seventhStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('06)：data -> \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 minify data json \n'));
        gulp.src('dist/'+ O +'/Client/datas/**/**.json')
            .pipe(minifyJson())
            .pipe(gulp.dest('dist/'+ O +'/Client/datas/'))
            .on('finish', function () {
                process.stdout.write(colors.blue('\x20\x20\x20 minify json successfully!\n'));
                deferred.resolve(true);
            })
            .on('error', function () {
                process.stdout.write(colors.red('\x20\x20\x20 minify json field!\n'));
                deferred.reject(new Error(error));
            });
        return deferred.promise;
    };

    // 第八步 压缩图片
    var eighthStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('07)：images -> \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 minify images \n'));
        gulp.src('dist/'+ O +'/Client/assets/image/*.{png,jpg,gif,ico}')
            .pipe(imagemin({
                optimizationLevel: 7,   //类型：Number  默认：3  取值范围：0-7（优化等级）
                progressive: true,      //类型：Boolean 默认：false 无损压缩jpg图片
                interlaced: true,       //类型：Boolean 默认：false 隔行扫描gif进行渲染
                multipass: true,        //类型：Boolean 默认：false 多次优化svg直到完全优化
                svgoPlugins: [{
                    removeViewBox: false
                }],                     //不要移除svg的viewbox属性
                use: [pngquant()]       //使用pngquant深度压缩png图片的imagemin插件
            }))
            .pipe(gulp.dest('dist/'+ O +'/Client/assets/image'))
            .on('finish', function () {
                process.stdout.write(colors.blue('\x20\x20\x20 minify images successfully!\n'));
                deferred.resolve(true);
            })
            .on('error', function () {
                process.stdout.write(colors.red('\x20\x20\x20 minify images field!\n'));
                deferred.reject(new Error(error));
            });
        return deferred.promise;
    };

    // 第九步 压缩css样式文件
    var ninthStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('08)：css -> \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 minify css \n'));
        gulp.src('dist/'+ O +'/Client/assets/style/*.css')
            .pipe(minifyCss({
                advanced: true,           //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
                compatibility: 'ie8',     //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
                keepBreaks: false,        //类型：Boolean 默认：false [是否保留换行]
                keepSpecialComments: '*'  //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
            }))
            .pipe(gulp.dest('dist/'+ O +'/Client/assets/style'))
            .on('finish', function () {
                process.stdout.write(colors.blue('\x20\x20\x20 minify css successfully!\n'));
                deferred.resolve(true);
            })
            .on('error', function () {
                process.stdout.write(colors.red('\x20\x20\x20 minify css field!\n'));
                deferred.reject(new Error(error));
            });
        return deferred.promise;
    };

    // 第十步 处理libs下的js文件
    var tenthStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('09)：libs -> \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 minify libs \n'));
        gulp.src('dist/'+ O +'/Client/assets/libs/*.js')
            .pipe(uglify())
            .pipe(gulp.dest('dist/'+ O +'/Client/assets/libs'))
            .on('finish', function () {
                process.stdout.write(colors.blue('\x20\x20\x20 minify libs successfully!\n'));
                deferred.resolve(true);
            })
            .on('error', function () {
                process.stdout.write(colors.red('\x20\x20\x20 minify libs field!\n'));
                deferred.reject(new Error(error));
            });
        return deferred.promise;
    };

    // 第十一步 处理登录/首页 html
    var eleventhStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('10)：login/index -> \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 minify login/index html \n'));
        // index 压缩后 include问题，暂时未解决
        gulp.src(['dist/'+ O +'/Client/*.html', '!dist/'+ O +'/Client/index.html'])
            .pipe(minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe(gulp.dest('dist/'+ O +'/Client'))
            .on('finish', function () {
                process.stdout.write(colors.blue('\x20\x20\x20 minify login/index html successfully!\n'));
                deferred.resolve(true);
            })
            .on('error', function () {
                process.stdout.write(colors.red('\x20\x20\x20 minify login/index html field!\n'));
                deferred.reject(new Error(error));
            });
        return deferred.promise;
    };

    // 第十二步 拷贝Server
    var twelvethStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('11)：Server -> \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 copy Server \n'));
        gulp.src(['../Server/**', '!../Server/node_modules/**/*', '!../Server/README.md'])
            .pipe(gulp.dest('dist/'+ O +'/Server'))
            .on('finish', function () {
                process.stdout.write(colors.blue('\x20\x20\x20 copy Server successfully!\n'));
                deferred.resolve(true);
            })
            .on('error', function () {
                process.stdout.write(colors.red('\x20\x20\x20 copy Server field!\n'));
                deferred.reject(new Error(error));
            });
        return deferred.promise;
    };

    // 第十三步 压缩Server下的js
    var thirteenthStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('12)：Server -> \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 minify js \n'));
        gulp.src('dist/'+ O +'/Server/**/*.js')
            .pipe(uglify())
            .pipe(gulp.dest('dist/'+ O +'/Server'))
            .on('finish', function () {
                process.stdout.write(colors.blue('\x20\x20\x20 minify Server successfully!\n'));
                deferred.resolve(true);
            })
            .on('error', function () {
                process.stdout.write(colors.red('\x20\x20\x20 minify Server field!\n'));
                deferred.reject(new Error(error));
            });
        return deferred.promise;
    };

    // 第十四步 打包zip
    var forteenthStep = function () {
        var deferred = Q.defer();
        process.stdout.write(colors.green('13)：zip -> \n'));
        process.stdout.write(colors.blue('\x20\x20\x20 zip packing... \n'));
        gulp.src([
            'dist/**',
            '!dist/'+ O +'/Client/doc/**/*',
            '!dist/'+ O +'/Client/logs/**/*',
            '!dist/'+ O +'/Client/bower_components/**/*',
            '!dist/'+ O +'/Server/README.md',
            '!dist/'+ O +'/Server/node_modules/**/*'
        ])
        .pipe(zip(zipfile))
        .pipe(gulp.dest('dist'))
        .on('finish', function () {
            process.stdout.write(colors.blue('\x20\x20\x20 zip packed successfully!\n'));
            // 觉得删除不好，保留
            // del('dist/'+ O +'', {force: true}, function (error, stdout, stderr) {
            //     process.stdout.write(colors.blue('\x20\x20\x20 del '+ O +' successfully!\n'));
            //     process.stdout.write(colors.green('\x20\x20\x20 BUILD SUCCESSFULLY!\n'));
            //     deferred.resolve(true);
            // });
            deferred.resolve(true);
            !!callback && callback({
                filepath: path.join(process.cwd(), '/dist/'+zipfile),
                filename: zipfile
            });
        })
        .on('error', function () {
            process.stdout.write(colors.red('\x20\x20\x20 zip packed field!\n'));
            deferred.reject(new Error(error));
        });
        return deferred.promise;
    };

    // 错误处理
    var error_catch = function (error) {
        process.stdout.write(colors.red('Field!\n'));
        process.stdout.write(colors.red(error.message));
    };

    // run
    Q.fcall(firstStep)
     .then(secondStep)
     .then(thirdStep)
     .then(forthStep)
     .then(fifthStep)
     .then(sixthStep)
     .then(seventhStep)
     .then(eighthStep)
     .then(ninthStep)
     .then(tenthStep)
     .then(eleventhStep)
     .then(twelvethStep)
     .then(thirteenthStep)
     .then(forteenthStep)
     .catch(error_catch)
     .done();
}