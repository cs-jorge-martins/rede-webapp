var app = angular.module('KaplenWeb',['restangular', 'ngRoute','highcharts-ng', 'ngLocale','angularFileUpload','ui.bootstrap', 'ngSanitize', 'ngAnimate',
                            'ui.utils.masks', 'jmdobry.angular-cache', 'chart.js', 'angularjs-dropdown-multiselect',
                            'com.2fdevs.videogular',
                            'com.2fdevs.videogular.plugins.controls',
                            'com.2fdevs.videogular.plugins.overlayplay',
                            'com.2fdevs.videogular.plugins.poster',
                            'KaplenWeb.dashboardController', 'KaplenWeb.dashboardService',
                            'KaplenWeb.resumoConciliacaoService',
                            'KaplenWeb.transactionsService',
                            'KaplenWeb.loginController', 'KaplenWeb.loginService',
                            'KaplenWeb.filtersService', 'KaplenWeb.gestaoController',
                            'KaplenWeb.relatorioVendasController',
                            'KaplenWeb.relatorioFinanceiroController',
                            'KaplenWeb.relatorioAjustesController',
                            'KaplenWeb.relatorioChargebacksController',
                            'KaplenWeb.relatorioController', 'KaplenWeb.relatorioService',
                            'KaplenWeb.taxaAdministracaoController', 'KaplenWeb.taxaAdministracaoService',
							'KaplenWeb.cartaCancelamentoService',
                            'KaplenWeb.movementsTaxController',
                            'KaplenWeb.movementsReceiptController',
							'KaplenWeb.movementsModule', 'KaplenWeb.movementsService',
							'KaplenWeb.kaplenAdminService','KaplenWeb.cacheService',
							'KaplenWeb.installmentsService', 'chieffancypants.loadingBar',
							'KaplenWeb.userManager','KaplenWeb.userService',
							'KaplenWeb.settlementManager','KaplenWeb.settlementService',
							'KaplenWeb.terminalsManager','KaplenWeb.terminalService',
							'KaplenWeb.integrationService', 'KaplenWeb.advancedFilterService',
							'KaplenWeb.envioEmailController', 'KaplenWeb.calendarService',
							'KaplenWeb.optionsManager', 'KaplenWeb.optionsService',
							'KaplenWeb.Request', 'KaplenWeb.receiptsService',
                            'Conciliador.salesController', 'Conciliador.salesDetailsController',
                            'Conciliador.FinancialService', 'Conciliador.FinancialFilter',
                            'Conciliador.MovementSummaryService', 'Conciliador.MovementSummaryFilter',
                            'Conciliador.AdjustSummaryService', 'Conciliador.TransactionService',
                            'Conciliador.TransactionSummaryService', 'Conciliador.TransactionConciliationService',
                            'Conciliador.FirstAccessController',
                            'Conciliador.helpController',
                            'Conciliador.integrationController',
                            'Conciliador.receiptsDetailsController',
                            'ngFileSaver'
							])

	.constant('app', {
		'endpoint': 'https://3m3b6fs155.execute-api.us-east-1.amazonaws.com/dev/mvp'
	})
	.config(function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeSpinner = true;
	}).config(function (datepickerConfig) {
		datepickerConfig.showWeeks = false;
    })
	.config(['$routeProvider','RestangularProvider','$httpProvider','$angularCacheFactoryProvider',
	         function ($routeProvider, RestangularProvider, $httpProvider, $angularCacheFactoryProvider) {

   $httpProvider.defaults.headers.common = {};
   $httpProvider.defaults.headers.post = {};
   $httpProvider.defaults.headers.put = {};
   $httpProvider.defaults.headers.patch = {};

	$routeProvider.when('/teste', {templateUrl: 'app/views/login.html', controller: 'loginController'});

	RestangularProvider.setBaseUrl(app.endpoint);

	RestangularProvider.setFullResponse(false);

	$httpProvider.interceptors.push(function ($q, $rootScope, $location, $window) {
		$rootScope.baseUrl = app.endpoint;

        return {
        	'request': function(config) {
        		if (angular.isDefined($window.sessionStorage.token)) {
        			if(angular.isDefined($window.sessionStorage.schemaName)){
        				$rootScope.login = '';
        			}
        			if(angular.isDefined($window.sessionStorage.user)){
        				$rootScope.user = angular.fromJson($window.sessionStorage.user);
            			$rootScope.pvList = $window.sessionStorage.pvList;
            			$rootScope.companies = $rootScope.user.companyDTOs;
            			$rootScope.currencySymbol = "R$";
                        $rootScope.currency = 'BRL';
                        if($window.sessionStorage.firstAccess) {
                            $rootScope.firstAccess = true;
                        }

                        if($window.sessionStorage.pvList){
                            $rootScope.initialized = true;
                        }

        			}
        			config.headers['Authorization'] = $window.sessionStorage.token;
                    //config.headers['X-Api-Key'] = $window.sessionStorage.pvList;
        		} else {
                    $location.path("/login");
                }
        		return config || $q.when(config);
        	},
            'responseError': function(config) {

                console.log(config.status)

                if(config.status == '401'){
        	    	$rootScope.logout();
        	        $location.path('/login');
        	        $rootScope.alerts =  [ { type: "danger", msg: "E-mail informado não existe ou a senha está incorreta"} ];
        	    }
        	    else if(config.status == '400' || config.status == '403'){//400 e 403 = Acesso negado/Usuário não autorizado
        	    	$location.path('/login');
        	    	$rootScope.logout();
        	    	$rootScope.alerts =  [ { type: "danger", msg: "Acesso negado/Usuário não autorizado"} ];
        	    }
        	    else if(config.status == '405'){//405 = Usuário bloqueado
        	    	$rootScope.logout();
        	        $location.path('/login');
        	    	$rootScope.alerts =  [ { type: "danger", msg: "Usuário bloqueado. Por favor, tente mais tarde."}];
        	    }
        	    else if(config.status == '500'){//500 = Internal Server Error
        	    	$rootScope.alerts =  [ { type: "danger", msg: "Erro Interno do Servidor. Por favor, tente mais tarde."}];
        	    }

                return config;
            }
        };
    });


}]).run(function(Restangular, $location, $rootScope, $window, $modal, userService, cacheService) {

	Restangular.setResponseInterceptor(function (data, operation, what, url, response, deferred) {
        var headers = response.headers();

        $rootScope.restartAlerts();
        if(response.status === 204){
        	return angular.fromJson(headers.error);
        }
        if (angular.isDefined(headers.token)) {
       	 $window.sessionStorage.token = headers.token;
        }
        return response.data;
    });

    Restangular.setFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {
      for (param in params) {
      	if (params[param] instanceof Array) {
      		params[param] = params[param].join();
      	}
      }
      return {
        element: element,
        headers: headers,
        httpConfig: httpConfig
      };
    });


	// ********************************************************************************************


    $rootScope.loading = true;
    $rootScope.$on("cfpLoadingBar:loading",function(){
       $rootScope.loading = true;
    });
    $rootScope.$on("cfpLoadingBar:completed",function(){
       $rootScope.loading = false;
    });




	$rootScope.logout = function() {
		$rootScope.destroyVariablesSession();
		$rootScope.login = 'login';
		$rootScope.alerts =  [ { type: "success", msg: "Você efetuou o logout com sucesso. Até breve!"} ];
		$location.path("/login");
	};

	$rootScope.destroyVariablesSession = function(){
		delete $window.sessionStorage.user;
		delete $window.sessionStorage.token;
		delete $window.sessionStorage.userName;
		delete $window.sessionStorage.permission;

		delete $window.sessionStorage.pvList;
		delete $window.sessionStorage.company;
		delete $window.sessionStorage.companyName;
		delete $window.sessionStorage.schemaName;
		delete $window.sessionStorage.companies;

		delete $window.sessionStorage.currency;
		delete $window.sessionStorage.currencies;
		delete $window.sessionStorage.tokenApi;

        delete $window.sessionStorage.firstAccess;
        delete $rootScope.firstAccess;
        delete $window.sessionStorage.tour;

        delete $rootScope.initialized;
		delete $rootScope.userName;
		delete $rootScope.pvList;
		delete $rootScope.company;
		delete $rootScope.companyName;
		delete $rootScope.companies;
		delete $rootScope.permission;

		delete $rootScope.currency;
		delete $rootScope.currencies;


		$rootScope.login = 'login';
	};

	var SelectedCompaniesCtrl = function($scope, $window, $modalInstance, $location, getCompanies) {

		$scope.companies = getCompanies;
		$scope.buttonActive = true;

		$scope.activeButton = function(company) {
			$scope.company = company;
			if($window.sessionStorage.company === $scope.company.id.toString()){
				$scope.buttonActive = true;
			}
			else{
				$scope.buttonActive = false;
			}
		};

		$scope.selectedCompany = function() {
			$modalInstance.close($scope.company);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	};

	$rootScope.help = function(){
		if($rootScope.activeDashboard){
			restartDashboardTour(userService);
		}else if($rootScope.activeResumoConciliacao){
			restartResumoConciliacaoTour(userService);
		}else if($rootScope.activeMovements){
			restartFinanceiroTour(userService);
		}else if($rootScope.activeGestao){
			restartGestaoTour(userService);
		}else if($rootScope.activeReports){
			alert("Em construção");
		}
	};

	$rootScope.restartAlerts = function(){
		$rootScope.alerts = [];
	};

	$rootScope.currencySelected = function(currencyValue) {
		$window.sessionStorage.currency = currencyValue;

		angular.forEach($rootScope.currencies, function(currency, index){
			if(currency.value == currencyValue){
				//Seta símbolo padrão de acordo com a moeda do usuário
				$rootScope.currencySymbol = $window.sessionStorage.currencySymbol = currency.symbol;
			}
		});

		$location.path("/dashboardNew");
	};

	$rootScope.closeAlert = function(index) {
		$rootScope.alerts.splice(index, 1);
	};

}).directive('upload', ['uploadManager', function factory(uploadManager) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).fileupload({
                dataType: 'text',
                add: function (e, data) {
                    uploadManager.add(data);
                },
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    uploadManager.setProgress(progress);
                },
                done: function (e, data) {
                    uploadManager.setProgress(0);
                }
            });
        }
    };
}])

