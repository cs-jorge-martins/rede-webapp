/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {
    'use strict';

    angular
        .module('Conciliador.ModalService', [])
        .service('modalService', ModalService);

    ModalService.$inject = ['$rootScope', '$uibModal'];

    function ModalService($rootScope, $uibModal) {

        this.open = function(strTemplate, objController) {
            $uibModal.open({
                templateUrl: strTemplate,
                appendTo:  angular.element(document.querySelector('#modalWrapperV2')),
                controller: objController
            }).closed.then(function() {
                $rootScope.modalOpen = false;
            });
            $rootScope.modalOpen = true;
        };

    }

})();