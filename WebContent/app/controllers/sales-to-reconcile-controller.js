/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {

    'use strict';

    angular
        .module('Conciliador.salesToReconcileController', [])
        .controller('salesToReconcileController', salesToReconcile);

    salesToReconcile.$inject = ['filtersService', '$scope', 'calendarFactory', 'TransactionSummaryService', 'TransactionService', '$uibModal', '$rootScope'];

    function salesToReconcile(filterService, $scope, calendarFactory, transactionSummaryService, transactionService, $uibModal, $rootScope) {

        var objVm = this;

        $scope.dateModel = {};
        $scope.resultModel = [];
        $scope.timelineModel = {
            toReconcile: 0,
            concilied: 0,
            total: 0,
            percentage: 100
        };
        $scope.getReceipt = GetReceipt;
        $scope.resetFilter = ResetFilter;
        $scope.selectSingle = SelectSingle;
        $scope.selectAll = SelectAll;
        $scope.reconcile = Reconcile;

        Init();

        function Init() {
            DefaultOptions();
            InitFilterVariables();
            GetFilters();
            UpdateDateModel();
            GetReceipt();
                            }
        
        function DefaultOptions() {
            $scope.filterMaxDate = calendarFactory.getYesterday();
        }

        function InitFilterVariables() {
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

        function UpdateDateModel() {
            $scope.dateModel.day = calendarFactory.getDayOfDate($scope.dateModel.date);
            $scope.dateModel.monthName = calendarFactory.getMonthNameOfDate($scope.dateModel.date);
            }

        function GetLabels() {
            $scope.terminalLabel = BuildLabel('terminal', $scope.filteredTerminals, 'is', 1);
            $scope.terminalFullLabel = BuildTooltip($scope.filteredTerminals);
            $scope.pvLabel = BuildLabel('estabelecimento', $scope.filteredPvs, 's', 0);
            $scope.pvFullLabel = BuildTooltip($scope.filteredPvs);
            $scope.acquirerLabel = BuildLabel('adquirente', $scope.filteredAcquirers, 's', 0);
            $scope.acquirerFullLabel = BuildTooltip($scope.filteredAcquirers);
            $scope.cardProductLabel = BuildLabel('bandeira', $scope.filteredCardProducts, 's', 0);
            $scope.cardProductFullLabel = BuildTooltip($scope.filteredCardProducts);
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

                    strLabel += ' +' + (intLength - 1) + ' ' + strPluralized;
                }


                return strLabel;
            }
        }

        function Reconcile(objTransactionModel, objAcquirer) {
            if (objTransactionModel.cardProductIds.length < 1) {
                alert('Selecione ao menos um lançamento.');
                return;
            }

            var strDate = FormatDateForService();

            var objFilter = {
                conciliationStatus: ['TO_CONCILIE'],
                currency: 'BRL',
                startDate: strDate,
                endDate: strDate,
                cardProductIds: objTransactionModel.cardProductIds,
                terminalIds: JoinMappedArray($scope.filteredTerminals, 'id', false),
                acquirerIds: [objAcquirer.id],
                shopIds: JoinMappedArray($scope.filteredPvs, 'id', false)
            };

            OpenModal("app/views/sales-conciliation-modal", function ModalController($scope, $uibModalInstance) {
                $scope.count = objTransactionModel.count;
                $scope.cancel = function Cancel() {
                    $uibModalInstance.close();
                };

                $scope.confirm = function Confirm() {
                    transactionService.ConcilieTransactions(objFilter).then(function(objResponse) {
                        GetReceipt();
                        $uibModalInstance.close();
                    });
                }
            });
        }

        function GetReceipt() {
            $scope.filteredTerminals = angular.copy($scope.terminalsModel);
            $scope.filteredAcquirers = angular.copy($scope.acquirersModel);
            $scope.filteredPvs = angular.copy($scope.pvsModel);
            $scope.filteredCardProducts = angular.copy($scope.cardProductsModel);
            $scope.resultModel.splice(0);

            GetLabels();
            UpdateDateModel();
            GetTimeLine();

            var strDate = FormatDateForService();

            var objFilter = {
                conciliationStatus: 'TO_CONCILIE,UNPROCESSED',
                currency: 'BRL',
                groupBy: 'CARD_PRODUCT,CONCILIATION_STATUS,ACQUIRER',
                startDate: strDate,
                endDate: strDate,
                cardProductIds: JoinMappedArray($scope.filteredCardProducts, 'id', ','),
                terminalIds: JoinMappedArray($scope.filteredTerminals, 'id', ','),
                acquirerIds: JoinMappedArray($scope.filteredAcquirers, 'id', ','),
                shopIds: JoinMappedArray($scope.filteredPvs, 'id', ',')
            };

            transactionSummaryService.ListTransactionSummaryByFilter(objFilter).then(ProcessResults);
        }

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

        function TransactionModel() {
            this.totalAmount = 0;
            this.count = 0;
            this.transactions = [];
            this.checks = {};
            this.cardProductIds = [];
            this.allChecked = false
        }

        function GetTimeLine() {
            var strDate = FormatDateForService();

            var objFilter = {
                currency: 'BRL',
                groupBy: 'CONCILIATION_STATUS',
                startDate: strDate,
                endDate: strDate,
                cardProductIds: JoinMappedArray($scope.filteredCardProducts, 'id', ','),
                terminalIds: JoinMappedArray($scope.filteredTerminals, 'id', ','),
                acquirerIds: JoinMappedArray($scope.filteredAcquirers, 'id', ','),
                shopIds: JoinMappedArray($scope.filteredPvs, 'id', ',')
            };

            transactionSummaryService.ListTransactionSummaryByFilter(objFilter).then(function ProcessResults(objResponse) {
                var objContent = objResponse.data.content;
                $scope.timelineModel.total = 0;
                $scope.timelineModel.toReconcile = 0;
                $scope.timelineModel.concilied = 0;
                $scope.timelineModel.percentage = 0;

                objContent.forEach(function(objItem) {
                    if (objItem.conciliationStatus === 'TO_CONCILIE') {
                        $scope.timelineModel.toReconcile = objItem.quantity;
                    } else if (objItem.conciliationStatus === 'CONCILIED') {
                        $scope.timelineModel.concilied = objItem.quantity;
                    }

                    $scope.timelineModel.total += objItem.quantity;
                });

                $scope.timelineModel.percentage = $scope.timelineModel.toReconcile / $scope.timelineModel.total * 100;
            });
        }

        function FormatDateForService() {
            return calendarFactory.formatDateTimeForService($scope.dateModel.date);
        }

        function ResetFilter(strModel) {
            $scope[strModel+ 'Model'] = angular.copy($scope[strModel + 'Data']);
            GetReceipt();
        }

        function SelectSingle(objTransactionContainer, objTransaction) {
            DoSelectSingle(objTransactionContainer, objTransaction);

            objTransactionContainer.allChecked = objTransactionContainer.transactions.length === objTransactionContainer.cardProductIds.length;
        }

        function DoSelectSingle(objTransactionContainer, objTransaction) {
            var intCardProduct = objTransaction.cardProduct.id;
            var intQuantity = objTransaction.quantity;
            if (objTransactionContainer.checks[intCardProduct] === true) {
                var intItemIndex = objTransactionContainer.cardProductIds.indexOf(intCardProduct);
                objTransactionContainer.cardProductIds.splice(intItemIndex, 1);
                objTransactionContainer.count -= intQuantity;
                objTransactionContainer.checks[intCardProduct] = false;
            } else {
                objTransactionContainer.cardProductIds.push(intCardProduct);
                objTransactionContainer.count += intQuantity;
                objTransactionContainer.checks[intCardProduct] = true;
            }
        }

        function SelectAll(objTransactionContainer) {
            // objTransactionContainer.count = 0;
            // objTransactionContainer.cardProductIds.splice(0);

            var bolOldValue = objTransactionContainer.allChecked;
            objTransactionContainer.allChecked = !bolOldValue;
            objTransactionContainer.transactions.forEach(function (objItem) {
                // objTransactionContainer.checks[objItem.cardProduct.id] = bolOldValue;
                var bolCurrent = objTransactionContainer.checks[objItem.cardProduct.id];
                if (bolCurrent !== objTransactionContainer.allChecked) {
                    DoSelectSingle(objTransactionContainer, objItem);
                }
            });
        }

        function BuildTooltip(arrModel) {
            return JoinMappedArray(arrModel, 'label', ", ");
        }

        function JoinMappedArray(arrJoinable, strField, xJoin) {
            var map = arrJoinable.map(function(objItem){
                return objItem[strField];
            });

            if (xJoin !== false) {
                return map.join(xJoin);
            }

            return map;
        }

        function OpenModal(strTemplate, objController) {
            $uibModal.open({
                templateUrl: strTemplate,
                appendTo:  angular.element(document.querySelector('#modalWrapperV2')),
                controller: objController
            }).closed.then(function() {
                $rootScope.modalOpen = false;
            });
            $rootScope.modalOpen = true;
        }

    }

})();
