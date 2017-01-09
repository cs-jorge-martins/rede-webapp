/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

/**
 * @class Conciliador.salesToConciliateController
 * Controller de vendas a conciliar
 *
 */
(function() {

    'use strict';

    angular
        .module('Conciliador.salesToConciliateController', [])
        .controller('salesToConciliateController', SalesToConciliateController);

    SalesToConciliateController.$inject = [
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

    function SalesToConciliateController(
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

        objVm.closeableChips = true;
        objVm.chipsConfig = {
            show: {
                acquirers: false,
                pvs: false,
                terminals: false,
                cardProducts: false
            },
            update: function Update() {
                objVm.chipsConfig.show.terminals = objVm.terminalsData.length != objVm.filteredTerminals.length;
                objVm.chipsConfig.show.pvs = objVm.pvsData.length != objVm.filteredPvs.length;
                objVm.chipsConfig.show.acquirers = objVm.acquirersData.length != objVm.filteredAcquirers.length;
                objVm.chipsConfig.show.cardProducts = objVm.cardProductsData.length != objVm.filteredCardProducts.length;
            },
            closeable: true
        };
        objVm.dateModel = {};

        objVm.resultModel = [];
        objVm.timelineModel = {
            toReconcile: 0,
            concilied: 0,
            total: 0,
            percentage: 100
        };
        objVm.getSales = GetSales;
        objVm.resetFilter = ResetFilter;
        objVm.reconcile = Reconcile;


        objVm.filterMaxDate = calendarFactory.getYesterday();
        objVm.dateModel.date = calendarFactory.getYesterday();
        objVm.cardProductsData = [];
        objVm.cardProductsModel = [];
        objVm.terminalsData = [];
        objVm.terminalsModel = [];
        objVm.pvsData = [];
        objVm.pvsModel = [];
        objVm.acquirersData = [];
        objVm.acquirersModel = [];

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
                objVm.cardProductsData = filterService.TransformDeferredDataInArray(objCardProducts, 'name');
                objVm.cardProductsModel = angular.copy(objVm.cardProductsData);
            });
            filterService.GetTerminalDeferred().then(function (objTerminals) {
                objVm.terminalsData = filterService.TransformDeferredDataInArray(objTerminals, 'code');
                objVm.terminalsModel = angular.copy(objVm.terminalsData);
            });
            filterService.GetPvsDeferred().then(function (objPvs) {
                objVm.pvsData = filterService.TransformDeferredDataInArray(objPvs, 'code');
                objVm.pvsModel = angular.copy(objVm.pvsData);
            });
            filterService.GetAcquirersDeferred().then(function (objAcquirers) {
                objVm.acquirersData = filterService.TransformDeferredDataInArray(objAcquirers, 'name');
                objVm.acquirersModel = angular.copy(objVm.acquirersData);
            });
        }

        /**
         * @method GetLabels
         * serializa os dados dos filtros para strings correspondentes, que serão inseridas na view
         */
        function GetLabels() {
            objVm.terminalLabel = utilsFactory.buildLabel('terminal', objVm.filteredTerminals, 'is', 1);
            objVm.terminalFullLabel = utilsFactory.buildTooltip(objVm.filteredTerminals);
            objVm.pvLabel = utilsFactory.buildLabel('estabelecimento', objVm.filteredPvs, 's', 0);
            objVm.pvFullLabel = utilsFactory.buildTooltip(objVm.filteredPvs);
            objVm.acquirerLabel = utilsFactory.buildLabel('adquirente', objVm.filteredAcquirers, 's', 0);
            objVm.acquirerFullLabel = utilsFactory.buildTooltip(objVm.filteredAcquirers);
            objVm.cardProductLabel = utilsFactory.buildLabel('bandeira', objVm.filteredCardProducts, 's', 0);
            objVm.cardProductFullLabel = utilsFactory.buildTooltip(objVm.filteredCardProducts);
        }

        /**
         * @method UpdateDateModel
         * atualiza o model da data no cabeçalho da página
         */
        function UpdateDateModel() {
            objVm.dateModel.day = calendarFactory.getDayOfDate(objVm.dateModel.date);
            objVm.dateModel.monthName = calendarFactory.getMonthNameOfDate(objVm.dateModel.date);
        }

        /**
         * @method FormatDateForService
         * formata o dateModel para ser utilizado nas chamadas para a api
         * @return data formatada para (YYYYMMDD)
         */
        function FormatDateForService() {
            return calendarFactory.formatDateTimeForService(objVm.dateModel.date);
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
                cardProductIds: utilsFactory.joinMappedArray(objVm.filteredCardProducts, 'id', ','),
                terminalIds: utilsFactory.joinMappedArray(objVm.filteredTerminals, 'id', ','),
                acquirerIds: utilsFactory.joinMappedArray(objVm.filteredAcquirers, 'id', ','),
                shopIds: utilsFactory.joinMappedArray(objVm.filteredPvs, 'id', ',')
            };

            transactionSummaryService.ListTransactionSummaryByFilter(objFilter).then(function (objResponse) {
                var objContent = objResponse.data.content;
                objVm.timelineModel.total = 0;
                objVm.timelineModel.toReconcile = 0;
                objVm.timelineModel.concilied = 0;

                objContent.forEach(function(objItem) {
                    if (objItem.conciliationStatus === 'TO_CONCILIE') {
                        objVm.timelineModel.toReconcile = objItem.quantity;
                    } else if (objItem.conciliationStatus === 'CONCILIED') {
                        objVm.timelineModel.concilied = objItem.quantity;
                    }

                    objVm.timelineModel.total += objItem.quantity;
                });

            });
        }

        /**
         * @method GetSales
         * atualiza os resultados, utilizando os filtros para buscar na api e responder na view
         */
        function GetSales() {
            objVm.filteredTerminals = angular.copy(objVm.terminalsModel);
            objVm.filteredAcquirers = angular.copy(objVm.acquirersModel);
            objVm.filteredPvs = angular.copy(objVm.pvsModel);
            objVm.filteredCardProducts = angular.copy(objVm.cardProductsModel);
            objVm.resultModel.splice(0);

            GetLabels();
            UpdateDateModel();
            GetTimeLine();
            objVm.chipsConfig.update();

            var strDate = FormatDateForService();

            var objFilter = {
                conciliationStatus: 'TO_CONCILIE,UNPROCESSED',
                currency: 'BRL',
                groupBy: 'CARD_PRODUCT,CONCILIATION_STATUS,ACQUIRER',
                startDate: strDate,
                endDate: strDate,
                cardProductIds: utilsFactory.joinMappedArray(objVm.filteredCardProducts, 'id', ','),
                terminalIds: utilsFactory.joinMappedArray(objVm.filteredTerminals, 'id', ','),
                acquirerIds: utilsFactory.joinMappedArray(objVm.filteredAcquirers, 'id', ','),
                shopIds: utilsFactory.joinMappedArray(objVm.filteredPvs, 'id', ',')
            };

            transactionSummaryService.ListTransactionSummaryByFilter(objFilter).then(ProcessResults);
        }

        /**
         * @method ProcessResults
         * processa a resposta enviada pela api, para manipular a view
         * @param {Promisse} objResponse resposta do GetSales()
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

                objVm.resultModel.forEach(function(objModel) {
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
                    objVm.resultModel.push(objModelFound);
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
         * @param {Object} objTransactionModel Transações selecionadas
         * @param {Object} objAcquirer Acquirer das transações selecionadas
         */
        function Reconcile(objTransactionModel, objAcquirer) {

            var strDate = FormatDateForService();

            var objFilter = {
                conciliationStatus: ['TO_CONCILIE'],
                currency: 'BRL',
                startDate: strDate,
                endDate: strDate,
                cardProductIds: objTransactionModel.cardProductIds,
                terminalIds: utilsFactory.joinMappedArray(objVm.filteredTerminals, 'id', false),
                acquirerIds: [objAcquirer.id],
                shopIds: utilsFactory.joinMappedArray(objVm.filteredPvs, 'id', false)
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
         * @param {String} strModel primeiro nome da Model
         */
        function ResetFilter(strModel) {
            objVm[strModel+ 'Model'] = angular.copy(objVm[strModel + 'Data']);
            GetSales();
        }

    }

})();
