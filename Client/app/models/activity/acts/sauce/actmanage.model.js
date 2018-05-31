/**
 * Author: zhaobaoli
 * Create Date: 2018-03-05
 * Description: 活动管理接口
 */
define([], function () {
    var actmanageModel = {
        ServiceType: "service",
        ServiceName: "actmanageViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
            	var getProvince = '/api/tztx/dataportal/fxback/getProvince';//省份
            	var getCity = '/api/tztx/dataportal/fxback/getCity';//地市
            	var getArea = '/api/tztx/dataportal/fxback/getCountry';//区县
                var actListUrl = '/api/tztx/xj/activity/list';//活动列表
                var saveOrUpdateActUrl = '/api/tztx/xj/activity/saveOrUpdate';  //新增或是修改活动列表
                var getAwardListUrl = '/api/tztx/xj/award/listDraw'; //获取活动领奖明细列表
                var getAwardLevelsUrl = '/api/tztx/xj/award/listLevel'; //获取活动配置奖项等级
                var getActivityDetailUrl = '/api/tztx/xj/activity/detail'; //获取活动详情
                
               	this.$getProvince = function () {
         			 return request.$Search(getProvince,{},true);
      			}
               	this.$getCity = function (params) {
         			 return request.$Search(getCity,params,true);
      			}
               	this.$getArea = function (params) {
         			 return request.$Search(getArea,params,true);
                }
                this.$getActList = function (params) {
                    return request.$Search(actListUrl,params,true);
                }
                this.$getAwardList = function (params) {
                    return request.$Search(getAwardListUrl,params,true);
                }
                this.$saveOrUpdateAct = function (params) {
                    return request.$Search(saveOrUpdateActUrl,params,true);
                }
                this.$getAwardLevels = function (params) {
                    return request.$Search(getAwardLevelsUrl,params,true);
                }
                this.$getActivityDetail = function (params) {
                    return request.$Search(getActivityDetailUrl,params,true);
                }
      			
            };
        }]
    };
    return actmanageModel;
});