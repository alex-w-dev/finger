(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = [ '$location','$http','$rootScope'];
    function UserService($location, $http, $rootScope) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetUser = GetUser;
        service.RenewRootScopeUser = RenewRootScopeUser;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;



        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/api/index.php?r=get_user').then(handleSuccess, handleError('Error getting user by username'));
        }


        function RenewRootScopeUser() {
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            service.GetUser()
                .then(function (user) {
                    if(user.success == false){
                        if(restrictedPage){
                            $location.path('/login');
                        }
                    }else if (user) {
                      $rootScope.user = user;
                    }
                });
        }

        function GetUser() {
            return $http.get('/api/index.php?r=get_user').then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
            return $http.post('/api/index.php?r=register_user', user).then(handleSuccess, handleError('Ошибка создания пользователя'));
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
