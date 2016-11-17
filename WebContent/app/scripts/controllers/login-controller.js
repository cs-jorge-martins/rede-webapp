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
	$scope.login = "";

	function ValidarLogin() {
		$rootScope.alerts = [];

		var strUser = $scope.login || false;
		var strPassword = $scope.password || false;

		if (!strUser || !strPassword) {
			$rootScope.alerts = [{msg:"Os campos E-mail e Senha devem ser preenchidos."}];
			return;
		}

		var objUser = {
			login: strUser,
			password: strPassword
		};

		loginService.ValidarLogin(objUser).then(function(objData) {
			var objData = objData.data;
			var objUser = objData.user;
			var strToken = objUser.token;

			if(strToken && objUser) {
				$rootScope.signIn(strToken, objUser);
			}
		}).catch(function(response) {
			console.log('error');
		});
	};

	function ModalChangePassword(objUser, bolIsManyCompanies) {
		var objModalInstance = $modal.open({
			templateUrl: 'modalTrocarSenha.html',
			controller: ModalTrocarSenha,
			size:'sm',
			resolve: {
		        user1: function () {
		          return objUser;
		        },
		        isManyCompanies: function(){
		        	return bolIsManyCompanies;
		        }
		      }
		});

		objModalInstance.result.then(function(bolValidate) {
			if(bolValidate){
				$rootScope.logout();
				$scope.usuario = new Object();
			}
		}, function() {
			$location.path("/dashboard");
		});
	};

	function ModalTrocarSenha($scope, $window, $rootScope, objUser1, $modalInstance, $timeout, bolIsManyCompanies) {
		$scope.password = "";
		$scope.rewritePassword = "";
		$scope.cancel = Cancel;

		var objUser = objUser1;

		function Cancel() {
			$modalInstance.dismiss('cancel');
		};
	};

	function Clear() {
		$scope.alertsRenewPassword = undefined;
		$scope.sendEmail = false;
	}

});
