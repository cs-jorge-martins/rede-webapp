/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('Conciliador.TransactionConciliationService',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}]).service('TransactionConciliationService', function(app, Restangular, $location, $http, Request) {

	this.listTransactionConciliationByFilter = function(filter) {
		var request = filter;

		return $http({
			url: app.endpoint + '/transactionconciliations',
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		});
	};


	//PUT TransactionConciliation
	this.concilieTransactionConciliation = function(transactionConciliation){



	}

});
