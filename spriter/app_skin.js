(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'utf8-base64'])
        .config(config);

    config.$inject = ['$httpProvider'];
    function config($httpProvider ) {
        $httpProvider.defaults.headers.post[ 'Content-Type' ] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.transformRequest = function( data ) {
            return angular.isObject( data ) && String( data ) !== '[object File]' ? angular.toParam( data ) : data;
        };
    }

})();