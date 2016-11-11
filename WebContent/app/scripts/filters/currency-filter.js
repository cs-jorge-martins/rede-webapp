/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.currencyFilter',[])

.filter('customCurrency', ['$filter', function($filter){
	return function (amount, currencySymbol) {
		var currency = $filter('currency');
		if(amount < 0) {
			return currency(amount, currencySymbol).replace("(", "-").replace(")", "");
		}

		return currency(amount, currencySymbol);
	}
}])
