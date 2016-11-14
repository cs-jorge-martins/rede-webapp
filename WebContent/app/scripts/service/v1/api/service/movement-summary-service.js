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

		this.ListMovementSummaryByFilter = function(movementSummaryFilter) {
            var request = movementSummaryFilter;

            return $http({
                url: app.endpoint + '/movementsummaries',
                method: "GET",
                params: request,
                headers: Request.setHeaders()
            });
		};
    }
})();
