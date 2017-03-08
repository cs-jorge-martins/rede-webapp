/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.TransactionConciliationService',[])
.config([function() {

}]).service('TransactionConciliationService', function(app, $location, $http, Request) {

	this.ListTransactionConciliationByFilter = function(objFilter) {
		var objRequest = objFilter;

		return $http({
			url: app.endpoint + '/transactionconciliations',
			method: "GET",
			params: objRequest,
			headers: Request.setHeaders()
		});
	};
});
