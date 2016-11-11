/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.salesDetailsController',['ui.bootstrap'])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/sales/details', {templateUrl: 'app/views/sales-details.html', controller: 'salesDetailsController'});
}])

.controller('salesDetailsController', function(menuFactory, $rootScope, $scope, $modal, calendarFactory, $timeout, cacheService,
			resumoConciliacaoService, transactionsService, dashboardService, installmentsService, kaplenAdminService, $window,
			userService, integrationService, advancedFilterService, calendarService, Restangular, $location, TransactionService){

	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.loadParamsByFilter();

	menuFactory.setActiveResumoConciliacao();

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
	$scope.concilieItemsId = [];

	$scope.maxSize = 4;

	$scope.totalItensPage = 10;
	$scope.currentPage = 0;
	$scope.totalItens = 0;

	$scope.sort = "";

	$scope.activeButtonConcilied = ActiveButtonConcilied;
	$scope.checkItem = CheckItem;
	$scope.checkAllItensModal = CheckAllItensModal;
	$scope.conciliarVendas = ConciliarVendas;
	$scope.orderColumn = OrderColumn;
	$scope.alterTotalItensPage = AlterTotalItensPage;
	$scope.cancel = Cancel;
	$scope.comprovanteVenda = ComprovanteVenda;

	$scope.pageChanged = PageChanged;
	$scope.totalItensPageChanged = TotalItensPageChanged;
	$scope.sortResults = SortResults;

	Init();
	function Init() {

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

			GetTransactionDetails();
		}

		$scope.selectItemToConcilie = SelectItemToConcilie;
		$scope.concilie = Concilie;
		$scope.back = Back;
		$scope.isConcilieButtonActive = false;
		$scope.concilieItems = [];

	}

	function Concilie() {
		var toConcilie = [];
		for(item in $scope.concilieItems) {
			toConcilie.push($scope.concilieItems[item].id);
		}

		if(toConcilie.length) {

			var	modalInstance = $modal.open ({
				templateUrl: 'app/views/resumo-conciliacao/confirma-conciliacao.html',
				scope: $scope,
				controller: function($scope, $modalInstance){
					$scope.ok = Ok;
					$scope.cancel = Cancel;

					function Ok() {
						TransactionService.ConcilieTransaction({
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

							Init();
						});
						$modalInstance.dismiss("cancel");
						$modal.open({
							templateUrl: "app/views/resumo-conciliacao/success-conciliacao.html",
							scope: $scope,
							size: 'sm',
							controller: function($scope, $modalInstance){
								$scope.cancel = Cancel;
								function Cancel() {
									$modalInstance.dismiss("cancel");
								}
							}
						})
					};

					function Cancel() {
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

	function Back(){
		$location.path('/sales');
	}

	function SelectItemToConcilie(item) {
		var index = $scope.concilieItems.indexOf(item);

		if (index > -1) {
			$scope.concilieItems.splice(index, 1);
		} else {
			$scope.concilieItems.push(item);
			$scope.concilieItemsId.push(item.id);
		}

		if($scope.concilieItems.length) {
			$scope.isConcilieButtonActive = true;
		} else {
			$scope.isConcilieButtonActive = false;
		}
	}

	function GetTransactionDetails() {

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

		TransactionService.GetTransactionByFilter({
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
				Back();
			}
		});
	}


	$scope.totalItensPage = "10";

	$scope.order = 1; // asc
	$scope.column = "gross"; // default

	var itensSelected = [];
	$scope.checkAll = false;
	$scope.currentPage = 0;

	var modalUpdated = false;
	var transactionStatus = [];

	var checkedItem = false;
	var checkedAll = false;

	$scope.button = false;

	function ActiveButtonConcilied() {
		if(checkedAll || checkedItem){
			$scope.buttonConcilied = false;
			$scope.button = true;
		}else{
			$scope.buttonConcilied = true;
			$scope.button = false;
		}
	};

	function CheckItem(item){
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
		ActiveButtonConcilied();
	};

	function CheckAllItensModal(checkAll, item) {
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
		ActiveButtonConcilied();
	};

	function ConciliarVendas(){
		if(itensSelected.length > 0){
			this.checkAll = false;
			$scope.button = false;
			$scope.buttonConcilied = true;

			resumoConciliacaoService.reconciliateTransactionModal(itensSelected).then(function() {
				modalUpdated = true;
				resumoConciliacaoService.setConcilied(true);
			});
		}
	};

	function OrderColumn(column) {

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
	};

	function AlterTotalItensPage() {
		this.currentPage = $scope.currentPage = 0;
		$scope.totalItensPage = this.totalItensPage;
	};

	function Cancel() {
		$modalInstance.dismiss('cancel');
	};

	function ComprovanteVenda(item) {
		var modalInstance = $modal.open({
			templateUrl: 'app/views/resumo-conciliacao/comprovante-venda.html',
			controller: ModalComprovanteVendas,
			size:'sm',
			resolve: {
				item: function(){
					return item;
				}
			}
		});
	};

	function ModalComprovanteVendas($scope, $modalInstance, item) {
		$scope.item = item;
		$scope.cancel = Cancel;
		$scope.imprimir = Imprimir;

		function Cancel() {
			$modalInstance.dismiss('cancel');
		};

		function Imprimir() {
			window.print();
		};

	};

	/* pagination */
	function PageChanged() {
		$scope.currentPage = this.currentPage;
		GetTransactionDetails();
	};

	function TotalItensPageChanged() {
		this.currentPage = $scope.currentPage = 0;
		$scope.totalItensPage = this.totalItensPage;
		GetTransactionDetails();
	};

	function SortResults(elem,kind) {
		var order_string;
		order_string = $rootScope.sortResults(elem,kind);

		$scope.sort = order_string;
		GetTransactionDetails();
	};

});
