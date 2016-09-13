(function() {
    'use strict';

    angular
        .module('Conciliador.FirstAccessController', ['ui.bootstrap'])
		.config(['$routeProvider','RestangularProvider' , function ($routeProvider) {
			$routeProvider.when('/firstAccess', {
				templateUrl: 'app/views/firstAccess.html',
				controller: 'FirstAccessController'
			});
		}])
        .controller('FirstAccessController', FirstAccess);

    FirstAccess.$inject = ['menuFactory', '$scope', '$modal', '$rootScope',
    '$window', 'advancedFilterService', '$location', 'loginService'];

    function FirstAccess(menuFactory, $scope, $modal, $rootScope,
    $window, advancedFilterService, $location, loginService) {

    	$rootScope.login = 'login';
        $scope.changePassword = changePassword;

		init();
        $scope.user = $scope.user;

		function init() {
            handleFirstAccess();
		}

        function handleFirstAccess() {
            if($rootScope.firstAccess) {
                //delete $window.sessionStorage.firstAccess
            } else {
                //$location.path('/login');
            }
        }

        function changePassword() {
            $scope.user = $scope.user;

            loginService.resetPassword($scope.user).then(function(response){
                if(response.data.newToken){
                    $window.sessionStorage.token = response.data.newToken;
                    delete $window.sessionStorage.firstAccess;
					$rootScope.firstAccess = false;
                    $location.path('/dashboard');
                } else {
                    $rootScope.alerts =  [{ type: "danger", msg: "E-mail informado não existe ou as senhas não são idênticas"} ];
                }

            }).catch(function(response) {
            });
        }

    }
})();
