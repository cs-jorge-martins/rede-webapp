/*
 Projeto: conciliation-webapp
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.slugfyFilter',[])

.filter('slugify', ['$filter', function($filter){
    return function (strToSlug) {

        if (!strToSlug)
            return;

        var strFrom = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
        var strTo   = "aaaaaeeeeeiiiiooooouuuunc------";

        var strHolder = strToSlug.replace(/^\s+|\s+$/g, '');
        strHolder = strHolder.toLowerCase();
        var intCountLettersFrom = strFrom.length;

        for (var intIndex=0 ; intIndex<intCountLettersFrom ; intIndex++) {
            strHolder = strHolder.replace(new RegExp(strFrom.charAt(intIndex), 'g'), strTo.charAt(intIndex));
        }

        strHolder = strHolder.replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        return strHolder;

    }
}])