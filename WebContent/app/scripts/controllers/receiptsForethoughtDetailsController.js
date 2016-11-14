angular.module('Conciliador.receiptsForethoughtDetailsController',['ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/receipts/forethought_details', {templateUrl: 'app/views/receipts_forethought_details.html', controller: 'receiptsForethoughtDetailsController'});
}])

.controller('receiptsForethoughtDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
     advancedFilterService, $location, MovementService){

		var filter = {};
		Init();

		function Init(){
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

				$scope.otherReleasesTotal = $rootScope.receiptsDetails.otherReleasesTotal;

				$scope.sort = "payedDate,ASC";

				$scope.forethought = [];

				$scope.day = calendarFactory.getDayOfDate($scope.startDate);
        		$scope.month = calendarFactory.getMonthNameOfDate($scope.startDate);


				filter = {
					shopIds: $scope.shopIds,
					acquirerIds: $scope.acquirer.id,
					startDate: calendarFactory.formatDateTimeForService($scope.startDate),
					endDate: calendarFactory.formatDateTimeForService($scope.endDate),
					bankAccountIds: $scope.bankAccount.id,
					status: "FORETHOUGHT",
				};

				$scope.maxSize = 10;

				$scope.totalItensPage = 10;
				$scope.totalItens = 0;
				$scope.salesCurrentPage = 0;

				$scope.back = Back;
				$scope.sortResults = SortResults;
				$scope.pageChangedSales = PageChangedSales;
				$scope.totalItensPageChangedSales = TotalItensPageChangedSales;
				$scope.pageChangedAdjusts = PageChangedAdjusts;

				GetForethought();
			}
		}

	    function Back(){
	        $location.path('/receipts');
	    }

	    function GetForethought () {
	    	$scope.forethought = [];
	    	filter.sort = $scope.sort;
	    	MovementService.GetForethoughts(filter).then(function(response) {
	    		var data = response.data.content;
	    		var pagination = response.data.page;

	    		for (var i in data ) {
	    			$scope.forethought.push(data[i]);
	    		}

	    	}).catch(function(response) {

	    	})
	    }

	    function SortResults(elem, kind) {
	    	var order_string;
	    	order_string = $rootScope.sortResults(elem,kind);

	    	$scope.sort = order_string;

	    	GetForethought();
	    }

	    /* pagination */
		function PageChangedSales() {
			$scope.salesCurrentPage = this.salesCurrentPage;
			GetForethought();
		};


		function TotalItensPageChangedSales() {
			this.salesCurrentPage = $scope.salesCurrentPage = 0;
			$scope.salesTotalItensPage = this.salesTotalItensPage;
			GetForethought();
		};

		function PageChangedAdjusts() {
			$scope.adjustsCurrentPage = this.adjustsCurrentPage;
			GetForethought();
		};
	});
