module.exports = function(grunt) {

    grunt.initConfig({
        'http-server': {
            'server': {
        		root: './WebContent',
        		port: 90,
        		host: "0.0.0.0",
                openBrowser: true,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                }
        	}
        }

    });

    grunt.loadNpmTasks('grunt-http-server');
    grunt.registerTask('default', ['http-server:server']);
};
