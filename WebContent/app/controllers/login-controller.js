/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

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
			objData = objData.data;
			var objUser = objData.user;
			var strToken = objUser.token;

			if(strToken && objUser) {
				$rootScope.signIn(strToken, objUser);
			}
		}).catch(function() {
			console.log('error');
			// TODO: implementar erro
		});
	}

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
			if(bolValidate){
				$rootScope.logout();
				$scope.usuario = {};
			}
		}, function() {
			$location.path("/home");
		});
	}

	function ModalTrocarSenha($scope, $window, $rootScope, objUser1, $uibModalInstance) {
		$scope.password = "";
		$scope.rewritePassword = "";
		$scope.cancel = Cancel;

		function Cancel() {
			$uibModalInstance.dismiss('cancel');
		}
	}

	function Clear() {
		$scope.alertsRenewPassword = undefined;
		$scope.sendEmail = false;
	}

});
