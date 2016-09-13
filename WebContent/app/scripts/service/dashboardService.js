angular.module('KaplenWeb.dashboardService',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

.service('dashboardService', function(Restangular, TransactionSummaryService, AdjustSummaryService, MovementSummaryService, TransactionConciliationService) {


	/********************************  variavel para chamar tela de conciliação ***************/
	var day = null;

	this.setDay = function(day) {
		this.day = day;
	};

	this.getDay = function() {
		return this.day;
	};

	/********************************  demais metodos *********************************************/

	this.getActualMonth = function(dataInicial, dataFinal) {
		return Restangular.one('dashboard/').get({dataInicial:dataInicial, dataFinal:dataFinal});
	};

	this.getLastMonth = function(dataInicial, dataFinal){
		return Restangular.one('dashboard/lastMonth/').get({dataInicial:dataInicial, dataFinal:dataFinal});
	};

	this.getValuesDashboard = function(){
		return Restangular.one('dashboard/valuesDashboard/').get();
	};

	this.getGraphTransactions = function (dataInicial, dataFinal) {
		return Restangular.one('dashboard/graphTransactions/').get({dataInicial:dataInicial, dataFinal:dataFinal});
	};

	this.getTaxesValues = function (dataInicial, dataFinal) {
		return Restangular.one('dashboard/taxesValues/').get({dataInicial:dataInicial, dataFinal:dataFinal});
	};

	this.getCancellationValues = function (dataInicial, dataFinal) {
		return Restangular.one('dashboard/cancellationValues/').get({dataInicial:dataInicial, dataFinal:dataFinal});
	};

	this.checkNoTourInNextAccess = function() {
		//implementar para nao mostrar novamente
	};

	this.checkTourInNextAccess = function() {
		//implementar para mostrar novamente
	};


	/*****************************************************************************************************************/

	this.getTransactionSummaryBox = function(transactionSummaryFilter){
		//return list = TransactionSummaryService.listTransactionSummaryByFilter(transactionSummaryFilter);
		return TransactionSummaryService.listTransactionSummaryByFilter(transactionSummaryFilter);
	}


	this.getNplicateTransactionSummary = function(transactionSummaryNplicate){
		return TransactionSummaryService.listNplicateTransactionSummaryByFilter(transactionSummaryNplicate);
	}


	this.getAdjustSummary = function(adjustSummaryFilter){

		return  AdjustSummaryService.listAdjustSummary(adjustSummaryFilter);
	}


	this.getMovementSummary = function(movementSummaryFilter){

		return MovementSummaryService.listMovementSummaryByFilter(movementSummaryFilter);
	}


	this.geTransactionSummaryChart = function(transactionSummaryFilterCurrentMonth){

		//return TransactionSummaryService.listTransactionSummaryByFilter(transactionSummaryFilter);
		//var list = TransactionSummaryService.listTransactionSummaryByFilter(transactionSummaryFilter);

		/*
		var list = [];

		for(i = 1; i <= 29 ; i++){

			var summary = new TransactionSummary();

			summary.date = new Date();
			summary.date.setFullYear(2016, 2, 1);
			summary.quantity = 30;
			summary.amount = i * 50;

			list.push(summary);
		}

		return list;
		*/
	};


	this.getTransactionConciliationCalendar = function(transactionFilter){

		//var response = TransactionConciliationService.listTransactionConciliations(transactionFilter);

		var list = [];

		for(i = 1; i <= 12 ; i++){

			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth();
			var yyyy = today.getFullYear();

			var conciliation = new TransactionConciliation();

			conciliation.date(new Date(yyyy,mm,i));
			conciliation.transctionToConcilieQuantity = 13;
			conciliation.transctionConciliedQuantity = 545;
			conciliation.transctionUnprocessedQuantity = 32;

			list.push(conciliation);
		}

		return list
	}

	this.getTransactionConciliationBox = function(transactionFilter){

		return TransactionConciliationService.listTransactionConciliationByFilter(transactionFilter);
	}
});
