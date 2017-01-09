/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

/**
 * @class Conciliador.UtilsFactory
 * Factory de utilidades do sistema
 *
 */

(function() {
    'use strict';

    angular
        .module('Conciliador.UtilsFactory', [])
        .factory('utilsFactory', Utils);

    Utils.$inject = [];

    function Utils() {

        return {
            joinMappedArray: JoinMappedArray,
            buildLabel: BuildLabel,
            buildTooltip: BuildTooltip
        };

        /**
         * @method JoinMappedArray
         * transforma arrays mapeados por um campo em um array simples
         *
         * @param {Array} arrJoinable, array base
         * @param {String} strField, nome do índice a ser procurado no array
         * @param {String} xJoin, string para juntar os arrays
         * @param {Number} intMaxNumber, quantidade máxima de arrays a serem retornados
         * @return {Array} array simples | {String} array juntado por uma string definida em xJoin
         */
        function JoinMappedArray(arrJoinable, strField, xJoin, intMaxNumber) {

            var xMapped
            xMapped = arrJoinable.map(function(objItem, intIndex) {
                if(!intMaxNumber || (intIndex < intMaxNumber) ) {
                    return objItem[strField];
                }
            });

            if (xJoin !== false) {

                xMapped = _.compact(xMapped).join(xJoin);

                if(arrJoinable.length > intMaxNumber) {
                    xMapped = xMapped + " ...";
                }

            }

            return xMapped;
        }

        /**
         * @method JoinMappedArray
         * transforma uma coleção de objetos em um label
         *
         * @param {String} strName, primeiro nome e palavra a ser utilizada em plural
         * @param {Object} xModel, model com todos os objetos a serem analisados
         * @param {String} strSuffix, sufixo a ser utilizado, caso seja + de 2 objetos
         * @param {Number} intRemoveLast, quantidade de casas a serem retirados para aplicar o plural
         * @return {String} label final, parseado conforme a quantidade de objetos
         */
        function BuildLabel(strName, xModel, strSuffix, intRemoveLast) {
            var intLength = 0;
            var objEntity = xModel;
            if (xModel.length) {
                intLength = xModel.length;
                objEntity = xModel[0];
            }

            if (intLength > 0) {
                var strLabel =  strName + ': ' + objEntity.label;
                if (intLength > 1) {
                    var strPluralized = strName;

                    if (intLength > 2) {
                        strPluralized = strName.substring(0, strName.length - intRemoveLast) + strSuffix;
                    }

                    strLabel = objEntity.label + ' +' + (intLength - 1) + ' ' + strPluralized;
                }

                return strLabel;
            }
        }

        /**
         * @method BuildTooltip
         * transforma uma coleção de objetos em um tooltip
         *
         * @param {Array} arrModel, array base
         * @return {String} se o tooltip tiver + de 30 objetos, será constado os primeiros 30 e
         * adicionado "...", após o último elemento do array
         */
        function BuildTooltip(arrModel) {
            return  JoinMappedArray(arrModel, 'label', ", ", 30);
        }

    }

})();