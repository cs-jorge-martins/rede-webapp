/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {

	'use strict';

	angular
		.module('Conciliador.salesDetailsController', [])
		.controller('salesDetailsController', salesDetails);

	salesDetails.$inject = ['$scope'];

	function salesDetails($scope) {
		$scope.test = 'teste';
	}
})();
