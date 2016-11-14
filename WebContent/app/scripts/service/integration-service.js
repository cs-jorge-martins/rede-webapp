/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.integrationService',[])
	.config(['$routeProvider', function ($routeProvider) {
}])

.service('integrationService', function(app, $http, Request) {

	this.GetUploadedFiles = function (params) {
		var request = params;
		return $http({
			url: app.endpoint + '/integration/files',
			method: "GET",
			params: params,
			headers: Request.setHeaders()
		});
	};

	this.DownloadFiles = function (params) {
		var request = params;
		return $http({
			url: app.endpoint + '/integration/financials',
			method: "GET",
			params: params,
			headers: Request.setHeaders()
		});
	};
});
