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
                totalValue: "=?",
                labelTotalValue: "="
            },
            controller: Controller
        };

        function Controller($scope) {

            Init();

            function Init() {
                GetPercentage();
            }

            $scope.$watchGroup(['initialValue', 'finalValue'], function(newValues, oldValues) {
                GetPercentage();
            }, true);

            
            function GetPercentage() {

                var xCompareValue = $scope.totalValue || $scope.finalValue;

                if($scope.initialValue === 0 && xCompareValue === 0) {
                    $scope.timeLinePercentage = 0;
                } else {
                    $scope.timeLinePercentage = $scope.initialValue / xCompareValue * 100;
                }

            }

        }
    }

})();
