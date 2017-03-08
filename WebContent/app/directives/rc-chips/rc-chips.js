/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

"use strict";

(function() {

    angular
        .module('Conciliador')
        .directive('rcChips', RcChips)
        .directive('rcChip', RcChip);

    function RcChips() {
        return {
            restrict: 'E',
            templateUrl : 'app/views/directives/rc-chips.html',
            transclude: true,
            scope: { },
            controller: Controller
        };

        function Controller() {
            Init();

            function Init() { }
        }
    }

    function RcChip() {
        return {
            restrict: 'E',
            templateUrl : 'app/views/directives/rc-chip.html',
            scope: {
                show: '=?',
                tooltipText: '=?',
                closeable: '=?',
                label: '=',
                onClear: '&'
            },
            controller: Controller
        };

        function Controller() {

            Init();

            function Init() {
                //$scope.show = true;
                //$scope.closeable = false;
            }
        }
    }
})();
