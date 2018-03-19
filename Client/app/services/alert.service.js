/**
 * Author: liubin
 * Create Date: 2018-02-23
 * Description: alert
 */
define([], function () {
    'use strict';
    var alertService = {
        ServiceType: "service",
        ServiceName: "alertService",
        ServiceContent: [function() {

            function newTmpl (type, txt) {
                var TypeTmpl = '';
                if(!~['success', 'warning', 'error'].indexOf(type)) {
                    type = 'success';
                }
                var ClosTmpl = '<a href="#" class="close" data-dismiss="alert">&times</a>';
                txt = txt || '';
                switch (type) {
                    case 'success':
                        TypeTmpl += '<li class="alert alert-success">';
                        TypeTmpl += '<strong>成功！</strong>'+txt+'</li>'
                        break;
                    case 'warning':
                        TypeTmpl += '<li class="alert alert-warning">';
                        TypeTmpl += '<strong>警告！</strong>'+txt+'</li>'
                        break;
                    case 'error':
                        TypeTmpl += '<li class="alert alert-error">';
                        TypeTmpl += '<strong>错误！</strong>'+txt+'</li>'
                        break;
                }
                return $(TypeTmpl).prepend(ClosTmpl);
            }


            function show ($alert) {
                $($alert).animate({
                    top: "+=80",
                    opacity: 1
                }, 200);
            }

            function hide ($alert) {
                $($alert).animate({
                    top: "-=80",
                    opacity: 0.3
                }, 200, function () {
                    $alert.remove();
                });
            }

            // 入口
            this.alert = function (txt, type) {
                var $alert = new newTmpl(type, txt);
                $('#common_alert').prepend($alert);
                show($alert);
                setTimeout(function () {
                    hide($alert);
                }, 5000);
            };
            this.success = function () {
                this.alert(txt, 'success');
            };
            this.warning = function () {
                this.alert(txt, 'warning');
            };
            this.error = function () {
                this.alert(txt, 'error');
            };
        }]
    };

    return alertService;
});