/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.loginService',[])
	.config(['$routeProvider', function ($routeProvider) {

}])

.service('loginService', function(app, $http, Request, $window) {

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

		var header = {
				'Content-type': 'application/json',
				'authorization': strToken
		};

		//hotfix/623674
		//No caso do singlesignon, remove o token antigo
		if(angular.isDefined($window.sessionStorage.token)){
			delete $window.sessionStorage.token;
		}

		return $http({
			method: "POST",
			url: strUrl,
			headers: header
		});
	};
});
