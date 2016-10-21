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

    RelatorioVendas.$inject = ['menuFactory', '$scope', '$window', '$modal', 'calendarFactory', '$rootScope', 'relatorioService', 'installmentsService', '$window', 'advancedFilterService', 'calendarService', 'TransactionSummaryService', 'TransactionService'];

    function RelatorioVendas(menuFactory, $scope, $window, $modal, calendarFactory, $rootScope,
    relatorioService, installmentsService, $window, advancedFilterService, calendarService, TransactionSummaryService,
	TransactionService) {
    	//Extensao do servico para filtro avancado
    	angular.extend($scope, advancedFilterService);
    	$scope.loadParamsByFilter();

    	//Extensao do servico para calendario
    	angular.extend($scope, calendarService);
    	$scope.resetCalendarService();

    	menuFactory.setActiveReportsSales();
		$scope.tabs = [{},{},{}];

		$scope.sort = "";

		/* pagination */
		$scope.maxSize = 4;

		$scope.totalItensPageSynthetic = 10;
        $scope.currentPageSynthetic = 0;
		$scope.totalItensSynthetic = 0;

		$scope.totalItensPageAnalytical = 10;
        $scope.currentPageAnalytical = 0;
		$scope.totalItensAnalytical = 0;

		$scope.totalItensPageDuplicate = 10;
        $scope.currentPageDuplicate = 0;
		$scope.totalItensDuplicate = 0;

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
		};

        function loadChart(response) {
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
            $scope.chartOptions = chartUtils.options.relatorioSintetico;
        };

        function getFilterOptions(reportScope, extraOptions){
            var extraOptions = extraOptions || {};
            var filter = {
				startDate: calendarFactory.formatDateTimeForService(reportScope.initialDate),
				endDate: calendarFactory.formatDateTimeForService(reportScope.finalDate),
				shopIds: $scope.settlementsSelected.map(function(item){
                    return item.id;
                }),
				cardProductIds: $scope.productsSelected.map(function(item){
                    return item.id;
                }),
				currency: 'BRL',
				sort: $scope.sort ? $scope.sort : 'date,ASC'
			};
            return angular.extend(filter, extraOptions);
        };

		$scope.getSynthetic = function() {
			var filter = getFilterOptions($scope.synthetic, {
				groupBy: ['CARD_PRODUCT'],
				page: $scope.currentPageSynthetic,
				size: $scope.totalItensPageSynthetic
			});

			TransactionSummaryService.listTransactionSummaryByFilter(filter).then(function(response) {
				var data = handleResponse(response.data.content);
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
				loadChart(data);
			});
        };

        $scope.getAnalytical = function () {
            var filter = getFilterOptions($scope.analytical, {
                page: $scope.currentPageAnalytical,
                size: $scope.totalItensPageAnalytical
            });

            $scope.monthSelected = calendarFactory.getNameOfMonth($scope.dateSelected);
			TransactionService.getTransactionByFilter(filter).then(function(response){
                var data = handleResponse(response.data.content);
                var pagination = response.data.page;
                $scope.analytical.items = data;
				$scope.analytical.noItensMsg = data.length === 0 ? true : false;
				$scope.totalItensAnalytical = pagination.totalElements;
			}).catch(function(response) { });
		};

        $scope.exportAnalytical = function() {
			var filter = getFilterOptions($scope.analytical);

            $scope.monthSelected = calendarFactory.getNameOfMonth($scope.dateSelected);
			TransactionService.exportTransactions(filter, function ok(response){
                $scope.downloadLink = response.data;
                $window.location = $scope.downloadLink;
            }, function error(response){
                $rootScope.alerts =  [ { type: "danger", msg: response.data} ];
            });
		};

		$scope.getDuplicate = function() {
            var filter = getFilterOptions($scope.duplicate, {
                page: $scope.currentPageDuplicate,
                size: $scope.totalItensPageDuplicate
            });

			TransactionService.getDuplicateTransaction(filter).then(function(response){
                var data = handleResponse(response.data.content);
                var pagination = response.data.page;

				$scope.duplicate.items = data;
				$scope.duplicate.noItensMsg = data.length === 0 ? true : false;
				$scope.totalItensDuplicate = pagination.totalElements;
			}).catch(function(response) { });
		};

		$scope.changeTab = function(tab) {
			$scope.currentPage = 0;
			$scope.sort = "";
            $rootScope.alerts = [];

			switch(tab) {
				case 1:
					if($scope.synthetic.items) {
						if(!$scope.synthetic.items.length) {
							$scope.getSynthetic();
						}
					}
					break;

				case 2:
					if($scope.analytical.items) {
						if(!$scope.analytical.items.length) {
							$scope.getAnalytical();
						}
					}
					break;

				case 3:
					if($scope.duplicate.items) {
						if(!$scope.duplicate.items.length) {
							$scope.getDuplicate();
						}
					}
					break;
			}
		};

		$scope.clearFilter = function() {
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

		$scope.clearSyntheticFilter = function() {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.synthetic.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.synthetic.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.settlementsSelected = this.settlementsSelected = [];
			$scope.settlementsSearch = this.settlementsSearch = [];
		};

		$scope.clearAnalyticalFilter = function() {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.analytical.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.analytical.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.productsSelected = this.productsSelected = [];
			$scope.productsSearch = this.productsSearch = [];
			$scope.settlementsSelected = this.settlementsSelected = [];
			$scope.settlementsSearch = this.settlementsSearch = [];
		};

		$scope.clearDuplicateFilter = function() {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.duplicate.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.duplicate.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.productsSelected = this.productsSelected = [];
			$scope.productsSearch = this.productsSearch = [];
			$scope.settlementsSelected = this.settlementsSelected = [];
			$scope.settlementsSearch = this.settlementsSearch = [];
		};

		/* pagination */
		$scope.pageChangedSynthetic = function() {
            $scope.currentPageSynthetic = this.currentPageSynthetic - 1;
			$scope.getSynthetic();
		};

		$scope.totalItensPageChangedSynthetic = function() {
			this.currentPageSynthetic = $scope.currentPageSynthetic = 0;
			$scope.totalItensPageSynthetic = this.totalItensPageSynthetic;
			$scope.getSynthetic();
		};

		$scope.pageChangedAnalytical = function() {
            $scope.currentPageAnalytical = this.currentPageAnalytical - 1;
			$scope.getAnalytical();
		};

		$scope.totalItensPageChangedAnalytical = function() {
			this.currentPageAnalytical = $scope.currentPageAnalytical = 0;
			$scope.totalItensPageAnalytical = this.totalItensPageAnalytical;
			$scope.getAnalytical();
		};

		$scope.pageChangedDuplicate = function() {
			$scope.currentPageDuplicate = this.currentPageDuplicate - 1;
			$scope.getDuplicate();
		};

		$scope.totalItensPageChangedDuplicate = function() {
			this.currentPageDuplicate = $scope.currentPageDuplicate = 0;
			$scope.totalItensPageDuplicate = this.totalItensPageDuplicate;
			$scope.getDuplicate();
		};

		$scope.sortResults = function (elem,kind,tipo_relatorio) {
			var order_string;
			$scope.sort = $rootScope.sortResults(elem,kind);

			if(tipo_relatorio == "sintetico") {
				this.getSynthetic();
			} else if (tipo_relatorio == "analitico") {
				this.getAnalytical();
			} else if(tipo_relatorio == "duplicadas") {
				this.getDuplicate();
			}
		};
        $scope.clearFilter();
    }
})();
