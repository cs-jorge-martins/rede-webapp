angular.module('KaplenWeb.movementsModule',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/receipts', {templateUrl: 'app/views/financas.html', controller: 'movementsController'});
}])

.controller('movementsController', function(menuFactory, $modal, $rootScope, $scope, calendarFactory, $location, cacheService,
		installmentsService, movementsService, transactionsService, kaplenAdminService, $window, userService, $timeout, integrationService,
		advancedFilterService, calendarService, FinancialService, MovementSummaryService){

	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.loadParamsByFilter();

	menuFactory.setActiveMovements();

	startFinanceiroTour($rootScope.user);

	if($rootScope.user.firstAccess){
		restartFinanceiroTour(userService);
	}

	$scope.helpAnalitico = function(){
		startFinanceiroAnaliticoTour();
		restartFinanceiroAnaliticoTour(userService);
	};

	$scope.getAcquirersList = function(account){
		var validate = account.isOpen;
		if(!validate){
			account.isOpen = true;
			movementsService.getValuesAcquirerByDay($scope.dateSelected,  account.accountId, $scope.acquirersSearch, $scope.brandsSearch,
					$scope.productsSearch, $scope.settlementsSearch, $scope.accountsSearch).then(function(itens) {
						itens = itens.data;
						account.acquirersList = itens;
			});
		}
	};

	/* fim do modal */
	$scope.getBrandList = function(accountId, acquirer){
		var validate = acquirer.isOpen;
		if(!validate){
			acquirer.isOpen = true;
			movementsService.getValuesBrandsByDay($scope.dateSelected, accountId, acquirer.acquirerId,
					$scope.brandsSearch, $scope.productsSearch,	$scope.settlementsSearch, $scope.accountsSearch).then(function(itens) {
						itens = itens.data;
						acquirer.cardBrandMovementsList = itens;

						angular.forEach(acquirer.cardBrandMovementsList, function(brand, index){
							brand.cardProductMovementsList = [{}];
						});
			});
		}
	};

	$scope.getProductList = function(accountId, acquirerId, brand){
		var validate = brand.isOpen;
		if(!validate){
			brand.isOpen = true;
			movementsService.getValuesProductsByDay($scope.dateSelected, accountId, acquirerId, brand.cardBrandId,
					$scope.productsSearch, $scope.settlementsSearch, $scope.accountsSearch).then(function(itens) {
						itens = itens.data;
						 brand.cardProductMovementsList = itens;
			});
		}
	};

	$scope.changeYear = function(year) {
		$scope.dateSelected = calendarFactory.addYearsToDate($scope.dateSelected, year)
		$scope.yearSelected = parseInt(calendarFactory.getYear($scope.dateSelected));

		//Carrega lista de meses no slider
		movementsService.getMonthsToSlider($scope.dateSelected).then(function(itens) {
			itens = itens.data;
			$scope.months = itens;
		});

		//getPeriod($scope.dateSelected);
		this.getFinancials();
	};

	$scope.taxes = [];
	$scope.taxesTotal = 0;
	$scope.accountsSelect = {
		selected: null,
		items: []
	};

	var company = '';
	if (angular.isDefined($rootScope.company)) {
		company = $rootScope.company;
	}

	startFinancas();

	function startFinancas(){

		getCachedData();

		$scope.actualDateSelected = calendarFactory.getNameOfMonthAndYear($scope.dateSelected);
		$scope.monthNameAbreviation = calendarFactory.getMonthNameAbreviation($scope.dateSelected);
		$scope.dayOfActualDate = calendarFactory.getDayOfMonth($scope.dateSelected);
		$scope.yearSelected = parseInt(calendarFactory.getYear($scope.dateSelected));
		$scope.monthSelected = calendarFactory.getNameOfMonth($scope.dateSelected);

		var momentjs = moment();

		var months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
		var selectedMonth = calendarFactory.getMonthNumberOfDate($scope.dateSelected);

		$scope.months = [];

		for(var i = 0; i < 12; i++){
			if(selectedMonth == (i + 1)){
				$scope.months.push({month: months[i], active: true});
			}else{
				$scope.months.push({month: months[i], active: false});
			}
		}

		var initialDayOfMonth = calendarFactory.getDayOfMonth(calendarFactory.getFirstDayOfMonth());
		var lastDayOfMonth = calendarFactory.getDayOfMonth(calendarFactory.getLastDayOfMonth());

		$scope.itens = [];

		var isActive = false;

		for(initialDayOfMonth; initialDayOfMonth <= 31; initialDayOfMonth++){

			if(initialDayOfMonth == calendarFactory.getDayOfMonth($scope.dateSelected)){
				isActive = true;
			}else{
				isActive = false;
			}
			$scope.itens.push({
				dateMovements:new Date(moment(initialDayOfMonth + "/" + (momentjs.month()+1) + "/" + momentjs.year(), calendarFactory.getFormat())),
				day: initialDayOfMonth,
				totalAmountExpected: 0,
				totalAmountPayed: 0,
				totalAmountBank: 0,
				isActive: isActive,
				isActiveButton: true,
				show: true
			 });
		}

		$scope.sumOfExpected = 0;
		$scope.sumOfPayed = 0;
		$scope.sumOfBank = 0;

		getCalendarDays($scope.dateSelected);
		getAccounts();

		$scope.getFinancials = getFinancials;
		$scope.search = search;
		$scope.clearFilter = clearFilter;
	};

	/*********** LOADING INFORMATIONS ***********/

		//Carrega lista de meses no slider
		/*
		movementsService.getMonthsToSlider($scope.dateSelected).then(function(itens) {
			$scope.months = itens.data;
		});

		getPeriod($scope.dateSelected);
		*/
		$scope.checkAllItensAcquirers = function(){
			if($scope.checkAllAcquirers){
				$scope.checkAllAcquirers = false;

				angular.forEach($scope.acquirers, function(item, index){
					item.check = false;
				});
			}else{
				$scope.checkAllAcquirers = true;

				angular.forEach($scope.acquirers, function(item, index){
					item.check = true;
				});
			}
		};

		$scope.checkAllItensSettlements = function(){
			if($scope.checkAllSettlements){
				$scope.checkAllSettlements = false;

				angular.forEach($scope.settlements, function(item, index){
					item.check = false;
				});
			}else{
				$scope.checkAllSettlements = true;

				angular.forEach($scope.settlements, function(item, index){
					item.check = true;
				});
			}
		};

	/*****************************************************************************************************/

	$scope.tabs = [{},{}];

	$scope.loadingValoresDia = function(){
		//getValuesByDay($scope.dateSelected);
	};

	$scope.loadValoresDiaForDaySelected = function(dateSelected){
		$scope.dayOfActualDate = calendarFactory.getDayOfMonth(calendarFactory.formatDate(dateSelected, true));
		$scope.dateSelected = calendarFactory.formatDate(dateSelected, true);

		//getValuesByDay($scope.dateSelected);

		angular.forEach($scope.itens, function(item, index){
			item.isActive = false;
			if(calendarFactory.formatDate(item.dateMovements, true) == calendarFactory.formatDate(dateSelected, true)){
				item.isActive = true;
			}
		});
	};

	function getPeriod(dateSelected){
		$scope.sumOfExpected = 0;
		$scope.sumOfPayed = 0;
		$scope.sumOfBank = 0;
		$scope.itens = [];

		movementsService.getPeriod(dateSelected, $scope.settlementsSearch, $scope.acquirersSearch, $scope.brandsSearch, $scope.productsSearch, $scope.accountsSearch).then(function(itens) {
			$scope.itens = itens.data;

			angular.forEach(itens, function(dayCalendar, index){
				dayCalendar.isActive = false;
				dayCalendar.isActiveButton = true;

				if(calendarFactory.formatDate(dayCalendar.dateMovements, true) == dateSelected){
					dayCalendar.isActive = true;
				}
				if(dayCalendar.totalAmountExpected != 0 || dayCalendar.totalAmountPayed != 0){
					dayCalendar.isActiveButton = false;
				}

				//Somatorios para TOTAIS
				$scope.sumOfExpected += dayCalendar.totalAmountExpected;
				$scope.sumOfPayed += dayCalendar.totalAmountPayed;
				$scope.sumOfBank += dayCalendar.totalAmountBank;
			});

			$scope.dayOfActualDate = calendarFactory.getDayOfMonth(dateSelected);

			//Atualiza a data atual para a selecionada ou a de inicio
			$scope.actualDateSelected = calendarFactory.getNameOfMonthAndYear(dateSelected);

			//Atualiza no escopo as datas selecionadas
			$scope.monthNameAbreviation = calendarFactory.getMonthNameAbreviation(dateSelected);

			$scope.dateSelected = calendarFactory.formatDate(dateSelected, false);
		});
	};

	function getValuesByDay(dateSelected){
		$scope.itensByAccount = [];
		movementsService.getValuesByDay(dateSelected, $scope.settlementsSearch, $scope.acquirersSearch,
				$scope.brandsSearch, $scope.productsSearch, $scope.accountsSearch).then(function(itens){
			itens = itens.data;
			if(itens.length == 0){
				$scope.noItensMsg = true;
			}else{
				$scope.noItensMsg = false;
			}

			$scope.itensByAccount = itens;

			$scope.totalExpected = 0;
			$scope.totalPayed = 0;
			$scope.totalBank = 0;

			angular.forEach($scope.itensByAccount, function(account, index){
				account.acquirersList = [{}];
				account.isOpen = false;

				$scope.totalExpected += account.totalAmountExpected;
				$scope.totalPayed += account.totalAmountPayed;
				$scope.totalBank += account.totalAmountBank;

				angular.forEach(account.acquirersList, function(acquirer, index){
					acquirer.cardBrandMovementsList = [{}];
					acquirer.isOpen = false;

					angular.forEach(acquirer.cardBrandMovementsList, function(brand, index){
						brand.cardProductMovementsList = [{}];
						brand.isOpen = false;
					});
				});

			});
		});
	};

	$scope.filterByMonth = function(month, year) {
		var date = calendarFactory.getMomentOfSpecificDate($scope.dateSelected);
		var monthsDifference = month - date.month();
		var newDate = calendarFactory.addMonthsToDate(date, monthsDifference);
		$scope.dateSelected = calendarFactory.formatDate(newDate);

		if($scope.accountsSelect.selected){
			this.getFinancials();
		}
	};

	function getCalendarDays(date){
		var firstDayOfMonth = calendarFactory.getFirstDayOfMonth(date);
		var lastDayOfMonth = calendarFactory.getLastDayOfMonth(date);
		var lastDay = calendarFactory.getDayOfMonth(lastDayOfMonth) - 1;


		for(index in $scope.itens){
			if(index > lastDay) {
				$scope.itens[index].show = false;
			} else {
				$scope.itens[index].show = true;
			}
		}
	}

	$scope.changeDay = function(date){
		$scope.dayOfActualDate = calendarFactory.getDayOfMonth(calendarFactory.formatDate(date, true));
		var date = calendarFactory.getMomentOfSpecificDate($scope.dateSelected);
		var daysDifference = $scope.dayOfActualDate - date.date();
		var newDate = calendarFactory.addDaysToDate(date, daysDifference);
		$scope.dateSelected = calendarFactory.formatDate(newDate);

		angular.forEach($scope.itens, function(item, index){
			item.isActive = false;
			if(item.day == newDate.date()){
				item.isActive = true;
			}
		});

		if($scope.accountsSelect.selected){
			this.getFinancials();
		}

	};

	$scope.returnToActualMonth = function(){
		$scope.dateSelected = calendarFactory.getYesterdayDate();

		//Carrega lista de meses no slider
		movementsService.getMonthsToSlider($scope.dateSelected).then(function(itens) {
			$scope.months = itens.data;
		});

		getPeriod($scope.dateSelected);
		getValuesByDay($scope.dateSelected);
	};

	/******************************************* Modal de detalhamento financeiro *************************************************/
	var editavel = new Array();

	$scope.checkEditDisable = function (accountId, acquirerId, cardBrandId, cardProductId) {
		var index = accountId + "" + acquirerId + "" + cardBrandId + "" + cardProductId;

		if(editavel[index] == null){
			return true;
		}else{
			if(editavel[index] == false){
				return true;
			}else{
				return false;
			}
		}
	};

	$scope.checkEditActive = function (accountId, acquirerId, cardBrandId, cardProductId) {
		var index = accountId + "" + acquirerId + "" + cardBrandId + "" + cardProductId;

		if(editavel[index] == null){
			return false;
		}else{
			if(editavel[index] == true){
				return true;
			}else{
				return false;
			}
		}
	};

	var produtoValue = 0;
	$scope.editFinancasBank = function (account, acquirer, brand, product, isChanged) {

		var dayUpadateValue = parseInt(calendarFactory.getDayOfMonth($scope.dateSelected)) - 1;
		var index = account.accountId + "" + acquirer.acquirerId + "" + brand.cardBrandId + "" + product.cardProductId;

		if(editavel[index] == true){
			editavel[index] = false;
		}else{
			editavel[index] = true;
		}

		if(product.totalAmountBank > 0 && !isChanged){
			produtoValue = product.totalAmountBank;
		}

		if(isChanged){
			var json = {dateJson: $scope.dateSelected, accountId:account.accountId,
					acquirerId:acquirer.acquirerId, acquirerName:acquirer.acquirerName,
					cardBrandId:brand.cardBrandId, cardBrandName:brand.cardBrandName,
					product:product, currency:$rootScope.currency};

			movementsService.updateBankValueProduct(json).then(function(){

				if(produtoValue < product.totalAmountBank){
					produtoValue = product.totalAmountBank - produtoValue;
					account.totalAmountBank = account.totalAmountBank + produtoValue;
					acquirer.totalAmountBank = acquirer.totalAmountBank + produtoValue;
					brand.totalAmountBank = brand.totalAmountBank + produtoValue;
					$scope.itens[dayUpadateValue].totalAmountBank = $scope.itens[dayUpadateValue].totalAmountBank + produtoValue;
					produtoValue = 0;
				}
				else{
					produtoValue = produtoValue - product.totalAmountBank;
					account.totalAmountBank = account.totalAmountBank - produtoValue;
					acquirer.totalAmountBank = acquirer.totalAmountBank - produtoValue;
					brand.totalAmountBank = brand.totalAmountBank - produtoValue;
					$scope.itens[dayUpadateValue].totalAmountBank = $scope.itens[dayUpadateValue].totalAmountBank - produtoValue;
					produtoValue = 0;
				}

				//Atualiza o total de bank
				$scope.totalBank = 0;

				angular.forEach($scope.itensByAccount, function(account, index){
					$scope.totalBank += account.totalAmountBank;
				});

			});
		}
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
	var integracaoArquivos = function($rootScope, calendarFactory, $scope, movementsService, $modalInstance, cacheService, getDateSelected,
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
			var scope = "1"; //movements
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
				msg = msg.data;
				if(msg != null){
					$scope.alerts =  [ { type: "danger", msg: msg} ];
				}else{
					window.open($rootScope.baseUrl + 'integration?type='+ type + '&initialDate='+ $scope.checkDateInitial($scope.dataInicial)  + '&finalDate='+ $scope.checkDateFinal($scope.dataFinal)
							+ '&acquirers=' + acquirersSearch + '&settlements=' + settlementsSearch + '&scope=' + scope + '&companyId=' + $rootScope.company
							+ '&currency=' + $rootScope.currency
							+ '&token=' + $window.sessionStorage.token
							+ '&fromSchema=' + $window.sessionStorage.schemaName);
				}
			});
		};
	};
	/* fim do modal integracao */


	$scope.detalheFinancasModal = function (accountId, acquirerId, cardBrandId, cardProductId) {

		var modalInstance = $modal.open({
			templateUrl: 'financasModal.html',
			controller: FinancasModalCtrl,
			resolve: {
				getSettlements: function () {
					return $scope.settlementsSearch;
				},
				getAccount: function () {
					return accountId;
				},
				getAcquirer: function () {
					return acquirerId;
				},
				getCardBrand: function () {
					return cardBrandId;
				},
				getProduct: function () {
					return cardProductId;
				},
				getDateItemAccordionSelected: function () {
					return $scope.dateSelected;
				}
			}
		});

	};

	var FinancasModalCtrl = function ($scope, $modalInstance, getAccount, getSettlements, getAcquirer, getCardBrand, getProduct, getDateItemAccordionSelected) {
		var accountId = getAccount;
		var acquirerId = getAcquirer;
		var cardBrandId = getCardBrand;
		var cardProductId = getProduct;
		var settlements = getSettlements;
		var payedDate = getDateItemAccordionSelected;
		var expectedDate = getDateItemAccordionSelected;

		$scope.monthNameAbreviation = calendarFactory.getMonthNameAbreviation(getDateItemAccordionSelected);
		$scope.dayOfActualDate = calendarFactory.getDayOfMonth(getDateItemAccordionSelected);

		$scope.currentPage = 1;
		var isPayedDate = false;
		$scope.column = "id";
		$scope.order = 1;

		startModalFinanceiroTour();

		$scope.helpModalFinanceiro = function(){
			restartModalFinanceiroTour(userService, $rootScope.user);
		};

		$scope.orderColumn = function(column) {
			var columns = ["nsu", "authorization", "tid", "cardNumber", "installment", "erpId", "net", "amount", "description", "nature", "kindName"];

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
            $scope.pageChanged();
        };

		$scope.getListByStatus = function(statusId, statusKind) {
			// quando é chamada a primeira vez ele não tem definição então faço essa validação para zerar a
			// lista quem contem no objeto
			if($scope.movementDetailModal == undefined){
				$scope.movementDetailModal = '';
			}

			// a cada chamada eu zero alguns dos valores que são chamados para validar a tela
			isPayedDate = false;
			$scope.noItensMsgModal = false;
			$scope.noHistoryMsg = false;
			$scope.statusId = 0;
			$scope.statusKind = 0;
			$scope.totalItensPage = 10;
			$scope.movementDetailModal.installmentList = [];

			if (statusId == undefined || statusId == 1) {
				$scope.statusId = 1;
			}
			else if(statusId == 2){
				if(statusKind == undefined){
					$scope.statusId = 2;
				}
				else{
					if(statusKind == 1){
						isPayedDate = true;
						$scope.statusId = 2;
						$scope.statusKind = 1;
						$scope.validateNoHistory(statusId);
					}
					else if(statusKind == 2){
						isPayedDate = true;
						$scope.statusId = 2;
						$scope.statusKind = 2;
					}
				}
			}
			else if(statusId == 3){
				if(statusKind == undefined){
					$scope.statusId = 3;

				}else{
					isPayedDate = true;
					$scope.statusId = 3;
					$scope.statusKind = 3;
					$scope.validateNoHistory(statusId);
				}
			}
			if($scope.movementDetailModal == ''){
				movementsService.getItensModal(accountId, acquirerId, settlements, cardBrandId, cardProductId, $scope.statusId, $scope.statusKind,
						payedDate, expectedDate, $scope.currentPage, isPayedDate).then(function(movementDTO){

						$scope.movementDetailModal = movementDTO;
						countItens();
						this.currentPage = 1;
				});
			}else{
				this.currentPage = $scope.currentPage = 1;
				countItens();
			}
		};

		$scope.validateNoHistory = function(statusId) {
			$scope.noHistoryMsg = false;

			movementsService.totalValueNoHistory(accountId, acquirerId, settlements, cardBrandId, cardProductId, statusId, payedDate).then(function(total){
				if(total != 0){
					$scope.noHistoryMsg = true;
					$scope.valueHistory = total;
				}
			});
		};

		$scope.getListByStatus();

		$scope.alterTotalItensPage = function() {
			this.currentPage = $scope.currentPage = 1;
			$scope.totalItensPage = this.totalItensPage;
			$scope.pageChanged();
		};

		function countItens() {
			movementsService.countItensModal(accountId, acquirerId, settlements, cardBrandId, cardProductId,
					$scope.statusId, $scope.statusKind, payedDate, expectedDate, isPayedDate).then(function(total){

					$scope.totalItens = total;
					$scope.maxSize = maxSizePagination(total, $scope.totalItensPage);
					if(total == 0){
						$scope.noItensMsgModal = true;
					}else{
						$scope.pageChanged();
					}
			});
		}

		$scope.pageChanged = function() {
			$scope.currentPage = this.currentPage;

			if($scope.totalItens < $scope.totalItensPage){
				$scope.totalItensPage = $scope.totalItens;
			}

			movementsService.getMovementInstallmentModal(accountId, acquirerId, settlements, cardBrandId, cardProductId, $scope.statusId, $scope.statusKind,
					payedDate, expectedDate, $scope.currentPage, $scope.totalItensPage, isPayedDate, $scope.column, $scope.order).then(function(installmentList){

					$scope.movementDetailModal.installmentList = installmentList;
			});
		};

		$scope.gerarRelatorioModal = function (type) {
			window.open($rootScope.baseUrl + 'reports?report=financasModal&type=' + type + '&dataSelecionada='+ payedDate
					+ '&token=' + $window.sessionStorage.token + '&status=' + $scope.statusKind + '&acquirers=' + acquirerId + '&settlements=' + settlements
					+ '&cardBrandId=' + cardBrandId + '&cardProductId=' + cardProductId
					+ '&accountId=' + accountId + '&statusMovements=' + $scope.statusId + '&isPayedDate=' + isPayedDate + '&orderColumn=' + $scope.column
					+ '&currency=' + $rootScope.currency
					+ '&order=' + $scope.order + '&fromSchema=' + $window.sessionStorage.schemaName);
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

			transactionsService.getTransaction(item.id).then(function(tran) {
				$scope.item = tran;
			});
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

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	};

	$scope.gerarRelatorio = function (type) {
	    window.open($rootScope.baseUrl + 'reports?report=resumoFinancas&type='+ type + '&dataSelecionada='+ $scope.dateSelected + '&token=' + $window.sessionStorage.token
	    			+ '&fromSchema=' + $window.sessionStorage.schemaName
	    			+ '&acquirers=' +$scope.acquirersSearch + '&settlements=' + $scope.settlementsSearch
	    			+ '&brands=' + $scope.brandsSearch + '&products=' + $scope.productsSearch
	    			+ '&accounts=' + $scope.accountsSearch
	    			+ '&currency=' + $rootScope.currency);
	};

	$scope.filterAdvancedMovements = function() {
		getPeriod($scope.dateSelected);
		getValuesByDay($scope.dateSelected);
	};

	$scope.clearAdvancedFilterMovements = function() {
		$scope.loadParamsByFilter();
		getPeriod($scope.dateSelected);
		getValuesByDay($scope.dateSelected);
	};

	function getAccounts(){
		kaplenAdminService.getAccounts().then(function(items) {
			items = items.data;
			for(var item in items) {
				try {
					if(items[item].hasOwnProperty('accountNumber')){
						var account = {};
						account.id = items[item].id;
						account.name = items[item].accountNumber;
						$scope.accountsSelect.items.push(account);
					}
				} catch (e) {

				}
			}

			$scope.accountsSelect.selected = $scope.accountsSelect.items[0].id;
			getFinancials();
		});
	}

	$scope.showDetails = function(acquirer, type,  cardProduct) {
		$rootScope.movementsDetails = {};

		var dateSelected = $scope.dateSelected;
		$rootScope.movementsDetails.currency = "BRL";
		$rootScope.movementsDetails.startDate = dateSelected;
		$rootScope.movementsDetails.endDate = dateSelected;
		$rootScope.movementsDetails.shopIds = $scope.settlementsSelected;
		$rootScope.movementsDetails.products = $scope.productsSearch;

		$rootScope.movementsDetails.type = type;
		$rootScope.movementsDetails.cardProduct = cardProduct;
		$rootScope.movementsDetails.acquirer = acquirer;
		$rootScope.movementsDetails.bankAccount = $scope.accountsSelect;


		$location.path('movements/receipt');
	}

	$scope.showFees = function (data) {
		$rootScope.movementsFees = {};

		var dateSelected = $scope.dateSelected;
		$rootScope.movementsFees.currency = "BRL";
		$rootScope.movementsFees.startDate = dateSelected;
		$rootScope.movementsFees.endDate = dateSelected;
		$rootScope.movementsFees.acquirer = data.acquirer;
		$rootScope.movementsFees.shopIds = $scope.settlementsSelected;
		$rootScope.movementsFees.type = data.type;
		$rootScope.movementsFees.description = data.description;

		$location.path('movements/fee');
	}

	/***********************************************************************/

	function getFinancials() {
		var dateSelected = $scope.dateSelected;
		var currency = $rootScope.currency;
		var startDate = calendarFactory.formatDateForService(dateSelected);
		var endDate = calendarFactory.formatDateForService(dateSelected);
		var shopIds = [];
		var cardProductIds = [];
		var bankAccountIds = $scope.accountsSelect.selected;
		$scope.monthSelected = calendarFactory.getNameOfMonth($scope.dateSelected);

		if($scope.settlementsSelected) {
			for(item in $scope.settlementsSelected) {
				shopIds.push($scope.settlementsSelected[item].id);
			}
		}

		if($scope.productsSelected) {
			for(item in $scope.productsSelected) {
				cardProductIds.push($scope.productsSelected[item].id);
			}
		}

		$scope.showData = false;

		$scope.acquirerData = [];
		$scope.cardProductData = [];
		$scope.typeData = [];
		$scope.alerts = [];
		$scope.taxes = [];
		$scope.taxesTotal = 0;


		cacheService.saveFilter({
			startDate: dateSelected,
			endDate: dateSelected,
			settlementsSelected: $scope.settlementsSelected,
			productsSelected: $scope.productsSelected,
			bankAccountIds: bankAccountIds
		}, 'movements');

		FinancialService.getGroupByAcquirer({
			currency: 'BRL',
			startDate: calendarFactory.formatDateForService(dateSelected),
			endDate: calendarFactory.formatDateForService(dateSelected),
			bankAccountIds: bankAccountIds,
			cardProductIds : cardProductIds,
			shopIds: shopIds,
			groupBy: 'ACQUIRER'
		}).then(function(items) {
			items = items.data;
			if(items[0] !== undefined) {
				var acquirer = items[0].acquirer.id;
				$scope.acquirerData = items[0];
				FinancialService.getGroupByCardProduct({
					currency: 'BRL',
					startDate: calendarFactory.formatDateForService(dateSelected),
					endDate: calendarFactory.formatDateForService(dateSelected),
					acquirer: acquirer,
					shopIds: shopIds,
					bankAccountIds: bankAccountIds,
					cardProductIds: cardProductIds,
					groupBy: 'CARD_PRODUCT'
				}).then(function(items) {
					items = items.data;
					var c = 0;
					for(var item in items){
						if(typeof items[item] === 'object') {
							items[item].types = [];
							$scope.cardProductData.push(items[item])
						} else {
							break;
						}
					}

					// pegar detalhes
					var c = 0;
					for(var x = 0; x < $scope.cardProductData.length; x++) {
						var cardProductTypeId = $scope.cardProductData[x].cardProduct.id;

						FinancialService.getGroupByType({
							currency: 'BRL',
							startDate: calendarFactory.formatDateForService(dateSelected),
							endDate: calendarFactory.formatDateForService(dateSelected),
							acquirer: acquirer,
							shopIds: shopIds,
							bankAccountIds: bankAccountIds,
							cardProductIds : cardProductTypeId,
							groupBy: 'TYPE'
						}).then(function(items) {
							items = items.data;
							for(var item in items){
								if(typeof items[item] === 'object') {
									for(x in $scope.cardProductData){
										if(items[item].cardProduct.id === $scope.cardProductData[x].cardProduct.id) {
											$scope.cardProductData[x].types.push(items[item]);
										}
									}
								} else {
									break;
								}
								c++;
							}
						});
					}

					$scope.showData = true;
				});


				FinancialService.getAdministrativeCosts({
					currency: 'BRL',
					startDate: calendarFactory.formatDateForService(dateSelected),
					endDate: calendarFactory.formatDateForService(dateSelected),
					acquirer: acquirer,
					shopIds: shopIds,
					bankAccountIds: bankAccountIds,
					cardProductIds : cardProductIds,
					status: 'RECEIVED',
					type: 'POS_CONECTIVITY',
					groupBy: 'TYPE'
				}).then(function(items) {
					items = items.data;
					for(var item in items){
						if(typeof items[item] === 'object') {
							$scope.taxes.push(items[item])
							$scope.taxesTotal = $scope.taxesTotal += items[item].amount;
						} else {
							break;
						}
					}

				});

			} else {
				$scope.alerts =  [ { type: "danger", msg: 'Nenhum dado encontrado.'} ];
			}

		});
	}

	function search() {
		this.getFinancials();
	}
	function clearFilter() {
		$scope.settlementsSelected = [];
		$scope.productsSelected = [];
		$scope.natureza = 0;

		this.getFinancials();
	}


	function getCachedData() {

		$scope.dateSelected = calendarFactory.getActualDate();

		if(cacheService.loadFilter('context') == 'movements') {
			$scope.dateSelected = cacheService.loadFilter('startDate') || calendarFactory.getActualDate();

			var productsSelected = cacheService.loadFilter('productsSelected');
			var settlementsSelected = cacheService.loadFilter('settlementsSelected');

			$scope.accountsSelect.selected = cacheService.loadFilter('bankAccountIds');


			if(productsSelected) {
				for(var item in productsSelected) {
					advancedFilterService.addProductsSearch(productsSelected[item]);
				}
			} else {
				$scope.productsSelected = [];
			}

			if(settlementsSelected) {
				for(var item in settlementsSelected) {
					advancedFilterService.addSettlementsSearch(settlementsSelected[item]);
				}
			} else {
				$scope.settlementsSelected = [];
			}

		} else {
			//cacheService.clearFilter();
		}
	}

});
