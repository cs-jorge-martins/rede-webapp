angular.module('KaplenWeb.cartaCancelamentoService',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	
}])

.service('cartaCancelamentoService', function(Restangular) {
	
	this.getCopyRequests = function(dateSelected, currentPage) {
		return Restangular.all('copyRequests').getList(
				{dateSelected:dateSelected, currentPage:currentPage});
	};
	
	this.getCountCopyRequests = function(dateSelected) {
		return Restangular.all('copyRequests/countTotalItens').getList(
				{dateSelected:dateSelected});
	};
});