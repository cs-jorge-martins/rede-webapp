/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

 (function() {
 	'use strict';

 	angular
 		.module('Conciliador')
 		.config(Config);

        function Config($routeProvider) {
    		$routeProvider
    			.when('/home', {
    				templateUrl: 'app/views/dashboard.html',
    				controller: 'dashboardController'
    			})
                .when('/help', {
    				templateUrl: 'app/views/help.html',
    				controller: 'helpController'
    			})
                .when('/integration', {
    				templateUrl: 'app/views/vendas/integration.html',
    				controller: 'integrationController'
    			})
                .when('/login', {
    				templateUrl: 'app/views/login.html',
    				controller: 'loginController'
    			})
                .when('/receipts', {
    				templateUrl: 'app/views/receipts.html',
    				controller: 'receiptsController'
    			})
                .when('/receipts/details', {
    				templateUrl: 'app/views/receipts-details.html',
    				controller: 'receiptsDetailsController'
    			})
                .when('/receipts/expected_details', {
    				templateUrl: 'app/views/receipts-expected-details.html',
    				controller: 'receiptsExpectedDetailsController'
    			})
                .when('/receipts/forethought_details', {
    				templateUrl: 'app/views/receipts-forethought-details.html',
    				controller: 'receiptsForethoughtDetailsController'
    			})
                .when('/receipts/future_details', {
    				templateUrl: 'app/views/receipts-future-details.html',
    				controller: 'receiptsFutureDetailsController'
    			})
                .when('/receipts/other_details', {
    				templateUrl: 'app/views/receipts-other-details.html',
    				controller: 'receiptsOtherDetailsController'
    			})
                .when('/redirect', {
    				templateUrl: 'app/views/redirect.html',
    				controller: 'redirectController'
    			})
                .when('/relatorio/ajustes', {
    				templateUrl: 'app/views/relatorios/ajustes/index.html',
    				controller: 'relatorioAjustesController'
    			})
                .when('/relatorio/chargebacks', {
    				templateUrl: 'app/views/relatorios/chargebacks/index.html',
    				controller: 'relatorioChargebacksController'
    			})
                .when('/relatorio/financeiro', {
    				templateUrl: 'app/views/relatorios/financeiro/index.html',
    				controller: 'relatorioFinanceiroController'
    			})
                .when('/relatorio/vendas', {
    				templateUrl: 'app/views/relatorios/vendas/index.html',
    				controller: 'relatorioVendasController'
    			})
                .when('/sales', {
    				templateUrl: 'app/views/sales.html',
    				controller: 'salesController'
    			})
                .when('/sales/details', {
    				templateUrl: 'app/views/sales-details.html',
    				controller: 'salesDetailsController'
    			})
                .otherwise({
                    redirectTo: '/login'
                });
            }
})();
