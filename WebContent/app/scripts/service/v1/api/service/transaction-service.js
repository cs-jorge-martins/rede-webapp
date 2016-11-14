/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

(function() {
    'use strict';

    angular
        .module('Conciliador.TransactionService', [])
		.config(['$routeProvider', function ($routeProvider) {}])
        .service('TransactionService', Transaction);

    Transaction.$inject = ['app', '$http', 'Request'];

    function Transaction(app, $http, Request) {
		this.GetTransactionByFilter = function(filter) {
			var request = filter;

			return $http({
				url: app.endpoint + '/transactions',
				method: "GET",
				params: request,
				headers: Request.setHeaders()
			});
		};

		this.GetDuplicateTransaction = function(filter) {
			var request = filter;

			return $http({
				url: app.endpoint + '/transactions/nplicate',
				method: "GET",
				params: request,
				headers: Request.setHeaders()
			});
		};

		this.ConcilieTransaction = function(filter){
			var request = filter;

			return $http({
				url: app.endpoint + '/transactions/concilie',
				method: "POST",
				data: request,
				headers: Request.setHeaders()
			});
		};

        this.ConcilieTransactions = function(filter){
			var request = filter;

			return $http({
				url: app.endpoint + '/transactionsummaries/concilie',
				method: "POST",
				data: request,
				headers: Request.setHeaders()
			});
		};

        this.ExportTransactions = function(filter, success, error) {
            var startTime = new Date().getTime();
            var timeout = 30 * 1000;  // milisseconds

            return $http({
				url: app.endpoint + '/transactions/export',
				method: "POST",
				params: filter,
                timeout: timeout,
				headers: Request.setHeaders()
			}).then(success, function(response){
                var respTime = new Date().getTime() - startTime;
                if (respTime >= timeout){  //timeout status must be explicitly set
                    response.status = 408;
                }
                error(response);
            });
		};
    }
})();
