(function() {
    'use strict';

    angular.module("hm.appcore").factory('authExpiredInterceptor', authExpiredInterceptor);

    authExpiredInterceptor.$inject = ['$rootScope', '$q', '$injector', '$localStorage', '$sessionStorage'];

    function authExpiredInterceptor($rootScope, $q, $injector, $localStorage, $sessionStorage) {
        var service = {
            responseError: responseError
        };

        return service;

        function responseError(response) {
            if (response.status === 401) {
                delete $localStorage.authenticationToken;
                delete $sessionStorage.authenticationToken;
                delete $sessionStorage.userInfo;
                window.location.reload();
            }
            return $q.reject(response);
        }
    }
})();
