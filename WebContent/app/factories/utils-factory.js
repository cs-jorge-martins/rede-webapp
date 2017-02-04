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
         * @param {Array} arrJoinable array base
         * @param {String} strField nome do índice a ser procurado no array
         * @param {String} strJoin string para juntar os arrays
         * @param {Number} intMaxNumber quantidade máxima de arrays a serem retornados
         * @return {Array} array simples | {String} array juntado por uma string definida em strJoin
         */
        function JoinMappedArray(arrJoinable, strField, strJoin, intMaxNumber) {

            var objMapped;

            objMapped = arrJoinable.map(function(objItem, intIndex) {
                if(!intMaxNumber || (intIndex < intMaxNumber) ) {
                    return objItem[strField];
                }
            });

            if (strJoin !== false) {

                objMapped = _.compact(objMapped).join(strJoin);

                if(arrJoinable.length > intMaxNumber) {
                    objMapped = objMapped + " ...";
                }

            }

            return objMapped;
        }

        /**
         * @method JoinMappedArray
         * transforma uma coleção de objetos em um label
         *
         * @param {String} strName primeiro nome e palavra a ser utilizada em plural
         * @param {Object} arrModel model com todos os objetos a serem analisados
         * @param {String} strSuffix sufixo a ser utilizado, caso seja + de 2 objetos
         * @param {Number} intRemoveLast quantidade de casas a serem retirados para aplicar o plural
         * @return {String} label final, parseado conforme a quantidade de objetos
         */
        function BuildLabel(strName, arrModel, strSuffix, intRemoveLast) {
            var intLength = 0;
            var objEntity = arrModel;
            if (arrModel.length) {
                intLength = arrModel.length;
                objEntity = arrModel[0];
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
         * @param {Array} arrModel array base
         * @return {String} se o tooltip tiver + de 30 objetos, será constado os primeiros 30 e
         * adicionado "...", após o último elemento do array
         */
        function BuildTooltip(arrModel) {
            return  JoinMappedArray(arrModel, 'label', ", ", 30);
        }

    }

})();
