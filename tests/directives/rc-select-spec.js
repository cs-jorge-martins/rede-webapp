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

	describe('Check and Uncheck All', function () {

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

});
