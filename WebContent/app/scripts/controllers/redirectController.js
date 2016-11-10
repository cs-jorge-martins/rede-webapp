/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('Conciliador.redirectController',[])

.config(['$routeProvider' ,function ($routeProvider) {
	$routeProvider
		.when('/redirect', {
			templateUrl: "app/views/redirect.html",
			controller  : "redirectController"
		});
}])

.controller('redirectController', function($rootScope, loginService, $routeParams) {

	$rootScope.bodyId = "redirectPage";

	init();

	function init() {

		var authorization = $routeParams.data;

		var errorMessage = function () {
			var accessValidatingDiv = document.querySelector("#accessValidating");
			var errorDiv = document.querySelector("#error");
			var urlRedirectError = "http://userede.com.br";

			accessValidatingDiv.classList.add("hidden");
			errorDiv.classList.remove("hidden");

			setTimeout(function () {
				window.location.href = urlRedirectError;
			}, 5000);
		};

		if(!authorization) {
			return errorMessage();
		}

		loginService.singleSignOn(authorization).then(function (data) {

			if(data.status != 200) {
				return errorMessage();
			}

			var user = data.data.user;

			if(!user || user.pvList.length <= 0) {
				return errorMessage();
			}

			$rootScope.signIn(authorization, user);

		}).catch(function (response) {
			console.log('error');
		});

	}

});
