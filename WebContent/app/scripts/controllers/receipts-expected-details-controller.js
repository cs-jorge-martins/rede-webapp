angular.module('Conciliador.receiptsExpectedDetailsController',['ui.bootstrap'])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/receipts/expected_details', {templateUrl: 'app/views/receipts-expected-details.html', controller: 'receiptsExpectedDetailsController'});
}])

.controller('receiptsExpectedDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
     advancedFilterService, $location, FinancialService, MovementSummaryService){

		var filter = {};
		$scope.totalItensPage = 10;

		Init();

		function Init(){
			$rootScope.bodyId = "receiptsDetailsPage";
			$scope.$on("$routeChangeStart", function(next, current){
				$rootScope.bodyId = null;
			});

			if(!$rootScope.receiptsDetails) {
				$location.path('/receipts');
			} else {

				$scope.bankAccount = $rootScope.receiptsDetails.bankAccount;

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

				$scope.back = Back;
				$scope.changeTab = changeTab;
				$scope.tabs = [];
				$scope.translateStatus = TranslateStatus;
				$scope.adjustsCurrentPage = 0;

				$scope.pageChangedSales = PageChangedSales;
				$scope.totalItensPageChangedSales = TotalItensPageChangedSales;
				$scope.pageChangedAdjusts = PageChangedAdjusts;
				$scope.totalItensPageChangedAdjusts = TotalItensPageChangedAdjusts;
				$scope.pageChangedCancellations = PageChangedCancellations;
				$scope.totalItensPageChangedCancellations = TotalItensPageChangedCancellations;
				$scope.totalItensPageChangedSales = TotalItensPageChangedSales;
				$scope.sortResults = SortResults;

				GetExpectedAcquirers();
			}
		}

	    function Back(){
	        $location.path('/receipts');
	    }

	    function GetExpectedAcquirers() {

			var expectedAcquirersFilter = {
				groupBy: "ACQUIRER",
				bankAccountIds: $scope.bankAccount.id,
				status: $scope.filterStatus,
				startDate: $scope.date,
				endDate: $scope.date
			};

			MovementSummaryService.ListMovementSummaryByFilter(expectedAcquirersFilter).then(function (response) {

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

		function TotalItensPageChangedSales(acquirer_id) {
			this.salesCurrentPage = $scope.salesCurrentPage = 0;
			$scope.salesTotalItensPage = this.salesTotalItensPage;
			GetExpectedDetails(acquirer_id);
		};

	    function GetExpectedDetails(acquirer_id) {

			filter.page =  $scope.adjustsCurrentPage ==  0 ? $scope.adjustsCurrentPage : $scope.adjustsCurrentPage - 1;
			filter.size =  $scope.adjustsTotalItensPage;
			filter.status = $scope.filterStatus;
			filter.startDate = $scope.date;
			filter.endDate = $scope.date;
			filter.sort = $scope.sort;
			filter.bankAccountIds = $scope.bankAccount.id;
			filter.acquirer = acquirer_id;

			FinancialService.GetExpectedDetails(filter).then(function(response) {
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
			GetExpectedDetails(acquirer_id);
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
						status = "antecipado em: " + calendarFactory.getDaySlashMonth(date);
						break;
					default:
                        console.log("error");
				}
			}
			return status;
		}

	    function SortResults(elem, kind, acquirer_id) {
			$scope.sort = $rootScope.sortResults(elem,kind);
			GetExpectedDetails(acquirer_id);
	    }

	    /* pagination */
		function PageChangedSales() {
			$scope.salesCurrentPage = this.salesCurrentPage;
		};

		function TotalItensPageChangedSales(acquirer_id) {
			this.salesCurrentPage = $scope.salesCurrentPage = 0;
			$scope.salesTotalItensPage = this.salesTotalItensPage;
			GetExpectedDetails(acquirer_id);
		};

		function PageChangedAdjusts() {
			$scope.adjustsCurrentPage = this.adjustsCurrentPage;
			GetExpectedDetails(1);
		};

		function TotalItensPageChangedAdjusts() {
			this.adjustsCurrentPage = $scope.adjustsCurrentPage = 0;
			$scope.adjustsTotalItensPage = this.adjustsTotalItensPage;
			GetExpectedDetails(1);
		};

		function PageChangedCancellations() {
			$scope.cancellationsCurrentPage = this.cancellationsCurrentPage;
		};

		function TotalItensPageChangedCancellations() {
			this.cancellationsCurrentPage = $scope.cancellationsCurrentPage = 0;
			$scope.cancellationsTotalItensPage = this.cancellationsTotalItensPage;
		};

	});
