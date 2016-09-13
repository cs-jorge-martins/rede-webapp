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

});
