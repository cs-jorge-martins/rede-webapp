/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.salesController',[])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/sales', {templateUrl: 'app/views/sales.html', controller: 'salesController'});
}]).controller('salesController', function($scope, $modal,  $rootScope, menuFactory, calendarFactory, $location,
	FinancialService, cacheService, advancedFilterService, TransactionConciliationService, TransactionService, TransactionSummaryService){

	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.LoadParamsByFilter();
	menuFactory.setActiveResumoConciliacao();

	$scope.$on('$routeChangeSuccess', function(next, current,previous) {
		if(previous) {
			if(!previous.$$route.originalPath.match('details')) {
				cacheService.ClearFilter();
			}
		}

		Init();
	});

	function Init(){

		GetCachedData();

		if($rootScope.salesFromDashDate) {
			$scope.dateSelected = $rootScope.salesFromDashDate;
			$rootScope.salesFromDashDate = null;
		}

		$scope.actualDateSelected = calendarFactory.getNameOfMonthAndYear($scope.dateSelected);
		$scope.monthNameAbreviation = calendarFactory.getMonthNameAbreviation($scope.dateSelected);
		$scope.dayOfActualDate = calendarFactory.getDayOfMonth($scope.dateSelected);
		$scope.yearSelected = parseInt(calendarFactory.getYear($scope.dateSelected));
		$scope.monthSelected = calendarFactory.getNameOfMonth($scope.dateSelected);
		$scope.noItensMsg = false;
		$scope.concilieItems = [];
		$scope.concilieQuantity = 0;
		$scope.isConcilieButtonActive = false;
		$scope.items = [];
		$scope.taxes = [];
		$scope.tabs = [{},{}];
		$scope.conciliationStatus = ['TO_CONCILIE', 'CONCILIED', 'UNPROCESSED'];
		$scope.accountsSelect = {
			selected: null,
			items: []
		};

		$scope.totalToReconcileForDay = 0;
		$scope.totalConciliedForDay = 0;
		$scope.totalToProcessForDay = 0;

		CalendarInit();
		GetFinancials();

		$scope.getFinancials = GetFinancials;
		$scope.search = Search;
		$scope.clearFilter = ClearFilter;
		$scope.updateFilterByStatus = UpdateFilterByStatus;
		$scope.showDetails = ShowDetails;
		$scope.selectItemToConcilie = SelectItemToConcilie;
        $scope.nextYear = NextYear;
        $scope.prevYear = PrevYear;
        $scope.changeYear = ChangeYear;
        $scope.changeMonth = ChangeMonth;
        $scope.changeDay = ChangeDay;
        $scope.concilie = Concilie;
        $scope.sortResults = SortResults;
	}

	function NextYear() {
		var newDate = calendarFactory.formatDate(calendarFactory.addYearsToDate($scope.dateSelected, 1));
		$scope.changeYear(newDate);
	};

	function PrevYear() {
		var newDate = calendarFactory.formatDate(calendarFactory.addYearsToDate($scope.dateSelected, -1));
		$scope.changeYear(newDate);
	};

	function ChangeYear(date) {
		$scope.dateSelected = date;
		$scope.yearSelected = parseInt(calendarFactory.getYear($scope.dateSelected));

		GetCalendarDays();
		GetFinancials(true);
	};

	function ChangeMonth(month) {
		var year = calendarFactory.getYear($scope.dateSelected);
		$scope.dateSelected = calendarFactory.getFirstDayOfSpecificMonth(month, year);

		GetCalendarDays();
		GetFinancials(true);
	}

	function ChangeDay(day) {
		if(day.isActiveButton) {
			var selectedDay = parseInt(day.day);
			var selectedDayIndex = selectedDay - 1;

			$scope.dateSelected = calendarFactory.formatDate(calendarFactory.getMomentOfSpecificDate($scope.dateSelected).date(selectedDay));
			day.isActive = true;

			$scope.totalToReconcileForDay = $scope.days[selectedDayIndex].toReconcile;
			$scope.totalToProcessForDay = $scope.days[selectedDayIndex].toProcess;
			$scope.totalConciliedForDay = $scope.days[selectedDayIndex].concilied;

			if(selectedDayIndex != $scope.lastDaySelectedIndex) {
				$scope.days[$scope.lastDaySelectedIndex].isActive = false;
				GetFinancials(true);
			}

			$scope.lastDaySelectedIndex = selectedDay - 1;
			$scope.concilieQuantity = 0;
		}
	}

	function CalendarInit(){
		$scope.months = [];
		$scope.days = [];
		$scope.lastDaySelectedIndex = 0;

		var momentjs = moment();
		var months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
		var initialDayOfMonth = calendarFactory.getDayOfMonth(calendarFactory.getFirstDayOfMonth());
		var lastDayOfMonth = calendarFactory.getDayOfMonth(calendarFactory.getLastDayOfMonth());
		var isActive = false;

		for(var i = 0; i < 12; i++){
			if ($scope.dateSelected != null)
				$scope.months.push({month: months[i], active: (i + 1) == calendarFactory.getMonthNumberOfDate($scope.dateSelected)});
			else
				$scope.months.push({month: months[i], active: (i + 1) == (momentjs.month()+1)});
		}

		for(initialDayOfMonth; initialDayOfMonth <= 31; initialDayOfMonth++){
			if(initialDayOfMonth == calendarFactory.getDayOfMonth(calendarFactory.getYesterdayDate())){
				isActive = true;
			}else{
				isActive = false;
			}
			$scope.days.push({
				date:new Date(moment(initialDayOfMonth + "/" + (momentjs.month()+1) + "/" + momentjs.year(), calendarFactory.getFormat())),
				day: (initialDayOfMonth < 10 ? "0"+initialDayOfMonth : initialDayOfMonth),
				totalToReconcile: 0,
				totalConcilied: 0,
				totalToProcess: 0,
				totalAmountToReconcile: 0,
				totalAmountConcilied: 0,
				totalAmountToProcess: 0,
				isActive: isActive,
				isActiveButton: false,
				show: true
			});
		}

		$scope.sumOfExpected = 0;
		$scope.sumOfPayed = 0;
		$scope.sumOfBank = 0;

		GetCalendarDays();
	}


	function GetCalendarDays() {
		var date = $scope.dateSelected;
		var firstDayOfMonth = calendarFactory.getFirstDayOfMonth(date);
		var lastDayOfMonth = calendarFactory.getLastDayOfMonth(date);
		var lastDay = calendarFactory.getDayOfMonth(lastDayOfMonth) - 1;

		$scope.totalToReconcileForDay = 0;
		$scope.totalConciliedForDay = 0;
		$scope.totalToProcessForDay = 0;

		var shopIds = [];
		var cardProductIds = [];

		if($scope.settlementsSelected) {
			for(item in $scope.settlementsSelected) {
				shopIds.push($scope.settlementsSelected[item].id);
			}
		}

		if($scope.productsSelected) {
			for(item in $scope.productsSelected) {
				cardProductIds.push($scope.productsSelected[item].id);
			}
		}

		TransactionConciliationService.ListTransactionConciliationByFilter({
			currency: 'BRL',
			startDate: calendarFactory.formatDateForService(firstDayOfMonth),
			endDate: calendarFactory.formatDateForService(lastDayOfMonth),
			cardProductIds: cardProductIds.join(','),
			shopIds: shopIds.join(','),
			groupBy: 'DAY',
			size: 31
		}).then(function(data){
			var data = data.data.content;
			var days = [];

			for(var item in data){

				if(typeof data[item] === 'object') {
					days.push(data[item]);

				} else {
					break;
				}
			}

			// limpa dias atuais
			for(index in $scope.days){
				$scope.days[index].oneItem = true;
				$scope.days[index].isActive = false;
				$scope.days[index].isActiveButton = false;
				$scope.days[index].toReconcile = 0;
				$scope.days[index].toProcess = 0;
				$scope.days[index].concilied = 0;

				for(index in $scope.days){
					if(index > lastDay) {
						$scope.days[index].show = false;
					} else {
						$scope.days[index].show = true;
					}
				}
			}

			for(day in days) {
				var index = days[day].date.split("-")[2] - 1;
				var item = days[day];
				var oneItemFlag = Boolean(item.transctionToConcilieQuantity) + Boolean(item.transctionUnprocessedQuantity) + Boolean(item.transctionConciliedQuantity);
				if($scope.days[index]) {
					$scope.days[index].isActiveButton = true;
					$scope.days[index].isActive = false;
					$scope.days[index].toReconcile = item.transctionToConcilieQuantity;
					$scope.days[index].toProcess = item.transctionUnprocessedQuantity;
					$scope.days[index].concilied = item.transctionConciliedQuantity;

					if(oneItemFlag > 1) {
						$scope.days[index].oneItem = false;
					}
				}
			}

			var actualDayIndex = calendarFactory.getDayOfMonth($scope.dateSelected) - 1;
			$scope.days[actualDayIndex].isActiveButton = true;
			$scope.days[actualDayIndex].isActive = true;
			$scope.lastDaySelectedIndex = actualDayIndex;

			$scope.totalToReconcileForDay = $scope.days[actualDayIndex].toReconcile || 0;
			$scope.totalToProcessForDay = $scope.days[actualDayIndex].toProcess || 0;
			$scope.totalConciliedForDay = $scope.days[actualDayIndex].concilied || 0;

		});
	}

	function UpdateFilterByStatus(status) {
		$scope.statusSelected = status;
		GetFinancials();

	}

	function GetFinancials(cache, order) {

		var date = $scope.dateSelected;
		var startDate = calendarFactory.formatDateForService(date);
		var endDate = calendarFactory.formatDateForService(date);
		var currency = $rootScope.currency;
		var types = $scope.natureza;
		var shopIds = [];
		var cardProductIds = [];

		$scope.concilieItems = [];
		$scope.isConcilieButtonActive = false;
		$scope.monthSelected = calendarFactory.getNameOfMonth($scope.dateSelected);

		if($scope.settlementsSelected) {
			for(item in $scope.settlementsSelected) {
				shopIds.push($scope.settlementsSelected[item].id);
			}
		}

		if($scope.productsSelected) {
			for(item in $scope.productsSelected) {
				cardProductIds.push($scope.productsSelected[item].id);
			}
		}

		filter = {
			currency: 'BRL',
			startDate: startDate,
			endDate: endDate,
			shopIds: shopIds.join(','),
			cardProductIds: cardProductIds.join(','),
			conciliationStatus: $scope.conciliationStatus[$scope.statusSelected],
            groupBy: 'CARD_PRODUCT,CONCILIATION_STATUS,ACQUIRER'
		};

		if(order) {
			filter.sort = order;
		}

		if(types != 0) {
			filter.types = types;
		}

		if(cache) {
			cacheService.SaveFilter({
				startDate: date,
				endDate: date,
				conciliationStatus: $scope.statusSelected,
				types: filter.types || false,
				settlementsSelected: $scope.settlementsSelected,
				productsSelected: $scope.productsSelected
			}, 'sales');
		}

		$scope.items = [];

		TransactionSummaryService.ListTransactionSummaryByFilter(filter).then(function(data){
			data = data.data.content;
			var items = [];
			for(var item in data){
				if(typeof data[item] === 'object') {
					items.push(data[item]);
				} else {
					break;
				}
			}

			if(items.length){
				$scope.items = items;
				$scope.noItensMsg = false;
			} else {
				$scope.items = [];
				$scope.noItensMsg = true;
			}

		});
	}

	function ShowDetails(acquirer, cardProduct) {
		var dateSelected = $scope.dateSelected;

        $rootScope.salesDetails = {};
		$rootScope.salesDetails.currency = "BRL";
		$rootScope.salesDetails.startDate = dateSelected;
		$rootScope.salesDetails.endDate = dateSelected;
		$rootScope.salesDetails.shopIds = $scope.settlementsSelected;
		$rootScope.salesDetails.cardProductIds = $scope.productsSelected;
		$rootScope.salesDetails.natureza = $scope.natureza;
		$rootScope.salesDetails.conciliationStatus = $scope.conciliationStatus[$scope.statusSelected];
		$rootScope.salesDetails.acquirer = acquirer;
		$rootScope.salesDetails.cardProduct = cardProduct;

		$location.path('sales/details');
	}

	function Concilie() {
		$scope.confirm = true;
		$scope.success = false;
		if($scope.concilieItems.length) {
			$modal.open ({
				templateUrl: "app/views/resumo-conciliacao/confirma-conciliacao-resumo.html",
				scope: $scope,
				animation: false,
				controller: function($scope, $modalInstance, $timeout) {
					$scope.ok = function(data) {
						var ids = [];

						for(item in $scope.concilieItems) {
							for(subItem in $scope.concilieItems[item])	{
								ids.push($scope.concilieItems[item][subItem]);
							}
						}

						var date = $scope.dateSelected;
						var shopIds = [];
						var cardProductIds = [];
						var acquirers = [];

						if($scope.settlementsSelected) {
							for(item in $scope.settlementsSelected) {
								shopIds.push($scope.settlementsSelected[item].id);
							}
						}

						for(item in $scope.concilieItems) {
							var flag = false;
							for(x in cardProductIds) {
								if($scope.concilieItems[item].cardProduct.id === cardProductIds[x]){
									flag = true;
								}
							}
							if(!flag){
								cardProductIds.push($scope.concilieItems[item].cardProduct.id);
							}
						}

						for(item in $scope.concilieItems) {
							var flag = false;
							for(x in acquirers) {
								if($scope.concilieItems[item].acquirer.id === acquirers[x]){
									flag = true;
								}
							}
							if(!flag){
								acquirers.push($scope.concilieItems[item].acquirer.id);
							}
						}

						filter = {
							currency: $rootScope.currency,
							startDate: calendarFactory.formatDateForService(date),
							endDate: calendarFactory.formatDateForService(date),
							types: $scope.natureza,
							shopIds: shopIds,
							cardProductIds: cardProductIds,
							acquirerIds: acquirers
						}

						if(!filter.types){
							delete filter.types;
						}

						TransactionService.ConcilieTransactions(filter).then(function(data){
							$scope.concilieItems = [];
							$scope.items = [];

							Init();
							$scope.confirm = false;
							$scope.success = true;

						}).catch(function(response) {
							console.log('error.. ' + response)
			            });
					}
					$scope.cancel = function(data) {
						$modalInstance.close();
					}
				},
				size: 'md',
				resolve: {
					item: function() {
						return
					}
				}
			})

		}
	}

	function SelectItemToConcilie(item) {
		if($scope.concilieItems.length){
			var flag = false;
			var removeIndex = null;
			for( var index in  $scope.concilieItems) {
				if($scope.concilieItems[index].$$hashKey == item.$$hashKey) {
					flag = true;
					$scope.concilieItems.splice(index, 1);
				}
			}
			if(!flag){
				$scope.concilieItems.push(item);
			}
		} else {
			$scope.concilieItems.push(item);
		}

		if($scope.concilieItems.length) {
			$scope.isConcilieButtonActive = true;
		} else {
			$scope.isConcilieButtonActive = false;
		}

		$scope.concilieQuantity = 0;
		for(var index in $scope.concilieItems) {
			$scope.concilieQuantity += $scope.concilieItems[index].quantity;
		}
	}

	function Search() {
        document.getElementById("naturezaProduto").value = "";
		GetFinancials(true);
	}

	function ClearFilter() {
		$scope.settlementsSelected = [];
		$scope.productsSelected = [];
		$scope.natureza = 0;
		document.getElementById("buscaTerminal").value = '';
		document.getElementById("naturezaProduto").value = '';
	}

	function GetCachedData() {
		cacheService.GetSettlements();
		cacheService.GetProducts();

		$scope.dateSelected = calendarFactory.getYesterdayDate();
		$scope.statusSelected = 0;

		if(cacheService.LoadFilter('context') == 'sales') {

			$scope.dateSelected = cacheService.LoadFilter('startDate') || calendarFactory.getYesterdayDate();
			$scope.natureza = cacheService.LoadFilter('types');
			$scope.statusSelected = cacheService.LoadFilter('conciliationStatus') || 0;

			var productsSelected = cacheService.LoadFilter('productsSelected');
			var settlementsSelected = cacheService.LoadFilter('settlementsSelected');

			if(productsSelected) {
				for(var item in productsSelected) {
					advancedFilterService.AddProductsSearch(productsSelected[item]);
				}
			} else {
				$scope.productsSelected = [];
			}

			if(settlementsSelected) {
				for(var item in settlementsSelected) {
					advancedFilterService.AddSettlementsSearch(settlementsSelected[item]);
				}
			} else {
				$scope.settlementsSelected = [];
			}
		}

	}

	function SortResults(elem,kind) {
		var order_string;
		order_string = $rootScope.sortResults(elem,kind);

		GetFinancials(false,order_string);
	};
});
