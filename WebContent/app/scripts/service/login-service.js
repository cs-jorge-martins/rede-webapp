/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.loginService',[])
	.config(['$routeProvider', function ($routeProvider) {

}])

.service('loginService', function(app, $http, Request) {

	this.ValidarLogin = function(user) {
        var url = app.login.endpoint + '/login';
		var request = {
			login: user.login,
			password: user.password
		};

		return $http({
            url: url,
            method: "POST",
            data: request,
            headers: Request.setHeaders()
        });
	};

	this.SingleSignOn = function(token) {
		var url = app.login.endpoint + '/singlesignon';

		return $http({
			method: "POST",
			url: url,
			headers: {
				'Content-type': 'application/json',
				'authorization': token
			}
		});
	};
});
