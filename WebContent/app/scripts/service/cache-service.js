/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.cacheService',[])
.config(['$routeProvider', function($routeProvider, $angularCacheFactoryProvider) {

}])

.service('cacheService', function($cacheFactory, kaplenAdminService, $angularCacheFactory, $window) {

	var cache = $angularCacheFactory("kaplenCache"  ,{
		maxAge: 1800000 ,
		deleteOnExpire: 'aggressive',
		onExpire: function (key, value, done) {
	        InitializeCache();
	    }
	});

	function InitializeCache() {
		if($window.sessionStorage.user != undefined){
			InitializeProducts();
			InitializeSettlements();
		}
	};

	InitializeCache();

	this.GetProducts = function(){
		var key = 'products';
		if (cache.get(key) === undefined) {
			 InitializeProducts();
		}
		return cache.get(key);
	};


	this.GetSettlements = function(){
		var key = 'settlements';
		if (cache.get(key) === undefined) {
			InitializeSettlements();
		}
		return cache.get(key);
	};

	this.enabledFilterKeys = [
		'startDate',
		'endDate',
		'settlementsSelected',
		'productsSelected',
		'conciliationStatus',
		'types',
		'context',
		'bankAccountIds',
		'shopIds',
		'acquirerIds',
		'cardProductIds',
		'futureStartDate',
		'futureEndDate',
		'futureBankAccountIds',
		'futureShopIds',
		'futureAcquirerIds',
		'futureCardProductIds'
	];

	this.SaveFilter = function(filter, context) {
		var enabledKeys = this.enabledFilterKeys;

		cache.put('context', context);

		for(enabledKey in enabledKeys){
			if(filter.hasOwnProperty(enabledKeys[enabledKey])){
				cache.put(enabledKeys[enabledKey], filter[enabledKeys[enabledKey]]);
			}
		}
	};

	this.LoadFilter = function(key) {
		var enabledKeys = this.enabledFilterKeys;

		for(var item in enabledKeys) {
			if(enabledKeys[item] == key) {
				return cache.get(key);
			}
		}

		return false;
	};

	this.ClearFilter = function() {
		cache.removeAll();
	};

	function InitializeProducts(){
		var key = 'products';
		kaplenAdminService.GetProdutsAutoComplete().then(function(itens) {
			cache.put(key, itens.data);
		});
	};

	function InitializeSettlements (){
		var key = 'settlements';
		kaplenAdminService.GetSettlementsAutoComplete().then(function(itens) {
			cache.put(key, itens.data);
		});
	};
});
