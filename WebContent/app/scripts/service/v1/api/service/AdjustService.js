/**
 *
 */

angular.module('Conciliador.AdjustService',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}]).service('AdjustService', function(Restangular, $location) {

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
