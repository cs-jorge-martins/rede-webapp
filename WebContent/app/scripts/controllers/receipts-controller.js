/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.movementsModule',[])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/receipts', {templateUrl: 'app/views/receipts.html', controller: 'receiptsController'});
}])

.filter('capitalize', function() {
	return function(input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
	}
})

.controller('receiptsController', function(menuFactory, $rootScope, $scope, calendarFactory, $location, cacheService, $window, $timeout,
		advancedFilterService, calendarService, filtersService, receiptsService, $filter, $sce){

	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.LoadParamsByFilter();

	menuFactory.setActiveMovements();

	$scope.tabs = [{},{}];
	$scope.to_trusted = ToTrusted;
    $scope.expected = [];
	$scope.receipts = [];
    $scope.getReceipt = GetReceipt;
    $scope.getFutureReceipt = GetFutureReceipt;
    $scope.actualReleases = {};
    $scope.actualReleases.date = new Date();
    $scope.actualReleases.month = calendarFactory.getMonthNameOfDate(moment($scope.actualReleases.date));
    $scope.actualReleases.day = calendarFactory.getDayOfDate($scope.actualReleases.date);
    $scope.futureReleases = {};
    $scope.futureReleases.startDate = calendarFactory.getTomorrowFromTodayToDate();
	console.log("$scope.futureReleases.startDate", $scope.futureReleases.startDate)
    $scope.futureReleases.endDate = calendarFactory.getLastDayOfPlusMonthToDate($scope.futureReleases.startDate, 1);
    $scope.futureReleases.startDateDay = calendarFactory.getDayOfDate($scope.futureReleases.startDate);
    $scope.futureReleases.startDateMonth = calendarFactory.getMonthNameAbreviation(moment($scope.futureReleases.startDate));
    $scope.futureReleases.startDateYear = calendarFactory.getYearOfDate($scope.futureReleases.startDate);
    $scope.futureReleases.endDateDay = calendarFactory.getDayOfDate($scope.futureReleases.endDate);
    $scope.futureReleases.endDateMonth = calendarFactory.getMonthNameAbreviation(moment($scope.futureReleases.endDate));
    $scope.futureReleases.endDateYear = calendarFactory.getYearOfDate($scope.futureReleases.endDate);

	$scope.date = new Date();
	$scope.minDate = new Date();
	$scope.accountsModel = [];
	$scope.accountsFutureModel = [];
	$scope.accountsData = [];
	$scope.cardProductsModel = [];
	$scope.cardProductsFutureModel = [];
	$scope.cardProductsData = [];
	$scope.shopsModel = [];
	$scope.shopsFutureModel = [];
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
    var intFilterStatus = 0;

	$scope.$watch('futureReleases.startDate', function(objResponse) {
		if(moment($scope.futureReleases.endDate).isBefore(objResponse)) {
			$scope.futureReleases.endDate = calendarFactory.getLastDayOfPlusMonthToDate($scope.futureReleases.startDate, 1);
		}
	});

	Init();

	function Init() {
		$scope.todayDate = calendarFactory.getToday();
		$scope.actualReleases.date = calendarFactory.getToday();
        GetFilters();
		GetForethought();
		if ($rootScope.futureSelected) {
			$scope.tabs[1].active = true;
		}
	}

	function ToTrusted(html_code) {
		return $sce.trustAsHtml(html_code);
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
					arrActualReleasesData.push(objData[intIndex]);
				}

				GetReceiptReleases();
				GetOtherReleases();
				GetExpectedReleases();
			} else {
				$scope.actualReleasesData = [];
			}

		}).catch(function(objResponse) {
			console.log('[receiptsController:getSummaries] error');
		})
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
		})
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

		}).catch(function(objResponse) {
			console.log('[receiptsController:getSummaries] error');
		})
	}

	function GetReceiptReleases() {

		for(var intIndex in arrActualReleasesData){
			var intAcquirerId = arrActualReleasesData[intIndex].acquirer.id;

			var objFilter = {
				startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
				endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
				groupBy: 'CARD_PRODUCT,STATUS',
				bankAccountIds: GetAccountsFilter(),
				shopIds: GetShopsFilter(),
				acquirerIds: intAcquirerId,
				cardProductIds: GetCardProductsFilter(),
				status: 'RECEIVED,FORETHOUGHT'
			};

			receiptsService.GetFinancials(objFilter).then(function(objResponse) {
				var objData = objResponse.data;
				var arrReleases = [];

				for( var intIndex in objData) {
					var strStatus = objData[intIndex].status.toLowerCase(),
						strDescription = objData[intIndex].description.toLowerCase(),
						objCardProduct = objData[intIndex].cardProduct;
						amount = objData[intIndex].payedAmount;
						objCardProduct.forethought = false;

					if (strStatus == "forethought") {
						objCardProduct.name = "ANTECIPAÇÃO " + objCardProduct.name;
						objCardProduct.forethought = true;
					}

					if(arrReleases.length) {
						var bolInsert = true;
						for(var intIndexb in arrReleases){
							if((arrReleases[intIndexb].cardProductId === objData[intIndex].cardProduct.id) && (arrReleases[intIndexb].status === strStatus)){
								arrReleases[intIndexb].releases.push({
									type: strDescription,
									payedAmount: strDescription == "vendas" ? objData[intIndex].expectedAmount : objData[intIndex].payedAmount
								});
								bolInsert = false;
								break;
							}
						}
						if(bolInsert) {
								var objItem = {
									cardProductName: objCardProduct.name,
									cardProductId: objCardProduct.id,
									forethought: objCardProduct.forethought,
									status: strStatus,
									description: strDescription,
									sales: 0,
									cancellation: 0,
									adjusts: 0,
									releases: [],
									total: 0,
									status: strStatus
								};

								if(strDescription == "vendas") {
									objItem.total = objData[intIndex].payedAmount;

									objItem.releases.push({
										type: 'vendas',
										payedAmount: objData[intIndex].expectedAmount
									});
								} else if(strDescription == "cancelamentos") {
									objItem.releases.push({
										type: 'cancelamentos',
										payedAmount: objData[intIndex].payedAmount
									});
								} else if(strDescription == "ajustes") {
									objItem.releases.push({
										type: 'ajustes',
										payedAmount: objData[intIndex].payedAmount
									});
								}

								arrReleases.push(objItem);
						}

					} else {
						var objItem = {
							cardProductName: objCardProduct.name,
							cardProductId: objCardProduct.id,
							forethought: objCardProduct.forethought,
							status: strStatus,
							description: strDescription,
							sales: 0,
							cancellation: 0,
							adjusts: 0,
							releases: [],
							total: 0,
							status: strStatus
						};

						if(strDescription == "vendas") {
							objItem.total = objData[intIndex].payedAmount;
							objItem.releases.push({
								type: 'vendas',
								payedAmount: objData[intIndex].expectedAmount
							});
						} else if(strDescription == "cancelamentos") {
							objItem.releases.push({
								type: 'cancelamentos',
								payedAmount: objData[intIndex].payedAmount
							});
						} else if(strDescription == "ajustes") {
							objItem.releases.push({
								type: 'ajustes',
								payedAmount: objData[intIndex].payedAmount
							});
						}

						arrReleases.push(objItem);
					}
				}

				for(var intIndex in arrActualReleasesData) {
					if(intAcquirerId == arrActualReleasesData[intIndex].acquirer.id){
						arrActualReleasesData[intIndex].cardProducts = arrReleases;
						break;
					}
				}

				$scope.actualReleasesData = arrActualReleasesData;
			}).catch(function(){
				console.log('[receiptsController:getSummaries] error');
			});
		}
	}

	function GetOtherReleases(intAcquirerId) {

		for(var intIndex in arrActualReleasesData){
			var intAcquirerId = arrActualReleasesData[intIndex].acquirer.id;

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
						intTotal += objData[objItem].amount;
					}

					arrActualReleasesData[intIndex].otherReleasesTotal = intTotal
					arrActualReleasesData[intIndex].otherReleases = objData;
			}).catch(function(){
				console.log('[receiptsController:getOtherReleases] error');
			});
		}
	};

	function GetExpectedReleases() {
		for(var intIndex in arrActualReleasesData){
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
						intTotal += objData[objItem].expectedAmount;
					}

					arrActualReleasesData[intIndex].expectedReleasesTotal = intTotal;
					arrActualReleasesData[intIndex].expectedReleases = objData;
			}).catch(function(){
				console.log('[receiptsController:getExpectedReleases] error');
			});
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

				if(objData[intIndex].description == 'vendas') {
					intTotalToReceive = objData[intIndex].expectedAmount;
					intTotalReceived = objData[intIndex].payedAmount;
				}

				if(objData[intIndex].description == 'ajustes' || objData[intIndex].description == 'cancelamentos') {
					intDiscountedTotal += objData[intIndex].payedAmount;
				}
			}


			objFilter.status = 'FORETHOUGHT';
			receiptsService.GetFinancials(objFilter).then(function(objResponse) {
				var objData = objResponse.data;
				var intAntecipatedTotal = 0;
				for(var intIndex in objData) {
					if(objData[intIndex].description == 'vendas') {
						intAntecipatedTotal = objData[intIndex].payedAmount;
						intDiscountedTotal += (objData[intIndex].expectedAmount - objData[intIndex].payedAmount);
					}
				}

				receiptsService.GetAdjusts(objFilterOthers).then(function(objResponseAdjusts) {
					var intOthers = 0;

					// amount soma em totais descontados
					var objData = objResponseAdjusts.data.content;
					for(var intIndex in objData) {
						intOthers += objData[intIndex].amount;
					}

					intDiscount = intDiscountedTotal + intOthers;

					$scope.totalToReceive = intTotalToReceive;
					$scope.discountedTotal = intDiscount;
					$scope.antecipatedTotal = intAntecipatedTotal;
					$scope.totalReceived = intTotalToReceive - intDiscount + intAntecipatedTotal;

				}).catch(function(objResponse) {
					console.log('[receiptsController:getAdjusts] error');
				});

			}).catch(function(objResponse) {
				console.log('[receiptsController:getFinancials] status forethought error');
			})

		}).catch(function(objResponse) {
			console.log('[receiptsController:getFinancials] error');
		});
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

		var dateTestDate = $scope.futureReleases.startDate instanceof Date;
		var dateStartDate = !dateTestDate ? calendarFactory.transformBrDateIntoDate($scope.futureReleases.startDate) : $scope.futureReleases.startDate;

		$scope.futureReleases.inicialStartDate = calendarFactory.getTomorrowFromTodayToDate();
		console.log("$scope.futureReleases.inicialStartDate", $scope.futureReleases.inicialStartDate)

		$scope.futureReleases.startDateDay = calendarFactory.getDayOfDate(dateStartDate);
		$scope.futureReleases.startDateMonth = calendarFactory.getMonthNameAbreviation(moment(dateStartDate));
		$scope.futureReleases.startDateYear = calendarFactory.getYearOfDate(dateStartDate);
		$scope.futureReleases.endDateDay = calendarFactory.getDayOfDate($scope.futureReleases.endDate);
		$scope.futureReleases.endDateMonth = calendarFactory.getMonthNameAbreviation(moment($scope.futureReleases.endDate));
		$scope.futureReleases.endDateYear = calendarFactory.getYearOfDate($scope.futureReleases.endDate);
		$scope.futureReleases.dateRange = GetDateLabel();
		$scope.futureReleases.dateRangeWithBr = GetDateLabel(true);

		var strInitialDay = moment($scope.futureReleases.startDate);
		var strFinalDay = moment($scope.futureReleases.endDate);

		$scope.countDiffDays = strFinalDay.diff(strInitialDay, 'days');

		SaveFilters();
		GetLabels(true);
		GetFutureAcquirers();

		var objFilter = {
			startDate:calendarFactory.formatDateTimeForService($scope.futureReleases.startDate),
			endDate: calendarFactory.formatDateTimeForService($scope.futureReleases.endDate),
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

		objMaxDate = calendarFactory.getNextYear();
		strDateDay = calendarFactory.getDayOfDate(objMaxDate);
		strDateMonth = calendarFactory.getMonthNameAbreviation(objMaxDate);
		strDateYear = calendarFactory.getYear(objMaxDate);

		return "até " + strDateDay + " " + strDateMonth + " " + strDateYear;
	}

	function GetFutureAcquirers() {
		var objFilter = {
			startDate: calendarFactory.formatDateTimeForService($scope.futureReleases.startDate),
			endDate: calendarFactory.formatDateTimeForService($scope.futureReleases.endDate),
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
					arrFutureReleasesData.push(objData[intIndex]);
				}
				GetFutureReceiptReleases();
			} else {
				$scope.futureReleasesData = [];
			}

		}).catch(function(objResponse) {
			console.log('[receiptsController:getFutureAcquirers] error');
		})
	}

	function GetFutureReceiptReleases() {

		for(var intIndex in arrFutureReleasesData){
			var intAcquirerId = arrFutureReleasesData[intIndex].acquirer.id;

			var objFilter = {
				startDate: calendarFactory.formatDateTimeForService($scope.futureReleases.startDate),
				endDate: calendarFactory.formatDateTimeForService($scope.futureReleases.endDate),
				groupBy: 'CARD_PRODUCT,STATUS',
				bankAccountIds: GetAccountsFilter(true),
				shopIds: GetShopsFilter(true),
				acquirerIds: intAcquirerId,
				cardProductIds: GetCardProductsFilter(true),
				status: 'EXPECTED'
			};

			receiptsService.GetFinancials(objFilter).then(function(objResponse) {
				var objData = objResponse.data;
				var arrReleases = [];

				for( var intIndex in objData) {
					var strStatus = objData[intIndex].status.toLowerCase(),
						description = objData[intIndex].description.toLowerCase(),
						cardProduct = objData[intIndex].cardProduct;
						amount = objData[intIndex].expectedAmount;

					if(arrReleases.length) {
						for(var intIndexb in arrReleases){
							if((arrReleases[intIndexb].cardProductId === objData[intIndex].cardProduct.id) && (arrReleases[intIndexb].status === status)){

							} else {
								var objItem = {
									cardProductName: cardProduct.name,
									cardProductId: cardProduct.id,
									status: strStatus,
									description: description,
									sales: 0,
									cancellation: 0,
									adjusts: 0,
									releases: []
								};

								if(description == "vendas") {
									objItem.releases.push({
										type: 'vendas',
										expectedAmount: objData[intIndex].expectedAmount
									});
								} else if(description == "cancelamentos") {
									objItem.releases.push({
										type: 'cancelamentos',
										expectedAmount: objData[intIndex].expectedAmount
									});
								} else if(description == "ajustes") {
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
						var objItem = {
							cardProductName: cardProduct.name,
							cardProductId: cardProduct.id,
							status: strStatus,
							description: description,
							sales: 0,
							cancellation: 0,
							adjusts: 0,
							releases: []
						};

						if(description == "vendas") {
							objItem.releases.push({
								type: 'vendas',
								expectedAmount: objData[intIndex].expectedAmount
							});
						} else if(description == "cancelamentos") {
							objItem.releases.push({
								type: 'cancelamentos',
								expectedAmount: objData[intIndex].expectedAmount
							});
						} else if(description == "ajustes") {
							objItem.releases.push({
								type: 'ajustes',
								expectedAmount: objData[intIndex].expectedAmount
							});
						}

						arrReleases.push(objItem);
					}
				}

				for(var intIndex in arrFutureReleasesData) {
					if(intAcquirerId == arrFutureReleasesData[intIndex].acquirer.id){
						arrFutureReleasesData[intIndex].cardProducts = arrReleases;
						break;
					}
				}

				$scope.futureReleasesData = arrFutureReleasesData;
			}).catch(function(){
				console.log('[receiptsController:getSummaries] error');
			});
		}
	}

	function ChangeTab(intIndex) {

		$scope.tabs[intIndex].active = true;

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
			$scope.shopsFutureModel = [];
			MakeReceiptsOrFutureReceipts(true);
		} else {
			$scope.shopsModel = [];
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
		filtersService.GetAccounts().then(function(objResponse){
			var arrFilterConfig = [];
			var objData = objResponse.data;

			for(var x in objData){
				var obj = {};
				obj.id = objData[x].id;
				obj.label = objData[x].bankName + ' | ' + objData[x].agencyNumber + ' | ' +  objData[x].accountNumber;
				obj.bankName = objData[x].bankName;
				obj.agencyNumber = objData[x].agencyNumber;
				obj.accountNumber = objData[x].accountNumber;
				obj.bankId = objData[x].bankId;

				arrFilterConfig.push(obj);
			}

			$scope.accountsData = $filter('orderBy')(arrFilterConfig, "bankId");
			var objAccount = $scope.accountsData[0];
			$scope.accountsModel.id = objAccount.id;
			$scope.accountsModel.label = objAccount.label;
			$scope.accountsFutureModel.id = objAccount.id;
			$scope.accountsFutureModel.label = objAccount.label;

			intFilterStatus++;

            HandleTabs();

		}).catch(function(objResponse){
			console.log('error');
		});

		// bandeira
		filtersService.GetCardProducts().then(function(objResponse){
			var arrFilterConfig = [];
			for(var x in objResponse.data){
				var obj = {};
				obj.id = objResponse.data[x].id;
				obj.label = objResponse.data[x].name;
				arrFilterConfig.push(obj);
			}
			$scope.cardProductsData = arrFilterConfig;
            $scope.cardProductsModel = angular.copy($scope.cardProductsData);
            $scope.cardProductsFutureModel = angular.copy($scope.cardProductsData);

            intFilterStatus++;
            HandleTabs();

		}).catch(function(objResponse){
			console.log('error');
		});

		// estabelecimento
		filtersService.GetShops().then(function(objResponse){
			var arrFilterConfig = [];
			for(var x in objResponse.data){
				var obj = {};
				obj.id = objResponse.data[x].id;
				obj.label = objResponse.data[x].code;
				arrFilterConfig.push(obj);
			}
			$scope.shopsData = arrFilterConfig;
            $scope.shopsModel = angular.copy($scope.shopsData);
            $scope.shopsFutureModel = angular.copy($scope.shopsData);

            intFilterStatus++;
            HandleTabs();

		}).catch(function(objResponse){
			console.log('error');
		});

		// adquirente
		filtersService.GetAcquirers().then(function(objResponse){
			var arrFilterConfig = [];
			for(var x in objResponse.data){
				var obj = {};
				obj.id = objResponse.data[x].id;
				obj.label = objResponse.data[x].name;
				arrFilterConfig.push(obj);
			}
			$scope.acquirersData = arrFilterConfig;
            $scope.acquirersModel = angular.copy($scope.acquirersData);
            $scope.acquirersFutureModel = angular.copy($scope.acquirersData);

            intFilterStatus++;
			HandleTabs();

		}).catch(function(objResponse){
			console.log('error');
		});
	}

	function HandleTabs() {
		if( intFilterStatus === 4 ) {
			GetCachedData();
			if ($rootScope.futureSelected) {
				delete $rootScope.futureSelected;
				GetFutureReceipt();
			} else {
				GetReceipt();
			}
		}
	}

	function GetAccountsFilter(bolIsFuture) {
		var arrModel = (bolIsFuture ? $scope.accountsFutureModel : $scope.accountsModel);
		return arrModel.id;
	};

	function GetShopsFilter(bolIsFuture) {
		var arrModel = (bolIsFuture ? $scope.shopsFutureModel : $scope.shopsModel);
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

		if(arrModel.length == $scope.cardProductsData.length) {
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

		var arrModel = (bolIsFuture ? $scope.shopsFutureModel : $scope.shopsModel);
		var strLabel = (bolIsFuture ? $scope.shopsFutureLabel : $scope.shopsLabel);

		if( arrModel.length ) {
			if( arrModel.length == 1 ) {
				strLabel = arrModel[0].label;
			} else if ( arrModel.length === $scope.shopsData.length) {
				strLabel = 'todos os estabelecimentos';
			} else {
				var over = arrModel.length - 1;
				strLabel = arrModel[0].label + ' + ' +  over + ' estabelecimento';

				if(over > 1) {
					strLabel = strLabel + 's';
				}
			}
		} else {
			strLabel = null
		}

		if(bolIsFuture) {
			$scope.shopsFutureModel = arrModel;
			$scope.shopsFutureLabel = strLabel;
			$scope.shopsFutureFullLabel = arrModel.map(function(objItem){
				return objItem.label;
			}).join(", ");

		} else {
			$scope.shopsModel = arrModel;
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
				if(arrModel.length == 2) {
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
        $rootScope.receiptsDetails.shopIds = $scope.settlementsSelected;
        $rootScope.receiptsDetails.products = $scope.productsSearch;
        $rootScope.receiptsDetails.shops = $scope.shopsModel;
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
			shopIds: $scope.shopsModel,
			acquirerIds: $scope.acquirersModel,
			cardProductIds: $scope.cardProductsModel,
			futureStartDate: calendarFactory.formatDateTimeForService($scope.futureReleases.startDate),
			futureEndDate: calendarFactory.formatDateTimeForService($scope.futureReleases.endDate),
			futureBankAccountIds: $scope.accountsFutureModel,
			futureShopIds: $scope.shopsFutureModel,
			futureAcquirerIds: $scope.acquirersFutureModel,
			futureCardProductIds: $scope.cardProductsFutureModel,
		}, 'receipts');
    }

    function GetCachedData() {
		if(cacheService.LoadFilter('context') == 'receipts') {
			$scope.actualReleases.date = moment(cacheService.LoadFilter('startDate'), "YYYYMMDD").toDate();
			$scope.accountsModel = cacheService.LoadFilter('bankAccountIds');
			$scope.shopsModel = cacheService.LoadFilter('shopIds');
			$scope.acquirersModel = cacheService.LoadFilter('acquirerIds');
			$scope.cardProductsModel = cacheService.LoadFilter('cardProductIds');

			if($rootScope.futureSelected) {
				$scope.futureReleases.startDate = moment(cacheService.LoadFilter('futureStartDate'), "YYYYMMDD").toDate();
				$scope.futureReleases.endDate = moment(cacheService.LoadFilter('futureEndDate'), "YYYYMMDD").toDate();
				$scope.accountsFutureModel = cacheService.LoadFilter('futureBankAccountIds');
				$scope.shopsFutureModel = cacheService.LoadFilter('futureShopIds');
				$scope.acquirersFutureModel = cacheService.LoadFilter('futureAcquirerIds');
				$scope.cardProductsFutureModel = cacheService.LoadFilter('futureCardProductIds');
				$scope.futureReleases.startDateMonth = calendarFactory.getMonthNameAbreviation(moment($scope.futureReleases.startDate));
				$scope.futureReleases.endDateMonth = calendarFactory.getMonthNameAbreviation(moment($scope.futureReleases.endDate));
			}
		}
    }

});
