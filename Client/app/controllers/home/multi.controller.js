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
    ServiceContent: ['$scope', 'dateFormatFilter', 'multiFilter', function ($scope, dateFormatFilter, multiFilter) {
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
            pnArray: _.pluck($model.$product.data, 'productName'),
            ppArray: ['包','条'],
            prNArray: _.pluck($model.$province.data,'provinceName'),
            cnArray: [],
            result: []
        };

        $(document).ready(function () {
            var mulScope = angular.element('.ui-search-block').scope();

            $(".ui-search-block.multi select").multiselect({
                nonSelectedText: '请选择'
            });
            var $citName = $("[name='cityName']");
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
            })
        });

        // 查询
        $scope.mSearch = function () {
            var mulScope = angular.element('.ui-search-block').scope();
            var sScope = angular.element('#scanTarget #common_table').scope();
            var tScope = angular.element('#targetTarget #common_table').scope();
            var pScope = angular.element('#packetTarget #common_table').scope();
            var rScope = angular.element('#realTarget #common_table').scope();
            var staticParam = {
                userId: "test",
                modeId: "1",
                modeName: "1",
                productId: "1",
                provinceId: "1",
                cityId: "1,2,3",
                opType: "2",
                ctime: +new Date
            };
            var dyParam = {
                startTime: mulScope.startTime + '_' + (mulScope.startHour || '00'),
                endTime: mulScope.endTime + '_' + (mulScope.endHour || '00'),
                productBrand: mulScope.productBrand && mulScope.productBrand.join(','),
                productName: mulScope.productName && mulScope.productName.join(','),
                productPack: mulScope.productPack && mulScope.productPack.join(','),
                saleZone: mulScope.saleZone && mulScope.saleZone.join(','),
                provinceName: mulScope.provinceName && mulScope.provinceName.join(','),
                cityName: mulScope.cityName && mulScope.cityName.join(',')
            };

            // 扫码
            $model.getScan(dyParam)
                .then(function (res) {
                    $scope.scanConf.rows = sScope.rows = $model.$testTableData.data.rows;
                    sScope.$apply();
            });

            // 指标
            $model.getTarget(dyParam)
                .then(function (res) {
                    $scope.targetConf.rows = tScope.rows = $model.$testTableData.data.rows;
                    tScope.$apply();
            });

            // 实物
            $model.getReal(dyParam)
                .then(function (res) {
                    $scope.realConf.rows = rScope.rows = $model.$testTableData.data.rows;
                    rScope.$apply();
            });

            // 红包
            $model.getPacket(dyParam)
                .then(function (res) {
                    $scope.packetConf.rows = pScope.rows = $model.$testTableData.data.rows;
                    pScope.$apply();
            });

            $model.saveSearch(angular.extend(dyParam, staticParam))
                .then(function (res) {
                    console.log(res.data);
            });
        };

        // 保存
        $scope.mSave = function () {
            var mulScope = angular.element('.ui-search-block').scope();
            $model.saveSearch({
                userId: "test",
                modeId: "1",
                modeName: "1",
                startTime: mulScope.startTime + '_' + (mulScope.startHour || '00'),
                endTime: mulScope.endTime + '_' + (mulScope.endHour || '00'),
                productBrand: mulScope.productBrand && mulScope.productBrand.join(','),
                productId: "1",
                productName: mulScope.productName && mulScope.productName.join(','),
                productPack: mulScope.productPack && mulScope.productPack.join(','),
                saleZone: mulScope.saleZone && mulScope.saleZone.join(','),
                provinceId: "1",
                provinceName: mulScope.provinceName && mulScope.provinceName.join(','),
                cityId: "1,2,3",
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
            $model.getTmpData().then(function (res) {
                $scope.tempListConf.list = res.data.list;
                $scope.$apply();
            }).then(function () {
                angular.element('#tempModal .ui-list-data')
                    .scope()
                    .initList = function (e, l) {
                        if (e.target.checked) {
                            initSearchScope(l);
                            $("#tempModal").modal('hide');
                        }
                };
                $("#tempModalId").modal('show');
            });
        };

        // 历史
        $scope.mHistory = function () {
            $model.getHisData({
                userId: "test",
                opType: "1"
            }).then(function (res) {
                $scope.histListConf.list = multiFilter.list(res.data);
                $scope.$apply();
            }).then(function () {
                angular.element('#histModalId .ui-list-data')
                    .scope()
                    .initList = function (e, l) {
                        if (e.target.checked) {
                            initSearchScope(l);
                            $("#histModalId").modal('hide');
                        }
                };
                $("#histModalId").modal('show');
            });
        };

        // 初始化搜索
        function initSearchScope (d) {
            console.log(d);
        }
    }]
  };

  return multiController;
});