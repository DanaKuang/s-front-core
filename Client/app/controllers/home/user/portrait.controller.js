define([], function () {
    var PortraitController = {
      ServiceType: 'controller',
      ServiceName: 'PortraitCtrl',
      ViewModelName: 'PortraitViewModel',
      ServiceContent: ['$scope','setDateConf', function ($scope,setDateConf) {
      	var echarts = require('echarts');
		var myChart = echarts.init(document.getElementById('main'));
			var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {
            	
            },
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [50, 20, 36, 10, 10, 20]
            }]
        };
        myChart.setOption(option,true);       
      }]
    };
  
    return PortraitController;
  });