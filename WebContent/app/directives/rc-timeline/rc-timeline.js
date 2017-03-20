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
            controller: Controller,
            link: function (scope, element) {

                element.ready(function () {
                    scope.$watch("initialValue", function (intNewValue) {
                        if(!intNewValue) {
                            scope.initialValue = 0;
                        }
                    });
                    scope.$watch("finalValue", function (intNewValue) {
                        if(!intNewValue) {
                            scope.finalValue = 0;
                        }
                    });
                });

            }
        };

        function Controller($scope) {

            Init();

            $scope.fullClass = 'full';

            function Init() {
                GetPercentage();
            }

            $scope.$watchGroup(['initialValue', 'finalValue'], function() {
                GetPercentage();
            }, true);


            function GetPercentage() {

                var intCompareValue = $scope.totalValue || $scope.finalValue;
                var intPercentage = 0;
                var strPercentage = "0";

                if($scope.initialValue !== 0 && intCompareValue !== 0) {
                    intPercentage = $scope.initialValue / intCompareValue * 100;
                }

                if( intPercentage > 0 && intPercentage < 1 ) {
                    intPercentage = 1;
                    strPercentage = "<1";
                } else {
                    intPercentage = Math.floor(intPercentage);
                    strPercentage = "" + intPercentage;
                }

                if($scope.monetaryValues) {
                    strPercentage = strPercentage + "% do valor";
                } else {
                    strPercentage = strPercentage + "%";
                }

                $scope.timeLinePercentage = intPercentage;
                $scope.timeLinePercentageLabel = strPercentage;
            }

        }
    }

})();
