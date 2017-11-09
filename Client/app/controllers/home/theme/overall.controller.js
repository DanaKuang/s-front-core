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
    	ServiceContent: ['$rootScope', '$scope', 'overallModel', 'setDateConf', function ($rootScope, $scope, $model, setDateConf) {

        var $model = $scope.$model;
        var echarts = require('echarts');

        // datetimepicker初始化
        setDateConf.init($('.day'), 'day')
        setDateConf.init($('.month'), 'month')

        // 默认当日
        $scope.singleSelect = {
          unit: 'day'
        }

        // 当日、当月的placeholder
        $scope.todayplaceholder = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()].join('-');
        $scope.thismonthplaceholder = [new Date().getFullYear(), new Date().getMonth() + 1].join('-');

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

        // 1. 扫码次数趋势分析
        var trendChart = echarts.init(document.getElementById('trendChart'));
        var trendOption = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                left: 'left',
                text: '',
            },
            toolbox: {
                x: '90%',
                feature: {
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            series: [
                {
                    name: '扫码次数',
                    type: 'line',
                    label:{
                        normal:{
                          show:true
                        }
                    },
                    smooth: true,
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: 'rgb(255, 70, 131)'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            }, {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }])
                        }
                    },
                    data: []
                }
            ]
        };

        // 2. 扫码次数地域分析
        var chinaJson = $model.$chinaJson.data;
        echarts.registerMap('china', chinaJson);
        var mapEchart = echarts.init(document.getElementById('baidumap'));
        var mapConf = $model.$mapConf.data;
        mapConf.title.text = '';

        // 鼠标悬浮地图上面时，针对悬浮区域的tip展示
        mapConf.tooltip.formatter = function (params) {
            return params.name + '<br>' + 'PV:' + (params.data.value || 0);
        }
        mapEchart.setOption(mapConf);

        var districtChart = echarts.init(document.getElementById('districtChart'));

        var districtOption = {
          title: {
            text: '',
          },
          toolbox: {
            x: '85%',
            feature: {
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          xAxis: {
            data: global.districtAxis,
            axisLabel: {
              inside: false,
              textStyle: {
                color: '#000'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            z: 10
          },
          yAxis: {
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#999'
              }
            }
          },
          dataZoom: [
            {
              type: 'inside'
            }
          ],
          series: [
            {
              type: 'bar',
              label: {
                  normal: {
                    show: true,
                    position: 'top',
                    textStyle: {
                        color: 'black'
                    }
                  }
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                    [
                        {offset: 0, color: '#83bff6'},
                        {offset: 0.5, color: '#188df0'},
                        {offset: 1, color: '#188df0'}
                    ]
                  )
                },
                emphasis: {
                  color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                    [
                      {offset: 0, color: '#2378f7'},
                      {offset: 0.7, color: '#2378f7'},
                      {offset: 1, color: '#83bff6'}
                    ]
                  )
                }
              },
              data: global.districtAxisY
            }
          ]
        };

        mapEchart.on('click', function (e) {
            if (e.componentType === 'series') {
                // {provinceName: "湖南省", statTime: "2017-10-24", statType: "day"}
                var data = {
                    provinceName: e.name + '省',
                    statTime: global.searchItem().statTime,
                    statType: global.searchItem().statType
                };
                $model.province(data).then(function(res) {
                    provinceData(e, res, false);
                })
            }
        });

        var zoomSize = 6;
        districtChart.on('click', function (params) {
            districtChart.dispatchAction({
                type: 'dataZoom',
                startValue: global.districtAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                endValue: global.districtAxis[Math.min(params.dataIndex + zoomSize / 2, global.districtAxisY.length - 1)]
            });
        });

        // 3. 各规格扫码次数分析
        var standardChart = echarts.init(document.getElementById('standardChart'))

        var standardChartOption = {
            title: {
              "text": "",
              "left": "left"
            },
            legend: {
                data:['扫码次数'],
                right: '12%'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    // label: {
                    //     show: true
                    // }
                }
            },
            toolbox: {
                x: '90%',
                show : true,
                feature : {
                    mark : {show: true},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            grid: {
                top: '12%',
                left: '1%',
                right: '10%',
                containLabel: true
            },
            xAxis: [
                {
                    type : 'category',
                    data : [],
                    axisLabel:{
                        interval: 0,
                        rotate: -20
                    }
                }
            ],
            yAxis: [
                {
                    type : 'value',
                    name : ''
                }
            ],
            dataZoom: [
                {
                    // show: true,
                    start: 0,
                    end: 50
                },
                {
                    type: 'inside',
                    start: 94,
                    end: 100
                },
                // {
                //     show: true,
                //     yAxisIndex: 0,
                //     filterMode: 'empty',
                //     width: 30,
                //     height: '80%',
                //     showDataShadow: false,
                //     left: '93%'
                // }
            ],
            series : [
                {
                    name: '扫码次数',
                    type: 'bar',
                    label: {
                      normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: 'black'
                        }
                      }
                    },
                    data: []
                }
            ]
        };

        // 4. 扫码用户数分析
        var userChart = echarts.init(document.getElementById('userChart'));

        var userChartOption = {
            title: {
                text: ''
            },
            legend: {
                data:['扫码用户数'],
                right: 0
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                y: '6%',
                x: '95%',
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'扫码用户数',
                    type:'line',
                    label: {
                      normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: 'black'
                        }
                      }
                    },
                    stack: '总量',
                    data:[]
                }
            ]
        };

        // 5. 扫码烟包数分析
        var packedChart = echarts.init(document.getElementById('packedChart'));

        var packedChartOption = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['盒','条'],
                right: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                y: '6%',
                x: '95%',
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'盒',
                    type:'line',
                    label: {
                      normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: 'black'
                        }
                      }
                    },
                    data:[]
                },
                {
                    name:'条',
                    type:'line',
                    label: {
                      normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: 'black'
                        }
                      }
                    },
                    data:[]
                },
            ]
        };

        packedChart.setOption(packedChartOption);

        // 6. 促销效果趋势分析
        var promotionChart = echarts.init(document.getElementById('promotionChart'));

        var promotionChartOption = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['促销计划','抽奖次数','中奖数量','领取数量'],
                right: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                y: '6%',
                x: '95%',
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'促销计划',
                    type:'line',
                    label: {
                      normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: 'black'
                        }
                      }
                    },
                    data:[]
                },
                {
                    name:'抽奖次数',
                    type:'line',
                    label: {
                      normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: 'black'
                        }
                      }
                    },
                    data:[]
                },
                {
                    name:'中奖数量',
                    type:'line',
                    label: {
                      normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: 'black'
                        }
                      }
                    },
                    data:[]
                },
                {
                    name:'领取数量',
                    type:'line',
                    label: {
                      normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: 'black'
                        }
                      }
                    },
                    data:[]
                }
            ]
        };

        global.searchItem = function () {
            return {
                provinceName: '全国',
                statType: $scope.singleSelect.unit === 'day' ? 'day' : $scope.singleSelect.unit === 'week' ? 'week' : 'month' || '',
                statTime: $scope.singleSelect.unit === 'day' ? $scope.day || $scope.todayplaceholder : $scope.singleSelect.unit === 'month' ? $scope.month || $scope.thismonthplaceholder : $scope.week
            }
        }

        // 搜索，进入页面默认查询当日数据
        $scope.search = search;
        function search() {
            init();
            var searchItem = global.searchItem();

            // 初始地图及起右边柱状图
            global.initProvinceData = {
                provinceName: sessionStorage.getItem("account") === 'henan' ? '河南省' : '湖南省',
                statTime: global.searchItem().statTime,
                statType: global.searchItem().statType
            }

            $model.province(global.initProvinceData).then(function(res) {
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
            $model.zone(nationwideData).then(function (res) {
                var data = res.data || [];
                if (data.length > 0) {
                    mapConf.series[1].data = _.each(data, function (d) {
                        d.name = d.provinceName;
                        d.value = d.scanPv;
                    }) || [];

                    mapConf.dataRange.max = _.max(mapConf.series[1].data, function (v) {return v.value}).value || 5000;
                    mapEchart.setOption(mapConf);
                }
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
                    packedChartOption = {
                        xAxis: {
                            data: global.s_axisx
                        },
                        series: [
                            {
                                data: global.pack_y
                            },
                            {
                                data: global.bar_y
                            }
                        ]
                    }
                    packedChart.setOption(packedChartOption);
                }
            })
        }
        
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

        function provinceData(e, res, bool) {
            global.districtAxis = [];
            global.districtAxisY = [];
            if (bool) {
                districtOption.title.text = sessionStorage.getItem("account") === 'henan' ? '河南省的各地扫码次数' : '湖南省的各地扫码次数';
            } else {
                districtOption.title.text = e.name + '省的各地扫码次数';
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

        // 进入页面初始化
        search();
      }]
  	}
  	return overallController
})