/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.TransactionSummaryService',[])
.config(['$routeProvider', function ($routeProvider) {

}]).service('TransactionSummaryService', function(app, $location, $http, Request) {

	this.ListTransactionSummaryByFilter = function(transactionSummaryFilter) {
		var request = transactionSummaryFilter;

		return $http({
			url: app.endpoint + '/transactionsummaries',
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		});
	};

	this.ListNplicateTransactionSummaryByFilter = function(transactionSummaryFilter){
		var request = transactionSummaryFilter;

		return $http({
			url: app.endpoint + '/transactionsummaries',
			method: "GET",
			data: request,
			headers: Request.setHeaders()
		});
	}
});
