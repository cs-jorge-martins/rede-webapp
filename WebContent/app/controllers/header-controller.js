/*
	Projeto: conciliation
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

(function() {
	'use strict';

	angular
		.module('Conciliador.HeaderController', [])
		.controller('HeaderController', Header);

	Header.$inject = ['$scope', '$location', '$route', '$window', '$rootScope'];

	function Header($scope, $location, $route, $window, $rootScope) {

		var vm = this;
		vm.isActive = IsActive;
		vm.logout = Logout;
		//vm.showMenu = Session.isAuthenticated();
		vm.showMenu = IsAuthenticated();
        vm.showMenu = true;

		Init();

		function Init() {
			WatchMenuState();
		}

		function IsActive(route) {
			if ($route.current.$$route.originalPath === route) {
				return true;
			}

			return false;
		}

		function Logout() {
			//Session.destroy();
			//$location.path('/');
			$rootScope.logout();
		}

		function WatchMenuState() {
			$scope.$on('$routeChangeSuccess', function() {
				//vm.showMenu = Session.isAuthenticated();
                vm.showMenu = IsAuthenticated();
			});
		}

		function IsAuthenticated() {
			if(angular.isDefined($window.sessionStorage.token)) {
				return true;
			}
			return false;
		}

	}
})();
