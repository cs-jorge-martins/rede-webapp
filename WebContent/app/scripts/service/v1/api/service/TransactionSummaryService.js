	/**
 *
 */

angular.module('Conciliador.TransactionSummaryService',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}]).service('TransactionSummaryService', function(app, Restangular, $location, $http, Request) {

	this.listTransactionSummaryByFilter = function(transactionSummaryFilter) {
		var request = transactionSummaryFilter;

		return $http({
			url: app.endpoint + '/transactionsummaries',
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		});
	};


	this.listNplicateTransactionSummaryByFilter = function(transactionSummaryFilter){
		var request = transactionSummaryFilter;

		return $http({
			url: app.endpoint + '/transactionsummaries',
			method: "GET",
			data: request,
			headers: Request.setHeaders()
		});
	}


});
