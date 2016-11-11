/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('KaplenWeb.integrationService',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

.service('integrationService', function(app, $http, Restangular, Request) {
	/* usados no resumoConciliacaoController */
	this.checkIntegration = function(type, dataInicial, dataFinal, acquirers, settlements, scope, company, currency){
		return Restangular.one('integration/check/').get({type:type, initialDate:dataInicial, finalDate:dataFinal, acquirers:acquirers, settlements:settlements, scope:scope,
			companyId:company, currency:currency});
	};

	this.checkIntegrationConfigured = function(type, scope, companyId){
		return Restangular.one('integration/checkConfigured/').get({type:type, scope:scope, companyId:companyId});
	};
	/* ------------------------------------- */

	this.uploadFile = function(query_strings){
		var request = query_strings;
		return $http({
			url: app.endpoint + '/integration/files',
			method: "POST",
			params: query_strings,
			headers: Request.setHeaders()
		})
	}

	this.getUploadedFiles = function (params) {
		var request = params;
		return $http({
			url: app.endpoint + '/integration/files',
			method: "GET",
			params: params,
			headers: Request.setHeaders()
		})
	}

	this.downloadFiles = function (params) {
		var request = params;

		return $http({
			url: app.endpoint + '/integration/financials',
			method: "GET",
			params: params,
			headers: Request.setHeaders()
		})
	}

});
