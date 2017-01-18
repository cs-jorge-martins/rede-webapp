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
 * @param {Boolean} range True aciona a funcionalidade de range do calendário. O
 * default é false.
 * e 'range' para calendário com range de datas
 * @param {String} date Model que será utilizado no componente, conterá a data.
 * Caso seja um calendário com rage, date deverá ser um array com 2 datas (inicial e final)
 * @param {String} label Texto que será exibido no label do componente, logo acima do input
 * @param {String} minDate Trava de data mínima selecionável do componente
 * @param {String} maxDate Trava de data máxima selecionável do componente
 * @param {Boolean} showNextDatesFilter Mostra filtros com datas futuras
 * @param {Boolean} showPreviousDatesFilter Mostra filtros com datas passadas
 *
 * Exemplo:
 *
 *     @example
 *     <rc-datepicker-v2 range="true" date="dateModel" max-date="todayDate" label="'data'"></rc-datepicker-v2>
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
				range: '=',
				date: '=',
				label: '=',
				minDate: '=',
				maxDate: '=',
				showNextDatesFilter: '=',
				showPreviousDatesFilter: '='
			},
			controller: Controller,
			link: function(scope, element, attrs) {
			}
		};

		function Controller($scope) {

			var strDirectiveId = 'rc-datepicker-v2-' + (new Date()).getTime();
			var bolIsRange = $scope.range || false;
			var objDateSource = $scope.date;
			var objRangeStartDate;
			var objRangeEndDate;
			var intRangeClickCounter;

			Init();

			function Init() {
				$scope.directiveId = strDirectiveId;
				$scope.dateFormat = 'dd/MM/yyyy';
				$scope.open = Open;
				$scope.update = Update;
				$scope.closeOnSelection = true;
				$scope.getDayClass = GetDayClass;
				$scope.status = {
					opened: false
				};
				$scope.dateOptions = {
					showWeeks: false,
					startingDay: 1,
					maxMode: 'day',
					customClass: GetDayClass,
					dateFilter: DateFilter
				};

				if ($scope.minDate) {
					$scope.dateOptions.minDate = $scope.minDate;
				}
				if ($scope.maxDate) {
					$scope.dateOptions.maxDate = $scope.maxDate;
				}
				if ($scope.showNextDatesFilter) {
					$scope.dateOptions.showNextDatesFilter = true;
				}
				if ($scope.showPreviousDatesFilter) {
					$scope.dateOptions.showPreviousDatesFilter = true;
				}

				if (bolIsRange) {
					$scope.pickerDate = new Date($scope.date[0]);
					$scope.closeOnSelection = false;
					objRangeStartDate = $scope.date[0];
					objRangeEndDate = $scope.date[1];
				} else {
					$scope.pickerDate = $scope.date;
				}

				Update();
			}

			/**
			 * @method GetPlaceholder
			 * retorna a data javascript no padrão brasileiro 'dd/mm/yyyy'.
			 * @return {String} Data
			 */
			function GetPlaceholder() {
				if (bolIsRange) {
					return calendarFactory.formatDate(objRangeStartDate,true) + " a " + calendarFactory.formatDate(objRangeEndDate,true);
				}

				return calendarFactory.formatDate($scope.date, true);
			}

			/**
			 * @method Open
			 * @alias open
			 * Abre o popup com datepicker. Troca o status do datepicker para true.
			 */
			function Open() {
	    		$scope.status.opened = true;

				if (bolIsRange) {
					intRangeClickCounter = 0;
				}
	  		}

			/**
			 * @method Update
			 * Contém a lógica para atualizar as datas do calendário (já faz o
		 	 * tratamento diferenciando os tipos de calendário [normal, range]).
			 *
			 * Método também faz o update do placeholder, chamando o método GetPlaceholder.
			 */
			function Update() {
				if (bolIsRange) {
					intRangeClickCounter++;

					switch (intRangeClickCounter) {
						case 1:
							objRangeStartDate = $scope.pickerDate;
							break;
						case 2:

							if(objRangeStartDate.getTime() > $scope.pickerDate.getTime()) {
								objRangeEndDate = objRangeStartDate;
								objRangeStartDate = $scope.pickerDate;
							} else {
								objRangeEndDate = $scope.pickerDate;
							}

							$scope.pickerDate = objRangeStartDate;
							$scope.status.opened = false;
							break;
						default:
					}
				} else {
					$scope.date = $scope.pickerDate;
				}

				$scope.datePlaceholder = GetPlaceholder();
			}

			/**
			 * @method GetDayClass
			 * @alias getDayClass
			 * Método responsável por adicionar as classes no calendário. Ele itera
			 * por todos os dias do mês corrente e adiciona as respectivas classes
			 * aos dias. Este método é padrão do componente ui.bootstrap.datepicker
			 * do angular-ui-bootstrap. E é passado para a diretiva.
			 * @param {Integer} date Data
			 * @param {String} date Data
			 * @return {String} nome da classe
			 */
			function GetDayClass(date, mode) {
				var intDate = date.date.getTime();
				var weekDay = date.date.getDay();

				if (bolIsRange && (intRangeClickCounter === 0)) {
					var intStartDate = objRangeStartDate.getTime();
					var intEndDate = objRangeEndDate.getTime();
					var bolConsecutiveDays = calendarFactory.isConsecutiveDays(objRangeStartDate, objRangeEndDate);

					if(bolConsecutiveDays) {
						if(calendarFactory.isInitialAndFinalWeekDays(objRangeStartDate, objRangeEndDate) === false) {
							if(intDate == objRangeEndDate.getTime()) {
								return 'bar consecutive-days';
                            }
						}
					}

					if ((intDate > intStartDate) && (intDate < intEndDate)) {

						if (weekDay === 0 || weekDay === 1) {
							return 'ball';
						}
						return 'bar';
					}

					if ((intDate == intStartDate) || (intDate == intEndDate)) {
						return 'ball';
					}
				}

				if (!bolIsRange && ($scope.date.getTime() == intDate) ) {
					return 'ball';
				}

				return '';
			}

			/**
			 * @method DateFilter
			 * @alias dateFilter
			 * Método resopnsável por fazer os filtros de dias, localizado na
			 * parte inferior do componente de calendário. Ele adiciona ou subtrai
			 * os dias e já atualiza a(s) data(s) de acordo com o parâmetro recebido
			 * @param {Integer} days Dias a serem adicionados ou removidos da data
			 * atual. Passando valores negativos, o método faz a subtração dos dias.
			 */
			function DateFilter(days) {
				var actualDate = new Date();
				var targetDate = new Date();
				targetDate.setDate(targetDate.getDate() + days);

				if (actualDate < targetDate) {
					objRangeStartDate = actualDate;
					objRangeEndDate = targetDate;
					$scope.pickerDate = actualDate;
				} else {
					objRangeStartDate = targetDate;
					objRangeEndDate = actualDate;
					$scope.pickerDate = targetDate;
				}

				$scope.status.opened = false;
				$scope.datePlaceholder = GetPlaceholder();
			}
		}
	}

})();
