/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.receiptsOtherDetailsController', [])

.controller('receiptsOtherDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
     advancedFilterService, $location, AdjustService){

		var objFilter = {};
		Init();

		function Init(){
			$rootScope.hideHeaderAndFooter = true;
			$scope.$on("$routeChangeStart", function(next, current){
				$rootScope.hideHeaderAndFooter = false;
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

				objFilter = {
					adjustTypes: "OTHER",
					acquirerIds: $scope.acquirer.id,
					startDate: calendarFactory.formatDateTimeForService($scope.startDate),
					endDate: calendarFactory.formatDateTimeForService($scope.endDate),
					bankAccountIds: $scope.bankAccount.id,
					status: "RECEIVED",
				};

				$scope.maxSize = 10;

				$scope.otherDetailsData = [];
				$scope.totalItensPageOptions = [10,20,50];
				$scope.totalItensPage = $scope.totalItensPageOptions[0];
				$scope.totalItens = 0;
				$scope.salesCurrentPage = 0;

				$scope.back = Back;
				$scope.getShopsLabel = GetShopsLabel;
				$scope.getOtherDetails = GetOtherDetails;
				$scope.totalOfSumAmount = TotalOfSumAmount;
				$scope.sortResults = SortResults;
				$scope.pageChangedSales = PageChangedSales;
				$scope.totalItensPageChangedSales = TotalItensPageChangedSales;
				$scope.pageChangedAdjusts = PageChangedAdjusts;

				GetOtherDetails();
			}
		}

		function GetShopsLabel() {
			var strShops = "";

			if($scope.shops.length > 1) {
				strShops = $scope.shops[0].label + ' +' + ($scope.shops.length - 1) + ' estabelecimento'

				if($scope.shops.length > 2) {
					strShops += 's'
				}
			}

			return strShops;
		}

	    function Back(){
	        $location.path('/receipts');
	    }

	    function GetOtherDetails() {
	    	$scope.otherDetailsData = [];
			objFilter.sort = $scope.sort;
			AdjustService.GetOtherDetails(objFilter).then(function(objResponse) {
				var objData = objResponse.data.content;

				for (var intIndex in objData) {
					$scope.otherDetailsData.push(objData[intIndex]);
				}
			}).catch(function(objResponse) {
			});
	    }

	    function TotalOfSumAmount() {
	    	return $scope.otherDetailsData.reduce(function(prev, curr) {
		    	return prev + curr.amount;
		    }, 0);
	    }

	    function SortResults(objElem, strKind) {
			var strOrderString;
			strOrderString = $rootScope.sortResults(objElem,strKind);
			$scope.sort = strOrderString;

			GetOtherDetails();
	    }

	    /* pagination */
		function PageChangedSales() {
			$scope.salesCurrentPage = this.salesCurrentPage;
			GetOtherDetails();
		};

		function TotalItensPageChangedSales() {
			this.salesCurrentPage = $scope.salesCurrentPage = 0;
			$scope.salesTotalItensPage = this.salesTotalItensPage;
			GetOtherDetails();
		};

		function PageChangedAdjusts() {
			$scope.adjustsCurrentPage = this.adjustsCurrentPage;
			GetOtherDetails();
		};
	});
