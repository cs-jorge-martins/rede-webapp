angular.module('Conciliador.receiptsExpectedDetailsController',['ui.bootstrap'])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/receipts/expected_details', {templateUrl: 'app/views/receipts_expected_details.html', controller: 'receiptsExpectedDetailsController'});
}])

.controller('receiptsExpectedDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
     advancedFilterService, $location, FinancialService, MovementSummaryService){

		var filter = {};
		$scope.totalItensPage = 10;

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
				$scope.date = calendarFactory.formatDateTimeForService($scope.startDate);
				$scope.sort = "";
				$scope.day = calendarFactory.getDayOfDate($scope.startDate);
        		$scope.month = calendarFactory.getMonthNameOfDate($scope.startDate);

				$scope.filterStatus = "EXPECTED,SUSPENDED,PAWNED,BLOCKED,PAWNED_BLOCKED";

				$scope.maxSize = 4;

				$scope.detailsData = [];
				$scope.salesTotalItensPage = 10;
				$scope.salesTotalItens = 0;
				$scope.salesCurrentPage = 0;

				$scope.adjustsTotalItensPage = 10;
				$scope.adjustsTotalItens = 0;

				$scope.accountsLabel = $rootScope.receiptsDetails.accountsLabel;

				$scope.back = back;
				$scope.changeTab = changeTab;
				$scope.tabs = [];
				$scope.translateStatus = TranslateStatus;
				$scope.adjustsCurrentPage = 0;

				getExpectedAcquirers();
			}
		}

	    function back(){
	        $location.path('/receipts');
	    }

	    function getExpectedAcquirers() {

			var expectedAcquirersFilter = {
				groupBy: "ACQUIRER",
				status: $scope.filterStatus,
				startDate: $scope.date,
				endDate: $scope.date
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

		$scope.totalItensPageChangedSales = function (acquirer_id) {
			this.salesCurrentPage = $scope.salesCurrentPage = 0;
			$scope.salesTotalItensPage = this.salesTotalItensPage;
			getExpectedDetails(acquirer_id);
		};

	    function getExpectedDetails(acquirer_id) {

			filter.page =  $scope.adjustsCurrentPage ==  0 ? $scope.adjustsCurrentPage : $scope.adjustsCurrentPage - 1;
			filter.size =  $scope.adjustsTotalItensPage;
			filter.status = $scope.filterStatus;
			filter.startDate = $scope.date;
			filter.endDate = $scope.date;
			filter.sort = $scope.sort;
			filter.acquirer = acquirer_id;

			// https://z20ycs2v3e.execute-api.us-east-1.amazonaws.com/dev/financials/details?acquirerIds=1&bankAccountIds=5&cardProductIds=1&endDate=20161004&page=0&size=10&sort=transaction.date,DESC&sort=transaction.hour,DESC&startDate=20161004&status=RECEIVED&type=CREDIT

			FinancialService.getExpectedDetails(filter).then(function(response) {
				var data = response.data.content;
				var pagination = response.data.page;

				$scope.detailsData = data;
				$scope.adjustsTotalItens = pagination.totalElements;

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

	    function TranslateStatus(status, date) {
			if(status && date) {
				status = status.toLowerCase();
				switch (status) {
					case "expected":
					case "pending":
					 	status = "pendente";
						break;
					case "suspended":
						status = "suspenso";
						break;
					case "pawned":
						status = "penhorado";
						break;
					case "blocked":
						status = "bloqueado";
						break;
					case "pawned_blocked":
						status = "penhorado/bloqueado";
						break;
					case "forethought":
						status = "antecipado em: " + date;
						break;
				}
			}
			return status;
		}

	    $scope.sortResults = function(elem, kind, acquirer_id) {
			$scope.sort = $rootScope.sortResults(elem,kind);
			getExpectedDetails(acquirer_id);
	    }

	    /* pagination */
		$scope.pageChangedSales = function () {
			$scope.salesCurrentPage = this.salesCurrentPage;
		};

		$scope.totalItensPageChangedSales = function (acquirer_id) {
			this.salesCurrentPage = $scope.salesCurrentPage = 0;
			$scope.salesTotalItensPage = this.salesTotalItensPage;
			getExpectedDetails(acquirer_id);
		};

		$scope.pageChangedAdjusts = function () {
			$scope.adjustsCurrentPage = this.adjustsCurrentPage;
			getExpectedDetails(1);
		};

		$scope.totalItensPageChangedAdjusts = function () {
			this.adjustsCurrentPage = $scope.adjustsCurrentPage = 0;
			$scope.adjustsTotalItensPage = this.adjustsTotalItensPage;
			getExpectedDetails(1);
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
