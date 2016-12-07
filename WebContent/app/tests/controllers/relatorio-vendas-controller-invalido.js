/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
describe('Conciliador', function() {

    beforeEach(module('KaplenWeb'));

    describe('RelatorioVendasController', function() {
        var xScope = null;
        var xController = null;
        var xService = null;

        beforeEach(module(function($provide) {
            xService = {
                exportTransactions: function () {
                   return true;
                }
            };

            $provide.value('TransactionService', service);
        }));

        beforeEach(inject(function ($rootScope, $controller) {
            xScope = $rootScope.$new();
            xController = $controller;
        }));

        it('calls TransactionService with filter params', function() {
            spyOn(service, 'exportTransactions');
            controller('relatorioVendasController', {
                $scope: scope,
                TransactionService: service
            });
            xScope.analytical.initialDate = '01/03/2016';
            xScope.analytical.finalDate = '30/10/2016';
            xScope.settlementsSelected = [{id: 1}, {id: 2}, {id: 3}];
            xScope.productsSelected = [{id: 4}, {id: 5}, {id: 6}];

            xScope.exportAnalytical();

            expect(service.exportTransactions).toHaveBeenCalledWith({
                startDate: '20160301',
                endDate: '20161030',
                shopIds: [1, 2, 3],
                cardProductIds: [4, 5, 6],
                currency: 'BRL',
                sort: 'date,ASC'
            }, jasmine.any(Function), jasmine.any(Function));
        });


    });
});
