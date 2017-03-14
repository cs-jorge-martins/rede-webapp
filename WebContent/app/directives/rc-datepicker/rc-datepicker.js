/*
	Projeto: conciliation
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

(function() {

	angular
		.module('Conciliador')
		.directive('rcDatepicker', RcDatepicker);

	RcDatepicker.$inject = [];

	function RcDatepicker() {
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
			link: function(scope, element) {

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

				$scope.$watch('minDate', function() {
					$scope.dateOptions.minDate = $scope.minDate;
				});

				$scope.$watch('maxDate', function() {
					$scope.dateOptions.maxDate = $scope.maxDate;
				});
			}

			function Open() {
	    		$scope.status.opened = true;
	  		}

		}
	}

})();
