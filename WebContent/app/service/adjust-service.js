/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.AdjustService',[])
.config([function () {

}]).service('AdjustService', function(app, $location, $http, Request) {

    this.ListAdjusts = function(objFilter) {
		var objRequest = objFilter;

		return $http({
			url: app.endpoint + "/adjusts",
			method: "GET",
			params: objRequest,
			headers: Request.setHeaders()
		});
	};

	this.GetOtherDetails = function(objFilter) {
		var objRequest = objFilter;

		return $http({
			url: app.endpoint + "/adjusts",
			method: "GET",
			params: objRequest,
			headers: Request.setHeaders()
		});
	};
});
