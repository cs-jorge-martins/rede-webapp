/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('KaplenWeb.settlementService',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

.service('settlementService', function(Restangular, $window) {

	var company = {id: $window.sessionStorage.company};

	this.saveSettlement = function(settlement){
		settlement.company = company;
		return Restangular.all('settlements').post(settlement);
	};

	this.editSettlement = function(settlements){
		return settlements.put();
	};

	this.deleteSettlement = function(settlements) {
		return settlements.remove();
	};

	this.getSettlementByCompany = function(){
		return Restangular.all('settlements').getList({companyId:company.id});
	};

	this.getSearch = function(name, cnpj){
		var param = "";
		if(name != '' && cnpj === ''){
			param = {companyId:company.id, name:name};
			return Restangular.all('settlements').getList(param);
		}
		else if(name === '' && cnpj != ''){
			param = {companyId:company.id, cnpj:cnpj};
			return Restangular.all('settlements').getList(param);
		}
		else if(name != '' && cnpj != ''){
			param = {companyId:company.id,  name:name, cnpj:cnpj};
			return Restangular.all('settlements').getList(param);
		}
	};

});
