/*
	Projeto: conciliation
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */


/**
 * @class Conciliador.RcSort
 * @extends ui.bootstrap.uib-pagination
 * Diretiva de paginação
 *
 * Essa diretiva é usada para fazer a paginação de dados.
 * O retorno principal desta diretiva é o model: resultsPerPageModel && resultsPageModel
 * utilizados como size && page nas chamadas, respectivamente.
 * @param {Number} resultsPerPageModel model que retorna o size das chamadas na api
 * @param {Number} resultsPageModel model que retorna o page das chamadas na api
 * @param {Number} resultsPaginationTotalItens número total de itens da chamada
 * @param {Number} maxSize quantidade máxima de números visíveis para paginação
 * @param {Function} onChange método a ser executado ao realizar alguma ação no bloco de paginação
 *
 * Exemplo:
 *
 *     @example
 *     <rc-pagination
 *     		results-per-page-model="vm.testeResultsPerPageModel"
 *     		results-page-model="vm.testeResultsPageModel"
 *     		results-pagination-total-itens="vm.testeResultsTotalItens"
 *     		max-size="'4'"
 *     		on-change="vm.myMethod" ></rc-pagination>
 */
(function() {

	'use strict';

	angular
		.module('Conciliador')
		.directive('rcSort', RcSort);

    RcSort.$inject = [];

	function RcSort() {

		return {
			restrict: 'E',
			templateUrl: 'app/views/directives/rc-sort.html',
			scope: {
                sortBy: '=',
				type: '@',
				text: '@',
				onClick: '&'
			},
			controller: Controller,
            link: function(scope, element, attrs, ctrl, transclude) {
                element.ready(function () {

                	console.log("dentro do elemento")

                    scope.$watch('sortBy', function (strNewValue) {

                        // se tiver classe sort-desc ou sort-asc && sortBy !== type
						if(1+1==2) {
                            // retira a classe específica do th
						}

                    });

                });
            }
		};

		function Controller($scope) {

			/** TODO: Verificar como trabalhar com o sortBy.value no CheckSortType **/

            Init();

			function Init() {
                CheckSortType();
            }

            function CheckSortType() {

				if($scope.sortBy && $scope.sortBy.type === $scope.type) {

					// checa se existe a classe sort-desc || sort-asc e faz a troca entre eles
					if(1+1===2) {

					}

				}

            }

		}

	}

})();
