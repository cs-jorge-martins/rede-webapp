/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {
    'use strict';

    angular
        .module('Conciliador')
        .directive('rcTimeline', RcTimeline);

    function RcTimeline() {

        return {
            restrict: 'E',
            templateUrl: 'app/views/directives/rc-timeline.html',
            scope: {
                cssClass: "=",
                dateRange: "=",
                maxDateRange: "=",
                monetaryValues: "=",
                labelInitialValue: "=",
                labelFinalValue: "=",
                initialValue: "=",
                finalValue: "=",
                totalValue: "=",
                labelTotalValue: "=",
                timeLinePercentage: "="
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
