/**
 * Created by cbjiang on 2017/2/22.
 */

(function() {
    'use strict';

    HMApp.factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$rootScope', '$q', '$location', '$localStorage', '$sessionStorage','SYSNAME','LOGINURL'];

    function authInterceptor ($rootScope, $q, $location, $localStorage, $sessionStorage,SYSNAME,LOGINURL) {
        var service = {
            request: request
        };

        return service;

        function request (config) {
            /*jshint camelcase: false */
            config.headers = config.headers || {};
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }else{
                window.location=$location.protocol()+'://'+$location.host()+':'+$location.port()+'/'+SYSNAME+'/'+LOGINURL;
            }
            return config;
        }
    }
})();
