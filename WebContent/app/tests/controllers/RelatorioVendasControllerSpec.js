describe('Conciliador', function() {

    beforeEach(module('KaplenWeb'));

    describe('RelatorioVendasController', function() {
        var scope, httpBackend, http, controller, service;

        beforeEach(module(function($provide) {
            service = {
                exportTransactions: function () {
                   return true;
                }
            };

            $provide.value('TransactionService', service);
        }));

        beforeEach(inject(function ($rootScope, $controller, $httpBackend, $http) {
            scope = $rootScope.$new();
            httpBackend = $httpBackend;
            controller = $controller;
            http = $http;

            httpBackend.when("GET", /\/transactions\/export/).respond({
                'status': 200,
                'data': 'http://excel.file'
            });
        }));

        it('receives an Excel file link', function() {
            spyOn(service, 'exportTransactions').and.returnValue({data: 'http://excel.file'});
            controller('relatorioVendasController', {$scope: scope, $http: http, TransactionService: service});
            scope.exportAnalytical();
            expect(service.exportTransactions).toHaveBeenCalled();
        });
    });
});
