/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.receiptsForethoughtDetailsController',['ui.bootstrap'])

.controller('receiptsForethoughtDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
     advancedFilterService, $location, MovementService){

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

				$scope.forethought = [];

				$scope.day = calendarFactory.getDayOfDate($scope.startDate);
        		$scope.month = calendarFactory.getMonthNameOfDate($scope.startDate);


				$scope.maxSize = 4;
				$scope.itensPerPage = 10;
				$scope.currentPage = 0;
				$scope.currentSize = 10;
				$scope.totalItensPageOptions = [10,20,50];
				$scope.totalItensPage = $scope.totalItensPageOptions[0];

				$scope.back = Back;
				$scope.sortResults = SortResults;
				$scope.pageChanged = PageChanged;
				$scope.totalItensPageChanged = TotalItensPageChanged;

				GetForethought();
			}
		}

	    function Back(){
	        $location.path('/receipts');
	    }

	    function GetForethought () {
	    	$scope.forethought = [];

			objFilter = {
				shopIds: $scope.shopIds,
				acquirerIds: $scope.acquirer.id,
				startDate: calendarFactory.formatDateTimeForService($scope.startDate),
				endDate: calendarFactory.formatDateTimeForService($scope.endDate),
				bankAccountIds: $scope.bankAccount.id,
				status: "FORETHOUGHT",
				page:  $scope.currentPage ==  0 ? $scope.currentPage : $scope.currentPage - 1,
				size:  $scope.currentSize
			};

			objFilter.sort = $scope.sort;

			MovementService.GetForethoughts(objFilter).then(function(objResponse) {
	    		var objData = objResponse.data.content;
				var objPagination = objResponse.data.page;

	    		for (var intIndex in objData ) {
	    			$scope.forethought.push(objData[intIndex]);
	    		}

				$scope.totalItens = objPagination.totalElements;

	    	}).catch(function(objResponse) {

	    	})
	    }

	    /* pagination */

		function PageChanged() {
			$scope.currentSize = this.totalItensPage;
			$scope.currentPage = this.currentPage;
			GetForethought();
		}

		function TotalItensPageChanged() {
			this.currentPage = $scope.totalItensPage = 0;
			$scope.totalItensPage = this.currentPage;
			GetForethought();
		}

		function SortResults(objElem, strKind) {
			var strOrderString;
			strOrderString = $rootScope.sortResults(objElem, strKind);

			$scope.sort = strOrderString;
			GetForethought();
		}

	});
