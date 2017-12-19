(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;

        vm.loginMe = loginMe;
        vm.demoMe = demoMe;
        vm.window = 'default';

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();



        function loginMe() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.login, vm.password, function (response) {
                if (response.success) {
                    //AuthenticationService.SetCredentials(vm.login, vm.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };


        function demoMe() {
            vm.dataLoading = true;
            AuthenticationService.DemoLogin(vm.login, function (response) {
                if (response.success) {
                    //AuthenticationService.SetCredentials(vm.login, 'pasword');
                    $location.path('/battle');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
    }

})();
