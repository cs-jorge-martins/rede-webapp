angular.module('KaplenWeb.receiptsService', [])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
}])

.service('receiptsService', function(app, $http, Request) {

	this.getFinancials = function(query_strings) {
        
		var request = query_strings;

		return $http({
			url: app.endpoint + '/financials',
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		});
        
	};

	this.getAdjusts = function(query_strings) {
        var request = query_strings;
		return $http({
            url: app.endpoint + '/adjustsummaries',
			method: "GET",
			params: request,
			headers: Request.setHeaders()
		});
	};
});
