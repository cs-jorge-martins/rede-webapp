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

        execute: {
            target: {
                src: ['WebContent/app/tests/scripts/mock-login.js']
            }
        }
    });


	grunt.registerTask('test:unit', ['concat', 'karma:unit:start']);
    grunt.registerTask('local:login', ['execute']);
    grunt.registerTask('serve', ['http-server:server']);
    grunt.registerTask('build:local', ['ngconstant:local', 'concat']);
    grunt.registerTask('build:dev', ['ngconstant:development', 'concat']);
    grunt.registerTask('build:hml', ['ngconstant:homologation', 'concat']);
    grunt.registerTask('build:prod', ['ngconstant:production', 'concat']);
    grunt.registerTask('local', ['build:local', 'serve']);
    grunt.registerTask('dev', ['build:dev', 'serve']);
    grunt.registerTask('hml', ['build:hml', 'serve']);
    grunt.registerTask('prod', ['build:prod', 'serve']);
};
