/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

"use strict";

(function() {

    angular
        .module('Conciliador')
        .directive('rcTooltip', RcTooltip);

    function RcTooltip() {

        return {
            restrict: 'E',
            templateUrl: 'app/views/directives/rc-tooltip.html',
            scope: {
                tooltipText: "@"
            },
            controller: Controller
        };

        function Controller() {

            Init();

            function Init() {
            }

        }
    }

})();
