/**
 * 
 */
angular.module('Conciliador.AdjustFilter',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

function AdjustFilter(){

	var currency; // BRL
	var startDate; // yyyyMMdd
	var endDate; // yyyyMMdd
	var acquirerIds; // ARRAY {1,2,3} 
	var shopIds; // ARRAY {1,2,3}
	var cardProductIds; // ARRAY {1,2,3}
	var adjustTypes; // ARRAY {ADJUST, POS_CONECTIVITY, CANCELLATION, CHARGEBACK}
	var status; // ARRAY {EXPECTED, PAYED, SUSPENDED} 

	var pageNumber // 1;
	var maxPageSize // 50;
}

