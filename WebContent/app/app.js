/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

var app = angular.module('Conciliador',['ngRoute', 'ngLocale','angularFileUpload','ui.bootstrap', 'ngSanitize', 'ngAnimate', 'ngTouch',
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
                            'Conciliador.helpController',
                            'Conciliador.integrationController',
                            'Conciliador.MovementService',
                            'Conciliador.receiptsDetailsController',
							'Conciliador.redirectController',
							'Conciliador.receiptsExpectedDetailsController',
							'Conciliador.receiptsForethoughtDetailsController',
                            'ngFileSaver',
                            'Conciliador.appConfig',
                            'Conciliador.currencyFilter',
                            'Conciliador.slugfyFilter',
                            'Conciliador.receiptsOtherDetailsController',
                            'Conciliador.receiptsFutureDetailsController'
							])
	.config(function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeSpinner = true;
	}).config(function (uibDatepickerConfig) {
		uibDatepickerConfig.showWeeks = false;
    })
	.config(['$routeProvider', '$httpProvider','$angularCacheFactoryProvider',
	         function ($routeProvider, $httpProvider, $angularCacheFactoryProvider) {

   $httpProvider.defaults.headers.common = {};
   $httpProvider.defaults.headers.post = {};
   $httpProvider.defaults.headers.put = {};
   $httpProvider.defaults.headers.patch = {};

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
            			$rootScope.currencySymbol = "R$";
                        $rootScope.currency = 'BRL';

                        if($window.sessionStorage.pvList){
                            $rootScope.initialized = true;
                        }

        			}
        			config.headers['Authorization'] = $window.sessionStorage.token;
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
                        $rootScope.showAlert('app/views/action-forbidden.html');
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

	function init() {
		WatchRouteChange();
        RemoveLoader();
		InitiateRootVariables();
	}

	function WatchRouteChange() {
		$rootScope.$on('$routeChangeSuccess', function() {
			$rootScope.migrationId = $route.current.$$route.migrationId;
			$rootScope.pageTitle = $route.current.$$route.title;
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

    function InitiateRootVariables() {
		$rootScope.hideHeaderAndFooter = false;
	}

    $rootScope.loading = true;
    $rootScope.$on("cfpLoadingBar:loading",function(){
       $rootScope.loading = true;
    });
    $rootScope.$on("cfpLoadingBar:completed",function(){
       $rootScope.loading = false;
    });

	$rootScope.signIn = SignIn;
    $rootScope.logout = Logout;
    $rootScope.destroyVariablesSession = DestroyVariablesSession;
    $rootScope.restartAlerts = RestartAlerts;
    $rootScope.currencySelected = CurrencySelected;
    $rootScope.closeAlert = CloseAlert;
    $rootScope.sortResults = SortResults;
    $rootScope.showAlert = ShowAlert;
    $rootScope.modalOpen = false;

	function SignIn(token, user) {
		$rootScope.pvList = user.pvList;

		$window.sessionStorage.token = token;
		$window.sessionStorage.pvList = JSON.stringify(user.pvList);
		if(user) {
			$window.sessionStorage.user = JSON.stringify(user);
		}

		$rootScope.alerts = [];

		if($window.sessionStorage.token && $window.sessionStorage.pvList) {
			$location.path("/home");
		}
	};

	function Logout() {
		$rootScope.destroyVariablesSession();
		$rootScope.login = 'login';
		$rootScope.alerts =  [ { type: "success", msg: "Você efetuou o logout com sucesso. Até breve!"} ];
		$location.path("/login");
	};

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
	};

	function RestartAlerts(){
		$rootScope.alerts = [];
	};

	function ShowAlert(templateUrl) {
		var objModal = $uibModal.open({
			templateUrl: templateUrl,
			windowClass: "new-modal",
			appendTo:  angular.element(document.querySelector('#modalWrapperV1')),
			size:'sm',
			controller: function($scope, $uibModalInstance) {
                $scope.cancel = function() {
                    $uibModalInstance.close();
                }
			}
		}).closed.then(function() {
            $rootScope.modalOpen = false;
		});
		$rootScope.modalOpen = true;
	}

	function CurrencySelected(currencyValue) {
		$window.sessionStorage.currency = currencyValue;

		angular.forEach($rootScope.currencies, function(currency, index){
			if(currency.value == currencyValue){
				//Seta símbolo padrão de acordo com a moeda do usuário
				$rootScope.currencySymbol = $window.sessionStorage.currencySymbol = currency.symbol;
			}
		});

		$location.path("/dashboardNew");
	};

	function CloseAlert(index) {
		$rootScope.alerts.splice(index, 1);
	};

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
                    var intProgress = parseInt(data.loaded / data.total * 100, 10);
                    uploadManager.setProgress(intProgress);
                },
                done: function (e, data) {
                    uploadManager.setProgress(0);
                }
            });
        }
    };
}])
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

app.filter('utc', function(){
  return function(val){
    var date = new Date(val);
     return new Date(date.getUTCFullYear(),
                     date.getUTCMonth(),
                     date.getUTCDate(),
                     date.getUTCHours(),
                     date.getUTCMinutes(),
                     date.getUTCSeconds());
  };
});

app.filter('brst', function(){
  return function(val){
    return new Date(val);
  };
});

function getDominio(strExtension) {
	var strUrl = location.href;
	strUrl = strUrl.split("/#/");
	return strUrl[0]+ '/' + strExtension+ '/';
};
