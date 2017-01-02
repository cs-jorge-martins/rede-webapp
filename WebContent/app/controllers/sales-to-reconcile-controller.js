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

    salesToReconcile.$inject = ['filtersService', '$scope', 'calendarFactory', 'TransactionSummaryService'];

    function salesToReconcile(filterService, $scope, calendarFactory, transactionSummaryService) {

        var objVm = this;

        $scope.dateModel = {};
        $scope.resultModel = [];
        $scope.timelineModel = {
            toConcilie: 0,
            concilied: 0,
            total: 0,
            percentage: 100
        };
        $scope.getReceipt = GetReceipt;
        $scope.resetFilter = ResetFilter;

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
            $scope.dateModel.day = calendarFactory.getDayOfDate($scope.date);
            $scope.dateModel.monthName = calendarFactory.getMonthNameOfDate($scope.date);
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
                conciliationStatus: 'TO_CONCILIE',
                currency: 'BRL',
                groupBy: 'CARD_PRODUCT,CONCILIATION_STATUS,ACQUIRER',
                startDate: strDate,
                endDate: strDate,
                cardProductIds: JoinMappedArray($scope.filteredCardProducts, 'id', ','),
                terminalIds: JoinMappedArray($scope.filteredTerminals, 'id', ','),
                acquirerIds: JoinMappedArray($scope.filteredAcquirers, 'id', ','),
                shopIds: JoinMappedArray($scope.filteredPvs, 'id', ',')
            };

            transactionSummaryService.ListTransactionSummaryByFilter(objFilter).then(function ProcessResults(objResponse) {
                var objContent = objResponse.data.content;
                objContent.forEach(function(objItem) {

                    var bolFoundAcquirer = false;
                    var objAcquirerInfo = null;

                    $scope.resultModel.forEach(function(objAcquirerData) {
                        if (objAcquirerData.acquirer.id === objItem.acquirer.id) {
                            bolFoundAcquirer = true;
                            objAcquirerInfo = objAcquirerData;
                            return;
                        }
                    });

                    if (bolFoundAcquirer === false) {
                        objAcquirerInfo = {};
                        objAcquirerInfo.acquirer = objItem.acquirer;
                        objAcquirerInfo.transactionsToReconcile = {
                            totalAmount: 0,
                            count: 0,
                            transactions: [],
                            checks: {},
                            cardProductIds: [],
                            allChecked: false
                        };
                        $scope.resultModel.push(objAcquirerInfo);
                    }

                    objAcquirerInfo.transactionsToReconcile.transactions.push(objItem);
                    objAcquirerInfo.transactionsToReconcile.totalAmount += objItem.amount;
                });
            });
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
                $scope.timelineModel.toConcilie = 0;
                $scope.timelineModel.concilied = 0;
                $scope.timelineModel.percentage = 0;

                objContent.forEach(function(objItem) {
                    if (objItem.conciliationStatus === 'TO_CONCILIE') {
                        $scope.timelineModel.toConcilie = objItem.quantity;
                    } else if (objItem.conciliationStatus === 'CONCILIED') {
                        $scope.timelineModel.concilied = objItem.quantity;
                    }

                    $scope.timelineModel.total += objItem.quantity;
                });

                $scope.timelineModel.percentage = $scope.timelineModel.toConcilie / $scope.timelineModel.total * 100;
            });
        }

        function FormatDateForService() {
            return calendarFactory.formatDateTimeForService($scope.dateModel.date);
        }

        function ResetFilter(strModel) {
            $scope[strModel+ 'Model'] = angular.copy($scope[strModel + 'Data']);
            GetReceipt();
        }

        function BuildTooltip(arrModel) {
            return JoinMappedArray(arrModel, 'label', ", ");
        }

        function JoinMappedArray(arrJoinable, strField, strJoin) {
            return arrJoinable.map(function(objItem){
                return objItem[strField];
            }).join(strJoin);
        }

    }

})();