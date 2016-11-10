/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('KaplenWeb.Request',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
}])

.factory('Request', function(Restangular, $window) {

	return {
		setHeaders: setHeaders
	};

	function setHeaders() {

		var defaultHeaders = {
			'Content-Type': 'application/json'
		};

		if($window.sessionStorage.token) {
			defaultHeaders['Authorization'] = $window.sessionStorage.token;
		}

		return defaultHeaders;
	}

});
