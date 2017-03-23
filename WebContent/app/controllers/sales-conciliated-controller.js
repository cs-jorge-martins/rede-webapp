/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

/**
 * @class Conciliador.salesConciliatedController
 * Controller de vendas conciliadas
 *
 */

"use strict";

(function() {

    angular
        .module('Conciliador.salesConciliatedController', ['duScroll'])
        .controller('salesConciliatedController', SalesConciliated);

    SalesConciliated.$inject = [
        'filtersService',
        '$scope',
        'calendarFactory',
        'TransactionSummaryService',
        'TransactionService',
        '$uibModal',
        '$rootScope',
        'utilsFactory',
        'modalService',
        '$document'
    ];

    function SalesConciliated(
        filterService,
        $scope,
        calendarFactory,
        transactionSummaryService,
        transactionService,
        $uibModal,
        $rootScope,
        utilsFactory,
        modalService,
        $document
    ) {

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
                objVm.chipsConfig.show.terminals = $scope.filter.terminalsData.length !== objVm.filteredTerminals.length;
                objVm.chipsConfig.show.pvs = $scope.filter.pvsData.length !== objVm.filteredPvs.length;
                objVm.chipsConfig.show.acquirers = $scope.filter.acquirersData.length !== objVm.filteredAcquirers.length;
                objVm.chipsConfig.show.cardProducts = $scope.filter.cardProductsData.length !== objVm.filteredCardProducts.length;
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
        objVm.search = $scope.search;
        objVm.resetFilter = ResetFilter;
        objVm.reconcile = Reconcile;
        objVm.details = Details;
        objVm.acquirersFilterExpression = AcquirersFilterExpression;
        objVm.acquirersCardProductFilterExpression = AcquirersCardProductFilterExpression;

        objVm.countButtonLabelPrefix = 'desconciliar';

        $scope.$on('search', function() {
            GetSales();
        });


        Init();

        /**
         * @method Init
         * inicializa as funções principais deste controller ao carregar a página
         */
        function Init() {
            UpdateDateModel();
            GetSales();
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
            objVm.dateModel.day = calendarFactory.getDayOfDate($scope.dateModel.date);
            objVm.dateModel.monthName = calendarFactory.getMonthNameOfDate($scope.dateModel.date);
        }

        /**
         * @method FormatDateForService
         * formata o dateModel para ser utilizado nas chamadas para a api
         * @return data formatada para (YYYYMMDD)
         */
        function FormatDateForService() {
            return calendarFactory.formatDateTimeForService($scope.dateModel.date);
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
                        objVm.timelineModel.total += objItem.quantity;
                    } else if (objItem.conciliationStatus === 'CONCILIED') {
                        objVm.timelineModel.concilied = objItem.quantity;
                        objVm.timelineModel.total += objItem.quantity;
                    }
                });

            });
        }

        /**
         * @method GetSales
         * atualiza os resultados, utilizando os filtros para buscar na api e responder na view
         */
        function GetSales() {
            objVm.filteredTerminals = angular.copy($scope.filter.terminalsModel);
            objVm.filteredAcquirers = angular.copy($scope.filter.acquirersModel);
            objVm.filteredPvs = angular.copy($scope.filter.pvsModel);
            objVm.filteredCardProducts = angular.copy($scope.filter.cardProductsModel);
            objVm.resultModel.splice(0);

            GetLabels();
            UpdateDateModel();
            GetTimeLine();
            objVm.chipsConfig.update();

            var strDate = FormatDateForService();

            var objFilter = {
                conciliationStatus: 'CONCILIED',
                currency: 'BRL',
                groupBy: 'CARD_PRODUCT,CONCILIATION_STATUS,ACQUIRER',
                startDate: strDate,
                endDate: strDate,
                sort: 'acquirer.id,ASC',
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
                    objModelFound[strModel] = new TransactionModel();
                }

                objModelFound[strModel].transactions.push(objItem);
                objModelFound[strModel].totalAmount += objItem.amount;
            });

            var objElement = angular.element(document.getElementById("salesConciliatedAnchor"));
            $document.scrollToElementAnimated(objElement);
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
            this.allChecked = false;
            this.resetSelection = function ResetSelection() {
                this.count = 0;
                this.checks = {};
                this.allChecked = false;
                this.cardProductIds.splice(0);
            };
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
                conciliationStatus: ['CONCILIED'],
                newConciliationStatus: 'TO_CONCILIE',
                currency: 'BRL',
                startDate: strDate,
                endDate: strDate,
                cardProductIds: objTransactionModel.cardProductIds,
                terminalIds: utilsFactory.joinMappedArray(objVm.filteredTerminals, 'id', false),
                acquirerIds: [objAcquirer.id],
                shopIds: utilsFactory.joinMappedArray(objVm.filteredPvs, 'id', false)
            };

            modalService.open(
                "app/views/sales-conciliation-modal.html",
                function ModalController($scope, $uibModalInstance) {
                var strPluralized = "venda";
                if (objTransactionModel.count > 1) {
                    strPluralized = "vendas";
                }

                $scope.countObjTransactionModel = objTransactionModel.count;
                $scope.reconcileType = "desconciliar";
                $scope.modalTitle = "desconciliar vendas";
                $scope.modalText = "Você deseja desconciliar " + objTransactionModel.count + " " + strPluralized + "?";
                $scope.cancel = function Cancel() {
                    objTransactionModel.resetSelection();
                    $scope.close();
                };

                $scope.close = function Close() {
                    $uibModalInstance.close();
                };

                $scope.confirm = function Confirm() {
                    transactionService.ConcilieTransactions(objFilter).then(function() {
                        $scope.search();
                        $uibModalInstance.close();
                    });
                };
            },
                $scope
            );

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
			$scope.filter[strModel+ 'Model'] = [];
			$scope.search();
		}

        /**
         * @method Details
         * Abre modal de detalhes
         *
         */
        function Details(objTransaction) {
            objVm.transaction = objTransaction;
            modalService.openFull(
                'Vendas conciliadas | detalhes',
                'app/views/sales-conciliated-details.html',
                'salesConciliatedDetailsController',
                $scope
            );
        }

        /**
        * @method AcquirersFilterExpression
        * Trata as alteracoes na selecao na lista de adquirentes e seus efeitos em outras listas
        */
        function AcquirersFilterExpression(pv) {
            return !$scope.filter.acquirersModel.length || (($scope.filter.acquirersModel.map(function(a){ return a.id; }).indexOf(pv.acquirerId)) !== -1) || ($scope.filter.pvsModel.map(function(a){ return a.id; }).indexOf(pv.id) !== -1 && !$scope.filter.pvsModel.splice($scope.filter.pvsModel.map(function(a){ return a.id; }).indexOf(pv.id), 1));
        }

        /**
         * @method AcquirersCardProductFilterExpression
         * Trata as alteracoes na selecao na lista de adquirentes e seus efeitos na lista de bandeira
         */
        function AcquirersCardProductFilterExpression(objCard) {
            return  !$scope.filter.acquirersModel.length || CompareArrayAcquirers($scope.filter.acquirersModel, objCard.acquirers) || ($scope.filter.cardProductsModel.map(function(a){ return a.id; }).indexOf(objCard.id) !== -1 && !$scope.filter.cardProductsModel.splice($scope.filter.cardProductsModel.map(function(a){ return a.id; }).indexOf(objCard.id), 1));
        }

        function CompareArrayAcquirers(arrAcquirers, arrAcquirersCard) {
            var bolResponse = false;
            angular.forEach(arrAcquirers, function(objAcq) {
                angular.forEach(arrAcquirersCard, function(objAcqCard) {
                    bolResponse = bolResponse || (objAcq.id === objAcqCard.id);
                });
            });
            return bolResponse;
        }
    }
})();
