/**
 * 
 */

angular.module('Conciliador.MovementFilter',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])


function MovementFilter(){

	var currency; // BRL
	var startDate; // yyyyMMdd
	var endDate; // yyyyMMdd
	var status; // ARRAY {EXPECTED, PAYED, FORETHOUGHT}
	var acquirer; // ARRAY {1,2,3} 
	var sourceShopIds; // ARRAY {1,2,3} 
	var creditedShopIds; // ARRAY {1,2,3} 
	var banckAccountIds; // ARRAY {1,2,3} 
	var cardProductIds; // ARRAY {1,2,3} 

	var pageNumber; // 1
	var maxPageSize; // 50

}
