(function() {
    'use strict';

    angular.module("hm.appcore").factory('authExpiredInterceptor', authExpiredInterceptor);

    authExpiredInterceptor.$inject = ['$q','$location','$localStorage','LOGOUTURL','SYSNAME'];

    function authExpiredInterceptor( $q,$location,$localStorage,LOGOUTURL,SYSNAME) {
        var service = {
            responseError: responseError
        };

        return service;

        function responseError(response) {
            if (response.status === 401) {
                doLogout();
            }
            return $q.reject(response);
        }

        function doLogout(){
            var params='';
            var host=getHost();
            if(host!=null && host!=''){
                params='?url='+host;
            }
            $localStorage.$reset()
            window.location=LOGOUTURL+params;
        }

        function getHost(){
            return encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/'+SYSNAME+'/#');
        }
    }
})();
