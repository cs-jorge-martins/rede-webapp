/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.AdjustSummaryService',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}]).service('AdjustSummaryService', function(app, Restangular, $location, $window, $http, Request) {

	this.ListAdjustSummary = function(filter) {
		var request = filter;

		return $http({
			url: app.endpoint + '/adjustsummaries',
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		});
	};
});
