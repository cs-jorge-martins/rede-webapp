/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */


 /**
  * @class Conciliador.DownloadService
  * Serviço consultas e downloads da fila de download
  */
(function() {
    'use strict';

    angular
        .module('Conciliador.DownloadService', [])
        .service('DownloadService', DownloadService);

    DownloadService.$inject = ['app', '$http', 'Request'];

    function DownloadService(app, $http, Request) {

        return {
            getQueue: GetQueue,
            deleteFromQueue: DeleteFromQueue
        }

        /**
         * @method GetQueue
         * Retorna a fila de downloads do usuário logado
         */
        function GetQueue() {
            var strUrl = app.endpoint + '/downloads/queue';
    		var objQuery = {
                ignoreLoadingBar: true
            };

            return $http.get(strUrl, {
                ignoreLoadingBar: true
            });
        }

        /**
         * @method DeleteFromQueue
         * Delete um download da fila de downloads
         */
        function DeleteFromQueue(strId) {
            return $http({
                url: app.endpoint + "/downloads/" + strId,
                method: "DELETE",
                headers: Request.setHeaders()
            });
        }
    }
})();
