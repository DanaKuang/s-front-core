/**
 * Author: liubin
 * Create Date: 2017-07-18
 * Description: modal
 */
define([], function () {
    var nguimodal = angular.module('ngui.modal', []);

    // 模态框创建函数
    var nguimodalFn = function (modal, util) {
        var defaults = {
            tpl: '/modal.tpl.html',         // 模版文件
            modalid: '',                    // 生成modalid
            style: '',                      // 添加样式class
            header: {},                     // 头部内容title等
            body: {},                       // boday
            footer: false                   // 是否显示footer
        };
        var defineObj = {
            restrict: 'AE',
            replace: true,
            transclude: true,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.tpl || defaults.tpl;
            },
            scope: {
                conf: '='
            },
            link: linkFn
        }

        function linkFn(scope, element, attrs) {
            defaults.modalid += defaults.modalid ? "" : "modal_" + +new Date + '_' + Math.random().toFixed(4)*10000;
            scope.conf = scope.conf || {};
            util.uiExtend(scope, scope.conf, defaults, attrs, ['modalid','style']);
            // 生成模态框
            modal.create(scope, element, attrs, defaults);

            //modal的head
            if (scope.conf.header && !scope.conf.header.title) {
                scope[scope.conf.header.tabsConf] = scope.conf.header.tabsBar;
            }
            //监视scope.conf的改变 更新scope
            scope.$watch('conf', function() {
                util.uiExtend(scope, defaults, attrs, scope.conf, ['header', 'body', 'footer', 'modalid', 'style']); // 填充数据到scope
            }, true);
            //备份模态框内容，用于隐藏模态框后恢复初始化
            scope.initConf = angular.copy(scope.conf);
            scope.reCreate = function() {
                scope.conf = angular.copy(scope.initConf);
            }
        }
        return defineObj;
    };

    // 模态框指令函数
    var createModalFn = function (util) {
        var modal = {};
        function reModal (scope, element, attrs, defaults) {
            // 获取模板 编译并链接
            var tpl = defaults.tpl,
                modalEle;
            // 往scope填充数据
            util.uiExtend(scope, defaults, attrs, scope.conf, ['modalid', 'style']);

            function initModal() {
                modalEle = element;
                //bootstrapjs插件依赖jquery
                modalEle = $(modalEle).modal({
                    backdrop: "static",
                    show: attrs.isShow || false
                });

                //避免多个半透明黑色遮罩
                modalEle.on('shown.bs.modal', function() {
                    $('body .modal-backdrop').length > 1 && $('body .modal-backdrop:last').remove();
                });
                modalEle.trigger('shown.bs.modal');

                //bind events
                modalEle.on('show.bs.modal', function(e) {
                    scope.conf.showCall && scope.conf.showCall();
                });

                // 关闭隐藏
                modalEle.on('hide.bs.modal', function(e) {
                    scope.conf.hideCall && scope.conf.hideCall();
                });

                // 关闭隐藏
                modalEle.on('hidden.bs.modal', function(e) {
                    scope.conf.hiddenCall && scope.conf.hiddenCall();
                });

                //手动关闭弹出框
                scope.closeModal = function() {
                    $("#" + scope.modalid).modal("hide");
                    event.stopPropagation();
                };

                //手动打开弹出窗
                scope.openModal = function() {
                    $("#" + scope.modalid).modal("show");
                    event.stopPropagation();
                };

                //关闭，取消事件
                scope.closeEvn = function() {
                    $("#" + scope.modalid).modal("hide");
                    event.stopPropagation();
                };
            }

            //初始化模态框
            initModal();
        }
        modal.create = reModal;
        return modal;
    };
    // 创建模态框
    nguimodal.factory('createModal', ['util', createModalFn]);
    // 模态框指令
    nguimodal.directive('saModal', ['createModal', 'util', nguimodalFn]);
});