angular.module('KaplenWeb.resumoConciliacaoController',['ui.bootstrap'])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/resumoConciliacao', {templateUrl: 'app/views/resumoConciliacao.html', controller: 'resumoConciliacaoController'});
}]).controller('resumoConciliacaoController', function(menuFactory, $rootScope, $scope, $modal, calendarFactory, $timeout, cacheService,
		resumoConciliacaoService, transactionsService, dashboardService, installmentsService, kaplenAdminService, $window,
		userService, integrationService, advancedFilterService, calendarService, $location){

	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.loadParamsByFilter();

	$scope.getAdditionalInformations($rootScope.company).then(function(result){
		if(result == "true"){
			$scope.additionalInformations = true;
		}else{
			$scope.additionalInformations = false;
		}
	});

	/***************************************************************** Ativando o menu de Vendas *****************************************************************/
	menuFactory.setActiveResumoConciliacao();

	startResumoConciliacaoTour($rootScope.user);

	$scope.nextYear = function() {
		var actualYear = $scope.yearSelected;
		actualYear += 1;
		$scope.changeYear(actualYear);
	};

	$scope.prevYear = function() {
		var actualYear = $scope.yearSelected;
		actualYear -= 1;
		$scope.changeYear(actualYear);
	};

	if($rootScope.user.firstAccess){
		restartResumoConciliacaoTour(userService);
	}

	$scope.helpAnalitico = function(){
		restartResumoConciliacaoAnaliticoTour(userService, $rootScope.user);
	};

	$scope.tabs = [{},{}];

	$scope.changeYear = function(year) {
		$scope.dateSelected = calendarFactory.getSpecificDateOfYear(year);
		$scope.yearSelected = parseInt(calendarFactory.getYear($scope.dateSelected));
		loadDayResume($scope.dateSelected);
		$scope.loadParamsByFilter();

		getTransactionConciliation();
	};

	var atualizarAccordion = false;
	startResumoConciliacao();
	zerarValores();

	if(dashboardService.getDay() != null){
		var dayDashboard = dashboardService.getDay();
		dashboardService.setDay(null);
		$scope.dateSelected = calendarFactory.formatDate(dayDashboard.date , true);
		$scope.tabs[1].active = true;
		atualizarAccordion = true;
	}
	else{
		$scope.dateSelected = calendarFactory.getYesterdayDate();
	}

	$scope.yearSelected = parseInt(calendarFactory.getYear($scope.dateSelected));

	var company = '';
	if (angular.isDefined($rootScope.company)) {
		company = $rootScope.company;
	}

	function startResumoConciliacao(){
		var momentjs = moment();

		var months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

		$scope.months = [];

		for(var i = 0; i < 12; i++){
			if((momentjs.month()+1) == (i + 1)){
				$scope.months.push({month: months[i], active: true});
			}else{
				$scope.months.push({month: months[i], active: false});
			}
		}

		var initialDayOfMonth = calendarFactory.getDayOfMonth(calendarFactory.getFirstDayOfMonth());
		var lastDayOfMonth = calendarFactory.getDayOfMonth(calendarFactory.getLastDayOfMonth());

		$scope.itens = [];

		var isActive = false;

		for(initialDayOfMonth; initialDayOfMonth <= lastDayOfMonth; initialDayOfMonth++){

			if(initialDayOfMonth == calendarFactory.getDayOfMonth(calendarFactory.getYesterdayDate())){
				isActive = true;
			}else{
				isActive = false;
			}

			$scope.itens.push({
				date:new Date(moment(initialDayOfMonth + "/" + (momentjs.month()+1) + "/" + momentjs.year(), calendarFactory.getFormat())),
				totalToReconcile: 0,
				totalConcilied: 0,
				totalToProcess: 0,
				totalAmountToReconcile: 0,
				totalAmountConcilied: 0,
				totalAmountToProcess: 0,
				isActive: isActive
			});
		}
	};
	function zerarValores(){
		$scope.totalConciliedForMonth = 0;
		$scope.totalToProcessForMonth = 0;
		$scope.totalToReconcileForMonth = 0;
		$scope.totalToReconcileForMonthAmount = 0;
		$scope.totalConciliedForMonthAmount = 0;
		$scope.totalToProcessForMonthAmount = 0;

		//Grafico por Tipo de vendas
		dataTipoConciliacao = [
		                       ['Conciliadas', $scope.totalConciliedForMonth],
		                       ['A conciliar', $scope.totalToReconcileForMonth],
		                       ['Não processadas', $scope.totalToProcessForMonth]
		                       ];

		$scope.graphStatusVendas = pieChartTipoVendaConciliacao(dataTipoConciliacao);

		//****** Atualiza Gráfico de operadoras ******//
		dataOperadora = [];

		var dataValores = [];
		var dataDiferencaValores = [];

		$scope.comparativo = pieChartOperadora(dataValores, dataDiferencaValores, dataOperadora);
	};

	/**************************************************************** Loading da CONCILIACAO DO DIA **************************************************************/

	$scope.loadingConciliacaoDia = function(){
		startResumoConciliacaoAnaliticoTour();
		updateValuesAccordion();
	};

	/******************************************************************* Variaveis de Controle *******************************************************************/

	$scope.actualDateSelected = calendarFactory.getNameOfMonthAndYear($scope.dateSelected);
	$scope.monthNameAbreviation = calendarFactory.getMonthNameAbreviation($scope.dateSelected);
	$scope.dayOfActualDate = calendarFactory.getDayOfMonth($scope.dateSelected);

	$scope.statusItensAccordionSelected = 1; //Conciliadas
	$scope.checkAll = false;

	var itensSelected = [];

	//Variaveis dos somatorios
	$scope.totalToReconcileForDay = 0;
	$scope.totalConciliedForDay = 0;
	$scope.totalToProcessForDay = 0;

	$scope.isResumoMesActive = true;
	$scope.isConciliacaoDiaActive = false;

	/******************************************************************* Loading do RESUMO DO DIA ****************************************************************/

	$scope.loadConciliacaoDiaForDaySelected = function(dateSelected, statusConciliacao){
		$scope.dayOfActualDate = calendarFactory.getDayOfMonth(calendarFactory.formatDate(dateSelected, true));
		$scope.dateSelected = calendarFactory.formatDate(dateSelected, true);
		$scope.statusItensAccordionSelected = statusConciliacao;

		angular.forEach($scope.itens, function(dayCalendar, index){
			dayCalendar.isActive = false;

			if(calendarFactory.formatDate(dayCalendar.date, true) == $scope.dateSelected){
				dayCalendar.isActive = true;
			}
		});

		$scope.isResumoMesActive = false;
		$scope.isConciliacaoDiaActive = true;

		updateValuesAccordion();
	};

	/******************************************************************** Funções para RESUMO DO DIA *************************************************************/

	$scope.setResumoMesActive = function(){
		$scope.isResumoMesActive = true;
		$scope.isConciliacaoDiaActive = false;
	};

	function loadDayResume(date){

		transactionsService.getMonthsToSlider(date).then(function(it) {
			$scope.months = it;

			angular.forEach(it, function(month, index){
				checkOneItemStatusDay(month);
			});

			//Após carregar os meses, carrega informações para data atual
			getTransactionsResumed(date);
		});
	};

	function checkOneItemStatusDay(item){
		var count = 0;

		if(item.toReconcile){
			count++;
		}

		if(item.toProcess){
			count++;
		}

		if(item.concilied && !item.toReconcile && !item.toProcess){
			count++;
		}

		if(count == 1){
			item.oneItem = true;
		}else{
			item.oneItem = false;
		}
	};

	function checkStatusItemAccordion(dayCalendar){

		if(dayCalendar.toReconcile){
			$scope.statusItensAccordionSelected = 1;
		}else if(dayCalendar.toProcess){
			$scope.statusItensAccordionSelected = 3;
		}else{
			$scope.statusItensAccordionSelected = 2;
		}
	};

	function getTransactionsResumed(dateSelected){
		if(!$scope.filterClick){
			$scope.loadParamsByFilter();
		}

		transactionsService.getTransactionsResumed(dateSelected, $scope.settlementsSearch, $scope.acquirersSearch,
				$scope.brandsSearch, $scope.productsSearch, $scope.terminalsSearch, $scope.natureza, $scope.tipoTerminal, $scope.additionalInformations)
				.then(function(itens) {
					$scope.dateSelected = dateSelected;

					//Atualiza a data atual para a selecionada ou a de inicio
					$scope.actualDateSelected = calendarFactory.getNameOfMonthAndYear(dateSelected);

					//Atualiza no escopo as datas selecionadas
					$scope.monthNameAbreviation = calendarFactory.getMonthNameAbreviation(dateSelected);

					$scope.dayOfActualDate = calendarFactory.getDayOfMonth(dateSelected);

					$scope.itens = itens;

					angular.forEach($scope.itens, function(day, index){
						day.isActiveButton = false;
						if(day.concilied || day.toReconcile || day.toProcess){
							day.isActiveButton = true;
						}
					});

					$scope.totalConciliedForMonth = 0;
					$scope.totalToProcessForMonth = 0;
					$scope.totalToReconcileForMonth = 0;
					$scope.totalConciliedForMonthAmount = 0;
					$scope.totalToProcessForMonthAmount = 0;
					$scope.totalToReconcileForMonthAmount = 0;

					//Quadro Comparativo
					var dataAdquirente = [];
					var dataLoja = [];

					//Quadro Comparativo
					dataAdquirente.push(0);
					dataLoja.push(0);

					angular.forEach(itens, function(dayCalendar, index){
						checkOneItemStatusDay(dayCalendar);

						dayCalendar.isActive = false;

						if(calendarFactory.formatDate(dayCalendar.date, true) == dateSelected){
							dayCalendar.isActive = true;
							checkStatusItemAccordion(dayCalendar);
						}

						//Somatorios para TOTAIS
						$scope.totalConciliedForMonth += dayCalendar.totalConcilied;
						$scope.totalConciliedForMonthAmount += dayCalendar.totalAmountConcilied;
						$scope.totalToProcessForMonth += dayCalendar.totalToProcess;
						$scope.totalToProcessForMonthAmount += dayCalendar.totalAmountToProcess;
						$scope.totalToReconcileForMonth += dayCalendar.totalToReconcile;
						$scope.totalToReconcileForMonthAmount += dayCalendar.totalAmountToReconcile;

						//Quadro Comparativo
						dataAdquirente.push(dayCalendar.totalAmountConcilied + dayCalendar.totalAmountToReconcile);
						dataLoja.push(dayCalendar.totalAmountConcilied + dayCalendar.totalAmountToProcess);
					});

					//Quadro Comparativo
					var data = [{name:'Adquirente', data:dataAdquirente}, {name:'Loja', data:dataLoja}];
					$scope.graphComparativo = pieChartComparativo(data);

					//Grafico por Tipo de vendas
					dataTipoConciliacao = [
					                       ['Conciliadas', $scope.totalConciliedForMonth],
					                       ['A conciliar', $scope.totalToReconcileForMonth],
					                       ['Não processadas', $scope.totalToProcessForMonth]
					                       ];

					$scope.graphStatusVendas = pieChartTipoVendaConciliacao(dataTipoConciliacao);

					//Atualiza grafico de operadoras e evita multiple points
					/*
					getAcquirersGraphForMonth(dateSelected, true);

					if(atualizarAccordion){
						atualizarAccordion = false;
						updateValuesAccordion();
					}

					updateValuesAccordion();
					 */
					getTransactionConciliation();
				});
	};

	function getAcquirersGraphForMonth(dateSelected, isForAllMonth){
		transactionsService.getAcquirer(dateSelected, 0, isForAllMonth, 1, $scope.acquirersSearch, $scope.brandsSearch,
				$scope.productsSearch, $scope.settlementsSearch, $scope.terminalsSearch, $scope.natureza, $scope.tipoTerminal).then(function(itens) {

					//****** Atualiza Gráfico de operadoras ******//
					dataOperadora = [];

					var dataValores = [];
					var dataDiferencaValores = [];

					var total = 0;

					angular.forEach(itens, function(item, index){
						total += item.totalAmount;
					});

					angular.forEach(itens, function(item, index){
						var calculo = (100 * item.totalAmount)/total;

						dataValores.push({y: calculo, color: item.color});
						dataDiferencaValores.push(100 - calculo);
						dataOperadora.push(item.name);
					});

					$scope.comparativo = pieChartOperadora(dataValores, dataDiferencaValores, dataOperadora);
				});
	};

	/************************************************************** Funcoes para CONCILIACAO DO DIA **************************************************************/

	function updateValuesAccordion(){

		//Só atualiza caso a data tenha mudado da ultima pesquisada
		if($scope.dateSelected != $scope.lastDaySelected){
			var sumValues = false;

			if(!sumValues){
				angular.forEach($scope.itens, function(dayCalendar, index){
					if(calendarFactory.formatDate(dayCalendar.date, true) == $scope.dateSelected){
						$scope.totalToReconcileForDay = dayCalendar.totalToReconcile;
						$scope.totalConciliedForDay = dayCalendar.totalConcilied;
						$scope.totalToProcessForDay = dayCalendar.totalToProcess;
						sumValues = true;
					}
				});
			}

			getItensAccordion($scope.dateSelected, $scope.statusItensAccordionSelected);
			$scope.lastDaySelected = $scope.dateSelected;

		}
		else if($scope.dateSelected === $scope.lastDaySelected){
			angular.forEach($scope.itens, function(dayCalendar, index){
				dayCalendar.isActive = false;

				if(calendarFactory.formatDate(dayCalendar.date, true) == $scope.dateSelected){
					$scope.totalToReconcileForDay = dayCalendar.totalToReconcile;
					$scope.totalConciliedForDay = dayCalendar.totalConcilied;
					$scope.totalToProcessForDay = dayCalendar.totalToProcess;
					dayCalendar.isActive = true;
				}
			});

			getItensAccordion($scope.dateSelected, $scope.statusItensAccordionSelected);
		}

	}

	function getItensAccordion(dateSelected, statusConciliacao){
		if(!$scope.filterClick){
			$scope.loadParamsByFilter();
		}
		transactionsService.getAcquirer(dateSelected, statusConciliacao, false, 0, $scope.acquirersSearch, $scope.brandsSearch,
				$scope.productsSearch, $scope.settlementsSearch, $scope.terminalsSearch, $scope.natureza, $scope.tipoTerminal).then(function(itens) {

					if(itens.length == 0){
						$scope.noItensMsg = true;
					}else{
						$scope.noItensMsg = false;
					}

					//Atualiza Itens do accordion
					$scope.itensAccordion = itens;
					$scope.totalAccordionQuantity = 0;
					$scope.totalAccordionAmount = 0;

					angular.forEach(itens, function(item, index){
						$scope.totalAccordionQuantity += item.quantity;
						$scope.totalAccordionAmount += item.totalAmount;
					});

					//Atualiza status para o accordion
					if(statusConciliacao == 1){
						$scope.statusConciliacao = "A conciliar";
					}else if(statusConciliacao == 2){
						$scope.statusConciliacao = "Conciliadas";
					}else{
						$scope.statusConciliacao = "Não processadas";
					}

				});
	};

	$scope.buttonConcilied = true;
	$scope.activeButtonConcilied = function() {
		if($scope.checkedAll || $scope.checkedCardBrand || $scope.checkedCardProduct){
			$scope.buttonConcilied = false;
		}
		else{
			$scope.buttonConcilied = true;
		}
	};

	$scope.checkAllAcquirer = function(checkedAll, item) {
		$scope.checkedAll = $scope.checkedCardBrand = $scope.checkedCardProduct = checkedAll;
		$scope.activeButtonConcilied();

		if(checkedAll){
			angular.forEach(item.cardBrandDTOs, function(cardBrand){
				cardBrand.itemCheck = true;

				angular.forEach(cardBrand.cardProductDTOs, function(cardProduct){
					cardProduct.itemCheck = true;
				});
			});
		}
		else if(!checkedAll){
			angular.forEach(item.cardBrandDTOs, function(cardBrand){
				cardBrand.itemCheck = false;

				angular.forEach(cardBrand.cardProductDTOs, function(cardProduct){
					cardProduct.itemCheck = false;
				});
			});
		}
	};

	$scope.checkCardBrand = function(cardbrand, acquirer) {
		var validateCardBrand = false;

		if(cardbrand.itemCheck){
			$scope.checkedAll = false;
			$scope.checkedCardBrand = $scope.checkedCardProduct = true;
			$scope.activeButtonConcilied();

			angular.forEach(cardbrand.cardProductDTOs, function(cardProduct){
				cardProduct.itemCheck = true;
			});

			angular.forEach(acquirer.cardBrandDTOs, function(card){
				if(!card.itemCheck){
					validateCardBrand = true;
				}
			});
			if(!validateCardBrand){
				acquirer.checkAll = true;
			}

		}else{
			$scope.checkedAll = $scope.checkedCardBrand = $scope.checkedCardProduct = false;
			$scope.activeButtonConcilied();

			angular.forEach(cardbrand.cardProductDTOs, function(cardProduct){
				cardProduct.itemCheck = false;
			});

			angular.forEach(acquirer.cardBrandDTOs, function(card){
				if(!card.itemCheck){
					validateCardBrand = true;

				}
			});
			if(validateCardBrand){
				acquirer.checkAll = false;
			}
		}
	};

	$scope.checkcardProduct = function(item, acquirer) {
		var validateCardBrand = false;
		var validateCardProduct = false;

		if(!item.itemCheck){
			$scope.checkedAll = $scope.checkedCardBrand = $scope.checkedCardProduct = false;
			$scope.activeButtonConcilied();

			angular.forEach(acquirer.cardBrandDTOs, function(cardBrand){
				angular.forEach(cardBrand.cardProductDTOs, function(cardProduct){
					if(!cardProduct.itemCheck){
						validateCardProduct = true;

					}
				});
				if (validateCardProduct){
					cardBrand.itemCheck = false;
				}
				validateCardProduct = false;
			});
			angular.forEach(acquirer.cardBrandDTOs, function(cardBrand){
				if(!cardBrand.itemCheck){
					validateCardBrand = true;

				}
			});
			if(validateCardBrand){
				acquirer.checkAll = false;
			}
		}
		else{
			$scope.checkedAll = $scope.checkedCardBrand = false;
			$scope.checkedCardProduct = true;
			$scope.activeButtonConcilied();

			angular.forEach(acquirer.cardBrandDTOs, function(cardBrand){
				angular.forEach(cardBrand.cardProductDTOs, function(cardProduct){
					if(!cardProduct.itemCheck){
						validateCardProduct = true;

					}
				});
				if (!validateCardProduct){
					cardBrand.itemCheck = true;
				}
				validateCardProduct = false;
			});
			angular.forEach(acquirer.cardBrandDTOs, function(cardBrand){
				if(!cardBrand.itemCheck){
					validateCardBrand = true;

				}
			});
			if(!validateCardBrand){
				acquirer.checkAll = true;
			}
		}
	};

	$scope.conciliarVendas = function() {
		var date = $scope.dateSelected;

		angular.forEach($scope.itensAccordion, function(it){
			angular.forEach(it.cardBrandDTOs, function(cardBrand){
				angular.forEach(cardBrand.cardProductDTOs, function(cardProduct){
					if(cardProduct.itemCheck){
						var item = {dateJson: date, acquirerId:it.id, cardBrandId:cardBrand.id, cardProductId:cardProduct.id};
						itensSelected.push(item);
					}
				});
			});
		});

		resumoConciliacaoService.reconciliateTransaction(itensSelected).then(function() {
			atualizarAccordion = true;
			getTransactionsResumed(date);
		});
	};

	$scope.isVisibleCheckbox = function(){
		var status = false;
		angular.forEach($scope.itensAccordion, function(it){
			if($scope.statusItensAccordionSelected == 1){
				status = true;
			}
		});
		return status;
	};


	/* inicio modal integracao */
	$scope.integrate = function() {
		var modalInstance = $modal.open({
			templateUrl: 'integracaoModal.html',
			controller: integracaoArquivos,
			resolve: {
				getDateSelected: function() {
					return $scope.dateSelected;
				},
				getAcquirersSelected: function(){
					return $scope.acquirersSelected;
				},
				getSettlementsSelected: function(){
					return $scope.settlementsSelected;
				},
				getAcquirersSearch: function(){
					return $scope.acquirersSearch;
				},
				getSettlementsSearch: function(){
					return $scope.settlementsSearch;
				}
			}
		});
	};
	var integracaoArquivos = function($rootScope, calendarFactory, $scope, resumoConciliacaoService, $modalInstance, cacheService, getDateSelected,
			getAcquirersSelected, getAcquirersSearch, getSettlementsSelected, getSettlementsSearch, integrationService, advancedFilterService, calendarService){

		//Extensao do serviço para filtro avançado
		angular.extend($scope, advancedFilterService);

		//Extensao do serviço para filtro avançado
		angular.extend($scope, calendarService);
		$scope.resetCalendarService();

		$scope.cancel = function () {
			$scope.loadParamsByFilter();
			$modalInstance.dismiss('cancel');
		};

		var actualDateMoment = calendarFactory.getMomentOfSpecificDate(getDateSelected);

		$scope.dataInicial = calendarFactory.getFirstDayOfSpecificMonth(actualDateMoment.month(), actualDateMoment.year());
		$scope.dataFinal = calendarFactory.getLastDayOfSpecificMonth(actualDateMoment.month(), actualDateMoment.year());

		$scope.ok = function() {
			var scope = "2"; // transactions
			var type = "3"; // Export

			var acquirersSearch = [];
			var settlementsSearch = [];

			//Se não tiver registros selecionados, insere os ids de todas as operadoras
			if($scope.acquirersSelected.length == 0){
				angular.forEach($scope.getAcquirers(), function(item){
					acquirersSearch.push(item.id);
				});
			}else{
				angular.forEach($scope.acquirersSelected, function(item){
					acquirersSearch.push(item.id);
				});
			}

			//Se não tiver registros selecionados, insere os ids de todas as lojas
			if($scope.settlementsSelected.length == 0){
				angular.forEach($scope.getSettlements(), function(item){
					settlementsSearch.push(item.id);
				});
			}else{
				angular.forEach($scope.settlementsSelected, function(item){
					settlementsSearch.push(item.id);
				});
			}

			integrationService.checkIntegration(type, $scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal),
					acquirersSearch, settlementsSearch, scope, $rootScope.company, $rootScope.currency).then(function(msg) {

						if(msg != null){
							$scope.alerts =  [ { type: "danger", msg: msg} ];
						}else{
							$scope.alerts =  [];

							window.open($rootScope.baseUrl + 'integration/?type='+ type + '&initialDate='+ $scope.checkDateInitial($scope.dataInicial)  + '&finalDate='+ $scope.checkDateFinal($scope.dataFinal)
									+ '&acquirers=' + acquirersSearch + '&settlements=' + settlementsSearch + '&scope=' + scope + '&companyId=' + $rootScope.company
									+ '&currency=' + $rootScope.currency
									+ '&token=' + $window.sessionStorage.token
									+ '&fromSchema=' + $window.sessionStorage.schemaName);
						}
					});
		};
	};
	/* fim do modal integracao */


	/***************************************************************** Modal de DETALHAMENTO DE VENDAS ***********************************************************/

	$scope.openTransactionsList = function (cardProduct, cardBrand, acquirer) {
		$rootScope._cardProduct = cardProduct;
		$rootScope._cardBrand = cardBrand;
		$rootScope._acquirer = acquirer;
		$rootScope._statusItemAccordionSelected = $scope.statusItensAccordionSelected;
		$rootScope._dateItemAccordionSelected = $scope.dateSelected;
		$rootScope._settlements = $scope.settlementsSearch;
		$location.path('/resumoConciliacao/detalhe');
		/*
			var modalInstance = $modal.open({
				templateUrl: 'listagemVendas.html',
				controller: ModalDetalheVendas,
				resolve: {
					getSettlements: function () {
						return $scope.settlementsSearch;
					},
					getAcquirer: function () {
						return acquirer;
					},
					getCardBrand: function () {
						return cardBrand;
					},
					getCardProduct: function () {
						return cardProduct;
					},
					getStatusItemAccordionSelected: function () {
						return $scope.statusItensAccordionSelected;
					},
					getDateItemAccordionSelected: function () {
						return $scope.dateSelected;
					}
				}
		    });
			modalInstance.result.then(function () {

			}, function() {
				if(resumoConciliacaoService.getConcilied()){
					atualizarAccordion = true;
					getTransactionsResumed($scope.dateSelected);
				}
			});
		 */
	};

	var ModalDetalheVendas = function ($scope, $rootScope, $modalInstance, Restangular, getSettlements, getAcquirer, getCardBrand,
			getCardProduct, getStatusItemAccordionSelected, getDateItemAccordionSelected) {

		var acquirerSelected = getAcquirer;
		var cardBrandSelected = getCardBrand;
		var cardProductSelected = getCardProduct;
		var dateItensAccordion = getDateItemAccordionSelected;
		var settlementsSelected = getSettlements;
		$scope.statusItemAccordionSelected = getStatusItemAccordionSelected;
		resumoConciliacaoService.setConcilied(false);

		$scope.monthNameAbreviation = calendarFactory.getMonthNameAbreviation(dateItensAccordion);
		$scope.dayOfActualDate = calendarFactory.getDayOfMonth(dateItensAccordion);

		$scope.acquirerName = acquirerSelected.name;
		$scope.cardBrandName = cardBrandSelected.name;
		$scope.cardProductName = cardProductSelected.name;

		startModalResumoConciliacaoTour();

		$scope.helpModalConciliacao = function(){
			restartModalResumoConcilicaoTour(userService, $rootScope.user);
		};

		$scope.totalItensPage = "10";

		$scope.order = 1; // asc
		$scope.column = "gross"; // default

		var itensSelected = [];
		$scope.checkAll = false;
		$scope.currentPage = 1;

		var modalUpdated = false;
		var transactionStatus = [];

		loadItens();

		var checkedItem = false;
		var checkedAll = false;

		$scope.button = false;
		$scope.activeButtonConcilied = function() {
			if(checkedAll || checkedItem){
				$scope.buttonConcilied = false;
				$scope.button = true;
			}else{
				$scope.buttonConcilied = true;
				$scope.button = false;
			}
		};

		$scope.checkItem = function(item){
			if(item.checked){
				checkedItem = true;
				itensSelected.push(item);
			}
			else{
				itensSelected.splice(itensSelected.indexOf(item), 1);
				if(itensSelected.length > 0){
					checkedItem = true;
				}else{
					checkedItem = false;
				}

			}
			$scope.activeButtonConcilied();
		};

		$scope.checkAllItensModal = function(checkAll, item) {
			checkedAll = checkAll;
			if(checkAll){
				angular.forEach($scope.itensDetalheVenda, function(item){
					item.checked = true;
					itensSelected.push(item);
				});
			}
			else if(!checkAll){
				angular.forEach($scope.itensDetalheVenda, function(item){
					item.checked = false;
					itensSelected.splice(itensSelected.indexOf(item), 1);
				});
			}
			$scope.activeButtonConcilied();
		};

		$scope.conciliarVendas = function(){

			if(itensSelected.length > 0){
				this.checkAll = false;
				$scope.button = false;
				$scope.buttonConcilied = true;

				resumoConciliacaoService.reconciliateTransactionModal(itensSelected).then(function() {
					loadItens();
					modalUpdated = true;
					resumoConciliacaoService.setConcilied(true);
				});
			}
		};

		$scope.gerarRelatorioModal = function (type) {
			window.open($rootScope.baseUrl + 'reports?report=resumoConciliacaoModal&type=' + type + '&dataSelecionada='+ dateItensAccordion
					+ '&token=' + $window.sessionStorage.token
					+ '&fromSchema=' + $window.sessionStorage.schemaName
					+ '&acquirers=' + acquirerSelected.id + '&settlements=' + settlementsSelected
					+ '&cardBrandId=' + cardBrandSelected.id + '&cardProductId=' + cardProductSelected.id
					+ '&status=' + getStatusItemAccordionSelected
					+ '&currency=' + $rootScope.currency
					+ '&orderColumn=' + $scope.column + '&order=' + $scope.order);
		};

		$scope.orderColumn = function(column) {

			var columns = ["nsu", "authorization", "tid", "cardNumber", "installment", "terminalName", "erpId", "gross"];

			angular.forEach(columns, function(item, index){

				var element = document.getElementById(item);

				if(item == column){
					if($scope.order == 1){
						$scope.order = 2;
						element.src = "app/img/cresc.png";
					}else{
						$scope.order = 1;
						element.src = "app/img/dec.png";
					}
				}else{
					element.src = "app/img/default.png";
				}
			});

			$scope.column = column;
			loadItens();
		};

		$scope.selectAction = function() {
		};

		function loadItens(){
			//Processadas e canceladas
			transactionStatus = [1,2];

			transactionsService.countTotalItens(dateItensAccordion, dateItensAccordion, $scope.statusItemAccordionSelected, transactionStatus, 0, settlementsSelected,
					acquirerSelected.id, cardBrandSelected.id, cardProductSelected.id, 1, $scope.natureza ,$scope.terminalsSearch).then(function(countSum) {

						$scope.countSum = countSum;

						$scope.totalItens = countSum.qtd;
						$scope.maxSize = maxSizePagination(countSum.qtd, $scope.totalItensPage);

						transactionsService.getTransactionsByFiltersOrdened(dateItensAccordion, dateItensAccordion, $scope.statusItemAccordionSelected, transactionStatus, 0, settlementsSelected,
								acquirerSelected.id, cardBrandSelected.id, cardProductSelected.id, 1, $scope.currentPage, $scope.totalItensPage, $scope.column, $scope.order,
								$scope.natureza ,$scope.terminalsSearch).then(function(itensDetalheVenda) {

									$scope.itensDetalheVenda = itensDetalheVenda;
									$scope.totalAmountDetalheVenda = $scope.countSum.totalValue;
								});
					});
		};

		$scope.alterTotalItensPage = function() {
			this.currentPage = $scope.currentPage = 1;
			$scope.totalItensPage = this.totalItensPage;
			loadItens();
		};

		$scope.pageChanged = function() {
			$scope.currentPage = this.currentPage;

			transactionsService.getTransactionsByFiltersOrdened(dateItensAccordion, dateItensAccordion, $scope.statusItemAccordionSelected, transactionStatus, 0, settlementsSelected,
					acquirerSelected.id, cardBrandSelected.id, cardProductSelected.id, 1, $scope.currentPage, $scope.totalItensPage, $scope.column, $scope.order).then(function(itensDetalheVenda) {

						$scope.itensDetalheVenda = itensDetalheVenda;

						$scope.sumTotalAmountDetalheVenda(itensDetalheVenda);
					});
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		$scope.comprovanteVenda = function(item) {
			var modalInstance = $modal.open({
				templateUrl: 'app/views/resumoConciliacao/comprovanteVenda.html',
				controller: ModalComprovanteVendas,
				size:'sm',
				resolve: {
					item: function(){
						return item;
					}
				}
			});
		};

		var ModalComprovanteVendas = function ($scope, $modalInstance, Restangular, item) {
			$scope.item = item;

			installmentsService.getByTransactions(item.id, 0, false).then(function(it) {
				$scope.installments = it;
			});

			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};

			$scope.imprimir = function () {
				window.print();
			};

		};
	};

	/***************************************************************** Modal de UPLOAD DE ARQUIVOS ***********************************************************/
	$scope.botaoModal = function () {
		var modalInstance = $modal.open({
			templateUrl: 'upload.html',
			controller: UploadCtrl,
			resolve: {
				items: function () {
					return $scope.items;
				}
			}
		});
	};

	var UploadCtrl = function ($scope, $rootScope, $http, $modalInstance, $fileUploader, Restangular, calendarFactory, integrationService) {

		$scope.integrator = null;

		$scope.checkIntegration = function() {
			var scope = 2; // import
			var type = 2; //transactions

			integrationService.checkIntegrationConfigured(type, scope, $rootScope.company).then(function(integrator) {
				if(integrator != null){
					$scope.integrator = integrator;
				}else{
					$scope.alerts =  [ { type: "danger", msg: 'Não há integrador configurado para esta empresa. Favor contactar o suporte.'} ];
				}

				// create a uploader with options
				var uploader = $scope.uploader = $fileUploader.create({
					scope: $scope,                          // to automatically update the html. Default: $rootScope
					url: $rootScope.baseUrl + 'integration?companyId=' + $rootScope.company,
					formData: [{ key: 'value'}],
					headers: {FromSchema: $window.sessionStorage.schemaName, Authorization: $window.sessionStorage.token}
				});

			});
		};

		$scope.checkIntegration();

		$scope.finish = false;

		$scope.ok = function () {
			$modalInstance.close($scope.selected.item);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		$scope.todayDate = calendarFactory.getActualDateUploadModal();

		$scope.currentPage = 1;
		$scope.totalItensPage = 10;

		$scope.alterTotalItensPage = function() {
			$scope.pageChanged();
		};

		$scope.pageChanged = function() {

			if($scope.totalItens < $scope.totalItensPage){
				$scope.totalItensPage = $scope.totalItens;
			}

			transactionsService.getFiles($scope.currentPage, $scope.totalItensPage).then(function(files) {
				$scope.files = files;
			});
		};

		transactionsService.getCountFiles().then(function(total) {
			$scope.totalItens = total;
			$scope.maxSize = maxSizePagination(total, $scope.totalItensPage);

			$scope.pageChanged();
		});
	};

	/******************************************************************* Funcoes de CLIQUE e FILTROS *************************************************************/

	$scope.returnToActualMonth = function(){
		loadDayResume(calendarFactory.getYesterdayDate());
		$scope.loadParamsByFilter();
		atualizarAccordion = true;
		getTransactionsResumed(calendarFactory.getYesterdayDate());
		//getTransactionConciliation();
	};

	$scope.filterByMonth = function(month, year) {
		atualizarAccordion = true;
		getTransactionsResumed(calendarFactory.getFirstDayOfSpecificMonth(month, year));
	};

	$scope.updateItensAccordion = function(status){
		$scope.statusItensAccordionSelected = status;
		//getItensAccordion($scope.dateSelected, status);
		getTransactionConciliation();
	};

	$scope.changeDay = function(day){
		loadDays(day);
		getTransactionConciliation();
	};

	function loadDays(day) {

		$scope.dayOfActualDate = calendarFactory.getDayOfMonth(calendarFactory.formatDate(day.date, true));
		$scope.dateSelected = calendarFactory.formatDate(day.date, true);

		checkStatusItemAccordion(day);

		if($scope.isResumoMesActive){
			$scope.isResumoMesActive = false;
			$scope.isConciliacaoDiaActive = true;
		}

		angular.forEach($scope.itens, function(dayCalendar, index){
			dayCalendar.isActive = false;

			if(calendarFactory.formatDate(dayCalendar.date, true) == $scope.dateSelected){
				dayCalendar.isActive = true;
			}
		});

		updateValuesAccordion();
	};

	/******************************************************************* Relatorios *******************************************************************/

	//Relatorios do Resumo do dia

	$scope.gerarRelatorio = function (type) {
		window.open($rootScope.baseUrl + 'reports?report=resumoConciliacao&type=' + type + '&dataSelecionada='+ $scope.dateSelected + '&token=' + $window.sessionStorage.token
				+ '&fromSchema=' + $window.sessionStorage.schemaName
				+ '&acquirers=' + $scope.acquirersSearch + '&settlements=' + $scope.settlementsSearch
				+ '&brands=' + $scope.brandsSearch + '&products=' + $scope.productsSearch + '&terminals=' + $scope.terminalsSearch
				+ '&tipoTerminal=' + $scope.tipoTerminal
				+ '&additionalInformation=' + $scope.additionalInformations
				+ '&natureza=' + $scope.natureza
				+ '&currency=' + $rootScope.currency);
	};

	loadDayResume($scope.dateSelected);

	$scope.filterAdvancedVendas = function() {
		$scope.filterClick = true;
		atualizarAccordion = true;
		getTransactionsResumed($scope.dateSelected);
	};

	$scope.clearAdvancedFilterVendas = function() {
		$scope.loadParamsByFilter();
		loadDayResume($scope.dateSelected);
	};


	/************************************************************************************************************************************/
	/************************************************************ V1 TRANSACTION CONCILIATION ********************************************/

	function search(){
		getTransactionConciliation();
	}

	function getTransactionConciliation(){
		$scope.acquirerData = [];
		$scope.cardProductData = [];
		$scope.noItensMsg = false;

		var dateSelected = $scope.dateSelected || calendarFactory.getYesterdayDate();

		var currency = $rootScope.currency;
		var shopIds = $scope.settlementsSelected;
		var cardProductIds = $scope.productsSelected;
		var startDate = calendarFactory.formatDateForService(dateSelected);
		var endDate = calendarFactory.formatDateForService(dateSelected);

		var acquirer = 1;

		$scope.acquirerData = items[0];

		resumoConciliacaoService.getTransactionSummary({
			currency: 'BRL',
			startDate: calendarFactory.formatDateForService(dateSelected),
			endDate: calendarFactory.formatDateForService(dateSelected),
			acquirer: acquirer,
			shopIds: shopIds,
			conciliationStatus: $scope.statusItensAccordionSelected,
			cardProductIds : cardProductIds,
			groupBy: ['CARD_PRODUCT']
		}).then(function(item){
			if(items[0] !== undefined) {
				$scope.noItensMsg = false;
				$scope.cardProductData = item;
			}
		});
	}




/************* POPULA DADOS DO CALENDÁRIO ************/
function setTransactionConciliationCalendar(){

	var dateSelected = $scope.actualDateSelected;
	var currency = $rootScope.currency;
	var shopIds = $scope.settlementsSelected;
	var cardProductIds = $scope.productsSelected;
	var startDate = calendarFactory.formatDateForService(dateSelected);
	var endDate = calendarFactory.formatDateForService(dateSelected);

	resumoConciliacaoService.listTransactionConciliationCalendarMonth({
		currency: 'BRL',
		startDate: null,
		endDate: null,
		cardProductIds: $scope.productsSelected,
		shopIds: $scope.settlementsSelected,
		status: ['PROCESSED'],
		groupBy: ['MONTH']
	}).then(function(item){

		if(items[0] !== undefined){

			resumoConciliacaoService.listTransactionConciliationCalendarMonth({
				currency: $rootScope.currency,
				startDate: null,
				endDate: null,
				cardProductIds: $scope.productsSelected,
				shopIds: $scope.settlementsSelected,
				status: ['PROCESSED'],
				groupBy: ['DAY']
			})
		}
	});
}


function concilieTransaction(){

}

/****************************     LIST TRANSACTIONS     *************************************/

function listTransactions(pageNumber){

	transactionFilter = new TransactionFilter();

	transactionFilter.currency = $rootScope.currency;
	transactionFilter.startDate = null;
	transactionFilter.endDate = null;
	transactionFilter.acquirers = [];
	transactionFilter.cardProductIds = [];
	transactionFilter.conciliationStatus = [];
	transactionFilter.pageNumber = pageNumber;
	transactionFilter.maxPageSize = 50;

	$scope.transactionConciliations = transactionService.listTransaction(transactionFilter);
}


function getTransaction(id){

	$scope.transactionConciliationSlip = transactionService.getTransaction(id);
}

function concilieTransaction(){

	var transactionFilter = new TransactionFilter();
	transactionFilter.currency = []
	transactionFilter.startDate = []
	transactionFilter.endDate = []
	transactionFilter.acquirers = []
	transactionFilter.types = []
	transactionFilter.shopIds = []
	transactionFilter.conciliationStatus = [];
	transactionFilter.status = ['PROCESSED'];
}

/************************************* FILTER ***********************************************/

function TransactionFilter(){

	this.currency; // BRL
	this.startDate; // yyyyMMdd
	this.endDate; // yyyyMMdd
	this.acquirers; // ARRAY {REDE,CIELO}
	this.shopIds; // ARRAY {1,2,3}
	this.cardProductIds; // ARRAY {1,2,3}
	this.conciliationStatus; // ARRAY{ TO_CONCILIE, CONCILIED, UNPROCESSED}
	this.status; // ARRAY{ PROCESSED, CANCELLED , ADJUSTED}
	this.types; // ARRAY{CREDIT, DEBIT}
	this.modalitys; // 	ARRAY{ IN_CASH, PRE_DATED, INSTALLMENT, BILL_PAYMENT}
	this.adjustTypes; // ARRAY{ ADJUST, CANCELLATION, CHARGEBACK}
	this.nsu; // STRING
	this.authorization; // STRING
	this.gross; // DOUBLE

	this.pageNumber // 1;
	this.maxPageSize // 50;
}


function TransactionConciliationFilter(){

	this.currency; // BRL
	this.startDate; // yyyyMMdd
	this.endDate; // yyyyMMdd
	this.acquirers; // ARRAY {REDE,CIELO}
	this.shopIds; // ARRAY {1,2,3}
	this.cardProductIds; // ARRAY {1,2,3}
	this.status; // ARRAY {EXPECTED , RECEIVED , FORETHOUGHT}
	this.types; // ARRAY {CREDIT, DEBIT}
	this.modalitys; // 	ARRAY{ IN_CASH, PRE_DATED, INSTALLMENT, BILL_PAYMENT}
	this.adjustTypes; // ARRAY { ADJUST, CANCELLATION, CHARGEBACK}
	this.groupBy; // ARRAY { DAY, MONTH, ACQUIRER, SHOP, CARD_PRODUCT}

	this.pageNumber; // 1
	this.maxPageSize; // 50

}

function TransactionSummaryFilter(){

	var currency; // BRL
	var startDate; // yyyyMMdd
	var endDate; // yyyyMMdd
	var acquirers; // ARRAY{REDE,CIELO}
	var shopIds; // ARRAY {1,2,3}
	var cardProductIds; // ARRAY {1,2,3}
	var conciliationStatus; // ARRAY {TO_CONCILIE, CONCILIED, UNPROCESSED}
	var status; // ARRAY { PROCESSED, CANCELLED, ADJUSTED}
	var types; // ARRAY {CREDIT,DEBIT}
	var modalitys; // ARRAY { IN_CASH, PRE_DATED, INSTALLMENT, BILL_PAYMENT}
	var adjustType; //  ARRAY {AJUST, CANCELLATION, CHARGEBACK}

	var pageNumber; // 1
	var maxPageSize; // 50
}

/********************** ENTITY ************************/
function TransactionConciliation(){

	this.date;
	this.acquirer = {
			id: false,
			name: false
	};

	this.cardProduct = {
			id: false,
			name: false
	};

	this.transctionToConcilieQuantity;
	this.transctionToConcilieAmount;
	this.transctionConciliedQuantity;
	this.transctionConciliedAmount;
	this.transctionUnprocessedQuantity;
	this.transctionUnprocessedAmount;
}
/****************************************************/

});
