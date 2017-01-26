/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {

    'use strict';

    angular
        .module('Conciliador.salesToConciliateDetailsController', [])
        .controller('salesToConciliateDetailsController', salesToConciliateDetailsController);

    salesToConciliateDetailsController.$inject = ['$scope', 'calendarFactory', 'utilsFactory', 'TransactionService', 'modalService', 'TransactionSummaryService', '$uibModalInstance'];
    function salesToConciliateDetailsController($scope, calendarFactory, utilsFactory, TransactionService, modalService, TransactionSummaryService, $uibModalInstance) {

        var objVm = this.vm;

        $scope.resultsPerPage = 10;
        $scope.resultsPageModel = 0;
        $scope.resultsTotalItens = 0;
        $scope.maxSize = 4;
        $scope.detailSelection = {};
        $scope.updatePagination = UpdatePagination;
        $scope.toggleCheckbox = ToggleCheckbox;
        $scope.toggleCheckboxAll = ToggleCheckboxAll;
        $scope.reconcileItems = ReconcileItems;
        $scope.items = [];

        Init();

        function Init() {
            GetDetails();
            ResetSelection();
        }

        function GetDetails() {
            var strDate = calendarFactory.formatDateTimeForService(objVm.dateModel.date);

            var objFilter = {
                startDate: strDate,
                endDate: strDate,
                cardProductIds: [objVm.transaction.cardProduct.id],
                conciliationStatus: 'TO_CONCILIE',
                page: $scope.resultsPageModel,
                size: $scope.resultsPerPage
            };

            TransactionService.GetTransactionByFilter(objFilter).then(function(objResponse) {

                if( objResponse.data.page.totalElements === 0 ) {
                    $uibModalInstance.close();
                } else {
                    $scope.items = objResponse.data.content;
                    $scope.resultsTotalItens = objResponse.data.page.totalElements;
                    $scope.resultsPageModel = objResponse.data.page.number;
                }

            }).catch(function(objResponse){
            });
        }

        function ToggleCheckbox(objItem) {
            if (objItem.checked) {
                objItem.checked = false;
                $scope.itemsCounter--;
            } else {
                objItem.checked = true;
                $scope.itemsCounter++;
            }
        }

        function ToggleCheckboxAll(bolIsSelected) {
            for(var index in $scope.items) {
                $scope.items[index].checked = bolIsSelected;
            }

            if (bolIsSelected) {
                $scope.itemsCounter = $scope.items.length;
            } else {
                $scope.itemsCounter = 0;
            }
        }

        function UpdatePagination() {
            GetDetails();
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
            if ($scope.detailSelection.allChecked === false) {
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

        function ReconcileItems() {
            var objFilter = {
                ids: $scope.detailSelection.items,
                newConciliationStatus: 'CONCILIED'
            };

            var intSelectionCount = $scope.detailSelection.count;
            var strPluralized = $scope.detailSelection.labelSuffix;

            modalService.open("app/views/sales-conciliation-modal.html", function ModalController($scope, $uibModalInstance) {
                $scope.reconcileType = "conciliar";
                $scope.modalTitle = "conciliar vendas";
                $scope.modalText = "Você deseja conciliar " + intSelectionCount + " " + strPluralized + "?";
                $scope.cancel = function Cancel() {
                    $uibModalInstance.close();
                };

                $scope.confirm = function Confirm() {
                    TransactionService.ConcilieTransaction(objFilter).then(function(objResponse) {
                        GetDetails();
                        ResetSelection();
                        UpdateHeader();
                        objVm.getSales();
                        $uibModalInstance.close();
                    });
                }
            });
        }

        function ResetSelection() {
            $scope.detailSelection.count = 0;
            $scope.detailSelection.items = [];
            $scope.detailSelection.checks = {};
            $scope.detailSelection.allChecked = false;
            $scope.detailSelection.labelSuffix = 'venda';
        }

        function Pluralize(strText, intCount) {
            if (intCount > 1) {
                return strText + "s";
            }

            return strText;
        }

        function UpdateHeader() {
            var strDate = calendarFactory.formatDateTimeForService(objVm.dateModel.date);
            var objFilter = {
                conciliationStatus: 'TO_CONCILIE',
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
                $uibModalInstance.close();
                objVm.getSales();
            });
        }

    }

})();
