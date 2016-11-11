/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

(function() {
    'use strict';

    angular
		.module('KaplenWeb.relatorioChargebacksController', ['ui.bootstrap'])
		.config(['$routeProvider','RestangularProvider' , function ($routeProvider) {
			$routeProvider.when('/relatorio/chargebacks', {
				templateUrl: 'app/views/relatorios/chargebacks/index.html',
				controller: 'relatorioChargebacksController'
			});
		}])
		.controller('relatorioChargebacksController', RelatorioFinanceiro);

	RelatorioFinanceiro.$inject = ['menuFactory', '$scope', '$modal', 'calendarFactory', '$rootScope',
	'relatorioService', 'installmentsService', '$window', 'advancedFilterService', 'calendarService', 'TransactionSummaryService'];

	function RelatorioFinanceiro(menuFactory, $scope, $modal, calendarFactory, $rootScope,
	    relatorioService, installmentsService, $window, advancedFilterService, calendarService, TransactionSummaryService) {

		//Extensao do serviço para filtro avançado
    	angular.extend($scope, advancedFilterService);
    	$scope.loadParamsByFilter();

    	//Extensao do serviço para calendario
    	angular.extend($scope, calendarService);
    	$scope.ResetCalendarService();

    	menuFactory.setActiveReportsChargebacks();

		$scope.updateIndicator = UpdateIndicator;
		$scope.clearFilter = ClearFilter;
		$scope.getReport = GetReport;
		$scope.pageChanged = PageChanged;
		$scope.totalItensPageChanged = TotalItensPageChanged;

		$scope.maxSize = 4;
		$scope.totalItensPage = 10;
        $scope.currentPage = 0;
		$scope.totalItens = 0;

        $scope.cancelled = 0;
        $scope.chargebacks = 0;

        $scope.tableName = 'cancelamento';
		$scope.sort = 'adjustDate,ASC';
        $scope.sortResults = SortResults;

		Init();

		function Init(){
			ClearFilter();
			GetReport();
		}

		function GetReport(){

            var shopIds = [];

    		if($scope.settlementsSelected) {
    			for(var item in $scope.settlementsSelected) {
    				shopIds.push($scope.settlementsSelected[item].id);
    			}
				shopIds = shopIds.join(",");
    		}

            GetIndicator();

			var filter = {
				currency: 'BRL',
				cancellationStartDate: HandleDate($scope.initialDate),
				cancellationEndDate: HandleDate($scope.finalDate),
                groupBy: 'CANCELLATION_DAY,CARD_PRODUCT,ADJUST_TYPE',
				cardProductIds: $scope.productsSelected,
				shopIds: shopIds,
				status: 'CANCELLED',
				adjustTypes: $scope.adjustType,
				page: $scope.currentPage,
				size: $scope.totalItensPage,
				sort: $scope.sort
			};

			$scope.noItensMsg = false;
			$scope.items = [];

			if($scope.currentPage > 0 ) {
				$scope.currentPage = $scope.currentPage + 1;
			}

			TransactionSummaryService.ListTransactionSummaryByFilter(HandleFilter(filter)).then(function(response) {
				var data = HandleResponse(response.data.content);
                var pagination = response.data.page;

				$scope.items = data;
				$scope.noItensMsg = data.length === 0 ? true : false;
				$scope.totalItens = pagination.totalElements;
			}).catch(function(response) {
            });
		}

		function GetIndicator() {

            var shopIds = [];

    		if($scope.settlementsSelected) {
    			for(var item in $scope.settlementsSelected) {
    				shopIds.push($scope.settlementsSelected[item].id);
    			}
				shopIds = shopIds.join(",");
    		}

			var filter = {
				currency: 'BRL',
				cancellationStartDate: HandleDate($scope.initialDate),
				cancellationEndDate: HandleDate($scope.finalDate),
				shopIds: shopIds,
				groupBy: ['ADJUST_TYPE'],
				cardProductIds: $scope.productsSelected,
				status: 'CANCELLED',
				adjustTypes: 'CANCELLATION,CHARGEBACK'
			};

			TransactionSummaryService.ListTransactionSummaryByFilter(HandleFilter(filter)).then(function(response) {
				var data = HandleResponse(response.data.content);

				for(var item in data){
					if(typeof data[item] === 'object') {
						if(data[item].adjustType === "CANCELLATION") {
                            $scope.cancelled = data[item].quantity;

                        } else if(data[item].adjustType === "CHARGEBACK") {
                            $scope.chargebacks = data[item].quantity;
                        }
					} else {
						break;
					}
				}

			}).catch(function(response) {
            });
		}

		function UpdateIndicator(adjustType){
			$scope.adjustType = [adjustType];
            if(adjustType == 'CANCELLATION') {
                $scope.tableName = 'cancelamento';
            } else {
                $scope.tableName = 'chargeback';
            }
			$scope.currentPage = 0;
			GetReport();
		};

		function ClearFilter() {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.settlementsSelected = [];
			$scope.adjustType = ['CANCELLATION'];
			document.getElementById("buscaTerminal").value = '';
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
			if(filter.cardProductIds) {
				if(filter.cardProductIds.length === 0) {
					delete filter.cardProductIds;
				}
			}
			if(filter.groupBy) {
				if(filter.groupBy.length === 0) {
					delete filter.groupBy;
				}
			}

			if(!filter.cancellationStartDate) {
				delete filter.cancellationStartDate;
			}

			if(!filter.cancellationEndDate) {
				delete filter.cancellationEndDate;
			}
			if(filter.adjustType) {
				if(filter.adjustType[0] === 'CANCELLATION') {
					//filter.groupBy = ['BANK_ACCOUNT','PAYED_DATE'];
				}
				else if(filter.adjustType[0] === 'CHARGEBACK') {
					//filter.groupBy = ['BANK_ACCOUNT','EXPECTED_DATE'];
				}
				else {
					delete filter.adjustType;
				}
			}
			else {
				delete filter.adjustType;
			}
			return filter;
		}

		function PageChanged() {
			$scope.currentPage = this.currentPage - 1;
			GetReport();
		};

		function TotalItensPageChanged() {
			this.currentPage = $scope.currentPage = 0;
			$scope.totalItensPage = this.totalItensPage;
			GetReport();
		};

		function SortResults(elem,kind) {
			$scope.sort = $rootScope.sortResults(elem,kind);
			GetReport();
		};
	}
})();
