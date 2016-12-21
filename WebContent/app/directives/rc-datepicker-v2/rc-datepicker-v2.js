/*
	Projeto: conciliation
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */


/**
 * @class Conciliador.rcDatepickerV2
 * @extends ui.bootstrap.datepickerPopup
 * Diretiva de calendário
 *
 * Utiliza a diretiva datepicker do angular-ui-bootstrap como base do componente.
 * @param {String} type Tipo de componente, pode ser 'single' para calendário simples
 * e 'range' para calendário com range de datas
 * @param {String} date Model que será utilizado no componente, conterá a data
 * @param {String} label Texto que será exibido no label do componente, logo acima do input
 * @param {String} minDate Trava de data mínima selecionável do componente
 * @param {String} maxDate Trava de data máxima selecionável do componente
 *
 * Exemplo:
 *
 *     @example
 *     <rc-datepicker-v2 date="dateModel" max-date="todayDate" label="'data'"></rc-datepicker-v2>
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
				type: '=',
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

			var strPlaceHolder = '';

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
