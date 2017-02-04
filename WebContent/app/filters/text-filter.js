/*
 Projeto: conciliation-webapp
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.textFilter',[])

.filter('capitalize', function() {
    return function(strInput) {
        if (strInput != null) {
            strInput = strInput.toLowerCase();
        }

        return strInput.substring(0,1).toUpperCase()+strInput.substring(1);
    }
});
