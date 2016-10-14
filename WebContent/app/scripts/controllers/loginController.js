angular.module('KaplenWeb.loginController',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/login', {templateUrl: 'app/views/login.html', controller: 'loginController'});
}])

.controller('loginController', function($scope, $modal, $rootScope, $window, $location,
		Restangular, loginService, userService, optionsService, selectEmpresaService){

	$rootScope.destroyVariablesSession();

	var userFirstAccess = "";
	$scope.validarLogin = function(){

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

	$scope.modalChangePassword = function(user, isManyCompanies) {
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

	var ModalTrocarSenha = function ($scope, $window, $rootScope, user1, $modalInstance, $timeout, isManyCompanies) {
		$scope.password = "";
		$scope.rewritePassword = "";

		var user = user1;

		$scope.changePassword = function(){
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

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	};

	$scope.renewPassword = function() {
		if($scope.email !== undefined || $scope.email !== ''){
			optionsService.renewPassword($scope.email)
			.then(function(data) {
				if(data.error){
					$scope.alertsRenewPassword = [{type:'danger', msg:data.message}];
				}else{
					$scope.sendEmail = true;
				}
			});
		}
	};

	$scope.clear = function() {
		$scope.alertsRenewPassword = undefined;
		$scope.sendEmail = false;
	};

});
