/**
 *
 */

angular.module('Conciliador.AdjustSummaryService',[])
.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}]).service('AdjustSummaryService', function(app, Restangular, $location, $window, $http, Request) {
	// Financial by filter
	this.listAdjustSummary = function(filter) {
		//return Restangular.all('adjustsummaries').getList(filter);
		var request = filter;

		return $http({
			url: app.endpoint + '/adjustsummaries',
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		});
	};

	this.exportReport = function(filter) {
		return Restangular.one('adjustsummaries/xls').get(filter);
	};


	function AdjustSummary(){

		this.date;
		this.acquirer = {
				id: null,
				name: null
		};
		this.cardProduct= {
				id: null,
				name: null
		};
		this.bankAccount = {
			id: null,
			bankNumber: null,
			agencyNumber: null,
			accountNumber: null
		};
		this.shop= {
			id: null,
			name: null
		};
		this.quantity;
		this.amount;
		this.type;
		this.descritption;
	}

});
