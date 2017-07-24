/**
 * Created by cbjiang on 2017/2/22.
 */

(function() {
    'use strict';

    angular.module("hm.appcore").factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$location','$localStorage','$sessionStorage','SYSNAME','LOGINURL','GATEWAYURL'];

    function authInterceptor ($location,$localStorage,$sessionStorage,SYSNAME,LOGINURL,GATEWAYURL) {
        var service = {
            request: request
        };

        return service;

        function request (config) {
            var get_without=[
                GATEWAYURL+'api/authenticate'
            ]

            var isWithout=false;
            switch (config.method){
                case 'GET':isWithout=get_without.indexOf(config.url)>=0?true:false;break;
            }
            if(!isWithout){
                config.headers = config.headers || {};
                console.log('do auth interceptor');
                var token = $localStorage.authenticationToken;
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }else{
                    doLogin();
                }
            }
            return config;
        }

        function doLogin(){
            console.log('doLogin');
            var params='';
            var host=getHost();
            if(host!=null && host!=''){
                params='?url='+host;
            }
            $localStorage.$reset();
            $sessionStorage.$reset();
            console.log('LOGINURL+params',LOGINURL+params);
            window.location=LOGINURL+params;
        }

        function getHost(){
            return encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/'+SYSNAME+'/#');
        }
    }
})();
