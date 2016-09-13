angular.module('KaplenWeb.filtersService', [])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
}])

.service('filtersService', function(app, $http, Request) {

	this.getAcquirers = function() {
		var request = {
		};

		return $http({
			url: app.endpoint + '/acquirers?name=REDE',
			method: "GET",
			data: request,
			headers: Request.setHeaders()
		});
	};

	this.getAccounts = function() {
		var request = {
		};

		return $http({
			url: app.endpoint + '/pvs/bankaccounts',
			method: "GET",
			data: request,
			headers: Request.setHeaders()
		});
	};

	this.getShops = function() {
		var request = {
		};

		return $http({
			url: app.endpoint + '/pvs/shops',
			method: "GET",
			data: request,
			headers: Request.setHeaders()
		});
	};

	this.getCardProducts = function() {
		var request = {
		};

		return $http({
			url: app.endpoint + '/cardproducts',
			method: "GET",
			data: request,
			headers: Request.setHeaders()
		});
	};

	this.getTerminals = function() {
		var request = {
		};

		return $http({
			url: app.endpoint + '/terminals',
			method: "GET",
			data: request,
			headers: Request.setHeaders()
		});
	};

});
