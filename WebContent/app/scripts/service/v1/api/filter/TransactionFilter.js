/**
 * 
 */

angular.module('Conciliador.TransactionFilter',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])


function TransactionFilter(){

	var currency; // BRL
	var startDate; // yyyyMMdd
	var endDate; // yyyyMMdd
	var acquirers; // ARRAY {REDE,CIELO}
	var shopIds; // ARRAY {1,2,3}
	var cardProductIds; // ARRAY {1,2,3}
	var conciliationStatus; // ARRAY{ TO_CONCILIE, CONCILIED, UNPROCESSED}
	var status; // ARRAY{ PROCESSED, CANCELLED , ADJUSTED}
	var types; // ARRAY{CREDIT, DEBIT}
	var modalitys; // 	ARRAY{ IN_CASH, PRE_DATED, INSTALLMENT, BILL_PAYMENT}
	var adjustTypes; // ARRAY{ ADJUST, CANCELLATION, CHARGEBACK}
	var nsu; // STRING
	var authorization; // STRING
	var gross; // DOUBLE

	var pageNumber // 1;
	var maxPageSize // 50;
}
