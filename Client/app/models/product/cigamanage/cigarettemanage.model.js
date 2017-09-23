/**
 * Author: kuang
 * Create Date: 2017-09-20
 * Description: cigarettemanage
 */

define([], function () {
    var cigarettemanageModel = {
        ServiceType: 'service',
        ServiceName: 'cigarettemanageModel',
        ServiceContent: ['request', function (request) {
            //定义资源
            var $model = this;

            var LIST = '/api/tztx/saas/saotx/product/tobaccoList';

            var GET_ALL_BRANDS = '/api/tztx/saas/saotx/brand/queryBrands';

            var CHECK_SN = '/api/tztx/saas/saotx/product/queryProductTobacco';

            var CHECK_TYEP = '/api/tztx/saas/saotx/common/queryDimTobaccoType';

            var CHECK_PACK = '/api/tztx/saas/saotx/common/queryDimTobaccoPack';

            var CHECK_STYLE = '/api/tztx/saas/saotx/common/queryDimTobaccoStyle';

            var CHECK_GRADE = '/api/tztx/saas/saotx/common/queryDimTobaccoGrade';

            // 获取列表数据
            $model.getlist = function (params) {
                return request.$Search(LIST, params);
            };

            // 获取品牌数据
            $model.getbrands = function () {
                return request.$Search(GET_ALL_BRANDS);
            }

            // 查询sn条形码
            $model.checksn = function (params) {
                return request.$Search(CHECK_SN, params)
            }

            // 查询烟草规格
            $model.checktype = function () {
                return request.$Search(CHECK_TYEP)
            }

            // 查询烟草包装单位
            $model.checkpack = function () {
                return request.$Search(CHECK_PACK)
            }

            // 查询卷烟类型
            $model.checkstyle = function () {
                return request.$Search(CHECK_STYLE)
            }

            // 查询价类、二级价类
            $model.checkgrade = function (params) {
                return request.$Search(CHECK_GRADE, params)
            }

        }]
    }
    return cigarettemanageModel
})
