/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

describe('rc-pagination directive', function(){

    var scope, template, strTemplateNode;

    beforeEach(module('Conciliador'));
    beforeEach(module('app/views/directives/rc-pagination.html'));

    beforeEach(inject(function ($compile, $rootScope) {

        scope = $rootScope.$new();

        var element = angular.element(
            '<rc-pagination results-per-page-model="intSize" results-page-model="intPage" results-pagination-total-itens="intTotalItens" max-size="intMaxSize" on-change="funOnChange"></rc-pagination>'
        );

        template = $compile(element)(scope);

        scope.intSize = 0;
        scope.intPage = 0;
        scope.intTotalItens = 300;
        scope.intMaxSize = 4;
        scope.funOnChange = function () {
          return true;
        };
        scope.$digest();

        strTemplateNode = template[0].parentNode;

    }));

    it("should have only option equal to 10 on select with 9 items", function () {

        var objRcPaginationSelect = strTemplateNode.querySelector('.select-wrapper select');
        var objOptions =  objRcPaginationSelect.options;

        expect(objOptions.length).toBe(3);

        scope.intTotalItens = 9;
        scope.$digest();

        objRcPaginationSelect = strTemplateNode.querySelector('.select-wrapper select');
        objOptions =  objRcPaginationSelect.options;

        expect(objOptions.length).toBe(1);
        expect(objOptions[0].label).toBe('10');

    });

    it("should have options equal to 10 and 20 on select with 15 items", function () {

        var objRcPaginationSelect = strTemplateNode.querySelector('.select-wrapper select');
        var objOptions =  objRcPaginationSelect.options;

        expect(objOptions.length).toBe(3);

        scope.intTotalItens = 15;
        scope.$digest();

        objRcPaginationSelect = strTemplateNode.querySelector('.select-wrapper select');
        objOptions =  objRcPaginationSelect.options;

        console.log("objOptions", objOptions[0].label);

        expect(objOptions.length).toBe(2);
        expect(objOptions[0].label).toBe('10');
        expect(objOptions[1].label).toBe('20');

    });

    it("should have options equal to 10, 20 and 30 on select with 60 items", function () {

        var objRcPaginationSelect = strTemplateNode.querySelector('.select-wrapper select');
        var objOptions =  objRcPaginationSelect.options;

        expect(objOptions.length).toBe(3);

        scope.intTotalItens = 60;
        scope.$digest();

        objRcPaginationSelect = strTemplateNode.querySelector('.select-wrapper select');
        objOptions =  objRcPaginationSelect.options;

        expect(objOptions.length).toBe(3);
        expect(objOptions[0].label).toBe('10');
        expect(objOptions[1].label).toBe('20');
        expect(objOptions[2].label).toBe('50');

    });

});
