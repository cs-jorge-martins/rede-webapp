describe('RelatorioVendasController', function() {
    var $rootScope, $controller, $httpBackend;

    beforeEach(module('KaplenWeb'));

    beforeEach(inject(function($injector) {
        $controller = $injector.get('$controller');
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        $httpBackend.when('GET', /\/transactions\/export/).respond({'status': 200});
    }));

    it('downloads an Excel file', function() {
        var $scope = {},
            controller = $controller('relatorioVendasController', {$scope: $scope});

        $httpBackend.expectGET(/\/transactions\/export/);
        $scope.exportAnalytical();
        $httpBackend.flush();
    });

});
