angular.module('KaplenWeb.movementsTaxController',['ui.bootstrap'])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
    $routeProvider.when('/movements/fee', {templateUrl: 'app/views/financasTaxas.html', controller: 'movementsTaxController'});
}])

.controller('movementsTaxController', function(menuFactory, $location, $scope, $modal, calendarFactory, $rootScope,
        relatorioService, installmentsService, $window, advancedFilterService, calendarService, FinancialService){

    //Extensao do serviço para filtro avançado
    angular.extend($scope, advancedFilterService);

    //Extensao do serviço para calendario
    angular.extend($scope, calendarService);
    $scope.resetCalendarService();

    menuFactory.setActiveMovements();

    $scope.items = [];
    $scope.maxSize = 4;
    $scope.totalItensPage = 10;
    $scope.currentPage = 1;
    $scope.totalItens = 0;

    init();

    function init() {

        if(!$rootScope.movementsFees) {
            $location.path('/movements');
        } else {
            $scope.acquirer = $rootScope.movementsFees.acquirer;
            $scope.currency = $rootScope.movementsFees.currency;
            $scope.startDate = $rootScope.movementsFees.startDate;
            $scope.endDate = $rootScope.movementsFees.endDate;
            $scope.shopIds = $rootScope.movementsFees.shopIds;
            $scope.type = $rootScope.movementsFees.type;
            $scope.description = $rootScope.movementsFees.description;
            $scope.total = 0;

            getTaxes();
        }

        $scope.back = back;
    }

    function getTaxes() {
        FinancialService.getTaxes({
            currency: $scope.currency,
            startDate: calendarFactory.formatDateForService($scope.startDate),
            endDate: calendarFactory.formatDateForService($scope.endDate),
            acquirer: $scope.acquirer.id,
            shopIds: $scope.shopIds,
            types: $scope.type,
            pageNumber: $scope.currentPage,
            maxPageSize: $scope.totalItensPage
        }).then(function(response) {
            var items = [];
            var total = 0;

            for(var item in response.data){
                if(typeof response.data[item] === 'object') {
                    items.push(response.data[item])
                } else {
                    break;
                }
            }

            $scope.items = items;
            $scope.totalItens = response.headers('X-TotalRecords');
        });
    }

    function back(){
        $location.path('/movements');
    }

    /* pagination */
    $scope.alterTotalItensPage = function() {
        this.currentPage = $scope.currentPage = 1;
        $scope.totalItensPage = this.totalItensPage;
    };

    $scope.pageChanged = function () {
        $scope.currentPage = this.currentPage;
        getTaxes();
    };

    $scope.totalItensPageChanged = function () {
        this.currentPage = $scope.currentPage = 1;
        $scope.totalItensPage = this.totalItensPage;
        getTaxes();
    };
});
