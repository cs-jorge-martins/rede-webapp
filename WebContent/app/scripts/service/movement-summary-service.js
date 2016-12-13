/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

(function() {
    'use strict';

    angular
        .module('Conciliador.MovementSummaryService', [])
		.config(['$routeProvider', function ($routeProvider) {}])
        .service('MovementSummaryService', MovementSummary);

    MovementSummary.$inject = ['app', '$window', '$http', 'Request'];

    function MovementSummary(app, $window, $http, Request) {

		this.ListMovementSummaryByFilter = function(objMovementSummaryFilter) {
            var objRequest = objMovementSummaryFilter;

            return $http({
                url: app.endpoint + '/movementsummaries',
                method: "GET",
                params: objRequest,
                headers: Request.setHeaders()
            });
		};
    }
})();
