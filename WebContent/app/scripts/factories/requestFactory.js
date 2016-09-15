angular.module('KaplenWeb.Request',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
}])

.factory('Request', function(Restangular, $window) {

	return {
		setHeaders: setHeaders
	};

	function setHeaders() {
		return {
			'Authorization': $window.sessionStorage.token,
			'Content-Type': 'application/json'
		}
	}

});
