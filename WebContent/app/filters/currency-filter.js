/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.currencyFilter',[])

.filter('customCurrency', ['$filter', function($filter){
	return function (intAmount, strCurrencySymbol) {
		var objFilterCurrency = $filter('currency');
		if(intAmount < 0) {
			return objFilterCurrency(intAmount, strCurrencySymbol).replace("(", "-").replace(")", "");
		}

		return objFilterCurrency(intAmount, strCurrencySymbol);
	};
}]);
