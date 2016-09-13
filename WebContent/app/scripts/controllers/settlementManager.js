angular.module('KaplenWeb.settlementManager',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/settlements', {templateUrl: 'app/views/settlement/listSettlement.html', controller: 'settlementsController'});
	$routeProvider.when('/newSettlement', {templateUrl: 'app/views/settlement/editSettlement.html', controller: 'newSettlementController'});
	$routeProvider.when('/editSettlement/:id', {templateUrl: 'app/views/settlement/editSettlement.html', 
		 controller: 'editSettlementController', resolve: { 
			 settlement: function(Restangular, $route){
				 return Restangular.one('settlements', $route.current.params.id).get();	 						 
			 }}});
}])

.controller('settlementsController', function($scope, $location, settlementService){
	
	$scope.newSettlement = function() {
		$location.path('/newSettlement');
	};
	
	$scope.editSettlement = function(id) {
		$location.path('/editSettlement/'+id);
	};
	
	$scope.deleteSettlement = function(settlement) {
		settlementService.deleteSettlement(settlement).then(function() {
			listSettlements();
		});
	};	
	
	$scope.search = function() {
		settlementService.getSearch($scope.name, $scope.cnpj).then(function(itens) {
			$scope.itens = itens;
		});
	};
	
	$scope.clear = function() {
		$scope.name = $scope.email = '';
		listSettlements();
	};
	
	function listSettlements() {	
		settlementService.getSettlementByCompany().then(function(itens) {
			$scope.itens = itens;
		});
	};
	 
	listSettlements();
	
}).controller('newSettlementController', function($scope, $location, settlementService){
	$scope.name = "Nova Loja";

	$scope.save = function() {
		settlementService.saveSettlement($scope.settlement).then(function() {
			$location.path('/settlements');
		});
	};
	
	
	$scope.returnList = function() {
		$location.path('/settlements');
	};
	
}).controller('editSettlementController', function($scope, $location,settlement, settlementService){
	
	$scope.name = "Editar Loja";
	
	$scope.settlement = settlement;
	
	$scope.save = function() {
		settlementService.editSettlement($scope.settlement).then(function() {
			$location.path('/settlements');
		});
	};
	
	$scope.returnList = function() {
		$location.path('/settlements');
	};
	
});