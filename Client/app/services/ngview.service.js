/**
 * Author: liubin
 * Create Date: 2017-08-12
 * Description: route
 */

define([], function () {
    /**
     * ngView指令：清除上一次请求页面内容
     * @type {Object}
     */
    var ngViewFactory = {
        ServiceType: "directive",
        ServiceName: "ngView",
        ServiceContent: ['$route', '$anchorScroll', '$animate', function($route, $anchorScroll, $animate) {
            return {
                restrict: 'ECA',
                terminal: true,
                priority: 400,
                transclude: 'element',
                link: function(scope, $element, attr, ctrl, $transclude) {
                    var currentScope,
                        currentElement,
                        previousElement,
                        autoScrollExp = attr.autoscroll,
                        onloadExp = attr.onload || '';

                    scope.$on('$routeChangeSuccess', update);
                    update();

                    function cleanupLastView() {
                        if (previousElement) {
                            previousElement.remove();
                            previousElement = null;
                        }
                        if (currentScope) {
                            currentScope.$destroy();
                            currentScope = null;
                        }
                        if (currentElement) {
                            $animate.leave(currentElement, function() {
                                previousElement = null;
                            });
                            previousElement = currentElement;
                            currentElement = null;
                        }
                    }

                    function update() {
                        var locals = $route.current && $route.current.locals,
                            template = locals && locals.$template;

                        if (angular.isDefined(template)) {
                            var newScope = scope.$new();
                            var current = $route.current;
                            var clone = $transclude(newScope, function(clone) {
                                $animate.enter(clone, null, currentElement || $element, function onNgViewEnter() {
                                    if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                        $anchorScroll();
                                    }
                                });
                                cleanupLastView();
                            });
                            currentElement = clone;
                            currentScope = current.scope = newScope;
                            currentScope.$emit('$viewContentLoaded');
                            currentScope.$eval(onloadExp);
                        } else {
                            cleanupLastView();
                        }
                    }
                }
            };
        }]
    };

    /**
     * ngView指令：填充请求结果到页面容器
     * @type {Object}
     */
    var ngViewFillContentFactory = {
        ServiceType: "directive",
        ServiceName: "ngView",
        ServiceContent: ['$compile', '$controller', '$route', '$q', function($compile, $controller, $route, $q) {
            return {
                restrict: 'ECA',
                priority: -400,
                link: function(scope, $element) {
                    var current = $route.current,
                        locals = current.locals;

                    $element.html(locals.$template);

                    var link = $compile($element.contents());
                    var excuteController = function(model) {
                        if (current.controller) {
                            locals.$scope = scope;
                            if (model) {
                                locals.$scope.$model = model;
                            }
                        }
                        link(scope);
                        //ngView和ngController执行完成，触发事件通知
                        scope.$broadcast('$ExcuteControllerFinished');
                    };
                    var _controller = $(locals.$template).last().attr('ng-controller');
                    if (_controller) {
                        var _model = {},
                            cm = angular.module('tztx.saas.cm'),
                            mm = angular.injector(['tztx.saas.mm']),
                            invokeQueue = _.unzip(_.last(_.unzip(cm._invokeQueue))),
                            viewModelName = _.last(invokeQueue)[_.indexOf(_.first(invokeQueue), _controller)].$model;

                        $route.current.controller = _controller;
                        $q.when(function() {
                            if (mm.has(viewModelName)) {
                                _model = mm.get(viewModelName);
                                if (_model.$model)
                                    _model = new _model.$model();
                            }
                            var promises = _.pick(_model, _.filter(_.keys(_model), function(key) {
                                return /^\$/g.test(key);
                            }));
                            return promises;
                        }).then(function(promises) {
                            return $q.all(promises());
                        }).then(function(locals) {
                            excuteController(_.extend(_model, locals));
                        }, function(error) {
                            console.log('$routeChangeError=>', error);
                        });
                    } else {
                        excuteController();
                    }
                }
            };
        }]
    };
    return [ngViewFactory, ngViewFillContentFactory];
});
