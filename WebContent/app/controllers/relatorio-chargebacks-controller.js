/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

'use strict';

(function() {

    angular
		.module('Conciliador.relatorioChargebacksController', ['ui.bootstrap'])
        .controller('relatorioChargebacksController', RelatorioFinanceiro);

	RelatorioFinanceiro.$inject = ['menuFactory', '$scope', 'calendarFactory', '$rootScope',
	'$window', 'advancedFilterService', 'calendarService', 'TransactionSummaryService'];

	function RelatorioFinanceiro(menuFactory, $scope, calendarFactory, $rootScope,
	    $window, advancedFilterService, calendarService, TransactionSummaryService) {

		//Extensao do serviço para filtro avançado
    	angular.extend($scope, advancedFilterService);
    	$scope.LoadParamsByFilter();

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
        $scope.totalItensPageOptions = [10,20,50];
		$scope.totalItensPage = $scope.totalItensPageOptions[0];
        $scope.currentPage = 0;
		$scope.totalItens = 0;

        $scope.cancelled = 0;
        $scope.chargebacks = 0;

        $scope.tableName = 'cancelamento';
		$scope.sort = 'adjustDate,ASC';
        $scope.sortResults = SortResults;

        $scope.dateOptions = {
            showWeeks: false,
            startingDay: 1,
            maxMode: 'day'
        };

		Init();

		function Init(){
			ClearFilter();
			GetReport();
		}

		function GetReport(){

            var arrShopIds = [];

    		if($scope.settlementsSelected) {
    			for(var objItem in $scope.settlementsSelected) {
    				arrShopIds.push($scope.settlementsSelected[objItem].id);
    			}
				arrShopIds = arrShopIds.join(",");
    		}

            GetIndicator();

			var objFilter = {
				currency: 'BRL',
				cancellationStartDate: HandleDate($scope.initialDate),
				cancellationEndDate: HandleDate($scope.finalDate),
                groupBy: 'CANCELLATION_DAY,ACQUIRER,CARD_PRODUCT,ADJUST_TYPE',
				cardProductIds: $scope.productsSelected,
				shopIds: arrShopIds,
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

			TransactionSummaryService.ListTransactionSummaryByFilter(HandleFilter(objFilter)).then(function(objResponse) {
				var objData = HandleResponse(objResponse.data.content);
                var objPagination = objResponse.data.page;

				$scope.items = objData;
				$scope.noItensMsg = objData.length === 0 ? true : false;
				$scope.totalItens = objPagination.totalElements;
			}).catch(function() {
            });
		}

		function GetIndicator() {

            var arrShopIds = [];

    		if($scope.settlementsSelected) {
    			for(var objItem in $scope.settlementsSelected) {
    				arrShopIds.push($scope.settlementsSelected[objItem].id);
    			}
				arrShopIds = arrShopIds.join(",");
    		}

			var objFilter = {
				currency: 'BRL',
				cancellationStartDate: HandleDate($scope.initialDate),
				cancellationEndDate: HandleDate($scope.finalDate),
				shopIds: arrShopIds,
				groupBy: ['ADJUST_TYPE'],
				cardProductIds: $scope.productsSelected,
				status: 'CANCELLED',
				adjustTypes: 'CANCELLATION,CHARGEBACK'
			};

			TransactionSummaryService.ListTransactionSummaryByFilter(HandleFilter(objFilter)).then(function(objResponse) {
				var objData = HandleResponse(objResponse.data.content);

				for(var objItem in objData){
					if(typeof objData[objItem] === 'object') {
						if(objData[objItem].adjustType === "CANCELLATION") {
                            $scope.cancelled = objData[objItem].quantity;
                        } else if(objData[objItem].adjustType === "CHARGEBACK") {
                            $scope.chargebacks = objData[objItem].quantity;
                        }
					} else {
						break;
					}
				}

			}).catch(function() {
            });
		}

		function UpdateIndicator(strAdjustType){
			$scope.adjustType = [strAdjustType];
            if(strAdjustType === 'CANCELLATION') {
                $scope.tableName = 'cancelamento';
            } else {
                $scope.tableName = 'chargeback';
            }
			$scope.currentPage = 0;
			GetReport();
		}

		function ClearFilter() {
			var objInitialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.initialDate = calendarFactory.getDateFromString(calendarFactory.getFirstDayOfMonth()).toDate();
			$scope.finalDate = calendarFactory.getDateFromString(calendarFactory.getLastDayOfMonth(objInitialDate)).toDate();
			$scope.settlementsSelected = [];
			$scope.adjustType = ['CANCELLATION'];
			document.getElementById("buscaTerminal").value = '';
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
			if(objFilter.cardProductIds) {
				if(objFilter.cardProductIds.length === 0) {
					delete objFilter.cardProductIds;
				}
			}
			if(objFilter.groupBy) {
				if(objFilter.groupBy.length === 0) {
					delete objFilter.groupBy;
				}
			}

			if(!objFilter.cancellationStartDate) {
				delete objFilter.cancellationStartDate;
			}

			if(!objFilter.cancellationEndDate) {
				delete objFilter.cancellationEndDate;
			}
			if(objFilter.adjustType) {
				if(objFilter.adjustType[0] === 'CANCELLATION') {
					//objFilter.groupBy = ['BANK_ACCOUNT','PAYED_DATE'];
				}
				else if(objFilter.adjustType[0] === 'CHARGEBACK') {
					//objFilter.groupBy = ['BANK_ACCOUNT','EXPECTED_DATE'];
				}
				else {
					delete objFilter.adjustType;
				}
			}
			else {
				delete objFilter.adjustType;
			}
			return objFilter;
		}

		function PageChanged() {
			$scope.currentPage = this.currentPage - 1;
			GetReport();
		}

		function TotalItensPageChanged() {
			this.currentPage = $scope.currentPage = 0;
			$scope.totalItensPage = this.totalItensPage;
			GetReport();
		}

		function SortResults(objElem, strKind) {
			$scope.sort = $rootScope.sortResults(objElem, strKind);
			GetReport();
		}
	}
})();
