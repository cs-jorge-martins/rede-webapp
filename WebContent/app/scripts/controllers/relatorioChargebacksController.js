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
    	$scope.resetCalendarService();

    	menuFactory.setActiveReportsChargebacks();

		$scope.updateIndicator = updateIndicator;
		$scope.clearFilter = clearFilter;
		$scope.getReport = getReport;
		$scope.pageChanged = pageChanged;
		$scope.totalItensPageChanged = totalItensPageChanged;

		$scope.maxSize = 4;
		$scope.totalItensPage = 10;
        $scope.currentPage = 0;
		$scope.totalItens = 0;

        $scope.cancelled = 0;
        $scope.chargebacks = 0;
        
        $scope.tableName = 'cancelamento';
		$scope.sort = 'adjustDate,ASC';

		init();

		function init(){
			clearFilter();
			getReport();
		}

		function getReport(){

            var shopIds = [];

    		if($scope.settlementsSelected) {
    			for(var item in $scope.settlementsSelected) {
    				shopIds.push($scope.settlementsSelected[item].id);
    			}
				shopIds = shopIds.join(",");
    		}
			
            getIndicator();

			var filter = {
				currency: 'BRL',
				cancellationStartDate: handleDate($scope.initialDate),
				cancellationEndDate: handleDate($scope.finalDate),
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

			TransactionSummaryService.listTransactionSummaryByFilter(handleFilter(filter)).then(function(response) {
				var data = handleResponse(response.data.content);
                var pagination = response.data.page;

				$scope.items = data;
				$scope.noItensMsg = data.length === 0 ? true : false;
				$scope.totalItens = pagination.totalElements;
			}).catch(function(response) {
            });
		}

		function getIndicator() {

            var shopIds = [];

    		if($scope.settlementsSelected) {
    			for(var item in $scope.settlementsSelected) {
    				shopIds.push($scope.settlementsSelected[item].id);
    			}
				shopIds = shopIds.join(",");
    		}
			
			var filter = {
				currency: 'BRL',
				cancellationStartDate: handleDate($scope.initialDate),
				cancellationEndDate: handleDate($scope.finalDate),
				shopIds: shopIds,
				groupBy: ['ADJUST_TYPE'],
				cardProductIds: $scope.productsSelected,
				status: 'CANCELLED',
				adjustTypes: 'CANCELLATION,CHARGEBACK'
			};

			TransactionSummaryService.listTransactionSummaryByFilter(handleFilter(filter)).then(function(response) {
				var data = handleResponse(response.data.content);

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

		function updateIndicator(adjustType){
			$scope.adjustType = [adjustType];
            if(adjustType == 'CANCELLATION') {
                $scope.tableName = 'cancelamento';
            } else {
                $scope.tableName = 'chargeback';
            }
			$scope.currentPage = 0;
			getReport();
		};

		function clearFilter() {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.settlementsSelected = [];
			$scope.adjustType = ['CANCELLATION'];
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

		function pageChanged() {
			$scope.currentPage = this.currentPage - 1;
			getReport();
		};

		function totalItensPageChanged() {
			this.currentPage = $scope.currentPage = 0;
			$scope.totalItensPage = this.totalItensPage;
			getReport();
		};

		$scope.sortResults = function (elem,kind) {
			$scope.sort = $rootScope.sortResults(elem,kind);
			getReport();
		};
	}
})();
