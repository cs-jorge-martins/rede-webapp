/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {
    'use strict';

    angular
        .module('KaplenWeb')
        .directive('rcTimeline', RcTimeline);

    function RcTimeline() {

        return {
            restrict: 'E',
            templateUrl: 'app/views/directives/rc-timeline.html',
            scope: {
                dateRange: "@",
                maxDateRange: "@",
                initialValue: "@",
                finalValue: "@",
                timeLinePercentage: "@"
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