angular.module('KaplenWeb.gestaoController',['ui.bootstrap'])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/gestao', {templateUrl: 'app/views/gestao.html', controller: 'gestaoController'});
}])

.controller('gestaoController', function(menuFactory, $rootScope, $scope, $modal, calendarFactory, transactionsService,
		installmentsService, cartaCancelamentoService, kaplenAdminService, $window, userService, cacheService, advancedFilterService){

	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.loadParansByFilter();

	menuFactory.setActiveGestao();

	startGestaoTour($rootScope.user);

	if($rootScope.user.firstAccess){
		restartGestaoTour(userService);
	}

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

	$scope.dateSelected = calendarFactory.getYesterdayDate();
	$scope.actualDateSelected = calendarFactory.getNameOfMonthAndYear($scope.dateSelected);
	$scope.monthNameAbreviation = calendarFactory.getMonthNameAbreviation($scope.dateSelected);
	$scope.dayOfActualDate = calendarFactory.getDayOfMonth($scope.dateSelected);
	$scope.yearSelected = parseInt(calendarFactory.getYear($scope.dateSelected));

	var company = '';
	if (angular.isDefined($rootScope.company)) {
		company = $rootScope.company;
	}

	$scope.tabs = [{},{}];

	startGestao();

	function startGestao(){
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
								dateCancellation:new Date(moment(initialDayOfMonth + "/" + (momentjs.month()+1) + "/" + momentjs.year(), calendarFactory.getFormat())),
								quantityCancellations: 0,
								quantityChargeback: 0,
								totalAmountCancellations: 0,
								totalAmountChargeback: 0,
								isActive: isActive
							 });
		}

		$scope.totalCopyRequest = 0;
		$scope.sumOfQuantityCancellations = 0;
		$scope.sumOfTotalAmountCancellations = 0;
		$scope.sumOfQuantityChargebacks = 0;
		$scope.sumOfTotalAmountChargebacks = 0;

		var data = [];
		data.push(0);
		$scope.chartCancelations =  pieChartGestao(data);
	};

	$scope.changeYear = function(year) {
		$scope.dateSelected = calendarFactory.getSpecificDateOfYear(year);
		$scope.yearSelected = parseInt(calendarFactory.getYear($scope.dateSelected));

		//Carrega lista de meses no slider
		transactionsService.getCancelationsMonthsToSlider($scope.dateSelected).then(function(it) {
			$scope.months = it;

			angular.forEach(it, function(month, index){
				checkOneItemStatusDay(month);
			});
		});

		getCancelationResumed($scope.dateSelected);
	};

	//********* Loading Informations *********//

		//Carrega lista de meses no slider
		transactionsService.getCancelationsMonthsToSlider($scope.dateSelected).then(function(it) {
			$scope.months = it;

			angular.forEach(it, function(month, index){
				checkOneItemStatusDay(month);
			});
		});

		getCancelationResumed($scope.dateSelected);

	//***************************************//

	$scope.returnToActualMonth = function(){
		getCancelationResumed(calendarFactory.getYesterdayDate());
	};

	$scope.filterByMonth = function(month, year) {
		getCancelationResumed(calendarFactory.getFirstDayOfSpecificMonth(month, year));
	};

	$scope.updateItensAccordion = function(status){
		$scope.statusItensAccordionSelected = status;
		getItensAccordion($scope.dateItensAccordion, status);
	};

	$scope.loadingGestaoDia = function(){
		getItensAccordion($scope.dateSelected, $scope.statusItensAccordionSelected);
		updateValuesForTotals($scope.itens, $scope.dateSelected);
	};

	$scope.loadGestaoDiaForDaySelected = function(dateSelected, status){
		$scope.dayOfActualDate = calendarFactory.getDayOfMonth(calendarFactory.formatDate(dateSelected, true));
		$scope.dateSelected = calendarFactory.formatDate(dateSelected, true);

		$scope.statusItensAccordionSelected = status;

		getItensAccordion(calendarFactory.formatDate(dateSelected, true), $scope.statusItensAccordionSelected);
		updateValuesForTotals($scope.itens, calendarFactory.formatDate(dateSelected, true));
	};

	$scope.changeDay = function(dateSelected){
		$scope.dateSelected = calendarFactory.formatDate(dateSelected, true);
		$scope.dayOfActualDate = calendarFactory.getDayOfMonth(calendarFactory.formatDate(dateSelected, true));

		angular.forEach($scope.itens, function(dayCalendar, index){
			dayCalendar.isActive = false;

			if(calendarFactory.formatDate(dayCalendar.dateCancellation, true) == dateSelected){
				dayCalendar.isActive = true;
			}
		});

		getItensAccordion(calendarFactory.formatDate(dateSelected, true), $scope.statusItensAccordionSelected);
		updateValuesForTotals($scope.itens, calendarFactory.formatDate(dateSelected, true));
	};

	function checkOneItemStatusDay(item){
		var count = 0;

		if(item.toCancelations){
			count++;
		}

		if(item.toChargeback){
			count++;
		}

		if(count == 1){
			item.oneItem = true;
		}else{
			item.oneItem = false;
		}

	};

	function getCancelationResumed(dateSelected){

		transactionsService.getCancelationResumed(dateSelected, $scope.settlementsSearch, $scope.acquirersSearch,
				$scope.brandsSearch, $scope.productsSearch, $scope.terminalsSearch, $scope.tipoTerminal).then(function(itens) {

			$scope.dateSelected = calendarFactory.formatDate(dateSelected, false);

			//Atualiza a data atual para a selecionada ou a de inicio
			$scope.actualDateSelected = calendarFactory.getNameOfMonthAndYear(dateSelected);

			//Atualiza no escopo as datas selecionadas
			$scope.monthNameAbreviation = calendarFactory.getMonthNameAbreviation(dateSelected);

			//Atualiza a area de conciliação do dia
			$scope.statusItensAccordionSelected = 1;

			$scope.dayOfActualDate = calendarFactory.getDayOfMonth(dateSelected);

			$scope.itens = itens;

			$scope.sumOfQuantityCancellations = 0;
			$scope.sumOfTotalAmountCancellations = 0;
			$scope.sumOfQuantityChargebacks = 0;
			$scope.sumOfTotalAmountChargebacks = 0;

			angular.forEach(itens, function(dayCalendar, index){
				checkOneItemStatusDay(dayCalendar);
				dayCalendar.isActive = false;
				dayCalendar.isActiveButton = false;

				if(calendarFactory.formatDate(dayCalendar.dateCancellation, true) == dateSelected){
					dayCalendar.isActive = true;
				}
				if(dayCalendar.toCancelations || dayCalendar.toChargeback){
					dayCalendar.isActiveButton = true;
				}

				//Somatorios para TOTAIS
				$scope.sumOfQuantityCancellations += dayCalendar.quantityCancellations;
				$scope.sumOfTotalAmountCancellations += dayCalendar.totalAmountCancellations;
				$scope.sumOfQuantityChargebacks += dayCalendar.quantityChargeback;
				$scope.sumOfTotalAmountChargebacks += dayCalendar.totalAmountChargeback;
			});

			getItensAccordion($scope.dateSelected, $scope.statusItensAccordionSelected);
			updateValuesForTotals($scope.itens, $scope.dateSelected);

			cartaCancelamentoService.getCountCopyRequests(dateSelected).then(function(value) {
				$scope.totalCopyRequest = value;
			});
		});
	};

	function updateValuesForTotals(transactionsList, dateSelected){

		var cancelation = [];
		var chargeBack = [];
		cancelation.push(0);
		chargeBack.push(0);

		$scope.totalCancellationForDay = 0;
		$scope.totalChargebackForDay = 0;

		angular.forEach(transactionsList, function(cancellationValuesDTO, index){
			cancellationValuesDTO.isActive = false;

			if(calendarFactory.formatDate(cancellationValuesDTO.dateCancellation, true) == dateSelected){
				cancellationValuesDTO.isActive = true;
				$scope.totalCancellationForDay = cancellationValuesDTO.quantityCancellations;
				$scope.totalChargebackForDay = cancellationValuesDTO.quantityChargeback;
			}

			cancelation.push(cancellationValuesDTO.totalAmountCancellations);
			chargeBack.push(cancellationValuesDTO.totalAmountChargeback);
		});

		var dataSource = [{name:'Canceladas', data:cancelation},{name:'Chargeback', data:chargeBack}];
		$scope.chartCancelations =  pieChartGestao(dataSource);
	};

	function getItensAccordion(dateSelected, statusCancelamento){
		$scope.itensAccordion = [];
		$scope.itensAccordion.cardBrandDTOs = [];
		$scope.itensAccordion.cardBrandDTOs.cardProductDTOs = [];
		transactionsService.getAcquirerByCancelation(dateSelected, statusCancelamento, false, $scope.settlementsSearch, $scope.acquirersSearch,
				$scope.brandsSearch, $scope.productsSearch, $scope.terminalsSearch, $scope.tipoTerminal).then(function(itens) {

			if(itens.length == 0){
				$scope.noItensMsg = true;
			}else{
				$scope.noItensMsg = false;
			}

			//Atualiza Itens do accordion
			$scope.itensAccordion = itens;
			$scope.dateItensAccordion = dateSelected;

			//Atualiza status para o accordion
			if(statusCancelamento == 1){
				$scope.statusCancelamentoName = "Canceladas";
				$scope.statusCancelamento = true;
			}else if(statusCancelamento == 2){
				$scope.statusCancelamentoName = "Chargeback";
				$scope.statusCancelamento = false;
			}

		});
	};


	// modal
	$scope.botaoModal = function () {

	    var modalInstance = $modal.open({
	      templateUrl: 'cartaCancelamento.html',
	      controller: ModalInstanceCtrl,
	      resolve: {
	    	  getDate: function () {
					return $scope.dateSelected;
				}
	      }
	    });

	  };
	  var ModalInstanceCtrl = function ($scope, $modalInstance, getDate) {



		  $scope.ok = function () {
			  $modalInstance.close();
		  };

		  $scope.cancel = function () {
			  $modalInstance.dismiss('cancel');
		  };
	  };

	  $scope.openTransactionsList = function (cardProduct, cardBrand, acquirer) {
		  var modalInstance = $modal.open({
				templateUrl: 'listagemVendas.html',
				controller: TransactionsListCtrl,
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
						return $scope.dateItensAccordion;
					},
					getCancelationKind: function () {
						return  $scope.statusItensAccordionSelected;
					}
				}
		    });
	  };

	  var TransactionsListCtrl = function ($rootScope, $scope, $http, $modalInstance, Restangular, getAcquirer, getSettlements,
			  	getCardBrand, getCardProduct, getStatusItemAccordionSelected, getDateItemAccordionSelected, getCancelationKind) {

			var acquirerSelected = getAcquirer;
			var cardBrandSelected = getCardBrand;
			var cardProductSelected = getCardProduct;
			var settlements = getSettlements;
			var statusItemAccordionSelected = getStatusItemAccordionSelected;
			var dateItensAccordion = getDateItemAccordionSelected;

			$scope.monthNameAbreviation = calendarFactory.getMonthNameAbreviation(dateItensAccordion);
			$scope.dayOfActualDate = calendarFactory.getDayOfMonth(dateItensAccordion);

			$scope.acquirerName = acquirerSelected.name;
			$scope.cardBrandName = cardBrandSelected.name;
			$scope.cardProductName = cardProductSelected.name;

			$scope.currentPage = 1;
			$scope.totalItensPage = "10";
			$scope.order = 1;
			$scope.column = "date";

			function loadItens() {
				transactionsService.countTotalItens(dateItensAccordion, dateItensAccordion, 0, 2, getCancelationKind, settlements, acquirerSelected.id, cardBrandSelected.id,
						cardProductSelected.id, 2).then(function(totalItens) {

					$scope.totalItens = totalItens;
					$scope.maxSize = maxSizePagination(totalItens, $scope.totalItensPage);

					transactionsService.getTransactionsByFiltersOrdened(dateItensAccordion, dateItensAccordion, 0, 2, getCancelationKind, settlements, acquirerSelected.id,
								cardBrandSelected.id, cardProductSelected.id, 2, $scope.currentPage, $scope.totalItensPage, $scope.column, $scope.order).then(function(itensDetalheVenda) {

							$scope.itensDetalheVenda = itensDetalheVenda;
					});
				});
			};

			$scope.orderColumn = function(column) {
	        	var columns = ["date", "cancelDate", "nsu", "authorization", "tid", "cardNumber", "installment", "erpId", "gross", "canceledAmount"];

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

			$scope.gerarPDF = function () {
				window.open($rootScope.baseUrl + 'reports?report=gestaoModal&type=PDF&dataSelecionada='+ dateItensAccordion + '&token='
						+ $window.sessionStorage.token + '&status=2' + '&acquirers=' + acquirerSelected.id + '&settlements=' + settlements
						+ '&cardBrandId=' + cardBrandSelected.id + '&cardProductId=' + cardProductSelected.id + '&orderColumn=' + $scope.column + '&order=' + $scope.order
						+ '&fromSchema=' + $window.sessionStorage.schemaName + '&currency=' + $rootScope.currency + '&cancellationKind=' + getCancelationKind);
			};

			$scope.gerarXLS = function () {
				window.open($rootScope.baseUrl + 'reports?report=gestaoModal&type=XLS&dataSelecionada='+ dateItensAccordion + '&token='
						+ $window.sessionStorage.token + '&status=2' + '&acquirers=' + acquirerSelected.id + '&settlements=' + settlements
						+ '&cardBrandId=' + cardBrandSelected.id + '&cardProductId=' + cardProductSelected.id + '&orderColumn=' + $scope.column + '&order=' + $scope.order
						+ '&fromSchema=' + $window.sessionStorage.schemaName + '&currency=' + $rootScope.currency + '&cancellationKind=' + getCancelationKind);
			};

			$scope.gerarCSV= function () {
				window.open($rootScope.baseUrl + 'reports?report=gestaoModal&type=CSV&dataSelecionada='+ dateItensAccordion + '&token='
						+ $window.sessionStorage.token + '&status=2' + '&acquirers=' + acquirerSelected.id + '&settlements=' + settlements
						+ '&cardBrandId=' + cardBrandSelected.id + '&cardProductId=' + cardProductSelected.id + '&orderColumn=' + $scope.column + '&order=' + $scope.order
						+ '&fromSchema=' + $window.sessionStorage.schemaName + '&currency=' + $rootScope.currency + '&cancellationKind=' + getCancelationKind);
			};

			$scope.alterTotalItensPage = function() {
				this.currentPage = $scope.currentPage = 1;
				$scope.totalItensPage = this.totalItensPage;
				loadItens();
			};

			loadItens($scope.column, $scope.order);

			$scope.pageChanged = function() {
				$scope.currentPage = this.currentPage;

				transactionsService.getTransactionsByFiltersOrdened(dateItensAccordion, dateItensAccordion, 0, 2, getCancelationKind, settlements, acquirerSelected.id,
						cardBrandSelected.id, cardProductSelected.id, 2, $scope.currentPage, $scope.totalItensPage, $scope.column, $scope.order).then(function(itensDetalheVenda) {
					$scope.itensDetalheVenda = itensDetalheVenda;
				});
			};

			$scope.ok = function () {
				$modalInstance.close($scope.selected.item);
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

		//Relatorios do Resumo do dia

		$scope.gerarPDF = function () {
		    window.open($rootScope.baseUrl + 'reports?report=gestao&type=PDF&dataSelecionada='+ $scope.dateSelected + '&token=' + $window.sessionStorage.token
		    			+ '&fromSchema=' + $window.sessionStorage.schemaName
		    			+ '&acquirers=' + $scope.acquirersSearch + '&brands=' + $scope.brandsSearch
		    			+ '&products=' + $scope.productsSearch + '&settlements=' + $scope.settlementsSearch
		    			+ '&terminals=' + $scope.terminalsSearch
		    			+ '&tipoTerminal=' + $scope.tipoTerminal
		    			+ '&currency=' + $rootScope.currency);
		};

		$scope.gerarXLS = function () {
			window.open($rootScope.baseUrl + 'reports?report=gestao&type=XLS&dataSelecionada='+ $scope.dateSelected + '&token=' + $window.sessionStorage.token
						+ '&fromSchema=' + $window.sessionStorage.schemaName
						+ '&acquirers=' + $scope.acquirersSearch + '&brands=' + $scope.brandsSearch
		    			+ '&products=' + $scope.productsSearch + '&settlements=' + $scope.settlementsSearch
		    			+ '&terminals=' + $scope.terminalsSearch
		    			+ '&tipoTerminal=' + $scope.tipoTerminal
		    			+ '&currency=' + $rootScope.currency);
		};

		$scope.filterAdvancedGestao = function() {
			getCancelationResumed($scope.dateSelected);
		};

		$scope.clearAdvancedFilterGestao = function() {
			$scope.loadParansByFilter();
		};

});
