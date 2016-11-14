/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.FinancialService',[])
	.config(['$routeProvider' ,function ($routeProvider) {
}])

.service('FinancialService', function(app, $http, Request) {

	this.GetExpectedDetails = function (request) {
		return $http({
			url: app.endpoint + '/movements',
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		});
	}

	this.GetReceipt = function(filter){
		var request = filter;

		return $http({
            url: app.endpoint + '/financials/details',
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		});
	}
});
