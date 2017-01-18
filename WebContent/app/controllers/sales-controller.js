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

	Sales.$inject = ['$scope', 'modalService'];

	function Sales($scope, modalService) {

		var objVm = this;

		$scope.openDetailsModal = function() {
			modalService.openDetails(
				'Vendas a conciliar',
				'app/views/sales-details.html',
				'salesDetailsController',
				$scope
			);
		}

		Init();

		function Init() {
		}

	}

})();
