/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.salesController',[])

.controller('salesController', function($scope, $uibModal,  $rootScope, menuFactory, calendarFactory, $location,
	FinancialService, cacheService, advancedFilterService, TransactionConciliationService, TransactionService, TransactionSummaryService){

	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.LoadParamsByFilter();
	menuFactory.setActiveResumoConciliacao();

	$scope.$on('$routeChangeSuccess', function(next, current, previous) {
		if(previous) {
			if(!previous.$$route.originalPath.match('details')) {
				cacheService.ClearFilter();
			}
		}

		Init();
	});

	function Init(){

		GetCachedData();

		var bolCacheData = false;

		if($rootScope.salesFromDashDate) {
			$scope.dateSelected = $rootScope.salesFromDashDate;
			$rootScope.salesFromDashDate = null;
			bolCacheData = true;
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

		CalendarInit();
		GetFinancials(bolCacheData);
	}

	function NextYear() {
		var objNewDate = calendarFactory.formatDate(calendarFactory.addYearsToDate($scope.dateSelected, 1));
		$scope.changeYear(objNewDate);
	};

	function PrevYear() {
		var objNewDate = calendarFactory.formatDate(calendarFactory.addYearsToDate($scope.dateSelected, -1));
		$scope.changeYear(objNewDate);
	};

	function ChangeYear(objDate) {
		$scope.dateSelected = objDate;
		$scope.yearSelected = parseInt(calendarFactory.getYear($scope.dateSelected));

		GetCalendarDays();
		GetFinancials(true);
	};

	function ChangeMonth(intMonth) {
		var intYear = calendarFactory.getYear($scope.dateSelected);
		$scope.dateSelected = calendarFactory.getFirstDayOfSpecificMonth(intMonth, intYear);

		GetCalendarDays();
		GetFinancials(true);
	}

	function ChangeDay(objDay) {
		if(objDay.isActiveButton) {
			var intSelectedDay = parseInt(objDay.day);
			var intSelectedDayIndex = intSelectedDay - 1;

			$scope.dateSelected = calendarFactory.formatDate(calendarFactory.getMomentOfSpecificDate($scope.dateSelected).date(intSelectedDay));
			objDay.isActive = true;

			$scope.totalToReconcileForDay = $scope.days[intSelectedDayIndex].toReconcile;
			$scope.totalToProcessForDay = $scope.days[intSelectedDayIndex].toProcess;
			$scope.totalConciliedForDay = $scope.days[intSelectedDayIndex].concilied;

			if(intSelectedDayIndex != $scope.lastDaySelectedIndex) {
				$scope.days[$scope.lastDaySelectedIndex].isActive = false;
				GetFinancials(true);
			}

			$scope.lastDaySelectedIndex = intSelectedDay - 1;
			$scope.concilieQuantity = 0;
		}
	}

	function CalendarInit() {
		$scope.months = [];
		$scope.days = [];
		$scope.lastDaySelectedIndex = 0;
		$scope.activeMonth = (calendarFactory.getMonthNumberOfDate($scope.dateSelected) - 1);

		var objMomentjs = moment();
		var arrMonths = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
		var intInitialDayOfMonth = calendarFactory.getDayOfMonth(calendarFactory.getFirstDayOfMonth());
		var bolIsActive = false;

		for(var intIndex = 0; intIndex < 12; intIndex++){
			if ($scope.dateSelected != null) {
				$scope.months.push({month: arrMonths[intIndex], active: (intIndex + 1) == calendarFactory.getMonthNumberOfDate($scope.dateSelected)});
			} else {
				$scope.months.push({month: arrMonths[intIndex], active: (intIndex + 1) == (objMomentjs.month()+1)});
			}
		}

		for(intInitialDayOfMonth; intInitialDayOfMonth <= 31; intInitialDayOfMonth++){
			if(intInitialDayOfMonth == calendarFactory.getDayOfMonth(calendarFactory.getYesterdayDate())){
				bolIsActive = true;
			}else{
				bolIsActive = false;
			}
			$scope.days.push({
				date:new Date(moment(intInitialDayOfMonth + "/" + (objMomentjs.month()+1) + "/" + objMomentjs.year(), calendarFactory.getFormat())),
				day: (intInitialDayOfMonth < 10 ? "0"+intInitialDayOfMonth : intInitialDayOfMonth),
				totalToReconcile: 0,
				totalConcilied: 0,
				totalToProcess: 0,
				totalAmountToReconcile: 0,
				totalAmountConcilied: 0,
				totalAmountToProcess: 0,
				isActive: bolIsActive,
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
		var objDate = $scope.dateSelected;
		var intFirstDayOfMonth = calendarFactory.getFirstDayOfMonth(objDate);
		var intLastDayOfMonth = calendarFactory.getLastDayOfMonth(objDate);
		var intLastDay = calendarFactory.getDayOfMonth(intLastDayOfMonth) - 1;

		$scope.totalToReconcileForDay = 0;
		$scope.totalConciliedForDay = 0;
		$scope.totalToProcessForDay = 0;

		var arrShopIds = [];
		var arrCardProductIds = [];

		if($scope.settlementsSelected) {
			for(var objItem in $scope.settlementsSelected) {
				arrShopIds.push($scope.settlementsSelected[objItem].id);
			}
		}

		if($scope.productsSelected) {
			for(var objItem in $scope.productsSelected) {
				arrCardProductIds.push($scope.productsSelected[objItem].id);
			}
		}

		TransactionConciliationService.ListTransactionConciliationByFilter({
			currency: 'BRL',
			startDate: calendarFactory.formatDateForService(intFirstDayOfMonth),
			endDate: calendarFactory.formatDateForService(intLastDayOfMonth),
			cardProductIds: arrCardProductIds.join(','),
			shopIds: arrShopIds.join(','),
			groupBy: 'DAY',
			size: 31
		}).then(function(objData){
			var objData = objData.data.content;
			var arrDays = [];

			for(var objItem in objData){

				if(typeof objData[objItem] === 'object') {
					arrDays.push(objData[objItem]);

				} else {
					break;
				}
			}

			// limpa dias atuais
			for(intIndex in $scope.days){
				$scope.days[intIndex].oneItem = true;
				$scope.days[intIndex].isActive = false;
				$scope.days[intIndex].isActiveButton = false;
				$scope.days[intIndex].toReconcile = 0;
				$scope.days[intIndex].toProcess = 0;
				$scope.days[intIndex].concilied = 0;

				for(intIndex in $scope.days){
					if(intIndex > intLastDay) {
						$scope.days[intIndex].show = false;
					} else {
						$scope.days[intIndex].show = true;
					}
				}
			}

			for(var intDay in arrDays) {
				var intIndex = arrDays[intDay].date.split("-")[2] - 1;
				var objItem = arrDays[intDay];
				var bolOneItemFlag = Boolean(objItem.transctionToConcilieQuantity) + Boolean(objItem.transctionUnprocessedQuantity) + Boolean(objItem.transctionConciliedQuantity);
				if($scope.days[intIndex]) {
					$scope.days[intIndex].isActiveButton = true;
					$scope.days[intIndex].isActive = false;
					$scope.days[intIndex].toReconcile = objItem.transctionToConcilieQuantity;
					$scope.days[intIndex].toProcess = objItem.transctionUnprocessedQuantity;
					$scope.days[intIndex].concilied = objItem.transctionConciliedQuantity;

					if(bolOneItemFlag > 1) {
						$scope.days[intIndex].oneItem = false;
					}
				}
			}

			var intActualDayIndex = calendarFactory.getDayOfMonth($scope.dateSelected) - 1;
			$scope.days[intActualDayIndex].isActiveButton = true;
			$scope.days[intActualDayIndex].isActive = true;
			$scope.lastDaySelectedIndex = intActualDayIndex;

			$scope.totalToReconcileForDay = $scope.days[intActualDayIndex].toReconcile || 0;
			$scope.totalToProcessForDay = $scope.days[intActualDayIndex].toProcess || 0;
			$scope.totalConciliedForDay = $scope.days[intActualDayIndex].concilied || 0;

		});
	}

	function UpdateFilterByStatus(status) {
		$scope.statusSelected = status;
		GetFinancials();

	}

	function GetFinancials(bolCache, strOrder) {

		var objDate = $scope.dateSelected;
		var objStartDate = calendarFactory.formatDateForService(objDate);
		var objEndDate = calendarFactory.formatDateForService(objDate);
		var intTypes = $scope.natureza;
		var arrShopIds = [];
		var arrCardProductIds = [];

		$scope.concilieItems = [];
		$scope.isConcilieButtonActive = false;
		$scope.monthSelected = calendarFactory.getNameOfMonth($scope.dateSelected);

		if($scope.settlementsSelected) {
			for(var intItem in $scope.settlementsSelected) {
				arrShopIds.push($scope.settlementsSelected[intItem].id);
			}
		}

		if($scope.productsSelected) {
			for(var intItem in $scope.productsSelected) {
				arrCardProductIds.push($scope.productsSelected[intItem].id);
			}
		}

		objFilter = {
			currency: 'BRL',
			startDate: objStartDate,
			endDate: objEndDate,
			shopIds: arrShopIds.join(','),
			cardProductIds: arrCardProductIds.join(','),
			conciliationStatus: $scope.conciliationStatus[$scope.statusSelected],
            groupBy: 'CARD_PRODUCT,CONCILIATION_STATUS,ACQUIRER'
		};

		if(strOrder) {
			objFilter.sort = strOrder;
		}

		if(intTypes != 0) {
			objFilter.types = intTypes;
		}

		if(bolCache) {
			cacheService.SaveFilter({
				startDate: objDate,
				endDate: objDate,
				conciliationStatus: $scope.statusSelected,
				types: objFilter.types || false,
				settlementsSelected: $scope.settlementsSelected,
				productsSelected: $scope.productsSelected
			}, 'sales');
		}

		$scope.items = [];

		TransactionSummaryService.ListTransactionSummaryByFilter(objFilter).then(function(objData){
			objData = objData.data.content;
			var arrItems = [];
			for(var intItem in objData){
				if(typeof objData[intItem] === 'object') {
					arrItems.push(objData[intItem]);
				} else {
					break;
				}
			}

			if(arrItems.length){
				$scope.items = arrItems;
				$scope.noItensMsg = false;
			} else {
				$scope.items = [];
				$scope.noItensMsg = true;
			}

		});
	}

	function ShowDetails(intAcquirer, intCardProduct) {
		var objSelected = $scope.dateSelected;

        $rootScope.salesDetails = {};
		$rootScope.salesDetails.currency = "BRL";
		$rootScope.salesDetails.startDate = objSelected;
		$rootScope.salesDetails.endDate = objSelected;
		$rootScope.salesDetails.shopIds = $scope.settlementsSelected;
		$rootScope.salesDetails.cardProductIds = $scope.productsSelected;
		$rootScope.salesDetails.natureza = $scope.natureza;
		$rootScope.salesDetails.conciliationStatus = $scope.conciliationStatus[$scope.statusSelected];
		$rootScope.salesDetails.acquirer = intAcquirer;
		$rootScope.salesDetails.cardProduct = intCardProduct;

		$location.path('sales/details');
	}

	function Concilie() {
		$scope.confirm = true;
		$scope.success = false;
		if($scope.concilieItems.length) {
			$uibModal.open ({
				templateUrl: "app/views/resumo-conciliacao/confirma-conciliacao-resumo.html",
				scope: $scope,
				animation: false,
				controller: function($scope, $uibModalInstance, $timeout) {
					$scope.ok = function(data) {
						var arrIds = [];

						for(var intItem in $scope.concilieItems) {
							for(var intSubItem in $scope.concilieItems[intItem])	{
								arrIds.push($scope.concilieItems[intItem][intSubItem]);
							}
						}

						var objDate = $scope.dateSelected;
						var arrShopIds = [];
						var arrCardProductIds = [];
						var arrAcquirers = [];

						if($scope.settlementsSelected) {
							for(var intItem in $scope.settlementsSelected) {
								arrShopIds.push($scope.settlementsSelected[intItem].id);
							}
						}

						for(var intItem in $scope.concilieItems) {
							var bolFlag = false;
							for(var intIndex in arrCardProductIds) {
								if($scope.concilieItems[intItem].cardProduct.id === arrCardProductIds[intIndex]){
									bolFlag = true;
								}
							}
							if(!bolFlag){
								arrCardProductIds.push($scope.concilieItems[intItem].cardProduct.id);
							}
						}

						for(var intItem in $scope.concilieItems) {
							var bolFlag = false;
							for(var intIndex in arrAcquirers) {
								if($scope.concilieItems[intItem].acquirer.id === arrAcquirers[intIndex]){
									bolFlag = true;
								}
							}
							if(!bolFlag){
								arrAcquirers.push($scope.concilieItems[intItem].acquirer.id);
							}
						}

						objFilter = {
							currency: $rootScope.currency,
							startDate: calendarFactory.formatDateForService(objDate),
							endDate: calendarFactory.formatDateForService(objDate),
							types: $scope.natureza,
							shopIds: arrShopIds,
							cardProductIds: arrCardProductIds,
							acquirerIds: arrAcquirers
						}

						if(!objFilter.types){
							delete objFilter.types;
						}

						TransactionService.ConcilieTransactions(objFilter).then(function(data){
							$scope.concilieItems = [];
							$scope.items = [];

							Init();
							$scope.confirm = false;
							$scope.success = true;

						}).catch(function(response) {
                            $uibModalInstance.close();
			            });
					}
					$scope.cancel = function(data) {
						$uibModalInstance.close();
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

	function SelectItemToConcilie(objItem) {
		if($scope.concilieItems.length){
			var bolFlag = false;
			for(var intIndex in $scope.concilieItems) {
				if($scope.concilieItems[intIndex].$$hashKey == objItem.$$hashKey) {
					bolFlag = true;
					$scope.concilieItems.splice(intIndex, 1);
				}
			}
			if(!bolFlag){
				$scope.concilieItems.push(objItem);
			}
		} else {
			$scope.concilieItems.push(objItem);
		}

		if($scope.concilieItems.length) {
			$scope.isConcilieButtonActive = true;
		} else {
			$scope.isConcilieButtonActive = false;
		}

		$scope.concilieQuantity = 0;
		for(var intIndex in $scope.concilieItems) {
			$scope.concilieQuantity += $scope.concilieItems[intIndex].quantity;
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

			var arrProductsSelected = cacheService.LoadFilter('productsSelected');
			var arrSettlementsSelected = cacheService.LoadFilter('settlementsSelected');

			if(arrProductsSelected) {
				for(var intItem in arrProductsSelected) {
					advancedFilterService.AddProductsSearch(arrProductsSelected[intItem]);
				}
			} else {
				$scope.productsSelected = [];
			}

			if(arrSettlementsSelected) {
				for(var intItem in arrSettlementsSelected) {
					advancedFilterService.AddSettlementsSearch(arrSettlementsSelected[intItem]);
				}
			} else {
				$scope.settlementsSelected = [];
			}
		}

	}

	function SortResults(objElem, strKind) {
		var strOrderString;
		strOrderString = $rootScope.sortResults(objElem, strKind);

		GetFinancials(false, strOrderString);
	};
});
