angular.module('KaplenWeb.relatorioService',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

.service('relatorioService', function($http, Restangular) {
	
	/*********************** VENDAS ***********************/

	this.searchSinteticTransactions = function(initialDate, finalDate, exibitionMode, weekDay, acquirers, brands, products, installments, settlements,
			terminals, currency, tipoTerminal){
		return Restangular.all('transactionsReport/transactionsSintetic').getList({initialDate:initialDate, finalDate:finalDate, exibitionMode:exibitionMode,
			weekDay:weekDay, acquirers:acquirers, brands:brands, products:products, installments:installments,
			settlements:settlements, terminals:terminals, currency:currency, tipoTerminal:tipoTerminal});
	};
	
	this.searchAnaliticTransactions = function(initialDate, finalDate, exibitionMode, filterAnalitic, weekDay, acquirers, brands, products, installments, settlements,
			terminals, currency, tipoTerminal){
		return Restangular.all('transactionsReport/transactionsAnalitic').getList({initialDate:initialDate, finalDate:finalDate, exibitionMode:exibitionMode,
			filterAnalitic:filterAnalitic, weekDay:weekDay, acquirers:acquirers, brands:brands, products:products, installments:installments, settlements:settlements,
			terminals:terminals, currency:currency, tipoTerminal:tipoTerminal});
	};
	
	this.getTransactionsDuplicated = function(initialDate, finalDate, acquirers, brands, products, installments, settlements, terminals, currency) {		
		return Restangular.all('transactionsReport/transactionsDuplicated').getList({initialDate:initialDate, finalDate:finalDate, settlements:settlements,
			acquirers:acquirers, brands:brands, products:products, installments:installments, terminals:terminals, currency:currency});
	};
	
	/*********************** FINANCEIRO ***********************/
	
	this.getPrevisaoRecebimentos = function(initialDate, finalDate, acquirers, brands, settlements, currency){
		return Restangular.all('movementsReport/previsaoRecebimentos').getList({initialDate:initialDate, finalDate:finalDate, settlements:settlements,
			acquirers:acquirers, brands:brands, currency:currency});
	};
	
	this.detalharParcelas = function(initialDate, finalDate, currency, acquirerId, currentPage, totalItens, column, order){
		return Restangular.all('movementsReport/detalhamentoParcelas').getList({initialDate:initialDate, finalDate:finalDate, currency:currency, acquirerId:acquirerId,
			currentPage:currentPage, totalItens:totalItens, column:column, order:order});
	};
	
	this.countDetalharParcelas = function(initialDate, finalDate, currency, acquirerId){
		return Restangular.all('movementsReport/countDetalhamentoParcelas').getList({initialDate:initialDate, finalDate:finalDate, currency:currency, acquirerId:acquirerId});
	};
	
	/************************* CUSTOS ***************************/
	this.getDivergentTaxes = function(initialDate, finalDate, settlements, acquirers, margemTolerancia, valorTolerancia){
		return Restangular.all('taxes').getList({initialDate:initialDate, finalDate:finalDate, settlements:settlements, acquirers:acquirers,
			margemTolerancia:margemTolerancia, valorTolerancia:valorTolerancia});
	};
	
	this.getConectivityTaxes = function(initialDate, finalDate, settlements, acquirers){
		return Restangular.all('taxes/conectivity').getList({initialDate:initialDate, finalDate:finalDate, settlements:settlements, acquirers:acquirers});
	};
		
});