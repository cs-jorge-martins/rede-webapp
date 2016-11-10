/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('KaplenWeb.loginService',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

.service('loginService', function(app, $http, Request) {

	this.validarLogin = function(user) {
		var request = {
			login: user.login,
			password: user.password
		};

		var url = app.login.endpoint + '/login';
		return $http({
            url: url,
            method: "POST",
            data: request,
            headers: Request.setHeaders()
        });
	}

	this.resetPassword = function(user) {
		return Restangular.all('resetpassword').post(user);
	}

	this.singleSignOn = function(token) {
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
