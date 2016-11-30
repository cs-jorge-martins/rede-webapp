/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */


describe('rc-timeline directive', function(){

    var $scope, element, html, group, span, input, label;

    beforeEach(function(){
        module('app');

        html = angular.element(
            "<div class="timeline-wrapper">" +
            "<ul class="timeline-head">" +
            "<li>" +
            "Lançamentos no período selecionado <br>" +
            "<span>" +
            "{{ dateRange }}"+
            "</span>" +
            "</li>" +
            "<li>" +
            "Total de lançamentos previstos no próximo ano<br>" +
            "<span>{{maxDateRange}}</span>" +
            "</li>" +
            "</ul>" +
            "<ul class="total">" +
            "<li ng-class="{gray: initialValue <= 0}">" +
            "<span>R$</span>" +
            "{{ initialValue | currency: "" }}" +
            "</li>" +
            "<li class="gray">" +
            "<span>R$</span>" +
            "{{ finalValue | currency: "" }}" +
            "</li>" +
            "</ul>"+
            "<div class="timeline-block">" +
            "<div class="percent" style="width:{{(timeLinePercentage | number: 2).split(',').join('.')}}%">" +
            "<article ng-class="{small: initialValue <= 0}">" +
            "<aside ng-class="{gray: initialValue <= 0}" ng-if="finalValue > 0">" +
            "<ng-show ng-if="timeLinePercentage != 0 && timeLinePercentage != 100">{{ timeLinePercentage | number: 2 }}%</ng-show>" +
            "<ng-show ng-if="timeLinePercentage == 0 || timeLinePercentage == 100">{{ timeLinePercentage }}%</ng-show>" +
            "do valor" +
            "</aside>" +
            "</article>" +
            "</div>" +
            "</div>" +
            "</div>"
        );

        inject(function($rootScope, $compile) {
            $scope = $rootScope.$new();
            element = $compile(html)($scope);
            $scope.$digest();
            group = element.children();
            span = element.find('span');
            input = element.find('input');
            label = element.find('label');
        });
    });


    describe('on load', function() {
        it('should add class "focus" from parent element', function() {
            input.triggerHandler('focus');
            expect(group.hasClass('focus')).toBe(true);
        });

        it('should add class "rc-animate" from parent element', function() {
            input.triggerHandler('focus');
            expect(group.hasClass('rc-animate')).toBe(true);
        });
    });

});