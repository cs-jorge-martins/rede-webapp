/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

 /**
  * @class Conciliador.rcDownloader
  * Diretiva de gerenciamento de downloads
  *
  * Componente utilizado para gerenciar fila de downloads do usuário.
  * As ações nos botões de exportar arquivos, resultam na criação da fila de downloads,
  * que é representada por uma barra fixa, responsável por listar os downloads e
  * seus respectivos status.
  *
  * Exemplo:
  *
    *     @example
  *     <rc-downloader></rc-downloader>
  */

(function() {
    'use strict';

    angular
        .module('Conciliador')
        .directive('rcDownloader', RcDownloader);

    RcDownloader.$inject = ['modalService', '$timeout', 'DownloadService', 'PollingFactory'];

    function RcDownloader(modalService, $timeout, DownloadService, PollingFactory) {
        return {
            restrict: 'E',
            templateUrl: 'app/views/directives/rc-downloader.html',
            scope: {
                type: "="
            },
            controller: Controller,
            link: function($scope, element, attrs) {

                var header = angular.element(document.querySelector('.rc-downloader .header'));
                Ps.initialize(document.querySelector('.rc-downloader .content-scroll'));

                header.bind('click', function() {
                    var component = document.querySelector('.rc-downloader');

                    if(component.classList.contains('opened')) {
                        component.classList.remove('opened');
                        component.classList.add('closed');
                    } else {
                        component.classList.remove('closed');
                        component.classList.add('opened');
                    }
                });
            }

        };

        function Controller($scope) {

            $scope.cancel = Cancel;
            $scope.download = Download;
            $scope.delete = Delete;
            $scope.parseRemainingTime = ParseRemainingTime;
            $scope.hideClass = "no-itens";
            $scope.blinkClass = "";
            $scope.headerClass = "loading";
            $scope.headerTitle = "preparando arquivo...";
            $scope.heightClass = "single";
            $scope.headerCounter = 0;
            $scope.totals = {
                processing: 0,
                done: 0,
                error: 0,
                sum: 0
            };

            $scope.queue = [];

            var objPool = false;

            /**
             * @method Init
             * Inicializa o componente
             */
            function Init() {
                Listen();
            }

            /**
             * @method Listen
             * Dispara a função de polling para pegar a lista de downloads ativos,
             * e também é responsável pela lógica de quando é necessário parar esse
             * polling, para evitar requests desnecessários.
             */
            function Listen() {
                objPool = PollingFactory.pool(DownloadService.getQueue, function( objResponse ) {
                    var arrData = objResponse.data;
                    UpdateQueue(arrData);

                    if(!arrData.length) {
                        objPool.cancel();
                    }
                }, 3000);
            }

            /**
             * @method UpdateQueue
             * Compara retorno do request que pega a lista de downloads do usuário
             * com a lista atual, e faz o update dos dados da lista quando necessário.
             *
             * @param {Object} arrData Array de objetos com a fila de downloads retornada
             * pela API.
             */
            function UpdateQueue(arrData) {
                if( $scope.queue.length === arrData.length ) {
                    for(var intIndex in arrData) {
                        if( arrData[intIndex].status !== $scope.queue[intIndex].status ) {
                            $scope.queue[intIndex].status = arrData[intIndex].status;
                        }
                        if( arrData[intIndex].fileName !== $scope.queue[intIndex].fileName ) {
                            $scope.queue[intIndex].fileName = arrData[intIndex].fileName;
                        }
                        if( arrData[intIndex].url !== $scope.queue[intIndex].url ) {
                            $scope.queue[intIndex].url = arrData[intIndex].url;
                        }
                        if( arrData[intIndex].lineCount !== $scope.queue[intIndex].lineCount ) {
                            $scope.queue[intIndex].lineCount = arrData[intIndex].lineCount;
                        }
                    }
                } else {
                    $scope.queue = arrData;
                }
            }

            /**
             * @method Cancel
             * Cancela download da fila.
             * Este método dispara um modal de confirmação da ação.
             *
             * @param {Object} objItem objeto da fila de downloads que será cancelado
             * @param {Integer} intIndex índice do objeto a ser cancelado na fila de
             * download. O índice é necessário para a remoção do objeto na fila, feito
             * pelo método Delete
             */
            function Cancel(objItem, intIndex) {
                modalService.open("app/views/directives/rc-downloader-modal-cancel.html", function ModalController($scope, $uibModalInstance) {

                    $scope.cancel = function Cancel() {
                        $scope.close();
                    };

                    $scope.close = function Close() {
                        $uibModalInstance.close();
                    };

                    $scope.confirm = function Confirm() {
                        Delete(objItem, intIndex);
                        $uibModalInstance.close();
                    }
                });
            }

            /**
             * @method Download
             * Faz o download do arquivo.
             * @param {Object} objItem objeto da fila de downloads que será baixado
             */
            function Download(objItem, intIndex) {
                if( objItem.url ) {
                    window.location = objItem.url;
                }
            }

            /**
             * @method Delete
             * Deleta download da fila.
             *
             * @param {Object} objItem objeto da fila de downloads que será deletado
             * @param {Integer} intIndex índice do objeto a ser deletado na fila de
             * download. O índice é necessário para a remoção do objeto na fila
             */
            function Delete(objItem, intIndex) {
                DownloadService.deleteFromQueue(objItem.id);
                $scope.queue.splice(intIndex, 1);
            }

            /**
             * @method ShowLimitExceededMessage
             * Abre um modal para informar o usuário que o limite máximo de
             * downloads foi atingido.
             */
            function ShowLimitExceededMessage() {
                modalService.open("app/views/directives/rc-downloader-modal-limit-exceeded.html", function ModalController($scope, $uibModalInstance) {
                    $scope.close = function Close() {
                        $uibModalInstance.close();
                    };
                });
            }

            /**
             * @method IsAuthenticated
             * Verifica se usuário está autenticado, para exibir o componente ou não.
             * Futuramente seria bom mudar a implementação deste método para utilizar
             * a session factory
             *
             * @return {Boolean} retorna se usuário está autenticado ou não
             */
            function IsAuthenticated() {
                // Todo: Implementario SessionFactory e utilizar o mesmo aqui
                return !!(window.sessionStorage.getItem('token') && window.sessionStorage.getItem('user'));
            }

            /**
             * @method UpdateTotals
             * Atualiza contadores de downloads em andamento, erros e
             * downloads prontos.
             */
            function UpdateTotals(objNew) {
                var objTotals = {
                    processing: 0,
                    done: 0,
                    error: 0,
                    sum: 0
                };

                for(var index in objNew) {
                    switch (objNew[index].status) {
                        case("PROCESSING"):
                        case("INITIALIZED"):
                            objTotals.processing++;
                            break;
                        case("DONE"):
                            objTotals.done++;
                            break;
                        case("ERROR"):
                            objTotals.error++;
                            break;
                        default:
                            console.log("error");
                    }
                }

                if ( !objTotals.processing ) {
                    if (objPool) {
                        objPool.cancel();
                    }
                }

                objTotals.sum = objTotals.processing + objTotals.done + objTotals.error;
                $scope.totals = objTotals;
            }

            /**
             * @method UpdateHeader
             * Atualiza comportamento do header, status, título e contador.
             */
            function UpdateHeader() {
                var objTotals = $scope.totals;
                var strClass = "";
                var intCounter = 0;
                var strTitle = "";

                if(objTotals.sum) {
                    $scope.hideClass = "";
                } else {
                    $scope.hideClass = "no-itens";
                    if( objPool ) {
                        objPool.cancel();
                    }
                }

                if (objTotals.processing ) {
                    strClass = "loading";
                    strTitle = "preparando arquivo...";
                    intCounter = objTotals.processing;
                }

                if (objTotals.done ) {
                    strClass = "warning";
                    strTitle = "pronto para download";
                    intCounter = objTotals.done;
                }

                if (objTotals.error ) {
                    strClass = "error";
                    strTitle = "ocorreu um erro";
                    intCounter = 0;
                }

                if( ($scope.headerClass !== strClass) || ($scope.headerCounter !== intCounter)  ) {
                    $scope.blinkClass = "flick";

                    $timeout(function(){
                        $scope.blinkClass = "";
                    }, 1000);
                }

                $scope.headerClass = strClass;
                $scope.headerTitle = strTitle;
                $scope.headerCounter = intCounter;

            }

            /**
             * @method GetHeightClass
             * Responsável por definir a classe css que será definirá a altura
             * do componente.
             * Pode ser "single" (quando existe pelo menos um downlaod ativo na
             * lista de downloads) ou "double" (quando existe mais de um download
             * ativo na lista).
             * A classe "single" fará com que o componente tenha altura suficiente
             * para exibir 1 item, enquanto "double" fará com que o componente
             * tenha altura para exibir 2 itens.
             */
            function GetHeightClass() {
                if ($scope.queue.length > 1) {
                    $scope.heightClass = "double";
                } else {
                    $scope.heightClass = "single";
                }
            }

            /**
             * @method ParseRemainingTime
             * Faz o parse do tempo estimado para download, que vem da API.
             * A API retorna uma String com o tempo estimado, essa string precisa
             * ser parseada para fazer sentido para o usuário.
             * O Retorno da API é algo como 'PT5M10S'.
             */
            function ParseRemainingTime (strRemainingTime) {
                var intMinutes,
                    intSeconds;

                if (strRemainingTime) {
                    strRemainingTime = strRemainingTime.substring(-2);

                    if (strRemainingTime.match('M')) {

                    }
                }

                return '';
            }

            $scope.$on('download-init', function(event, objData) {
                $scope.queue.push(objData);
                Init();
            });

            $scope.$on('download-limit-exceeded', function(event, objData) {
                ShowLimitExceededMessage();
            });


            $scope.$watch('queue', function(objNew) {
                UpdateTotals(objNew);
                UpdateHeader();
                GetHeightClass();
    		}, true);

            $scope.$watch(function (){ return window.sessionStorage.token },function(strValue){
                if (strValue === undefined) {
                    $scope.hideClass = "no-itens";
                    $scope.queue = [];
                } else {
                    Init();
                }
            })
        }
    }
})();
