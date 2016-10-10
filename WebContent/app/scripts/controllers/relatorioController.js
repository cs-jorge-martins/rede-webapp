angular.module('KaplenWeb.relatorioController',['ui.bootstrap'])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/relatorio', {templateUrl: 'app/views/relatorio.html', controller: 'relatorioController'});
}])

.controller('relatorioController', function(menuFactory, $scope, $modal, calendarFactory, $rootScope,
		relatorioService, installmentsService, $window, advancedFilterService, calendarService){

	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.loadParamsByFilter();

	//Extensao do serviço para calendario
	angular.extend($scope, calendarService);
	$scope.resetCalendarService();

	menuFactory.setActiveReports();

	/************************************************************** FUNCOES PARA BOTÕES INICIAIS ******************************************************************/

	$scope.tabs = [{},{},{}];
	$scope.tabsVendasType = [{},{}];
	$scope.exibitionMode = 1;
	$scope.filterAnalitic = 4;
	$scope.filterAnaliticText = "MESES";
	$scope.search = false;
	$scope.searchTax = false;
	$scope.searchFinanceiro = false;
	$scope.opcaoRelatorioVenda = 1;
	$scope.opcaoRelatorioCustos = 1;
	$scope.percentual = true;
	$scope.tipoRelatorioCustos = this.tipoRelatorioCustos = 1;
	$scope.opcaoRelatorioFinanceiro = this.opcaoRelatorioFinanceiro = 1;
	$scope.valorDivergencia = "0.00";

	$scope.weeksDay = [
	                  {name:'domingo', number: 0},
	                  {name:'segunda-feira', number: 1},
	                  {name:'terça-feira', number: 2},
	                  {name:'quarta-feira', number: 3},
	                  {name:'quinta-feira', number: 4},
	                  {name:'sexta-feira', number: 5},
	                  {name:'sábado', number: 6}
	                ];

	$scope.dataTypes = [
		                  {name:'Valores', number: 1},
		                  {name:'Quantidade', number: 2}
		               ];

	$scope.dataType = $scope.dataTypes[0];

	var company = '';
	if (angular.isDefined($rootScope.company)) {
		company = $rootScope.company;
	}

	/************************************************************** PESQUISAS *************************************************************************************/

	// função de pesquisa
	$scope.pesquisar = function(exibMode) {

		if(exibMode != undefined){
			$scope.exibitionMode = exibMode;
		}

		$scope.search = true;
		$scope.searchDuplicates = false;

		//Dia da semana
		var weekDay = null;

		if (angular.isDefined(this.weekDay) && this.weekDay != null) {
			weekDay = this.weekDay.number;
		}

		if(angular.isDefined(this.dataType)){
			$scope.dataType = this.dataType;
		}

		//Opcao de relatorio
		var opcaoRelatorioVenda = null;

		if (angular.isDefined(this.opcaoRelatorioVenda)) {
			opcaoRelatorioVenda = this.opcaoRelatorioVenda;
		}

		$scope.checkInvalidDates = calendarFactory.checkInvalidPeriod($scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal), $scope.initialDateChanged, $scope.finalDateChanged);

		if($scope.checkInvalidDates){
			$scope.alerts =  [ { type: "danger", msg: 'Período incorreto. Favor corrigir o período e tentar novamente.'} ];
		}else{
			$scope.alerts =  [];
		}

		//Sintetico
		if(opcaoRelatorioVenda == 1 && !$scope.checkInvalidDates){
			if($scope.tabsVendasType[0].active){
				relatorioService.searchSinteticTransactions($scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal), $scope.exibitionMode, weekDay,
						$scope.acquirersSearch, $scope.brandsSearch, $scope.productsSearch, $scope.installmentsSearch,
						$scope.settlementsSearch, $scope.terminalsSearch, $rootScope.currency, $scope.getTipoTerminal()).then(function(itensSintetic){

						$scope.itensSintetic = itensSintetic;

						if(itensSintetic.length > 0){

							var dataVisoes = [];
							var arrayFilters = new Array();

							$scope.totalQuantitySintetic = 0;
							$scope.totalAmountSintetic = 0;

							angular.forEach(itensSintetic, function(item, index){
								if($scope.dataType.number == 1){
									arrayFilters[item.name] = item.totalAmount;
								}else{
									arrayFilters[item.name] = item.quantity;
								}

								$scope.totalQuantitySintetic += item.quantity;
								$scope.totalAmountSintetic += item.totalAmount;
							});

							//Calcular percentual para cada item
							angular.forEach(itensSintetic, function(item, index){
								if($scope.dataType.number == 1){
									item.percentual = (item.totalAmount / $scope.totalAmountSintetic) * 100;
								}else{
									item.percentual = (item.quantity / $scope.totalQuantitySintetic) * 100;
								}
							});

							for (var filterName in arrayFilters) {
							    dataVisoes.push([filterName, arrayFilters[filterName]]);
							}

							$scope.graphVisoes = pieChartVendasVisoes(dataVisoes);
						}
				});
			}else{ //Analitico

				relatorioService.searchAnaliticTransactions($scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal), $scope.exibitionMode, $scope.filterAnalitic, weekDay,
						$scope.acquirersSearch, $scope.brandsSearch, $scope.productsSearch, $scope.installmentsSearch,
						$scope.settlementsSearch, $scope.terminalsSearch, $rootScope.currency, $scope.getTipoTerminal()).then(function(itensAnalitic){

						$scope.itensAnalitic = itensAnalitic;

						var datasourceGraph = [];

						//Obtem todas as operadoras/bandeiras/lojas/etc possiveis
						angular.forEach(itensAnalitic, function(item, index){
							if(item.filterTransactionsList != null){
								angular.forEach(item.filterTransactionsList, function(filterTransaction, index){
									var achou = false;

									angular.forEach(datasourceGraph, function(data, index){
										if(filterTransaction.filter == data.name){
											achou = true;
										}
									});

									if(!achou){
										datasourceGraph.push({name:filterTransaction.filter, data:[]});
									}
								});
							}
						});

						//Itera sobre cada filter object para o filter externo
						angular.forEach(itensAnalitic, function(itemAnalitic, index){
							angular.forEach(datasourceGraph, function(datasource, index){

								var isValid = true;

								//Se é por horas - Retirar "Horas nao informadas" dos itens
								if($scope.filterAnalitic == 1){
									if(!calendarFactory.verifyValidHours(itemAnalitic.filter)){
										isValid = false;
									}
								}

								if(isValid){
									if(itemAnalitic.filterTransactionsList != null){
										var exists = false;

										angular.forEach(itemAnalitic.filterTransactionsList, function(filterTransaction, index){
											if(filterTransaction.filter == datasource.name){
												exists = true;

												//Se for por DIAS
												if($scope.filterAnalitic == 2){
													var dateMoment = calendarFactory.getDateFromString(itemAnalitic.filter);
													var dateUTC = Date.UTC(dateMoment.year(), dateMoment.month(), dateMoment.date());

													if($scope.dataType.number == 1){ //Valores
														datasource.data.push([dateUTC, filterTransaction.totalAmount]);
													}else{ //Quantidade
														datasource.data.push([dateUTC, filterTransaction.quantity]);
													}
												}else{
													if($scope.dataType.number == 1){ //Valores
														datasource.data.push(filterTransaction.totalAmount);
													}else{ //Quantidade
														datasource.data.push(filterTransaction.quantity);
													}
												}
											}
										});

										if(!exists){
											//Se for por DIAS
											if($scope.filterAnalitic == 2){
												var dateMoment = calendarFactory.getDateFromString(itemAnalitic.filter);
												var dateUTC = Date.UTC(dateMoment.year(), dateMoment.month(), dateMoment.date());
												datasource.data.push([dateUTC, 0]);
											}else{
												datasource.data.push(0);
											}
										}

									}else{
										//Se por DIAS
										if($scope.filterAnalitic == 2){
											var dateMoment = calendarFactory.getDateFromString(itemAnalitic.filter);
											var dateUTC = Date.UTC(dateMoment.year(), dateMoment.month(), dateMoment.date());
											datasource.data.push([dateUTC, 0]);
										}else{
											datasource.data.push(0);
										}
									}
								}
							});
						});

						var categories = [];

						//Coloca categorias somente para gráficos DIFERENTE de DIAS
						if($scope.filterAnalitic != 2 && $scope.filterAnalitic != 3){
							angular.forEach(itensAnalitic, function(item, index){

								//Por horas
								if($scope.filterAnalitic == 1){
									if(calendarFactory.verifyValidHours(item.filter)){
										categories.push([calendarFactory.getHoursAndMinutes(item.filter)]);
									}
								}
								else{
									categories.push([item.filter]);
								}
							});
						}

						//Grafico para DIAS
						if($scope.filterAnalitic == 2){
							if($scope.dataType.number == 1){
								$scope.graphAnalitic = pieChartVendasAnaliticasDiasReport("Valores", datasourceGraph);
							}else{
								$scope.graphAnalitic = pieChartVendasAnaliticasDiasReport("Quantidade", datasourceGraph);
							}

						}else if($scope.filterAnalitic == 3){//Grafico para SEMANAS
							var dateMomentInitial = calendarFactory.getDateFromString($scope.dataInicial);
							var dateMomentFinal = calendarFactory.getDateFromString($scope.dataFinal);
							var initialDateUTC = Date.UTC(dateMomentInitial.year(), dateMomentInitial.month(), dateMomentInitial.date());
							var finalDateUTC = Date.UTC(dateMomentFinal.year(), dateMomentFinal.month(), dateMomentFinal.date());

							var proportionOfWeeks;

							if(itensAnalitic.length <= 13){
								proportionOfWeeks = 7;
							}else if(itensAnalitic.length > 13 && itensAnalitic.length <= 26){
								proportionOfWeeks = 14;
							}else if(itensAnalitic.length > 26 && itensAnalitic.length <= 38){
								proportionOfWeeks = 21;
							}else{
								proportionOfWeeks = 28;
							}

							if($scope.dataType.number == 1){
								$scope.graphAnalitic = pieChartVendasAnaliticasSemanasReport(initialDateUTC, finalDateUTC, proportionOfWeeks, "Valores", datasourceGraph);
							}else{
								$scope.graphAnalitic = pieChartVendasAnaliticasSemanasReport(initialDateUTC, finalDateUTC, proportionOfWeeks, "Quantidade", datasourceGraph);
							}
						}else{ // Grafico para HORAS ou MESES
							if($scope.dataType.number == 1){
								$scope.graphAnalitic = pieChartVendasAnaliticasReport(categories, "Valores", datasourceGraph);
							}else{
								$scope.graphAnalitic = pieChartVendasAnaliticasReport(categories, "Quantidade", datasourceGraph);
							}
						}
				});
			}
		}else if(opcaoRelatorioVenda == 2 && !$scope.checkInvalidDates){ //Duplicadas
			$scope.searchDuplicates = true;

			relatorioService.getTransactionsDuplicated($scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal),
					$scope.acquirersSearch, $scope.brandsSearch, $scope.productsSearch, $scope.installmentsSearch,
					$scope.settlementsSearch, $scope.terminalsSearch, $rootScope.currency).then(function(itensDuplicated) {

				$scope.itensDuplicated = itensDuplicated;
			});
		}else if(opcaoRelatorioVenda == 3 && !$scope.checkInvalidDates){ //Canceladas

		}
	};

	$scope.limparFiltrosVendas = function(){
		$scope.tipoTerminal = this.tipoTerminal = 0;

		$scope.acquirer = this.acquirer = '';
		$scope.brand = this.brand = '';
		$scope.product = this.product = '';
		$scope.settlement = this.settlement = '';
		$scope.terminal = this.terminal = '';
		$scope.installment = this.installment = '';

		$scope.acquirersSelected = this.acquirersSelected = [];
		$scope.brandsSelected = this.brandsSelected = [];
		$scope.productsSelected = this.productsSelected = [];
		$scope.settlementsSelected = this.settlementsSelected = [];
		$scope.terminalsSelected = this.terminalsSelected = [];
		$scope.installmentsSelected = this.installmentsSelected = [];

		$scope.acquirersSearch = this.acquirersSearch = [];
		$scope.brandsSearch = this.brandsSearch = [];
		$scope.productsSearch = this.productsSearch = [];
		$scope.settlementsSearch = this.settlementsSearch = [];
		$scope.terminalsSearch = this.terminalsSearch = [];
		$scope.installmentsSearch = this.installmentsSearch = [];

		$scope.valorDivergencia = "0.00";
	};

	$scope.pesquisarTaxas = function(){
		$scope.alerts =  [];

		$scope.checkInvalidDates = calendarFactory.checkInvalidPeriod($scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal), $scope.initialDateChanged, $scope.finalDateChanged);

		if($scope.checkInvalidDates){
			$scope.alerts =  [ { type: "danger", msg: 'Período incorreto. Favor corrigir o período e tentar novamente.'} ];
		}

		$scope.opcaoRelatorioCustos = this.opcaoRelatorioCustos;
		$scope.valorDivergencia = this.valorDivergencia;
		$scope.tipoRelatorioCustos = this.tipoRelatorioCustos;

		if(!$scope.checkInvalidDates && angular.isDefined($scope.settlementsSearch) && angular.isDefined($scope.acquirersSearch)){
			//Divergencias
			if($scope.tipoRelatorioCustos == 1){
				$scope.searchDivergentTaxes = true;

				relatorioService.getDivergentTaxes($scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal),
						$scope.settlementsSearch, $scope.acquirersSearch, this.opcaoRelatorioCustos, this.valorDivergencia).then(function(divergentTransactions){

						$scope.divergentTransactions = divergentTransactions;

						$scope.sumOfDifference = 0;

						angular.forEach(divergentTransactions, function(item, index){
							$scope.sumOfDifference += item.differenceDivergentTaxes;
						});
				});
			}else{ // Taxas e tarifas
				$scope.searchConectivityTaxes = true;

				relatorioService.getConectivityTaxes($scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal),
							$scope.settlementsSearch, $scope.acquirersSearch).then(function(conectivityTaxes){

							$scope.conectivityTaxesReport = conectivityTaxes;
				});
			}
		}
	};

	//Financeiro
	$scope.pesquisarFinanceiro = function(){
		$scope.searchFinanceiro = true;

		//Opcao de relatorio
		var opcaoRelatorioFinanceiro = null;

		if (angular.isDefined(this.opcaoRelatorioFinanceiro)) {
			opcaoRelatorioFinanceiro = this.opcaoRelatorioFinanceiro;
		}

		//Previsao de recebimentos
		if(opcaoRelatorioFinanceiro == 1){
			relatorioService.getPrevisaoRecebimentos($scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal), $scope.acquirersSearch,
					$scope.brandsSearch, $scope.settlementsSearch, $rootScope.currency).then(function(itensFinanceiro) {

					$scope.itensFinanceiro = itensFinanceiro;

					if(itensFinanceiro.length > 0){
						var dataVisoes = [];
						var arrayFilters = new Array();

						$scope.totalQuantity = 0;
						$scope.totalAmount = 0;

						angular.forEach(itensFinanceiro, function(item, index){
							arrayFilters[item.acquirerName] = item.totalNetInstallments;

							$scope.totalQuantity += item.quantityInstallments;
							$scope.totalAmount += item.totalNetInstallments;
						});


						for (var filterName in arrayFilters) {
						    dataVisoes.push([filterName, arrayFilters[filterName]]);
						}

						$scope.graphPrevisaoRecebimentos = pieChartVendasVisoes(dataVisoes);
					}
			});
		}
	};

	$scope.clearAdvancedFilterFinanceiro = function() {
		$scope.acquirer = this.acquirer = '';
		$scope.brand = this.brand = '';
		$scope.product = this.product = '';
		$scope.settlement = this.settlement = '';
		$scope.acquirersSelected = this.acquirersSelected = [];
		$scope.brandsSelected = this.brandsSelected = [];
		$scope.productsSelected = this.productsSelected = [];
		$scope.settlementsSelected = this.settlementsSelected = [];
		$scope.acquirersSearch = this.acquirersSearch = [];
		$scope.brandsSearch = this.brandsSearch = [];
		$scope.productsSearch = this.productsSearch = [];
		$scope.settlementsSearch = this.settlementsSearch = [];
	};

	$scope.gerarPrevisaoRecebimentos = function(type) {
		window.open($rootScope.baseUrl + 'reports/previsaoRecebimentos?type='+ type + '&initialDate='+ $scope.checkDateInitial($scope.dataInicial)
				+ '&finalDate='+ $scope.checkDateFinal($scope.dataFinal)
				+ '&acquirers=' + $scope.acquirersSearch + '&brands=' + $scope.brandsSearch + '&products=' + $scope.productsSearch
				+ '&settlements=' + $scope.settlementsSearch
				+ '&currency=' + $rootScope.currency
				+ '&token=' + $window.sessionStorage.token
				+ '&fromSchema=' + $window.sessionStorage.schemaName);
	};

	$scope.setExibitionMode = function(exibitionMode){
		$scope.exibitionMode = exibitionMode;
		$scope.pesquisar();
	};

	$scope.setFilterAnalitic = function(filterAnalitic){
		$scope.filterAnalitic = filterAnalitic;

		if(filterAnalitic == 1){
			$scope.filterAnaliticText = "HORAS";
		}else if (filterAnalitic == 2){
			$scope.filterAnaliticText = "DIAS";
		}else if (filterAnalitic == 3){
			$scope.filterAnaliticText = "SEMANAS";
		}else if (filterAnalitic == 4){
			$scope.filterAnaliticText = "MESES";
		}

		$scope.pesquisar();
	};

	/* inicio modal */
	$scope.detalharParcelas = function(item){

		var modalInstance = $modal.open({
	      templateUrl: 'app/views/relatorios/financeiro/previsaoRecebimentosModal.html',
	      resolve: {
				itemSelected: function () {
					return item;
				}
		  },
	      controller: function ($rootScope, $scope, $modalInstance, itemSelected, calendarService, advancedFilterService){

	    	//Extensao do serviço para filtro avançado
	    	angular.extend($scope, advancedFilterService);

	    	//Extensao do serviço para filtro avançado
			angular.extend($scope, calendarService);

			$scope.totalItensPage = "10";
			$scope.currentPage = 1;
			$scope.column = "expectedDate";
			$scope.order = 1;

			$scope.acquirerSelected = itemSelected.acquirerName;

			$scope.countAllInstallments = function(){

				$scope.totalAmountModal = 0;

				relatorioService.countDetalharParcelas($scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal),
		    			 $rootScope.currency, itemSelected.acquirerId).then(function(countSumDTO) {

		 					$scope.totalItens = countSumDTO.qtd;
		 					$scope.totalAmountModal = countSumDTO.totalValue;
		 					$scope.maxSize = maxSizePagination($scope.totalItens, $scope.totalItensPage);
		 					$scope.loadInstallments();
	   			});
			};

			$scope.countAllInstallments();

			$scope.loadInstallments = function(){
				relatorioService.detalharParcelas($scope.checkDateInitial($scope.dataInicial), $scope.checkDateFinal($scope.dataFinal),
		    			 $rootScope.currency, itemSelected.acquirerId, $scope.currentPage, $scope.totalItensPage, $scope.column, $scope.order).then(function(parcelas) {

		    			$scope.parcelas = parcelas;
	   			});
			};

	    	$scope.alterTotalItensPage = function() {
				this.currentPage = $scope.currentPage = 1;
				$scope.totalItensPage = this.totalItensPage;
				$scope.loadInstallments();
			};

			$scope.pageChanged = function() {
				$scope.currentPage = this.currentPage;
				$scope.loadInstallments();
			};

			$scope.orderColumn = function(column) {
	        	var columns = ["expectedDate", "nsu", "authorization", "tid", "installment", "erpId", "net"];

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
	        	$scope.loadInstallments();
	        };

	    	$scope.cancel = function () {
	    		$modalInstance.dismiss('cancel');
	    	};

	    	$scope.gerarPrevisaoRecebimentosModal = function(type) {
	    		window.open($rootScope.baseUrl + 'reports/previsaoRecebimentosModal?type='+ type + '&initialDate='+ $scope.checkDateInitial($scope.dataInicial)
	    				+ '&finalDate='+ $scope.checkDateFinal($scope.dataFinal)
	    				+ '&acquirerId=' + itemSelected.acquirerId
	    				+ '&currency=' + $rootScope.currency
	    				+ '&column=' + $scope.column
	    				+ '&order=' + $scope.order
	    				+ '&token=' + $window.sessionStorage.token
	    				+ '&fromSchema=' + $window.sessionStorage.schemaName);
	    	};

	      },
	    });
	};
	/* fim do modal */

	$scope.cupon = function(item) {
		installmentsService.getByTransactions(item.id, 0, false).then(function(parcelas) {
			item.parcelas = parcelas;
			var modalInstance = $modal.open({
				templateUrl: 'app/views/relatorios/vendas/modal/cupomVenda.html',
				controller: cupomVendaController,
				size: 'sm',
				resolve: {
					itemSelected: function () {
						return item;
					}
				}
			});
		});
	};
	var cupomVendaController = function ($scope, $modal, $modalInstance, itemSelected) {

		$scope.itemSelected = itemSelected;

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	};

	$scope.gerarSintetico = function(type) {

		//Dia da semana
		var weekDay = null;

		if (angular.isDefined(this.weekDay)) {
			weekDay = this.weekDay.number;
		}

		//Se for null, nao envia o parametro
		if(weekDay == null){

			window.open($rootScope.baseUrl + 'reports/vendasSintetico?type='+ type + '&initialDate='+ $scope.checkDateInitial($scope.dataInicial)  + '&finalDate='+ $scope.checkDateFinal($scope.dataFinal)
					+ '&dataType=' + $scope.dataType.number + '&exibitionMode=' + $scope.exibitionMode
					+ '&acquirers=' + $scope.acquirersSearch + '&brands=' + $scope.brandsSearch + '&products=' + $scope.productsSearch
					+ '&installments=' + $scope.installmentsSearch + '&settlements=' + $scope.settlementsSearch
					+ '&terminals=' + $scope.terminalsSearch
					+ '&tipoTerminal=' + $scope.getTipoTerminal()
					+ '&currency=' + $rootScope.currency
					+ '&token=' + $window.sessionStorage.token
					+ '&fromSchema=' + $window.sessionStorage.schemaName);
		}else{
			window.open($rootScope.baseUrl + 'reports/vendasSintetico?type='+ type + '&initialDate='+ $scope.checkDateInitial($scope.dataInicial)  + '&finalDate='+ $scope.checkDateFinal($scope.dataFinal)
					+ '&dataType=' + $scope.dataType.number + '&exibitionMode=' + $scope.exibitionMode + '&weekDay=' + weekDay
					+ '&acquirers=' + $scope.acquirersSearch + '&brands=' + $scope.brandsSearch + '&products=' + $scope.productsSearch
					+ '&installments=' + $scope.installmentsSearch + '&settlements=' + $scope.settlementsSearch
					+ '&terminals=' + $scope.terminalsSearch
					+ '&tipoTerminal=' + $scope.getTipoTerminal()
					+ '&currency=' + $rootScope.currency
					+ '&token=' + $window.sessionStorage.token
					+ '&fromSchema=' + $window.sessionStorage.schemaName);
		}
	};

	$scope.gerarAnalitico = function (type) {

		//Dia da semana
		var weekDay = null;

		if (angular.isDefined(this.weekDay)) {
			weekDay = this.weekDay.number;
		}

		//Se for null, nao envia o parametro
		if(weekDay == null){
			window.open($rootScope.baseUrl + 'reports/vendasAnalitico?type='+ type + '&initialDate='+ $scope.checkDateInitial($scope.dataInicial)  + '&finalDate='+ $scope.checkDateFinal($scope.dataFinal)
					+ '&dataType=' + $scope.dataType.number + '&exibitionMode=' + $scope.exibitionMode
					+ '&acquirers=' + $scope.acquirersSearch + '&brands=' + $scope.brandsSearch + '&products=' + $scope.productsSearch
					+ '&installments=' + $scope.installmentsSearch + '&settlements=' + $scope.settlementsSearch
					+ '&terminals=' + $scope.terminalsSearch
					+ '&tipoTerminal=' + $scope.getTipoTerminal()
					+ '&currency=' + $rootScope.currency
					+ '&filterAnalitic=' + $scope.filterAnalitic
					+ '&token=' + $window.sessionStorage.token
					+ '&fromSchema=' + $window.sessionStorage.schemaName);
		}else{
			window.open($rootScope.baseUrl + 'reports/vendasAnalitico?type='+ type + '&initialDate='+ $scope.checkDateInitial($scope.dataInicial)  + '&finalDate='+ $scope.checkDateFinal($scope.dataFinal)
					+ '&dataType=' + $scope.dataType.number + '&exibitionMode=' + $scope.exibitionMode + '&weekDay=' + weekDay
					+ '&acquirers=' + $scope.acquirersSearch + '&brands=' + $scope.brandsSearch + '&products=' + $scope.productsSearch
					+ '&installments=' + $scope.installmentsSearch + '&settlements=' + $scope.settlementsSearch
					+ '&terminals=' + $scope.terminalsSearch
					+ '&tipoTerminal=' + $scope.getTipoTerminal()
					+ '&currency=' + $rootScope.currency
					+ '&filterAnalitic=' + $scope.filterAnalitic
					+ '&token=' + $window.sessionStorage.token
					+ '&fromSchema=' + $window.sessionStorage.schemaName);
		}
	};

	$scope.gerarDuplicadas = function(type) {
		//Dia da semana
		var weekDay = null;

		if (angular.isDefined(this.weekDay)) {
			weekDay = this.weekDay.number;
		}

		//Se for null, nao envia o parametro
		if(weekDay == null){
			window.open($rootScope.baseUrl + 'reports/vendasDuplicadas?type='+ type + '&initialDate='+ $scope.checkDateInitial($scope.dataInicial)  + '&finalDate='+ $scope.checkDateFinal($scope.dataFinal)
					+ '&dataType=' + $scope.dataType.number + '&exibitionMode=' + $scope.exibitionMode
					+ '&acquirers=' + $scope.acquirersSearch + '&brands=' + $scope.brandsSearch + '&products=' + $scope.productsSearch
					+ '&installments=' + $scope.installmentsSearch + '&settlements=' + $scope.settlementsSearch
					+ '&terminals=' + $scope.terminalsSearch
					+ '&currency=' + $rootScope.currency
					+ '&token=' + $window.sessionStorage.token
					+ '&fromSchema=' + $window.sessionStorage.schemaName);
		}else{
			window.open($rootScope.baseUrl + 'reports/vendasDuplicadas?type='+ type + '&initialDate='+ $scope.checkDateInitial($scope.dataInicial)  + '&finalDate='+ $scope.checkDateFinal($scope.dataFinal)
					+ '&dataType=' + $scope.dataType.number + '&exibitionMode=' + $scope.exibitionMode + '&weekDay=' + weekDay
					+ '&acquirers=' + $scope.acquirersSearch + '&brands=' + $scope.brandsSearch + '&products=' + $scope.productsSearch
					+ '&installments=' + $scope.installmentsSearch + '&settlements=' + $scope.settlementsSearch
					+ '&terminals=' + $scope.terminalsSearch
					+ '&currency=' + $rootScope.currency
					+ '&token=' + $window.sessionStorage.token
					+ '&fromSchema=' + $window.sessionStorage.schemaName);
		}
	};

	$scope.gerarTaxasDivergentes = function(type){

		window.open($rootScope.baseUrl + 'reports/taxasDivergentes?type='+ type + '&initialDate='+ $scope.checkDateInitial($scope.dataInicial) + '&finalDate='+ $scope.checkDateFinal($scope.dataFinal)
				+ '&acquirers=' + $scope.acquirersSearch + '&settlements=' + $scope.settlementsSearch
				+ '&currency=' + $rootScope.currency
				+ '&margemTolerancia=' + $scope.opcaoRelatorioCustos
				+ '&valorTolerancia=' + $scope.valorDivergencia
				+ '&token=' + $window.sessionStorage.token
				+ '&fromSchema=' + $window.sessionStorage.schemaName);
	};

	$scope.gerarTaxasConectividade = function(type){

		window.open($rootScope.baseUrl + 'reports/taxasConectividade?type='+ type + '&initialDate='+ $scope.checkDateInitial($scope.dataInicial) + '&finalDate='+ $scope.checkDateFinal($scope.dataFinal)
				+ '&acquirers=' + $scope.acquirersSearch + '&settlements=' + $scope.settlementsSearch
				+ '&currency=' + $rootScope.currency
				+ '&token=' + $window.sessionStorage.token
				+ '&fromSchema=' + $window.sessionStorage.schemaName);
	};

	$scope.clearAdvancedFilterCustos = function() {
		$scope.acquirer = this.acquirer = '';
		$scope.settlement = this.settlement = '';
		$scope.acquirersSelected = this.acquirersSelected = [];
		$scope.settlementsSelected = this.settlementsSelected = [];
		$scope.acquirersSearch = this.acquirersSearch = [];
		$scope.settlementsSearch = this.settlementsSearch = [];
		$scope.valorDivergencia = this.valorDivergencia = 0;
	};
});
