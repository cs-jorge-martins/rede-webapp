/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

/**
 * @class Conciliador.PollingFactory
 * Factory para facilitar o processo de polling request
 */

(function() {
    'use strict';

    angular
        .module('Conciliador.PollingFactory', [])
        .factory('PollingFactory', PollingFactory);

    PollingFactory.$inject = ['$interval'];

    function PollingFactory($interval) {

        return {
            pool: Pool
        };

        /**
         * @method Pool
         * dispara o processo de pool. Faz a chamada e repete ela periodicamente,
         * num intervalo de tempo a sere definido na chamada.
         *
         * @param {Object} objService Service a ser executado no polling
         * @param {Object} objCallback Callback a ser executado com o retorno no
         * service
         * @param {Integer} intTime intervalo entre os requests em milisegundos
         */
        function Pool( objService, objCallback, intTime ) {
            var intTime = intTime || 10000;
            var objPool;

            if( objService && objCallback ) {
                objPool = $interval(function(){
                    objService().then(function(objData){
                        objCallback(objData);
                    });
                }, intTime);
            }

            function Cancel() {
                $interval.cancel(objPool);
            }

            return {
                cancel: Cancel
            }
        }
    }

})();
