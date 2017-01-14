/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.advancedFilterService',[])
	.config(['$routeProvider', function($routeProvider) {

}])

.service('advancedFilterService', function(cacheService) {

	var objAdvancedFilterService = {};

	objAdvancedFilterService.natureza = this.natureza = 0;
	objAdvancedFilterService.tipoTerminal = this.tipoTerminal = 0;

	/**************Inicialização dos objetos para busca*******************************/
	objAdvancedFilterService.acquirer = this.acquirer = '';
	objAdvancedFilterService.brand = this.brand = '';
	objAdvancedFilterService.product = this.product = '';
	objAdvancedFilterService.settlement = this.settlement = '';
	objAdvancedFilterService.terminal = this.terminal = '';
	objAdvancedFilterService.installment = this.installment = '';
	objAdvancedFilterService.account = this.account = '';

	/**************Inicialização de arrays de itens selecionados*******************************/
	objAdvancedFilterService.acquirersSelected = this.acquirersSelected = [];
	objAdvancedFilterService.brandsSelected = this.brandsSelected = [];
	objAdvancedFilterService.productsSelected = this.productsSelected = [];
	objAdvancedFilterService.settlementsSelected = this.settlementsSelected = [];
	objAdvancedFilterService.terminalsSelected = this.terminalsSelected = [];
	objAdvancedFilterService.installmentsSelected = this.installmentsSelected = [];
	objAdvancedFilterService.accountsSelected = this.accountsSelected = [];

	/**************Inicialização de arrays de ids para busca*******************************/
	objAdvancedFilterService.acquirersSearch = this.acquirersSearch = [];
	objAdvancedFilterService.brandsSearch = this.brandsSearch = [];
	objAdvancedFilterService.productsSearch = this.productsSearch = [];
	objAdvancedFilterService.settlementsSearch = this.settlementsSearch = [];
	objAdvancedFilterService.terminalsSearch = this.terminalsSearch = [];
	objAdvancedFilterService.installmentsSearch = this.installmentsSearch = [];
	objAdvancedFilterService.accountsSearch = this.accountsSearch = [];
	objAdvancedFilterService.filterClick = this.filterClick = false;
	objAdvancedFilterService.additionalInformations = this.additionalInformations = false;

	objAdvancedFilterService.GetProducts = function() {
		return cacheService.GetProducts();
	};

	objAdvancedFilterService.GetSettlements = function() {
		return cacheService.GetSettlements();
	};

	/****************************************Funções do auto complete de Produto*****************************************/

	objAdvancedFilterService.AddProductsSearch = function(value) {
		objAdvancedFilterService.product = this.product = '';
		objAdvancedFilterService.productsSelected = this.productsSelected = objAdvancedFilterService.AddItemSearch(value, this.productsSelected, this.productsSearch);
	};

	objAdvancedFilterService.RemoveProductsSearch = function(value) {
		objAdvancedFilterService.productsSelected.splice(this.productsSelected.indexOf(value), 1);
		objAdvancedFilterService.productsSearch.splice(this.productsSearch.indexOf(value.id), 1);
	};

	/****************************************Funções do auto complete de Unidades*****************************************/

	objAdvancedFilterService.AddSettlementsSearch = function(value) {
		objAdvancedFilterService.settlement = this.settlement = '';
		objAdvancedFilterService.settlementsSelected = this.settlementsSelected = objAdvancedFilterService.AddItemSearch(value, this.settlementsSelected, this.settlementsSearch);
	};

	objAdvancedFilterService.RemoveSettlementsSearch = function(value) {
		objAdvancedFilterService.settlementsSelected.splice(this.settlementsSelected.indexOf(value), 1);
		objAdvancedFilterService.settlementsSearch.splice(this.settlementsSearch.indexOf(value.id), 1);
	};

	/****************************************Funções do auto complete de Parcelas*****************************************/

	objAdvancedFilterService.installments = [
	                       {id: 0, name:'Débito', number:0},
	                       {id: 1, name:'Rotativo', number:1},
	                       {id: 2, name:'2x', number:2},
	                       {id: 3, name:'3x', number:3},
	                       {id: 4, name:'4x', number:4},
	                       {id: 5, name:'5x', number:5},
	                       {id: 6, name:'6x', number:6},
	                       {id: 7, name:'7x', number:7},
	                       {id: 8, name:'8x', number:8},
	                       {id: 9, name:'9x', number:9},
	                       {id: 10, name:'10x', number:10},
	                       {id: 11, name:'11x', number:11},
	                       {id: 12, name:'12x', number:12},
	                       {id: 13, name:'13x', number:13},
	                       {id: 14, name:'14x', number:14},
	                       {id: 15, name:'15x', number:15},
	                       {id: 16, name:'16x', number:16},
	                       {id: 17, name:'17x', number:17},
	                       {id: 18, name:'18x', number:18},
	                       {id: 19, name:'19x', number:19},
	                       {id: 20, name:'20x', number:20},
	                       {id: 21, name:'21x', number:21},
	                       {id: 22, name:'22x', number:22},
	                       {id: 23, name:'23x', number:23},
	                       {id: 24, name:'24x', number:24},
	                      ];

	/************************************************Botão e logica para pegar ids para pesquisa************************************/

	objAdvancedFilterService.LoadParamsByFilter = function(){
		objAdvancedFilterService.natureza = this.natureza = 0;
		objAdvancedFilterService.tipoTerminal = this.tipoTerminal = 0;

		/**************Inicialização dos objetos para busca*******************************/
		objAdvancedFilterService.acquirer = this.acquirer = '';
		objAdvancedFilterService.brand = this.brand = '';
		objAdvancedFilterService.product = this.product = '';
		objAdvancedFilterService.settlement = this.settlement = '';
		objAdvancedFilterService.terminal = this.terminal = '';
		objAdvancedFilterService.installment = this.installment = '';
		objAdvancedFilterService.account = this.account = '';

		/**************Inicialização de arrays de itens selecionados*******************************/
		objAdvancedFilterService.acquirersSelected = this.acquirersSelected = [];
		objAdvancedFilterService.brandsSelected = this.brandsSelected = [];
		objAdvancedFilterService.productsSelected = this.productsSelected = [];
		objAdvancedFilterService.settlementsSelected = this.settlementsSelected = [];
		objAdvancedFilterService.terminalsSelected = this.terminalsSelected = [];
		objAdvancedFilterService.installmentsSelected = this.installmentsSelected = [];
		objAdvancedFilterService.accountsSelected = this.accountsSelected = [];

		/**************Inicialização de arrays de ids para busca*******************************/
		objAdvancedFilterService.acquirersSearch = this.acquirersSearch = [];
		objAdvancedFilterService.brandsSearch = this.brandsSearch = [];
		objAdvancedFilterService.productsSearch = this.productsSearch = [];
		objAdvancedFilterService.settlementsSearch = this.settlementsSearch = [];
		objAdvancedFilterService.terminalsSearch = this.terminalsSearch = [];
		objAdvancedFilterService.installmentsSearch = this.installmentsSearch = [];
		objAdvancedFilterService.accountsSearch = this.accountsSearch = [];

		objAdvancedFilterService.filterClick = this.filterClick = false;
	};

	objAdvancedFilterService.AddItemSearch = function(value, listSelected, listSearch){
		var bolValidate = false;

		if (value !== "") {
			if(listSelected.length != 0){
				angular.forEach(listSelected, function(item, index){
					if(item.id === value.id){
						bolValidate = true;
					}
				});
				if(!bolValidate){
					listSelected.push(value);
					listSearch.push(value.id);
					bolValidate = false;
				}
			}else{
				listSearch.push(value.id);
				listSelected.push(value);
			}
		}

		return listSelected;
	};

	objAdvancedFilterService.GetPlaceholder = function(listSelected){
		if(listSelected.length > 0){
			return listSelected.length + ' item(s) selecionado(s)';
		}else{
			// return 'TODAS';
			return 'Número do estabelecimento';
		}
	};



	objAdvancedFilterService.GetPlaceholderFlag = function(listSelected) {
		if (listSelected.length > 0) {
			return listSelected.length + " bandeira(s) selecionada(s)";
		} else {
			return "Bandeira"
		}
	}

	return objAdvancedFilterService;
});
