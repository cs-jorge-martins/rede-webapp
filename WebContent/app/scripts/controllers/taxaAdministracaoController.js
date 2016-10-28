angular.module('KaplenWeb.taxaAdministracaoController',['ui.bootstrap'])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/taxaAdministracao', {templateUrl: 'app/views/taxaAdministracao.html', controller: 'taxaAdministracaoController'});
}])

.controller('taxaAdministracaoController', function(menuFactory, $scope, $modal, calendarFactory, $rootScope, taxaAdministracaoService, cacheService, advancedFilterService){
	
	//Extensao do serviço para filtro avançado
	angular.extend($scope, advancedFilterService);
	$scope.loadParamsByFilter();
		
	var company = '';
	if (angular.isDefined($rootScope.company)) {
		company = $rootScope.company;
	}
	
	var settlementSelected = null;
	var acquirerSelected = null;
	var installmentSelected = null;
	
	$scope.search = false;
	
	$scope.installments = [
	                       {name:'Débito', number:0},
	                       {name:'Rotativo', number:1},
	                       {name:'2x', number:2},
	                       {name:'3x', number:3},
	                       {name:'4x', number:4},
	                       {name:'5x', number:5},
	                       {name:'6x', number:6},
	                       {name:'7x', number:7},
	                       {name:'8x', number:8},
	                       {name:'9x', number:9},
	                       {name:'10x', number:10},
	                       {name:'11x', number:11},
	                       {name:'12x', number:12},
	                       {name:'13x', number:13},
	                       {name:'14x', number:14},
	                       {name:'15x', number:15},
	                       {name:'16x', number:16},
	                       {name:'17x', number:17},
	                       {name:'18x', number:18},
	                       {name:'19x', number:19},
	                       {name:'20x', number:20},
	                       {name:'21x', number:21},
	                       {name:'22x', number:22},
	                       {name:'23x', number:23},
	                       {name:'24x', number:24},
	                      ];
		
	$scope.validatePreConditions = function(){
				
		if (!angular.isDefined(this.acquirer)) {
			$scope.alerts =  [ { type: "danger", msg: "Selecione a operadora."} ];
			return false;
		}
		
		if (!angular.isDefined(this.settlement)) {
			$scope.alerts =  [ { type: "danger", msg: "Selecione a loja."} ];
			return false;
		}
		
		if (!angular.isDefined(this.installment)) {
			$scope.alerts =  [ { type: "danger", msg: "Selecione a quantidade de parcelas."} ];
			return false;
		}
		
		$scope.alerts =  [];
		return true;
	};
	
	$scope.searchProducts = function(){
		$scope.search = false;
		
		$scope.validatePreConditions();
		
		if (angular.isDefined(this.acquirer)) {
			acquirerSelected = this.acquirer;
		}
		
		if (angular.isDefined(this.settlement)) {
			settlementSelected = this.settlement;
		}
		
		if (angular.isDefined(this.installment)) {
			installmentSelected = this.installment;
		}
		
		taxaAdministracaoService.searchProducts(settlementSelected.id, acquirerSelected.id, installmentSelected.number).then(function(products){
			if(products.length == 0){
				$scope.alerts =  [ { type: "danger", msg: "Não existem produtos das vendas cadastradas para a loja selecionada."} ];
			}else{
				$scope.productsTaxes = products;
				$scope.search = true;
				$scope.installmentsColumns = [];
				
				angular.forEach($scope.installments, function(installmentObj, index){
					if(index <= installmentSelected.number){
						$scope.installmentsColumns.push(installmentObj.name);
					}
				});
			}
		});
	};
	
	var editavel = new Array();
	
	$scope.checkEditDisable = function (productId, indexArray) {
		var index = productId + "" + indexArray;
		
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
	
	$scope.checkEditActive = function (productId, indexArray) {
		var index = productId + "" + indexArray;
		
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
	
	$scope.editProduct = function (productId, valueTax, indexArray, isChanged) {
		var index = productId + "" + indexArray;
		if(editavel[index] == true){
			editavel[index] = false;
		}else{
			editavel[index] = true;
		}
		
		if(isChanged){
			var item = {settlementId: settlementSelected.id, acquirerId: acquirerSelected.id, productId: productId, plan: indexArray + 1, valueTax: valueTax};
			taxaAdministracaoService.saveTax(item);
		}
	};
	
	$scope.changeComboSelect = function() {
		$scope.search = false;
	};

	$scope.modalCopySettlement = function () {
	    var modalInstance = $modal.open({
	    	templateUrl: 'copiarTaxas.html',
	    	controller: taxCopyController
	    });
	};	
	  
	var taxCopyController = function ($scope, $http, $modalInstance, Restangular, advancedFilterService) {
		//Extensao do serviço para filtro avançado
		angular.extend($scope, advancedFilterService);
		$scope.loadParamsByFilter();
		
		$scope.finish = false;

		$scope.ok = function () {
			$modalInstance.close($scope.selected.item);
		};
		
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
		
		$scope.copyToSettlements = function() {
			var a = JSON.stringify($scope.productsTaxes);
			taxaAdministracaoService.copyTaxesForSettlements(a, $scope.settlementsSearch).then(function(message){
				var msgComplement = "Erro ao tentar copiar para a(s) loja(s). A loja " + settlementSelected.name +"," + settlementSelected.cnpj + " é a mesma da tela anterior. Favor removê-la e tentar novamente.";
				
				if(message != null && message == 'erro'){
					$scope.alerts =  [ { type: "danger", msg: msgComplement} ];
				}else{
					$scope.alerts =  [ { type: "success", msg: "Cópia realizada com sucesso!"} ];
				}
			}); 
		};
	};
	
});

