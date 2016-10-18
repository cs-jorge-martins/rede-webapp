angular.module('Conciliador.redirectController',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider
		.when('/redirect', {

			template: '<p>Carregando..</p>',
			controller  : "redirectController"
		});
}])

.controller('redirectController', function($scope, $modal, $rootScope, $window, $location,
		Restangular, loginService, userService, optionsService, selectEmpresaService) {

	$rootScope.bodyId = "redirectPage";

	//http://127.0.0.1:8100/#/redirect?dados=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRoZW50aWNhdGlvbi1zZXJ2ZXIiLCJ1c3VhcmlvIjp7IkVtYWlsIjoiZ3VzdGF2by5zaWx2YUBpdGVyaXMuY29tLmJyIiwiU2VuaGEiOm51bGwsIk5vbWUiOiJHdXN0YXZvIFNvYXJlcyBkYSBTaWx2YSAtIEdTViJ9fQ.QeVSX4bjP7BLd8OFBpm9Wjfthvq_pZN3YE9Il2zSs_OButV6HyvVvpdYv07VzfXKIgB7vade3kch3RgUxdqz6owbsvXJDCQsEf12Z-ulb3l6aN1hfTj99_vI_nUvYFvMo67pKcut6st8TfhSenE0UqyfXjsQTXTFc13RFwK9LwAEyIKKZ4Y7_RnF69UaxOg3UgNS7PR2qExQxYIdTQGXLACh2Y2xmSJqadzMNHUpmKShQHAEVKLbyywunbI9J1yYP95SxrNMPwju5zamPzgxk0CPqIqi_GlGMTMR_XDimuuGdssGX9IXw3kn7C4N77LskWAjOs0RZ9xsurhfaB6ry

	init();

	function init() {

		var authorization = getParameterByName("dados");

		if(authorization) {

			loginService.singleSignon(authorization).then(function (data) {

				var user = data.data.user;

				if (user.pvList.length > 0) {
					$rootScope.signIn(authorization, user);
				}

			}).catch(function (response) {
				console.log('error');
			});

		}
	}

	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return "";
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	};

});
