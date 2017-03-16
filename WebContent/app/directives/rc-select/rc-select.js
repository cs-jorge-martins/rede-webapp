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
 * @param {*} checkAndUncheckAll objeto ou booleano para aparecer as opções de selecionar todos e deselecionar todos
 *
 * Exemplo:
 *
 *     @example
 *     <rc-select label="número do estabelecimento" place-holder-label="estabelecimento" model="filter.pvsModel" data="filter.pvsData"></rc-select>
 */

"use strict";

(function() {

	angular
		.module('Conciliador')
		.directive('rcSelect', RcSelect);

	RcSelect.$inject = [];

	function RcSelect() {

		return {
			restrict: 'E',
			templateUrl: 'app/views/directives/rc-select.html',
			scope: {
				label: '@',
				placeHolderLabel: '@',
				model: '=',
				data: '=',
				checkAndUncheckAll: '='
			},
			controller: Controller,
			controllerAs: 'vm'
		};

		function Controller($scope) {

			var vm = this;
			vm.MakePlaceHolder = MakePlaceHolder;
			vm.checkAll = CheckAll;
			vm.uncheckAll = UncheckAll;

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
			 * @method CheckAll
			 * seleciona todos os itens disponíveis de data e coloca em model
			 */
			function CheckAll() {
				UncheckAll();
				$scope.data.forEach(function (objItem) {
					$scope.model.push(objItem);
				});

			}

			/**
			 * @method UncheckAll
			 * deseleciona todos os itens de model
			 */
			function UncheckAll() {
				$scope.model = [];
			}

			// TODO: Analisar a possibilidade de remover esse watcher e colocar a lógica quando o usuário selecionar um item da lista
			$scope.$watch('model', function (arrNewModel) {
				$scope.placeHolder = MakePlaceHolder(arrNewModel);
			});

			function OpenPlaceholder() {

				$scope.IsVisible = false;

				$scope.ShowHidePlaceholder = function () {
					$scope.IsVisible = $scope.IsVisible ? false : true;
				};

			}

		}

	}

})();
