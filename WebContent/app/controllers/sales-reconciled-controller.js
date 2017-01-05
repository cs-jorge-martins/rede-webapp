/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {

    'use strict';

    angular
        .module('Conciliador.salesReconciledController', [])
        .controller('salesReconciledController', SalesReconciled);

    SalesReconciled.$inject = [
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

    function SalesReconciled(
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

        Init();

        function Init() {
            InitFilterVariables();
            GetFilters();
            UpdateDateModel();
            GetSales();
        }

        function InitFilterVariables() {
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
        }

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

        function GetLabels() {
            $scope.terminalLabel = filterService.BuildLabel('terminal', $scope.filteredTerminals, 'is', 1);
            $scope.terminalFullLabel = filterService.BuildTooltip($scope.filteredTerminals);
            $scope.pvLabel = filterService.BuildLabel('estabelecimento', $scope.filteredPvs, 's', 0);
            $scope.pvFullLabel = filterService.BuildTooltip($scope.filteredPvs);
            $scope.acquirerLabel = filterService.BuildLabel('adquirente', $scope.filteredAcquirers, 's', 0);
            $scope.acquirerFullLabel = filterService.BuildTooltip($scope.filteredAcquirers);
            $scope.cardProductLabel = filterService.BuildLabel('bandeira', $scope.filteredCardProducts, 's', 0);
            $scope.cardProductFullLabel = filterService.BuildTooltip($scope.filteredCardProducts);
        }

        function UpdateDateModel() {
            $scope.dateModel.day = calendarFactory.getDayOfDate($scope.dateModel.date);
            $scope.dateModel.monthName = calendarFactory.getMonthNameOfDate($scope.dateModel.date);
        }

        function FormatDateForService() {
            return calendarFactory.formatDateTimeForService($scope.dateModel.date);
        }

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
                conciliationStatus: 'CONCILIED',
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

        function ProcessResults(objResponse) {
            var objContent = objResponse.data.content;
            objContent.forEach(function(objItem) {
                var strModel = 'transactionsModel';
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

        function TransactionModel() {
            this.totalAmount = 0;
            this.count = 0;
            this.transactions = [];
            this.checks = {};
            this.cardProductIds = [];
            this.allChecked = false
        }

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

        function ResetFilter(strModel) {
            $scope[strModel+ 'Model'] = angular.copy($scope[strModel + 'Data']);
            GetSales();
        }

    }


})();