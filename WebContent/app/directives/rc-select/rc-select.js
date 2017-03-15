/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */


/**
 * @class Conciliador.rcSelect
 * Diretiva de select
 *
 * Exemplo:
 *
 *     @example
 *     <rc-select ></rc-select>
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
			scope: {},
			controller: Controller
		};

		function Controller($scope) {

			Init();
			OpenPlaceholder();

			function Init() {
				$scope.placeHolder = 'teste';
				$scope.label = 'teste';
			}

			function OpenPlaceholder() {

				$scope.IsVisible = false;

        $scope.ShowHidePlaceholder = function () {
            $scope.IsVisible = $scope.IsVisible ? false : true;
        }

			}

		}

	}

})();
