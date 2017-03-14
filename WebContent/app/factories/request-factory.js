/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.Request',[])
	.config([function () {
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
			objDefaultHeaders.Authorization = $window.sessionStorage.token;
		}

		return objDefaultHeaders;
	}

});
