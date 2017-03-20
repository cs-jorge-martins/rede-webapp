/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

describe('PV grouping controller', function() {

    var $scope;

	beforeEach(function() {
		module('Conciliador');

		inject(function($rootScope, $controller) {
			$scope = $rootScope.$new();

			vm = $controller('PVGroupingController', {
				$scope: $scope
			});
		});
	});

	describe('on initialize', function() {
		it('PVGroupingController must be defined', function() {
			expect(vm).toBeDefined();
		});

		it('PV array must be defined', function() {
			expect(vm.pvList).toBeDefined();
			expect(vm.pvList).toEqual([]);
		});

		it('Grouping array must be defined', function() {
			expect(vm.pvGroups).toBeDefined();
			expect(vm.pvGroups).toEqual([]);
		});

		it('Workspace object must be defined', function() {
			expect(vm.workspace).toBeDefined();
		});

		it('Workspace object must have a structure', function() {
			expect(vm.workspace).toEqual({
				title: '',
				pvs: []
			});
		});

		it('Initial group data must be defined', function() {
			expect(vm.initialGroupData).toBeDefined();
		});

		it('Initial group data must have a structure', function() {
			expect(vm.initialGroupData).toEqual({
				title: '',
				pvs: []
			});
		});
	});

	describe('on add to workspace', function() {
		it('Should add a PV on workspace', function() {
			vm.pvList = [{
				id: 1,
				code: 1,
				acquirerId : 1,
				selected: false
			}];
			vm.addPVToWorkspace(vm.pvList[0]);
			expect(vm.workspace.pvs).toEqual([{
				id: 1,
				code: 1,
				acquirerId : 1,
				selected: false
			}]);
		});

		it('Should remove PV from PV list', function() {
			vm.pvList = [{
				id: 1,
				code: 1,
				acquirerId :1
			}];
			vm.addPVToWorkspace(vm.pvList[0]);
			expect(vm.pvList).toEqual([]);
		});
	});

	describe('on remove from workspace', function() {
		it('Should remove PV from workspace', function() {
			vm.workspace.pvs = [{
				id: 1,
				code: 1,
				acquirerId :1
			}];
			vm.removePVFromWorkspace(vm.workspace.pvs[0]);
			expect(vm.workspace.pvs).toEqual([]);
		});

		it('Should add PV back to PV list', function() {
			vm.workspace.pvs = [{
				id: 1,
				code: 1,
				acquirerId :1,
				selected: false
			}];
			vm.removePVFromWorkspace(vm.workspace.pvs[0]);
			expect(vm.pvList).toEqual([{
				id: 1,
				code: 1,
				acquirerId: 1,
				selected: false
			}]);
		});
	});

	describe('on validate group', function(){
		it('should return false if group does not have a name', function(){
			vm.workspace = {
				title: "",
				pvs: []
			};
			expect(vm.validateGroup()).toBe(false);
		});

		it('should return false if group does not have pvs', function(){
			vm.workspace = {
				title: "",
				pvs: []
			};
			expect(vm.validateGroup()).toBe(false);
		});

		it('should return false if group has pvs but does not have title', function(){
			vm.workspace = {
				title: "",
				pvs: [{
					id: 1,
					code: 1,
					acquirerId: 1
				}]
			};
			expect(vm.validateGroup()).toBe(false);
		});

		it('should return false if group has title but does not have pvs', function(){
			vm.workspace = {
				title: "group title",
				pvs: []
			};
			expect(vm.validateGroup()).toBe(false);
		});

		it('should return false if group has title and only one pv', function(){
			vm.workspace = {
				title: "group title",
				pvs: [{
					id: 1,
					code: 1,
					acquirerId: 1
				}]
			};
			expect(vm.validateGroup()).toBe(false);
		});

		it('should return true if group has title and more than one pv', function(){
			vm.workspace = {
				title: "group title",
				pvs: [{
					id: 1,
					code: 1,
					acquirerId: 1
				},
				{
					id: 2,
					code: 2,
					acquirerId: 2
				}]
			};
			expect(vm.validateGroup()).toBe(true);
		});
	});
});
