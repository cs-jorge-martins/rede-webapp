angular.module('KaplenWeb.movementsReceiptController',['ui.bootstrap'])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
    $routeProvider.when('/movements/receipt', {templateUrl: 'app/views/financasRecebimentos.html', controller: 'movementsReceiptController'});
}])

.controller('movementsReceiptController', function(menuFactory, $scope, $modal, calendarFactory, $rootScope, $location,
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

        if(!$rootScope.movementsDetails) {
            $location.path('/movements');
        } else {
            $scope.acquirer = $rootScope.movementsDetails.acquirer;
            $scope.cardProduct = $rootScope.movementsDetails.cardProduct;
            $scope.currency = $rootScope.movementsDetails.currency;
            $scope.startDate = $rootScope.movementsDetails.startDate;
            $scope.endDate = $rootScope.movementsDetails.endDate;
            $scope.shopIds = $rootScope.movementsDetails.shopIds;
            $scope.products = $rootScope.movementsDetails.products;
            $scope.type = $rootScope.movementsDetails.type;
            $scope.bankDetail = $rootScope.movementsDetails.bankAccount;

            $scope.back = back;

            getReceipt();
        }
    }

    function getReceipt(){
        FinancialService.getReceipt({
            currency: $scope.currency,
            startDate: calendarFactory.formatDateForService($scope.startDate),
            endDate: calendarFactory.formatDateForService($scope.endDate),
            acquirer: $scope.acquirer.id,
            shopIds: $scope.shopIds,
            cardProductIds: $scope.cardProduct.id,
            bankAccountIds: $scope.bankDetail.selected,
            type: $scope.type,
            pageNumber: $scope.currentPage,
            maxPageSize: $scope.totalItensPage
        }).then(function(response) {
            var items = [];

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
        getReceipt();
    };

    $scope.pageChanged = function () {
        $scope.currentPage = this.currentPage;
        getReceipt();
    };

    $scope.totalItensPageChanged = function () {
        this.currentPage = $scope.currentPage = 1;
        $scope.totalItensPage = this.totalItensPage;
    };
});
