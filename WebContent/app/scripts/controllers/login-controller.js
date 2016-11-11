/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.loginController',[])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/login', {templateUrl: 'app/views/login.html', controller: 'loginController'});
}])

.controller('loginController', function($scope, $modal, $rootScope, $window, $location, loginService, userService){

	$rootScope.destroyVariablesSession();

	var userFirstAccess = "";

	$scope.validarLogin = ValidarLogin;
	$scope.modalChangePassword = ModalChangePassword;
	$scope.clear = Clear;

	function ValidarLogin() {
		$rootScope.alerts = [];

		if (!$scope.usuario.login || !$scope.usuario.password) {
			$rootScope.alerts = [{msg:"Os campos E-mail e Senha devem ser preenchidos."}];
			return;
		}

		loginService.validarLogin($scope.usuario).then(function(data) {
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
		$scope.changePassword = ChangePassword;
		$scope.cancel = Cancel;

		var user = user1;

		function ChangePassword() {
			if(this.password != this.rewritePassword){
				$scope.alertsValidate =  [{type:"danger", msg:"A sessão expirou. Por favor, atualize sua página."}];
			     $timeout(function(index) {
			    	 $scope.alertsValidate.splice(index, 1);
			     }, 3000);

				this.rewritePassword = "";
				this.password = "";
			}else{
				user.password = this.password;
				userService.editUserChangePassword(user).then(function(user){
					$window.sessionStorage.user = JSON.stringify(user);

					$scope.alertsValidate =  [{type:"success", msg:" Senha alterada com sucesso!"}];
				     $timeout(function(index) {
				    	 $scope.alertsValidate.splice(index, 1);
				    	 $modalInstance.close(true);
				     }, 3000);

				    if(isManyCompanies){
				    	$rootScope.selectdCompanies();
				    }
				});
			}
		};

		function Cancel() {
			$modalInstance.dismiss('cancel');
		};
	};

	function Clear() {
		$scope.alertsRenewPassword = undefined;
		$scope.sendEmail = false;
	}

});
