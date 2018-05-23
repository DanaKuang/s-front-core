/**
 * Author: liubin
 * Create Date: 2017-08-23
 * Description: loading
 */

define([], function() {
    'use strict';
    // 接口调用
    var loadingPro = {
        ServiceType: "service",
        ServiceName: "loadingProgress",
        ServiceContent: [function() {
            var NProgress = require('nprogress');
            this.show = function() {
                NProgress.start();
            };

            this.hide = function() {
                NProgress.done();
            };
        }]
    };
    // 首屏加载
    var mark = {
        ServiceType: "service",
        ServiceName: "mark",
        ServiceContent: [function() {
            var NProgress = require('nprogress');
            this.show = function() {
                // console.log("TODO: 动态在document body 加载progress");
                NProgress.start();
            };

            this.hide = function() {
                // console.log("TODO: 动态在document body 移除progress");
                NProgress.done();
            };
        }]
    };
    return [loadingPro, mark];
});