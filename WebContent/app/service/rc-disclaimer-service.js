/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

/**
 * @class Conciliador.RcDisclaimerService
 * @extends rc-disclaimer
 * Serviço do Rc-disclaimer
 */
(function() {
    'use strict';

    angular
        .module('Conciliador.RcDisclaimerService', [])
        .service('RcDisclaimerService', RcDisclaimerService);

    RcDisclaimerService.$inject = ['$rootScope'];

    function RcDisclaimerService($rootScope) {

        /**
         * @method create
         * Cria um disclaimer de aviso no sistema, em cima do header
         *
         * @param {String} strType O tipo do aviso, para modificar cores e icones
         * @param {String} strText O texto da mensagem de aviso
         * @param {String} strActionText O texto do botão de ação
         * @param {Function} funOnClick Função que deve ser executada ao clicar no botão de ação
         *
         * Exemplo para usar em um controller:
         *
         *      @example
         *      RcDisclaimerService.create('warning', 'existem vendas duplicadas', 'ver detalhes', $scope.teste);
         *
         */
        this.create = function(strType, strText, strActionText, strLinkOnClick) {

            if($rootScope.rcDisclaimer) {
                this.clear();
            }

            $rootScope.rcDisclaimer = {
                type: strType,
                text: strText,
                actionText: strActionText,
                onClick: strLinkOnClick
            };

        };

        /**
         * @method clear
         * Deleta o rc-disclaimer
         *
         */
        this.clear = function () {
            $rootScope.rcDisclaimer = {};
        };

    }
})();