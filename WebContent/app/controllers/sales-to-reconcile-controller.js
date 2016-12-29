/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {

    'use strict';

    angular
        .module('Conciliador.salesToReconcileController', [])
        .controller('salesToReconcileController', salesToReconcile);

    salesToReconcile.$inject = ['filtersService', '$scope', 'calendarFactory'];

    function salesToReconcile(filterService, $scope, calendarFactory) {

        var objVm = this;

        Init();

        function Init() {
            DefaultOptions();
            InitFilterVariables();
            GetFilters();
        }
        
        function DefaultOptions() {
            $scope.filterMaxDate = calendarFactory.getYesterday();
        }

        function InitFilterVariables() {
            $scope.date = calendarFactory.getYesterday();
            $scope.cardProductsData = [];
            $scope.cardProductsModel = {};
            $scope.terminalsData = [];
            $scope.terminalsModel = {}
            $scope.pvsData = [];
            $scope.pvsModel = {};
            $scope.acquirersData = [];
            $scope.acquirersModel = {};
        }
        
        function GetFilters() {
            filterService.GetCardProductDeferred().then(function (objCardProducts) {
                $scope.cardProductsData = filterService.TransformDeferredDataInArray(objCardProducts, 'name');
                $scope.cardProductsModel = angular.copy($scope.cardProductsData);
            });
            filterService.GetTerminalDeferred().then(function (objTerminals) {
                $scope.terminalsData = filterService.TransformDeferredDataInArray(objTerminals, 'code');
                $scope.terminalsModel = angular.copy($scope.terminalsData);
            });
            filterService.GetPvsDeferred().then(function (objPvs) {
                $scope.pvsData = filterService.TransformDeferredDataInArray(objPvs, 'code');
                $scope.pvsModel = angular.copy($scope.pvsData);
            });
            filterService.GetAcquirersDeferred().then(function (objAcquirers) {
                $scope.acquirersData = filterService.TransformDeferredDataInArray(objAcquirers, 'name');
                $scope.acquirersModel = angular.copy($scope.acquirersData);
            });
        }

    }

})();