(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'utf8-base64'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];
    function config($routeProvider, $locationProvider, $httpProvider ) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
            })

            .when('/battle', {
                controller: 'BattleController',
                templateUrl: 'battle/battle.view.html',
                controllerAs: 'vm'
            })

            .when('/preferences', {
                controller: 'PreferencesController',
                templateUrl: 'preferences/preferences.view.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/login' });

        $httpProvider.defaults.headers.post[ 'Content-Type' ] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.transformRequest = function( data ) {
            return angular.isObject( data ) && String( data ) !== '[object File]' ? angular.toParam( data ) : data;
        };
    }
/*
    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http', 'AuthenticationService', 'UserService'];
    function run($rootScope, $location, $cookieStore, $http, AuthenticationService, UserService) {*/
    run.$inject = ['$rootScope', 'UserService'];
    function run($rootScope, UserService) {

        $(document).off();

        UserService.RenewRootScopeUser();


        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            //console.log(1);
            $rootScope.connecting = false;

            UserService.RenewRootScopeUser();

        });
    }

})();