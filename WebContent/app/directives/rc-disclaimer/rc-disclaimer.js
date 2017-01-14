/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

(function() {
	'use strict';

	angular
		.module('Conciliador')
		.directive('rcDisclaimer', RcDisclaimer);

	function RcDisclaimer() {
		return {
			restrict: 'E',
            templateUrl: 'app/views/directives/rc-disclaimer.html',
			scope: true,
            controller: Controller
        };

        function Controller($scope) {
        }
	}
})();
