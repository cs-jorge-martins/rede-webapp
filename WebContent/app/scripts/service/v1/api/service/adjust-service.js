/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.AdjustService',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}]).service('AdjustService', function(app, Restangular, $location, $http, Request) {

	this.getOtherDetails = function(filter) {
		var request = filter;

		return $http({
			url: app.endpoint + "/adjusts",
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		})
	}

	//GET Adjust by id
	this.getAdjustByFilter = function(adjustId) {

		return Restangular.all('adjusts').getList(
				{
					id: adjustId
				});
	};

	//GET Adjust by filter
	this.getAdjustByFilter = function(adjustFilter) {

		return Restangular.all('adjusts').getList(
				{
					currency: adjustFilter.currency,
					startDate: adjustFilter.startDate,
					endDate: adjustFilter.endDate,
					status: adjustFilter.status,
					acquirers: adjustFilter.acquirers,
					shopIds: adjustFilter.sourceShopIds,
					banckAccountIds: adjustFilter.banckAccountIds,
					cardProductIds: adjustFilter.cardProductIds,
					groupBy: adjustFilter.groupBy,
					pageNumber: adjustFilter.pageNumber,
					maxPageSize: adjustFilter.maxPageSize,
				});
	};

});
