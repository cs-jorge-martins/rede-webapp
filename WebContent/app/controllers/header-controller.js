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

		var objVm = this;
		objVm.isActive = IsActive;
		objVm.logout = Logout;
		//objVm.showMenu = Session.isAuthenticated();
		objVm.showMenu = IsAuthenticated();
        objVm.showMenu = true;

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
				//objVm.showMenu = Session.isAuthenticated();
                objVm.showMenu = IsAuthenticated();
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
