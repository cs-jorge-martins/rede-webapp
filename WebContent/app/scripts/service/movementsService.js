angular.module('KaplenWeb.movementsService',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	
}])

.service('movementsService', function(Restangular, $location) {
		
	this.getMonthsToSlider = function(data) {
		return Restangular.all('movements/slider').getList({data:data});
	};
		
	this.getPeriod = function(data, settlements, acquirers, brands, products, accounts) {
		return Restangular.all('movements/period').getList({data:data, settlements:settlements, 
			acquirers:acquirers, brands:brands, products:products, accounts:accounts});
	};
	
	this.getValuesByDay = function(data, settlements, acquirers, brands, products, accounts) {
		return Restangular.all('movements/valuesByDay').getList({data:data, settlements:settlements, 
			acquirers:acquirers, brands:brands, products:products, accounts:accounts});
	};
	
	this.getValuesAcquirerByDay = function (data, accountId, acquirers, brands, products, settlements){
		return Restangular.all('movements/valuesAcquirerByDay').getList({data:data, accountId:accountId,
			acquirers:acquirers, brands:brands, products:products, settlements:settlements});		
	};
	
	this.getValuesBrandsByDay = function (data, accountId, acquirerId, brands, products, settlements){
		return Restangular.all('movements/valuesBrandByDay').getList({data:data, accountId:accountId,
			acquirerId:acquirerId, brands:brands, products:products, settlements:settlements});		
	};
	
	this.getValuesProductsByDay = function (data, accountId, acquirerId, brandId, products, settlements){
		return Restangular.all('movements/valuesProductByDay').getList({data:data, accountId:accountId,
			acquirerId:acquirerId, brandId:brandId, products:products, settlements:settlements});		
	};

	this.getByInstallments = function(idMovements) {
		return Restangular.all('installments/movements').getList({idMovements:idMovements});
	};
	
	this.getItensModal = function(accountId, acquirers, settlements, cardBrandId, cardProductId, statusId, kind, payedDate, expectedDate, currentPage, isPayedDate) {
		return Restangular.one('movements/movementsDetail').get({accountId:accountId, acquirers:acquirers, settlements:settlements, cardBrandId:cardBrandId,
			cardProductId:cardProductId, statusId:statusId, kind:kind, payedDate:payedDate, expectedDate:expectedDate, currentPage:currentPage,
			isPayedDate:isPayedDate});
	};
	
	this.getMovementInstallmentModal = function(accountId, acquirers, settlements, cardBrandId, cardProductId, statusId, kind, payedDate, expectedDate, currentPage,
			totalItensPage, isPayedDate, column, order) {
		
		return Restangular.one('movements/movementInstallmentModal').get({accountId:accountId, acquirers:acquirers, settlements:settlements, cardBrandId:cardBrandId,
			cardProductId:cardProductId, statusId:statusId, kind:kind, payedDate:payedDate, expectedDate:expectedDate, currentPage:currentPage,
			totalItensPage:totalItensPage, isPayedDate:isPayedDate, column:column, order:order});
	};
	
	this.countItensModal = function(accountId, acquirers, settlements, cardBrandId, cardProductId, statusId, kind, payedDate, expectedDate, isPayedDate){
		return Restangular.one('movements/countMovementsDetail').get({accountId:accountId, acquirers:acquirers, settlements:settlements, cardBrandId:cardBrandId,
			cardProductId:cardProductId, statusId:statusId, kind:kind, payedDate:payedDate, expectedDate:expectedDate, isPayedDate:isPayedDate});
	};
	
	this.totalValueNoHistory = function(accountId, acquirers, settlements, cardBrandId, cardProductId, statusId, payedDate){
		return Restangular.one('movements/totalValueNoHistory').get({accountId:accountId, acquirers:acquirers, settlements:settlements, cardBrandId:cardBrandId,
			cardProductId:cardProductId, statusId:statusId, payedDate:payedDate});
	};
	
	this.updateBankValueProduct = function(json){
		return Restangular.all('movements/updateBankValueProduct/').post(json);
	};
			
});