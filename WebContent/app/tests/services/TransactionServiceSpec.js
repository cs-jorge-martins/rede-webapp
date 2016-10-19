describe('Conciliador', function() {

    beforeEach(module('KaplenWeb'));

    describe('TransactionService', function() {
        var scope, service, httpBackend;

        beforeEach(inject(function ($rootScope, $httpBackend, TransactionService) {
            scope = $rootScope.$new();
            httpBackend = $httpBackend;
            service = TransactionService;
        }));

        it('check if success callback is called when the service gets a 200 response from backend', function(){
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

        it('check if error callback is called when the service gets a 400 response from backend', function(){
            fakeSuccessCallback = jasmine.createSpy();
            fakeErrorCallback = jasmine.createSpy();

            httpBackend
            .expect('GET', /http:\/\/.*\/transactions\/export\?.*/)
            .respond(400);

            service.exportTransactions(jasmine.any(Object), fakeSuccessCallback, fakeErrorCallback);
            httpBackend.flush();

            expect(fakeSuccessCallback.calls.any()).toBe(false);
            expect(fakeErrorCallback).toHaveBeenCalled();

        });
    });
});
