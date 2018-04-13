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
        ServiceContent: ['$scope', 'setDateConf', '$timeout','dayFilter',function ($scope, setDateConf, $timeout,dayFilter) {
            setDateConf.init($(".agree-date"), 'day');
            var stattime = dayFilter.yesterday("date");

            var $start = $(".visit_start input");
            var $end = $(".visit_end input");
            $($start).change(function (v) {
                if (v.target.value > $($end).val()) {
                    $($end).val(v.target.value)
                }
            }).val(stattime);
            $($end).change(function (v) {
                if (v.target.value < $($start).val()) {
                    $($start).val(v.target.value)
                }
            }).val(stattime);

            var $model = $scope.$model;
            //页面默认加载配置
            var deafaultCou = {
                "startTime": stattime,
                "awardName": "",
                "cityName": "",
                "checkStatus":"",
                "productSn":"",
                "productBrand":"",
                "mobileNo":"",
                "endTime":stattime,
                "orderId":""
            };
            var def = _.cloneDeep(deafaultCou);
            def.page = 1;
            def.pageSize = 10;
            var allpage;  //计算总页数
            var up = {};  //更新数据


            //品牌
            (function(){
                $model.$getBrand().then(function(res){
                    var res = res.data || [];
                    for(var i=0;i<res.length;i++){
                        $("#visit_brand").append("<option value="+res[i].name+">"+res[i].name+"</option>")
                    };
                    getProduct({productBrand:$("#visit_brand").val()})
                  })
            })();
            $("#visit_brand").change(function(){
                getProduct({productBrand:$("#visit_brand").val()})
              })
            //规格下拉列表
            function getProduct(params) {
                $model.$getProduct(params).then(function (res) {
                    var res = res.data || [];
                    $("#visit_product").html("");
                    $("#visit_product").append("<option value=''>全部</option>");
                    for(var i=0;i<res.length;i++){
                        $("#visit_product").append("<option value="+res[i].sn+">"+res[i].name+"</option>")
                    };
                })
            };
            //箭头点击
            $(".visit_table tbody").on("click", "span", function (e) {
                $(".visit-list").hide();
                $(this).siblings(".visit-list").show();
                e.stopPropagation();
            });
            //更新
            $(".visit_table tbody").on("click", "li", function () {
                up = {
                    "id": $(this).parent().parent().attr("data-id"),
                    "checkStatus": "",
                    "checkPerson":sessionStorage.getItem("checkperson"),
                    "checkTime":dayFilter.today("datetime")
                }
                if ($(this).text() === "待核实") {
                    up.checkStatus = 1;
                } else if ($(this).text() === "已核实") {
                    up.checkStatus = 2;
                } else if ($(this).text() === "不属实") {
                    up.checkStatus = 3;
                } else if ($(this).text() === "联系不上") {
                    up.checkStatus = 4;
                };
                // console.log(up);
                $(".visit-list").hide();
                //globalFn.getFeed(def);
            });

            $(document).bind('click',function(e){
                $(".visit-list").hide();
            })

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
                globalFn.update(up);
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
                    def = {};
                    deafaultCou = {
                        "startTime": $(".visit_start .date").val(),
                        "awardName": $(".visit_award input").val(),
                        "cityName": $(".visit_city input").val(),
                        "endTime": $(".visit_end .date").val(),
                        "mobileNo": $(".visit_mobile input").val(),
                        "checkStatus": $("#visit_label").val(),
                        "productSn": $("#visit_product").val(),
                        "productBrand": $("#visit_brand").val(),
                        "orderId": $(".visit_order input").val()

                    };
                    def = _.cloneDeep(deafaultCou)
                    def.page = 1;
                    def.pageSize = 10;
                    globalFn.getFeed(def);
                    globalFn.feedBack(deafaultCou);
                }
            }

            var globalFn = {
                //回访记录
                "getFeed": function (params) {
                    $model.$getFeed(params).then(function (res) {
                        $(".visit_table tbody").html("");
                        var template = [];
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
                           template.push(
                                "<tr> " +
                                "<td class='mobile'>" + res[i].mobile + "<td class='orderId'>"+res[i].orderId+"</td></td> <td class='wechat'>" +
                                res[i].wechatName + "</td> <td class='stat_time'>" +
                                res[i].statTime + "</td> <td class='cityName'>" +
                                res[i].cityName + "</td> <td class='award'>" +
                                res[i].awardName + "</td> <td data-id=" + res[i].id + "> " +
                                feedback +
                                " <span class='" + Class + "'></span> <ul class='visit-list'><li data-toggle='modal' data-target='#myModal'>已核实</li> <li data-toggle='modal' data-target='#myModal'>不属实</li> <li data-toggle='modal' data-target='#myModal'>联系不上</li></ul></td></tr>");
                        }

                        if (!res.length) {
                            template.push("<tr><td colspan='7'>暂无符合条件的数据</td></tr>" );
                        }

                        $(".visit_table tbody").append(template.join(" "))
                        $(".visit_btn").removeClass("gray_btn");
                    })
                },
                //回访数量
                "feedBack": function (params) {
                    $model.$feedBack(params).then(function (res) {
                        $scope.count = res.data.Count;
                        $scope.$apply();
                        allpage = Math.ceil(res.data.Count / 10);
                        globalFn.createPage();
                    })
                },
                //更新回访记录
                "update": function (params) {
                    $model.$update(params).then(function () {
                        globalFn.getFeed(def)
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
                                def.page = page;
                                globalFn.getFeed(def);
                            }
                        });
                    }
                }
            }
            globalFn.getFeed(def);
            globalFn.feedBack(deafaultCou);

            // 添加hover效果
            $("select").hover(function (e) {
                e.currentTarget.title = e.currentTarget.selectedOptions[0].innerText;
            });
        }]
    };

    return visitController;
});