/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

describe('rc-select directive', function(){

    beforeEach(module('Conciliador'));
    beforeEach(module('app/views/directives/rc-select.html'));

    describe('placeHolder', function () {

		var $scope, element, html, controller;

    	beforeEach(function () {

    		html = angular.element([
				"<rc-select label=\"número do estabelecimento\" place-holder-label=\"estabelecimento\" model=\"objModel\" data=\"objData\"></rc-select>",
			].join(""));

			inject(function($rootScope, $compile) {
				$scope = $rootScope.$new();
				element = $compile(html)($scope);
				$scope.$digest();
				controller = element.controller('rcSelect');
			});

		});

		it("should make placeholder as: 'todos os estabelecimentos'", inject(function () {

			var arrModel = [];
			var strPlaceHolder = controller.MakePlaceHolder(arrModel);
			expect(strPlaceHolder).toBe('todos os estabelecimentos');

		}));

		it("should make placeholder as: '111111'", inject(function () {

			var arrModel = [{label: '111111'}];
			var strPlaceHolder = controller.MakePlaceHolder(arrModel);
			expect(strPlaceHolder).toBe('111111');

		}));

		it("should make placeholder as: '111111 e outro estabelecimento'", inject(function () {

			var arrModel = [{label: '111111'},{label: '22222'}];
			var strPlaceHolder = controller.MakePlaceHolder(arrModel);
			expect(strPlaceHolder).toBe('111111 e outro estabelecimento');

		}));

		it("should make placeholder as: '111111 e outros 2 estabelecimentos'", inject(function () {

			var arrModel = [{label: '111111'},{label: '22222'},{label: '33333'}];
			var strPlaceHolder = controller.MakePlaceHolder(arrModel);
			expect(strPlaceHolder).toBe('111111 e outros 2 estabelecimentos');

		}));

		it("should make placeholder as: '111111 e outros 3 estabelecimentos'", inject(function () {

			var arrModel = [{label: '111111'},{label: '22222'},{label: '33333'},{label: '44444'}];
			var strPlaceHolder = controller.MakePlaceHolder(arrModel);
			expect(strPlaceHolder).toBe('111111 e outros 3 estabelecimentos');

		}));

	});

	describe('check and uncheck all', function () {

		var $scope, element, html, controller;

		beforeEach(function () {

			html = angular.element([
				"<rc-select label=\"número do estabelecimento\" place-holder-label=\"estabelecimento\" model=\"objModel\" data=\"objData\"></rc-select>",
			].join(""));

			inject(function($rootScope, $compile) {
				$scope = $rootScope.$new();
				element = $compile(html)($scope);
				$scope.$digest();
				controller = element.controller('rcSelect');
			});

		});

		it("should CheckAll on model", inject(function () {

			var isolatedScope = element.isolateScope();
			isolatedScope.model = [];
			isolatedScope.data = [
				{
					label: '111111'
				},
				{
					label: '222222'
				},
				{
					label: '333333'
				}
			];
			controller.checkAll();
			expect(isolatedScope.model.length).toBe(3);

		}));

		it("should UncheckAll on model", inject(function () {

			var isolatedScope = element.isolateScope();
			isolatedScope.model = [];
			isolatedScope.data = [
				{
					label: '111111'
				},
				{
					label: '222222'
				},
				{
					label: '333333'
				}
			];
			controller.checkAll();
			expect(isolatedScope.model.length).toBe(3);

			controller.uncheckAll();
			expect(isolatedScope.model.length).toBe(0);

		}));

	});

	describe('check and uncheck single', function () {

		var $scope, element, html, controller;

		beforeEach(function () {

			html = angular.element([
				"<rc-select label=\"número do estabelecimento\" place-holder-label=\"estabelecimento\" model=\"objModel\" data=\"objData\"></rc-select>",
			].join(""));

			inject(function($rootScope, $compile) {
				$scope = $rootScope.$new();
				element = $compile(html)($scope);
				$scope.$digest();
				controller = element.controller('rcSelect');
			});

		});

		it("should check single on model", inject(function () {

			var isolatedScope = element.isolateScope();
			isolatedScope.model = [];
			isolatedScope.data = [
				{
					label: '111111',
					id: 200
				},
				{
					label: '222222',
					id: 201
				},
				{
					label: '333333',
					id: 202
				}
			];
			controller.checkOrUncheckItem(isolatedScope.data[1]);
			expect(isolatedScope.model.length).toBe(1);
			expect(isolatedScope.model[0].id).toBe(201);
			expect(isolatedScope.model[0].label).toBe('222222');

		}));

		it("should check two datas on model", inject(function () {

			var isolatedScope = element.isolateScope();
			isolatedScope.model = [];
			isolatedScope.data = [
				{
					label: '111111',
					id: 200
				},
				{
					label: '222222',
					id: 201
				},
				{
					label: '333333',
					id: 202
				}
			];
			controller.checkOrUncheckItem(isolatedScope.data[1]);
			controller.checkOrUncheckItem(isolatedScope.data[2]);

			expect(isolatedScope.model.length).toBe(2);

			expect(isolatedScope.model[0].id).toBe(201);
			expect(isolatedScope.model[0].label).toBe('222222');

			expect(isolatedScope.model[1].id).toBe(202);
			expect(isolatedScope.model[1].label).toBe('333333');

		}));

		it("should check two datas and uncheck one of these on model", inject(function () {

			var isolatedScope = element.isolateScope();
			isolatedScope.model = [];
			isolatedScope.data = [
				{
					label: '111111',
					id: 200
				},
				{
					label: '222222',
					id: 201
				},
				{
					label: '333333',
					id: 202
				}
			];
			controller.checkOrUncheckItem(isolatedScope.data[1]);
			controller.checkOrUncheckItem(isolatedScope.data[2]);

			expect(isolatedScope.model.length).toBe(2);

			expect(isolatedScope.model[0].id).toBe(201);
			expect(isolatedScope.model[0].label).toBe('222222');

			expect(isolatedScope.model[1].id).toBe(202);
			expect(isolatedScope.model[1].label).toBe('333333');

			controller.checkOrUncheckItem(isolatedScope.data[1]);
			expect(isolatedScope.model.length).toBe(1)

		}));


	});

	describe('pvList custom layout', function () {


		var $scope, element, html, controller, bolPvList;

		beforeEach(function () {

			html = angular.element([
				"<rc-select label=\"número do estabelecimento\" place-holder-label=\"estabelecimento\" model=\"objModel\" data=\"objData\" pv-list=\"bolPvList\"></rc-select>",
			].join(""));

			inject(function($rootScope, $compile) {
				$scope = $rootScope.$new();
				element = $compile(html)($scope);
				 bolPvList = false;
				$scope.$digest();
				controller = element.controller('rcSelect');
			});

		});

		it("shouldn't have a footer", inject(function () {
			expect(element[0].querySelectorAll('.rc-select-footer').length).toBe(0);
		}));

		it("shouldn't have a footer", inject(function () {

			var isolatedScope = element.isolateScope();
			isolatedScope.pvList = true;
			$scope.$digest();

			expect(element[0].querySelectorAll('.rc-select-footer').length).toBe(1);

		}));

	});

  describe('check hide or show class show-list pvList', function () {

    var $scope, element, html, controller, bolPvList;

    beforeEach(function () {

			html = angular.element([
				"<rc-select label=\"número do estabelecimento\" place-holder-label=\"estabelecimento\" model=\"objModel\" data=\"objData\" pv-list=\"bolPvList\"></rc-select>",
			].join(""));

			inject(function($rootScope, $compile) {
				$scope = $rootScope.$new();
				element = $compile(html)($scope);
				 bolPvList = false;
				$scope.$digest();
				controller = element.controller('rcSelect');
			});

		});

    it("add class show-list when click input", inject(function () {

      $scope.class = "show-list";
			expect($scope.class).toBe('show-list');

		}));

    it("verific if show class show-list when not click input", inject(function () {

      $scope.class = "";
			expect($scope.class).toBe('');

		}));

    it("verific if show class show-list when check single on model", inject(function () {

      $scope.class = "show-list";

			var isolatedScope = element.isolateScope();
			isolatedScope.model = [];
			isolatedScope.data = [
				{
					label: '111111',
					id: 200
				},
				{
					label: '222222',
					id: 201
				},
				{
					label: '333333',
					id: 202
				}
			];
			controller.checkOrUncheckItem(isolatedScope.data[1]);
			expect(isolatedScope.model.length).toBe(1);
			expect(isolatedScope.model[0].id).toBe(201);
			expect(isolatedScope.model[0].label).toBe('222222');

			expect($scope.class).toBe('show-list');

		}));

    it("verific if show class show-list when check two datas on model", inject(function () {

      $scope.class = "show-list";

			var isolatedScope = element.isolateScope();
			isolatedScope.model = [];
			isolatedScope.data = [
				{
					label: '111111',
					id: 200
				},
				{
					label: '222222',
					id: 201
				},
				{
					label: '333333',
					id: 202
				}
			];
			controller.checkOrUncheckItem(isolatedScope.data[1]);
			controller.checkOrUncheckItem(isolatedScope.data[2]);

			expect(isolatedScope.model.length).toBe(2);

			expect(isolatedScope.model[0].id).toBe(201);
			expect(isolatedScope.model[0].label).toBe('222222');

			expect(isolatedScope.model[1].id).toBe(202);
			expect(isolatedScope.model[1].label).toBe('333333');

      expect($scope.class).toBe('show-list');

		}));

    it("verific if show class show-list when check two datas and uncheck one of these on model", inject(function () {

      $scope.class = "show-list";

			var isolatedScope = element.isolateScope();
			isolatedScope.model = [];
			isolatedScope.data = [
				{
					label: '111111',
					id: 200
				},
				{
					label: '222222',
					id: 201
				},
				{
					label: '333333',
					id: 202
				}
			];
			controller.checkOrUncheckItem(isolatedScope.data[1]);
			controller.checkOrUncheckItem(isolatedScope.data[2]);

			expect(isolatedScope.model.length).toBe(2);

			expect(isolatedScope.model[0].id).toBe(201);
			expect(isolatedScope.model[0].label).toBe('222222');

			expect(isolatedScope.model[1].id).toBe(202);
			expect(isolatedScope.model[1].label).toBe('333333');

			controller.checkOrUncheckItem(isolatedScope.data[1]);
			expect(isolatedScope.model.length).toBe(1);

      expect($scope.class).toBe('show-list');

		}));


	});

});
