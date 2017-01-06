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
            joinMappedArray: JoinMappedArray,
            buildLabel: BuildLabel,
            buildTooltip: BuildTooltip
        };

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

        function BuildTooltip(arrModel) {
            return  JoinMappedArray(arrModel, 'label', ", ", 30);;
        }

    }

})();