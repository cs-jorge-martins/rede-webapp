angular.module('Conciliador.receiptsOtherDetailsController', ['ui.bootstrap'])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/receipts/other_details', {templateUrl: 'app/views/receipts_other_details.html', controller: 'receiptsOtherDetailsController'});
}])

.controller('receiptsOtherDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
     advancedFilterService, $location, AdjustService){

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


				$scope.day = calendarFactory.getDayOfDate($scope.startDate);
        		$scope.month = calendarFactory.getMonthNameOfDate($scope.startDate);

				filter = {
					adjustTypes: "OTHER",
					acquirerIds: $scope.acquirer.id,
					startDate: calendarFactory.formatDateTimeForService($scope.startDate),
					endDate: calendarFactory.formatDateTimeForService($scope.endDate),
					bankAccountIds: $scope.bankAccount.id,
					status: "RECEIVED",
				};

				$scope.maxSize = 10;

				$scope.otherDetailsData = [];
				$scope.totalItensPage = 10;
				$scope.totalItens = 0;
				$scope.salesCurrentPage = 0;

				$scope.back = back;
				$scope.getShopsLabel = getShopsLabel;
				$scope.getOtherDetails = getOtherDetails;
				getOtherDetails();
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

	    function getOtherDetails() {
	    	$scope.otherDetailsData = [];
			filter.sort = $scope.sort;
			AdjustService.GetOtherDetails(filter).then(function(response) {
				var data = response.data.content;
				var pagination = response.data.page;

				for (var i in data) {
					$scope.otherDetailsData.push(data[i]);
				}
			}).catch(function(response) {

			});
	    }

	    $scope.totalOfSumAmount = totalOfSumAmount;

	    function totalOfSumAmount() {
	    	return $scope.otherDetailsData.reduce(function(prev, curr) {
		    	return prev + curr.amount;
		    }, 0);
	    }

	    $scope.sortResults = function(elem, kind) {
			var order_string;
			order_string = $rootScope.sortResults(elem,kind);

			$scope.sort = order_string;

			getOtherDetails();

	    }

	    /* pagination */
		$scope.pageChangedSales = function () {
			$scope.salesCurrentPage = this.salesCurrentPage;
			getOtherDetails();
		};

		$scope.totalItensPageChangedSales = function () {
			this.salesCurrentPage = $scope.salesCurrentPage = 0;
			$scope.salesTotalItensPage = this.salesTotalItensPage;
			getOtherDetails();
		};

		$scope.pageChangedAdjusts = function () {
			$scope.adjustsCurrentPage = this.adjustsCurrentPage;
			getOtherDetails();
		};
	});
