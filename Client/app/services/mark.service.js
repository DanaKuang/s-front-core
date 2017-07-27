/**
 *
 */

define([], function() {
    'use strict';

    var mark = {
        ServiceType: "service",
        ServiceName: "mark",
        ServiceContent: [function() {

            this.show = function() {
                console.debug("TODO:动态在document body 加载mark");
                // alert("before");
                $('#_loginloadIcon').show();
            };

            this.hiden = function() {
                console.debug("TODO:从document body 把mark移除掉");
                // alert("after");
                $('#_loginloadIcon').hide();
                // $('#_loginIcon').fadeOut("fast");
            };
        }]
    };

    return [mark];
});