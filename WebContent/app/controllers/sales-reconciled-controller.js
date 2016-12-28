/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {

    'use strict';

    angular
        .module('Conciliador.salesReconciledController', [])
        .controller('salesReconciledController', SalesReconciled);

    SalesReconciled.$inject = [];

    function SalesReconciled() {

        var objVm = this;

        Init();

        function Init() {
        }

    }

})();