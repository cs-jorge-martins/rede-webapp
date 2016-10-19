describe('Conciliador', function() {

    beforeEach(module('KaplenWeb'));

    describe('TransactionService', function() {
        var scope, service, httpBackend;

        beforeEach(inject(function ($rootScope, $httpBackend, TransactionService) {
            scope = $rootScope.$new();
            httpBackend = $httpBackend;
            service = TransactionService;
        }));

        it('calls the service', function(){
            fakeSuccessCallback = jasmine.createSpy();
            fakeErrorCallback = jasmine.createSpy();

            httpBackend
            .expect('GET', /http:\/\/.*\/transactions\/export\?.*/)
            .respond(200, { data: 'http://s3-bucket/path/xls' });

            service.exportTransactions(jasmine.any(Object), fakeSuccessCallback, fakeErrorCallback);
            httpBackend.flush();

            expect(fakeSuccessCallback).toHaveBeenCalled();
            expect(fakeErrorCallback.calls.any()).toBe(false);

        });
    });
});
