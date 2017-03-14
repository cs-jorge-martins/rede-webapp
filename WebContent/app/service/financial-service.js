/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.FinancialService',[])
	.config([function () {
}])

.service('FinancialService', function(app, $http, Request) {

	this.GetExpectedDetails = function (objRequest) {
		return $http({
			url: app.endpoint + '/movements',
			method: "GET",
			params: objRequest,
			headers: Request.setHeaders()
		});
	};

	this.GetFutureDetails = function (objRequest) {
		return $http({
			url: app.endpoint + '/movements',
			method: "GET",
			params: objRequest,
			headers: Request.setHeaders()
		});
	};

	this.GetReceipt = function(objFilter){
		var objRequest = objFilter;

		return $http({
            url: app.endpoint + '/financials/details',
			method: "GET",
			params: objRequest,
			headers: Request.setHeaders()
		});
	};
});
