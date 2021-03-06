/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.receiptsFutureDetailsController', ['ui.bootstrap'])

.controller('receiptsFutureDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
     advancedFilterService, $location,FinancialService){

		Init();

        // removendo regra de jshint: este controller será refeito
        /* jshint -W071 */
		function Init() {
			$rootScope.hideHeaderAndFooter = true;
			$scope.$on("$routeChangeStart", function(){
				$rootScope.hideHeaderAndFooter = false;
			});

			if(!$rootScope.receiptsDetails) {
				$location.path('/receipts');
			} else {

                $rootScope.futureSelected = true;

				$scope.acquirer = $rootScope.receiptsDetails.acquirer;
				$scope.cardProduct = $rootScope.receiptsDetails.cardProduct;
				$scope.currency = $rootScope.receiptsDetails.currency;

				$scope.dates = $rootScope.futureReleases.dates;
				$scope.startDate = $rootScope.receiptsDetails.startDate;
 				$scope.endDate = $rootScope.receiptsDetails.endDate;
				$scope.dateTitle = DateTitle;
				$scope.shopIds = $rootScope.receiptsDetails.shopIds;
				$scope.shops = $rootScope.receiptsDetails.shops;
				$scope.products = $rootScope.receiptsDetails.products;
				$scope.bankAccount = $rootScope.receiptsDetails.bankAccount;

				$scope.expectedAmount = $rootScope.receiptsDetails.expectedAmount;
				$scope.payedAmount = $rootScope.receiptsDetails.payedAmount;
				$scope.total = $rootScope.receiptsDetails.total;
				$scope.status = $rootScope.receiptsDetails.status;

				$scope.accountsLabel = $rootScope.receiptsDetails.futureAccountsLabel;
				$scope.shopsLabel = $rootScope.receiptsDetails.futureShopsLabel;
				$scope.shopsFullLabel = $rootScope.receiptsDetails.shopsFullLabel;
				$scope.cardProductsLabel = $rootScope.receiptsDetails.cardProductsLabel;
				$scope.cardProductsFullLabel = $rootScope.receiptsDetails.cardProductsFullLabel;

				$scope.otherReleasesTotal = $rootScope.receiptsDetails.otherReleasesTotal;

				$scope.sort = "";

				$scope.day = calendarFactory.getDayOfDate($scope.startDate);
        		$scope.month = calendarFactory.getMonthNameOfDate($scope.startDate);


				$scope.maxSize = 4;
				$scope.totalItensPageOptions = [10,20,50];
				$scope.itensPerPage = 10;
				$scope.currentPage = 0;
				$scope.currentSize = 10;

				$scope.otherDetailsData = [];
				$scope.totalItensPage = $scope.totalItensPageOptions[0];
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
			var strDate = "";

			if($scope.startDate && $scope.endDate) {
				strDate = calendarFactory.getDayAndMonthFromDate($scope.startDate);
				strDate += " a ";
				strDate += calendarFactory.getDayAndMonthFromDate($scope.endDate);
			}

			return strDate;
		}

		function GetShopsLabel() {
			var strShops = "";

			if($scope.shops.length > 1) {
				strShops = $scope.shops[0].label + ' +' + ($scope.shops.length - 1) + ' estabelecimento';

				if($scope.shops.length > 2) {
					strShops += 's';
				}
			}

			return strShops;
		}

	    function Back() {
	    	$rootScope.futureSelected = true;
	        $location.path('/receipts');
	    }

	    function GetFutureDetails() {

			var objFilter = {
				startDate: calendarFactory.formatDateTimeForService($scope.startDate),
				endDate: calendarFactory.formatDateTimeForService($scope.endDate),
				bankAccountIds: $scope.bankAccount.id,
				shopIds: GetShopsFilter($scope.shopIds),
				acquirerIds: $scope.acquirer.id,
				cardProductIds: $scope.cardProduct.cardProductId,
				page:  $scope.currentPage ===  0 ? $scope.currentPage : $scope.currentPage - 1,
				size:  $scope.currentSize,
				sort: $scope.sort,
				status: 'EXPECTED'
			};

			FinancialService.GetFutureDetails(objFilter).then(function (objResponse) {

				var objData = objResponse.data.content;
				var objPagination = objResponse.data.page;

				$scope.detailsData = objData;
				$scope.totalItens = objPagination.totalElements;

			}).catch(function () {

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
		}

		function TotalItensPageChanged() {
			this.currentPage = $scope.totalItensPage = 0;
			$scope.totalItensPage = this.currentPage;
			GetFutureDetails();
		}

	});
