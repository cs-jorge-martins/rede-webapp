/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

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
                    "WebContent/app/libs/angular.min.js",
                    "WebContent/app/libs/angular-route.min.js",
                    "WebContent/app/libs/angular-mocks.js",
                    "WebContent/app/libs/lodash.min.js",
                    "WebContent/app/libs/angular-locale-pt-br.js",
                    "WebContent/app/libs/loading-bar.min.js",
                    "WebContent/app/libs/angular-cache.min.js",
                    "WebContent/app/libs/angular-sanitize.min.js",
                    "WebContent/app/libs/angular-animate.min.js",
                    "WebContent/app/libs/ui-bootstrap-tpls-0.11.0.min.js",
                    "WebContent/app/libs/modernizr-2.6.2.min.js",
                    "WebContent/app/libs/jquery-1.11.1.min.js",
                    "WebContent/app/libs/main.js",
                    "WebContent/app/libs/angular-file-upload.min.js",
                    "WebContent/app/libs/angular-file-saver.js",
                    "WebContent/app/libs/FileSaver.min.js",
                    "WebContent/app/libs/blob.js",
                    "WebContent/app/libs/angular-resource.min.js",
                    "WebContent/app/libs/moment-with-locales.min.js",
                    "WebContent/app/libs/moment-timezone.min.js",
                    "WebContent/app/libs/dateparser.js",
                    "WebContent/app/libs/Chart.min.js",
                    "WebContent/app/libs/angular-chart.min.js",
                    "WebContent/app/libs/angularjs-dropdown-multiselect.min.js",
                    "WebContent/app/js/componente/max-size-pagination.js",
                    "WebContent/app/js/componente/chart-utils.js",

                    "WebContent/app/scripts/app.js",
                    "WebContent/app/scripts/controllers/dashboard-controller.js",
                    "WebContent/app/scripts/controllers/login-controller.js",
                    "WebContent/app/scripts/controllers/sales-details-controller.js",
                    "WebContent/app/scripts/controllers/sales-controller.js",
                    "WebContent/app/scripts/controllers/relatorio-vendas-controller.js",
                    "WebContent/app/scripts/controllers/relatorio-financeiro-controller.js",
                    "WebContent/app/scripts/controllers/relatorio-ajustes-controller.js",
                    "WebContent/app/scripts/controllers/relatorio-chargebacks-controller.js",
                    "WebContent/app/scripts/controllers/help-controller.js",
                    "WebContent/app/scripts/controllers/integration-controller.js",
                    "WebContent/app/scripts/controllers/receipts-controller.js",
                    "WebContent/app/scripts/controllers/receipts-expected-details-controller.js",
                    "WebContent/app/scripts/controllers/receipts-forethought-details-controller.js",
                    "WebContent/app/scripts/controllers/receipts-other-details-controller.js",
                    "WebContent/app/scripts/controllers/receipts-future-details-controller.js",
                    "WebContent/app/scripts/controllers/receipts-details-controller.js",
                    "WebContent/app/scripts/controllers/redirect-controller.js",

                    "WebContent/app/scripts/service/dashboard-service.js",
                    "WebContent/app/scripts/service/login-service.js",
                    "WebContent/app/scripts/service/transactions-service.js",
                    "WebContent/app/scripts/service/relatorio-service.js",
                    "WebContent/app/scripts/service/kaplen-admin-service.js",
                    "WebContent/app/scripts/service/cache-service.js",
                    "WebContent/app/scripts/service/integration-service.js",
                    "WebContent/app/scripts/service/advanced-filter-service.js",
                    "WebContent/app/scripts/service/calendar-service.js",
                    "WebContent/app/scripts/service/filters-service.js",
                    "WebContent/app/scripts/service/receipts-service.js",
                    "WebContent/app/scripts/service/financial-service.js",
                    "WebContent/app/scripts/service/movement-summary-service.js",
                    "WebContent/app/scripts/service/adjust-summary-service.js",
                    "WebContent/app/scripts/service/transaction-summary-service.js",
                    "WebContent/app/scripts/service/transaction-conciliation-service.js",
                    "WebContent/app/scripts/service/transaction-service.js",
                    "WebContent/app/scripts/service/movement-service.js",
                    "WebContent/app/scripts/service/adjust-service.js",

                    "WebContent/app/scripts/directives/rc-disclaimer/rc-disclaimer.js",
                    "WebContent/app/scripts/directives/rc-multiselect/rc-multiselect.js",
                    "WebContent/app/scripts/directives/rc-datepicker/rc-datepicker.js",
                    "WebContent/app/scripts/directives/rc-timeline/rc-timeline.js",

                    "WebContent/app/scripts/factories/request-factory.js",
                    "WebContent/app/scripts/factories/calendar-factory.js",

                    "WebContent/app/scripts/filters/currency-filter.js",
                    "WebContent/app/scripts/filters/slugfy-filter.js",

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
