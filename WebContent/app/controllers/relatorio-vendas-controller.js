/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

// removendo regra de jshint: este controller será refeito
/* jshint -W074 */
(function() {

    angular
        .module('Conciliador.relatorioVendasController', ['ui.bootstrap'])
        .controller('relatorioVendasController', RelatorioVendas);

    RelatorioVendas.$inject = ['menuFactory', '$scope', '$window', 'calendarFactory', '$rootScope', 'advancedFilterService', 'calendarService', 'TransactionSummaryService', 'TransactionService'];

    // removendo regra de jshint: este controller será refeito
    /* jshint -W071 */
    function RelatorioVendas(menuFactory, $scope, $window, calendarFactory, $rootScope,
    advancedFilterService, calendarService, TransactionSummaryService,TransactionService) {
    	//Extensao do servico para filtro avancado
    	angular.extend($scope, advancedFilterService);
    	$scope.LoadParamsByFilter();

    	//Extensao do servico para calendario
    	angular.extend($scope, calendarService);
    	$scope.ResetCalendarService();

    	menuFactory.setActiveReportsSales();
		$scope.tabs = [{},{},{}];

		$scope.sort = "";

		/* pagination */
		$scope.maxSize = 4;
        $scope.totalItensPageOptions = [10,20,50];

		$scope.totalItensPageSynthetic = $scope.totalItensPageOptions[2];
        $scope.currentPageSynthetic = 0;
		$scope.totalItensSynthetic = 0;

		$scope.totalItensPageAnalytical = $scope.totalItensPageOptions[0];
        $scope.currentPageAnalytical = 0;
		$scope.totalItensAnalytical = 0;

		$scope.totalItensPageDuplicate = $scope.totalItensPageOptions[0];
        $scope.currentPageDuplicate = 0;
		$scope.totalItensDuplicate = 0;

		$scope.clearSyntheticFilter = ClearSyntheticFilter;
		$scope.clearAnalyticalFilter = ClearAnalyticalFilter;
		$scope.clearDuplicateFilter = ClearDuplicateFilter;

        $scope.chartOptions = objChartUtils.Options.relatorioSintetico;
        $scope.getSynthetic = GetSynthetic;
        $scope.getAnalytical = GetAnalytical;
        $scope.exportAnalytical = ExportAnalytical;
        $scope.getDuplicate = GetDuplicate;
        $scope.changeTab = ChangeTab;
        $scope.clearFilter = ClearFilter;

        $scope.pageChangedSynthetic = PageChangedSynthetic;
        $scope.totalItensPageChangedSynthetic = TotalItensPageChangedSynthetic;
        $scope.pageChangedAnalytical = PageChangedAnalytical;
        $scope.totalItensPageChangedAnalytical = TotalItensPageChangedAnalytical;
        $scope.pageChangedDuplicate = PageChangedDuplicate;
        $scope.totalItensPageChangedDuplicate = TotalItensPageChangedDuplicate;
        $scope.sortResults = SortResults;

        var objInitialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());

        var objResetInitialDate = calendarFactory.getDateFromString(calendarFactory.getFirstDayOfMonth()).toDate();
        var objResetFinalDate = calendarFactory.getDateFromString(calendarFactory.getLastDayOfMonth(objInitialDate)).toDate();

        $scope.dateOptions = {
            showWeeks: false,
            startingDay: 1,
            maxMode: 'day'
        };

        function HandleResponse(objResponse) {
			var arrItems = [];

			for(var item in objResponse){
				if(typeof objResponse[item] === 'object') {
					arrItems.push(objResponse[item]);
				}
				else {
					break;
				}
			}
			return arrItems;
		}

        function LoadChart(objResponse) {
            var objChartData = {
                labels: [],
                data: []
            };
            for(var intIndex in objResponse) {
                if(objResponse.hasOwnProperty(intIndex)) {
    				if(objResponse[intIndex].amount) {
                    	objChartData.labels.push(objResponse[intIndex].cardProduct.name);
    				}
    				else {
    					objChartData.labels.push('');
    				}
                    objChartData.data.push(objResponse[intIndex].percentage);
                }
            }

            $scope.chartjs = objChartData;
        }

        function GetFilterOptions(objReportScope, objExtraOptions){
            objExtraOptions = objExtraOptions || {};
            var objFilter = {
				startDate: calendarFactory.formatDateTimeForService(objReportScope.initialDate),
				endDate: calendarFactory.formatDateTimeForService(objReportScope.finalDate),
				shopIds: $scope.settlementsSelected.map(function(item){
                    return item.id;
                }).join(','),
				cardProductIds: $scope.productsSelected.map(function(item){
                    return item.id;
                }).join(','),
                conciliationStatus: 'TO_CONCILIE,CONCILIED',
				currency: 'BRL',
				sort: $scope.sort ? $scope.sort : 'date,ASC'
			};
            return angular.extend(objFilter, objExtraOptions);
        }

        function GetSynthetic() {
			var objFilter = GetFilterOptions($scope.synthetic, {
				groupBy: ['CARD_PRODUCT'],
				page: $scope.currentPageSynthetic,
				size: $scope.totalItensPageSynthetic
			});

			TransactionSummaryService.ListTransactionSummaryByFilter(objFilter).then(function(objResponse) {
				var objData = HandleResponse(objResponse.data.content);
                var objPagination = objResponse.data.page;

				var intTotal = 0;
				for(var i = 0; i < objData.length; i++) {
					intTotal = intTotal + objData[i].quantity;
				}

				for(var j = 0; j < objData.length; j++) {
					objData[j].percentage = ((objData[j].quantity * 100) / (intTotal)).toFixed(2);
				}

				$scope.synthetic.items = objData;
                $scope.synthetic.noItensMsg = $scope.synthetic.items.length === 0 ? true : false;

				$scope.totalItensSynthetic = objPagination.totalElements;
				LoadChart(objData);
			});
        }

        function GetAnalytical() {
            var objFilter = GetFilterOptions($scope.analytical, {
                page: $scope.currentPageAnalytical,
                size: $scope.totalItensPageAnalytical
            });

            $scope.monthSelected = calendarFactory.getNameOfMonth($scope.dateSelected);
			TransactionService.GetTransactionByFilter(objFilter).then(function(objResponse) {
                var objData = HandleResponse(objResponse.data.content);
                var objPagination = objResponse.data.page;
                $scope.analytical.items = objData;
				$scope.analytical.noItensMsg = objData.length === 0 ? true : false;
				$scope.totalItensAnalytical = objPagination.totalElements;
			}).catch(function() {
            });
		}

        function ExportAnalytical() {
        	$rootScope.alerts.splice(0);
			var objFilter = GetFilterOptions($scope.analytical);

            $scope.monthSelected = calendarFactory.getNameOfMonth($scope.dateSelected);

            TransactionService.ExportTransactions(objFilter, function ok(objResponse){
                $rootScope.$broadcast('download-init', objResponse.data);
            }, function error(objResponse){
                var strMsg;

                if(objResponse.status === 408){
                    strMsg = "O período escolhido não pôde ser processado devido ao grande número de transações. Por favor escolha um período menor.";
                } else if (objResponse.status === 500) {
                	strMsg = "Não foi possível gerar o relatório. Tente novamente.";
				}

				if (objResponse.status !== 403) {
                    $rootScope.alerts = [{type: "danger", msg: strMsg}];
                }
            });
		}

		function GetDuplicate() {
            var objFilter = GetFilterOptions($scope.duplicate, {
                page: $scope.currentPageDuplicate,
                size: $scope.totalItensPageDuplicate
            });

			TransactionService.GetDuplicateTransaction(objFilter).then(function(objResponse){
                var objData = HandleResponse(objResponse.data.content);
                var objPagination = objResponse.data.page;

				$scope.duplicate.items = objData;
				$scope.duplicate.noItensMsg = objData.length === 0 ? true : false;
				$scope.totalItensDuplicate = objPagination.totalElements;
			}).catch(function() {
            });
		}

		function ChangeTab(intTab) {
			$scope.currentPage = 0;
			$scope.sort = "";
            $rootScope.alerts = [];
			$scope.productsSelected = this.productsSelected = [];
			$scope.settlementsSelected = this.settlementsSelected = [];

			switch(intTab) {
				case 1:
					if($scope.synthetic.items) {
						if(!$scope.synthetic.items.length) {
                            $scope.sort = 'id,DESC';
							GetSynthetic();
						}
					}
					break;

				case 2:
					if($scope.analytical.items) {
						if(!$scope.analytical.items.length) {
							GetAnalytical();
						}
					}
					break;

				case 3:
					if($scope.duplicate.items) {
						if(!$scope.duplicate.items.length) {
							GetDuplicate();
						}
					}
					break;
                default:
                    console.log("error");
			}
		}

        function ClearFilter() {

			$scope.synthetic = {};
			$scope.synthetic.items = [];

			$scope.synthetic.initialDate = objResetInitialDate;
			$scope.synthetic.finalDate = objResetFinalDate;

			$scope.analytical = {};
			$scope.analytical.items = [];
			$scope.analytical.initialDate = objResetInitialDate;
			$scope.analytical.finalDate = objResetFinalDate;

			$scope.duplicate = {};
			$scope.duplicate.items = [];
			$scope.duplicate.initialDate = objResetInitialDate;
			$scope.duplicate.finalDate = objResetFinalDate;
		}

		function ClearSyntheticFilter() {
			$scope.synthetic.initialDate = objResetInitialDate;
			$scope.synthetic.finalDate = objResetFinalDate;
			$scope.settlementsSelected = this.settlementsSelected = [];
			$scope.settlementsSearch = this.settlementsSearch = [];
			document.getElementById('buscaTerminal').value = '';
		}

		function ClearAnalyticalFilter() {
			$scope.analytical.initialDate = objResetInitialDate;
			$scope.analytical.finalDate = objResetFinalDate;
			$scope.productsSelected = this.productsSelected = [];
			$scope.productsSearch = this.productsSearch = [];
			$scope.settlementsSelected = this.settlementsSelected = [];
			$scope.settlementsSearch = this.settlementsSearch = [];
			document.getElementById('buscaTerminal2').value = '';
			document.getElementById('naturezaProduto').value = '';
		}

		function ClearDuplicateFilter () {
			$scope.duplicate.initialDate = objResetInitialDate;
			$scope.duplicate.finalDate = objResetFinalDate;
			$scope.productsSelected = this.productsSelected = [];
			$scope.productsSearch = this.productsSearch = [];
			$scope.settlementsSelected = this.settlementsSelected = [];
			$scope.settlementsSearch = this.settlementsSearch = [];
			document.getElementById('buscaTerminal3').value = '';
			document.getElementById('naturezaProduto2').value = '';
		}

		/* pagination */
        function PageChangedSynthetic() {
            $scope.currentPageSynthetic = this.currentPageSynthetic - 1;
			GetSynthetic();
		}

		function TotalItensPageChangedSynthetic() {
			this.currentPageSynthetic = $scope.currentPageSynthetic = 0;
			$scope.totalItensPageSynthetic = this.totalItensPageSynthetic;
			GetSynthetic();
		}

		function PageChangedAnalytical() {
            $scope.currentPageAnalytical = this.currentPageAnalytical - 1;
			GetAnalytical();
		}

		function TotalItensPageChangedAnalytical() {
			this.currentPageAnalytical = $scope.currentPageAnalytical = 0;
			$scope.totalItensPageAnalytical = this.totalItensPageAnalytical;
			GetAnalytical();
		}

		function PageChangedDuplicate() {
			$scope.currentPageDuplicate = this.currentPageDuplicate - 1;
			GetDuplicate();
		}

		function TotalItensPageChangedDuplicate() {
			this.currentPageDuplicate = $scope.currentPageDuplicate = 0;
			$scope.totalItensPageDuplicate = this.totalItensPageDuplicate;
			GetDuplicate();
		}

		function SortResults(objElem, strKind, strTipoRelatorio) {
			$scope.sort = $rootScope.sortResults(objElem, strKind);

			if(strTipoRelatorio === "sintetico") {
                GetSynthetic();
			} else if (strTipoRelatorio === "analitico") {
                GetAnalytical();
			} else if(strTipoRelatorio === "duplicadas") {
				GetDuplicate();
			}
		}

        ClearFilter();
    }
})();
