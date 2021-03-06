/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.redirectController',[])

.controller('redirectController', function($rootScope, loginService, $routeParams) {

	Init();

	function Init() {

		$rootScope.hideHeaderAndFooter = true;

		var strAuthorization = $routeParams.data;

        function ErrorMessage() {
			var divAccessValidating = document.querySelector("#accessValidating");
			var divError = document.querySelector("#error");
			var strUrlRedirectError = "http://userede.com.br";

			divAccessValidating.classList.add("hidden");
			divError.classList.remove("hidden");

			setTimeout(function () {
				window.location.href = strUrlRedirectError;
			}, 5000);
		}

		if(!strAuthorization) {
			return ErrorMessage();
		}

		loginService.SingleSignOn(strAuthorization).then(function (objData) {

			if(objData.status !== 200) {
				return ErrorMessage();
			}

			var objUser = objData.data.user;

			if(!objUser || objUser.pvList.length <= 0) {
				return ErrorMessage();
			}

			$rootScope.signIn(strAuthorization, objUser);

		}).catch(function () {
			console.log('error');
		});

	}

});
