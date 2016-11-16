/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.loginService',[])
	.config(['$routeProvider', function ($routeProvider) {

}])

.service('loginService', function(app, $http, Request) {

	this.ValidarLogin = function(objUser) {
        var strUrl = app.login.endpoint + '/login';
		var objRequest = {
			login: objUser.login,
			password: objUser.password
		};

		return $http({
            url: strUrl,
            method: "POST",
            data: objRequest,
            headers: Request.setHeaders()
        });
	};

	this.SingleSignOn = function(strToken) {
		var strUrl = app.login.endpoint + '/singlesignon';

		return $http({
			method: "POST",
			url: strUrl,
			headers: {
				'Content-type': 'application/json',
				'authorization': strToken
			}
		});
	};
});
