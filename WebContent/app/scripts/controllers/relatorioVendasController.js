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

    RelatorioVendas.$inject = ['menuFactory', '$scope', '$modal', 'calendarFactory', '$rootScope', 'relatorioService', 'installmentsService', '$window', 'advancedFilterService', 'calendarService', 'TransactionSummaryService', 'TransactionService'];

    function RelatorioVendas(menuFactory, $scope, $modal, calendarFactory, $rootScope,
    relatorioService, installmentsService, $window, advancedFilterService, calendarService, TransactionSummaryService,
	TransactionService) {
    	//Extensao do serviÃ§o para filtro avanÃ§ado
    	angular.extend($scope, advancedFilterService);
    	$scope.loadParansByFilter();

    	//Extensao do serviÃ§o para calendario
    	angular.extend($scope, calendarService);
    	$scope.resetCalendarService();

    	menuFactory.setActiveReportsSales();
		$scope.tabs = [{},{},{}];

		$scope.sort = "";

		$scope.clearSyntheticFilter = clearSyntheticFilter;
		$scope.getSynthetic = getSynthetic;
		$scope.clearAnalyticalFilter = clearAnalyticalFilter;
		$scope.getAnalytical = getAnalytical;
		$scope.clearDuplicateFilter = clearDuplicateFilter;
		$scope.getDuplicate = getDuplicate;
		$scope.changeTab = changeTab;
		$scope.clearFilter = clearFilter;

		$scope.pageChangedSynthetic = pageChangedSynthetic;
		$scope.totalItensPageChangedSynthetic = totalItensPageChangedSynthetic;
		$scope.pageChangedAnalytical = pageChangedAnalytical;
		$scope.totalItensPageChangedAnalytical = totalItensPageChangedAnalytical;
		$scope.pageChangedDuplicate = pageChangedDuplicate;
		$scope.totalItensPageChangedDuplicate = totalItensPageChangedDuplicate;

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

		init();

		function init(){
			clearFilter();
		}

		function getSynthetic() {

            var shopIds = [];

    		if($scope.settlementsSelected) {
    			for(var item in $scope.settlementsSelected) {
    				shopIds.push($scope.settlementsSelected[item].id);
    			}
				shopIds = shopIds.join(",");
    		}

			var filter = {
				startDate: handleDate($scope.synthetic.initialDate),
				endDate: handleDate($scope.synthetic.finalDate),
				shopIds: shopIds,
				currency: 'BRL',
				groupBy: ['CARD_PRODUCT'],
				page: $scope.currentPageSynthetic,
				size: $scope.totalItensPageSynthetic,
				sort: $scope.sort
			};

			TransactionSummaryService.listTransactionSummaryByFilter(handleSyntheticFilter(filter)).then(function(response) {
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
		}

		function getAnalytical() {

            var shopIds = [];
            var cardProductIds = [];

    		if($scope.settlementsSelected) {
    			for(var item in $scope.settlementsSelected) {
    				shopIds.push($scope.settlementsSelected[item].id);
    			}
				shopIds = shopIds.join(",");
    		}

            if($scope.productsSelected) {
    			for(var item in $scope.productsSelected) {
    				cardProductIds.push($scope.productsSelected[item].id);
    			}
				cardProductIds = cardProductIds.join(",");
    		}

            $scope.monthSelected = calendarFactory.getNameOfMonth($scope.dateSelected);

			var filter = {
				startDate: handleDate($scope.analytical.initialDate),
				endDate: handleDate($scope.analytical.finalDate),
				shopIds: shopIds,
				cardProductIds: cardProductIds,
				currency: 'BRL',
				page: $scope.currentPageAnalytical,
				size: $scope.totalItensPageAnalytical,
                sort: $scope.sort ? $scope.sort : 'date,ASC'
			};

			TransactionService.getTransactionByFilter(handleAnalyticalFilter(filter)).then(function(response){
                var data = handleResponse(response.data.content);
                var pagination = response.data.page;

				$scope.analytical.items = data;
				$scope.analytical.noItensMsg = data.length === 0 ? true : false;
				$scope.totalItensAnalytical = pagination.totalElements;
			}).catch(function(response) {
            });
		}

		function getDuplicate() {

            var shopIds = [];
            var cardProductIds = [];

    		if($scope.settlementsSelected) {
    			for(var item in $scope.settlementsSelected) {
    				shopIds.push($scope.settlementsSelected[item].id);
    			}
				shopIds = shopIds.join(",");
    		}

            if($scope.productsSelected) {
    			for(item in $scope.productsSelected) {
    				cardProductIds.push($scope.productsSelected[item].id);
    			}
				cardProductIds = cardProductIds.join(",");
    		}

			var filter = {
				startDate: handleDate($scope.duplicate.initialDate),
				endDate: handleDate($scope.duplicate.finalDate),
				shopIds: shopIds,
				cardProductIds: cardProductIds,
				currency: 'BRL',
				page: $scope.currentPageDuplicate,
				size: $scope.totalItensPageDuplicate,
				sort: $scope.sort ?  $scope.sort :'date,ASC'

			};

			TransactionService.getDuplicateTransaction(handleDuplicateFilter(filter)).then(function(response){
                var data = handleResponse(response.data.content);
                var pagination = response.data.page;

				$scope.duplicate.items = data;
				$scope.duplicate.noItensMsg = data.length === 0 ? true : false;
				$scope.totalItensDuplicate = pagination.totalElements;
			}).catch(function(response) {
            });
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

		function handleSyntheticFilter(filter) {
			if(filter.shopIds) {
				if(filter.shopIds.length === 0) {
					delete filter.shopIds;
				}
			}
			return filter;
		}

		function handleAnalyticalFilter(filter) {
			if(filter.shopIds) {
				if(filter.shopIds.length === 0) {
					delete filter.shopIds;
				}
			}

			if(filter.cardProductIds) {
				if(filter.cardProductIds.length === 0) {
					delete filter.cardProductIds;
				}
			}
			return filter;
		}

		function handleDuplicateFilter(filter) {
			if(filter.shopIds) {
				if(filter.shopIds.length === 0) {
					delete filter.shopIds;
				}
			}

			if(filter.cardProductIds) {
				if(filter.cardProductIds.length === 0) {
					delete filter.cardProductIds;
				}
			}
			return filter;
		}

		function changeTab(tab) {
			$scope.currentPage = 0;
			$scope.sort = "";

			switch(tab) {
				case 1:
					if($scope.synthetic.items) {
						if(!$scope.synthetic.items.length) {
							getSynthetic();
						}
					}
					break;

				case 2:
					if($scope.analytical.items) {
						if(!$scope.analytical.items.length) {
							getAnalytical();
						}
					}
					break;

				case 3:
					if($scope.duplicate.items) {
						if(!$scope.duplicate.items.length) {
							getDuplicate();
						}
					}
					break;
			}
		}

		function clearFilter() {
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
		}

		function clearSyntheticFilter() {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.synthetic.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.synthetic.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.settlementsSelected = this.settlementsSelected = [];
			$scope.settlementsSearch = this.settlementsSearch = [];
		}

		function clearAnalyticalFilter() {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.analytical.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.analytical.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.productsSelected = this.productsSelected = [];
			$scope.productsSearch = this.productsSearch = [];
			$scope.settlementsSelected = this.settlementsSelected = [];
			$scope.settlementsSearch = this.settlementsSearch = [];
		}

		function clearDuplicateFilter() {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.duplicate.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.duplicate.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.productsSelected = this.productsSelected = [];
			$scope.productsSearch = this.productsSearch = [];
			$scope.settlementsSelected = this.settlementsSelected = [];
			$scope.settlementsSearch = this.settlementsSearch = [];
		}

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
        }

		/* pagination */
		function pageChangedSynthetic() {
			$scope.currentPageSynthetic = this.currentPageSynthetic - 1;
			getSynthetic();
		};

		function totalItensPageChangedSynthetic() {
			this.currentPageSynthetic = $scope.currentPageSynthetic = 0;
			$scope.totalItensPageSynthetic = this.totalItensPageSynthetic;
			getSynthetic();
		};

		function pageChangedAnalytical() {
			$scope.currentPageAnalytical = this.currentPageAnalytical - 1;
			getAnalytical();
		};

		function totalItensPageChangedAnalytical() {
			this.currentPageAnalytical = $scope.currentPageAnalytical = 0;
			$scope.totalItensPageAnalytical = this.totalItensPageAnalytical;
			getAnalytical();
		};

		function pageChangedDuplicate() {
			$scope.currentPageDuplicate = this.currentPageDuplicate - 1;
			getDuplicate();
		};

		function totalItensPageChangedDuplicate() {
			this.currentPageDuplicate = $scope.currentPageDuplicate = 0;
			$scope.totalItensPageDuplicate = this.totalItensPageDuplicate;
			getDuplicate();
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
    }
})();
