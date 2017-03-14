/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

 (function() {

 	angular
 		.module('Conciliador')
 		.config(Config);

        function Config($routeProvider) {
    		$routeProvider
    			.when('/home', {
    				templateUrl: 'app/views/dashboard.html',
    				controller: 'dashboardController',
                    migrationId: 'v1',
					breadcrumb: ['home']
    			})
                .when('/help', {
    				templateUrl: 'app/views/help.html',
    				controller: 'helpController',
                    migrationId: 'v1',
					breadcrumb: ['ajuda']
    			})
                .when('/integration', {
    				templateUrl: 'app/views/vendas/integration.html',
    				controller: 'integrationController',
                    migrationId: 'v1',
					breadcrumb: ['integração']
    			})
                .when('/login', {
    				templateUrl: 'app/views/login.html',
    				controller: 'loginController',
                    migrationId: 'v1'
    			})
                .when('/receipts', {
    				templateUrl: 'app/views/receipts.html',
    				controller: 'receiptsController',
                    migrationId: 'v1',
					breadcrumb: ['recebimentos']
    			})
                .when('/receipts/details', {
    				templateUrl: 'app/views/receipts-details.html',
    				controller: 'receiptsDetailsController',
                    migrationId: 'v1'
    			})
                .when('/receipts/expected_details', {
    				templateUrl: 'app/views/receipts-expected-details.html',
    				controller: 'receiptsExpectedDetailsController',
                    migrationId: 'v1'
    			})
                .when('/receipts/forethought_details', {
    				templateUrl: 'app/views/receipts-forethought-details.html',
    				controller: 'receiptsForethoughtDetailsController',
                    migrationId: 'v1'
    			})
                .when('/receipts/future_details', {
    				templateUrl: 'app/views/receipts-future-details.html',
    				controller: 'receiptsFutureDetailsController',
                    migrationId: 'v1'
    			})
                .when('/receipts/other_details', {
    				templateUrl: 'app/views/receipts-other-details.html',
    				controller: 'receiptsOtherDetailsController',
                    migrationId: 'v1'
    			})
                .when('/redirect', {
    				templateUrl: 'app/views/redirect.html',
    				controller: 'redirectController',
                    migrationId: 'v1'
    			})
                .when('/relatorio/ajustes', {
    				templateUrl: 'app/views/relatorios/ajustes/index.html',
    				controller: 'relatorioAjustesController',
                    migrationId: 'v1',
					breadcrumb: ['relatórios', 'relatório de tarifas e ajustes']
    			})
                .when('/relatorio/chargebacks', {
    				templateUrl: 'app/views/relatorios/chargebacks/index.html',
    				controller: 'relatorioChargebacksController',
                    migrationId: 'v1',
					breadcrumb: ['relatórios', 'cancelamentos e chargebacks']
    			})
                .when('/relatorio/financeiro', {
    				templateUrl: 'app/views/relatorios/financeiro/index.html',
    				controller: 'relatorioFinanceiroController',
                    migrationId: 'v1'
    			})
                .when('/relatorio/vendas', {
    				templateUrl: 'app/views/relatorios/vendas/index.html',
    				controller: 'relatorioVendasController',
                    migrationId: 'v1',
					breadcrumb: ['relatórios', 'relatório de vendas']
    			})
                .when('/sales', {
    				templateUrl: 'app/views/sales.html',
    				controller: 'salesController',
                    migrationId: 'v2',
					title: 'vendas',
					breadcrumb: ['vendas']
    			})
                .otherwise({
                    redirectTo: '/login'
                });
            }
})();
