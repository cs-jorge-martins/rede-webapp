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

.controller('receiptsController', function(menuFactory, $modal, $rootScope, $scope, calendarFactory, $location, cacheService, $window, $timeout,
		advancedFilterService, calendarService, filtersService, receiptsService){

	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.LoadParamsByFilter();

	menuFactory.setActiveMovements();

	$scope.tabs = [{},{}];

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
    $scope.futureReleases.endDate = calendarFactory.getLastDayOfPlusMonthToDate($scope.futureReleases.startDate, 1);
    $scope.futureReleases.startDateDay = calendarFactory.getDayOfDate($scope.futureReleases.startDate);
    $scope.futureReleases.startDateMonth = calendarFactory.getMonthNameAbreviation($scope.futureReleases.startDate);
    $scope.futureReleases.endDateDay = calendarFactory.getDayOfDate($scope.futureReleases.endDate);
    $scope.futureReleases.endDateMonth = calendarFactory.getMonthNameAbreviation($scope.futureReleases.endDate);
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
    var actualReleasesData = [];
    $scope.futureReleasesData = [];
    var futureReleasesData = [];
    var filterStatus = 0;

	$scope.$watch('futureReleases.startDate', function(response) {
		if(moment($scope.futureReleases.endDate).isBefore(response)) {
			$scope.futureReleases.endDate = calendarFactory.getLastDayOfPlusMonthToDate($scope.futureReleases.startDate, 1);
		}
	});

	Init();

	function Init() {
		$scope.todayDate = calendarFactory.getToday();
		$scope.actualReleases.date = calendarFactory.getToday();
        GetFilters();
		GetForethought();
	}

    function GetReceipt() {
		actualReleasesData = [];
		$scope.actualReleases.month = calendarFactory.getMonthNameOfDate(moment($scope.actualReleases.date));
    	$scope.actualReleases.day = calendarFactory.getDayOfDate($scope.actualReleases.date);

		SaveFilters();
		GetLabels();
		GetSummaries();
		GetReceiptAcquirers();
		GetForethought();
    }

	function GetReceiptAcquirers() {

		var filter = {
			startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			groupBy: 'ACQUIRER',
			bankAccountIds: GetAccountsFilter(),
			shopIds: GetShopsFilter(),
			acquirerIds: GetAcquirersFilter(),
			cardProductIds: GetCardProductsFilter(),
			status: 'RECEIVED,FORETHOUGHT'
		};


		receiptsService.GetFinancials(filter).then(function(response) {
			var data = response.data;

			if( data.length ) {

				for(var index in data) {
					actualReleasesData.push(data[index]);
				}

				GetReceiptReleases();
				GetOtherReleases();
				GetExpectedReleases();
			} else {
				$scope.actualReleasesData = [];
			}

		}).catch(function(response) {
			console.log('[receiptsController:getSummaries] error');
		})
	}

	function GetForethought() {

		var filter = {
			startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			bankAccountIds: GetAccountsFilter(),
			status: 'EXPECTED,SUSPENDED,PAWNED,BLOCKED,PAWNED_BLOCKED'
		};


		receiptsService.GetFinancials(filter).then(function(response) {
			var data = response.data;

			if( data.length ) {

				$scope.existsForethought = true;

			} else {
				$scope.existsForethought = false;
			}

		}).catch(function(response) {
			console.log('[receiptsController:getSummaries] error');
		})
	}

	function GetReceiptReleases() {

		for(var index in actualReleasesData){
			var acquirerId = actualReleasesData[index].acquirer.id;

			var filter = {
				startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
				endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
				groupBy: 'CARD_PRODUCT,STATUS',
				bankAccountIds: GetAccountsFilter(),
				shopIds: GetShopsFilter(),
				acquirerIds: acquirerId,
				cardProductIds: GetCardProductsFilter(),
				status: 'RECEIVED,FORETHOUGHT'
			};

			receiptsService.GetFinancials(filter).then(function(response) {
				var data = response.data;
				var releases = [];

				for( var index in data) {
					var status = data[index].status.toLowerCase(),
						description = data[index].description.toLowerCase(),
						cardProduct = data[index].cardProduct;
						amount = data[index].payedAmount;
						cardProduct.forethought = false;

					if (status == "forethought") {
						cardProduct.name = "ANTECIPAÇÃO " + cardProduct.name;
						cardProduct.forethought = true;
					}

					if(releases.length) {
						var insert = true;
						for(var indexb in releases){
							if((releases[indexb].cardProductId === data[index].cardProduct.id) && (releases[indexb].status === status)){
								releases[indexb].releases.push({
									type: description,
									payedAmount: description == "vendas" ? data[index].expectedAmount : data[index].payedAmount
								});
								insert = false;
								break;
							}
						}
						if(insert) {
								var item = {
									cardProductName: cardProduct.name,
									cardProductId: cardProduct.id,
									forethought: cardProduct.forethought,
									status: status,
									description: description,
									sales: 0,
									cancellation: 0,
									adjusts: 0,
									releases: [],
									total: 0,
									status: status
								};

								if(description == "vendas") {
									item.total = data[index].payedAmount;

									item.releases.push({
										type: 'vendas',
										payedAmount: data[index].expectedAmount
									});
								} else if(description == "cancelamentos") {
									item.releases.push({
										type: 'cancelamentos',
										payedAmount: data[index].payedAmount
									});
								} else if(description == "ajustes") {
									item.releases.push({
										type: 'ajustes',
										payedAmount: data[index].payedAmount
									});
								}

								releases.push(item);
						}

					} else {
						var item = {
							cardProductName: cardProduct.name,
							cardProductId: cardProduct.id,
							forethought: cardProduct.forethought,
							status: status,
							description: description,
							sales: 0,
							cancellation: 0,
							adjusts: 0,
							releases: [],
							total: 0,
							status: status
						};

						if(description == "vendas") {
							item.total = data[index].payedAmount;
							item.releases.push({
								type: 'vendas',
								payedAmount: data[index].expectedAmount
							});
						} else if(description == "cancelamentos") {
							item.releases.push({
								type: 'cancelamentos',
								payedAmount: data[index].payedAmount
							});
						} else if(description == "ajustes") {
							item.releases.push({
								type: 'ajustes',
								payedAmount: data[index].payedAmount
							});
						}

						releases.push(item);
					}
				}

				for(var index in actualReleasesData) {
					if(acquirerId == actualReleasesData[index].acquirer.id){
						actualReleasesData[index].cardProducts = releases;
						break;
					}
				}

				$scope.actualReleasesData = actualReleasesData;
			}).catch(function(){
				console.log('[receiptsController:getSummaries] error');
			});
		}
	}

	function GetOtherReleases(acquirerId) {

		for(var index in actualReleasesData){
			var acquirerId = actualReleasesData[index].acquirer.id;

			var filter = {
				startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
				endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
				bankAccountIds: GetAccountsFilter(),
				shopIds: GetShopsFilter(),
				acquirerIds: acquirerId,
				status: 'RECEIVED',
				types: 'OTHER',
				groupBy: 'TYPE,DESCRIPTION'
			};

			receiptsService.GetAdjusts(filter).then(function(response){
					var data = response.data.content;
					var total = 0;

					for(var item in data) {
						total += data[item].amount;
					}

					actualReleasesData[index].otherReleasesTotal = total
					actualReleasesData[index].otherReleases = data;
			}).catch(function(){
				console.log('[receiptsController:getOtherReleases] error');
			});
		}
	};

	function GetExpectedReleases() {
		for(var index in actualReleasesData){
			var acquirerId = actualReleasesData[index].acquirer.id;

			var filter = {
				startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
				endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
				bankAccountIds: GetAccountsFilter(),
				shopIds: GetShopsFilter(),
				acquirerIds: acquirerId,
				cardProductIds: GetCardProductsFilter(),
				status: 'EXPECTED',
				groupBy: 'CARD_PRODUCT'
			};

			receiptsService.GetFinancials(filter).then(function(response){
					var data = response.data;
					var total = 0;

					for(var item in data) {
						total += data[item].expectedAmount;
					}

					actualReleasesData[index].expectedReleasesTotal = total;
					actualReleasesData[index].expectedReleases = data;
			}).catch(function(){
				console.log('[receiptsController:getExpectedReleases] error');
			});
		}
	}

	function GetSummaries() {
		var filter = {
			startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			status: 'RECEIVED',
			bankAccountIds: GetAccountsFilter(),
			shopIds: GetShopsFilter(),
			acquirerIds: GetAcquirersFilter(),
			cardProductIds: GetCardProductsFilter()
		};

		var filterOthers = {
			startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			status: 'RECEIVED',
			types: 'OTHER',
			bankAccountIds: GetAccountsFilter(),
			shopIds: GetShopsFilter(),
			acquirerIds: GetAcquirersFilter(),
		};

		receiptsService.GetFinancials(filter).then(function(response) {
			var data = response.data;

			var totalToReceive = 0;
			var discountedTotal = 0;
			var totalReceived = 0;
			var others = 0;
			var discount = 0;

			for(var index in data) {

				if(data[index].description == 'vendas') {
					totalToReceive = data[index].expectedAmount;
					totalReceived = data[index].payedAmount;
				}

				if(data[index].description == 'ajustes' || data[index].description == 'cancelamentos') {
					discountedTotal += data[index].payedAmount;
				}
			}


			filter.status = 'FORETHOUGHT';
			receiptsService.GetFinancials(filter).then(function(response) {
				var data = response.data;
				var antecipatedTotal = 0;
				for(var index in data) {
					if(data[index].description == 'vendas') {
						antecipatedTotal = data[index].payedAmount;
					}
				}

				receiptsService.GetAdjusts(filterOthers).then(function(responseAdjusts) {
					var others = 0;

					// amount soma em totais descontados
					var data = responseAdjusts.data.content;
					for(var index in data) {
						others += data[index].amount;
					}

					discount = discountedTotal + others;

					$scope.totalToReceive = totalToReceive;
					$scope.discountedTotal = discount;
					$scope.antecipatedTotal = antecipatedTotal;
					$scope.totalReceived = totalToReceive - discount + antecipatedTotal;

				}).catch(function(response) {
					console.log('[receiptsController:getAdjusts] error');
				});

			}).catch(function(response) {
				console.log('[receiptsController:getFinancials] status forethought error');
			})

		}).catch(function(response) {
			console.log('[receiptsController:getFinancials] error');
		});
	}

	function GetFutureReceipt() {

		futureReleasesData = [];

		var testDate = $scope.futureReleases.startDate instanceof Date;
		var startDate = !testDate ? calendarFactory.transformBrDateIntoDate($scope.futureReleases.startDate) : $scope.futureReleases.startDate;

		$scope.futureReleases.inicialStartDate = calendarFactory.getTomorrowFromTodayToDate();

		$scope.futureReleases.startDateDay = calendarFactory.getDayOfDate(startDate);
		$scope.futureReleases.startDateMonth = calendarFactory.getMonthNameAbreviation(moment(startDate));
		$scope.futureReleases.endDateDay = calendarFactory.getDayOfDate($scope.futureReleases.endDate);
		$scope.futureReleases.endDateMonth = calendarFactory.getMonthNameAbreviation(moment($scope.futureReleases.endDate));

		SaveFilters();
		GetLabels(true);
		GetFutureAcquirers();
	}

	function GetFutureAcquirers() {
		var filter = {
			startDate: calendarFactory.formatDateTimeForService($scope.futureReleases.startDate),
			endDate: calendarFactory.formatDateTimeForService($scope.futureReleases.endDate),
			groupBy: 'ACQUIRER',
			bankAccountIds: GetAccountsFilter(true),
			shopIds: GetShopsFilter(true),
			acquirerIds: GetAcquirersFilter(true),
			cardProductIds: GetCardProductsFilter(true),
			status: 'EXPECTED'
		};

		receiptsService.GetFinancials(filter).then(function(response) {
			var data = response.data;

			if( data.length ) {
				for(var index in data) {
					futureReleasesData.push(data[index]);
				}
				GetFutureReceiptReleases();
			} else {
				$scope.futureReleasesData = [];
			}

		}).catch(function(response) {
			console.log('[receiptsController:getFutureAcquirers] error');
		})
	}

	function GetFutureReceiptReleases() {

		for(var index in futureReleasesData){
			var acquirerId = futureReleasesData[index].acquirer.id;

			var filter = {
				startDate: calendarFactory.formatDateTimeForService($scope.futureReleases.startDate),
				endDate: calendarFactory.formatDateTimeForService($scope.futureReleases.endDate),
				groupBy: 'CARD_PRODUCT,STATUS',
				bankAccountIds: GetAccountsFilter(true),
				shopIds: GetShopsFilter(true),
				acquirerIds: acquirerId,
				cardProductIds: GetCardProductsFilter(true),
				status: 'EXPECTED'
			};

			receiptsService.GetFinancials(filter).then(function(response) {
				var data = response.data;
				var releases = [];

				for( var index in data) {
					var status = data[index].status.toLowerCase(),
						description = data[index].description.toLowerCase(),
						cardProduct = data[index].cardProduct;
						amount = data[index].expectedAmount;

					if(releases.length) {
						for(var indexb in releases){
							if((releases[indexb].cardProductId === data[index].cardProduct.id) && (releases[indexb].status === status)){

							} else {
								var item = {
									cardProductName: cardProduct.name,
									cardProductId: cardProduct.id,
									status: status,
									description: description,
									sales: 0,
									cancellation: 0,
									adjusts: 0,
									releases: []
								};

								if(description == "vendas") {
									item.releases.push({
										type: 'vendas',
										expectedAmount: data[index].expectedAmount
									});
								} else if(description == "cancelamentos") {
									item.releases.push({
										type: 'cancelamentos',
										expectedAmount: data[index].expectedAmount
									});
								} else if(description == "ajustes") {
									tem.releases.push({
										type: 'ajustes',
										expectedAmount: data[index].expectedAmount
									});
								}

								releases.push(item);
								break;
							}
						}

					} else {
						var item = {
							cardProductName: cardProduct.name,
							cardProductId: cardProduct.id,
							status: status,
							description: description,
							sales: 0,
							cancellation: 0,
							adjusts: 0,
							releases: []
						};

						if(description == "vendas") {
							item.releases.push({
								type: 'vendas',
								expectedAmount: data[index].expectedAmount
							});
						} else if(description == "cancelamentos") {
							item.releases.push({
								type: 'cancelamentos',
								expectedAmount: data[index].expectedAmount
							});
						} else if(description == "ajustes") {
							tem.releases.push({
								type: 'ajustes',
								expectedAmount: data[index].expectedAmount
							});
						}

						releases.push(item);
					}
				}

				for(var index in futureReleasesData) {
					if(acquirerId == futureReleasesData[index].acquirer.id){
						futureReleasesData[index].cardProducts = releases;
						break;
					}
				}

				$scope.futureReleasesData = futureReleasesData;
			}).catch(function(){
				console.log('[receiptsController:getSummaries] error');
			});
		}
	}

	function ChangeTab(index) {
		$scope.tabs[index].active = true;

		if(filterStatus === 4) {
	    	if(index === 0) {
	    		GetReceipt();
	    	} else if(index === 1) {
	    		GetFutureReceipt();
	    	}
	    }
    }

	function ClearShopFilter () {
		$scope.shopsModel = [];
        GetReceipt();
	}

	function ClearCardProductsFilter () {
		$scope.cardProductsModel = [];
        GetReceipt();
	}

  	function GetFilters() {
		// conta
		filtersService.GetAccounts().then(function(response){
			var filterConfig = [];
			var data = response.data;

			for(var x in data){
				var obj = {};
				obj.id = data[x].id;
				obj.label = data[x].bankName + ' | ' + data[x].agencyNumber + ' | ' +  data[x].accountNumber;
				obj.bankName = data[x].bankName;
				obj.agencyNumber = data[x].agencyNumber;
				obj.accountNumber = data[x].accountNumber;

				filterConfig.push(obj);
			}

			$scope.accountsData = filterConfig;
			$scope.accountsModel.id = filterConfig[0].id;
			$scope.accountsModel.label = filterConfig[0].label;
			$scope.accountsFutureModel.id = filterConfig[0].id;
			$scope.accountsFutureModel.label = filterConfig[0].label;

			filterStatus++;

            if(filterStatus === 4) {
            	GetCachedData();
                GetReceipt();
            }

		}).catch(function(response){
			console.log('error');
		});

		// bandeira
		filtersService.GetCardProducts().then(function(response){
			var filterConfig = [];
			for(var x in response.data){
				var obj = {};
				obj.id = response.data[x].id;
				obj.label = response.data[x].name;
				filterConfig.push(obj);
			}
			$scope.cardProductsData = filterConfig;
            $scope.cardProductsModel = angular.copy($scope.cardProductsData);
            $scope.cardProductsFutureModel = angular.copy($scope.cardProductsData);

            filterStatus++;
            if(filterStatus === 4) {
            	GetCachedData();
                GetReceipt();
            }

		}).catch(function(response){
			console.log('error');
		});

		// estabelecimento
		filtersService.GetShops().then(function(response){
			var filterConfig = [];
			for(var x in response.data){
				var obj = {};
				obj.id = response.data[x].id;
				obj.label = response.data[x].code;
				filterConfig.push(obj);
			}
			$scope.shopsData = filterConfig;
            $scope.shopsModel = angular.copy($scope.shopsData);
            $scope.shopsFutureModel = angular.copy($scope.shopsData);

            filterStatus++;

            if(filterStatus === 4) {
            	GetCachedData();
                GetReceipt();
            }

		}).catch(function(response){
			console.log('error');
		});

		// adquirente
		filtersService.GetAcquirers().then(function(response){
			var filterConfig = [];
			for(var x in response.data){
				var obj = {};
				obj.id = response.data[x].id;
				obj.label = response.data[x].name;
				filterConfig.push(obj);
			}
			$scope.acquirersData = filterConfig;
            $scope.acquirersModel = angular.copy($scope.acquirersData);
            $scope.acquirersFutureModel = angular.copy($scope.acquirersData);

            filterStatus++;

            if(filterStatus === 4) {
            	GetCachedData();
                GetReceipt();
            }

		}).catch(function(response){
			console.log('error');
		});
	}

	function GetAccountsFilter(isFuture) {
		var model = (isFuture ? $scope.accountsFutureModel : $scope.accountsModel);
		return model.id;
	};

	function GetShopsFilter(isFuture) {
		var model = (isFuture ? $scope.shopsFutureModel : $scope.shopsModel);
		return model.map(function(item){
			return item.id;
		}).join(",");
	}

	function GetAcquirersFilter(isFuture) {
		var model = (isFuture ? $scope.acquirersFutureModel : $scope.acquirersModel);
		return model.map(function(item){
			return item.id;
		}).join(",");
	}

	function GetCardProductsFilter(isFuture) {
		var model = (isFuture ? $scope.cardProductsFutureModel : $scope.cardProductsModel);

		if(model.length == $scope.cardProductsData.length) {
			return [];
		}

		return model.map(function(item){
			return item.id;
		}).join(",");
	}

	function GetAccountsLabel(isFuture) {

		var model = (isFuture ? $scope.accountsFutureModel : $scope.accountsModel);
		var label = (isFuture ? $scope.accountsFutureLabel : $scope.accountsLabel);

		if( model.id ) {
			label = 'conta: ' + model.label;
		} else {
			label = null;
		}

		if(isFuture) {
			$scope.accountsFutureModel = model;
			$scope.accountsFutureLabel = label;
		} else {
			$scope.accountsModel = model;
			$scope.accountsLabel = label;
		}

	}

	function GetShopsLabel(isFuture) {

		var model = (isFuture ? $scope.shopsFutureModel : $scope.shopsModel);
		var label = (isFuture ? $scope.shopsFutureLabel : $scope.shopsLabel);

		if( model.length ) {
			if( model.length == 1 ) {
				label = model[0].label;
			} else if ( model.length === $scope.shopsData.length) {
				label = 'todos os estabelecimentos';
			} else {
				var over = model.length - 1;
				label = model[0].label + ' + ' +  over + ' estabelecimento';

				if(over > 1) {
					label = label + 's';
				}
			}
		} else {
			label = null
		}

		if(isFuture) {
			$scope.shopsFutureModel = model;
			$scope.shopsFutureLabel = label;
			$scope.shopsFutureFullLabel = model.map(function(item){
				return item.label;
			}).join(", ");

		} else {
			$scope.shopsModel = model;
			$scope.shopsLabel = label;
			$scope.shopsFullLabel = model.map(function(item){
				return item.label;
			}).join(", ");
		}
	}

	function GetCardProductsLabel(isFuture) {
		var model = (isFuture ? $scope.cardProductsFutureModel : $scope.cardProductsModel);
		var label = (isFuture ? $scope.cardProductsFutureLabel : $scope.cardProductsLabel);

		if( model.length ) {
			if( model.length === $scope.cardProductsData.length ) {
				label = 'todas as bandeiras';
			} else if ( model.length === 1) {
				label = model[0].label;
			} else {
				if(model.length == 2) {
					label = model[0].label + ' + ' +  (model.length - 1) + " outra";
				} else {
					label = model[0].label + ' + ' +  (model.length - 1) + " outras";
				}
			}
			label = label.toLowerCase();
		} else {
			label = null;
		}

		if(isFuture) {
			$scope.cardProductsFutureModel = model;
			$scope.cardProductsFutureLabel = label;
			$scope.cardProductsFutureFullLabel = model.map(function(item){
				return item.label;
			}).join(", ");
		} else {
			$scope.cardProductsModel = model;
			$scope.cardProductsLabel = label;
			$scope.cardProductsFullLabel = model.map(function(item){
				return item.label;
			}).join(", ");
		}

	}

	function GetLabels(isFuture) {
		GetAccountsLabel(isFuture);
		GetShopsLabel(isFuture);
		GetCardProductsLabel(isFuture);
	}

    function ShowDetails(acquirer, cardProduct, total, status, detailPage) {
        $rootScope.receiptsDetails = {};

        var dateSelected = $scope.actualReleases.date;
        $rootScope.receiptsDetails.currency = "BRL";
        $rootScope.receiptsDetails.startDate = dateSelected;
        $rootScope.receiptsDetails.endDate = dateSelected;
        $rootScope.receiptsDetails.shopIds = $scope.settlementsSelected;
        $rootScope.receiptsDetails.products = $scope.productsSearch;
        $rootScope.receiptsDetails.shops = $scope.shopsModel;
        $rootScope.receiptsDetails.cardProduct = cardProduct;
        $rootScope.receiptsDetails.acquirer = acquirer;
        $rootScope.receiptsDetails.bankAccount = $scope.accountsModel;
		$rootScope.receiptsDetails.shopsLabel = $scope.shopsLabel;
		$rootScope.receiptsDetails.shopsFullLabel = $scope.shopsFullLabel;
		$rootScope.receiptsDetails.accountsLabel = $scope.accountsLabel;
		$rootScope.receiptsDetails.cardProductsLabel = $scope.cardProductsLabel;
		$rootScope.receiptsDetails.cardProductsFullLabel = $scope.cardProductsFullLabel;
		$rootScope.receiptsDetails.total = total;
		$rootScope.receiptsDetails.type = status;

		var redirect_url;
		switch (detailPage) {
			case "other_details":
				redirect_url = "receipts/other_details";
				break;
			case "expected_details":
				redirect_url = "receipts/expected_details";
				break;
			case "forethought_details":
				redirect_url = "receipts/forethought_details";
				break;
			case "future_details":
				$rootScope.receiptsDetails.periodStartDate = $scope.futureReleases.startDate;
				$rootScope.receiptsDetails.periodEndDate = $scope.futureReleases.endDate;
				redirect_url = "receipts/future_details";
				break;
			default:
				redirect_url = "receipts/details";
				break;
		}
		if(redirect_url) {
			console.log(redirect_url);
			$location.path(redirect_url);
		}
		return false;
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
			$scope.futureReleases.startDate = moment(cacheService.LoadFilter('futureStartDate'), "YYYYMMDD").toDate();
			$scope.futureReleases.endDate = moment(cacheService.LoadFilter('futureEndDate'), "YYYYMMDD").toDate();
			$scope.accountsFutureModel = cacheService.LoadFilter('futureBankAccountIds');
			$scope.shopsFutureModel = cacheService.LoadFilter('futureShopIds');
			$scope.acquirersFutureModel = cacheService.LoadFilter('futureAcquirerIds');
			$scope.cardProductsFutureModel = cacheService.LoadFilter('futureCardProductIds');

		}
    }

});
