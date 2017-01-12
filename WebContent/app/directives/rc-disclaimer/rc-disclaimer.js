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

    function RcDisclaimer() {

        return {
            restrict: 'E',
            templateUrl: 'app/views/directives/rc-disclaimer.html',
            scope: {
                type: "=",
                text: "=",
                actionText: "=",
                onClick: "&"
            },
            controller: Controller
        };

        function Controller($scope) {

            Init();

            function Init() {
                if($scope.type) {
                    $scope.icon = VerifyIconType($scope.type);
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

