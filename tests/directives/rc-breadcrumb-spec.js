/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

// Todo: Refatorar este teste para testar o componente e não a aplicação

describe('rc-breadcrumb directive', function(){

    beforeEach(module('Conciliador'));
    beforeEach(module('app/views/directives/rc-breadcrumb.html'));

    var scope, element, template, route, strTemplateNode;

    beforeEach(inject(function ($compile, $rootScope, $route) {
        scope = $rootScope.$new();
        route = $route;

        element = angular.element('<rc-breadcrumb></rc-breadcrumb>');

        template = $compile(element)(scope);
        scope.$digest();

    }));

    it('should have null value', function() {
        expect(scope.breadcrumb).toBe(null);
    });

    it('should make object with a route given by array', function() {
        scope.getBreadCrumb(['home']);
        expect(scope.breadcrumb).toEqual({home: '#/home'});
    });

    it('should make html with a route given by array in html', function() {
        scope.getBreadCrumb(['home']);
        scope.$digest();
        strTemplateNode = template[0];
        var strBreadcrumbNode = strTemplateNode.querySelector('.breadcrumb li:nth-child(2)').outerHTML;
        expect(strBreadcrumbNode).toContain('home');

        scope.getBreadCrumb(['ajuda']);
        scope.$digest();
        strTemplateNodeCustom = template[0];
        var strTemplateNodeCustom = strTemplateNode.querySelector('.breadcrumb li:nth-child(3)').outerHTML;
        expect(strTemplateNodeCustom).toContain('ajuda');
    });

});