/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.dashboardService',[])
.config(['$routeProvider', function ($routeProvider) {

}])

.service('dashboardService', function(Restangular, TransactionSummaryService, AdjustSummaryService, MovementSummaryService, TransactionConciliationService) {
	this.GetTransactionSummaryBox = function(transactionSummaryFilter){
		return TransactionSummaryService.ListTransactionSummaryByFilter(transactionSummaryFilter);
	}

	this.GetNplicateTransactionSummary = function(transactionSummaryNplicate){
		return TransactionSummaryService.ListNplicateTransactionSummaryByFilter(transactionSummaryNplicate);
	}

	this.GetMovementSummary = function(movementSummaryFilter){
		return MovementSummaryService.ListMovementSummaryByFilter(movementSummaryFilter);
	}

	this.GetTransactionConciliationBox = function(transactionFilter){
		return TransactionConciliationService.ListTransactionConciliationByFilter(transactionFilter);
	}
});
