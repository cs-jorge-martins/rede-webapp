/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

/**
 * @class Conciliador.checkbox
 * Diretiva de checkbox com contador
 *
 * Utilize a diretiva rc-checkbox para marcar uma única linha de dados.
 * @param {Object} completeModel Espera o model de objeto com todas as opções disponíveis
 * @param {Object} checkModel Model que será utilizado para compartilhar as opções checkadas com outros checkboxes
 * @param {Array} responseModel que será utilizado para devolver a resposta em array
 * @param {Object} quantityModel armazena a quantidade de itens marcados
 * @param {String} quantityField usado para buscar a propriedade do model que representa a quantidade
 * @param {Object} model Objeto que representa o item a ser marcado
 * @param {String} modelTarget Identifica a propriedade que identifica unicamente o item corrente no completeModel
 * @param {Boolean} parentChecked Representa o flag usado para marcar/desmarcar o checkbox de todos os itens
 *
 * Exemplo:
 *
 *     @example
 <rc-checkbox quantity-model="quantityModel" quantity-field="quantityField" model="model" complete-model="completeModel" check-model="checksModel" model-target="modelTargetField" response-model="responseModel" parent-checked="parentChecked"></rc-checkbox>
 *
 * @class Conciliador.checkboxParent
 * Diretiva de checkbox para marcar todos os itens.
 *
 * Utilize a diretiva rc-checkbox-parent para marcar/desmarcar todos os itens de uma só vez
 *
 * @param {Object} quantityModel armazena a quantidade de itens marcados
 * @param {Object} completeModel Espera o model de objeto com todas as opções disponíveis
 * @param {Object} checkModel Model que será utilizado para compartilhar as opções checkadas com outros checkboxes
 * @param {String} modelTarget Identifica a propriedade que identifica unicamente o item corrente no completeModel
 * @param {Array} responseModel que será utilizado para devolver a resposta em array
 * @param {Boolean} checked Representa o flag usado para marcar/desmarcar o checkbox de todos os itens
 * @param {String} quantityField usado para buscar a propriedade do model que representa a quantidade
 *
 * Exemplo
 *    @example
 *    <rc-checkbox-parent quantity-model="quantityModel" complete-model="completeModel" check-model="checkModel" model-target="modelTarget" response-model="responseModel" checked="checked" quantity-field="quantityField"></rc-checkbox-parent>
 *
 * @class Conciliador.countButton
 * Diretiva de botão com contagem de itens marcados
 *
 * Utilize a diretiva rc-count-button para renderizar um botão com label dinâmico que conta itens automaticamente e
 * é habilitado/desabilitado automaticamente de acordo com a quantidade de itens marcados
 *
 * @param {String} labelPrefix Usado para montar o label do botão
 * @param {String} labelSuffix Usado para montar o label do botão
 * @param {Integer} itemCount Usado para montar o label do botão e para habilitar ou desabilitar o botão
 * @param {Event} onClick Evento lançado ao clicar no botão
 *
 * @example
 * <rc-count-button label-prefix="labelPrefix" label-suffix="labelSuffix" item-count="itemCount" on-click="onClick()"></rc-count-button>
 */

"use strict";

(function() {

    angular
        .module('Conciliador')
        .directive('rcCheckbox', RcCheckbox)
        .directive('rcCheckboxParent', RcCheckboxParent)
        .directive('rcCountButton', RcCountButton);

    function RcCheckbox() {

        return {
            restrict: 'E',
            templateUrl: 'app/views/directives/rc-checkbox.html',
            transclude: true,
            scope: {
                completeModel: "=",
                quantityModel: "=",
                quantityField: "@",
                model: "=",
                checkModel: "=",
                modelTarget: "@",
                responseModel: "=",
                parentChecked: "="
            },
            controller: Controller
        };

        function Controller($scope) {

            Init();

            function Init() {

                $scope.selectSingle = SelectSingle;
                $scope.getModelValue = GetModelValue;
            }

            function GetModelValue() {
                var objGetModelValue = DoGetModelValue($scope.model, $scope.modelTarget);
                return objGetModelValue;
            }

            /**
             * @method SelectSingle
             * da um check em um checkbox clicado
             */
            function SelectSingle() {

                var objModelValue = DoGetModelValue($scope.model, $scope.modelTarget);
                DoSelectSingle($scope.model, objModelValue, $scope);
                $scope.parentChecked = $scope.responseModel.length === $scope.completeModel.length;
            }
        }

    }

    function RcCheckboxParent() {
         return {
             restrict: 'E',
             templateUrl: 'app/views/directives/rc-checkbox-parent.html',
             transclude: true,
             scope: {
                 completeModel: "=",
                 checkModel: "=",
                 modelTarget: "@",
                 checked: "=",
                 responseModel: "=",
                 quantityField: "@",
                 quantityModel: "="
             },
             controller: Controller
         };

         function Controller($scope) {
             Init();

             function Init() {
                 $scope.selectAll = SelectAll;
                 $scope.modelTarget = $scope.modelTarget ? $scope.modelTarget : 'id';
             }

             /**
              * @method SelectAll
              * função responsável por selecionar/deselecionar todos os checkboxes da model
              */
             function SelectAll() {

                 var bolOldValue = $scope.checked;
                 $scope.checked = !bolOldValue;

                 $scope.completeModel.forEach(function (objItem) {
                     var objModelValue = DoGetModelValue(objItem, $scope.modelTarget);
                     var bolCurrent = $scope.checkModel[objModelValue];
                     if (bolCurrent !== $scope.checked) {
                         DoSelectSingle(objItem, objModelValue, $scope);
                     }
                 });
             }
         }
    }

    function RcCountButton() {
        return {
            restrict: 'E',
            templateUrl: 'app/views/directives/rc-count-button.html',
            transclude: true,
            scope: {
                label: '=',
                labelPrefix: "=",
                labelSuffix: "=",
                itemCount: '=',
                onClick: "&"
            },
            controller: Controller
        };

        function Controller() {
            Init();
            function Init() {
            }
        }
    }

    /**
     * @method DoSelectSingle
     * @param {Object} objSelected, objeto com um parametro id
     * função responsável pela lógica de marcar o checkbox && colocar na model
     */
    function DoSelectSingle(objSelected, strSelectedVal, objScope) {

        var intQuantity = objScope.completeModel.length;
        if (objScope.quantityField !== undefined) {
            intQuantity = objSelected[objScope.quantityField];
        }

        if (objScope.checkModel[strSelectedVal] === true) {
            var intItemIndex = objScope.responseModel.indexOf(strSelectedVal);
            objScope.checkModel[strSelectedVal] = false;
            objScope.responseModel.splice(intItemIndex, 1);
            objScope.quantityModel -= intQuantity;
        } else {
            objScope.checkModel[strSelectedVal] = true;
            objScope.responseModel.push(strSelectedVal);
            objScope.quantityModel += intQuantity;
        }

    }

    function DoGetModelValue(objItem, objTargetField) {
        var objModelValue = eval('objItem.' + objTargetField);
        return objModelValue;
    }

})();
