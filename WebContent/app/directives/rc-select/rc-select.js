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

	RcSelect.$inject = ['modalService', 'pvService'];

	function RcSelect(modalService, pvService) {

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

			var arrCheckedGroups = [];

			var vm = this;
			vm.MakePlaceHolder = MakePlaceHolder;
			vm.OpenPlaceholder = OpenPlaceholder;
			vm.checkAll = CheckAll;
			vm.uncheckAll = UncheckAll;
			vm.checkOrUncheckItem = CheckOrUncheckItem;
			vm.checkOrUncheckGroup = CheckOrUncheckGroup;
			vm.openPvModal = OpenPvModal;
			vm.groupSelected = GroupSelected;
			vm.pvGroups = [];

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

			function GetPvGroups() {

				pvService.getGroups().then(function (objRes) {

					vm.pvGroups = objRes.data;
					vm.pvGroups.forEach(function (objGroup) {

						// objGroup.checked = false;

						objGroup.pvs.forEach(function (objPv) {

							$scope.data.forEach(function (objDataPv) {

								if (objPv.id === objDataPv.id && objDataPv.groups.indexOf(objGroup.name) < 0) {
									objDataPv.groups.push(objGroup.name);
								}

							});

						});

					});


				});

			}

			$scope.$watch('data', function (objNewValue) {

				if($scope.pvList && objNewValue) {

					$scope.data.forEach(function (objDataPv) {
						objDataPv.groups = [];
					});

					GetPvGroups();

				}

			});



			/**
			 * @method CheckOrUncheckGroup
			 * verifica se deve adicionar ou remover o objeto do $scope.model
			 *
			 * @param {Object} objGroup grupo selecionado
			 */
			function CheckOrUncheckGroup(objGroup) {

				if(!GroupSelected(objGroup.name)) {
					arrCheckedGroups.push(objGroup.name);
				} else {
					var intArrIndex = arrCheckedGroups.indexOf(objGroup.name);
					arrCheckedGroups.splice(intArrIndex, 1);
				}

				var bolGroupInArray = arrCheckedGroups.indexOf(objGroup.name) > -1;

				if(bolGroupInArray) {
					CheckGroup(objGroup.pvs);
				} else {
					UncheckGroup(objGroup.pvs, objGroup.name);
				}

				$scope.placeHolder = MakePlaceHolder($scope.model);

			}

			function UncheckGroup(arrPvs, strGroupName) {

				var bolCanExcludeItem;

				$scope.data.forEach(function (objData) {

					bolCanExcludeItem = true;

					objData.groups.forEach(function (strGName) {

						arrPvs.forEach(function () {

							if(strGName !== strGroupName && arrCheckedGroups.indexOf(strGName) >= 0) {
								bolCanExcludeItem = false;
							}

						});

					});

					if(bolCanExcludeItem && objData.checked && objData.groups.length) {

						var intIndex;
						var intArrayIndex;

						for(intIndex = 0; intIndex<$scope.model.length; intIndex ++) {
							if( $scope.model[intIndex].label === objData.label &&
								$scope.model[intIndex].id === objData.id) {
								intArrayIndex = intIndex;
							}

						}

						$scope.model.splice(intArrayIndex, 1);
						objData.checked = false;
					}

				});


			}

			function CheckGroup(arrPvs) {

				arrPvs.forEach(function (objPv) {

					var bolIsOnModel = false;
					var objData;

					$scope.model.forEach(function (objItem) {
						if(objItem.id === objPv.id) {
							bolIsOnModel = true;
						}
					});

					$scope.data.forEach(function (objDataItem) {
						if(objDataItem.id === objPv.id) {
							objData = objDataItem;
						}
					});

					if(!bolIsOnModel) {
						$scope.model.push({
							label: objPv.code,
							id: objPv.id,
						});
						objData.checked = true;
					}

				});

			}

			/**
			 * @method GroupSelected
			 * Verifica se o grupo está selecionado
			 *
			 * @param {String} strName nome do grupo.
			 */
			function GroupSelected(strName) {
				return arrCheckedGroups.indexOf(strName) > -1;
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

				if($scope.pvList) {
					if(objItem.groups) {
						objItem.groups.forEach(function (strGroupName) {
							vm.pvGroups.forEach(function (objPvGroup) {
								if(objPvGroup.name === strGroupName) {

									var intCountElementsGroupChecked = 0;

									objPvGroup.pvs.forEach(function (objPv) {
										$scope.data.forEach(function (objData) {
											if(objData.label === objPv.code) {
												if(objData.checked === true) {
													intCountElementsGroupChecked++;
												}
											}
										});
									});

									if(intCountElementsGroupChecked === objPvGroup.pvs.length) {
										arrCheckedGroups.push(objPvGroup.name);
									}

								}
							});
						});
					}
				}

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
				if($scope.pvList) {

					if(objItem.groups) {
						objItem.groups.forEach(function (strGroupName) {
							var intArrIndex = arrCheckedGroups.indexOf(strGroupName);
							if(intArrIndex >= 0) {
								arrCheckedGroups.splice(intArrIndex, 1);
							}
						});
					}

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

				if($scope.pvList) {
					// console.log("vm.pvGroups", vm.pvGroups)
					vm.pvGroups.forEach(function (objPvGroup) {
						if(arrCheckedGroups.indexOf(objPvGroup.name) < 0) {
							arrCheckedGroups.push(objPvGroup.name);
						}
					});
				}

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

				if($scope.pvList) {
					arrCheckedGroups = [];
				}

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
