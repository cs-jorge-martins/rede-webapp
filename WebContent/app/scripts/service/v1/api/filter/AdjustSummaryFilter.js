/**
 *
 */

angular.module('Conciliador.AdjustSummaryFilter',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])


function AdjustSummaryFilter(){

	var currency; // BRL
	var startDate;  // yyyyMMdd
	var endDate;  // yyyyMMdd
	var acquirers; // ARRAY {1,2,3}
	var shopIds; // ARRAY {1,2,3}
	var cardProductIds; // ARRAY {1,2,3}
	var types; // ARRAY {ADJUST, POS_CONECTIVITY, CANCELLATION, CHARGEBACK}
	var status; // ARRAY {EXPECTED, PAYED, SUSPENDED}
	var groupBy; // ARRAY {	DAY, MONTH, BANK_ACCOUNT, SHOP, ACQUIRER, CARD_PRODUCT, TYPE}

	var pageNumber; // 1;
	var maxPageSize; // 50;
}
