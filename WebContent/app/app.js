/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

var objApp = angular.module('Conciliador',['ngRoute', 'ngLocale','angularFileUpload','ui.bootstrap', 'ngSanitize', 'ngAnimate', 'ngTouch',
                            'jmdobry.angular-cache', 'chart.js', 'angularjs-dropdown-multiselect',
                            'com.2fdevs.videogular',
                            'com.2fdevs.videogular.plugins.controls',
                            'com.2fdevs.videogular.plugins.overlayplay',
                            'com.2fdevs.videogular.plugins.poster',
                            'Conciliador.HeaderController',
                            'Conciliador.FooterController',
                            'Conciliador.dashboardController', 'Conciliador.dashboardService',
                            'Conciliador.loginController', 'Conciliador.loginService',
                            'Conciliador.filtersService',
                            'Conciliador.relatorioVendasController',
                            'Conciliador.relatorioFinanceiroController',
                            'Conciliador.relatorioAjustesController',
                            'Conciliador.relatorioChargebacksController',
							'Conciliador.movementsModule',
							'Conciliador.kaplenAdminService','Conciliador.cacheService',
							'chieffancypants.loadingBar',
							'Conciliador.integrationService', 'Conciliador.advancedFilterService',
							'Conciliador.calendarService', 'Kaplen.CalendarFactory',
							'Conciliador.UtilsFactory',
                            'Conciliador.PollingFactory',
							'Conciliador.Request', 'Conciliador.receiptsService',
                            'Conciliador.salesController', 'Conciliador.salesDetailsController',
                            'Conciliador.salesToConciliateController', 'Conciliador.salesConciliatedController',
                            'Conciliador.FinancialService',
                            'Conciliador.MovementSummaryService',
                            'Conciliador.ModalService',
                            'Conciliador.AdjustSummaryService', 'Conciliador.TransactionService',
                            'Conciliador.TransactionSummaryService', 'Conciliador.TransactionConciliationService',
                            'Conciliador.AdjustService',
                            'Conciliador.RcMessageService',
                            'Conciliador.RcDisclaimerService',
                            'Conciliador.helpController',
                            'Conciliador.integrationController',
                            'Conciliador.MovementService',
                            'Conciliador.DownloadService',
                            'Conciliador.receiptsDetailsController',
							'Conciliador.redirectController',
							'Conciliador.receiptsExpectedDetailsController',
							'Conciliador.receiptsForethoughtDetailsController',
                            'ngFileSaver',
                            'Conciliador.appConfig',
                            'Conciliador.currencyFilter',
                            'Conciliador.slugfyFilter',
                            'Conciliador.textFilter',
                            'Conciliador.receiptsOtherDetailsController',
                            'Conciliador.receiptsFutureDetailsController',
                            'Conciliador.salesToConciliateDetailsController',
                            'Conciliador.unprocessedSalesDetailsController',
                            'Conciliador.salesConciliatedDetailsController',
                            'Conciliador.PVGroupingController',
                            'Conciliador.PvService'
							])
	.config(function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeSpinner = true;
	}).config(function (uibDatepickerConfig) {
		uibDatepickerConfig.showWeeks = false;
    })
	.config(['$routeProvider', '$httpProvider',
	         function ($routeProvider, $httpProvider) {

   $httpProvider.defaults.headers.common = {};
   $httpProvider.defaults.headers.post = {};
   $httpProvider.defaults.headers.put = {};
   $httpProvider.defaults.headers.patch = {};

	$httpProvider.interceptors.push(function ($q, $rootScope, $location, $window) {
		$rootScope.baseUrl = objApp.endpoint;

        return {
        	'request': function(config) {
        		if (angular.isDefined($window.sessionStorage.token)) {
        			if(angular.isDefined($window.sessionStorage.schemaName)){
        				$rootScope.login = '';
        			}
        			if(angular.isDefined($window.sessionStorage.user)){
        				$rootScope.user = angular.fromJson($window.sessionStorage.user);
            			$rootScope.pvList = $window.sessionStorage.pvList;
            			$rootScope.currencySymbol = "R$";
                        $rootScope.currency = 'BRL';

                        if($window.sessionStorage.pvList){
                            $rootScope.initialized = true;
                        }

        			}
        			config.headers.Authorization = $window.sessionStorage.token;
        		} else {
					if(!window.location.hash.match(/#\/redirect/g)) {
                    	$location.path("/login");
					}
                }
        		return config || $q.when(config);
        	},
            'responseError': function(config) {
				switch (config.status) {
					case 400 :
                        break;
					case 401 :
						$rootScope.alerts =  [ { type: "danger", msg: config.data.message} ];
						$rootScope.destroyVariablesSession();
						$location.path("/login");
						break;
					case 403 :
						if (config.config.url.indexOf("/downloads") < 0) {
                            $rootScope.showAlert('app/views/action-forbidden.html');
                        }

						break;
					case 500 :
					case 504 :
						$rootScope.alerts =  [ { type: "danger", msg: "Erro Interno do Servidor. Por favor, tente mais tarde."} ];
						break;
                    default:
                        console.log("error");
				}

                return $q.reject(config);
            }
        };
    });
}]).run(function($location, $rootScope, $window, $uibModal, cacheService, $route, $timeout, RcMessageService) {

	init();

    $rootScope.pageTitle = PageTitle;
    $rootScope.hideHeaderAndFooter = false;
    $rootScope.signIn = SignIn;
    $rootScope.logout = Logout;
    $rootScope.destroyVariablesSession = DestroyVariablesSession;
    $rootScope.restartAlerts = RestartAlerts;
    $rootScope.currencySelected = CurrencySelected;
    $rootScope.closeAlert = CloseAlert;
    $rootScope.sortResults = SortResults;
    $rootScope.showAlert = ShowAlert;
    $rootScope.modalOpen = false;
    $rootScope.loading = true;

	function init() {
		WatchRouteChange();
        RemoveLoader();
	}


	function WatchRouteChange() {
		$rootScope.$on('$routeChangeSuccess', function() {
			$rootScope.migrationId = $route.current.$$route.migrationId;
			RcMessageService.clear();
		});
	}

    function RemoveLoader() {
        var loader = angular.element(document.querySelector('#loader'));
        $timeout(function() {
            loader.addClass('loaderHide');
            $timeout(function() {
                loader.remove();
            }, 1000);
        }, 1000);
    }

    function PageTitle() {
        try {
            return $route.current.$$route.title;
        } catch (objError) {
            return '';
        }
    };

	function SignIn(token, user) {
		$rootScope.pvList = user.pvList;
		$rootScope.hideHeaderAndFooter = false;

		$window.sessionStorage.token = token;
		$window.sessionStorage.pvList = JSON.stringify(user.pvList);
		if(user) {
			$window.sessionStorage.user = JSON.stringify(user);
		}

		$rootScope.alerts = [];

		if($window.sessionStorage.token && $window.sessionStorage.pvList) {
			$location.path("/home");
		}
	}

	function Logout() {
		$rootScope.destroyVariablesSession();
		$rootScope.login = 'login';
		$rootScope.alerts =  [ { type: "success", msg: "Você efetuou o logout com sucesso. Até breve!"} ];
		$location.path("/login");
	}

	function DestroyVariablesSession(){
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

		cacheService.ClearFilter();
		$rootScope.login = 'login';
	}

	function RestartAlerts(){
		$rootScope.alerts = [];
	}

	function ShowAlert(templateUrl) {
		$uibModal.open({
			templateUrl: templateUrl,
			windowClass: "new-modal",
			appendTo:  angular.element(document.querySelector('#modalWrapperV1')),
			size:'sm',
			controller: function($scope, $uibModalInstance) {
                $scope.cancel = function() {
                    $uibModalInstance.close();
                };
			}
		}).closed.then(function() {
            $rootScope.modalOpen = false;
		});
		$rootScope.modalOpen = true;
	}

	function CurrencySelected(currencyValue) {
		$window.sessionStorage.currency = currencyValue;

		angular.forEach($rootScope.currencies, function(currency){
			if(currency.value === currencyValue){
				//Seta símbolo padrão de acordo com a moeda do usuário
				$rootScope.currencySymbol = $window.sessionStorage.currencySymbol = currency.symbol;
			}
		});

		$location.path("/dashboardNew");
	}

	function CloseAlert(index) {
		$rootScope.alerts.splice(index, 1);
	}

	function SortResults(objElem, strKind) {
		var strOrder, strOrderString;

		var ResetSortClasses = function (objElem) {
			var objElementsAsc = objElem.getElementsByClassName("sortAsc");
			var objElementsDesc = objElem.getElementsByClassName("sortDesc");

			var ResetClass = function (objElement, strElementClass) {
				[].forEach.call(objElement, function(objEl) {
					objEl.classList.remove(strElementClass);
				});
			};

			ResetClass(objElementsAsc, "sortAsc");
			ResetClass(objElementsDesc, "sortDesc");
		};

		if(
			!objElem.target.classList.contains("sortAsc") &&
			!objElem.target.classList.contains("sortDesc")
		) {
			ResetSortClasses(objElem.target.parentElement.parentElement.parentElement);
		}

		if(!objElem.target.classList.contains("sortDesc")) {
			objElem.target.classList.add("sortDesc");
			objElem.target.classList.remove("sortAsc");
		} else {
			objElem.target.classList.add("sortAsc");
			objElem.target.classList.remove("sortDesc");
		}

		strOrder = objElem.target.classList.contains("sortAsc") ? "ASC" : "DESC";
		strOrderString = strKind + "," + strOrder;

		return strOrderString;
	}

    $rootScope.$on("cfpLoadingBar:loading",function(){
       $rootScope.loading = true;
    });

    $rootScope.$on("cfpLoadingBar:completed",function(){
       $rootScope.loading = false;
    });

}).directive('upload', ['uploadManager', function factory(uploadManager) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            $(element).fileupload({
                dataType: 'text',
                add: function (e, data) {
                    uploadManager.add(data);
                },
                progressall: function (e, data) {
                    var intProgress = parseInt(data.loaded / data.total * 100, 10);
                    uploadManager.setProgress(intProgress);
                },
                done: function () {
                    uploadManager.setProgress(0);
                }
            });
        }
    };
}])
.factory('menuFactory', function($rootScope) {

	function SetActiveDashboard() {
        this.deactivate();
		$rootScope.activeDashboard = true;
	}

	function SetActiveGestao() {
        this.deactivate();
		$rootScope.activeGestao = true;
	}

	function SetActiveMovements() {
        this.deactivate();
		$rootScope.activeMovements = true;
	}

	function SetActiveResumoConciliacao() {
        this.deactivate();
		$rootScope.activeResumoConciliacao = true;
	}

	function SetActiveReports() {
        this.deactivate();
		$rootScope.activeReports = true;
	}

    function SetActiveReportsFinancial() {
        this.deactivate();
		$rootScope.activeReports = true;
        $rootScope.activeReportsFinancial = true;
	}

    function SetActiveReportsChargebacks() {
        this.deactivate();
		$rootScope.activeReports = true;
        $rootScope.activeReportsChargebacks = true;
	}

    function SetActiveReportsSales() {
        this.deactivate();
		$rootScope.activeReports = true;
        $rootScope.activeReportsSales = true;
	}

    function SetActiveReportsAdjustments() {
        this.deactivate();
		$rootScope.activeReports = true;
        $rootScope.activeReportsAdjustments = true;
	}

    function SetActiveIntegration() {
        this.deactivate();
		$rootScope.activeIntegration = true;
	}

    function Deactivate() {
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
		setActiveDashboard: SetActiveDashboard,
		setActiveGestao: SetActiveGestao,
		setActiveMovements: SetActiveMovements,
		setActiveResumoConciliacao: SetActiveResumoConciliacao,
		setActiveReports: SetActiveReports,
        setActiveReportsSales: SetActiveReportsSales,
        setActiveReportsFinancial: SetActiveReportsFinancial,
        setActiveReportsAdjustments: SetActiveReportsAdjustments,
        setActiveReportsChargebacks: SetActiveReportsChargebacks,
        setActiveIntegration: SetActiveIntegration,
        deactivate: Deactivate
	};
});

objApp.filter('utc', function(){
	return function(val){
    var objDate = new Date(val);
    return new Date(objDate.getUTCFullYear(),
					objDate.getUTCMonth(),
					objDate.getUTCDate(),
					objDate.getUTCHours(),
					objDate.getUTCMinutes(),
					objDate.getUTCSeconds());
  };
});

objApp.filter('brst', function(){
    return function(val){
        return new Date(val);
    };
});
