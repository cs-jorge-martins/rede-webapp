/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

(function() {
    'use strict';

    angular
        .module('Conciliador')
        .directive('rcDownloader', RcDownloader);

    RcDownloader.$inject = [];

    function RcDownloader() {
        return {
            restrict: 'E',
            templateUrl: 'app/views/directives/rc-downloader.html',
            scope: {
                type: "="
            },
            controller: Controller,
            link: function($scope, element, attrs) {
                var header = angular.element(document.querySelector('.rc-downloader .header'));
                Ps.initialize(document.querySelector('.rc-downloader .content-scroll'));

                header.bind('click', function() {
                    var component = document.querySelector('.rc-downloader');
                    var wrapper = document.querySelector('.rc-downloader .content-wrapper');
                    var wrapperHeight = wrapper.offsetHeight + 10;

                    if(component.classList.contains('opened')) {
                        component.classList.remove('opened');
                        component.classList.add('closed');
                        component.style.top = 0;

                    } else {
                        component.classList.remove('closed');
                        component.classList.add('opened');
                        component.style.top = -(wrapperHeight)  + "px";
                    }
                });
            }

        };

        function Controller($scope) {
            Init();

            $scope.toggle = Toggle;
            $scope.queue = [
                {
                    status: 'downloading',
                    name: '2016-10-01_vendas36822DS34',
                    total: 1625,
                    estimatedTime: 15,
                    id: 'ASDGEEGGDE32'
                },
                {
                    status: 'done',
                    name: '2016-01-03_vendas1232ADFED34',
                    total: 16,
                    estimatedTime: 1500,
                    id: '5AD31324VDFD'
                },
                {
                    status: 'error',
                    name: '2017-01-01_vendasX123DSFGC',
                    total: 4100,
                    estimatedTime: 120,
                    id: 'XXAQ3423SDF'
                }
            ]

            function Init() {
            }

            function Toggle() {
                console.log('toggle');

            }
        }
    }

})();
