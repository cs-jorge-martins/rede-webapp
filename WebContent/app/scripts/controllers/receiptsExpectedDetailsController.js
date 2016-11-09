angular.module('Conciliador.receiptsExpectedDetailsController',['ui.bootstrap'])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/receipts/expected_details', {templateUrl: 'app/views/receipts_expected_details.html', controller: 'receiptsExpectedDetailsController'});
}])

.controller('receiptsExpectedDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
     advancedFilterService, $location, FinancialService, MovementSummaryService){

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

				$scope.startDate = $rootScope.receiptsDetails.startDate;
				$scope.sort = "";
				$scope.day = calendarFactory.getDayOfDate($scope.startDate);
        		$scope.month = calendarFactory.getMonthNameOfDate($scope.startDate);

				$scope.maxSize = 4;

				$scope.detailsData = [];
				$scope.salesTotalItensPage = 10;
				$scope.salesTotalItens = 0;
				$scope.salesCurrentPage = 0;

				$scope.back = back;
				$scope.changeTab = changeTab;
				$scope.tabs = [];

				getExpectedAcquirers();
			}
		}

	    function back(){
	        $location.path('/receipts');
	    }

	    function getExpectedAcquirers() {

			var date = calendarFactory.formatDateTimeForService($scope.startDate);
			var expectedAcquirersFilter = {
				groupBy: "ACQUIRER",
				status: "EXPECTED,SUSPENDED,PAWNED,BLOCKED,PAWNED_BLOCKED",
				startDate: date,
				endDate: date
			};

			MovementSummaryService.listMovementSummaryByFilter(expectedAcquirersFilter).then(function (response) {

				var obj;
				var content = response.data.content;
				for (var i=0; i<content.length; i++) {
					obj = {
						id: content[i].acquirer.id,
						title: content[i].acquirer.name
					};
					$scope.tabs.push(obj);
				}

			}).catch(function (response) {

			});

		}

	    function getExpectedDetails(acquirer_id) {

			filter.page =  $scope.salesCurrentPage ==  0 ? $scope.salesCurrentPage : $scope.salesCurrentPage - 1;
			filter.size =  $scope.salesTotalItensPage;
			filter.sort = $scope.sort;
			filter.acquirer = acquirer_id;

			// https://z20ycs2v3e.execute-api.us-east-1.amazonaws.com/dev/financials/details?acquirerIds=1&bankAccountIds=5&cardProductIds=1&endDate=20161004&page=0&size=10&sort=transaction.date,DESC&sort=transaction.hour,DESC&startDate=20161004&status=RECEIVED&type=CREDIT

			FinancialService.getExpectedDetails(filter).then(function(response) {
				var data = response.data.content;
				var pagination = response.data.page;

				$scope.detailsData = data;
				$scope.salesTotalItens = pagination.totalElements;

			}).catch(function(response) {
				$scope.detailsData = [];
				console.log('[receiptsDetailsController:getSales] error');
			});
	    }

	    function changeTab(index, acquirer_id) {
	    	$scope.tabs[index].active = true;
			$scope.sort = "";
			getExpectedDetails(acquirer_id);
	    }

	    $scope.sortResults = function(elem, kind) {

	    }

	    /* pagination */
		$scope.pageChangedSales = function () {
			$scope.salesCurrentPage = this.salesCurrentPage;
		};

		$scope.totalItensPageChangedSales = function () {
			this.salesCurrentPage = $scope.salesCurrentPage = 0;
			$scope.salesTotalItensPage = this.salesTotalItensPage;
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
