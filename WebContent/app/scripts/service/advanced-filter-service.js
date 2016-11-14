/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.advancedFilterService',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

.service('advancedFilterService', function(cacheService, Restangular) {

	var advancedFilterService = {};

	advancedFilterService.natureza = this.natureza = 0;
	advancedFilterService.tipoTerminal = this.tipoTerminal = 0;

	/**************Inicialização dos objetos para busca*******************************/
	advancedFilterService.acquirer = this.acquirer = '';
	advancedFilterService.brand = this.brand = '';
	advancedFilterService.product = this.product = '';
	advancedFilterService.settlement = this.settlement = '';
	advancedFilterService.terminal = this.terminal = '';
	advancedFilterService.installment = this.installment = '';
	advancedFilterService.account = this.account = '';

	/**************Inicialização de arrays de itens selecionados*******************************/
	advancedFilterService.acquirersSelected = this.acquirersSelected = [];
	advancedFilterService.brandsSelected = this.brandsSelected = [];
	advancedFilterService.productsSelected = this.productsSelected = [];
	advancedFilterService.settlementsSelected = this.settlementsSelected = [];
	advancedFilterService.terminalsSelected = this.terminalsSelected = [];
	advancedFilterService.installmentsSelected = this.installmentsSelected = [];
	advancedFilterService.accountsSelected = this.accountsSelected = [];

	/**************Inicialização de arrays de ids para busca*******************************/
	advancedFilterService.acquirersSearch = this.acquirersSearch = [];
	advancedFilterService.brandsSearch = this.brandsSearch = [];
	advancedFilterService.productsSearch = this.productsSearch = [];
	advancedFilterService.settlementsSearch = this.settlementsSearch = [];
	advancedFilterService.terminalsSearch = this.terminalsSearch = [];
	advancedFilterService.installmentsSearch = this.installmentsSearch = [];
	advancedFilterService.accountsSearch = this.accountsSearch = [];
	advancedFilterService.filterClick = this.filterClick = false;
	advancedFilterService.additionalInformations = this.additionalInformations = false;

	advancedFilterService.GetProducts = function() {
		return cacheService.GetProducts();
	};

	advancedFilterService.GetSettlements = function() {
		return cacheService.GetSettlements();
	};

	/****************************************Funções do auto complete de Produto*****************************************/

	advancedFilterService.AddProductsSearch = function(value) {
		advancedFilterService.product = this.product = '';
		advancedFilterService.productsSelected = this.productsSelected = advancedFilterService.AddItemSearch(value, this.productsSelected, this.productsSearch);
	};

	advancedFilterService.RemoveProductsSearch = function(value) {
		advancedFilterService.productsSelected.splice(this.productsSelected.indexOf(value), 1);
		advancedFilterService.productsSearch.splice(this.productsSearch.indexOf(value.id), 1);
	};

	/****************************************Funções do auto complete de Unidades*****************************************/

	advancedFilterService.AddSettlementsSearch = function(value) {
		advancedFilterService.settlement = this.settlement = '';
		advancedFilterService.settlementsSelected = this.settlementsSelected = advancedFilterService.AddItemSearch(value, this.settlementsSelected, this.settlementsSearch);
	};

	advancedFilterService.RemoveSettlementsSearch = function(value) {
		advancedFilterService.settlementsSelected.splice(this.settlementsSelected.indexOf(value), 1);
		advancedFilterService.settlementsSearch.splice(this.settlementsSearch.indexOf(value.id), 1);
	};

	/****************************************Funções do auto complete de Parcelas*****************************************/

	advancedFilterService.installments = [
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

	advancedFilterService.LoadParamsByFilter = function(){
		advancedFilterService.natureza = this.natureza = 0;
		advancedFilterService.tipoTerminal = this.tipoTerminal = 0;

		/**************Inicialização dos objetos para busca*******************************/
		advancedFilterService.acquirer = this.acquirer = '';
		advancedFilterService.brand = this.brand = '';
		advancedFilterService.product = this.product = '';
		advancedFilterService.settlement = this.settlement = '';
		advancedFilterService.terminal = this.terminal = '';
		advancedFilterService.installment = this.installment = '';
		advancedFilterService.account = this.account = '';

		/**************Inicialização de arrays de itens selecionados*******************************/
		advancedFilterService.acquirersSelected = this.acquirersSelected = [];
		advancedFilterService.brandsSelected = this.brandsSelected = [];
		advancedFilterService.productsSelected = this.productsSelected = [];
		advancedFilterService.settlementsSelected = this.settlementsSelected = [];
		advancedFilterService.terminalsSelected = this.terminalsSelected = [];
		advancedFilterService.installmentsSelected = this.installmentsSelected = [];
		advancedFilterService.accountsSelected = this.accountsSelected = [];

		/**************Inicialização de arrays de ids para busca*******************************/
		advancedFilterService.acquirersSearch = this.acquirersSearch = [];
		advancedFilterService.brandsSearch = this.brandsSearch = [];
		advancedFilterService.productsSearch = this.productsSearch = [];
		advancedFilterService.settlementsSearch = this.settlementsSearch = [];
		advancedFilterService.terminalsSearch = this.terminalsSearch = [];
		advancedFilterService.installmentsSearch = this.installmentsSearch = [];
		advancedFilterService.accountsSearch = this.accountsSearch = [];

		advancedFilterService.filterClick = this.filterClick = false;
	};

	advancedFilterService.AddItemSearch = function(value, listSelected, listSearch){
		var validate = false;

		if (value !== "") {
			if(listSelected.length != 0){
				angular.forEach(listSelected, function(item, index){
					if(item.id === value.id){
						validate = true;
					}
				});
				if(!validate){
					listSelected.push(value);
					listSearch.push(value.id);
					validate = false;
				}
			}else{
				listSearch.push(value.id);
				listSelected.push(value);
			}
		}

		return listSelected;
	};

	advancedFilterService.GetPlaceholder = function(listSelected){
		if(listSelected.length > 0){
			return listSelected.length + ' item(s) selecionado(s)';
		}else{
			// return 'TODAS';
			return 'Número do estabelecimento';
		}
	};



	advancedFilterService.GetPlaceholderFlag = function(listSelected) {
		if (listSelected.length > 0) {
			return listSelected.length + " bandeira(s) selecionada(s)";
		} else {
			return "Bandeira"
		}
	}

	return advancedFilterService;
});
