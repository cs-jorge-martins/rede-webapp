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


    unprocessedSalesDetailsController.$inject = ['$scope', 'calendarFactory', 'utilsFactory', 'TransactionService'];

    function unprocessedSalesDetailsController($scope, calendarFactory, utilsFactory, TransactionService) {

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

        Init();

        function Init() {
            GetDetails();
        }

        function GetDetails() {
            var strDate = calendarFactory.formatDateTimeForService(objVm.dateModel.date);

            var objFilter = {
                startDate: strDate,
                endDate: strDate,
                cardProductIds: utilsFactory.joinMappedArray(objVm.filteredCardProducts, 'id', ','),
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

        function Delete() {
            var arrItems = [];

            for(var index in $scope.items) {
                if ($scope.items[index].checked) {
                    arrItems.push($scope.items[index]);
                }
            }

            console.log('items', arrItems);
        }
    }

})();
