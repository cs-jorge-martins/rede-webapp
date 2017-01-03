/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

/**
 * @class Conciliador.checkbox
 * Diretiva de checkbox
 *
 * Utiliza a diretiva checkbox para fazer marcar componentes únicos, marcar todos os componentes
 * e desmarcar todos os componentes.
 * @param {Object} completeModel Espera o model de objeto com todas as opções disponíveis
 * @param {Object} model Model que será utilizado para compartilhar as opções checkadas com outros checkboxes
 * @param {Array} responseModel que será utilizado para devolver a resposta em array
 * @param {Boolean} checkAll que será utilizado verificar se o checkbox é do tipo CheckAll, que marca/desmarca
 * todos os checkboxes do mesmo model
 *
 * Exemplo:
 *
 *     @example
 *     <rc-checkbox complete-model="completeModel" model="model" target="target[$index]" response-model="responseModel" check-all="false"></rc-checkbox>
 *
 *     @example
 *     <rc-checkbox complete-model="completeModel" model="model" response-model="responseModel" check-all="true"></rc-checkbox>
 *
 *     @example
 *     <rc-checkbox response-model="responseModel" action-button="true" action-button-prefix="'conciliar'" action-button-sufix="'vendas'" action-button-on-click="teste"></rc-checkbox>
 */

(function() {
    'use strict';
    angular
        .module('Conciliador')
        .directive('rcCheckbox', RcCheckbox)

    function RcCheckbox() {

        return {
            restrict: 'E',
            templateUrl : 'app/views/directives/rc-checkbox.html',
            transclude: true,
            scope: {
                completeModel: "=",
                model: "=",
                target: "=",
                responseModel: "=",
                checkAll: "=",
                actionButton: "=",
                actionButtonPrefix: "=",
                actionButtonSufix: "=",
                actionButtonOnClick: "&"
            },
            controller: Controller
        };

        function Controller($scope) {

            Init();

            function Init() {

                $scope.selectAll = SelectAll;
                $scope.selectSingle = SelectSingle;
                $scope.allChecked = false;

            }

            /**
             * @method SelectSingle
             * da um check em um checkbox clicado
             */
            function SelectSingle() {

                DoSelectSingle($scope.target);
                $scope.allChecked = $scope.model.length === $scope.completeModel.length;

            }

            /**
             * @method DoSelectSingle
             * @param {Object} objSelected, objeto com um parametro id
             * função responsável pela lógica de marcar o checkbox && colocar na model
             */
            function DoSelectSingle(objSelected) {

                var intId = objSelected.id;
                var intQuantity = $scope.completeModel.length;
                if ($scope.model[intId] === true) {
                    var intItemIndex = $scope.responseModel.indexOf(intId);
                    $scope.model[intId] = false;
                    $scope.responseModel.splice(intItemIndex, 1);
                } else {
                    $scope.model[intId] = true;
                    $scope.responseModel.push(intId);
                }

                console.log("$scope.responseModel.lenght", $scope.responseModel.lengthlength)
                console.log("$scope.responseModel", $scope.responseModel)

            }


            /**
             * @method SelectAll
             * função responsável por selecionar/deselecionar todos os checkboxes da model
             */
            function SelectAll() {

                var bolOldValue = $scope.allChecked;
                $scope.allChecked = !bolOldValue;

                $scope.completeModel.forEach(function (objItem) {
                    var bolCurrent = $scope.model[objItem.id];
                    if (bolCurrent !== $scope.allChecked) {
                        DoSelectSingle(objItem);
                    }
                });

            }

        }

    }

})();