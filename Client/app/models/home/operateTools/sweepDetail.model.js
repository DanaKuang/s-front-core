/**
 * Author: zhaobaoli
 * Create Date: 2017-10-10
 * Description: sweepDetail
 */

define([], function () {
  var sweepDetailModel = {
    ServiceType: 'service',
    ServiceName: 'sweepDetailViewModel',
    ServiceContent: ['request', function (request) {
      this.$model = function () {
        var sweepDetailUrl = '/api/tztx/dataportal/fixatreport/getDetailHome'; //盗扫明细查询
        var codeDetailUrl = '/api/tztx/dataportal/fixatreport/getDetailByCodeId'; //盗扫明细查询
        

        this.$sweepDetailData = function (params) {
          return request.$Search(sweepDetailUrl,params,true);
        }
        this.$detailDataByCode = function (params) {
          return request.$Search(codeDetailUrl,params,true);
        }
        
      };
    }]
  };

  return sweepDetailModel;
});