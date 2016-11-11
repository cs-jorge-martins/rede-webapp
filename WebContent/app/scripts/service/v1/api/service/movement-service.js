/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('Conciliador.MovementService',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}]).service('MovementService', function(app, Restangular, $location, $window, $http, Request) {

	this.getForethoughts = function (filter) {
		var request = filter;

		return $http({
			url: app.endpoint + "/movements",
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		})
	}

	//GET Movement by Id
	this.getMovementById = function(movementId) {
		return Restangular.all('movements').getList(
				{
					id: movementId
				});
	};

	//GET Movement by filter
	this.getMovementByFilter = function(movementFilter) {
		return Restangular.all('movements').getList(
				{
					currency: movementFilter.currency,
					startDate: movementFilter.startDate,
					endDate: movementFilter.endDate,
					status: movementFilter.status,
					acquirers: movementFilter.acquirers,
					sourceShopIds:	movementFilter.sourceShopIds,
					creditedShopIds: movementFilter.creditedShopIds,
					banckAccountIds: movementFilter.banckAccountIds,
					cardProductIds: movementFilter.cardProductIds,
					groupBy: movementFilter.groupBy,
					pageNumber: movementFilter.pageNumber,
					maxPageSize: movementFilter.maxPageSize,
				});
	};
});
