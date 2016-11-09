/**
 *
 */

angular.module('Conciliador.FinancialService',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
}])

.service('FinancialService', function(app, $http, Request) {


	//GET Financial by filter
	this.getFinancialByFilter = function(financialFilter) {

		return Restangular.all('financials').getList(financialFilter);
	};


	this.getGroupByAcquirer = function(financialFilter){

		return this.getFinancialByFilter(financialFilter);
	}

	this.getGroupByCardProduct = function(financialFilter){

		return this.getFinancialByFilter(financialFilter);
	}

	this.getGroupByType = function(financialFilter){

		return this.getFinancialByFilter(financialFilter);
	}

	this.getAdministrativeCosts = function(adjustSummaryFilter){
		return Restangular.all('adjustsummaries').getList(adjustSummaryFilter);
	}
	
	this.getExpectedDetails = function (request) {
		return $http({
			url: app.endpoint + '/movements',
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		});
	}

	// this.getReceipt = function(filter){
	// 	var request = filter;

	// 	return $http({
 //            url: app.endpoint + '/financials/installments',
	// 		method: "GET",
	// 		params: request,
	// 		headers: Request.setHeaders()
	// 	});
	// }

	this.getReceipt = function(filter){
		var request = filter;

		return $http({
            url: app.endpoint + '/financials/details',
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		});
	}

	this.getTaxes = function(filter){
		return Restangular.all('adjusts').getList(filter);
	}

});
