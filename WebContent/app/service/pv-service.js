/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */


 /**
  * @class Conciliador.pvService
  * Serviço para manipular grupo de PVs
  */

"use strict";

(function() {

    angular
        .module('Conciliador.PvService', [])
        .service('pvService', PvService);

    PvService.$inject = ['app', '$http', 'Request'];

    function PvService(app, $http, Request) {

        /**
         * @method saveGroup
         * Salva um agrupamento de PVs
         *
         * @param {Object} objGroup objeto com a estrutura do grupo
         * { name: "nome do grupo", pvs: [lista_de_PVs] }
         */
        this.saveGroup = function(objGroup) {
			return $http({
				url: app.endpoint + '/groups',
				method: "POST",
				data: objGroup,
				headers: Request.setHeaders()
			});
        };

		/**
         * @method getGroups
         * Lista os grupos de PVs do usuário
         */
        this.getGroups = function() {
			return $http({
				url: app.endpoint + '/pvs/groups',
				method: "GET",
				headers: Request.setHeaders()
			});
        };

        /**
         * @method getGroups
         * Edita um grupo de PVs do usuário
         */
        this.editGroup = function(objGroup) {
            return $http({
                url: app.endpoint + '/groups',
                method: "PUT",
                data: objGroup,
                headers: Request.setHeaders()
            });
        };

        /**
         * @method getGroups
         * Deleta um grupo de PVs do usuário
         */
        this.deleteGroup = function(intID) {
			return $http({
                url: app.endpoint + '/groups/' + intID,
                method: "DELETE",
                headers: Request.setHeaders()
            });
        };
    }
})();
