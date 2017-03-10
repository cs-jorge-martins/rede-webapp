/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

describe('rc-sort directive', function() {

    var scope, template, strTemplateNode;

    beforeEach(module('Conciliador'));

    beforeEach(inject(function ($compile, $rootScope, _$timeout_) {

        scope = $rootScope.$new();

        var element = angular.element(
            '<table><thead><tr><th rc-sort sort-type="date" sort-by="sort" sort-on-click="funOnClick()"></tr></thead></table>'
        );

        template = $compile(element)(scope);

        scope.sort = {
			type: 'date',
			order: 'asc'
		};

        scope.funOnClick = function () { };

        scope.$digest();

        strTemplateNode = template[0].parentNode;

    }));

    it("should change object order direction", function () {
        var objTh = strTemplateNode.querySelector('.rc-sort');
		// console.log("objTh.classList.contains('sort-asc')", objTh.classList.contains('sort-asc'))
		expect(objTh.classList.contains('sort-asc')).toBe(false);
		console.log("objTh.classList.contains('sort-asc')", objTh.classList.contains('sort-asc'))
		console.log("objTh.classList", objTh.classList)


    });

});
