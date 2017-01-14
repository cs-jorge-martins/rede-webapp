/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.filtersService', [])
	.config(['$routeProvider',function ($routeProvider) {
}])

.service('filtersService', function(app, $http, Request) {

	this.GetAcquirers = function() {
		var objRequest = {
		};

		return $http({
			url: app.endpoint + '/acquirers?name=REDE',
			method: "GET",
			data: objRequest,
			headers: Request.setHeaders()
		});
	};

	this.GetAccounts = function() {
		var objRequest = {
		};

		return $http({
			url: app.endpoint + '/pvs/bankaccounts',
			method: "GET",
			data: objRequest,
			headers: Request.setHeaders()
		});
	};

	this.GetShops = function() {
		var objRequest = {
		};

		return $http({
			url: app.endpoint + '/pvs/shops',
			method: "GET",
			data: objRequest,
			headers: Request.setHeaders()
		});
	};

	this.GetCardProducts = function() {
		var objRequest = {
		};

		return $http({
			url: app.endpoint + '/cardproducts',
			method: "GET",
			data: objRequest,
			headers: Request.setHeaders()
		});
	};
});
