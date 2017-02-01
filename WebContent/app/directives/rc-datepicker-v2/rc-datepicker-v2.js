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
                statusType: '=?',
				isOpen: '=?'
            },
			controller: Controller,
			link: function(scope, element, attrs, ctrl) {

				element.ready(function () {

                    scope.$watch('daysWithStatus', function (arrDaysWithStatus) {

                        if (arrDaysWithStatus && arrDaysWithStatus.length) {
                            ctrl.addStatusCLass(arrDaysWithStatus, element);
                        }

                    });

                    scope.$watch("status.opened", function (bolNewValue) {
                    	scope.isOpen = bolNewValue;
                        if (bolNewValue === false && scope.range) {

                            if (scope.intRangeClickCounter === 1) {
                                scope.date = [scope.pickerDate, scope.pickerDate];
                                scope.update();
                            }

                        }
                    });

                });

			}
		};

		function Controller($scope) {

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
                $scope.daysWithStatus = [];
				$scope.directiveId = strDirectiveId;
				$scope.dateFormat = 'dd/MM/yyyy';
				$scope.open = Open;
				$scope.update = Update;
				$scope.closeOnSelection = true;
				$scope.getDayClass = GetDayClass;
				$scope.initialDate = angular.copy($scope.date);
				$scope.status = {
					opened: false
				};
				$scope.dateOptions = {
					showWeeks: false,
					startingDay: 1,
					maxMode: 'day',
					customClass: GetDayClass,
					dateFilter: DateFilter,
                    activeDateFilter: 0
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
                            $scope.dateOptions.activeDateFilter = 0;
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

					$scope.intRangeClickCounter = intRangeClickCounter;
				} else {
					$scope.date = $scope.pickerDate;
				}

				$scope.datePlaceholder = GetPlaceholder();
			}

            /**
             * @method addStatusCLass
             * Contém a lógica para adicionar as classes referentes aos dias que
             * contém status
             *
             * @param {Array} arrDaysWithStatus Array de objetos com dias + status
             * @param {Object} objElement Elemento datepicker
             */
            this.addStatusCLass = function(arrDaysWithStatus, objElement) {

                var strClassDate;
                var objDateButton;

                arrDaysWithStatus.forEach(function (objDay) {

					strClassDate = objDay.dateClass;
					objDateButton = objElement[0].getElementsByClassName(strClassDate)[0];

					if(objDateButton) {
						objDateButton.classList.add("has-status");
						objDateButton.classList.add(objDay.type);
                    }

                });

            };

			/**
			 * @method GetDayClass
			 * @alias getDayClass
			 * Método responsável por adicionar as classes no calendário. Ele itera
			 * por todos os dias do mês corrente e adiciona as respectivas classes
			 * aos dias. Este método é padrão do componente ui.bootstrap.datepicker
			 * do angular-ui-bootstrap. E é passado para a diretiva.
			 * @param {Date} date Data
			 * @return {Array} nome da classe
			 */
			function GetDayClass(date) {

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

                        $scope.daysWithStatus = [];
                        var objLastDayOfMonth = calendarFactory.getLastDayOfMonth(objDateAdjusted);
                        GetDaysPerStatus($scope.statusType, objDateAdjusted, objLastDayOfMonth);

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

            /**
             * @method GetBallClass
             * Contém a lógica para validar a data atual se é do tipo ball
             * as datas do tipo ball, são as única selecionadas, segunda, domingo
			 * e ultimas datas selecionadas
             * @param {Boolean} bolIsRange Verifica se a diretiva é range
             * @param {Object} objDateAdjusted Data que será validada
			 * @return {Array} arrClasses Retorna a classe ball ou array vazio
             */
			function GetBallClass(bolIsRange, objDateAdjusted) {

				var arrClasses = [];

                if (!bolIsRange && ($scope.date.getTime() == objDateAdjusted.getTime()) ) {
                    arrClasses.push('ball');
                }

                return arrClasses;

            }

            /**
             * @method GetRangeClasses
             * Contém a lógica para validar as datas selecionadas se for range. Retorna um array
             * que será usado para renderizar cada data, com as possíveis respostas:
             * ball, bar, consecutive-days.
             * @param {Boolean} bolIsRange Verifica se a diretiva é range
             * @param {Number} intRangeClickCounter Quantidade de clicks registrado na função Update()
             * @param {Date} objRangeStartDate Primeira data selecionada (range)
             * @param {Date} objRangeEndDate Segunda data selecionada (range)
             * @param {Date} objDateAdjusted Data atual sendo tratada pela função GetDayClass
             * @return {Array} arrClasses Pode retornar as classes: ball, bar, consecutive-days ou array vazio.
             */
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

            /**
             * @method GetCurrentDateClass
             * Contém a lógica para criar o nome de classe com o nome:
			 * date-xxxxxxxxxxx, sendo o xx sendo substituido por timestamp,
			 * para a data que está sendo percorrida pelo GetDayClass.
             * @param {Date} objCurrentDate Data atual sendo tratada pela função GetDayClass
             * @return {Array} arrClasses deve retornar a classe com o nome date-xxxx
			 * e o timestamp específico dela.
             */
            function GetCurrentDateClass(objCurrentDate) {

				var arrClasses = [];

				var strClass = 'date-' + calendarFactory.getFirstHourFromDate(objCurrentDate).getTime();
				arrClasses.push(strClass);

				return arrClasses;

            }

            /**
             * @method GetNoCurrentClass
             * Contém a lógica para adicionar a classe no-current para
			 * datas que não foram selecionadas
             *
             * @param {Boolean} bolIsRange Verifica se a diretiva é range
             * @param {Date} objDateAdjusted Data atual sendo tratada pela função GetDayClass
             * @param {Date} objRangeStartDate Primeira data selecionada (range)
             * @param {Date} objRangeEndDate Segunda data selecionada (range)
             * @return {Array} arrClasses pode retornar o array com no-current ou vazio
             */
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
			 * @param {Number} days Dias a serem adicionados ou removidos da data
			 * @param {String} strStartingDate 'tomorrow' para começar a contagem de amanhã
			 * @param {Number} intActiveDateFilter, numero de controle para chavear opção clicada
			 * atual. Passando valores negativos, o método faz a subtração dos dias.
			 */
			function DateFilter(days, strStartingDate, intActiveDateFilter) {

				if(intActiveDateFilter) {
                    $scope.dateOptions.activeDateFilter = intActiveDateFilter;
				}

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

				if(bolIsRange) {
                    $scope.date = [actualDate, targetDate];
				}

				$scope.status.opened = false;
				$scope.datePlaceholder = GetPlaceholder();
			}

            /**
             * @method GetDaysPerStatus
             * Contém a lógica para redirecionar para a função certa
             * dependendo do strStatusType
             *
             * @param {String} strStatusType Nome do status informado por $scope.statusType
             * @param {Date} objStartDate Primeira data selecionada (range)
             * @param {Date} objEndDate Segunda data selecionada (range)
             */
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
                        return TransactionConciliationService.ListTransactionConciliationByFilter(objFilter).then(GetSalesToConciliateDays);
                        break;
					case "conciliated-sales":
                        return TransactionConciliationService.ListTransactionConciliationByFilter(objFilter).then(GetSalesConciliatedDays);
						break;
					default:
                        console.log("error");
				}

            }

            /**
             * @method GetSalesToConciliateDays
			 * Cria objeto com dias com datas a conciliar
			 *
             * Contém a lógica para gravar no array $scope.daysWithStatus
             * ele recebe a resposta de uma chamada na api, passada pela função
			 * GetDaysPerStatus e parsea os dados para inserir um objeto, se passar
			 * pela validação.
             *
             * @param {Object} objResponse Objeto de resposta da API.
             */
            function GetSalesToConciliateDays(objResponse) {

				var objResponse = objResponse.data.content;
				var intIndex;
				var arrDays = [];

				for(intIndex in objResponse) {

					if(objResponse[intIndex].transctionToConcilieQuantity > 0) {

                        arrDays.push({
							dateClass: 'date-' + calendarFactory.getFirstHourFromDate(objResponse[intIndex]['date'], true).getTime(),
							type: 'to-conciliate'
						});

					}

				}

                $scope.daysWithStatus = arrDays;

            }

            /**
             * @method GetSalesConciliatedDays
			 * Cria objeto com dias com datas conciliadas
			 *
             * Contém a lógica para gravar no array $scope.daysWithStatus
             * ele recebe a resposta de uma chamada na api, passada pela função
             * GetDaysPerStatus e parsea os dados para inserir um objeto, se passar
             * pela validação.
             *
             * @param {Object} objResponse Objeto de resposta da API.
             */
            function GetSalesConciliatedDays(objResponse) {

				var objResponse = objResponse.data.content;
				var intIndex;
                var arrDays = [];

                for(intIndex in objResponse) {

                    if(objResponse[intIndex].transctionConciliedQuantity > 0) {

                        arrDays.push({
                            dateClass: 'date-' + calendarFactory.getFirstHourFromDate(objResponse[intIndex]['date'], true).getTime(),
                            type: 'conciliated'
                        });

                    }

                }

                $scope.daysWithStatus = arrDays;

            }

		}
	}

})();
