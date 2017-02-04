/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

describe('rc-chips directive', function() {
    var xScope, xTemplate, strTemplateNode;

    beforeEach(module('Conciliador'));
    beforeEach(module('app/views/directives/rc-chips.html'));
    beforeEach(module('app/views/directives/rc-chip.html'));

    beforeEach(inject(function ($compile, $rootScope) {
        xScope = $rootScope.$new();

        var element = angular.element(
            '<rc-chips><rc-chip show="visible" closeable="showClose" label="text" onClear="hide()"></rc-chip></rc-chips>'
        );

        xTemplate = $compile(element)(xScope);

        xScope.showClose = false;
        xScope.text = "My Label";
        xScope.visible = true;
        xScope.hide = function() {};
        xScope.$digest();

        strTemplateNode = xTemplate[0].parentNode;
    }));

    it("should show label in chip", function() {
        var strLabel = strTemplateNode.querySelector('div.chip span').innerHTML;
        expect(strLabel.trim()).toBe("My Label");
    });

    it("should show close button", function() {
        xScope.showClose = true;
        xScope.$digest();

        var objClose = strTemplateNode.querySelector('.clear-filter');
        expect(objClose).not.toBe(null);
    });

    it('should be hidden', function() {

        xScope.visible = false;
        xScope.$digest();

        var objChip = strTemplateNode.querySelector('div.chip-parent');

        expect(objChip.classList.contains('hide')).toBe(true);
    });

    it ('should hide on clear', function() {
        var objChip = strTemplateNode.querySelector('div.chip-parent');
        expect(objChip.classList.contains('hide')).toBe(false);

        xScope.hide = function() {
            xScope.visible = false;
        };
        xScope.hide();
        xScope.$digest();

        expect(objChip.classList.contains('hide')).toBe(true);
    });
});