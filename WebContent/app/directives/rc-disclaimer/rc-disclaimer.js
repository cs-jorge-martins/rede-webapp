/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {

    'use strict';

    angular
        .module('Conciliador')
        .directive('rcDisclaimer', RcDisclaimer);

    RcDisclaimer.$inject = ['$timeout'];

    function RcDisclaimer($timeout) {

        return {
            restrict: 'E',
            templateUrl: 'app/views/directives/rc-disclaimer.html',
            scope: {
                type: "=",
                text: "=",
                actionText: "=",
                onClick: "="
            },
            controller: Controller,
            link: function($scope, element, attrs) {
                $scope.$on('$routeChangeSuccess', function(event, current, previous) {
                    if(current.$$route.originalPath.match("/home")) {
                        $scope.loadedClass = "loaded";
                    } else {
                        $scope.loadedClass = "";
                    }
                });
            }

        };

        function Controller($scope) {

            Init();

            function Init() {
                if($scope.type) {
                    $scope.icon = VerifyIconType($scope.type);
                    $scope.loadedClass = "loaded";
                }
            }

            function VerifyIconType(strType) {
                var strIcon;
                switch (strType) {
                    default:
                        strIcon = 'icon_full_exclamacao';
                        break;
                }
                return strIcon;
            }

        }
    }

})();
