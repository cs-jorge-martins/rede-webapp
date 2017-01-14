/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.receiptsExpectedDetailsController',['ui.bootstrap'])

.controller('receiptsExpectedDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
     advancedFilterService, $location, FinancialService, MovementSummaryService){

		var objFilter = {};

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

				$scope.totalItensPage = "10";
				$scope.totalItens = 0;

				$scope.accountsLabel = $rootScope.receiptsDetails.accountsLabel;

				$scope.back = Back;
				$scope.changeTab = ChangeTab;
				$scope.tabs = [];
				$scope.translateStatus = TranslateStatus;

				$scope.currentPage = 0;
				$scope.pageChanged = PageChanged;
				$scope.totalItensPageChanged = TotalItensPageChanged;

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

	    function GetExpectedDetails(intAcquirerId) {

			objFilter.page =  $scope.currentPage ==  0 ? $scope.currentPage : $scope.currentPage - 1;
			objFilter.size =  $scope.totalItensPage;
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
				$scope.totalItens = objPagination.totalElements;

			}).catch(function(objResponse) {
				$scope.detailsData = [];
				console.log('[receiptsDetailsController:getSales] error');
			});

	    }

	    function ChangeTab(intIndex, intAcquirerId) {
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
					 	strStatus = "pagamento pendente";
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
		function PageChanged() {
			$scope.currentPage = this.currentPage;
			GetExpectedDetails(1);
		};

		function TotalItensPageChanged() {
			this.currentPage = $scope.currentPage = 0;
			$scope.totalItensPage = this.totalItensPage;
			GetExpectedDetails(1);
		};


	});
