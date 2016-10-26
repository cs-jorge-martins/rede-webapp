angular.module('Conciliador.receiptsDetailsController',['ui.bootstrap'])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/receipts/details', {templateUrl: 'app/views/receipts_details.html', controller: 'receiptsDetailsController'});
}])

.controller('receiptsDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
     advancedFilterService, $location, FinancialService){

		var filter = {};
		init();

		function init(){
			$rootScope.bodyId = "receiptsDetailsPage";
			$scope.$on("$routeChangeStart", function(next, current){
				$rootScope.bodyId = null;
			});

			if(!$rootScope.receiptsDetails) {
				$location.path('/receipts');
			} else {
				$scope.acquirer = $rootScope.receiptsDetails.acquirer;
				$scope.cardProduct = $rootScope.receiptsDetails.cardProduct;
				$scope.currency = $rootScope.receiptsDetails.currency;
				$scope.startDate = $rootScope.receiptsDetails.startDate;
				$scope.endDate = $rootScope.receiptsDetails.endDate;
				$scope.shopIds = $rootScope.receiptsDetails.shopIds;
				$scope.shops = $rootScope.receiptsDetails.shops;
				$scope.products = $rootScope.receiptsDetails.products;
				//$scope.type = $rootScope.receiptsDetails.type;
				$scope.bankAccount = $rootScope.receiptsDetails.bankAccount;

				$scope.expectedAmount = $rootScope.receiptsDetails.expectedAmount;
				$scope.payedAmount = $rootScope.receiptsDetails.payedAmount;
				$scope.total = $rootScope.receiptsDetails.total;
				$scope.status = $rootScope.receiptsDetails.status;

				$scope.accountsLabel = $rootScope.receiptsDetails.accountsLabel;
				$scope.shopsLabel = $rootScope.receiptsDetails.shopsLabel;
				$scope.shopsFullLabel = $rootScope.receiptsDetails.shopsFullLabel;
				$scope.cardProductsLabel = $rootScope.receiptsDetails.cardProductsLabel;
				$scope.cardProductsFullLabel = $rootScope.receiptsDetails.cardProductsFullLabel;
				$scope.sort = "";


				$scope.day = calendarFactory.getDayOfDate($scope.startDate);
        		$scope.month = calendarFactory.getMonthNameOfDate($scope.startDate);

				$scope.tabs = [
					{
						title: 'vendas',
						active: true
					},
					{
						title: 'ajustes'
					},
					{
						title: 'cancelamentos'
					}
					/*,
					{
						title: 'ecommerce'
					}
					*/
				];

				filter = {
					cardProductIds: $scope.cardProduct.cardProductId,
					acquirerIds: $scope.acquirer.id,
					startDate: calendarFactory.formatDateTimeForService($scope.startDate),
					endDate: calendarFactory.formatDateTimeForService($scope.endDate),
					bankAccountIds: $scope.bankAccount.id
				};

				if($scope.status === 'forethought'){
					filter.status = 'FORETHOUGHT'
				} else {
					filter.status = 'RECEIVED'
				}

				$scope.maxSize = 4;

				$scope.salesData = [];
				$scope.salesTotalItensPage = 10;
				$scope.salesTotalItens = 0;
				$scope.salesCurrentPage = 0;

        		$scope.adjustsData = [];
        		$scope.adjustsTotalItensPage = 10;
        		$scope.adjustsTotalItens = 0;
				$scope.adjustsCurrentPage = 0;

        		$scope.cancellationsData = [];
        		$scope.cancellationsTotalItensPage = 10;
        		$scope.cancellationsTotalItens = 0;
				$scope.cancellationsCurrentPage = 0;

        		$scope.ecommerceData = [];
        		$scope.ecommerceTotalItensPage = 10;
        		$scope.ecommerceTotalItens = 0;
				$scope.ecommerceCurrentPage = 0;

				$scope.back = back;
				$scope.getShopsLabel = getShopsLabel;
				$scope.changeTab = changeTab;
			}
		}

		function getShopsLabel() {

			var shops = "";

			if($scope.shops.length > 1) {
				shops = $scope.shops[0].label + ' +' + ($scope.shops.length - 1) + ' estabelecimento'

				if($scope.shops.length > 2) {
					shops += 's'
				}
			}

			return shops;

		}

	    function back(){
	        $location.path('/receipts');
	    }

	    function getSales(cache) {

			filter.type = 'CREDIT';
			filter.page =  $scope.salesCurrentPage ==  0 ? $scope.salesCurrentPage : $scope.salesCurrentPage - 1;
			filter.size =  $scope.salesTotalItensPage;
			filter.sort = $scope.sort;

			FinancialService.getReceipt(filter).then(function(response) {
				var data = response.data.content;
				var pagination = response.data.page;

				$scope.salesData = data;
				$scope.salesTotalItens = pagination.totalElements;

			}).catch(function(response) {
				$scope.salesData = [];
				console.log('[receiptsDetailsController:getSales] error');
			});
	    }

	    function getAdjusts(cache, order) {
			filter.type = 'ADJUST';
			filter.page =  $scope.adjustsCurrentPage ==  0 ? $scope.adjustsCurrentPage : $scope.adjustsCurrentPage - 1;
			filter.size =  $scope.adjustsTotalItensPage;
			filter.sort = $scope.sort;

			if(order) {
				filter.sort = order;
			}

			FinancialService.getReceipt(filter).then(function(response) {
				var data = response.data.content;
				var pagination = response.data.page;

				$scope.adjustsData = data;
				$scope.adjustsTotalItens = pagination.totalElements;
			}).catch(function(response) {
				$scope.adjustsData = [];
				console.log('[receiptsDetailsController:getAdjusts] error');
			});
	    }

	    function getCancellations(cache, order) {
	    	filter.type = 'CANCELLATION';
	    	filter.page =  $scope.cancellationsCurrentPage ==  0 ? $scope.cancellationsCurrentPage : $scope.cancellationsCurrentPage - 1;
			filter.size =  $scope.cancellationsTotalItensPage;
			filter.sort = $scope.sort;

			if (order) {
				filter.sort =  order;
			}

			FinancialService.getReceipt(filter).then(function(response) {
				var data = response.data.content;
				var pagination = response.data.page;

				$scope.cancellationsData = data;
				$scope.cancellationsTotalItens = pagination.totalElements;
			}).catch(function(response) {
				$scope.cancellationsData = [];
				console.log('[receiptsDetailsController:getAdjusts] error');
			});
	    }

	    function getEcommerce() {
	    
	    }

	    function changeTab(index) {
	    	$scope.tabs[index].active = true;
			$scope.sort = "";

	    	if(index === 0) {
	    		getSales();
	    	} else if(index === 1) {
	    		getAdjusts();
	    	} else if(index === 2) {
	    		getCancellations();
	    	} else if(index === 0) {
	    		getCommerce();
	    	}
	    }

	    $scope.sortResults = function(elem, kind, tipo_relatorio) {
			$scope.sort = $rootScope.sortResults(elem, kind);
			if(tipo_relatorio == "sales") {
				getSales(false);
			} else if(tipo_relatorio == "adjusts") {
				getAdjusts();
			} else if(tipo_relatorio == "cancellation") {
				getCancellations();
			}
	    }

	    /* pagination */
		$scope.pageChangedSales = function () {
			$scope.salesCurrentPage = this.salesCurrentPage;
			getSales();
		};

		$scope.totalItensPageChangedSales = function () {
			this.salesCurrentPage = $scope.salesCurrentPage = 0;
			$scope.salesTotalItensPage = this.salesTotalItensPage;
			getSales();
		};

		$scope.pageChangedAdjusts = function () {
			$scope.adjustsCurrentPage = this.adjustsCurrentPage;
			getAdjusts();
		};

		$scope.totalItensPageChangedAdjusts = function () {
			this.adjustsCurrentPage = $scope.adjustsCurrentPage = 0;
			$scope.adjustsTotalItensPage = this.adjustsTotalItensPage;
			getAdjusts();
		};

		$scope.pageChangedCancellations = function () {
			$scope.cancellationsCurrentPage = this.cancellationsCurrentPage;
			getCancellations();
		};

		$scope.totalItensPageChangedCancellations = function () {
			this.cancellationsCurrentPage = $scope.cancellationsCurrentPage = 0;
			$scope.cancellationsTotalItensPage = this.cancellationsTotalItensPage;
			getCancellations();
		};
	});
