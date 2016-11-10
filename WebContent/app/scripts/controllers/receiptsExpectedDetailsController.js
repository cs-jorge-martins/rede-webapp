angular.module('Conciliador.receiptsExpectedDetailsController',['ui.bootstrap'])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/receipts/expected_details', {templateUrl: 'app/views/receipts_expected_details.html', controller: 'receiptsExpectedDetailsController'});
}])

.controller('receiptsExpectedDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
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

				$scope.startDate = $rootScope.receiptsDetails.startDate;
				$scope.sort = "";
				$scope.day = calendarFactory.getDayOfDate($scope.startDate);
        		$scope.month = calendarFactory.getMonthNameOfDate($scope.startDate);

				$scope.tabs = [
					{
						title: 'Rede',
						id: 1,
						active: true
					},
					{
						title: 'Cielo',
						id: 2
					},
					{
						title: 'GetNet',
						id: 3
					}
				];

				$scope.maxSize = 4;

				$scope.salesData = [];
				$scope.salesTotalItensPage = 10;
				$scope.salesTotalItens = 0;
				$scope.salesCurrentPage = 0;

				$scope.back = back;
				$scope.changeTab = changeTab;
			}
		}

	    function back(){
	        $location.path('/receipts');
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

				$scope.salesData = data;
				$scope.salesTotalItens = pagination.totalElements;

			}).catch(function(response) {
				$scope.salesData = [];
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
