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
