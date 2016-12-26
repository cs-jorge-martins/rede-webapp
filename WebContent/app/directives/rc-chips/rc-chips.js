/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {
    'use strict';
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

        function Controller($scope) {
            Init();

            function Init() { }
        }
    }

    function RcChip() {
        return {
            restrict: 'E',
            templateUrl : 'app/views/directives/rc-chip.html',
            transclude: true,
            scope: {
                show: '=?',
                closeable: '=?',
                label: '=',
                onClear: '&'
            },
            controller: Controller
        };

        function Controller($scope) {

            Init();

            function Init() {
                $scope.show = true;
                $scope.closeable = false;
            }
        }
    }
})();