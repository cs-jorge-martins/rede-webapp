/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {

    'use strict';

    angular
        .module('Conciliador.salesConciliatedDetailsController', [])
        .controller('salesConciliatedDetailsController', salesConciliatedDetailsController);

    salesConciliatedDetailsController.$inject = ['$scope', 'calendarFactory', 'TransactionService', 'modalService', '$uibModalInstance', 'utilsFactory', 'TransactionSummaryService', '$timeout'];

    function salesConciliatedDetailsController($scope, calendarFactory, TransactionService, modalService, $uibModalInstance, utilsFactory, TransactionSummaryService, $timeout) {

        var objVm = this.vm;

        $scope.pagination = {
            maxSize: 4,
            resultsPageModel: 0,
            resultsPerPage: 10,
            resultsTotalItens: 0,
            updateDetails: UpdatePagination
        };

        $scope.items = [];
        $scope.toggleCheckbox = ToggleCheckbox;
        $scope.toggleCheckboxAll = ToggleCheckboxAll;
        $scope.unconciliate = Unconciliate;
        $scope.itemsCounter = 0;
        $scope.detailSelection = {};
        $scope.getDetails = GetDetails;

        $scope.sort = {
            type: 'hour',
            order: 'asc'
        };

        Init();

        function Init() {
            GetDetails();
            ResetSelection();
        }

        function GetDetails() {

            var strDate = calendarFactory.formatDateTimeForService($scope.dateModel.date);

            $timeout(function () {

                var objFilter = {
                    startDate: strDate,
                    endDate: strDate,
                    cardProductIds: [objVm.transaction.cardProduct.id],
                    terminalIds: utilsFactory.joinMappedArray(objVm.filteredTerminals, 'id', ','),
                    shopIds: utilsFactory.joinMappedArray(objVm.filteredPvs, 'id', ','),
                    acquirerIds: [objVm.transaction.acquirer.id],
                    conciliationStatus: 'CONCILIED',
                    page: $scope.pagination.resultsPageModel === 0 ?  0 : $scope.pagination.resultsPageModel - 1,
                    size: $scope.pagination.resultsPerPage,
                    sort: $scope.sort.type + ',' + $scope.sort.order
                };

                TransactionService.GetTransactionByFilter(objFilter).then(function (objResponse) {

                    if (objResponse.data.page.totalElements === 0) {
                        $uibModalInstance.close();
                    } else {
                        $scope.items = objResponse.data.content;
                        $scope.pagination.resultsTotalItens = objResponse.data.page.totalElements;
                    }

                }).catch(function (objResponse) {

                });

            }, 0);
        }

        function ToggleCheckbox(objItemSelected) {
            var intItemIndex = $scope.detailSelection.items.indexOf(objItemSelected.id);
            if (intItemIndex > -1) {
                $scope.detailSelection.items.splice(intItemIndex, 1);
                $scope.detailSelection.count--;
                $scope.detailSelection.checks[objItemSelected.id] = false;
            } else {
                $scope.detailSelection.count++;
                $scope.detailSelection.items.push(objItemSelected.id);
                $scope.detailSelection.checks[objItemSelected.id] = true;
            }

            UpdateSelection();
        }

        function ToggleCheckboxAll() {
            $scope.detailSelection.items.splice(0);
            if ($scope.detailSelection.allChecked == false) {
                $scope.detailSelection.count = $scope.items.length;
                $scope.items.forEach(function HandleItem(objItem) {
                    $scope.detailSelection.items.push(objItem.id);
                    $scope.detailSelection.checks[objItem.id] = true;
                });
            } else {
                $scope.detailSelection.count = 0;
                $scope.items.forEach(function HandleItem(objItem) {
                    $scope.detailSelection.checks[objItem.id] = false;
                })
            }

            UpdateSelection();
        }

        function UpdateSelection() {
            $scope.detailSelection.allChecked = $scope.detailSelection.count === $scope.items.length;
            $scope.detailSelection.labelSuffix = Pluralize('venda', $scope.detailSelection.count);
        }

        function UpdatePagination() {
            GetDetails();
            ResetSelection();
        }

        function ResetSelection() {
            $scope.detailSelection.count = 0;
            $scope.detailSelection.items = [];
            $scope.detailSelection.checks = {};
            $scope.detailSelection.allChecked = false;
            $scope.detailSelection.labelSuffix = 'venda';
        }

        function Unconciliate() {
            var objFilter = {
                ids: $scope.detailSelection.items,
                newConciliationStatus: 'TO_CONCILIE'
            };

            var intSelectionCount = $scope.detailSelection.count;
            var strPluralized = $scope.detailSelection.labelSuffix;

            modalService.open("app/views/sales-conciliation-modal.html", function ModalController($scope, $uibModalInstance) {
                $scope.reconcileType = "desconciliar";
                $scope.countObjTransactionModel = intSelectionCount;
                $scope.modalTitle = "desconciliar vendas";
                $scope.modalText = "Você deseja desconciliar " + intSelectionCount + " " + strPluralized + "?";
                $scope.cancel = function Cancel() {
                    ResetSelection();
                    $scope.close();
                };

                $scope.close = function Close() {
                    $uibModalInstance.close();
                };

                $scope.confirm = function Confirm() {
                    TransactionService.ConcilieTransaction(objFilter).then(function(objResponse) {
                        GetDetails();
                        ResetSelection();
                        UpdateHeader();
                        objVm.search();
                        $uibModalInstance.close();
                    });
                }
            });
        }

        function Pluralize(strText, intCount) {
            if (intCount > 1) {
                return strText + "s";
            }

            return strText;
        }

        function UpdateHeader() {
            var strDate = calendarFactory.formatDateTimeForService($scope.dateModel.date);
            var objFilter = {
                conciliationStatus: 'CONCILIED',
                startDate: strDate,
                endDate: strDate,
                cardProductIds: [objVm.transaction.cardProduct.id],
                terminalIds: utilsFactory.joinMappedArray(objVm.filteredTerminals, 'id', ','),
                acquirerIds: [objVm.transaction.acquirer.id],
                shopIds: utilsFactory.joinMappedArray(objVm.filteredPvs, 'id', ',')
            };

            TransactionSummaryService.ListTransactionSummaryByFilter(objFilter).then(function(objResponse){
                var response = objResponse.data.content[0];
                objVm.transaction.quantity = response.quantity;
                objVm.transaction.amount = response.amount;
            }).catch(function(objResponse){
            });
        }
    }

})();
