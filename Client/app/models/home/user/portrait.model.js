define([], function () {
    var portraitModel = {
      ServiceType: 'service',
      ServiceName: 'PortraitViewModel',
      ServiceContent: ['request', function (request) {
        this.$model = function () {

//          console.log("portrait is under Model")
        var CITY_JSON_URL = '/statics/home/user/portrait/test.json';    //各市地扫码次数
        var HOURS_JSON_URL = '/statics/home/user/portrait/hours.json';     //扫码次数时刻趋势
        var GUIJICHART_JSON_URL = '/statics/home/user/portrait/GuijiChart.json';
        var HOURSCHART_JSON_URL = '/statics/home/user/portrait/hoursChart.json';
        //扫码次数时刻趋势
		var getPhoneNo= '/api/tztx/dataportal/consumer/getOpenIdBymobile'; //用户手机号查询
		var getJiBenInfo='/api/tztx/dataportal/consumer/getUserBasicInfo';//用户基本信息
		var getSaoPinFen='/api/tztx/dataportal/consumer/getUserScanFree';//用户扫码频度分析
		var getSaoJieFen='/api/tztx/dataportal/consumer/getUserScandayBar';//用户扫码结构分析
		var getSaoYanFen='/api/tztx/dataportal/consumer/getUserScanBrandThirty';
	//近30天用户扫码烟包数
		var getSaoGeGuiFen='/api/tztx/dataportal/consumer/getUserScanLocus';
	//用户扫码轨迹
		var getTableInfo='/api/tztx/dataportal/consumer/getUserBrandScanTable';
	//用户各规格扫码烟包数
		var getSaoHourFen='/api/tztx/dataportal/consumer/getUserScanHourPie';
	//用户掃碼時段分析

        this.$citychart = request.$Query(CITY_JSON_URL);
        this.$hours = request.$Query(HOURS_JSON_URL);
        this.$Guijichart = request.$Query(GUIJICHART_JSON_URL);
        this.$hourschart = request.$Query(HOURSCHART_JSON_URL);

		this.$getPhoneNo = function (params) {
          return request.$Search(getPhoneNo,params,true);
        }
		this.$getJiBenInfo = function (params) {
          return request.$Search(getJiBenInfo,params,true);
        }
		this.$getSaoPinFen = function (params) {
          return request.$Search(getSaoPinFen,params,true);
        }
		this.$getSaoJieFen = function (params) {
          return request.$Search(getSaoJieFen,params,true);
        }
		this.$getSaoYanFen = function (params) {
          return request.$Search(getSaoYanFen,params,true);
        }
		this.$getSaoGeGuiFen = function (params) {
          return request.$Search(getSaoGeGuiFen,params,true);
        }
		this.$getTableInfo = function (params) {
          return request.$Search(getTableInfo,params,true);
        }
		this.$getSaoHourFen = function (params) {
          return request.$Search(getSaoHourFen,params,true);
        }

        };
      }]
    };

    return portraitModel;
  });