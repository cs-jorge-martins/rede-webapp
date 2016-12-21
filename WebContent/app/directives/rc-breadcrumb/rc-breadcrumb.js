/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {
    'use strict';

    angular
        .module('Conciliador')
        .directive('rcBreadcrumb', Breadcrumb);

    Breadcrumb.$inject = ['$route'];

    function Breadcrumb($route) {
        return {
            restrict: 'E',
            templateUrl: 'app/views/directives/rc-breadcrumb.html',
            controller: controller
        };

        function controller($scope) {

            init();

            function init() {
                $scope.breadcrumb = null;
                watchBreadcrumb();
            }

            function watchBreadcrumb() {
                $scope.$on('$routeChangeSuccess', function() {
                    getBreadcrumb();
                });
            }

            function getBreadcrumb() {
                var breadcrumb = {};
                var breadcrumbSteps = $route.current.$$route.breadcrumb;
                var actualStep;
                var actualRoute;

                if (breadcrumbSteps) {
                    for (var stepsIndex in breadcrumbSteps) {
                        actualStep = breadcrumbSteps[stepsIndex];

                        for(var route in $route.routes) {
                            if ($route.routes[route].breadcrumb) {
                                actualRoute = $route.routes[route];

                                if (actualStep === actualRoute.breadcrumb[actualRoute.breadcrumb.length - 1] ) {
                                    breadcrumb[actualStep] = '#' + actualRoute.originalPath;
                                }
                            }
                        }
                    }
                }

                if (Object.keys(breadcrumb).length) {
                    $scope.breadcrumb = breadcrumb;
                } else {
                    $scope.breadcrumb = null;
                }
            }
        }
    }

})();