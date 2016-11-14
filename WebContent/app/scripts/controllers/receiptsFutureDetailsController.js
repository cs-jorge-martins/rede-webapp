angular.module('Conciliador.receiptsOtherDetailsController', ['ui.bootstrap'])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/receipts/future_details', {templateUrl: 'app/views/receipts_future_details.html', controller: 'receiptsFutureDetailsController'});
}])

.controller('receiptsFutureDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
     advancedFilterService, $location,FinancialService){

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

				$scope.startDate = $rootScope.receiptsDetails.periodStartDate;
				$scope.endDate = $rootScope.receiptsDetails.periodEndDate;
				$scope.dateTitle = dateTitle;
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

				$scope.otherReleasesTotal = $rootScope.receiptsDetails.otherReleasesTotal;
				
				$scope.sort = "";


				$scope.day = calendarFactory.getDayOfDate($scope.startDate);
        		$scope.month = calendarFactory.getMonthNameOfDate($scope.startDate);

                
				$scope.maxSize = 4;
				$scope.itensPerPage = 10;
				$scope.currentPage = 0;
				$scope.currentSize = 10;

				$scope.otherDetailsData = [];
				$scope.totalItensPage = 10;
				$scope.totalItens = 0;
				$scope.salesCurrentPage = 0;

				$scope.back = back;
				$scope.getShopsLabel = getShopsLabel;
				getFutureDetails();
				// getOtherDetails();
			}
		}

		function getShopsFilter(model) {
			return model.map(function(item){
				return item.id;
			}).join(",");
		}
		
		function dateTitle() {
			var string = "";

			if($scope.startDate && $scope.endDate) {
				string = calendarFactory.getDayAndMonthFromDate($scope.startDate);
				string += " a ";
				string += calendarFactory.getDayAndMonthFromDate($scope.endDate);
			}

			return string;
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

	    function getFutureDetails() {

			var filter = {
				startDate: calendarFactory.formatDateTimeForService($scope.startDate),
				endDate: calendarFactory.formatDateTimeForService($scope.endDate),
				bankAccountIds: $scope.bankAccount.id,
				shopIds: getShopsFilter($scope.shopIds),
				acquirerIds: $scope.acquirer.id,
				cardProductIds: $scope.cardProduct.cardProductId,
				page:  $scope.currentPage ==  0 ? $scope.currentPage : $scope.currentPage - 1,
				size:  $scope.currentSize,
				sort: $scope.sort,
				status: 'EXPECTED'
			};

			FinancialService.getFutureDetails(filter).then(function (response) {

				var data = response.data.content;
				var pagination = response.data.page;

				$scope.detailsData = data;
				$scope.totalItens = pagination.totalElements;

			}).catch(function (response) {

			});

	    }

		$scope.sortResults = function(elem, kind) {
			$scope.sort = $rootScope.sortResults(elem,kind);
			getFutureDetails();
		}

	    /* pagination */
		$scope.pageChanged = function () {
			$scope.currentSize = this.totalItensPage;
			$scope.currentPage = this.currentPage;
			getFutureDetails();
		};

		$scope.totalItensPageChanged = function () {
			this.currentPage = $scope.totalItensPage = 0;
			$scope.totalItensPage = this.currentPage;
			getFutureDetails();
		};

	});
