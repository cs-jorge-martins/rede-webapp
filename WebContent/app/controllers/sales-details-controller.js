/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.salesDetailsController',['ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/sales/details', {templateUrl: 'app/views/sales-details.html', controller: 'salesDetailsController'});
}])

.controller('salesDetailsController', function(menuFactory, $rootScope, $scope, $uibModal, calendarFactory, $timeout, cacheService,
			dashboardService, kaplenAdminService, $window,
			integrationService, advancedFilterService, calendarService, $location, TransactionService){

	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.LoadParamsByFilter();

	menuFactory.setActiveResumoConciliacao();

	var objItensAccordion = $rootScope._dateItemAccordionSelected;

	$scope.statusItemAccordionSelected = $rootScope._statusItemAccordionSelected ;
	$scope.monthNameAbreviation = calendarFactory.getMonthNameAbreviation(objItensAccordion);
	$scope.dayOfActualDate = calendarFactory.getDayOfMonth(objItensAccordion);
	$scope.date = calendarFactory.formatDate(objItensAccordion);
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
	$scope.orderColumn = OrderColumn;
	$scope.alterTotalItensPage = AlterTotalItensPage;
	$scope.cancel = Cancel;
	$scope.comprovanteVenda = ComprovanteVenda;

	$scope.pageChanged = PageChanged;
	$scope.totalItensPageChanged = TotalItensPageChanged;
	$scope.sortResults = SortResults;

	Init();
	function Init() {

		var arrTypes = ["CREDIT","DEBIT"];

		if(!$rootScope.salesDetails) {
			$location.path('/sales');
		} else {
			$scope.currency = $rootScope.salesDetails.currency;
			$scope.startDate = $rootScope.salesDetails.startDate;
			$scope.endDate = $rootScope.salesDetails.endDate;
			$scope.shopIds = $rootScope.salesDetails.shopIds;
			$scope.cardProductIds = $rootScope.salesDetails.cardProductIds;
			$scope.types = arrTypes[$rootScope.salesDetails.natureza];
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
		$scope.confirm = true;
		$scope.success = false;
		var arrToConcilie = [];
		for(var intItem in $scope.concilieItems) {
			arrToConcilie.push($scope.concilieItems[intItem].id);
		}

		if(arrToConcilie.length) {

			var	objModalInstance = $uibModal.open ({
				templateUrl: 'app/views/resumo-conciliacao/confirma-conciliacao.html',
				scope: $scope,
				controller: function($scope, $uibModalInstance){
					$scope.ok = Ok;
					$scope.cancel = Cancel;

					function Ok() {
						TransactionService.ConcilieTransaction({
							ids: arrToConcilie
						}).then(function(objData){
							objData = objData.data.content;
							var arrItems = [];

							for(var item in objData){
								arrItems.push(objData[item]);
							}

							for(var intItem in $scope.items){
								for(var intSubItem in $scope.concilieItems) {
									if( $scope.items[intItem].id ==  $scope.concilieItems[intSubItem].id) {
										$scope.items[intItem].isConciliated = true;
									}
								}
							}
							Init();
							$scope.confirm = false;
							$scope.success = true;
						});
					};

					function Cancel() {
						$uibModalInstance.dismiss("cancel");
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

	function SelectItemToConcilie(objItem) {
		var objIndex = $scope.concilieItems.indexOf(objItem);

		if (objIndex > -1) {
			$scope.concilieItems.splice(objIndex, 1);
		} else {
			$scope.concilieItems.push(objItem);
			$scope.concilieItemsId.push(objItem.id);
		}

		if($scope.concilieItems.length) {
			$scope.isConcilieButtonActive = true;
		} else {
			$scope.isConcilieButtonActive = false;
		}
	}

	function GetTransactionDetails() {

		var arrShopIds = [];
		var arrCardProductIds = [];

		if($scope.shopIds) {
			for(var intItem in $scope.shopIds) {
				arrShopIds.push($scope.shopIds[intItem].id);
			}
		}

		if($scope.cardProductIds) {
			for(var intItem in $scope.cardProductIds) {
				arrCardProductIds.push($scope.cardProductIds[intItem].id);
			}
		}

		if (arrCardProductIds.length == 0) {
			arrCardProductIds.push($scope.cardProduct.id);
		}

		TransactionService.GetTransactionByFilter({
			currency: $scope.currency,
			startDate: calendarFactory.formatDateForService($scope.startDate),
			endDate: calendarFactory.formatDateForService($scope.endDate),
			shopIds: arrShopIds,
			cardProductIds: arrCardProductIds,
			conciliationStatus: $scope.conciliationStatus,
			page: ($scope.currentPage - 1),
			size: $scope.totalItensPage,
			sort: $scope.sort

		}).then(function(objResponse){

			var objPagination = objResponse.data.page;
			var objResponse = objResponse.data.content;

			var arrItems = [];
			var intTotal = 0;

			if(objResponse.length) {
				for(var item in objResponse){
					if($scope.conciliationStatus === 'TO_CONCILIE'){
						objResponse[item].isConciliated = false;
					}

					arrItems.push(objResponse[item]);
					intTotal += objResponse[item].gross;
				}

				$scope.items = arrItems;
				$scope.noItensMsg = $scope.items.length === 0 ? true : false;
				$scope.totalItens = objPagination.totalElements;

			} else {
				Back();
			}
		});
	}


	$scope.totalItensPage = "10";

	$scope.order = 1; // asc
	$scope.column = "gross"; // default

	var arrItensSelected = [];
	$scope.checkAll = false;
	$scope.currentPage = 0;

	var bolCheckedItem = false;
	var bolCheckedAll = false;

	$scope.button = false;

	function ActiveButtonConcilied() {
		if(bolCheckedAll || bolCheckedItem){
			$scope.buttonConcilied = false;
			$scope.button = true;
		}else{
			$scope.buttonConcilied = true;
			$scope.button = false;
		}
	};

	function CheckItem(objItem){
		if(objItem.checked){
			bolCheckedItem = true;
			arrItensSelected.push(objItem);
		}
		else{
			arrItensSelected.splice(arrItensSelected.indexOf(objItem), 1);
			if(arrItensSelected.length > 0){
				bolCheckedItem = true;
			}else{
				bolCheckedItem = false;
			}

		}
		ActiveButtonConcilied();
	};

	function CheckAllItensModal(bolCheckAll, objItem) {
		bolCheckedAll = bolCheckAll;
		if(bolCheckAll){
			angular.forEach($scope.itensDetalheVenda, function(objItem){
				objItem.checked = true;
				arrItensSelected.push(objItem);
			});
		}
		else if(!bolCheckAll){
			angular.forEach($scope.itensDetalheVenda, function(objItem){
				objItem.checked = false;
				arrItensSelected.splice(arrItensSelected.indexOf(objItem), 1);
			});
		}
		ActiveButtonConcilied();
	};

	function OrderColumn(strColumn) {

		var arrColumns = ["nsu", "authorization", "tid", "cardNumber", "installment", "terminalName", "erpId", "gross"];

		angular.forEach(arrColumns, function(strItem, intIndex){

			var objElement = document.getElementById(strItem);

			if(strItem == strColumn){
				 if($scope.order == 1){
					$scope.order = 2;
					objElement.src = "assets/img/cresc.png";
				}else{
					$scope.order = 1;
					objElement.src = "assets/img/dec.png";
				}
			}else{
				objElement.src = "assets/img/default.png";
			}
		});

		$scope.column = strColumn;
	};

	function AlterTotalItensPage() {
		this.currentPage = $scope.currentPage = 0;
		$scope.totalItensPage = this.totalItensPage;
	};

	function Cancel() {
		$uibModalInstance.dismiss('cancel');
	};

	function ComprovanteVenda(item) {
		var objModalInstance = $uibModal.open({
			templateUrl: 'app/views/resumo-conciliacao/comprovante-venda.html',
			controller: ModalComprovanteVendas,
			size:'sm',
			resolve: {
			item: function() {
					return item;
				}
			}
		});
	};

	function ModalComprovanteVendas($scope, $uibModalInstance, item) {
		$scope.item = item;
		$scope.cancel = Cancel;
		$scope.imprimir = Imprimir;

		function Cancel() {
			$uibModalInstance.dismiss('cancel');
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

	function SortResults(objElem, strKind) {
		var strOrderString;
		strOrderString = $rootScope.sortResults(objElem, strKind);

		$scope.sort = strOrderString;
		GetTransactionDetails();
	};

});
