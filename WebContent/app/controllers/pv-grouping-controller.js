/*
	Projeto: conciliation
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

 /**
  * @class Conciliador.PVGroupingController
  * Controller para gerenciamento de agrupamento de PVs
  */

"use strict";

(function() {

	angular
		.module('Conciliador.PVGroupingController', [])
		.controller('PVGroupingController', PVGroupingController);

	PVGroupingController.$inject = ['$scope', 'filtersService', '$timeout', 'pvService', 'modalService'];

	function PVGroupingController($scope, filtersService, $timeout, pvService, modalService) {

		var objPvListScrollContainer,
			objWorkspaceScrollContainer,
			objGroupsScrollContainer;

		var objVm = this;
		objVm.pvListSlave = [];
		objVm.pvListMaster = [];
		objVm.pvGroups = [];
		objVm.workspace = {};
		objVm.initialGroupData = {
			name: '',
			pvs: [],
			status: 'CREATE'
		};

		objVm.addPVToWorkspace = AddPVToWorkspace;
		objVm.removePVFromWorkspace = RemovePVFromWorkspace;
		objVm.updateScrollContainers = UpdateScrollContainers;
		objVm.validateGroup = ValidateGroup;
		objVm.selectPV = SelectPV;
		objVm.saveOrUpdateGroup = SaveOrUpdateGroup;
		objVm.editGroup = EditGroup;
		objVm.deleteGroup = DeleteGroup;

		Init();

		function Init() {
			objVm.workspace = angular.copy(objVm.initialGroupData);
			GetPVs();
			GetGroups();
		}

		/**
		 * @method AddPVToWorkspace
		 * Adiciona um PV a área de trabalho (coluna central onde o usuário pode
		 * adicionar e remover os PVs que irão compor o grupo)
		 * Além de adicionar a colunda de destino (workspace), este método também
		 * remove o PV da lista de PVs (para o usuário não conseguire adicionar
		 * 2 PVs iguais).
		 *
		 * @param {Object} objPV PV que será adicionado ao workspace. Este objeto
		 * contém as informações do PV como: nome, id e adquirente.
		 */
		function AddPVToWorkspace(objPV) {
			var intIndex = objVm.pvListSlave.length - 1;
			for(intIndex; intIndex >= 0; intIndex--) {
				if(objVm.pvListSlave[intIndex].selected || (objVm.pvListSlave[intIndex].code === objPV.code)) {
					objVm.pvListSlave[intIndex].selected = false;
					objVm.workspace.pvs.unshift(objVm.pvListSlave[intIndex]);
					objVm.pvListSlave.splice(intIndex, 1);
				}
			}

			UpdateScrollContainers();
		}

		/**
		 * @method RemovePVFromWorkspace
		 * Remove um PV a área de trabalho (coluna central onde o usuário pode
		 * adicionar e remover os PVs que irão compor o grupo)
		 * Além de remover da colunda de workspace(coluna do meio), este método também
		 * adiciona o PV de volta a lista de PVs (para que o usuário possa adicionar o
		 * PV de volta ao workspace).
		 *
		 * @param {Object} objPV PV que será removido ao workspace. Este objeto
		 * contém as informações do PV como: nome, id e adquirente.
		 */
		function RemovePVFromWorkspace(objPV) {
			console.log(objPV);
			var intIndex = objVm.workspace.pvs.length - 1;
			for(intIndex; intIndex >= 0; intIndex--) {
				if(objVm.workspace.pvs[intIndex].selected || (objVm.workspace.pvs[intIndex].code === objPV.code)) {
					objVm.workspace.pvs[intIndex].selected = false;
					objVm.pvListSlave.unshift(objVm.workspace.pvs[intIndex]);
					objVm.workspace.pvs.splice(intIndex, 1);
				}
			}

			UpdateScrollContainers();
		}

		/**
		 * @method GetPVs
		 * Busca a lista de PVs na API.
		 */
		function GetPVs() {
			filtersService.GetShops().then(function(objResponse){

				objPvListScrollContainer = document.querySelector('#pvs-container');
				objWorkspaceScrollContainer = document.querySelector('#edit-container');
				objGroupsScrollContainer = document.querySelector('#groups-container');

				Ps.initialize(objPvListScrollContainer);
				Ps.initialize(objWorkspaceScrollContainer);
				Ps.initialize(objGroupsScrollContainer);

				objVm.pvListMaster = objResponse.data;
				objVm.pvListSlave = angular.copy(objVm.pvListMaster);

				UpdateScrollContainers();
			}).catch(function(){
				console.log('error');
			});
		}

		/**
		 * @method GetGroups
		 * Busca os grupos de PVs na API.
		 */
		function GetGroups() {
			pvService.getGroups().then(function(objResponse){
				objVm.pvGroups = objResponse.data;
			}).catch(function(){
				// TODO: implementar erro
			});
		}

		/**
		 * Sal
		 */
		function SaveOrUpdateGroup() {
			switch (objVm.workspace.status) {
				case "CREATE":
					pvService.saveGroup(objVm.workspace).then(function(){
						objVm.pvListSlave = angular.copy(objVm.pvListMaster);
						objVm.workspace = angular.copy(objVm.initialGroupData);
						GetGroups();
					}).catch(function(objError){
						if(objError.status === 422) {
							modalService.prompt(
								objVm.workspace.name + ' duplicado',
								'Agrupamento com o nome <strong>' + objVm.workspace.name + '</strong> já existe.<br /> Escolha outro nome e clique novamente no botão <strong>salvar</strong>.'
							);
						}
					});
					break;
				case "EDIT":
					pvService.editGroup(objVm.workspace).then(function(){
						objVm.pvListSlave = angular.copy(objVm.pvListMaster);
						objVm.workspace = angular.copy(objVm.initialGroupData);
						GetGroups();
					}).catch(function(objError){
						if(objError.status === 422) {
							modalService.prompt(
								objVm.workspace.name + ' duplicado',
								'Agrupamento com o nome <strong>' + objVm.workspace.name + '</strong> já existe.<br /> Escolha outro nome e clique novamente no botão <strong>salvar</strong>.'
							);
						}
					});
					break;
				default:
					break;
			}
		}

		/**
		 * @method EditGroup
		 * Edita um grupo na interface. Joga os pvs do grupo selecionado na área
		 * de edição, e remove os pvs do grupo da lista de pvs da esquerda
		 */
		function EditGroup(objGroup) {
			objVm.pvListSlave = angular.copy(objVm.pvListMaster);
			objVm.workspace = angular.copy(objGroup);
			objVm.workspace.status = "EDIT";

			objVm.workspace.pvs.forEach(function(objPvWorkspace){
				objVm.pvListSlave.forEach(function(objPvSlave, intIndex){
					if(objPvWorkspace.code === objPvSlave.code) {
						objVm.pvListSlave.splice(intIndex, 1);
					}
				});
			});

			UpdateScrollContainers();
		}

		/**
		 * Deleta um grupo de PVs
		 */
		function DeleteGroup(objGroup) {
			modalService.prompt(
				'excluir agrupamento',
				'Após excluir o agrupamento, não será possível recuperar a informação.',
				{
					text: 'sim, excluir agrupamento',
					callback: function(objVmModal) {
						pvService.deleteGroup(objGroup.id).then(function() {
							objVm.pvListSlave = angular.copy(objVm.pvListMaster);
							objVm.workspace = objVm.initialGroupData;
							objVmModal.$close();
							GetGroups();
						}).catch(function(){
						});
					}
				},
				{
					text: 'não, manter agrupamento',
					callback: function(objVmModal) {
						objVmModal.$close();
					}
				}
			);
		}

		/**
		 * Atualizar o scroll customizado.
		 * Este método é chamado quando algun dos containers que contem os scroll
		 * customizados são alterados em altura.
		 */
		function UpdateScrollContainers() {
			// precisa de um timeout por causa da animação css
			$timeout(function(){
				Ps.update(objPvListScrollContainer);
				Ps.update(objWorkspaceScrollContainer);
				Ps.update(objGroupsScrollContainer);
			}, 500);
		}

		/**
		 * Valida grupo de PVs antes de salvá-lo.
		 * Verifica se o grupo tem nome e se existem pelo menos 2 pvs relacionados.
		 */
		function ValidateGroup() {
			if (objVm.workspace.pvs.length < 2) {
				return false;
			}
			if (!objVm.workspace.name ) {
				return false;
			}

			return true;
		}

		function SelectPV(objPV) {
			if(!objPV.selected) {
				objPV.selected = true;
			} else {
				objPV.selected = false;
			}
		}
	}
})();
