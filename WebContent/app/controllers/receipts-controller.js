/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.movementsModule',[])

.filter('capitalize', function() {
	return function(input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
	};
})

// removendo regra de jshint: este controller será refeito
/* jshint -W071 */
.controller('receiptsController', function(menuFactory, $rootScope, $scope, calendarFactory, $location, cacheService, $window, $timeout,
		advancedFilterService, calendarService, filtersService, receiptsService, $filter, $sce, pvService){

	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.LoadParamsByFilter();

	menuFactory.setActiveMovements();

	$scope.tabs = [{},{}];
	$scope.toTrusted = ToTrusted;
    $scope.expected = [];
	$scope.receipts = [];
    $scope.getReceipt = GetReceipt;
    $scope.getFutureReceipt = GetFutureReceipt;
    $scope.actualReleases = {};
    $scope.actualReleases.date = $scope.actualReleases.date || new Date();
    $scope.actualReleases.month = calendarFactory.getMonthNameOfDate(moment($scope.actualReleases.date));
    $scope.actualReleases.day = calendarFactory.getDayOfDate($scope.actualReleases.date);
    $scope.futureReleases = {};
	$scope.futureReleases.inicialStartDate = calendarFactory.getTomorrowFromTodayToDate();
	$scope.futureReleases.datepickerIsOpen = false;

    $scope.futureReleases.modelDate = [];
    GetCachedData();

    var objFutureModelDateFirst = $scope.futureReleases.modelDate[0] || calendarFactory.getTomorrowFromTodayToDate();
    var objFutureModelDateLast = $scope.futureReleases.modelDate[1] || calendarFactory.getLastDayOfPlusMonthToDate(objFutureModelDateFirst, 1);
    $scope.futureReleases.modelDate = [objFutureModelDateFirst, objFutureModelDateLast];
    $scope.futureReleases.objFutureMinDate = calendarFactory.getTomorrowFromTodayToDate();
    $scope.futureReleases.objFutureMaxDate = calendarFactory.addYearsToDate($scope.futureReleases.objFutureMinDate, 1, true);

    $scope.futureReleases.startDate = $scope.futureReleases.modelDate[0];
    $scope.futureReleases.endDate = $scope.futureReleases.modelDate[1];
    $scope.futureReleases.startDateDay = calendarFactory.getDayOfDate($scope.futureReleases.modelDate[0]);
    $scope.futureReleases.startDateMonth = calendarFactory.getMonthNameAbreviation(moment($scope.futureReleases.modelDate[0]));
    $scope.futureReleases.startDateYear = calendarFactory.getYearOfDate($scope.futureReleases.modelDate[0]);
    $scope.futureReleases.endDateDay = calendarFactory.getDayOfDate($scope.futureReleases.modelDate[1]);
    $scope.futureReleases.endDateMonth = calendarFactory.getMonthNameAbreviation(moment($scope.futureReleases.modelDate[1]));
    $scope.futureReleases.endDateYear = calendarFactory.getYearOfDate($scope.futureReleases.modelDate[1]);

	$scope.date = new Date();
	$scope.minDate = new Date();
	$scope.accountsModel = [];
	$scope.accountsFutureModel = [];
	$scope.accountsData = [];
	$scope.cardProductsModel = [];
	$scope.cardProductsFutureModel = [];
	$scope.cardProductsData = [];
	$scope.shopsData = [];
	$scope.shopIds = [];
	$scope.acquirersModel = [];
	$scope.acquirersFutureModel = [];
	$scope.acquirersData = [];
	$scope.accountsLabel = null;
	$scope.cardProductsLabel = null;
	$scope.cardProductsFullLabel = "";
	$scope.shopsLabel = null;
	$scope.shopsFullLabel = "";
	$scope.accountsFutureLabel = null;
	$scope.cardProductsFutureLabel = null;
	$scope.cardProductsFutureFullLabel = "";
	$scope.shopsFutureLabel = null;
	$scope.shopsFutureFullLabel = "";
	$scope.clearShopFilter = ClearShopFilter;
	$scope.clearCardProductsFilter = ClearCardProductsFilter;
	$scope.totalToReceive = 0;
	$scope.discountedTotal = 0;
	$scope.antecipatedTotal = 0;
	$scope.totalReceived = 0;
    $scope.showDetails = ShowDetails;
    $scope.changeTab = ChangeTab;
	$scope.existsForethought = false;
    $scope.actualReleasesData = [];
    $scope.futureReleasesData = [];
    $scope.timelineExpectedAmount = [];
    $scope.customTimelineExpectedAmount = [];
	var arrActualReleasesData = [];
    var arrFutureReleasesData = [];
	$scope.pvsGroupsModel = [];
    var intFilterStatus = 0;
    $scope.filter = {};
    $scope.filter.shopsModel = [];
    $scope.filter.shopsFutureModel = [];

	$scope.$watch('futureReleases.startDate', function(objResponse) {
		if(moment($scope.futureReleases.modelDate[1]).isBefore(objResponse)) {
			$scope.futureReleases.modelDate[1] = calendarFactory.getLastDayOfPlusMonthToDate($scope.futureReleases.modelDate[0], 1);
		}
	});

	Init();

	function Init() {
		$scope.todayDate = calendarFactory.getToday();
		$scope.actualReleases.date = $scope.actualReleases.date || calendarFactory.getToday();
        GetFilters();
		GetPvsGroups();
	}

	function GetPvsGroups() {

		pvService.getGroups().then(function (objRes) {
			$scope.pvsGroupsModel = objRes.data;
		});

	}

	function ToTrusted(htmlCode) {
		return $sce.trustAsHtml(htmlCode);
	}

    function GetReceipt() {

		arrActualReleasesData = [];
		$scope.actualReleases.month = calendarFactory.getMonthNameOfDate(moment($scope.actualReleases.date));
    	$scope.actualReleases.day = calendarFactory.getDayOfDate($scope.actualReleases.date);

		SaveFilters();
		GetLabels();
		GetSummaries();
		GetReceiptAcquirers();
		GetForethought();
    }

	function GetReceiptAcquirers() {

		var objFilter = {
			startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			groupBy: 'ACQUIRER',
			bankAccountIds: GetAccountsFilter(),
			shopIds: GetShopsFilter(),
			acquirerIds: GetAcquirersFilter(),
			cardProductIds: GetCardProductsFilter(),
			status: 'RECEIVED,FORETHOUGHT'
		};


		receiptsService.GetFinancials(objFilter).then(function(objResponse) {
			var objData = objResponse.data;

			if( objData.length ) {

				for(var intIndex in objData) {
					if(objData.hasOwnProperty(intIndex)){
						arrActualReleasesData.push(objData[intIndex]);
					}
				}

				GetReceiptReleases();
				GetOtherReleases();
				GetExpectedReleases();
			} else {
				$scope.actualReleasesData = [];
			}

		}).catch(function() {
			console.log('[receiptsController:getSummaries] error');
			// TODO: impleentar erro
		});
	}

	function GetTimeline(objResponse) {
		var objStartDate = moment().add(1, 'days');
		var objEndDate = moment(objStartDate).add(1, 'years');

		var objFilter = {
			startDate: calendarFactory.formatDateTimeForService(objStartDate),
			endDate: calendarFactory.formatDateTimeForService(objEndDate),
			bankAccountIds: GetAccountsFilter(true),
			shopIds: GetShopsFilter(true),
			acquirerIds: GetAcquirersFilter(true),
			cardProductIds: GetCardProductsFilter(true),
			status: 'EXPECTED'
		};

		receiptsService.getTimeline(objFilter).then(function(response){
			$scope.timelineExpectedAmount = response.data.content[0];
			$scope.customTimelineExpectedAmount = objResponse.data.content[0];
			$scope.customTimelineExpectedAmount.percentage = $scope.customTimelineExpectedAmount.expectedAmount / $scope.timelineExpectedAmount.expectedAmount * 100;
			if(isNaN($scope.customTimelineExpectedAmount.percentage)) {
				$scope.customTimelineExpectedAmount.percentage = 0;
			}
			$scope.customTimelineExpectedAmount.maxDateRange = GetFutureMaxDateRange();
		});
	}

	function GetForethought() {

		var objFilter = {
			startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			bankAccountIds: GetAccountsFilter(),
			status: 'EXPECTED,SUSPENDED,PAWNED,BLOCKED,PAWNED_BLOCKED'
		};

		receiptsService.GetFinancials(objFilter).then(function(objResponse) {
			var objData = objResponse.data;

			if( objData.length ) {
				$scope.existsForethought = true;
			} else {
				$scope.existsForethought = false;
			}

		}).catch(function() {
			console.log('[receiptsController:getSummaries] error');
			// TODO: implementar erro
		});
	}

	function GetReceiptReleases() {

		for(var intIndex in arrActualReleasesData){
			if(arrActualReleasesData.hasOwnProperty(intIndex)) {
				var objFilter = {
					startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
					endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
					groupBy: 'ACQUIRER,CARD_PRODUCT,STATUS',
					bankAccountIds: GetAccountsFilter(),
					shopIds: GetShopsFilter(),
					acquirerIds: arrActualReleasesData[intIndex].acquirer.id,
					cardProductIds: GetCardProductsFilter(),
					status: 'RECEIVED,FORETHOUGHT'
				};

				// removendo regra de jshint: este controller será refeito
				/* jshint -W074 */
				receiptsService.GetFinancials(objFilter).then(function(objResponse) {
					var intAcquirerId = null;
					var objData = objResponse.data;
					var arrReleases = [];
					var objItem = {};
					var intIndex;

					for(intIndex in objData) {
						if(objData.hasOwnProperty(intIndex)) {
							intAcquirerId = objData[intIndex].acquirer.id;
							var strStatus = objData[intIndex].status.toLowerCase(),
								strDescription = objData[intIndex].description.toLowerCase(),
								objCardProduct = objData[intIndex].cardProduct;
								objCardProduct.forethought = false;

							if (strStatus === "forethought") {
								objCardProduct.name = "ANTECIPAÇÃO " + objCardProduct.name;
								objCardProduct.forethought = true;
							}

							if(arrReleases.length) {
								var bolInsert = true;
								for(var intIndexb in arrReleases){
									if((arrReleases[intIndexb].cardProductId === objData[intIndex].cardProduct.id) && (arrReleases[intIndexb].status === strStatus)){
										arrReleases[intIndexb].releases.push({
											type: strDescription,
											payedAmount: strDescription === "vendas" ? objData[intIndex].expectedAmount : objData[intIndex].payedAmount
										});
										bolInsert = false;
										break;
									}
								}
								if(bolInsert) {
										objItem = {
											cardProductName: objCardProduct.name,
											cardProductId: objCardProduct.id,
											forethought: objCardProduct.forethought,
											status: strStatus,
											description: strDescription,
											sales: 0,
											cancellation: 0,
											adjusts: 0,
											releases: [],
											total: 0
										};

										if(strDescription === "vendas") {
											objItem.total = objData[intIndex].payedAmount;

											objItem.releases.push({
												type: 'vendas',
												payedAmount: objData[intIndex].expectedAmount
											});
										} else if(strDescription === "cancelamentos") {
		                                    objItem.total = objData[intIndex].payedAmount;
											objItem.releases.push({
												type: 'cancelamentos',
												payedAmount: objData[intIndex].payedAmount
											});
										} else if(strDescription === "ajustes") {
		                                    objItem.total = objData[intIndex].payedAmount;
											objItem.releases.push({
												type: 'ajustes',
												payedAmount: objData[intIndex].payedAmount
											});
										}

										arrReleases.push(objItem);
								}

							} else {
								objItem = {
									cardProductName: objCardProduct.name,
									cardProductId: objCardProduct.id,
									forethought: objCardProduct.forethought,
									status: strStatus,
									description: strDescription,
									sales: 0,
									cancellation: 0,
									adjusts: 0,
									releases: [],
									total: 0
								};

								if(strDescription === "vendas") {
									objItem.total = objData[intIndex].payedAmount;
									objItem.releases.push({
										type: 'vendas',
										payedAmount: objData[intIndex].expectedAmount
									});
								} else if(strDescription === "cancelamentos") {
		                            objItem.total = objData[intIndex].payedAmount;
									objItem.releases.push({
										type: 'cancelamentos',
										payedAmount: objData[intIndex].payedAmount
									});
								} else if(strDescription === "ajustes") {
		                            objItem.total = objData[intIndex].payedAmount;
									objItem.releases.push({
										type: 'ajustes',
										payedAmount: objData[intIndex].payedAmount
									});
								}

								arrReleases.push(objItem);
							}
						}
					}

					for(intIndex in arrActualReleasesData) {
						if(arrActualReleasesData.hasOwnProperty(intIndex)) {
							if(intAcquirerId === arrActualReleasesData[intIndex].acquirer.id){
								arrActualReleasesData[intIndex].cardProducts = arrReleases;
								break;
							}
						}
					}

					$scope.actualReleasesData = arrActualReleasesData;
				}).catch(function(){
					console.log('[receiptsController:getSummaries] error');
				});
			}
		}
	}

	function GetOtherReleases(intAcquirerId) {

		for(var intIndex in arrActualReleasesData){
			if(arrActualReleasesData.hasOwnProperty(intIndex)) {
				intAcquirerId = arrActualReleasesData[intIndex].acquirer.id;

				var objFilter = {
					startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
					endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
					bankAccountIds: GetAccountsFilter(),
					shopIds: GetShopsFilter(),
					acquirerIds: intAcquirerId,
					status: 'RECEIVED',
					types: 'OTHER',
					groupBy: 'TYPE,DESCRIPTION'
				};

				receiptsService.GetAdjusts(objFilter).then(function(objResponse){
						var objData = objResponse.data.content;
						var intTotal = 0;

						for(var objItem in objData) {
							if(objData.hasOwnProperty(objItem)) {
								intTotal += objData[objItem].amount;
							}
						}

						arrActualReleasesData[intIndex].otherReleasesTotal = intTotal;
						arrActualReleasesData[intIndex].otherReleases = objData;
				}).catch(function(){
					console.log('[receiptsController:getOtherReleases] error');
				});
			}
		}
	}

	function GetExpectedReleases() {
		for(var intIndex in arrActualReleasesData){
			if(arrActualReleasesData.hasOwnProperty(intIndex)) {
				var intAcquirerId = arrActualReleasesData[intIndex].acquirer.id;

				var objFilter = {
					startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
					endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
					bankAccountIds: GetAccountsFilter(),
					shopIds: GetShopsFilter(),
					acquirerIds: intAcquirerId,
					cardProductIds: GetCardProductsFilter(),
					status: 'EXPECTED',
					groupBy: 'CARD_PRODUCT'
				};

				receiptsService.GetFinancials(objFilter).then(function(objResponse){
						var objData = objResponse.data;
						var intTotal = 0;

						for(var objItem in objData) {
							if(objData.hasOwnProperty(objItem)) {
								intTotal += objData[objItem].expectedAmount;
							}
						}

						arrActualReleasesData[intIndex].expectedReleasesTotal = intTotal;
						arrActualReleasesData[intIndex].expectedReleases = objData;
				}).catch(function(){
					console.log('[receiptsController:getExpectedReleases] error');
					// TODO: implementar erro
				});
			}
		}
	}

	function GetSummaries() {
		var objFilter = {
			startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			status: 'RECEIVED',
			bankAccountIds: GetAccountsFilter(),
			shopIds: GetShopsFilter(),
			acquirerIds: GetAcquirersFilter(),
			cardProductIds: GetCardProductsFilter()
		};

		var objFilterOthers = {
			startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			status: 'RECEIVED',
			types: 'OTHER',
			bankAccountIds: GetAccountsFilter(),
			shopIds: GetShopsFilter(),
			acquirerIds: GetAcquirersFilter(),
		};

		receiptsService.GetFinancials(objFilter).then(function(objResponse) {
			var objData = objResponse.data;
			var intTotalToReceive = 0;
			var intDiscountedTotal = 0;
			var intTotalReceived = 0;
			var intOthers = 0;
			var intDiscount = 0;

			for(var intIndex in objData) {
				if(objData.hasOwnProperty(intIndex)) {
					if(objData[intIndex].description === 'vendas') {
						intTotalToReceive = objData[intIndex].expectedAmount;
						intTotalReceived = objData[intIndex].payedAmount;
					}

					if(objData[intIndex].description === 'ajustes' || objData[intIndex].description === 'cancelamentos') {
						intDiscountedTotal += objData[intIndex].payedAmount;
					}
				}
			}


			objFilter.status = 'FORETHOUGHT';
			receiptsService.GetFinancials(objFilter).then(function(objResponse) {
				var objData = objResponse.data;
				var intAntecipatedTotal = 0;
				for(var intIndex in objData) {
					if(objData[intIndex].description === 'vendas') {
						intAntecipatedTotal = objData[intIndex].payedAmount;
						intDiscountedTotal += (objData[intIndex].expectedAmount - objData[intIndex].payedAmount) *-1;
					}
				}

				receiptsService.GetAdjusts(objFilterOthers).then(function(objResponseAdjusts) {
					intOthers = 0;

					// amount soma em totais descontados
					var objData = objResponseAdjusts.data.content;
					for(var intIndex in objData) {
						if(objData.hasOwnProperty(intIndex)) {
							intOthers += objData[intIndex].amount;
						}
					}

					intDiscount = intDiscountedTotal + intOthers;

					$scope.totalToReceive = intTotalToReceive;
					$scope.discountedTotal = intDiscount;
					$scope.antecipatedTotal = intAntecipatedTotal;
					$scope.totalReceived = intTotalToReceive + intDiscount + intAntecipatedTotal;
					$scope.getDiscountedSignal = GetDiscountedSignal;
					$scope.getDiscountedAbs = GetDiscountedAbs;
					$scope.getClassByType = GetClassByType;

				}).catch(function() {
					console.log('[receiptsController:getAdjusts] error');
				});

			}).catch(function() {
				console.log('[receiptsController:getFinancials] status forethought error');
			});

		}).catch(function() {
			console.log('[receiptsController:getFinancials] error');
		});
	}

	function GetClassByType(strType, intAmount) {
		if (strType.startsWith("cancelamentos")) {
			return "cancelamentos";
		} else if(strType !== "ajustes") {
			return strType;
		} else if (intAmount > 0) {
			return "ajustes-credito";
		} else {
			return "ajustes-debito";
		}
	}

	function GetDiscountedSignal(intDiscountedTotal) {
		if (intDiscountedTotal > 0) {
			return "+";
		} else {
			return "-";
		}
	}

	function GetDiscountedAbs(intDiscountedTotal) {
		return Math.abs(intDiscountedTotal);
	}

	function GetDateLabel(bolHasBr) {

		var strBr = "";
		if(bolHasBr) {
			strBr = "<br>";
		}

		return $scope.futureReleases.startDateDay + " " + $scope.futureReleases.startDateMonth + " " +
		$scope.futureReleases.startDateYear + strBr + " a " + $scope.futureReleases.endDateDay +  " " +
		$scope.futureReleases.endDateMonth + " " + $scope.futureReleases.endDateYear;

	}

	function GetFutureReceipt() {

		arrFutureReleasesData = [];

        var objFutureModelDateFirst = $scope.futureReleases.modelDate[0] || calendarFactory.getTomorrowFromTodayToDate();
        var objFutureModelDateLast = $scope.futureReleases.modelDate[1] || calendarFactory.getLastDayOfPlusMonthToDate(objFutureModelDateFirst, 1);
        $scope.futureReleases.modelDate = [objFutureModelDateFirst, objFutureModelDateLast];
        $scope.futureReleases.objFutureMinDate = calendarFactory.getTomorrowFromTodayToDate();
        $scope.futureReleases.objFutureMaxDate = calendarFactory.addYearsToDate($scope.futureReleases.objFutureMinDate, 1, true);

        $scope.futureReleases.startDate = $scope.futureReleases.modelDate[0];
        $scope.futureReleases.endDate = $scope.futureReleases.modelDate[1];
        $scope.futureReleases.startDateDay = calendarFactory.getDayOfDate($scope.futureReleases.modelDate[0]);
        $scope.futureReleases.startDateMonth = calendarFactory.getMonthNameAbreviation(moment($scope.futureReleases.modelDate[0]));
        $scope.futureReleases.startDateYear = calendarFactory.getYearOfDate($scope.futureReleases.modelDate[0]);
        $scope.futureReleases.endDateDay = calendarFactory.getDayOfDate($scope.futureReleases.modelDate[1]);
        $scope.futureReleases.endDateMonth = calendarFactory.getMonthNameAbreviation(moment($scope.futureReleases.modelDate[1]));
        $scope.futureReleases.endDateYear = calendarFactory.getYearOfDate($scope.futureReleases.modelDate[1]);

		$scope.futureReleases.dateRange = GetDateLabel();
		$scope.futureReleases.dateRangeWithBr = GetDateLabel(true);

		var strInitialDay = moment($scope.futureReleases.modelDate[0]);
		var strFinalDay = moment($scope.futureReleases.modelDate[1]);

		$scope.countDiffDays = strFinalDay.diff(strInitialDay, 'days');

		SaveFilters();
		GetLabels(true);
		GetFutureAcquirers();

		var objFilter = {
			startDate:calendarFactory.formatDateTimeForService($scope.futureReleases.modelDate[0]),
			endDate: calendarFactory.formatDateTimeForService($scope.futureReleases.modelDate[1]),
			bankAccountIds: GetAccountsFilter(true),
			shopIds: GetShopsFilter(true),
			acquirerIds: GetAcquirersFilter(true),
			cardProductIds: GetCardProductsFilter(true),
			status: 'EXPECTED'
		};

		receiptsService.getTimeline(objFilter).then(function(objResponse) {
			GetTimeline(objResponse);
		});

	}

	function GetFutureMaxDateRange() {
		var strDateDay;
		var strDateMonth;
		var strDateYear;
		var objMaxDate;

		objMaxDate = calendarFactory.getActualDateOfNextYear();
		strDateDay = calendarFactory.getDayOfDate(objMaxDate);
		strDateMonth = calendarFactory.getMonthNameAbreviation(objMaxDate);
		strDateYear = calendarFactory.getYear(objMaxDate);

		return "até " + strDateDay + " " + strDateMonth + " " + strDateYear;
	}

	function GetFutureAcquirers() {
		var objFilter = {
			startDate: calendarFactory.formatDateTimeForService($scope.futureReleases.modelDate[0]),
			endDate: calendarFactory.formatDateTimeForService($scope.futureReleases.modelDate[1]),
			groupBy: 'ACQUIRER',
			bankAccountIds: GetAccountsFilter(true),
			shopIds: GetShopsFilter(true),
			acquirerIds: GetAcquirersFilter(true),
			cardProductIds: GetCardProductsFilter(true),
			status: 'EXPECTED'
		};

		receiptsService.GetFinancials(objFilter).then(function(objResponse) {
			var objData = objResponse.data;

			if( objData.length ) {
				for(var intIndex in objData) {
					if(objData.hasOwnProperty(intIndex)) {
						arrFutureReleasesData.push(objData[intIndex]);
					}
				}
				GetFutureReceiptReleases();
			} else {
				$scope.futureReleasesData = [];
			}

		}).catch(function() {
			console.log('[receiptsController:getFutureAcquirers] error');
			// TODO: implementar erro
		});
	}

	function GetFutureReceiptReleases() {

		for(var intIndex in arrFutureReleasesData){
			if(arrFutureReleasesData.hasOwnProperty(intIndex)) {
				var intAcquirerId = null;

				var objFilter = {
					startDate: calendarFactory.formatDateTimeForService($scope.futureReleases.modelDate[0]),
					endDate: calendarFactory.formatDateTimeForService($scope.futureReleases.modelDate[1]),
					groupBy: 'ACQUIRER,CARD_PRODUCT,STATUS',
					bankAccountIds: GetAccountsFilter(true),
					shopIds: GetShopsFilter(true),
					acquirerIds: arrFutureReleasesData[intIndex].acquirer.id,
					cardProductIds: GetCardProductsFilter(true),
					status: 'EXPECTED'
				};

				// removendo regra de jshint: este controller será refeito
				/* jshint -W074 */
				receiptsService.GetFinancials(objFilter).then(function(objResponse) {
					var objData = objResponse.data;
					var arrReleases = [];
					var objItem = {};

					for( var intIndex in objData) {
						if(objData.hasOwnProperty(intIndex)) {
							intAcquirerId = objData[intIndex].acquirer.id;
							var strStatus = objData[intIndex].status.toLowerCase(),
								description = objData[intIndex].description.toLowerCase(),
								cardProduct = objData[intIndex].cardProduct;

							if(arrReleases.length) {
								for(var intIndexb in arrReleases){
									if((arrReleases[intIndexb].cardProductId === objData[intIndex].cardProduct.id) && (arrReleases[intIndexb].status === status)){

									} else {
										objItem = {
											cardProductName: cardProduct.name,
											cardProductId: cardProduct.id,
											status: strStatus,
											description: description,
											sales: 0,
											cancellation: 0,
											adjusts: 0,
											releases: []
										};

										// removendo regra de jshint: este controller será refeito
										/* jshint -W073 */
										if(description === "vendas") {
											objItem.releases.push({
												type: 'vendas',
												expectedAmount: objData[intIndex].expectedAmount
											});
										} else if(description === "cancelamentos") {
											objItem.releases.push({
												type: 'cancelamentos',
												expectedAmount: objData[intIndex].expectedAmount
											});
										} else if(description === "ajustes") {
											objItem.releases.push({
												type: 'ajustes',
												expectedAmount: objData[intIndex].expectedAmount
											});
										}

										arrReleases.push(objItem);
										break;
									}
								}

							} else {
								objItem = {
									cardProductName: cardProduct.name,
									cardProductId: cardProduct.id,
									status: strStatus,
									description: description,
									sales: 0,
									cancellation: 0,
									adjusts: 0,
									releases: []
								};

								if(description === "vendas") {
									objItem.releases.push({
										type: 'vendas',
										expectedAmount: objData[intIndex].expectedAmount
									});
								} else if(description === "cancelamentos") {
									objItem.releases.push({
										type: 'cancelamentos',
										expectedAmount: objData[intIndex].expectedAmount
									});
								} else if(description === "ajustes") {
									objItem.releases.push({
										type: 'ajustes',
										expectedAmount: objData[intIndex].expectedAmount
									});
								}

								arrReleases.push(objItem);
							}
						}
					}

					for(intIndex in arrFutureReleasesData) {
						if(arrFutureReleasesData.hasOwnProperty(intIndex)) {
							if(intAcquirerId === arrFutureReleasesData[intIndex].acquirer.id){
								arrFutureReleasesData[intIndex].cardProducts = arrReleases;
								break;
							}
						}
					}

					$scope.futureReleasesData = arrFutureReleasesData;
				}).catch(function(){
					console.log('[receiptsController:getSummaries] error');
				});
			}
		}
	}

	function ChangeTab(intIndex) {
		if(intFilterStatus === 4) {
	    	if(intIndex === 0) {
	    		GetReceipt();
	    	} else if(intIndex === 1) {
	    		GetFutureReceipt();
	    	}
	    }
    }

	function ClearShopFilter (bolIsFuture) {
		if(bolIsFuture) {
			$scope.filter.shopsFutureModel = [];
			MakeReceiptsOrFutureReceipts(true);
		} else {
			$scope.filter.shopsModel = [];
			MakeReceiptsOrFutureReceipts(false);
		}
	}

	function ClearCardProductsFilter (bolIsFuture) {
		if(bolIsFuture) {
			$scope.cardProductsFutureModel = [];
			MakeReceiptsOrFutureReceipts(true);
		} else {
			$scope.cardProductsModel = [];
			MakeReceiptsOrFutureReceipts(false);
		}
	}

	function MakeReceiptsOrFutureReceipts(bolIsFuture) {
		if(bolIsFuture) {
			GetFutureReceipt();
		} else {
			GetReceipt();
		}
	}

  	function GetFilters() {
		// conta
		filtersService.GetAccountsOrdered(moment().tz("America/Brasilia").format("YYYY-MM-DD")).then(function(objResponse){
			var arrFilterConfig = [];
			var objData = objResponse.data;

			for(var intX in objData){
				if(objData.hasOwnProperty(intX)) {
					var obj = {};
					obj.id = objData[intX].id;
					obj.label = objData[intX].bankName + ' | ' + objData[intX].agencyNumber + ' | ' +  objData[intX].accountNumber;
					obj.bankName = objData[intX].bankName;
					obj.agencyNumber = objData[intX].agencyNumber;
					obj.accountNumber = objData[intX].accountNumber;
					obj.bankId = objData[intX].bankId;

					if (objData[intX].defaultSelection) {
						$scope.accountsModel.id = obj.id;
						$scope.accountsModel.label = obj.label;
						$scope.accountsFutureModel.id = obj.id;
						$scope.accountsFutureModel.label = obj.label;
					}

					arrFilterConfig.push(obj);
				}
			}

			$scope.accountsData = arrFilterConfig;
			intFilterStatus++;

            HandleTabs();

		}).catch(function(){
			console.log('error');
		});

		// bandeira
		filtersService.GetCardProducts().then(function(objResponse){
			var arrFilterConfig = [];
			for(var intX in objResponse.data){
					if(objResponse.data.hasOwnProperty(intX)) {
					var obj = {};
					obj.id = objResponse.data[intX].id;
					obj.label = objResponse.data[intX].name;
					arrFilterConfig.push(obj);
				}
			}
			$scope.cardProductsData = arrFilterConfig;

            intFilterStatus++;
            HandleTabs();

		}).catch(function(){
			console.log('error');
		});

		// estabelecimento
		filtersService.GetShops().then(function(objResponse){
			var arrFilterConfig = [];
			for(var intX in objResponse.data){
				if(objResponse.data.hasOwnProperty(intX)) {
					var obj = {};
					obj.id = objResponse.data[intX].id;
					obj.label = objResponse.data[intX].code;
					arrFilterConfig.push(obj);
				}
			}
			$scope.shopsData = arrFilterConfig;

            intFilterStatus++;
            HandleTabs();

		}).catch(function(){
			console.log('error');
		});

		// adquirente
		filtersService.GetAcquirers().then(function(objResponse){
			var arrFilterConfig = [];
			for(var intX in objResponse.data){
				if(objResponse.data.hasOwnProperty(intX)) {
					var obj = {};
					obj.id = objResponse.data[intX].id;
					obj.label = objResponse.data[intX].name;
					arrFilterConfig.push(obj);
				}
			}
			$scope.acquirersData = arrFilterConfig;

            intFilterStatus++;
			HandleTabs();

		}).catch(function(){
			console.log('error');
		});
	}

	function HandleTabs() {
		if( intFilterStatus === 4 ) {
			GetCachedData();
			if ($rootScope.futureSelected) {
				delete $rootScope.futureSelected;
				$scope.activeReceipts = 1;
			} else {
				GetReceipt();
			}
		}
	}

	function GetAccountsFilter(bolIsFuture) {
		var arrModel = (bolIsFuture ? $scope.accountsFutureModel : $scope.accountsModel);
		return arrModel.id;
	}

	function GetShopsFilter(bolIsFuture) {
		var arrModel = (bolIsFuture ? $scope.filter.shopsFutureModel : $scope.filter.shopsModel);
		return arrModel.map(function(objItem){
			return objItem.id;
		}).join(",");
	}

	function GetAcquirersFilter(bolIsFuture) {
		var arrModel = (bolIsFuture ? $scope.acquirersFutureModel : $scope.acquirersModel);
		return arrModel.map(function(objItem){
			return objItem.id;
		}).join(",");
	}

	function GetCardProductsFilter(bolIsFuture) {
		var arrModel = (bolIsFuture ? $scope.cardProductsFutureModel : $scope.cardProductsModel);

		if(arrModel.length === $scope.cardProductsData.length) {
			return [];
		}

		return arrModel.map(function(objItem){
			return objItem.id;
		}).join(",");
	}

	function GetAccountsLabel(bolIsFuture) {

		var arrModel = (bolIsFuture ? $scope.accountsFutureModel : $scope.accountsModel);
		var strLabel = (bolIsFuture ? $scope.accountsFutureLabel : $scope.accountsLabel);

		if( arrModel.id ) {
			strLabel = arrModel.label;
		} else {
			strLabel = null;
		}

		if(bolIsFuture) {
			$scope.accountsFutureModel = arrModel;
			$scope.accountsFutureLabel = strLabel;
		} else {
			$scope.accountsModel = arrModel;
			$scope.accountsLabel = strLabel;
		}

	}

	function GetShopsLabel(bolIsFuture) {

		var arrModel = (bolIsFuture ? $scope.filter.shopsFutureModel : $scope.filter.shopsModel);
		var strLabel = (bolIsFuture ? $scope.shopsFutureLabel : $scope.shopsLabel);

		if( arrModel.length ) {
			if( arrModel.length === 1 ) {
				strLabel = arrModel[0].label;
			} else if ( arrModel.length === $scope.shopsData.length) {
				strLabel = 'todos os estabelecimentos';
			} else {
				var intOver = arrModel.length - 1;
				strLabel = arrModel[0].label + ' + ' +  intOver + ' estabelecimento';

				if(intOver > 1) {
					strLabel = strLabel + 's';
				}
			}
		} else {
			strLabel = null;
		}

		if(bolIsFuture) {
			$scope.filter.shopsFutureModel = arrModel;
			$scope.shopsFutureLabel = strLabel;
			$scope.shopsFutureFullLabel = arrModel.map(function(objItem){
				return objItem.label;
			}).join(", ");

		} else {
			$scope.filter.shopsModel = arrModel;
			$scope.shopsLabel = strLabel;
			$scope.shopsFullLabel = arrModel.map(function(objItem){
				return objItem.label;
			}).join(", ");
		}
	}

	function GetCardProductsLabel(bolIsFuture) {
		var arrModel = (bolIsFuture ? $scope.cardProductsFutureModel : $scope.cardProductsModel);
		var strLabel = (bolIsFuture ? $scope.cardProductsFutureLabel : $scope.cardProductsLabel);

		if( arrModel.length ) {
			if( arrModel.length === $scope.cardProductsData.length ) {
				strLabel = 'todas as bandeiras';
			} else if ( arrModel.length === 1) {
				strLabel = arrModel[0].label;
			} else {
				if(arrModel.length === 2) {
					strLabel = arrModel[0].label + ' + ' +  (arrModel.length - 1) + " outra";
				} else {
					strLabel = arrModel[0].label + ' + ' +  (arrModel.length - 1) + " outras";
				}
			}
			strLabel = strLabel.toLowerCase();
		} else {
			strLabel = null;
		}

		if(bolIsFuture) {
			$scope.cardProductsFutureModel = arrModel;
			$scope.cardProductsFutureLabel = strLabel;
			$scope.cardProductsFutureFullLabel = arrModel.map(function(objItem){
				return objItem.label;
			}).join(", ");
		} else {
			$scope.cardProductsModel = arrModel;
			$scope.cardProductsLabel = strLabel;
			$scope.cardProductsFullLabel = arrModel.map(function(objItem){
				return objItem.label;
			}).join(", ");
		}

	}

	function GetLabels(bolIsFuture) {
		GetAccountsLabel(bolIsFuture);
		GetShopsLabel(bolIsFuture);
		GetCardProductsLabel(bolIsFuture);
	}

    function ShowDetails(intAcquirer, intCardProduct, intTotal, strStatus, bolDetailPage) {
        $rootScope.receiptsDetails = {};

        var dateSelected = $scope.actualReleases.date;
        $rootScope.receiptsDetails.currency = "BRL";
        $rootScope.receiptsDetails.startDate = dateSelected;
        $rootScope.receiptsDetails.endDate = dateSelected;
        $rootScope.receiptsDetails.shopIds = $scope.filter.shopsModel;
        $rootScope.receiptsDetails.products = $scope.productsSearch;
        $rootScope.receiptsDetails.shops = $scope.filter.shopsModel;
        $rootScope.receiptsDetails.cardProduct = intCardProduct;
        $rootScope.receiptsDetails.acquirer = intAcquirer;
        $rootScope.receiptsDetails.bankAccount = $scope.accountsModel;
		$rootScope.receiptsDetails.shopsLabel = $scope.shopsLabel;
		$rootScope.receiptsDetails.shopsFullLabel = $scope.shopsFullLabel;
		$rootScope.receiptsDetails.accountsLabel = $scope.accountsLabel;
		$rootScope.receiptsDetails.futureAccountsLabel = $scope.accountsFutureLabel;
		$rootScope.receiptsDetails.futureShopsLabel = $scope.shopsFutureLabel;
		$rootScope.receiptsDetails.cardProductsLabel = $scope.cardProductsLabel;
		$rootScope.receiptsDetails.cardProductsFullLabel = $scope.cardProductsFullLabel;
		$rootScope.receiptsDetails.total = intTotal;
		$rootScope.receiptsDetails.type = strStatus;

		var strRedirectUrl;
		switch (bolDetailPage) {
			case "other_details":
				strRedirectUrl = "receipts/other_details";
				break;
			case "expected_details":
				strRedirectUrl = "receipts/expected_details";
				break;
			case "forethought_details":
				strRedirectUrl = "receipts/forethought_details";
				break;
			case "future_details":
                $rootScope.receiptsDetails.shopIds = $scope.filter.shopsFutureModel;
                $rootScope.receiptsDetails.bankAccount = $scope.accountsFutureModel;
                $rootScope.receiptsDetails.startDate = $scope.futureReleases.modelDate[0];
                $rootScope.receiptsDetails.endDate = $scope.futureReleases.modelDate[1];
				$rootScope.futureReleases = {};
				$rootScope.futureReleases.dates = {
					startDateDay: $scope.futureReleases.startDateDay,
					startDateMonth: $scope.futureReleases.startDateMonth,
					startDateYear: $scope.futureReleases.startDateYear,
					endDateDay: $scope.futureReleases.endDateDay,
					endDateMonth: $scope.futureReleases.endDateMonth,
					endDateYear: $scope.futureReleases.endDateYear,
				};
				strRedirectUrl = "receipts/future_details";
				break;
			default:
				strRedirectUrl = "receipts/details";
				break;
		}
		if(strRedirectUrl) {
			$location.path(strRedirectUrl);
		}
    }

    function SaveFilters() {
    	cacheService.SaveFilter({
			startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			bankAccountIds: $scope.accountsModel,
			shopIds: $scope.filter.shopsModel,
			acquirerIds: $scope.acquirersModel,
			cardProductIds: $scope.cardProductsModel,
			futureStartDate: calendarFactory.formatDateTimeForService($scope.futureReleases.modelDate[0]),
			futureEndDate: calendarFactory.formatDateTimeForService($scope.futureReleases.modelDate[1]),
			futureBankAccountIds: $scope.accountsFutureModel,
			futureShopIds: $scope.filter.shopsFutureModel,
			futureAcquirerIds: $scope.acquirersFutureModel,
			futureCardProductIds: $scope.cardProductsFutureModel,
		}, 'receipts');
    }

    function GetCachedData() {
		if(cacheService.LoadFilter('context') === 'receipts') {
			$scope.actualReleases.date = moment(cacheService.LoadFilter('startDate'), "YYYYMMDD").toDate();
			$scope.accountsModel = cacheService.LoadFilter('bankAccountIds');

			$scope.filter.shopsModel = cacheService.LoadFilter('shopIds');
			$scope.acquirersModel = cacheService.LoadFilter('acquirerIds');
			$scope.cardProductsModel = cacheService.LoadFilter('cardProductIds');

            $scope.futureReleases.modelDate[0] = null;
            $scope.futureReleases.modelDate[1] = null;

			if($rootScope.futureSelected) {
				$scope.futureReleases.modelDate[0] = moment(cacheService.LoadFilter('futureStartDate'), "YYYYMMDD").toDate();
				$scope.futureReleases.modelDate[1] = moment(cacheService.LoadFilter('futureEndDate'), "YYYYMMDD").toDate();
				$scope.accountsFutureModel = cacheService.LoadFilter('futureBankAccountIds');
				$scope.filter.shopsFutureModel = cacheService.LoadFilter('futureShopIds');
				$scope.acquirersFutureModel = cacheService.LoadFilter('futureAcquirerIds');
				$scope.cardProductsFutureModel = cacheService.LoadFilter('futureCardProductIds');
				$scope.futureReleases.startDateMonth = calendarFactory.getMonthNameAbreviation(moment($scope.futureReleases.modelDate[0]));
				$scope.futureReleases.endDateMonth = calendarFactory.getMonthNameAbreviation(moment($scope.futureReleases.modelDate[1]));
			}
		}
    }

});
