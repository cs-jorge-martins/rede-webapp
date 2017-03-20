/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

describe('rc-sort directive', function() {

    var $scope, element, html;

	beforeEach(function() {
		module('Conciliador');

		html = angular.element([
			"<table>",
				"<thead>",
					"<tr>",
						"<th rc-sort sort-type=\"date\" sort-by=\"sort\" sort-on-click=\"funOnClick()\">",
					"</tr>",
				"</thead>",
			"</table>"
		].join(""));

		inject(function($rootScope, $compile) {
			$scope = $rootScope.$new();
			element = $compile(html)($scope);
			th = element.find('th');
			$scope.$digest();
		});
	});

	describe('on initialize', function() {
		it('should add class "rc-sort"', function(){
			$scope.sort = {
				type: 'date',
				order: 'asc'
			};

			$scope.$digest();
			expect(th.hasClass('rc-sort')).toBe(true);
			//console.log($scope);
			//console.log(element);
			//console.log($scope.$$childHead.addClassOnElement);
		});
	});

});
