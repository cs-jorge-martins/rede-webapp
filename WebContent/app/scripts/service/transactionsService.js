/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('KaplenWeb.transactionsService',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

.service('transactionsService', function(Restangular) {

	this.getTransaction = function(id){
		return Restangular.one('transactions/', id).get();
	};

	this.countTotalItens = function(firstDayOfCurrentMonth, now, reconciliationStatus, transactionStatus, cancellationKind, settlements, acquirerId,
			cardBrandId, cardProductId, typeOfDateSearch, type, terminals) {

		return Restangular.all('transactions/countTotalItens').getList({dataInicial:firstDayOfCurrentMonth, dataFinal:now, reconciliationStatus:reconciliationStatus,
			transactionStatus:transactionStatus, cancellationKind:cancellationKind, settlements:settlements, acquirerId:acquirerId, cardBrandId:cardBrandId,
			cardProductId:cardProductId, typeOfDateSearch:typeOfDateSearch, type:type, terminals:terminals});
	};

	this.getTransactionsByFilters = function(firstDayOfCurrentMonth, now, reconciliationStatus,transactionStatus, cancellationKind, settlements, acquirers,
			cardBrandId, cardProductId, typeOfDateSearch, currentPage, totalItensPage, type, terminals) {

		return Restangular.all('transactions/').getList({dataInicial:firstDayOfCurrentMonth, dataFinal:now, reconciliationStatus:reconciliationStatus,
			transactionStatus:transactionStatus, cancellationKind:cancellationKind, settlements:settlements, acquirers:acquirers, cardBrandId:cardBrandId,
			cardProductId:cardProductId, typeOfDateSearch:typeOfDateSearch, currentPage:currentPage, totalItensPage:totalItensPage, type:type, terminals:terminals});
	};

	this.getTransactionsByFiltersOrdened = function(firstDayOfCurrentMonth, now, reconciliationStatus, transactionStatus, cancellationKind, settlements, acquirers,
			cardBrandId, cardProductId, typeOfDateSearch, currentPage, totalItensPage, column, order) {

		return Restangular.all('transactions/').getList({dataInicial:firstDayOfCurrentMonth, dataFinal:now, reconciliationStatus:reconciliationStatus,
			transactionStatus:transactionStatus, cancellationKind:cancellationKind, settlements:settlements, acquirers:acquirers, cardBrandId:cardBrandId,
			cardProductId:cardProductId, typeOfDateSearch:typeOfDateSearch, currentPage:currentPage, totalItensPage:totalItensPage, column:column, order:order});
	};

	this.getTransactionsResumed = function(dateSelected, settlements, acquirers,
			brands, produts, terminals, natureza, tipoTerminal, additionalInformation) {
		return Restangular.all('reconciliation/').getList({dateSelected:dateSelected, settlements:settlements, acquirers:acquirers,
			brands:brands,produts:produts, terminals:terminals,natureza:natureza, tipoTerminal:tipoTerminal, additionalInformation:additionalInformation});
	};

	this.getAcquirer = function(dateSelected, statusConciliacao, isForAllMonth, statusVenda, acquirers,
			brands, products, settlements, terminals, natureza, tipoTerminal) {
		return Restangular.all('transactions/acquirer/').getList({dateSelected:dateSelected, statusVendaConciliada:statusConciliacao, isForAllMonth:isForAllMonth,
			statusVenda: statusVenda, acquirers:acquirers, settlements:settlements, brands:brands, products:products, terminals:terminals, type:natureza,
			tipoTerminal:tipoTerminal});
	};

	this.getMonthsToSlider = function(data) {
		return Restangular.all('reconciliation/slider/').getList({data:data});
	};

	this.orderByColumn = function(column, order){
		return Restangular.all('transactions/orderModalByColumn/').getList({column:column, order:order});
	};

	this.getFiles = function(currentPage, totalItens){
		return Restangular.all('reconciliation/filesUploaded/').getList({currentPage:currentPage, totalItens:totalItens});
	};

	this.getCountFiles = function(){
		return Restangular.one('reconciliation/countfilesUploaded/').get();
	};

	//Gestão
	this.getCancelationsMonthsToSlider = function(data) {
		return Restangular.all('reconciliation/gestaoSlider/').getList({data:data});
	};

	this.getCancelationResumed = function(dateSelected, settlements, acquirers, brands, products, terminals, tipoTerminal) {
		return Restangular.all('transactions/management/').getList({dateSelected:dateSelected, settlements:settlements,
			acquirers:acquirers, brands:brands, products:products, terminals:terminals, tipoTerminal:tipoTerminal});
	};

	this.getAcquirerByCancelation = function(dateSelected, statusCancelamento, isForAllMonth, settlements, acquirers, brands, products, terminals, tipoTerminal) {
		return Restangular.all('transactions/acquirer/').getList({dateSelected:dateSelected, statusVenda:2, statusCancelamento:statusCancelamento,
			isForAllMonth:isForAllMonth, settlements:settlements, acquirers:acquirers, brands:brands, products:products, terminals:terminals, tipoTerminal:tipoTerminal});
	};


});
