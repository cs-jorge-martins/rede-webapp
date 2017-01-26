/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {

    'use strict';

    angular
        .module('Conciliador.unprocessedSalesDetailsController', [])
        .controller('unprocessedSalesDetailsController', unprocessedSalesDetailsController);


    unprocessedSalesDetailsController.$inject = ['$scope', 'calendarFactory', 'TransactionService', 'modalService'];

    function unprocessedSalesDetailsController($scope, calendarFactory, TransactionService, modalService) {

        var objVm = this.vm;

        $scope.resultsPerPage = 10;
        $scope.resultsPageModel = 0;
        $scope.resultsTotalItens = 0;
        $scope.maxSize = 4;
        $scope.items = [];
        $scope.updatePagination = UpdatePagination;
        $scope.toggleCheckbox = ToggleCheckbox;
        $scope.toggleCheckboxAll = ToggleCheckboxAll;
        $scope.delete = Delete;
        $scope.itemsCounter = 0;
        $scope.detailSelection = {};

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
                conciliationStatus: 'UNPROCESSED',
                page: $scope.resultsPageModel,
                size: $scope.resultsPerPage
                //sort:$scope.sort;
            };

            TransactionService.GetTransactionByFilter(objFilter).then(function(objResponse) {
                $scope.items = objResponse.data.content;
                $scope.resultsTotalItens = objResponse.data.page.totalElements;
                $scope.resultsPageModel = objResponse.data.page.number;

            }).catch(function(objResponse){

            });
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

        function UpdatePagination() {
            GetDetails();
            ResetSelection();
        }

        function Delete() {
            var objFilter = {
                ids: $scope.detailSelection.items
            };

            var intSelectionCount = $scope.detailSelection.count;
            var strPluralized = "venda não processada";
            if (intSelectionCount > 1) {
                strPluralized = "vendas não processadas"
            }

            modalService.open("app/views/sales-conciliation-modal.html", function ModalController($scope, $uibModalInstance) {
                $scope.reconcileType = "excluir";
                $scope.modalTitle = "excluir vendas";
                $scope.modalText = "Você deseja excluir " + intSelectionCount + " " + strPluralized + "?";
                $scope.cancel = function Cancel() {
                    $uibModalInstance.close();
                };

                $scope.confirm = function Confirm() {
                    TransactionService.RemoveUnprocessedTransactionList(objFilter).then(function(objResponse) {
                        GetDetails();
                        ResetSelection();
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
    }

})();
