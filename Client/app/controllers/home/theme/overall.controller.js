/**
 * Author: kuang
 * Create Date: 2017-10-23
 * Description: overall
 */

define([], function () {
  	var overallController = {
    	ServiceType: 'controller',
    	ServiceName: 'overallCtrl',
    	ViewModelName: 'overallModel',
    	ServiceContent: ['$rootScope', '$scope', 'overallModel', 'setDateConf', 'dayFilter', function ($rootScope, $scope, $model, setDateConf, dayFilter) {

        var $model = $scope.$model;
        var echarts = require('echarts');







        var chinaJson = $model.$chinaJson.data;
        echarts.registerMap('china', chinaJson);
        // 1. 扫码次数趋势分析
        var trendChart = echarts.init(document.getElementById('trendChart'));
        var trendOption = $model.$trendConf.data;
        // 2. 扫码次数地域分析
        var mapEchart = echarts.init(document.getElementById('baidumap'));
        var mapConf = $model.$mapConf.data;

        // 鼠标悬浮地图上面时，针对悬浮区域的tip展示
        mapConf.tooltip.formatter = function (params) {
            return params.name + '<br>' + 'PV:' + (params.data.value || 0);
        }
        mapEchart.setOption(mapConf);
    
        // 3. 点击地图，各省份扫码次数
        var districtChart = echarts.init(document.getElementById('districtChart'));
        var districtOption = $model.$districtConf.data;







        // 4. 各规格扫码次数分析
        var standardChart = echarts.init(document.getElementById('standardChart'));
        var standardChartOption = $model.$specConf.data;
        // 5. 扫码用户数分析
        var userChart = echarts.init(document.getElementById('userChart'));
        var userChartOption = $model.$userConf.data;

        // 6. 扫码烟包数分析
        var packedChart = echarts.init(document.getElementById('packedChart'));
        var packedChartOption = $model.$packConf.data;

        // 7. 促销效果趋势分析
        var promotionChart = echarts.init(document.getElementById('promotionChart'));
        var promotionChartOption = $model.$resultConf.data;

        // datetimepicker初始化
        
        setDateConf.init($('.day'), 'day')
        setDateConf.init($('.month'), 'month')
        // 全部变量、属性
        var global = {};
        $scope.checkbox = {};
        function init() {
            global.f_axisx          = []; // 扫码次数、扫码人数、促销趋势x轴
            global.s_axisx          = []; // 扫码烟包数x轴
            global.t_axisx          = []; // 各规格烟包数分析x轴
            global.scan_y           = [];
            global.uv_y             = [];
            global.awardPut_y       = []; //促销计划
            global.draw_y           = []; //抽奖次数
            global.drawResult_y     = []; //中奖数量
            global.awardPay_y       = []; //领奖数量
            global.pack_y           = [];
            global.bar_y            = [];
            global.various_y        = []; // 各规格扫码烟包数分析;
            global.districtAxis     = [];
            global.districtAxisY    = [];
            global.initProvinceData = {
                provinceName: '',
                statTime: '',
                statType: ''
            };
            $scope.checkbox.packcheckbox  = true;
            $scope.checkbox.barcheckbox   = true;
            $scope.checkbox.promocheckbox = true;
            $scope.checkbox.drawcheckbox  = true;
            $scope.checkbox.getcheckbox   = true;
            $scope.checkbox.paycheckbox   = true;
        }

        // 默认当日
        $scope.singleSelect = {
          unit: 'day'
        }

        // 当日、当月的显示
        $scope.day = dayFilter.yesterday('date'); //默认选择昨天
        $scope.month = [new Date().getFullYear(), new Date().getMonth() + 1].join('-');
        

        // 选择周的处理，确保只请求一次
        $scope.$watch('singleSelect.unit', function (n, o, s) {
            if (n === 'week' && !global.week) {
                global.week = true;
                $model.getweeks().then(function (res) {
                    var data = res.data || [{weekId: ''}];
                    $scope.allweek = data.map(function (n, i) {
                        var a = n.weekNo.substr(n.weekNo.indexOf('(')+1);
                        a = a.substr(0, a.indexOf('~')).replace(/\./g, '-');
                        n.weekId = a;
                        return n
                    })
                    $scope.week = $scope.allweek[0].weekId;
                    $scope.$apply()
                })
            }
        })

        global.searchItem = function () {
            return {
                provinceName: '全国',
                statType: $scope.singleSelect.unit === 'day' ? 'day' : $scope.singleSelect.unit === 'week' ? 'week' : 'month' || '',
                statTime: $scope.singleSelect.unit === 'day' ? $scope.day : $scope.singleSelect.unit === 'month' ? $scope.month : $scope.week
            }
        }

        // 搜索，进入页面默认查询当日数据
        $scope.search = function () {
            init();
            var searchItem = global.searchItem();
            console.log(searchItem);
            // 初始地图及起右边柱状图
            global.initProvinceData = {
                provinceName: sessionStorage.getItem("account") === 'henan' ? '河南省' : '湖南省',
                statTime: global.searchItem().statTime,
                statType: global.searchItem().statType
            }

            $model.province(global.initProvinceData).then(function(res) {
                console.log(global.initProvinceData)
                console.log(res);
                provinceData('undefined', res, true);
            })

            // 扫码趋势、扫码人数、促销效果
            $model.scan_people_promotion(searchItem).then(function (res) {
                // awardPutPv 促销计划，drawPv 抽奖次数，drawResultPv 中奖数量 awardPayPv 领取数量
                var data = res.data;
                if (data.length > 0) {
                    data.forEach(function (n, i) {
                        global.f_axisx.push(n.statTime ? n.statTime : n.weekNo)
                        global.scan_y.push(n.scanPv || 0);
                        global.uv_y.push(n.scanUv || 0);
                        global.awardPut_y.push(n.awardPutPv || 0);
                        global.draw_y.push(n.drawPv || 0);
                        global.drawResult_y.push(n.drawResultPv || 0);
                        global.awardPay_y.push(n.awardPayPv || 0);
                    })

                    trendOption.xAxis.data = userChartOption.xAxis.data = promotionChartOption.xAxis.data = global.f_axisx;
                    trendOption.series[0].data = global.scan_y;
                    trendChart.setOption(trendOption);

                    userChartOption.series[0].data = global.uv_y;
                    userChart.setOption(userChartOption);

                    promotionChartOption.series[0].data = global.awardPut_y;
                    promotionChartOption.series[1].data = global.draw_y;
                    promotionChartOption.series[2].data = global.drawResult_y;
                    promotionChartOption.series[3].data = global.awardPay_y;
                   
                    promotionChart.setOption(promotionChartOption)
                }
            })

            // 地域分析-显示数字
            $model.zone(searchItem).then(function (res) {
                var data = res.data;
                if (data.length > 0) {
                    var change = data[0];
                    $scope.changepv   = change && change.scanPv;
                    $scope.changeuv   = change && change.scanUv;
                    $scope.changepack = change && change.scanCode;
                    $scope.yearpv     = change.scanYtdPv && change.scanYtdPv + '次' || '正在统计中';
                    $scope.yearuv     = change.scanYtdUv && change.scanYtdUv + '人' || '正在统计中';
                    $scope.$apply();
                }
            })

            // 地域分析-地图展示
            var nationwideData = _.cloneDeep(searchItem);
            delete nationwideData.provinceName;
            var reg = /省|市|区/;
            var mongoReg = /内蒙区/;
            $model.zone(nationwideData).then(function (res) {
                //console.log(nationwideData);
                var opts = mapEchart.getOption();
                var data = res.data || [];
                opts.series[1].data = _.each(data, function (d) {
                    //console.log(d);
                    if (d.provinceName != '全国') {
                       d.name = mongoReg.test(d.provinceName) ? '内蒙古' : reg.test(d.provinceName.substr(d.provinceName.length-1)) ? d.provinceName.substr(0, d.provinceName.length - 1) : d.provinceName;
                        d.value = d.scanPv; 
                    }
                }) || [];
                opts.visualMap[0].max = _.max(opts.series[1].data, function (v) {
                    //console.log(v)
                    return v.value
                }).value || 5000;
                mapEchart.setOption(opts);
            })
            // 各规格扫码数分析
            $model.various(searchItem).then(function (res) {
                var data = res.data;
                if (data.length > 0) {
                    data.forEach(function (n, i) {
                        global.t_axisx.push(n.productName);
                        global.various_y.push(n.scanPv);
                    })
                    standardChartOption.xAxis[0].data = global.t_axisx;
                    standardChartOption.series[0].data = global.various_y;
                    standardChart.setOption(standardChartOption);
                }
            })

            // 扫码烟包数
            $model.packet(searchItem).then(function (res) {
                var data = res.data;
                if (data.length > 0) {
                    $scope.yearpack = data.length > 0 && Number(data[data.length - 1].scanYtdCode) + Number(data[data.length - 1].scanYtdPair) || 0;
                    data.forEach(function (n, i) {
                        global.pack_y.push(n.scanCode);
                        global.bar_y.push(n.scanPair);
                        global.s_axisx.push(n.statTime ? n.statTime : n.weekNo);
                    })
                    packedChartOption.xAxis.data = global.s_axisx;
                    packedChartOption.series[0].data = global.pack_y;
                    packedChartOption.series[1].data = global.bar_y;
                    // packedChartOption = {
                    //     xAxis: {
                    //         data: global.s_axisx
                    //     },
                    //     series: [
                    //         {
                    //             data: global.pack_y
                    //         },
                    //         {
                    //             data: global.bar_y
                    //         }
                    //     ]
                    // }
                    packedChart.setOption(packedChartOption);
                }
            })
        }

        // 进入页面就要执行一次默认查询
        $scope.search();
        
        // 烟包数分析 条、盒勾选
        var packorbar = [];
        $scope.updatepackorbar = function (val, num) {
            FN_TICK(val, num, packedChartOption, 'pack')
        }

        // 促销效果分析 4个勾选
        var promobackup = [];
        $scope.updatepromo = function (val, num) {
            FN_TICK(val, num, promotionChartOption, 'promo')
        }

        function FN_TICK(val, num, option, tag) {
            var backarr = tag === 'pack' ? packorbar : promobackup;
            var chart = tag === 'pack' ? packedChart : promotionChart;
            if (val) {
                option.series[num].data = backarr[num].data;
            } else {
                backarr[num] = {};
                backarr[num].data = option.series[num].data
                option.series[num].data = [];
            }
            chart.setOption(option)
        }




        mapEchart.on('click', function (e) {
            alert(1);
            if (e.componentType === 'series') {
                // {provinceName: "湖南省", statTime: "2017-10-24", statType: "day"}
                var data = {
                    provinceName: e.data.provinceName,
                    statTime: global.searchItem().statTime,
                    statType: global.searchItem().statType
                };
                $model.province(data).then(function(res) {
                    provinceData(e, res, false);
                })
            }
        });







        districtChart.on('click', function (params) {
            var zoomSize = 6;
            districtChart.dispatchAction({
                type: 'dataZoom',
                startValue: global.districtAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                endValue: global.districtAxis[Math.min(params.dataIndex + zoomSize / 2, global.districtAxisY.length - 1)]
            });
        });

        function provinceData(e, res, bool) {
            global.districtAxis = [];
            global.districtAxisY = [];
            if (bool) {
                districtOption.title.text = sessionStorage.getItem("account") === 'henan' ? '河南省的各地扫码次数' : '湖南省的各地扫码次数';
            } else {
                districtOption.title.text = e.name + '的各地扫码次数';
            }
            var data = res.data;
            data.forEach(function (n, i) {
                global.districtAxis.push(n.cityName);
                global.districtAxisY.push(n.scanPv || 0);
            });
            districtOption.xAxis.data = global.districtAxis;
            districtOption.series[0].data = global.districtAxisY;
            districtChart.setOption(districtOption);
        }
      }]
  	}
  	return overallController
})