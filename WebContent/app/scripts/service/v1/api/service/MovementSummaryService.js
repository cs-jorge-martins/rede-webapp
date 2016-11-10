/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
(function() {
    'use strict';

    angular
        .module('Conciliador.MovementSummaryService', [])
		.config(['$routeProvider', 'RestangularProvider', function ($routeProvider, RestangularProvider) {}])
        .service('MovementSummaryService', MovementSummary);

    MovementSummary.$inject = ['app', 'Restangular', '$window', '$http', 'Request'];

    function MovementSummary(app, Restangular, $window, $http, Request) {

		this.listMovementSummaryByFilter = function(movementSummaryFilter) {
			//return Restangular.all('movementsummaries').getList(movementSummaryFilter);
            var request = movementSummaryFilter;

            return $http({
                url: app.endpoint + '/movementsummaries',
                method: "GET",
                params: request,
                headers: Request.setHeaders()
            });
		};

        this.exportReport = function(movementSummaryFilter, headers) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", Restangular.configuration.baseUrl + "/movementsummaries?" + jQuery.param(movementSummaryFilter));
            xhr.setRequestHeader("X-API-Key", $window.sessionStorage.company);
            xhr.setRequestHeader('Authorization', $window.sessionStorage.token);
            for (var header in headers) {
                xhr.setRequestHeader(header, headers[header]);
            }

            xhr.responseType = "arraybuffer";

            xhr.onload = function () {
                if (this.status === 200) {
                    var blob = new Blob([xhr.response], {type: "application/vnd.ms-excel"});
                    var objectUrl = URL.createObjectURL(blob);
                    window.open(objectUrl);
                }
            };
            xhr.send();
        };
    }
})();
