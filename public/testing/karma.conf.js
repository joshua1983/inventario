// Karma configuration
// Generated on Wed Sep 23 2015 11:19:08 GMT-0500 (Hora est. Pacífico, Sudamérica)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'E:/proyectos/inventario/public/testing',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [

     "../bower_components/jquery/dist/jquery.min.js", 
     {pattern: "../js/lib/require.js", include: false, served:true}, 
     "../bower_components/angular/angular.js", 
     "../bower_components/angular-route/angular-route.js", 
     "../bower_components/angular-resource/angular-resource.js", 
     "../bower_components/angular-mocks/angular-mocks.js", 
     "../bower_components/bootstrap/js/tooltip.js", 
     "../bower_components/bootstrap/js/popover.js", 
     "../js/lib/modernizr.js", 
     "../js/lib/angular-date-picker-polyfill.js", 
     "../js/lib/angular-ngAnimate.js", 
     "../js/i18n/angular-locale_es-es.js", 
     '../js/lib/textAngular-rangy.min.js', 
     '../js/lib/textAngular-sanitize.min.js', 
     '../js/lib/textAngular.min.js', 
     '../js/lib/ui-bootstrap-tpls-0.13.3.min.js', 
     '../js/lib/moment.js', 
     "../js/chart.js",
     "../js/angular-chart.js",
     "../js/angular-http-loader.js", 
     "../js/globales.js",
     "../js/admin.js",
     "../js/logs.js",
     "../js/main.js",
     "../js/app.js",  
     "../js/inf.js",
     "../js/ing.js",
     "../js/func.js",
     "../js/mod.js",
     "../js/conf.js",
     "../js/maincap.js",
      'app_test.js'
      
    ],


    // list of files to exclude
    exclude: [
        '../js/i18n/*.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
