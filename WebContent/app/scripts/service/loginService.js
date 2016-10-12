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
		return $http.post(url, request);
	}

	this.resetPassword = function(user) {
		return Restangular.all('resetpassword').post(user);
	}

	this.singleSignOn = function(token) {
		var url = app.endpoint + '/singlesignon';

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
