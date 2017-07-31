/**
 * Author: {author}
 * Create Date: 2017-07-04
 * Description: visit
 */

define([], function () {
    var visitController = {
        ServiceType: 'controller',
        ServiceName: 'VisitCtrl',
        ViewModelName: 'visitViewModel',
        ServiceContent: ['$scope', 'setDateConf', '$timeout', function ($scope, setDateConf, $timeout) {
            setDateConf.init($(".agree-date"), 'day');
            var stattime = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + (new Date().getDate() - 1);
            $(".date").find("input").val(stattime);
            var $model = $scope.$model;
            //页面默认加载配置
            var deafaultCou = {
                "startTime": stattime,
                "awardName": "",
                "cityName": ""
            };
            var Deafault = _.cloneDeep(deafaultCou);
            Deafault.page = 1;
            Deafault.pageSize = 10;
            var allpage;  //计算总页数
            var up = {};  //更新数据

            //箭头点击
            $(".visit_table tbody").on("click", "span", function () {
                $(".visit-list").hide();
                $(this).siblings(".visit-list").show();
            });
            //更新
            $(".visit_table tbody").on("click", "li", function () {
                up = {
                    "id": $(this).parent().parent().attr("data-id"),
                    "feedbackStatus": ""
                }
                if ($(this).text() === "待核实") {
                    up.feedbackStatus = 1;
                } else if ($(this).text() === "已核实") {
                    up.feedbackStatus = 2;
                } else if ($(this).text() === "不属实") {
                    up.feedbackStatus = 3;
                } else if ($(this).text() === "联系不上") {
                    up.feedbackStatus = 4;
                }
                ;
                // console.log(up);
                $(".visit-list").hide();
                //global.getFeed(Deafault);
            });

            //模态框点击
            $("#myModal").modal({
                "backdrop": "static",
                "show": false
            })
            $scope.cancel = function () {
                $("#myModal").modal("hide");
            }
            $scope.sure = function () {
                $("#myModal").modal("hide");
                global.update(up);
            }

            //回复状态点击
            $('.visit-list li').click(function () {
                $(".visit-list").hide();
                // console.log($(this).text());
            })

            //查询
            $scope.search = function ($event) {
                var that = $event.target;
                if (!$(that).hasClass("gray_btn")) {
                    $(that).addClass("gray_btn");
                    deafaultCou = {};
                    Deafault = {};
                    deafaultCou = {
                        "startTime": $(".visit_start").find(".date").data().date ?
                            $(".visit_start").find(".date").data().date : $(that).siblings(".visit_start").find("input").val(),
                        "awardName": $(".visit_award input").val(),
                        "cityName": $(".visit_city input").val(),
                        "endTime": $(".visit_end").find(".date").data().date ?
                            $(".visit_end").find(".date").data().date : $(that).siblings(".visit_end").find("input").val()
                    };
                    Deafault = _.cloneDeep(deafaultCou)
                    Deafault.page = 1;
                    Deafault.pageSize = 10;
                    global.getFeed(Deafault);
                    global.feedBack(deafaultCou);
                }
            }

            var global = {
                //回访记录
                "getFeed": function (params) {
                    console.log(1);
                    $model.$getFeed(params).then(function (res) {
                        $(".visit_table tbody").html("");
                        var res = res.data || [];
                        for (var i = 0; i < res.length; i++) {
                            var feedback = res[i].feedbackStatus;
                            var Class;
                            if (feedback === 1) {
                                feedback = "待核实";
                                Class = "arrow";
                            } else if (feedback === 2) {
                                feedback = "已核实";
                                Class = "xiao";
                            } else if (feedback === 3) {
                                feedback = "不属实";
                                Class = "xiao";
                            } else if (feedback === 4) {
                                feedback = "联系不上";
                                Class = "xiao";
                            }
                            if (res[i].wechatName === null) {
                                res[i].wechatName = "";
                            };
                            $(".visit_table tbody").append(
                                "<tr> " +
                                "<td class='mobile'>" + res[i].mobile + "</td> <td class='wechat'>" +
                                res[i].wechatName + "</td> <td class='stat_time'>" +
                                res[i].statTime + "</td> <td class='cityName'>" +
                                res[i].cityName + "</td> <td class='award'>" +
                                res[i].awardName + "</td> <td data-id=" + res[i].id + "> " +
                                feedback +
                                " <span class='" + Class + "'></span> <ul class='visit-list'> <li data-toggle='modal' data-target='#myModal'>待核实</li> <li data-toggle='modal' data-target='#myModal'>已核实</li> <li data-toggle='modal' data-target='#myModal'>不属实</li> <li data-toggle='modal' data-target='#myModal'>联系不上</li></ul></td></tr>");
                        }
                        $(".visit_btn").removeClass("gray_btn");
                    })
                },
                //回访数量
                "feedBack": function (params) {
                    $model.$feedBack(params).then(function (res) {
                        allpage = Math.ceil(res.data.Count / 10);
                        global.createPage();
                    })
                },
                //更新回访记录
                "update": function (params) {
                    $model.$update(params).then(function () {
                        global.getFeed(Deafault)
                    })
                },
                //创建分页
                "createPage": function () {
                    if (allpage === 0) {
                        $(".tcdPageCode").remove();
                    } else {
                        if ($(".tcdPageCode").createPage) {
                            $(".tcdPageCode").remove();
                            $(".rf").append("<div class='tcdPageCode'></div>");
                        }
                        $(".tcdPageCode").createPage({
                            pageCount: allpage,
                            current: 1,
                            backFn: function (page) {
                                Deafault.page = page;
                                global.getFeed(Deafault);
                            }
                        });
                    }
                }
            }
            global.getFeed(Deafault);
            global.feedBack(deafaultCou);
        }]
    };

    return visitController;
});