(function() {
    'use strict';

    angular
        .module('Conciliador.TransactionService', [])
		.config(['$routeProvider', 'RestangularProvider', function ($routeProvider, RestangularProvider) {}])
        .service('TransactionService', Transaction);

    Transaction.$inject = ['app', 'Restangular', '$http', 'Request'];

    function Transaction(app, Restangular, $http, Request) {
		this.getTransactionById = function(transactionId) {
			return Restangular.all('transactions').getList({
				id: transactionId
			});
		};

		this.getTransactionByFilter = function(filter) {
			var request = filter;

			return $http({
				url: app.endpoint + '/transactions',
				method: "GET",
				params: request,
				headers: Request.setHeaders()
			});
		};

		this.getDuplicateTransaction = function(filter) {
			var request = filter;

			return $http({
				url: app.endpoint + '/transactions/nplicate',
				method: "GET",
				params: request,
				headers: Request.setHeaders()
			});
		};

		this.concilieTransaction = function(filter){
			var request = filter;

			return $http({
				url: app.endpoint + '/transactions/concilie',
				method: "POST",
				data: request,
				headers: Request.setHeaders()
			});
		};

        this.concilieTransactions = function(filter){
			var request = filter;

			return $http({
				url: app.endpoint + '/transactionsummaries/concilie',
				method: "POST",
				data: request,
				headers: Request.setHeaders()
			});
		};
    }
})();
