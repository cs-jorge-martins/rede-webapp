/**
 *
 */

angular.module('Conciliador.FinancialFilter',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
}])


function FinancialFilter(){

	var currency; // BRL
	var startDate; // yyyyMMdd
	var endDate; // yyyyMMdd
	var status; // ARRAY {EXPECTED, PAYED, FORETHOUGHT}
	var acquirer; // ARRAY {1,2,3}
	var shopIds; // ARRAY {1,2,3}
	var bankAccountIds; // ARRAY {1,2,3}
	var cardProductIds; // ARRAY {1,2,3}
	var groupBy; // ARRAY { DAY, MONTH, BANK_ACCOUNT, SHOP, ACQUIRER, CARD_PRODUCT, TYPE }

	var pageNumber; // 1
	var maxPageSize; // 50

}
