/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {

	'use strict';

	angular
		.module('Conciliador.salesController', [])
		.controller('salesController', Sales);

	Sales.$inject = ['$scope', 'modalService', 'calendarFactory', 'filtersService', '$location'];

	function Sales($scope, modalService, calendarFactory, filtersService, $location) {

		var objVmSales = this;
        $scope.filter = {};
        $scope.dateModel = {};
		$scope.dateModel.date = calendarFactory.getYesterday();
        $scope.dateModel.maxDate = calendarFactory.getYesterday();
        $scope.filter.acquirersModel = [];
        $scope.filter.acquirersData = [];
        $scope.filter.pvsData = [];
        $scope.filter.pvsModel = [];
        $scope.filter.terminalsModel = [];
        $scope.filter.terminalsData = [];
        $scope.filter.cardProductsData = [];
        $scope.filter.cardProductsModel = [];

        $scope.search = function () {
            $scope.$broadcast('search');
        };

        /**
         * @method ResolveDateFromDashboard
         * Verifica se uma data foi passada via query parameter e aplica a mesma
         */
        function ResolveDateFromDashboard() {
            var strDate = $location.search().date || false;
            if(strDate) {
                $scope.dateModel.date = calendarFactory.getMomentOfSpecificDate(strDate).toDate();
            }

            var bolConciliedTab = $location.search().conciliedTab || false;
            if(bolConciliedTab) {
                $scope.activeTab = 1;
            }
        }

        /**
         * @method GetFilters
         * faz as chamadas para serializar os dados de filtro e coloca-los em scopes, para manipula-los na view
         */
        function GetFilters() {
            filtersService.GetCardProductDeferred().then(function (objCardProducts) {
                $scope.filter.cardProductsData = filtersService.TransformDeferredDataInArray(objCardProducts, 'name', 'acquirers');

                filtersService.GetTerminalDeferred().then(function (objTerminals) {
                    $scope.filter.terminalsData = filtersService.TransformDeferredDataInArray(objTerminals, 'code', 'pvId');

                    filtersService.GetPvsDeferred().then(function (objPvs) {
                        $scope.filter.pvsData = filtersService.TransformDeferredDataInArray(objPvs, 'code', 'acquirerId');

                        filtersService.GetAcquirersDeferred().then  (function (objAcquirers) {
                            $scope.filter.acquirersData = filtersService.TransformDeferredDataInArray(objAcquirers, 'name');
                        });
                    });

                });
            });
        }

		Init();

		function Init() {
            ResolveDateFromDashboard();
            GetFilters();
		}

	}

})();
