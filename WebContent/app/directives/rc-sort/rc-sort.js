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
            link: Link
		};

		function Link(scope, element) {

            var objTh = element[0];
            objTh.classList.add('rc-sort');

            var strDescClass = 'sort-desc';
            var strAscClass = 'sort-asc';
            var bolHasDescClass = objTh.classList.contains(strDescClass);
            var bolHasAscClass = objTh.classList.contains(strAscClass);

            element.ready(function () {

                scope.$watch('sortBy.type', function (strNewValue) {

                    bolHasDescClass = objTh.classList.contains(strDescClass);
                    bolHasAscClass = objTh.classList.contains(strAscClass);

                    if((bolHasAscClass || bolHasDescClass) && scope.sortBy.type !== scope.sortType) {
                        objTh.classList.remove(strAscClass);
                        objTh.classList.remove(strDescClass);
                    }

                });

                element.on('click', function() {
                    ChangeSortObject();
                    CheckSortType();
                    scope.sortOnClick();
                });

            });

            Init();

			function Init() {
                CheckSortType();
            }

            function CheckSortType() {

                bolHasDescClass = element[0].classList.contains(strDescClass);

				if(scope.sortBy && scope.sortBy.type === scope.sortType) {

					if(bolHasDescClass) {
						objTh.classList.remove(strDescClass);
						objTh.classList.add(strAscClass);
					} else {
                        objTh.classList.remove(strAscClass);
                        objTh.classList.add(strDescClass);
					}

				} else {
                    objTh.classList.remove(strDescClass);
                    objTh.classList.remove(strAscClass);
                }

            }

            function ChangeSortObject() {
                scope.sortBy.type = scope.sortType;
                scope.sortBy.order = bolHasDescClass ? 'DESC' : 'ASC';
            }

		}

	}

})();
