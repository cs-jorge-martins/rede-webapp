/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {

    'use strict';

    angular
        .module('Conciliador.salesToConcileDetailsController', [])
        .controller('salesToConcileDetailsController', salesToConcileDetailsController);


    salesToConcileDetailsController.$inject = ['$scope', 'calendarFactory', 'utilsFactory', 'TransactionService'];

    function salesToConcileDetailsController($scope, calendarFactory, utilsFactory, TransactionService) {

        var objVm = this.vm;

        $scope.resultsPerPage = 10;
        $scope.resultsPageModel = 0;
        $scope.resultsTotalItens = 0;
        $scope.maxSize = 4;
        $scope.updatePagination = UpdatePagination;

        $scope.items = [];

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
                conciliationStatus: 'TO_CONCILIE',
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

        function UpdatePagination() {
            GetDetails();
        }

    }

})();