.factory('calendarFactory', function() {
	var format = "DD/MM/YYYY";

	var timezone = "America/Brasilia";
	moment.locale('pt-BR');
	var momentjs = moment();
	var momentForDashboard = moment();
	var nowFormattedDashboard = momentForDashboard.tz(timezone).subtract(1, 'days');
	var firstDayOfMonth = moment("01/" + (momentjs.month()+1) + "/" + momentjs.year(), format);
	var firstDayOfMonthFormatted = firstDayOfMonth.tz(timezone).format(format);

	var firstDayOfCurrentMonth = moment("01/" + (moment().month()+1) + "/" + moment().year());
	var actualDayOfCurrentMonth = moment().date() == 1 ? moment().tz(timezone) : moment().tz(timezone).subtract(1, 'days');

	var firstDayOfLastMonth = moment((moment().month()) + "/"+ "01/" + + moment().year());
	var lastDayOfLastMonth = moment().tz(timezone).subtract(1, 'months').endOf('month');

	var firstDayOfLastMonthDashboard = moment((momentForDashboard.month()) + "/"+ "01/" + + moment().year());
	var lastDayOfLastMonthDashboard = moment((momentForDashboard)).tz(timezone).subtract(1, 'months').endOf('month');

	function getDateFromString(value, format){
		return moment = moment(value,format);
	}

	function getFirstDayOfMonth(){
		return firstDayOfCurrentMonth;
	}

	function getActualDayOfCurrentMonth(){
		return actualDayOfCurrentMonth;
	}

	function getActualDayOfCurrentMonthForDashboard(){
		return nowFormattedDashboard;
	}

	function getFirstDayOfLastMonth(){
		return firstDayOfLastMonth;
	}

	function getFirstDayOfLastMonthForDashboard(){
		return firstDayOfLastMonthDashboard;
	}

	function getLastDayOfLastMonth(){
		return lastDayOfLastMonth;
	}

	function getLastDayOfLastMonthForDashboard(){
		return lastDayOfLastMonthDashboard;
	}

	function getActualDateForDashboard(){
		return nowFormattedDashboard.format(format);
	}

	function getMomentOfSpecificDate(date){
		return moment(date, format).tz(timezone);
	}

    function getUnixMomentOfSpecificDate(date){
		return moment.unix(date, format).tz(timezone);
	}

	function getFormat() {
		return format;
	}

	function getActualDate() {
		return moment().tz(timezone).format(format);
	}
	function getLastDayOfCurrentMonth() {
		return getLastDayOfMonth();
	}
	function getTomorrowFromToday() {
		return moment().add(1, 'day').tz(timezone).format(format);
	}
	function getActualDateUploadModal() {
		return moment().tz(timezone).format("DD/MM/YYYY HH:mm:ss");
	}

	function getYesterdayDate(){
		var today = moment().tz(timezone);
		//Obter ultimo dia do mes anterior, pois ja havia somado um mes anteriormente
		var yesterday = today.subtract(1, 'day');
		return yesterday.tz(timezone).format(format);
	}

	function getFirstDayOfMonthForDashboard() {
		var firstDayOfMonthDashboard = moment("01/" + (nowFormattedDashboard.month()+1) + "/" + nowFormattedDashboard.year(), format);
		return firstDayOfMonthDashboard.tz(timezone).format(format);
	}

	function getFirstDayOfMonth(date) {
        if( date ) {
            var initialDateMoment = moment(date, format).startOf('month');
        } else {
            var initialDateMoment = momentjs.startOf('month');
        }
		return initialDateMoment.tz(timezone).format(format);
	}

	function getLastDayOfMonth(date, raw) {
        if( date ) {
            var finalDateMoment = moment(date, format).endOf('month');
        } else {
            var finalDateMoment = momentjs.endOf('month');
        }

        if(raw) {
            return finalDateMoment.date();
        }
		return finalDateMoment.tz(timezone).format(format);
	}

    function getDayOfWeek(date) {
        return moment(date, format).day();
    }

    function getFirstDayOfYear(year) {
        return year + "0101";
	}

	function getLastDayOfYear(year) {
		return year + "1201";
	}

	function formatDate(date, isDiferentFormat) {
		if(isDiferentFormat){
			return moment(date).tz(timezone).format("DD/MM/YYYY");
		}else{
			return moment(date, format).tz(timezone).format(format);
		}
	}


    function formatDateForService(date) {
        var momentTemp = moment(date, format).tz(timezone);
		return momentTemp.format("YYYYMMDD");
    }

    function formatDateTimeForService(date) {
		if(date) {
			var dateAux = formatDateForService(date);
			return (dateAux === 'Invalid date') ? (moment(date).tz(timezone)).format("YYYYMMDD") : dateAux;
		}
		else {
			return date;
		}
    }

	function getDateFromString(date){
		return moment(date, format);
	}

	function addDaysToDate(date, qtd){
		 var resultMoment = moment(date, format);
		 var resultAddMoment = resultMoment.add(qtd, 'day');

		 return resultAddMoment.tz(timezone);
	}

    function addMonthsToDate(date, qtd){
		 var resultMoment = moment(date, format);
		 var resultAddMoment = resultMoment.add(qtd, 'month');

		 return resultAddMoment.tz(timezone);
	}

    function addYearsToDate(date, qtd){
		 var resultMoment = moment(date, format);
		 var resultAddMoment = resultMoment.add(qtd, 'year');

		 return resultAddMoment.tz(timezone);
	}

	function getYear(date){
		var momentTemp = moment(date, format).tz(timezone);
		return momentTemp.format("YYYY");
	}

	function getMonthNumberOfDate(date){
		var momentFunction =  moment(date, format).tz(timezone);

		return momentFunction.month()+1;
	}

	function getDayOfMonth(date){
		return moment(date, format).tz(timezone).format("D");
    }

    function getDayOfDate(date){
        return moment(date).get('date');
    }

    function getMonthNameOfDate(date){
        return moment(date).format('MMMM');
    }

	function getHoursAndMinutes(hour){
		return moment(hour, "HH:mm:ss").tz(timezone).format("HH:mm");
	}

	function verifyValidHours(hour){
		return moment(hour, "HH:mm:ss").isValid();
	}

	function getMonthNameAbreviation(date){
		return moment(date, format).tz(timezone).format("MMM");
	}

	function getNameOfMonthAndYearForDashboard(){
		return nowFormattedDashboard.format("MMMM YYYY");
	}

	function getNameOfMonthAndYear(date){
		if(date != null){
			return moment(date, format).tz(timezone).format("MMMM YYYY");
		}else{
			return momentjs.format("MMMM YYYY");
		}
	}

    function getNameOfMonth(date){
		if(date != null){
			return moment(date, format).tz(timezone).format("MMMM");
		}else{
			return momentjs.format("MMMM");
		}
	}


	function getFirstDayOfSpecificMonth(month, year){
		var firstDayOfSpecificMonth = moment("01/" + (month+1) + "/" + year, format);
		var firstDayOfMonthFormatted = firstDayOfSpecificMonth.tz(timezone).format(format);

		return firstDayOfMonthFormatted;
	}

	function getLastDayOfSpecificMonth(month, year){
		var firstDayOfMonth = moment("01/" + (month+1) + "/" + year, format);
		var firstDayOfNextMonth = firstDayOfMonth.add(1, 'month');
		//Obter ultimo dia do mes anterior, pois ja havia somado um mes anteriormente
		var lastDayOfLastMonth = firstDayOfNextMonth.subtract(1, 'day');

		var lastDayOfMonthFormatted = lastDayOfLastMonth.tz(timezone).format(format);

		return lastDayOfMonthFormatted;
	}

	function getSpecificDateOfYear(year){
		var momentPersonalized = moment("01/01/" + year, format);
		return momentPersonalized.tz(timezone).format(format);
	}

	function checkInvalidPeriod(initialDate, finalDate, initialDateChanged, finalDateChanged){
		var initialDateMoment = null;
		var finalDateMoment = null;

		if(initialDateChanged){
			initialDateMoment = this.getMomentOfSpecificDate(formatDate(initialDate, true));
		}else{
			initialDateMoment = this.getMomentOfSpecificDate(initialDate);
		}

		if(finalDateChanged){
			finalDateMoment = this.getMomentOfSpecificDate(formatDate(finalDate, true));
		}else{
			finalDateMoment = this.getMomentOfSpecificDate(finalDate);
		}

		if(initialDateMoment.isAfter(finalDateMoment) || finalDateMoment.isBefore(initialDateMoment)){
			return true;
		}else{
			return false;
		}
	}

	function transformBrDateIntoDate(date) {
		var parts = date.split("/");
		return new Date(parts[2], parts[1]-1, parts[0], 0, 0, 0, 0);
	}

	return {
		getMomentOfSpecificDate:getMomentOfSpecificDate,
        getUnixMomentOfSpecificDate:getUnixMomentOfSpecificDate,
		getFormat:getFormat,
		getActualDateUploadModal:getActualDateUploadModal,
		getActualDate:getActualDate,
		getFirstDayOfMonth: getFirstDayOfMonth,
		getLastDayOfMonth:getLastDayOfMonth,
        getFirstDayOfYear: getFirstDayOfYear,
		getLastDayOfYear:getLastDayOfYear,
		getYesterdayDate:getYesterdayDate,
        getDayOfWeek: getDayOfWeek,
		getFirstDayOfSpecificMonth: getFirstDayOfSpecificMonth,
		getLastDayOfSpecificMonth: getLastDayOfSpecificMonth,
		getNameOfMonthAndYear: getNameOfMonthAndYear,
        getNameOfMonth: getNameOfMonth,
		formatDate: formatDate,
		getDayOfMonth:getDayOfMonth,
		getLastDayOfLastMonth:getLastDayOfLastMonth,
		getLastDayOfLastMonthForDashboard:getLastDayOfLastMonthForDashboard,
		getActualDayOfCurrentMonth:getActualDayOfCurrentMonth,
		getActualDayOfCurrentMonthForDashboard:getActualDayOfCurrentMonthForDashboard,
		getMonthNameAbreviation:getMonthNameAbreviation,
		getActualDateForDashboard: getActualDateForDashboard,
		getFirstDayOfMonthForDashboard:getFirstDayOfMonthForDashboard,
		getNameOfMonthAndYearForDashboard:getNameOfMonthAndYearForDashboard,
        formatDateForService:formatDateForService,
        formatDateTimeForService:formatDateTimeForService,
        getFirstDayOfLastMonth:getFirstDayOfLastMonth,
        getFirstDayOfLastMonthForDashboard:getFirstDayOfLastMonthForDashboard,
		getDateFromString:getDateFromString,
		getDateFromString: getDateFromString,
		getMonthNumberOfDate:getMonthNumberOfDate,
		getHoursAndMinutes:getHoursAndMinutes,
		verifyValidHours:verifyValidHours,
		addDaysToDate:addDaysToDate,
        addMonthsToDate:addMonthsToDate,
        addYearsToDate:addYearsToDate,
		getYear:getYear,
		getSpecificDateOfYear:getSpecificDateOfYear,
		checkInvalidPeriod:checkInvalidPeriod,
        getDayOfDate:getDayOfDate,
        getMonthNameOfDate:getMonthNameOfDate,
        getLastDayOfCurrentMonth: getLastDayOfCurrentMonth,
        getTomorrowFromToday: getTomorrowFromToday,
		transformBrDateIntoDate: transformBrDateIntoDate
	};
})

