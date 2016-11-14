/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.filtersService', [])
	.config(['$routeProvider',function ($routeProvider) {
}])

.service('filtersService', function(app, $http, Request) {

	this.GetAcquirers = function() {
		var request = {
		};

		return $http({
			url: app.endpoint + '/acquirers?name=REDE',
			method: "GET",
			data: request,
			headers: Request.setHeaders()
		});
	};

	this.GetAccounts = function() {
		var request = {
		};

		return $http({
			url: app.endpoint + '/pvs/bankaccounts',
			method: "GET",
			data: request,
			headers: Request.setHeaders()
		});
	};

	this.GetShops = function() {
		var request = {
		};

		return $http({
			url: app.endpoint + '/pvs/shops',
			method: "GET",
			data: request,
			headers: Request.setHeaders()
		});
	};

	this.GetCardProducts = function() {
		var request = {
		};

		return $http({
			url: app.endpoint + '/cardproducts',
			method: "GET",
			data: request,
			headers: Request.setHeaders()
		});
	};
});
