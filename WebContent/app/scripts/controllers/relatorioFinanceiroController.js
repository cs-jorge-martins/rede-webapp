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
	                               'relatorioService', 'installmentsService', '$window', 'advancedFilterService', 'calendarService', 'MovementSummaryService'];

	function RelatorioFinanceiro(menuFactory, $scope, $modal, calendarFactory, $rootScope,
			relatorioService, installmentsService, $window, advancedFilterService, calendarService, MovementSummaryService) {
		//Extensao do serviço para filtro avançado
		angular.extend($scope, advancedFilterService);
		$scope.loadParansByFilter();

		//Extensao do serviço para calendario
		angular.extend($scope, calendarService);
		$scope.resetCalendarService();

		menuFactory.setActiveReportsFinancial();

		$scope.updateIndicator = updateIndicator;
		$scope.clearFilter = clearFilter;
		$scope.getReport = getReport;
		$scope.loadPage = loadPage;
		$scope.exportReport = exportReport;
		$scope.pageChanged = pageChanged;
		$scope.totalItensPageChanged = totalItensPageChanged;

		$scope.maxSize = 4;

		$scope.totalItensPage = 10;
		$scope.currentPage = 0;
		$scope.totalItens = 0;

		$scope.noItensMsg = false;
		$scope.items = [];

		$scope.futureReleases = 0;
		$scope.payedValues = 0;

		init();

		function init() {
			clearFilter();
			loadPage();
		}


		//*************************************************************
		function getReport() {

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
						expectedStartDate: handleDate($scope.initialDate),
						expectedEndDate: handleDate($scope.finalDate),
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
						startDate: handleDate($scope.initialDate),
						endDate: handleDate($scope.finalDate),
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

			MovementSummaryService.listMovementSummaryByFilter(handleFilter(filter)).then(function(response) {
				var data = handleResponse(response.data.content);
                var pagination = response.data.page;

				$scope.items = data;
				$scope.noItensMsg = data.length ? false : true;
				$scope.totalItens = pagination.totalElements;
			}).catch(function(response) {

			});
		}

		function exportReport() {
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
						expectedStartDate: handleDate($scope.initialDate),
						expectedEndDate: handleDate($scope.finalDate),
						status: $scope.status,
						groupBy: ['BANK_ACCOUNT', 'EXPECTED_DATE'],
						currency: 'BRL',
						page: $scope.currentPage,
						size: $scope.totalItensPage
				}

			}else{
				filter = {
						creditedShopIds: shopIds,
						sourceShopIds: shopIds,
						cardProductIds: cardProductIds,
						payedStartDate: handleDate($scope.initialDate),
						payedEndDate: handleDate($scope.finalDate),
						status: $scope.status,
						groupBy: ['BANK_ACCOUNT', 'PAYED_DATE'],
						currency: 'BRL',
						page: $scope.currentPage,
						size: $scope.totalItensPage
				}
			}


			MovementSummaryService.exportReport(handleFilter(filter), {"Accept" : "application/vnd.ms-excel"}).then(function(response) {
				var data = handleResponse(response.data.content);
                var pagination = response.data.page;

				$scope.items = data;
				$scope.noItensMsg = data.length ? false : true;
				$scope.totalItens = pagination.totalElements;
			}).catch(function(response) {
				console.log(response);
			})
		}


		/********************************************************************************************/
		function getExpectedAmount(){
			var filter = {
					creditedShopIds: $scope.settlementsSelected,
					sourceShopIds: $scope.settlementsSelected,
					acquirers: $scope.acquirersSelected,
					cardProductIds: $scope.productsSelected,
					installments: $scope.installmentsSelected,
					startDate: handleDate($scope.initialDate),
					endDate: handleDate($scope.finalDate),
					status: ['EXPECTED'],
					currency: 'BRL'
			}

			MovementSummaryService.listMovementSummaryByFilter(handleFilter(filter)).then(function(response) {

				response = handleResponse(response.data);

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
		/**************************************************************************************************/

		function getPayedAmount(){
			var filter = {
					shopIds: $scope.settlementsSelected,
					acquirers: $scope.acquirersSelected,
					cardProductIds: $scope.productsSelected,
					installments: $scope.installmentsSelected,
					startDate: handleDate($scope.initialDate),
					endDate: handleDate($scope.finalDate),
					status: ['FORETHOUGHT','RECEIVED'],
					currency: 'BRL'
			}
            
			MovementSummaryService.listMovementSummaryByFilter(handleFilter(filter)).then(function(response) {
				response = handleResponse(response.data);

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

		/**************************************************************************************************/

		function updateIndicator(status){
			$scope.status = [status];
			loadPage();
		}

		function clearFilter() {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.status = ['RECEIVED'];
			$scope.settlementsSelected = [];
			$scope.acquirersSelected = [];
			$scope.productsSelected = [];
			$scope.installmentsSelected = [];
		}

		function handleResponse(response) {
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

		function handleDate(date) {
			return calendarFactory.formatDateTimeForService(date);
		}

		function handleFilter(filter) {
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

//			if(filter.groupBy) {
//				if(filter.groupBy.length === 0) {
//					delete filter.groupBy;
//				}
//			}

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

		function pageChanged() {
			$scope.currentPage = this.currentPage - 1;
			loadPage();
		};

		function totalItensPageChanged() {
			this.currentPage = $scope.currentPage = 0;
			$scope.totalItensPage = this.totalItensPage;
			loadPage();
		};

		function loadPage() {
			getExpectedAmount();
			getPayedAmount();
			getReport();
		}
	}
})();
