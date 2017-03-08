/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */


/**
 * @class Conciliador.rcBreadcrumb
 * Diretiva de breadcrumb
 *
 * Adiciona na página o caminho completo de páginas antecessoras para se chegar na atual. O caminho do breadcrumb é
 * definido na rota específica do arquivo /app/routes.js
 *
 * Exemplo:
 *
 *     @example
 *     <rc-breadcrumb></rc-breadcrumb>
 */

"use strict";

(function() {

    angular
        .module('Conciliador')
        .directive('rcBreadcrumb', Breadcrumb);

    Breadcrumb.$inject = ['$route'];

    function Breadcrumb($route) {
        return {
            restrict: 'E',
            templateUrl: 'app/views/directives/rc-breadcrumb.html',
            controller: Controller
        };

        function Controller($scope) {

            Init();

            function Init() {
                $scope.breadcrumb = null;
                WatchBreadcrumb();
            }

            $scope.getBreadCrumb = function GetBreadcrumb(arrBreadcrumbSteps) {
                var objBreadcrumb = {};
                var strActualStep;
                var objActualRoute;
                var intStepsIndex;

                if (arrBreadcrumbSteps) {
                    for (intStepsIndex in arrBreadcrumbSteps) {
                        strActualStep = arrBreadcrumbSteps[intStepsIndex];

                        for(var route in $route.routes) {
                            if ($route.routes[route].breadcrumb) {
                                objActualRoute = $route.routes[route];

                                if (strActualStep === objActualRoute.breadcrumb[objActualRoute.breadcrumb.length - 1] ) {
                                    objBreadcrumb[strActualStep] = '#' + objActualRoute.originalPath;
                                }
                            }
                        }
                    }
                }

                if (Object.keys(objBreadcrumb).length) {
                    $scope.breadcrumb = objBreadcrumb;
                } else {
                    $scope.breadcrumb = null;

                }
            };

            function WatchBreadcrumb() {
                $scope.$on('$routeChangeSuccess', function() {
                    var arrBreadcrumbSteps = $route.current.$$route.breadcrumb;
                    $scope.getBreadCrumb(arrBreadcrumbSteps);
                });
            }
        }
    }

})();
