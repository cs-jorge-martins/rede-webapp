/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

describe('rc-breadcrumb directive', function(){

    var scope, template, isolateScope, $httpBackend, teste, strTemplateNode;

    beforeEach(module('Conciliador'));
    beforeEach(module('app/views/directives/rc-breadcrumb.html'));

    var $scope, element, html, group, span, input, label;

    beforeEach(function(){
        module('app', 'templates');

        html = angular.element("<breadcrumb></breadcrumb>");

        inject(function($rootScope, $compile) {
            $scope = $rootScope.$new();
            element = $compile(html)($scope);
            $scope.$digest();
        });
    });


    describe('on initialize', function() {
        it('should have null values', function() {
            expect($scope.breadcrumb).toBe(null);
        });
    });


});