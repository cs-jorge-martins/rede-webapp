/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

(function() {
	'use strict';

	angular
	.module('KaplenWeb.relatorioFinanceiroController', ['ui.bootstrap'])
	.config(['$routeProvider','RestangularProvider' , function ($routeProvider, RestangularProvider) {
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


		//*************************************************************
		function GetReport() {

			var shopIds = [];
			var cardProductIds = [];

			if($scope.settlementsSelected) {
				for(var item in $scope.settlementsSelected) {
					shopIds.push($scope.settlementsSelected[item].id);
				}
			}

			if($scope.productsSelected) {
				for(var item in $scope.productsSelected) {
					cardProductIds.push($scope.productsSelected[item].id);
				}
			}

			var filter;
			if($scope.status[0] === 'EXPECTED'){
				filter =  {
						creditedShopIds: shopIds,
						sourceShopIds: shopIds,
						cardProductIds: cardProductIds,
						expectedStartDate: HandleDate($scope.initialDate),
						expectedEndDate: HandleDate($scope.finalDate),
						status: $scope.status,
                        groupBy: 'BANK_ACCOUNT,EXPECTED_DATE,ACQUIRER',
						currency: 'BRL',
						page: $scope.currentPage,
						size: $scope.totalItensPage
				}

			}else{
				filter = {
						creditedShopIds: shopIds,
						sourceShopIds: shopIds,
						cardProductIds: cardProductIds,
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

			MovementSummaryService.ListMovementSummaryByFilter(HandleFilter(filter)).then(function(response) {
				var data = HandleResponse(response.data.content);
                var pagination = response.data.page;

				$scope.items = data;
				$scope.noItensMsg = data.length ? false : true;
				$scope.totalItens = pagination.totalElements;
			}).catch(function(response) {

			});
		}

		function GetExpectedAmount(){
			var filter = {
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

			MovementSummaryService.ListMovementSummaryByFilter(HandleFilter(filter)).then(function(response) {

				response = HandleResponse(response.data);

				if(response.length > 0) {

					if(response[1][0].expectedAmount !== undefined) {
                        $scope.futureReleases = response[1][0].expectedAmount;
					}
					else {
						$scope.futureReleases = 0;
					}
				}
				else {
					$scope.futureReleases = 0;
				}
			}).catch(function(response) {

			});
		}

		function GetPayedAmount(){
			var filter = {
					shopIds: $scope.settlementsSelected,
					acquirers: $scope.acquirersSelected,
					cardProductIds: $scope.productsSelected,
					installments: $scope.installmentsSelected,
					startDate: HandleDate($scope.initialDate),
					endDate: HandleDate($scope.finalDate),
					status: ['FORETHOUGHT','RECEIVED'],
					currency: 'BRL'
			}

			MovementSummaryService.ListMovementSummaryByFilter(HandleFilter(filter)).then(function(response) {
				response = HandleResponse(response.data);

				if(response.length > 0) {
					if(response[1][0].payedAmount !== undefined) {
                        $scope.payedValues = response[1][0].payedAmount;
					}
					else {
						$scope.payedValues = 0;
					}
				}
				else {
					$scope.payedValues = 0;
				}
			}).catch(function(response) {
			});
		}

		function UpdateIndicator(status){
			$scope.status = [status];
			LoadPage();
		}

		function ClearFilter() {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.status = ['RECEIVED'];
			$scope.settlementsSelected = [];
			$scope.acquirersSelected = [];
			$scope.productsSelected = [];
			$scope.installmentsSelected = [];
		}

		function HandleResponse(response) {
			var items = [];

			for(var item in response){
				if(typeof response[item] === 'object') {
					items.push(response[item]);
				}
				else {
					break;
				}
			}
			return items;
		}

		function HandleDate(date) {
			return calendarFactory.formatDateTimeForService(date);
		}

		function HandleFilter(filter) {
			if(filter.creditedShopIds) {
				if(filter.creditedShopIds.length === 0) {
					delete filter.creditedShopIds;
				}
			}

			if(filter.sourceShopIds) {
				if(filter.sourceShopIds.length === 0) {
					delete filter.sourceShopIds;
				}
			}

			if(filter.acquirers) {
				if(filter.acquirers.length === 0) {
					delete filter.acquirers;
				}
			}

			if(filter.cardProductIds) {
				if(filter.cardProductIds.length === 0) {
					delete filter.cardProductIds;
				}
			}

			if(filter.installments) {
				if(filter.installments.length === 0) {
					delete filter.installments;
				}
			}

			if(!filter.expectedStartDate) {
				delete filter.expectedStartDate;
			}

			if(!filter.expectedEndDate) {
				delete filter.expectedEndDate;
			}

			if(!filter.payedStartDate) {
				delete filter.payedStartDate;
			}

			if(!filter.payedEndDate) {
				delete filter.payedEndDate;
			}

			return filter;
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
