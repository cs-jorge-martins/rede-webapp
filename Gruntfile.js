module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    var API_URLS = {
        local: 'http://localhost:8080/conciliation-api',
        dev: 'https://z20ycs2v3e.execute-api.us-east-1.amazonaws.com/dev',
        hml: 'https://z20ycs2v3e.execute-api.us-east-1.amazonaws.com/hml',
        prod: 'https://9ht8utfgo1.execute-api.us-east-1.amazonaws.com/PRD'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Karma configuration
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        'http-server': {
            server: {
        		root: './WebContent',
        		port: 8100,
        		host: "0.0.0.0",
                openBrowser: true,
                runInBackground: true,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                }
        	}
        },

        ngconstant: {
            options: {
                dest: 'WebContent/app/scripts/config.js',
                space: ' ',
                wrap: '"use strict";\n\n {\%= __ngModule %}',
                name: 'Conciliador.appConfig'
            },
            local: {
                constants: {
                    app: {
                        endpoint: API_URLS.local,
                        login: {
                            endpoint: 'http://localhost:8030'
                        }
                    }
                }
            },
            development: {
                constants: {
                    app: {

                        endpoint: API_URLS.dev,
                        login: {
                            endpoint: API_URLS.dev
                        }
                    }
                }
            },
            homologation: {
                constants: {
                    app: {
                        endpoint: API_URLS.hml,
                        login: {
                            endpoint: API_URLS.hml
                        }
                    }
                }
            },
            production: {
                constants: {
                    app: {
                      endpoint: API_URLS.prod,
                      login: {
                          endpoint: API_URLS.prod
                      }
                    }
                }
            }
        },


        // Execute a fake login server
        execute: {
            target: {
                src: ['WebContent/app/tests/scripts/mock-login.js']
            }
        },

        concat: {
            options: {
                // Replace all 'use strict' statements in the code with a single one at the top
                process: function(src, filepath) {
                  return '// Source: ' + filepath + '\n' +
                    src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                },
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */',
            },
            dist: {
                src: [
                    "WebContent/app/libs/angular.js",
                    "WebContent/app/libs/angular-route.min.js",
                    "WebContent/app/libs/lodash.js",
                    "WebContent/app/libs/restangular.js",
                    "WebContent/app/libs/angular-locale-pt-br.js",
                    "WebContent/app/libs/loading-bar.js",
                    "WebContent/app/libs/angular-cache.min.js",
                    "WebContent/app/libs/angular-sanitize.js",
                    "WebContent/app/libs/angular-animate.js",
                    "WebContent/app/libs/ui-bootstrap-tpls-0.11.0.min.js",
                    "WebContent/app/libs/modernizr-2.6.2.min.js",
                    "WebContent/app/libs/jquery-1.11.1.min.js",
                    "WebContent/app/libs/main.js",
                    "WebContent/app/libs/angular-file-upload.js",
                    "WebContent/app/libs/angular-file-saver.js",
                    "WebContent/app/libs/fileSaver.js",
                    "WebContent/app/libs/blob.js",
                    "WebContent/app/libs/angular-resource.js",
                    "WebContent/app/libs/moment-with-locales.min.js",
                    "WebContent/app/libs/moment-timezone.min.js",
                    "WebContent/app/libs/masks.min.js",
                    "WebContent/app/libs/dateparser.js",
                    "WebContent/app/libs/angular-mocks.js",

                    "WebContent/app/libs/highcharts-ng.js",
                    "WebContent/app/libs/highcharts.js",
                    "WebContent/app/libs/Chart.min.js",
                    "WebContent/app/libs/angular-chart.min.js",
                    "WebContent/app/libs/bootstrap-tour-standalone.min.js",
                    "WebContent/app/libs/angularjs-dropdown-multiselect.min.js",
                    "WebContent/app/js/componente/convertCurrency.js",
                    "WebContent/app/js/componente/calculateSizeChart.js",
                    "WebContent/app/js/componente/maxSizePagination.js",
                    "WebContent/app/js/componente/pieChartVendasMes.js",
                    "WebContent/app/js/componente/pieChartTiposVendas.js",
                    "WebContent/app/js/componente/pieChartOperadora.js",
                    "WebContent/app/js/componente/pieChartComparativoVendasMes.js",
                    "WebContent/app/js/componente/pieChartRelatorio.js",
                    "WebContent/app/js/componente/pieChartGestao.js",
                    "WebContent/app/js/componente/pieChartTipoVendaConciliacao.js",
                    "WebContent/app/js/componente/pieChartRecebimentosVisaoReport.js",
                    "WebContent/app/js/componente/pieChartSettlementRanking.js",
                    "WebContent/app/js/componente/pieChartVendasReport.js",
                    "WebContent/app/js/componente/pieChartVendasVisoes.js",
                    "WebContent/app/js/componente/pieChartVendasAnaliticasReport.js",
                    "WebContent/app/js/componente/pieChartVendasAnaliticasDiasReport.js",
                    "WebContent/app/js/componente/pieChartVendasAnaliticasSemanasReport.js",
                    "WebContent/app/js/componente/chartUtils.js",

                    "WebContent/app/scripts/app.js",

                    "WebContent/app/scripts/controllers/dashboardController.js",
                    "WebContent/app/scripts/controllers/loginController.js",
                    "WebContent/app/scripts/controllers/firstAccessController.js",
                    "WebContent/app/scripts/controllers/salesDetailsController.js",
                    "WebContent/app/scripts/controllers/movementsModule.js",
                    "WebContent/app/scripts/controllers/salesController.js",
                    "WebContent/app/scripts/controllers/movementsTaxController.js",
                    "WebContent/app/scripts/controllers/movementsReceiptController.js",
                    "WebContent/app/scripts/controllers/gestaoController.js",
                    "WebContent/app/scripts/controllers/relatorioController.js",
                    "WebContent/app/scripts/controllers/relatorioVendasController.js",
                    "WebContent/app/scripts/controllers/relatorioFinanceiroController.js",
                    "WebContent/app/scripts/controllers/relatorioAjustesController.js",
                    "WebContent/app/scripts/controllers/relatorioChargebacksController.js",
                    "WebContent/app/scripts/controllers/taxaAdministracaoController.js",
                    "WebContent/app/scripts/controllers/userManager.js",
                    "WebContent/app/scripts/controllers/settlementManager.js",
                    "WebContent/app/scripts/controllers/terminalsManager.js",
                    "WebContent/app/scripts/controllers/envioEmailController.js",
                    "WebContent/app/scripts/controllers/optionsManager.js",
                    "WebContent/app/scripts/controllers/menuManager.js",
                    "WebContent/app/scripts/controllers/helpController.js",
                    "WebContent/app/scripts/controllers/integrationController.js",
                    "WebContent/app/scripts/controllers/receiptsController.js",
                    "WebContent/app/scripts/controllers/receiptsDetailsController.js",
                    "WebContent/app/scripts/controllers/redirectController.js",

                    "WebContent/app/scripts/service/dashboardService.js",
                    "WebContent/app/scripts/service/loginService.js",
                    "WebContent/app/scripts/service/resumoConciliacaoService.js",
                    "WebContent/app/scripts/service/transactionsService.js",
                    "WebContent/app/scripts/service/cartaCancelamentoService.js",
                    "WebContent/app/scripts/service/movementsService.js",
                    "WebContent/app/scripts/service/relatorioService.js",
                    "WebContent/app/scripts/service/kaplenAdminService.js",
                    "WebContent/app/scripts/service/settlementService.js",
                    "WebContent/app/scripts/service/terminalService.js",
                    "WebContent/app/scripts/service/userService.js",
                    "WebContent/app/scripts/service/installmentsService.js",
                    "WebContent/app/scripts/service/cacheService.js",
                    "WebContent/app/scripts/service/taxaAdministracaoService.js",
                    "WebContent/app/scripts/service/integrationService.js",
                    "WebContent/app/scripts/service/advancedFilterService.js",
                    "WebContent/app/scripts/service/optionsService.js",
                    "WebContent/app/scripts/service/utilities/calendarService.js",
                    "WebContent/app/scripts/service/filtersService.js",
                    "WebContent/app/scripts/service/receiptsService.js",
                    "WebContent/app/scripts/service/v1/api/service/FinancialService.js",
                    "WebContent/app/scripts/service/v1/api/filter/FinancialFilter.js",
                    "WebContent/app/scripts/service/v1/api/service/MovementSummaryService.js",
                    "WebContent/app/scripts/service/v1/api/filter/MovementSummaryFilter.js",
                    "WebContent/app/scripts/service/v1/api/service/AdjustSummaryService.js",
                    "WebContent/app/scripts/service/v1/api/service/TransactionSummaryService.js",
                    "WebContent/app/scripts/service/v1/api/service/TransactionService.js",
                    "WebContent/app/scripts/service/v1/api/service/TransactionConciliationService.js",

                    "WebContent/app/scripts/directives/rc-disclaimer/rc-disclaimer.js",
                    "WebContent/app/scripts/directives/rc-multiselect/rc-multiselect.js",
                    "WebContent/app/scripts/directives/rc-datepicker/rc-datepicker.js",

                    "WebContent/app/scripts/factories/requestFactory.js",

                    "WebContent/app/scripts/filters/currencyFilter.js",

                    "WebContent/app/tours/dashboard/dashboardTour.js",
                    "WebContent/app/tours/resumoConciliacao/resumoConciliacaoTour.js",
                    "WebContent/app/tours/resumoConciliacao/resumoConciliacaoAnaliticoTour.js",
                    "WebContent/app/tours/resumoConciliacao/modalResumoConciliacaoTour.js",
                    "WebContent/app/tours/financeiro/financeiroTour.js",
                    "WebContent/app/tours/gestao/gestaoTour.js",
                    "WebContent/app/tours/financeiro/financeiroAnaliticoTour.js",
                    "WebContent/app/tours/financeiro/modalFinanceiroTour.js",

                    "WebContent/app/libs/videogular.min.js",
                    "WebContent/app/libs/vg-controls.min.js",
                    "WebContent/app/libs/vg-overlay-play.min.js",
                    "WebContent/app/libs/vg-poster.min.js",
                    "WebContent/app/libs/vg-buffering.min.js",
                    "WebContent/app/scripts/config.js",
                ],
                dest: "WebContent/app/build.js",
            },
        },

        watch: {
            files: '<%= concat.dist.src %>',
            tasks: ['concat']
        }
    });

	grunt.registerTask('test:unit', ['concat', 'karma:unit:start']);
    grunt.registerTask('local:login', ['execute']);
    grunt.registerTask('serve', ['http-server:server']);
    grunt.registerTask('build:local', ['ngconstant:local', 'concat']);
    grunt.registerTask('build:dev', ['ngconstant:development', 'concat']);
    grunt.registerTask('build:hml', ['ngconstant:homologation', 'concat']);
    grunt.registerTask('build:prod', ['ngconstant:production', 'concat']);
    grunt.registerTask('local', ['build:local', 'serve', 'watch']);
    grunt.registerTask('dev', ['build:dev', 'serve', 'watch']);
    grunt.registerTask('hml', ['build:hml', 'serve']);
    grunt.registerTask('prod', ['build:prod', 'serve']);
};
