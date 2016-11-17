/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('Conciliador.receiptsFutureDetailsController', ['ui.bootstrap'])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/receipts/future_details', {templateUrl: 'app/views/receipts-future-details.html', controller: 'receiptsFutureDetailsController'});
}])

.controller('receiptsFutureDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
     advancedFilterService, $location,FinancialService){

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
				$scope.acquirer = $rootScope.receiptsDetails.acquirer;
				$scope.cardProduct = $rootScope.receiptsDetails.cardProduct;
				$scope.currency = $rootScope.receiptsDetails.currency;

				$scope.startDate = $rootScope.receiptsDetails.periodStartDate;
				$scope.endDate = $rootScope.receiptsDetails.periodEndDate;
				$scope.dateTitle = DateTitle;
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

				$scope.back = Back;
				$scope.getShopsLabel = GetShopsLabel;
				$scope.sortResults = SortResults;
				$scope.pageChanged = PageChanged;
				$scope.totalItensPageChanged = TotalItensPageChanged;

				GetFutureDetails();
			}
		}

		function GetShopsFilter(arrModel) {
			return arrModel.map(function(objItem){
				return objItem.id;
			}).join(",");
		}

		function DateTitle() {
			var string = "";

			if($scope.startDate && $scope.endDate) {
				string = calendarFactory.getDayAndMonthFromDate($scope.startDate);
				string += " a ";
				string += calendarFactory.getDayAndMonthFromDate($scope.endDate);
			}

			return string;
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
	        $rootScope.futureSelected = true;
	    }

	    function GetFutureDetails() {

			var objFilter = {
				startDate: calendarFactory.formatDateTimeForService($scope.startDate),
				endDate: calendarFactory.formatDateTimeForService($scope.endDate),
				bankAccountIds: $scope.bankAccount.id,
				shopIds: GetShopsFilter($scope.shopIds),
				acquirerIds: $scope.acquirer.id,
				cardProductIds: $scope.cardProduct.cardProductId,
				page:  $scope.currentPage ==  0 ? $scope.currentPage : $scope.currentPage - 1,
				size:  $scope.currentSize,
				sort: $scope.sort,
				status: 'EXPECTED'
			};

			FinancialService.GetFutureDetails(objFilter).then(function (objResponse) {

				var objData = objResponse.data.content;
				var objPagination = objResponse.data.page;

				$scope.detailsData = objData;
				$scope.totalItens = objPagination.totalElements;

			}).catch(function (objResponse) {
			
			});

	    }

		function SortResults(objElem, strKind) {
			$scope.sort = $rootScope.sortResults(objElem, strKind);
			GetFutureDetails();
		}

	    /* pagination */
		function PageChanged() {
			$scope.currentSize = this.totalItensPage;
			$scope.currentPage = this.currentPage;
			GetFutureDetails();
		};

		function TotalItensPageChanged() {
			this.currentPage = $scope.totalItensPage = 0;
			$scope.totalItensPage = this.currentPage;
			GetFutureDetails();
		};

	});
