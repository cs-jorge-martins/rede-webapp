angular.module('KaplenWeb.cacheService',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, $angularCacheFactoryProvider) {

}])

.service('cacheService', function($cacheFactory, kaplenAdminService, $angularCacheFactory, $window) {

	var cache = $angularCacheFactory("kaplenCache"  ,{
		maxAge: 1800000 ,
		deleteOnExpire: 'aggressive',
		onExpire: function (key, value, done) {
	        initializeCache();
	    }
	});

	this.instanceCache = function(companyId) {

		$angularCacheFactory.removeAll();

		cache = $angularCacheFactory(companyId.toString()   ,{
			maxAge: 1800000 ,
			deleteOnExpire: 'aggressive',
			onExpire: function (key, value, done) {
		        initializeCache();
		    }
		});
		initializeCache();
	};

	function initializeCache() {
		if($window.sessionStorage.user != undefined){
			//initializeAccounts();
			initializeProducts();
			initializeSettlements();
			//initializeTerminals();
		}
	};

	initializeCache();

	this.getAcquirers = function(){
		var key = 'acquirers';
		if (cache.get(key) === undefined) {
			var result = kaplenAdminService.getAcquiresAutoComplete().$object;
			cache.put(key, result);
			return result;
		}else{
			return cache.get(key);
		}
	};

	this.getBrands = function(){
		var key = 'brands';
		if (cache.get(key) === undefined) {
			 initializeBrands();
		}
		return cache.get(key);
	};

	this.getProducts = function(){
		var key = 'products';
		if (cache.get(key) === undefined) {
			 initializeProducts();
		}
		return cache.get(key);
	};

	this.getAccounts = function(){
		var key = 'accounts';
		if (cache.get(key) === undefined) {
			 initializeAccounts();
		}
		return cache.get(key);
	};

	this.getSettlements = function(){
		var key = 'settlements';
		if (cache.get(key) === undefined) {
			var result = kaplenAdminService.getSettlementsAutoComplete().$object;
			cache.put(key, result);
			return result;
		}else{
			return cache.get(key);
		}
	};

	this.getTerminals = function(){
		var key = 'terminals';
		if (cache.get(key) === undefined) {
			 initializeTerminals();
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

	this.saveFilter = function(filter, context) {
		var enabledKeys = this.enabledFilterKeys;

		cache.put('context', context);

		for(enabledKey in enabledKeys){
			if(filter.hasOwnProperty(enabledKeys[enabledKey])){
				cache.put(enabledKeys[enabledKey], filter[enabledKeys[enabledKey]]);
			}
		}
	};

	this.loadFilter = function(key) {
		var enabledKeys = this.enabledFilterKeys;

		for(var item in enabledKeys) {
			if(enabledKeys[item] == key) {
				return cache.get(key);
			}
		}

		return false;
	};

	this.clearFilter = function() {
		var enabledKeys = this.enabledFilterKeys;
		for(var item in enabledKeys){
			if(this.loadFilter(enabledKeys[item])){
				cache.destroy(enabledKeys[item]);
			}
		}
	};

	/*****************Inicialização************************/
	function initializeAcquirers(){
		var key = 'acquirers';
			kaplenAdminService.getAcquirerByCompany().then(function(itens) {
				cache.put(key, itens.data);
			});
	};

	function initializeBrands(){
		var key = 'brands';
			kaplenAdminService.getBrandsAutoComplete().then(function(itens) {
				cache.put(key, itens.data);
			});
	};

	function initializeProducts(){
		var key = 'products';
		kaplenAdminService.getProdutsAutoComplete().then(function(itens) {
			cache.put(key, itens.data);
		});
	};

	function initializeAccounts (){
		var key = 'accounts';
			kaplenAdminService.getAccountsAutoComplete().then(function(itens) {
				cache.put(key, itens.data);
			});
	};

	function initializeSettlements (){
		var key = 'settlements';
		kaplenAdminService.getSettlementsAutoComplete().then(function(itens) {
			cache.put(key, itens.data);
		});
	};

	function initializeTerminals(){
		var key = 'terminals';
		kaplenAdminService.getTerminalByCompany().then(function(itens) {
			cache.put(key, itens.data);
		});
	};
});
