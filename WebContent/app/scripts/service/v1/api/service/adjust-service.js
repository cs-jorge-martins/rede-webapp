/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.AdjustService',[])
.config(['$routeProvider', function ($routeProvider) {

}]).service('AdjustService', function(app, $location, $http, Request) {

	this.GetOtherDetails = function(filter) {
		var request = filter;

		return $http({
			url: app.endpoint + "/adjusts",
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		})
	}
});
