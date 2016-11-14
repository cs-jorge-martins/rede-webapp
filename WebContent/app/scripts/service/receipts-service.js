/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.receiptsService', [])
	.config(['$routeProvider', function ($routeProvider) {
}])

.service('receiptsService', function(app, $http, Request) {

	this.GetFinancials = function(query_strings) {
		var request = query_strings;

		return $http({
			url: app.endpoint + '/financials',
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		});
	};

	this.GetAdjusts = function(query_strings) {
        var request = query_strings;
		return $http({
            url: app.endpoint + '/adjustsummaries',
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		});
	};
});
