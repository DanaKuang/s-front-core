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
        // 默认当日
        $scope.singleSelect = {
          unit: 'day'
        }
        $scope.todayplaceholder = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()].join('-');
        $scope.thismonthplaceholder = [new Date().getFullYear(), new Date().getMonth() + 1].join('-');

        // datetimepicker初始化
        setDateConf.init($('.day'), 'day')
        setDateConf.init($('.month'), 'month')

        // 选择周
        $scope.$watch('singleSelect.unit', function (n, o, s) {
            if ( n === 'week' && !global.week) {
                global.week = true;
                $model.getweeks().then(function (res) {
                    var data = res.data || [{weekId: ''}];
                    data.forEach(function (n, i) {
                        var a = n.weekNo.substr(n.weekNo.indexOf('(')+1);
                        a = a.substr(0, a.indexOf('~')).replace(/\./g, '-');
                        data[i].weekId = a;
                    })
                    console.log(data);
                    $scope.allweek = data;
                    $scope.week = $scope.allweek[0].weekId;
                    $scope.$apply()
                })
            }
        })

        var global = {};
        init();
        function init() {
            global.f_axisx      = []; // 扫码次数、扫码人数、促销趋势x轴
            global.s_axisx      = []; // 扫码烟包数x轴
            global.t_axisx      = []; // 各规格烟包数分析x轴
            global.scan_y       = [];
            global.uv_y         = [];
            global.awardPut_y   = []; //促销计划
            global.draw_y       = []; //抽奖次数
            global.drawResult_y = []; //中奖数量
            global.awardPay_y   = []; //领奖数量
            global.pack_y       = [];
            global.bar_y        = [];
            global.various_y    = []; // 各规格扫码烟包数分析
            $scope.checked      = true;
        }

        global.searchItem = function () {
            return {
                provinceName: '全国',
                statType: $scope.singleSelect.unit === 'day' ? 'day' : $scope.singleSelect.unit === 'week' ? 'week' : 'month' || '',
                statTime: $scope.singleSelect.unit === 'day' ? $scope.day || $scope.todayplaceholder : $scope.singleSelect.unit === 'month' ? $scope.month || $scope.thismonthplaceholder : $scope.week
            }
        }

        // 搜索，进入页面默认查询当日数据
        search();
        $scope.search = search;
        function search() {
            init();
            var searchItem = global.searchItem();

            // 扫码趋势、扫码人数、促销效果
            $model.scan_people_promotion(searchItem).then(function (res) {
                // awardPutPv 促销计划，drawPv 抽奖次数，drawResultPv 中奖数量 awardPayPv 领取数量
                var data = res.data;
                data.forEach(function (n, i) {
                    global.f_axisx.push(n.statTime ? n.statTime : n.weekNo)
                    global.scan_y.push(n.scanPv);
                    global.uv_y.push(n.scanUv);
                    global.awardPut_y.push(n.awardPutPv); //促销计划
                    global.draw_y.push(n.drawPv); //抽奖次数
                    global.drawResult_y.push(n.drawResultPv); //中奖数量
                    global.awardPay_y.push(n.awardPayPv); //领奖数量
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
            })

            // 地域分析
            $model.zone(searchItem).then(function (res) {
                var data = res.data;
                var change = data[0];
                $scope.changepv   = change && change.scanPv;
                $scope.changeuv   = change && change.scanUv;
                $scope.changepack = change && change.scanCode;
                $scope.$apply();
            })

            // 扫码烟包数
            $model.packet(searchItem).then(function (res) {
                var data = res.data;
                data.forEach(function (n, i) {
                    global.pack_y.push(n.scanCode);
                    global.bar_y.push(n.scanPair);
                    global.s_axisx.push(n.statTime ? n.statTime : n.weekNo);
                })
                packedChartOption.xAxis.data = global.s_axisx;
                packedChartOption.series[0].data = global.pack_y;
                packedChartOption.series[1].data = global.bar_y;
                packedChart.setOption(packedChartOption);
            })

            // 各规格烟包数分析
            $model.various(searchItem).then(function (res) {
                var data = res.data;
                data.forEach(function (n, i) {
                    global.t_axisx.push(n.productName);
                    global.various_y.push(n.scanPv);
                })
                standardChartOption.xAxis[0].data = global.t_axisx;
                standardChartOption.series[0].data = global.various_y;
                standardChart.setOption(standardChartOption);
            })
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
                text: '扫码次数趋势分析',
            },
            toolbox: {
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
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100
            }, {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: [
                {
                    name: '扫码次数',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
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
        trendChart.setOption(trendOption)
        

        // 2. 扫码次数地域分析
        var chinaJson = $model.$chinaJson.data;
        echarts.registerMap('china', chinaJson);
        var mapEchart = echarts.init(document.getElementById('baidumap'));
        var mapConf = $model.$mapConf.data;
        mapEchart.setOption(mapConf);
        
        var districtChart = echarts.init(document.getElementById('districtChart'));

        var dataAxis = [];
        var dataAxisY = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
        var yMax = 500;

        var districtOption = {
          title: {
            text: '所选省份的各地扫码次数',
          },
          toolbox: {
            feature: {
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          xAxis: {
            data: dataAxis,
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
                  normal: {color: 'rgba(0,0,0,0.05)'}
              },
              barGap:'-100%',
              barCategoryGap:'40%',
              data: [],
              animation: false
            },
            {
              type: 'bar',
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
              data: dataAxisY
            }
          ]
        };

        // use configuration item and data specified to show chart
        districtChart.setOption(districtOption);

        mapEchart.on('click', function (e) {
            if (e.componentType === 'series') {
                // {provinceName: "湖南省", statTime: "2017-10-24", statType: "day"}
                var data = {
                    provinceName: e.name + '省',
                    statTime: global.searchItem().statTime,
                    statType: global.searchItem().statType
                }
                var xAxis = [];
                var yAxis = [];
                $model.province(data).then(function(res) {
                    var data = res.data;
                    data.forEach(function (n, i) {
                        // yMax
                        xAxis.push(n.cityName);
                        yAxis.push(n.scanPv);
                    })
                    districtOption.xAxis.data = dataAxis = xAxis;
                    districtOption.series[0].data = dataAxisY = yAxis;
                    districtChart.setOption(districtOption);
                })
            }
        });

        var zoomSize = 6;
        districtChart.on('click', function (params) {
            districtChart.dispatchAction({
                type: 'dataZoom',
                startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, dataAxisY.length - 1)]
            });
        });

        // 3. 各规格扫码次数分析
        var standardChart = echarts.init(document.getElementById('standardChart'))

        var standardChartOption = {
            title: {
              "text": "各规格扫码次数分析（单位：次）",
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
                    label: {
                        show: true
                    }
                }
            },
            toolbox: {
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
                    data : []
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
                    show: true,
                    start: 0,
                    end: 50
                },
                {
                    type: 'inside',
                    start: 94,
                    end: 100
                },
                {
                    show: true,
                    yAxisIndex: 0,
                    filterMode: 'empty',
                    width: 30,
                    height: '80%',
                    showDataShadow: false,
                    left: '93%'
                }
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
        standardChart.setOption(standardChartOption);

        // 4. 扫码用户数分析
        var userChart = echarts.init(document.getElementById('userChart'));

        var userChartOption = {
            title: {
                text: '扫码用户数分析（单位：人）'
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

        userChart.setOption(userChartOption);

        // 5. 扫码烟包数分析
        var packedChart = echarts.init(document.getElementById('packedChart'));

        var packedChartOption = {
            title: {
                text: '扫码烟包数分析（单位：个）'
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
                    stack: '总量',
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
                    stack: '总量',
                    data:[]
                },
            ]
        };

        packedChart.setOption(packedChartOption);

        // 6. 促销效果趋势分析
        var promotionChart = echarts.init(document.getElementById('promotionChart'));

        var promotionChartOption = {
            title: {
                text: '促销效果趋势分析'
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
                    stack: '总量',
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
                    stack: '总量',
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
                    stack: '总量',
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
                    stack: '总量',
                    data:[]
                }
            ]
        };
        promotionChart.setOption(promotionChartOption)
      }]
  	}
  	return overallController
})