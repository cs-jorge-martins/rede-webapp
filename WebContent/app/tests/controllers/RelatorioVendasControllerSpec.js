describe('RelatorioVendasController', function() {
    var $rootScope, $controller, $httpBackend;

    beforeEach(module('KaplenWeb'));

    beforeEach(inject(function(_$controller_, _$httpBackend_, _$rootScope_) {
        $controller = _$controller_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;

        $httpBackend.when('GET', /\/transactions\/export/).respond({
            'data': 'http://excel.file'
        });
    }));

    it('calls the TransactionService', function() {
        var $scope = {},
            controller = $controller('relatorioVendasController', {$scope: $scope});

        $httpBackend.expectGET(/\/transactions\/export/);
        $scope.exportAnalytical();
        $httpBackend.flush();
    });
});
