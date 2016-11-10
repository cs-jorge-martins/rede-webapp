/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
 angular.module('Conciliador.MovementSummaryFilter',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
}])


function MovementSummaryFilter(){

	var currency; // BRL
	var startDate; // yyyyMMdd
	var endDate; // yyyyMMdd
	var status; // ARRAY {EXPECTED , RECEIVED , FORETHOUGHT}
	var acquirers; // ARRAY {REDE,CIELO}
	var sourceShopIds; // ARRAY {1,2,3}
	var creditedShopIds; // ARRAY {1,2,3}
	var banckAccountIds; // ARRAY {1,2,3}
	var cardProductIds; // ARRAY {1,2,3}
	var groupBy; // ARRAY {DAY, MONTH, BANK_ACCOUNT, SHOP, ACQUIRER, CARD_PRODUCT}

	var pageNumber; // 1
	var maxPageSize; // 50
}
