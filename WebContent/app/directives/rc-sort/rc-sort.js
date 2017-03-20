/*
	Projeto: conciliation
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */


/**
 * @class Conciliador.RcSort
 * Diretiva de ordenaçao
 *
 * Essa diretiva é usada para fazer a ordenação de dados.
 * O retorno principal desta diretiva é o model: sortBy.
 * O objeto sortBy deve ter 2 argumentos: type && order, onde type é o nome do campo de sorte e order é ASC ou DESC.
 * @param {Object} sortBy objeto de 2 vias para ser alterado o resultado
 * @param {String} sortType nome do campo para alterar no objeto sortBy ao ser clicado
 * @param {Function} sortOnClick método a ser executado ao realizar quando a ordenação for clicada
 *
 * Exemplo:
 *
 *     @example
 *     <th rc-sort sort-type="hour" sort-by="sort" sort-on-click="getDetails()">
 */
(function() {

	'use strict';

	angular
		.module('Conciliador')
		.directive('rcSort', RcSort);

	RcSort.$inject = [];

	function RcSort() {

		return {
			restrict: 'A',
			scope: {
				sortBy: '=',
				sortType: '@',
				sortOnClick: '&'
			},
			controller: Controller,
			link: Link
		};

		function Link(scope, element) {

			scope.sortElement = element[0];
			scope.sortElement.classList.add('rc-sort');

			element.ready(function () {

				scope.verifyActiveSortBy();

				scope.$watch('sortBy.type', function () {
					if((scope.hasClassOnElement(scope.strDescClass) || scope.hasClassOnElement(scope.strAscClass)) && scope.sortBy.type !== scope.sortType) {
						scope.removeClassFromElement(scope.strAscClass);
						scope.removeClassFromElement(scope.strDescClass);
					}
				});

				element.on('click', function() {
					scope.changeSortObject();
					scope.checkSortType();
					scope.sortOnClick();
				});

			});

		}

		function Controller($scope) {

			$scope.checkSortType = CheckSortType;
			$scope.changeSortObject = ChangeSortObject;
			$scope.hasClassOnElement = HasClassOnElement;
			$scope.removeClassFromElement = RemoveClassFromElement;
			$scope.addClassOnElement = AddClassOnElement;
			$scope.verifyActiveSortBy = VerifyActiveSortBy;
			$scope.strDescClass = 'sort-desc';
			$scope.strAscClass = 'sort-asc';

			Init();

			function Init() {
			}

			/**
			 * @method CheckSortType
			 * Verifica se é o Sort ativo e adiciona ou remove as classes de sort.
			 */
			function CheckSortType() {

				if($scope.sortBy && $scope.sortBy.type === $scope.sortType) {
					if(HasClassOnElement($scope.strDescClass)) {
						RemoveClassFromElement($scope.strDescClass);
						AddClassOnElement($scope.strAscClass);
					} else {
						RemoveClassFromElement($scope.strAscClass);
						AddClassOnElement($scope.strDescClass);
					}

				} else {
					RemoveClassFromElement($scope.strDescClass);
					RemoveClassFromElement($scope.strAscClass);
				}

			}

			/**
			 * @method ChangeSortObject
			 * Modifica o objeto na camada da diretiva e na camada de origem.
			 */
			function ChangeSortObject() {
				$scope.sortBy.type = $scope.sortType;
				$scope.sortBy.order = HasClassOnElement($scope.strDescClass) ? 'DESC' : 'ASC';
			}

			/**
			 * @method VerifyActiveSortBy
			 * Verifica se é o sortBy ativo
			 */
			function VerifyActiveSortBy() {

				var strInitialClass;

				if($scope.sortBy.type === $scope.sortType) {
					strInitialClass = $scope.sortBy.order === "DESC" ? $scope.strDescClass : $scope.strAscClass;
					AddClassOnElement(strInitialClass);
				}

			}

			/**
			 * @method HasClassOnElement
			 * Verifica se existe a classe no elemento principal
			 *
			 * @param {String} strClass nome da classe para verificar a existência
			 */
			function HasClassOnElement(strClass) {
				return $scope.sortElement.classList.contains(strClass);
			}

			/**
			 * @method RemoveClassFromElement
			 * Remove a classe do elemento principal
			 *
			 * @param {String} strClass nome da classe para deletar do elemento
			 */
			function RemoveClassFromElement(strClass) {
				$scope.sortElement.classList.remove(strClass);
			}

			/**
			 * @method AddClassOnElement
			 * Adiciona a classe do elemento principal
			 *
			 * @param {String} strClass nome da classe para adicionar no elemento
			 */
			function AddClassOnElement(strClass) {
				console.log(strClass);
				$scope.sortElement.classList.add(strClass);
			}

		}

	}

})();
