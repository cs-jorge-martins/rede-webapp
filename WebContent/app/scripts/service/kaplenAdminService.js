angular.module('KaplenWeb.kaplenAdminService',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

.service('kaplenAdminService', function(app, Restangular, $window, $http, Request) {


	this.getAcquirer = function(){
		return Restangular.all('acquirers').getList();
	};
	this.getAcquirerByCompany = function(id){
		return Restangular.all('acquirers').getList();
	};
	this.getSettlement = function(){
		return Restangular.all('settlements').getList();
	};
	this.getSettlementByCompany = function(id){
		return Restangular.all('settlements').getList({companyId:$window.sessionStorage.company});
	};

	this.getTerminal = function(){
		return Restangular.all('pvs/terminals').getList();
	};
	this.getTerminalByCompany = function(){
		return this.getTerminal();
	};

	this.getBank = function(){
		return Restangular.all('banks').getList();
	};
	this.getBankByCompany = function(id){
		return Restangular.all('banks').getList({companyId:$window.sessionStorage.company});
	};

	this.getBrandsAll = function(){
		return Restangular.all('brands/all').getList();
	};

	this.getProductsAll = function(){
		return Restangular.all('products/all').getList();
	};

	this.getAccounts = function(){
		return Restangular.all('pvs/bankaccounts').getList();
	};


	/********************************* Services do Auto Complete *************************************************************/

	this.getAccountsAutoComplete = function(){
		return Restangular.all('pvs/bankaccounts').getList();
	};

	this.getAcquiresAutoComplete = function(name){
		return Restangular.all('acquirers').getList();
	};

	this.getBrandsAutoComplete = function(name){
		return Restangular.all('brands/autoComplete').getList({name:name});
	};

	this.getProdutsAutoComplete = function(){
		var request = {
		};

		return $http({
			url: app.endpoint + '/cardproducts',
			method: "GET",
			data: request,
			headers: Request.setHeaders()
		});
	};

	this.getSettlementsAutoComplete = function(){
		var request = {
		};

		return $http({
			url: app.endpoint + '/pvs/shops',
			method: "GET",
			data: request,
			headers: Request.setHeaders()
		});
	};

	this.getTerminalsAutoComplete = function(){
		return Restangular.all('pvs/terminals').getList();
	};
});
