/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.integrationService',[])
	.config(['$routeProvider', function ($routeProvider) {
}])

.service('integrationService', function(app, $http, Request) {

	this.GetUploadedFiles = function (objParams) {
		return $http({
			url: app.endpoint + '/integration/files',
			method: "GET",
			params: objParams,
			headers: Request.setHeaders()
		});
	};

	this.DownloadFiles = function (objParams) {
		return $http({
			url: app.endpoint + '/integration/financials',
			method: "GET",
			params: objParams,
			headers: Request.setHeaders()
		});
	};
});
