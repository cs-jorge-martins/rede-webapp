/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

describe('rc-disclaimer directive', function(){

    var scope, template, strTemplateNode;

    beforeEach(module('Conciliador'));
    beforeEach(module('app/views/directives/rc-disclaimer.html'));

    beforeEach(inject(function ($compile, $rootScope) {

        scope = $rootScope.$new();

        var element = angular.element(
            '<rc-disclaimer type="strType" text="strText" on-click="strHref" action-text="strActionText"></rc-disclaimer>'
        );

        template = $compile(element)(scope);

        scope.strType = "warning";
        scope.strText = "texto aplicado no disclaimer";
        scope.strHref = "http://teste.com";
        scope.strActionText = "ver detalhes";
        scope.$digest();

        strTemplateNode = template[0].parentNode;

    }));

    it("should contain warning class on div.rc-disclaimer", function () {
        var objRcDisclaimerDiv = strTemplateNode.querySelector('.rc-disclaimer');
        expect(objRcDisclaimerDiv.classList.contains('warning')).toBe(true);
    });

    it("should contain main text on load directive", function () {
        var objRcDisclaimerDiv = strTemplateNode.querySelector('.rc-disclaimer .container p').outerHTML;
        expect(objRcDisclaimerDiv).toContain('texto aplicado no disclaimer');
    });

    it("should contain href 'http://teste.com' on link", function () {
        var strRcDisclaimerLink = strTemplateNode.querySelector('.rc-disclaimer a').getAttribute("href");
        expect(strRcDisclaimerLink).toContain('http://teste.com');
    });

    it("should contain text 'ver detalhes' on link", function () {
        var strRcDisclaimerLink = strTemplateNode.querySelector('.rc-disclaimer a').outerHTML;
        expect(strRcDisclaimerLink).toContain('ver detalhes');
    });

});
