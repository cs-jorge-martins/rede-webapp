/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.loginController',[])

.controller('loginController', function($scope, $uibModal, $rootScope, $window, $location, loginService){

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
		var objModalInstance = $uibModal.open({
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
			console.log('bolValidate',bolValidate)
			if(bolValidate){
				$rootScope.logout();
				$scope.usuario = new Object();
			}
		}, function() {
			$location.path("/home");
		});
	};

	function ModalTrocarSenha($scope, $window, $rootScope, objUser1, $uibModalInstance, $timeout, bolIsManyCompanies) {
		$scope.password = "";
		$scope.rewritePassword = "";
		$scope.cancel = Cancel;

		var objUser = objUser1;

		function Cancel() {
			$uibModalInstance.dismiss('cancel');
		};
	};

	function Clear() {
		$scope.alertsRenewPassword = undefined;
		$scope.sendEmail = false;
	}

});
