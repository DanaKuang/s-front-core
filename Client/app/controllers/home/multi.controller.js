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
        $scope.targetConf = $model.$target.data;

        // 默认配置
        $scope.msConf = {
            pbArray: _.pluck($model.$brand.data, 'productBrand'),
            pnArray: [],
            ppArray: ['盒','条'],
            prNArray: [],
            cnArray: [],
            szArray: [{v:'堡垒型',k:'A'},{v:'发展型',k:'B'},{v:'潜力型',k:'C'}],
            result: []
        };

        $(document).ready(function () {
            var mulScope = angular.element('#seach_scope').scope();

            $(".ui-search-block.multi select").multiselect({
                nonSelectedText: '请选择'
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
                    $product.multiselect('refresh');
                });
            });
            // 省
            $proName.next().off().on('click', function (e) {
                var pArr = mulScope.saleZone || [];
                $model.getProvince({
                    saleZone: _.map(pArr, function (v) {return v.split('_')[1];}).join(',')
                }).then(function (res) {
                    mulScope.prNArray = _.pluck(res.data, 'provinceName');
                    mulScope.$apply();
                    $proName.multiselect('dataprovider', _.forEach(res.data, function(val) {
                        return val.label = val.value = val.provinceName;
                    }));
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
                productBrand: "芙蓉王",
                productName: "",
                productPack: "",
                saleZone: "",
                provinceName: "",
                cityName: ""
            }) : v == 1 ? initSearchScope({
                startTime: dayFilter.yesterday('date')+'_00',
                endTime: dayFilter.today('date')+'_00',
                productBrand: "白沙",
                productName: "",
                productPack: "",
                saleZone: "",
                provinceName: "",
                cityName: ""
            }) : initSearchScope({
                startTime: dayFilter.yesterday('date')+'_00',
                endTime: dayFilter.today('date')+'_00',
                productBrand: "芙蓉王",
                productName: "",
                productPack: "",
                saleZone: "",
                provinceName: "湖南",
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
            var sZFilter = {A: '堡垒型',B: '发展型',C: '潜力型',Q:'全国',O:'其他'};
            var staticParam = {
                userId: "hunan",
                opType: "2",
                ctime: +new Date
            };
            var dyParam = {
                startTime: mulScope.startTime + '_' + (mulScope.startHour || '00'),
                endTime: mulScope.endTime + '_' + (mulScope.endHour || '00'),
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
                startTime: mulScope.startTime + '_' + (mulScope.startHour || '00'),
                endTime: mulScope.endTime + '_' + (mulScope.endHour || '00'),
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
            });
        };

        // 载入
        $scope.mLoad = function () {
            // list
            $model.getHisData({
                userId: "hunan",
                opType: "1"
            }).then(function (res) {
                $scope.tempListConf.list = res.data || [];
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
                userId: "hunan",
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
    }]
  };

  return multiController;
});