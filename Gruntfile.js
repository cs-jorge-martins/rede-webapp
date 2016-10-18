module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
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
                        endpoint: 'http://localhost:8080/conciliation-api'
                    }
                }
            },
            development: {
                constants: {
                    app: {
                        endpoint: 'https://z20ycs2v3e.execute-api.us-east-1.amazonaws.com/dev'
                    }
                }
            },
            homologation: {
                constants: {
                    app: {
                        endpoint: 'https://sdfx3e6zv2.execute-api.us-east-1.amazonaws.com/hml'
                    }
                }
            },
            production: {
                constants: {
                    app: {
                      endpoint: 'https://9ht8utfgo1.execute-api.us-east-1.amazonaws.com/PRD'
                    }
                }
            }
        }
    });

    grunt.registerTask('serve', ['http-server:server']);
    grunt.registerTask('local', ['ngconstant:local', 'serve']);
    grunt.registerTask('dev', ['ngconstant:development', 'serve']);
    grunt.registerTask('hml', ['ngconstant:homologation', 'serve']);
    grunt.registerTask('prod', ['ngconstant:production', 'serve']);
};
