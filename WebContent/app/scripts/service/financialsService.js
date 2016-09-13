angular.module('KaplenWeb.financialsService',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

.service('financialsService', function(Restangular, $location) {

	this.getFinancialsAll = function() {
		return Restangular.all('financials').getList();
	};

/*
	this.getPeriod = function(data, settlements, acquirers, brands, products, accounts) {
		return Restangular.all('/movements/period').getList({data:data, settlements:settlements,
			acquirers:acquirers, brands:brands, products:products, accounts:accounts});
	};

	this.getValuesByDay = function(data, settlements, acquirers, brands, products, accounts) {
		return Restangular.all('/movements/valuesByDay').getList({data:data, settlements:settlements,
			acquirers:acquirers, brands:brands, products:products, accounts:accounts});
	};
*/

});
