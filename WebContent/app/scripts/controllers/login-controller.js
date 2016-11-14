/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.loginController',[])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/login', {templateUrl: 'app/views/login.html', controller: 'loginController'});
}])

.controller('loginController', function($scope, $modal, $rootScope, $window, $location, loginService){

	$rootScope.destroyVariablesSession();

	$scope.validarLogin = ValidarLogin;
	$scope.modalChangePassword = ModalChangePassword;
	$scope.clear = Clear;

	function ValidarLogin() {
		$rootScope.alerts = [];

		if (!$scope.usuario.login || !$scope.usuario.password) {
			$rootScope.alerts = [{msg:"Os campos E-mail e Senha devem ser preenchidos."}];
			return;
		}

		loginService.ValidarLogin($scope.usuario).then(function(data) {
			var data = data.data;
			var user = data.user;
			var token = user.token;

			if(token && user) {
				$rootScope.signIn(token,user);
			}
		}).catch(function(response) {
			console.log('error');
		});
	};

	function ModalChangePassword(user, isManyCompanies) {
		var modalInstance = $modal.open({
			templateUrl: 'modalTrocarSenha.html',
			controller: ModalTrocarSenha,
			size:'sm',
			resolve: {
		        user1: function () {
		          return user;
		        },
		        isManyCompanies: function(){
		        	return isManyCompanies;
		        }
		      }
		});
		modalInstance.result.then(function(validate) {
			if(validate){
				$rootScope.logout();
				$scope.usuario = new Object();
			}
		}, function() {
			$location.path("/dashboard");
		});
	};

	function ModalTrocarSenha($scope, $window, $rootScope, user1, $modalInstance, $timeout, isManyCompanies) {
		$scope.password = "";
		$scope.rewritePassword = "";
		$scope.cancel = Cancel;

		var user = user1;

		function Cancel() {
			$modalInstance.dismiss('cancel');
		};
	};

	function Clear() {
		$scope.alertsRenewPassword = undefined;
		$scope.sendEmail = false;
	}

});
