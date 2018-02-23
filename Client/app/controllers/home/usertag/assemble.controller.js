/**
 * Author: liubin
 * Create Date: 2018-02-22
 * Description: 标签组合管理
 */

define([], function() {
    var assembleCtrl = {
        ServiceType: "controller",
        ServiceName: "assembleCtrl",
        ViewModelName: 'assembleViewModel',
        ServiceContent: ['$scope', 'dateFormatFilter', 'alertService', function($scope, df, as) {
            var $model = $scope.$model;

            var formDef = {
                name: '',
                stime: '',
                etime: '',
                type: 1,
                detail: '',
                props: '',
                reset: fResetFn,
                save: fSaveFn
            }
            // 属性扩展
            $scope = angular.extend($scope, {
                assemble: '',
                tData: [],
                build: buildFn,
                edit: editFn,
                del: delFn
            });

            $scope.f = angular.extend({}, $scope.f, formDef);

            // 生成
            function buildFn (id) {
                $("#id_build .date").datetimepicker({
                    language: "zh-CN",
                    format: "yyyy-mm",
                    autoclose: true,
                    todayBtn: true,
                    startView: 3,
                    minView: 3,
                    maxView: 4,
                    startDate: ""
                });
                $("#id_build").on('show.bs.modal', function () {
                    console.log('显示了');
                }).on('hidden.bs.modal', function () {
                    $scope.f = angular.extend({}, $scope.f, formDef);
                }).modal('show');
            }
            // 修改
            function editFn (id) {
                as.alert(id);
            }
            // 删除
            function delFn (id) {
                $("#id_alert").modal('show').find('[type="submit"]').click(function (e) {
                    console.log('删除....');
                });
            }

            // 表单 重置
            function fResetFn () {
                $scope.f = angular.extend({}, $scope.f, formDef);
            }
            // 表单提交
            function fSaveFn () {

            }

            $scope.tData = [{
                id: 1,
                name: '测试数据',
                type: '测试属性'
            }, {
                id: 2,
                name: '测试数据',
                type: '测试属性'
            }, {
                id: 3,
                name: '测试数据',
                type: '测试属性'
            }, {
                id: 4,
                name: '测试数据',
                type: '测试属性'
            }];
        }]
    }
    return assembleCtrl;
});