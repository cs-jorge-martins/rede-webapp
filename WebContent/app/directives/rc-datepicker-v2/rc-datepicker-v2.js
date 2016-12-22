/*
	Projeto: conciliation
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

(function() {
	'use strict';

	angular
		.module('Conciliador')
		.directive('rcDatepickerV2', RcDatepickerV2);

	RcDatepickerV2.$inject = ['calendarFactory']

	function RcDatepickerV2(calendarFactory) {

		return {
			restrict: 'E',
			templateUrl: 'app/views/directives/rc-datepicker-v2.html',
			scope: {
				date: '=',
				label: '=',
				minDate: '=',
				maxDate: '='
			},
			controller: Controller,
			link: function(scope, element, attrs) {

				var divCalendarIcon = element[0].querySelector('.icon_calendario');

				divCalendarIcon.addEventListener('click', function(){
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

				if($scope.minDate) {
					$scope.dateOptions.minDate = $scope.minDate;
				}

				if($scope.maxDate) {
					$scope.dateOptions.maxDate = $scope.maxDate;
				}
			}

			function Open() {
	    		$scope.status.opened = true;
	  		}

		}
	}

})();
