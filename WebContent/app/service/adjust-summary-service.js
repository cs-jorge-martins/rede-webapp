/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.AdjustSummaryService',[])
.config([function() {

}]).service('AdjustSummaryService', function(app, $location, $window, $http, Request) {

	this.ListAdjustSummary = function(objFilter) {
		var objRequest = objFilter;

		return $http({
			url: app.endpoint + '/adjustsummaries',
			method: "GET",
			params: objRequest,
			headers: Request.setHeaders()
		});
	};
});
