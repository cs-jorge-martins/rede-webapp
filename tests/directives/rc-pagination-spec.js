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

});
