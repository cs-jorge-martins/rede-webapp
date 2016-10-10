
angular.module('Conciliador.salesController',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/sales', {templateUrl: 'app/views/sales.html', controller: 'salesController'});
}]).controller('salesController', function($scope, $modal, $rootScope, menuFactory, calendarFactory, $location,
	FinancialService, userService, cacheService, advancedFilterService, movementsService, resumoConciliacaoService, TransactionService){


	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.loadParamsByFilter();

	menuFactory.setActiveResumoConciliacao();


	$scope.$on('$routeChangeSuccess', function(next, current,previous) {
		if(previous) {
			if(!previous.$$route.originalPath.match('details')) {
				cacheService.clearFilter();
			}
		}

		init();
	});

	function init(){

		getCachedData();

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

		calendarInit();
		getFinancials();

		$scope.getFinancials = getFinancials;
		$scope.search = search;
		$scope.clearFilter = clearFilter;
		$scope.updateFilterByStatus = updateFilterByStatus;
		$scope.showDetails = showDetails;
		$scope.concilie = concilie;
		$scope.selectItemToConcilie = selectItemToConcilie;
	}

	// calendar functions init
	$scope.nextYear = function() {
		var newDate = calendarFactory.formatDate(calendarFactory.addYearsToDate($scope.dateSelected, 1));
		$scope.changeYear(newDate);
	};

	$scope.prevYear = function() {
		var newDate = calendarFactory.formatDate(calendarFactory.addYearsToDate($scope.dateSelected, -1));
		$scope.changeYear(newDate);
	};

	$scope.changeYear = function(date) {
		$scope.dateSelected = date;
		$scope.yearSelected = parseInt(calendarFactory.getYear($scope.dateSelected));

		//getPeriod($scope.dateSelected);
		//getCalendarMonths();
		getCalendarDays();
		getFinancials(true);
	};

	$scope.changeMonth = function(month) {

		var year = calendarFactory.getYear($scope.dateSelected);
		$scope.dateSelected = calendarFactory.getFirstDayOfSpecificMonth(month, year);

		getCalendarDays();
		getFinancials(true);
	}

	$scope.changeDay = function(day) {

		if(day.isActiveButton) {
			//var selectedDay = day.date.getDate();
			var selectedDay = parseInt(day.day);
			var selectedDayIndex = selectedDay - 1;

			$scope.dateSelected = calendarFactory.formatDate(calendarFactory.getMomentOfSpecificDate($scope.dateSelected).date(selectedDay));
			day.isActive = true;

			$scope.totalToReconcileForDay = $scope.days[selectedDayIndex].toReconcile;
			$scope.totalToProcessForDay = $scope.days[selectedDayIndex].toProcess;
			$scope.totalConciliedForDay = $scope.days[selectedDayIndex].concilied;

			if(selectedDayIndex != $scope.lastDaySelectedIndex) {
				$scope.days[$scope.lastDaySelectedIndex].isActive = false;
				getFinancials(true);
			}

			$scope.lastDaySelectedIndex = selectedDay - 1;

			$scope.concilieQuantity = 0;
		}
	}

	function calendarInit(){
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

		//for(initialDayOfMonth; initialDayOfMonth <= lastDayOfMonth; initialDayOfMonth++){
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

		//getCalendarMonths();
		getCalendarDays();
	}

	function getCalendarMonths() {
		var year = calendarFactory.getYear($scope.dateSelected);
		var firstDayOfYear = calendarFactory.getFirstDayOfYear(year);
		var lastDayOfYear = calendarFactory.getLastDayOfYear(year);
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

		resumoConciliacaoService.listTransactionConciliationCalendarMonth({
			currency: 'BRL',
			startDate: firstDayOfYear,
			endDate: lastDayOfYear,
			cardProductIds: $scope.productsSelected.join(','),
			shopIds: $scope.settlementsSelected.join(','),
			groupBy: 'MONTH',
			size: 31
		}).then(function(data){

			var data = data.data;
			var months = [];

			for(var item in data){
				if(typeof data[item] === 'object') {
					months.push(data[item]);
				} else {
					break;
				}
			}

			// limpa meses atuais
			for(index in $scope.months){
				$scope.months[index].oneItem = true;
				$scope.months[index].toReconcile = false;
				$scope.months[index].toProcess = false;
				$scope.months[index].concilied = false;
			}

			for(month in months) {

				var index = parseInt(months[month].date.split("-")[1]) - 1;
				var item = months[month];

				var oneItemFlag = Boolean(item.transctionToConcilieQuantity) + Boolean(item.transctionUnprocessedQuantity) + Boolean(item.transctionConciliedQuantity);
				$scope.months[index].toReconcile = item.transctionToConcilieQuantity;
				$scope.months[index].toProcess = item.transctionUnprocessedQuantity;
				$scope.months[index].concilied = item.transctionConciliedQuantity;

				if(oneItemFlag > 1) {
					$scope.months[index].oneItem = false;
				}
			}

		});
	}

	/**************************************************************************************************************************/

	function getCalendarDays() {
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

		resumoConciliacaoService.listTransactionConciliationCalendarMonth({
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
	// calendar functions end

	function updateFilterByStatus(status) {
		$scope.statusSelected = status;
		getFinancials();

	}

	function getFinancials(cache, order) {

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
			cacheService.saveFilter({
				startDate: date,
				endDate: date,
				conciliationStatus: $scope.statusSelected,
				types: filter.types || false,
				settlementsSelected: $scope.settlementsSelected,
				productsSelected: $scope.productsSelected
			}, 'sales');
		}

		$scope.items = [];

		resumoConciliacaoService.getTransactionSummary(filter).then(function(data){
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

	// $scope.showDetails = function(acquirer, type,  cardProductIds) {
	function showDetails(acquirer, cardProduct) {

		$rootScope.salesDetails = {};

		var dateSelected = $scope.dateSelected;

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

	function concilie() {

		if($scope.concilieItems.length) {
			var $modalInstance = $modal.open ({
				templateUrl: "app/views/resumoConciliacao/confirmaConciliacaoResumo.html",
				scope: $scope,
				controller: function($scope, $modalInstance) {
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

						TransactionService.concilieTransactions(filter).then(function(data){
							data = data.data.content;
							$scope.concilieItems = [];
							$scope.items = [];

							$modalInstance.dismiss("cancel");
							$modal.open({
								templateUrl: "app/views/resumoConciliacao/successConciliacao.html",
								scope: $scope,
								size: 'sm',
								controller: function($scope, $modalInstance){
									$scope.cancel = function() {
										$modalInstance.dismiss("cancel");
									}
								}
							});
							init();
						}).catch(function(response) {
							console.log('error..')
			            });
					}
					//$scope.cancel = function() {
					//	$modalInstance.dismiss("cancel");
					//};
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

	function selectItemToConcilie(item) {
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

	function search() {
        document.getElementById("naturezaProduto").value = "";
		this.getFinancials(true);
	}

	function clearFilter() {
		$scope.settlementsSelected = [];
		$scope.productsSelected = [];
		$scope.natureza = 0;

		this.getFinancials();
	}

	function downloadReport() {
		Restangular.getList("");
	}

	function getCachedData() {
		cacheService.getSettlements();
		cacheService.getProducts();

		$scope.dateSelected = calendarFactory.getYesterdayDate();
		$scope.statusSelected = 0;

		if(cacheService.loadFilter('context') == 'sales') {

			$scope.dateSelected = cacheService.loadFilter('startDate') || calendarFactory.getYesterdayDate();
			$scope.natureza = cacheService.loadFilter('types');
			$scope.statusSelected = cacheService.loadFilter('conciliationStatus') || 0;

			var productsSelected = cacheService.loadFilter('productsSelected');
			var settlementsSelected = cacheService.loadFilter('settlementsSelected');

			if(productsSelected) {
				for(var item in productsSelected) {
					advancedFilterService.addProductsSearch(productsSelected[item]);
				}
			} else {
				$scope.productsSelected = [];
			}

			if(settlementsSelected) {
				for(var item in settlementsSelected) {
					advancedFilterService.addSettlementsSearch(settlementsSelected[item]);
				}
			} else {
				$scope.settlementsSelected = [];
			}
		} else {
			//cacheService.clearFilter();
		}

	}
	
	$scope.sortResults = function (elem,kind) {
		var order_string;
		order_string = $rootScope.sortResults(elem,kind);

		this.getFinancials(false,order_string);

	};


});
