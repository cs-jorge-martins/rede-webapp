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

	RcDatepickerV2.$inject = ['calendarFactory', 'TransactionConciliationService', '$q', '$http', 'app'];

	function RcDatepickerV2(calendarFactory, TransactionConciliationService, $q, $http, app) {

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
				showPreviousDatesFilter: '=',
                statusType: '=?'
            },
			controller: Controller,
			link: function(scope, element, attrs, ctrl) {

				// console.log("controller", controller[0]);

				element.ready(function () {

                    scope.$watch('daysWithStatus', function(status) {

						if(status && status.date) {
                            ctrl.addStatusCLass(status);
                        }

                    });


                    // buttonPrevMonth.addEventListener('click', function(){
                    //     // months--;
                    //     console.log("clicou no esquerdo");
                    // });
                    //
                    // buttonNextMonth.addEventListener('click', function(){
                    //     // months--;
                    //     console.log("clicou no direito");
                    // });

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

		function Controller($scope) {

			this.addStatusCLass = function(objStatus) {

                var strClassDate = calendarFactory.FormatDateForService(objStatus.date, 'YYYY-MM-DD');
                console.log(strClassDate);

            };

			var strDirectiveId = 'rc-datepicker-v2-' + (new Date()).getTime();
			var bolIsRange = $scope.range || false;
			var objDateSource = $scope.date;
			var objRangeStartDate;
			var objRangeEndDate;
			var intRangeClickCounter;
			var bolFirstDayOfMonth;
			var objLeftArrow;
			var objRightArrow;
			var arrMonthFirstDay = [];

			Init();

			function Init() {
                $scope.daysWithStatus = {};
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
							$scope.date = [objRangeStartDate, objRangeEndDate];
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

                var objDateAdjusted = date.date;
                var arrClasses = [];
                var arrRangeClasses;
                var arrNoCurrent;
                var arrBallClass;
                var arrCurrentDate;

                bolFirstDayOfMonth = calendarFactory.isFirstDayOfMonth(objDateAdjusted);

                if($scope.statusType && bolFirstDayOfMonth) {

                    arrMonthFirstDay.push(true);

                    if(arrMonthFirstDay.length === 1) {

                        $scope.daysWithStatus = {};
                        var objLastDayOfMonth = calendarFactory.getLastDayOfMonth(objDateAdjusted);
                        var service = GetDaysPerStatus($scope.statusType, objDateAdjusted, objLastDayOfMonth);
                        service.then(function (objResponse) {

                            var response = objResponse.data.content;
                            var intIndex;
                            
                            for(intIndex in response) {

                                if(response[intIndex].transctionConciliedQuantity > 0) {

                                    $scope.daysWithStatus = {
                                        date: response[intIndex]['date'],
                                        type: 'jade'
                                    };

                                }

                            }

                        });

                    } else {
                        arrMonthFirstDay = [];
                    }

                }

                arrBallClass = GetBallClass(bolIsRange, objDateAdjusted);
                arrRangeClasses = GetRangeClasses(bolIsRange, intRangeClickCounter, objRangeStartDate, objRangeEndDate, objDateAdjusted);
                arrNoCurrent= GetNoCurrentClass(bolIsRange, objDateAdjusted, objRangeStartDate, objRangeEndDate);

                arrClasses.push(GetCurrentDateClass(objDateAdjusted));

                arrRangeClasses.forEach(function (strRangeClass) {
                    arrClasses.push(strRangeClass);
                });

                arrNoCurrent.forEach(function (strNonCurrentClass) {
                    arrClasses.push(strNonCurrentClass);
                });

                arrBallClass.forEach(function (strBallClass) {
                    arrClasses.push(strBallClass);
                });

				return _.uniq(arrClasses).join(" ");
			}

			function GetBallClass(bolIsRange, objDateAdjusted) {

				var arrClasses = [];

                if (!bolIsRange && ($scope.date.getTime() == objDateAdjusted.getTime()) ) {
                    arrClasses.push('ball');
                }

                return arrClasses;

            }

			function GetRangeClasses(bolIsRange, intRangeClickCounter, objRangeStartDate, objRangeEndDate, objDateAdjusted) {

				var arrClasses = [];

				if(bolIsRange && intRangeClickCounter === 0) {

                    var weekDay = objDateAdjusted.getDay();
                    var intStartDate = objRangeStartDate.getTime();
                    var intEndDate = objRangeEndDate.getTime();

                    if (calendarFactory.isInBetweenHours(objRangeStartDate, objRangeEndDate, objDateAdjusted, 24)) {

                        if (weekDay === 1)  {
                            arrClasses.push('ball');
                        } else if (weekDay === 0) {
                            arrClasses.push('bar');
                            arrClasses.push('consecutive-days');
                        } else{
                            arrClasses.push('bar');
                        }

                    }
                    else if (calendarFactory.isEqualDate(objRangeStartDate,objDateAdjusted)) {
                        arrClasses.push('ball');
                    }
                    else if (calendarFactory.isEqualDate(objRangeEndDate, objDateAdjusted)) {

                        if(weekDay !== 1) {
                            arrClasses.push('bar');
                            arrClasses.push('consecutive-days');
                        } else {
                            arrClasses.push('ball');
                        }

                    }

                }

                return arrClasses;

            }

            function GetCurrentDateClass(arrCurrentDate) {

				var arrClasses = [];

				var strClass = 'date-' + calendarFactory.formatDateForService(arrCurrentDate);
				arrClasses.push(strClass);

				return arrClasses;

            }

            function GetNoCurrentClass(bolIsRange, objDateAdjusted, objRangeStartDate, objRangeEndDate) {

				var arrClasses = [];
				var bolCurrentDate;

				if(bolIsRange) {
                    bolCurrentDate = calendarFactory.isInBetween(objDateAdjusted, objRangeStartDate, objRangeEndDate);
                } else {
					bolCurrentDate = calendarFactory.isEqualDate(objDateAdjusted, $scope.pickerDate);
				}

				if (!bolCurrentDate) {
                    arrClasses.push('no-current');
				}

                return arrClasses;

            }

			/**
			 * @method DateFilter
			 * @alias dateFilter
			 * Método resopnsável por fazer os filtros de dias, localizado na
			 * parte inferior do componente de calendário. Ele adiciona ou subtrai
			 * os dias e já atualiza a(s) data(s) de acordo com o parâmetro recebido
			 * @param {Integer} days Dias a serem adicionados ou removidos da data
			 * @param {String} strStartingDate 'tomorrow' para começar a contagem de amanhã
			 * atual. Passando valores negativos, o método faz a subtração dos dias.
			 */
			function DateFilter(days, strStartingDate) {
				var actualDate = new Date();
				if(strStartingDate && strStartingDate === 'tomorrow') {
					actualDate.setDate(actualDate.getDate() + 1);
				}
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

			function GetDaysPerStatus(strStatusType, objStartDate, objEndDate) {

                var objFilter = {
                    currency: 'BRL',
                    groupBy: 'DAY',
                    size: 31,
                    page: 0,
                    startDate: calendarFactory.formatDateForService(objStartDate),
                    endDate: calendarFactory.formatDateForService(objEndDate)
                };

				switch (strStatusType) {
                    case "sales-to-conciliate":
                        return TransactionConciliationService.ListTransactionConciliationByFilter(objFilter);
                        break;
					case "conciliated-sales":
                        // GetConciliatedSalesDays();
						break;
				}

            }

            function GetSalesToConciliateDays(objResponse) {

				var response = objResponse.data.content;
                var intIndex;

				for(intIndex in response) {
					
					if(response[intIndex].transctionConciliedQuantity > 0) {

						var objToConciliateDay = {
							date: response[intIndex]['date'],
							type: 'jade'
						};

                        $scope.daysWithStatus.push(objToConciliateDay);
					}

				}

            }

		}
	}

})();
