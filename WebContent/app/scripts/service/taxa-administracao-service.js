/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('KaplenWeb.taxaAdministracaoService',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
}])

.service('taxaAdministracaoService', function(Restangular, $window) {

	this.searchProducts = function(settlement, acquirer, installment){
		return Restangular.all('taxes/productsAcquirer').getList({settlement:settlement,  acquirer: acquirer, installment:installment});
	};

	this.saveTax = function(tax){
		return Restangular.all('taxes').post(tax);
	};

	this.copyTaxesForSettlements = function (productsJson, settlementsIds){
		return Restangular.all('taxes?settlementsIds='+settlementsIds).patch(productsJson);
	};


});
