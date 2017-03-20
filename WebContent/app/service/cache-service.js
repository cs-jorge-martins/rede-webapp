/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.cacheService',[])
.config([function() {

}])

.service('cacheService', function($cacheFactory, kaplenAdminService, $angularCacheFactory, $window) {

	var objCache = $angularCacheFactory("kaplenCache"  ,{
		maxAge: 1800000 ,
		deleteOnExpire: 'aggressive',
		onExpire: function () {
	        InitializeCache();
	    }
	});

	function InitializeCache() {
		if($window.sessionStorage.user !== undefined){
			InitializeProducts();
			InitializeSettlements();
		}
	}

	InitializeCache();

	this.GetProducts = function(){
		var strKey = 'products';
		if (objCache.get(strKey) === undefined) {
			 InitializeProducts();
		}
		return objCache.get(strKey);
	};


	this.GetSettlements = function(){
		var strKey = 'settlements';
		if (objCache.get(strKey) === undefined) {
			InitializeSettlements();
		}
		return objCache.get(strKey);
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
		var arrEnabledKeys = this.enabledFilterKeys;

		objCache.put('context', context);

		for(var strEnabledKey in arrEnabledKeys){
			if(filter.hasOwnProperty(arrEnabledKeys[strEnabledKey])){
				objCache.put(arrEnabledKeys[strEnabledKey], filter[arrEnabledKeys[strEnabledKey]]);
			}
		}
	};

	this.LoadFilter = function(strKey) {
		var arrEnabledKeys = this.enabledFilterKeys;

		for(var strEnabledKey in arrEnabledKeys) {
			if(arrEnabledKeys[strEnabledKey] === strKey) {
				return objCache.get(strKey);
			}
		}

		return false;
	};

	this.ClearFilter = function() {
		objCache.removeAll();
	};

	function InitializeProducts(){
		var strKey = 'products';
		kaplenAdminService.GetProdutsAutoComplete().then(function(itens) {
			objCache.put(strKey, itens.data);
		});
	}

	function InitializeSettlements (){
		var strKey = 'settlements';
		kaplenAdminService.GetSettlementsAutoComplete().then(function(itens) {
			objCache.put(strKey, itens.data);
		});
	}
});
