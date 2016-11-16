/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.currencyFilter',[])

.filter('customCurrency', ['$filter', function($filter){
	return function (intAmount, strCurrencySymbol) {
		var filterCurrency = $filter('currency');
		if(intAmount < 0) {
			return filterCurrency(intAmount, strCurrencySymbol).replace("(", "-").replace(")", "");
		}

		return filterCurrency(intAmount, strCurrencySymbol);
	}
}])
