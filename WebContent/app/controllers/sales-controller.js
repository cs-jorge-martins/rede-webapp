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

		Init();

		function Init() {
		}

	}

})();
