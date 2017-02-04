/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

describe('rc-message directive', function(){

    var scope, template, strTemplateNode;

    beforeEach(module('Conciliador'));
    beforeEach(module('app/views/directives/rc-message.html'));

    beforeEach(inject(function ($compile, $rootScope) {

        scope = $rootScope.$new();

        var element = angular.element(
            '<rc-message type="strType" text="strText" href="strHref" action-text="strActionText"></rc-message>'
        );

        template = $compile(element)(scope);

        scope.strType = "danger";
        scope.strText = "existem vendas duplicadas";
        scope.strHref = "/#/rc-unit-test";
        scope.strActionText = "ver detalhes";
        scope.$digest();

        strTemplateNode = template[0].parentNode;

    }));

    it("should contain danger class on div.rc-message", function () {
        var objRcMessageDiv = strTemplateNode.querySelector('.rc-message');
        expect(objRcMessageDiv.classList.contains('danger')).toBe(true);
    });

    it("should contain icon_exclamacao class on tag <i> if danger", function () {
        var objRcIcon = strTemplateNode.querySelector('.rc-message span i');
        expect(objRcIcon.classList.contains('icon_exclamacao')).toBe(true);
    });

    it("should contain text existem 'vendas duplicadas' on first p", function () {
        var objRcMessageFirstP = strTemplateNode.querySelector('.rc-message p').outerHTML;
        expect(objRcMessageFirstP).toContain('existem vendas duplicadas');
    });

    it("should contain text existem 'ver detalhes' on action p", function () {
        var objRcMessageActionP = strTemplateNode.querySelector('.rc-message .action').outerHTML;
        expect(objRcMessageActionP).toContain('ver detalhes');
    });

});
