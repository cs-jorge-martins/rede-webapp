/**
 * 
 */

angular.module('Conciliador.Financial',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

 function Financial(){
	 
	var date;
	
	var bankAccount{
		var id;
		var bankNumber;
		var agencyNumber;
		var accountNumber;
	};
	
	var acquirer{
		var id;
		var name;
	};
	
	var cardProduct{
		var id;
		var name;
	};
	
	var shop{
		var id;
		var name;
	};
	
	var expectedAmount;
	var payedAmount;
	var discountAmount;
	var balanceAmount;
	var type;
	var description;
 }