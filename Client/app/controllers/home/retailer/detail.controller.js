/**
 * Author: liubin
 * Create Date: 2017-08-02
 * Description: retailer
 */

define([], function () {
    var detailCtrl = {
        ServiceType: 'controller',
        ServiceName: 'detailCtrl',
        ViewModelName: 'detailViewModel',
        ServiceContent: ['$scope', 'dateFormatFilter', 'dayFilter', function ($scope, dateFormatFilter, dayFilter) {
            var $model = $scope.$model || {};
            // 日期
            $('[name="beginTime"]').datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                startDate: ""
            }).on('change', function (e) {
                var st = e.target.value || '';
                var et = $scope.endTime || '';
                if (et < st) {
                    $scope.endTime = st;
                }
            });
            $('[name="endTime"]').datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                startDate: ""
            }).on('change', function (e) {
                var et = e.target.value || '';
                var st = $scope.beginTime || '';
                if (et < st) {
                    $scope.beginTime = et;
                }
            });

            // 后端数据
            var bizArr_back_data = $model.$dropShop.data || [];
            var pbArray_back_data = $model.$brand.data || [];
            bizArr_back_data = bizArr_back_data.length ? bizArr_back_data : [{bizCode:"",bizName:""}];
            pbArray_back_data = pbArray_back_data.length ? pbArray_back_data : [{brandCode:"",name:"无数据"}];

            // 查询默认值
            $scope = angular.extend($scope, {
                detailSearch: initSearch,
                beginTime: dayFilter.yesterday('date'),
                endTime: dayFilter.yesterday('date'),
                pbArray: pbArray_back_data,
                productBrand: "" || pbArray_back_data[0].name || "",
                cityName: "",
                pnArray: [],
                productSn: "" || $scope.productSn || "",
                bizArr: bizArr_back_data,
                bizCode: "" || bizArr_back_data[0].bizCode || "",
                shopName: "" || ""
            });

            // 初始化查询
            function initSearch () {
                $model.getTableData({
                    beginTime: $scope.beginTime || "",
                    endTime: $scope.endTime || "",
                    productBrand: $scope.productBrand || "",
                    cityName: $scope.cityName || "",
                    productSn: ($scope.productSn && $scope.productSn.join(',')) || "",
                    bizCode: $scope.bizCode || "",
                    shopName: $scope.shopName || ""
                }).then(function (res) {
                    var data = res.data || [];
                    $scope.listArr = _.each(data, function (d) {
                        d.customerShould = (d.customerShould && d.customerShould.toFixed(2)) || 0;
                    });
                    $scope.$apply();
                });
            }

            // 下拉框
            function initDropdown (productBrand) {
                var $productSn = $("[name='productSn']");
                $model.getProduct({
                    productBrand: productBrand
                }).then(function (res) {
                    $scope.pnArray = res.data || [];
                    $scope.$apply();
                    $productSn.multiselect('dataprovider', _.forEach(res.data, function(val) {
                        val.label = val.productName;
                        val.value = val.sn;
                    }));
                    $scope.productSn = $scope.pnArray.map(function(m){return m.sn;});
                    $productSn.multiselect('select', $scope.productSn);
                    $productSn.multiselect('refresh');
                    // 初始化
                    initSearch();
                });
            }

            // 初始化multiselect
            $(document).ready(function () {
                var $prBrand = $("[name='productBrand']");
                var $productSn = $("[name='productSn']");
                // 品牌
                $prBrand.multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择',
                    onChange: function (opt) {
                        $model.getProduct({
                            productBrand: opt[0].value || event.target.value || ""
                        }).then(function (res) {
                            $scope.pnArray = res.data || [];
                            $scope.$apply();
                            $productSn.multiselect('dataprovider', _.forEach(res.data, function(val) {
                                val.label = val.productName;
                                val.value = val.sn;
                            }));
                            $scope.productSn = $scope.pnArray.map(function(m){return m.sn;});
                            $productSn.multiselect('select', $scope.productSn);
                            $productSn.multiselect('refresh');
                        });
                    }
                });
                $prBrand.multiselect('select', $scope.productBrand);
                $prBrand.multiselect('refresh');
                // 规格
                $productSn.multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择'
                });
                initDropdown($scope.productBrand);

                // 添加hover效果
                $("select").hover(function (e) {
                    e.currentTarget.title = e.currentTarget.selectedOptions[0].innerText;
                });
            });

        }]
    };

  return detailCtrl;
});