/**
 * Author: {author}
 * Create Date: 2017-10-16
 * Description: interface
 */
define([], function () {
    var systemsettingsModel = {
        ServiceType: "service",
        ServiceName: "systemsettingsViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                var stytemParamUrl = '/api/tztx/dataportal/fxback/getSystemParam';//获取系统设置内容
                var setStytemParamUrl = '/api/tztx/dataportal/fxback/setSystemParam';//设置系统参数

                this.$getSystemParam = function () {
         			 return request.$Search(stytemParamUrl,{},true);
      			}
                this.$setSystemParam = function (params) {
         			 return request.$Search(setStytemParamUrl,params,true);
      			}
            };
        }]
    };
    return systemsettingsModel;
});