/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.Request',[])
	.config(['$routeProvider' ,function ($routeProvider) {
}])

.factory('Request', function($window) {

	return {
		setHeaders: SetHeaders
	};

	function SetHeaders() {

		var objDefaultHeaders = {
			'Content-Type': 'application/json'
		};

		if($window.sessionStorage.token) {
			objDefaultHeaders['Authorization'] = $window.sessionStorage.token;
		}

		return objDefaultHeaders;
	}

});
