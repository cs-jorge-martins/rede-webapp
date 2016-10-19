describe('Conciliador', function() {

    beforeEach(module('KaplenWeb'));

    describe('TransactionService', function() {
        var scope, service, httpBackend;

        beforeEach(inject(function ($rootScope, $httpBackend) {
            scope = $rootScope.$new();
            httpBackend = $httpBackend;
            
        }));

        it('calls the service', function(){
            httpBackend
            .expect('GET', /\transactions\/export/)
            .respond(200, { data: 'foobar' });

            service.exportTransactions(jasmine.any(Object), jasmine.any(Function));
            httpBackend.flush();

            expect().toBe
        });
    });
});
