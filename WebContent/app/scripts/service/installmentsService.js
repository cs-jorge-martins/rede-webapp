/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('KaplenWeb.installmentsService',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

.service('installmentsService', function($http, Restangular) {
	this.getByTransactions = function (transactionsId, currentPage, paginated){
		return Restangular.all('installments').getList({transactionsId: transactionsId,
			currentPage:currentPage, paginated:paginated});
	};

});
