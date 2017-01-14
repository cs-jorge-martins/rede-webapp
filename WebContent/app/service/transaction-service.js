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
		this.GetTransactionByFilter = function(objFilter) {
			var objRequest = objFilter;

			return $http({
				url: app.endpoint + '/transactions',
				method: "GET",
				params: objRequest,
				headers: Request.setHeaders()
			});
		};

		this.GetDuplicateTransaction = function(objFilter) {
			var objRequest = objFilter;

			return $http({
				url: app.endpoint + '/transactions/nplicate',
				method: "GET",
				params: objRequest,
				headers: Request.setHeaders()
			});
		};

		this.ConcilieTransaction = function(objFilter){
			var objRequest = objFilter;

			return $http({
				url: app.endpoint + '/transactions/concilie',
				method: "POST",
				data: objRequest,
				headers: Request.setHeaders()
			});
		};

        this.ConcilieTransactions = function(objFilter){
			var objRequest = objFilter;

			return $http({
				url: app.endpoint + '/transactionsummaries/concilie',
				method: "POST",
				data: objRequest,
				headers: Request.setHeaders()
			});
		};

        this.ExportTransactions = function(objFilter, success, error) {
            var objStartTime = new Date().getTime();
            var intTimeout = 30 * 1000;  // milisseconds

            return $http({
				url: app.endpoint + '/transactions/export',
				method: "POST",
				params: objFilter,
                timeout: intTimeout,
				headers: Request.setHeaders()
			}).then(success, function(response){
                var objRespTime = new Date().getTime() - objStartTime;
                if (objRespTime >= intTimeout){  //timeout status must be explicitly set
                    response.status = 408;
                }
                error(response);
            });
		};
    }
})();
