/*
	Projeto: conciliation
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

(function() {

	angular
		.module('Conciliador.FooterController', [])
		.controller('FooterController', Footer);

	Footer.$inject = [];

	function Footer() {

		var objVm = this;
		objVm.year = (new Date()).getFullYear();

		init();

		function init() {
		}
	}
})();
