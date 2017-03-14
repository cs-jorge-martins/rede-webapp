/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.MovementService',[])
.config([function () {

}]).service('MovementService', function(app, $location, $window, $http, Request) {

	this.GetForethoughts = function (objFilter) {
		var objRequest = objFilter;

		return $http({
			url: app.endpoint + "/movements",
			method: "GET",
			params: objRequest,
			headers: Request.setHeaders()
		});
	};
});
