angular.module('KaplenWeb.movementsModule',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/receipts', {templateUrl: 'app/views/receipts.html', controller: 'receiptsController'});
}])

.controller('receiptsController', function(menuFactory, $modal, $rootScope, $scope, calendarFactory, $location, cacheService, transactionsService, $window, userService, $timeout,
		advancedFilterService, calendarService, filtersService, receiptsService){

	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.loadParansByFilter();

	menuFactory.setActiveMovements();

	$scope.soldSummarie = [];
    $scope.expected = [];
	$scope.receipts = [];
    $scope.getReceipt = getReceipt;

    $scope.actualReleases = {};
    $scope.actualReleases.date = new Date();

    $scope.initialDate = {};
    $scope.initialDate.date = new Date();
    $scope.finalDate = {};
    $scope.finalDate.date = new Date();

    $scope.tomorrowFromToday = {};
    $scope.tomorrowFromToday.date = new Date();
    $scope.lastdayOfCurrentMonth = {};
    $scope.lastdayOfCurrentMonth.date = new Date();

	$scope.date = new Date();
	$scope.minDate = new Date();

	$scope.accountsModel = [];
	$scope.accountsData = [];

	$scope.cardProductsModel = [];
	$scope.cardProductsData = [];
    $scope.cardProductsLabel = "";

	$scope.shopsModel = [];
	$scope.shopsData = [];
	$scope.shopIds = [];
	$scope.shopsLabel = [];

    $scope.accountsLabel;

	$scope.acquirersModel = [];
	$scope.acquirersData = [];

    $scope.bigNumbers = true;
    $scope.resultTable = true
    $scope.headerDataActual = true;
    $scope.headerDataFuture = false;

    $scope.showFutureContent = showFutureContent;
    $scope.showActualContent = showActualContent;

	$scope.clearShopFilter = clearShopFilter;
	$scope.clearCardProductsFilter = clearCardProductsFilter;

    $scope.soldSummarie.payedAmount;
    $scope.soldSummarie.discountAmount;
    $scope.soldSummarie.antecipatedTotal;

    $scope.showDetails = showDetails;

	init();

	function init() {
        getFilters();
	}

    function filterParser(model, type) {
        result = [];
        if(model) {
			for(item in model) {
				result.push(model[item][type]);
			}
		}
        return result.join(',');
    }

    function showFutureContent() {
        $scope.bigNumbers = false;
        // $scope.resultTable = false;
        $scope.headerDataActual = false;
        $scope.headerDataFuture = true;
        getReceipt();
    }

    function showActualContent() {
        $scope.bigNumbers = true;
        // $scope.resultTable = true;
        $scope.headerDataActual = true;
        $scope.headerDataFuture = false;
    }

    function getArgs() {

        var startDate, endDate, startExpectedDate, endExpectedDate;

        if($scope.headerDataFuture === true) {
            startExpectedDate = calendarFactory.formatDateTimeForService($scope.expected.tomorrowFromToday);
            endExpectedDate = calendarFactory.formatDateTimeForService($scope.expected.lastdayOfCurrentMonth);
        } else {
            if($scope.date) {
                startDate = calendarFactory.formatDateTimeForService($scope.actualReleases.date);
                endDate = calendarFactory.formatDateTimeForService($scope.actualReleases.date);
            }
        }

        $scope.accountsLabel = $scope.accountsModel.label;

        var shopIds = [];
        if($scope.shopsModel) {
            shopIds = filterParser($scope.shopsModel, "id");
            $scope.shopsLabel = getLabel($scope.shopsModel, $scope.shopsData, "estabelecimentos", "todos os estabelecimentos");
        }

        var cardProductIds = [];
        if($scope.cardProductsModel) {
        	cardProductIds = filterParser($scope.cardProductsModel, "id");
            $scope.cardProductsLabel = getLabel($scope.cardProductsModel, $scope.cardProductsData, "outras", "todas as bandeiras");
            //$scope.chipCardProduct = true;
        }

        var bankAccountIds = [];
        if($scope.accountsModel.id) {
            bankAccountIds = $scope.accountsModel.id;
        }

        // data-header ultimos lançamentos
        $scope.soldSummarie.day = calendarFactory.getDayOfDate($scope.actualReleases.date);
        $scope.soldSummarie.month = calendarFactory.getMonthNameAbreviation(moment($scope.actualReleases.date));

        // data-header lançamentos futuros
        $scope.expected.tomorrow = calendarFactory.getDayOfDate($scope.actualReleases.date) + 1;
        $scope.expected.lastDay = calendarFactory.getLastDayOfMonth($scope.finalDate.date, true) -1;

        //pré-selecionando uma data no calendário dos filtros de lançamentos futuros
        $scope.expected.tomorrowFromToday = calendarFactory.getTomorrowFromToday($scope.tomorrowFromToday.date, true);
        $scope.expected.lastdayOfCurrentMonth = calendarFactory.getLastDayOfCurrentMonth($scope.lastdayOfCurrentMonth.date);

        return {
            //			"currency" : 'BRL',
            startDate: startDate,
            endDate: endDate,
            startExpectedDate: startExpectedDate,
            endExpectedDate: endExpectedDate,
            bankAccountIds: bankAccountIds,
            shopIds: shopIds,
            cardProductIds: cardProductIds,
            acquirerIds: '1,2',
            groupBy: 'ACQUIRER,CARD_PRODUCT',
            status: "RECEIVED,CANCELLED,FORETHOUGHT"
        }
    }

    function getLabel(model, data, string_plural, string_all_selected) {
        var label = "";
        if(model.length >= 1) {
            var cpLabel = model[0].label;
            var plural = "";
            if(model.length > 2) {
                excedentNumber = model.length - 1;
                plural = " + " + excedentNumber.toString() + " " + string_plural;
            } else if(model.length == 2) {
                plural = " e " + model[1].label;
            }
            label = cpLabel + plural;
        }
        if(data.length == model.length) {
            label = string_all_selected;
        }
        return label;
    };

	function financialParser() {
		console.log('financialParser');

        var args = getArgs();
		console.log('args', args);

		receiptsService.getFinancials(args).then(function(response){
            var acquirers = [];
			var aux_acquirer_id = [];
			var aux_card_products = [];
            $scope.soldSummarie.payedAmount = 0;
            $scope.soldSummarie.discountAmount = 0;
            //console.log("response.data", response.data)
            for( var x in response.data) {
                if(!inArray(response.data[x].acquirer.id, aux_acquirer_id)) {

                    aux_acquirer_id.push(response.data[x].acquirer.id);

                    var acquirer_object = [];
                    acquirer_object["id"] = response.data[x].acquirer.id;
                    acquirer_object["name"] = response.data[x].acquirer.name;
                    acquirer_object["balanceAmount"] = 0;
                    acquirers.push(acquirer_object);
                }

                if(!$scope.headerDataFuture) {

                    // todo: DEIXAR DINAMICO
                    var balanceAmountSaved = acquirers[0]["balanceAmount"];
                    var discountAmountSaved = acquirers[0]["discountAmount"];

                    if(response.data[x].description == "vendas") {
                        // coloca um novo valor no array
                        // todo: DEIXAR DINAMICO
                        acquirers[0]["balanceAmount"] = response.data[x].payedAmount + balanceAmountSaved;
                        acquirers[0]["discountAmount"] = response.data[x].discountAmount + discountAmountSaved;

                        // soldSummarie
                        $scope.soldSummarie.payedAmount = acquirers[0]["balanceAmount"];
                        $scope.soldSummarie.discountAmount = acquirers[0]["discountAmount"] ? acquirers[0]["discountAmount"] : 0;
                    }

                    /**
                    * CONTROLA OS cardProducts
                    */
                    if(!acquirers[0]["cardProducts"]) {
                        acquirers[0]["cardProducts"] = [];
                    }

                    // trata release para objetos repetidos
                    aux_card_product_repetido = false;
                    for(y in acquirers[0]["cardProducts"] ) {
                        if(acquirers[0]["cardProducts"][y].id == response.data[x].cardProduct.id) {

                            // tratando releases
                            release = {};
                            release.type = response.data[x].description;
                            release.payedAmount = response.data[x].payedAmount;
                            acquirers[0]["cardProducts"][y]["releases"].push(release);

                            aux_card_product_repetido = true;
                        }
                    }

                    if(!aux_card_product_repetido) {
                        cardProductObject = {};
                        cardProductObject.id = response.data[x].cardProduct.id;
                        cardProductObject.balanceAmount = response.data[x].balanceAmount;
                        cardProductObject.name = response.data[x].cardProduct.name;
                        cardProductObject.releases = [];

                        // tratando releases
                        release = {};
                        release.type = response.data[x].description;
                        release.payedAmount = response.data[x].payedAmount;
                        cardProductObject.releases.push(release);

                        acquirers[0]["cardProducts"].push(cardProductObject);
                    }
                }
            }

            // pagamentos não recebidos
            args.status = "EXPECTED";
            receiptsService.getFinancials(args).then(function(response){

                // cardid +  cardname + valor
                var expectedPayments = [];
                var expectedPaymentsValue = 0;

                for( var x in response.data) {
                    if(response.data[x].cardProduct.id) {
                        var cardProductId = response.data[x].cardProduct.id;
                        var cardProductName = response.data[x].cardProduct.name;
                        var expectedAmount = response.data[x].expectedAmount;
                        var arrayIndex;

                        cardProductExists = false;
                        for(var y in expectedPayments) {
                            if(expectedPayments[y]["id"] == cardProductId) {
                                cardProductExists = true;
                            } else {
                                arrayIndex = y;
                            }
                        }

                        if(!cardProductExists) {
                            objectExpectedPayments = {
                                cardProductId: cardProductId,
                                cardProductName: cardProductName,
                                expectedAmount: expectedAmount
                            };
                            expectedPayments.push(objectExpectedPayments);
                        } else {
                            expectedPayments[arrayIndex].expectedAmount = expectedPayments[arrayIndex].expectedAmount + expectedAmount;
                        }

                        expectedPaymentsValue = expectedPaymentsValue + expectedAmount;
                    }
                }

                acquirers.expectedPayments = expectedPayments;
                acquirers.expectedPayments.value = expectedPaymentsValue;

                args.types = "OTHER";
                args.groupBy = "";
                args.status = "";
                receiptsService.getAdjusts(args).then(function(response){

                    // cardid +  cardname + valor
                    var otherPayments = [];
                    var otherPaymentsValue = 0;

                    for( var x in response.data.content) {

                        $scope.chipOtherPaiments = true;

                        var otherDescription = response.data.content[x].description;
                        var otherAmount = response.data.content[x].amount;
                        var arrayIndex;

                        otherPaymentsExists = false;
                        for(var y in otherPayments) {
                            if(otherPayments[y]["otherDescription"] == otherDescription) {
                                otherPaymentsExists = true;
                            } else {
                                arrayIndex = y;
                            }
                        }

                        if(!otherPaymentsExists) {
                            objectOtherPaymentsExists = {
                                otherDescription: otherDescription,
                                otherAmount: otherAmount
                            };
                            otherPayments.push(objectOtherPaymentsExists);
                        }

                        otherPaymentsValue = otherPaymentsValue + otherAmount;

                    }
                    acquirers.otherPayments = otherPayments;
                    acquirers.otherPayments.value = otherPaymentsValue;
                    //console.log("acquirers", acquirers);
                }).catch(function(response){
                    console.log('error');
                });

            }).catch(function(response){
                console.log('error');
            });

			$scope.receipts = acquirers;
		}).catch(function(response){
			console.log('error');
		});

        getForethought();
	}

    function getForethought() {

        args = getArgs();
        args.types = "";
        args.status = "FORETHOUGHT";
        args.groupBy = "ACQUIRER,CARD_PRODUCT";

        receiptsService.getFinancials(args).then(function(response){
        $scope.soldSummarie.antecipatedTotal = 0;

        }).catch(function(response){
            console.log('error');
        });

    }

    function inArray(needle, haystack) {
	    var length = haystack.length;
	    for(var i = 0; i < length; i++) {
	        if(haystack[i] == needle) return true;
	    }
	    return false;
	}

    function getReceipt() {
		console.log('getreceipt')
        financialParser();
        // getSoldSummarie();
    }


    function onlyOnSearch() {
        $scope.shopsLabel = $scope.shopsModel;
    }

	function clearShopFilter () {
		$scope.shopsModel = [];
        afterClear();
	}

	function clearCardProductsFilter () {
		$scope.cardProductsModel = [];
        afterClear();
	}

    function afterClear() {
        getReceipt();
    }

  	function getFilters() {

		console.log('getfilters')

        var filterStatus = 0;

		// conta
		filtersService.getAccounts().then(function(response){
			var filterConfig = [];
			for(var x in response.data){
				var obj = {};
				obj.id = response.data[x].id;
				obj.label = response.data[x].accountNumber;
				filterConfig.push(obj);
			}
			$scope.accountsData = filterConfig;

			filterStatus++;

            if(filterStatus === 4) {
                getReceipt();
            }

		}).catch(function(response){
			console.log('error');
		});

		// bandeira
		filtersService.getCardProducts().then(function(response){
			var filterConfig = [];
			for(var x in response.data){
				var obj = {};
				obj.id = response.data[x].id;
				obj.label = response.data[x].name;
				filterConfig.push(obj);
			}
			$scope.cardProductsData = filterConfig;
            $scope.cardProductsModel = angular.copy($scope.cardProductsData);

            filterStatus++;
            if(filterStatus === 4) {
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

            filterStatus++;

            if(filterStatus === 4) {
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

            filterStatus++;

            if(filterStatus === 4) {
                getReceipt();
            }

		}).catch(function(response){
			console.log('error');
		});
	}

    function showDetails(acquirer, cardProduct) {
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
        $location.path('receipts/details');
    }
});
