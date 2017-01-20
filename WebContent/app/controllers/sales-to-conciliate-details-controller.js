/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {

    'use strict';

    angular
        .module('Conciliador.salesToConcileDetailsController', [])
        .controller('salesToConcileDetailsController', salesToConcileDetailsController);


    salesToConcileDetailsController.$inject = ['$scope'];

    function salesToConcileDetailsController($scope) {

        var objVm = this;

        console.log($scope.transaction)
        console.log($scope.transaction)

        $scope.teste = [[],[],[],[],[],[],[],[],[]];

    }

})();
