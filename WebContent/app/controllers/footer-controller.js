/*
	Projeto: conciliation
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

(function() {
	'use strict';

	angular
		.module('Conciliador.FooterController', [])
		.controller('FooterController', Footer);

	Footer.$inject = [];

	function Footer() {

		var vm = this;
		vm.dummy = dummy;

		init();

		function init() {
		}

		function dummy() {
		}

	}
})();
