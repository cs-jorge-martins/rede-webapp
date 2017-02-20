/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.integrationService',[])
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

	this.DownloadFiles = function (objParams, success, error) {
		var intTimeout = 30 * 1000;
        var objStartTime = new Date().getTime();

		return $http({
			url: app.endpoint + '/integration/financials',
			method: "GET",
			params: objParams,
			headers: Request.setHeaders()
		}).then(success, function(response){
            var objRespTime = new Date().getTime() - objStartTime;
            if (objRespTime >= intTimeout){
                response.status = 408;
            }
            error(response);
        });
	};
});
