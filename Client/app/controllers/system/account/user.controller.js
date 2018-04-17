/**
 * Author: 刘彬
 * Create Date: 2018-04-04
 * Description: 成员管理
 */
define([], function() {
    var userCtrl = {
        ServiceType: "controller",
        ServiceName: "userCtrl",
        ViewModelName: 'userViewModel',
        ServiceContent: ['$scope', function($scope) {
            // TODO...
            var $model = $scope.$model;

            // 默认初始化数据
            var defData = {
                name: '',
                role: '',
                company: '',
                phone: '',
                email: '',
                submitForm: submitForm,
                addEdit: addEdit,
                stop: stop,
                initSearch: initSearch
            };

            // 初始化页面数据
            $scope = angular.extend($scope, defData);

            // 编辑新增
            function addEdit (data) {
                data = angular.extend({}, data, defData);

                initForm(data);

                $("#id_user_modal").modal('show');
            }

            // 停用数据
            function stop (obj) {
                $("#id_tip_modal").on('shown.bs.modal', function (e) {
                    $scope.confim = function () {
                        $model.stop(obj).then(function (res) {

                        });
                    };
                }).on('hidden.bs.modal', function (e) {
                    initSearch();
                }).modal('show');
            }

            // 初始化form表单
            function initForm (data) {
                $scope = angular.extend($scope, data);

            }

            // 表单数据提交函数
            function submitForm (data) {
                $model.postData(data).then(function (res) {

                });
            }

            // 初始化查询
            function initSearch (obj) {
                obj = angular.extend({}, obj);
                $model.getTable(obj).then(function (res) {
                    // 表格数据
                });
            }

            $(document).ready(function () {
                $("#id_user_form select").multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择'
                });

                // 查询
                // initSearch();
            });
        }]
    };

  return userCtrl;
});