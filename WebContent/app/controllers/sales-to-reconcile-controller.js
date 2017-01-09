/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

/**
 * @class Conciliador.salesToReconcileController
 * Controller de vendas a conciliar
 *
 */
(function() {

    'use strict';

    angular
        .module('Conciliador.salesToReconcileController', [])
        .controller('salesToReconcileController', SalesToReconcile);

    SalesToReconcile.$inject = [
        'filtersService',
        '$scope',
        'calendarFactory',
        'TransactionSummaryService',
        'TransactionService',
        '$uibModal',
        '$rootScope',
        'utilsFactory',
        'modalService'
    ];

    function SalesToReconcile(
        filterService,
        $scope,
        calendarFactory,
        transactionSummaryService,
        transactionService,
        $uibModal,
        $rootScope,
        utilsFactory,
        modalService) {

        var objVm = this;

        $scope.closeableChips = true;
        $scope.chipsConfig = {
            show: {
                acquirers: false,
                pvs: false,
                terminals: false,
                cardProducts: false
            },
            update: function Update() {
                $scope.chipsConfig.show.terminals = $scope.terminalsData.length != $scope.filteredTerminals.length;
                $scope.chipsConfig.show.pvs = $scope.pvsData.length != $scope.filteredPvs.length;
                $scope.chipsConfig.show.acquirers = $scope.acquirersData.length != $scope.filteredAcquirers.length;
                $scope.chipsConfig.show.cardProducts = $scope.cardProductsData.length != $scope.filteredCardProducts.length;
            },
            closeable: true
        };
        $scope.dateModel = {};
        $scope.resultModel = [];
        $scope.timelineModel = {
            toReconcile: 0,
            concilied: 0,
            total: 0,
            percentage: 100
        };
        $scope.getSales = GetSales;
        $scope.resetFilter = ResetFilter;
        $scope.reconcile = Reconcile;

        $scope.filterMaxDate = calendarFactory.getYesterday();
        $scope.dateModel.date = calendarFactory.getYesterday();
        $scope.cardProductsData = [];
        $scope.cardProductsModel = [];
        $scope.terminalsData = [];
        $scope.terminalsModel = [];
        $scope.pvsData = [];
        $scope.pvsModel = [];
        $scope.acquirersData = [];
        $scope.acquirersModel = [];

        Init();

        /**
         * @method Init
         * inicializa as funções principais deste controller ao carregar a página
         */
        function Init() {
            GetFilters();
            UpdateDateModel();
            GetSales();
        }

        /**
         * @method GetFilters
         * faz as chamadas para serializar os dados de filtro e coloca-los em scopes, para manipula-los na view
         */
        function GetFilters() {
            filterService.GetCardProductDeferred().then(function (objCardProducts) {
                $scope.cardProductsData = filterService.TransformDeferredDataInArray(objCardProducts, 'name');
                $scope.cardProductsModel = angular.copy($scope.cardProductsData);
            });
            filterService.GetTerminalDeferred().then(function (objTerminals) {
                $scope.terminalsData = filterService.TransformDeferredDataInArray(objTerminals, 'code');
                $scope.terminalsModel = angular.copy($scope.terminalsData);
            });
            filterService.GetPvsDeferred().then(function (objPvs) {
                $scope.pvsData = filterService.TransformDeferredDataInArray(objPvs, 'code');
                $scope.pvsModel = angular.copy($scope.pvsData);
            });
            filterService.GetAcquirersDeferred().then(function (objAcquirers) {
                $scope.acquirersData = filterService.TransformDeferredDataInArray(objAcquirers, 'name');
                $scope.acquirersModel = angular.copy($scope.acquirersData);
            });
        }

        /**
         * @method GetLabels
         * serializa os dados dos filtros para strings correspondentes, que serão inseridas na view
         */
        function GetLabels() {
            $scope.terminalLabel = utilsFactory.buildLabel('terminal', $scope.filteredTerminals, 'is', 1);
            $scope.terminalFullLabel = utilsFactory.buildTooltip($scope.filteredTerminals);
            $scope.pvLabel = utilsFactory.buildLabel('estabelecimento', $scope.filteredPvs, 's', 0);
            $scope.pvFullLabel = utilsFactory.buildTooltip($scope.filteredPvs);
            $scope.acquirerLabel = utilsFactory.buildLabel('adquirente', $scope.filteredAcquirers, 's', 0);
            $scope.acquirerFullLabel = utilsFactory.buildTooltip($scope.filteredAcquirers);
            $scope.cardProductLabel = utilsFactory.buildLabel('bandeira', $scope.filteredCardProducts, 's', 0);
            $scope.cardProductFullLabel = utilsFactory.buildTooltip($scope.filteredCardProducts);
        }

        /**
         * @method UpdateDateModel
         * atualiza o model da data no cabeçalho da página
         */
        function UpdateDateModel() {
            $scope.dateModel.day = calendarFactory.getDayOfDate($scope.dateModel.date);
            $scope.dateModel.monthName = calendarFactory.getMonthNameOfDate($scope.dateModel.date);
        }

        /**
         * @method FormatDateForService
         * formata o dateModel para ser utilizado nas chamadas para a api
         * @return data formatada para (YYYYMMDD)
         */
        function FormatDateForService() {
            return calendarFactory.formatDateTimeForService($scope.dateModel.date);
        }

        /**
         * @method GetTimeLine
         * atualiza os dados da timeline, usando a diretiva rc-timeline na view
         */
        function GetTimeLine() {
            var strDate = FormatDateForService();

            var objFilter = {
                currency: 'BRL',
                groupBy: 'CONCILIATION_STATUS',
                startDate: strDate,
                endDate: strDate,
                cardProductIds: utilsFactory.joinMappedArray($scope.filteredCardProducts, 'id', ','),
                terminalIds: utilsFactory.joinMappedArray($scope.filteredTerminals, 'id', ','),
                acquirerIds: utilsFactory.joinMappedArray($scope.filteredAcquirers, 'id', ','),
                shopIds: utilsFactory.joinMappedArray($scope.filteredPvs, 'id', ',')
            };

            transactionSummaryService.ListTransactionSummaryByFilter(objFilter).then(function (objResponse) {
                var objContent = objResponse.data.content;
                $scope.timelineModel.total = 0;
                $scope.timelineModel.toReconcile = 0;
                $scope.timelineModel.concilied = 0;

                objContent.forEach(function(objItem) {
                    if (objItem.conciliationStatus === 'TO_CONCILIE') {
                        $scope.timelineModel.toReconcile = objItem.quantity;
                    } else if (objItem.conciliationStatus === 'CONCILIED') {
                        $scope.timelineModel.concilied = objItem.quantity;
                    }

                    $scope.timelineModel.total += objItem.quantity;
                });

            });
        }

        /**
         * @method GetSales
         * atualiza os resultados, utilizando os filtros para buscar na api e responder na view
         */
        function GetSales() {
            $scope.filteredTerminals = angular.copy($scope.terminalsModel);
            $scope.filteredAcquirers = angular.copy($scope.acquirersModel);
            $scope.filteredPvs = angular.copy($scope.pvsModel);
            $scope.filteredCardProducts = angular.copy($scope.cardProductsModel);
            $scope.resultModel.splice(0);

            GetLabels();
            UpdateDateModel();
            GetTimeLine();
            $scope.chipsConfig.update();

            var strDate = FormatDateForService();

            var objFilter = {
                conciliationStatus: 'TO_CONCILIE,UNPROCESSED',
                currency: 'BRL',
                groupBy: 'CARD_PRODUCT,CONCILIATION_STATUS,ACQUIRER',
                startDate: strDate,
                endDate: strDate,
                cardProductIds: utilsFactory.joinMappedArray($scope.filteredCardProducts, 'id', ','),
                terminalIds: utilsFactory.joinMappedArray($scope.filteredTerminals, 'id', ','),
                acquirerIds: utilsFactory.joinMappedArray($scope.filteredAcquirers, 'id', ','),
                shopIds: utilsFactory.joinMappedArray($scope.filteredPvs, 'id', ',')
            };

            transactionSummaryService.ListTransactionSummaryByFilter(objFilter).then(ProcessResults);
        }

        /**
         * @method ProcessResults
         * processa a resposta enviada pela api, para manipular a view
         * @param {Promisse} objResponse, resposta do GetSales()
         */
        function ProcessResults(objResponse) {
            var objContent = objResponse.data.content;
            objContent.forEach(function(objItem) {
                var strModel = 'transactionsModel';
                if (objItem.conciliationStatus === 'UNPROCESSED') {
                    strModel = 'unprocessedModel';
                }

                var bolFoundModel = false;
                var objModelFound = null;

                $scope.resultModel.forEach(function(objModel) {
                    if (objModel.acquirer.id === objItem.acquirer.id) {
                        bolFoundModel = true;
                        objModelFound = objModel;
                        return;
                    }
                });

                if (bolFoundModel === false) {
                    objModelFound = {};
                    objModelFound.acquirer = objItem.acquirer;
                    objModelFound[strModel] = new TransactionModel();
                    $scope.resultModel.push(objModelFound);
                }

                if (!objModelFound[strModel]) {
                    objModelFound[strModel] = new TransactionModel()
                }

                objModelFound[strModel].transactions.push(objItem);
                objModelFound[strModel].totalAmount += objItem.amount;
            });
        }

        /**
         * @method TransactionModel
         * cria um modelo de dados para ser utilizado pelo metodo ProcessResults()
         */
        function TransactionModel() {
            this.totalAmount = 0;
            this.count = 0;
            this.transactions = [];
            this.checks = {};
            this.cardProductIds = [];
            this.allChecked = false
        }

        /**
         * @method Reconcile
         * concilia vendas selecionadas na view
         * @param {Object} objTransactionModel, Transações selecionadas
         * @param {Object} objAcquirer, Acquirer das transações selecionadas
         */
        function Reconcile(objTransactionModel, objAcquirer) {

            var strDate = FormatDateForService();

            var objFilter = {
                conciliationStatus: ['TO_CONCILIE'],
                currency: 'BRL',
                startDate: strDate,
                endDate: strDate,
                cardProductIds: objTransactionModel.cardProductIds,
                terminalIds: utilsFactory.joinMappedArray($scope.filteredTerminals, 'id', false),
                acquirerIds: [objAcquirer.id],
                shopIds: utilsFactory.joinMappedArray($scope.filteredPvs, 'id', false)
            };

            modalService.open("app/views/sales-conciliation-modal", function ModalController($scope, $uibModalInstance) {
                $scope.count = objTransactionModel.count;
                $scope.reconcileType = "conciliar";
                $scope.cancel = function Cancel() {
                    $uibModalInstance.close();
                };

                $scope.confirm = function Confirm() {
                    transactionService.ConcilieTransactions(objFilter).then(function(objResponse) {
                        GetSales();
                        $uibModalInstance.close();
                    });
                }
            });

        }

        /**
         * @method ResetFilter
         * reseta o filtro que foi "fechado"
         *
         * O reset filter é ligado diretamente com a diretiva rc-chips, quando clicado no "X" do chips
         * o ResetFilter deve ser acionado para fazer a ação na view
         * @param {String} strModel, primeiro nome da Model
         */
        function ResetFilter(strModel) {
            $scope[strModel+ 'Model'] = angular.copy($scope[strModel + 'Data']);
            GetSales();
        }

    }

})();
