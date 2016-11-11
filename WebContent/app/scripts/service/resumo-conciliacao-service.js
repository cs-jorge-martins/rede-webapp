/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.resumoConciliacaoService',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}]).service('resumoConciliacaoService', function(Restangular, TransactionConciliationService, TransactionSummaryService) {

	var concilied = false;

	this.setConcilied = function(con){
		this.concilied = con;
	};

	this.getConcilied = function(){
		return this.concilied;
	};

	this.reconciliateTransaction = function(itens){
		return Restangular.all('reconciliation/reconcileAcquirer/').post(itens);
	};

	this.reconciliateTransactionModal = function(itens){
		return Restangular.all('reconciliation/transactionsModal/').post(itens);
	};

	this.getReport = function(report, type, dataSelecionada){
		return Restangular.one('reports/').get({report:report, type:type, dataSelecionada:dataSelecionada});
	};

	this.countVendas = function(initialDate, finalDate, nsu, tid, authorization, gross, erpId, currency){
		return Restangular.all('reconciliation/countSearch').getList({initialDate:initialDate, finalDate:finalDate, nsu:nsu, tid:tid, authorization:authorization,
			gross:gross, erpId:erpId, currency:currency});
	};

	this.buscarVendas = function(initialDate, finalDate, nsu, tid, authorization, gross, erpId, currency, currentPage, totalItensPage){
		return Restangular.all('reconciliation/search').getList({initialDate:initialDate, finalDate:finalDate, nsu:nsu, tid:tid, authorization:authorization,
			gross:gross, erpId:erpId, currency:currency, currentPage:currentPage, totalItensPage:totalItensPage});
	};


	/****************************************************************************************************************/

	this.listTransactionConciliationCalendarMonth = function(filter){
		return TransactionConciliationService.ListTransactionConciliationByFilter(filter);
	}

	this.getTransactionSummary = function(transactionSummaryFilter){
		return TransactionSummaryService.ListTransactionSummaryByFilter(transactionSummaryFilter);
	}

	 function TransactionSummary(){

			this.date;
			this.quantity;
			this.acquirer = {
				id: false,
				name: false
			};
			this.cardProduct;
			this.shop;
			this.conciliationStatus;
			this.amount;
			this.net;
			this.cancelledAmount;

		 }

});
