/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {
    'use strict';

    angular
        .module('Conciliador')
        .directive('rcMessage', RcMessage);

    function RcMessage() {

        return {
            restrict: 'E',
            templateUrl: 'app/views/directives/rc-message.html',
            scope: {
                type: "=",
                text: "=",
                href: "=",
                actionText: "=",
                onClick: "="
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
                        strIcon = 'icon_exclamacao';
                        break;
                }
                return strIcon;
            }

        }
    }

})();
