/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

/**
 * @class Conciliador.RcMessageService
 * @extends rc-message
 * Serviço do Rc-message
 */

"use strict";

(function() {

    angular
        .module('Conciliador.RcMessageService', [])
        .service('RcMessageService', RcMessageService);

    RcMessageService.$inject = ['$rootScope'];

    function RcMessageService($rootScope) {

        /**
         * @method create
         * Cria uma mensagem de aviso no sistema
         *
         * @param {String} strType O tipo do aviso, para modificar cores e icones
         * @param {String} strText O texto da mensagem de aviso
         * @param {String} strActionText O texto do botão de ação
         * @param {Function} funOnClick Função que deve ser executada ao clicar no botão de ação
         * @param {Object} objScope O scope do controller para manipular dentro da função passada
         *
         * Exemplo para usar em um controller:
         *
         *      @example
         *      RcMessageService.create('danger', 'existem vendas duplicadas', 'ver detalhes', $scope.teste, $scope);
         *
         */
        this.create = function(strType, strText, strActionText, funOnClick, objScope) {

            $rootScope.rcMessages.push({
                type: strType,
                text: strText,
                actionText: strActionText,
                onClick: funOnClick,
                scope: objScope
            });

        };

        /**
         * @method clear
         * Deleta todos os rc-messages da página
         *
         */
        this.clear = function () {
            $rootScope.rcMessages = [];
        };

    }
})();
