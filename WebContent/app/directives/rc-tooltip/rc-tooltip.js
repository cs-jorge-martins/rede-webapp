/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {

    'use strict';

    angular
        .module('Conciliador')
        .directive('rcTooltip', rcTooltip);

    function rcTooltip() {

        return {
            restrict: 'E',
            templateUrl: 'app/views/directives/rc-tooltip.html',
            scope: {
                tooltipText: "@"
            },
            controller: Controller
        };

        function Controller($scope) {

            Init();

            function Init() {
            }

        }
    }

})();