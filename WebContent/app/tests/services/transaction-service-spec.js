/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
describe('Conciliador', function() {

    beforeEach(module('KaplenWeb'));

    describe('TransactionService', function() {
        var xScope = null; 
        var xService = null;
        var xHttpBackend = null;

        beforeEach(inject(function ($rootScope, $httpBackend, TransactionService) {
            xScope = $rootScope.$new();
            xHttpBackend = $httpBackend;
            xService = TransactionService;
        }));

        it('check if success callback is called when the service gets a 200 response from backend', function(){
            var xFakeSuccessCallback = null;
            var xFakeErrorCallback = null;
            
            xFakeSuccessCallback = jasmine.createSpy();
            xFakeErrorCallback = jasmine.createSpy();

            xHttpBackend
            .expect('POST', /http(s)?:\/\/.*\/transactions\/export\?.*/)
            .respond(200, { data: 'http://s3-bucket/path/xls' });

            xService.exportTransactions(jasmine.any(Object), xFakeSuccessCallback, xFakeErrorCallback);
            xHttpBackend.flush();

            expect(xFakeSuccessCallback).toHaveBeenCalled();
            expect(xFakeErrorCallback.calls.any()).toBe(false);

        });

        it('check if error callback is called when the service gets a 400 response from backend', function(){
            var xFakeSuccessCallback = null;
            var xFakeErrorCallback = null;
            
            xFakeSuccessCallback = jasmine.createSpy();
            xFakeErrorCallback = jasmine.createSpy();

            xHttpBackend
            .expect('POST', /http(s)?:\/\/.*\/transactions\/export\?.*/)
            .respond(400);

            xService.exportTransactions(jasmine.any(Object), xFakeSuccessCallback, xFakeErrorCallback);
            xHttpBackend.flush();

            expect(xFakeSuccessCallback.calls.any()).toBe(false);
            expect(xFakeErrorCallback).toHaveBeenCalled();

        });
    });
});
