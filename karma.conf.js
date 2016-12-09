/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'WebContent/app/build.js',
        'WebContent/app/tests/**/*spec.js',
        'WebContent/app/views/directives/*.html',
        'WebContent/app/scripts/**/*.js',
        'WebContent/app/scripts/**/**/*.js',
        'WebContent/app/scripts/service/**/*.js',
        'WebContent/app/scripts/service/v1/api/service/*.js',
    ],

    plugins : ['karma-jasmine', 'karma-phantomjs-launcher', 'karma-ng-html2js-preprocessor', 'karma-coverage'],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'WebContent/app/views/directives/*.html': ['ng-html2js'],
      'WebContent/app/**/**/*.js': ['coverage'],
      'WebContent/app/**/*.js': ['coverage']
    },

    ngHtml2JsPreprocessor: {
      // strip app from the file path
      stripPrefix: 'WebContent/'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
