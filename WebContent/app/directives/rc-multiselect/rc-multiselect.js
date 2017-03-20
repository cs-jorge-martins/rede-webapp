/*
	Projeto: conciliation
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

(function() {

	angular
		.module('Conciliador')
		.directive('rcMultiselect', RcMultiselect);

	function RcMultiselect() {
		return {
			restrict: 'E',
			templateUrl: 'app/views/directives/rc-multiselect.html',
			scope: {
				model: '=',
				data: '=',
				label: '=',
				events: '=',
				placeholder: '=',
				singleSelection: '=',
				buttonMaxItems: '=',
                tooltipText: '=?',
                searchFilter: '=?',
                groupBy: '@?'
			},
			controller: Controller
		};

		function Controller($scope) {

			Init();

			function Init() {

				$scope.settings = {
					showCheckAll: true,
					showUncheckAll: true,
					smartButtonMaxItems: 3,
					displayProp: 'label',
					externalIdProp: ''
				};

				if ($scope.placeholder) {
					$scope.customText = {
						buttonDefaultText: $scope.placeholder
					};
				}

				if ($scope.label === "número do estabelecimento") {
					$scope.settings = {
						showCheckAll: true,
						showUncheckAll: true,
						smartButtonMaxItems: 3,
						displayProp: 'label',
						externalIdProp: '',
						groupByTextProvider: function (group) {
							if (group === 1) {
								return 'Rede';
							} else {
								return 'Cielo';
							}
						}
					};
				}

				if ($scope.label === "conta") {
					$scope.settings = {
						selectionLimit: 1,
						closeOnSelect: true,
						showCheckAll: true,
						showUncheckAll: false,
						displayProp: 'label',
						externalIdProp: ''
					};
				}
				if ($scope.label === "tipo de relatório") {
					$scope.settings = {
						selectionLimit: 1,
						closeOnSelect: true,
						showCheckAll: false,
						showUncheckAll: false,
						displayProp: 'label',
						externalIdProp: ''
					};
				}

				if ($scope.buttonMaxItems) {
					$scope.settings.smartButtonMaxItems = $scope.buttonMaxItems;
				} else {
					$scope.settings.smartButtonMaxItems = 3;
				}

			}
		}
	}

})();
