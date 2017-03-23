/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

describe('PV grouping controller', function() {

    var $scope, def, $q, vm, filtersServiceMock, pvServiceMock;

	beforeEach(function() {
		module('Conciliador');

		filtersServiceMock = {
			GetShops: function() {}
		};

		pvServiceMock = {
			getGroups: function() {},
			saveGroup: function() {},
			editGroup: function() {},
			deleteGroup: function() {}
		};

		inject(function($rootScope, $controller, $q, $timeout) {
			def = $q.defer();
			$scope = $rootScope.$new();

			vm = $controller('PVGroupingController', {
				$scope: $scope,
				$timeout: $timeout
				//,
				//filtersService: filtersServiceMock,
				//pvService: pvServiceMock
			});
		});

		// spyOn(filtersServiceMock, 'GetShops').andCallThrough();
		// spyOn(pvServiceMock, 'getGroups').andCallThrough();
		// spyOn(pvServiceMock, 'saveGroup').andCallThrough();
		// spyOn(pvServiceMock, 'editGroup').andCallThrough();
		// spyOn(pvServiceMock, 'deleteGroup').andCallThrough();

	});

	describe('on initialize', function() {
		it('PVGroupingController must be defined', function() {
			expect(vm).toBeDefined();
		});

		// it('PV slave array must be defined', function() {
		// 	expect(vm.pvListSlave).toBeDefined();
		// 	expect(vm.pvListSlave).toEqual([]);
		// });
		//
		// it('PV master array master must be defined', function() {
		// 	expect(vm.pvListMaster).toBeDefined();
		// 	expect(vm.pvListMaster).toEqual([]);
		// });
		//
		// it('Grouping array must be defined', function() {
		// 	expect(vm.pvGroups).toBeDefined();
		// 	expect(vm.pvGroups).toEqual([]);
		// });
		//
		// it('Workspace object must be defined', function() {
		// 	expect(vm.workspace).toBeDefined();
		// });
		//
		// it('Workspace object must have a structure', function() {
		// 	expect(vm.workspace).toEqual({
		// 		name: '',
		// 		pvs: []
		// 	});
		// });
		//
		// it('Initial group data must be defined', function() {
		// 	expect(vm.initialGroupData).toBeDefined();
		// });
		//
		// it('Initial group data must have a structure', function() {
		// 	expect(vm.initialGroupData).toEqual({
		// 		name: '',
		// 		pvs: []
		// 	});
		// });
	});

	// describe('on add to workspace', function() {
	// 	it('Should add a PV on workspace', function() {
	// 		vm.pvListSlave = [{
	// 			id: 1,
	// 			code: 1,
	// 			acquirerId : 1,
	// 			selected: false
	// 		}];
	// 		vm.addPVToWorkspace(vm.pvListSlave[0]);
	// 		expect(vm.workspace.pvs).toEqual([{
	// 			id: 1,
	// 			code: 1,
	// 			acquirerId : 1,
	// 			selected: false
	// 		}]);
	// 	});
	//
	// 	it('Should remove PV from PV list', function() {
	// 		vm.pvListSlave = [{
	// 			id: 1,
	// 			code: 1,
	// 			acquirerId :1
	// 		}];
	// 		vm.addPVToWorkspace(vm.pvListSlave[0]);
	// 		expect(vm.pvListSlave).toEqual([]);
	// 	});
	// });
	//
	// describe('on remove from workspace', function() {
	// 	it('Should remove PV from workspace', function() {
	// 		vm.workspace.pvs = [{
	// 			id: 1,
	// 			code: 1,
	// 			acquirerId :1
	// 		}];
	// 		vm.removePVFromWorkspace(vm.workspace.pvs[0]);
	// 		expect(vm.workspace.pvs).toEqual([]);
	// 	});
	//
	// 	it('Should add PV back to PV list', function() {
	// 		vm.workspace.pvs = [{
	// 			id: 1,
	// 			code: 1,
	// 			acquirerId :1,
	// 			selected: false
	// 		}];
	// 		vm.removePVFromWorkspace(vm.workspace.pvs[0]);
	// 		expect(vm.pvListSlave).toEqual([{
	// 			id: 1,
	// 			code: 1,
	// 			acquirerId: 1,
	// 			selected: false
	// 		}]);
	// 	});
	// });
	//
	// describe('on get pvs', function() {
	// 	it('should get PV list from API', function() {
	// 		expect(filtersServiceMock.GetShops).toHaveBeenCalled();
	// 	});
	// });
	//
	// describe('on validate group', function(){
	// 	it('should return false if group does not have a name', function(){
	// 		vm.workspace = {
	// 			name: "",
	// 			pvs: []
	// 		};
	// 		expect(vm.validateGroup()).toBe(false);
	// 	});
	//
	// 	it('should return false if group does not have pvs', function(){
	// 		vm.workspace = {
	// 			name: "",
	// 			pvs: []
	// 		};
	// 		expect(vm.validateGroup()).toBe(false);
	// 	});
	//
	// 	it('should return false if group has pvs but does not have name', function(){
	// 		vm.workspace = {
	// 			name: "",
	// 			pvs: [{
	// 				id: 1,
	// 				code: 1,
	// 				acquirerId: 1
	// 			}]
	// 		};
	// 		expect(vm.validateGroup()).toBe(false);
	// 	});
	//
	// 	it('should return false if group has name but does not have pvs', function(){
	// 		vm.workspace = {
	// 			name: "group name",
	// 			pvs: []
	// 		};
	// 		expect(vm.validateGroup()).toBe(false);
	// 	});
	//
	// 	it('should return false if group has name and only one pv', function(){
	// 		vm.workspace = {
	// 			name: "group name",
	// 			pvs: [{
	// 				id: 1,
	// 				code: 1,
	// 				acquirerId: 1
	// 			}]
	// 		};
	// 		expect(vm.validateGroup()).toBe(false);
	// 	});
	//
	// 	it('should return true if group has name and more than one pv', function(){
	// 		vm.workspace = {
	// 			name: "group name",
	// 			pvs: [{
	// 				id: 1,
	// 				code: 1,
	// 				acquirerId: 1
	// 			},
	// 			{
	// 				id: 2,
	// 				code: 2,
	// 				acquirerId: 2
	// 			}]
	// 		};
	// 		expect(vm.validateGroup()).toBe(true);
	// 	});
	// });
});
