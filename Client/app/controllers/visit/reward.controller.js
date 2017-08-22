/***/

define([], function () {
    var rewardCtrl = {
        ServiceType: "controller",
        ServiceName: "rewardCtrl",
        ViewModelName: 'rewardViewModel',
        ServiceContent: ['$scope', function ($scope) {
            var $model = $scope.$model;
            //客户返现设置
            $("#award").off().on('click', function (e) {
                var award = $(".money").val();
                $model.getAward({
                    percent: award
                }).then(function (res) {
                    $scope.awardData = res.data.data || [];
                    $scope.$apply();
                    res.data.seller_reward_percent = res.data.seller_reward_percent * 100;
                });
            });
            //客户活动介绍
            $("#intrSave").off().on('click', function (e) {
                var introduction = $("#textintro").val();
                $model.getIntroduction({
                    introduction: introduction
                }).then(function (res) {
                    $scope.introductionData = res.data.data || [];
                    $scope.$apply();
                });
            });
            //开启关闭按钮

            var index;
            $scope.openSet = function () {
                $(".openButton1").css("backgroundColor", "#6db1fb");
                $(".closeButton1").css("backgroundColor", "#fff")
                index = 1;
                $("#free-numble").removeAttr("disabled");
            };
            $scope.closeSet = function () {
                $(".closeButton1").css("backgroundColor", "#6db1fb");
                $(".openButton1").css("backgroundColor", "#fff")
                index = 0;
                $("#free-numble").attr("disabled", "disabled");
            }
            //免费二维码设置
            $("#numbleSave").off().on('click', function (e) {
                var freeNum = $(".numble input").val();
                var qrExpenses = $("#copyMoney").val();
                $model.getQr({
                    isFree: index,
                    freeNum: freeNum || '',
                    qrExpenses: qrExpenses || ''
                }).then(function (res) {
                    $scope.tixianData = res.data.data || [];
                    $scope.$apply();
                });
            });
            $scope.select = $model.$select.data.data;
            if ($scope.select.qr.isFree == 0) {
                $scope.closeSet();
            } else if ($scope.select.qr.isFree == 1) {
                $scope.openSet();
            }
            //店码-盒码关联间隔设置
            $("#consumerSave").off().on('click', function (e) {
                var time = $(".spaceTime input").val();
                $model.getConsumer({
                    time: time
                }).then(function (res) {
                    $scope.consumerData = res.data.data || [];
                    $scope.$apply();
                });
            });

            //保存设置
            $("#saveAllBut").off().on('click', function (e) {

                var isSuccess = true;

                //判断值发现比例是否合法
                var award = $(".money").val();
                var flag = isNaN(award) ? true : false;
                if (flag == true) {
                    //$(".money").val("请您输入正确的百分比").css("color","red");
                    alert("保存失败,客户返现比例输入不正确!");
                    return;
                } else {
                    var isIntegerFlag = isInteger(award);
                    if (!isIntegerFlag || award > 100 || award < 0) {
                        //$(".money").val("请您输入0-100之间的整数").css("color","red");
                        alert("保存失败,客户返现比例[请您输入0-100之间的整数]!");
                        return;
                    } else {
                        $(".money").css("color", "#000");
                    }
                }

                //检查二维码费用是否合法
                var copyMoney = $("#copyMoney").val();
                var flag = isNaN(copyMoney) ? true : false;
                if (flag == true) {
                    //$(this).val("您请输入正确的金额").css("color","red");
                    alert("保存失败,二维码打印费[请输入正确的金额]!");
                    return;
                } else {
                    $(this).css("color", "#000");
                }

                //检查免费二维码免费数量是否正确
                var value = $("#free-numble").val();
                var flag = isNaN(value) ? true : false;
                if (flag == true) {
                    //$(this).val("您请输入正确的数量").css("color","red");
                    alert("保存失败,请输入正确的免费二维码数量!");
                    return;
                } else {
                    $(this).css("color", "#000");
                }

                //检查时间设置是否正确
                var timeSpace = $("#time-space").val();
                var flag = isNaN(timeSpace) ? true : false;
                if (flag == true) {
                    //$("#time-space").val("您请输入正确的时间间隔").css("color", "red");
                    alert("保存失败,店铺-消费者关联有效时间设置[请输入正确的时间]");
                    return;
                } else if (timeSpace < 1) {
                    alert("保存失败,店铺-消费者关联有效时间设置[有效时间不能小于1分钟]");
                    return;
                } else {
                    $("#time-space").css("color", "#000");
                }

                var introduction=$("#textintro").val();

                if(!introduction){
                    alert("保存失败,客户活动介绍[介绍内容不能为空]");
                    return;
                }

                //保存返现
                $model.getAward({
                    percent: award
                }).then(function (res) {
                    if (!res.data.ok) {
                        isSuccess = false;
                    }
                    $scope.awardData = res.data.data || [];
                    $scope.$apply();
                    res.data.seller_reward_percent = res.data.seller_reward_percent * 100;
                });

                //活动介绍设置
                $model.getIntroduction({
                    introduction: introduction
                }).then(function (res) {
                    if (!res.data.ok) {
                        isSuccess = false;
                    }
                    $scope.introductionData = res.data.data || [];
                    $scope.$apply();
                });

                //免费二维码设置
                var freeNum = $(".numble input").val();
                var qrExpenses = $("#copyMoney").val();
                $model.getQr({
                    isFree: index,
                    freeNum: freeNum || '',
                    qrExpenses: qrExpenses || ''
                }).then(function (res) {
                    if (!res.data.ok) {
                        isSuccess = false;
                    }
                    $scope.tixianData = res.data.data || [];
                    $scope.$apply();
                });
                //店码-盒码关联间隔设置

                var time = $(".spaceTime input").val();
                $model.getConsumer({
                    time: time
                }).then(function (res) {
                    if (!res.data.ok) {
                        isSuccess = false;
                    }
                    $scope.consumerData = res.data.data || [];
                    $scope.$apply();
                });

                if(isSuccess){
                    alert("保存成功!");
                }else{
                    alert("保存失败!")
                }

            });
        }]
    };
    return rewardCtrl;
})