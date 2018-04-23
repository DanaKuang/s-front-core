/**
 * Author: liubin
 * Create Date: 2017-07-04
 * Description: multi
 */

define([], function () {
  var multiController = {
    ServiceType: 'controller',
    ServiceName: 'MultiCtrl',
    ViewModelName: 'multiViewModel',
    ServiceContent: ['$scope', 'dateFormatFilter', 'multiFilter', 'dayFilter', function ($scope, dateFormatFilter, multiFilter, dayFilter) {
        var $model = $scope.$model;
        var user = sessionStorage.getItem("account") || "hunan";
        var SaleZone = $model.$getZone.data || [];
        // modal
        $scope.tempModalConf = $model.$modals.data.tempModal;
        $scope.histModalConf = $model.$modals.data.histModal;
        // list
        $scope.tempListConf = $model.$modals.data.tempList;
        $scope.histListConf = $model.$modals.data.histList;
        // table
        $scope.packetConf = $model.$packet.data;
        $scope.realConf = $model.$real.data;
        $scope.scanConf = $model.$scan.data;
        $scope.targetConf = $model.$target.data


        // if (user === "henan") {
        //     $scope.jin = {
        //         world: "昨日黄金叶全国指标",
        //         bao: "昨日黄金叶华东分中心活动指标",
        //         city: "昨日黄金叶烟台活动指标"
        //     }
        // } else if (user === "hunan") {
        //     $scope.jin = {
        //         world: "昨日芙蓉王全国活动指标",
        //         bao: "昨日白沙堡垒活动指标",
        //         city: "昨日芙蓉王湖南活动指标"
        //     }
        // }
        // 默认配置
        $scope.msConf = {
            pbArray: _.pluck($model.$brand.data, 'name'),
            pnArray: [],
            ppArray: ['盒','条'],
            prNArray: [],
            cnArray: [],
            szArray: _.each(SaleZone, function (data) {
                data.k = data.code;
                data.v = data.name;
            }),
            result: []
        };

        $(document).ready(function () {
            var mulScope = angular.element('#seach_scope').scope();

            $(".ui-search-block.multi select").multiselect({
                nonSelectedText: '请选择',
                allSelectedText: '全部',
                nSelectedText: '已选择',
                enableFiltering: true,
                filterPlaceholder: '查询'
            });
            var $product = $("[name='productName']");
            var $proName = $("[name='provinceName']");
            var $citName = $("[name='cityName']");
            // 规格
            $product.next().off().on('click', function (e) {
                var bArr = mulScope.productBrand || [];
                $model.getProduct({
                    productBrand: bArr.join(',')
                }).then(function (res) {
                    mulScope.pnArray = _.pluck(res.data, 'name');
                    mulScope.$apply();
                    $product.multiselect('dataprovider', _.forEach(res.data, function(val) {
                        return val.label = val.value = val.name;
                    }));
                    $product.multiselect('select', mulScope.productName);
                    $product.multiselect('refresh');
                });
            });
            // 省
            $proName.next().off().on('click', function (e) {
                var pArr = mulScope.saleZone || [];
                $model.getProvince({
                    saleZone: _.map(pArr, function (v) {return v.split('_')[1];}).join(',')
                }).then(function (res) {
                    mulScope.prNArray = _.pluck(res.data, 'name');
                    mulScope.$apply();
                    $proName.multiselect('dataprovider', _.forEach(res.data, function(val) {
                        return val.label = val.value = val.name;
                    }));
                    $proName.multiselect('select', mulScope.provinceName);
                    $proName.multiselect('refresh');
                });
            });
            // 市
            $citName.next().off().on('click', function (e) {
                var cArr = mulScope.provinceName || [];
                $model.getCity({
                    provinceName: cArr.join(',')
                }).then(function (res) {
                    mulScope.cnArray = _.pluck(res.data, 'cityName');
                    mulScope.$apply();
                    $citName.multiselect('dataprovider', _.forEach(res.data, function(val) {
                        return val.label = val.value = val.cityName;
                    }));
                    $citName.multiselect('select', mulScope.cityName);
                    $citName.multiselect('refresh');
                });
            });

            // 初始化
            $scope.setDef(0);
        });

        // 设置默认值
        $scope.setDef = function (v) {
            v == 0 ? initSearchScope({
                startTime: dayFilter.yesterday('date')+'_00',
                endTime: dayFilter.today('date')+'_00',
                productBrand: $scope.msConf.pbArray[0] || "",
                productName: "",
                productPack: "",
                saleZone: "",
                provinceName: "",
                cityName: ""
            }) : v == 1 ? initSearchScope({
                startTime: dayFilter.yesterday('date')+'_00',
                endTime: dayFilter.today('date')+'_00',
                productBrand: $scope.msConf.pbArray[0] || "",
                productName: "",
                productPack: "",
                saleZone: user === "hunan" ? "堡垒型_A" : "华东分中心_DB",
                provinceName: "",
                cityName: ""
            }) : initSearchScope({
                startTime: dayFilter.yesterday('date')+'_00',
                endTime: dayFilter.today('date')+'_00',
                productBrand: $scope.msConf.pbArray[0] || "",
                productName: "",
                productPack: "",
                saleZone: "",
                provinceName: user === "hunan" ? "湖南省" : "烟台",
                cityName: ""
            });
            $scope.mSearch();
            $scope.showSearch = true;
        };

        // 查询
        $scope.mSearch = function () {
            var mulScope = angular.element('#seach_scope').scope();
            var sScope = angular.element('#scanTarget #common_table').scope();
            var tScope = angular.element('#targetTarget #common_table').scope();
            var pScope = angular.element('#packetTarget #common_table').scope();
            var rScope = angular.element('#realTarget #common_table').scope();
            var sZFilter = {};
            _.each(SaleZone, function (v) {
                sZFilter[v.zoneCode] = v.zoneName;
            });
            var staticParam = {
                userId: user ,
                opType: "2",
                ctime: +new Date
            };
            var dyParam = {
                startTime: mulScope.startTime && (mulScope.startTime + '_' + (mulScope.startHour || '00')) || "",
                endTime: mulScope.endTime && (mulScope.endTime + '_' + (mulScope.endHour || '00')) || "",
                productBrand: mulScope.productBrand && mulScope.productBrand.join(','),
                productName: (mulScope.productName && mulScope.productName.join(',')) || "所有",
                productPack: mulScope.productPack && mulScope.productPack.join(','),
                saleZone: mulScope.saleZone && _.map(mulScope.saleZone, function (v) {return v.split('_')[1];}).join(','),
                provinceName: (mulScope.provinceName && mulScope.provinceName.join(',')) || "合计",
                cityName: mulScope.cityName && mulScope.cityName.join(',')
            };

            // 扫码
            $model.getScan(dyParam)
                .then(function (res) {
                    _.each(res.data, function (s) {
                        s.saleZone = sZFilter[s.saleZone] || s.saleZone;
                    });
                    $scope.scanConf.rows = sScope.rows = res.data || [];
                    sScope.$apply();
            });

            // 指标
            $model.getTarget(dyParam)
                .then(function (res) {
                    _.each(res.data, function (s) {
                        s.saleZone = sZFilter[s.saleZone] || s.saleZone;
                        s.juncicuxiaochengben = transRate(s.juncicuxiaochengben);
                        s.juncicuxiaolidu = transRate(s.juncicuxiaolidu);
                        s.lingshoufeixiaobi = transRate(s.lingshoufeixiaobi);
                        s.saomalv = transRate(s.saomalv);
                        s.zhongjianglv = transRate(s.zhongjianglv);
                        s.rjyouxiaosaomacishu = transNum(s.rjyouxiaosaomacishu);
                        s.zhongjiangmian = transNum(s.zhongjiangmian);
                        s.rjzhongjiangcishu = transNum(s.rjzhongjiangcishu);
                        s.rjcuxiaochengben = transNum(s.rjcuxiaochengben);
                    });
                    $scope.targetConf.rows = tScope.rows = res.data || [];
                    tScope.$apply();
            });

            // 实物
            $model.getReal(dyParam)
                .then(function (res) {
                    _.each(res.data, function (s) {
                        s.saleZone = sZFilter[s.saleZone] || s.saleZone;
                    });
                    $scope.realConf.rows = rScope.rows = res.data || [];
                    rScope.$apply();
            });

            // 红包
            $model.getPacket(dyParam)
                .then(function (res) {
                    _.each(res.data, function (s) {
                        s.saleZone = sZFilter[s.saleZone] || s.saleZone;
                    });
                    $scope.packetConf.rows = pScope.rows = res.data || [];
                    pScope.$apply();
            });

            $model.saveSearch(angular.extend(dyParam, staticParam))
                .then(function (res) {
                    console.log(res.data);
            });
        };

        // 保存
        $scope.mSave = function () {
            var mulScope = angular.element('#seach_scope').scope();
            $model.saveSearch({
                startTime: mulScope.startTime && (mulScope.startTime + '_' + (mulScope.startHour || '00')) || "",
                endTime: mulScope.endTime && (mulScope.endTime + '_' + (mulScope.endHour || '00')) || "",
                productBrand: mulScope.productBrand && mulScope.productBrand.join(','),
                productName: (mulScope.productName && mulScope.productName.join(',')) || "所有",
                productPack: mulScope.productPack && mulScope.productPack.join(','),
                saleZone: mulScope.saleZone && _.map(mulScope.saleZone, function (v) {return v.split('_')[1];}).join(','),
                provinceName: (mulScope.provinceName && mulScope.provinceName.join(',')) || "合计",
                cityName: mulScope.cityName && mulScope.cityName.join(','),
                opType: "1",
                ctime: +new Date
            }).then(function (res) {
                console.log(res.data);
                $("#tipsModalId").modal({
                    backdrop: 'static'
                });
            });
        };

        // 载入
        $scope.mLoad = function () {
            // list
            $model.getHisData({
                userId: "hunan",
                opType: "1"
            }).then(function (res) {
                var data = res.data || [];
                _.each(data, function (d) {
                    var f = true;
                    for (var i=0,len=SaleZone.length;i<len&&f;i++) {
                        if (d.saleZone == SaleZone[i].code) {
                            f = false;
                            d.saleZoneName = SaleZone[i].name || "";
                        }
                    }
                })
                $scope.tempListConf.list = data || [];
                $scope.$apply();
            }).then(function () {
                angular.element('#tempModalId .ui-list-data')
                    .scope()
                    .initList = function (l) {
                        if (event.target.checked) {
                            initSearchScope(l);
                            $("#tempModalId").modal('hide');
                        }
                };
                $("#tempModalId").modal('show');
            });
        };

        // 历史
        $scope.mHistory = function () {
            $model.getHisData({
                userId: user,
                opType: "2"
            }).then(function (res) {
                $scope.histListConf.list = res.data || [];
                $scope.$apply();
            }).then(function () {
                angular.element('#histModalId .ui-list-data')
                    .scope()
                    .initList = function (l) {
                        if (event.target.checked) {
                            initSearchScope(l);
                            $("#histModalId").modal('hide');
                        }
                };
                $("#histModalId").modal('show');
            });
        };

        // 初始化搜索
        function initSearchScope (d) {
            var mulScope = angular.element('#seach_scope').scope();
            mulScope.startTime = d.startTime && d.startTime.split('_')[0];
            mulScope.startHour = d.startTime && d.startTime.split('_')[1];
            mulScope.endTime = d.endTime && d.endTime.split('_')[0];
            mulScope.endHour = d.endTime && d.endTime.split('_')[1];
            mulScope.productBrand = d.productBrand && d.productBrand.split(',');
            mulScope.productName = d.productName && d.productName.split(',');
            mulScope.productPack = d.productPack && d.productPack.split(',');
            mulScope.saleZone = d.saleZone && d.saleZone.split(',');
            mulScope.provinceName = d.provinceName && d.provinceName.split(',');
            mulScope.cityName = d.cityName && d.cityName.split(',')
        }

        // 百分比转化
        function transRate (rate) {
            if (!rate) return '0%';
            rate = Number(rate);
            rate = (rate * 100).toFixed(2);
            return '' + rate + '%';
        }

        // 保留两位小数
        function transNum (num) {
            if (!num) return num;
            num = Number(num);
            return num.toFixed(2);
        }
    }]
  };

  return multiController;
});