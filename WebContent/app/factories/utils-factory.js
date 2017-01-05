/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {
    'use strict';

    angular
        .module('Conciliador.UtilsFactory', [])
        .factory('utilsFactory', Utils);

    Utils.$inject = [];

    function Utils() {

        return {
            joinMappedArray: JoinMappedArray
        };

        function JoinMappedArray(arrJoinable, strField, xJoin) {
            var map = arrJoinable.map(function(objItem){
                return objItem[strField];
            });

            if (xJoin !== false) {
                return map.join(xJoin);
            }

            return map;
        }

    }

})();