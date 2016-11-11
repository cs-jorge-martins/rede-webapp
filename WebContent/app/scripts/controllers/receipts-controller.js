/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('KaplenWeb.movementsModule',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/receipts', {templateUrl: 'app/views/receipts.html', controller: 'receiptsController'});
}])

.filter('capitalize', function() {
	return function(input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
	}
})


.controller('receiptsController', function(menuFactory, $modal, $rootScope, $scope, calendarFactory, $location, cacheService, transactionsService, $window, userService, $timeout,
		advancedFilterService, calendarService, filtersService, receiptsService){

	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.loadParamsByFilter();

	menuFactory.setActiveMovements();

	$scope.tabs = [{},{}];

    $scope.expected = [];
	$scope.receipts = [];
    $scope.getReceipt = getReceipt;


    $scope.getFutureReceipt = getFutureReceipt;

    $scope.actualReleases = {};
    $scope.actualReleases.date = new Date();

    $scope.actualReleases.month = calendarFactory.getMonthNameOfDate(moment($scope.actualReleases.date));
    $scope.actualReleases.day = calendarFactory.getDayOfDate($scope.actualReleases.date);

    $scope.futureReleases = {};
    $scope.futureReleases.startDate = calendarFactory.getTomorrowFromTodayToDate();
	// endDate = ultimo_dia_do_mes(startDate + 1 mês)
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

	$scope.clearShopFilter = clearShopFilter;
	$scope.clearCardProductsFilter = clearCardProductsFilter;

	$scope.totalToReceive = 0;
	$scope.discountedTotal = 0;
	$scope.antecipatedTotal = 0;
	$scope.totalReceived = 0;
	$scope.existsForethought = false;

    $scope.showDetails = showDetails;
    $scope.changeTab = changeTab;

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

	init();

	function init() {
		$scope.todayDate = calendarFactory.getToday();
		$scope.actualReleases.date = calendarFactory.getToday();
        getFilters();
		getForethought();
	}

    function getReceipt() {
		actualReleasesData = [];
		$scope.actualReleases.month = calendarFactory.getMonthNameOfDate(moment($scope.actualReleases.date));
    	$scope.actualReleases.day = calendarFactory.getDayOfDate($scope.actualReleases.date);

		saveFilters();
		getLabels();
		getSummaries();
		getReceiptAcquirers();
		getForethought();
    }

	function getReceiptAcquirers() {

		var filter = {
			startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			groupBy: 'ACQUIRER',
			bankAccountIds: getAccountsFilter(),
			shopIds: getShopsFilter(),
			acquirerIds: getAcquirersFilter(),
			cardProductIds: getCardProductsFilter(),
			status: 'RECEIVED,FORETHOUGHT,EXPECTED'
		};


		receiptsService.getFinancials(filter).then(function(response) {
			var data = response.data;

			if( data.length ) {

				for(var index in data) {
					actualReleasesData.push(data[index]);
				}

				getReceiptReleases();
				getOtherReleases();
				getExpectedReleases();
			} else {
				$scope.actualReleasesData = [];
			}

		}).catch(function(response) {
			console.log('[receiptsController:getSummaries] error');
		})
	}

	function getForethought() {



		var filter = {
			startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			bankAccountIds: getAccountsFilter(),
			status: 'EXPECTED,SUSPENDED,PAWNED,BLOCKED,PAWNED_BLOCKED'
		};


		receiptsService.getFinancials(filter).then(function(response) {
			var data = response.data;

			if( data.length ) {

				$scope.existsForethought = true;

			} else {
				$scope.actualReleasesData = [];
				$scope.existsForethought = false;
			}

		}).catch(function(response) {
			console.log('[receiptsController:getSummaries] error');
		})
	}

	function getReceiptReleases() {

		for(var index in actualReleasesData){
			var acquirerId = actualReleasesData[index].acquirer.id;

			var filter = {
				startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
				endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
				groupBy: 'CARD_PRODUCT,STATUS',
				bankAccountIds: getAccountsFilter(),
				shopIds: getShopsFilter(),
				acquirerIds: acquirerId,
				cardProductIds: getCardProductsFilter(),
				status: 'RECEIVED,FORETHOUGHT'
			};

			receiptsService.getFinancials(filter).then(function(response) {
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

	function getOtherReleases(acquirerId) {

		for(var index in actualReleasesData){
			var acquirerId = actualReleasesData[index].acquirer.id;

			var filter = {
				startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
				endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
				bankAccountIds: getAccountsFilter(),
				shopIds: getShopsFilter(),
				acquirerIds: acquirerId,
				status: 'RECEIVED',
				types: 'OTHER',
				groupBy: 'TYPE,DESCRIPTION'
			};

			receiptsService.getAdjusts(filter).then(function(response){
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

	function getExpectedReleases() {
		for(var index in actualReleasesData){
			var acquirerId = actualReleasesData[index].acquirer.id;

			var filter = {
				startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
				endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
				bankAccountIds: getAccountsFilter(),
				shopIds: getShopsFilter(),
				acquirerIds: acquirerId,
				cardProductIds: getCardProductsFilter(),
				status: 'EXPECTED',
				groupBy: 'CARD_PRODUCT'
			};

			receiptsService.getFinancials(filter).then(function(response){
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

	function getSummaries() {
		var filter = {
			startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			// status: 'EXPECTED,RECEIVED,PENDING',
			status: 'EXPECTED,RECEIVED',
			bankAccountIds: getAccountsFilter(),
			shopIds: getShopsFilter(),
			acquirerIds: getAcquirersFilter(),
			cardProductIds: getCardProductsFilter()
		};

		var filterPagamentosNaoRecebidos = {
			startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			status: 'EXPECTED',
			bankAccountIds: getAccountsFilter(),
			shopIds: getShopsFilter(),
			acquirerIds: getAcquirersFilter(),
			cardProductIds: getCardProductsFilter()
		};

		var filterOthers = {
			startDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			endDate: calendarFactory.formatDateTimeForService($scope.actualReleases.date),
			status: 'RECEIVED',
			types: 'OTHER',
			bankAccountIds: getAccountsFilter(),
			shopIds: getShopsFilter(),
			acquirerIds: getAcquirersFilter(),
		};

		receiptsService.getFinancials(filter).then(function(response) {
			var data = response.data;
			var totalToReceive = 0;
			var discountedTotal = 0;
			var totalReceived = 0;
			var pagamentosNaoRecebidos = 0;
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
			receiptsService.getFinancials(filter).then(function(response) {
				var data = response.data;
				var antecipatedTotal = 0;
				for(var index in data) {
					if(data[index].description == 'vendas') {
						antecipatedTotal = data[index].payedAmount;
					}
				}

				receiptsService.getFinancials(filterPagamentosNaoRecebidos).then(function(response) {

					// amount soma em totais descontados
					var data = response.data;
					for(var index in data) {
						pagamentosNaoRecebidos = data[index].expectedAmount;
					}

					receiptsService.getAdjusts(filterOthers).then(function(responseAdjusts) {

						var others = 0;

						// amount soma em totais descontados
						var data = responseAdjusts.data.content;
						for(var index in data) {
							others += data[index].amount;
						}

						discount = pagamentosNaoRecebidos + discountedTotal + others;

						$scope.totalToReceive = totalToReceive;
						$scope.discountedTotal = discount;
						$scope.antecipatedTotal = antecipatedTotal;
						$scope.totalReceived = totalToReceive - discount + antecipatedTotal;

					}).catch(function(response) {
						console.log('[receiptsController:getSummaries] error');
					});

				}).catch(function(response) {
					console.log('[receiptsController:getSummaries] error');
				});


			}).catch(function(response) {
				console.log('[receiptsController:getSummaries] error');
			})

		}).catch(function(response) {
			console.log('[receiptsController:getSummaries] error');
		});
	}

	function getFutureReceipt() {

		futureReleasesData = [];

		var testDate = $scope.futureReleases.startDate instanceof Date;
		var startDate = !testDate ? calendarFactory.transformBrDateIntoDate($scope.futureReleases.startDate) : $scope.futureReleases.startDate;

		$scope.futureReleases.inicialStartDate = calendarFactory.getTomorrowFromTodayToDate();

		$scope.futureReleases.startDateDay = calendarFactory.getDayOfDate(startDate);
		$scope.futureReleases.startDateMonth = calendarFactory.getMonthNameAbreviation(moment(startDate));
		$scope.futureReleases.endDateDay = calendarFactory.getDayOfDate($scope.futureReleases.endDate);
		$scope.futureReleases.endDateMonth = calendarFactory.getMonthNameAbreviation(moment($scope.futureReleases.endDate));

		saveFilters();
		getLabels(true);
		getFutureAcquirers();
	}

	function getFutureAcquirers() {
		var filter = {
			startDate: calendarFactory.formatDateTimeForService($scope.futureReleases.startDate),
			endDate: calendarFactory.formatDateTimeForService($scope.futureReleases.endDate),
			groupBy: 'ACQUIRER',
			bankAccountIds: getAccountsFilter(true),
			shopIds: getShopsFilter(true),
			acquirerIds: getAcquirersFilter(true),
			cardProductIds: getCardProductsFilter(true),
			status: 'EXPECTED'
		};

		receiptsService.getFinancials(filter).then(function(response) {
			var data = response.data;

			if( data.length ) {
				for(var index in data) {
					futureReleasesData.push(data[index]);
				}
				getFutureReceiptReleases();
			} else {
				$scope.futureReleasesData = [];
			}

		}).catch(function(response) {
			console.log('[receiptsController:getFutureAcquirers] error');
		})
	}

	function getFutureReceiptReleases() {

		for(var index in futureReleasesData){
			var acquirerId = futureReleasesData[index].acquirer.id;

			var filter = {
				startDate: calendarFactory.formatDateTimeForService($scope.futureReleases.startDate),
				endDate: calendarFactory.formatDateTimeForService($scope.futureReleases.endDate),
				groupBy: 'CARD_PRODUCT,STATUS',
				bankAccountIds: getAccountsFilter(true),
				shopIds: getShopsFilter(true),
				acquirerIds: acquirerId,
				cardProductIds: getCardProductsFilter(true),
				status: 'EXPECTED'
			};

			receiptsService.getFinancials(filter).then(function(response) {
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

	function changeTab(index) {
		$scope.tabs[index].active = true;

		if(filterStatus === 4) {
	    	if(index === 0) {
	    		getReceipt();
	    	} else if(index === 1) {
	    		getFutureReceipt();
	    	}
	    }
    }


	function clearShopFilter () {
		$scope.shopsModel = [];
        getReceipt();
	}

	function clearCardProductsFilter () {
		$scope.cardProductsModel = [];
        getReceipt();
	}

  	function getFilters() {
		// conta
		filtersService.getAccounts().then(function(response){
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
            	getCachedData();
                getReceipt();

            }

		}).catch(function(response){
			console.log('error');
		});

		// bandeira
		filtersService.getCardProducts().then(function(response){
			var filterConfig = [];
			// var addPipe(fullCardProductName) {
			// 	fullCardProductName
			// };
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
            	getCachedData();
                getReceipt();

            }

		}).catch(function(response){
			console.log('error');
		});

		// estabelecimento
		filtersService.getShops().then(function(response){
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
            	getCachedData();
                getReceipt();

            }

		}).catch(function(response){
			console.log('error');
		});

		// adquirente
		filtersService.getAcquirers().then(function(response){
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
            	getCachedData();
                getReceipt();

            }

		}).catch(function(response){
			console.log('error');
		});
	}

	function getAccountsFilter(isFuture) {
		var model = (isFuture ? $scope.accountsFutureModel : $scope.accountsModel);
		return model.id;

		//var model = (isFuture ? $scope.accountsFutureModel : $scope.accountsModel);
		//return model.map(function(item){
		//	return item.id;
		//}).join(",");
	};

	function getShopsFilter(isFuture) {
		var model = (isFuture ? $scope.shopsFutureModel : $scope.shopsModel);
		return model.map(function(item){
			return item.id;
		}).join(",");
	}

	function getAcquirersFilter(isFuture) {
		var model = (isFuture ? $scope.acquirersFutureModel : $scope.acquirersModel);
		return model.map(function(item){
			return item.id;
		}).join(",");
	}

	function getCardProductsFilter(isFuture) {
		var model = (isFuture ? $scope.cardProductsFutureModel : $scope.cardProductsModel);

		if(model.length == $scope.cardProductsData.length) {
			return [];
		}

		return model.map(function(item){
			return item.id;
		}).join(",");
	}

	function getAccountsLabel(isFuture) {

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

	function getShopsLabel(isFuture) {

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

	function getCardProductsLabel(isFuture) {

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

	function getLabels(isFuture) {
		getAccountsLabel(isFuture);
		getShopsLabel(isFuture);
		getCardProductsLabel(isFuture);
	}

    function showDetails(acquirer, cardProduct, total, status, detailPage) {
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
		$rootScope.receiptsDetails.type = status

		var redirect_url;
		switch (detailPage) {
			case "other_details":
				redirect_url = "receipts/other_details";
				break;
			case "expected_details":
				redirect_url = "receipts/expected_details";
				break;
			case "forethought":
				redirect_url = "receipts/forethought";
				break;
			default:
				redirect_url = "receipts/details";
				break;
		}
		if(redirect_url) {
			$location.path(redirect_url);
		}
    }

    function saveFilters() {
    	cacheService.saveFilter({
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

    function getCachedData() {

		if(cacheService.loadFilter('context') == 'receipts') {
			$scope.actualReleases.date = moment(cacheService.loadFilter('startDate'), "YYYYMMDD").toDate();
			$scope.accountsModel = cacheService.loadFilter('bankAccountIds');
			$scope.shopsModel = cacheService.loadFilter('shopIds');
			$scope.acquirersModel = cacheService.loadFilter('acquirerIds');
			$scope.cardProductsModel = cacheService.loadFilter('cardProductIds');
			$scope.futureReleases.startDate = moment(cacheService.loadFilter('futureStartDate'), "YYYYMMDD").toDate();
			$scope.futureReleases.endDate = moment(cacheService.loadFilter('futureEndDate'), "YYYYMMDD").toDate();
			$scope.accountsFutureModel = cacheService.loadFilter('futureBankAccountIds');
			$scope.shopsFutureModel = cacheService.loadFilter('futureShopIds');
			$scope.acquirersFutureModel = cacheService.loadFilter('futureAcquirerIds');
			$scope.cardProductsFutureModel = cacheService.loadFilter('futureCardProductIds');

		} else {
			//cacheService.clearFilter();
		}
    }

});
