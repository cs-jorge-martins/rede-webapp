angular.module('Conciliador.salesDetailsController',['ui.bootstrap'])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/sales/details', {templateUrl: 'app/views/salesDetails.html', controller: 'salesDetailsController'});
}])

.controller('salesDetailsController', function(menuFactory, $rootScope, $scope, $modal, calendarFactory, $timeout, cacheService,
			resumoConciliacaoService, transactionsService, dashboardService, installmentsService, kaplenAdminService, $window,
			userService, integrationService, advancedFilterService, calendarService, Restangular, $location, TransactionService){

	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.loadParamsByFilter();

	/*
	$scope.getAdditionalInformations($rootScope.company).then(function(result){
		if(result == "true"){
			$scope.additionalInformations = true;
		}else{
			$scope.additionalInformations = false;
		}
	});
	*/

	/***************************************************************** Ativando o menu de Vendas *****************************************************************/
		menuFactory.setActiveResumoConciliacao();

		if(!$rootScope._acquirer) {
			//$location.path('/sales');
		}

		var acquirerSelected = $rootScope._acquirer;
		var cardBrandSelected = $rootScope._cardBrand;
		var cardProductSelected = $rootScope._cardProduct;

		var dateItensAccordion = $rootScope._dateItemAccordionSelected;
		var settlementsSelected = $rootScope._settlements;
		$scope.statusItemAccordionSelected = $rootScope._statusItemAccordionSelected ;
		resumoConciliacaoService.setConcilied(false);

		$scope.monthNameAbreviation = calendarFactory.getMonthNameAbreviation(dateItensAccordion);
		$scope.dayOfActualDate = calendarFactory.getDayOfMonth(dateItensAccordion);
		$scope.date = calendarFactory.formatDate(dateItensAccordion);
		$scope.items = [];
		$scope.total = 0;
		$scope.concilieItems = [];

		$scope.maxSize = 4;

		$scope.totalItensPage = 10;
		$scope.currentPage = 0;
		$scope.totalItens = 0;

		$scope.sort = "";

		init();

		function init() {

			var types = ["CREDIT","DEBIT"];

			if(!$rootScope.salesDetails) {
				$location.path('/sales');
			} else {
				$scope.currency = $rootScope.salesDetails.currency;
				$scope.startDate = $rootScope.salesDetails.startDate;
				$scope.endDate = $rootScope.salesDetails.endDate;
				$scope.shopIds = $rootScope.salesDetails.shopIds;
				$scope.cardProductIds = $rootScope.salesDetails.cardProductIds;
				$scope.types = types[$rootScope.salesDetails.natureza];
				$scope.acquirer = $rootScope.salesDetails.acquirer;
				$scope.cardProduct = $rootScope.salesDetails.cardProduct;
				$scope.conciliationStatus = $rootScope.salesDetails.conciliationStatus;

				getTransactionDetails();
			}

			$scope.selectItemToConcilie = selectItemToConcilie;
			$scope.concilie = concilie;
			$scope.back = back;
			$scope.isConcilieButtonActive = false;
			$scope.concilieItems = [];

		}

		function concilie() {
			var toConcilie = [];
			for(item in $scope.concilieItems) {
				toConcilie.push($scope.concilieItems[item].id);
			}

			if(toConcilie.length) {

				var	modalInstance = $modal.open ({
					templateUrl: 'app/views/resumoConciliacao/confirmaConciliacao.html',
					scope: $scope,
					controller: function($scope, $modalInstance){
						$scope.ok = function() {
							TransactionService.concilieTransaction({
								ids: toConcilie
							}).then(function(data){
								data = data.data.content;
								var items = [];

								for(var item in data){
									items.push(data[item]);
								}

								for(item in $scope.items){
									for(subItem in $scope.concilieItems) {
										if( $scope.items[item].id ==  $scope.concilieItems[subItem].id) {
											$scope.items[item].isConciliated = true;
										}
									}
								}
								//$scope.$apply();
								init();
							});
							$modalInstance.dismiss("cancel");
							$modal.open({
								templateUrl: "app/views/resumoConciliacao/successConciliacao.html",
								scope: $scope,
								size: 'sm',
								controller: function($scope, $modalInstance){
									$scope.cancel = function() {
										$modalInstance.dismiss("cancel");
									}
								}
							})
						};
						$scope.cancel = function() {
							$modalInstance.dismiss("cancel");
						};
					},
					size: 'md',
					resolve: {
						item: function() {
							return
						}
					}
				});
			}
		}

		function back(){
			$location.path('/sales');
		}

		function selectItemToConcilie(item) {
			var index = $scope.concilieItems.indexOf(item);

			if (index > -1) {
				$scope.concilieItems.splice(index, 1);
			} else {
				$scope.concilieItems.push(item);
			}

			if($scope.concilieItems.length) {
				$scope.isConcilieButtonActive = true;
			} else {
				$scope.isConcilieButtonActive = false;
			}
		}

		function getTransactionDetails() {

			var shopIds = [];
			var cardProductIds = [];

			if($scope.shopIds) {
				for(item in $scope.shopIds) {
					shopIds.push($scope.shopIds[item].id);
				}
			}

			if($scope.cardProductIds) {
				for(item in $scope.cardProductIds) {
					cardProductIds.push($scope.cardProductIds[item].id);
				}
			}

			if (cardProductIds.length == 0) {
				cardProductIds.push($scope.cardProduct.id);
			}

			TransactionService.getTransactionByFilter({
				currency: $scope.currency,
				startDate: calendarFactory.formatDateForService($scope.startDate),
				endDate: calendarFactory.formatDateForService($scope.endDate),
				shopIds: shopIds,
				cardProductIds: cardProductIds,
				conciliationStatus: $scope.conciliationStatus,
				page: ($scope.currentPage - 1),
				size: $scope.totalItensPage,
				sort: $scope.sort

			}).then(function(response){
				
				var pagination = response.data.page;
				var response = response.data.content;

				var items = [];
				var total = 0;

				if(response.length) {
					for(var item in response){
						if($scope.conciliationStatus === 'TO_CONCILIE'){
							response[item].isConciliated = false;
						}

						items.push(response[item]);
						total += response[item].gross;
					}

					$scope.items = items;
					$scope.noItensMsg = $scope.items.length === 0 ? true : false;
					$scope.totalItens = pagination.totalElements;
				} else {
					back();
				}
			});
		}



		$scope.helpModalConciliacao = function(){
			restartModalResumoConcilicaoTour(userService, $rootScope.user);
		};

		$scope.totalItensPage = "10";

		$scope.order = 1; // asc
		$scope.column = "gross"; // default

		var itensSelected = [];
		$scope.checkAll = false;
		$scope.currentPage = 0;

		var modalUpdated = false;
		var transactionStatus = [];

		//loadItens();

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
					//loadItens();
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
					//+ '&status=' + getStatusItemAccordionSelected
					+ '&status=' + $scope.statusItemAccordionSelected
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
			//loadItens();
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
				//$scope.maxSize = maxSizePagination(countSum.qtd, $scope.totalItensPage);

				transactionsService.getTransactionsByFiltersOrdened(dateItensAccordion, dateItensAccordion, $scope.statusItemAccordionSelected, transactionStatus, 0, settlementsSelected,
						acquirerSelected.id, cardBrandSelected.id, cardProductSelected.id, 1, $scope.currentPage, $scope.totalItensPage, $scope.column, $scope.order,
						$scope.natureza ,$scope.terminalsSearch).then(function(itensDetalheVenda) {

					$scope.itensDetalheVenda = itensDetalheVenda;
					$scope.totalAmountDetalheVenda = $scope.countSum.totalValue;
				});
			});
		};

		$scope.alterTotalItensPage = function() {
			this.currentPage = $scope.currentPage = 0;
			$scope.totalItensPage = this.totalItensPage;
			//loadItens();
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

			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};

			$scope.imprimir = function () {
				window.print();
			};

		};

		/* pagination */
		$scope.pageChanged = function () {
			$scope.currentPage = this.currentPage;
			getTransactionDetails();
		};

		$scope.totalItensPageChanged = function () {
			this.currentPage = $scope.currentPage = 0;
			$scope.totalItensPage = this.totalItensPage;
			getTransactionDetails();
		};

		$scope.sortResults = function (elem,kind) {
			var order_string;
			order_string = $rootScope.sortResults(elem,kind);

			$scope.sort = order_string;
			getTransactionDetails();

		};

	});
