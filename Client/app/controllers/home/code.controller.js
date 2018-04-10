/**
 * Author: liubin
 * Create Date: 2017-06-27
 * Description: index
 */

define([], function () {
    var CodeCtrl = {
        ServiceType: "controller",
        ServiceName: "CodeCtrl",
        ViewModelName: 'codeViewModel',
        ServiceContent: ['$scope', 'dateFormatFilter', function ($scope, df) {
            var $model = $scope.$model;

            var brandArr = $model.$brand.data || [];

            var snCache = {};

            // 属性扩展
            $scope = angular.extend($scope, {
                brandCode: '',
                brandArr: brandArr,
                sn: '',
                snArr: [],
                rptName: '',
                phone: '',
                cityName: '',
                code: '',
                stime: '',
                etime: '',
                tableArr: [],
                paginationConf: '',
                search: searchFn,
                reset: resetFn,
                export: exportFn
            });

            function getParams () {
                return {
                    brandCode: $scope.brandCode && $scope.brandCode.join(',') || '',
                    sn: $scope.sn && $scope.sn.join(',') || '',
                    rptName: $scope.rptName || '',
                    phone: $scope.phone || '',
                    cityName: $scope.cityName || '',
                    code: $scope.code || '',
                    stime: $scope.stime || '',
                    etime: $scope.etime || '',
                    currentPageNumber: 1,
                    pageSize: 10
                }
            }

            // 查询函数
            function searchFn (params) {
                $model.getFackList(params|| getParams()).then(function (res) {
                    res = res.data || {};
                    if (res.ret === '200000') {
                        var ret = res.data.list || [];
                        ret.forEach(function (l) {
                            l.rptTime = df.datetime(l.rptTime);
                        }) || [];
                        $scope.tableArr = ret;
                        $scope.paginationConf = res;
                        $scope.$apply();
                    } else {
                        console.log('接口异常啦！！！');
                    }
                });
            }

            // 翻页
            $scope.$on('frompagechange', function (e,v,f) {
                searchFn(false, angular.extend({}, getParams(), f));
            })

            // 重置函数
            function resetFn () {
                $scope = angular.extend($scope, {
                    brandCode: '',
                    sn: '',
                    rptName: '',
                    phone: '',
                    cityName: '',
                    code: '',
                    stime: '',
                    etime: ''
                });
                $("#id_brand").multiselect('deselect', brandArr.map(function (b) {return b.name}));
                $("#id_brand").multiselect('refresh');
                $("#id_sn").multiselect('dataprovider', []);
                $("#id_sn").multiselect('refresh');
            }

            // 导出
            function exportFn () {
                $model.exportList(getParams());
            }

            // 初始化多选
            $(document).ready(function () {
                // 品牌
                $("#id_brand").multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择',
                    onChange: function (opt) {
                        if (!!$scope.brandCode.length && snCache[opt[0].value]) {
                            $scope.snArr = _.flattenDeep(_.map($scope.brandCode, function (b) {
                                return snCache[b];
                            }));
                            $("#id_sn").multiselect('dataprovider', _.forEach($scope.snArr, function(val) {
                                val.label = val.productName;
                                val.value = val.sn;
                            }));
                            $scope.sn = '';
                            $("#id_sn").multiselect('select', $scope.sn);
                            $("#id_sn").multiselect('refresh');
                        } else if (!!$scope.brandCode.length) {
                            $model.getProduct({
                                productBrand: opt[0].value || ""
                            }).then(function (res) {
                                snCache[opt[0].value] = res.data || "";
                                $scope.snArr = _.flattenDeep(_.map($scope.brandCode, function (b) {
                                    return snCache[b];
                                }));
                                $scope.$apply();
                                $("#id_sn").multiselect('dataprovider', _.forEach($scope.snArr, function(val) {
                                    val.label = val.productName;
                                    val.value = val.sn;
                                }));
                                $scope.sn = '';
                                $("#id_sn").multiselect('select', $scope.sn);
                                $("#id_sn").multiselect('refresh');
                            });
                        } else {
                            $scope.snArr = [];
                            $scope.sn = '';
                            $("#id_sn").multiselect('dataprovider', []);
                            $("#id_sn").multiselect('select', '');
                        }
                    }
                });

                // 规格
                $("#id_sn").multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择'
                });

                // 时间组件
                $('[name="stime"]').datetimepicker({
                    language: "zh-CN",
                    format: "yyyy-mm-dd",
                    autoclose: true,
                    todayBtn: true,
                    minView: 2,
                    startDate: ""
                }).on('change', function (e) {
                    var st = e.target.value || '';
                    var et = $scope.etime || '';
                    if (et < st) {
                        $scope.etime = st;
                        $scope.$apply();
                    }
                });
                $('[name="etime"]').datetimepicker({
                    language: "zh-CN",
                    format: "yyyy-mm-dd",
                    autoclose: true,
                    todayBtn: true,
                    minView: 2,
                    startDate: ""
                }).on('change', function (e) {
                    var et = e.target.value || '';
                    var st = $scope.stime || '';
                    if (et < st) {
                        $scope.stime = et;
                        $scope.$apply();
                    }
                });

                // 刚进入页面查询一下
                searchFn();
            });

        }]
    };

  return CodeCtrl;
});