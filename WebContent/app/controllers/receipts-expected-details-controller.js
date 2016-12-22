/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.receiptsExpectedDetailsController',['ui.bootstrap'])

.controller('receiptsExpectedDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
     advancedFilterService, $location, FinancialService, MovementSummaryService){

		var objFilter = {};
		$scope.totalItensPage = 10;

		Init();

		function Init(){
			$rootScope.hideHeaderAndFooter = true;
			$scope.$on("$routeChangeStart", function(next, current){
				$rootScope.hideHeaderAndFooter = false;
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
				$scope.totalItensPageOptions = [10,20,50];

				$scope.detailsData = [];
				$scope.salesTotalItensPage = 10;
				$scope.salesTotalItens = 0;
				$scope.salesCurrentPage = 0;

				$scope.adjustsTotalItensPage = $scope.totalItensPageOptions[0];
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

			var objExpectedAcquirersFilter = {
				groupBy: "ACQUIRER",
				bankAccountIds: $scope.bankAccount.id,
				status: $scope.filterStatus,
				startDate: $scope.date,
				endDate: $scope.date
			};

			MovementSummaryService.ListMovementSummaryByFilter(objExpectedAcquirersFilter).then(function (objResponse) {

				var objData;
				var arrContent = objResponse.data.content;
				for (var intIndex = 0; intIndex < arrContent.length; intIndex++) {
					objData = {
						id: arrContent[intIndex].acquirer.id,
						title: arrContent[intIndex].acquirer.name
					};
					$scope.tabs.push(objData);
				}

			}).catch(function (objResponse) {
			});
		}

		function TotalItensPageChangedSales(intAcquirerId) {
			this.salesCurrentPage = $scope.salesCurrentPage = 0;
			$scope.salesTotalItensPage = this.salesTotalItensPage;
			GetExpectedDetails(intAcquirerId);
		};

	    function GetExpectedDetails(intAcquirerId) {

			objFilter.page =  $scope.adjustsCurrentPage ==  0 ? $scope.adjustsCurrentPage : $scope.adjustsCurrentPage - 1;
			objFilter.size =  $scope.adjustsTotalItensPage;
			objFilter.status = $scope.filterStatus;
			objFilter.startDate = $scope.date;
			objFilter.endDate = $scope.date;
			objFilter.sort = $scope.sort;
			objFilter.bankAccountIds = $scope.bankAccount.id;
			objFilter.acquirer = intAcquirerId;

			FinancialService.GetExpectedDetails(objFilter).then(function(objResponse) {
				var objData = objResponse.data.content;
				var objPagination = objResponse.data.page;

				$scope.detailsData = objData;
				$scope.adjustsTotalItens = objPagination.totalElements;

			}).catch(function(objResponse) {
				$scope.detailsData = [];
				console.log('[receiptsDetailsController:getSales] error');
			});

	    }

	    function changeTab(intIndex, intAcquirerId) {
	    	$scope.tabs[intIndex].active = true;
			$scope.sort = "";
			GetExpectedDetails(intAcquirerId);
	    }

	    function TranslateStatus(strStatus, objDate) {
			if(strStatus) {
				strStatus = strStatus.toLowerCase();
				switch (strStatus) {
					case "expected":
					case "pending":
					 	strStatus = "pendente";
						break;
					case "suspended":
						strStatus = "suspenso";
						break;
					case "pawned":
						strStatus = "penhorado";
						break;
					case "blocked":
						strStatus = "bloqueado";
						break;
					case "pawned_blocked":
						strStatus = "penhorado/bloqueado";
						break;
					case "forethought":
						strStatus = "antecipado em: " + calendarFactory.getDaySlashMonth(objDate);
						break;
					default:
                        console.log("error");
				}
			}
			return strStatus;
		}

	    function SortResults(objElem, strKind, intAcquirerId) {
			$scope.sort = $rootScope.sortResults(objElem, strKind);
			GetExpectedDetails(intAcquirerId);
	    }

	    /* pagination */
		function PageChangedSales() {
			$scope.salesCurrentPage = this.salesCurrentPage;
		};

		function TotalItensPageChangedSales(intAcquirerId) {
			this.salesCurrentPage = $scope.salesCurrentPage = 0;
			$scope.salesTotalItensPage = this.salesTotalItensPage;
			GetExpectedDetails(intAcquirerId);
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
