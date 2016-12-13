/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.kaplenAdminService',[])
	.config(['$routeProvider', function ($routeProvider) {
}])

.service('kaplenAdminService', function(app, $window, $http, Request) {

	this.GetProdutsAutoComplete = function(){
		var objRrequest = {
		};

		return $http({
			url: app.endpoint + '/cardproducts',
			method: "GET",
			data: objRrequest,
			headers: Request.setHeaders()
		});
	};

	this.GetSettlementsAutoComplete = function(){
		var objRrequest = {
		};

		return $http({
			url: app.endpoint + '/pvs/shops',
			method: "GET",
			data: objRrequest,
			headers: Request.setHeaders()
		});
	};
});
