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
        $scope.today = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()].join('-');
        $scope.thismonth = [new Date().getFullYear(), new Date().getMonth() + 1].join('-');

        // datetimepicker初始化
        setDateConf.init($('.overall'), 'day')
        setDateConf.init($('.overall'), 'month')


        // 1. 扫码次数趋势分析
        var trendChart = echarts.init(document.getElementById('trendChart'));
        var base = +new Date(1968, 9, 3);
        var oneDay = 24 * 3600 * 1000; //一天的毫秒数
        var date = [];

        var data = [Math.random() * 300];

        for (var i = 1; i < 20000; i++) {
          var now = new Date(base += oneDay);
          date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
          data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
        }

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
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 10
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
                    data: data
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

        var dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
        var data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
        var yMax = 500;
        var dataShadow = [];

        for (var i = 0; i < data.length; i++) {
            dataShadow.push(yMax);
        }

        var districtOption = {
          title: {
            text: '所选省份的各地扫码次数',
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
            { // For shadow
              type: 'bar',
              itemStyle: {
                  normal: {color: 'rgba(0,0,0,0.05)'}
              },
              barGap:'-100%',
              barCategoryGap:'40%',
              data: dataShadow,
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
              data: data
            }
          ]
        };

        // use configuration item and data specified to show chart
        districtChart.setOption(districtOption);

        var zoomSize = 6;
        districtChart.on('click', function (params) {
            console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
            districtChart.dispatchAction({
                type: 'dataZoom',
                startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
            });
        });

        // 3. 各规格扫码次数分析
        var standardChart = echarts.init(document.getElementById('standardChart'))
        standardChart.showLoading();

        var obama_budget_2012 = $model.$allscans.data;

        standardChart.hideLoading();
        var standardChartOption = {
            title: {
              "text": "各规格扫码次数分析（单位：次）",
              "left": "left"
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
                    magicType: {show: true, type: ['line', 'bar']},
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
                    data : obama_budget_2012.names
                }
            ],
            yAxis: [
                {
                    type : 'value',
                    name : '',
                    axisLabel: {
                        formatter: function (a) {
                            a = +a;
                            return isFinite(a)
                                ? echarts.format.addCommas(+a / 1000)
                                : '';
                        }
                    }
                }
            ],
            dataZoom: [
                {
                    show: true,
                    start: 94,
                    end: 100
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
                    type: 'bar',
                    data: obama_budget_2012.budget2012List
                }
            ]
        };
        standardChart.setOption(standardChartOption);

        // 4. 扫码用户数分析
        var userChart = echarts.init(document.getElementById('userChart'));
        userChart.showLoading();

        var userChartOption = {
            title: {
                text: '扫码用户数分析（单位：人）'
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
                feature: {
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一','周二','周三','周四','周五','周六','周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'邮件营销',
                    type:'line',
                    stack: '总量',
                    data:[120, 132, 101, 134, 90, 230, 210]
                }
            ]
        };

        userChart.hideLoading();
        userChart.setOption(userChartOption);

        // 5. 扫码烟包数分析
        var packedChart = echarts.init(document.getElementById('packedChart'));
        packedChart.showLoading();

        var packedChartOption = {
            title: {
                text: '扫码烟包数分析（单位：个）'
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
                feature: {
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一','周二','周三','周四','周五','周六','周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'联盟广告',
                    type:'line',
                    stack: '总量',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'视频广告',
                    type:'line',
                    stack: '总量',
                    data:[150, 232, 201, 154, 190, 330, 410]
                },
            ]
        };

        packedChart.hideLoading();
        packedChart.setOption(packedChartOption);

        // 6. 促销效果趋势分析
        var promotionChart = echarts.init(document.getElementById('promotionChart'));
        promotionChart.showLoading();

        var promotionChartOption = {
            title: {
                text: '促销效果趋势分析'
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
                feature: {
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一','周二','周三','周四','周五','周六','周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'邮件营销',
                    type:'line',
                    stack: '总量',
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'联盟广告',
                    type:'line',
                    stack: '总量',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'视频广告',
                    type:'line',
                    stack: '总量',
                    data:[150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name:'直接访问',
                    type:'line',
                    stack: '总量',
                    data:[320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name:'搜索引擎',
                    type:'line',
                    stack: '总量',
                    data:[820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };
        promotionChart.hideLoading();
        promotionChart.setOption(promotionChartOption)
      }]
  	}
  	return overallController
})