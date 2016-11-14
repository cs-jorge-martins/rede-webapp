/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

(function() {
    'use strict';

    angular
        .module('KaplenWeb.relatorioVendasController', ['ui.bootstrap'])
		.config(['$routeProvider','RestangularProvider', function ($routeProvider, RestangularProvider) {
			$routeProvider.when('/relatorio/vendas', {
				templateUrl: 'app/views/relatorios/vendas/index.html',
				controller: 'relatorioVendasController'
			});
		}])
        .controller('relatorioVendasController', RelatorioVendas);

    RelatorioVendas.$inject = ['menuFactory', '$scope', '$window', '$modal', 'calendarFactory', '$rootScope', '$window', 'advancedFilterService', 'calendarService', 'TransactionSummaryService', 'TransactionService'];

    function RelatorioVendas(menuFactory, $scope, $window, $modal, calendarFactory, $rootScope,
    $window, advancedFilterService, calendarService, TransactionSummaryService,
	TransactionService) {
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

		$scope.totalItensPageSynthetic = 50;
        $scope.currentPageSynthetic = 0;
		$scope.totalItensSynthetic = 0;

		$scope.totalItensPageAnalytical = 10;
        $scope.currentPageAnalytical = 0;
		$scope.totalItensAnalytical = 0;

		$scope.totalItensPageDuplicate = 10;
        $scope.currentPageDuplicate = 0;
		$scope.totalItensDuplicate = 0;

		$scope.clearSyntheticFilter = ClearSyntheticFilter;
		$scope.clearAnalyticalFilter = ClearAnalyticalFilter;
		$scope.clearDuplicateFilter = ClearDuplicateFilter;

        $scope.chartOptions = chartUtils.Options.relatorioSintetico;
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
		};

        function LoadChart(response) {
            var chartData = {
                labels: [],
                data: []
            };
            for(var index in response) {
				if(response[index].amount) {
                	chartData.labels.push(response[index].cardProduct.name);
				}
				else {
					chartData.labels.push('');
				}
                chartData.data.push(response[index].percentage);
            }

            $scope.chartjs = chartData;
        };

        function GetFilterOptions(reportScope, extraOptions){
            var extraOptions = extraOptions || {};
            var filter = {
				startDate: calendarFactory.formatDateTimeForService(reportScope.initialDate),
				endDate: calendarFactory.formatDateTimeForService(reportScope.finalDate),
				shopIds: $scope.settlementsSelected.map(function(item){
                    return item.id;
                }).join(','),
				cardProductIds: $scope.productsSelected.map(function(item){
                    return item.id;
                }).join(','),
				currency: 'BRL',
				sort: $scope.sort ? $scope.sort : 'date,ASC'
			};
            return angular.extend(filter, extraOptions);
        };

        function GetSynthetic() {
			var filter = GetFilterOptions($scope.synthetic, {
				groupBy: ['CARD_PRODUCT'],
				page: $scope.currentPageSynthetic,
				size: $scope.totalItensPageSynthetic
			});

			TransactionSummaryService.ListTransactionSummaryByFilter(filter).then(function(response) {
				var data = HandleResponse(response.data.content);
                var pagination = response.data.page;

				var total = 0;
				for(var i = 0; i < data.length; i++) {
					total = total + data[i].quantity;
				}

				for(var j = 0; j < data.length; j++) {
					data[j].percentage = ((data[j].quantity * 100) / (total)).toFixed(2);
				}

				$scope.synthetic.items = data;
                $scope.synthetic.noItensMsg = $scope.synthetic.items.length === 0 ? true : false;

				$scope.totalItensSynthetic = pagination.totalElements;
				LoadChart(data);
			});
        };

        function GetAnalytical() {
            var filter = GetFilterOptions($scope.analytical, {
                page: $scope.currentPageAnalytical,
                size: $scope.totalItensPageAnalytical
            });

            $scope.monthSelected = calendarFactory.getNameOfMonth($scope.dateSelected);
			TransactionService.GetTransactionByFilter(filter).then(function(response) {
                var data = HandleResponse(response.data.content);
                var pagination = response.data.page;
                $scope.analytical.items = data;
				$scope.analytical.noItensMsg = data.length === 0 ? true : false;
				$scope.totalItensAnalytical = pagination.totalElements;
			}).catch(function(response) { });
		};

        function ExportAnalytical() {
			var filter = GetFilterOptions($scope.analytical);

            $scope.monthSelected = calendarFactory.getNameOfMonth($scope.dateSelected);

            TransactionService.ExportTransactions(filter, function ok(response){
                var url = response.data;
                if (url.indexOf("http") === 0){
                    $window.location = response.data;
                } else {
                    $rootScope.alerts =  [ { type: "danger", msg: "Não foi possível gerar o relatório. Tente novamente."} ];
                }

            }, function error(response){
                if(response.status === 408){
                    msg = "O período escolhido não pôde ser processado devido ao grande número de transações. Por favor escolha um período menor.";
                }
                $rootScope.alerts =  [ { type: "danger", msg: msg} ];
            });
		};

		function GetDuplicate() {
            var filter = GetFilterOptions($scope.duplicate, {
                page: $scope.currentPageDuplicate,
                size: $scope.totalItensPageDuplicate
            });

			TransactionService.GetDuplicateTransaction(filter).then(function(response){
                var data = HandleResponse(response.data.content);
                var pagination = response.data.page;

				$scope.duplicate.items = data;
				$scope.duplicate.noItensMsg = data.length === 0 ? true : false;
				$scope.totalItensDuplicate = pagination.totalElements;
			}).catch(function(response) { });
		};

		function ChangeTab(tab) {
			$scope.currentPage = 0;
			$scope.sort = "";
            $rootScope.alerts = [];
			$scope.productsSelected = this.productsSelected = [];
			$scope.settlementsSelected = this.settlementsSelected = [];

			switch(tab) {
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
		};

        function ClearFilter() {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());

			$scope.synthetic = {};
			$scope.synthetic.items = [];
			$scope.synthetic.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.synthetic.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());

			$scope.analytical = {};
			$scope.analytical.items = [];
			$scope.analytical.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.analytical.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());

			$scope.duplicate = {};
			$scope.duplicate.items = [];
			$scope.duplicate.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.duplicate.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
		};

		function ClearSyntheticFilter() {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.synthetic.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.synthetic.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.settlementsSelected = this.settlementsSelected = [];
			$scope.settlementsSearch = this.settlementsSearch = [];
			document.getElementById('buscaTerminal').value = '';
		};

		function ClearAnalyticalFilter() {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.analytical.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.analytical.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.productsSelected = this.productsSelected = [];
			$scope.productsSearch = this.productsSearch = [];
			$scope.settlementsSelected = this.settlementsSelected = [];
			$scope.settlementsSearch = this.settlementsSearch = [];
			document.getElementById('buscaTerminal2').value = '';
			document.getElementById('naturezaProduto').value = '';
		};

		function ClearDuplicateFilter () {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.duplicate.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.duplicate.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.productsSelected = this.productsSelected = [];
			$scope.productsSearch = this.productsSearch = [];
			$scope.settlementsSelected = this.settlementsSelected = [];
			$scope.settlementsSearch = this.settlementsSearch = [];
			document.getElementById('buscaTerminal3').value = '';
			document.getElementById('naturezaProduto2').value = '';
		};

		/* pagination */
        function PageChangedSynthetic() {
            $scope.currentPageSynthetic = this.currentPageSynthetic - 1;
			GetSynthetic();
		};

		function TotalItensPageChangedSynthetic() {
			this.currentPageSynthetic = $scope.currentPageSynthetic = 0;
			$scope.totalItensPageSynthetic = this.totalItensPageSynthetic;
			GetSynthetic();
		};

		function PageChangedAnalytical() {
            $scope.currentPageAnalytical = this.currentPageAnalytical - 1;
			GetAnalytical();
		};

		function TotalItensPageChangedAnalytical() {
			this.currentPageAnalytical = $scope.currentPageAnalytical = 0;
			$scope.totalItensPageAnalytical = this.totalItensPageAnalytical;
			GetAnalytical();
		};

		function PageChangedDuplicate() {
			$scope.currentPageDuplicate = this.currentPageDuplicate - 1;
			GetDuplicate();
		};

		function TotalItensPageChangedDuplicate() {
			this.currentPageDuplicate = $scope.currentPageDuplicate = 0;
			$scope.totalItensPageDuplicate = this.totalItensPageDuplicate;
			GetDuplicate();
		};

		function SortResults(elem,kind,tipo_relatorio) {
			var order_string;
			$scope.sort = $rootScope.sortResults(elem,kind);

			if(tipo_relatorio == "sintetico") {
                GetSynthetic();
			} else if (tipo_relatorio == "analitico") {
                GetAnalytical();
			} else if(tipo_relatorio == "duplicadas") {
				GetDuplicate();
			}
		};

        ClearFilter();
    }
})();
