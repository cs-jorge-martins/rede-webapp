describe('Conciliador', function() {

    beforeEach(module('KaplenWeb'));

    describe('RelatorioVendasController', function() {
        var scope, controller, service;

        beforeEach(module(function($provide) {
            service = {
                exportTransactions: function () {
                   return true;
                }
            };

            $provide.value('TransactionService', service);
        }));

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller;
        }));

        it('receives an Excel file link', function() {
            spyOn(service, 'exportTransactions');
            controller('relatorioVendasController', {$scope: scope, TransactionService: service});
            scope.exportAnalytical();
            expect(service.exportTransactions).toHaveBeenCalled();
        });
    });
});
