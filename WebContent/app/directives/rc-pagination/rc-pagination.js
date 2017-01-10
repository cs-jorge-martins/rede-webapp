/*
	Projeto: conciliation
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */


/**
 * @class Conciliador.rcPagination
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
		.directive('rcPagination', RcPagination);

    RcPagination.$inject = [];

	function RcPagination() {

		return {
			restrict: 'E',
			templateUrl: 'app/views/directives/rc-pagination.html',
			scope: {
                resultsPerPageModel: '=',
                resultsPageModel: '=',
                resultsPaginationTotalItens: '=',
                maxSize: '=',
                onChange: '&'
			},
			controller: Controller
		};

		function Controller($scope) {

			Init();

			function Init() {

                MakeResultsPerPageOptions();
                CheckResultsPerPageModel();

            }

            /**
             * @method MakeResultsPerPageOptions
             * cria a lógica do resultsPerPageOptions, retornando um array com as opções 10 ou 10,20 ou 10,20,50
             * @return {Array} $scope.resultsPerPageOptions
             */
            function MakeResultsPerPageOptions() {

                $scope.resultsPerPageOptions = [10];

                if($scope.resultsPaginationTotalItens > 10 && $scope.resultsPaginationTotalItens < 50) {
                    $scope.resultsPerPageOptions = [10,20];
				} else if ($scope.resultsPaginationTotalItens >= 50) {
                    $scope.resultsPerPageOptions = [10,20,50];
				}

            }

            /**
             * @method CheckResultsPerPageModel
             * Se não foi setado nenhum resultsPerPageModel ele pega o primeiro resultsPerPageOptions (10)
             * @return {Number} $scope.resultsPerPageModel
             */
            function CheckResultsPerPageModel() {
                $scope.resultsPerPageModel = $scope.resultsPerPageModel ? $scope.resultsPerPageModel : $scope.resultsPerPageOptions[0];
            }

		}
	}

})();
