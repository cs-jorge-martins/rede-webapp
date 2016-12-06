/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

describe('rc-timeline directive', function(){

    var scope, template, isolateScope, $httpBackend, teste, strTemplateNode;

    beforeEach(module('KaplenWeb'));
    beforeEach(module('app/views/directives/rc-timeline.html'));

    beforeEach(inject(function ($compile, $rootScope) {

        scope = $rootScope.$new();

        var element = angular.element(
            '<rc-timeline date-range="strDateRange" max-date-range="strMaxDateRange" initial-value="dblInitialValue" final-value="dblFinalValue" time-line-percentage="dblPercentage" ></rc-timeline>'
        );

        template = $compile(element)(scope);
        scope.strDateRange = "6 dez 2016 a 31 jan 2017";
        scope.strMaxDateRange = "até 5 dez 2017";
        scope.dblInitialValue = 90000;
        scope.dblFinalValue = 300000;
        scope.dblPercentage = 30;
        scope.$digest();

        strTemplateNode = template[0].parentNode;

    }));

    it("should show timeline percentages", function () {
        scope.dblPercentage = 40;
        scope.$digest();

        var strPercentDiv = strTemplateNode.querySelector('div.percent').outerHTML;
        expect(strPercentDiv).toContain('40.00%');
    });

    it("should change number color with initialValue = 0", function () {
        var strInitialValueHtml = strTemplateNode.querySelector('ul.total li:first-child');

        expect(strInitialValueHtml.classList.contains('gray')).toBe(false);

        scope.dblInitialValue = 0;
        scope.$digest();

        expect(strInitialValueHtml.classList.contains('gray')).toBe(true);
    });

    xit("should hide if finalValue <= 0 ", function () {
        var strFinalValueHtml = strTemplateNode.querySelector('div.percent aside');

        console.log("strFinalValueHtml", strFinalValueHtml);
        expect((strFinalValueHtml.style.display === "none")).toBe(false);

        scope.dblFinalValue = 0;
        scope.$digest();

        console.log("strFinalValueHtml", strFinalValueHtml);
        expect((strFinalValueHtml.style.display === "none")).toBe(true);

    });

    xit("should show 0% and 100% instead 0,00% and 100,00% ", function () {
        teste = 1+1;
        expect(teste).toBe(2);
    });

});