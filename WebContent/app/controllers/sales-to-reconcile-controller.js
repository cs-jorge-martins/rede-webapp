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

    salesToReconcile.$inject = ['filtersService', '$scope', 'calendarFactory'];

    function salesToReconcile(filterService, $scope, calendarFactory) {

        var objVm = this;

        $scope.getReceipt = GetReceipt;
        $scope.resetFilter = ResetFilter;

        Init();

        function Init() {
            DefaultOptions();
            InitFilterVariables();
            UpdateDateModel();
            GetFilters();
            GenerateFakeResponseObject();
        }
        
        function GenerateFakeResponseObject() {
            $scope.sales = [
                    {
                        "trocar_valor_nao_processadas": 17250,
                        "acquirer": {
                            "name": "Rede",
                            "valor": 19000
                        },
                        "lancamentos": [
                            {
                                cardProductId: 1,
                                cardProductName: "Mastercard crédito",
                                valorBruto: 4500,
                                quantidade: 14,
                            },
                            {
                                cardProductId: 3,
                                cardProductName: "Mastercard débito",
                                valorBruto: 4500,
                                quantidade: 20,
                            },
                            {
                                cardProductId: 2,
                                cardProductName: "Visa",
                                valorBruto: 10000,
                                quantidade: 10,
                            }
                        ],
                        "nao_processadas": [
                            {
                                cardProductId: 1,
                                cardProductName: "Mastercard crédito",
                                valorBruto: 10000,
                                quantidade: 14,
                            },
                            {
                                cardProductId: 3,
                                cardProductName: "Mastercard débito",
                                valorBruto: 5000,
                                quantidade: 14,
                            },
                            {
                                cardProductId: 2,
                                cardProductName: "Visa",
                                valorBruto: 2500,
                                quantidade: 14,
                            }
                        ]
                    }
            ];
        }
        
        function DefaultOptions() {
            $scope.filterMaxDate = calendarFactory.getYesterday();
        }

        function InitFilterVariables() {
            $scope.date = calendarFactory.getYesterday();
            $scope.cardProductsData = [];
            $scope.cardProductsModel = {};
            $scope.terminalsData = [];
            $scope.terminalsModel = {};
            $scope.pvsData = [];
            $scope.pvsModel = {};
            $scope.acquirersData = [];
            $scope.acquirersModel = {};
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
            $scope.dateModel = {
                day: calendarFactory.getDayOfDate($scope.date),
                monthName: calendarFactory.getMonthNameOfDate($scope.date)
            }
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

            GetLabels();
        }

        function ResetFilter(strModel) {
            $scope[strModel+ 'Model'] = angular.copy($scope[strModel + 'Data']);
            GetReceipt();
        }

        function BuildTooltip(arrModel) {
            return arrModel.map(function(objItem){
                return objItem.label;
            }).join(", ");
        }

    }

})();