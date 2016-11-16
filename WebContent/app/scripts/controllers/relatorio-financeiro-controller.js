/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

(function() {
	'use strict';

	angular
	.module('KaplenWeb.relatorioFinanceiroController', ['ui.bootstrap'])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/relatorio/financeiro', {
			templateUrl: 'app/views/relatorios/financeiro/index.html',
			controller: 'relatorioFinanceiroController'
		})
	}])
	.controller('relatorioFinanceiroController', RelatorioFinanceiro);

	RelatorioFinanceiro.$inject = ['menuFactory', '$scope', '$modal', 'calendarFactory', '$rootScope',
	                               '$window', 'advancedFilterService', 'calendarService', 'MovementSummaryService'];

	function RelatorioFinanceiro(menuFactory, $scope, $modal, calendarFactory, $rootScope,
			$window, advancedFilterService, calendarService, MovementSummaryService) {
		//Extensao do serviço para filtro avançado
		angular.extend($scope, advancedFilterService);
		$scope.LoadParamsByFilter();

		//Extensao do serviço para calendario
		angular.extend($scope, calendarService);
		$scope.ResetCalendarService();

		menuFactory.setActiveReportsFinancial();

		$scope.updateIndicator = UpdateIndicator;
		$scope.clearFilter = ClearFilter;
		$scope.getReport = GetReport;
		$scope.loadPage = LoadPage;
		$scope.pageChanged = PageChanged;
		$scope.totalItensPageChanged = TotalItensPageChanged;

		$scope.maxSize = 4;

		$scope.totalItensPage = 10;
		$scope.currentPage = 0;
		$scope.totalItens = 0;

		$scope.noItensMsg = false;
		$scope.items = [];

		$scope.futureReleases = 0;
		$scope.payedValues = 0;

		Init();

		function Init() {
			ClearFilter();
			LoadPage();
		}

		function GetReport() {

			var arrShopIds = [];
			var arrCardProductIds = [];

			if($scope.settlementsSelected) {
				for(var objItem in $scope.settlementsSelected) {
					arrShopIds.push($scope.settlementsSelected[objItem].id);
				}
			}

			if($scope.productsSelected) {
				for(var objItem in $scope.productsSelected) {
					arrCardProductIds.push($scope.productsSelected[objItem].id);
				}
			}

			var objFilter;
			if($scope.status[0] === 'EXPECTED'){
				objFilter =  {
					creditedShopIds: arrShopIds,
					sourceShopIds: arrShopIds,
					cardProductIds: arrCardProductIds,
					expectedStartDate: HandleDate($scope.initialDate),
					expectedEndDate: HandleDate($scope.finalDate),
					status: $scope.status,
                    groupBy: 'BANK_ACCOUNT,EXPECTED_DATE,ACQUIRER',
					currency: 'BRL',
					page: $scope.currentPage,
					size: $scope.totalItensPage
				}
			}else{
				objFilter = {
					creditedShopIds: arrShopIds,
					sourceShopIds: arrShopIds,
					cardProductIds: arrCardProductIds,
					startDate: HandleDate($scope.initialDate),
					endDate: HandleDate($scope.finalDate),
					status: $scope.status,
                    groupBy: 'BANK_ACCOUNT,PAYED_DATE,ACQUIRER',
					currency: 'BRL',
					page: $scope.currentPage,
					size: $scope.totalItensPage
				}
			}

			if($scope.currentPage > 0 ) {
				$scope.currentPage = $scope.currentPage + 1;
			}

			MovementSummaryService.ListMovementSummaryByFilter(HandleFilter(objFilter)).then(function(objResponse) {
				var objData = HandleResponse(objResponse.data.content);
                var objPagination = objResponse.data.page;

				$scope.items = objData;
				$scope.noItensMsg = objData.length ? false : true;
				$scope.totalItens = objPagination.totalElements;
			}).catch(function(objResponse) {

			});
		}

		function GetExpectedAmount(){
			var objFilter = {
					creditedShopIds: $scope.settlementsSelected,
					sourceShopIds: $scope.settlementsSelected,
					acquirers: $scope.acquirersSelected,
					cardProductIds: $scope.productsSelected,
					installments: $scope.installmentsSelected,
					startDate: HandleDate($scope.initialDate),
					endDate: HandleDate($scope.finalDate),
					status: ['EXPECTED'],
					currency: 'BRL'
			}

			MovementSummaryService.ListMovementSummaryByFilter(HandleFilter(objFilter)).then(function(objResponse) {

				objResponse = HandleResponse(objResponse.data);

				if(objResponse.length > 0) {

					if(objResponse[1][0].expectedAmount !== undefined) {
                        $scope.futureReleases = objResponse[1][0].expectedAmount;
					}
					else {
						$scope.futureReleases = 0;
					}
				}
				else {
					$scope.futureReleases = 0;
				}
			}).catch(function(objResponse) {

			});
		}

		function GetPayedAmount(){
			var objFilter = {
					shopIds: $scope.settlementsSelected,
					acquirers: $scope.acquirersSelected,
					cardProductIds: $scope.productsSelected,
					installments: $scope.installmentsSelected,
					startDate: HandleDate($scope.initialDate),
					endDate: HandleDate($scope.finalDate),
					status: ['FORETHOUGHT','RECEIVED'],
					currency: 'BRL'
			}

			MovementSummaryService.ListMovementSummaryByFilter(HandleFilter(objFilter)).then(function(objResponse) {
				objResponse = HandleResponse(objResponse.data);

				if(objResponse.length > 0) {
					if(objResponse[1][0].payedAmount !== undefined) {
                        $scope.payedValues = objResponse[1][0].payedAmount;
					}
					else {
						$scope.payedValues = 0;
					}
				}
				else {
					$scope.payedValues = 0;
				}
			}).catch(function(objResponse) {
			});
		}

		function UpdateIndicator(status){
			$scope.status = [status];
			LoadPage();
		}

		function ClearFilter() {
			var dateInitialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.initialDate = calendarFactory.getFirstDayOfSpecificMonth(dateInitialDate.month(), dateInitialDate.year());
			$scope.finalDate = calendarFactory.getLastDayOfSpecificMonth(dateInitialDate.month(), dateInitialDate.year());
			$scope.status = ['RECEIVED'];
			$scope.settlementsSelected = [];
			$scope.acquirersSelected = [];
			$scope.productsSelected = [];
			$scope.installmentsSelected = [];
		}

		function HandleResponse(objResponse) {
			var arrItems = [];

			for(var objItem in objResponse){
				if(typeof objResponse[objItem] === 'object') {
					arrItems.push(objResponse[objItem]);
				}
				else {
					break;
				}
			}
			return arrItems;
		}

		function HandleDate(date) {
			return calendarFactory.formatDateTimeForService(date);
		}

		function HandleFilter(objFilter) {
			if(objFilter.creditedShopIds) {
				if(objFilter.creditedShopIds.length === 0) {
					delete objFilter.creditedShopIds;
				}
			}

			if(objFilter.sourceShopIds) {
				if(objFilter.sourceShopIds.length === 0) {
					delete objFilter.sourceShopIds;
				}
			}

			if(objFilter.acquirers) {
				if(objFilter.acquirers.length === 0) {
					delete objFilter.acquirers;
				}
			}

			if(objFilter.cardProductIds) {
				if(objFilter.cardProductIds.length === 0) {
					delete objFilter.cardProductIds;
				}
			}

			if(objFilter.installments) {
				if(objFilter.installments.length === 0) {
					delete objFilter.installments;
				}
			}

			if(!objFilter.expectedStartDate) {
				delete objFilter.expectedStartDate;
			}

			if(!objFilter.expectedEndDate) {
				delete objFilter.expectedEndDate;
			}

			if(!objFilter.payedStartDate) {
				delete objFilter.payedStartDate;
			}

			if(!objFilter.payedEndDate) {
				delete objFilter.payedEndDate;
			}

			return objFilter;
		}

		function PageChanged() {
			$scope.currentPage = this.currentPage - 1;
			LoadPage();
		};

		function TotalItensPageChanged() {
			this.currentPage = $scope.currentPage = 0;
			$scope.totalItensPage = this.totalItensPage;
			LoadPage();
		};

		function LoadPage() {
			GetExpectedAmount();
			GetPayedAmount();
			GetReport();
		}
	}
})();
