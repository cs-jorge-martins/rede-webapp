angular.module('KaplenWeb.envioEmailController',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/envioEmail', {templateUrl: 'app/views/login/envioEmail.html', controller: 'envioEmailController'});
}])

.controller('envioEmailController', function($scope, $modal, $rootScope, $window, $location,
		Restangular, loginService, userService){
		
	
});