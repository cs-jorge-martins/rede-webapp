/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
(function() {
	'use strict';

	angular
		.module('KaplenWeb')
		.directive('rcDisclaimer', rcDisclaimer);

	function rcDisclaimer() {
		return {
			restrict: 'E',
            templateUrl: 'app/views/directives/rc-disclaimer.html',
			scope: true,
            controller: controller
        };

        function controller($scope) {
        }
	}
})();
