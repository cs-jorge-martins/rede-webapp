/*
	Projeto: conciliation
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

(function() {
	'use strict';

	angular
		.module('KaplenWeb')
		.directive('rcDatepicker', RcDatepicker);

	RcDatepicker.$inject = ['resumoConciliacaoService', 'calendarFactory']

	function RcDatepicker(resumoConciliacaoService, calendarFactory) {
		return {
			restrict: 'E',
			templateUrl: 'app/views/directives/rc-datepicker.html',
			scope: {
				date: '=',
				label: '=',
				minDate: '=',
				maxDate: '='
			},
			controller: Controller,
			link: function(scope, element, attrs) {

				var calendarIcon = element[0].querySelector('.icon_calendario');

				calendarIcon.addEventListener('click', function(){
					scope.status.opened = true;
				});
			}
		};

		function Controller($scope) {

			Init();

			function Init() {
				$scope.dateFormat = 'dd/MM/yyyy';
				$scope.open = Open;
				$scope.status = {
					opened: false
				};
				$scope.dateOptions = {
					showWeeks: false,
					startingDay: 1,
					maxMode: 'day'
				};
			}

			function Open() {
	    		$scope.status.opened = true;
	  		}

		}
	}

})();
