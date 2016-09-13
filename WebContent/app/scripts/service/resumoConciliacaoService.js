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
		return TransactionConciliationService.listTransactionConciliationByFilter(filter);
		/*
		var x = TransactionConciliationService.listTransactionConciliationByFilter(filter);

		var response = [];

		for(var y = 1;y <= 12; y++) {
			var entity = new TransactionSummary();
			entity.date = null;
			response.post = entity;


		}

		if(x){
			for(item in x) {
				for(y in response) {
					// comparar mes
					if() {
						response[y] = x[item];
					}
				}
			}
		}

		return response;
		*/

	}


	this.listTransactionConciliationCalendarDay = function(transactionConciliationFilter){

		var list = TransactionConciliationService.listTransactionConciliationByFilter(transactionConciliationFilter);

		return list;
	}


	this.listTransactionSummaryByAcquirer = function(transactionSummaryFilter){

		//var list = TransactionSummaryService.listTransactionSummaryByFilter(transactionSummaryFilter);

		var list;

		return list;
	}

	this.listTransactionSummaryByCardProduct = function(transactionSummaryFilter){

		//var list = TransactionSummaryService.listTransactionSummaryByFilter(transactionSummaryFilter);

		var list;

		return list;
	}


	this.getTransactionSummary = function(transactionSummaryFilter){
		return TransactionSummaryService.listTransactionSummaryByFilter(transactionSummaryFilter);
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
