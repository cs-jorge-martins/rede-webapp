/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.Request',[])
	.config(['$routeProvider' ,function ($routeProvider) {
}])

.factory('Request', function($window) {

	return {
		setHeaders: SetHeaders
	};

	function SetHeaders() {

		var defaultHeaders = {
			'Content-Type': 'application/json'
		};

		if($window.sessionStorage.token) {
			defaultHeaders['Authorization'] = $window.sessionStorage.token;
		}

		return defaultHeaders;
	}

});
