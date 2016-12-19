/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.dashboardService',[])
.config(['$routeProvider', function ($routeProvider) {

}])

.service('dashboardService', function(TransactionSummaryService, AdjustSummaryService, MovementSummaryService, TransactionConciliationService) {
	this.GetTransactionSummaryBox = function(objTransactionSummaryFilter){
		return TransactionSummaryService.ListTransactionSummaryByFilter(objTransactionSummaryFilter);
	}

	this.GetNplicateTransactionSummary = function(objTransactionSummaryNplicate){
		return TransactionSummaryService.ListNplicateTransactionSummaryByFilter(objTransactionSummaryNplicate);
	}

	this.GetMovementSummary = function(objMovementSummaryFilter){
		return MovementSummaryService.ListMovementSummaryByFilter(objMovementSummaryFilter);
	}

	this.GetTransactionConciliationBox = function(objTransactionFilter){
		return TransactionConciliationService.ListTransactionConciliationByFilter(objTransactionFilter);
	}
});
