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
			controller: controller,
			link: function(scope, element, attrs) {

				var calendarIcon = element[0].querySelector('.icon_calendario');

				calendarIcon.addEventListener('click', function(){
					scope.status.opened = true;
				});

				/*
				var months = 0;
				element.ready(function(){
					var buttonPrevMonth = element[0].querySelector('thead button.pull-left');
					var buttonNextMonth = element[0].querySelector('thead button.pull-right');

					buttonPrevMonth.addEventListener('click', function(){
						months--;
						getDays();
					});

					buttonNextMonth.addEventListener('click', function(){
						months++;
						getDays();
					});

				});

				scope.$watch('status.opened', function(status) {
					if(status) {
						getDays();
					}
				})

				function getDays() {
					var days = element[0].querySelectorAll('tbody td .btn');
					var date = formatDate();
					var firstDayOfMonth = calendarFactory.getFirstDayOfMonth(date);
					var lastDayOfMonth = calendarFactory.getLastDayOfMonth(date);

					resumoConciliacaoService.listTransactionConciliationCalendarMonth({
						currency: 'BRL',
						startDate: calendarFactory.formatDateForService(firstDayOfMonth),
						endDate: calendarFactory.formatDateForService(lastDayOfMonth),
						groupBy: 'DAY',
						size: 31
					}).then(function(response) {
						var data = response.data.content;

						for(var index in data) {
							var day = parseInt(data[index].date.slice(-2));

							var className = false;

							if(data[index].transctionConciliedQuantity) {
								className = 'concilied';
							}

							if(data[index].transctionToConcilieQuantity) {
								className = 'toConcilie';
							}

							if(data[index].transctionUnprocessedQuantity) {
								className = 'unprocessed';
							}

							if(className) {
								days[day - 1].classList.add(className);
							}
						}

					}).catch(function(response) {
						//console.log('error');
					});
				}
				function formatDate(date) {
					var date = moment(scope.date);
					date.add(months, 'months')

					return date.format('DD/MM/YYYY');
				}
				*/
			}
		};

		function controller($scope) {

			init();

			function init() {
				$scope.dateFormat = 'dd/MM/yyyy';
				$scope.open = open;
				$scope.status = {
					opened: false
				};
				$scope.dateOptions = {
					showWeeks: false,
					startingDay: 1,
					maxMode: 'day'
				};
			}

			function open() {
	    		$scope.status.opened = true;
	  		}

		}
	}

})();
