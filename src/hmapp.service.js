/**
 * Created by cbjiang on 2017/2/22.
 */

(function() {
    'use strict';

    angular.module("hm.appcore").service('hmappService', hmappService);

    hmappService.$inject = ['$http','$q','$sessionStorage','$localStorage','SYSCODE','GATEWAYURL'];

    function hmappService ($http,$q,$sessionStorage,$localStorage,SYSCODE,GATEWAYURL) {
        var service= {
            getSidebarInfo:getBar,
            getUserInfo:getUserInfo,
            changeMyPassword:changeMyPassword,
        };

        return service;

        function getBar(callback){
            if($sessionStorage.userInfo==null){
                getUserInfo().then(function(data){
                    $sessionStorage.userInfo=data;
                    getSidebarInfo(callback)
                })
            }else{
                getSidebarInfo(callback)
            }
        }

        function getSidebarInfo(callback){
            $http({
                method:'GET',
                url:GATEWAYURL+'hmmsuser/api/tb_users/queryMenu',
                params:{
                    loginId:$sessionStorage.userInfo.loginId,
                    sysKey:SYSCODE
                },
                data:{}
            }).success(function(data,status,headers,config){
                if(data.list.length==0){
                    $('.page-spinner-bar').removeClass('hide');
                    $('body').addClass('page-on-load');
                    toastr.error('您没有权限进入该系统!', '登陆失败')
                    delete $localStorage.authenticationToken;
                    delete $sessionStorage.authenticationToken;
                    delete $sessionStorage.userInfo;
                    setTimeout(function(){window.location.reload();},2000);
                }

                callback(data.list,status,headers,config);
            }).error(function(data,status,headers,config){
                callback(data,status,headers,config);
            })
        }

        function getUserInfo(){
            var deferred = $q.defer();
            $http({
                method:'GET',
                url:GATEWAYURL+'hmmsuser/api/tb_user',
                params:{},
                data:{}
            }).success(function(data,status,headers,config){
                deferred.resolve(data);
            }).error(function(data,status,headers,config){
                deferred.reject(data);
            })
            return deferred.promise;
        }

        function changeMyPassword(password){
            var deferred = $q.defer();
            $http({
                method:'GET',
                url:GATEWAYURL+'api/account/change_password',
                params:{},
                data:password
            }).success(function(data,status,headers,config){
                deferred.resolve(data);
            }).error(function(data,status,headers,config){
                deferred.reject(data);
            })
            return deferred.promise;
        }
    }
})();