.controller('consultaVendas', function($rootScope, $scope, $modal, calendarFactory, resumoConciliacaoService, installmentsService, calendarService) {

	//Variaveis
	$scope.nsu = '';
	$scope.tid = '';
	$scope.authorization = '';
	$scope.gross = '';
	$scope.erpId = '';
	$scope.requiredFields = true;
	$scope.alerts =  '';

	//Extensao do serviço para filtro avançado
	angular.extend($scope, calendarService);
	$scope.resetCalendarService();

	$scope.dataInicial = calendarFactory.getFirstDayOfMonth();
	$scope.dataFinal = calendarFactory.getLastDayOfMonth();

	$scope.totalItensPage = "10";
	$scope.currentPage = 1;

	$scope.changeRequiredFields = function(){
		if($scope.nsu != '' || $scope.tid != '' || $scope.authorization != ''){
			$scope.requiredFields = false;
		}
		else{
			$scope.requiredFields = true;
		}
	};

	$scope.comprovanteVenda = function(item) {
		var modalInstance = $modal.open({
			templateUrl: 'app/views/resumoConciliacao/comprovanteVenda.html',
			controller: ModalComprovanteVendas,
			size:'sm',
			resolve: {
				item: function(){
					return item;
				}
			}
		});
	};

	var ModalComprovanteVendas = function ($scope, $modalInstance, Restangular, item) {
		$scope.item = item;

		installmentsService.getByTransactions(item.id, 0, false).then(function(it) {
			$scope.installments = it;
		});

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	};

	$scope.alterTotalItensPage = function() {
		this.currentPage = $scope.currentPage = 1;
		$scope.totalItensPage = this.totalItensPage;
		$scope.buscarVendas();
	};

	$scope.pageChanged = function() {
		$scope.currentPage = this.currentPage;

		resumoConciliacaoService.buscarVendas($scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal), $scope.nsu, $scope.tid,
				$scope.authorization, $scope.gross, $scope.erpId, $rootScope.currency, $scope.currentPage, $scope.totalItensPage).then(function(itens){

					$scope.itensSearched = itens;
					$scope.alerts = '';
		});
	};

	$scope.buscarVendas = function(){
		$scope.checkInvalidDates = calendarFactory.checkInvalidPeriod($scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal), $scope.initialDateChanged, $scope.finalDateChanged);

		if($scope.requiredFields == false){
			if($scope.checkInvalidDates == false){
				resumoConciliacaoService.countVendas($scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal), $scope.nsu, $scope.tid,
						$scope.authorization, $scope.gross, $scope.erpId, $rootScope.currency).then(function(totalItens){

						$scope.totalItens = totalItens;
						$scope.maxSize = maxSizePagination(totalItens, $scope.totalItensPage);

						resumoConciliacaoService.buscarVendas($scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal), $scope.nsu, $scope.tid,
								$scope.authorization, $scope.gross, $scope.erpId, $rootScope.currency, $scope.currentPage, $scope.totalItensPage).then(function(itens){

									if(itens.length > 0){
										angular.forEach(itens, function(item, index){
											//Verifica status de RECONCILIATION
											if(item.reconciliationStatusId == 1){
												item.situation = "NC";
											}else if(item.reconciliationStatusId == 2){
												item.situation = "CO";
											}else{
												item.situation = "NP";
											}

											//Verifica se é cancelada
											if(item.statusId == 2){
												item.situation = item.situation + " / Canc";
											}
										});

										$scope.itensSearched = itens;
										$scope.alerts = '';
									}else{
										$scope.alerts =  [ { type: "danger", msg: 'Nenhuma venda foi encontrada.'} ];
									}
						});
				});
			}else{
				$scope.alerts =  [ { type: "danger", msg: 'Período incorreto. Favor corrigir o período e tentar novamente.'} ];
			}
		}else{
			$scope.alerts =  [ { type: "danger", msg: 'O preenchimento dos campos NSU ou TID ou Autorização é obrigatório.'} ];
		}
	};

	$scope.consultaVendas = function(item) {
		var modalInstance = $modal.open({
			templateUrl: 'app/views/vendas/consultaVendas.html',
			controller: ModalConsultaVendas,
			size:'sm'
		});
	};

	var ModalConsultaVendas = function ($scope, $modalInstance, Restangular) {
		$scope.close = function () {
			$scope.itensSearched = '';

			$modalInstance.dismiss('cancel');
		};
	};

})
.factory('menuFactory', function($rootScope) {

	function setActiveDashboard() {
        this.deactivate();
		$rootScope.activeDashboard = true;
	}

	function setActiveGestao() {
        this.deactivate();
		$rootScope.activeGestao = true;
	}

	function setActiveMovements() {
        this.deactivate();
		$rootScope.activeMovements = true;
	}

	function setActiveResumoConciliacao() {
        this.deactivate();
		$rootScope.activeResumoConciliacao = true;
	}

	function setActiveReports() {
        this.deactivate();
		$rootScope.activeReports = true;
	}

    function setActiveReportsFinancial() {
        this.deactivate();
		$rootScope.activeReports = true;
        $rootScope.activeReportsFinancial = true;
	}

    function setActiveReportsChargebacks() {
        this.deactivate();
		$rootScope.activeReports = true;
        $rootScope.activeReportsChargebacks = true;
	}

    function setActiveReportsSales() {
        this.deactivate();
		$rootScope.activeReports = true;
        $rootScope.activeReportsSales = true;
	}

    function setActiveReportsAdjustments() {
        this.deactivate();
		$rootScope.activeReports = true;
        $rootScope.activeReportsAdjustments = true;
	}

    function setActiveIntegration() {
        this.deactivate();
		$rootScope.activeIntegration = true;
	}

    function deactivate() {
        $rootScope.activeResumoConciliacao = false;
		$rootScope.activeDashboard = false;
		$rootScope.activeGestao = false;
		$rootScope.activeMovements = false;
		$rootScope.activeReports = false;
        $rootScope.activeReportsFinancial = false;
        $rootScope.activeReportsChargebacks = false;
        $rootScope.activeReportsAdjustments = false;
        $rootScope.activeReportsSales = false;
        $rootScope.activeIntegration = false;
    }

	return {
		setActiveDashboard: setActiveDashboard,
		setActiveGestao: setActiveGestao,
		setActiveMovements: setActiveMovements,
		setActiveResumoConciliacao: setActiveResumoConciliacao,
		setActiveReports: setActiveReports,
        setActiveReportsSales: setActiveReportsSales,
        setActiveReportsFinancial: setActiveReportsFinancial,
        setActiveReportsAdjustments: setActiveReportsAdjustments,
        setActiveReportsChargebacks: setActiveReportsChargebacks,
        setActiveIntegration: setActiveIntegration,
        deactivate: deactivate
	};
})


function getDominio(extension) {
	var url = location.href; //pega endereço que esta no navegador
	url = url.split("/#/"); //quebra o endeço de acordo com a / (barra)
	return url[0]+ '/'+extension+'/'; // retorna a parte www.endereco.com.br
};
