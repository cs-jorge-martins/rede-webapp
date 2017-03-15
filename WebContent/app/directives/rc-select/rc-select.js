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
		.directive('rcSelect', rcSelect);

	rcSelect.$inject = [];

	function rcSelect() {

		return {
			restrict: 'E',
			templateUrl: 'app/views/directives/rc-select.html',
			scope: {
				label: '@',
				placeHolderLabel: '@',
				model: '=',
				data: '='
			},
			controller: Controller
		};

		function Controller($scope) {

			var vm = this;
			vm.MakePlaceHolder = MakePlaceHolder;

			Init();
			OpenPlaceholder();

			function Init() {
			}

			/**
			 * @method MakePlaceHolder
			 * retorna a string correta para adicionar no placeHolder
			 *
			 * @param {Array} arrModel é o array que está dentro do model
			 */
			function MakePlaceHolder(arrModel) {

				var intLength = 0;
				var strLabel = 'nenhum ' + $scope.placeHolderLabel + ' selecionado';

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
