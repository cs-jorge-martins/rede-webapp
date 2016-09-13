angular.module('KaplenWeb.userManager',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/users', {templateUrl: 'app/views/users/listUsers.html', controller: 'usersController'});
	$routeProvider.when('/newUser', {templateUrl: 'app/views/users/editUser.html', controller: 'newUsersController'});
	$routeProvider.when('/editUser/:id', {templateUrl: 'app/views/users/editUser.html', 
		 controller: 'editUsersController', resolve: { 
			 user: function(Restangular, $route){
				 return Restangular.one('users', $route.current.params.id).get();	 						 
			 }}});
}])

.controller('usersController', function($scope, $location,$modal, userService, $rootScope){
	
	$scope.alerts =  [];
			
	$scope.newUser = function() {
		$location.path('/newUser');
	};
	
	$scope.editUser = function(id) {
		$location.path('/editUser/'+id);
	};
	
	$scope.deleteUser = function(user) {
		var modalInstance = $modal.open({
			templateUrl: 'app/views/users/userRemove.html',
			controller: function($scope, $modalInstance, item) {
				$scope.item = item;
				$scope.ok = function () {
					$modalInstance.close(item);
				};

				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
			},
			resolve: {
				item: function () {
					return user;
				}
			}
		});

		modalInstance.result.then(function (it) {
			userService.deleteUser(it).then(function() {
				listUsers();
				$scope.alerts =  [ { type: "success", msg: "O Usuário foi excluído com sucesso."}];
			});
		});
	};	
	
	$scope.search = function() {
		userService.getSearch($scope.name, $scope.email, $rootScope.company).then(function(itens) {
			$scope.itens = itens;
		});
	};
	
	$scope.clear = function() {
		$scope.name = $scope.email = '';
		listUsers();
	};
	
	function listUsers() {	
		userService.getUsersByCompany($rootScope.company).then(function(itens) {
			$scope.itens = itens;
		});
	};
	 
	listUsers();
	
}).controller('newUsersController', function($scope, $location, $rootScope, userService){
	
	$scope.title = "novo usuário";
	$scope.save = function() {
		var validated = true;
		
		if($scope.usuario == undefined){
			$scope.alerts =  [ { type: "danger", msg: "Favor preencher os campos abaixo."} ];
			validated = false;
		}
		
		if(validated && ($scope.usuario.name == undefined || ($scope.usuario.name == null && $scope.usuario.name == ""))){
			$scope.alerts =  [ { type: "danger", msg: "O nome do usuário não foi informado."} ];
			validated = false;
		}
		
		if(validated && ($scope.usuario.email == undefined || ( $scope.usuario.email == null && $scope.usuario.email == ""))){
			$scope.alerts =  [ { type: "danger", msg: "O email do usuário não foi informado."} ];
			validated = false;
		}
		
		if(validated && ($scope.usuario.permissionUser == undefined || ($scope.usuario.permissionUser == null && $scope.usuario.permissionUser == ""))){
			$scope.alerts =  [ { type: "danger", msg: "A permissão do usuário não foi informada."} ];
			validated = false;
		}
		
		if(validated){
			
			userService.saveUser($scope.usuario).then(function(action) {
				 if(action.error){
					$scope.alerts =  [ { type: "danger", msg: action.message}];
				 }
				 else if(!action.error){
					 $scope.alerts =  [ { type: "success", msg: "Usuário salvo com sucesso."} ];
				 }
			});
		}
	};
	
	$scope.returnList = function() {
		$location.path('/users');
	};
	
}).controller('editUsersController', function($scope, $location, userService, user){
	
	$scope.title = "editar usuário";
	
	$scope.usuario = user;

	$scope.save = function() {
		var validated = true;
		
		if($scope.usuario == undefined){
			$scope.alerts =  [ { type: "danger", msg: "Favor preencher os campos abaixo."} ];
			validated = false;
		}
		
		if(validated && ($scope.usuario.name == undefined || ($scope.usuario.name == null && $scope.usuario.name == ""))){
			$scope.alerts =  [ { type: "danger", msg: "O nome do usuário não foi informado."} ];
			validated = false;
		}
		
		if(validated && ($scope.usuario.email == undefined || ( $scope.usuario.email == null && $scope.usuario.email == ""))){
			$scope.alerts =  [ { type: "danger", msg: "O email do usuário não foi informado."} ];
			validated = false;
		}
		
		if(validated && ($scope.usuario.permissionUser == undefined || ($scope.usuario.permissionUser == null && $scope.usuario.permissionUser == ""))){
			$scope.alerts =  [ { type: "danger", msg: "A permissão do usuário não foi informada."} ];
			validated = false;
		}
		
		if(validated){
			userService.editUser($scope.usuario).then(function(action) {
				 if(action.error){
					$scope.alerts =  [ { type: "danger", msg: action.message}];
				 }
				 else if(!action.error){
					 $scope.alerts =  [ { type: "success", msg: "Usuário alterado com sucesso."} ];
				 }
			});
		}
	};
	
	$scope.returnList = function() {
		$location.path('/users');
	};
});
