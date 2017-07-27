/**
 * Author: liubin
 * Create Date: 2017-06-29
 * Description: 菜单加载服务
 * 只做左侧菜单选择和动画效果
 */
define([], function() {
    /**
     * 左侧导航菜单行为
     * @type {Object}
     */
    var menuService = {
        ServiceType: "service",
        ServiceName: "menuService",
        ServiceContent: ['$rootScope', function($rootScope) {
            this.animation = function() {
                // 设置视图区窗口高度
                function setContent () {
                    var height = window.innerHeight ||
                        document.documentElement.body.clientHeight ||
                        document.body.clientHeight;
                    // 50 顶部nav高度
                    $rootScope.windowHeight = '' + (height - 50) + 'px';
                }
                setContent();
                // 延时
                function throttle(method, context) {
                    clearTimeout(method.timer);
                    method.timer = setTimeout(function() {
                        method.call(context);
                    }, 100)
                }
                // 监听浏览器窗口变化
                window.onresize = function() {
                    throttle(setContent);
                }
            };
        }]
    };
    return menuService;
});