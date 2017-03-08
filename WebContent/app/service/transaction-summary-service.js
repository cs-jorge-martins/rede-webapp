/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.TransactionSummaryService',[])
.config([function () {

}]).service('TransactionSummaryService', function(app, $location, $http, Request) {

	this.ListTransactionSummaryByFilter = function(objTransactionSummaryFilter) {
		var objRequest = objTransactionSummaryFilter;

		return $http({
			url: app.endpoint + '/transactionsummaries',
			method: "GET",
			params: objRequest,
			headers: Request.setHeaders()
		});
	};

	this.ListNplicateTransactionSummaryByFilter = function(objTransactionSummaryFilter){
		var objRequest = objTransactionSummaryFilter;

		return $http({
			url: app.endpoint + '/transactionsummaries',
			method: "GET",
			data: objRequest,
			headers: Request.setHeaders()
		});
	};
});
