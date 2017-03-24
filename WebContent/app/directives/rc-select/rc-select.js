/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */


/**
 * @class Conciliador.rcSelect
 * Diretiva de select
 *
 * Essa diretiva é usada para fazer o dropdown com itens para seleção
 * O retorno principal desta diretiva é o: model, que são os itens selecionados.
 * Deve ser passado também um array data com todos os itens possíveis para a seleção
 * @param {String} label é o label principal do componente
 * @param {String} place-holder-label nome principal do
 * @param {Array} model array com objetos selecionados que tenham os parâmetros: label e id
 * @param {Array} data array com todos os objetos possíveis para a seleção. Elas devem ter os parâmetros: label e id
 * @param {Boolean} pvList para a opção customizada de pvList deve ser passado o atributo como true
 * @param {*} checkAndUncheckAll objeto ou booleano para aparecer as opções de selecionar todos e deselecionar todos
 *
 * Exemplo:
 *
 *     @example
 *     <rc-select label="número do estabelecimento" place-holder-label="estabelecimento" model="filter.pvsModel" data="filter.pvsData" pvList="true"></rc-select>
 */

"use strict";

(function() {

	angular
		.module('Conciliador')
		.directive('rcSelect', RcSelect);

	RcSelect.$inject = ['modalService'];

	function RcSelect(modalService) {

		return {
			restrict: 'E',
			templateUrl: 'app/views/directives/rc-select.html',
			scope: {
				label: '@',
				placeHolderLabel: '@',
				model: '=',
				data: '=',
				checkAndUncheckAll: '=',
				pvList: '=?'
			},
			controller: Controller,
			controllerAs: 'vm'
		};

		function Controller($scope) {

			var vm = this;
			vm.MakePlaceHolder = MakePlaceHolder;
			vm.OpenPlaceholder = OpenPlaceholder;
			vm.checkAll = CheckAll;
			vm.uncheckAll = UncheckAll;
			vm.checkOrUncheckItem = CheckOrUncheckItem;
			vm.openPvModal = OpenPvModal;

			Init();
			OpenPlaceholder();

			function Init() {

				if($scope.checkAndUncheckAll && typeof($scope.checkAndUncheckAll) === "object") {
					switch($scope.checkAndUncheckAll.defaultType) {
						case 'checkAll':
							CheckAll();
							break;
						default:
							UncheckAll();
							break;
					}
				}

				var clickAnywhere = angular.element(document.querySelector("body"));
						clickAnywhere.bind('click', function() {

							$scope.class = "";

					});

				var ListGroupPvs = angular.element(document.getElementsByClassName("list-group-pvs"));
						ListGroupPvs.bind('click', function($event) {
							
							$event.stopPropagation();

							var boolListPvs = $scope.class = "hide-list";

							if (boolListPvs !== 'false') {
								$scope.class = "show-list";
							}

						});

			}

			/**
			 * @method MakePlaceHolder
			 * retorna a string contendo a sumarização dos itens selecionados.
			 * A string será usada como label do 'select' do componente.
			 *
			 * @param {Array} arrModel model utilizado pelo componente.
			 */
			function MakePlaceHolder(arrModel) {

				var intLength = 0;
				var strLabel = 'todos os ' + $scope.placeHolderLabel + 's';

				if (arrModel && arrModel.length) {

					intLength = arrModel.length;
					strLabel = arrModel[0].label;

					if(intLength > 2) {
						strLabel += ' e outros ' + (arrModel.length - 1 ) + ' '+ $scope.placeHolderLabel + 's';
					} else if(intLength > 1) {
						strLabel +=  ' e outro ' + $scope.placeHolderLabel;
					}

				}

				return strLabel;

			}

			/**
			 * @method CheckItem
			 * adiciona um objeto no $scope.model e adiciona a propriedade
			 * 'checked' ao item, para aplicar o CSS
			 *
			 * @param {Object} objItem objeto para ser adicionado no $scope.model
			 */
			function CheckItem(objItem) {
				$scope.model.push({
					label: objItem.label,
					id: objItem.id
				});
				objItem.checked = true;
			}

			/**
			 * @method UncheckItem
			 * remove um objeto do $scope.model
			 *
			 * @param {Number} objItem objItem que será deselecionado
			 * @param {Number} intIndex número do index do array a ser removido do $scope.model
			 */
			function UncheckItem(objItem, intIndex) {
				if(intIndex !== null && $scope.model.indexOf(intIndex)) {
					$scope.model.splice(intIndex, 1);
				}
				objItem.checked = false;
			}

			/**
			 * @method CheckOrUncheckItem
			 * verifica se deve adicionar ou remover o objeto do $scope.model
			 *
			 * @param {Object} objItem objeto para ser adicionado ou removido do $scope.model
			 */
			function CheckOrUncheckItem(objItem) {

				var objCheckResponse = {
					checked: false,
					index: null
				};

				for(var intIndex = 0; intIndex<$scope.model.length; intIndex ++) {

					if( $scope.model[intIndex].label === objItem.label &&
						$scope.model[intIndex].id === objItem.id) {
						objCheckResponse.checked = true;
						objCheckResponse.index = intIndex;
					}

				}

				if(objCheckResponse.checked && objCheckResponse.index !== null) {
					UncheckItem(objItem, objCheckResponse.index);
				} else {
					CheckItem(objItem);
				}

				$scope.placeHolder = MakePlaceHolder($scope.model);

			}

			/**
			 * @method CheckAll
			 * seleciona todos os itens disponíveis de data e coloca em model
			 */
			function CheckAll() {
				UncheckAll();
				$scope.data.forEach(function (objItem) {
					$scope.model.push(objItem);
					objItem.checked = true;
				});
				$scope.placeHolder = MakePlaceHolder($scope.model);
			}

			/**
			 * @method UncheckAll
			 * deseleciona todos os itens de model
			 */
			function UncheckAll() {
				$scope.data.forEach(function (objItem) {
					objItem.checked = false;
				});
				$scope.model = [];
				$scope.placeHolder = MakePlaceHolder($scope.model);
			}

			/**
			 * @method OpenPlaceholder
			 * Após o click no input ele retorna a listagem de PVs.
			 *
			 */
			function OpenPlaceholder() {

				// $scope.class = "hide-list";

 					$scope.ShowHidePlaceholder = function($event){

 						if ($scope.class === "show-list") {

 							$scope.class = "";
							$event.stopPropagation();

 						} else {

 							$scope.class = "show-list";
							$event.stopPropagation();

 						}

						$event.stopPropagation();

 					};
 			}

			/**
			 * @method OpenPvModal
			 * Ao acionar este método é chamado o Modal com o PVGroupingController
			 *
			 */
			function OpenPvModal() {
				modalService.openFull(
					'agrupamento de estabelecimentos',
					'app/views/pv-grouping.html',
					'PVGroupingController',
					$scope
				);
			}

		}

	}

})();
