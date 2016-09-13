angular.module('KaplenWeb.terminalsManager',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/terminals', {templateUrl: 'app/views/terminals/listTerminal.html', controller: 'terminalsController'});
	$routeProvider.when('/editTerminal/:id', {templateUrl: 'app/views/terminals/editTerminal.html', 
		 controller: 'editTerminalController', resolve: { 
			 terminal: function(Restangular, $route){
				 return Restangular.one('terminals', $route.current.params.id).get();	 						 
			 }}});
}])

.controller('terminalsController', function($scope, $location, terminalService){
		
	$scope.editTerminal = function(id) {
		$location.path('/editTerminal/'+id);
	};
	
	$scope.search = function() {
		terminalService.getSearch($scope.name, $scope.terminalCode).then(function(itens) {
			$scope.itens = itens;
		});
	};
	
	$scope.clear = function() {
		$scope.name = $scope.terminalCode = '';
		listterminals();
	};
	
	function listterminals() {	
		terminalService.getTerminalByCompany().then(function(itens) {
			$scope.itens = itens;
		});
	};
	 
	listterminals();
	
}).controller('editTerminalController', function($scope, $location, terminal, terminalService){
	
	$scope.terminal = terminal;
	
	$scope.save = function() {
		terminalService.editTerminal($scope.terminal).then(function() {
			$location.path('/terminals');
		});
	};
	
	$scope.returnList = function() {
		$location.path('/terminals');
	};
	
});