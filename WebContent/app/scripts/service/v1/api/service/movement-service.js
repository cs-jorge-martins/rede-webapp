/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.MovementService',[])
.config(['$routeProvider', function ($routeProvider) {

}]).service('MovementService', function(app, $location, $window, $http, Request) {

	this.GetForethoughts = function (filter) {
		var request = filter;

		return $http({
			url: app.endpoint + "/movements",
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		})
	}
});
