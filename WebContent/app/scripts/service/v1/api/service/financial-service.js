/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.FinancialService',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
}])

.service('FinancialService', function(app, $http, Request) {
	this.getReceipt = function(filter){
		var request = filter;

		return $http({
            url: app.endpoint + '/financials/details',
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		});
	}
});
