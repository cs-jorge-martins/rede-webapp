angular.module('KaplenWeb.optionsManager',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/changePassword/:token', {templateUrl: 'app/views/validarUsuario/changePassword.html', 
		controller: 'changePasswordController',
		resolve: { 
			 user: function(Restangular, $route, $window){
				 var token = $route.current.params.token;
				 $window.sessionStorage.token = token;
				 return Restangular.oneUrl('options', getDominio('settings') + '/options/validateToken/' + token).get();	 						 
			 }}});
}])

.controller('changePasswordController', function($scope,$rootScope,$location, user, optionsService){
	
	$rootScope.login = 'login';
	$scope.user = user;
	
	$scope.redefinirSenha = function() {
		if($scope.user.password === $scope.password){
			optionsService.changePassword($scope.user).then(function(data) {
				$scope.validate = true;
				if(data.error){
					$scope.message = data.message;
				}
				else if(data.error === undefined){
					$scope.success = true;
					$scope.message = 'Senha alterada com sucesso.';
				}
			});
		}
		else{
			$scope.validate = true;
			$scope.message = 'As senhas não conferem';
		}
	};
	
	$scope.login = function() {
		$location.path('/login');
	};
	
});