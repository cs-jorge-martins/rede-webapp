/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */


 /**
  * @class Conciliador.ModalService
  * @extends ui.bootstrap.datepickerPopup
  * Serviço para facilitar a utilização de modais
  */
(function() {
    'use strict';

    angular
        .module('Conciliador.ModalService', [])
        .service('modalService', ModalService);

    ModalService.$inject = ['$rootScope', '$uibModal', '$parse'];

    function ModalService($rootScope, $uibModal, $parse) {

        /**
         * @method open
         * Abre um modal padrão
         *
         * @param {String} strTemplate Path do template que será carregado na modal
         * @param {String} objController Controller que será vinculado a este modal
         *
         * Exemplo de uso:
         *
         *      @example
         *      ModalService.open('view/template.html', 'ModalController');
         *
         */
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

        /**
         * @method openDetails
         * Abre um modal de detalhes (fullscreen)
         *
         * @param {String} strTitle Título do modal
         * @param {String} strTemplateUrl Path do template que será carregado na modal
         * @param {String} objController Controller que será vinculado a este modal
         * @param {Object} objScope Escopo que será passado ao novo modal
         *
         * Exemplo de uso:
         *
         *      @example
         *      ModalService.openDetails('Título da modal', 'view/template.html', 'ModalController', $scope);
         *
         */
        this.openDetails = function(strTitle, strTemplateUrl, objController, objScope) {

            objScope.pageTitle = strTitle;
            objScope.template = strTemplateUrl;
            objScope.close = Close;

            console.log(objScope)

            var strClassName = 'modal-details-opened';

            var objModal = $uibModal.open({
                templateUrl: 'app/views/includes/modal/details.html',
                controller: objController,
                appendTo:  angular.element(document.querySelector('#modalWrapperV2')),
                backdrop: false,
                scope: objScope,
                bindToController: true,
                animation: false,
                windowTopClass: 'modal-details'
            });

            objModal.opened.then(function() {
                BlockContentScroll();
            })

            objModal.closed.then(function() {
                UnblockContentScroll();
            })

            /**
             * @method Close
             * Fecha o modal
             */
            function Close() {
    			objModal.close();
    		}

            /**
             * @method BlockContentScroll
             * Adiciona a classe responsável por bloquear o scroll do conteúdo,
             * pois esta modal é fullscreen. Se o conteúdo for extenso o suficiente
             * para exister scroll, a funcionalidade quebra.
             *
             * Método chamado no momento que o modal abre
             */
            function BlockContentScroll() {
    			document.querySelector('body').classList.add(strClassName);
    		}

            /**
             * @method UnblockContentScroll
             * Remove a classe responsável por bloquear o scroll do conteúdo.
             *
             * Método chamado no momento que o modal fecha
             */
    		function UnblockContentScroll() {
    			document.querySelector('body').classList.remove(strClassName);
    		}
        };
    }
})();
