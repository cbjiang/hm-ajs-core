/**
 * Created by cbjiang on 2017/2/24.
 */

var LoginApp = angular.module("LoginApp", [
    "ui.router",
    "ngSanitize",
    "ngStorage"
]);

LoginApp.directive( "ngDoLogin", [ '$location','AuthServer', function( $location,AuthServer ) {
    return {
        link: function( scope, element, attrs ) {
            if(element[0].tagName=='BUTTON'){
                element.bind( "click", function() {
                    doLogin();
                });
            }else if(element[0].tagName=='INPUT'){
                element.bind( "keydown", function(e) {
                    if(e.keyCode==13){
                        doLogin();
                    }
                });
            }
        }
    }

    function doLogin(){
        var username=$('[name="username"]').val();
        var password=$('[name="password"]').val();
        var rememberMe=$('[name="remember"]').prop('checked');
        AuthServer.login(username,password,rememberMe);
    }
}]);

LoginApp.directive( "ngKeyDownLogin", [ '$location','AuthServer', function( $location,AuthServer ) {
    return {
        link: function( scope, element, attrs ) {
            element.bind( "keydown", function(e) {
                if(e.keyCode==13){

                }
                var username=$('[name="username"]').val();
                var password=$('[name="password"]').val();
                var rememberMe=$('[name="remember"]').prop('checked');
                AuthServer.login(username,password,rememberMe);
            });
        }
    }
}]);

LoginApp.factory('AuthServer', function($http,$location, $localStorage, $sessionStorage, GATEWAYURL,SYSNAME,INDEXURL){
    var service = {
        login: login
    };

    return service;

    function login(username,password,rememberMe){
        $http({
            method:'POST',
            url:GATEWAYURL+'api/authenticate',
            params:{},
            data:{username:username,password:password,rememberMe:rememberMe},
        }).success(function(data,status,headers,config){
            console.log('success');
            var jwt=data['id_token'];
            if(jwt!=null){
                if(rememberMe){
                    $localStorage.authenticationToken = jwt;
                } else {
                    $sessionStorage.authenticationToken = jwt;
                }
                window.location=$location.protocol()+'://'+$location.host()+':'+$location.port()+'/'+SYSNAME+'/'+INDEXURL;
            }
        }).error(function(data,status,headers,config){
            console.log('error');
            $('#loginAlert').removeClass('hide')
        })
    }

});