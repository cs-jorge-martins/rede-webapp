angular.module('Conciliador.customCurrency',[])

.filter('customCurrency', ['$filter', function($filter){
	return function (amount, currencySymbol) {
		var currency = $filter('currency');
		if(amount < 0) {
			return currency(amount, currencySymbol).replace("(", "-").replace(")", "");
		} 
		return amount;
	}
}])