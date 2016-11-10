/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('Conciliador.TransactionConciliationFilter',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])


function TransactionConciliationFilter(){

	var currency; // BRL
	var startDate; // yyyyMMdd
	var endDate; // yyyyMMdd
	var acquirers; // ARRAY {REDE,CIELO}
	var shopIds; // ARRAY {1,2,3}
	var cardProductIds; // ARRAY {1,2,3}
	var status; // ARRAY {EXPECTED , RECEIVED , FORETHOUGHT}
	var types; // ARRAY {CREDIT, DEBIT}
	var modalitys; // 	ARRAY{ IN_CASH, PRE_DATED, INSTALLMENT, BILL_PAYMENT}
	var adjustTypes; // ARRAY { ADJUST, CANCELLATION, CHARGEBACK}
	var groupBy; // ARRAY { DAY, MONTH, ACQUIRER, SHOP, CARD_PRODUCT}

	var pageNumber; // 1
	var maxPageSize; // 50

}
