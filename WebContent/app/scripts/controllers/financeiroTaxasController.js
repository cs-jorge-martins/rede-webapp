angular.module('KaplenWeb.movementsTaxController',['ui.bootstrap'])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
    $routeProvider.when('/movements/fee', {templateUrl: 'app/views/financasTaxas.html', controller: 'movementsTaxController'});
}])

.controller('movementsTaxController', function(menuFactory, $scope, $modal, calendarFactory, $rootScope,
        relatorioService, installmentsService, $window, advancedFilterService, calendarService){

    //Extensao do serviço para filtro avançado
    angular.extend($scope, advancedFilterService);

    //Extensao do serviço para calendario
    angular.extend($scope, calendarService);
    $scope.resetCalendarService();

    menuFactory.setActiveMovements();

    /************************************************************** FUNCOES PARA BOTÕES INICIAIS ******************************************************************/
});
