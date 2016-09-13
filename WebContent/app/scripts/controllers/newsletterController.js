angular.module('KaplenWeb.newsletterController',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/newsletter', {templateUrl: 'app/views/login/newsletter.html', controller: 'newsletterController'});
}])

.controller('newsletterController', function($scope, $modal, $rootScope, $window, $location,
		Restangular, loginService, userService){
});