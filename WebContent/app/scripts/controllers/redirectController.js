angular.module('Conciliador.redirectController',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider
		.when('/redirect', {
			templateUrl: "app/views/redirect.html",
			controller  : "redirectController"
		});
}])

.controller('redirectController', function($scope, $modal, $rootScope, $window, $location,
		Restangular, loginService, userService, optionsService, selectEmpresaService) {

	$rootScope.bodyId = "redirectPage";

	init();

	function init() {

		var authorization = getParameterByName("data");

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

		loginService.singleSignon(authorization).then(function (data) {

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

	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return "";
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

});
