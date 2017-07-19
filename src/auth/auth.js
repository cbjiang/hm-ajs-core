/**
 * Created by cbjiang on 2017/7/18.
 */

angular.module("hm.appcore").factory('auth',['$q','$http','$location','$localStorage','GATEWAYURL','LOGINURL','LOGOUTURL','SYSNAME',
function($q,$http,$location,$localStorage,GATEWAYURL,LOGINURL,LOGOUTURL,SYSNAME){

    return{
        saveToken:saveToken,
        doLogout:doLogout,
        doLogin:doLogin,
    }

    function saveToken(){
        console.log('loginWithUrlToken');
        var token = $location.search().token;
        console.log('token',token);
        if(token!=null && token!=''){
            $localStorage.authenticationToken=token;
        }
    }

    function doLogin(){
        console.log('doLogin');
        var params='';
        var host=getHost();
        if(host!=null && host!=''){
            params='?url='+host;
        }
        $localStorage.$reset();
        console.log('LOGINURL+params',LOGINURL+params);
        window.location=LOGINURL+params;
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

    function check(jwt){
        var deferred = $q.defer();
        $http({
            method:'GET',
            url:GATEWAYURL+'api/authenticate',
            responseType:'text',
            headers: {'Authorization':('Bearer '+jwt)},
            transformResponse:[function (data, headersGetter) {
                return data;
            }]
        }).success(function(response){
            deferred.resolve(response);
        }).error(function(response){
            deferred.reject(response);
        })
        return deferred.promise;
    }

}]);