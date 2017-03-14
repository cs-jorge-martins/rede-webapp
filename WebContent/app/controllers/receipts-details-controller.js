/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.receiptsDetailsController',['ui.bootstrap'])

.controller('receiptsDetailsController', function(menuFactory, $scope, calendarFactory, $rootScope,
     advancedFilterService, $location, FinancialService){

		var objFilter = {};
		Init();

        // removendo regra de jshint: este controller será refeito
        /* jshint -W071 */
		function Init(){
			$rootScope.hideHeaderAndFooter = true;
			$scope.$on("$routeChangeStart", function(){
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
				$scope.sort = "";


				$scope.day = calendarFactory.getDayOfDate($scope.startDate);
        		$scope.month = calendarFactory.getMonthNameOfDate($scope.startDate);

				$scope.tabs = [
					{
						title: 'vendas',
						active: true
					},
					{
						title: 'ajustes'
					},
					{
						title: 'cancelamentos'
					}
				];

				objFilter = {
					cardProductIds: $scope.cardProduct.cardProductId,
					acquirerIds: $scope.acquirer.id,
					shopIds: GetShopsFilter($scope.shopIds),
					startDate: calendarFactory.formatDateTimeForService($scope.startDate),
					endDate: calendarFactory.formatDateTimeForService($scope.endDate),
					bankAccountIds: $scope.bankAccount.id
				};

				if($scope.status === 'forethought'){
					objFilter.status = 'FORETHOUGHT';
				} else {
					objFilter.status = 'RECEIVED';
				}

				$scope.maxSize = 4;

				$scope.salesData = [];
				$scope.totalItensPageOptionsSales = [10,20,50];
				$scope.salesTotalItensPage = $scope.totalItensPageOptionsSales[0];
				$scope.salesTotalItens = 0;
				$scope.salesCurrentPage = 0;

        		$scope.adjustsData = [];
				$scope.totalItensPageOptionsAdjusts = [10,20,50];
        		$scope.adjustsTotalItensPage = $scope.totalItensPageOptionsAdjusts[0];
        		$scope.adjustsTotalItens = 0;
				$scope.adjustsCurrentPage = 0;

        		$scope.cancellationsData = [];
				$scope.totalItensPageOptionsCancellations = [10,20,50];
        		$scope.cancellationsTotalItensPage = $scope.totalItensPageOptionsCancellations[0];
        		$scope.cancellationsTotalItens = 0;
				$scope.cancellationsCurrentPage = 0;

        		$scope.ecommerceData = [];
        		$scope.ecommerceTotalItensPage = 10;
        		$scope.ecommerceTotalItens = 0;
				$scope.ecommerceCurrentPage = 0;

				$scope.back = Back;
				$scope.getShopsLabel = GetShopsLabel;
				$scope.changeTab = ChangeTab;
                $scope.sortResults = SortResults;
                $scope.pageChangedSales = PageChangedSales;
                $scope.totalItensPageChangedSales = TotalItensPageChangedSales;
                $scope.pageChangedAdjusts = PageChangedAdjusts;
                $scope.totalItensPageChangedAdjusts = TotalItensPageChangedAdjusts;
                $scope.pageChangedCancellations = PageChangedCancellations;
                $scope.totalItensPageChangedCancellations = TotalItensPageChangedCancellations;
			}
		}

		function GetShopsFilter(arrModel) {
			return arrModel.map(function(objItem){
				return objItem.id;
			}).join(",");
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

	    function Back(){
	        $location.path('/receipts');
	    }

	    function GetSales() {

			objFilter.type = 'CREDIT';
			objFilter.page =  $scope.salesCurrentPage ===  0 ? $scope.salesCurrentPage : $scope.salesCurrentPage - 1;
			objFilter.size =  $scope.salesTotalItensPage;
			objFilter.sort = $scope.sort;

			FinancialService.GetReceipt(objFilter).then(function(objResponse) {
				var arrData = objResponse.data.content;
				var objPagination = objResponse.data.page;

				$scope.salesData = arrData;
				$scope.salesTotalItens = objPagination.totalElements;

			}).catch(function() {
				$scope.salesData = [];
				console.log('[receiptsDetailsController:getSales] error');
			});
	    }

	    function GetAdjusts(bolCache, strOrder) {
			objFilter.type = 'ADJUST';
			objFilter.page =  $scope.adjustsCurrentPage ===  0 ? $scope.adjustsCurrentPage : $scope.adjustsCurrentPage - 1;
			objFilter.size =  $scope.adjustsTotalItensPage;
			objFilter.sort = $scope.sort;

			if(strOrder) {
				objFilter.sort = strOrder;
			}

			FinancialService.GetReceipt(objFilter).then(function(objResponse) {
				var arrData = objResponse.data.content;
				var objPagination = objResponse.data.page;

				$scope.adjustsData = arrData;
				$scope.adjustsTotalItens = objPagination.totalElements;
			}).catch(function() {
				$scope.adjustsData = [];
				console.log('[receiptsDetailsController:getAdjusts] error');
			});
	    }

	    function GetCancellations(bolCache, strOrder) {
	    	objFilter.type = 'CANCELLATION';
	    	objFilter.page =  $scope.cancellationsCurrentPage ===  0 ? $scope.cancellationsCurrentPage : $scope.cancellationsCurrentPage - 1;
			objFilter.size =  $scope.cancellationsTotalItensPage;
			objFilter.sort = $scope.sort;

			if (strOrder) {
				objFilter.sort =  strOrder;
			}

			FinancialService.GetReceipt(objFilter).then(function(objResponse) {
				var arrData = objResponse.data.content;
				var objPagination = objResponse.data.page;

				$scope.cancellationsData = arrData;
				$scope.cancellationsTotalItens = objPagination.totalElements;
			}).catch(function() {
				$scope.cancellationsData = [];
				console.log('[receiptsDetailsController:getAdjusts] error');
			});
	    }

	    function GetEcommerce() {
	    }

	    function ChangeTab(intIndex) {
	    	$scope.tabs[intIndex].active = true;
			$scope.sort = "";

	    	if(intIndex === 0) {
	    		GetSales();
	    	} else if(intIndex === 1) {
	    		GetAdjusts();
	    	} else if(intIndex === 2) {
	    		GetCancellations();
	    	} else if(intIndex === 0) {
	    		GetEcommerce();
	    	}
	    }

	    function SortResults(objElem, strKind, strIipoRelatorio) {
			$scope.sort = $rootScope.sortResults(objElem, strKind);
            if(strIipoRelatorio === "sales") {
              GetSales(false);
		  } else if(strIipoRelatorio === "adjusts") {
              GetAdjusts();
		  } else if(strIipoRelatorio === "cancellation") {
              GetCancellations();
            }
	    }

		function PageChangedSales() {
			$scope.salesCurrentPage = this.salesCurrentPage;
			GetSales();
		}

		function TotalItensPageChangedSales() {
			this.salesCurrentPage = $scope.salesCurrentPage = 0;
			$scope.salesTotalItensPage = this.salesTotalItensPage;
			GetSales();
		}

		function PageChangedAdjusts() {
			$scope.adjustsCurrentPage = this.adjustsCurrentPage;
			GetAdjusts();
		}

        function TotalItensPageChangedAdjusts() {
			this.adjustsCurrentPage = $scope.adjustsCurrentPage = 0;
			$scope.adjustsTotalItensPage = this.adjustsTotalItensPage;
			GetAdjusts();
		}

		function PageChangedCancellations() {
			$scope.cancellationsCurrentPage = this.cancellationsCurrentPage;
			GetCancellations();
		}

        function TotalItensPageChangedCancellations() {
			this.cancellationsCurrentPage = $scope.cancellationsCurrentPage = 0;
			$scope.cancellationsTotalItensPage = this.cancellationsTotalItensPage;
			GetCancellations();
		}
	});
