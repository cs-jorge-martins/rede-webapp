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

                        if (arrDaysWithStatus && arrDaysWithStatus.length && scope.status.opened) {
                            ctrl.addStatusCLass(arrDaysWithStatus, element);
                        }

					});

					scope.$watch("status.opened", function (bolNewValue) {

						scope.isOpen = bolNewValue;
						if (bolNewValue === false) {

                            scope.ready = false;
                            scope.intRangeClickCounter = 0;
							scope.clicked = false;

							if (scope.range && scope.intRangeClickCounter === 1) {
								scope.date = [scope.pickerDate, scope.pickerDate];
								scope.update();
							}
						}

					});

					scope.$watch("date", function () {

						if(!scope.range) {
							scope.pickerDate = scope.date;
							scope.datePlaceholder = scope.getPlaceholder();
						}

					});

					scope.$watch("ready", function (bolNewValue) {

						var funAddOrRemoveClasses = function (bolAdd) {
							if(bolAdd) {
								/* TODO: continuar logica do add | remove */
							}
                        };

						if(bolNewValue) {

							if(scope.range) {

								element[0].querySelector(".uib-daypicker").addEventListener("mouseover", function(e) {
									
									var strTag = e.target.tagName.toLowerCase();
									var objTd;
									var objTbody;

									if(strTag === 'span') {
										objTd = e.target.parentNode.parentNode;
										objTbody = e.target.parentNode.parentNode.parentNode.parentNode;
									} else if(strTag === 'button') {
										objTd = e.target.parentNode;
                                        objTbody = e.target.parentNode.parentNode.parentNode;
									}

									if(
										objTd &&
										objTd.tagName.toLowerCase() === 'td'&&
										scope.intRangeClickCounter === 1
									) {

                                        var arrTdClasses = objTd.classList;
									    var bolValidTd = true;
									    var bolIsOnRegex = false;
									    var strDateClass;
                                        var intClassIndex;

                                        var objPatt = new RegExp("^date-*[0-9]+$");
                                        
                                        for(intClassIndex in arrTdClasses) {
                                            
                                            if(arrTdClasses[intClassIndex] === 'hidden'|| arrTdClasses[intClassIndex] === 'invisible') {
                                                bolValidTd = false;
                                            }
                                            
                                            if(objPatt.test(arrTdClasses[intClassIndex])) {
                                                bolIsOnRegex = true;
                                                strDateClass = arrTdClasses[intClassIndex];
                                            }
                                            
                                        }

                                        if(bolValidTd && bolIsOnRegex && strDateClass) {
                                            var objDate = new Date(parseInt(strDateClass.substring(5)));
                                            var objButton = objTd.querySelector('button');

                                            objTd.classList.add('in-range');
                                            objTd.classList.add('last');
                                            objButton.classList.add('active');

                                            var objStartDate = scope.pickerDate < objDate ? scope.pickerDate : objDate;
                                            var objEndDate = scope.pickerDate > objDate ? scope.pickerDate : objDate;

                                            var arrDaysInBetween = calendarFactory.getArrayDatesBetween(objStartDate, objEndDate);

                                            arrDaysInBetween.forEach(function(objDateDay){
                                            	var strClassName = "date-" + objDateDay.getTime();
                                            	var objTdSelected = objTbody.getElementsByClassName(strClassName);

                                            	var arrClasses = scope.getRangeClasses(scope.range, 0, scope.pickerDate, objDate, objDateDay);

                                            	arrClasses.forEach(function (strClass) {
                                                    objTdSelected[0].classList.add(strClass);
                                                });

                                                objTdSelected[0].classList.add("in-range");
											});
                                            


                                            // adiciona classe in-range de datas que não estão entre scope.pickerDate && hover.

                                        }
									

									}

								});

                                element[0].querySelector(".uib-daypicker").addEventListener("mouseout", function(e) {

                                    var strTag = e.target.tagName.toLowerCase();
                                    var objTd;

                                    if (strTag === 'span') {
                                        objTd = e.target.parentNode.parentNode;
                                    } else if (strTag === 'button') {
                                        objTd = e.target.parentNode;
                                    }

                                    if (
                                        objTd &&
                                        objTd.tagName.toLowerCase() === 'td' &&
                                        scope.intRangeClickCounter === 1
                                    ) {
                                        var objButton = objTd.querySelector('button');

										var strClassInitialName = "date-" + calendarFactory.getFirstHourFromDate(scope.pickerDate).getTime();
										
										if(!objTd.classList.contains(strClassInitialName)) {
                                            objButton.classList.remove('active');
                                            objTd.classList.remove('in-range');
                                            objTd.classList.remove('last');
										}

										// retira classe in-range de datas que não estão entre scope.pickerDate && hover.

                                    }
                                });

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
			var arrMonthFirstDay = [];
			var bolCurrentMonth = false;
			var countFirstDay = 0;
			var countGetDayClass = 0;

			Init();

			function Init() {
				$scope.daysWithStatus = [];
                $scope.ready = false;
                $scope.directiveId = strDirectiveId;
				$scope.dateFormat = 'dd/MM/yyyy';
				$scope.open = Open;
				$scope.update = Update;
				$scope.closeOnSelection = true;
				$scope.clicked = false;
				$scope.getDayClass = GetDayClass;
				$scope.getPlaceholder = GetPlaceholder;
				$scope.getRangeClasses = GetRangeClasses;
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
				if($scope.statusType) {
					$scope.dateOptions.legendType = GetStatusClassType;
					$scope.dateOptions.legendLabel = GetStatusLabel;
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
			function Update(bolWasClicked) {
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
					$scope.clicked = bolWasClicked;
				}

				$scope.datePlaceholder = GetPlaceholder();
			}

			/**
			 * @method addStatusCLass
			 * Contém a lógica para adicionar as classes referentes aos dias que
			 * contém status de conciliação
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
				var arrNotSelectedDateClass;
				var arrBallClass;
				var arrInvisibleClass;

				if(!$scope.ready && $scope.status.opened === true) {
					$scope.ready = true;
                }

				countGetDayClass++;

				bolFirstDayOfMonth = calendarFactory.isFirstDayOfMonth(objDateAdjusted);

				if($scope.statusType && bolFirstDayOfMonth) {

					arrMonthFirstDay.push(true);

					if(arrMonthFirstDay.length === 1) {

						$scope.daysWithStatus = [];
						var objLastDayOfMonth = calendarFactory.getLastDayOfMonth(objDateAdjusted);

						if( $scope.status.opened && !$scope.clicked) {
							GetDaysPerStatus($scope.statusType, objDateAdjusted, objLastDayOfMonth);
						}

					} else {
						arrMonthFirstDay = [];
					}

				}

				if(bolFirstDayOfMonth) {
					countFirstDay++;
					bolCurrentMonth = true;
				}

				if(bolFirstDayOfMonth && bolCurrentMonth === true && countFirstDay > 1) {
					bolCurrentMonth = false;
					countFirstDay = 0;
				}

				arrInvisibleClass = GetInvisibleClass(bolCurrentMonth, countGetDayClass);

				if(countGetDayClass === 42) {
					countGetDayClass = 0;
                }

				arrBallClass = GetBallClass(bolIsRange, objDateAdjusted);
				arrRangeClasses = GetRangeClasses(bolIsRange, intRangeClickCounter, objRangeStartDate, objRangeEndDate, objDateAdjusted);
                arrNotSelectedDateClass= GetNotSelectedDateClass(bolIsRange, objDateAdjusted, objRangeStartDate, objRangeEndDate);

				arrClasses.push(GetCurrentDateClass(objDateAdjusted));

				arrInvisibleClass.forEach(function (strInvisibleClass) {
					arrClasses.push(strInvisibleClass);
				});

				arrRangeClasses.forEach(function (strRangeClass) {
					arrClasses.push(strRangeClass);
				});

                arrNotSelectedDateClass.forEach(function (strNonCurrentClass) {
					arrClasses.push(strNonCurrentClass);
				});

				arrBallClass.forEach(function (strBallClass) {
					arrClasses.push(strBallClass);
				});

				return _.uniq(arrClasses).join(" ");
			}


			/**
			 * @method GetInvisibleClass
			 * Método responsável por adicionar a classes de invisible / hidden nos tds do calendário.
			 * É o responsável por esconder os dias do mês não corrente.
			 * @param {Boolean} bolCurrentMonth Verifica se a data específica é do mês corrente
			 * @param {Number} countGetDayClass Numero do dia corrido no calendário, máximo 42
			 * @return {Array} nome da classe
			 */
			function GetInvisibleClass(bolCurrentMonth, countGetDayClass) {

				var arrClasses = [];

				if(!bolCurrentMonth) {
					if(countGetDayClass < 20) {
						arrClasses.push('invisible');
					} else {
						arrClasses.push('hidden');
					}
				}

				return arrClasses;

			}

			/**
			 * @method GetBallClass
			 * Contém a lógica para validar a data atual se deve ter a classe ball
			 * A classe ball é responsável por deixar o dia no datepicker com as bordas redondas.
			 * Esses dias são segunda, domingo, data inicial e data final.
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
			 * que será usado para renderizar cada data, com as possíveis classes:
			 * ball, bar, consecutive-days. Essas classes são responsáveis pela aparência das datas no datepicker.
			 * @param {Boolean} bolIsRange Verifica se a diretiva é range
			 * @param {Number} intRangeClickCounter Quantidade de clicks registrado na função Update()
			 * @param {Date} objRangeStartDate Primeira data selecionada (range)
			 * @param {Date} objRangeEndDate Segunda data selecionada (range)
			 * @param {Date} objDateAdjusted Data atual sendo tratada pela função GetDayClass
			 * @return {Array} arrClasses Pode retornar as classes: ball, bar, consecutive-days ou array vazio.
			 */
			function GetRangeClasses(bolIsRange, intRangeClickCounter, objRangeStartDate, objRangeEndDate, objDateAdjusted) {

				var arrClasses = [];
				
				
				console.log("bolIsRange", bolIsRange)
				console.log("intRangeClickCounter", intRangeClickCounter)
				console.log("objDateAdjusted", objDateAdjusted)
				console.log("objRangeEndDate", objRangeEndDate)
				console.log("objRangeStartDate", objRangeStartDate)
				
				
				
				
				

				if(bolIsRange && intRangeClickCounter === 0) {

					var weekDay = objDateAdjusted.getDay();
					var bolFirstOrLastDay = calendarFactory.isFirstDayOrLastDayOfMonth(objDateAdjusted);

					if (calendarFactory.isInBetweenHours(objRangeStartDate, objRangeEndDate, objDateAdjusted, 24)) {

						if (weekDay === 1 || bolFirstOrLastDay && weekDay !== 2)  {
							arrClasses.push('ball');
						} else if (weekDay === 0 || bolFirstOrLastDay && weekDay === 2) {
							arrClasses.push('bar');
							arrClasses.push('consecutive-days');
						} else{
							if(!bolFirstOrLastDay) {
								arrClasses.push('bar');
							}
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
				
				
				console.log("arrClasses", arrClasses)
				
				

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
			 * @method GetNotSelectedDateClass
             * Contém a lógica para adicionar a classe not-selected-date
			 * nas datas que não foram selecionadas no datepicker.
			 * Esta classe é adicionada para tirar um comportamento da diretiva ui.bootstrap.datepickerPopup
			 * sobre o primeiro dia, ao mudar de mês.
			 *
			 * @param {Boolean} bolIsRange Verifica se a diretiva é range
			 * @param {Date} objDateAdjusted Data atual sendo tratada pela função GetDayClass
			 * @param {Date} objRangeStartDate Primeira data selecionada (range)
			 * @param {Date} objRangeEndDate Segunda data selecionada (range)
			 * @return {Array} arrClasses pode retornar o array com no-current ou vazio
			 */
			function GetNotSelectedDateClass(bolIsRange, objDateAdjusted, objRangeStartDate, objRangeEndDate) {

				var arrClasses = [];
				var bolCurrentDate;

				if(bolIsRange) {
					bolCurrentDate = calendarFactory.isInBetween(objDateAdjusted, objRangeStartDate, objRangeEndDate);
				} else {
					bolCurrentDate = calendarFactory.isEqualDate(objDateAdjusted, $scope.pickerDate);
				}

				if (!bolCurrentDate) {
					arrClasses.push('not-selected-date');
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
			 * dependendo do strStatusType, que é a string que diferencia o tipo de requisição.
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
			 * Cria objeto com as datas a conciliar
			 *
			 * Contém a lógica para inserir no array $scope.daysWithStatus,
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
							type: GetStatusClassType()
						});

					}

				}

				$scope.daysWithStatus = arrDays;

			}

			/**
			 * @method GetSalesConciliatedDays
			 * Cria objeto com as datas  conciliadas
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
							type: GetStatusClassType()
						});

					}

				}

				$scope.daysWithStatus = arrDays;

			}

			/**
			 * @method GetStatusClassType
			 * Retorna a classe css certa para o statusType da diretiva
			 *
			 * @return {String} strCssClass Classe css correta para o statusType
			 */
			function GetStatusClassType() {

				var strCssClass;

				switch ($scope.statusType) {
					case "sales-to-conciliate":
						strCssClass = 'to-conciliate';
						break;
					case "conciliated-sales":
						strCssClass = 'conciliated';
						break;
					default:
						console.log("error");
				}

				return strCssClass;

			}

			/**
			 * @method GetStatusLabel
			 * Retorna a label certa para o statusType da diretiva
			 *
			 * @return {String} strStatusLabel label correta para o statusType
			 */
			function GetStatusLabel() {

				var strStatusLabel;

				switch ($scope.statusType) {
					case "sales-to-conciliate":
						strStatusLabel = 'vendas a conciliar';
						break;
					case "conciliated-sales":
						strStatusLabel = 'vendas conciliadas';
						break;
					default:
						console.log("error");
				}

				return strStatusLabel;

			}

		}
	}

})();
