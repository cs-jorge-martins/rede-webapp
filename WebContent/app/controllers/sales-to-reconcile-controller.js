/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {

    'use strict';

    angular
        .module('Conciliador.salesToReconcileController', [])
        .controller('salesToReconcileController', salesToReconcile);

    salesToReconcile.$inject = [];

    function salesToReconcile() {

        var objVm = this;

        Init();

        function Init() {
        }

    }

})();