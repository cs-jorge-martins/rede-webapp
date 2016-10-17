angular.module('KaplenWeb.loginService',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

.service('loginService', function(app, Restangular, $http) {

	//this.validarLogin = function(user) {
		//return Restangular.all('login').post(user);
	//};

	this.validarLogin = function(user) {
		var request = {
			login: user.login,
			password: user.password
		};

		var url = app.endpoint + '/login';

		return $http.post(url, request);
	}

	this.resetPassword = function(user) {
		return Restangular.all('resetpassword').post(user);
	}

	this.singleSignon = function(token) {
		var request = {
			Authorization: token
		};

		var url = "https://3m3b6fs155.execute-api.us-east-1.amazonaws.com/dev" + '/singlesignon';

		return $http({
			method: "POST",
			url: url,
			headers: {
				'Content-type': 'application/json'
			},
			data: request
		});
	};

});
