/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.filtersService', [])
	.config(['$routeProvider',function ($routeProvider) {
}])

.service('filtersService', function(app, $http, Request, $q) {

	var strUrlAcquirers = app.endpoint + '/acquirers?name=REDE';
	var strUrlAccounts = app.endpoint + '/pvs/bankaccounts';
	var strUrlShops = app.endpoint + '/pvs/shops';
	var strUrlCardProducts = app.endpoint + '/cardproducts';
	var strUrlTerminals = app.endpoint + '/pvs/terminals';

	this.GetAcquirers = function() {
		var objRequest = {
		};

		return $http({
			url: strUrlAcquirers,
			method: "GET",
			data: objRequest,
			headers: Request.setHeaders()
		});
	};

	this.GetAccounts = function() {
		var objRequest = {
		};

		return $http({
			url: strUrlAccounts,
			method: "GET",
			data: objRequest,
			headers: Request.setHeaders()
		});
	};

	this.GetShops = function() {
		var objRequest = {
		};

		return $http({
			url: strUrlShops,
			method: "GET",
			data: objRequest,
			headers: Request.setHeaders()
		});
	};

	this.GetCardProducts = function() {
		var objRequest = {
		};

		return $http({
			url: strUrlCardProducts,
			method: "GET",
			data: objRequest,
			headers: Request.setHeaders()
		});
	};

	/**
	 * @method DeferIt
	 * retorna um promise e posteriormente um sucesso ou erro
	 * @param {String} strUrl Url que deverá ser feito o request
	 * @return {Object} objResponse, que é um promise
	 */
	this.DeferIt = function (strUrl) {
		var objResponse;
		var funDeferred = $q.defer();
		if(!objResponse) {
			$http.get(strUrl).then(function (result) {
				objResponse = result.data;
				funDeferred.resolve(objResponse);
			}, function (error) {
				objResponse = error;
				funDeferred.reject(error);
			});
			objResponse = funDeferred.promise;
		}
		return $q.when(objResponse);
	};

	/**
	 * @method TransformDeferredDataInArray
	 * retorna um array de objetos a partir de um objeto "deferred"
	 * @param {Object} objDeferredData Objeto serializado do filtro
	 * @param {String} strField Nome do campo que deve ser adicionado no parametro label de cada objeto
	 * @return {Array} arrResponse
	 */
	this.TransformDeferredDataInArray = function (objDeferredData, strField) {
		var arrResponse = [];
		for(var x in objDeferredData) {
			if(x) {
				var obj = {};
				obj.id = objDeferredData[x].id;
				obj.label = objDeferredData[x][strField];
				arrResponse.push(obj);
			}
		}
		return arrResponse;
	};

	this.GetCardProductDeferred = function () {
		return this.DeferIt(strUrlCardProducts);
	};

	this.GetTerminalDeferred = function () {
		return this.DeferIt(strUrlTerminals);
	};

	this.GetPvsDeferred = function () {
		return this.DeferIt(strUrlShops);
	};

	this.GetAcquirersDeferred = function () {
		return this.DeferIt(strUrlAcquirers);
	};

});
