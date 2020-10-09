(function() {
    'use strict';

    // Bootstrap the app once
    angular.element(document).ready(function() {
        angular.bootstrap(document.body, ['landcoverportal']);
    });

    // All the dependencies come here
    angular.module('landcoverportal', ['ngSanitize', 'ngStorage'],
            function($interpolateProvider) {
                $interpolateProvider.startSymbol('[[');
                $interpolateProvider.endSymbol(']]');
            })

        .config(function($httpProvider) {
            $httpProvider.defaults.headers.common = {};
            $httpProvider.defaults.headers.post = {};
            $httpProvider.defaults.headers.put = {};
            $httpProvider.defaults.headers.patch = {};
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        });



})();
